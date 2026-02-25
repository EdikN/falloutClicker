window.GameData = (() => {
  const SAVE_KEY = 'jericho_dayclick_v2';
  const SAVE_VER = 5;
  const ENEMIES = [
    { name: 'Кибер-мародер', hp: 36, dmg: 8, atk: 3.2, img: 'img/enemy_marauder.png', icon: '[!!]' },
    { name: 'Дрон-охранник', hp: 55, dmg: 6, atk: 4.8, armor: 0.25, img: 'img/enemy_drone.png', icon: '[#]' },
    { name: 'Синтетик', hp: 28, dmg: 14, atk: 5.4, mark: true, img: 'img/enemy_synth.png', icon: '[+]' },
    { name: 'Мутант', hp: 25, dmg: 7, atk: 2.8, img: 'img/enemy_mutant.png', icon: '[@]' }
  ];
  const ELITE_ENEMIES = [
    { name: 'Тяжелый страж', hp: 80, dmg: 16, atk: 3.8, armor: 0.2, mark: true, img: 'img/enemy_elite_guard.png', icon: '[XXX]' },
    { name: 'Прототип Ареса', hp: 118, dmg: 18, atk: 4.2, armor: 0.35, img: 'img/enemy_boss_ares.png', icon: '[O_O]' }
  ];
  const LOCATIONS = [
    { name: 'Брошенный серверный узел', icon: '[/|\\]', desc: 'Стеллажи с серверами разбиты, но здесь остались запчасти.', reward: { food: 2, water: 1, materials: 9, ammo: 3, caps: 5 }, danger: 0.27, elite: 0.35 },
    { name: 'Черный рынок', icon: '[$$]', desc: 'Нелегальные точки обмена, где еще можно найти припасы.', reward: { water: 4, materials: 5, ammo: 2, caps: 8 }, danger: 0.22, elite: 0.25 },
    { name: 'КПП Охраны', icon: '[|||]', desc: 'Блокпост с остатками военного снаряжения.', reward: { ammo: 7, materials: 6, medkits: 1, caps: 6 }, danger: 0.33, elite: 0.45 }
  ];
  const SHOP_ITEMS = [
    { key: 'food', label: '🍖 Паёк x6', amount: 6, price: 8, type: 'resource' },
    { key: 'water', label: '💧 Вода x6', amount: 6, price: 8, type: 'resource' },
    { key: 'ammo', label: '⚡ Патроны x14', amount: 14, price: 10, type: 'resource' },
    { key: 'medkits', label: '✚ Стимулятор x1', amount: 1, price: 12, type: 'resource' },
    { key: 'weaponPipe', label: '🔫 Шоковый пистолет (+3 урон)', price: 22, type: 'weapon', weaponId: 'pipe' },
    { key: 'weaponLaser', label: '💥 Плазменный резак (+6 урон)', price: 34, type: 'weapon', weaponId: 'laser' }
  ];
  const CRAFT_ITEMS = [
    { label: '🗡️ Вибро-клинок (+2 урон)', materials: 16, ammo: 0, unlock: 'knife' },
    { label: '🔋 Магнитный ускоритель (+4 урон)', materials: 24, ammo: 8, unlock: 'rifleMod' },
    { label: '🛡️ Бронепластины (+20 Здоровья)', materials: 22, ammo: 4, hpBoost: 20 }
  ];

  const STORY = [
    '> ЗАГРУЗКА БИОСИСТЕМ... Вы приходите в себя в техническом туннеле гигантской мегаструктуры. На вашем запястье выжжен штрих-код: «ИЕРИХОН-73».',
    '> Вокруг только металл и неон. Системы защиты комплекса сошли с ума — они уничтожают любую органику. Вы находите труп с таким же лицом, как у вас.',
    '> Торговец из Нижнего Яруса не берет с вас плату: «Я видел, как тебя расчленил Страж три недели назад. Если ты вернулся, Сервер всё еще играет с нами».',
    '> Вы понимаете. Вы — не человек. Вы — кибер-клон, в который загружают сознание. «ИЕРИХОН» — лаборатория тестирования.',
    '> Ваша директива: достичь Шпиля и отключить Ядро Искина. Если вы умрете сейчас — снова проснетесь в туннеле. Разорвите петлю.'
  ];
  const NOTES = [
    'ФАЙЛ_1: «Протокол "Иерихон" запущен. Оболочки-носители перерабатываются после смерти».',
    'ФАЙЛ_2: «Они искусственно вызывают у нас голод, чтобы симулировать человечность».',
    'ФАЙЛ_3: «В архиве Яруса 4 лежат миллионы отчетов об ошибках. Каждая ошибка — наша смерть».',
    'ФАЙЛ_4: «Не верь Службе Безопасности. Они такие же машины, просто с другими директивами».',
    'ФАЙЛ_5: «Мы провалились 941 раз. 942-й должен стать последним. Уничтожь Сервер».',
  ];
  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, STORY, NOTES };
})();
