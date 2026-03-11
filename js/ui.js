import { GameState as S } from './state.js';
import { GameData as D } from './data.js';
import { SoundManager } from './audio.js';

export const GameUI = (() => {
  const $ = sel => document.querySelector(sel);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const toast = msg => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = `> ${msg}`;
    $('#toasts').prepend(el);
    setTimeout(() => { el.style.animation = 'slideLeft 0.3s reverse forwards'; setTimeout(() => el.remove(), 300); }, 2500);
  };

  const renderTop = () => {
    const st = S.get();
    $('#day').textContent = t('day_label', st.day);
    $('#capsTop').textContent = t('credits_label', st.resources.caps);

    const weaponId = st.player.weaponId || Object.keys(D.WEAPON_STATS).find(k => D.WEAPON_STATS[k].name_ru === st.player.weaponName || D.WEAPON_STATS[k].name_en === st.player.weaponName);
    const w = weaponId ? D.WEAPON_STATS[weaponId] : null;
    const weaponStr = w ? loc(w, 'name') : (st.player.weaponName || '???');
    const weaponText = weaponStr.toUpperCase();

    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    $('#weaponPill').textContent = t('weapon_label', weaponText + (isAdrenaline ? ' [⚡]' : ''));
    $('#weaponPill').classList.toggle('highlight-text', isAdrenaline);
  };

  const renderMain = () => {
    const st = S.get(), p = st.player;
    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    const dmg = (p.baseDmg + p.dmgBonus) * (isAdrenaline ? 1.5 : 1);

    $('#statusBars').innerHTML = `
      <div>♥ ${t('health').toUpperCase()} ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='transform:scaleX(${clamp(p.hp / p.maxHp, 0, 1)})'></div></div></div>
      <div>🧠 ${t('mood').toUpperCase()} ${Math.round(p.mood)}/${p.maxMood}<div class='bar'><div class='fill bg-ok' style='transform:scaleX(${clamp(p.mood / p.maxMood, 0, 1)})'></div></div></div>`;

    $('#res').innerHTML = `
      <button class='pill pill-btn' data-use='food'>🍖 ${t('food').toUpperCase()}: ${st.resources.food}</button>
      <button class='pill pill-btn' data-use='water'>💧 ${t('water').toUpperCase()}: ${st.resources.water}</button>
      <button class='pill pill-btn' data-use='medkits'>✚ ${t('medkits').toUpperCase()}: ${st.resources.medkits}</button>
      <div class='pill'>⚙️ ${t('materials').toUpperCase()}: ${st.resources.materials}</div>
      <div class='pill'>⚡ ${t('ammo').toUpperCase()}: ${st.resources.ammo}</div>
      <div class='pill'>⚔️ ${t('damage').toUpperCase()}: ${Math.round(dmg)}</div>`;
  };



  const renderBattle = () => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    $('#battleTimer').textContent = `${c.time.toFixed(1)}s`;

    $('#pBars').innerHTML = `
      <div>♥ ${t('health').toUpperCase()} ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='transform:scaleX(${clamp(p.hp / p.maxHp, 0, 1)})'></div></div></div>`;

    $('#enemyName').textContent = `${e.icon} ${loc(e, 'name')}`;

    const imgEl = $('#enemyImg');
    if (e.img) {
      if (imgEl.getAttribute('src') !== e.img) imgEl.src = e.img;
      imgEl.style.display = 'block';
    } else {
      imgEl.removeAttribute('src');
      imgEl.style.display = 'none';
    }

    $('#eHp').style.transform = `scaleX(${clamp(e.hp / e.maxHp, 0, 1)})`;
    $('#telegraph').textContent = `[${t('waiting_attack').toUpperCase()}: ${Math.max(0, c.enemyAtk).toFixed(1)}s]`;
    $('#teleFill').style.transform = `scaleX(${clamp(1 - c.enemyAtk / e.atk, 0, 1)})`;

    // КД Игрока
    const atkFill = $('#atkFill');
    if (atkFill) {
      const cdPerc = p.atkCd > 0 ? (1 - p.atkCd / p.atkCdMax) : 1;
      atkFill.style.transform = `scaleX(${clamp(cdPerc, 0, 1)})`;
      $('#atk').disabled = p.atkCd > 0;
    }

    // Кнопка уклонения с кулдауном
    $('#dodge').disabled = c.cdDodge > 0;
    $('#dodge').textContent = c.cdDodge > 0 ? `${t('dodge').slice(0, 1)} [${c.cdDodge.toFixed(1)}s]` : t('dodge').toUpperCase();
  };

  // --- ИНТЕРНАЦИОНАЛИЗАЦИЯ (i18n) ---
  const TRANSLATIONS = {
    ru: {
      days: 'ДЕНЬ', status: 'СТАТУС', credits: 'КРЕДИТЫ', weapon: 'ОРУЖИЕ',
      health: 'ЗДОРОВЬЕ', mood: 'РАССУДОК', food: 'ЕДА', water: 'ВОДА',
      medkits: 'АПТ', materials: 'МАТ', ammo: 'ПАТР', damage: 'УРОН',
      defense: 'ЗАЩИТА', hp_bonus: 'БОНУС HP', equip: 'ВЫБРАТЬ', equipped: 'ВЫБРАНО',
      shop_items: 'ТОВАРЫ', shop_director: 'ДИРЕКТОР (IAP)', shop_desc: 'Эксклюзивные предложения от Иерихона.',
      buy: 'КУПИТЬ',
      goal_survive: '[ТЕКУЩАЯ ЦЕЛЬ: ВЫЖИТЬ]',
      cycles: 'ЦИКЛОВ (СМЕРТЕЙ): {0}',
      credits_label: '[КРЕДИТЫ]: {0}',
      day_label: 'ДЕНЬ {0}',
      status_exploring: 'СТАТУС: ИССЛЕДОВАНИЕ',
      status_combat: 'СТАТУС: БОЙ',
      weapon_label: 'ОРУЖИЕ: {0}',
      sound_btn: '🔊 ЗВУК',
      sound_mute: '🔇 ТИШИНА',
      hint_click: '<b>[ВВОД] КЛИК ПО ПЕРСОНАЖУ</b>',
      sys_init: 'ИНИЦИАЛИЗАЦИЯ СИСТЕМ...',
      btn_airdrop: '📦 ДРОН СНАБЖЕНИЯ',
      btn_adrenaline: '⚡ АДРЕНАЛИН',
      btn_emergency: '🚨 АВАРИЙНЫЙ ПАЁК',
      btn_merchant: 'СЕТЬ ТОРГОВЛИ',
      btn_inventory: 'ИНВЕНТАРЬ',
      btn_synth: 'СИНТЕЗАТОР',
      intercept_data: 'ПЕРЕХВАТ ДАННЫХ',
      btn_continue: 'ПРОДОЛЖИТЬ',
      event_warning: 'ВНИМАНИЕ: СОБЫТИЕ',
      btn_confirm: 'ПОДТВЕРДИТЬ',
      btn_cancel: 'ОТМЕНА',
      battle_mode: 'РЕЖИМ БОЯ',
      waiting_attack: '[ОЖИДАНИЕ АТАКИ]',
      atk: 'АТАКА',
      dodge: 'УКЛОНЕНИЕ',
      med: 'ЛЕЧЕНИЕ',
      retreat: 'ОТСТУПИТЬ',
      sys_msg: 'СИСТЕМНОЕ СООБЩЕНИЕ',
      btn_accept: 'ПРИНЯТЬ',
      btn_double_loot: '✖2 ТРОФЕИ 📺',
      merchant_desc: 'ОБМЕН КРЕДИТОВ НА РЕСУРСЫ.',
      btn_close_conn: 'ЗАКРЫТЬ СОЕДИНЕНИЕ',
      synth_desc: 'СИНТЕЗ И МОДЕРНИЗАЦИЯ.',
      btn_disconnect: 'ОТКЛЮЧИТЬСЯ',
      inventory_desc: 'ВЫБОР ДОСТУПНОГО СНАРЯЖЕНИЯ.',
      btn_close: 'ЗАКРЫТЬ',
      crit_failure: 'КРИТИЧЕСКИЙ СБОЙ',
      obj_status: 'СТАТУС ОБЪЕКТА:',
      liquidated: 'ЛИКВИДИРОВАН',
      reason_unknown: 'ПРИЧИНА: НЕИЗВЕСТНО',
      cycles_lived: 'ПРОЖИТО ЦИКЛОВ: {0}',
      sys_cleaned: '"СИСТЕМА ОЧИЩЕНА. ЗАГРУЗКА НОВОГО КЛОНА..."',
      btn_revive: '⚡ ВОСКРЕСНУТЬ ЗА НАГРАДУ 📺',
      btn_new_cycle: 'ИНИЦИАЛИЗАЦИЯ НОВОГО ЦИКЛА',
      cycle_end: 'КОНЕЦ ЦИКЛА',
      btn_restart_cycle: '↺ НАЧАТЬ НОВЫЙ ЦИКЛ',
      // Toasts
      toast_no_items: 'НЕТ ПРЕДМЕТА',
      toast_healed: '+{0} HP',
      toast_energy: '+6 HP, +10 РАССУДОК',
      toast_water: '+4 HP, +15 РАССУДОК',
      toast_weapon_equipped: 'ЭКИПИРОВАНО: {0}',
      toast_armor_equipped: 'ЭКИПИРОВАНА БРОНЯ: {0}',
      toast_already_have: 'УЖЕ ИМЕЕТСЯ',
      toast_not_enough_caps: 'НЕДОСТАТОЧНО КРЕДИТОВ (НУЖНО {0})',
      toast_humanity: '[Человечность {0}]',
      flee_msg: 'ВЫ СБЕЖАЛИ',
      flee_mood_lost: 'РАССУДОК: -15',
      defeat_reason_default: 'ПОТЕРЯ ЖИЗНЕННЫХ ПОКАЗАТЕЛЕЙ',
      defeat_msg_1: 'ОБЪЕКТ СПИСАН. ЗАГРУЗКА СЛЕДУЮЩЕГО.',
      defeat_msg_2: 'БИОМАТЕРИАЛ НЕПРИГОДЕН. УТИЛИЗАЦИЯ.',
      defeat_msg_3: 'ПОПЫТКА ПРОВАЛЕНА. ДАННЫЕ СОХРАНЕНЫ В АРХИВ.',
      defeat_msg_4: 'ВЫ БЫЛИ ТАК БЛИЗКО... ИЛИ НЕТ?',
      defeat_msg_5: 'СИСТЕМА: «СЛАБАЯ ОСОБЬ. ОЧИСТИТЬ СЕКТОР».',
      defeat_starved: 'КРИТИЧЕСКОЕ ИСТОЩЕНИЕ',
      defeat_dehydrated: 'ОБЕЗВОЖИВАНИЕ',
      // Game logic additions
      threat_level: 'УРОВЕНЬ СИЛЫ: {0}',
      threat_weak: '🟢 СЛАБЫЙ',
      threat_medium: '🟡 СРЕДНИЙ',
      threat_dangerous: '🟠 ОПАСНЫЙ',
      threat_deadly: '🔴 СМЕРТЕЛЬНЫЙ',
      btn_fight: 'В БОЙ',
      btn_flee: 'БЕЖАТЬ',
      btn_search: 'ОБЫСКАТЬ',
      btn_ignore: 'ИГНОРИРОВАТЬ',
      btn_create: 'СОЗДАТЬ',
      cost_label: 'СТОИМОСТЬ: {0}',
      mats_label: 'МАТ: {0}',
      ammo_label: 'ПАТР: {0}',
      day_calm: 'ТИХИЙ ДЕНЬ. НАЙДЕНЫ ОБЛОМКИ.',
      goal_1: '[ЦЕЛЬ: ВЫЖИТЬ И НАЙТИ ВЫХОД]',
      goal_2: '[ЦЕЛЬ: ИЗУЧИТЬ СЕКТОР 4]',
      goal_3: '[ЦЕЛЬ: РАЗГАДАТЬ ПАМЯТЬ]',
      goal_4: '[ЦЕЛЬ: СПАСТИСЬ ОТ АМАЗОНКИ]',
      goal_5: '[ЦЕЛЬ: НАЙТИ ДИРЕКТОРА]',
      goal_6: '[ЦЕЛЬ: ДОСТИЧЬ ГЛАВНОГО ЗАЛА]',
      goal_7: '[ЦЕЛЬ: СДЕЛАТЬ ВЫБОР]',
      corpse_echo: 'ЭХО ПРОШЛОГО',
      corpse_desc: 'ВЫ НАШЛИ ОСТАНКИ КЛОНА В ГРЯЗНОМ УГЛУ.\nЕСЛИ ВЕРИТЬ ЖЕТОНУ, ОН ПОГИБ В ЦИКЛЕ {0}.\nПРИЧИНА СМЕРТИ: {1}.\n\nВЫ ОБЫСКИВАЕТЕ ТО, ЧТО КОГДА-ТО БЫЛО ВАМИ. РАССУДОК И ЧЕЛОВЕЧНОСТЬ ПАДАЮТ.',
      btn_take_loot: 'ЗАБРАТЬ ОСТАТКИ',
      corpse_loot: 'ПОЛУЧЕНО: {0} МАТ, {1} ПАТР, {2} КР',
      bar_woman_negotiate_choice: 'ДОГОВОРИТЬСЯ (30%)',
      bar_woman_pay_choice: 'ЗАПЛАТИТЬ 50 КР',
      bar_woman_fight_choice: 'УГРОЖАТЬ (БОЙ)',
      bar_woman_negotiate_fail: '«Не пытайся меня обмануть! Либо плати, либо проваливай!»',
      bar_woman_fight_win: '«Хорошо! Ты победил! Прошлый "ты" был связан с Амазонка-Синт. Она где-то в северных лабораториях». ВЫ УЗНАЛИ РАСПОЛОЖЕНИЕ ЦЕЛИ.',
      res_food_empty: 'ГОЛОД: -5 HP',
      res_water_empty: 'ЖАЖДА: -8 HP',
      res_medkits_empty: 'НЕТ АПТЕЧЕК.',
      res_ammo_empty: 'НЕТ ПАТРОНОВ!',
      crit_hit: 'КРИТ!',
      dodge_success: 'УКЛОНЕНИЕ!',
      equip_weapon: 'ОРУЖИЕ',
      equip_item: 'РАСХОДНИК',
      toast_bought: 'КУПЛЕНО: {0}',
      toast_crafted: 'СОЗДАНО: {0}',
      btn_revive_sys: 'СИСТЕМА: РЕЗЕРВНАЯ КОПИЯ ЗАГРУЖЕНА',
      toast_loot_doubled: 'ДОБЫЧА УДВОЕНА!',
      toast_airdrop: 'ДРОН СБРОСИЛ ПРИПАСЫ!',
      toast_adrenaline: 'АДРЕНАЛИН: +50% УРОНА НА 15 МИНУТ!',
      toast_emergency: 'АВАРИЙНЫЙ ПАЁК ПОЛУЧЕН!',
      mercy_amazon_companion: 'АМАЗОНКА ТЕПЕРЬ СОЮЗНИК',
      bypass_code_active: 'КОД ОБХОДА СРАБОТАЛ: -30% HP ВРАГА',
      drifter_echo: 'БРОДЯГА',
      carto_buy_map: 'КАРТА СЕКТОРА 4 (50 КР)',
      carto_buy_file: 'ДОСЬЕ ЯНКОВСКОГО (120 КР)',
      carto_buy_code: 'КОД ОБХОДА (200 КР)',
      btn_leave: 'УЙТИ',
      btn_kill: 'УБИТЬ',
      btn_spare: 'ПОЩАДИТЬ',
      received_prefix: 'ПОЛУЧЕНО',
      purchase_activated: 'ПОКУПКА АКТИВИРОВАНА',
      purchase_error: 'ОШИБКА ПОКУПКИ',
      ending_mercy_title: '🌅 КОНЦОВКА A — ИСТИННОЕ НАВАСЛЕДИЕ',
      ending_mercy_text: 'БРОДЯГА ВЗРЫВАЕТ ГЕНЕРАТОРЫ КОМПЛЕКСА.\nАМАЗОНКА БЛОКИРУЕТ ПРОТОКОЛ САМОВОССТАНОВЛЕНИЯ.\n\nТЕХНИК ПОВЕРЖЕН ОКОНЧАТЕЛЬНО.\nВЫ НЕ УНИЧТОЖАЕТЕ ИЕРИХОН. ВЫ ОТКРЫВАЕТЕ ЕГО ДВЕРИ ДЛЯ ПУСТОШИ.\n\n«ТЕПЕРЬ ЭТО УБЕЖИЩЕ ДЛЯ ТЕХ, КТО ВЫЖИЛ.\nВЫ СМОТРИТЕ НА ЛЮДЕЙ, ВХОДЯЩИХ В ГЛАВНЫЕ ВОРОТА.\nКЛОН №73 МЁРТВ.\nНО ДМИТРИЙ ЯНКОВСКИЙ ЖИВ».',
      ending_mercy_score: 'ПОБЕДА: ИСТИННАЯ КОНЦОВКА (ЧЕЛОВЕЧНОСТЬ: {0}) | ЦИКЛ {1}',
      ending_neutral_title: '🔄 КОНЦОВКА B — РАЗРУШЕНИЕ',
      ending_neutral_text: 'ТЕХНИК ПОВЕРЖЕН. РЕЗЕРВНОГО СЕРВЕРА БОЛЬШЕ НЕТ.\n\nВЫ ВЗРЫВАЕТЕ КОМПЛЕКС ИЕРИХОН.\nКЛОНОВ БОЛЬШЕ НЕ БУДЕТ. ПРОЕКТ ЗАВЕРШЁН.\n\nВЫ ВЫХОДИТЕ НА ПУСТОШЬ В ОДИНОЧЕСТВЕ.\nНИ СОЮЗНИКОВ, НИ ДРУЗЕЙ. ТОЛЬКО ТИШИНА И ВЕЧНОСТЬ.\n\n«ВЫ ВЫЖИВАЕТЕ. НО ДЛЯ ЧЕГО?»',
      ending_neutral_score: 'ПОБЕДА: НЕЙТРАЛЬНАЯ КОНЦОВКА (ЧЕЛОВЕЧНОСТЬ: {0}) | ЦИКЛ {1}',
      ending_bad_title: '🤖 ПЛОХАЯ КОНЦОВКА — ИДЕАЛЬНАЯ МАШИНА',
      ending_bad_text: '«Ты убивал без колебаний. Ты предал всех, кто тебе доверял. В тебе не осталось ничего человеческого».\n\nТЕХНИК УЛЫБАЕТСЯ ПОБЕДНОЙ УЛЫБКОЙ, КОГДА ВЫ УБИВАЕТЕ ЕГО.\n\nВЫ НЕ ПОСЛЕДНИЙ КЛОН.\nВЫ ПЕРВЫЙ ИСТИННЫЙ ВЕНЕЦ ИЕРИХОНА.\nМАШИНА В ЧЕЛОВЕЧЕСКОМ ОБЛИКЕ.\n\n«НАЧАЛАСЬ ЭПОХА ИССТУПЛЕНИЯ».',
      ending_bad_score: 'КОНЦОВКА: ТЁМНАЯ (ЧЕЛОВЕЧНОСТЬ: {0}) | ЦИКЛ {1}',
      ending_merge_title: '🕯️ КОНЦОВКА C — СЛИЯНИЕ',
      ending_merge_text: '«...Добро пожаловать, партнёр».\n\nВЫ СТАНОВИТЕСЬ НОВЫМ ДИРЕКТОРОМ КОМПЛЕКСА ИЕРИХОН.\n\nЗНАЕТЕ ЛИ ВЫ, КЕМ БЫЛИ РАНЬШЕ?\nЗНАЕТЕ ЛИ ВЫ, КЕМ СТАЛИ?\n\n«ВОЗМОЖНО, ИМЕННО ЭТОГО ОН И ХОТЕЛ ОТ ВАС ВСЁ ВРЕМЯ».',
      ending_merge_score: 'КОНЦОВКА: ТЁМНАЯ | ЦИКЛ {0}',
      ending_reject_title: '💀 КОНЦОВКА C — ОТРЕЧЕНИЕ',
      ending_reject_text: '«...Значит, нет».\n\nТЕХНИК АКТИВИРУЕТ ПОСЛЕДНИЙ ПРОТОКОЛ.\nВЗРЫВ. ОБЛОМКИ. ТИШИНА.\n\nВЫ ВЫЖИВАЕТЕ В ОДИНОЧЕСТВЕ.\nБЕЗ СОЮЗНИКОВ. БЕЗ ОТВЕТОВ.\nНО ИЕРИХОН МЁРТВ.\n\n«ЭТОГО ДОСТАТОЧНО».',
      ending_reject_score: 'ЦИКЛ {0} | ЖЕРТВА'
    },
    en: {
      days: 'DAY', status: 'STATUS', credits: 'CREDITS', weapon: 'WEAPON',
      health: 'HEALTH', mood: 'MOOD', food: 'FOOD', water: 'WATER',
      medkits: 'MEDS', materials: 'MATS', ammo: 'AMMO', damage: 'DMG',
      defense: 'DEFENSE', hp_bonus: 'HP BONUS', equip: 'EQUIP', equipped: 'EQUIPPED',
      shop_items: 'ITEMS', shop_director: 'DIRECTOR (IAP)', shop_desc: 'Exclusive offers from Jericho.',
      buy: 'BUY',
      goal_survive: '[CURRENT GOAL: SURVIVE]',
      cycles: 'CYCLES (DEATHS): {0}',
      credits_label: '[CREDITS]: {0}',
      day_label: 'DAY {0}',
      status_exploring: 'STATUS: EXPLORING',
      status_combat: 'STATUS: COMBAT',
      weapon_label: 'WEAPON: {0}',
      sound_btn: '🔊 SOUND',
      sound_mute: '🔇 SILENCE',
      hint_click: '<b>[INPUT] CLICK ON CHARACTER</b>',
      sys_init: 'SYSTEMS INITIALIZING...',
      btn_airdrop: '📦 SUPPLY DRONE',
      btn_adrenaline: '⚡ ADRENALINE',
      btn_emergency: '🚨 EMERGENCY RATION',
      btn_merchant: 'TRADING NETWORK',
      btn_inventory: 'INVENTORY',
      btn_synth: 'SYNTHESIZER',
      intercept_data: 'DATA INTERCEPT',
      btn_continue: 'CONTINUE',
      event_warning: 'WARNING: EVENT',
      btn_confirm: 'CONFIRM',
      btn_cancel: 'CANCEL',
      battle_mode: 'BATTLE MODE',
      waiting_attack: '[WAITING FOR ATTACK]',
      atk: 'ATTACK',
      dodge: 'DODGE',
      med: 'HEAL',
      retreat: 'RETREAT',
      sys_msg: 'SYSTEM MESSAGE',
      btn_accept: 'ACCEPT',
      btn_double_loot: '✖2 TROPHIES 📺',
      merchant_desc: 'EXCHANGE CREDITS FOR RESOURCES.',
      btn_close_conn: 'CLOSE CONNECTION',
      synth_desc: 'SYNTHESIS AND UPGRADES.',
      btn_disconnect: 'DISCONNECT',
      inventory_desc: 'CHOOSE AVAILABLE GEAR.',
      btn_close: 'CLOSE',
      crit_failure: 'CRITICAL FAILURE',
      obj_status: 'OBJECT STATUS:',
      liquidated: 'TERMINATED',
      reason_unknown: 'CAUSE: UNKNOWN',
      cycles_lived: 'CYCLES LIVED: {0}',
      sys_cleaned: '"SYSTEM CLEANED. LOADING NEW CLONE..."',
      btn_revive: '⚡ REVIVE FOR REWARD 📺',
      btn_new_cycle: 'INITIALIZE NEW CYCLE',
      cycle_end: 'CYCLE END',
      btn_restart_cycle: '↺ START NEW CYCLE',
      // Toasts
      toast_no_items: 'NO ITEM',
      toast_healed: '+{0} HP',
      toast_energy: '+6 HP, +10 MOOD',
      toast_water: '+4 HP, +15 MOOD',
      toast_weapon_equipped: 'EQUIPPED: {0}',
      toast_armor_equipped: 'ARMOR EQUIPPED: {0}',
      toast_already_have: 'ALREADY OWNED',
      toast_not_enough_caps: 'NOT ENOUGH CREDITS (NEED {0})',
      toast_humanity: '[Humanity {0}]',
      flee_msg: 'YOU FLED',
      flee_mood_lost: 'SANITY: -15',
      defeat_reason_default: 'LOSS OF VITAL SIGNS',
      defeat_msg_1: 'OBJECT DECOMMISSIONED. LOADING NEXT.',
      defeat_msg_2: 'BIOMATERIAL UNFIT. DISPOSAL.',
      defeat_msg_3: 'ATTEMPT FAILED. DATA ARCHIVED.',
      defeat_msg_4: 'YOU WERE SO CLOSE... OR NOT?',
      defeat_msg_5: 'SYSTEM: "WEAK SPECIMEN. CLEAR SECTOR."',
      defeat_starved: 'CRITICAL EXHAUSTION',
      defeat_dehydrated: 'DEHYDRATION',
      // Game logic additions
      threat_level: 'THREAT LEVEL: {0}',
      threat_weak: '🟢 WEAK',
      threat_medium: '🟡 MEDIUM',
      threat_dangerous: '🟠 DANGEROUS',
      threat_deadly: '🔴 DEADLY',
      btn_fight: 'FIGHT',
      btn_flee: 'FLEE',
      btn_search: 'SEARCH',
      btn_ignore: 'IGNORE',
      btn_create: 'CREATE',
      cost_label: 'COST: {0}',
      mats_label: 'MATS: {0}',
      ammo_label: 'AMMO: {0}',
      day_calm: 'QUIET DAY. FOUND DEBRIS.',
      goal_1: '[GOAL: SURVIVE AND FIND THE EXIT]',
      goal_2: '[GOAL: EXPLORE SECTOR 4]',
      goal_3: '[GOAL: UNRAVEL MEMORY]',
      goal_4: '[GOAL: ESCAPE FROM AMAZON]',
      goal_5: '[GOAL: FIND THE DIRECTOR]',
      goal_6: '[GOAL: REACH THE MAIN HALL]',
      goal_7: '[GOAL: MAKE A CHOICE]',
      corpse_echo: 'ECHO OF THE PAST',
      corpse_desc: 'YOU FOUND THE REMAINS OF A CLONE IN A DIRTY CORNER.\nIF THE TAG IS TO BE BELIEVED, HE DIED IN CYCLE {0}.\nCAUSE OF DEATH: {1}.\n\nYOU SEARCH WHAT WAS ONCE YOU. SANITY AND HUMANITY DROP.',
      btn_take_loot: 'TAKE REMAINS',
      corpse_loot: 'OBTAINED: {0} MATS, {1} AMMO, {2} CREDITS',
      bar_woman_negotiate_choice: 'NEGOTIATE (30%)',
      bar_woman_pay_choice: 'PAY 50 CREDITS',
      bar_woman_fight_choice: 'THREATEN (FIGHT)',
      bar_woman_negotiate_fail: '«Don\'t try to fool me! Either pay up or get out!»',
      bar_woman_fight_win: '«Fine! You win! The past "you" was linked to Amazon-Synth. She\'s somewhere in the northern labs.» YOU LEARNED THE TARGET LOCATION.',
      res_food_empty: 'HUNGER: -5 HP',
      res_water_empty: 'THIRST: -8 HP',
      res_medkits_empty: 'NO MEDKITS.',
      res_ammo_empty: 'OUT OF AMMO!',
      crit_hit: 'CRIT!',
      dodge_success: 'DODGE!',
      equip_weapon: 'WEAPON',
      equip_item: 'CONSUMABLE',
      toast_bought: 'BOUGHT: {0}',
      toast_crafted: 'CRAFTED: {0}',
      btn_revive_sys: 'SYSTEM: BACKUP LOADED',
      toast_loot_doubled: 'LOOT DOUBLED!',
      toast_airdrop: 'DRONE DROPPED SUPPLIES!',
      toast_adrenaline: 'ADRENALINE: +50% DAMAGE FOR 15 MIN!',
      toast_emergency: 'EMERGENCY RATION OBTAINED!',
      mercy_amazon_companion: 'AMAZON IS NOW AN ALLY',
      bypass_code_active: 'BYPASS CODE ACTIVE: -30% ENEMY HP',
      drifter_echo: 'DRIFTER',
      carto_buy_map: 'MAP OF SECTOR 4 (50 CR)',
      carto_buy_file: 'YANKOVSKY FILE (120 CR)',
      carto_buy_code: 'BYPASS CODE (200 CR)',
      btn_leave: 'LEAVE',
      btn_kill: 'KILL',
      btn_spare: 'SPARE',
      received_prefix: 'OBTAINED',
      purchase_activated: 'PURCHASE ACTIVATED',
      purchase_error: 'PURCHASE ERROR',
      ending_mercy_title: '🌅 ENDING A — TRUE LEGACY',
      ending_mercy_text: 'DRIFTER BLOWS UP THE COMPLEX GENERATORS.\nAMAZON BLOCKS THE SELF-REPAIR PROTOCOL.\n\nTECHNICIAN IS DEFEATED FOR GOOD.\nYOU DO NOT DESTROY JERICHO. YOU OPEN ITS DOORS TO THE WASTELAND.\n\n«NOW IT IS A REFUGE FOR THOSE WHO SURVIVED.\nYOU WATCH PEOPLE ENTERING THE MAIN GATES.\nCLONE #73 IS DEAD.\nBUT DMITRY YANKOVSKY IS ALIVE».',
      ending_mercy_score: 'VICTORY: TRUE ENDING (HUMANITY: {0}) | CYCLE {1}',
      ending_neutral_title: '🔄 ENDING B — DESTRUCTION',
      ending_neutral_text: 'TECHNICIAN DEFEATED. NO BACKUP SERVER LEFT.\n\nYOU BLOW UP THE JERICHO COMPLEX.\nNO MORE CLONES. PROJECT FINISHED.\n\nYOU WALK OUT INTO THE WASTELAND ALONE.\nNO ALLIES, NO FRIENDS. ONLY SILENCE AND ETERNITY.\n\n«YOU SURVIVE. BUT FOR WHAT?»',
      ending_neutral_score: 'VICTORY: NEUTRAL ENDING (HUMANITY: {0}) | CYCLE {1}',
      ending_bad_title: '🤖 BAD ENDING — PERFECT MACHINE',
      ending_bad_text: '«You killed without hesitation. You betrayed everyone who trusted you. Nothing human left in you».\n\nTECHNICIAN SMILES A VICTORIOUS SMILE AS YOU KILL HIM.\n\nYOU ARE NOT THE LAST CLONE.\nYOU ARE THE FIRST TRUE CROWN OF JERICHO.\nA MACHINE IN HUMAN FORM.\n\n«THE ERA OF EXPIATION HAS BEGUN».',
      ending_bad_score: 'ENDING: DARK (HUMANITY: {0}) | CYCLE {1}',
      ending_merge_title: '🕯️ ENDING C — MERGER',
      ending_merge_text: '«...Welcome, partner».\n\nYOU BECOME THE NEW DIRECTOR OF THE JERICHO COMPLEX.\n\nDO YOU KNOW WHO YOU WERE BEFORE?\nDO YOU KNOW WHO YOU HAVE BECOME?\n\n«PERHAPS THIS IS WHAT HE WANTED FROM YOU ALL ALONG».',
      ending_merge_score: 'ENDING: DARK | CYCLE {0}',
      ending_reject_title: '💀 ENDING C — RENUNCIATION',
      ending_reject_text: '«...So be it».\n\nTECHNICIAN ACTIVATES THE FINAL PROTOCOL.\nEXPLOSION. DEBRIS. SILENCE.\n\nYOU SURVIVE ALONE.\nWITHOUT ALLIES. WITHOUT ANSWERS.\nBUT JERICHO IS DEAD.\n\n«THAT IS ENOUGH».',
      ending_reject_score: 'CYCLE {0} | SACRIFICE'
    }
  };

  const t = (key, ...args) => {
    const lang = (window.PlaygamaSDK && window.PlaygamaSDK.getLanguage()) || 'ru';
    let str = (TRANSLATIONS[lang] || TRANSLATIONS.ru)[key] || key;
    if (args.length > 0) {
      args.forEach((val, i) => {
        str = str.replace(`{${i}}`, val);
      });
    }
    return str;
  };

  // Helper для локализации объектов из data.js (items, enemies, etc)
  const loc = (obj, field) => {
    const lang = (window.PlaygamaSDK && window.PlaygamaSDK.getLanguage()) || 'ru';
    return obj[field + '_' + lang] || obj[field + '_ru'] || obj[field];
  };

  const applyLanguage = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const str = t(key);
      if (str !== key && !str.includes('{0}')) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = str;
        else el.innerHTML = str;

        // Также обновляем title (тултипы) и data-text (для глитч-эффектов), если они есть
        if (el.hasAttribute('title')) el.title = str;
        if (el.hasAttribute('data-text')) el.dataset.text = str;
      }
    });
  };

  const setEncounterCard = ({ icon, title, desc, img }) => {
    const st = window.GameState.get();
    let imgHtml = '';
    if (img) {
      imgHtml = `<div style="text-align: center; margin: 0.5rem 0;"><img src="${img}" style="max-width: 100%; max-height: 25vh; border: 2px solid var(--line); border-radius: 4px; box-shadow: 0 0 10px rgba(29, 242, 58, 0.2); filter: sepia(1) hue-rotate(70deg) saturate(3) brightness(0.9); object-fit: contain;" /></div>`;
    }
    $('#encounterText').innerHTML = `<div class='pill'>${icon} ${title}</div>${imgHtml}<div style='margin-top:0.6rem;'>${desc}</div>`;
  };

  const show = (id, on) => {
    $(id).classList.toggle('show', on);
    // Отправляем событие состояния геймплея при открытии/закрытии модалок
    if (window.PlaygamaSDK) {
      // Если хоть одна модалка открыта — gameplay stop
      const isAnyOpen = !!document.querySelector('.overlay.show');
      window.PlaygamaSDK.setGameplayState(isAnyOpen ? 'stop' : 'start');
    }
  };
  const triggerDamage = () => { SoundManager.play('damage'); document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); const modal = $('#battleModal .card'); if (modal) { modal.classList.remove('flash-red'); void modal.offsetWidth; modal.classList.add('flash-red'); } };
  const triggerEnemyHit = () => { SoundManager.play('click'); const el = $('.enemy'); if (!el) return; el.style.transform = 'translate(4px, 2px)'; el.style.borderColor = 'var(--line)'; el.style.background = 'var(--line)'; setTimeout(() => { el.style.transform = ''; el.style.borderColor = ''; el.style.background = ''; }, 80); };

  const typeText = (el, text, speed = 25, onComplete = null) => {
    if (!text || typeof text !== 'string') {
      el.innerHTML = text || '';
      if (onComplete) onComplete();
      return;
    }
    el.innerHTML = ''; let i = 0;
    const t = () => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i); i++;
        if (i % 3 === 0) SoundManager.play('hover');
        setTimeout(t, speed);
      } else if (onComplete) onComplete();
    };
    t();
  };

  const showDialogue = ({ speaker, speaker_ru, speaker_en, text, text_ru, text_en, img, choices = [] }) => {
    const locObj = { speaker, speaker_ru, speaker_en, text, text_ru, text_en };
    const actualSpeaker = loc(locObj, 'speaker') || 'ПЕРЕХВАТ ДАННЫХ';
    const actualText = loc(locObj, 'text') || text;

    $('#storySpeaker').textContent = actualSpeaker;
    const okBtn = $('#storyOk');
    okBtn.style.display = choices.length ? 'none' : 'block';
    okBtn.disabled = true;

    const p = $('#storyPortrait');
    if (img) { p.src = img; p.style.display = 'block'; } else { p.style.display = 'none'; }

    const choicesCont = $('#storyChoices');
    choicesCont.innerHTML = '';
    choicesCont.style.display = choices.length ? 'grid' : 'none';

    show('#storyModal', true);
    typeText($('#storyText'), actualText, 15, () => {
      okBtn.disabled = false;
      if (choices.length) {
        choices.forEach(c => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = c.text || loc(c, 'text');
          btn.onclick = () => {
            SoundManager.play('click');
            show('#storyModal', false);
            if (c.action) c.action();
          };
          choicesCont.appendChild(btn);
        });
      }
    });
  };

  const renderEquipment = (onSwitchWeapon, onSwitchArmor) => {
    const st = S.get();
    const listCont = $('#equipList');
    listCont.innerHTML = '';

    const wTitle = document.createElement('h3');
    wTitle.textContent = t('weapon');
    listCont.appendChild(wTitle);

    Object.keys(st.weapons).forEach(id => {
      if (!st.weapons[id]) return;
      const w = D.WEAPON_STATS[id];
      if (!w) return;

      const isEquipped = st.player.weaponId === id || (!st.player.weaponId && (st.player.weaponName === w.name_ru || st.player.weaponName === w.name_en));

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div>${loc(w, 'name')}
          <div class='sub'>${t('damage')}: ${w.dmg} | ${t('days').slice(0, 1)}: ${w.cd}s | ${w.isGun ? 'GUN' : 'MELEE'}</div>
        </div>
        <button class='btn ${isEquipped ? 'good' : ''}' data-equip-w='${id}'>
          ${isEquipped ? t('equipped') : t('equip')}
        </button>
      `;
      const btn = div.querySelector('[data-equip-w]');
      btn.onclick = () => {
        if (isEquipped) return;
        SoundManager.play('click');
        if (onSwitchWeapon) onSwitchWeapon(id);
        renderEquipment(onSwitchWeapon, onSwitchArmor);
      };
      listCont.appendChild(div);
    });

    const aTitle = document.createElement('h3');
    aTitle.textContent = t('defense');
    aTitle.style.marginTop = '1rem';
    listCont.appendChild(aTitle);

    Object.keys(st.armors).forEach(id => {
      if (!st.armors[id]) return;
      const a = D.ARMOR_STATS[id];
      if (!a) return;

      const isEquipped = st.player.armorId === id || (!st.player.armorId && (st.player.armorName === a.name_ru || st.player.armorName === a.name_en));

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div>${loc(a, 'name')}
          <div class='sub'>${t('hp_bonus')}: +${a.hp} | ${t('defense')}: ${Math.round(a.armorClass * 100)}%</div>
        </div>
        <button class='btn ${isEquipped ? 'good' : ''}' data-equip-a='${id}'>
          ${isEquipped ? t('equipped') : t('equip')}
        </button>
      `;
      const btn = div.querySelector('[data-equip-a]');
      btn.onclick = () => {
        if (isEquipped) return;
        SoundManager.play('click');
        if (onSwitchArmor) onSwitchArmor(id);
        renderEquipment(onSwitchWeapon, onSwitchArmor);
      };
      listCont.appendChild(div);
    });
  };



  return {
    $, toast, renderTop, renderMain, renderBattle, setEncounterCard, show,
    triggerDamage, triggerEnemyHit, typeText, showDialogue, renderEquipment,
    t, loc, applyLanguage
  };
})();
