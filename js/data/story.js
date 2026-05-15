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
    day: 1, speaker: 'СТАРЫЙ СЕМЁН', speaker_en: 'OLD SEMYON', img: 'img/char_semyon.png',
    text_ru: '— Эй, парень, ты живой там? Вылезай из этой груды тряпья. Город проснулся, а значит — пора искать еду, пока крысы не съели твои сапоги. Ты вообще помнишь, как тебя зовут?',
    text_en: '— Hey kid, you alive in there? Get out of that pile of rags. The city is awake, which means it\'s time to look for food before the rats eat your boots. Do you even remember your name?',
    choices: [
      { text_ru: '«МЕНЯ ЗОВУТ АНДРЕЙ... КАЖЕТСЯ»', text_en: '"MY NAME IS ANDREY... I THINK"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.min(100, GameState.get().player.humanity + 5); Events.emit('ui:toast', translate('toast_humanity', '+5')); Events.emit('ui:showDialogue', { speaker: 'СЕМЁН', speaker_en: 'SEMYON', text_ru: '— Звучит благородно. Слишком благородно для этого места. Здесь ты просто Князь. Или никто. Вставай, Князь. На вокзале сегодня раздают бесплатный суп, если поторопимся — успеем.', text_en: '— Sounds noble. Too noble for this place. Here you\'re just Prince. Or nobody. Get up, Prince. They\'re giving out free soup at the station today; if we hurry, we\'ll make it.' }); } },
      { text_ru: '«НЕ ТВОЁ ДЕЛО, СТАРИК»', text_en: '"NONE OF YOUR BUSINESS, OLD MAN"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 5); Events.emit('ui:toast', translate('toast_humanity', '-5')); Events.emit('ui:showDialogue', { speaker: 'СЕМЁН', speaker_en: 'SEMYON', text_ru: '— Грубость — плохая защита от голода. Но я тебя не виню. Улицы быстро выжигают вежливость. Иди своей дорогой, но смотри под ноги. Копы сегодня злые.', text_en: '— Rudeness is a poor defense against hunger. But I don\'t blame you. The streets burn out politeness fast. Go your way, but watch your step. The cops are angry today.' }); } }
    ]
  },
  {
    day: 10, speaker: 'ОБРЫВОК ГАЗЕТЫ', speaker_en: 'SCRAP OF PAPER', img: 'img/event_abandoned_office.png',
    text_ru: 'Ветер бросает вам в лицо мокрую страницу из вечернего выпуска. На главной полосе — Мэр Артёмов пожимает руку какому-то иностранному инвестору. «Будущее города в надежных руках», гласит подпись.',
    text_en: 'The wind throws a wet page from the evening edition into your face. On the front page — Mayor Artyomov shakes hands with some foreign investor. "The city\'s future is in reliable hands," reads the caption.',
    choices: [
      { text_ru: 'СЖАТЬ КУЛАКИ ОТ ЯРОСТИ', text_en: 'CLENCH FISTS IN RAGE', action: (Events, GameState, translate) => { GameState.get().player.mood = Math.max(0, GameState.get().player.mood - 10); Events.emit('ui:toast', 'ЯРОСТЬ ПЕРЕПОЛНЯЕТ ВАС'); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Его руки в крови, а не в надежности. Ты помнишь каждое его слово в ту ночь. Ты найдешь способ заставить его ответить.', text_en: 'His hands are in blood, not reliability. You remember every word he said that night. You will find a way to make him answer.' }); } },
      { text_ru: 'ВЫБРОСИТЬ ГАЗЕТУ В ГРЯЗЬ', text_en: 'THROW NEWSPAPER INTO MUD', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 2); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Это уже не твоя жизнь. Твоя жизнь теперь здесь, среди мусорных баков. Забыть — единственный способ не сойти с ума.', text_en: 'This is no longer your life. Your life is here now, among the trash cans. Forgetting is the only way not to go crazy.' }); } }
    ]
  },
  {
    day: 20, speaker: 'СТАРЫЙ ЗНАКОМЫЙ', speaker_en: 'OLD ACQUAINTANCE', img: 'img/char_semyon.png',
    text_ru: 'Мимо проходит бездомный, в котором вы узнаете своего бывшего охранника. Он смотрит на вас, в ужасе расширяя глаза, и тут же отворачивается, ускоряя шаг.',
    text_en: 'A homeless man passes by, and you recognize your former security guard. He looks at you, eyes widening in horror, and immediately turns away, quickening his pace.',
    choices: [
      { text_ru: 'ОКЛИКНУТЬ ЕГО', text_en: 'CALL OUT TO HIM', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ОН СЛИШКОМ НАПУГАН'); Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Даже те, кто был верен мне, теперь видят во мне мертвеца. Или проклятого. Впрочем, теперь это взаимно.', text_en: 'Even those who were loyal to me now see a dead man in me. Or a cursed one. Well, now it\'s mutual.' }); } },
      { text_ru: 'ПРОИГНОРИРОВАТЬ', text_en: 'IGNORE', action: (Events, GameState, translate) => { GameState.get().player.mood += 5; Events.emit('ui:toast', 'МЕНЬШЕ СВИДЕТЕЛЕЙ — ПРОЩЕ ЖИТЬ'); } }
    ]
  },
  {
    day: 30, speaker: 'ОФИЦИАНТКА КАТЯ', speaker_en: 'WAITRESS KATYA', img: 'img/char_katya.png',
    text_ru: 'Вы заглядываете в окно дешевой забегаловки. Девушка за стойкой замирает, увидев ваше лицо. Это Катя, ваша бывшая помощница. Она узнала вас, несмотря на бороду и грязь.',
    text_en: 'You look into the window of a cheap diner. The girl behind the counter freezes when she sees your face. It\'s Katya, your former assistant. She recognized you despite the beard and dirt.',
    choices: [
      {
        text_ru: 'ПОПРОСИТЬ О ПОМОЩИ', text_en: 'ASK FOR HELP', action: (Events, GameState, translate) => {
          Events.emit('ui:showDialogue', {
            speaker: 'КАТЯ', speaker_en: 'KATYA',
            text_ru: '— Боже... Андрей Данилов? Это правда вы? Шепчут, что вы погибли... Слушайте, Мэр ищет какие-то документы. Те самые, из Сектора 4. Он уверен, что они у вас. Будьте осторожны.',
            text_en: '— God... Andrey Danilov? Is it really you? They whisper that you died... Listen, the Mayor is looking for some documents. The ones from Sector 4. He\'s sure you have them. Be careful.',
            choices: [{ text_ru: 'ПОЛУЧИТЬ ПАЙОК ОТ НЕЁ', text_en: 'RECEIVE RATION FROM HER', action: () => { GameState.get().resources.food += 5; Events.emit('ui:toast', '+5 ЕДЫ'); } }]
          });
        }
      },
      { text_ru: 'СКРЫТЬСЯ В ТЕНЯХ', text_en: 'HIDE IN THE SHADOWS', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ВЫ НЕ ХОТИТЕ, ЧТОБЫ ВАС ВИДЕЛИ ТАКИМ'); } }
    ]
  },
  {
    day: 40, speaker: 'ПОТЕРЯННЫЙ КОШЕЛЕК', speaker_en: 'LOST WALLET', img: 'img/event_port.png',
    text_ru: 'В луже у дорогого ресторана вы видите кожаный кошелек. Внутри — пачка крупных купюр и визитка вашего бывшего конкурента.',
    text_en: 'In a puddle near an expensive restaurant, you see a leather wallet. Inside is a wad of large bills and a business card of your former competitor.',
    choices: [
      { text_ru: 'ЗАБРАТЬ ДЕНЬГИ', text_en: 'TAKE THE MONEY', action: (Events, GameState, translate) => { GameState.get().resources.caps += 100; GameState.get().player.humanity -= 5; Events.emit('ui:toast', '+100 РУБЛЕЙ'); } },
      { text_ru: 'ВЫКИНУТЬ В КАНАЛИЗАЦИЮ', text_en: 'THROW IN SEWER', action: (Events, GameState, translate) => { GameState.get().player.mood += 10; Events.emit('ui:toast', 'МАЛЕНЬКАЯ МЕСТЬ ПРИЯТНА'); } }
    ]
  },
  {
    day: 50, speaker: 'СЛУХИ У КОСТРА', speaker_en: 'CAMPFIRE RUMORS', img: 'img/char_semyon.png',
    text_ru: '— Говорят, Князь вернулся, — шепчутся бродяги у бочки с огнем. — Собирает людей, чтобы сжечь Мэрию. \nОни не знают, что вы стоите прямо за их спинами.',
    text_en: '— They say the Prince is back, — the drifters whisper by the fire barrel. — Gathering people to burn City Hall. \nThey don\'t know you\'re standing right behind them.',
    choices: [
      { text_ru: 'ПОДТВЕРДИТЬ СЛУХИ', text_en: 'CONFIRM RUMORS', action: (Events, GameState, translate) => { GameState.get().player.mood += 15; GameState.get().player.humanity -= 5; Events.emit('ui:toast', 'СТРАХ — ЭТО УВАЖЕНИЕ'); } },
      { text_ru: 'ПРОМОЛЧАТЬ', text_en: 'STAY SILENT', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СКРЫТНОСТЬ ПРЕЖДЕ ВСЕГО'); } }
    ]
  },
  {
    day: 60, speaker: 'СЕРЖАНТ ПЕТРЕНКО', speaker_en: 'SERGEANT PETRENKO', img: 'img/char_petrenko.png',
    text_ru: '— Так-так, старый знакомый. Мэр назначил награду за любую информацию о "призраках из прошлого". Ты выглядишь очень похожим на одного такого призрака, бродяга.',
    text_en: '— Well, well, an old acquaintance. The Mayor has put a bounty on any information about "ghosts from the past." You look a lot like one of those ghosts, drifter.',
    isCombat: true, enemyId: 'thug',
    text_ru_win: 'Коп стонет на земле. Вы забираете его рацию. Теперь вы сможете слушать переговоры патрулей.',
    text_en_win: 'The cop groans on the ground. You take his radio. Now you can listen to patrol chatter.'
  },
  {
    day: 70, speaker: 'УЛИЧНАЯ БАНДА', speaker_en: 'STREET GANG', img: 'img/char_gang_leader.png',
    text_ru: 'Трое парней в спортивных костюмах преграждают вам путь. — Слышь, дед, за проход по нашей территории надо платить. Или натурой, или зубами.',
    text_en: 'Three guys in tracksuits block your path. — Hey old man, you gotta pay to pass through our territory. Either with cash or with your teeth.',
    choices: [
      { text_ru: 'ОТКУПИТЬСЯ (50 РУБ)', text_en: 'PAY OFF (50 RUB)', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 50; Events.emit('ui:toast', 'ВЫ СОХРАНИЛИ ЗДОРОВЬЕ'); } },
      { text_ru: 'ПОКАЗАТЬ, КТО ТУТ ГЛАВНЫЙ', text_en: 'SHOW WHO\'S BOSS', action: (Events, GameState, translate) => { 
          GameState.get().player.hp -= 20;
          GameState.get().player.humanity -= 10;
          Events.emit('ui:toast', 'ДРАКА БЫЛА ЖЕСТОКОЙ');
          Events.emit('ui:showDialogue', { speaker: 'МЫСЛИ', speaker_en: 'THOUGHTS', text_ru: 'Они думали, что я просто старик. Они ошибались. Ярость греет лучше, чем водка.', text_en: 'They thought I was just an old man. They were wrong. Rage warms better than vodka.' });
        } 
      }
    ]
  },
  {
    day: 80, speaker: 'СТАРЫЙ СОПЕРНИК', speaker_en: 'OLD RIVAL', img: 'img/char_mayor.png',
    text_ru: 'В окне проезжающего лимузина вы видите лицо человека, который когда-то предал вас ради Мэра. Он смеется, попивая шампанское. Он вас не заметил.',
    text_en: 'In the window of a passing limousine, you see the face of the man who once betrayed you for the Mayor. He is laughing, sipping champagne. He didn\'t notice you.',
    choices: [
      { text_ru: 'КИНУТЬ КАМЕНЬ ВСЛЕД', text_en: 'THROW A STONE', action: (Events, GameState, translate) => { GameState.get().player.mood += 20; Events.emit('ui:toast', 'СТЕКЛО ТРЕСНУЛО. ПРИЯТНО.'); } },
      { text_ru: 'ЗАПОМНИТЬ НОМЕР', text_en: 'REMEMBER NUMBER', action: (Events, GameState, translate) => { GameState.get().flags.knowRivalCar = true; Events.emit('ui:toast', 'ИНФОРМАЦИЯ — СИЛА'); } }
    ]
  },
  {
    day: 90, speaker: 'НОЧНОЙ КИОСК', speaker_en: 'NIGHT KIOSK', img: 'img/event_port.png',
    text_ru: 'Продавец заснул, оставив окно приоткрытым. На прилавке лежат блоки сигарет и лотерейные билеты.',
    text_en: 'The clerk fell asleep, leaving the window slightly ajar. Blocks of cigarettes and lottery tickets lie on the counter.',
    choices: [
      { text_ru: 'УКРАСТЬ СИГАРЕТЫ', text_en: 'STEAL CIGARETTES', action: (Events, GameState, translate) => { GameState.get().resources.caps += 200; GameState.get().player.humanity -= 15; Events.emit('ui:toast', 'УДАЧНОЕ ДЕЛО'); } },
      { text_ru: 'ПРОЙТИ МИМО', text_en: 'PASS BY', action: (Events, GameState, translate) => { GameState.get().player.humanity += 5; Events.emit('ui:toast', 'СОВЕСТЬ ЧИСТА'); } }
    ]
  },
  {
    day: 100, speaker: 'СТАРЫЙ ОФИС', speaker_en: 'OLD OFFICE', img: 'img/event_abandoned_office.png',
    text_ru: 'Вы пробрались в здание своей бывшей компании. Теперь здесь склад конфиската и притон. Но в стене за старым сейфом всё ещё спрятан тайник, о котором знал только ты.',
    text_en: 'You snuck into your former company\'s building. Now it\'s a confiscation warehouse and a den. But in the wall behind the old safe, there\'s still a cache only you knew about.',
    choices: [
      {
        text_ru: 'ОТКРЫТЬ ТАЙНИК', text_en: 'OPEN CACHE', action: (Events, GameState, translate) => {
          GameState.get().resources.caps += 500;
          GameState.get().flags.hasEvidence = true;
          Events.emit('ui:toast', 'ДОКУМЕНТЫ НАЙДЕНЫ!');
          Events.emit('ui:showDialogue', { speaker: 'КНЯЗЬ', speaker_en: 'PRINCE', text_ru: 'Вот они. Счета, подписи, доказательства аферы с Сектором 4. Теперь у меня есть оружие посильнее кирпича.', text_en: 'Here they are. Accounts, signatures, evidence of the Sector 4 scam. Now I have a weapon stronger than a brick.' });
        }
      }
    ]
  },
  {
    day: 110, speaker: 'БЫВШИЙ АЙТИШНИК', speaker_en: 'FORMER IT HEAD', img: 'img/char_hacker.png',
    text_ru: 'В подвале заброшенной хрущевки вы находите парня, который когда-то заведовал вашей серверной. Он обложен старым железом и взламывает терминалы за еду.',
    text_en: 'In the basement of an abandoned apartment building, you find the guy who once ran your server room. He\'s surrounded by old hardware, hacking terminals for food.',
    choices: [
      { text_ru: 'НАЙНЯТЬ ЕГО', text_en: 'HIRE HIM', action: (Events, GameState, translate) => { 
          GameState.get().resources.food -= 10;
          GameState.get().flags.hasHacker = true;
          Events.emit('ui:toast', 'ХАКЕР В КОМАНДЕ');
        } 
      },
      { text_ru: 'ЗАБРАТЬ ЕГО ЖЕЛЕЗО', text_en: 'TAKE HIS HARDWARE', action: (Events, GameState, translate) => { GameState.get().resources.caps += 300; GameState.get().player.humanity -= 10; Events.emit('ui:toast', 'ЛОМ — ЭТО ДЕНЬГИ'); } }
    ]
  },
  {
    day: 120, speaker: 'ОБЛАВА В ТРУЩОБАХ', speaker_en: 'SLUM RAID', img: 'img/char_petrenko.png',
    text_ru: 'Полиция зачищает ваш район. Сжигают палатки, грузят людей в автозаки. Вы видите, как сержант бьет беззащитную старуху.',
    text_en: 'Police are clearing your area. Burning tents, loading people into vans. You see a sergeant hitting a defenseless old woman.',
    choices: [
      { text_ru: 'ВМЕШАТЬСЯ', text_en: 'INTERVENE', action: (Events, GameState, translate) => { 
          GameState.get().player.hp -= 30;
          GameState.get().player.humanity += 20;
          Events.emit('ui:toast', 'ВЫ ОТБИЛИ СТАРУХУ');
        } 
      },
      { text_ru: 'СПАСАТЬ СВОИ ВЕЩИ', text_en: 'SAVE YOUR GEAR', action: (Events, GameState, translate) => { GameState.get().resources.food += 10; Events.emit('ui:toast', 'ВЫ УСПЕЛИ СПАСТИ ПРИПАСЫ'); } }
    ]
  },
  {
    day: 130, speaker: 'ТАЙНОЕ ПОСЛАНИЕ', speaker_en: 'SECRET MESSAGE', img: 'img/char_katya.png',
    text_ru: 'Под вашим матрасом вы находите записку, приклеенную жвачкой. «Князь, мы знаем, что ты жив. Соберись. В Секторе 4 готовится что-то страшное».',
    text_en: 'Under your mattress, you find a note taped with gum. "Prince, we know you\'re alive. Get ready. Something terrible is being planned in Sector 4."',
    choices: [
      { text_ru: 'ИСКАТЬ ОТПРАВИТЕЛЯ', text_en: 'SEARCH SENDER', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СЛЕДЫ ВЕДУТ В МЭРИЮ'); } },
      { text_ru: 'СЖЕЧЬ ЗАПИСКУ', text_en: 'BURN NOTE', action: (Events, GameState, translate) => { GameState.get().player.mood += 5; Events.emit('ui:toast', 'ЛИШНИЕ ЗНАНИЯ — ЛИШНЯЯ КРОВЬ'); } }
    ]
  },
  {
    day: 140, speaker: 'ПОДПОЛЬНЫЙ БОЙ', speaker_en: 'UNDERGROUND FIGHT', img: 'img/char_shark.png',
    text_ru: 'Вас приглашают на закрытый турнир в канализации. Ставки — еда, патроны и жизнь. Вы выходите на арену против огромного дезертира.',
    text_en: 'You are invited to a closed tournament in the sewers. Stakes — food, ammo, and life. You enter the arena against a massive deserter.',
    isCombat: true, enemyId: 'queen', // Используем Queen как сильного врага
    text_ru_win: 'Толпа ревет. Вы теперь легенда сточных вод.',
    text_en_win: 'The crowd roars. You are now a sewer legend.'
  },
  {
    day: 150, speaker: 'БАРЫГА «АКУЛА»', speaker_en: 'SHARK THE DEALER', img: 'img/char_shark.png',
    text_ru: '— Слышал о тебе, Князь. Ты ищешь способ свалить Мэра? У меня есть другой план. С такими документами ты можешь не сажать его, а возглавить все его теневые потоки. Стать Королем этого города. Что скажешь?',
    text_en: '— Heard of you, Prince. You looking for a way to take down the Mayor? I have another plan. With those documents, you could lead his shadow operations instead of jailing him. Become the King of this city. What do you say?',
    choices: [
      {
        text_ru: '«МНЕ НУЖНА ВЛАСТЬ, А НЕ ПРАВОСУДИЕ»', text_en: '"I WANT POWER, NOT JUSTICE"', action: (Events, GameState, translate) => {
          GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 20);
          GameState.get().flags.criminalPath = true;
          Events.emit('ui:toast', 'ПУТЬ КРИМИНАЛА ВЫБРАН');
          Events.emit('ui:showDialogue', { speaker: 'АКУЛА', speaker_en: 'SHARK', text_ru: '— Наш человек. Начнем с порта. Там стоит груз Мэра, который он очень не хочет терять. Перехватим его.', text_en: '— That\'s my man. Let\'s start with the port. The Mayor has a shipment there he really doesn\'t want to lose. Let\'s intercept it.' });
        }
      },
      { text_ru: '«Я НЕ ТАКОЙ, КАК ВЫ»', text_en: '"I AM NOT LIKE YOU"', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.min(100, GameState.get().player.humanity + 10); Events.emit('ui:toast', 'ВЕРНОСТЬ ИДЕАЛАМ'); } }
    ]
  },
  {
    day: 160, speaker: 'ВЗЛОМ СЕТИ', speaker_en: 'NETWORK BREACH', img: 'img/event_abandoned_office.png',
    text_ru: 'Если у вас есть хакер, вы можете проникнуть в систему безопасности Мэрии. Это даст вам доступ к планам охраны.',
    text_en: 'If you have a hacker, you can breach City Hall\'s security system. This will give you access to guard schedules.',
    choices: [
      { text_ru: 'ВЗЛОМАТЬ (ТРЕБУЕТ ХАКЕРА)', text_en: 'HACK (REQUIRES HACKER)', action: (Events, GameState, translate) => { 
          if (GameState.get().flags.hasHacker) {
            GameState.get().flags.hasGuardPlans = true;
            Events.emit('ui:toast', 'ПЛАНЫ ОХРАНЫ ПОЛУЧЕНЫ');
          } else {
            Events.emit('ui:toast', 'У ВАС НЕТ НУЖНОГО ЧЕЛОВЕКА');
          }
        } 
      },
      { text_ru: 'ОТКАЗАТЬСЯ', text_en: 'REFUSE', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СЛИШКОМ РИСКОВАННО'); } }
    ]
  },
  {
    day: 170, speaker: 'ПОДКУПНЫЙ ОХРАННИК', speaker_en: 'BRIBED GUARD', img: 'img/char_guard.png',
    text_ru: 'Охранник у заднего входа Мэрии намекает, что за определенную сумму он может "забыть" закрыть дверь в полночь.',
    text_en: 'A guard at the back entrance of City Hall hints that for a certain amount he might "forget" to lock the door at midnight.',
    choices: [
      { text_ru: 'ПОДКУПИТЬ (500 РУБ)', text_en: 'BRIBE (500 RUB)', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 500; GameState.get().flags.backDoorOpen = true; Events.emit('ui:toast', 'ПУТЬ СВОБОДЕН'); } },
      { text_ru: 'УГРОЖАТЬ ЕМУ', text_en: 'THREATEN HIM', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 10; Events.emit('ui:toast', 'ОН ИСПУГАН, НО НЕ ПОМОЖЕТ'); } }
    ]
  },
  {
    day: 180, speaker: 'БОЛЬНОЙ РЕБЕНОК', speaker_en: 'SICK CHILD', img: 'img/char_katya.png',
    text_ru: 'Катя просит вас достать редкое лекарство для мальчика из подвала. Это то самое лекарство, которое Мэр держит на складе в порту.',
    text_en: 'Katya asks you to get rare medicine for a boy in the basement. It\'s the same medicine the Mayor keeps in the port warehouse.',
    choices: [
      { text_ru: 'ОБЕЩАТЬ ПОМОЧЬ', text_en: 'PROMISE HELP', action: (Events, GameState, translate) => { GameState.get().flags.questMedicine = true; Events.emit('ui:toast', 'ЦЕЛЬ: ПОРТОВЫЙ СКЛАД'); } },
      { text_ru: 'ОТКАЗАТЬ', text_en: 'REFUSE', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 20; Events.emit('ui:toast', 'ВЫ СТАЛИ ХОЛОДНЕЕ'); } }
    ]
  },
  {
    day: 190, speaker: 'СТАРЫЙ ДРУГ', speaker_en: 'OLD FRIEND', img: 'img/char_semyon.png',
    text_ru: '— Андрей, я нашел кое-что для тебя, — Семён протягивает вам старый пистолет. — Тебе он скоро понадобится.',
    text_en: '— Andrey, I found something for you, — Semyon hands you an old pistol. — You\'ll need it soon.',
    choices: [
      { text_ru: 'ВЗЯТЬ ОРУЖИЕ', text_en: 'TAKE WEAPON', action: (Events, GameState, translate) => { GameState.get().player.dmg += 5; Events.emit('ui:toast', '+5 УРОНА'); } }
    ]
  },
  {
    day: 200, speaker: 'ПОКУШЕНИЕ', speaker_en: 'ASSASSINATION ATTEMPT', img: 'img/char_shark.png',
    text_ru: 'Двое киллеров настигают вас в переулке. Похоже, Мэр понял, что вы всё еще живы.',
    text_en: 'Two hitmen catch up with you in an alley. Seems the Mayor realized you\'re still alive.',
    isCombat: true, enemyId: 'assassin',
    text_ru_win: 'Вы выжили. Но теперь охота началась по-настоящему.',
    text_en_win: 'You survived. But now the hunt has truly begun.'
  },
  {
    day: 210, speaker: 'НАВОДКА НА ПОРТ', speaker_en: 'PORT TIP', img: 'img/char_shark.png',
    text_ru: 'Акула сообщает, что груз в порту будет без охраны всего один час сегодня ночью. Это ваш шанс.',
    text_en: 'Shark reports that the shipment in the port will be unguarded for only one hour tonight. This is your chance.',
    choices: [
      { text_ru: 'ГОТОВИТЬСЯ К НАЛЕТУ', text_en: 'PREPARE FOR RAID', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'СКОРО 220-Й ДЕНЬ'); } }
    ]
  },
  {
    day: 220, speaker: 'ПОРТОВЫЙ СКЛАД', speaker_en: 'PORT WAREHOUSE', img: 'img/event_port.png',
    text_ru: 'Вы стоите перед ящиками с контрабандой. Если вы заберете их себе, вы станете богатейшим человеком на этих улицах. Но сотни людей останутся без лекарств, которые Мэр украл из гумпомощи.',
    text_en: 'You stand before crates of contraband. If you take them for yourself, you\'ll become the wealthiest man on these streets. But hundreds will go without the medicine the Mayor stole from aid.',
    choices: [
      {
        text_ru: 'ЗАБРАТЬ ВСЁ СЕБЕ', text_en: 'TAKE IT ALL', action: (Events, GameState, translate) => {
          GameState.get().resources.caps += 2000;
          GameState.get().player.humanity = Math.max(0, GameState.get().player.humanity - 30);
          Events.emit('ui:toast', '+2000 РУБЛЕЙ');
          Events.emit('ui:showDialogue', { speaker: 'КНЯЗЬ', speaker_en: 'PRINCE', text_ru: 'Деньги не пахнут. А эти люди всё равно бы ничего не получили. Теперь я диктую правила.', text_en: 'Money doesn\'t smell. And those people wouldn\'t have gotten anything anyway. Now I dictate the rules.' });
        }
      },
      { text_ru: 'РАЗДАТЬ ЛЮДЯМ', text_en: 'DISTRIBUTE TO PEOPLE', action: (Events, GameState, translate) => { GameState.get().player.humanity = Math.min(100, GameState.get().player.humanity + 20); Events.emit('ui:toast', 'ВЫ — ГЕРОЙ УЛИЦ'); } }
    ]
  },
  {
    day: 230, speaker: 'ВЕРБОВКА', speaker_en: 'RECRUITMENT', img: 'img/char_shark.png',
    text_ru: 'С деньгами из порта вы можете нанять собственную банду. Это сделает вас неприкасаемым.',
    text_en: 'With the money from the port, you can hire your own gang. This will make you untouchable.',
    choices: [
      { text_ru: 'СОЗДАТЬ БАНДУ (1000 РУБ)', text_en: 'FORM GANG (1000 RUB)', action: (Events, GameState, translate) => { 
          if (GameState.get().resources.caps >= 1000) {
            GameState.get().resources.caps -= 1000;
            GameState.get().flags.hasGang = true;
            Events.emit('ui:toast', 'У ВАС ЕСТЬ СИЛА');
          } else {
            Events.emit('ui:toast', 'НЕДОСТАТОЧНО СРЕДСТВ');
          }
        } 
      },
      { text_ru: 'РАБОТАТЬ ОДНОМУ', text_en: 'WORK ALONE', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ОДИНОКИЙ ВОЛК'); } }
    ]
  },
  {
    day: 240, speaker: 'ПРОТЕСТЫ', speaker_en: 'PROTESTS', img: 'img/char_guard.png',
    text_ru: 'Люди выходят на улицы против Мэра. Полиция готовится к разгону. Вы можете возглавить толпу или использовать хаос для своей выгоды.',
    text_en: 'People take to the streets against the Mayor. Police are preparing to disperse them. You can lead the crowd or use the chaos for your own gain.',
    choices: [
      { 
        text_ru: 'ВОЗГЛАВИТЬ ПРОТЕСТ (БОЙ)', text_en: 'LEAD PROTEST (BATTLE)', action: (Events, GameState, translate) => { 
          GameState.get().player.humanity += 30;
          handleStoryCombat({ enemyId: 'riot_squad', text_ru: 'Вы стоите в первом ряду против щитов.', text_en: 'You stand in the front row against the shields.' });
        } 
      },
      { text_ru: 'ОГРАБИТЬ МАГАЗИНЫ', text_en: 'LOOT STORES', action: (Events, GameState, translate) => { GameState.get().resources.caps += 500; GameState.get().player.humanity -= 30; Events.emit('ui:toast', 'ХАОС — ЭТО ВОЗМОЖНОСТЬ'); } }
    ]
  },
  {
    day: 250, speaker: 'ШАНТАЖ ЧИНОНИКА', speaker_en: 'OFFICIAL BLACKMAIL', img: 'img/char_shark.png',
    text_ru: 'Акула дает вам компромат на одного из заместителей Мэра. Вы можете заставить его работать на вас.',
    text_en: 'Shark gives you dirt on one of the Mayor\'s deputies. You can make him work for you.',
    choices: [
      { text_ru: 'ЗАСТАВИТЬ ПОМОЧЬ', text_en: 'FORCE HELP', action: (Events, GameState, translate) => { GameState.get().flags.hasOfficial = true; Events.emit('ui:toast', 'СВОЙ ЧЕЛОВЕК В МЭРИИ'); } },
      { text_ru: 'ПРОДАТЬ КОМПРОМАТ', text_en: 'SELL DIRT', action: (Events, GameState, translate) => { GameState.get().resources.caps += 800; Events.emit('ui:toast', '+800 РУБЛЕЙ'); } }
    ]
  },
  {
    day: 260, speaker: 'ЛОГОВО В ПОДЗЕМЕЛЬЕ', speaker_en: 'SEWER HIDEOT', img: 'img/event_abandoned_office.png',
    text_ru: 'Вы обустроили настоящий штаб в канализации. Теперь у вас есть безопасное место для планирования финала.',
    text_en: 'You set up a real headquarters in the sewers. Now you have a safe place to plan the finale.',
    choices: [
      { text_ru: 'ПОДГОТОВИТЬ ПЛАН', text_en: 'PREPARE PLAN', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ФИНАЛ БЛИЗКО'); } }
    ]
  },
  {
    day: 270, speaker: 'ЖУРНАЛИСТКА ЕЛЕНА', speaker_en: 'JOURNALIST ELENA', img: 'img/char_katya.png',
    text_ru: 'Девушка с диктофоном находит вас в трущобах. — Андрей Данилов? Я пишу статью о коррупции в Секторе 4. Мне нужны ваши показания. Это шанс уничтожить Мэра легально.',
    text_en: 'A girl with a voice recorder finds you in the slums. — Andrey Danilov? I\'m writing an article on corruption in Sector 4. I need your testimony. This is a chance to destroy the Mayor legally.',
    choices: [
      { text_ru: 'ДАТЬ ИНТЕРВЬЮ (ПУТЬ ПРАВОСУДИЯ)', text_en: 'GIVE INTERVIEW (JUSTICE PATH)', action: (Events, GameState, translate) => { GameState.get().player.humanity += 20; GameState.get().flags.exposedByPress = true; Events.emit('ui:toast', 'ПРАВДА ВЫЙДЕТ НАРУЖУ'); } },
      { text_ru: 'ПОДКУПИТЬ ЕЁ, ЧТОБЫ МОЛЧАЛА', text_en: 'BRIBE HER TO STAY SILENT', action: (Events, GameState, translate) => { GameState.get().resources.caps -= 1000; GameState.get().player.humanity -= 20; Events.emit('ui:toast', 'СЛЕДЫ ЗАМЕТЕНЫ'); } }
    ]
  },
  {
    day: 280, speaker: 'САБОТАЖ ГАЛА-УЖИНА', speaker_en: 'GALA SABOTAGE', img: 'img/event_office.png',
    text_ru: 'Мэр устраивает бал. Вы можете отравить вино или просто выключить свет и украсть документы.',
    text_en: 'The Mayor is hosting a ball. You can poison the wine or just turn off the lights and steal documents.',
    choices: [
      { text_ru: 'ЯД (КРИМИНАЛ)', text_en: 'POISON (CRIMINAL)', action: (Events, GameState, translate) => { GameState.get().player.humanity -= 50; Events.emit('ui:toast', 'ЖЕРТВ БУДЕТ МНОГО'); } },
      { text_ru: 'КРАЖА (СКРЫТНОСТЬ)', text_en: 'STEAL (STEALTH)', action: (Events, GameState, translate) => { GameState.get().flags.hasKeycard = true; Events.emit('ui:toast', 'КЛЮЧ-КАРТА У ВАС'); } }
    ]
  },
  {
    day: 290, speaker: 'СОН О ПРОШЛОМ', speaker_en: 'DREAM OF PAST', img: 'img/portrait_archive.webp',
    text_ru: 'Вам снится ваша семья. Вы еще богаты, вы еще человек. Проснувшись, вы понимаете, что назад пути нет.',
    text_en: 'You dream of your family. You are still rich, you are still human. Waking up, you realize there is no turning back.',
    choices: [
      { text_ru: 'ВСПОМНИТЬ ВСЁ', text_en: 'REMEMBER ALL', action: (Events, GameState, translate) => { GameState.get().player.mood -= 20; Events.emit('ui:toast', 'БОЛЬ — ЭТО МОТИВАЦИЯ'); } }
    ]
  },
  {
    day: 300, speaker: 'СБОР ЛЕЙТЕНАНТОВ', speaker_en: 'GATHERING LIEUTENANTS', img: 'img/char_shark.png',
    text_ru: 'Ваша армия готова. Вы стоите перед своими людьми. — Завтра мы вернем себе этот город.',
    text_en: 'Your army is ready. You stand before your people. — Tomorrow we take back this city.',
    choices: [
      { text_ru: 'ПРОИЗНЕСТИ РЕЧЬ', text_en: 'GIVE SPEECH', action: (Events, GameState, translate) => { GameState.get().player.mood += 30; Events.emit('ui:toast', 'МОРАЛЬ ПОДНЯТА'); } }
    ]
  },
  {
    day: 310, speaker: 'ПОЖАР В ТРУЩОБАХ', speaker_en: 'SLUM FIRE', img: 'img/event_abandoned_office.png',
    text_ru: 'Мэр приказал сжечь гетто, чтобы "очистить" город. Тысячи людей в ловушке. Ваш штаб тоже под угрозой.',
    text_en: 'The Mayor ordered the ghetto burned to "cleanse" the city. Thousands are trapped. Your HQ is also at risk.',
    choices: [
      { text_ru: 'СПАСАТЬ ЛЮДЕЙ', text_en: 'SAVE PEOPLE', action: (Events, GameState, translate) => { GameState.get().player.humanity += 40; Events.emit('ui:toast', 'ВЫ — НАСТОЯЩИЙ КНЯЗЬ'); } },
      { text_ru: 'СПАСАТЬ ОРУЖИЕ', text_en: 'SAVE WEAPONS', action: (Events, GameState, translate) => { GameState.get().player.dmg += 20; Events.emit('ui:toast', 'ВЫ ГОТОВЫ К ВОЙНЕ'); } }
    ]
  },
  {
    day: 320, speaker: 'ОСАДА', speaker_en: 'SIEGE', img: 'img/char_petrenko.png',
    text_ru: 'Весь город оцеплен. Спецназ ищет "Князя". Вы загнаны в угол в старом депо.',
    text_en: 'The whole city is cordoned off. Special forces are looking for "The Prince". You are cornered in an old depot.',
    isCombat: true, enemyId: 'security',
    text_ru_win: 'Они не ожидали такого сопротивления. Вы прорвались.',
    text_en_win: 'They didn\'t expect such resistance. You broke through.'
  },
  {
    day: 330, speaker: 'ПОСЛЕДНЕЕ ПИСЬМО', speaker_en: 'LAST LETTER', img: 'img/char_katya.png',
    text_ru: 'Катя передает вам, что Мэр ждет вас. Он один. Или так он хочет, чтобы вы думали.',
    text_en: 'Katya tells you the Mayor is waiting for you. He is alone. Or so he wants you to think.',
    choices: [
      { text_ru: 'ИДТИ К НЕМУ', text_en: 'GO TO HIM', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ЭТО КОНЕЦ'); } }
    ]
  },
  {
    day: 340, speaker: 'ПЕРЕД БУРЕЙ', speaker_en: 'BEFORE STORM', img: 'img/event_office.png',
    text_ru: 'Вы стоите перед входом в Мэрию. В руках — документы, в сердце — яд. Пора решить, кто вы на самом деле.',
    text_en: 'You stand before the entrance to City Hall. Documents in hand, poison in heart. Time to decide who you really are.',
    choices: [
      { text_ru: 'ВОЙТИ', text_en: 'ENTER', action: (Events, GameState, translate) => { Events.emit('ui:toast', 'ФИНАЛЬНЫЙ ЭТАП'); } }
    ]
  },
  {
    day: 350, speaker: 'МЭР АРТЁМОВ', speaker_en: 'MAYOR ARTYOMOV', img: 'img/event_office.png',
    text_ru: 'Финал близок. Вы в его кабинете. Мэр смотрит на вас, понимая, что проиграл. «Ты пришел посадить меня? Или пришел занять моё место?»',
    text_en: 'The end is near. You are in his office. The Mayor looks at you, realizing he has lost. "Did you come to jail me? Or did you come to take my place?"',
    choices: [
      {
        text_ru: 'СТАТЬ НОВЫМ ХОЗЯИНОМ ГОРОДА', text_en: 'BECOME THE NEW BOSS', action: (Events, GameState, translate) => {
          GameState.get().flags.endingType = 'criminal';
          handleStoryCombat({ enemyId: 'boss_mayor', text_ru: 'Последняя преграда на пути к трону.', text_en: 'The last obstacle on the way to the throne.' });
        }
      },
      {
        text_ru: 'СДАТЬ ЕГО ПОЛИЦИИ', text_en: 'HAND HIM TO POLICE', action: (Events, GameState, translate) => {
          GameState.get().flags.endingType = 'justice';
          handleStoryCombat({ enemyId: 'boss_mayor', text_ru: 'Справедливость восторжествует.', text_en: 'Justice will prevail.' });
        }
      }
    ]
  }
];
