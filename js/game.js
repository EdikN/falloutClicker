import { GameData } from './data.js';
import { GameState } from './state.js';
import { SoundManager } from './audio.js';
import { PlaygamaSDK } from './playgama.js';
import { EventEmitter as Events } from './events.js';
import { translate as translate, loc, translateError } from './locales.js';
import { GameUI } from './ui.js';

const rng = () => Math.random();
const pick = arr => arr[Math.floor(rng() * arr.length)];
const totalDmg = () => {
  const st = GameState.get(), p = st.player;
  const isAdrenaline = st.adBoosts.adrenaline > Date.now();
  return (p.baseDmg + p.dmgBonus) * (isAdrenaline ? 1.5 : 1);
};

const weaponUnlock = id => {
  const st = GameState.get();
  if (st.weapons[id]) return Events.emit('ui:toast', translate('toast_already_have'));
  st.weapons[id] = true;
  switchWeapon(id);
};

const switchWeapon = id => {
  const st = GameState.get(), p = st.player, w = GameData.WEAPON_STATS[id];
  if (!w || !st.weapons[id]) return;
  p.dmgBonus = w.dmg;
  p.weaponId = id;
  p.weaponName = w.name_ru;
  p.isGun = w.isGun;
  p.atkCdMax = w.cd;
  p.atkCd = 0;
  Events.emit('ui:toast', translate('toast_weapon_equipped', loc(w, 'name')));
  Events.emit('ui:renderTop');
};

const switchArmor = id => {
  const st = GameState.get(), p = st.player, a = GameData.ARMOR_STATS[id];
  if (!a || !st.armors[id]) return;
  // Bug 8 fix: use armorId directly instead of fragile name lookup
  const oldA = GameData.ARMOR_STATS[p.armorId];
  if (oldA) p.maxHp -= oldA.hp;
  p.armorId = id;
  p.armorName = a.name_ru;
  p.armorClass = a.armorClass;
  p.maxHp += a.hp;
  p.hp = Math.min(p.maxHp, p.hp);
  Events.emit('ui:toast', translate('toast_armor_equipped', loc(a, 'name')));
  Events.emit('ui:renderTop');
  Events.emit('ui:renderMain');
};

const armorUnlock = id => {
  const st = GameState.get();
  st.armors[id] = true;
  switchArmor(id);
};

// --- СМЕРТЬ ---
const defeat = (reasonKey = 'defeat_reason_default') => {
  const st = GameState.get();
  st.dead = true;
  st.combat.active = false;
  const reason = translate(reasonKey);

  // Bug 3 fix: save revival info BEFORE resetting state
  const reviveAvailable = st.reviveAvailable;
  const savedEnemy = st.combat.enemy ? { ...st.combat.enemy } : null;

  // Bug 4 fix: play death sound
  SoundManager.play('error');

  Events.emit('ui:defeat', {
    reason: reason,
    day: st.day,
    reviveAvailable: reviveAvailable,
    savedEnemy: savedEnemy
  });

  if (PlaygamaSDK && !st.permanentBonuses.noAds) PlaygamaSDK.showInterstitial();

  const corpse = {
    day: st.day,
    reason: reason,
    resources: {
      materials: Math.floor((st.resources.materials || 0) * 0.5),
      ammo: Math.floor((st.resources.ammo || 0) * 0.5),
      caps: Math.floor((st.resources.caps || 0) * 0.5)
    }
  };
  GameState.getMeta().corpse = corpse;
  GameState.getMeta().deaths = (GameState.getMeta().deaths || 0) + 1;
  GameState.set(GameState.fresh());
  // Bug 3 fix: restore revival state into fresh state
  GameState.get().reviveAvailable = reviveAvailable;
  if (savedEnemy) GameState.get().combat.enemy = savedEnemy;
  GameState.save();
};

// --- СЮЖЕТНЫЕ СОБЫТИЯ ---
const checkStoryEvents = () => {
  const st = GameState.get();
  const event = GameData.STORY_EVENTS.find(e => e.day === st.day);
  if (!event) {
    if (st.day >= st.nextNoteDay) {
      const note = pick(GameData.NOTES);
      Events.emit('ui:showDialogue', { speaker: translate('corpse_echo'), text: loc(note, 'text') });
      st.nextNoteDay = st.day + 15 + Math.floor(rng() * 10);
      return true;
    }
    return false;
  }

  const speaker = loc(event, 'speaker');
  const text = loc(event, 'text');

  if (event.isFlag) {
    st.flags[event.flagKey] = true;
    Events.emit('ui:showDialogue', { speaker, text, img: event.img });
    return true;
  }

  if (event.isMemory) {
    Events.emit('ui:showDialogue', { speaker, text, img: event.img });
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
    Events.emit('ui:showDialogue', { speaker, text, img: event.img, choices: event.choices });
  }
  return true;
};

// === ОБРАБОТЧИКИ СЮЖЕТНЫХ ВЕТВЛЕНИЙ ===

const handleBarWoman = (event) => {
  const st = GameState.get();
  const negotiate = () => {
    if (rng() < 0.3) {
      Events.emit('ui:showDialogue', {
        speaker: loc(event, 'speaker'), img: event.img,
        text: loc(event, 'branch_negotiate_success'),
        choices: [{ text: translate('btn_accept'), action: () => { applyReward({ food: 5, water: 5, ammo: 10 }); st.flags.paidBarWoman = false; } }]
      });
    } else {
      Events.emit('ui:showDialogue', { speaker: loc(event, 'speaker'), img: event.img, text: translate('bar_woman_negotiate_fail') });
    }
  };
  const pay = () => {
    if (st.resources.caps < 50) return Events.emit('ui:toast', translate('toast_not_enough_caps', 50));
    st.resources.caps -= 50;
    st.flags.paidBarWoman = true;
    Events.emit('ui:showDialogue', { speaker: loc(event, 'speaker'), img: event.img, text: loc(event, 'branch_pay') });
  };
  const fight = () => {
    st.flags.foughtBarWoman = true;
    const enemy = { name_ru: 'Вышибала из бара', name_en: 'Bar Bouncer', hp: 55, dmg: 10, atk: 3.5, img: 'img/portrait_bar.webp', icon: '[👊]' };
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.combat.onWin = () => {
      Events.emit('ui:showDialogue', { speaker: loc(event, 'speaker'), img: event.img, text: translate('bar_woman_fight_win') });
    };
    beginFight();
  };

  Events.emit('ui:showDialogue', {
    speaker: loc(event, 'speaker'), img: event.img, text: loc(event, 'text'),
    choices: [
      { text: translate('bar_woman_negotiate_choice'), action: negotiate },
      { text: translate('bar_woman_pay_choice'), action: pay },
      { text: translate('bar_woman_fight_choice'), action: fight }
    ]
  });
};

const handleDrifterRescue = (event) => {
  const st = GameState.get();
  const saveHim = () => {
    const enemy = GameData.STORY_ENEMIES.drifter_enemy;
    st.combat.enemy = { ...enemy, maxHp: enemy.hp };
    st.flags.savedDrifter = true;
    st.player.humanity = Math.min(100, st.player.humanity + 15);
    Events.emit('ui:toast', translate('toast_humanity', '+15'));
    st.combat.onWin = () => {
      Events.emit('ui:showDialogue', {
        speaker: translate('drifter_echo'), speaker_en: 'DRIFTER', img: event.img,
        text: loc(event, 'branch_save_success'),
        choices: [{ text: translate('btn_accept'), action: () => applyReward({ medkits: 2, ammo: 15, food: 3 }) }]
      });
    };
    beginFight();
  };
  const leaveHim = () => {
    st.flags.savedDrifter = false;
    st.player.humanity = Math.max(0, st.player.humanity - 15);
    Events.emit('ui:toast', translate('toast_humanity', '-15'));
    Events.emit('ui:showDialogue', {
      speaker: translate('drifter_echo'), speaker_en: 'DRIFTER', img: event.img,
      text: loc(event, 'branch_leave')
    });
  };

  Events.emit('ui:showDialogue', {
    speaker: loc(event, 'speaker'), img: event.img, text: loc(event, 'text'),
    choices: [
      { text: translate('btn_fight'), action: saveHim },
      { text: translate('btn_flee'), action: leaveHim }
    ]
  });
};

const handleCartographer = (event) => {
  const st = GameState.get();
  st.flags.cartographerMet = true;
  const buyMap = () => {
    if (st.resources.caps < 50) return Events.emit('ui:toast', translate('toast_not_enough_caps', 50));
    st.resources.caps -= 50;
    Events.emit('ui:showDialogue', {
      speaker: loc(event, 'speaker'), img: event.img,
      text: loc(event, 'branch_buy_map'),
      choices: [{ text: translate('btn_accept'), action: () => { st.flags.sector4Unlocked = true; Events.emit('ui:toast', translate('goal_2')); } }]
    });
  };
  const buyFile = () => {
    if (st.resources.caps < 120) return Events.emit('ui:toast', translate('toast_not_enough_caps', 120));
    st.resources.caps -= 120;
    const mem = GameData.MEMORY_FRAGMENTS[Math.floor(rng() * 5) + 2];
    Events.emit('ui:showDialogue', {
      speaker: loc(event, 'speaker'), img: event.img,
      text: `${loc(event, 'branch_buy_file')}\n\n${loc(mem, 'text')}`
    });
  };
  const buyCode = () => {
    if (st.resources.caps < 200) return Events.emit('ui:toast', translate('toast_not_enough_caps', 200));
    st.resources.caps -= 200;
    Events.emit('ui:showDialogue', {
      speaker: loc(event, 'speaker'), img: event.img,
      text: loc(event, 'branch_buy_code'),
      choices: [{ text: translate('btn_accept'), action: () => { st.flags.bypassCode = true; Events.emit('ui:toast', translate('bypass_code_active')); } }]
    });
  };
  const leave = () => {
    Events.emit('ui:showDialogue', { speaker: loc(event, 'speaker'), img: event.img, text: loc(event, 'branch_leave') });
  };

  const choices = [];
  if (st.resources.caps >= 50) choices.push({ text: translate('carto_buy_map'), action: buyMap });
  if (st.resources.caps >= 120) choices.push({ text: translate('carto_buy_file'), action: buyFile });
  if (st.resources.caps >= 200) choices.push({ text: translate('carto_buy_code'), action: buyCode });
  choices.push({ text: translate('btn_leave'), action: leave });

  let text = loc(event, 'text');
  if (st.resources.caps < 50) {
    text = translate('lang') === 'ru'
      ? 'НЕЗНАКОМЕЦ В ПОТЁРТОМ ПЛАЩЕ РАЗВОРАЧИВАЕТ ПЕРЕД ВАМИ РУЧНОЙ ПЛАНШЕТ С КАРТОЙ.\n\n«У тебя даже на самую дешевую карту не наскребется крышек. Приходи как разбогатеешь, бродяга».'
      : 'A STRANGER IN A WORN CLOAK UNFOLDS A HANDHELD TABLET WITH A MAP BEFORE YOU.\n\n"You don\'t even have enough caps for the cheapest map. Come back when you get rich, drifter."';
  } else if (st.resources.caps < 200) {
    text += translate('lang') === 'ru'
      ? '\n\n«Вижу, кредитов у тебя немного. Что ж, выбирай из того, что по карману».'
      : '\n\n"I see you are short on credits. Well, choose from what you can afford."';
  }

  Events.emit('ui:showDialogue', {
    speaker: loc(event, 'speaker'), img: event.img, text: text,
    choices: choices
  });
};

const handleStoryCombat = (event) => {
  const st = GameState.get();
  const enemyData = GameData.STORY_ENEMIES[event.enemyId];
  let enemyHp = enemyData.hp;

  if (st.flags && st.flags.bypassCode) {
    enemyHp = Math.round(enemyHp * 0.7);
    st.flags.bypassCode = false;
    Events.emit('ui:toast', translate('bypass_code_active'));
  }

  st.combat.enemy = { ...enemyData, hp: enemyHp, maxHp: enemyHp };

  if (event.enemyId === 'amazon_weak') {
    st.combat.onWin = () => {
      Events.emit('ui:showDialogue', {
        speaker: loc(enemyData, 'name'), img: event.img,
        text: loc(event, 'branch_win'),
        choices: [{ text: translate('btn_continue'), action: () => applyReward({ medkits: 2, ammo: 20 }) }]
      });
    };
  }
  else if (event.enemyId === 'amazon_full') {
    st.combat.onWin = () => handleAmazonChoice(event);
  }
  else if (event.enemyId === 'boss_technician') {
    st.combat.onWin = () => handleEnding();
  }

  Events.emit('ui:showDialogue', {
    speaker: loc(event, 'speaker'), img: event.img, text: loc(event, 'text'),
    choices: [{ text: translate('btn_fight'), action: beginFight }]
  });
};

const handleAmazonChoice = (event) => {
  const st = GameState.get();
  const kill = () => {
    st.flags.mercyAmazon = false;
    st.flags.amazonImplant = true;
    st.player.humanity = Math.max(0, st.player.humanity - 20);
    st.player.armorClass = Math.min(0.9, (st.player.armorClass || 0) + 0.2);
    Events.emit('ui:toast', translate('toast_humanity', '-20'));
    Events.emit('ui:showDialogue', {
      speaker: translate('intercept_data'), img: 'img/portrait_sys.webp',
      text: loc(event, 'branch_kill')
    });
    GameState.save();
    Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
  };
  const spare = () => {
    st.flags.mercyAmazon = true;
    st.player.humanity = Math.min(100, st.player.humanity + 20);
    Events.emit('ui:toast', translate('toast_humanity', '+20'));
    Events.emit('ui:showDialogue', {
      speaker: loc(enemyData, 'name'), img: event.img,
      text: loc(event, 'branch_spare'),
      choices: [{ text: translate('btn_accept'), action: () => Events.emit('ui:toast', translate('mercy_amazon_companion')) }]
    });
    GameState.save();
  };

  const enemyData = GameData.STORY_ENEMIES[event.enemyId];
  Events.emit('ui:showDialogue', {
    speaker: loc(enemyData, 'name'), img: event.img,
    text: loc(event, 'branch_post_fight'),
    choices: [
      { text: translate('btn_kill'), action: kill },
      { text: translate('btn_spare'), action: spare }
    ]
  });
};

const handleEnding = () => {
  const st = GameState.get();
  const flags = st.flags || {};
  const humanity = st.player.humanity;

  if (humanity < 20) {
    showEndingChoice(true);
    return;
  }

  if (flags.savedDrifter && flags.mercyAmazon && humanity >= 70) {
    showEnding({
      title: translate('ending_mercy_title'),
      text: translate('ending_mercy_text'),
      score: translate('ending_mercy_score', Math.round(humanity), st.day)
    });
  }
  else if (!flags.savedDrifter && !flags.mercyAmazon) {
    showEndingChoice(false);
  }
  else {
    showEnding({
      title: translate('ending_neutral_title'),
      text: translate('ending_neutral_text'),
      score: translate('ending_neutral_score', Math.round(humanity), st.day)
    });
  }
};

const showEndingChoice = (forced = false) => {
  const st = GameState.get();

  if (forced) {
    st.flags.endingReached = true;
    showEnding({
      title: translate('ending_bad_title'),
      text: translate('ending_bad_text'),
      score: translate('ending_bad_score', Math.round(st.player.humanity), st.day)
    });
    return;
  }

  Events.emit('ui:showDialogue', {
    speaker: loc(GameData.STORY_ENEMIES.boss_technician, 'name'), img: 'img/enemy_technician.webp',
    text: loc(GameData.STORY_EVENTS.find(e => e.day === 365), 'branch_final_offer'), // I need to make sure this is in data.js
    choices: [
      {
        text: translate('btn_accept'), action: () => {
          st.flags.endingReached = true;
          showEnding({
            title: translate('ending_merge_title'),
            text: translate('ending_merge_text'),
            score: translate('ending_merge_score', st.day)
          });
        }
      },
      {
        text: translate('btn_confirm'), action: () => { // Confirm -> Reject/Destroy
          st.flags.endingReached = true;
          showEnding({
            title: translate('ending_reject_title'),
            text: translate('ending_reject_text'),
            score: translate('ending_reject_score', st.day)
          });
        }
      }
    ]
  });
};

const showEnding = ({ title, text, score }) => {
  const st = GameState.get();
  st.flags.endingReached = true;
  st.dead = true;
  GameState.set(GameState.fresh());
  GameState.save();

  const modal = GameUI.$('#endingModal');
  if (modal) {
    GameUI.$('#endingTitle').textContent = title;
    GameUI.$('#endingText').textContent = text;
    GameUI.$('#endingScore').textContent = score;
    Events.emit('ui:show', { id: '#battleModal', on: false });
    Events.emit('ui:show', { id: '#storyModal', on: false });
    Events.emit('ui:show', { id: '#endingModal', on: true });
  } else {
    Events.emit('ui:showDialogue', { speaker: title, text: text + '\n\n' + score });
  }
};

// --- НОВЫЙ ПРОТИВНИК ---
const newEnemy = elite => {
  const st = GameState.get(), base = pick(elite ? GameData.ELITE_ENEMIES : GameData.ENEMIES);
  const scale = elite
    ? (1 + Math.pow(st.day / 12, 1.25))
    : (1 + Math.pow(st.day / 15, 1.15));
  const maxHp = Math.round(base.hp * scale);
  const dmg = Math.round(base.dmg * scale);
  return { ...base, elite, maxHp, hp: maxHp, dmg, threat: Math.round(maxHp / 8 + dmg * 1.5) };
};

const checkAdEvents = () => {
  if (!window.PlaygamaSDK || GameState.get().permanentBonuses.noAds) return false;
  const st = GameState.get();

  st.adBoosts.lastAdShownDay = st.adBoosts.lastAdShownDay || 0;
  st.adBoosts.lastDroneDay = st.adBoosts.lastDroneDay || 0;
  st.adBoosts.lastEmergencyDay = st.adBoosts.lastEmergencyDay || 0;
  st.adBoosts.lastAdrenalineDay = st.adBoosts.lastAdrenalineDay || 0;

  // Bug 5 fix: increased min gap from 3 to 7 days
  if (st.day - st.adBoosts.lastAdShownDay < 7) return false;

  // Bug 5 fix: per-event gap increased from 10 to 15 days
  if ((st.resources.food < 5 || st.resources.water < 5) && (st.day - st.adBoosts.lastDroneDay >= 15)) {
    if (rng() < 0.35) {
      st.adBoosts.lastDroneDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      Events.emit('ui:showDialogue', {
        speaker: 'СИСТЕМА СНАБЖЕНИЯ', speaker_en: 'SUPPLY SYSTEM',
        text: 'ЗАМЕЧЕНА КРИТИЧЕСКАЯ НЕХВАТКА ПРИПАСОВ. ВАМ ДОСТУПЕН ДРОН СНАБЖЕНИЯ.',
        text_en: 'CRITICAL SUPPLY SHORTAGE DETECTED. SUPPLY DRONE AVAILABLE.',
        choices: [
          {
            text: translate('btn_airdrop') + (translate('lang') === 'ru' ? ' (за просмотр рекламы)' : ' (for viewing ads)'), action: () => {
              window.PlaygamaSDK.showRewarded('airdrop', () => {
                applyReward({ materials: 5, caps: 5, food: 3, water: 3, ammo: 10 });
                Events.emit('ui:toast', translate('toast_airdrop')); GameState.save(); Events.emit('ui:renderMain');
              });
            }
          },
          { text: translate('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  if ((st.player.hp / st.player.maxHp < 0.5) && (st.day - st.adBoosts.lastEmergencyDay >= 15)) {
    if (rng() < 0.35) {
      st.adBoosts.lastEmergencyDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      Events.emit('ui:showDialogue', {
        speaker: 'МЕДИЦИНСКАЯ ПОДСИСТЕМА', speaker_en: 'MEDICAL SUBSYSTEM',
        text: 'КРИТИЧЕСКОЕ ПАДЕНИЕ ЖИЗНЕННЫХ ПОКАЗАТЕЛЕЙ. ПОЛУЧИТЬ АВАРИЙНЫЙ ПАЁК?',
        text_en: 'CRITICAL VITAL SIGNS DROP. RECEIVE EMERGENCY RATION?',
        choices: [
          {
            text: translate('btn_emergency') + (translate('lang') === 'ru' ? ' (за просмотр рекламы)' : ' (for viewing ads)'), action: () => {
              window.PlaygamaSDK.showRewarded('emergency_ration', () => {
                const st = GameState.get();
                st.player.hp = st.player.maxHp;
                st.player.mood = st.player.maxMood;
                applyReward({ food: 5, water: 5 });
                Events.emit('ui:toast', translate('toast_emergency')); GameState.save(); Events.emit('ui:renderMain');
              });
            }
          },
          { text: translate('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  if (st.day - st.adBoosts.lastAdrenalineDay >= 20) {
    if (rng() < 0.25) {
      st.adBoosts.lastAdrenalineDay = st.day;
      st.adBoosts.lastAdShownDay = st.day;
      Events.emit('ui:showDialogue', {
        speaker: 'СИСТЕМЫ УСИЛЕНИЯ', speaker_en: 'BOOST SYSTEMS',
        text: 'НАЙДЕН СТИМУЛЯТОР БОЕВОЙ АКТИВНОСТИ. АКТИВИРОВАТЬ АДРЕНАЛИН (+50% УРОНА НА 15 МИН)?',
        text_en: 'COMBAT STIMULANT FOUND. ACTIVATE ADRENALINE (+50% DAMAGE FOR 15 MIN)?',
        choices: [
          {
            text: translate('btn_adrenaline') + (translate('lang') === 'ru' ? ' (за просмотр рекламы)' : ' (for viewing ads)'), action: () => {
              window.PlaygamaSDK.showRewarded('adrenaline', () => {
                st.adBoosts.adrenaline = Date.now() + 900000;
                Events.emit('ui:toast', translate('toast_adrenaline')); Events.emit('ui:renderTop'); Events.emit('ui:renderMain'); GameState.save();
              });
            }
          },
          { text: translate('btn_ignore'), action: () => { } }
        ]
      });
      return true;
    }
  }

  return false;
};

// --- ЕЖЕДНЕВНЫЕ РАСХОДЫ ---
const upkeep = () => {
  const st = GameState.get(), p = st.player;
  const consumption = st.permanentBonuses.cyberStomach ? 1 : 2;

  st.resources.food = Math.max(0, st.resources.food - consumption);
  st.resources.water = Math.max(0, st.resources.water - consumption);

  if (st.resources.food === 0) {
    p.hp -= 5; p.mood -= 5; Events.emit('ui:toast', translate('res_food_empty')); Events.emit('ui:triggerDamage');
    if (p.hp <= 0) { defeat(translate('defeat_starved')); return; }
  }
  if (st.resources.water === 0) {
    p.hp -= 8; p.mood -= 8; Events.emit('ui:toast', translate('res_water_empty')); Events.emit('ui:triggerDamage');
    if (p.hp <= 0) { defeat(translate('defeat_dehydrated')); return; }
  }
  p.mood = Math.max(0, p.mood - 1);
};

// --- СЛУЧАЙНЫЕ СОБЫТИЯ ---
const encounterRoll = () => {
  const st = GameState.get();
  const enemyChance = Math.min(.55, .20 + st.day * 0.005), roll = rng();

  if (roll < 0.15) {
    const corpse = GameState.getMeta().corpse;
    if (corpse) {
      return { type: 'corpse', corpse };
    }
  }

  if (roll < enemyChance) return { type: 'enemy', enemy: newEnemy(st.day > 10 && rng() < 0.2) };
  if (roll < enemyChance + 0.20) return { type: 'location', location: pick(GameData.LOCATIONS) };
  return { type: 'calm' };
};

const applyReward = r => {
  const st = GameState.get();
  Object.entries(r).forEach(([k, v]) => st.resources[k] = (st.resources[k] || 0) + v);
  Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
};

const renderMerchant = async (defaultTab = 'items') => {
  const st = GameState.get();

  GameUI.$('#merchantStock').innerHTML = `
    <div class="row" style="margin-bottom:1rem; border-bottom:1px solid var(--line);">
      <button class="pill active" id="tabItems">${translate('shop_items')}</button>
      <button class="pill" id="tabDirector">${translate('shop_director')}</button>
    </div>
    <div id="shopContent"></div>
  `;

  const content = GameUI.$('#shopContent');
  const tabItems = GameUI.$('#tabItems');
  const tabDirector = GameUI.$('#tabDirector');

  const catalog = window.PlaygamaSDK ? await window.PlaygamaSDK.getCatalog() : [];

  const showItems = () => {
    tabItems.classList.add('active');
    tabDirector.classList.remove('active');

    // Group items
    const groups = { resource: [], weapon: [], armor: [], upgrade: [] };
    GameData.SHOP_ITEMS.forEach((item, i) => {
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push({ ...item, i });
    });

    let html = '';
    const renderGroup = (arr, title) => {
      if (!arr || arr.length === 0) return;
      html += `<h3 style="margin-top:0.5rem;">${title}</h3>`;
      html += arr.map(item =>
        `<div class='shopItem'>
         <div>${loc(item, 'label')}</div>
         <button class='btn good' data-buy='${item.i}'>${item.price} ${translate('credits').slice(0, 2).toUpperCase()}</button>
       </div>`
      ).join('');
    };

    renderGroup(groups.resource, `${translate('food')} / ${translate('water')} / ${translate('medkits')}`.toUpperCase());
    renderGroup(groups.weapon, translate('weapon').toUpperCase());
    renderGroup(groups.armor, translate('cat_armor').toUpperCase());
    renderGroup(groups.upgrade, translate('cat_upgrades').toUpperCase());

    content.innerHTML = html;

    content.querySelectorAll('[data-buy]').forEach(btn => btn.onclick = () => {
      const p = GameData.SHOP_ITEMS[+btn.dataset.buy];
      if (st.resources.caps < p.price) return Events.emit('ui:toast', translate('toast_not_enough_caps', p.price));
      st.resources.caps -= p.price;
      if (p.type === 'weapon') weaponUnlock(p.weaponId);
      else if (p.type === 'armor') armorUnlock(p.armorId); // if added
      else st.resources[p.key] = (st.resources[p.key] || 0) + p.amount;
      Events.emit('ui:toast', translate('toast_bought', loc(p, 'label'))); GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain'); showItems();
    });
  };

  const showDirector = () => {
    tabItems.classList.remove('active');
    tabDirector.classList.add('active');
    content.innerHTML = `<div class="sub" style="margin-bottom:1rem;">${translate('shop_desc')}</div>`;

    const DEFAULT_ITEMS = [
      { id: 'no_ads', price: '299 GAM', name: translate('item_no_ads_name'), desc: translate('item_no_ads_desc') },
      { id: 'starter_pack', price: '149 GAM', name: translate('item_starter_name'), desc: translate('item_starter_desc') },
      { id: 'premium_caps', price: '99 GAM', name: translate('item_premium_name'), desc: translate('item_premium_desc') },
      { id: 'mega_pack', price: '299 GAM', name: translate('item_mega_name'), desc: translate('item_mega_desc') },
      { id: 'cyber_stomach', price: '199 GAM', name: translate('item_stomach_name'), desc: translate('item_stomach_desc') },
      { id: 'iron_arsenal', price: '249 GAM', name: translate('item_arsenal_name'), desc: translate('item_arsenal_desc') },
      { id: 'heavy_armor', price: '399 GAM', name: translate('item_armor_name'), desc: translate('item_armor_desc') }
    ].filter(item => {
      if (item.id === 'no_ads' && st.permanentBonuses.noAds) return false;
      if (item.id === 'cyber_stomach' && st.permanentBonuses.cyberStomach) return false;
      if (item.id === 'iron_arsenal' && st.weapons.shotgun) return false;
      if (item.id === 'heavy_armor' && st.armors.heavy) return false;
      if (item.id === 'starter_pack' && st.weapons.pickaxe) return false;
      return true;
    });

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

    const ICONS = {
      'no_ads': 'repair.webp',
      'starter_pack': 'exploration.webp',
      'premium_caps': 'food.webp',
      'mega_pack': 'ammunition.webp',
      'cyber_stomach': 'energy.webp',
      'iron_arsenal': 'weapons.webp',
      'heavy_armor': 'armor.webp'
    };

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'shopItem';
      const icon = ICONS[item.id] || 'exploration.webp';
      div.innerHTML = `
        <div style="display:flex; gap:0.4rem; align-items:center;">
          <img src="img/payments/${icon}" style="width:2.5em; height:2.5em; object-fit:contain;" alt="">
          <div>${item.name} <div class="sub">${item.desc}</div></div>
        </div>
        <button class="btn good" style="min-width:80px;">${item.price}</button>
      `;

      // Универсальный обработчик с проверкой авторизации
      const doPurchase = () => {
        if (['starter_pack', 'premium_caps', 'mega_pack', 'cyber_stomach', 'iron_arsenal', 'heavy_armor'].includes(item.id)) {
          window.PlaygamaSDK.buyProduct(item.id, (purchase) => {
            applyPurchase(item.id);
            if (purchase && purchase.purchaseToken) {
              window.PlaygamaSDK.consumePurchase(purchase.purchaseToken);
            }
          }, (err) => Events.emit('ui:toast', `${translate('purchase_error')}: ${translateError(err)}`));
        } else {
          window.PlaygamaSDK.buyProduct(item.id, () => applyPurchase(item.id), (err) => Events.emit('ui:toast', `${translate('purchase_error')}: ${translateError(err)}`));
        }
      };

      div.querySelector('button').onclick = () => {
        const sdk = window.PlaygamaSDK;
        // Если авторизация поддерживается и пользователь не залогинен — предлагаем войти
        if (sdk && sdk.isAuthorizationSupported() && !sdk.isAuthorized()) {
          const modal = document.getElementById('authModal');
          if (modal) {
            modal.classList.add('show');
            const loginBtn = document.getElementById('authLoginBtn');
            const skipBtn = document.getElementById('authSkipBtn');
            const close = () => modal.classList.remove('show');

            loginBtn.onclick = () => {
              close();
              sdk.authorize()
                .then(() => {
                  const btn = document.getElementById('authBtn');
                  if (btn) btn.style.display = 'none';
                  doPurchase();
                })
                .catch(() => Events.emit('ui:toast', translate('auth_required_purchase')));
            };

            skipBtn.onclick = () => {
              close();
              Events.emit('ui:toast', translate('auth_required_purchase'));
            };
            return;
          }

          sdk.authorize()
            .then(() => {
              const btn = document.getElementById('authBtn');
              if (btn) btn.style.display = 'none';
              doPurchase();
            })
            .catch(() => Events.emit('ui:toast', translate('auth_required_purchase')));
          return;
        }
        doPurchase();
      };

      content.appendChild(div);
    });
  };

  tabItems.onclick = showItems;
  tabDirector.onclick = showDirector;
  if (defaultTab === 'director') showDirector(); else showItems();
};

const renderCraft = () => {
  const st = GameState.get();
  const groups = { weapon: [], armor: [], upgrade: [], resource: [] };

  GameData.CRAFT_ITEMS.forEach((item, i) => {
    groups[item.type] = groups[item.type] || [];
    groups[item.type].push({ ...item, i });
  });

  // Bug 2 fix: show current material count at top
  let html = `<div class="synth-resources">${translate('materials').toUpperCase()}: <span class="synth-mats">${st.resources.materials}</span> | ${translate('ammo').toUpperCase()}: <span class="synth-mats">${st.resources.ammo}</span></div>`;
  const renderGroup = (arr, title) => {
    if (!arr || arr.length === 0) return;
    html += `<h3 style="margin-top:0.5rem;">${title}</h3>`;
    html += arr.map(item => {
      const costStr = item.ammo > 0 ? `${translate('materials')}: ${item.materials} | ${translate('ammo')}: ${item.ammo}` : `${translate('materials')}: ${item.materials}`;
      return `<div class='shopItem'>
      <div>${loc(item, 'label')}
        <div class='sub'>${loc(item, 'desc')}</div>
        <div class='sub'>${translate('cost_label', costStr)}</div>
      </div>
      <button class='btn good' data-craft='${item.i}'>${translate('btn_create')}</button>
    </div>`;
    }).join('');
  };

  renderGroup(groups.weapon, translate('weapon').toUpperCase());
  renderGroup(groups.armor, translate('cat_armor').toUpperCase());
  renderGroup(groups.upgrade, translate('cat_upgrades').toUpperCase());
  renderGroup(groups.resource, `${translate('food')} / ${translate('water')} / ${translate('medkits')}`.toUpperCase());

  GameUI.$('#craftStock').innerHTML = html;

  GameUI.$('#craftStock').querySelectorAll('[data-craft]').forEach(btn => {
    btn.onclick = () => {
      const rec = GameData.CRAFT_ITEMS[+btn.dataset.craft];
      // Bug 1 fix: use correct toast key for materials shortage
      if (st.resources.materials < rec.materials) return Events.emit('ui:toast', translate('toast_not_enough_mats', rec.materials));
      if (rec.ammo > 0 && st.resources.ammo < rec.ammo) return Events.emit('ui:toast', translate('res_ammo_empty'));
      st.resources.materials -= rec.materials;
      if (rec.ammo) st.resources.ammo -= rec.ammo;
      if (rec.unlock) weaponUnlock(rec.unlock);
      if (rec.armorId) armorUnlock(rec.armorId);
      if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
      if (rec.healBoost) st.player.healPower = (st.player.healPower || 30) + rec.healBoost;
      Events.emit('ui:toast', translate('toast_crafted', loc(rec, 'label'))); GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain'); renderCraft();
    };
  });
};

// --- НОВЫЙ ДЕНЬ ---
const startDay = () => {
  const st = GameState.get(); if (st.combat.active || st.dead) return;

  if (st.day === 1 && !st.initialized) {
    st.initialized = true;
    checkStoryEvents();
    Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
    return;
  }

  st.day++; st.phase = translate('status_exploring'); upkeep();
  document.dispatchEvent(new CustomEvent('dayadvanced', { detail: { day: st.day } }));
  SoundManager.play('click');
  if (st.player.hp <= 0) return;

  if (window.PlaygamaSDK && !st.permanentBonuses.noAds) {
    if (!st.adBoosts.nextInterstitialDay) {
      st.adBoosts.nextInterstitialDay = st.day + 10 + Math.floor(rng() * 11);
    }
    if (st.day >= st.adBoosts.nextInterstitialDay) {
      const shown = window.PlaygamaSDK.showInterstitial();
      if (shown) {
        st.adBoosts.nextInterstitialDay = st.day + 10 + Math.floor(rng() * 11);
      }
    }
  }

  updateChapterTitle(st.day);
  Events.emit('ui:renderTop'); Events.emit('ui:renderMain');

  if (checkAdEvents()) return;
  if (checkStoryEvents()) return;

  const event = encounterRoll();

  if (event.type === 'corpse') {
    const corpse = event.corpse;
    GameState.getMeta().corpse = null;
    st.player.humanity = Math.max(0, st.player.humanity - 5);
    Events.emit('ui:toast', translate('toast_humanity', '-5'));
    Events.emit('ui:showDialogue', {
      speaker: translate('corpse_echo'),
      text: translate('corpse_desc', corpse.day, corpse.reason),
      choices: [{
        text: translate('btn_take_loot'), action: () => {
          applyReward(corpse.resources);
          Events.emit('ui:toast', translate('corpse_loot', corpse.resources.materials, corpse.resources.ammo, corpse.resources.caps));
        }
      }]
    });
  } else if (event.type === 'enemy') {
    st.encounter = event;
    const threat = event.enemy.threat;
    const threatLabel = threat < 25 ? translate('threat_weak') : threat < 60 ? translate('threat_medium') : threat < 120 ? translate('threat_dangerous') : translate('threat_deadly');
    Events.emit('ui:setEncounterCard', { icon: event.enemy.icon, title: loc(event.enemy, 'name'), desc: translate('threat_level', threatLabel) + `\n${translate('btn_fight')}?`, img: event.enemy.img });
    GameUI.$('#encounterYes').textContent = translate('btn_fight'); GameUI.$('#encounterNo').textContent = translate('btn_flee');
    st.phase = translate('status_combat'); Events.emit('ui:show', { id: '#encounterModal', on: true });
  } else if (event.type === 'location') {
    if (event.location.moodCost) {
      st.player.mood = Math.max(0, st.player.mood - event.location.moodCost);
      Events.emit('ui:toast', `${translate('mood')} -${event.location.moodCost}`);
    }
    st.encounter = event;
    Events.emit('ui:setEncounterCard', { icon: event.location.icon, title: `${loc(event.location, 'name')}`, desc: loc(event.location, 'desc') });
    GameUI.$('#encounterYes').textContent = translate('btn_search'); GameUI.$('#encounterNo').textContent = translate('btn_ignore');
    st.phase = translate('status_exploring'); Events.emit('ui:show', { id: '#encounterModal', on: true });
  } else {
    applyReward({ materials: 2 + Math.floor(rng() * 3), caps: 1 + Math.floor(rng() * 2) });
    Events.emit('ui:toast', translate('day_calm'));
    Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
  }
  GameState.save();
};

const updateChapterTitle = (day) => {
  const el = GameUI.$('#currentGoal');
  if (el) {
    if (day < 30) el.textContent = translate('goal_1');
    else if (day < 80) el.textContent = translate('goal_2');
    else if (day < 145) el.textContent = translate('goal_3');
    else if (day < 210) el.textContent = translate('goal_4');
    else if (day < 300) el.textContent = translate('goal_5');
    else if (day < 365) el.textContent = translate('goal_6');
    else el.textContent = translate('goal_7');
  }
  const deathCountEl = GameUI.$('#deathCount');
  if (deathCountEl) {
    const deaths = GameState.getMeta().deaths || 0;
    deathCountEl.textContent = translate('cycles', deaths);
  }
};

const beginFight = () => {
  const st = GameState.get(), c = st.combat; if (!c.enemy) return;
  Events.emit('ui:show', { id: '#encounterModal', on: false });
  Object.assign(c, { active: true, time: 0, enemyAtk: 1.5, cdDodge: 0, dodge: 0, lastTs: 0 });
  st.phase = translate('status_combat'); Events.emit('ui:show', { id: '#battleModal', on: true });
  SoundManager.play('success');
  gameTick(performance.now());
};

const finishFight = win => {
  const st = GameState.get(), c = st.combat; c.active = false; Events.emit('ui:show', { id: '#battleModal', on: false }); st.phase = translate('status_exploring');

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
      GameUI.$('#doubleRewardBtn').style.display = 'block';
      return `${translate('btn_accept').toUpperCase()}. ${translate('materials')}: +${r.materials}, ${translate('credits').slice(0, 2).toUpperCase()}: +${r.caps}`;
    })()
    : (() => {
      st.player.mood = Math.max(0, st.player.mood - 15);
      GameUI.$('#doubleRewardBtn').style.display = 'none';
      return `${translate('flee_msg')}\n${translate('flee_mood_lost')}`;
    })();
  GameUI.$('#rewardText').textContent = txt; Events.emit('ui:show', { id: '#rewardModal', on: true }); GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
};

const gameTick = ts => {
  const st = GameState.get(), c = st.combat, p = st.player, e = c.enemy; if (!c.active || !e || st.dead) return;
  const dt = Math.min(.08, (ts - (c.lastTs || ts)) / 1000 || .016);
  if (st.player.atkCd > 0) st.player.atkCd = Math.max(0, st.player.atkCd - dt);

  c.lastTs = ts; c.time += dt; c.enemyAtk -= dt;
  if (c.cdDodge > 0) c.cdDodge -= dt;
  if (c.dodge > 0) c.dodge -= dt;

  if (c.enemyAtk <= 0) {
    if (c.dodge > 0) { Events.emit('ui:toast', translate('dodge_success')); }
    else {
      let dmg = e.dmg;
      if (p.armorClass) dmg = Math.round(dmg * (1 - p.armorClass));
      p.hp -= Math.max(1, dmg);
      p.mood = Math.max(0, p.mood - 1); Events.emit('ui:triggerDamage');
      if (p.hp <= 0) { defeat(`${translate('liquidated')}: ${loc(e, 'name').toUpperCase()}`); return; }
    }
    c.enemyAtk = e.atk;
  }
  if (e.hp <= 0) return finishFight(true);

  if (!c.lastRenderTs || ts - c.lastRenderTs > 50) {
    Events.emit('ui:renderBattle');
    c.lastRenderTs = ts;
  }

  requestAnimationFrame(gameTick);
};

const actAttack = () => {
  const st = GameState.get(), c = st.combat, p = st.player;
  if (!c.active || p.hp <= 0 || p.atkCd > 0) return;
  const isGun = p.isGun;
  if (isGun && st.resources.ammo <= 0) return Events.emit('ui:toast', translate('res_ammo_empty'));
  p.atkCd = p.atkCdMax || 1;
  if (isGun) { st.resources.ammo--; SoundManager.play('shoot'); }
  else { SoundManager.play('punch'); }
  let dmg = totalDmg() + Math.floor(rng() * 4);
  const e = c.enemy;
  if (rng() < 0.1) { dmg = Math.round(dmg * 1.5); Events.emit('ui:toast', translate('crit_hit')); }
  if (e.armor) dmg = Math.round(dmg * (1 - e.armor));
  e.hp -= Math.max(1, dmg);
  Events.emit('ui:triggerEnemyHit'); Events.emit('ui:renderTop'); Events.emit('ui:renderBattle');
};

const actDodge = () => { const c = GameState.get().combat; if (c.cdDodge > 0) return; c.dodge = 1.5; c.cdDodge = 5; Events.emit('ui:renderBattle'); };

const actMed = () => {
  const st = GameState.get(); if (st.resources.medkits < 1) return Events.emit('ui:toast', translate('res_medkits_empty'));
  st.resources.medkits--;
  st.player.hp = Math.min(st.player.maxHp, st.player.hp + (st.player.healPower || 30));
  Events.emit('ui:toast', `+${st.player.healPower || 30} HP`); Events.emit('ui:renderTop'); Events.emit('ui:renderBattle');
};

/* ---------- ПРИВЯЗКА СОБЫТИЙ ---------- */
GameUI.$('#charBtn').onclick = startDay;
GameUI.$('#merchantBtn').onclick = async () => {
  await renderMerchant();
  Events.emit('ui:show', { id: '#merchantModal', on: true });
};
GameUI.$('#merchantClose').onclick = () => Events.emit('ui:show', { id: '#merchantModal', on: false });
GameUI.$('#equipBtn').onclick = () => { Events.emit('ui:renderEquipment', { onSwitchWeapon: switchWeapon, onSwitchArmor: switchArmor }); Events.emit('ui:show', { id: '#equipModal', on: true }); };
GameUI.$('#equipClose').onclick = () => Events.emit('ui:show', { id: '#equipModal', on: false });
GameUI.$('#craftBtn').onclick = () => { renderCraft(); Events.emit('ui:show', { id: '#craftModal', on: true }); };
GameUI.$('#craftClose').onclick = () => Events.emit('ui:show', { id: '#craftModal', on: false });
GameUI.$('#storyOk').onclick = () => Events.emit('ui:show', { id: '#storyModal', on: false });

GameUI.$('#reviveBtn').onclick = () => {
  if (window.PlaygamaSDK) {
    window.PlaygamaSDK.showRewarded('revive', () => {
      // Bug 3 fix: state was already reset in defeat(), just restore hp and clear dead flag
      const st = GameState.get();
      st.dead = false;
      st.reviveAvailable = false;
      st.player.hp = Math.max(Math.round(st.player.maxHp * 0.5), 10);
      Events.emit('ui:show', { id: '#defeatModal', on: false });
      Events.emit('ui:toast', translate('btn_revive_sys'));
      Events.emit('ui:renderTop'); Events.emit('ui:renderMain'); GameState.save();
      if (st.combat.enemy) beginFight();
    });
  }
};

GameUI.$('#doubleRewardBtn').onclick = () => {
  if (window.PlaygamaSDK) {
    window.PlaygamaSDK.showRewarded('double_loot', () => {
      const r = GameState.get().combat.lastReward;
      if (r) { applyReward(r); Events.emit('ui:toast', translate('toast_loot_doubled')); GameUI.$('#doubleRewardBtn').style.display = 'none'; }
    });
  }
};



GameUI.$('#encounterYes').onclick = () => {
  const st = GameState.get(), enc = st.encounter; if (!enc) return;
  if (enc.type === 'enemy') { st.combat.enemy = enc.enemy; st.encounter = null; beginFight(); }
  else {
    applyReward(enc.location.reward);
    st.combat.lastReward = enc.location.reward;
    st.encounter = null;
    Events.emit('ui:show', { id: '#encounterModal', on: false });
    GameState.save();
    Events.emit('ui:renderTop');
    Events.emit('ui:renderMain');

    let r = enc.location.reward;
    let rewardParts = [];
    if (r.materials) rewardParts.push(`${translate('materials')}: +${r.materials}`);
    if (r.caps) rewardParts.push(`${translate('credits').slice(0, 2).toUpperCase()}: +${r.caps}`);
    if (r.food) rewardParts.push(`${translate('food').toUpperCase()}: +${r.food}`);
    if (r.water) rewardParts.push(`${translate('water').toUpperCase()}: +${r.water}`);
    if (r.ammo) rewardParts.push(`${translate('ammo').toUpperCase()}: +${r.ammo}`);
    if (r.medkits) rewardParts.push(`${translate('medkits').toUpperCase()}: +${r.medkits}`);

    GameUI.$('#rewardText').textContent = `${translate('received_prefix')}\n${rewardParts.join(', ')}`;
    GameUI.$('#doubleRewardBtn').style.display = 'block';
    Events.emit('ui:show', { id: '#rewardModal', on: true });
  }
};

GameUI.$('#encounterNo').onclick = () => {
  const st = GameState.get(); st.player.mood = Math.max(0, st.player.mood - 5); st.encounter = null; Events.emit('ui:show', { id: '#encounterModal', on: false }); GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
};

GameUI.$('#atk').onclick = actAttack;
GameUI.$('#dodge').onclick = actDodge;
GameUI.$('#med').onclick = actMed;
GameUI.$('#retreat').onclick = () => finishFight(false);
GameUI.$('#rewardOk').onclick = () => { Events.emit('ui:show', { id: '#rewardModal', on: false }); GameState.save(); Events.emit('ui:renderMain'); };

const applyPurchase = (id) => {
  if (!id) return;
  const upperId = id.toUpperCase();
  const st = GameState.get(); Events.emit('ui:toast', `${translate('purchase_activated')}: ${upperId}`);
  switch (id) {
    case 'no_ads':
      st.permanentBonuses.noAds = true;
      if (PlaygamaSDK) PlaygamaSDK.hideBanner();
      break;
    case 'cyber_stomach': st.permanentBonuses.cyberStomach = true; break;
    case 'dlc_sector7': st.permanentBonuses.dlcSector7 = true; break;
    case 'premium_caps': st.resources.caps += 200; break;
    case 'mega_pack': st.resources.caps += 500; st.resources.ammo += 15; st.resources.medkits += 5; break;
    case 'starter_pack': st.resources.caps += 50; applyReward({ food: 10, water: 10 }); weaponUnlock('pickaxe'); break;
    case 'iron_arsenal': weaponUnlock('shotgun'); st.resources.ammo += 30; break;
    case 'heavy_armor': armorUnlock('heavy'); break;
  }
  GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
  if (GameUI.$('#merchantModal').classList.contains('show')) {
    const isDirector = GameUI.$('#tabDirector') && GameUI.$('#tabDirector').classList.contains('active');
    renderMerchant(isDirector ? 'director' : 'items');
  }
};

GameUI.$('#newRun').onclick = () => {
  SoundManager.play('click'); GameState.set(GameState.fresh()); Events.emit('ui:show', { id: '#defeatModal', on: false }); Events.emit('ui:renderTop'); Events.emit('ui:renderMain'); GameState.save(); Events.emit('ui:toast', translate('sys_init'));
};

GameUI.$('#res').addEventListener('click', e => {
  const btn = e.target.closest('[data-use]'); if (!btn) return;
  const type = btn.dataset.use, st = GameState.get(), p = st.player;
  if (st.resources[type] < 1) { SoundManager.play('error'); return Events.emit('ui:toast', translate('toast_no_items')); }
  st.resources[type]--; SoundManager.play('heal');
  if (type === 'food') { p.hp = Math.min(p.maxHp, p.hp + 6); p.mood = Math.min(p.maxMood, p.mood + 10); Events.emit('ui:toast', translate('toast_energy')); }
  if (type === 'water') { p.hp = Math.min(p.maxHp, p.hp + 4); p.mood = Math.min(p.maxMood, p.mood + 15); Events.emit('ui:toast', translate('toast_water')); }
  if (type === 'medkits') { const h = p.healPower || 30; p.hp = Math.min(p.maxHp, p.hp + h); Events.emit('ui:toast', translate('toast_healed', h)); }
  GameState.save(); Events.emit('ui:renderTop'); Events.emit('ui:renderMain');
});

GameUI.$('#muteBtn').onclick = () => {
  SoundManager.toggle(!SoundManager.isEnabled()); GameUI.$('#muteBtn').textContent = SoundManager.isEnabled() ? translate('sound_btn') : translate('sound_mute');
};

// --- ЗАПУСК ---
const initGame = () => {
  GameState.normalize();

  if (PlaygamaSDK) {
    PlaygamaSDK.checkPurchases((purchases) => {
      if (!purchases || !Array.isArray(purchases)) return;
      purchases.forEach(p => {
        if (p && p.productId) {
          applyPurchase(p.productId);
          if (p.purchaseToken) PlaygamaSDK.consumePurchase(p.purchaseToken);
        }
      });
    });
  }

  updateChapterTitle(GameState.get().day);
  Events.emit('ui:renderTop');
  Events.emit('ui:renderMain');
  renderCraft();
  GameState.save();

  if (GameState.get().day === 1 && !GameState.get().initialized) {
    checkStoryEvents();
    const st = GameState.get();
    st.initialized = true;
    GameState.save();
  }

  // Сообщаем SDK что игра готова
  if (PlaygamaSDK) {
    PlaygamaSDK.gameReady();
    PlaygamaSDK.setGameplayState('start');

    // Показываем баннер на поддерживаемых платформах (Yandex, VK, OK и др.), если нет бонуса "No Ads"
    if (!GameState.get().permanentBonuses.noAds) {
      PlaygamaSDK.showBanner('bottom');
    }
  }

  GameUI.applyLanguage();
  console.log('[Game] Инициализация завершена.');
};

export const Game = { init: initGame, applyReward, switchWeapon, switchArmor, weaponUnlock, armorUnlock };
