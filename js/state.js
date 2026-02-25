window.GameState = (() => {
  const D = window.GameData;
  const fresh = () => ({
    v: D.SAVE_VER, day: 1, phase: 'ИССЛЕДОВАНИЕ', dead: false, lastNoteDay: 0, nextNoteDay: 6, noteIndex: 0,
    resources: { food: 20, water: 20, materials: 24, ammo: 36, medkits: 3, caps: 16 },
    player: { maxHp: 100, hp: 100, maxMood: 100, mood: 80, baseDmg: 8, dmgBonus: 2, weaponName: 'АРМАТУРА' },
    weapons: { knife: false, pipe: false, laser: false, rifleMod: false },
    encounter: null,
    combat: { active: false, time: 0, enemy: null, enemyAtk: 0, cdReload: 0, cdVolley: 0, cdDodge: 0, reward: null }
  });
  let state = fresh();

  const normalize = () => {
    const def = fresh();
    state.resources = { ...def.resources, ...(state.resources || {}) };
    state.player = { ...def.player, ...(state.player || {}) };
    state.weapons = { ...def.weapons, ...(state.weapons || {}) };
    state.lastNoteDay = state.lastNoteDay || 0;
    state.nextNoteDay = state.nextNoteDay || (state.day + 6);
    state.noteIndex = state.noteIndex || 0;
    state.encounter = state.encounter || null;
    state.combat = { ...def.combat, ...(state.combat || {}) };
  };

  const save = () => localStorage.setItem(D.SAVE_KEY, JSON.stringify(state));
  const load = () => {
    try {
      const raw = localStorage.getItem(D.SAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.v !== D.SAVE_VER) return false;
      state = parsed; normalize(); return true;
    } catch { return false; }
  };

  return { get: () => state, set: v => state = v, fresh, save, load, normalize };
})();
