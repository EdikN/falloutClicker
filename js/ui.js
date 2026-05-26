import { GameState } from './state.js';
import { GameData } from './data.js';
import { SoundManager } from './audio.js';
import { TRANSLATIONS, translate, loc } from './locales.js';
import { EventEmitter as Events } from './events.js';

export const GameUI = (() => {
  const $ = sel => document.querySelector(sel);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // --- КЭШ DOM-ЭЛЕМЕНТОВ ---
  const DOM = {
    day: null, capsTop: null, careerPill: null, weaponPill: null,
    statusBars: null, res: null,
    pBars: null, battleTimer: null,
    enemyName: null, enemyImg: null, eHp: null,
    telegraph: null, teleFill: null,
    atk: null, atkFill: null, dodge: null,
    toasts: null,
    charImg: null, headerAvatar: null,
    enemyId: null, enemySubname: null, enemyLevel: null,
    playerCombatName: null, playerCombatWeapon: null,
    // Специфические элементы для renderMain/renderBattle
    hpFill: null, hpText: null, hpMax: null, hpLabel: null,
    moodFill: null, moodText: null, moodMax: null, moodLabel: null,
    hungerFill: null, hungerText: null, hungerMax: null, hungerLabel: null,
    thirstFill: null, thirstText: null, thirstMax: null, thirstLabel: null,
    pAtkHpFill: null, pAtkHpText: null, pAtkHpMax: null, pAtkHpLabel: null
  };

  const initCache = () => {
    DOM.day = $('#day');
    DOM.capsTop = $('#capsTop');
    DOM.careerPill = $('#careerPill');
    DOM.weaponPill = $('#weaponPill');
    DOM.statusBars = $('#statusBars');
    DOM.res = $('#res');
    DOM.pBars = $('#pBars');
    DOM.battleTimer = $('#battleTimer');
    DOM.enemyName = $('#enemyName');
    DOM.enemyImg = $('#enemyImg');
    DOM.eHp = $('#eHp');
    DOM.telegraph = $('#telegraph');
    DOM.teleFill = $('#teleFill');
    DOM.atk = $('#atk');
    DOM.atkFill = $('#atkFill');
    DOM.dodge = $('#dodge');
    DOM.toasts = $('#toasts');
    DOM.charImg = $('#charBtn img');
    DOM.headerAvatar = $('#headerAvatar');
    DOM.enemyId = $('#enemyId');
    DOM.enemySubname = $('#enemySubname');
    DOM.enemyLevel = $('#enemyLevel');
    DOM.playerCombatName = $('#playerCombatName');
    DOM.playerCombatWeapon = $('#playerCombatWeapon');

    // Предварительное создание статической структуры для статус-баров во избежание innerHTML в цикле
    if (DOM.statusBars) {
      DOM.statusBars.innerHTML = `
        <div id="hpCont" class="status-slot">
          <div class="slot-title-row"><span class="slot-label label"></span><span class="slot-val"><span class="val"></span>/<span class="max"></span></span></div>
          <div class="slot-bar-track"><div class="slot-bar-fill fill"></div></div>
        </div>
        <div id="moodCont" class="status-slot">
          <div class="slot-title-row"><span class="slot-label label"></span><span class="slot-val"><span class="val"></span>/<span class="max"></span></span></div>
          <div class="slot-bar-track"><div class="slot-bar-fill fill"></div></div>
        </div>
        <div id="hungerCont" class="status-slot">
          <div class="slot-title-row"><span class="slot-label label"></span><span class="slot-val"><span class="val"></span>/<span class="max"></span></span></div>
          <div class="slot-bar-track"><div class="slot-bar-fill fill"></div></div>
        </div>
        <div id="thirstCont" class="status-slot">
          <div class="slot-title-row"><span class="slot-label label"></span><span class="slot-val"><span class="val"></span>/<span class="max"></span></span></div>
          <div class="slot-bar-track"><div class="slot-bar-fill fill"></div></div>
        </div>`;
      DOM.hpText = DOM.statusBars.querySelector('#hpCont .val');
      DOM.hpMax = DOM.statusBars.querySelector('#hpCont .max');
      DOM.hpLabel = DOM.statusBars.querySelector('#hpCont .label');
      DOM.hpFill = DOM.statusBars.querySelector('#hpCont .fill');
      DOM.moodText = DOM.statusBars.querySelector('#moodCont .val');
      DOM.moodMax = DOM.statusBars.querySelector('#moodCont .max');
      DOM.moodLabel = DOM.statusBars.querySelector('#moodCont .label');
      DOM.moodFill = DOM.statusBars.querySelector('#moodCont .fill');
      DOM.hungerText = DOM.statusBars.querySelector('#hungerCont .val');
      DOM.hungerMax = DOM.statusBars.querySelector('#hungerCont .max');
      DOM.hungerLabel = DOM.statusBars.querySelector('#hungerCont .label');
      DOM.hungerFill = DOM.statusBars.querySelector('#hungerCont .fill');
      DOM.thirstText = DOM.statusBars.querySelector('#thirstCont .val');
      DOM.thirstMax = DOM.statusBars.querySelector('#thirstCont .max');
      DOM.thirstLabel = DOM.statusBars.querySelector('#thirstCont .label');
      DOM.thirstFill = DOM.statusBars.querySelector('#thirstCont .fill');
    }

    if (DOM.pBars) {
      DOM.pBars.innerHTML = `
        <div id="pAtkHpCont" class="status-slot" style="width: 100%;">
          <div class="slot-title-row"><span class="slot-label label"></span><span class="slot-val"><span class="val"></span>/<span class="max"></span></span></div>
          <div class="slot-bar-track"><div class="slot-bar-fill fill"></div></div>
        </div>`;
      DOM.pAtkHpText = DOM.pBars.querySelector('.val');
      DOM.pAtkHpMax = DOM.pBars.querySelector('.max');
      DOM.pAtkHpLabel = DOM.pBars.querySelector('.label');
      DOM.pAtkHpFill = DOM.pBars.querySelector('.fill');
    }
  };

  const toast = msg => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    if (!DOM.toasts) DOM.toasts = $('#toasts');
    DOM.toasts.prepend(el);
    setTimeout(() => { 
      el.style.opacity = '0'; 
      el.style.transform = 'translateY(-20px)'; 
      setTimeout(() => el.remove(), 400); 
    }, 3000);
  };

  const renderTop = () => {
    if (!DOM.day) initCache();
    const st = GameState.get();
    DOM.day.textContent = translate('day_label', st.day);
    DOM.capsTop.textContent = translate('credits_label', st.resources.caps);
    if (DOM.careerPill) DOM.careerPill.textContent = st.player.careerName || '???';

    const weaponId = st.player.weaponId || Object.keys(GameData.WEAPON_STATS).find(k => GameData.WEAPON_STATS[k].name_ru === st.player.weaponName || GameData.WEAPON_STATS[k].name_en === st.player.weaponName);
    const w = weaponId ? GameData.WEAPON_STATS[weaponId] : null;
    const weaponStr = w ? loc(w, 'name') : (st.player.weaponName || '???');
    const weaponText = weaponStr.toUpperCase();

    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    DOM.weaponPill.textContent = translate('weapon_label', weaponText + (isAdrenaline ? ' [⚡]' : ''));
    DOM.weaponPill.classList.toggle('highlight-text', isAdrenaline);
  };

  const renderMain = () => {
    if (!DOM.hpFill) initCache();
    const st = GameState.get(), p = st.player;
    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    let dmgStr = `${Math.round(p.baseDmg + p.dmgBonus)}`;

    // Обновляем текст и бары напрямую (уже созданные в initCache)
    DOM.hpLabel.textContent = "🩸 " + translate('health').toUpperCase();
    DOM.hpText.textContent = Math.round(p.hp);
    DOM.hpMax.textContent = p.maxHp;
    DOM.hpFill.style.transform = `scaleX(${clamp(p.hp / p.maxHp, 0, 1)})`;

    DOM.moodLabel.textContent = "🧠 " + translate('mood').toUpperCase();
    DOM.moodText.textContent = Math.round(p.mood);
    DOM.moodMax.textContent = p.maxMood;
    DOM.moodFill.style.transform = `scaleX(${clamp(p.mood / p.maxMood, 0, 1)})`;

    DOM.hungerLabel.textContent = "🍗 " + translate('hunger').toUpperCase();
    DOM.hungerText.textContent = Math.round(p.hunger);
    DOM.hungerMax.textContent = p.maxHunger;
    DOM.hungerFill.style.transform = `scaleX(${clamp(p.hunger / p.maxHunger, 0, 1)})`;

    DOM.thirstLabel.textContent = "💧 " + translate('thirst').toUpperCase();
    DOM.thirstText.textContent = Math.round(p.thirst);
    DOM.thirstMax.textContent = p.maxThirst;
    DOM.thirstFill.style.transform = `scaleX(${clamp(p.thirst / p.maxThirst, 0, 1)})`;

    // Dynamic warning class trigger for low stats (<25%)
    const hpSlot = DOM.statusBars.querySelector('#hpCont');
    if (hpSlot) hpSlot.classList.toggle('slot-low', p.hp / p.maxHp < 0.25);
    const moodSlot = DOM.statusBars.querySelector('#moodCont');
    if (moodSlot) moodSlot.classList.toggle('slot-low', p.mood / p.maxMood < 0.25);
    const hungerSlot = DOM.statusBars.querySelector('#hungerCont');
    if (hungerSlot) hungerSlot.classList.toggle('slot-low', p.hunger / p.maxHunger < 0.25);
    const thirstSlot = DOM.statusBars.querySelector('#thirstCont');
    if (thirstSlot) thirstSlot.classList.toggle('slot-low', p.thirst / p.maxThirst < 0.25);

    const ARMOR_IMAGES = {
      'none': 'img/char_base.webp',
      'light': 'img/char_light.webp',
      'medium': 'img/char_leather.webp',
      'heavy': 'img/char_suit.webp'
    };
    if (DOM.charImg) {
      const currentArmor = p.armorId || 'none';
      const newSrc = ARMOR_IMAGES[currentArmor] || ARMOR_IMAGES['none'];
      if (DOM.charImg.getAttribute('src') !== newSrc) {
        DOM.charImg.src = newSrc;
      }
      if (DOM.headerAvatar && DOM.headerAvatar.getAttribute('src') !== newSrc) {
        DOM.headerAvatar.src = newSrc;
      }
    }
    if (isAdrenaline) {
      const minutesLeft = Math.ceil((st.adBoosts.adrenaline - Date.now()) / 60000);
      dmgStr = `${Math.round((p.baseDmg + p.dmgBonus) * 1.5)}⚡`;
    }

    DOM.res.innerHTML = `
      <button class='pill pill-btn' data-use='food' title="${translate('food')}">🍗 <span>${st.resources.food}</span></button>
      <button class='pill pill-btn' data-use='water' title="${translate('water')}">💧 <span>${st.resources.water}</span></button>
      <button class='pill pill-btn' data-use='medkits' title="${translate('medkits')}">🩹 <span>${st.resources.medkits}</span></button>
      <div class='pill' title="${translate('materials')}">📦 <span>${st.resources.materials}</span></div>
      <div class='pill' title="${translate('ammo')}">🔋 <span>${st.resources.ammo}</span></div>
      <div class='pill' title="${translate('damage')}">🔥 <span>${dmgStr}</span></div>`;
  };

  const renderBattle = () => {
    if (!DOM.eHp) initCache();
    const st = GameState.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    DOM.battleTimer.textContent = `${c.time.toFixed(1)}s`;

    DOM.pAtkHpLabel.textContent = translate('health').toUpperCase();
    DOM.pAtkHpText.textContent = Math.round(p.hp);
    DOM.pAtkHpMax.textContent = p.maxHp;
    DOM.pAtkHpFill.style.transform = `scaleX(${clamp(p.hp / p.maxHp, 0, 1)})`;

    DOM.enemyName.textContent = `${e.icon} ${loc(e, 'name')}`;

    if (e.img) {
      setImgSrc(DOM.enemyImg, e.img);
    } else {
      DOM.enemyImg.style.display = 'none';
    }

    DOM.eHp.style.transform = `scaleX(${clamp(e.hp / e.maxHp, 0, 1)})`;
    if (DOM.telegraph) {
      DOM.telegraph.textContent = `[${translate('waiting_attack').toUpperCase()}: ${Math.max(0, c.enemyAtk).toFixed(1)}s]`;
    }
    DOM.teleFill.style.transform = `scaleX(${clamp(1 - c.enemyAtk / e.atk, 0, 1)})`;

    // Update enemy card details
    if (DOM.enemyId) {
      const code = (e.name_en || 'ENM').substring(0, 3).toUpperCase();
      const num = (e.maxHp * 17 + e.dmg * 31) % 9000 + 1000;
      DOM.enemyId.textContent = `ID: ${code}-${num}`;
    }
    if (DOM.enemySubname) {
      DOM.enemySubname.textContent = (e.name_en || '').toUpperCase().replace(/\s+/g, '_');
    }
    if (DOM.enemyLevel) {
      DOM.enemyLevel.textContent = `LVL.${e.threat || 1}`;
    }

    // Update player combat strip details
    if (DOM.playerCombatName) {
      DOM.playerCombatName.textContent = (p.careerName || 'SURVIVOR').toUpperCase();
    }
    if (DOM.playerCombatWeapon) {
      const wepId = p.weaponId || 'fists';
      const w = GameData.WEAPON_STATS[wepId] || GameData.WEAPON_STATS.fists;
      const weaponStr = w ? loc(w, 'name') : (p.weaponName || '???');
      DOM.playerCombatWeapon.textContent = `⚔️ ${weaponStr.toUpperCase()}`;
    }

    // КД Игрока
    if (DOM.atk) {
      const cdPerc = p.atkCd > 0 ? (1 - p.atkCd / p.atkCdMax) : 1;
      const atkFill = DOM.atkFill || DOM.atk.querySelector('#atkFill');
      if (atkFill) atkFill.style.transform = `scaleX(${clamp(cdPerc, 0, 1)})`;

      if (p.atkCd > 0) {
        DOM.atk.firstChild.textContent = `${translate('atk').toUpperCase()} [${p.atkCd.toFixed(1)}s]`;
        if (!DOM.atk.classList.contains('is-cd')) {
          DOM.atk.classList.add('is-cd');
          DOM.atk.disabled = true;
        }
      } else {
        if (DOM.atk.classList.contains('is-cd')) {
          DOM.atk.firstChild.textContent = translate('atk').toUpperCase();
          DOM.atk.classList.remove('is-cd');
          DOM.atk.disabled = false;
        }
      }
    }

    // Кнопка уклонения
    if (DOM.dodge) {
      DOM.dodge.disabled = c.cdDodge > 0;
      DOM.dodge.textContent = c.cdDodge > 0 ? `${translate('dodge').slice(0, 1)} [${c.cdDodge.toFixed(1)}s]` : translate('dodge').toUpperCase();
    }
  };


  // --- ИНТЕРНАЦИОНАЛИЗАЦИЯ (i18n) ---


  const applyLanguage = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const str = translate(key);
      if (str !== key && !str.includes('{0}')) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = str;
        else el.innerHTML = str;

        // Также обновляем title (тултипы) и data-text (для глитч-эффектов), если они есть
        if (el.hasAttribute('title')) el.title = str;
        if (el.hasAttribute('data-text')) el.dataset.text = str;
      }
    });

    if (DOM.atk && DOM.atk.firstChild && DOM.atk.firstChild.nodeType === Node.TEXT_NODE) {
      DOM.atk.firstChild.textContent = DOM.atk.classList.contains('is-cd') ? translate('dodge').toUpperCase() : translate('atk');
    }
  };

  const setEncounterCard = ({ icon, title, desc, img }) => {
    const st = GameState.get();
    let imgHtml = '';
    if (img) {
      imgHtml = `<div class="event-image-wrap"><img src="${img}" class="event-image" /></div>`;
    }
    $('#encounterText').innerHTML = `<div class="event-header-pill">${icon} ${title}</div>${imgHtml}<div class="event-description">${desc}</div>`;
  };

  const show = (id, on) => {
    $(id).classList.toggle('show', on);
    // Отправляем событие состояния геймплея при открытии/закрытии модалок
    if (window.PlaygamaSDK) {
      // Если хоть одна модалка открыта (КРОМЕ ОКНА БОЯ) — gameplay stop
      const overlayOpen = document.querySelector('.overlay.show');
      const isBattleOpen = overlayOpen && overlayOpen.id === 'battleModal';
      const shouldStop = overlayOpen && !isBattleOpen;
      window.PlaygamaSDK.setGameplayState(shouldStop ? 'stop' : 'start');
    }
  };
  const triggerDamage = () => { SoundManager.play('damage'); document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); const modal = $('#battleModal .card'); if (modal) { modal.classList.remove('flash-red'); void modal.offsetWidth; modal.classList.add('flash-red'); } };
  const triggerEnemyHit = () => { SoundManager.play('click'); const el = $('.enemy'); if (!el) return; el.style.transform = 'translate(4px, 2px)'; el.style.borderColor = 'var(--line)'; el.style.background = 'var(--line)'; setTimeout(() => { el.style.transform = ''; el.style.borderColor = ''; el.style.background = ''; }, 80); };

  // Bug 7: img fallback helper — shows broken-slot placeholder instead of hiding
  const setImgSrc = (imgEl, src) => {
    if (!imgEl) return;
    imgEl.onerror = null;
    if (!src) { imgEl.style.display = 'none'; return; }
    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      // Show a Fallout-style broken slot sibling if it exists
      const fallback = imgEl.nextElementSibling;
      if (fallback && fallback.classList.contains('img-fallback')) {
        fallback.style.display = 'flex';
      }
    };
    imgEl.onload = () => {
      imgEl.style.display = 'block';
      const fallback = imgEl.nextElementSibling;
      if (fallback && fallback.classList.contains('img-fallback')) fallback.style.display = 'none';
    };
    if (imgEl.getAttribute('src') !== src) imgEl.src = src;
    imgEl.style.display = 'block';
  };

  const typeText = (el, text, speed = 25, onComplete = null) => {
    if (!text || typeof text !== 'string') {
      el.innerHTML = text || '';
      if (onComplete) onComplete();
      return;
    }
    el.innerHTML = '';
    let i = 0;
    let lastSoundTime = 0;
    const charsPerTick = 4;
    const tick = () => {
      if (i < text.length) {
        el.innerHTML += text.substr(i, charsPerTick);
        i += charsPerTick;
        const now = Date.now();
        if (now - lastSoundTime > 90) {
          SoundManager.play('hover');
          lastSoundTime = now;
        }
        setTimeout(tick, speed);
      } else if (onComplete) onComplete();
    };
    tick();
  };

  const showDialogue = ({ speaker, speaker_ru, speaker_en, text, text_ru, text_en, img, choices = [] }) => {
    const locObj = { speaker, speaker_ru, speaker_en, text, text_ru, text_en };
    const actualSpeaker = loc(locObj, 'speaker') || translate('intercept_data');
    const actualText = loc(locObj, 'text') || text;

    $('#storySpeaker').textContent = actualSpeaker;
    const okBtn = $('#storyOk');
    okBtn.style.display = choices.length ? 'none' : 'block';
    okBtn.disabled = true;

    const p = $('#storyPortrait');
    if (img) { setImgSrc(p, img); } else { p.style.display = 'none'; }

    const choicesCont = $('#storyChoices');
    choicesCont.innerHTML = '';
    choicesCont.style.display = choices.length ? 'grid' : 'none';

    show('#storyModal', true);
    typeText($('#storyText'), actualText, 8, () => {
      okBtn.disabled = false;
      if (choices.length) {
        choices.forEach(c => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = c.text || loc(c, 'text');
          btn.onclick = () => {
            SoundManager.play('click');
            show('#storyModal', false);
            if (c.action) c.action(Events, GameState, translate);
          };
          choicesCont.appendChild(btn);
        });
      }
    });
  };

  const renderEquipment = (onSwitchWeapon, onSwitchArmor) => {
    const st = GameState.get();
    const listCont = $('#equipList');
    listCont.innerHTML = '';

    Object.keys(st.weapons).forEach((id, index) => {
      if (!st.weapons[id]) return;
      const w = GameData.WEAPON_STATS[id];
      if (!w) return;

      const isEquipped = st.player.weaponId === id || (!st.player.weaponId && (st.player.weaponName === w.name_ru || st.player.weaponName === w.name_en));
      const imgUrl = 'img/payments/weapons.webp';
      const itemId = `ID:WEP-${101 + index}`;
      const desc = `${translate('damage')}: ${w.dmg} | ${w.isGun ? '🔫' : '🔪'}`;

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div class="shopItem-id">${itemId}</div>
        <div class="shopItem-img-wrap">
          <img class="shopItem-img" src="${imgUrl}" alt="${loc(w, 'name')}" />
        </div>
        <div class="shopItem-details">
          <div>
            <h3 class="shopItem-title">${loc(w, 'name')}</h3>
            <p class="shopItem-desc">${desc}</p>
          </div>
          <div class="shopItem-action-row">
            <div class="shopItem-price">${isEquipped ? 'ACTIVE' : 'READY'}</div>
            <button class='btn ${isEquipped ? 'good' : ''}' data-equip-w='${id}'>
              ${isEquipped ? translate('equipped') : translate('equip')}
            </button>
          </div>
        </div>
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

    const aTitle = document.createElement('div');
    aTitle.className = 'sub-header';
    aTitle.textContent = translate('defense').toUpperCase();
    listCont.appendChild(aTitle);

    Object.keys(st.armors).forEach((id, index) => {
      if (!st.armors[id]) return;
      const a = GameData.ARMOR_STATS[id];
      if (!a) return;

      const isEquipped = st.player.armorId === id || (!st.player.armorId && (st.player.armorName === a.name_ru || st.player.armorName === a.name_en));
      const imgUrl = 'img/payments/armor.webp';
      const itemId = `ID:ARM-${101 + index}`;
      const desc = `🛡️ ${Math.round(a.armorClass * 100)}% | 🩸 +${a.hp}`;

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div class="shopItem-id">${itemId}</div>
        <div class="shopItem-img-wrap">
          <img class="shopItem-img" src="${imgUrl}" alt="${loc(a, 'name')}" />
        </div>
        <div class="shopItem-details">
          <div>
            <h3 class="shopItem-title">${loc(a, 'name')}</h3>
            <p class="shopItem-desc">${desc}</p>
          </div>
          <div class="shopItem-action-row">
            <div class="shopItem-price">${isEquipped ? 'ACTIVE' : 'READY'}</div>
            <button class='btn ${isEquipped ? 'good' : ''}' data-equip-a='${id}'>
              ${isEquipped ? translate('equipped') : translate('equip')}
            </button>
          </div>
        </div>
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



  const renderDefeat = (data) => {
    show('#battleModal', false);
    show('#encounterModal', false);
    show('#storyModal', false);

    const defeatDaysEl = $('#defeatDays');
    const defeatReasonEl = $('#defeatReason');
    const defeatMsgEl = $('#defeatMsg');

    if (defeatDaysEl) defeatDaysEl.textContent = translate('cycles_lived', data.day);
    if (defeatReasonEl) defeatReasonEl.textContent = `${translate('obj_status')} ${data.reason}`;

    const msgs = [
      translate('defeat_msg_1'), translate('defeat_msg_2'), translate('defeat_msg_3'),
      translate('defeat_msg_4'), translate('defeat_msg_5')
    ];
    if (defeatMsgEl) defeatMsgEl.textContent = `"${msgs[Math.floor(Math.random() * msgs.length)]}"`;

    renderMain();
    renderTop();
    show('#defeatModal', true);

    // Bug 4 fix: hide action buttons immediately, reveal after 1s with fade-in
    const reviveBtn = $('#reviveBtn');
    const newRunBtn = $('#newRun');
    if (reviveBtn) {
      reviveBtn.style.display = data.reviveAvailable ? 'block' : 'none';
      reviveBtn.classList.remove('defeat-btn-visible');
      reviveBtn.classList.add('defeat-btn-hidden');
    }
    if (newRunBtn) {
      newRunBtn.classList.remove('defeat-btn-visible');
      newRunBtn.classList.add('defeat-btn-hidden');
    }
    setTimeout(() => {
      if (reviveBtn && data.reviveAvailable) {
        reviveBtn.classList.remove('defeat-btn-hidden');
        reviveBtn.classList.add('defeat-btn-visible');
      }
      if (newRunBtn) {
        newRunBtn.classList.remove('defeat-btn-hidden');
        newRunBtn.classList.add('defeat-btn-visible');
      }
    }, 1000);
  };

  // Bind Events
  Events.on('ui:toast', toast);
  Events.on('ui:renderTop', renderTop);
  Events.on('ui:renderMain', renderMain);
  Events.on('ui:renderBattle', renderBattle);
  Events.on('ui:show', ({ id, on }) => show(id, on));
  Events.on('ui:showDialogue', showDialogue);
  Events.on('ui:setEncounterCard', setEncounterCard);
  Events.on('ui:triggerDamage', triggerDamage);
  Events.on('ui:triggerEnemyHit', triggerEnemyHit);
  Events.on('ui:renderEquipment', ({ onSwitchWeapon, onSwitchArmor }) => renderEquipment(onSwitchWeapon, onSwitchArmor));
  Events.on('ui:defeat', renderDefeat);

  return {
    $, toast, renderTop, renderMain, renderBattle, setEncounterCard, show,
    triggerDamage, triggerEnemyHit, typeText, showDialogue, renderEquipment,
    translate, loc, applyLanguage
  };
})();
