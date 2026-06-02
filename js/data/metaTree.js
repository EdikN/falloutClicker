// === ДЕРЕВО МЕТАПРОГРЕССИИ ===
// Узлы постоянных улучшений между циклами (plan.md §5.3, §5.5).
// 4 ветки: Физиология, Память, Технологии, Человечность.
//
// Структура узла:
//   id        — уникальный ключ (хранится в metaState.upgrades как { id: level })
//   branch    — 'physiology' | 'memory' | 'technology' | 'humanity'
//   icon      — текстовая/эмодзи-иконка в стиле текущего UI
//   name_*/desc_* — локализованные строки
//   costType  — 'memory' | 'dna'
//   baseCost / costGrowth — стоимость следующего уровня = round(baseCost * costGrowth^level)
//   maxLevel  — максимальное число уровней
//   requires  — массив id узлов, которые должны иметь level >= 1
//   apply(fresh, level) — мутирует свежее состояние нового клона (вызывается в applyMetaBonuses)
//
// apply ВСЕГДА получает итоговый level (1..maxLevel) и применяется один раз
// к только что созданному fresh-состоянию.

export const META_TREE = [
  // ---------- ВЕТКА: ФИЗИОЛОГИЯ (выживание и устойчивость) ----------
  {
    id: 'phys_hp', branch: 'physiology', icon: '❤️',
    name_ru: 'УСИЛЕННЫЙ КАРКАС', name_en: 'REINFORCED FRAME',
    desc_ru: '+15 к максимуму здоровья за уровень.', desc_en: '+15 max health per level.',
    costType: 'memory', baseCost: 8, costGrowth: 1.6, maxLevel: 5, requires: [],
    apply: (fresh, level) => { const add = 15 * level; fresh.player.maxHp += add; fresh.player.hp += add; }
  },
  {
    id: 'phys_metabolism', branch: 'physiology', icon: '🍖',
    name_ru: 'ЭКОНОМНЫЙ МЕТАБОЛИЗМ', name_en: 'EFFICIENT METABOLISM',
    desc_ru: '−10% к расходу еды и воды за уровень.', desc_en: '-10% food & water consumption per level.',
    costType: 'memory', baseCost: 12, costGrowth: 1.7, maxLevel: 3, requires: [],
    apply: (fresh, level) => { fresh.meta_upkeepMult = (fresh.meta_upkeepMult ?? 1) * (1 - 0.10 * level); }
  },
  {
    id: 'phys_medkit', branch: 'physiology', icon: '✚',
    name_ru: 'ПОЛЕВАЯ АПТЕЧКА', name_en: 'FIELD MEDKIT',
    desc_ru: '+1 аптечка на старте за уровень.', desc_en: '+1 starting medkit per level.',
    costType: 'memory', baseCost: 10, costGrowth: 1.8, maxLevel: 3, requires: ['phys_hp'],
    apply: (fresh, level) => { fresh.resources.medkits += level; }
  },

  // ---------- ВЕТКА: ТЕХНОЛОГИИ (экономика и билд) ----------
  {
    id: 'tech_materials', branch: 'technology', icon: '⚙️',
    name_ru: 'РЕЗЕРВ МАТЕРИАЛОВ', name_en: 'MATERIAL CACHE',
    desc_ru: '+5 материалов на старте за уровень.', desc_en: '+5 starting materials per level.',
    costType: 'memory', baseCost: 8, costGrowth: 1.5, maxLevel: 5, requires: [],
    apply: (fresh, level) => { fresh.resources.materials += 5 * level; }
  },
  {
    id: 'tech_caps', branch: 'technology', icon: '💰',
    name_ru: 'СТАРТОВЫЙ КАПИТАЛ', name_en: 'STARTING CAPITAL',
    desc_ru: '+15 кредитов на старте за уровень.', desc_en: '+15 starting credits per level.',
    costType: 'memory', baseCost: 8, costGrowth: 1.5, maxLevel: 5, requires: [],
    apply: (fresh, level) => { fresh.resources.caps += 15 * level; }
  },
  {
    id: 'tech_loot', branch: 'technology', icon: '🎁',
    name_ru: 'УДАЧЛИВЫЙ МАРОДЁР', name_en: 'LUCKY SCAVENGER',
    desc_ru: '+8% к добыче из боя и обыска за уровень.', desc_en: '+8% combat & search loot per level.',
    costType: 'memory', baseCost: 14, costGrowth: 1.7, maxLevel: 3, requires: ['tech_materials'],
    apply: (fresh, level) => { fresh.meta_lootMult = (fresh.meta_lootMult ?? 1) * (1 + 0.08 * level); }
  },
  {
    id: 'tech_starter_weapon', branch: 'technology', icon: '🔪',
    name_ru: 'СТАРТОВЫЙ НОЖ', name_en: 'STARTING KNIFE',
    desc_ru: 'Новый клон начинает с ножом вместо кулаков.', desc_en: 'New clone starts with a knife instead of fists.',
    costType: 'dna', baseCost: 2, costGrowth: 1, maxLevel: 1, requires: ['tech_loot'],
    apply: (fresh) => { fresh.weapons.knife = true; fresh.meta_startWeapon = 'knife'; }
  },

  // ---------- ВЕТКА: ПАМЯТЬ (сюжет и знание) ----------
  {
    id: 'mem_archive_access', branch: 'memory', icon: '🧠',
    name_ru: 'ДОСТУП К АРХИВУ', name_en: 'ARCHIVE ACCESS',
    desc_ru: 'Сохраняет +1 ДНК-фрагмент за каждый цикл (пассивно).', desc_en: 'Banks +1 DNA fragment each cycle (passive).',
    costType: 'memory', baseCost: 20, costGrowth: 2, maxLevel: 1, requires: [],
    apply: () => { /* эффект обрабатывается при начислении валюты (metaCurrency) */ }
  },
  {
    id: 'mem_combat_data', branch: 'memory', icon: '📊',
    name_ru: 'БОЕВЫЕ ДАННЫЕ', name_en: 'COMBAT DATA',
    desc_ru: '+1 к базовому урону за уровень (знание врага).', desc_en: '+1 base damage per level (enemy knowledge).',
    costType: 'memory', baseCost: 12, costGrowth: 1.8, maxLevel: 3, requires: ['mem_archive_access'],
    apply: (fresh, level) => { fresh.player.baseDmg += level; }
  },

  // ---------- ВЕТКА: ЧЕЛОВЕЧНОСТЬ (моральный путь и концовки) ----------
  {
    id: 'hum_start', branch: 'humanity', icon: '☯️',
    name_ru: 'ОСТАТОК ЛИЧНОСТИ', name_en: 'RESIDUAL SELF',
    desc_ru: '+8 к стартовой человечности за уровень.', desc_en: '+8 starting humanity per level.',
    costType: 'memory', baseCost: 10, costGrowth: 1.6, maxLevel: 4, requires: [],
    apply: (fresh, level) => { fresh.player.humanity = Math.min(fresh.player.maxHumanity, fresh.player.humanity + 8 * level); }
  },
  {
    id: 'hum_resilience', branch: 'humanity', icon: '🧘',
    name_ru: 'ДУШЕВНЫЙ ПОКОЙ', name_en: 'INNER PEACE',
    desc_ru: '+10 к стартовому рассудку за уровень.', desc_en: '+10 starting sanity per level.',
    costType: 'memory', baseCost: 9, costGrowth: 1.6, maxLevel: 3, requires: ['hum_start'],
    apply: (fresh, level) => { const add = 10 * level; fresh.player.maxMood += add; fresh.player.mood += add; }
  }
];

// Метаданные веток для UI (заголовки/порядок).
export const META_BRANCHES = [
  { id: 'physiology', name_ru: 'ФИЗИОЛОГИЯ', name_en: 'PHYSIOLOGY', icon: '🫀' },
  { id: 'technology', name_ru: 'ТЕХНОЛОГИИ', name_en: 'TECHNOLOGY', icon: '⚙️' },
  { id: 'memory',     name_ru: 'ПАМЯТЬ',     name_en: 'MEMORY',     icon: '🧠' },
  { id: 'humanity',   name_ru: 'ЧЕЛОВЕЧНОСТЬ', name_en: 'HUMANITY', icon: '☯️' }
];

// Стоимость следующего уровня узла при текущем уровне currentLevel.
export const nodeCost = (node, currentLevel) =>
  Math.round(node.baseCost * Math.pow(node.costGrowth, currentLevel));
