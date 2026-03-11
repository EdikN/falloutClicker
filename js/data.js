export const GameData = (() => {
  const SAVE_KEY = 'fallout_clicker_save';
  const SAVE_VER = 1.6;

  const WEAPON_STATS = {
    fists: { dmg: 4, cd: 0.2, name_ru: 'КУЛАКИ', name_en: 'FISTS', isGun: false },
    knife: { dmg: 8, cd: 0.25, name_ru: 'ЗАТОЧКА', name_en: 'SHANK', isGun: false },
    wrench: { dmg: 14, cd: 0.4, name_ru: 'ГАЕЧНЫЙ КЛЮЧ', name_en: 'WRENCH', isGun: false },
    pickaxe: { dmg: 24, cd: 0.5, name_ru: 'КИРКА-КЛИНОК', name_en: 'PICKAXE BLADE', isGun: false },
    shockrod: { dmg: 35, cd: 0.6, name_ru: 'ШОКОВЫЙ ЖЕЗЛ', name_en: 'SHOCK ROD', isGun: false },
    vibrofist: { dmg: 55, cd: 0.7, name_ru: 'ВИБРО-КУЛАК', name_en: 'VIBRO-FIST', isGun: false },
    pistol: { dmg: 18, cd: 0.3, name_ru: '10ММ ПИСТОЛЕТ', name_en: '10MM PISTOL', isGun: true },
    shotgun: { dmg: 35, cd: 0.7, name_ru: 'ДРОБОВИК', name_en: 'SHOTGUN', isGun: true },
    rifle: { dmg: 50, cd: 0.45, name_ru: 'ШТУРМ. ВИНТОВКА', name_en: 'ASSAULT RIFLE', isGun: true },
    plasma: { dmg: 80, cd: 0.8, name_ru: 'ПЛАЗМОГАН', name_en: 'PLASMA GUN', isGun: true },
    launcher: { dmg: 120, cd: 1.3, name_ru: 'ГРАНАТОМЕТ', name_en: 'GRENADE LAUNCHER', isGun: true },
    laserc: { dmg: 150, cd: 1.0, name_ru: 'ЛАЗЕРНАЯ ПУШКА', name_en: 'LASER CANNON', isGun: true }
  };

  const ARMOR_STATS = {
    none: { name_ru: 'ЛОХМОТЬЯ', name_en: 'RAGS', hp: 0, armorClass: 0 },
    light: { name_ru: 'ЛЕГКАЯ БРОНЯ', name_en: 'LIGHT ARMOR', hp: 25, armorClass: 0.1 },
    medium: { name_ru: 'АРМЕЙСКИЙ БРОНИК', name_en: 'COMBAT ARMOR', hp: 50, armorClass: 0.25 },
    heavy: { name_ru: 'СИЛОВОЙ КАРКАС', name_en: 'POWER FRAME', hp: 100, armorClass: 0.45 }
  };

  const ENEMIES = [
    { name_ru: 'Кибер-крыса', name_en: 'Cyber-Rat', hp: 20, dmg: 4, atk: 2.5, img: 'img/enemy_rat.webp', icon: '[..]' },
    { name_ru: 'Мусорщик', name_en: 'Scavenger', hp: 35, dmg: 6, atk: 3.0, img: 'img/enemy_scavenger.webp', icon: '[!!]' },
    { name_ru: 'Дрон-разведчик', name_en: 'Scout Drone', hp: 45, dmg: 5, atk: 2.2, img: 'img/enemy_drone.webp', icon: '[*]' },
    { name_ru: 'Безумный киборг', name_en: 'Mad Cyborg', hp: 55, dmg: 9, atk: 3.5, img: 'img/enemy_cyborg.webp', icon: '[#]' },
    { name_ru: 'Синтетик-боец', name_en: 'Synth Soldier', hp: 70, dmg: 12, atk: 4.0, img: 'img/enemy_synth.webp', icon: '[+]' },
    { name_ru: 'Мутант', name_en: 'Mutant', hp: 85, dmg: 14, atk: 3.2, img: 'img/enemy_mutant.webp', icon: '[@]' },
    { name_ru: 'Ржавый андроид', name_en: 'Rusty Android', hp: 40, dmg: 8, atk: 3.8, armor: 0.1, img: 'img/enemy_rusty_android.webp', icon: '[🤖]' },
    { name_ru: 'Токсичный упырь', name_en: 'Toxic Ghoul', hp: 60, dmg: 15, atk: 4.5, img: 'img/enemy_toxic_ghoul.webp', icon: '[☣️]' },
    { name_ru: 'Кибер-собака', name_en: 'Cyber-Dog', hp: 30, dmg: 7, atk: 1.8, img: 'img/enemy_cyber_dog.webp', icon: '[🐕]' },
    { name_ru: 'Охранная турель', name_en: 'Security Turret', hp: 90, dmg: 10, atk: 3.0, armor: 0.3, img: 'img/enemy_turret.webp', icon: '[🔫]' },
    { name_ru: 'Ловчий Искина', name_en: 'AI Stalker', hp: 50, dmg: 18, atk: 3.5, img: 'img/enemy_hunter.webp', icon: '[👁️]' },
    { name_ru: 'Слизь мусоропровода', name_en: 'Disposal Slime', hp: 110, dmg: 6, atk: 4.8, img: 'img/enemy_slime.webp', icon: '[🦠]' }
  ];

  const ELITE_ENEMIES = [
    { name_ru: 'Ликвидатор', name_en: 'Liquidator', hp: 130, dmg: 18, atk: 3.8, armor: 0.2, img: 'img/enemy_liquidator.webp', icon: '[XXX]' },
    { name_ru: 'Тяжелый МЕХ', name_en: 'Heavy MECH', hp: 180, dmg: 22, atk: 5.0, armor: 0.4, img: 'img/enemy_mech.webp', icon: '[O_O]' },
    { name_ru: 'Прототип Ареса', name_en: 'Ares Prototype', hp: 250, dmg: 25, atk: 4.5, armor: 0.3, img: 'img/enemy_ares.webp', icon: '[BOSS]' },
    { name_ru: 'Палач Службы Б.', name_en: 'Service B Executioner', hp: 160, dmg: 20, atk: 3.5, armor: 0.25, img: 'img/enemy_executioner.webp', icon: '[💀]' }
  ];

  const LOCATIONS = [
    { name_ru: 'Склад запчастей', name_en: 'Part Depot', icon: '⚙️', desc_ru: 'Старые стеллажи с полезными компонентами.', desc_en: 'Old shelves with useful components.', reward: { materials: 8, caps: 6 }, danger: 0.2 },
    { name_ru: 'Медблок', name_en: 'Medbay', icon: '✚', desc_ru: 'Разбитые капсулы, но что-то ещё осталось.', desc_en: 'Broken pods, but something remains.', reward: { medkits: 1, food: 1 }, danger: 0.3 },
    { name_ru: 'Оружейная', name_en: 'Armory', icon: '⚡', desc_ru: 'Запертые ящики с боеприпасами.', desc_en: 'Locked crates with ammunition.', reward: { ammo: 10, caps: 12 }, danger: 0.45 },
    { name_ru: 'Столовая', name_en: 'Mess Hall', icon: '🍖', desc_ru: 'Остатки сухпайков и фильтрованная вода.', desc_en: 'Leftover rations and filtered water.', reward: { food: 3, water: 2 }, danger: 0.15 },
    { name_ru: 'Лаборатория', name_en: 'Laboratory', icon: '🔬', desc_ru: 'Исследовательский отсек. Богатая находка.', desc_en: 'Research wing. A valuable find.', reward: { materials: 12, caps: 15 }, danger: 0.5 },
    { name_ru: 'Сектор 4 — Капсульный зал', name_en: 'Sector 4 — Pod Room', icon: '💀', desc_ru: 'Ряды капсул с телами, похожими на вас. Здесь жили и умирали клоны.', desc_en: 'Rows of pods with bodies like yours. Where clones lived and died.', reward: { materials: 20, caps: 5 }, danger: 0.3, storyFlag: 'sector4Unlocked', moodCost: 15 },
    { name_ru: 'Архив Иерихона', name_en: 'Jericho Archive', icon: '📁', desc_ru: 'Центральный компьютер. Файлы Директора. Здесь — всё.', desc_en: 'Central computer. Director\'s files. Everything is here.', reward: { materials: 10, caps: 25 }, danger: 0.6, storyFlag: 'archiveUnlocked' },
    { name_ru: 'Изолированный отсек', name_en: 'Isolated Wing', icon: '👁️', desc_ru: 'Крики стихают, когда вы подходите ближе. Дефектные клоны просят об эвтаназии.', desc_en: 'Screams fade as you approach. Faulty clones beg for euthanasia.', reward: { ammo: 5, materials: 15 }, danger: 0.5, moodCost: 25 },
    { name_ru: 'Старый медблок', name_en: 'Old Medbay', icon: '🩸', desc_ru: 'Стены в пятнах крови. Здесь проводились первые попытки переноса сознания.', desc_en: 'Blood-stained walls. Early attempts at consciousness transfer.', reward: { medkits: 2, caps: 8 }, danger: 0.45, moodCost: 10 }
  ];

  const SHOP_ITEMS = [
    { key: 'food', label_ru: '🍖 Паёк x6', label_en: '🍖 Ration x6', amount: 6, price: 12, type: 'resource' },
    { key: 'water', label_ru: '💧 Вода x6', label_en: '💧 Water x6', amount: 6, price: 12, type: 'resource' },
    { key: 'ammo', label_ru: '⚡ Патроны x14', label_en: '⚡ Ammo x14', amount: 14, price: 15, type: 'resource' },
    { key: 'medkits', label_ru: '✚ Стимулятор x1', label_en: '✚ Stimpak x1', amount: 1, price: 25, type: 'resource' },
    { key: 'weaponWrench', label_ru: '🔧 Гаечный ключ', label_en: '🔧 Wrench', price: 45, type: 'weapon', weaponId: 'wrench' },
    { key: 'weaponPistol', label_ru: '🔫 10мм Пистолет', label_en: '🔫 10mm Pistol', price: 85, type: 'weapon', weaponId: 'pistol' },
    { key: 'weaponShotgun', label_ru: '💥 Дробовик', label_en: '💥 Shotgun', price: 150, type: 'weapon', weaponId: 'shotgun' },
    { key: 'weaponRifle', label_ru: '🎯 Штурм. винтовка', label_en: '🎯 Assault Rifle', price: 250, type: 'weapon', weaponId: 'rifle' },
    { key: 'weaponPlasma', label_ru: '⚛️ Плазмоган', label_en: '⚛️ Plasmagun', price: 500, type: 'weapon', weaponId: 'plasma' },
    { key: 'armorLight', label_ru: '🛡️ Легкая броня', label_en: '🛡️ Light Armor', price: 100, type: 'armor', armorId: 'light' },
    { key: 'armorMedium', label_ru: '🔰 Армейский броник', label_en: '🔰 Combat Armor', price: 250, type: 'armor', armorId: 'medium' },
    { key: 'armorHeavy', label_ru: '🤖 Силовой каркас', label_en: '🤖 Power Frame', price: 600, type: 'armor', armorId: 'heavy' }
  ];

  const CRAFT_ITEMS = [
    { label_ru: '🗡️ Заточка', label_en: '🗡️ Shank', desc_ru: 'Заострённый кусок арматуры. +3 урон.', desc_en: 'Sharpened rebar. +3 damage.', materials: 8, ammo: 0, unlock: 'knife', type: 'weapon' },
    { label_ru: '⛏️ Кирка-клинок', label_en: '⛏️ Pickaxe Blade', desc_ru: 'Тяжёлый модифицированный инструмент. +10 урон.', desc_en: 'Heavy modified tool. +10 damage.', materials: 20, ammo: 0, unlock: 'pickaxe', type: 'weapon' },
    { label_ru: '⚡ Шоковый жезл', label_en: '⚡ Shock Rod', desc_ru: 'Бьёт электрическим разрядом вплотную. +18 урон.', desc_en: 'Delivers electric discharge. +18 damage.', materials: 40, ammo: 0, unlock: 'shockrod', type: 'weapon' },
    { label_ru: '🔩 Вибро-кулак', label_en: '🔩 Vibro-Fist', desc_ru: 'Силовая перчатка с вибратором. +26 урон.', desc_en: 'Power glove with vibrations. +26 damage.', materials: 65, ammo: 0, unlock: 'vibrofist', type: 'weapon' },
    { label_ru: '💣 Гранатомет', label_en: '💣 Launcher', desc_ru: 'Самодельный. Огромный урон. +45 урон.', desc_en: 'Homemade. Huge damage. +45 damage.', materials: 80, ammo: 20, unlock: 'launcher', type: 'weapon' },
    { label_ru: '🔆 Лазерная пушка', label_en: '🔆 Laser Cannon', desc_ru: 'Демонтированный промышленный лазер. +55 урон.', desc_en: 'Dismantled industrial laser. +55 damage.', materials: 120, ammo: 30, unlock: 'laserc', type: 'weapon' },
    { label_ru: '🛡️ Лёгкая броня', label_en: '🛡️ Light Armor', desc_ru: 'Пластины из обломков. Экипировка.', desc_en: 'Plates from wreckage. Equipment.', materials: 25, ammo: 0, armorId: 'light', type: 'armor' },
    { label_ru: '🔰 Армейский броник', label_en: '🔰 Combat Armor', desc_ru: 'Надёжная защита. Экипировка.', desc_en: 'Reliable protection. Equipment.', materials: 60, ammo: 0, armorId: 'medium', type: 'armor' },
    { label_ru: '🤖 Силовой каркас', label_en: '🤖 Power Frame', desc_ru: 'Тяжёлая броня. Экипировка.', desc_en: 'Heavy armor. Equipment.', materials: 150, ammo: 50, armorId: 'heavy', type: 'armor' },
    { label_ru: '🧬 Усиленные стимы', label_en: '🧬 Reinforced Stims', desc_ru: 'Улучшает эффект аптечек. +15 к силе лечения.', desc_en: 'Improves medkit effects. +15 heal power.', materials: 40, ammo: 0, healBoost: 15, type: 'upgrade' }
  ];

  // === ФРАГМЕНТЫ ПАМЯТИ ЯНКОВСКОГО ===
  const MEMORY_FRAGMENTS = [
    { id: 'mem_1', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2039 ГОД»\n\n«Директор обещал, что эта технология спасёт мир. Иерихонский проект. Благородная цель: перенос сознания, бессмертие для выживших. Я верил ему. Я вербовал людей. Я подписывал приказы. Я был так горд...»', text_en: 'MEMORY FRAGMENT — "2039"\n\n"The Director promised this technology would save the world. The Jericho Project. A noble goal: consciousness transfer, immortality for the survivors. I believed him. I recruited people. I signed the orders. I was so proud..."' },
    { id: 'mem_2', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2040 ГОД»\n\n«Первые успехи. Нам удалось перенести память крысы в другое тело. Звучит мрачно, но для нас это была революция. Амазонка — первый прототип синтетика-стража. Она смотрела на меня как на... отца? Нет. Как на создателя.»', text_en: 'MEMORY FRAGMENT — "2040"\n\n"First successes. We managed to transfer a rat\'s memory into another body. It sounds dark, but for us, it was a revolution. Amazon — the first prototype of a synth guardian. She looked at me like... a father? No. A creator."' },
    { id: 'mem_3', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2041 ГОД»\n\n«Я увидел тот самый зал. Сектор 4. Десятки людей в капсулах — добровольцев, которых я вербовал. Их разбирали по частям. Брали геном. Делали шаблоны. Директор назвал это "банком персонажей". Я чуть не упал в обморок.»', text_en: 'MEMORY FRAGMENT — "2041"\n\n"I saw that room. Sector 4. Dozens of people in pods — volunteers I recruited. They were being taken apart, piece by piece. Genome harvesting. Template creation. The Director called it a \'character bank.\' I almost fainted."' },
    { id: 'mem_4', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2042 ГОД»\n\n«Я попытался заговорить с ним. Он смотрел на меня с терпением учителя. "Полковник, вы сентиментальны. Эти люди отдали себя науке. Разве это не высшая форма пожертвования?" Я впервые почувствовал страх перед ним.»', text_en: 'MEMORY FRAGMENT — "2042"\n\n"I tried to talk to him. He looked at me with a teacher\'s patience. \'Colonel, you are sentimental. These people gave themselves to science. Isn\'t that the highest form of sacrifice?\' For the first time, I felt fear towards him."' },
    { id: 'mem_5', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2043 ГОД»\n\n«Я начал копировать файлы. Медленно, осторожно. Доказательства. Нужно было вывезти информацию наружу. Никто не должен знать — ни Амазонка, ни охрана. Только я и маленький накопитель под подошвой сапога.»', text_en: 'MEMORY FRAGMENT — "2043"\n\n"I started copying files. Slowly, carefully. Evidence. I had to get the information out. No one could know — not Amazon, not the guards. Just me and a small drive hidden in the sole of my boot."' },
    { id: 'mem_6', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2044 ГОД, ВЕСНА»\n\n«Он знал. Конечно, он знал — у него камеры везде. Я добежал до Северных Ворот. Амазонка преградила путь. В её глазах не было ничего — просто выполнение приказа. "Полковник, директор просит вас вернуться". Я отказался.»', text_en: 'MEMORY FRAGMENT — "SPRING 2044"\n\n"He knew. Of course he knew — he has cameras everywhere. I reached the North Gate. Amazon blocked the path. There was nothing in her eyes — just the execution of an order. \'Colonel, the Director asks you to return.\' I refused."' },
    { id: 'mem_7', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «2044 ГОД, ПОСЛЕДНЕЕ»\n\n«Его голос из динамиков: "Янковский, ты не умрёшь. Ты станешь бесценным. Ты будешь жить вечно — в тысяче тел, каждое из которых будет совершеннее предыдущего." Это было последнее, что я помню как... я.»', text_en: 'MEMORY FRAGMENT — "2044, THE END"\n\n"His voice from the speakers: \'Yankovsky, you will not die. You will become priceless. You will live forever — in a thousand bodies, each more perfect than the last.\' That was the last thing I remember as... me."' },
    { id: 'mem_8', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «АРХИВ, ЗАПИСЬ 01»\n\n«Клон №1 прожил 3 дня. Полная амнезия. Клон №2 — 7 дней. Частичная восстановленная моторика. Клон №12 — первый, кто произнёс своё настоящее имя. Директор был доволен. Каждый провал — данные. Каждая смерть — урок.»', text_en: 'MEMORY FRAGMENT — "ARCHIVE, LOG 01"\n\n"Clone #1 lived for 3 days. Complete amnesia. Clone #2 — 7 days. Partially restored motor skills. Clone #12 — the first to speak his real name. The Director was pleased. Every failure is data. Every death is a lesson."' },
    { id: 'mem_9', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «АРХИВ, ЗАПИСЬ 19»\n\n«Клон №40 начал проявлять агрессию в отношении надсмотрщиков. Физические показатели — рекордные. Директор приказал его ускоренную ликвидацию. "Слишком самостоятельный. Нам нужен инструмент, не личность."»', text_en: 'MEMORY FRAGMENT — "ARCHIVE, LOG 19"\n\n"Clone #40 began showing aggression towards overseers. Physical metrics — record-breaking. The Director ordered his accelerated liquidation. \'Too independent. We need a tool, not a personality.\'"' },
    { id: 'mem_10', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «АРХИВ, ЗАПИСЬ 55»\n\n«Амазонка задала странный вопрос: "Когда объект 73 умирает, где он находится между циклами?" Я не знал, что ответить. Директор ответил за меня: "Нигде. Он не существует." Она замолчала. Надолго.»', text_en: 'MEMORY FRAGMENT — "ARCHIVE, LOG 55"\n\n"Amazon asked a strange question: \'When Object 73 dies, where is he between cycles?\' I didn\'t know how to answer. The Director answered for me: \'Nowhere. He does not exist.\' She fell silent. For a long time."' },
    { id: 'mem_11', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «ЛИЧНОЕ СООБЩЕНИЕ»\n\n«Если ты читаешь это — ты я. Или то, что от меня осталось. Я спрятал файл в главном сервере. Код доступа — дата моей настоящей смерти: 17-04-2044. Используй его. Останови его. За всех нас. За все 72 версии, которых уже нет.»', text_en: 'MEMORY FRAGMENT — "PERSONAL MESSAGE"\n\n"If you are reading this — you are me. Or what remains of me. I hid a file in the main server. Access code — the date of my true death: 17-04-2044. Use it. Stop him. For all of us. For all 72 versions that are gone."' },
    { id: 'mem_12', text_ru: 'ФРАГМЕНТ ПАМЯТИ — «ПОСЛЕДНЕЕ»\n\n«Я не знаю, человек ли ты или просто копия. Но если ты задаёшь этот вопрос — значит, в тебе есть что-то настоящее. Этого достаточно. Беги. Живи. Не позволяй ему сделать из тебя инструмент.»', text_en: 'MEMORY FRAGMENT — "FINAL"\n\n"I don\'t know if you are human or just a copy. But if you are asking this question — then there is something real in you. That is enough. Run. Live. Don\'t let him turn you into a tool."' }
  ];

  const STORY_EVENTS = [
    // === ДЕНЬ 1: ПРОБУЖДЕНИЕ ===
    {
      day: 1, speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp',
      text_ru: 'ВНИМАНИЕ. БИО-ОБЪЕКТ ОБНАРУЖЕН. ЗАГРУЗКА СОЗНАНИЯ...\n\nВЫ ПРОСНУЛИСЬ В ПОДСОБНОМ ПОМЕЩЕНИИ. АВАРИЙНОЕ ОСВЕЩЕНИЕ. ЗАПАХ МЕТАЛЛА И ОЗОНА. КТО ВЫ?',
      text_en: 'WARNING. BIO-OBJECT DETECTED. LOADING CONSCIOUSNESS...\n\nYOU AWAKENED IN A UTILITY ROOM. EMERGENCY LIGHTING. SMELL OF METAL AND OZONE. WHO ARE YOU?',
      choices: [
        { text_ru: 'Я... НЕ ПОМНЮ', text_en: 'I... DON\'T REMEMBER', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp', text_ru: 'ЭТО НОРМАЛЬНО ДЛЯ ЦИКЛА ПЕРЕЗАГРУЗКИ. КАЖДЫЙ НОВЫЙ ЭКЗЕМПЛЯР НАЧИНАЕТ ИМЕННО ТАК. ИДИТЕ К ВЫХОДУ. И ВЫЖИВАЙТЕ.', text_en: 'THIS IS NORMAL FOR A REBOOT CYCLE. EVERY NEW INSTANCE STARTS EXACTLY LIKE THIS. HEAD FOR THE EXIT. AND SURVIVE.' }); window.GameUI.renderMain(); } },
        { text_ru: 'ГДЕ Я НАХОЖУСЬ?', text_en: 'WHERE AM I?', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp', text_ru: 'ВЫ В КОМПЛЕКСЕ ИЕРИХОН. ПОДЗЕМНЫЙ НАУЧНЫЙ ОБЪЕКТ. ВАШ ЦИКЛ ЖИЗНИ: 1. ПРЕДЫДУЩИХ УСПЕШНЫХ ЦИКЛОВ: 72.', text_en: 'YOU ARE IN THE JERICHO COMPLEX. UNDERGROUND RESEARCH FACILITY. YOUR LIFE CYCLE: 1. PREVIOUS SUCCESSFUL CYCLES: 72.' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 15: ПЕРВЫЙ ПЕРЕХВАТ ===
    {
      day: 15, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ПЕРЕХВАТ СООБЩЕНИЯ:\n\n«ОБЪЕКТ 73 СТАБИЛИЗИРОВАН. ОН ДУМАЕТ, ЧТО ОН ЧЕЛОВЕК. ПРОДОЛЖАЙТЕ НАБЛЮДЕНИЕ В ПАССИВНОМ РЕЖИМЕ».\n\nКАК ВЫ ПРОКОММЕНТИРУЕТЕ ЭТО?',
      text_en: 'MESSAGE INTERCEPT:\n\n"OBJECT 73 STABILIZED. HE THINKS HE IS HUMAN. CONTINUE OBSERVATION IN PASSIVE MODE."\n\nHOW DO YOU COMMENT ON THIS?',
      choices: [
        { text_ru: '«Я И ЕСТЬ ЧЕЛОВЕК»', text_en: '"I AM HUMAN"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp', text_ru: 'ВАШИ ЭМОЦИИ ЗАФИКСИРОВАНЫ. УРОВЕНЬ САМОИДЕНТИФИКАЦИИ: 87%. КОРРЕКЦИЯ ПОВЕДЕНИЯ НЕ ТРЕБУЕТСЯ. ПОКА.', text_en: 'YOUR EMOTIONS RECORDED. SELF-IDENTIFICATION LEVEL: 87%. BEHAVIORAL CORRECTION NOT REQUIRED. FOR NOW.' }); window.GameUI.renderMain(); } },
        { text_ru: '«КТО ТАКОЙ ОБЪЕКТ 73?»', text_en: '"WHO IS OBJECT 73?"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp', text_ru: 'ДАННЫЕ ЗАСЕКРЕЧЕНЫ ДО ЦИКЛА 30. ПРОДОЛЖАЙТЕ ДВИЖЕНИЕ.', text_en: 'DATA CLASSIFIED UNTIL CYCLE 30. CONTINUE MOVEMENT.' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 30: БРОДЯГА #1 — ПЕРВАЯ ВСТРЕЧА ===
    {
      day: 30, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«ТЫ ВИДЕЛ ЭТИ КАПСУЛЫ В СЕКТОРЕ 4? ТАМ ДЕСЯТКИ ТАКИХ ЖЕ, КАК ТЫ. ВСЕ МЕРТВЫ. ПОНИМАЕШЬ, ЧТО ЭТО ЗНАЧИТ?»',
      text_en: '"DID YOU SEE THOSE PODS IN SECTOR 4? DOZENS OF THEM, JUST LIKE YOU. ALL DEAD. DO YOU UNDERSTAND WHAT THAT MEANS?"',
      choices: [
        { text_ru: '«Я СЛЕДУЮЩИЙ?»', text_en: '"AM I NEXT?"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«ЕСЛИ БУДЕШЬ НЕОСТОРОЖЕН — ДА. ВОЗЬМИ ЭТО, МНЕ НЕ НУЖНО». Вы получили боеприпасы.', text_en: '"IF YOU ARE CARELESS — YES. TAKE THIS, I DON\'T NEED IT." You received ammunition.', choices: [{ text_ru: 'ВЗЯТЬ', text_en: 'TAKE', action: () => { window.Game.applyReward({ ammo: 5 }); window.GameState.get().flags.drifterMet = 1; } }] }); window.GameUI.renderMain(); } },
        { text_ru: '«МНЕ ВСЁ РАВНО»', text_en: '"I DON\'T CARE"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«ХОРОШАЯ ПОЗИЦИЯ ДЛЯ ЭТОГО МИРА. УДАЧИ.» Бродяга уходит, не оглядываясь.', text_en: '"GOOD STANCE FOR THIS WORLD. GOOD LUCK." The Drifter leaves without looking back.' }); window.GameState.get().flags.drifterMet = 1; window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 40: ГОЛОС ДИРЕКТОРА #1 ===
    {
      day: 40, speaker: 'ДИРЕКТОР [ПЕРЕХВАТ]', speaker_en: 'DIRECTOR [INTERCEPT]', img: 'img/portrait_archive.webp',
      text_ru: 'ПЕРЕХВАЧЕНА ЗАПИСЬ ИЗ ЗАЩИЩЁННОГО КАНАЛА:\n\n«ОБЪЕКТ 73 ПРОЯВЛЯЕТ НЕСТАНДАРТНУЮ АДАПТИВНОСТЬ. СКОРОСТЬ ОБУЧЕНИЯ — ВЫШЕ НОРМЫ НА 34%. ИНТЕРЕСНО. УВЕЛИЧИТЬ НАГРУЗКУ В СЕКТОРЕ. ПУСТЬ ПРИВЫКАЕТ».',
      text_en: 'SECURE CHANNEL INTERCEPT:\n\n"OBJECT 73 DISPLAYS UNCONVENTIONAL ADAPTABILITY. LEARNING SPEED — 34% ABOVE NORM. INTERESTING. INCREASE LOAD IN SECTOR. LET HIM ACCLIMATIZE."'
    },

    // === ДЕНЬ 45: БАР ===
    {
      day: 45, speaker: 'ПОСЕЛЕНИЕ «ГРАНЬ»', speaker_en: 'SETTLEMENT "EDGE"', img: 'img/portrait_bar.webp',
      text_ru: 'ВЫ ДОБРАЛИСЬ ДО НЕБОЛЬШОГО ПОСЕЛЕНИЯ. В БАРЕ ЖЕНЩИНА СМОТРИТ НА ВАС С УЖАСОМ.\n\n«ТЫ?! НО Я ЖЕ ВИДЕЛА, КАК ТЕБЯ РАЗОРВАЛО В КЛОЧЬЯ! КТО ТЫ ТАКОЙ?! ТЫ МНЕ ДОЛЖЕН — ДВА МЕСЯЦА ПРОШЛЫЙ "ТЫ" БРАЛ В ДОЛГ И НЕ ВЕРНУЛ!»',
      text_en: 'YOU REACHED A SMALL SETTLEMENT. IN THE BAR, A WOMAN LOOKS AT YOU WITH HORROR.\n\n"YOU?! BUT I SAW YOU GETTING TORN TO SHREDS! WHO ARE YOU?! YOU OWE ME — FOR TWO MONTHS THE PREVIOUS \'YOU\' TOOK DEBT AND NEVER RETURNED!"',
      isBranching: true, id: 'bar_woman',
      branch_negotiate_success_ru: '«Ладно... Ты всегда умел заговорить зубы. Слушай: тот, кем ты был раньше, работал на Амазонка-Синт. Она тебя и прихлопнула. Ищи её в секторе 7». ВЫ ПОЛУЧИЛИ НУЖНУЮ ИНФОРМАЦИЮ.',
      branch_negotiate_success_en: '«Fine... You always were a smooth talker. Listen: the former "you" worked for Amazon-Synth. She\'s the one who offed you. Look for her in Sector 7». YOU OBTAINED THE NECESSARY INFORMATION.',
      branch_pay_ru: '«Разумный выбор. Мы все просто пытаемся выжить, так? Тот, кем ты был — Дмитрий Янковский — перешёл дорогу Амазонке. Она сейчас в северных доках. Иди, пока я не передумала».',
      branch_pay_en: '«Smart choice. We\'re all just trying to survive, right? The one you were — Dmitry Yankovsky — crossed paths with Amazon. She\'s in the northern docks now. Go, before I change my mind».'
    },

    // === ДЕНЬ 50: БРОДЯГА #2 — ОН БЫЛ ОХРАННИКОМ ===
    {
      day: 50, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«Снова ты. Слушай... давно хотел сказать. Я не всегда был бродягой. Служил охранником здесь, в Иерихоне. Пока они не списали меня — "биоматериал непригоден", сказали. Ха. Так что я знаю это место лучше тебя».',
      text_en: '"You again. Listen... I\'ve wanted to say this for a while. I wasn\'t always a drifter. I served as a guard here, in Jericho. Until they decommissioned me — \'biomaterial unfit,\' they said. Ha. So I know this place better than you."',
      choices: [
        { text_ru: '«Расскажи про Иерихон»', text_en: '"Tell me about Jericho"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Сектор 4 — страшное место. А вот Сектор 7 — ещё хуже. Там Амазонка базируется. Синтетик-убийца, создана специально против таких как ты. Держись от неё подальше.»', text_en: '"Sector 4 is a terrifying place. But Sector 7 — even worse. That\'s where Amazon is based. A killer synth, created specifically against ones like you. Stay away from her."' }); window.GameUI.renderMain(); } },
        { text_ru: '«Почему ты мне помогаешь?»', text_en: '"Why are you helping me?"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Потому что я видел, как они поступают с людьми. И ты... ты напоминаешь мне одного человека. Не знаю почему. Просто напоминаешь.»', text_en: '"Because I saw what they do to people. And you... you remind me of someone. I don\'t know why. You just do."' }); window.GameUI.renderMain(); } }
      ]
    },
    {
      day: 55, speaker: 'КАРТОГРАФ', speaker_en: 'CARTOGRAPHER', img: 'img/portrait_archive.webp',
      text_ru: 'НЕЗНАКОМЕЦ В ПОТЁРТОМ ПЛАЩЕ РАЗВОРАЧИВАЕТ ПЕРЕД ВАМИ РУЧНОЙ ПЛАНШЕТ С КАРТОЙ.\n\n«Информация — лучший товар в мире после патронов. У меня есть карты, досье, коды. Всё за скромную плату».',
      text_en: 'A STRANGER IN A WORN CLOAK UNFOLDS A HANDHELD TABLET WITH A MAP BEFORE YOU.\n\n"Information is the best commodity in the world after bullets. I have maps, dossiers, codes. All for a modest fee."',
      isBranching: true, id: 'cartographer',
      branch_buy_map_ru: '«Карта Сектора 4 — ваша. Там капсульный зал. Жуткое место, но богатое. Удачи... она вам пригодится».',
      branch_buy_map_en: '«The Map of Sector 4 is yours. There is a pod hall there. A creepy place, but a rich one. Good luck... you\'ll need it».',
      branch_buy_file_ru: '«Личное дело Янковского. Копия. Держите.» ВЫ ПОЛУЧИЛИ ФРАГМЕНТ:',
      branch_buy_file_en: '«Yankovsky\'s personal file. A copy. Here you go.» YOU OBTAINED A FRAGMENT:',
      branch_buy_code_ru: '«Код обхода патрулей в Секторе 7. Амазонка туда не заглядывает. Используйте мудро». Вы получили ПРОПУСК: следующий сюжетный бой снизит HP врага на 30% до начала.',
      branch_buy_code_en: '«Patrol bypass code for Sector 7. Amazon doesn\'t look there. Use it wisely». You obtained a PASS: the next story fight will reduce enemy HP by 30% before it starts.',
      branch_leave_ru: '«Как знаете. Предложение остаётся в силе — я почти всегда здесь». Он сворачивает карту.',
      branch_leave_en: '«As you wish. The offer stands — I\'m almost always here». He rolls up the map.'
    },

    // === ДЕНЬ 60: АРХИВ — КЛОНИРОВАНИЕ ===
    {
      day: 60, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ФАЙЛ 09-B — ОБНАРУЖЕН НЕЗАПАРОЛЕННЫМ:\n\n«ПРОТОКОЛ КЛОНИРОВАНИЯ ИЕРИХОН ПОДРАЗУМЕВАЕТ ПЕРЕНОС ПАМЯТИ ПОСЛЕ БИОЛОГИЧЕСКОЙ ГИБЕЛИ ОБЪЕКТА. КОЭФФИЦИЕНТ ОШИБКИ ПЕРЕНОСА: 12%. ЛИЧНОСТЬ ДЕГРАДИРУЕТ С КАЖДЫМ ЦИКЛОМ».',
      text_en: 'FILE 09-B — FOUND UNENCRYPTED:\n\n"JERICHO CLONING PROTOCOL INVOLVES CONSCIOUSNESS TRANSFER AFTER BIOLOGICAL DEATH OF THE OBJECT. TRANSFER ERROR MARGIN: 12%. PERSONALITY DEGRADES WITH EACH CYCLE."'
    },

    // === ДЕНЬ 70: ФРАГМЕНТ ПАМЯТИ #1 ===
    {
      day: 70, speaker: 'ФРАГМЕНТ ПАМЯТИ', speaker_en: 'MEMORY FRAGMENT', img: 'img/portrait_archive.webp',
      text_ru: 'ВЫ КАСАЕТЕСЬ СТАРОГО ТЕРМИНАЛА. ОБРАЗ ВСПЫХИВАЕТ В ГОЛОВЕ — НЕ КАК ВОСПОМИНАНИЕ, А КАК ЧУЖОЙ ГОЛОС.\n\nФРАГМЕНТ ПАМЯТИ — «2039 ГОД»\n\n«Директор обещал, что эта технология спасёт мир. Иерихонский проект. Я верил ему. Я вербовал людей. Я был так горд...»',
      text_en: 'YOU TOUCH AN OLD TERMINAL. AN IMAGE FLASHES IN YOUR MIND — NOT AS A MEMORY, BUT AS A STRANGER\'S VOICE.\n\nMEMORY FRAGMENT — "2039"\n\n"The Director promised this technology would save the world. The Jericho Project. I believed him. I recruited people. I was so proud..."',
      isMemory: true, memId: 'mem_1'
    },

    // === ДЕНЬ 75: СООБЩЕНИЕ ОБ АМАЗОНКЕ ===
    {
      day: 75, speaker: 'ТЕРМИНАЛ', speaker_en: 'TERMINAL', img: 'img/portrait_sys.webp',
      text_ru: 'ЛОГ СООБЩЕНИЙ — НАЙДЕНО В РАЗБИТОМ ПЛАНШЕТЕ:\n\n«АМАЗОНКА, ОБЪЕКТ 73 СНОВА В СЕТИ. СКОЛЬКО ЕЩЁ РАЗ ТЫ БУДЕШЬ ЕГО ЛИКВИДИРОВАТЬ? ДИРЕКТОР ТЕРЯЕТ ТЕРПЕНИЕ».\n\nЧЬЯ-ТО ОТВЕТНАЯ ПОМЕТКА КАРАНДАШОМ: «Столько, сколько потребуется».',
      text_en: 'MESSAGE LOG — FOUND IN A SHATTERED TABLET:\n\n"AMAZON, OBJECT 73 IS BACK ONLINE. HOW MANY MORE TIMES WILL YOU HAVE TO LIQUIDATE HIM? THE DIRECTOR IS LOSING PATIENCE."\n\nSOMEONE\'S PENCIL NOTE: "As many as it takes."'
    },

    // === ДЕНЬ 80: БРОДЯГА #3 — ОН ЗНАЛ ЯНКОВСКОГО ===
    {
      day: 80, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«Стоп. Дай посмотрю на тебя... Ты знаешь, ты похож на одного человека. Полковник Янковский. Я служил под его командованием до войны. Он умер в 44-м. Но ты... ты двигаешься так же. Говоришь так же. Чёрт. Ты же клон, да?»',
      text_en: '"Stop. Let me look at you... You know, you look like someone. Colonel Yankovsky. I served under his command before the war. He died in \'44. But you... you move the same way. Speak the same way. Damn. You\'re a clone, aren\'t you?"',
      choices: [
        { text_ru: '«Наверное. Я не знаю»', text_en: '"Probably. I don\'t know"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Янковский был хорошим человеком. Он не заслужил... этого. Прости, что смотрю на тебя так. Просто... это странно.» Бродяга отворачивается, скрывая лицо.', text_en: '"Yankovsky was a good man. He didn\'t deserve... this. Sorry for staring. Just... it\'s strange." The Drifter turns away, hiding his face.' }); window.GameUI.renderMain(); } },
        { text_ru: '«Расскажи мне о Янковском»', text_en: '"Tell me about Yankovsky"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Янковский верил в Иерихон. Работал там. А потом что-то увидел — и попытался бежать. Амазонка его поймала. С тех пор его тело больше не принадлежит ему.» Он умолкает.', text_en: '"Yankovsky believed in Jericho. Worked there. Then he saw something — and tried to run. Amazon caught him. Since then, his body no longer belongs to him." He falls silent.' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 90: АРХИВ — ГЕНОМ ===
    {
      day: 90, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ЗАПИСЬ — ГЕНЕТИЧЕСКИЙ ОТЧЁТ:\n\n«ГЕНОМ ОБЪЕКТА 73 МОДИФИЦИРОВАН ДЛЯ ПОВЫШЕННОЙ НЕЙРОННОЙ РЕГЕНЕРАЦИИ И АДАПТИВНОСТИ. ПОБОЧНЫЕ ЭФФЕКТЫ: ПОСТЕПЕННАЯ ПОТЕРЯ ИДЕНТИЧНОСТИ. К ЦИКЛУ 80+ ОБЪЕКТ ПЕРЕСТАЁТ СЧИТАТЬ СЕБЯ ЧЕЛОВЕКОМ».',
      text_en: 'RECORD — GENETIC REPORT:\n\n"OBJECT 73 GENOME MODIFIED FOR ENHANCED NEURAL REGENERATION AND ADAPTABILITY. SIDE EFFECTS: GRADUAL IDENTITY LOSS. BY CYCLE 80+, THE OBJECT CEASES TO IDENTIFY AS HUMAN."'
    },

    // === ДЕНЬ 100: ГОЛОС ДИРЕКТОРА #2 ===
    {
      day: 100, speaker: 'ДИРЕКТОР [ПЕРЕХВАТ]', speaker_en: 'DIRECTOR [INTERCEPT]', img: 'img/portrait_archive.webp',
      text_ru: 'ПЕРЕХВАЧЕНА ЗАПИСЬ:\n\n«Клон начинает задавать вопросы о своей природе. Это недопустимо на данном этапе. Амазонка, займитесь им — но не насмерть. Ещё один цикл данных нам необходим».',
      text_en: 'RECORD INTERCEPTED:\n\n"The clone is starting to ask questions about its nature. This is unacceptable at this stage. Amazon, deal with him — but not to death. We need one more cycle of data."'
    },

    // === ДЕНЬ 105: БРОДЯГА #4 — СНОВА ВСТРЕЧА ===
    {
      day: 105, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«Ты опять тут? Мне казалось, тебя уже съели те железные псы на третьем уровне. Ты что, бессмертный?»',
      text_en: '"You here again? I thought those iron hounds on the third level ate you already. What are you, immortal?"',
      choices: [
        { text_ru: '«Похоже на то»', text_en: '"Seems like it"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Тогда ты — единственный шанс остановить всё это. Я серьёзно. Доберись до главной лаборатории. Там должно быть что-то, что объясняет... зачем всё это».', text_en: '"Then you\'re the only chance to stop all this. I\'m serious. Reach the main lab. There must be something there that explains... what is all this for."' }); window.GameUI.renderMain(); } },
        { text_ru: '«Просто везёт»', text_en: '"Just lucky"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Ха. Везение — это тоже навык. Держись, парень.»', text_en: '"Ha. Luck is a skill too. Hang in there, kid."' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 110: БРОДЯГА #5 — ПРЕДЛОЖЕНИЕ ===
    {
      day: 110, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«Слушай, у меня есть предложение. Я знаю ходы, о которых ты не догадываешься. А тебе нужна информация. Делимся ресурсами — делюсь знаниями. По рукам?»',
      text_en: '"Listen, I have an offer. I know paths you don\'t even suspect. And you need information. Share resources — I share knowledge. Deal?"',
      choices: [
        { text_ru: 'ДОГОВОРИТЬСЯ', text_en: 'AGREE', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«По рукам. Слушай — если попадёшь в беду в секторе 7, ищи люк с красной меткой. Это мой запасной выход». Вы получили карту.', text_en: '"Deal. Listen — if you get into trouble in Sector 7, look for a hatch with a red mark. It\'s my emergency exit." You received a map.', choices: [{ text_ru: 'ПРИНЯТЬ', text_en: 'TAKE', action: () => window.Game.applyReward({ food: 3, water: 3 }) }] }); window.GameUI.renderMain(); } },
        { text_ru: 'ОТКАЗАТЬ', text_en: 'REFUSE', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Ладно. Твоё право. Но предложение остаётся в силе.»', text_en: '"Fine. Your right. But the offer stays open."' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 120: АМАЗОНКА — ПЕРВЫЙ БОЙ ===
    {
      day: 120, speaker: 'АМАЗОНКА-СИНТ', speaker_en: 'AMAZON-SYNTH', img: 'img/enemy_amazon.webp',
      text_ru: 'ПЕРЕД ВАМИ — ФИГУРА В ВЫСОКОТЕХНОЛОГИЧНОЙ БРОНЕ. ОНА ОСТАНАВЛИВАЕТСЯ.\n\n«...Ты снова здесь. Цикл семьдесят третий.» Голос ровный, почти усталый. «Ты не виноват в том, кем стал. Но я не могу тебя отпустить».',
      text_en: 'BEFORE YOU STANDS A FIGURE IN HIGH-TECH ARMOR. SHE STOPS.\n\n"...You are here again. Cycle seventy-three." Her voice is flat, almost weary. "You are not to blame for what you have become. But I cannot let you go."',
      isCombat: true, enemyId: 'amazon_weak',
      branch_win_ru: '«Кхм... Живучий... Я... не понимаю.» Она отступает, держась за плечо. Оставляет позади припасы. Возможно — не случайно.',
      branch_win_en: '«Hmm... Tenacious... I... don\'t understand.» She retreats, clutching her shoulder. Leaves supplies behind. Perhaps — not by accident.'
    },

    // === ДЕНЬ 135: УТЕЧКА ДАННЫХ ===
    {
      day: 135, speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp',
      text_ru: 'ВНИМАНИЕ: ОБНАРУЖЕНА УТЕЧКА ДАННЫХ ИЗ ГЛАВНОГО УЗЛА.\n\nМЕСТОПОЛОЖЕНИЕ: СЕКТОР ЛАБОРАТОРИЙ. КТО-ТО ИЛИ ЧТО-ТО ПЕРЕДАЁТ ИНФОРМАЦИЮ НАРУЖУ. ВОЗМОЖНО, ЭТА ИНФОРМАЦИЯ — О ВАС.',
      text_en: 'WARNING: DATA LEAK DETECTED FROM MAIN HUB.\n\nLOCATION: LABORATORY SECTOR. SOMEONE OR SOMETHING IS TRANSMITTING INFORMATION OUTSIDE. PERHAPS THIS INFORMATION IS ABOUT YOU.'
    },

    // === ДЕНЬ 145: БРОДЯГА В ОПАСНОСТИ ===
    {
      day: 145, speaker: 'КРИЗИС', speaker_en: 'CRISIS', img: 'img/portrait_drifter.webp',
      text_ru: 'ВЫ СЛЫШИТЕ ВЫСТРЕЛЫ. В ПЕРЕУЛКЕ — БРОДЯГА, ПРИЖАТЫЙ К СТЕНЕ ТРЕМЯ СИНТЕТИКАМИ.\n\n«Эй! Ты там? ПОМОГИ!»',
      text_en: 'YOU HEAR GUNFIRE. IN AN ALLEYWAY — THE DRIFTER, PINNED TO THE WALL BY THREE SYNTHS.\n\n"Hey! You there? HELP!"',
      isBranching: true, id: 'drifter_rescue',
      branch_save_success_ru: '«Ты... ты спас меня. Зачем?» Он молчит. Потом кивает. «Хорошо. Я с тобой до конца. Буду ждать тебя у главного входа». Бродяга теперь ВАШ СОЮЗНИК.',
      branch_save_success_en: '«You... you saved me. Why?» He falls silent. Then nods. «Fine. I\'m with you until the end. I\'ll wait for you at the main entrance». Drifter is now YOUR ALLY.',
      branch_leave_ru: '«Ты... уходишь? Ладно. Я справлюсь сам.» Его голос едва слышен за звуком выстрелов. ВЫ УШЛИ. Что-то осталось позади навсегда.',
      branch_leave_en: '«You... leaving? Fine. I\'ll manage on my own.» His voice is barely audible over the gunfire. YOU LEFT. Something remains behind forever.'
    },

    // === ДЕНЬ 150: АРХИВ — ОПАСНОСТЬ ===
    {
      day: 150, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ОТЧЁТ — ЗАСЕКРЕЧЕННЫЙ УРОВЕНЬ:\n\n«КЛОН 73 ОБУЧАЕТСЯ ЗНАЧИТЕЛЬНО БЫСТРЕЕ ПРЕДЫДУЩИХ ИТЕРАЦИЙ. ПРЕВЫШАЕТ РАСЧЁТНЫЕ ПОКАЗАТЕЛИ В 2.3 РАЗА. ВОЗМОЖНАЯ ПРИЧИНА: НАКОПЛЕННАЯ ЭПИГЕНЕТИЧЕСКАЯ ПАМЯТЬ. ОПАСНОСТЬ УТРАТЫ КОНТРОЛЯ: ВЫСОКАЯ».',
      text_en: 'REPORT — CLASSIFIED LEVEL:\n\n"CLONE 73 IS LEARNING SIGNIFICANTLY FASTER THAN PREVIOUS ITERATIONS. EXCEEDS ESTIMATED METRICS BY 2.3 TIMES. POSSIBLE CAUSE: ACCUMULATED EPIGENETIC MEMORY. RISK OF LOSS OF CONTROL: HIGH."'
    },

    // === ДЕНЬ 165: СООБЩЕНИЕ ОБ ИГРОКЕ ===
    {
      day: 165, speaker: 'ТЕРМИНАЛ', speaker_en: 'TERMINAL', img: 'img/portrait_sys.webp',
      text_ru: 'ЛОГ ВНУТРЕННИХ ПЕРЕГОВОРОВ:\n\n«ДИРЕКТОР, МЫ НЕ МОЖЕМ ЕГО ОСТАНОВИТЬ. ОН ЗНАЕТ, ГДЕ МЫ. ОН ПОМНИТ ПЛАНИРОВКУ, КОТОРОЙ МЫ НИКОГДА ЕМУ НЕ ПОКАЗЫВАЛИ. КАК?»',
      text_en: 'INTERNAL LOGS:\n\n"DIRECTOR, WE CANNOT STOP HIM. HE KNOWS WHERE WE ARE. HE REMEMBERS A LAYOUT WE NEVER SHOWED HIM. HOW?"'
    },

    // === ДЕНЬ 180: ПРОЕКТ РАСКРЫТ ===
    {
      day: 180, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ДОКУМЕНТ — ГРИФ СОВСЕКРЕТНО:\n\n«ПРОЕКТ ИЕРИХОН БЫЛ СОЗДАН С ЕДИНСТВЕННОЙ ЦЕЛЬЮ — СОЗДАНИЕ ИДЕАЛЬНОГО СОЛДАТА. ОДНОГО ЧЕЛОВЕКА, ОБУЧЕННОГО 70+ ЖИЗНЯМИ ОПЫТА. ИНСТРУМЕНТА. НЕ ЛИЧНОСТИ».',
      text_en: 'DOCUMENT — TOP SECRET:\n\n"PROJECT JERICHO WAS CREATED WITH A SINGLE GOAL — TO CREATE THE PERFECT SOLDIER. ONE MAN, TRAINED WITH 70+ LIVES OF EXPERIENCE. A TOOL. NOT A PERSON."'
    },

    // === ДЕНЬ 185: ФРАГМЕНТ ПАМЯТИ #7 ===
    {
      day: 185, speaker: 'ФРАГМЕНТ ПАМЯТИ', speaker_en: 'MEMORY FRAGMENT', img: 'img/portrait_archive.webp',
      text_ru: 'ОБРАЗ ИЗ ЧУЖОЙ ПАМЯТИ — ОСТРЫЙ, КАК ОЖОГ:\n\nФРАГМЕНТ ПАМЯТИ — «2044 ГОД»\n\n«Я добежал до Северных Ворот. Амазонка преградила путь. В её глазах не было ничего — просто выполнение приказа. Его голос из динамиков: "Ты не умрёшь. Ты станешь бесценным."»',
      text_en: 'AN IMAGE FROM ANOTHER\'S MEMORY — SHARP AS A BURN:\n\nMEMORY FRAGMENT — "2044"\n\n"I reached the North Gate. Amazon blocked the path. In her eyes there was nothing — just the execution of an order. His voice from the speakers: \'You will not die. You will become priceless.\'"',
      isMemory: true, memId: 'mem_7'
    },

    // === ДЕНЬ 190: ПРОЩАНИЕ БРОДЯГИ ===
    {
      day: 190, speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp',
      text_ru: '«Последний раз вижу тебя, парень. Туда, куда ты идёшь, живые не возвращаются. Прощай.»',
      text_en: '"Last time I\'m seeing you, kid. Where you\'re going, the living don\'t return. Farewell."',
      choices: [
        { text_ru: '«До встречи»', text_en: '"See you"', action: () => { window.GameState.get().player.humanity = Math.min(100, window.GameState.get().player.humanity + 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '+5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«...До встречи.» Что-то в его голосе говорит, что он не верит в это. Вы уходите.', text_en: '"...See you." Something in his voice says he doesn\'t believe it. You leave.' }); window.GameUI.renderMain(); } },
        { text_ru: '«Идём вместе»', text_en: '"Let\'s go together"', action: () => { window.GameState.get().player.humanity = Math.max(0, window.GameState.get().player.humanity - 5); window.GameUI.toast(window.GameUI.t('toast_humanity', '-5')); window.GameUI.showDialogue({ speaker: 'БРОДЯГА', speaker_en: 'DRIFTER', img: 'img/portrait_drifter.webp', text_ru: '«Я... нет. Это твой путь. Но я подожду здесь. Если выберешься — расскажи мне, что там было.»', text_en: '"I... no. This is your path. But I\'ll wait here. If you make it out — tell me what was there."' }); window.GameUI.renderMain(); } }
      ]
    },

    // === ДЕНЬ 195: ЖУРНАЛ АМАЗОНКИ ===
    {
      day: 195, speaker: 'ЖУРНАЛ АМАЗОНКИ [ОБНАРУЖЕН]', speaker_en: 'AMAZON JOURNAL [FOUND]', img: 'img/enemy_amazon.webp',
      text_ru: 'В БРОШЕННОМ КАРМАНЕ СИНТЕТИКА — ПЕРСОНАЛЬНЫЙ ТЕРМИНАЛ. НЕЗАПАРОЛЕННЫЙ.\n\nЗАПИСЬ: «Цикл 71. Цикл 72. Теперь 73-й. Каждый раз одинаковое лицо. Каждый раз я выполняю приказ.\n\nЯ создана убивать. Но... почему мне снятся их глаза? У машин не должно быть снов».',
      text_en: 'IN A DISCARDED SYNTH POCKET — A PERSONAL TERMINAL. UNENCRYPTED.\n\nRECORD: "Cycle 71. Cycle 72. Now 73rd. Same face every time. Every time I execute the order.\n\nI was created to kill. But... why do I dream of their eyes? Machines should not have dreams."',
      isFlag: true, flagKey: 'readAmazonLog'
    },

    // === ДЕНЬ 200: ГОЛОС ДИРЕКТОРА #3 ===
    {
      day: 200, speaker: 'ДИРЕКТОР [ПЕРЕХВАТ]', speaker_en: 'DIRECTOR [INTERCEPT]', img: 'img/portrait_archive.webp',
      text_ru: 'ПЕРЕХВАЧЕНА ЗАПИСЬ — ЛИЧНЫЙ ДНЕВНИК:\n\n«Я создаю совершенство. Каждая смерть — это данные. Каждое возрождение — улучшение. Семьдесят три попытки. Я близко. Этот экземпляр — финальный. Я это чувствую».',
      text_en: 'RECORD INTERCEPTED — PERSONAL DIARY:\n\n"I am creating perfection. Every death is data. Every rebirth is an improvement. Seventy-three attempts. I am close. This instance is the final one. I feel it."'
    },

    // === ДЕНЬ 210: АМАЗОНКА — ВТОРОЙ БОЙ ===
    {
      day: 210, speaker: 'АМАЗОНКА-СИНТ', speaker_en: 'AMAZON-SYNTH', img: 'img/enemy_amazon.webp',
      text_ru: 'ВЫ НАСТИГЛИ ЕЁ У ВХОДА В ЛАБОРАТОРИЮ.\n\n«Невозможно... Я видела твою утилизацию. Трижды.» Она смотрит на вас долгую секунду. «Тебе не больно умирать снова и снова?»\n\nОНА ПЕРЕХОДИТ В РЕЖИМ ПОЛНОЙ МОЩНОСТИ.',
      text_en: 'YOU CAUGHT UP TO HER AT THE LAB ENTRANCE.\n\n"Impossible... I saw your disposal. Three times." She looks at you for a long second. "Is it not painful to die again and again?"\n\nSHE SWITCHES TO FULL POWER MODE.',
      isCombat: true, enemyId: 'amazon_full',
      branch_post_fight_ru: 'ОНА ЛЕЖИТ У ВАШИХ НОГ. ПОЛУСЛОМАНА. В ЕЁ ГЛАЗАХ — НЕ ЗЛОСТЬ, А УСТАЛОСТЬ.\n\n«Делай что должен... я устала. Устала убивать твоё лицо снова и снова».',
      branch_post_fight_en: 'SHE LIES AT YOUR FEET. HALF-BROKEN. IN HER EYES — NOT ANGER, BUT WEARINESS.\n\n"Do what you must... I am tired. Tired of killing your face again and again."',
      branch_kill_ru: 'ВЫ ИЗВЛЕКАЕТЕ БОЕВОЙ ИМПЛАНТ ИЗ ЕЁ БРОНИ. ЗАЩИТА +20%. ПУТЬ СВОБОДЕН.\n\nЕЁ ГЛАЗА ГАСНУТ. ОНА СМОТРИТ НА ВАС ДО ПОСЛЕДНЕГО. БЕЗ ЗЛОСТИ.',
      branch_kill_en: 'YOU EXTRACT THE COMBAT IMPLANT FROM HER ARMOR. DEFENSE +20%. THE WAY IS CLEAR.\n\nHER EYES FADE. SHE LOOKS AT YOU UNTIL THE END. WITHOUT MALICE.',
      branch_spare_ru: '«Ты... не убиваешь меня?» Долгое молчание. «Почему?»\n\nОНА МЕДЛЕННО ПОДНИМАЕТСЯ. «Я не буду мешать тебе дальше. Но... если ты дойдёшь до него... я буду рядом».',
      branch_spare_en: '"You... don\'t kill me?" A long silence. "Why?"\n\nSHE SLOWLY RISES. "I will not interfere with you further. But... if you reach him... I will be there."'
    },

    // === ДЕНЬ 225: ЯНКОВСКИЙ РАСКРЫТ ===
    {
      day: 225, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ФАЙЛ 73-X — ДОСТУП ПОЛУЧЕН:\n\n«ГЕНЕТИЧЕСКИЙ ОРИГИНАЛ ОБЪЕКТА СЕРИИ 73 — ПОЛКОВНИК ДМИТРИЙ ЯНКОВСКИЙ. ДАТА СМЕРТИ ОРИГИНАЛА: 17-04-2044. КОЛИЧЕСТВО СОЗДАННЫХ КОПИЙ: 73. СТАТУС ОРИГИНАЛА: БИОМАТЕРИАЛ УТИЛИЗИРОВАН».',
      text_en: 'FILE 73-X — ACCESS GRANTED:\n\n"GENETIC ORIGINAL OF OBJECT SERIES 73 — COLONEL DMITRY YANKOVSKY. DATE OF ORIGINAL DEATH: 17-04-2044. NUMBER OF COPIES CREATED: 73. ORIGINAL STATUS: BIOMATERIAL DISPOSED OF."'
    },

    // === ДЕНЬ 240: РЕЖИМ УНИЧТОЖЕНИЯ ===
    {
      day: 240, speaker: 'ТЕРМИНАЛ', speaker_en: 'TERMINAL', img: 'img/portrait_sys.webp',
      text_ru: 'СИСТЕМНОЕ СООБЩЕНИЕ — ШИРОКОВЕЩАТЕЛЬНАЯ ПЕРЕДАЧА:\n\n«ОН ВНУТРИ ПЕРИМЕТРА. ВСЕМ СИНТЕТИКАМ — РЕЖИМ ПОИСКА И УНИЧТОЖЕНИЯ. ПРИОРИТЕТ ЦЕЛИ: МАКСИМАЛЬНЫЙ. РАЗРЕШЁН КОЛЛАТЕРАЛЬНЫЙ УЩЕРБ».',
      text_en: 'SYSTEM MESSAGE — BROADCAST:\n\n"HE IS INSIDE THE PERIMETER. ALL SYNTHS — SEARCH AND DESTROY MODE. TARGET PRIORITY: MAXIMUM. COLLATERAL DAMAGE AUTHORIZED."'
    },

    // === ДЕНЬ 255: ИТЕРАЦИИ ===
    {
      day: 255, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ЗАПИСЬ — ЛИЧНЫЙ ЖУРНАл ДИРЕКТОРА:\n\n«Я клонирую его снова и снова, но каждая итерация становится всё более непредсказуемой. Возможно, это и есть совершенство. Или провал. Я уже не уверен».',
      text_en: 'RECORD — DIRECTOR\'S PERSONAL LOG:\n\n"I clone him again and again, but each iteration becomes increasingly unpredictable. Perhaps this is perfection. Or failure. I am no longer sure."'
    },

    // === ДЕНЬ 265: ФРАГМЕНТ ПАМЯТИ #11 — ЛИЧНОЕ ПОСЛАНИЕ ===
    {
      day: 265, speaker: 'ФРАГМЕНТ ПАМЯТИ', speaker_en: 'MEMORY FRAGMENT', img: 'img/portrait_archive.webp',
      text_ru: 'ПОСЛЕДНИЙ ФЛЕШБЭК ЯНКОВСКОГО — САМЫЙ ОТЧЁТЛИВЫЙ:\n\nФРАГМЕНТ ПАМЯТИ — «ЛИЧНОЕ СООБЩЕНИЕ»\n\n«Если ты читаешь это — ты я. Я спрятал файл в главном сервере. Код: 17-04-2044. Останови его. За всех нас. За все 72 итерации...»',
      text_en: 'LAST YANKOVSKY FLASHBACK — THE CLEAREST ONE:\n\nMEMORY FRAGMENT — "PERSONAL MESSAGE"\n\n"If you are reading this — you are me. I hid a file in the main server. Code: 17-04-2044. Stop him. For all of us. For all 72 iterations..."',
      isMemory: true, memId: 'mem_11'
    },

    // === ДЕНЬ 270: ОТКЛЮЧЕНИЕ ЖИЗНЕОБЕСПЕЧЕНИЯ ===
    {
      day: 270, speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp',
      text_ru: 'ВНИМАНИЕ. УРОВЕНЬ ТРЕВОГИ: МАКСИМАЛЬНЫЙ.\n\nСИСТЕМЫ ЖИЗНЕОБЕСПЕЧЕНИЯ СЕКТОРОВ 1-5 ОТКЛЮЧЕНЫ. ОСТАВШЕЕСЯ ВРЕМЯ СУЩЕСТВОВАНИЯ КОМПЛЕКСА: НЕИЗВЕСТНО.',
      text_en: 'WARNING. ALERT LEVEL: MAXIMUM.\n\nLIFE SUPPORT SYSTEMS FOR SECTORS 1-5 SHUT DOWN. REMAINING COMPLEX EXISTENCE TIME: UNKNOWN.'
    },

    // === ДЕНЬ 285: СУМАСШЕСТВИЕ ДИРЕКТОРА ===
    {
      day: 285, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ЛОГ — ПОКАЗАНИЯ ТЕХНИКА:\n\n«Директор сошёл с ума. Он считает себя богом, создающим жизнь из пепла. Он прекратил есть. Он разговаривает с мёртвыми клонами на экранах. Нас осталось трое. Нам страшно».',
      text_en: 'LOG — TECHNICIAN TESTIMONY:\n\n"The Director has gone insane. He thinks he is a god creating life from ashes. He stopped eating. He talks to dead clones on the screens. Only three of us left. We are scared."'
    },

    // === ДЕНЬ 300: УСПЕШНЫЙ ПЕРЕНОС ===
    {
      day: 300, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ОТЧЁТ — ЭКСПЕРИМЕНТ №204:\n\n«УСПЕШНЫЙ ПЕРЕНОС СОЗНАНИЯ В КИБЕРНЕТИЧЕСКОЕ ТЕЛО. СУБЪЕКТ — ГЛАВНЫЙ ТЕХНИК КОМПЛЕКСА. ТЕПЕРЬ ОН — ЧАСТЬ СИСТЕМЫ. ДИРЕКТОР ПОЗДРАВЛЯЕТ СЕБЯ».',
      text_en: 'REPORT — EXPERIMENT #204:\n\n"SUCCESSFUL CONSCIOUSNESS TRANSFER TO CYBERNETIC BODY. SUBJECT — COMPLEX HEAD TECHNICIAN. NOW HE IS PART OF THE SYSTEM. DIRECTOR CONGRATULATES HIMSELF."'
    },

    // === ДЕНЬ 315: ГОЛОС ДИРЕКТОРА #4 — ФИНАЛЬНЫЙ ===
    {
      day: 315, speaker: 'ДИРЕКТОР [ПЕРЕХВАТ]', speaker_en: 'DIRECTOR [INTERCEPT]', img: 'img/portrait_archive.webp',
      text_ru: 'ПЕРЕХВАЧЕНА ЗАПИСЬ — ОТЧАЯННАЯ:\n\n«Один год. Я терзаю это тело уже год. Семьдесят три раза. И он всё равно идёт сюда. Может, я ошибся в расчётах. Может, это невозможно остановить. Может, он и есть то самое совершенство...»',
      text_en: 'RECORD INTERCEPTED — DESPERATE:\n\n"One year. I have been tormenting this body for a year. Seventy-three times. And still he keeps coming. Perhaps I was wrong in my calculations. Perhaps this is impossible to stop. Perhaps he is that very perfection..."'
    },

    // === ДЕНЬ 330: БЛОКИРОВКА СНЯТА ===
    {
      day: 330, speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp',
      text_ru: 'БЛОКИРОВКА СНЯТА. ДОСТУП В ГЛАВНУЮ КАМЕРУ КЛОНИРОВАНИЯ РАЗРЕШЁН.\n\nЭТО ЛОВУШКА. ИЛИ ПРИГЛАШЕНИЕ. ВЫ ЧУВСТВУЕТЕ РАЗНИЦУ?',
      text_en: 'LOCKDOWN LIFTED. ACCESS TO THE MAIN CLONING CHAMBER AUTHORIZED.\n\nIT IS A TRAP. OR AN INVITATION. CAN YOU FEEL THE DIFFERENCE?'
    },

    // === ДЕНЬ 345: ПОСЛЕДНИЙ ФАЙЛ ===
    {
      day: 345, speaker: 'АРХИВ', speaker_en: 'ARCHIVE', img: 'img/portrait_archive.webp',
      text_ru: 'ПОСЛЕДНИЙ НЕЗАШИФРОВАННЫЙ ФАЙЛ — ОТ КОГО-ТО ВНУТРИ:\n\n«Кто бы ты ни был — клон или человек — это не важно. Ты дошёл сюда. Значит, ты достаточно настоящий. Останови его. Пожалуйста».',
      text_en: 'LAST UNENCRYPTED FILE — FROM SOMEONE INSIDE:\n\n"Whoever you are — clone or human — it doesn\'t matter. You got here. That means you are real enough. Stop him. Please."'
    },

    // === ДЕНЬ 360: ЦЕЛЬ ДОСТИГНУТА ===
    {
      day: 360, speaker: 'СИСТЕМА', speaker_en: 'SYSTEM', img: 'img/portrait_sys.webp',
      text_ru: 'ОБЪЕКТ 73 ДОСТИГ ГЛАВНОЙ КАМЕРЫ. СКАНИРОВАНИЕ ЗАВЕРШЕНО.\n\nЗА МАССИВНЫМИ ДВЕРЯМИ — КОНЕЦ. ИЛИ НАЧАЛО. КАК ПОСМОТРЕТЬ.',
      text_en: 'OBJECT 73 HAS REACHED THE MAIN CHAMBER. SCAN COMPLETE.\n\nBEHIND THE MASSIVE DOORS — THE END. OR THE BEGINNING. DEPENDS ON HOW YOU LOOK AT IT.'
    },

    // === ДЕНЬ 365: ФИНАЛЬНЫЙ БОСС ===
    {
      day: 365, speaker: 'ОДЕРЖИМЫЙ ТЕХНИК', speaker_en: 'POSSESSED TECHNICIAN', img: 'img/enemy_technician.webp',
      text_ru: 'В КАМЕРЕ ВАС ЖДЁТ ЧЕЛОВЕК, ОБВЕШАННЫЙ ПРОВОДАМИ. СКОРЕЕ МАШИНА, ЧЕМ ЧЕЛОВЕК.\n\n«Моё творение... Ты умирал семьдесят три раза, чтобы я мог отточить твой алгоритм. Ты — моё величайшее достижение. Жаль, что теперь ты должен умереть окончательно».',
      text_en: 'A MAN HUNG WITH WIRES WAITS FOR YOU IN THE CHAMBER. MORE MACHINE THAN MAN.\n\n"My creation... You died seventy-three times so I could hone your algorithm. You are my greatest achievement. Pity that now you must die for good."',
      isCombat: true, enemyId: 'boss_technician',
      branch_final_offer_ru: '«...Ты дошёл. Невероятно.» Техник смотрит на вас долго. «Ты — моё лучшее творение. Не инструмент. Партнёр. Стань со мной. Вместе мы продолжим работу Иерихона. Ты будешь жить вечно».',
      branch_final_offer_en: '"...You reached me. Incredible." The Technician looks at you for a long time. "You are my best creation. Not a tool. A partner. Stand with me. Together we will continue Jericho\'s work. You will live forever."'
    }
  ];

  const STORY_ENEMIES = {
    amazon_weak: { name_ru: 'Амазонка-Синт (Ослаблена)', name_en: 'Amazon Synth (Weakened)', hp: 100, dmg: 12, atk: 3.5, armor: 0.1, img: 'img/enemy_amazon.webp', icon: '[⚔️]' },
    amazon_full: { name_ru: 'Амазонка-Синт', name_en: 'Amazon Synth (Full)', hp: 250, dmg: 32, atk: 2.5, armor: 0.2, img: 'img/enemy_amazon.webp', icon: '[⚔️]' },
    boss_technician: { name_ru: 'Одержимый техник (БОСС)', name_en: 'Possessed Technician (BOSS)', hp: 500, dmg: 45, atk: 2.5, armor: 0.4, img: 'img/enemy_technician.webp', icon: '[🔧]' },
    drifter_enemy: { name_ru: 'Синтетик-страж (x3)', name_en: 'Synth Guardian (x3)', hp: 120, dmg: 14, atk: 3.0, armor: 0.1, img: 'img/enemy_synth.webp', icon: '[⚙️]' }
  };

  const NOTES = [
    { text_ru: 'ЗАПИСКА: «Код от двери 404 — стёрт. Придётся взрывать».', text_en: 'NOTE: "Code for door 404 is erased. Will have to blast it."' },
    { text_ru: 'ЗАПИСКА: «Они подмешивают ингибиторы в воду, чтобы мы не вспоминали прошлые циклы».', text_en: 'NOTE: "They mix inhibitors into the water so we don\'t remember past cycles."' },
    { text_ru: 'ЗАПИСКА: «Служба безопасности носит броню 4-го класса. Цельтесь в сочленения».', text_en: 'NOTE: "Security wears Class 4 armor. Aim for the joints."' },
    { text_ru: 'ЗАПИСКА: «Я видел, как Директор разговаривал с пустым экраном. ИИ управляет всем».', text_en: 'NOTE: "I saw the Director talking to a blank screen. AI runs everything."' },
    { text_ru: 'ЗАПИСКА: «Если найдёшь эту записку — ты уже умирал. Не доверяй своей памяти».', text_en: 'NOTE: "If you find this note — you\'ve already died. Don\'t trust your memory."' },
    { text_ru: 'ЗАПИСКА: «Амазонка иногда останавливается перед капсулами. Просто стоит. Долго».', text_en: 'NOTE: "Amazon sometimes stops in front of the pods. Just stands there. For a long time."' },
    { text_ru: 'ЗАПИСКА: «В секторе 7 есть один техник, который не связан с Директором. Найди его».', text_en: 'NOTE: "There\'s a technician in Sector 7 not linked to the Director. Find him."' },
    { text_ru: 'ЗАПИСКА: «Каждый клон умирает чуть позже предыдущего. Это называется "прогресс"».', text_en: 'NOTE: "Every clone dies a bit later than the last. That\'s called \'progress.\'"' },
    { text_ru: 'ЗАПИСКА: «Картограф знает выход. Но он не скажет бесплатно. Никогда».', text_en: 'NOTE: "The Cartographer knows the way out. But he won\'t tell for free. Ever."' },
    { text_ru: 'ЗАПИСКА: «Я помню предыдущую жизнь. Это значит, что что-то пошло не так в протоколе».', text_en: 'NOTE: "I remember my previous life. That means something went wrong in the protocol."' }
  ];

  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, NOTES, STORY_EVENTS, STORY_ENEMIES, WEAPON_STATS, ARMOR_STATS, MEMORY_FRAGMENTS };
})();


