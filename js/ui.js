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
    $('#day').textContent = `ДЕНЬ ${st.day}`;
    $('#phase').textContent = `СТАТУС: ${st.phase.toUpperCase()}`;
    $('#capsTop').textContent = `КРЕДИТЫ: ${st.resources.caps}`;

    // Индикация баффа адреналина
    const weaponText = st.player.weaponName.toUpperCase();
    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    $('#weaponPill').textContent = `ОРУЖИЕ: ${weaponText}${isAdrenaline ? ' [⚡]' : ''}`;
    $('#weaponPill').classList.toggle('highlight-text', isAdrenaline);
  };

  const renderMain = () => {
    const st = S.get(), p = st.player;
    const isAdrenaline = st.adBoosts.adrenaline > Date.now();
    const dmg = (p.baseDmg + p.dmgBonus) * (isAdrenaline ? 1.5 : 1);

    $('#statusBars').innerHTML = `
      <div>♥ ЗДОРОВЬЕ ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='transform:scaleX(${clamp(p.hp / p.maxHp, 0, 1)})'></div></div></div>
      <div>🧠 РАССУДОК ${Math.round(p.mood)}/${p.maxMood}<div class='bar'><div class='fill bg-ok' style='transform:scaleX(${clamp(p.mood / p.maxMood, 0, 1)})'></div></div></div>`;

    $('#res').innerHTML = `
      <button class='pill pill-btn' data-use='food'>🍖 ЕДА: ${st.resources.food}</button>
      <button class='pill pill-btn' data-use='water'>💧 ВОДА: ${st.resources.water}</button>
      <button class='pill pill-btn' data-use='medkits'>✚ АПТ: ${st.resources.medkits}</button>
      <div class='pill'>⚙️ МАТ: ${st.resources.materials}</div>
      <div class='pill'>⚡ ПАТР: ${st.resources.ammo}</div>
      <div class='pill'>⚔️ УРОН: ${Math.round(dmg)}</div>`;

    // Обновляем видимость кнопок рекламы
    renderAdButtons();
  };

  const renderAdButtons = () => {
    const st = S.get();
    const adRow = $('#adActions');
    if (!adRow) return;

    const showEmergency = st.resources.food < 3 || st.resources.water < 3;
    const showAirdrop = Date.now() > st.adBoosts.airdropLastTime + 600000; // 10 мин
    const showAdrenaline = Date.now() > st.adBoosts.adrenaline;

    $('#emergencyBtn').style.display = showEmergency ? 'block' : 'none';
    $('#airdropBtn').style.display = showAirdrop ? 'block' : 'none';
    $('#adrenalineBtn').style.display = showAdrenaline ? 'block' : 'none';

    adRow.style.display = (showEmergency || showAirdrop || showAdrenaline) ? 'grid' : 'none';
  };

  const renderBattle = () => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    $('#battleTimer').textContent = `T-${c.time.toFixed(1)}s`;

    $('#pBars').innerHTML = `
      <div>♥ ЗДОРОВЬЕ ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='transform:scaleX(${clamp(p.hp / p.maxHp, 0, 1)})'></div></div></div>`;

    $('#enemyName').textContent = `${e.icon} ${e.name}`;

    const imgEl = $('#enemyImg');
    if (e.img) {
      if (imgEl.getAttribute('src') !== e.img) imgEl.src = e.img;
      imgEl.style.display = 'block';
    } else {
      imgEl.removeAttribute('src');
      imgEl.style.display = 'none';
    }

    $('#eHp').style.transform = `scaleX(${clamp(e.hp / e.maxHp, 0, 1)})`;
    $('#telegraph').textContent = `[УГРОЗА] АТАКА ЧЕРЕЗ ${Math.max(0, c.enemyAtk).toFixed(1)}s`;
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
    $('#dodge').textContent = c.cdDodge > 0 ? `КД [${c.cdDodge.toFixed(1)}s]` : 'УКЛОНЕНИЕ';
  };

  const setEncounterCard = ({ icon, title, desc }) => $('#encounterText').innerHTML = `<div class='pill'>${icon} ${title}</div><div style='margin-top:0.6rem;'>${desc}</div>`;
  const show = (id, on) => { $(id).classList.toggle('show', on); };
  const triggerDamage = () => { SoundManager.play('damage'); document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); const modal = $('#battleModal .card'); if (modal) { modal.classList.remove('flash-red'); void modal.offsetWidth; modal.classList.add('flash-red'); } };
  const triggerEnemyHit = () => { SoundManager.play('click'); const el = $('.enemy'); if (!el) return; el.style.transform = 'translate(4px, 2px)'; el.style.borderColor = 'var(--line)'; el.style.background = 'var(--line)'; setTimeout(() => { el.style.transform = ''; el.style.borderColor = ''; el.style.background = ''; }, 80); };

  const typeText = (el, text, speed = 25, onComplete = null) => {
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

  const showDialogue = ({ speaker, text, img, choices = [] }) => {
    $('#storySpeaker').textContent = speaker || 'ПЕРЕХВАТ ДАННЫХ';
    const okBtn = $('#storyOk');
    okBtn.style.display = choices.length ? 'none' : 'block';
    okBtn.disabled = true;

    const p = $('#storyPortrait');
    if (img) { p.src = img; p.style.display = 'block'; } else { p.style.display = 'none'; }

    const choicesCont = $('#storyChoices');
    choicesCont.innerHTML = '';
    choicesCont.style.display = choices.length ? 'grid' : 'none';

    show('#storyModal', true);
    typeText($('#storyText'), text, 15, () => {
      okBtn.disabled = false;
      if (choices.length) {
        choices.forEach(c => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = c.text;
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
    wTitle.textContent = 'ОРУЖИЕ';
    listCont.appendChild(wTitle);

    Object.keys(st.weapons).forEach(id => {
      if (!st.weapons[id]) return;
      const w = D.WEAPON_STATS[id];
      if (!w) return;

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div>${w.name}
          <div class='sub'>УРОН: ${w.dmg} | КД: ${w.cd}с | ${w.isGun ? 'ОГНЕСТРЕЛ' : 'БЛИЖНИЙ БОЙ'}</div>
        </div>
        <button class='btn ${st.player.weaponName === w.name ? 'good' : ''}' data-equip-w='${id}'>
          ${st.player.weaponName === w.name ? 'ВЫБРАНО' : 'ВЫБРАТЬ'}
        </button>
      `;
      const btn = div.querySelector('[data-equip-w]');
      btn.onclick = () => {
        if (st.player.weaponName === w.name) return;
        SoundManager.play('click');
        if (onSwitchWeapon) onSwitchWeapon(id);
        renderEquipment(onSwitchWeapon, onSwitchArmor);
      };
      listCont.appendChild(div);
    });

    const aTitle = document.createElement('h3');
    aTitle.textContent = 'БРОНЯ';
    aTitle.style.marginTop = '1rem';
    listCont.appendChild(aTitle);

    Object.keys(st.armors).forEach(id => {
      if (!st.armors[id]) return;
      const a = D.ARMOR_STATS[id];
      if (!a) return;

      const div = document.createElement('div');
      div.className = 'shopItem';
      div.innerHTML = `
        <div>${a.name}
          <div class='sub'>БОНУС HP: +${a.hp} | ЗАЩИТА: ${Math.round(a.armorClass * 100)}%</div>
        </div>
        <button class='btn ${st.player.armorName === a.name ? 'good' : ''}' data-equip-a='${id}'>
          ${st.player.armorName === a.name ? 'ВЫБРАНО' : 'ВЫБРАТЬ'}
        </button>
      `;
      const btn = div.querySelector('[data-equip-a]');
      btn.onclick = () => {
        if (st.player.armorName === a.name) return;
        SoundManager.play('click');
        if (onSwitchArmor) onSwitchArmor(id);
        renderEquipment(onSwitchWeapon, onSwitchArmor);
      };
      listCont.appendChild(div);
    });
  };

  const renderShop = (onBuyInApp) => {
    const merchantCont = $('#merchantStock');
    merchantCont.innerHTML = `
      <div class="row" style="margin-bottom:1rem; border-bottom:1px solid var(--line);">
        <button class="pill active" id="tabItems">ТОВАРЫ</button>
        <button class="pill" id="tabDirector">ДИРЕКТОР (IAP)</button>
      </div>
      <div id="shopContent"></div>
    `;

    const content = $('#shopContent');
    const tabItems = $('#tabItems');
    const tabDirector = $('#tabDirector');

    const showItems = () => {
      tabItems.classList.add('active');
      tabDirector.classList.remove('active');
      content.innerHTML = D.SHOP_ITEMS.map((item, i) =>
        `<div class='shopItem'>
             <div>${item.label}
               <div class='sub'>${item.type === 'weapon' ? 'ОРУЖИЕ' : 'РАСХОДНИК'}</div>
             </div>
             <button class='btn good' data-buy='${i}'>${item.price} КР</button>
           </div>`
      ).join('');
      // Привязка в game.js
    };

    const showDirector = () => {
      tabItems.classList.remove('active');
      tabDirector.classList.add('active');
      content.innerHTML = `<div class="sub" style="margin-bottom:1rem;">Эксклюзивные предложения от Иерихона.</div>`;

      const ITEMS = [
        { id: 'no_ads', price: '99 GAM', name: 'БЕЗ РЕКЛАМЫ', desc: 'Убирает межстраничную рекламу.' },
        { id: 'starter_pack', price: '49 GAM', name: 'СТАРТОВЫЙ НАБОР', desc: 'Оружие + Ресурсы.' },
        { id: 'premium_caps', price: '29 GAM', name: '200 КРЕДИТОВ', desc: 'Мгновенное пополнение.' },
        { id: 'cyber_stomach', price: '59 GAM', name: 'КИБЕР-ЖЕЛУДОК', desc: '-50% расход еды/воды.' }
      ];

      ITEMS.forEach(item => {
        const div = document.createElement('div');
        div.className = 'shopItem';
        div.innerHTML = `
          <div>${item.name} <div class="sub">${item.desc}</div></div>
          <button class="btn good" style="min-width:80px;">${item.price}</button>
        `;
        div.querySelector('button').onclick = () => {
          if (onBuyInApp) onBuyInApp(item.id);
        };
        content.appendChild(div);
      });
    };

    tabItems.onclick = showItems;
    tabDirector.onclick = showDirector;
    showItems();
  };

  return { $, toast, clamp, renderTop, renderMain, renderBattle, setEncounterCard, show, triggerDamage, triggerEnemyHit, typeText, showDialogue, renderEquipment, renderShop };
})();
