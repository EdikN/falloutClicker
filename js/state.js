import { GameData } from './data.js';

export const GameState = (() => {
  const fresh = () => ({
    v: GameData.SAVE_VER,
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
    tutorialShown: false,    // Флаг показа обучения
    social: {
      done: {},              // Список выполненных соц. действий
      lastPromptDay: 0,      // День последнего промпта
      neverRemind: false     // Флаг "никогда не напоминать"
    },

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
    state.v = GameData.SAVE_VER;
  };

  const save = () => {
    const key = `save_${Number(GameData.SAVE_VER).toFixed(1)}`.replace('.', '_');
    const json = JSON.stringify({ state, meta: metaState });
    if (window.PlaygamaSDK) window.PlaygamaSDK.save(json, key);
  };

  const load = (onDone) => {
    if (!window.PlaygamaSDK) return onDone && onDone(false);

    let currentVer = GameData.SAVE_VER;
    const tryLoad = (v, checkIntKey = false) => {
      const vFixed = Math.round(v * 10) / 10;
      let key = `save_${vFixed.toFixed(1)}`.replace('.', '_');
      if (checkIntKey) {
        key = `save_${vFixed}`; // Fallback for integer versions like save_2
      }
      console.log(`[GameState] Попытка загрузки: ${key}...`);

      window.PlaygamaSDK.load((cloudData) => {
        if (cloudData) {
          try {
            const parsed = typeof cloudData === 'string' ? JSON.parse(cloudData) : cloudData;
            const loadedState = parsed.state || (parsed.v ? parsed : null);
            const loadedMeta = parsed.meta || null;

            if (loadedState) {
              state = loadedState;
              if (loadedMeta) metaState = loadedMeta;
              normalize();
              console.log(`[GameState] Прогресс загружен из версии ${vFixed.toFixed(1)}${checkIntKey ? ' (integer key)' : ''}.`);
              if (onDone) return onDone(true);
            }
          } catch (err) {
            console.error(`[GameState] Ошибка парсинга ${key}:`, err);
          }
        }

        // Fallback or end
        if (vFixed > 1.0) {
          if (!checkIntKey && Math.floor(vFixed) === vFixed) {
            // Try integer key before moving down
            setTimeout(() => tryLoad(vFixed, true), 10);
          } else {
            setTimeout(() => tryLoad(vFixed - 0.1, false), 10);
          }
        } else {
          // If even fallback to 1.0 failed, try the old generic key once as absolute last resort
          if (vFixed === 1.0 && !checkIntKey) {
            window.PlaygamaSDK.load((oldData) => {
              if (oldData) {
                try {
                  const parsed = typeof oldData === 'string' ? JSON.parse(oldData) : oldData;
                  state = parsed.state || parsed;
                  normalize();
                  console.log('[GameState] Прогресс восстановлен из старого общего ключа.');
                  if (onDone) return onDone(true);
                } catch (_) { }
              }
              if (onDone) onDone(false);
            }, 'fallout_save');
          } else {
            if (onDone) onDone(false);
          }
        }
      }, key);
    };

    tryLoad(currentVer);
  };

  return { get: () => state, getMeta: () => metaState, set: v => state = v, fresh, save, load, normalize };
})();
