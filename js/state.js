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

    resources: { food: 15, water: 15, materials: 0, ammo: 0, medkits: 1, caps: 0 },

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

  const normalize = () => {
    const def = fresh();

    // Мягкое слияние объектов, чтобы не терять прогресс при обновлении версии
    state.resources = { ...def.resources, ...(state.resources || {}) };
    state.player = { ...def.player, ...(state.player || {}) };
    state.weapons = { ...def.weapons, ...(state.weapons || {}) };
    state.armors = { ...def.armors, ...(state.armors || {}) };
    state.combat = { ...def.combat, ...(state.combat || {}) };
    state.flags = { ...def.flags, ...(state.flags || {}) };

    // Новые поля для монетизации
    state.adBoosts = { ...def.adBoosts, ...(state.adBoosts || {}) };
    state.permanentBonuses = { ...def.permanentBonuses, ...(state.permanentBonuses || {}) };
    if (state.reviveAvailable === undefined) state.reviveAvailable = def.reviveAvailable;

    state.v = D.SAVE_VER;
  };

  const save = () => {
    const json = JSON.stringify(state);
    localStorage.setItem(D.SAVE_KEY, json);
    // Playgama cloud save
    if (window.PlaygamaSDK) window.PlaygamaSDK.save(json);
  };

  const load = (onDone) => {
    // 1. Сначала загружаем из локала (быстро)
    const localRaw = localStorage.getItem(D.SAVE_KEY);
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw);
        if (parsed.v === D.SAVE_VER) {
          state = parsed;
          normalize();
          if (onDone) onDone(true);
        }
      } catch (_) { }
    }

    // 2. Затем пробуем загрузить из облака SDK (может быть более актуально)
    if (window.PlaygamaSDK) {
      window.PlaygamaSDK.load((cloudData) => {
        if (cloudData) {
          try {
            const parsed = JSON.parse(cloudData);
            if (parsed.v === D.SAVE_VER) {
              state = parsed;
              normalize();
              // Если загрузили облако — пересохраняем в локал
              localStorage.setItem(D.SAVE_KEY, cloudData);
              if (onDone) onDone(true);
            }
          } catch (_) { }
        } else if (onDone && !localRaw) {
          onDone(false);
        }
      });
    } else if (onDone) {
      onDone(!!localRaw);
    }
  };

  return { get: () => state, set: v => state = v, fresh, save, load, normalize };
})();
