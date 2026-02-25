window.GameState = (() => {
  const D = window.GameData;
  const fresh = () => ({
    v: D.SAVE_VER,
    day: 1,
    initialized: false,
    phase: 'ИССЛЕДОВАНИЕ',
    dead: false,

    // Система истории
    storyIndex: 0,       // Какой сюжетный кусок показывать следующим
    nextStoryDay: 1,     // Когда показать сюжет
    nextNoteDay: 10,     // Когда показать случайную записку (редко)

    resources: { food: 15, water: 15, materials: 0, ammo: 0, medkits: 1, caps: 0 },

    // Статы игрока
    player: {
      maxHp: 100, hp: 100,
      maxMood: 100, mood: 100,
      baseDmg: 3,        // Урон кулаками
      dmgBonus: 0,
      weaponName: 'КУЛАКИ',
      armorName: 'ЛОХМОТЬЯ',
      armorClass: 0,
      healPower: 30      // Сила аптечки
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
    if (state.v !== D.SAVE_VER) return state = fresh(); // Сброс при смене версии

    state.resources = { ...def.resources, ...state.resources };
    state.player = { ...def.player, ...state.player };
    state.weapons = { ...def.weapons, ...state.weapons };
    state.armors = { ...def.armors, ...state.armors };
    state.combat = { ...def.combat, ...state.combat };
  };

  const save = () => localStorage.setItem(D.SAVE_KEY, JSON.stringify(state));
  const load = () => {
    try {
      const raw = localStorage.getItem(D.SAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed.v !== D.SAVE_VER) return false;
      state = parsed;
      normalize();
      return true;
    } catch { return false; }
  };

  return { get: () => state, set: v => state = v, fresh, save, load, normalize };
})();
