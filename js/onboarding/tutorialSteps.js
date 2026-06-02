// === ШАГИ ОНБОРДИНГА ===
// Обучение встроено в лор (plan.md §7.4): не «нажмите кнопку», а «система требует активации».
// advanceOn: 'dayPassed' — шаг ждёт первого прожитого дня; 'button' — кнопку «ДАЛЕЕ».

export const TUTORIAL_STEPS = [
  {
    id: 'awaken', target: '#charBtn', advanceOn: 'dayPassed',
    text_ru: '<b>ПРОТОКОЛ ИЕРИХОН.</b> Ты — клон №' + '∞. Система требует активации.<br><br>Коснись тела, чтобы прожить день.',
    text_en: '<b>JERICHO PROTOCOL.</b> You are clone No.∞. The system requires activation.<br><br>Touch the body to live a day.'
  },
  {
    id: 'survival', target: '#statusBars', advanceOn: 'button',
    text_ru: '<b>ТЕЛО ДЕГРАДИРУЕТ.</b> Голод, жажда и рассудок падают с каждым днём.<br><br>Если шкалы опустеют — клон будет ликвидирован.',
    text_en: '<b>THE BODY DEGRADES.</b> Hunger, thirst and sanity drop each day.<br><br>If the bars empty out — the clone is liquidated.'
  },
  {
    id: 'supplies', target: '#res', advanceOn: 'button',
    text_ru: '<b>АРХИВ ВЫДАЛ МАТЕРИАЛЫ.</b> Используй еду и воду, чтобы восполнить шкалы.<br><br>Материалы и кредиты пригодятся в Синтезаторе и Торговой сети.',
    text_en: '<b>THE ARCHIVE ISSUED MATERIALS.</b> Use food and water to refill the bars.<br><br>Materials and credits are spent in the Synthesizer and Trade Network.'
  },
  {
    id: 'archive', target: '#archiveBtn', advanceOn: 'button',
    text_ru: '<b>СМЕРТЬ — НЕ КОНЕЦ.</b> Каждый цикл оставляет очки памяти в Архиве Иерихона.<br><br>Трать их на постоянные улучшения следующих клонов. Цикл начинается заново.',
    text_en: '<b>DEATH IS NOT THE END.</b> Each cycle leaves memory points in the Jericho Archive.<br><br>Spend them on permanent upgrades for future clones. The cycle begins anew.'
  }
];
