window.GameData = (() => {
  const SAVE_KEY = 'fallout_clicker_save';
  const SAVE_VER = 1.4;

  // ХАРАКТЕРИСТИКИ ОРУЖИЯ (dmg - урон, cd - откат в секундах, isGun - требует патроны)
  const WEAPON_STATS = {
    fists: { dmg: 4, cd: 0.2, name: 'КУЛАКИ', isGun: false },
    knife: { dmg: 8, cd: 0.25, name: 'ЗАТОЧКА', isGun: false },
    wrench: { dmg: 14, cd: 0.4, name: 'ГАЕЧНЫЙ КЛЮЧ', isGun: false },
    pickaxe: { dmg: 24, cd: 0.5, name: 'КИРКА-КЛИНОК', isGun: false },
    shockrod: { dmg: 35, cd: 0.6, name: 'ШОКОВЫЙ ЖЕЗЛ', isGun: false },
    vibrofist: { dmg: 55, cd: 0.7, name: 'ВИБРО-КУЛАК', isGun: false },
    pistol: { dmg: 18, cd: 0.3, name: '10ММ ПИСТОЛЕТ', isGun: true },
    shotgun: { dmg: 35, cd: 0.7, name: 'ДРОБОВИК', isGun: true },
    rifle: { dmg: 50, cd: 0.45, name: 'ШТУРМ. ВИНТОВКА', isGun: true },
    plasma: { dmg: 80, cd: 0.8, name: 'ПЛАЗМОГАН', isGun: true },
    launcher: { dmg: 120, cd: 1.3, name: 'ГРАНАТОМЕТ', isGun: true },
    laserc: { dmg: 150, cd: 1.0, name: 'ЛАЗЕРНАЯ ПУШКА', isGun: true }
  };

  const ARMOR_STATS = {
    none: { name: 'ЛОХМОТЬЯ', hp: 0, armorClass: 0 },
    light: { name: 'ЛЕГКАЯ БРОНЯ', hp: 25, armorClass: 0.1 },
    medium: { name: 'АРМЕЙСКИЙ БРОНИК', hp: 50, armorClass: 0.25 },
    heavy: { name: 'СИЛОВОЙ КАРКАС', hp: 100, armorClass: 0.45 }
  };

  // ОБЫЧНЫЕ ПРОТИВНИКИ
  const ENEMIES = [
    { name: 'Кибер-крыса', hp: 20, dmg: 4, atk: 2.5, img: 'img/enemy_rat.png', icon: '[..]' },
    { name: 'Мусорщик', hp: 35, dmg: 6, atk: 3.0, img: 'img/enemy_scavenger.png', icon: '[!!]' },
    { name: 'Дрон-разведчик', hp: 45, dmg: 5, atk: 2.2, img: 'img/enemy_drone.png', icon: '[*]' },
    { name: 'Безумный киборг', hp: 55, dmg: 9, atk: 3.5, img: 'img/enemy_cyborg.png', icon: '[#]' },
    { name: 'Синтетик-боец', hp: 70, dmg: 12, atk: 4.0, img: 'img/enemy_synth.png', icon: '[+]' },
    { name: 'Мутант', hp: 85, dmg: 14, atk: 3.2, img: 'img/enemy_mutant.png', icon: '[@]' },
    { name: 'Ржавый андроид', hp: 40, dmg: 8, atk: 3.8, armor: 0.1, img: 'img/enemy_rusty_android.png', icon: '[🤖]' },
    { name: 'Токсичный упырь', hp: 60, dmg: 15, atk: 4.5, img: 'img/enemy_toxic_ghoul.png', icon: '[☣️]' },
    { name: 'Кибер-собака', hp: 30, dmg: 7, atk: 1.8, img: 'img/enemy_cyber_dog.png', icon: '[🐕]' },
    { name: 'Охранная турель', hp: 90, dmg: 10, atk: 3.0, armor: 0.3, img: 'img/enemy_turret.png', icon: '[🔫]' },
    { name: 'Ловчий Искина', hp: 50, dmg: 18, atk: 3.5, img: 'img/enemy_hunter.png', icon: '[👁️]' },
    { name: 'Слизь мусоропровода', hp: 110, dmg: 6, atk: 4.8, img: 'img/enemy_slime.png', icon: '[🦠]' }
  ];

  // ЭЛИТНЫЕ ПРОТИВНИКИ И БОССЫ
  const ELITE_ENEMIES = [
    { name: 'Ликвидатор', hp: 130, dmg: 18, atk: 3.8, armor: 0.2, img: 'img/enemy_liquidator.png', icon: '[XXX]' },
    { name: 'Тяжелый МЕХ', hp: 180, dmg: 22, atk: 5.0, armor: 0.4, img: 'img/enemy_mech.png', icon: '[O_O]' },
    { name: 'Прототип Ареса', hp: 250, dmg: 25, atk: 4.5, armor: 0.3, img: 'img/enemy_ares.png', icon: '[BOSS]' },
    { name: 'Палач Службы Б.', hp: 160, dmg: 20, atk: 3.5, armor: 0.25, img: 'img/enemy_executioner.png', icon: '[💀]' }
  ];

  const LOCATIONS = [
    { name: 'Склад запчастей', icon: '⚙️', desc: 'Старые стеллажи с полезными компонентами.', reward: { materials: 8, caps: 6 }, danger: 0.2 },
    { name: 'Медблок', icon: '✚', desc: 'Разбитые капсулы, но что-то ещё осталось.', reward: { medkits: 1, food: 1 }, danger: 0.3 },
    { name: 'Оружейная', icon: '⚡', desc: 'Запертые ящики с боеприпасами.', reward: { ammo: 10, caps: 12 }, danger: 0.45 },
    { name: 'Столовая', icon: '🍖', desc: 'Остатки сухпайков и фильтрованная вода.', reward: { food: 3, water: 2 }, danger: 0.15 },
    { name: 'Лаборатория', icon: '🔬', desc: 'Исследовательский отсек. Богатая находка.', reward: { materials: 12, caps: 15 }, danger: 0.5 }
  ];

  // МАГАЗИН
  const SHOP_ITEMS = [
    { key: 'food', label: '🍖 Паёк x6', amount: 6, price: 12, type: 'resource' },
    { key: 'water', label: '💧 Вода x6', amount: 6, price: 12, type: 'resource' },
    { key: 'ammo', label: '⚡ Патроны x14', amount: 14, price: 15, type: 'resource' },
    { key: 'medkits', label: '✚ Стимулятор x1', amount: 1, price: 25, type: 'resource' },
    { key: 'weaponWrench', label: '🔧 Гаечный ключ', price: 45, type: 'weapon', weaponId: 'wrench' },
    { key: 'weaponPistol', label: '🔫 10мм Пистолет', price: 85, type: 'weapon', weaponId: 'pistol' },
    { key: 'weaponShotgun', label: '💥 Дробовик', price: 150, type: 'weapon', weaponId: 'shotgun' },
    { key: 'weaponRifle', label: '🎯 Штурм. винтовка', price: 250, type: 'weapon', weaponId: 'rifle' },
    { key: 'weaponPlasma', label: '⚛️ Плазмоган', price: 500, type: 'weapon', weaponId: 'plasma' }
  ];

  // СИНТЕЗАТОР
  const CRAFT_ITEMS = [
    {
      label: '🗡️ Заточка',
      desc: 'Заострённый кусок арматуры. +3 урон. Не нужны патроны.',
      materials: 8, ammo: 0, unlock: 'knife', type: 'weapon'
    },
    {
      label: '⛏️ Кирка-клинок',
      desc: 'Тяжёлый модифицированный инструмент. +10 урон. Не нужны патроны.',
      materials: 20, ammo: 0, unlock: 'pickaxe', type: 'weapon'
    },
    {
      label: '⚡ Шоковый жезл',
      desc: 'Бьёт электрическим разрядом вплотную. +18 урон. Не нужны патроны.',
      materials: 40, ammo: 0, unlock: 'shockrod', type: 'weapon'
    },
    {
      label: '🔩 Вибро-кулак',
      desc: 'Силовая перчатка с вибратором. +26 урон. Не нужны патроны.',
      materials: 65, ammo: 0, unlock: 'vibrofist', type: 'weapon'
    },
    {
      label: '💣 Гранатомет',
      desc: 'Самодельный. Огромный урон. +45 урон.',
      materials: 80, ammo: 20, unlock: 'launcher', type: 'weapon'
    },
    {
      label: '🔆 Лазерная пушка',
      desc: 'Демонтированный промышленный лазер. +55 урон.',
      materials: 120, ammo: 30, unlock: 'laserc', type: 'weapon'
    },
    {
      label: '🛡️ Лёгкая броня',
      desc: 'Пластины из обломков. +20 к максимальному HP.',
      materials: 25, ammo: 0, hpBoost: 20, type: 'upgrade'
    },
    {
      label: '🧬 Усиленные стимы',
      desc: 'Улучшает эффект аптечек и стимуляторов. +15 к силе лечения.',
      materials: 40, ammo: 0, healBoost: 15, type: 'upgrade'
    }
  ];

  const STORY_EVENTS = [
    {
      day: 1, speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ВНИМАНИЕ. БИО-ОБЪЕКТ ОБНАРУЖЕН. ЗАГРУЗКА СОЗНАНИЯ... ВЫ ПРОСНУЛИСЬ В ПОДСОБНОМ ПОМЕЩЕНИИ. КТО ВЫ?',
      choices: [
        { text: 'Я... НЕ ПОМНЮ', action: () => window.GameUI.showDialogue({ speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ЭТО НОРМАЛЬНО ДЛЯ ЦИКЛА ПЕРЕЗАГРУЗКИ. ИДИТЕ К ВЫХОДУ.' }) },
        { text: 'ГДЕ Я НАХОЖУСЬ?', action: () => window.GameUI.showDialogue({ speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ВЫ В КОМПЛЕКСЕ ИЕРИХОН. ВАШ ЦИКЛ ЖИЗНИ: 1.' }) }
      ]
    },
    {
      day: 15, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ПЕРЕХВАТ СООБЩЕНИЯ: «ОБЪЕКТ 73 СТАБИЛИЗИРОВАН. ОН ДУМАЕТ, ЧТО ОН ЧЕЛОВЕК». КАК ВЫ ЭТО ПРОКОММЕНТИРУЕТЕ?',
      choices: [
        { text: '«Я И ЕСТЬ ЧЕЛОВЕК!»', action: () => window.GameUI.showDialogue({ speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ВАШИ ЭМОЦИИ ЗАФИКСИРОВАНЫ. КОРРЕКЦИЯ ПОВЕДЕНИЯ НЕ ТРЕБУЕТСЯ.' }) },
        { text: '«КТО ТАКОЙ ОБЪЕКТ 73?»', action: () => window.GameUI.showDialogue({ speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ДАННЫЕ ЗАСЕКРЕЧЕНЫ. ПРОДОЛЖАЙТЕ ДВИЖЕНИЕ.' }) }
      ]
    },
    {
      day: 30, speaker: 'БРОДЯГА', img: 'img/portrait_drifter.png', text: '«ТЫ ВИДЕЛ ЭТИ КАПСУЛЫ В СЕКТОРЕ 4? ТАМ ДЕСЯТКИ ТАКИХ ЖЕ, КАК ТЫ. ВСЕ МЕРТВЫ. ПОНИМАЕШЬ, ЧТО ЭТО ЗНАЧИТ?»',
      choices: [
        { text: '«Я СЛЕДУЮЩИЙ?»', action: () => window.GameUI.showDialogue({ speaker: 'БРОДЯГА', img: 'img/portrait_drifter.png', text: '«ЕСЛИ БУДЕШЬ НЕОСТОРОЖЕН — ДА. ВОЗЬМИ ЭТО, МОЖЕТ ПОМОЖЕТ». ВЫ ПОЛУЧИЛИ 5 ПАТРОНОВ.', action: () => window.Game.applyReward({ ammo: 5 }) }) },
        { text: '«МНЕ ВСЕ РАВНО»', action: () => window.GameUI.showDialogue({ speaker: 'БРОДЯГА', img: 'img/portrait_drifter.png', text: '«ХОРОШАЯ ПОЗИЦИЯ ДЛЯ ЭТОГО МИРА. УДАЧИ».' }) }
      ]
    },
    {
      day: 45, speaker: 'ПОСЕЛЕНИЕ «ГРАНЬ»', img: 'img/portrait_bar.png',
      text: 'ВЫ ДОБРАЛИСЬ ДО НЕБОЛЬШОГО ПОСЕЛЕНИЯ. В БАРЕ ВЫ ЗАМЕЧАЕТЕ ЖЕНЩИНУ, КОТОРАЯ СМОТРИТ НА ВАС С УЖАСОМ. «ТЫ?! НО Я ЖЕ ВИДЕЛА, КАК ТЕБЯ РАЗОРВАЛО В КЛОЧЬЯ!» — КРИЧИТ ОНА, ТРЕБУЯ СТАРЫЙ ДОЛГ.',
      isBranching: true, id: 'bar_woman'
    },
    { day: 60, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ФАЙЛ 09-B: «ПРОТОКОЛ КЛОНИРОВАНИЯ ИЕРИХОН ПОДРАЗУМЕВАЕТ ПЕРЕНОС ПАМЯТИ ПОСЛЕ СМЕРТИ. КОЭФФИЦИЕНТ ОШИБКИ: 12%».' },
    { day: 75, speaker: 'ТЕРМИНАЛ', img: 'img/portrait_sys.png', text: 'НАЙДЕНО СООБЩЕНИЕ: «АМАЗОНКА, ОБЪЕКТ 73 СНОВА В СЕТИ. СКОЛЬКО ЕЩЕ РАЗ ТЫ БУДЕШЬ ЕГО ЛИКВИДИРОВАТЬ?»' },
    { day: 90, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ЗАПИСЬ: «ГЕНОМ ОБЪЕКТА МОДИФИЦИРОВАН ДЛЯ ПОВЫШЕННОЙ РЕГЕНЕРАЦИИ. ПОБОЧНЫЕ ЭФФЕКТЫ: ПОТЕРЯ ИДЕНТИЧНОСТИ».' },
    { day: 105, speaker: 'БРОДЯГА', img: 'img/portrait_drifter.png', text: '«ТЫ ОПЯТЬ ТУТ? МНЕ ПОКАЗАЛОСЬ, ТЕБЯ УЖЕ СЪЕЛИ ТЕ ЖЕЛЕЗНЫЕ ПСЫ. ТЫ ЧТО, БЕССМЕРТНЫЙ?»' },
    {
      day: 120, speaker: 'АМАЗОНКА-СИНТ', img: 'img/enemy_amazon.png',
      text: 'ПЕРЕД ВАМИ ПРЕГРАДА — ФИГУРА В ВЫСОКОТЕХНОЛОГИЧНОЙ БРОНЕ. ЭТО АМАЗОНКА-СИНТ. «ТЫ ВСЕ ЕЩЕ ХОДИШЬ, ОШИБКА ПРИРОДЫ?» — ШИПИТ ОНА.',
      isCombat: true, enemyId: 'amazon_weak'
    },
    { day: 135, speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ВНИМАНИЕ: ОБНАРУЖЕНА УТЕЧКА ДАННЫХ ИЗ ГЛАВНОГО УЗЛА. МЕСТОПОЛОЖЕНИЕ: СЕКТОР ЛАБОРАТОРИЙ.' },
    { day: 150, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ОТЧЕТ: «КЛОН 73 ОБУЧАЕТСЯ БЫСТРЕЕ, ЧЕМ ОЖИДАЛОСЬ. ОПАСНОСТЬ УТРАТЫ КОНТРОЛЯ: ВЫСОКАЯ».' },
    { day: 165, speaker: 'ТЕРМИНАЛ', img: 'img/portrait_sys.png', text: 'ЛОГ СООБЩЕНИЙ: «ДИРЕКТОР, МЫ НЕ МОЖЕМ ОСТАНОВИТЬ ЕГО. ОН ЗНАЕТ, ГДЕ МЫ».' },
    { day: 180, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ДОКУМЕНТ: «ПРОЕКТ ИЕРИХОН БЫЛ СОЗДАН ДЛЯ СОЗДАНИЯ ИДЕАЛЬНОЙ АРМИИ ОДНОГО ЧЕЛОВЕКА».' },
    { day: 195, speaker: 'БРОДЯГА', img: 'img/portrait_drifter.png', text: '«ПОСЛЕДНИЙ РАЗ ВИЖУ ТЕБЯ, ПАРЕНЬ. ТУДА, КУДА ТЫ ИДЕШЬ, ЖИВЫЕ НЕ ВОЗВРАЩАЮТСЯ. ПРОЩАЙ».' },
    {
      day: 210, speaker: 'АМАЗОНКА-СИНТ', img: 'img/enemy_amazon.png',
      text: 'ВЫ НАСТИГЛИ ЕЕ У ВХОДА В ЛАБОРАТОРИЮ. «НЕВОЗМОЖНО... Я ЖЕ ВИДЕЛА ТВОЮ УТИЛИЗАЦИЮ!» — ОНА ПЕРЕХОДИТ В РЕЖИМ ПОЛНОЙ МОЩНОСТИ.',
      isCombat: true, enemyId: 'amazon_full'
    },
    { day: 225, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ФАЙЛ 73-X: «ГЕНЕТИЧЕСКИЙ ОРИГИНАЛ ОБЪЕКТА — ПОЛКОВНИК ЯНКОВСКИЙ. ДАТА СМЕРТИ: 2044».' },
    { day: 240, speaker: 'ТЕРМИНАЛ', img: 'img/portrait_sys.png', text: 'СООБЩЕНИЕ: «ОН ВНУТРИ ПЕРИМЕТРА. ВСЕМ СИНТЕТИКАМ — РЕЖИМ ПОИСКА И УНИЧТОЖЕНИЯ».' },
    { day: 255, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ЗАПИСЬ: «Я КЛОНИРУЮ ЕГО СНОВА И СНОВА, НО КАЖДАЯ ИТЕРАЦИЯ СТАНОВИТСЯ ВСЕ БОЛЕЕ НЕПРЕДСКАЗУЕМОЙ».' },
    { day: 270, speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ВНИМАНИЕ. УРОВЕНЬ ТРЕВОГИ: МАКСИМАЛЬНЫЙ. СИСТЕМЫ ЖИЗНЕОБЕСПЕЧЕНИЯ СЕКТОРА ОТКЛЮЧЕНЫ.' },
    { day: 285, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ЛОГ: «ТЕХНИК СОШЕЛ С УМА. ОН СЧИТАЕТ СЕБЯ БОГОМ, СОЗДАЮЩИМ ЖИЗНЬ ИЗ ПЕПЛА».' },
    { day: 300, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ОТЧЕТ: «ЭКСПЕРИМЕНТ №204: УДАЧНЫЙ ПЕРЕНОС СОЗНАНИЯ В КИБЕРНЕТИЧЕСКОЕ ТЕЛО ТЕХНИКА».' },
    { day: 315, speaker: 'ТЕРМИНАЛ', img: 'img/portrait_sys.png', text: 'СООБЩЕНИЕ: «ОДИН ГОД. МЫ ТЕРЗАЕМ ЭТО ТЕЛО УЖЕ ГОД. ХВАТИТ».' },
    { day: 330, speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'БЛОКИРОВКА СНЯТА. ДОСТУП В ГЛАВНУЮ КАМЕРУ КЛОНИРОВАНИЯ РАЗРЕШЕН.' },
    { day: 345, speaker: 'АРХИВ', img: 'img/portrait_archive.png', text: 'ПОСЛЕДНИЙ ФАЙЛ: «КТО БЫ ТЫ НИ БЫЛ, КЛОН ИЛИ ЧЕЛОВЕК... ОСТАНОВИ ЕГО».' },
    { day: 360, speaker: 'СИСТЕМА', img: 'img/portrait_sys.png', text: 'ОБЪЕКТ 73 ДОСТИГ ЦЕЛИ. СКАНИРОВАНИЕ ЗАВЕРШЕНО.' },
    {
      day: 365, speaker: 'ОДЕРЖИМЫЙ ТЕХНИК', img: 'img/enemy_technician.png',
      text: 'В ВАС ЖДЕТ ЧЕЛОВЕК, ОБВЕШАННЫЙ ПРОВОДАМИ. «МОЕ ТВОРЕНИЕ... ТЫ УМИРАЛ СОТНИ РАЗ, ЧТОБЫ Я МОГ ОТТОЧИТЬ ТВОЙ АЛГОРИТМ. ТЕПЕРЬ ТЫ ПОСЛУЖИШЬ МОИМ ЦЕЛЯМ...»',
      isCombat: true, enemyId: 'boss_technician'
    }
  ];

  // Специфические враги для сюжета
  const STORY_ENEMIES = {
    amazon_weak: { name: 'Амазонка-Синт (Ослаблена)', hp: 80, dmg: 10, atk: 3.5, armor: 0.1, img: 'img/enemy_amazon.png', icon: '[⚔️]' },
    amazon_full: { name: 'Амазонка-Синт', hp: 200, dmg: 30, atk: 2.2, armor: 0.2, img: 'img/enemy_amazon.png', icon: '[⚔️]' },
    boss_technician: { name: 'Одержимый техник (БОСС)', hp: 450, dmg: 40, atk: 2.5, armor: 0.4, img: 'img/enemy_technician.png', icon: '[🔧]' }
  };

  const NOTES = [
    'ЗАПИСКА: «Код от двери 404 — стёрт. Придётся взрывать».',
    'ЗАПИСКА: «Они подмешивают ингибиторы в воду, чтобы мы не вспоминали прошлые циклы».',
    'ЗАПИСКА: «Служба безопасности носит броню 4-го класса. Цельтесь в сочленения».',
    'ЗАПИСКА: «Я видел, как Директор разговаривал с пустым экраном. ИИ управляет всем».',
    'ЗАПИСКА: «Если найдёшь эту записку — ты уже умирал. Не доверяй своей памяти».'
  ];

  return { SAVE_KEY, SAVE_VER, ENEMIES, ELITE_ENEMIES, LOCATIONS, SHOP_ITEMS, CRAFT_ITEMS, NOTES, STORY_EVENTS, STORY_ENEMIES, WEAPON_STATS, ARMOR_STATS };
})();
