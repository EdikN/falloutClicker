import { GameData as D } from './data.js';
import { GameState as S } from './state.js';
import { GameUI as UI } from './ui.js';
import { SoundManager } from './audio.js';
import { PlaygamaSDK } from './playgama.js';

const rng = () => Math.random();
const pick = arr => arr[Math.floor(rng() * arr.length)];
const totalDmg = () => {
  const st = S.get(), p = st.player;
  const isAdrenaline = st.adBoosts.adrenaline > Date.now();
  return (p.baseDmg + p.dmgBonus) * (isAdrenaline ? 1.5 : 1);
};

const weaponUnlock = id => {
  const st = S.get();
  if (st.weapons[id]) return UI.toast(UI.t('toast_already_have'));
  st.weapons[id] = true;
  switchWeapon(id);
};

const switchWeapon = id => {
  const st = S.get(), p = st.player, w = D.WEAPON_STATS[id];
  if (!w || !st.weapons[id]) return;
  p.dmgBonus = w.dmg;
  p.weaponId = id;
  p.weaponName = w.name_ru;
  p.isGun = w.isGun;
  p.atkCdMax = w.cd;
  p.atkCd = 0;
  UI.toast(UI.t('toast_weapon_equipped', UI.loc(w, 'name')));
  UI.renderTop();
};

const switchArmor = id => {
  const st = S.get(), p = st.player, a = D.ARMOR_STATS[id];
  if (!a || !st.armors[id]) return;
  const oldA = Object.values(D.ARMOR_STATS).find(x => x.name_ru === p.armorName || x.name_en === p.armorName || x.id === p.armorId);
  if (oldA) p.maxHp -= oldA.hp;
  p.armorId = id;
  p.armorName = a.name_ru;
  p.armorClass = a.armorClass;
  p.maxHp += a.hp;
  p.hp = Math.min(p.maxHp, p.hp);
  UI.toast(UI.t('toast_armor_equipped', UI.loc(a, 'name')));
  UI.renderTop();
  UI.renderMain();
};

const armorUnlock = id => {
  const st = S.get();
  st.armors[id] = true;
  switchArmor(id);
};

// --- СМЕРТЬ ---
const defeat = (reasonKey = 'defeat_reason_default') => {
  const st = S.get();
  st.dead = true;
  st.combat.active = false;
  const reason = UI.t(reasonKey);

  UI.show('#battleModal', false);
  UI.show('#encounterModal', false);
  UI.show('#storyModal', false);

  const defeatDaysEl = UI.$('#defeatDays');
  const defeatReasonEl = UI.$('#defeatReason');
  const defeatMsgEl = UI.$('#defeatMsg');

  if (defeatDaysEl) defeatDaysEl.textContent = UI.t('cycles_lived', st.day);
  if (defeatReasonEl) defeatReasonEl.textContent = `${UI.t('obj_status')} ${reason}`;

  const msgs = [
    UI.t('defeat_msg_1'),
    UI.t('defeat_msg_2'),
    UI.t('defeat_msg_3'),
    UI.t('defeat_msg_4'),
    UI.t('defeat_msg_5')
  ];
  if (defeatMsgEl) defeatMsgEl.textContent = `"${pick(msgs)}"`;

  UI.renderMain();
  UI.renderTop();
  UI.show('#defeatModal', true);

  // Показываем кнопку возрождения если доступно
  const reviveBtn = UI.$('#reviveBtn');
  if (reviveBtn) reviveBtn.style.display = st.reviveAvailable ? 'block' : 'none';

  // Показываем рекламу при гибели персонажа (если нет NoAds)
  if (PlaygamaSDK && !st.permanentBonuses.noAds) PlaygamaSDK.showInterstitial();

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
  localStorage.setItem('fallout_clicker_corpse', JSON.stringify(corpse));

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
      const note = pick(D.NOTES);
      UI.showDialogue({ speaker: UI.t('corpse_echo'), text: UI.loc(note, 'text') });
      st.nextNoteDay = st.day + 15 + Math.floor(rng() * 10);
      return true;
    }
    return false;
  }

  const speaker = UI.loc(event, 'speaker');
  const text = UI.loc(event, 'text');

  if (event.isFlag) {
    st.flags[event.flagKey] = true;
    UI.showDialogue({ speaker, text, img: event.img });
    return true;
  }

  if (event.isMemory) {
    UI.showDialogue({ speaker, text, img: event.img });
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
    UI.showDialogue({ speaker, text, img: event.img, choices: event.choices });
  }
  return true;
};

// === ОБРАБОТЧИКИ СЮЖЕТНЫХ ВЕТВЛЕНИЙ ===

const handleBarWoman = (event) => {
  const st = S.get();
  const negotiate = () => {
    if (rng() < 0.3) {
      UI.showDialogue({
        speaker: UI.loc(event, 'speaker'), img: event.img,
        text: UI.loc(event, 'branch_negotiate_success'),
        choices: [{ text: UI.t('btn_accept'), action: () => { applyReward({ food: 5, water: 5, ammo: 10 }); st.flags.paidBarWoman = false; } }]
      });
    } else {
      UI.showDialogue({ speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.t('bar_woman_negotiate_fail') });
    }
  };
  const pay = () => {
    if (st.resources.caps < 50) return UI.toast(UI.t('toast_not_enough_caps', 50));
    st.resources.caps -= 50;
    st.flags.paidBarWoman = true;
    UI.showDialogue({ speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'branch_pay') });
  };
  const fight = () => {
    st.flags.foughtBarWoman = true;
    const enemy = { name_ru: 'Вышибала из бара', name_en: 'Bar Bouncer', hp: 55, dmg: 10, atk: 3.5, img: 'img/enemy_scavenger.webp', icon: '[👊]' };
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.combat.onWin = () => {
      UI.showDialogue({ speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.t('bar_woman_fight_win') });
    };
    beginFight();
  };

  UI.showDialogue({
    speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'text'),
    choices: [
      { text: UI.t('bar_woman_negotiate_choice'), action: negotiate },
      { text: UI.t('bar_woman_pay_choice'), action: pay },
      { text: UI.t('bar_woman_fight_choice'), action: fight }
    ]
  });
};

const handleDrifterRescue = (event) => {
  const st = S.get();
  const saveHim = () => {
    const enemy = D.STORY_ENEMIES.drifter_enemy;
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.flags.savedDrifter = true;
    st.player.humanity = Math.min(100, st.player.humanity + 15);
    UI.toast(UI.t('toast_humanity', '+15'));
    st.combat.onWin = () => {
      UI.showDialogue({
        speaker: UI.t('drifter_echo'), speaker_en: 'DRIFTER', img: event.img,
        text: UI.loc(event, 'branch_save_success'),
        choices: [{ text: UI.t('btn_accept'), action: () => applyReward({ medkits: 2, ammo: 15, food: 3 }) }]
      });
    };
    beginFight();
  };
  const leaveHim = () => {
    st.flags.savedDrifter = false;
    st.player.humanity = Math.max(0, st.player.humanity - 15);
    UI.toast(UI.t('toast_humanity', '-15'));
    UI.showDialogue({
      speaker: UI.t('drifter_echo'), speaker_en: 'DRIFTER', img: event.img,
      text: UI.loc(event, 'branch_leave')
    });
  };

  UI.showDialogue({
    speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'text'),
    choices: [
      { text: UI.t('btn_fight'), action: saveHim },
      { text: UI.t('btn_flee'), action: leaveHim }
    ]
  });
};

const handleCartographer = (event) => {
  const st = S.get();
  st.flags.cartographerMet = true;
  const buyMap = () => {
    if (st.resources.caps < 50) return UI.toast(UI.t('toast_not_enough_caps', 50));
    st.resources.caps -= 50;
    UI.showDialogue({
      speaker: UI.loc(event, 'speaker'), img: event.img,
      text: UI.loc(event, 'branch_buy_map'),
      choices: [{ text: UI.t('btn_accept'), action: () => { st.flags.sector4Unlocked = true; UI.toast(UI.t('goal_2')); } }]
    });
  };
  const buyFile = () => {
    if (st.resources.caps < 120) return UI.toast(UI.t('toast_not_enough_caps', 120));
    st.resources.caps -= 120;
    const mem = D.MEMORY_FRAGMENTS[Math.floor(rng() * 5) + 2];
    UI.showDialogue({
      speaker: UI.loc(event, 'speaker'), img: event.img,
      text: `${UI.loc(event, 'branch_buy_file')}\n\n${UI.loc(mem, 'text')}`
    });
  };
  const buyCode = () => {
    if (st.resources.caps < 200) return UI.toast(UI.t('toast_not_enough_caps', 200));
    st.resources.caps -= 200;
    UI.showDialogue({
      speaker: UI.loc(event, 'speaker'), img: event.img,
      text: UI.loc(event, 'branch_buy_code'),
      choices: [{ text: UI.t('btn_accept'), action: () => { st.flags.bypassCode = true; UI.toast(UI.t('bypass_code_active')); } }]
    });
  };
  const leave = () => {
    UI.showDialogue({ speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'branch_leave') });
  };

  UI.showDialogue({
    speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'text'),
    choices: [
      { text: UI.t('carto_buy_map'), action: buyMap },
      { text: UI.t('carto_buy_file'), action: buyFile },
      { text: UI.t('carto_buy_code'), action: buyCode },
      { text: UI.t('btn_leave'), action: leave }
    ]
  });
};

const handleStoryCombat = (event) => {
  const st = S.get();
  const enemyData = D.STORY_ENEMIES[event.enemyId];
  let enemyHp = enemyData.hp;

  if (st.flags && st.flags.bypassCode) {
    enemyHp = Math.round(enemyHp * 0.7);
    st.flags.bypassCode = false;
    UI.toast(UI.t('bypass_code_active'));
  }

  st.combat.enemy = { ...enemyData, hp: enemyHp, maxHp: enemyHp };

  if (event.enemyId === 'amazon_weak') {
    st.combat.onWin = () => {
      UI.showDialogue({
        speaker: UI.loc(enemyData, 'name'), img: event.img,
        text: UI.loc(event, 'branch_win'),
        choices: [{ text: UI.t('btn_continue'), action: () => applyReward({ medkits: 2, ammo: 20 }) }]
      });
    };
  }
  else if (event.enemyId === 'amazon_full') {
    st.combat.onWin = () => handleAmazonChoice(event);
  }
  else if (event.enemyId === 'boss_technician') {
    st.combat.onWin = () => handleEnding();
  }

  UI.showDialogue({
    speaker: UI.loc(event, 'speaker'), img: event.img, text: UI.loc(event, 'text'),
    choices: [{ text: UI.t('btn_fight'), action: beginFight }]
  });
};

const handleAmazonChoice = (event) => {
  const st = S.get();
  const kill = () => {
    st.flags.mercyAmazon = false;
    st.flags.amazonImplant = true;
    st.player.humanity = Math.max(0, st.player.humanity - 20);
    st.player.armorClass = Math.min(0.9, (st.player.armorClass || 0) + 0.2);
    UI.toast(UI.t('toast_humanity', '-20'));
    UI.showDialogue({
      speaker: UI.t('intercept_data'), img: 'img/portrait_sys.webp',
      text: UI.loc(event, 'branch_kill')
    });
    S.save();
    UI.renderTop(); UI.renderMain();
  };
  const spare = () => {
    st.flags.mercyAmazon = true;
    st.player.humanity = Math.min(100, st.player.humanity + 20);
    UI.toast(UI.t('toast_humanity', '+20'));
    UI.showDialogue({
      speaker: UI.loc(enemyData, 'name'), img: event.img,
      text: UI.loc(event, 'branch_spare'),
      choices: [{ text: UI.t('btn_accept'), action: () => UI.toast(UI.t('mercy_amazon_companion')) }]
    });
    S.save();
  };

  const enemyData = D.STORY_ENEMIES[event.enemyId];
  UI.showDialogue({
    speaker: UI.loc(enemyData, 'name'), img: event.img,
    text: UI.loc(event, 'branch_post_fight'),
    choices: [
      { text: UI.t('btn_kill'), action: kill },
      { text: UI.t('btn_spare'), action: spare }
    ]
  });
};

const handleEnding = () => {
  const st = S.get();
  const flags = st.flags || {};
  const humanity = st.player.humanity;

  if (humanity < 20) {
    showEndingChoice(true);
    return;
  }

  if (flags.savedDrifter && flags.mercyAmazon && humanity >= 70) {
    showEnding({
      title: UI.t('ending_mercy_title'),
      text: UI.t('ending_mercy_text'),
      score: UI.t('ending_mercy_score', Math.round(humanity), st.day)
    });
  }
  else if (!flags.savedDrifter && !flags.mercyAmazon) {
    showEndingChoice(false);
  }
  else {
    showEnding({
      title: UI.t('ending_neutral_title'),
      text: UI.t('ending_neutral_text'),
      score: UI.t('ending_neutral_score', Math.round(humanity), st.day)
    });
  }
};

const showEndingChoice = (forced = false) => {
  const st = S.get();

  if (forced) {
    st.flags.endingReached = true;
    showEnding({
      title: UI.t('ending_bad_title'),
      text: UI.t('ending_bad_text'),
      score: UI.t('ending_bad_score', Math.round(st.player.humanity), st.day)
    });
    return;
  }

  UI.showDialogue({
    speaker: UI.loc(D.STORY_ENEMIES.boss_technician, 'name'), img: 'img/enemy_technician.webp',
    text: UI.loc(D.STORY_EVENTS.find(e => e.day === 365), 'branch_final_offer'), // I need to make sure this is in data.js
    choices: [
      {
        text: UI.t('btn_accept'), action: () => {
          st.flags.endingReached = true;
          showEnding({
            title: UI.t('ending_merge_title'),
            text: UI.t('ending_merge_text'),
            score: UI.t('ending_merge_score', st.day)
          });
        }
      },
      {
        text: UI.t('btn_confirm'), action: () => { // Confirm -> Reject/Destroy
          st.flags.endingReached = true;
          showEnding({
            title: UI.t('ending_reject_title'),
            text: UI.t('ending_reject_text'),
            score: UI.t('ending_reject_score', st.day)
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

const checkAdEvents = () => {
  if (!window.PlaygamaSDK || S.get().permanentBonuses.noAds) return false;
  const st = S.get();

  st.adBoosts.lastAdShownDay = st.adBoosts.lastAdShownDay || 0;
  st.adBoosts.lastDroneDay = st.adBoosts.lastDroneDay || 0;
  st.adBoosts.lastEmergencyDay = st.adBoosts.lastEmergencyDay || 0;
  st.adBoosts.lastAdrenalineDay = st.adBoosts.lastAdrenalineDay || 0;

  if (st.day - st.adBoosts.lastAdShownDay < 10) return false;

  if ((st.resources.food === 0 || st.resources.water === 0) && (st.day - st.adBoosts.lastDroneDay >= 25)) {
    if (rng() < 0.5) {
      st.adBoosts.lastDroneDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      UI.showDialogue({
        speaker: 'СИСТЕМА СНАБЖЕНИЯ', speaker_en: 'SUPPLY SYSTEM',
        text: 'ЗАМЕЧЕНА КРИТИЧЕСКАЯ НЕХВАТКА ПРИПАСОВ. ВАМ ДОСТУПЕН ДРОН СНАБЖЕНИЯ.',
        text_en: 'CRITICAL SUPPLY SHORTAGE DETECTED. SUPPLY DRONE AVAILABLE.',
        choices: [
          {
            text: UI.t('btn_airdrop') + ' 📺', action: () => {
              window.PlaygamaSDK.showRewarded('airdrop', () => {
                applyReward({ materials: 5, caps: 5, food: 3, water: 3, ammo: 10 });
                UI.toast(UI.t('toast_airdrop')); S.save(); UI.renderMain();
              });
            }
          },
          { text: UI.t('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  if ((st.player.hp / st.player.maxHp < 0.3) && (st.day - st.adBoosts.lastEmergencyDay >= 25)) {
    if (rng() < 0.5) {
      st.adBoosts.lastEmergencyDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      UI.showDialogue({
        speaker: 'МЕДИЦИНСКАЯ ПОДСИСТЕМА', speaker_en: 'MEDICAL SUBSYSTEM',
        text: 'КРИТИЧЕСКОЕ ПАДЕНИЕ ЖИЗНЕННЫХ ПОКАЗАТЕЛЕЙ. ПОЛУЧИТЬ АВАРИЙНЫЙ ПАЁК?',
        text_en: 'CRITICAL VITAL SIGNS DROP. RECEIVE EMERGENCY RATION?',
        choices: [
          {
            text: UI.t('btn_emergency') + ' 📺', action: () => {
              window.PlaygamaSDK.showRewarded('emergency_ration', () => {
                applyReward({ food: 6, water: 6 }); UI.toast(UI.t('toast_emergency')); S.save(); UI.renderMain();
              });
            }
          },
          { text: UI.t('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  if (st.day - st.adBoosts.lastAdrenalineDay >= 50) {
    if (rng() < 0.2) {
      st.adBoosts.lastAdrenalineDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      UI.showDialogue({
        speaker: 'СИСТЕМЫ УСИЛЕНИЯ', speaker_en: 'BOOST SYSTEMS',
        text: 'НАЙДЕН СТИМУЛЯТОР БОЕВОЙ АКТИВНОСТИ. АКТИВИРОВАТЬ АДРЕНАЛИН (+50% УРОНА НА 15 МИН)?',
        text_en: 'COMBAT STIMULANT FOUND. ACTIVATE ADRENALINE (+50% DAMAGE FOR 15 MIN)?',
        choices: [
          {
            text: UI.t('btn_adrenaline') + ' 📺', action: () => {
              window.PlaygamaSDK.showRewarded('adrenaline', () => {
                st.adBoosts.adrenaline = Date.now() + 900000;
                UI.toast(UI.t('toast_adrenaline')); UI.renderTop(); UI.renderMain(); S.save();
              });
            }
          },
          { text: UI.t('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  return false;
};

// --- ЕЖЕДНЕВНЫЕ РАСХОДЫ ---
const upkeep = () => {
  const st = S.get(), p = st.player;
  const consumption = st.permanentBonuses.cyberStomach ? 1 : 2;

  st.resources.food = Math.max(0, st.resources.food - consumption);
  st.resources.water = Math.max(0, st.resources.water - consumption);

  if (st.resources.food === 0) {
    p.hp -= 5; p.mood -= 5; UI.toast(UI.t('res_food_empty')); UI.triggerDamage();
    if (p.hp <= 0) { defeat(UI.t('defeat_starved')); return; }
  }
  if (st.resources.water === 0) {
    p.hp -= 8; p.mood -= 8; UI.toast(UI.t('res_water_empty')); UI.triggerDamage();
    if (p.hp <= 0) { defeat(UI.t('defeat_dehydrated')); return; }
  }
  p.mood = Math.max(0, p.mood - 1);
};

// --- СЛУЧАЙНЫЕ СОБЫТИЯ ---
const encounterRoll = () => {
  const st = S.get();
  const enemyChance = Math.min(.55, .20 + st.day * 0.005), roll = rng();

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

const renderMerchant = async () => {
  const st = S.get();

  UI.$('#merchantStock').innerHTML = `
    <div class="row" style="margin-bottom:1rem; border-bottom:1px solid var(--line);">
      <button class="pill active" id="tabItems">${UI.t('shop_items')}</button>
      <button class="pill" id="tabDirector">${UI.t('shop_director')}</button>
    </div>
    <div id="shopContent"></div>
  `;

  const content = UI.$('#shopContent');
  const tabItems = UI.$('#tabItems');
  const tabDirector = UI.$('#tabDirector');

  const catalog = window.PlaygamaSDK ? await window.PlaygamaSDK.getCatalog() : [];

  const showItems = () => {
    tabItems.classList.add('active');
    tabDirector.classList.remove('active');

    // Group items
    const groups = { resource: [], weapon: [], armor: [], upgrade: [] };
    D.SHOP_ITEMS.forEach((item, i) => {
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push({ ...item, i });
    });

    let html = '';
    const renderGroup = (arr, title) => {
      if (!arr || arr.length === 0) return;
      html += `<h3 style="margin-top:0.5rem;">${title}</h3>`;
      html += arr.map(item =>
        `<div class='shopItem'>
         <div>${UI.loc(item, 'label')}</div>
         <button class='btn good' data-buy='${item.i}'>${item.price} ${UI.t('credits').slice(0, 2).toUpperCase()}</button>
       </div>`
      ).join('');
    };

    renderGroup(groups.resource, `${UI.t('food')} / ${UI.t('water')} / ${UI.t('medkits')}`.toUpperCase());
    renderGroup(groups.weapon, UI.t('weapon').toUpperCase());
    renderGroup(groups.armor, 'БРОНЯ / ARMOR');
    renderGroup(groups.upgrade, 'УЛУЧШЕНИЯ / UPGRADES');

    content.innerHTML = html;

    content.querySelectorAll('[data-buy]').forEach(btn => btn.onclick = () => {
      const p = D.SHOP_ITEMS[+btn.dataset.buy];
      if (st.resources.caps < p.price) return UI.toast(UI.t('toast_not_enough_caps', p.price));
      st.resources.caps -= p.price;
      if (p.type === 'weapon') weaponUnlock(p.weaponId);
      else if (p.type === 'armor') armorUnlock(p.armorId); // if added
      else st.resources[p.key] = (st.resources[p.key] || 0) + p.amount;
      UI.toast(UI.t('toast_bought', UI.loc(p, 'label'))); S.save(); UI.renderTop(); UI.renderMain(); showItems();
    });
  };

  const showDirector = () => {
    tabItems.classList.remove('active');
    tabDirector.classList.add('active');
    content.innerHTML = `<div class="sub" style="margin-bottom:1rem;">${UI.t('shop_desc')}</div>`;

    const DEFAULT_ITEMS = [
      { id: 'no_ads', price: '99 GAM', name: 'БЕЗ РЕКЛАМЫ', desc: 'Убирает межстраничную рекламу.' },
      { id: 'starter_pack', price: '49 GAM', name: 'СТАРТОВЫЙ НАБОР', desc: 'Оружие + Ресурсы.' },
      { id: 'premium_caps', price: '29 GAM', name: '200 КРЕДИТОВ', desc: 'Мгновенное пополнение.' },
      { id: 'cyber_stomach', price: '59 GAM', name: 'КИБЕР-ЖЕЛУДОК', desc: '-50% расход еды/воды.' }
    ];

    const items = DEFAULT_ITEMS.map(item => {
      const catItem = catalog.find(c => c.id === item.id);
      if (catItem) {
        return {
          ...item,
          price: `${catItem.priceValue} ${catItem.priceCurrencyCode}`,
          name: catItem.title || item.name,
          desc: catItem.description || item.desc
        };
      }
      return item;
    });

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div>${item.name} <div class="sub">${item.desc}</div></div>
        <button class="btn good" style="min-width:80px;">${item.price}</button>
      `;
      div.querySelector('button').onclick = () => {
        window.PlaygamaSDK.buyProduct(item.id, () => applyPurchase(item.id), (err) => UI.toast(`${UI.t('purchase_error')}: ${err}`));
      };
      content.appendChild(div);
    });
  };

  tabItems.onclick = showItems;
  tabDirector.onclick = showDirector;
  showItems();
};

const renderCraft = () => {
  const st = S.get();
  const groups = { weapon: [], armor: [], upgrade: [], resource: [] };

  D.CRAFT_ITEMS.forEach((item, i) => {
    groups[item.type] = groups[item.type] || [];
    groups[item.type].push({ ...item, i });
  });

  let html = '';
  const renderGroup = (arr, title) => {
    if (!arr || arr.length === 0) return;
    html += `<h3 style="margin-top:0.5rem;">${title}</h3>`;
    html += arr.map(item => {
      const costStr = item.ammo > 0 ? `${UI.t('materials')}: ${item.materials} | ${UI.t('ammo')}: ${item.ammo}` : `${UI.t('materials')}: ${item.materials}`;
      return `<div class='shopItem'>
      <div>${UI.loc(item, 'label')}
        <div class='sub'>${UI.loc(item, 'desc')}</div>
        <div class='sub'>${UI.t('cost_label', costStr)}</div>
      </div>
      <button class='btn good' data-craft='${item.i}'>${UI.t('btn_create')}</button>
    </div>`;
    }).join('');
  };

  renderGroup(groups.weapon, UI.t('weapon').toUpperCase());
  renderGroup(groups.armor, 'БРОНЯ / ARMOR');
  renderGroup(groups.upgrade, 'УЛУЧШЕНИЯ / UPGRADES');
  renderGroup(groups.resource, `${UI.t('food')} / ${UI.t('water')} / ${UI.t('medkits')}`.toUpperCase());

  UI.$('#craftStock').innerHTML = html;

  UI.$('#craftStock').querySelectorAll('[data-craft]').forEach(btn => {
    btn.onclick = () => {
      const rec = D.CRAFT_ITEMS[+btn.dataset.craft];
      if (st.resources.materials < rec.materials) return UI.toast(UI.t('toast_not_enough_caps', rec.materials)); // Use appropriate message if we have mats equivalent
      if (rec.ammo > 0 && st.resources.ammo < rec.ammo) return UI.toast(UI.t('res_ammo_empty'));
      st.resources.materials -= rec.materials;
      if (rec.ammo) st.resources.ammo -= rec.ammo;
      if (rec.unlock) weaponUnlock(rec.unlock);
      if (rec.armorId) armorUnlock(rec.armorId);
      if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
      if (rec.healBoost) st.player.healPower = (st.player.healPower || 30) + rec.healBoost;
      UI.toast(UI.t('toast_crafted', UI.loc(rec, 'label'))); S.save(); UI.renderTop(); UI.renderMain(); renderCraft();
    };
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

  st.day++; st.phase = UI.t('status_exploring'); upkeep();
  SoundManager.play('click');
  if (st.player.hp <= 0) return;

  if (st.day % 10 === 0 && window.PlaygamaSDK && !st.permanentBonuses.noAds) {
    window.PlaygamaSDK.showInterstitial();
  }

  updateChapterTitle(st.day);
  UI.renderTop(); UI.renderMain();

  if (checkAdEvents()) return;
  if (checkStoryEvents()) return;

  const event = encounterRoll();

  if (event.type === 'corpse') {
    const corpse = event.corpse;
    localStorage.removeItem('fallout_clicker_corpse');
    st.player.humanity = Math.max(0, st.player.humanity - 5);
    UI.toast(UI.t('toast_humanity', '-5'));
    UI.showDialogue({
      speaker: UI.t('corpse_echo'),
      text: UI.t('corpse_desc', corpse.day, corpse.reason),
      choices: [{
        text: UI.t('btn_take_loot'), action: () => {
          applyReward(corpse.resources);
          UI.toast(UI.t('corpse_loot', corpse.resources.materials, corpse.resources.ammo, corpse.resources.caps));
        }
      }]
    });
  } else if (event.type === 'enemy') {
    st.encounter = event;
    const threat = event.enemy.threat;
    const threatLabel = threat < 25 ? UI.t('threat_weak') : threat < 60 ? UI.t('threat_medium') : threat < 120 ? UI.t('threat_dangerous') : UI.t('threat_deadly');
    UI.setEncounterCard({ icon: event.enemy.icon, title: UI.loc(event.enemy, 'name'), desc: UI.t('threat_level', threatLabel) + `\n${UI.t('btn_fight')}?`, img: event.enemy.img });
    UI.$('#encounterYes').textContent = UI.t('btn_fight'); UI.$('#encounterNo').textContent = UI.t('btn_flee');
    st.phase = UI.t('status_combat'); UI.show('#encounterModal', true);
  } else if (event.type === 'location') {
    if (event.location.moodCost) {
      st.player.mood = Math.max(0, st.player.mood - event.location.moodCost);
      UI.toast(`${UI.t('mood')} -${event.location.moodCost}`);
    }
    st.encounter = event;
    UI.setEncounterCard({ icon: event.location.icon, title: `${UI.loc(event.location, 'name')}`, desc: UI.loc(event.location, 'desc') });
    UI.$('#encounterYes').textContent = UI.t('btn_search'); UI.$('#encounterNo').textContent = UI.t('btn_ignore');
    st.phase = UI.t('status_exploring'); UI.show('#encounterModal', true);
  } else {
    applyReward({ materials: 2 + Math.floor(rng() * 3), caps: 1 + Math.floor(rng() * 2) });
    UI.toast(UI.t('day_calm'));
  }
  S.save();
};

const updateChapterTitle = (day) => {
  const el = UI.$('#currentGoal');
  if (el) {
    if (day < 30) el.textContent = UI.t('goal_1');
    else if (day < 80) el.textContent = UI.t('goal_2');
    else if (day < 145) el.textContent = UI.t('goal_3');
    else if (day < 210) el.textContent = UI.t('goal_4');
    else if (day < 300) el.textContent = UI.t('goal_5');
    else if (day < 365) el.textContent = UI.t('goal_6');
    else el.textContent = UI.t('goal_7');
  }
  const deathCountEl = UI.$('#deathCount');
  if (deathCountEl) {
    const deaths = localStorage.getItem('fallout_clicker_deaths') || '0';
    deathCountEl.textContent = UI.t('cycles', deaths);
  }
};

const beginFight = () => {
  const st = S.get(), c = st.combat; if (!c.enemy) return;
  UI.show('#encounterModal', false);
  Object.assign(c, { active: true, time: 0, enemyAtk: 1.5, cdDodge: 0, dodge: 0, lastTs: 0 });
  st.phase = UI.t('status_combat'); UI.show('#battleModal', true);
  SoundManager.play('success');
  tick(performance.now());
};

const finishFight = win => {
  const st = S.get(), c = st.combat; c.active = false; UI.show('#battleModal', false); st.phase = UI.t('status_exploring');

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
      c.lastReward = r;
      UI.$('#doubleRewardBtn').style.display = 'block';
      return `${UI.t('btn_accept').toUpperCase()}. ${UI.t('materials')}: +${r.materials}, ${UI.t('credits').slice(0, 2).toUpperCase()}: +${r.caps}`;
    })()
    : (() => {
      st.player.mood = Math.max(0, st.player.mood - 15);
      UI.$('#doubleRewardBtn').style.display = 'none';
      return `${UI.t('flee_msg')}\n${UI.t('flee_mood_lost')}`;
    })();
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
    if (c.dodge > 0) { UI.toast(UI.t('dodge_success')); }
    else {
      let dmg = e.dmg;
      if (p.armorClass) dmg = Math.round(dmg * (1 - p.armorClass));
      p.hp -= Math.max(1, dmg);
      p.mood = Math.max(0, p.mood - 1); UI.triggerDamage();
      if (p.hp <= 0) { defeat(`${UI.t('liquidated')}: ${UI.loc(e, 'name').toUpperCase()}`); return; }
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
  if (isGun && st.resources.ammo <= 0) return UI.toast(UI.t('res_ammo_empty'));
  p.atkCd = p.atkCdMax || 1;
  if (isGun) { st.resources.ammo--; SoundManager.play('shoot'); }
  else { SoundManager.play('punch'); }
  let dmg = totalDmg() + Math.floor(rng() * 4);
  const e = c.enemy;
  if (rng() < 0.1) { dmg = Math.round(dmg * 1.5); UI.toast(UI.t('crit_hit')); }
  if (e.armor) dmg = Math.round(dmg * (1 - e.armor));
  e.hp -= Math.max(1, dmg);
  UI.triggerEnemyHit(); UI.renderTop(); UI.renderBattle();
};

const actDodge = () => { const c = S.get().combat; if (c.cdDodge > 0) return; c.dodge = 1.5; c.cdDodge = 5; UI.renderBattle(); };

const actMed = () => {
  const st = S.get(); if (st.resources.medkits < 1) return UI.toast(UI.t('res_medkits_empty'));
  st.resources.medkits--;
  st.player.hp = Math.min(st.player.maxHp, st.player.hp + (st.player.healPower || 30));
  UI.toast(`+${st.player.healPower || 30} HP`); UI.renderTop(); UI.renderBattle();
};

/* ---------- ПРИВЯЗКА СОБЫТИЙ ---------- */
UI.$('#charBtn').onclick = startDay;
UI.$('#merchantBtn').onclick = async () => {
  await renderMerchant();
  UI.show('#merchantModal', true);
};
UI.$('#merchantClose').onclick = () => UI.show('#merchantModal', false);
UI.$('#equipBtn').onclick = () => { UI.renderEquipment(switchWeapon, switchArmor); UI.show('#equipModal', true); };
UI.$('#equipClose').onclick = () => UI.show('#equipModal', false);
UI.$('#craftBtn').onclick = () => { renderCraft(); UI.show('#craftModal', true); };
UI.$('#craftClose').onclick = () => UI.show('#craftModal', false);
UI.$('#storyOk').onclick = () => UI.show('#storyModal', false);

UI.$('#reviveBtn').onclick = () => {
  PlaygamaSDK.showRewarded('revive', () => {
    const st = S.get();
    if (!st.dead) return;
    st.dead = false; st.reviveAvailable = false;
    st.player.hp = Math.round(st.player.maxHp * 0.5);
    UI.show('#defeatModal', false);
    UI.toast(UI.t('btn_revive_sys'));
    UI.renderTop(); UI.renderMain(); S.save();
    if (st.combat.enemy) beginFight();
  });
};

UI.$('#doubleRewardBtn').onclick = () => {
  PlaygamaSDK.showRewarded('double_loot', () => {
    const r = S.get().combat.lastReward;
    if (r) { applyReward(r); UI.toast(UI.t('toast_loot_doubled')); UI.$('#doubleRewardBtn').style.display = 'none'; }
  });
};



UI.$('#encounterYes').onclick = () => {
  const st = S.get(), enc = st.encounter; if (!enc) return;
  if (enc.type === 'enemy') { st.combat.enemy = enc.enemy; st.encounter = null; beginFight(); }
  else {
    applyReward(enc.location.reward);
    st.combat.lastReward = enc.location.reward;
    st.encounter = null;
    UI.show('#encounterModal', false);
    S.save();
    UI.renderTop();
    UI.renderMain();

    let r = enc.location.reward;
    let rewardParts = [];
    if (r.materials) rewardParts.push(`${UI.t('materials')}: +${r.materials}`);
    if (r.caps) rewardParts.push(`${UI.t('credits').slice(0, 2).toUpperCase()}: +${r.caps}`);
    if (r.food) rewardParts.push(`${UI.t('food').toUpperCase()}: +${r.food}`);
    if (r.water) rewardParts.push(`${UI.t('water').toUpperCase()}: +${r.water}`);
    if (r.ammo) rewardParts.push(`${UI.t('ammo').toUpperCase()}: +${r.ammo}`);
    if (r.medkits) rewardParts.push(`${UI.t('medkits').toUpperCase()}: +${r.medkits}`);

    UI.$('#rewardText').textContent = `${UI.t('received_prefix')}\n${rewardParts.join(', ')}`;
    UI.$('#doubleRewardBtn').style.display = 'block';
    UI.show('#rewardModal', true);
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

const applyPurchase = (id) => {
  const st = S.get(); UI.toast(`${UI.t('purchase_activated')}: ${id.toUpperCase()}`);
  switch (id) {
    case 'no_ads': st.permanentBonuses.noAds = true; break;
    case 'cyber_stomach': st.permanentBonuses.cyberStomach = true; break;
    case 'dlc_sector7': st.permanentBonuses.dlcSector7 = true; break;
    case 'premium_caps': st.resources.caps += 200; break;
    case 'mega_pack': st.resources.caps += 500; st.resources.ammo += 15; st.resources.medkits += 5; break;
    case 'starter_pack': st.resources.caps += 50; applyReward({ food: 10, water: 10 }); weaponUnlock('pickaxe'); break;
    case 'iron_arsenal': weaponUnlock('shotgun'); st.resources.ammo += 30; break;
    case 'heavy_armor': armorUnlock('heavy'); break;
  }
  S.save(); UI.renderTop(); UI.renderMain();
};

UI.$('#newRun').onclick = () => {
  SoundManager.play('click'); S.set(S.fresh()); UI.show('#defeatModal', false); UI.renderTop(); UI.renderMain(); S.save(); UI.toast(UI.t('sys_init'));
};

UI.$('#res').addEventListener('click', e => {
  const btn = e.target.closest('[data-use]'); if (!btn) return;
  const type = btn.dataset.use, st = S.get(), p = st.player;
  if (st.resources[type] < 1) { SoundManager.play('error'); return UI.toast(UI.t('toast_no_items')); }
  st.resources[type]--; SoundManager.play('heal');
  if (type === 'food') { p.hp = Math.min(p.maxHp, p.hp + 6); p.mood = Math.min(p.maxMood, p.mood + 10); UI.toast(UI.t('toast_energy')); }
  if (type === 'water') { p.hp = Math.min(p.maxHp, p.hp + 4); p.mood = Math.min(p.maxMood, p.mood + 15); UI.toast(UI.t('toast_water')); }
  if (type === 'medkits') { const h = p.healPower || 30; p.hp = Math.min(p.maxHp, p.hp + h); UI.toast(UI.t('toast_healed', h)); }
  S.save(); UI.renderTop(); UI.renderMain();
});

UI.$('#muteBtn').onclick = () => {
  SoundManager.toggle(!SoundManager.isEnabled()); UI.$('#muteBtn').textContent = SoundManager.isEnabled() ? UI.t('sound_btn') : UI.t('sound_mute');
};

// --- ЗАПУСК ---
const initGame = () => {
  S.normalize();

  if (PlaygamaSDK) {
    PlaygamaSDK.checkPurchases((purchases) => purchases.forEach(p => applyPurchase(p.productId)));
  }

  updateChapterTitle(S.get().day);
  UI.renderTop();
  UI.renderMain();
  renderCraft();
  S.save();

  if (S.get().day === 1 && !S.get().initialized) {
    checkStoryEvents();
    const st = S.get();
    st.initialized = true;
    S.save();
  }

  // Сообщаем SDK что игра готова
  if (PlaygamaSDK) {
    PlaygamaSDK.gameReady();
    PlaygamaSDK.setGameplayState('start');
  }

  UI.applyLanguage();
  console.log('[Game] Инициализация завершена.');
};

// Загружаем состояние (теперь асинхронно через SDK)
S.load((success) => {
  if (!success) {
    S.set(S.fresh());
  }
  initGame();
});

export const Game = { applyReward, switchWeapon, switchArmor, weaponUnlock, armorUnlock };
