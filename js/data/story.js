export const MEMORY_FRAGMENTS = [
  { id: 'mem_1', text_ru: 'СТАРАЯ ГАЗЕТА — «ЗОЛОТОЙ ВЕК»\n\nНа фото вы — моложе на десять лет, в идеально сидящем костюме. Заголовок гласит: «Андрей Данилов открывает крупнейший в стране приют для бездомных». Ирония судьбы бьет больнее, чем холодный ветер.', text_en: 'OLD NEWSPAPER — "GOLDEN AGE"\n\nYou in the photo — ten years younger, in a perfectly tailored suit. The headline reads: "Andrey Danilov opens the country\'s largest homeless shelter." The irony of fate hits harder than the cold wind.' },
  { id: 'mem_2', text_ru: 'ФОТОКАРТОЧКА — «СЕМЕЙНЫЙ УЖИН»\n\nЛица на фото почти стерты временем и влагой. Но вы помните тепло того вечера. Жена, дочь, смех. Мэр Артёмов тогда был вашим лучшим другом и крестным отцом ребенка. Теперь это кажется сном другого человека.', text_en: 'PHOTOGRAPH — "FAMILY DINNER"\n\nThe faces in the photo are almost erased by time and moisture. But you remember the warmth of that evening. Wife, daughter, laughter. Mayor Artyomov was then your best friend and the godfather of your child. Now it seems like someone else\'s dream.' },
  { id: 'mem_3', text_ru: 'ЗАПИСКА — «ПРЕДУПРЕЖДЕНИЕ»\n\n«Андрей, не лезь в дела Сектора 4. Там крутятся такие деньги, которые не прощают честности. Остановись, пока не поздно». Вы не остановились. Вы думали, что закон защитит вас.', text_en: 'NOTE — "WARNING"\n\n"Andrey, don\'t meddle in Sector 4 affairs. There\'s money involved that doesn\'t forgive honesty. Stop while it\'s not too late." You didn\'t stop. You thought the law would protect you.' },
  { id: 'mem_4', text_ru: 'ВОСПОМИНАНИЕ — «НОЧЬ ПРЕДАТЕЛЬСТВА»\n\nОфис в огне. Сирены. Мэр смотрит на вас из окна своего бронированного лимузина. «Ты слишком много на себя взял, Андрей. Городу не нужны герои, городу нужны послушные инструменты». Это был последний раз, когда вы спали в мягкой постели.', text_en: 'MEMORY — "NIGHT OF BETRAYAL"\n\nOffice in flames. Sirens. The Mayor looks at you from the window of his armored limousine. "You took on too much, Andrey. The city doesn\'t need heroes; the city needs obedient tools." That was the last time you slept in a soft bed.' },
  { id: 'mem_5', text_ru: 'КВИТАНЦИЯ — «ПОЛНЫЙ КРАХ»\n\nДокумент об изъятии всего имущества. Дома, счетов, даже имени. В тот день Андрей Данилов официально «пропал без вести». А бродяга по кличке «Князь» начал свой путь по канавам.', text_en: 'RECEIPT — "TOTAL COLLAPSE"\n\nA document seizing all property. Houses, accounts, even your name. On that day, Andrey Danilov officially "went missing." And a drifter nicknamed "Prince" began his journey through the gutters.' },
  { id: 'mem_6', text_ru: 'ОТРЫВОК ИЗ ДНЕВНИКА — «ПЕРВЫЙ ГОД»\n\n«Сегодня я дрался за кусок заплесневелого хлеба. Я, человек, который жертвовал миллионы на благотворительность. Самое страшное не голод. Самое страшное — привыкание к унижению».', text_en: 'DIARY EXCERPT — "YEAR ONE"\n\n"Today I fought for a piece of moldy bread. I, a man who donated millions to charity. The worst thing isn\'t hunger. The worst thing is getting used to humiliation."' },
  { id: 'mem_7', text_ru: 'СЛУХ — «МЭРИЯ»\n\nГоворят, Мэр Артёмов строит новый бизнес-центр на месте того самого Сектора 4. Он стер память о людях, которые там жили. Он думает, что победил. Он забыл, что у крыс, загнанных в угол, самые острые зубы.', text_en: 'RUMOR — "CITY HALL"\n\nThey say Mayor Artyomov is building a new business center on the site of Sector 4. He erased the memory of the people who lived there. He thinks he won. He forgot that cornered rats have the sharpest teeth.' }
];

export const STORY_EVENTS = [
  {
    day: 1, speaker: 'СТАРЫЙ СЕМЁН', speaker_en: 'OLD SEMYON', img: 'img/char_semyon.webp',
    text_ru: '— Эй, парень, ты живой там? Вылезай из этой груды мокрого тряпья. Город проснулся. Мы во Внешнем Кольце, а Сектор 4 заблокирован силовой стеной корпорации «Иерихон». Нам пора искать еду, пока кибер-крысы не съели твои сапоги. Ты вообще помнишь, как тебя зовут?',
    text_en: '— Hey kid, you alive in there? Get out of that pile of wet rags. The city is awake. We are in the Outer Ring, and Sector 4 is locked down by the "Jericho" corporation shield. Time to look for food before cyber-rats eat your boots. Do you even remember your name?',
    choices: [
      { text_ru: '«МЕНЯ ЗОВУТ АНДРЕЙ... КАЖЕТСЯ»', text_en: '"MY NAME IS ANDREY... I THINK"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.min(100, GameState.get().player.humanity + 5); Events.emit('ui:toast', translate('toast_humanity', '+5')); Events.emit('ui:showDialogue', { speaker: 'СЕМЁН', speaker_en: 'SEMYON', text_ru: '— Звучит слишком благородно для этого радиоактивного болота. Здесь ты просто Князь. Забытый всеми бродяга. Вставай, Князь. На вокзале раздают синтетический суп, поспешим!', text_en: '— Sounds too noble for this radioactive swamp. Here you\'re just Prince. A forgotten drifter. Get up, Prince. They are giving out synthetic soup at the station, let\'s hurry!' }); } },
      { text_ru: '«НЕ ТВОЁ ДЕЛО, СТАРИК»', text_en: '"NONE OF YOUR BUSINESS, OLD MAN"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 5); Events.emit('ui:toast', translate('toast_humanity', '-5')); Events.emit('ui:showDialogue', { speaker: 'СЕМЁН', speaker_en: 'SEMYON', text_ru: '— Грубость — плохой щит от голода. Но я тебя не виню. Улицы быстро выжигают манеры. Иди своей дорогой, но берегись ОМОНа у ворот Сектора 4.', text_en: '— Rudeness is a poor shield against hunger. But I don\'t blame you. The streets burn out manners fast. Go your way, but watch out for Riot Police at the Sector 4 gates.' }); } }
    ]
  },
  {
    day: 10, speaker: 'ОБРЫВОК ГАЗЕТЫ', speaker_en: 'SCRAP OF PAPER', img: 'img/event_newspaper.webp',
    text_ru: 'Ветер швыряет вам в лицо мокрую страницу из корпоративного вестника «Иерихона». На главной полосе — Мэр Артёмов объявляет о закрытии проекта Сектора 4 и «исчезновении» его основателя Андрея Данилова. «Будущее города под контролем Мэрии», гласит подпись.',
    text_en: 'The wind throws a wet page from the "Jericho" corporate bulletin into your face. On the front page — Mayor Artyomov announces the shutdown of the Sector 4 project and the "disappearance" of its founder Andrey Danilov. "The city\'s future is under Mayor\'s control," reads the caption.',
    choices: [
      { text_ru: 'СЖАТЬ КУЛАКИ ОТ ЯРОСТИ', text_en: 'CLENCH FISTS IN RAGE', action: (Events, GameState, translate) => { GameState.get().player.mood = Math.max(0, GameState.get().player.mood - 10); Events.emit('ui:toast', 'ЯРОСТЬ ПЕРЕПОЛНЯЕТ ВАС'); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Этот предатель Артёмов... Ты начинаешь вспоминать огонь в офисе и его лицо в окне лимузина. Это он стёр твою жизнь. Ты должен раскрыть его планы.', text_en: 'That traitor Artyomov... You start to remember the fire in the office and his face in the limousine window. He erased your life. You must reveal his plans.' }); } },
      { text_ru: 'ВЫБРОСИТЬ ГАЗЕТУ В ГРЯЗЬ', text_en: 'THROW NEWSPAPER INTO MUD', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 2); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Данилов мертв. Твоя жизнь теперь здесь, среди ржавых контейнеров. Забыть — единственный способ не сойти с ума во Внешнем Кольце.', text_en: 'Danilov is dead. Your life is here now, among the rusty containers. Forgetting is the only way not to go crazy in the Outer Ring.' }); } }
    ]
  },
  {
    day: 20, speaker: 'СТАРЫЙ ЗНАКОМЫЙ', speaker_en: 'OLD ACQUAINTANCE', img: 'img/char_head_of_security.webp',
    text_ru: 'Мимо проходит бездомный, в котором вы узнаете своего бывшего начальника службы безопасности «Иерихона». Он смотрит на вас, в ужасе расширяя глаза: «Директор Данилов? Но вас же ликвидировали в лаборатории памяти...» — и тут же убегает.',
    text_en: 'A homeless man passes by, and you recognize your former "Jericho" head of security. He looks at you, eyes widening in horror: "Director Danilov? But you were liquidated in the memory lab..." — and immediately runs away.',
    choices: [
      { text_ru: 'ОКЛИКНУТЬ ЕГО', text_en: 'CALL OUT TO HIM', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ОН СЛИШКОМ НАПУГАН'); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Даже верные люди видят во мне призрак корпоративного эксперимента. Лаборатория памяти... Значит, меня клонировали или стёрли мозг.', text_en: 'Even loyal people see me as a ghost of a corporate experiment. The memory lab... So I was either cloned or brain-wiped.' }); } },
      { text_ru: 'ПРОИГНОРИРОВАТЬ', text_en: 'IGNORE', action: (Events, GameState, translate) => { GameState.get().player.mood += 5; Events.emit('ui:toast', 'МЕНЬШЕ ПРОШЛОГО — ПРОЩЕ ЖИТЬ'); } }
    ]
  },
  {
    day: 30, speaker: 'ОФИЦИАНТКА КАТЯ', speaker_en: 'WAITRESS KATYA', img: 'img/char_katya.webp',
    text_ru: 'Вы заглядываете в окно дешевой забегаловки. Девушка за стойкой роняет поднос при виде вашего лица. Это Катя, ваша бывшая личная помощница. «Боже... Андрей? Вы живы! Послушайте, Мэр ищет документы архива Сектора 4. Я сохранила часть шифра от вашего тайника...»',
    text_en: 'You look into the window of a cheap diner. The girl behind the counter drops a tray at the sight of your face. It\'s Katya, your former personal assistant. "God... Andrey? You are alive! Listen, the Mayor is looking for the Sector 4 archive files. I kept part of the cipher to your vault..."',
    choices: [
      {
        text_ru: 'ЗАБРАТЬ КЛЮЧ-КАРТУ И ПРИПАСЫ', text_en: 'TAKE KEYCARD & SUPPLIES', action: (Events, GameState, translate) => {
          const st = GameState.get();
          st.resources.food += 5;
          st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #1
          Events.emit('ui:toast', 'ПОЛУЧЕНА УЛИКА №1 (Ключ-карта Кати)');
          Events.emit('ui:showDialogue', {
            speaker: 'КАТЯ', speaker_en: 'KATYA',
            text_ru: '— Возьмите еду и эту ключ-карту. Ваша старая лаборатория опечатана ОМОНом, но тайник за сейфом должен быть цел. Ищите документы по Сектору 4 там.',
            text_en: '— Take the food and this keycard. Your old lab is sealed by the police, but the vault behind the safe should be intact. Look for the Sector 4 documents there.'
          });
        }
      },
      { text_ru: 'СКРЫТЬСЯ В ТЕНЯХ', text_en: 'HIDE IN THE SHADOWS', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ВЫ ОСТАЛИСЬ БЕЗ ПОДСКАЗОК'); } }
    ]
  },
  {
    day: 40, speaker: 'ПОТЕРЯННЫЙ КОШЕЛЕК', speaker_en: 'LOST WALLET', img: 'img/event_wallet.webp',
    text_ru: 'В сточной канаве у роскошного КПП Сектора 4 вы находите кожаное портмоне. Внутри — 100 рублей и электронная визитка вашего бывшего корпоративного конкурента, ныне работающего на Мэра.',
    text_en: 'In a gutter near the luxurious Sector 4 checkpoint, you find a leather wallet. Inside is 100 rubles and an electronic business card of your former corporate competitor, now working for the Mayor.',
    choices: [
      { text_ru: 'ЗАБРАТЬ РУБЛИ', text_en: 'TAKE RUBLES', action: (Events, GameState, translate) => { GameState.get().resources.caps += 100; GameState.get().player.humanity -= 5; Events.emit('ui:toast', '+100 РУБЛЕЙ'); } },
      { text_ru: 'ВЫКИНУТЬ В КАНАЛИЗАЦИЮ', text_en: 'THROW IN SEWER', action: (Events, GameState, translate) => { GameState.get().player.mood += 10; Events.emit('ui:toast', 'УЛИЧНАЯ ГОРДОСТЬ'); } }
    ]
  },
  {
    day: 50, speaker: 'СЛУХИ У КОСТРА', speaker_en: 'CAMPFIRE RUMORS', img: 'img/event_campfire.webp',
    text_ru: '— Говорят, Князь выжил, — шепчутся бродяги у бочки с огнем. — Он проберется в ядро Сектора 4 и взломает сеть клонирования Мэра. \nОни не знают, что вы стоите рядом с ними.',
    text_en: '— They say the Prince survived, — the drifters whisper by the fire barrel. — He will break into Sector 4 core and hack the Mayor\'s cloning network. \nThey don\'t know you are standing next to them.',
    choices: [
      { text_ru: 'ПОДТВЕРДИТЬ СЛУХИ', text_en: 'CONFIRM RUMORS', action: (Events, GameState, translate) => { GameState.get().player.mood += 15; GameState.get().player.humanity -= 5; Events.emit('ui:toast', 'НАДЕЖДА НА ОМЩЕНИЕ'); } },
      { text_ru: 'ПРОМОЛЧАТЬ', text_en: 'STAY SILENT', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'КОНСПИРАЦИЯ'); } }
    ]
  },
  {
    day: 55, id: 'bar_woman', speaker: 'ОБИЖЕННАЯ ЖЕНЩИНА', speaker_en: 'OFFENDED WOMAN', img: 'img/char_lab_technician_female.webp',
    isBranching: true,
    text_ru: 'В неоновом баре вы видите, как крупный вышибала трясет лаборантку за плечи, требуя архивные данные «Иерихона». Она плачет: «Я не знаю коды доступа Сектора 4!»',
    text_en: 'In a neon bar, you see a large bouncer shaking a lab technician by the shoulders, demanding "Jericho" archive data. She is crying: "I don\'t know the Sector 4 access codes!"',
    branch_negotiate_success_ru: 'Вы убеждаете вышибалу взяткой в виде еды и патронов. Лаборантка шепчет: «Спасибо... Вот отчет о подделке синтов в Секторе 4»',
    branch_negotiate_success_en: 'You convince the bouncer with a bribe of food and ammo. The technician whispers: "Thank you... Here is the report on synth counterfeiting in Sector 4"',
    branch_pay_ru: 'Вы платите 50 рублей. Вышибала отпускает девушку. Она тайно сует вам медицинский отчет о нелегальных чипах синтов.',
    branch_pay_en: 'You pay 50 rubles. The bouncer lets the girl go. She secretly hands you a medical report on illegal synth chips.'
  },
  {
    day: 60, speaker: 'СЕРЖАНТ ПЕТРЕНКО', speaker_en: 'SERGEANT PETRENKO', img: 'img/char_petrenko.webp',
    text_ru: '— Стоять, бродяга! Мэр назначил награду за любые головы бывших сотрудников «Иерихона». Твое лицо подозрительно совпадает с профилем Данилова в базе данных!',
    text_en: '— Halt, drifter! The Mayor has put a bounty on any "Jericho" staff heads. Your face matches Danilov\'s profile in our database!',
    isCombat: true, enemyId: 'thug',
    text_ru_win: 'Полицейский-киборг разбит. Вы забираете его шифратор. Теперь вы слышите переговоры патрулей Сектора 4.',
    text_en_win: 'The police cyborg is defeated. You take his decryptor. Now you can hear Sector 4 patrol chatter.'
  },
  {
    day: 70, speaker: 'УЛИЧНАЯ БАНДА', speaker_en: 'STREET GANG', img: 'img/char_street_gang.webp',
    text_ru: 'Трое уличных рейдеров в неоновых масках преграждают вам дорогу: — Слышь, дед, за проход по нашей свалке надо платить. Или рубли на бочку, или твоя печень пойдет на запчасти.',
    text_en: 'Three street raiders in neon masks block your path: — Hey old man, you gotta pay to cross our junkyard. Either rubles on the barrel, or your liver will go for spare parts.',
    choices: [
      { text_ru: 'ОТКУПИТЬСЯ (50 РУБ)', text_en: 'PAY OFF (50 RUB)', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 50; Events.emit('ui:toast', 'ВЫ СОХРАНИЛИ ЗДОРОВЬЕ'); } },
      { text_ru: 'ДАТЬ СДАЧИ', text_en: 'FIGHT BACK', action: (Events, GameState, translate) => { 
          GameState.get().player.hp -= 20;
          GameState.get().player.humanity -= 10;
          Events.emit('ui:toast', 'ДРАКА БЫЛА ЖЕСТОКОЙ');
          Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Они думали, я обычный бомж. Но корпоративные рефлексы «Иерихона» всё ещё работают.', text_en: 'They thought I was a simple hobo. But "Jericho" corporate reflexes still work.' });
        } 
      }
    ]
  },
  {
    day: 80, speaker: 'СТАРЫЙ СОПЕРНИК', speaker_en: 'OLD RIVAL', img: 'img/char_deputy.webp',
    text_ru: 'Через КПП Сектора 4 проезжает бронированный лимузин. В окне вы видите своего бывшего заместителя, который помог Мэру уничтожить вас. Он попивает дорогой синтетический напиток.',
    text_en: 'An armored limousine passes through the Sector 4 checkpoint. In the window, you see your former deputy who helped the Mayor destroy you. He is sipping an expensive synthetic drink.',
    choices: [
      { text_ru: 'БРОСИТЬ КИРПИЧ ВСЛЕД', text_en: 'THROW A BRICK', action: (Events, GameState, translate) => { GameState.get().player.mood += 20; Events.emit('ui:toast', 'СТЕКЛО ТРЕСНУЛО! МЕЛКАЯ РАДОСТЬ'); } },
      { text_ru: 'СКАНИРОВАТЬ НОМЕРА ЛИМУЗИНА', text_en: 'SCAN VEHICLE LICENSE', action: (Events, GameState, translate) => { GameState.get().flags.knowRivalCar = true; Events.emit('ui:toast', 'ДАННЫЕ АВТОМОБИЛЯ СОХРАНЕНЫ'); } }
    ]
  },
  {
    day: 90, speaker: 'НОЧНОЙ КИОСК', speaker_en: 'NIGHT KIOSK', img: 'img/event_kiosk.webp',
    text_ru: 'Продавец корпоративного киоска «Иерихона» уснул, оставив окно открытым. На прилавке лежат чистые карты памяти и медикаменты.',
    text_en: 'The "Jericho" corporate kiosk clerk fell asleep, leaving the window open. Blank memory cards and meds are lying on the counter.',
    choices: [
      { text_ru: 'УКРАСТЬ ЧИПЫ И АПТЕЧКИ', text_en: 'STEAL CHIPS & MEDS', action: (Events, GameState, translate) => { GameState.get().resources.caps += 200; GameState.get().player.humanity -= 15; Events.emit('ui:toast', 'УДАЧНАЯ КРАЖА'); } },
      { text_ru: 'ПРОЙТИ МИМО', text_en: 'PASS BY', action: (Events, GameState, translate) => { GameState.get().player.humanity += 5; Events.emit('ui:toast', 'ПРИНЦИПИАЛЬНОСТЬ'); } }
    ]
  },
  {
    day: 100, speaker: 'СТАРЫЙ ОФИС', speaker_en: 'OLD OFFICE', img: 'img/event_abandoned_office.webp',
    text_ru: 'Вы пробираетесь в развалины фонда Данилова. Корпоративный сейф в углу обуглился, но с помощью ключ-карты Кати вы открываете тайник за ним. Там лежит зашифрованный жесткий диск.',
    text_en: 'You sneak into the ruins of the Danilov foundation. The corporate safe in the corner is charred, but using Katya\'s keycard, you open the vault behind it. An encrypted hard drive lies there.',
    choices: [
      {
        text_ru: 'ЗАБРАТЬ ДИСК С УЛИКАМИ', text_en: 'TAKE ENCRYPTED DRIVE', action: (Events, GameState, translate) => {
          const st = GameState.get();
          st.resources.caps += 500;
          st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #3
          Events.emit('ui:toast', 'ПОЛУЧЕНА УЛИКА №3 (Зашифрованный диск)');
          Events.emit('ui:showDialogue', { speaker: 'КНЯЗЬ', speaker_en: 'PRINCE', text_ru: 'Это данные проекта «Иерихон». Чертежи синтов и схемы Сектора 4. Но диск защищен военным шифрованием. Мне нужен хакер.', text_en: 'This is the "Jericho" project data. Synth blueprints and Sector 4 layouts. But the drive is protected by military encryption. I need a hacker.' });
        }
      }
    ]
  },
  {
    day: 110, speaker: 'БЫВШИЙ АЙТИШНИК', speaker_en: 'FORMER IT HEAD', img: 'img/char_hacker.webp',
    text_ru: 'В сыром подвале вы находите парня, который когда-то взламывал сервера для вашей компании. Он обвешан проводами и работает за еду. Вы отдаете ему жесткий диск.',
    text_en: 'In a damp basement, you find the guy who once hacked servers for your company. He is covered in wires and works for food. You hand him the hard drive.',
    choices: [
      { text_ru: 'НАЙНЯТЬ ЕГО (10 ЕДЫ)', text_en: 'HIRE HIM (10 FOOD)', action: (Events, GameState, translate) => { 
          const st = GameState.get();
          if (st.resources.food < 10) return Events.emit('ui:toast', 'НЕДОСТАТОЧНО ЕДЫ ДЛЯ ХАКЕРА');
          st.resources.food -= 10;
          st.flags.hasHacker = true;
          st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #4 (Hacker decryption)
          Events.emit('ui:toast', 'ХАКЕР В КОМАНДЕ! ПОЛУЧЕНА УЛИКА №4 (Логи взяток)');
        } 
      },
      { text_ru: 'ОГРАБИТЬ ЕГО И ЗАБРАТЬ МЕДЬ', text_en: 'ROB HIM FOR COPPER', action: (Events, GameState, translate) => { GameState.get().resources.caps += 300; GameState.get().player.humanity -= 10; Events.emit('ui:toast', 'БЫСТРЫЕ РУБЛИ'); } }
    ]
  },
  {
    day: 120, speaker: 'ОБЛАВА В ТРУЩОБАХ', speaker_en: 'SLUM RAID', img: 'img/char_petrenko.webp',
    text_ru: 'Полиция зачищает Внешнее Кольцо. Сжигают палатки, грузят жителей в автозаки. Вы видите, как сержант ОМОНа бьет беззащитную старуху.',
    text_en: 'Police are clearing the Outer Ring. Burning tents, loading residents into vans. You see a police sergeant hitting a defenseless old woman.',
    choices: [
      { text_ru: 'ОТБИТЬ ЖИТЕЛЬНИЦУ ТРУЩОБ', text_en: 'SAVE THE OLD WOMAN', action: (Events, GameState, translate) => { 
          GameState.get().player.hp -= 30;
          GameState.get().player.humanity += 20;
          Events.emit('ui:toast', 'ВЫ СПАСЛИ ЖЕНЩИНУ');
        } 
      },
      { text_ru: 'БЕЖАТЬ И СПАСАТЬ ПРИПАСЫ', text_en: 'FLEE & SAVE GEAR', action: (Events, GameState, translate) => { GameState.get().resources.food += 10; Events.emit('ui:toast', 'ПРИПАСЫ СОХРАНЕНЫ'); } }
    ]
  },
  {
    day: 130, speaker: 'ТАЙНОЕ ПОСЛАНИЕ', speaker_en: 'SECRET MESSAGE', img: 'img/event_secret_note.webp',
    text_ru: 'Под вашим матрасом вы находите записку. «Князь, мы знаем, что ты жив. Соберись. В Секторе 4 готовится что-то страшное. Мэр Артёмов хочет полностью выжечь Внешнее Кольцо».',
    text_en: 'Under your mattress, you find a note. "Prince, we know you are alive. Get ready. Something terrible is being prepared in Sector 4. Mayor Artyomov wants to burn down the Outer Ring entirely."',
    choices: [
      { text_ru: 'ИСКАТЬ ОТПРАВИТЕЛЯ', text_en: 'SEARCH SENDER', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СЛЕДЫ ВЕДУТ В МЭРИЮ'); } },
      { text_ru: 'СЖЕЧЬ ЗАПИСКУ', text_en: 'BURN NOTE', action: (Events, GameState, translate) => { GameState.get().player.mood += 5; Events.emit('ui:toast', 'ИГНОРИРОВАНИЕ УГРОЗЫ'); } }
    ]
  },
  {
    day: 140, speaker: 'ПОДПОЛЬНЫЙ БОЙ', speaker_en: 'UNDERGROUND FIGHT', img: 'img/char_queen_of_streets.webp',
    text_ru: 'Вас приглашают на закрытый турнир в коллекторах. Ставки — еда, патроны и жизнь. Вы выходите на арену против огромной «Королевы улиц» — синта-дезертира.',
    text_en: 'You are invited to a closed tournament in the sewers. Stakes — food, ammo, and life. You enter the arena against the massive "Street Queen" — a rogue corporate synth.',
    isCombat: true, enemyId: 'queen',
    text_ru_win: 'Толпа ревет. Вы доказали свою силу на улицах Внешнего Кольца.',
    text_en_win: 'The crowd roars. You proved your strength on the streets of the Outer Ring.'
  },
  {
    day: 145, id: 'drifter_rescue', speaker: 'РАНЕНЫЙ ЛАБОРАНТ', speaker_en: 'WOUNDED TECH', img: 'img/char_wounded_tech.webp',
    isBranching: true,
    text_ru: 'Вы слышите рык и крики из-за забора. Огромная кибер-собака Мэрии прижала к стене лаборанта «Иерихона» и рвет его одежду. Он не выживет без помощи.',
    text_en: 'You hear a growl and screams from behind the fence. A massive corporate cyber-dog has pinned a "Jericho" lab tech against the wall. He won\'t survive without help.',
    branch_save_success_ru: 'Лаборант тяжело дышит: «Спасибо, Директор... Я думал, пёс разорвет меня. Держите чип доступа к тех-входу Сектора 4»',
    branch_save_success_en: 'The tech gasps: "Thank you, Director... I thought the dog would rip me apart. Take this Sector 4 tech-entrance access chip"',
    branch_leave_ru: 'Вы проходите мимо. Лаборант погибает, унося тайны с собой. Авторитет падает.',
    branch_leave_en: 'You walk past. The tech dies, taking his secrets with him. Reputation drops.'
  },
  {
    day: 150, speaker: 'БАРЫГА «АКУЛА»', speaker_en: 'SHARK THE DEALER', img: 'img/char_shark.webp',
    text_ru: '— Слышал о тебе, Князь. Ты ищешь способ свалить Мэра? У меня есть другой план. С твоим дешифрованным диском ты можешь не сажать его, а возглавить всю корпорацию «Иерихон». Стать новым Директором города. Что скажешь?',
    text_en: '— Heard of you, Prince. You looking for a way to take down the Mayor? I have another plan. With your decrypted drive, you could lead the "Jericho" corporation instead of jailing him. Become the new City Director. What do you say?',
    choices: [
      {
        text_ru: '«МНЕ НУЖНА ВЛАСТЬ, А НЕ ПРАВОСУДИЕ»', text_en: '"I WANT POWER, NOT JUSTICE"', action: (Events, GameState, translate) => {
          GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 20);
          GameState.get().flags.criminalPath = true;
          Events.emit('ui:toast', 'ВЫБРАН ПУТЬ КРИМИНАЛА');
          Events.emit('ui:showDialogue', { speaker: 'АКУЛА', speaker_en: 'SHARK', text_ru: '— Наш человек. Начнем с порта. Там стоит контейнер Мэра с запрещенными имплантами, перехватим его.', text_en: '— That\'s my man. Let\'s start with the port. The Mayor has a container there filled with forbidden implants, let\'s intercept it.' });
        }
      },
      { text_ru: '«Я НЕ БУДУ НОВЫМ ТИРАНОМ»', text_en: '"I WILL NOT BE A NEW TYRANT"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.min(100, GameState.get().player.humanity + 10); Events.emit('ui:toast', 'ВЕРНОСТЬ ИДЕАЛАМ'); } }
    ]
  },
  {
    day: 160, speaker: 'ВЗЛОМ СЕТИ', speaker_en: 'NETWORK BREACH', img: 'img/event_network_breach.webp',
    text_ru: 'Если у вас в команде есть хакер, вы можете попытаться проникнуть в защищенную сеть Мэрии для поиска планов ОМОНа.',
    text_en: 'If you have a hacker in your team, you can try to breach the Mayor\'s secure network to look for police plans.',
    choices: [
      { text_ru: 'НАЧАТЬ ВЗЛОМ (ТРЕБУЕТ ХАКЕРА)', text_en: 'BREACH NETWORK (REQ HACKER)', action: (Events, GameState, translate) => { 
          const st = GameState.get();
          if (st.flags.hasHacker) {
            st.flags.hasGuardPlans = true;
            st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #5 (Network hack)
            Events.emit('ui:toast', 'ПОЛУЧЕНА УЛИКА №5 (Приказы Мэра о зачистке)');
          } else {
            Events.emit('ui:toast', 'У ВАС НЕТ ХАКЕРА В КОМАНДЕ');
          }
        } 
      },
      { text_ru: 'ОТКАЗАТЬСЯ', text_en: 'REFUSE', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СЛИШКОМ РИСКОВАННО'); } }
    ]
  },
  {
    day: 170, speaker: 'ПОДКУПНЫЙ ОХРАННИК', speaker_en: 'BRIBED GUARD', img: 'img/char_guard.webp',
    text_ru: 'Охранник у технических ворот Сектора 4 намекает, что за определенную сумму рублей он может «отвернуться», когда вы будете проходить.',
    text_en: 'A guard at the Sector 4 technical gates hints that for a certain amount of rubles he might "look away" when you pass.',
    choices: [
      { text_ru: 'ПОДКУПИТЬ (500 РУБ)', text_en: 'BRIBE (500 RUB)', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 500; GameState.get().flags.backDoorOpen = true; Events.emit('ui:toast', 'ДОСТУП ОТКРЫТ'); } },
      { text_ru: 'ЗАПУГАТЬ ЕГО', text_en: 'THREATEN HIM', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 10; Events.emit('ui:toast', 'СТРАХ, НО НЕТ РЕЗУЛЬТАТА'); } }
    ]
  },
  {
    day: 180, speaker: 'БОЛЬНОЙ РЕБЕНОК', speaker_en: 'SICK CHILD', img: 'img/char_katya.webp',
    text_ru: 'Катя умоляет вас достать экспериментальный антивирус для больного мальчика из трущоб. Препарат есть только на закрытом складе корпорации в порту.',
    text_en: 'Katya begs you to get an experimental antivirus for a sick boy from the slums. The drug is only available at the closed corporate warehouse in the port.',
    choices: [
      { text_ru: 'ОБЕЩАТЬ ПОМОЧЬ', text_en: 'PROMISE TO HELP', action: (Events, GameState, translate) => { GameState.get().flags.questMedicine = true; Events.emit('ui:toast', 'ЦЕЛЬ: ПОРТОВЫЙ СКЛАД'); } },
      { text_ru: 'ОТКАЗАТЬСЯ', text_en: 'REFUSE', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 20; Events.emit('ui:toast', 'СЕРДЦЕ ИЗ КАМНЯ'); } }
    ]
  },
  {
    day: 190, speaker: 'СТАРЫЙ ДРУГ', speaker_en: 'OLD FRIEND', img: 'img/char_semyon.webp',
    text_ru: '— Князь, время пришло. Вот модифицированный бластер, я собрал его из хлама. Он увеличит твой урон.',
    text_en: '— Prince, the time has come. Here is a modified blaster, I made it from scrap. It will increase your damage.',
    choices: [
      { text_ru: 'ЗАБРАТЬ БЛАСТЕР', text_en: 'TAKE BLASTER', action: (Events, GameState, translate) => { GameState.get().player.dmg += 5; Events.emit('ui:toast', '+5 К УРОНУ'); } }
    ]
  },
  {
    day: 200, speaker: 'ПОКУШЕНИЕ', speaker_en: 'ASSASSINATION ATTEMPT', img: 'img/event_assassins.webp',
    text_ru: 'Двое элитных наемных убийц корпорации настигают вас в переулке. Мэр Артёмов понял, что вы подобрались слишком близко к тайнам Сектора 4.',
    text_en: 'Two elite corporate assassins catch up with you in an alley. Mayor Artyomov realized you got too close to Sector 4 secrets.',
    isCombat: true, enemyId: 'assassin',
    text_ru_win: 'Вы выжили. Но охота за вашей головой перешла в активную фазу.',
    text_en_win: 'You survived. But the hunt for your head has entered the active phase.'
  },
  {
    day: 210, speaker: 'НАВОДКА НА ПОРТ', speaker_en: 'PORT TIP', img: 'img/char_shark.webp',
    text_ru: 'Акула сообщает, что контейнер Мэра с имплантами и химикатами в порту будет стоять без охраны всего один час.',
    text_en: 'Shark reports that the Mayor\'s container with implants and chemicals in the port will be unguarded for only one hour.',
    choices: [
      { text_ru: 'ГОТОВИТЬ НАЛЕТ', text_en: 'PREPARE RAID', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ОБЫСК НА 220-Й ДЕНЬ'); } }
    ]
  },
  {
    day: 215, id: 'cartographer', speaker: 'КАРТОГРАФ', speaker_en: 'CARTOGRAPHER', img: 'img/char_cartographer.webp',
    isBranching: true,
    text_ru: 'Странный человек в плаще, обвешанном схемами вентиляции, преграждает вам путь: «Я знаю все туннели Сектора 4. Хочешь обойти охранные турели Мэра?»',
    text_en: 'A strange man in a coat covered in ventilation blueprints blocks your path: "I know all the Sector 4 tunnels. Want to bypass the Mayor\'s security turrets?"',
    branch_buy_map_ru: '«Вот схема туннелей. Проходи через вентиляцию». Вы разблокировали Сектор 4.',
    branch_buy_map_en: '"Here is a tunnel blueprint. Pass through the ventilation." You unlocked Sector 4.',
    branch_buy_file_ru: '«Этот чип памяти расскажет, как Мэр удалил твою личность». Вы получаете фрагмент воспоминания.',
    branch_buy_file_en: '"This memory chip will show how the Mayor deleted your personality." You receive a memory fragment.',
    branch_buy_code_ru: '«Этот шифр отключает автоматические пушки у входа». Вы получили код обхода.',
    branch_buy_code_en: '"This cipher disables automatic turrets at the entrance." You received the bypass code.',
    branch_leave_ru: '«Ну как знаешь. Без моих карт ты будешь блуждать вслепую». Картограф скрывается.',
    branch_leave_en: '"As you wish. Without my maps, you will wander blindly." The Cartographer disappears.'
  },
  {
    day: 220, speaker: 'ПОРТОВЫЙ СКЛАД', speaker_en: 'PORT WAREHOUSE', img: 'img/event_port.webp',
    text_ru: 'Вы стоите перед вскрытым контейнером. Внутри — запрещенные импланты и химикаты для зачистки Внешнего Кольца. Если забрать их, вы станете богатым. Но если раздать вакцины людям, вы спасете жизни.',
    text_en: 'You stand before the opened container. Inside are forbidden implants and chemicals for clearing the Outer Ring. If you take them, you\'ll become rich. But if you distribute vaccines, you\'ll save lives.',
    choices: [
      {
        text_ru: 'ПРОДАТЬ ИМПЛАНТЫ СЕБЕ', text_en: 'SELL IMPLANTS FOR SELF', action: (Events, GameState, translate) => {
          GameState.get().resources.caps += 2000;
          GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 30);
          Events.emit('ui:toast', '+2000 РУБЛЕЙ');
          Events.emit('ui:showDialogue', { speaker: 'КНЯЗЬ', speaker_en: 'PRINCE', text_ru: 'Деньги дают власть. Теперь я сам смогу диктовать Мэру свои условия.', text_en: 'Money gives power. Now I can dictate my own terms to the Mayor.' });
        }
      },
      { text_ru: 'РАЗДАТЬ ВАКЦИНЫ ЖИТЕЛЯМ', text_en: 'DISTRIBUTE VACCINES', action: (Events, GameState, translate) => { 
          const st = GameState.get();
          st.player.humanity = Math.min(100, st.player.humanity + 20);
          st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #6 (contaband report)
          Events.emit('ui:toast', 'ПОЛУЧЕНА УЛИКА №6 (Накладные на химикаты)');
        } 
      }
    ]
  },
  {
    day: 230, speaker: 'ВЕРБОВКА', speaker_en: 'RECRUITMENT',
    text_ru: 'С помощью ресурсов из порта вы можете нанять уличных киборгов в свою личную кибер-банду, чтобы штурмовать Мэрию.',
    text_en: 'Using resources from the port, you can hire street cyborgs into your personal cyber-gang to storm City Hall.',
    choices: [
      { text_ru: 'СОЗДАТЬ БАНДУ (1000 РУБ)', text_en: 'FORM CYBER-GANG (1000 RUB)', action: (Events, GameState, translate) => { 
          if (GameState.get().resources.caps >= 1000) {
            GameState.get().resources.caps -= 1000;
            GameState.get().flags.hasGang = true;
            Events.emit('ui:toast', 'БАНДА ПРИКРЫВАЕТ ВАС');
          } else {
            Events.emit('ui:toast', 'НЕДОСТАТОЧНО СРЕДСТВ');
          }
        } 
      },
      { text_ru: 'РАБОТАТЬ В ОДИНОЧКУ', text_en: 'WORK ALONE', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ОДИНОКИЙ ВОЛК'); } }
    ]
  },
  {
    day: 240, speaker: 'ПРОТЕСТЫ', speaker_en: 'PROTESTS',
    text_ru: 'Тысячи бездомных вышли к границам Сектора 4, требуя прекратить чипирование. Корпоративный спецназ ОМОН готовится к жесткому разгону.',
    text_en: 'Thousands of drifters marched to the borders of Sector 4, demanding an end to chip implants. Corporate Riot Police are preparing for a violent dispersal.',
    choices: [
      { 
        text_ru: 'ВОЗГЛАВИТЬ ШТУРМ (БОЙ)', text_en: 'LEAD THE ASSAULT (BATTLE)', action: (Events, GameState, translate) => { 
          GameState.get().player.humanity += 30;
          handleStoryCombat({ enemyId: 'riot_squad', text_ru: 'Вы стоите в первом ряду против щитов корпоративного спецназа.', text_en: 'You stand in the front row against corporate riot police shields.' });
        } 
      },
      { text_ru: 'РАЗГРАБИТЬ СКЛАД ОМОНА', text_en: 'LOOT POLICE DEPOT', action: (Events, GameState, translate) => { GameState.get().resources.caps += 500; GameState.get().player.humanity -= 30; Events.emit('ui:toast', 'ХАОС НАШЕЙ ПОЛЬЗЕ'); } }
    ]
  },
  {
    day: 250, speaker: 'ШАНТАЖ ЧИНОНИКА', speaker_en: 'OFFICIAL BLACKMAIL', img: 'img/char_shark.webp',
    text_ru: 'Акула дает вам компромат на вице-мэра Сектора 4. У вас есть выбор: заставить его саботировать охранные турели Мэра или продать компромат обратно.',
    text_en: 'Shark gives you dirt on the Sector 4 Deputy Mayor. You have a choice: force him to sabotage the Mayor\'s defense turrets or sell the dirt back.',
    choices: [
      { text_ru: 'ЗАСТАВИТЬ ОТКЛЮЧИТЬ ТУРЕЛИ', text_en: 'FORCE TO DISABLE TURRETS', action: (Events, GameState, translate) => { 
          const st = GameState.get();
          st.flags.hasOfficial = true;
          st.flags.evidenceCount = (st.flags.evidenceCount || 0) + 1; // CLUE #7 (Official orders)
          Events.emit('ui:toast', 'ПОЛУЧЕНА УЛИКА №7 (Приказ об отключении)');
        } 
      },
      { text_ru: 'ПРОДАТЬ КОМПРОМАТ ЗА 800 РУБ', text_en: 'SELL DIRT FOR 800 RUB', action: (Events, GameState, translate) => { GameState.get().resources.caps += 800; Events.emit('ui:toast', '+800 РУБЛЕЙ'); } }
    ]
  },
  {
    day: 260, speaker: 'ЛОГОВО В ПОДЗЕМЕЛЬЕ', speaker_en: 'SEWER HIDEOT',
    text_ru: 'Вы закрепились в заброшенном техническом бункере под Сектором 4. Все системы готовы для финального проникновения к Мэру.',
    text_en: 'You secured a base in an abandoned technical bunker beneath Sector 4. All systems are ready for the final infiltration to the Mayor.',
    choices: [
      { text_ru: 'НАЧАТЬ ОПЕРАЦИЮ', text_en: 'START OPERATION', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ЦЕЛЬ: МЭРИЯ'); } }
    ]
  },
  {
    day: 270, speaker: 'ЖУРНАЛИСТКА ЕЛЕНА', speaker_en: 'JOURNALIST ELENA', img: 'img/char_elena.webp',
    text_ru: 'Журналистка независимого вестника находит вас в бункере: «Князь, я пишу статью о незаконном чипировании граждан Сектора 4. У вас есть доказательства? Мне нужны как минимум 3 улики, чтобы выпустить статью!»',
    text_en: 'A journalist from an independent bulletin finds you in the bunker: "Prince, I\'m writing an article on illegal citizen chipping in Sector 4. Do you have proof? I need at least 3 clues to publish the article!"',
    choices: [
      { text_ru: 'ПЕРЕДАТЬ УЛИКИ ПРЕССЕ', text_en: 'HAND EVIDENCE TO PRESS', action: (Events, GameState, translate) => { 
          const st = GameState.get();
          const hasEnough = (st.flags.evidenceCount || 0) >= 3;
          if (hasEnough) {
            st.player.humanity += 20;
            st.flags.exposedByPress = true;
            Events.emit('ui:showDialogue', {
              speaker: 'ЕЛЕНА', speaker_en: 'ELENA', img: 'img/char_elena.webp',
              text_ru: '«Боже мой... Этого более чем достаточно! Договоры, логи дешифратора, накладные на взрывчатку... Завтра город проснется и увидит правду!»',
              text_en: '"My God... This is more than enough! Contracts, decryptor logs, explosives invoices... Tomorrow the city will wake up and see the truth!"'
            });
          } else {
            Events.emit('ui:showDialogue', {
              speaker: 'ЕЛЕНА', speaker_en: 'ELENA', img: 'img/char_elena.webp',
              text_ru: '«Этого мало, Князь... Простые домыслы. Мэр сотрет меня в порошок, если я опубликую это без твердых улик (нужно собрать 3 штуки). Простите».',
              text_en: '"This is not enough, Prince... Just speculations. The Mayor will crush me if I publish this without hard proof (need to collect 3). Sorry."'
            });
          }
        } 
      },
      { text_ru: 'ПОДКУПИТЬ ЕЁ, ЧТОБЫ СКРЫТЬСЯ', text_en: 'BRIBE HER TO HIDE', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 1000; GameState.get().player.humanity -= 20; Events.emit('ui:toast', 'СВЯЗИ ОПЛАЧЕНЫ'); } }
    ]
  },
  {
    day: 280, speaker: 'САБОТАЖ ГАЛА-УЖИНА', speaker_en: 'GALA SABOTAGE',
    text_ru: 'Мэр устраивает банкет для инвесторов. Вы можете отравить вентиляцию токсином или украсть главную ключ-карту доступа к лифту личного кабинета Мэра.',
    text_en: 'The Mayor is hosting a banquet for investors. You can poison the ventilation with toxin or steal the main keycard for the Mayor\'s private office elevator.',
    choices: [
      { text_ru: 'ЯД В ВЕНТИЛЯЦИЮ (КРИМИНАЛ)', text_en: 'POISON VENTILATION (CRIMINAL)', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 50; Events.emit('ui:toast', 'ЖЕРТВЫ СРЕДИ ИНВЕСТОРОВ'); } },
      { text_ru: 'КРАЖА КАРТЫ (СКРЫТНОСТЬ)', text_en: 'STEAL CARD (STEALTH)', action: (Events, GameState, translate) => { GameState.get().flags.hasKeycard = true; Events.emit('ui:toast', 'КЛЮЧ-КАРТА ЛИФТА У ВАС'); } }
    ]
  },
  {
    day: 290, speaker: 'СОН О ПРОШЛОМ', speaker_en: 'DREAM OF PAST', img: 'img/event_office.webp',
    text_ru: 'Вам снится ваша семья. Вы еще директор «Иерихона», вы еще человек. Проснувшись на ржавом матрасе, вы понимаете: пути назад нет.',
    text_en: 'You dream of your family. You are still the Director of "Jericho", you are still human. Waking up on a rusty mattress, you realize: there is no turning back.',
    choices: [
      { text_ru: 'ВСПОМНИТЬ ВСЁ', text_en: 'REMEMBER ALL', action: (Events, GameState, translate) => { GameState.get().player.mood -= 20; Events.emit('ui:toast', 'БОЛЬ — НАШЕ ОРУЖИЕ'); } }
    ]
  },
  {
    day: 300, speaker: 'СБОР ЛЕЙТЕНАНТОВ', speaker_en: 'GATHERING LIEUTENANTS',
    text_ru: 'Ваша уличная армия киборгов готова. Вы стоите на ящике перед толпой во Внешнем Кольце: «Завтра мы вернем себе Сектор 4!»',
    text_en: 'Your street cyborg army is ready. You stand on a crate before the crowd in the Outer Ring: "Tomorrow we take back Sector 4!"',
    choices: [
      { text_ru: 'ПРОИЗНЕСИТЕ РЕЧЬ', text_en: 'GIVE SPEECH', action: (Events, GameState, translate) => { GameState.get().player.mood += 30; Events.emit('ui:toast', 'МОРАЛЬ БАНДЫ НА ВЫСОТЕ'); } }
    ]
  },
  {
    day: 310, speaker: 'ПОЖАР В ТРУЩОБАХ', speaker_en: 'SLUM FIRE',
    text_ru: 'Мэр отдал приказ выжечь Внешнее Кольцо. Тысячи жителей в ловушке. Ваш бункер горит.',
    text_en: 'The Mayor ordered to burn down the Outer Ring. Thousands of residents are trapped. Your bunker is burning.',
    choices: [
      { text_ru: 'СПАСАТЬ ЛЮДЕЙ ИЗ ОГНЯ', text_en: 'SAVE PEOPLE FROM FIRE', action: (Events, GameState, translate) => { GameState.get().player.humanity += 40; Events.emit('ui:toast', 'ВЫ ГЕРОЙ ВНЕШНЕГО КОЛЬЦА'); } },
      { text_ru: 'СПАСАТЬ ОРУЖЕЙНЫЙ СКЛАД', text_en: 'SAVE WEAPONS DEPOT', action: (Events, GameState, translate) => { GameState.get().player.dmg += 20; Events.emit('ui:toast', 'БАК УСИЛЕН (+20 УРОНА)'); } }
    ]
  },
  {
    day: 320, speaker: 'ОСАДА', speaker_en: 'SIEGE',
    text_ru: 'Весь район окружен силами безопасности Мэра. Роботы и киборги прочесывают руины. Вы зажаты в депо.',
    text_en: 'The entire district is surrounded by the Mayor\'s security forces. Robots and cyborgs comb the ruins. You are pinned down in the depot.',
    isCombat: true, enemyId: 'security',
    text_ru_win: 'Они не ожидали такого сопротивления. Вы прорвались к центральному лифту Сектора 4.',
    text_en_win: 'They didn\'t expect such resistance. You broke through to the central Sector 4 elevator.'
  },
  {
    day: 330, speaker: 'ПОСЛЕДНЕЕ ПИСЬМО', speaker_en: 'LAST LETTER', img: 'img/char_katya.webp',
    text_ru: 'Катя передает вам, что Мэр ждет вас в своем кабинете на вершине Иерихон-Тауэр. Он отключил охрану верхнего этажа.',
    text_en: 'Katya tells you the Mayor is waiting for you in his office at the top of Jericho Tower. He disabled the top-floor security.',
    choices: [
      { text_ru: 'ПОДНЯТЬСЯ К НЕМУ', text_en: 'ASCEND TO HIM', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ФИНАЛЬНАЯ БИТВА'); } }
    ]
  },
  {
    day: 340, speaker: 'ПЕРЕД БУРЕЙ', speaker_en: 'BEFORE STORM', img: 'img/event_office.webp',
    text_ru: 'Вы стоите перед дверьми кабинета Мэра. В руках — жесткий диск с детективным следом улик, в сердце — ярость из-за стертой жизни. Пора решить, кто вы есть.',
    text_en: 'You stand before the Mayor\'s office doors. In your hands is the hard drive with the detective trail of evidence, in your heart is rage for a stolen life. Time to decide who you are.',
    choices: [
      { text_ru: 'ВОЙТИ В КАБИНЕТ', text_en: 'ENTER OFFICE', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'РАСПЛАТА'); } }
    ]
  },
  {
    day: 350, speaker: 'МЭР АРТЁМОВ', speaker_en: 'MAYOR ARTYOMOV', img: 'img/char_mayor.webp',
    text_ru: 'Финал. Вы в его роскошном кабинете. Мэр оборачивается, ухмыляясь: «Ты пришел посадить меня с помощью своих улик? Или пришел убить меня и занять это теплое кресло корпорации «Иерихон»?»',
    text_en: 'The finale. You are in his luxurious office. The Mayor turns around, smirking: "Did you come to jail me with your evidence? Or did you come to kill me and take this warm seat of the "Jericho" corporation?"',
    choices: [
      {
        text_ru: 'ЗАБРАТЬ ВЛАСТЬ СЕБЕ (КРИМИНАЛ)', text_en: 'TAKE POWER FOR SELF (CRIMINAL)', action: (Events, GameState, translate) => {
          GameState.get().flags.endingType = 'criminal';
          handleStoryCombat({ enemyId: 'boss_mayor', text_ru: 'Последняя преграда на пути к трону.', text_en: 'The last obstacle on the way to the throne.' });
        }
      },
      {
        text_ru: 'ПЕРЕДАТЬ ДЕЛО ОМОНУ И ПРЕССЕ', text_en: 'HAND EVIDENCE TO POLICE & PRESS', action: (Events, GameState, translate) => {
          GameState.get().flags.endingType = 'justice';
          handleStoryCombat({ enemyId: 'boss_mayor', text_ru: 'Справедливость восторжествует.', text_en: 'Justice will prevail.' });
        }
      }
    ]
  }
];

export const NOTES = [
  { text_ru: 'ЗАПИСКА: «Мэр Артёмов контролирует все финансовые потоки Сектора 4. Нам туда не пробиться без доказательств».', text_en: 'NOTE: "Mayor Artyomov controls all financial flows of Sector 4. We can\'t get in there without proof."' },
  { text_ru: 'ЗАПИСКА: «Семён говорит, что полиция на вокзале берёт взятки крышками. Полезно помнить».', text_en: 'NOTE: "Semyon says the police at the station take caps as bribes. Useful to remember."' },
  { text_ru: 'ЗАПИСКА: «Катя упомянула, что Акула ищет компромат на Мэра. Интересно, сколько он готов заплатить?»', text_en: 'NOTE: "Katya mentioned that Shark is looking for dirt on the Mayor. Wonder how much he\'s willing to pay?"' },
  { text_ru: 'ЗАПИСКА: «В Секторе 4 готовится крупный снос трущоб. Люди будут бунтовать. Нужно быть готовым к хаосу».', text_en: 'NOTE: "A major slum demolition is being prepared in Sector 4. People will riot. Must be ready for chaos."' },
  { text_ru: 'ЗАПИСКА: «Я помню те времена, когда Артёмов жал мне руку и называл лучшим другом. Теперь он приказал стереть меня».', text_en: 'NOTE: "I remember when Artyomov shook my hand and called me his best friend. Now he ordered to erase me."' },
  { text_ru: 'ЗАПИСКА: «Сектор 4 заблокирован полицией. Картограф — единственный, кто знает обходные пути через коллекторы».', text_en: 'NOTE: "Sector 4 is locked down by police. The Cartographer is the only one who knows detours through the sewers."' },
  { text_ru: 'ЗАПИСКА: «Говорят, в порту на складе хранится партия медикаментов. Но там полно личной охраны Мэра».', text_en: 'NOTE: "They say a batch of medicine is stored in the port warehouse. But it\'s full of the Mayor\'s personal guards."' }
];
