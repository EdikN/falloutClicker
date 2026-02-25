window.GameData = (() => {
  const SAVE_KEY = 'forpost_dayclick_v3';
  const SAVE_VER = 3;
  const ENEMIES = [
    { name: 'Рейдер-рашер', hp: 36, dmg: 8, atk: 3.2, icon: '🏃' },
    { name: 'Щитоносец', hp: 55, dmg: 6, atk: 4.8, armor: 0.25, icon: '🛡️' },
    { name: 'Снайпер', hp: 28, dmg: 14, atk: 5.4, mark: true, icon: '🎯' },
    { name: 'Гончая', hp: 25, dmg: 7, atk: 2.8, icon: '🐕' }
  ];
  const ELITE_ENEMIES = [
    { name: 'Альфа-рейдер', hp: 80, dmg: 16, atk: 3.8, armor: 0.2, mark: true, icon: '☠️' },
    { name: 'Штурмовой бот', hp: 118, dmg: 18, atk: 4.2, armor: 0.35, icon: '🦾' }
  ];
  const LOCATIONS = [
    { name: 'Старый музей', icon: '🏛️', desc: 'Витрины разбиты, но внутри можно найти инструменты.', reward: { food: 2, water: 1, materials: 9, ammo: 3, caps: 5 }, danger: 0.27, elite: 0.35 },
    { name: 'Караванный рынок', icon: '🏪', desc: 'Старые ряды торговли, редкие припасы и следы людей.', reward: { water: 4, materials: 5, ammo: 2, caps: 8 }, danger: 0.22, elite: 0.25 },
    { name: 'Блокпост', icon: '🪖', desc: 'Здесь осталось военное снаряжение.', reward: { ammo: 7, materials: 6, medkits: 1, caps: 6 }, danger: 0.33, elite: 0.45 }
  ];
  const SHOP_ITEMS = [
    { key: 'food', label: '🍖 Еда x6', amount: 6, price: 8, type: 'resource' },
    { key: 'water', label: '💧 Вода x6', amount: 6, price: 8, type: 'resource' },
    { key: 'ammo', label: '🔸 Патроны x14', amount: 14, price: 10, type: 'resource' },
    { key: 'medkits', label: '🩹 Аптечка x1', amount: 1, price: 12, type: 'resource' },
    { key: 'weaponPipe', label: '🔫 Трубный карабин (+3 урона)', price: 22, type: 'weapon', weaponId: 'pipe' },
    { key: 'weaponLaser', label: '⚡ Лазерный пистолет (+6 урона)', price: 34, type: 'weapon', weaponId: 'laser' }
  ];
  const CRAFT_ITEMS = [
    { label: '🛠 Самодельный нож (+2 урона)', materials: 16, ammo: 0, unlock: 'knife' },
    { label: '🔩 Усиление карабина (+4 урона)', materials: 24, ammo: 8, unlock: 'rifleMod' },
    { label: '⚙ Импульсный модуль (+10 max HP)', materials: 22, ammo: 4, hpBoost: 10 }
  ];
  const STORY = [
    'Глава 1. Холод. Металл. Тишина. Вы просыпаетесь на полу убежища и не помните даже своего имени.',
    'На стене выцарапано слово «ФОРПОСТ». Вы понимаете, что это единственная зацепка.',
    'Первый шаг наружу показывает пустошь: пепел, руины и редкие огни караванов.',
    'В выжженной земле вы встречаете торговца, который говорит, что видел вас раньше.',
    'К концу главы вы решаете остаться в живых любой ценой и раскрыть, кем были до пробуждения.'
  ];
  const NOTES = [
    'Записка: «Если читаешь это, не доверяй людям в синих плащах».',
    'Записка: «Под рынком есть закрытый тоннель. Там хранятся довоенные схемы».',
    'Записка: «Форпост был лабораторией памяти. Возможно, ты один из подопытных».',
    'Записка: «Кодовая фраза: СЕВЕРНЫЙ СВЕТ. Она открывает склад Б-12».',
    'Записка: «Твой жетон найден у капсулы №7. Значит, ты уже проходил это».',
  ];
  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, STORY, NOTES };
})();
