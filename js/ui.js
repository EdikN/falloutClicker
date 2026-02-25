window.GameUI = (() => {
  const S = window.GameState;
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
    $('#day').textContent = `ЦИКЛ ${st.day}`;
    $('#phase').textContent = `СТАТУС: ${st.phase.toUpperCase()}`;
    $('#capsTop').textContent = `КРЕДИТЫ: ${st.resources.caps}`;
    $('#weaponPill').textContent = `ОРУЖИЕ: ${st.player.weaponName.toUpperCase()}`;
  };

  const renderMain = () => {
    const st = S.get(), p = st.player;
    const dmg = p.baseDmg + p.dmgBonus;

    $('#statusBars').innerHTML = `
      <div>♥ ЗДОРОВЬЕ ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%'></div></div></div>
      <div>🧠 РАССУДОК ${Math.round(p.mood)}/${p.maxMood}<div class='bar'><div class='fill bg-ok' style='width:${clamp(p.mood / p.maxMood * 100, 0, 100)}%'></div></div></div>`;

    $('#res').innerHTML = `
      <button class='pill pill-btn' data-use='food'>🍖 ЕДА: ${st.resources.food}</button>
      <button class='pill pill-btn' data-use='water'>💧 ВОДА: ${st.resources.water}</button>
      <button class='pill pill-btn' data-use='medkits'>✚ АПТ: ${st.resources.medkits}</button>
      <div class='pill'>⚙️ МАТ: ${st.resources.materials}</div>
      <div class='pill'>⚡ ПАТР: ${st.resources.ammo}</div>
      <div class='pill'>⚔️ УРОН: ${dmg}</div>`;
  };

  const renderBattle = () => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    $('#battleTimer').textContent = `T-${c.time.toFixed(1)}s`;

    $('#pBars').innerHTML = `
      <div>♥ ЗДОРОВЬЕ ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%'></div></div></div>`;

    $('#enemyName').textContent = `${e.icon} ${e.name}`;

    const imgEl = $('#enemyImg');
    if (e.img) { imgEl.src = e.img; imgEl.style.display = 'block'; } else { imgEl.style.display = 'none'; }

    $('#eHp').style.width = `${clamp(e.hp / e.maxHp * 100, 0, 100)}%`;
    $('#telegraph').textContent = `[УГРОЗА] АТАКА ЧЕРЕЗ ${Math.max(0, c.enemyAtk).toFixed(1)}s`;
    $('#teleFill').style.width = `${clamp((1 - c.enemyAtk / e.atk) * 100, 0, 100)}%`;

    // Кнопка уклонения с кулдауном
    $('#dodge').disabled = c.cdDodge > 0;
    $('#dodge').textContent = c.cdDodge > 0 ? `КД [${c.cdDodge.toFixed(1)}s]` : 'УКЛОНЕНИЕ';
  };

  const setEncounterCard = ({ icon, title, desc }) => $('#encounterText').innerHTML = `<div class='pill'>${icon} ${title}</div><div style='margin-top:0.6rem;'>${desc}</div>`;
  const show = (id, on) => { $(id).classList.toggle('show', on); };
  const triggerDamage = () => { document.body.classList.remove('shake'); void document.body.offsetWidth; document.body.classList.add('shake'); const modal = $('#battleModal .card'); if (modal) { modal.classList.remove('flash-red'); void modal.offsetWidth; modal.classList.add('flash-red'); } };
  const triggerEnemyHit = () => { const el = $('.enemy'); if (!el) return; el.style.transform = 'translate(4px, 2px)'; el.style.borderColor = 'var(--line)'; el.style.background = 'var(--line)'; setTimeout(() => { el.style.transform = ''; el.style.borderColor = ''; el.style.background = ''; }, 80); };

  return { $, toast, clamp, renderTop, renderMain, renderBattle, setEncounterCard, show, triggerDamage, triggerEnemyHit };
})();
