window.GameData = (() => {
  const SAVE_KEY = 'jericho_dayclick_v3';
  const SAVE_VER = 6;

  const ENEMIES = [
    { name: 'Кибер-крыса', hp: 20, dmg: 4, atk: 2.5, img: 'img/enemy_rat.png', icon: '[..]' },
    { name: 'Мусорщик', hp: 35, dmg: 6, atk: 3.0, img: 'img/enemy_scavenger.png', icon: '[!!]' },
    { name: 'Дрон-разведчик', hp: 45, dmg: 5, atk: 2.2, img: 'img/enemy_drone.png', icon: '[*]' },
    { name: 'Безумный киборг', hp: 55, dmg: 9, atk: 3.5, img: 'img/enemy_cyborg.png', icon: '[#]' },
    { name: 'Синтетик-боец', hp: 70, dmg: 12, atk: 4.0, img: 'img/enemy_synth.png', icon: '[+]' },
    { name: 'Мутант', hp: 85, dmg: 14, atk: 3.2, img: 'img/enemy_mutant.png', icon: '[@]' }
  ];

  const ELITE_ENEMIES = [
    { name: 'Ликвидатор', hp: 130, dmg: 18, atk: 3.8, armor: 0.2, img: 'img/enemy_liquidator.png', icon: '[XXX]' },
    { name: 'Тяжелый МЕХ', hp: 180, dmg: 22, atk: 5.0, armor: 0.4, img: 'img/enemy_mech.png', icon: '[O_O]' },
    { name: 'Прототип Ареса', hp: 250, dmg: 25, atk: 4.5, armor: 0.3, img: 'img/enemy_ares.png', icon: '[BOSS]' }
  ];

  const LOCATIONS = [
    { name: 'Склад запчастей', icon: '⚙️', desc: 'Старые стеллажи с полезными компонентами.', reward: { materials: 12, caps: 6 }, danger: 0.2 },
    { name: 'Медблок', icon: '✚', desc: 'Разбитые капсулы, но что-то ещё осталось.', reward: { medkits: 1, food: 1 }, danger: 0.3 },
    { name: 'Оружейная', icon: '⚡', desc: 'Запертые ящики с боеприпасами.', reward: { ammo: 15, caps: 12 }, danger: 0.45 },
    { name: 'Столовая', icon: '🍖', desc: 'Остатки сухпайков и фильтрованная вода.', reward: { food: 4, water: 3 }, danger: 0.15 },
    { name: 'Лаборатория', icon: '🔬', desc: 'Исследовательский отсек. Богатая находка.', reward: { materials: 20, caps: 15 }, danger: 0.5 }
  ];

  // МАГАЗИН — только покупка готовых вещей
  const SHOP_ITEMS = [
    { key: 'food', label: '🍖 Паёк x6', amount: 6, price: 8, type: 'resource' },
    { key: 'water', label: '💧 Вода x6', amount: 6, price: 8, type: 'resource' },
    { key: 'ammo', label: '⚡ Патроны x14', amount: 14, price: 10, type: 'resource' },
    { key: 'medkits', label: '✚ Стимулятор x1', amount: 1, price: 15, type: 'resource' },
    { key: 'weaponWrench', label: '🔧 Гаечный ключ  (+4 урон)', price: 15, type: 'weapon', weaponId: 'wrench' },
    { key: 'weaponPistol', label: '🔫 10мм Пистолет (+8 урон)', price: 30, type: 'weapon', weaponId: 'pistol' },
    { key: 'weaponShotgun', label: '💥 Дробовик      (+16 урон)', price: 60, type: 'weapon', weaponId: 'shotgun' },
    { key: 'weaponRifle', label: '🎯 Штурм. винтовка (+20 урон)', price: 90, type: 'weapon', weaponId: 'rifle' },
    { key: 'weaponPlasma', label: '⚛️  Плазмоган     (+32 урон)', price: 180, type: 'weapon', weaponId: 'plasma' }
  ];

  // СИНТЕЗАТОР — крафт + оружие ближнего боя и уникальные пушки
  const CRAFT_ITEMS = [
    // --- БЛИЖНИЙ БОЙ (не требует патронов) ---
    {
      label: '🗡️ Заточка',
      desc: 'Заострённый кусок арматуры. +3 урон. Не нужны патроны.',
      materials: 8, ammo: 0, unlock: 'knife',
      type: 'weapon'
    },
    {
      label: '⛏️  Кирка-клинок',
      desc: 'Тяжёлый модифицированный инструмент. +10 урон. Не нужны патроны.',
      materials: 20, ammo: 0, unlock: 'pickaxe',
      type: 'weapon'
    },
    {
      label: '⚡ Шоковый жезл',
      desc: 'Бьёт электрическим разрядом вплотную. +18 урон. Не нужны патроны.',
      materials: 40, ammo: 0, unlock: 'shockrod',
      type: 'weapon'
    },
    {
      label: '🔩 Вибро-кулак',
      desc: 'Силовая перчатка с вибратором. +26 урон. Не нужны патроны.',
      materials: 65, ammo: 0, unlock: 'vibrofist',
      type: 'weapon'
    },
    // --- ДАЛЬНЕЕ ОРУЖИЕ (требует патроны) ---
    {
      label: '💣 Гранатомет',
      desc: 'Самодельный. Огромный урон. +45 урон.',
      materials: 80, ammo: 20, unlock: 'launcher',
      type: 'weapon'
    },
    {
      label: '🔆 Лазерная пушка',
      desc: 'Демонтированный промышленный лазер. +55 урон.',
      materials: 120, ammo: 30, unlock: 'laserc',
      type: 'weapon'
    },
    // --- УЛУЧШЕНИЯ ---
    {
      label: '🛡️ Лёгкая броня',
      desc: 'Пластины из обломков. +20 к максимальному HP.',
      materials: 25, ammo: 0, hpBoost: 20,
      type: 'upgrade'
    },
    {
      label: '🧬 Усиленные стимы',
      desc: 'Улучшает эффект аптечек и стимуляторов. +15 к силе лечения.',
      materials: 40, ammo: 0, healBoost: 15,
      type: 'upgrade'
    }
  ];

  const STORY_CHAPTERS = [
    { id: 1, text: '> ЦИКЛ 1. ЗАГРУЗКА... Память повреждена. Вы очнулись в горе трупов. На руке штрих-код "ИЕРИХОН-73". Единственная цель — выжить.' },
    { id: 2, text: '> ЦИКЛ ~4. Вы находите терминал с вашими биометрическими данными. Дата смерти: ВЧЕРА. Статус: "АКТИВЕН". Как это возможно?' },
    { id: 3, text: '> ЦИКЛ ~8. Встреченный бродяга в ужасе убегает от вас, крича что видел, как вам оторвало голову. Вы проверяете шею — там шрам.' },
    { id: 4, text: '> ЦИКЛ ~15. Вы добрались до жилых секторов. Тут пусто. Люди давно исчезли, остались только киборги и мутанты.' },
    { id: 5, text: '> ЦИКЛ ~22. Найдена лаборатория клонирования. В капсулах — сотни ваших копий. Вы не человек. Вы — оружие, которое учится через смерть.' }
  ];

  const NOTES = [
    'ЗАПИСКА: «Код от двери 404 — стёрт. Придётся взрывать».',
    'ЗАПИСКА: «Они подмешивают ингибиторы в воду, чтобы мы не вспоминали прошлые циклы».',
    'ЗАПИСКА: «Служба безопасности носит броню 4-го класса. Цельтесь в сочленения».',
    'ЗАПИСКА: «Я видел, как Директор разговаривал с пустым экраном. ИИ управляет всем».',
    'ЗАПИСКА: «Если найдёшь эту записку — ты уже умирал. Не доверяй своей памяти».'
  ];

  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, STORY_CHAPTERS, NOTES };
})();
