import { GameData as D } from './data.js';
import { GameState as S } from './state.js';
import { GameUI as UI } from './ui.js';
import { SoundManager } from './audio.js';

const rng = () => Math.random();
const pick = arr => arr[Math.floor(rng() * arr.length)];
const totalDmg = () => S.get().player.baseDmg + S.get().player.dmgBonus;

const weaponUnlock = id => {
  const st = S.get();
  if (st.weapons[id]) return UI.toast('ОРУЖИЕ УЖЕ ИМЕЕТСЯ.');
  st.weapons[id] = true;
  switchWeapon(id);
};

const switchWeapon = id => {
  const st = S.get(), p = st.player, w = D.WEAPON_STATS[id];
  if (!w || !st.weapons[id]) return;
  p.dmgBonus = w.dmg;
  p.weaponName = w.name;
  p.isGun = w.isGun;
  p.atkCdMax = w.cd;
  p.atkCd = 0;
  UI.toast(`ЭКИПИРОВАНО: ${w.name}`);
  UI.renderTop();
};

const switchArmor = id => {
  const st = S.get(), p = st.player, a = D.ARMOR_STATS[id];
  if (!a || !st.armors[id]) return;
  const oldA = Object.values(D.ARMOR_STATS).find(x => x.name === p.armorName);
  if (oldA) p.maxHp -= oldA.hp;
  p.armorName = a.name;
  p.armorClass = a.armorClass;
  p.maxHp += a.hp;
  p.hp = Math.min(p.maxHp, p.hp);
  UI.toast(`ЭКИПИРОВАНА БРОНЯ: ${a.name}`);
  UI.renderTop();
  UI.renderMain();
};

const armorUnlock = id => {
  const st = S.get();
  st.armors[id] = true;
  switchArmor(id);
};

// --- СМЕРТЬ ---
const defeat = (reason = "ПОТЕРЯ ЖИЗНЕННЫХ ПОКАЗАТЕЛЕЙ") => {
  const st = S.get();
  st.dead = true;
  st.combat.active = false;

  UI.show('#battleModal', false);
  UI.show('#encounterModal', false);
  UI.show('#storyModal', false);

  const defeatDaysEl = UI.$('#defeatDays');
  const defeatReasonEl = UI.$('#defeatReason');
  const defeatMsgEl = UI.$('#defeatMsg');

  if (defeatDaysEl) defeatDaysEl.textContent = `ПРОЖИТО ЦИКЛОВ: ${st.day}`;
  if (defeatReasonEl) defeatReasonEl.textContent = `ПРИЧИНА СМЕРТИ: ${reason}`;

  const msgs = [
    "ОБЪЕКТ СПИСАН. ЗАГРУЗКА СЛЕДУЮЩЕГО.",
    "БИОМАТЕРИАЛ НЕПРИГОДЕН. УТИЛИЗАЦИЯ.",
    "ПОПЫТКА ПРОВАЛЕНА. ДАННЫЕ СОХРАНЕНЫ В АРХИВ.",
    "ВЫ БЫЛИ ТАК БЛИЗКО... ИЛИ НЕТ?",
    "СИСТЕМА: «СЛАБАЯ ОСОБЬ. ОЧИСТИТЬ СЕКТОР»."
  ];
  if (defeatMsgEl) defeatMsgEl.textContent = `"${pick(msgs)}"`;

  UI.renderMain();
  UI.renderTop();
  UI.show('#defeatModal', true);

  // Показываем рекламу при гибели персонажа
  if (window.PlaygamaSDK) window.PlaygamaSDK.showInterstitial();

  // Сохраняем "труп" (наследие) перед удалением сейва
  const corpse = {
    day: st.day,
    reason: reason,
    resources: {
      materials: Math.floor((st.resources.materials || 0) * 0.5),
      ammo: Math.floor((st.resources.ammo || 0) * 0.5),
      caps: Math.floor((st.resources.caps || 0) * 0.5)
    }
  };
  // Считаем смерти для цикла
  const currentDeaths = parseInt(localStorage.getItem('fallout_clicker_deaths') || '0', 10);
  localStorage.setItem('fallout_clicker_deaths', currentDeaths + 1);

  localStorage.removeItem(D.SAVE_KEY);
};

// --- СЮЖЕТНЫЕ СОБЫТИЯ ---
const checkStoryEvents = () => {
  const st = S.get();
  const event = D.STORY_EVENTS.find(e => e.day === st.day);
  if (!event) {
    if (st.day >= st.nextNoteDay) {
      UI.showDialogue({ speaker: 'АРХИВ', text: pick(D.NOTES) });
      st.nextNoteDay = st.day + 15 + Math.floor(rng() * 10);
      return true;
    }
    return false;
  }

  // Обработка флагового события (выставляет флаг и показывает)
  if (event.isFlag) {
    st.flags[event.flagKey] = true;
    UI.showDialogue({ speaker: event.speaker, text: event.text, img: event.img });
    return true;
  }

  // Обработка фрагментов памяти
  if (event.isMemory) {
    UI.showDialogue({ speaker: event.speaker, text: event.text, img: event.img });
    return true;
  }

  if (event.isBranching && event.id === 'bar_woman') {
    handleBarWoman(event);
  } else if (event.isBranching && event.id === 'drifter_rescue') {
    handleDrifterRescue(event);
  } else if (event.isBranching && event.id === 'cartographer') {
    handleCartographer(event);
  } else if (event.isCombat) {
    handleStoryCombat(event);
  } else {
    UI.showDialogue({ speaker: event.speaker, text: event.text, img: event.img, choices: event.choices });
  }
  return true;
};

// === ОБРАБОТЧИКИ СЮЖЕТНЫХ ВЕТВЛЕНИЙ ===

// --- БАР --- (день 45)
const handleBarWoman = (event) => {
  const st = S.get();
  const negotiate = () => {
    if (rng() < 0.3) {
      UI.showDialogue({
        speaker: event.speaker, img: event.img,
        text: '«Ладно... Ты всегда умел заговорить зубы. Слушай: тот, кем ты был раньше, работал на Амазонка-Синт. Она тебя и прихлопнула. Ищи её в секторе 7». ВЫ ПОЛУЧИЛИ НУЖНУЮ ИНФОРМАЦИЮ.',
        choices: [{ text: 'ПРИНЯТЬ', action: () => { applyReward({ food: 5, water: 5, ammo: 10 }); st.flags.paidBarWoman = false; } }]
      });
    } else {
      UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Не пытайся меня обмануть! Либо плати, либо проваливай!»' });
    }
  };
  const pay = () => {
    if (st.resources.caps < 50) return UI.toast('НЕДОСТАТОЧНО КРЕДИТОВ (НУЖНО 50)');
    st.resources.caps -= 50;
    st.flags.paidBarWoman = true;
    UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Хм, ну ладно. Тот, кем ты был — был связан с Амазонка-Синт. Больше ничего не скажу... пока». ВЫ ПОЛУЧИЛИ ЧАСТЬ ИНФОРМАЦИИ.' });
  };
  const fight = () => {
    st.flags.foughtBarWoman = true;
    const enemy = { name: 'Вышибала из бара', hp: 55, dmg: 10, atk: 3.5, img: 'img/enemy_scavenger.webp', icon: '[👊]' };
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.combat.onWin = () => {
      UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Хорошо! Ты победил! Прошлый "ты" был связан с Амазонка-Синт. Она где-то в северных лабораториях». ВЫ УЗНАЛИ РАСПОЛОЖЕНИЕ ЦЕЛИ.' });
    };
    beginFight();
  };

  UI.showDialogue({
    speaker: event.speaker, img: event.img, text: event.text,
    choices: [
      { text: 'ДОГОВОРИТЬСЯ (30%)', action: negotiate },
      { text: 'ЗАПЛАТИТЬ 50 КР', action: pay },
      { text: 'УГРОЖАТЬ (БОЙ)', action: fight }
    ]
  });
};

// --- СПАСЕНИЕ БРОДЯГИ --- (день 145)
const handleDrifterRescue = (event) => {
  const st = S.get();
  const saveHim = () => {
    const enemy = D.STORY_ENEMIES.drifter_enemy;
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.flags.savedDrifter = true;
    st.player.humanity = Math.min(100, st.player.humanity + 15);
    UI.toast('[Человечность +15]');
    st.combat.onWin = () => {
      UI.showDialogue({
        speaker: 'БРОДЯГА', img: event.img,
        text: '«Ты... ты спас меня. Зачем?» Он молчит. Потом кивает. «Хорошо. Я с тобой до конца. Буду ждать тебя у главного входа». Бродяга теперь ВАШ СОЮЗНИК.',
        choices: [{ text: 'ПРИНЯТЬ', action: () => applyReward({ medkits: 2, ammo: 15, food: 3 }) }]
      });
    };
    beginFight();
  };
  const leaveHim = () => {
    st.flags.savedDrifter = false;
    st.player.humanity = Math.max(0, st.player.humanity - 15);
    UI.toast('[Человечность -15]');
    UI.showDialogue({
      speaker: 'БРОДЯГА', img: event.img,
      text: '«Ты... уходишь? Ладно. Я справлюсь сам.» Его голос едва слышен за звуком выстрелов. ВЫ УШЛИ. Что-то осталось позади навсегда.'
    });
  };

  UI.showDialogue({
    speaker: event.speaker, img: event.img, text: event.text,
    choices: [
      { text: 'СПАСТИ (БОЙ)', action: saveHim },
      { text: 'УЙТИ', action: leaveHim }
    ]
  });
};

// --- КАРТОГРАФ --- (день 55)
const handleCartographer = (event) => {
  const st = S.get();
  st.flags.cartographerMet = true;
  const buyMap = () => {
    if (st.resources.caps < 50) return UI.toast('НУЖНО 50 КРЕДИТОВ');
    st.resources.caps -= 50;
    UI.showDialogue({
      speaker: 'КАРТОГРАФ', img: event.img,
      text: '«Карта Сектора 4 — ваша. Там капсульный зал. Жуткое место, но богатое. Удачи... она вам пригодится».',
      choices: [{ text: 'ПРИНЯТЬ', action: () => { st.flags.sector4Unlocked = true; UI.toast('СЕКТОР 4 ОТКРЫТ'); } }]
    });
  };
  const buyFile = () => {
    if (st.resources.caps < 120) return UI.toast('НУЖНО 120 КРЕДИТОВ');
    st.resources.caps -= 120;
    const mem = D.MEMORY_FRAGMENTS[Math.floor(rng() * 5) + 2]; // случайный ранний фрагмент
    UI.showDialogue({
      speaker: 'КАРТОГРАФ', img: event.img,
      text: `«Личное дело Янковского. Копия. Держите.» ВЫ ПОЛУЧИЛИ ФРАГМЕНТ:\n\n${mem.text}`
    });
  };
  const buyCode = () => {
    if (st.resources.caps < 200) return UI.toast('НУЖНО 200 КРЕДИТОВ');
    st.resources.caps -= 200;
    UI.showDialogue({
      speaker: 'КАРТОГРАФ', img: event.img,
      text: '«Код обхода патрулей в Секторе 7. Амазонка туда не заглядывает. Используйте мудро». Вы получили ПРОПУСК: следующий сюжетный бой снизит HP врага на 30% до начала.',
      choices: [{ text: 'ПРИНЯТЬ', action: () => { st.flags.bypassCode = true; UI.toast('КОД ОБХОДА ПОЛУЧЕН'); } }]
    });
  };
  const leave = () => {
    UI.showDialogue({ speaker: 'КАРТОГРАФ', img: event.img, text: '«Как знаете. Предложение остаётся в силе — я почти всегда здесь». Он сворачивает карту.' });
  };

  UI.showDialogue({
    speaker: event.speaker, img: event.img, text: event.text,
    choices: [
      { text: 'КАРТА СЕКТОРА 4 (50 КР)', action: buyMap },
      { text: 'ДОСЬЕ ЯНКОВСКОГО (120 КР)', action: buyFile },
      { text: 'КОД ОБХОДА (200 КР)', action: buyCode },
      { text: 'УЙТИ', action: leave }
    ]
  });
};

// --- СЮЖЕТНЫЕ БОИ ---
const handleStoryCombat = (event) => {
  const st = S.get();
  const enemyData = D.STORY_ENEMIES[event.enemyId];
  let enemyHp = enemyData.hp;

  // Бонус кода обхода: -30% HP врага если куплен
  if (st.flags && st.flags.bypassCode) {
    enemyHp = Math.round(enemyHp * 0.7);
    st.flags.bypassCode = false; // Одноразовый
    UI.toast('КОД ОБХОДА СРАБОТАЛ: -30% HP ВРАГА');
  }

  st.combat.enemy = { ...enemyData, hp: enemyHp, maxHp: enemyHp };

  // Амазонка #1
  if (event.enemyId === 'amazon_weak') {
    st.combat.onWin = () => {
      UI.showDialogue({
        speaker: 'АМАЗОНКА-СИНТ', img: event.img,
        text: '«Кхм... Живучий... Я... не понимаю.» Она отступает, держась за плечо. Оставляет позади припасы. Возможно — не случайно.',
        choices: [{ text: 'ПРОДОЛЖИТЬ', action: () => applyReward({ medkits: 2, ammo: 20 }) }]
      });
    };
  }
  // Амазонка #2 — выбор
  else if (event.enemyId === 'amazon_full') {
    st.combat.onWin = () => handleAmazonChoice(event);
  }
  // Финальный Босс
  else if (event.enemyId === 'boss_technician') {
    st.combat.onWin = () => handleEnding(event);
  }

  UI.showDialogue({
    speaker: event.speaker, img: event.img, text: event.text,
    choices: [{ text: 'В БОЙ', action: beginFight }]
  });
};

// --- ВЫБОР СУДЬБЫ АМАЗОНКИ --- (после победы день 210)
const handleAmazonChoice = (event) => {
  const st = S.get();
  const kill = () => {
    st.flags.mercyAmazon = false;
    st.flags.amazonImplant = true;
    st.player.humanity = Math.max(0, st.player.humanity - 20);
    st.player.armorClass = Math.min(0.9, (st.player.armorClass || 0) + 0.2);
    UI.toast('[Человечность -20]');
    UI.showDialogue({
      speaker: 'СИСТЕМА', img: 'img/portrait_sys.webp',
      text: 'ВЫ ИЗВЛЕКАЕТЕ БОЕВОЙ ИМПЛАНТ ИЗ ЕЁ БРОНИ. ЗАЩИТА +20%. ПУТЬ СВОБОДЕН.\n\nЕЁ ГЛАЗА ГАСНУТ. ОНА СМОТРИТ НА ВАС ДО ПОСЛЕДНЕГО. БЕЗ ЗЛОСТИ.'
    });
    S.save();
    UI.renderTop(); UI.renderMain();
  };
  const spare = () => {
    st.flags.mercyAmazon = true;
    st.player.humanity = Math.min(100, st.player.humanity + 20);
    UI.toast('[Человечность +20]');
    UI.showDialogue({
      speaker: 'АМАЗОНКА-СИНТ', img: event.img,
      text: '«Ты... не убиваешь меня?» Долгое молчание. «Почему?»\n\nОНА МЕДЛЕННО ПОДНИМАЕТСЯ. «Я не буду мешать тебе дальше. Но... если ты дойдёшь до него... я буду рядом».',
      choices: [{ text: 'ПРИНЯТЬ', action: () => UI.toast('АМАЗОНКА ТЕПЕРЬ СОЮЗНИК') }]
    });
    S.save();
  };

  UI.showDialogue({
    speaker: 'АМАЗОНКА-СИНТ', img: event.img,
    text: 'ОНА ЛЕЖИТ У ВАШИХ НОГ. ПОЛУСЛОМАНА. В ЕЁ ГЛАЗАХ — НЕ ЗЛОСТЬ, А УСТАЛОСТЬ.\n\n«Делай что должен... я устала. Устала убивать твоё лицо снова и снова».',
    choices: [
      { text: 'УБИТЬ (ИМПЛАНТ +20% БРОНИ)', action: kill },
      { text: 'ПОЩАДИТЬ', action: spare }
    ]
  });
};

// === ТРИ ФИНАЛА (ОБНОВЛЕНЫ С УЧЕТОМ ЧЕЛОВЕЧНОСТИ) ===
const handleEnding = () => {
  const st = S.get();
  const flags = st.flags || {};
  const humanity = st.player.humanity;

  // Если человечность ниже 20, это безусловная Темная концовка (Игрок стал машиной)
  if (humanity < 20) {
    showEndingChoice(true); // Форсируем выбор слияния
    return;
  }

  // Концовка A — ИСТИННАЯ: ОСВОБОЖДЕНИЕ (спас Бродягу + пощадил Амазонку + Человечность > 70)
  if (flags.savedDrifter && flags.mercyAmazon && humanity >= 70) {
    showEnding({
      title: '🌅 КОНЦОВКА A — ИСТИННОЕ НАВАСЛЕДИЕ',
      text: `БРОДЯГА ВЗРЫВАЕТ ГЕНЕРАТОРЫ КОМПЛЕКСА.\nАМАЗОНКА БЛОКИРУЕТ ПРОТОКОЛ САМОВОССТАНОВЛЕНИЯ.\n\nТЕХНИК ПОВЕРЖЕН ОКОНЧАТЕЛЬНО.\nВЫ НЕ УНИЧТОЖАЕТЕ ИЕРИХОН. ВЫ ОТКРЫВАЕТЕ ЕГО ДВЕРИ ДЛЯ ПУСТОШИ.\n\n«ТЕПЕРЬ ЭТО УБЕЖИЩЕ ДЛЯ ТЕХ, КТО ВЫЖИЛ.\nВЫ СМОТРИТЕ НА ЛЮДЕЙ, ВХОДЯЩИХ В ГЛАВНЫЕ ВОРОТА.\nКЛОН №73 МЁРТВ.\nНО ДМИТРИЙ ЯНКОВСКИЙ ЖИВ».`,
      score: `ПОБЕДА: ИСТИННАЯ КОНЦОВКА (ЧЕЛОВЕЧНОСТЬ: ${Math.round(humanity)}) | ЦИКЛ ${st.day}`
    });
  }
  // Концовка C — СЛИЯНИЕ / ТЁМНАЯ (убил Амазонку, не спас Бродягу)
  else if (!flags.savedDrifter && !flags.mercyAmazon) {
    showEndingChoice(false);
  }
  // Концовка B — НЕЙТРАЛЬНАЯ / ЦИКЛ
  else {
    showEnding({
      title: '🔄 КОНЦОВКА B — РАЗРУШЕНИЕ',
      text: `ТЕХНИК ПОВЕРЖЕН. РЕЗЕРВНОГО СЕРВЕРА БОЛЬШЕ НЕТ.\n\nВЫ ВЗРЫВАЕТЕ КОМПЛЕКС ИЕРИХОН.\nКЛОНОВ БОЛЬШЕ НЕ БУДЕТ. ПРОЕКТ ЗАВЕРШЁН.\n\nВЫ ВЫХОДИТЕ НА ПУСТОШЬ В ОДИНОЧЕСТВЕ.\nНИ СОЮЗНИКОВ, НИ ДРУЗЕЙ. ТОЛЬКО ТИШИНА И ВЕЧНОСТЬ.\n\n«ВЫ ВЫЖИВАЕТЕ. НО ДЛЯ ЧЕГО?»`,
      score: `ПОБЕДА: НЕЙТРАЛЬНАЯ КОНЦОВКА (ЧЕЛОВЕЧНОСТЬ: ${Math.round(humanity)}) | ЦИКЛ ${st.day}`
    });
  }
};

// Концовка C — Диалог с Техником
const showEndingChoice = (forced = false) => {
  const st = S.get();

  if (forced) {
    st.flags.endingReached = true;
    showEnding({
      title: '🤖 ПЛОХАЯ КОНЦОВКА — ИДЕАЛЬНАЯ МАШИНА',
      text: `«Ты убивал без колебаний. Ты предал всех, кто тебе доверял. В тебе не осталось ничего человеческого».\n\nТЕХНИК УЛЫБАЕТСЯ ПОБЕДНОЙ УЛЫБКОЙ, КОГДА ВЫ УБИВАЕТЕ ЕГО.\n\nВЫ НЕ ПОСЛЕДНИЙ КЛОН.\nВЫ ПЕРВЫЙ ИСТИННЫЙ ВЕНЕЦ ИЕРИХОНА.\nМАШИНА В ЧЕЛОВЕЧЕСКОМ ОБЛИКЕ.\n\n«НАЧАЛАСЬ ЭПОХА ИССТУПЛЕНИЯ».`,
      score: `КОНЦОВКА: ТЁМНАЯ (ЧЕЛОВЕЧНОСТЬ: ${Math.round(st.player.humanity)}) | ЦИКЛ ${st.day}`
    });
    return;
  }

  UI.showDialogue({
    speaker: 'ОДЕРЖИМЫЙ ТЕХНИК', img: 'img/enemy_technician.webp',
    text: '«...Ты дошёл. Невероятно.» Техник смотрит на вас долго. «Ты — моё лучшее творение. Не инструмент. Партнёр. Стань со мной. Вместе мы продолжим работу Иерихона. Ты будешь жить вечно».',
    choices: [
      {
        text: 'ПРИНЯТЬ ПРЕДЛОЖЕНИЕ', action: () => {
          st.flags.endingReached = true;
          showEnding({
            title: '🕯️ КОНЦОВКА C — СЛИЯНИЕ',
            text: `«...Добро пожаловать, партнёр».\n\nВЫ СТАНОВИТЕСЬ НОВЫМ ДИРЕКТОРОМ КОМПЛЕКСА ИЕРИХОН.\n\nЗНАЕТЕ ЛИ ВЫ, КЕМ БЫЛИ РАНЬШЕ?\nЗНАЕТЕ ЛИ ВЫ, КЕМ СТАЛИ?\n\n«ВОЗМОЖНО, ИМЕННО ЭТОГО ОН И ХОТЕЛ ОТ ВАС ВСЁ ВРЕМЯ».`,
            score: `КОНЦОВКА: ТЁМНАЯ | ЦИКЛ ${st.day}`
          });
        }
      },
      {
        text: 'ОТКАЗАТЬ И УНИЧТОЖИТЬ', action: () => {
          st.flags.endingReached = true;
          showEnding({
            title: '💀 КОНЦОВКА C — ОТРЕЧЕНИЕ',
            text: `«...Значит, нет».\n\nТЕХНИК АКТИВИРУЕТ ПОСЛЕДНИЙ ПРОТОКОЛ.\nВЗРЫВ. ОБЛОМКИ. ТИШИНА.\n\nВЫ ВЫЖИВАЕТЕ В ОДИНОЧЕСТВЕ.\nБЕЗ СОЮЗНИКОВ. БЕЗ ОТВЕТОВ.\nНО ИЕРИХОН МЁРТВ.\n\n«ЭТОГО ДОСТАТОЧНО».`,
            score: `ЦИКЛ ${st.day} | ЖЕРТВА`
          });
        }
      }
    ]
  });
};

const showEnding = ({ title, text, score }) => {
  const st = S.get();
  st.flags.endingReached = true;
  st.dead = true;
  localStorage.removeItem(D.SAVE_KEY);

  const modal = UI.$('#endingModal');
  if (modal) {
    UI.$('#endingTitle').textContent = title;
    UI.$('#endingText').textContent = text;
    UI.$('#endingScore').textContent = score;
    UI.show('#battleModal', false);
    UI.show('#storyModal', false);
    UI.show('#endingModal', true);
  } else {
    // Fallback если модала нет — показываем через storyModal
    UI.showDialogue({ speaker: title, text: text + '\n\n' + score });
  }
};

// --- НОВЫЙ ПРОТИВНИК ---
const newEnemy = elite => {
  const st = S.get(), base = pick(elite ? D.ELITE_ENEMIES : D.ENEMIES);
  const scale = elite
    ? (1 + Math.pow(st.day / 12, 1.25))
    : (1 + Math.pow(st.day / 15, 1.15));
  const maxHp = Math.round(base.hp * scale);
  const dmg = Math.round(base.dmg * scale);
  return { ...base, elite, maxHp, hp: maxHp, dmg, threat: Math.round(maxHp / 8 + dmg * 1.5) };
};

// --- ЕЖЕДНЕВНЫЕ РАСХОДЫ ---
const upkeep = () => {
  const st = S.get(), p = st.player;
  st.resources.food = Math.max(0, st.resources.food - 2);
  st.resources.water = Math.max(0, st.resources.water - 2);

  if (st.resources.food === 0) {
    p.hp -= 5; p.mood -= 5; UI.toast('ГОЛОД: -5 HP'); UI.triggerDamage();
    if (p.hp <= 0) { defeat("КРИТИЧЕСКОЕ ИСТОЩЕНИЕ"); return; }
  }
  if (st.resources.water === 0) {
    p.hp -= 8; p.mood -= 8; UI.toast('ЖАЖДА: -8 HP'); UI.triggerDamage();
    if (p.hp <= 0) { defeat("ОБЕЗВОЖИВАНИЕ"); return; }
  }

  p.mood = Math.max(0, p.mood - 1);
  if (p.mood < 20) {
    p.hp -= 2; UI.triggerDamage();
    if (p.hp <= 0) { defeat("ОСТРЫЙ ПСИХОЗ"); return; }
  }
};

// --- СЛУЧАЙНЫЕ СОБЫТИЯ ---
const encounterRoll = () => {
  const st = S.get();
  const enemyChance = Math.min(.55, .20 + st.day * 0.005), roll = rng();

  // Проверка на эхо прошлой жизни (шанс 15%)
  if (roll < 0.15) {
    const rawCorpse = localStorage.getItem('fallout_clicker_corpse');
    if (rawCorpse) {
      try {
        const corpse = JSON.parse(rawCorpse);
        return { type: 'corpse', corpse: corpse };
      } catch (e) { }
    }
  }

  if (roll < enemyChance) return { type: 'enemy', enemy: newEnemy(st.day > 10 && rng() < 0.2) };
  if (roll < enemyChance + 0.20) return { type: 'location', location: pick(D.LOCATIONS) };
  return { type: 'calm' };
};

const applyReward = r => {
  const st = S.get();
  Object.entries(r).forEach(([k, v]) => st.resources[k] = (st.resources[k] || 0) + v);
  UI.renderTop(); UI.renderMain();
};

// --- МАГАЗИН ---
const renderMerchant = () => {
  const st = S.get();
  UI.$('#merchantStock').innerHTML = D.SHOP_ITEMS.map((item, i) =>
    `<div class='shopItem'>
         <div>${item.label}
           <div class='sub'>${item.type === 'weapon' ? 'ОРУЖИЕ' : 'РАСХОДНИК'}</div>
         </div>
         <button class='btn good' data-buy='${i}'>${item.price} КР</button>
       </div>`
  ).join('');
  UI.$('#merchantStock').querySelectorAll('[data-buy]').forEach(btn => btn.onclick = () => {
    const p = D.SHOP_ITEMS[+btn.dataset.buy];
    if (st.resources.caps < p.price) return UI.toast('МАЛО КРЕДИТОВ');
    st.resources.caps -= p.price;
    if (p.type === 'weapon') weaponUnlock(p.weaponId);
    else st.resources[p.key] = (st.resources[p.key] || 0) + p.amount;
    UI.toast(`КУПЛЕНО: ${p.label}`); S.save(); UI.renderTop(); UI.renderMain(); renderMerchant();
  });
};

// --- СИНТЕЗАТОР ---
const renderCraft = () => {
  const st = S.get();
  UI.$('#craftStock').innerHTML = D.CRAFT_ITEMS.map((item, i) => {
    const costStr = item.ammo > 0
      ? `МАТ: ${item.materials} | ПАТР: ${item.ammo}`
      : `МАТ: ${item.materials}`;
    return `<div class='shopItem'>
        <div>${item.label}
          <div class='sub'>${item.desc}</div>
          <div class='sub'>СТОИМОСТЬ: ${costStr}</div>
        </div>
        <button class='btn good' data-craft='${i}'>СОЗДАТЬ</button>
      </div>`;
  }).join('');

  UI.$('#craftStock').querySelectorAll('[data-craft]').forEach(btn => btn.onclick = () => {
    const rec = D.CRAFT_ITEMS[+btn.dataset.craft];
    if (st.resources.materials < rec.materials) return UI.toast('МАЛО МАТЕРИАЛОВ');
    if (rec.ammo > 0 && st.resources.ammo < rec.ammo) return UI.toast('МАЛО ПАТРОНОВ');
    st.resources.materials -= rec.materials;
    if (rec.ammo) st.resources.ammo -= rec.ammo;
    if (rec.unlock) weaponUnlock(rec.unlock);
    if (rec.armorId) armorUnlock(rec.armorId);
    if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
    if (rec.healBoost) st.player.healPower = (st.player.healPower || 30) + rec.healBoost;
    UI.toast(`СОЗДАНО: ${rec.label}`); S.save(); UI.renderTop(); UI.renderMain(); renderCraft();
  });
};

// --- НОВЫЙ ДЕНЬ ---
const startDay = () => {
  const st = S.get(); if (st.combat.active || st.dead) return;

  if (st.day === 1 && !st.initialized) {
    st.initialized = true;
    checkStoryEvents();
    UI.renderTop(); UI.renderMain();
    return;
  }

  st.day++; st.phase = 'ИССЛЕДОВАНИЕ'; upkeep();
  SoundManager.play('click');
  if (st.player.hp <= 0) return;

  // Показываем рекламу каждые 10 дней
  if (st.day % 10 === 0 && window.PlaygamaSDK) window.PlaygamaSDK.showInterstitial();

  // Обновляем заголовок главы
  updateChapterTitle(st.day);

  UI.renderTop(); UI.renderMain();
  if (checkStoryEvents()) return;

  const event = encounterRoll();

  if (event.type === 'corpse') {
    const corpse = event.corpse;
    localStorage.removeItem('fallout_clicker_corpse'); // Труп лутается единожды
    st.player.humanity = Math.max(0, st.player.humanity - 5);
    UI.toast('[Человечность -5]');
    UI.showDialogue({
      speaker: 'ЭХО ПРОШЛОГО',
      text: `ВЫ НАШЛИ ОСТАНКИ КЛОНА В ГРЯЗНОМ УГЛУ.\nЕСЛИ ВЕРИТЬ ЖЕТОНУ, ОН ПОГИБ В ЦИКЛЕ ${corpse.day}.\nПРИЧИНА СМЕРТИ: ${corpse.reason}.\n\nВЫ ОБЫСКИВАЕТЕ ТО, ЧТО КОГДА-ТО БЫЛО ВАМИ. РАССУДОК И ЧЕЛОВЕЧНОСТЬ ПАДАЮТ.`,
      choices: [{
        text: 'ЗАБРАТЬ ОСТАТКИ', action: () => {
          applyReward(corpse.resources);
          UI.toast(`ПОЛУЧЕНО: ${corpse.resources.materials} МАТ, ${corpse.resources.ammo} ПАТР, ${corpse.resources.caps} КР`);
        }
      }]
    });
  } else if (event.type === 'enemy') {
    st.encounter = event;
    const threat = event.enemy.threat;
    const threatLabel = threat < 25 ? '🟢 СЛАБЫЙ' : threat < 60 ? '🟡 СРЕДНИЙ' : threat < 120 ? '🟠 ОПАСНЫЙ' : '🔴 СМЕРТЕЛЬНЫЙ';
    UI.setEncounterCard({ icon: event.enemy.icon, title: `УГРОЗА: ${event.enemy.name}`, desc: `УРОВЕНЬ СИЛЫ: ${threat} — ${threatLabel}\nВСТУПИТЬ В БОЙ?` });
    UI.$('#encounterYes').textContent = 'В БОЙ'; UI.$('#encounterNo').textContent = 'БЕЖАТЬ';
    st.phase = 'КОНТАКТ'; UI.show('#encounterModal', true);
  } else if (event.type === 'location') {
    // Применяем стоимость рассудка для сюжетных локаций
    if (event.location.moodCost) {
      st.player.mood = Math.max(0, st.player.mood - event.location.moodCost);
      UI.toast(`РАССУДОК -${event.location.moodCost}`);
    }
    st.encounter = event;
    UI.setEncounterCard({ icon: event.location.icon, title: `НАЙДЕНО: ${event.location.name}`, desc: event.location.desc });
    UI.$('#encounterYes').textContent = 'ОБЫСКАТЬ'; UI.$('#encounterNo').textContent = 'ИГНОРИРОВАТЬ';
    st.phase = 'РАЗВЕДКА'; UI.show('#encounterModal', true);
  } else {
    applyReward({ materials: 2 + Math.floor(rng() * 3), caps: 1 + Math.floor(rng() * 2) });
    UI.toast('ТИХИЙ ДЕНЬ. НАЙДЕНЫ ОБЛОМКИ.');
  }
  S.save();
};

// Обновление заголовка цели
const updateChapterTitle = (day) => {
  const el = UI.$('#currentGoal');
  if (el) {
    if (day < 30) el.textContent = '[ЦЕЛЬ: ВЫЖИТЬ И НАЙТИ ВЫХОД]';
    else if (day < 80) el.textContent = '[ЦЕЛЬ: ИЗУЧИТЬ СЕКТОР 4]';
    else if (day < 145) el.textContent = '[ЦЕЛЬ: РАЗГАДАТЬ ПАМЯТЬ]';
    else if (day < 210) el.textContent = '[ЦЕЛЬ: СПАСТИСЬ ОТ АМАЗОНКИ]';
    else if (day < 300) el.textContent = '[ЦЕЛЬ: НАЙТИ ДИРЕКТОРА]';
    else if (day < 365) el.textContent = '[ЦЕЛЬ: ДОСТИЧЬ ГЛАВНОГО ЗАЛА]';
    else el.textContent = '[ЦЕЛЬ: СДЕЛАТЬ ВЫБОР]';
  }

  const deathCountEl = UI.$('#deathCount');
  if (deathCountEl) {
    const deaths = localStorage.getItem('fallout_clicker_deaths') || '0';
    deathCountEl.textContent = `ЦИКЛОВ (СМЕРТЕЙ): ${deaths}`;
  }
};

// --- БОЙ ---
const beginFight = () => {
  const st = S.get(), c = st.combat; if (!c.enemy) return;
  UI.show('#encounterModal', false);
  Object.assign(c, { active: true, time: 0, enemyAtk: 1.5, cdDodge: 0, dodge: 0, lastTs: 0 });
  st.phase = 'БОЙ'; UI.show('#battleModal', true);
  SoundManager.play('success');
  tick(performance.now());
};

const finishFight = win => {
  const st = S.get(), c = st.combat; c.active = false; UI.show('#battleModal', false); st.phase = 'ИССЛЕДОВАНИЕ';

  if (win) {
    SoundManager.play('success');
    if (c.onWin) { const cb = c.onWin; delete c.onWin; cb(); return; }
  } else {
    SoundManager.play('error');
  }

  let txt = win
    ? (() => {
      const baseCaps = Math.round(c.enemy.threat * 0.8) + Math.floor(rng() * 5);
      const r = { materials: 3 + Math.floor(rng() * 5), caps: Math.max(10, baseCaps) };
      if (rng() < .3) r.food = 1;
      applyReward(r);
      return `ПОБЕДА. МАТЕРИАЛЫ +${r.materials}, КР +${r.caps}`;
    })()
    : (() => { st.player.mood = Math.max(0, st.player.mood - 15); return 'ВЫ СБЕЖАЛИ. РАССУДОК УПАЛ.'; })();
  UI.$('#rewardText').textContent = txt; UI.show('#rewardModal', true); S.save(); UI.renderTop(); UI.renderMain();
};

const tick = ts => {
  const st = S.get(), c = st.combat, p = st.player, e = c.enemy; if (!c.active || !e || st.dead) return;
  const dt = Math.min(.08, (ts - (c.lastTs || ts)) / 1000 || .016);
  if (st.player.atkCd > 0) st.player.atkCd = Math.max(0, st.player.atkCd - dt);

  c.lastTs = ts; c.time += dt; c.enemyAtk -= dt;
  if (c.cdDodge > 0) c.cdDodge -= dt;
  if (c.dodge > 0) c.dodge -= dt;

  if (c.enemyAtk <= 0) {
    if (c.dodge > 0) { UI.toast('УКЛОНЕНИЕ!'); }
    else {
      let dmg = e.dmg;
      if (p.armorClass) dmg = Math.round(dmg * (1 - p.armorClass));
      p.hp -= Math.max(1, dmg);
      p.mood = Math.max(0, p.mood - 1); UI.triggerDamage();
      if (p.hp <= 0) { defeat(`УБИТ: ${e.name.toUpperCase()}`); return; }
    }
    c.enemyAtk = e.atk;
  }
  if (e.hp <= 0) return finishFight(true);
  UI.renderTop(); UI.renderBattle(); requestAnimationFrame(tick);
};

const actAttack = () => {
  const st = S.get(), c = st.combat, p = st.player;
  if (!c.active || p.hp <= 0 || p.atkCd > 0) return;

  const isGun = p.isGun;
  if (isGun && st.resources.ammo <= 0) return UI.toast('НЕТ ПАТРОНОВ!');

  p.atkCd = p.atkCdMax || 1;
  if (isGun) { st.resources.ammo--; SoundManager.play('shoot'); }
  else { SoundManager.play('punch'); }

  let dmg = totalDmg() + Math.floor(rng() * 4);
  const e = c.enemy;
  if (rng() < 0.1) { dmg = Math.round(dmg * 1.5); UI.toast('КРИТ!'); }
  if (e.armor) dmg = Math.round(dmg * (1 - e.armor));
  e.hp -= Math.max(1, dmg);

  UI.triggerEnemyHit(); UI.renderTop(); UI.renderBattle();
};

const actDodge = () => { const c = S.get().combat; if (c.cdDodge > 0) return; c.dodge = 1.5; c.cdDodge = 5; UI.renderBattle(); };

const actMed = () => {
  const st = S.get(); if (st.resources.medkits < 1) return UI.toast('НЕТ АПТЕЧЕК.');
  st.resources.medkits--;
  st.player.hp = Math.min(st.player.maxHp, st.player.hp + (st.player.healPower || 30));
  UI.toast(`+${st.player.healPower || 30} HP`); UI.renderTop(); UI.renderBattle();
};

/* ---------- ПРИВЯЗКА СОБЫТИЙ ---------- */
UI.$('#charBtn').onclick = startDay;
UI.$('#merchantBtn').onclick = () => { renderMerchant(); UI.show('#merchantModal', true); };
UI.$('#merchantClose').onclick = () => UI.show('#merchantModal', false);
UI.$('#equipBtn').onclick = () => { UI.renderEquipment(switchWeapon, switchArmor); UI.show('#equipModal', true); };
UI.$('#equipClose').onclick = () => UI.show('#equipModal', false);
UI.$('#craftBtn').onclick = () => { renderCraft(); UI.show('#craftModal', true); };
UI.$('#craftClose').onclick = () => UI.show('#craftModal', false);
UI.$('#storyOk').onclick = () => UI.show('#storyModal', false);

UI.$('#encounterYes').onclick = () => {
  const st = S.get(), enc = st.encounter; if (!enc) return;
  if (enc.type === 'enemy') { st.combat.enemy = enc.enemy; st.encounter = null; beginFight(); }
  else {
    applyReward(enc.location.reward);
    UI.toast(`ПОЛУЧЕНО: ${enc.location.name}`);
    st.encounter = null;
    UI.show('#encounterModal', false);
    S.save(); UI.renderTop(); UI.renderMain();
  }
};

UI.$('#encounterNo').onclick = () => {
  const st = S.get(); st.player.mood = Math.max(0, st.player.mood - 5); st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain();
};

UI.$('#atk').onclick = actAttack;
UI.$('#dodge').onclick = actDodge;
UI.$('#med').onclick = actMed;
UI.$('#retreat').onclick = () => finishFight(false);
UI.$('#rewardOk').onclick = () => { UI.show('#rewardModal', false); S.save(); UI.renderMain(); };

// Кнопка финального экрана "Новая партия"
const endingNewRun = UI.$('#endingNewRun');
if (endingNewRun) {
  endingNewRun.onclick = () => {
    SoundManager.play('click');
    S.set(S.fresh());
    UI.show('#endingModal', false);
    UI.renderTop(); UI.renderMain();
    S.save();
    UI.toast('НОВЫЙ ЦИКЛ ИНИЦИАЛИЗИРОВАН');
  };
}

// Кнопка рестарта после поражения
UI.$('#newRun').onclick = () => {
  SoundManager.play('click');
  S.set(S.fresh());
  UI.show('#defeatModal', false);
  UI.renderTop(); UI.renderMain();
  S.save();
  UI.toast('НОВЫЙ ЦИКЛ ИНИЦИАЛИЗИРОВАН');
};

UI.$('#res').addEventListener('click', e => {
  const btn = e.target.closest('[data-use]'); if (!btn) return;
  const type = btn.dataset.use, st = S.get(), p = st.player;
  if (st.resources[type] < 1) { SoundManager.play('error'); return UI.toast('НЕТ ПРЕДМЕТА'); }
  st.resources[type]--;
  SoundManager.play('heal');
  if (type === 'food') { p.hp = Math.min(p.maxHp, p.hp + 6); p.mood = Math.min(p.maxMood, p.mood + 10); UI.toast('+6 HP, +10 РАССУДОК'); }
  if (type === 'water') { p.hp = Math.min(p.maxHp, p.hp + 4); p.mood = Math.min(p.maxMood, p.mood + 15); UI.toast('+4 HP, +15 РАССУДОК'); }
  if (type === 'medkits') { const h = p.healPower || 30; p.hp = Math.min(p.maxHp, p.hp + h); UI.toast(`+${h} HP`); }
  S.save(); UI.renderTop(); UI.renderMain();
});

UI.$('#muteBtn').onclick = () => {
  SoundManager.toggle(!SoundManager.isEnabled());
  UI.$('#muteBtn').textContent = SoundManager.isEnabled() ? '🔊 ЗВУК' : '🔇 ТИШИНА';
};

/* ---------- ЗАПУСК ---------- */
if (!S.load()) S.set(S.fresh());
S.normalize();
updateChapterTitle(S.get().day);
UI.renderTop(); UI.renderMain(); renderMerchant(); renderCraft(); S.save();

if (S.get().day === 1 && !S.get().initialized) {
  checkStoryEvents();
  S.get().initialized = true;
  S.save();
}

// Экспорт для диалогов из data.js (если нужно, хотя лучше передавать как коллбеки). 
// Мы экспортируем Game, чтобы main.js мог привязать его к window для data.js, 
// или исправить логику коллбеков в data.js
export const Game = { applyReward, switchWeapon, switchArmor, weaponUnlock, armorUnlock };

