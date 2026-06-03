// === ЯДРОВЫЙ БАЛАНС ===
// Единый источник «магических чисел» боя/экономики/выживания.
// Цель текущих значений: ЛЁГКИЙ СТАРТ → ПЛАВНЫЙ РОСТ (первые ~10-15 дней комфортные,
// дальше угроза ощутимо растёт) + МЯГКАЯ экономика.
// Меняйте здесь — логика в game.js это просто читает.

export const BALANCE = {
  // Масштабирование врага по дню: hp/dmg *= 1 + (day/divisor)^exp
  enemy: {
    normalDivisor: 18, normalExp: 1.2,   // обычные: мягче в начале (было 15/1.15)
    eliteDivisor: 14,  eliteExp: 1.3,    // элита: круче к концу (было 12/1.25)
    dmgCapPct: 0.40,                     // макс. доля maxHp игрока за удар (после брони)
    eliteFromDay: 10, eliteChance: 0.2   // с какого дня и с каким шансом появляется элита
  },

  // Ежедневный расход голода/жажды: base = rand(baseMin..baseMax) * actMult, кап cap.
  upkeep: {
    baseMin: 8, baseMax: 16,             // было 10-20 — мягче
    actMult: { fight: 3, loot: 2, none: 1 },
    cap: 50,
    starve: { hp: 5, mood: 5 },          // штраф при голоде = 0
    dehydrate: { hp: 8, mood: 8 }        // штраф при жажде = 0
  },

  // Восстановление от расходников (щедрее прежнего)
  restore: {
    food:  { hunger: 40, hp: 3 },        // было 35 / +2
    water: { thirst: 50, mood: 6 }       // было 45 / +5
  },

  // Награда за победу в бою
  combatReward: { capsFromThreat: 0.8, capsRand: 5, matMin: 3, matMax: 7, foodChance: 0.15 },

  // Награда за спокойный день
  calmReward: { matMin: 2, matMax: 4, capsMin: 1, capsMax: 2 }
};
