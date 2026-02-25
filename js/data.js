window.GameData = (() => {
  const SAVE_KEY = 'forpost_dayclick_v3';
  const SAVE_VER = 3;
  const ENEMIES = [
    { name: 'Рейдер-рашер', hp: 36, dmg: 8, atk: 3.2, icon: '[!!]' },
    { name: 'Щитоносец', hp: 55, dmg: 6, atk: 4.8, armor: 0.25, icon: '[#]' },
    { name: 'Снайпер', hp: 28, dmg: 14, atk: 5.4, mark: true, icon: '[+]' },
    { name: 'Гончая', hp: 25, dmg: 7, atk: 2.8, icon: '[@]' }
  ];
  const ELITE_ENEMIES = [
    { name: 'Альфа-рейдер', hp: 80, dmg: 16, atk: 3.8, armor: 0.2, mark: true, icon: '[XXX]' },
    { name: 'Штурмовой бот', hp: 118, dmg: 18, atk: 4.2, armor: 0.35, icon: '[O_O]' }
  ];
  const LOCATIONS = [
    { name: 'Старый музей', icon: '[/|\\]', desc: 'Витрины разбиты, но внутри можно найти инструменты.', reward: { food: 2, water: 1, materials: 9, ammo: 3, caps: 5 }, danger: 0.27, elite: 0.35 },
    { name: 'Караванный рынок', icon: '[$$]', desc: 'Старые ряды торговли, редкие припасы и следы людей.', reward: { water: 4, materials: 5, ammo: 2, caps: 8 }, danger: 0.22, elite: 0.25 },
    { name: 'Блокпост', icon: '[|||]', desc: 'Здесь осталось военное снаряжение.', reward: { ammo: 7, materials: 6, medkits: 1, caps: 6 }, danger: 0.33, elite: 0.45 }
  ];
  const SHOP_ITEMS = [
    { key: 'food', label: '[F] Сухпаёк x6', amount: 6, price: 8, type: 'resource' },
    { key: 'water', label: '[W] Чистая вода x6', amount: 6, price: 8, type: 'resource' },
    { key: 'ammo', label: '[A] Патроны x14', amount: 14, price: 10, type: 'resource' },
    { key: 'medkits', label: '[+] Стимпак x1', amount: 1, price: 12, type: 'resource' },
    { key: 'weaponPipe', label: '[WPN] Самопал (+3 урона)', price: 22, type: 'weapon', weaponId: 'pipe' },
    { key: 'weaponLaser', label: '[WPN] Лазерный пистолет (+6 урона)', price: 34, type: 'weapon', weaponId: 'laser' }
  ];
  const CRAFT_ITEMS = [
    { label: '[🛠] Самодельный нож (+2 урона)', materials: 16, ammo: 0, unlock: 'knife' },
    { label: '[⚙] Модификация карабина (+4 урона)', materials: 24, ammo: 8, unlock: 'rifleMod' },
    { label: '[⚡] Импульсный модуль (+10 max HP)', materials: 22, ammo: 4, hpBoost: 10 }
  ];
  const STORY = [
    '> СИСТЕМНАЯ ЗАГРУЗКА... Память не найдена. Вы просыпаетесь на полу бункера.',
    '> На стене горит фосфорная надпись: «ФОРПОСТ». Это ваша единственная зацепка.',
    '> Выйдя наружу, вы видите лишь радиоактивный пепел и руины старого мира.',
    '> Торговец из Пустоши утверждает, что уже видел вас с другой группой выживших.',
    '> Вы принимаете решение выжить любой ценой и докопаться до истины своего прошлого.'
  ];
  const NOTES = [
    'LOG-01: «Если читаешь это, не доверяй Институту...»',
    'LOG-02: «Под рынком есть закрытый тоннель. Там хранятся довоенные схемы».',
    'LOG-03: «Форпост был лабораторией памяти. Возможно, мы все лишь подопытные».',
    'LOG-04: «Кодовая фраза: СЕВЕРНЫЙ СВЕТ. Доступ к терминалу Б-12».',
    'LOG-05: «Твой жетон найден у криокапсулы №7. Значит, это не первая попытка».',
  ];
  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, STORY, NOTES };
})();
