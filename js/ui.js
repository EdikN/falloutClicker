import { GameState as S } from './state.js';
import { GameData as D } from './data.js';
import { SoundManager } from './audio.js';
import { TRANSLATIONS, t, loc } from './locales.js';
import { EventEmitter as Events } from './events.js';

export const GameUI = (() => {
  const $ = sel => document.querySelector(sel);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // --- КЭШ DOM-ЭЛЕМЕНТОВ ---
  const DOM = {
    day: null, capsTop: null, weaponPill: null,
    statusBars: null, res: null,
    pBars: null, battleTimer: null,
    enemyName: null, enemyImg: null, eHp: null,
    telegraph: null, teleFill: null,
    atk: null, atkFill: null, dodge: null,
    toasts: null,
    // Специфические элементы для renderMain/renderBattle
    hpFill: null, hpText: null, hpMax: null, hpLabel: null,
    moodFill: null, moodText: null, moodMax: null, moodLabel: null,
    pAtkHpFill: null, pAtkHpText: null, pAtkHpMax: null, pAtkHpLabel: null
  };

  const initCache = () => {
    DOM.day = $('#day');
    DOM.capsTop = $('#capsTop');
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

    // Предварительное создание статической структуры для статус-баров во избежание innerHTML в цикле
    if (DOM.statusBars) {
      DOM.statusBars.innerHTML = `
        <div id="hpCont">♥ <span class="label"></span> <span class="val"></span>/<span class="max"></span><div class='bar'><div class='fill bg-bad'></div></div></div>
        <div id="moodCont">🧠 <span class="label"></span> <span class="val"></span>/<span class="max"></span><div class='bar'><div class='fill bg-ok'></div></div></div>`;
      DOM.hpText = DOM.statusBars.querySelector('#hpCont .val');
      DOM.hpMax = DOM.statusBars.querySelector('#hpCont .max');
      DOM.hpLabel = DOM.statusBars.querySelector('#hpCont .label');
      DOM.hpFill = DOM.statusBars.querySelector('#hpCont .fill');
      DOM.moodText = DOM.statusBars.querySelector('#moodCont .val');
      DOM.moodMax = DOM.statusBars.querySelector('#moodCont .max');
      DOM.moodLabel = DOM.statusBars.querySelector('#moodCont .label');
      DOM.moodFill = DOM.statusBars.querySelector('#moodCont .fill');
    }

    if (DOM.pBars) {
      DOM.pBars.innerHTML = `<div>♥ <span class="label"></span> <span class="val"></span>/<span class="max"></span><div class='bar'><div class='fill bg-bad'></div></div></div>`;
      DOM.pAtkHpText = DOM.pBars.querySelector('.val');
      DOM.pAtkHpMax = DOM.pBars.querySelector('.max');
      DOM.pAtkHpLabel = DOM.pBars.querySelector('.label');
      DOM.pAtkHpFill = DOM.pBars.querySelector('.fill');
    }
  };

  const toast = msg => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = `> ${msg}`;
    if (!DOM.toasts) DOM.toasts = $('#toasts');
    DOM.toasts.prepend(el);
    setTimeout(() => { el.style.animation = 'slideLeft 0.3s reverse forwards'; setTimeout(() => el.remove(), 300); }, 2500);
  };

  const renderTop = () => {
    if (!DOM.day) initCache();
    const st = S.get();
    DOM.day.textContent = t('day_label', st.day);
    DOM.capsTop.textContent = t('credits_label', st.resources.caps);

    const weaponId = st.player.weaponId || Object.keys(D.WEAPON_STATS).find(k => D.WEAPON_STATS[k].name_ru === st.player.weaponName || D.WEAPON_STATS[k].name_en === st.player.weaponName);
    const w = weaponId ? D.WEAPON_STATS[weaponId] : null;
    const weaponStr = w ? loc(w, 'name') : (st.player.weaponName || '???');
    const weaponText = weaponStr.toUpperCase();

    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    DOM.weaponPill.textContent = t('weapon_label', weaponText + (isAdrenaline ? ' [⚡]' : ''));
    DOM.weaponPill.classList.toggle('highlight-text', isAdrenaline);
  };

  const renderMain = () => {
    if (!DOM.hpFill) initCache();
    const st = S.get(), p = st.player;
    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    let dmgStr = `${Math.round(p.baseDmg + p.dmgBonus)}`;

    // Обновляем текст и бары напрямую (уже созданные в initCache)
    DOM.hpLabel.textContent = t('health').toUpperCase();
    DOM.hpText.textContent = Math.round(p.hp);
    DOM.hpMax.textContent = p.maxHp;
    DOM.hpFill.style.transform = `scaleX(${clamp(p.hp / p.maxHp, 0, 1)})`;

    DOM.moodLabel.textContent = t('mood').toUpperCase();
    DOM.moodText.textContent = Math.round(p.mood);
    DOM.moodMax.textContent = p.maxMood;
    DOM.moodFill.style.transform = `scaleX(${clamp(p.mood / p.maxMood, 0, 1)})`;

    if (isAdrenaline) {
      const minutesLeft = Math.ceil((st.adBoosts.adrenaline - Date.now()) / 60000);
      dmgStr = `${Math.round((p.baseDmg + p.dmgBonus) * 1.5)} <span style="color:var(--text); font-size:0.8em">(+50% | ${minutesLeft}m)</span>`;
    }

    DOM.res.innerHTML = `
      <button class='pill pill-btn' data-use='food'>🍖 ${t('food').toUpperCase()}: ${st.resources.food}</button>
      <button class='pill pill-btn' data-use='water'>💧 ${t('water').toUpperCase()}: ${st.resources.water}</button>
      <button class='pill pill-btn' data-use='medkits'>✚ ${t('medkits').toUpperCase()}: ${st.resources.medkits}</button>
      <div class='pill'>⚙️ ${t('materials').toUpperCase()}: ${st.resources.materials}</div>
      <div class='pill'>⚡ ${t('ammo').toUpperCase()}: ${st.resources.ammo}</div>
      <div class='pill'>⚔️ ${t('damage').toUpperCase()}: ${dmgStr}</div>`;
  };

  const renderBattle = () => {
    if (!DOM.eHp) initCache();
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    DOM.battleTimer.textContent = `${c.time.toFixed(1)}s`;

    DOM.pAtkHpLabel.textContent = t('health').toUpperCase();
    DOM.pAtkHpText.textContent = Math.round(p.hp);
    DOM.pAtkHpMax.textContent = p.maxHp;
    DOM.pAtkHpFill.style.transform = `scaleX(${clamp(p.hp / p.maxHp, 0, 1)})`;

    DOM.enemyName.textContent = `${e.icon} ${loc(e, 'name')}`;

    if (e.img) {
      if (DOM.enemyImg.getAttribute('src') !== e.img) DOM.enemyImg.src = e.img;
      DOM.enemyImg.style.display = 'block';
    } else {
      DOM.enemyImg.removeAttribute('src');
      DOM.enemyImg.style.display = 'none';
    }

    DOM.eHp.style.transform = `scaleX(${clamp(e.hp / e.maxHp, 0, 1)})`;
    DOM.telegraph.textContent = `[${t('waiting_attack').toUpperCase()}: ${Math.max(0, c.enemyAtk).toFixed(1)}s]`;
    DOM.teleFill.style.transform = `scaleX(${clamp(1 - c.enemyAtk / e.atk, 0, 1)})`;

    // КД Игрока
    if (DOM.atk) {
      const cdPerc = p.atkCd > 0 ? (1 - p.atkCd / p.atkCdMax) : 1;
      const atkFill = DOM.atkFill || DOM.atk.querySelector('#atkFill');
      if (atkFill) atkFill.style.transform = `scaleX(${clamp(cdPerc, 0, 1)})`;

      if (p.atkCd > 0) {
        if (!DOM.atk.classList.contains('is-cd')) {
          DOM.atk.firstChild.textContent = t('dodge').toUpperCase();
          DOM.atk.classList.add('is-cd');
          DOM.atk.disabled = true;
        }
      } else {
        if (DOM.atk.classList.contains('is-cd')) {
          DOM.atk.firstChild.textContent = t('atk');
          DOM.atk.classList.remove('is-cd');
          DOM.atk.disabled = false;
        }
      }
    }

    // Кнопка уклонения
    if (DOM.dodge) {
      DOM.dodge.disabled = c.cdDodge > 0;
      DOM.dodge.textContent = c.cdDodge > 0 ? `${t('dodge').slice(0, 1)} [${c.cdDodge.toFixed(1)}s]` : t('dodge').toUpperCase();
    }
  };


  // --- ИНТЕРНАЦИОНАЛИЗАЦИЯ (i18n) ---


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
      // Если хоть одна модалка открыта (КРОМЕ ОКНА БОЯ) — gameplay stop
      const overlayOpen = document.querySelector('.overlay.show');
      const isBattleOpen = overlayOpen && overlayOpen.id === 'battleModal';
      const shouldStop = overlayOpen && !isBattleOpen;
      window.PlaygamaSDK.setGameplayState(shouldStop ? 'stop' : 'start');
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
    const actualSpeaker = loc(locObj, 'speaker') || t('intercept_data');
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
          <div class='sub'>${t('damage')}: ${w.dmg} | ${t('days').slice(0, 1)}: ${w.cd}s | ${w.isGun ? t('wpn_gun') : t('wpn_melee')}</div>
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



  const renderDefeat = (data) => {
    show('#battleModal', false);
    show('#encounterModal', false);
    show('#storyModal', false);

    const defeatDaysEl = $('#defeatDays');
    const defeatReasonEl = $('#defeatReason');
    const defeatMsgEl = $('#defeatMsg');

    if (defeatDaysEl) defeatDaysEl.textContent = t('cycles_lived', data.day);
    if (defeatReasonEl) defeatReasonEl.textContent = `${t('obj_status')} ${data.reason}`;

    const msgs = [
      t('defeat_msg_1'), t('defeat_msg_2'), t('defeat_msg_3'),
      t('defeat_msg_4'), t('defeat_msg_5')
    ];
    if (defeatMsgEl) defeatMsgEl.textContent = `"${msgs[Math.floor(Math.random() * msgs.length)]}"`;

    renderMain();
    renderTop();
    show('#defeatModal', true);

    const reviveBtn = $('#reviveBtn');
    if (reviveBtn) reviveBtn.style.display = data.reviveAvailable ? 'block' : 'none';
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
    t, loc, applyLanguage
  };
})();
