import { GameData as D } from './data.js';

export const GameState = (() => {
  const fresh = () => ({
    v: D.SAVE_VER,
    day: 1,
    initialized: false,
    phase: 'ИССЛЕДОВАНИЕ',
    dead: false,

    // Система истории
    storyIndex: 0,
    nextStoryDay: 1,
    nextNoteDay: 10,

    // === СИСТЕМА ФЛАГОВ СЮЖЕТНЫХ ВЫБОРОВ ===
    flags: {
      savedDrifter: false,      // Спас Бродягу (день 145)
      mercyAmazon: false,       // Пощадил Амазонку (день 210)
      paidBarWoman: false,      // Заплатил женщине в баре
      foughtBarWoman: false,    // Подрался с вышибалой
      barWomanHelped: false,    // Женщина помогла вторично (если платил)
      readAmazonLog: false,     // Нашёл журнал Амазонки (день 195)
      drifterMet: 0,            // Счётчик встреч с Бродягой
      cartographerMet: false,   // Встретил Картографа
      amazonImplant: false,     // Получил имплант Амазонки (убил её)
      endingReached: false      // Финал достигнут
    },

    // === МОНЕТИЗАЦИЯ ===
    adBoosts: {
      adrenaline: 0,        // timestamp окончания баффа урона (+50%)
      airdropLastTime: 0,   // timestamp последнего дропа
      lastAdShownDay: 0,
      lastDroneDay: 0,
      lastEmergencyDay: 0,
      lastAdrenalineDay: 0
    },
    permanentBonuses: {
      noAds: false,
      cyberStomach: false,  // x0.5 расход еды/воды
      dlcSector7: false,
    },
    reviveAvailable: true,   // Доступно ли возрождение за рекламу в этом цикле

    resources: { food: 30, water: 30, materials: 0, ammo: 0, medkits: 1, caps: 0 },

    // Статы игрока
    player: {
      maxHp: 100, hp: 100,
      maxMood: 100, mood: 100,
      maxHumanity: 100, humanity: 50,
      baseDmg: 3,
      dmgBonus: 0,
      weaponName: 'КУЛАКИ',
      armorName: 'ЛОХМОТЬЯ',
      armorClass: 0,
      healPower: 30
    },

    // Открытое оружие
    weapons: {
      fists: true,
      knife: false, wrench: false, pistol: false, shotgun: false, rifle: false, plasma: false, launcher: false
    },

    // Открытая броня
    armors: {
      none: true,
      light: false, medium: false, heavy: false
    },

    encounter: null,
    combat: {
      active: false,
      time: 0,
      enemy: null,
      enemyAtk: 0,
      cdDodge: 0,
      atkCd: 0
    }
  });

  let state = fresh();
  let metaState = { deaths: 0, corpse: null };

  const deepMerge = (target, source) => {
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
    return target;
  };

  const normalize = () => {
    const def = fresh();
    state = deepMerge(state, def);
    state.v = D.SAVE_VER;
  };

  const save = () => {
    const json = JSON.stringify({ state, meta: metaState });
    if (window.PlaygamaSDK) window.PlaygamaSDK.save(json);
  };

  const load = (onDone) => {
    if (window.PlaygamaSDK) {
      window.PlaygamaSDK.load((cloudData) => {
        if (cloudData) {
          try {
            const parsed = JSON.parse(cloudData);
            if (parsed.meta !== undefined && parsed.state !== undefined) {
              if (parsed.state.v === D.SAVE_VER) {
                state = parsed.state;
                metaState = parsed.meta;
                normalize();
                if (onDone) return onDone(true);
              }
            } else if (parsed.v === D.SAVE_VER) {
              state = parsed;
              normalize();
              if (onDone) return onDone(true);
            }
          } catch (_) { }
        }
        if (onDone) onDone(false);
      });
    } else {
      if (onDone) onDone(false);
    }
  };

  return { get: () => state, getMeta: () => metaState, set: v => state = v, fresh, save, load, normalize };
})();
