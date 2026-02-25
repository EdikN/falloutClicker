window.GameUI = (() => {
  const S = window.GameState;
  const $ = sel => document.querySelector(sel);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const toast = msg => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = `> ${msg}`;
    $('#toasts').prepend(el);
    setTimeout(() => {
      el.style.animation = 'slideLeft 0.3s reverse forwards';
      setTimeout(() => el.remove(), 300);
    }, 2500); // Сделал уведомления чуть быстрее, чтобы не перекрывали экран
  };

  const renderTop = () => {
    const st = S.get();
    $('#day').textContent = `ДЕНЬ ${st.day}`;
    $('#phase').textContent = `СТАТУС: ${st.phase}`;
    $('#capsTop').textContent = `[КРЫШКИ]: ${st.resources.caps}`;
    $('#weaponPill').textContent = `ОРУЖИЕ: ${st.player.weaponName}`;
    $('#storyChapter').textContent = 'SYS_LOG_01';
  };

  const renderMain = () => {
    const st = S.get();
    const p = st.player;
    const dmg = p.baseDmg + p.dmgBonus;
    $('#statusText').textContent = '> Сбор фрагментов памяти...';

    // Компактные бары в 2 колонки
    $('#statusBars').innerHTML = `
      <div>[HP] ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%'></div></div></div>
      <div>[MD] НАСТР. ${Math.round(p.mood)}/${p.maxMood}<div class='bar'><div class='fill bg-ok' style='width:${clamp(p.mood / p.maxMood * 100, 0, 100)}%'></div></div></div>
      <div>[ST] СТАБ. ${Math.round(p.stability)}/${p.maxStab}<div class='bar'><div class='fill bg-info' style='width:${clamp(p.stability / p.maxStab * 100, 0, 100)}%'></div></div></div>
      <div>[IM] ИМПУЛЬС ${Math.round(p.impulse)}/100<div class='bar'><div class='fill bg-warn' style='width:${clamp(p.impulse, 0, 100)}%'></div></div></div>`;

    // Компактные ресурсы в 3 колонки
    $('#res').innerHTML = `
      <div class='pill'>[F] ЕДА: ${st.resources.food}</div>
      <div class='pill'>[W] ВОДА: ${st.resources.water}</div>
      <div class='pill'>[M] МАТ-ЛЫ: ${st.resources.materials}</div>
      <div class='pill'>[A] ПАТР.: ${st.resources.ammo}</div>
      <div class='pill'>[+] АПТЕЧ.: ${st.resources.medkits}</div>
      <div class='pill'>[DMG] УРОН: ${dmg}</div>`;
  };

  const renderBattle = () => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    $('#battleTimer').textContent = `T-${c.time.toFixed(1)}s`;

    // Переиспользуем сетку statusBars для боя
    $('#pBars').innerHTML = `
      <div>[HP] ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill bg-bad' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%'></div></div></div>
      <div>[IM] ИМПУЛЬС ${Math.round(p.impulse)}/100<div class='bar'><div class='fill bg-warn' style='width:${clamp(p.impulse, 0, 100)}%'></div></div></div>`;

    $('#enemyName').textContent = `${e.icon} ${e.name} (${Math.max(0, Math.round(e.hp))}/${e.maxHp})`;
    $('#eHp').style.width = `${clamp(e.hp / e.maxHp * 100, 0, 100)}%`;
    $('#telegraph').textContent = `[УГРОЗА] АТАКА ЧЕРЕЗ ${Math.max(0, c.enemyAtk).toFixed(1)}s`;
    $('#teleFill').style.width = `${clamp((1 - c.enemyAtk / e.atk) * 100, 0, 100)}%`;

    $('#reload').disabled = c.cdReload > 0;
    $('#volley').disabled = c.cdVolley > 0;
    $('#reload').textContent = c.cdReload > 0 ? `ПЕРЕЗАРЯД. [${c.cdReload.toFixed(0)}s]` : 'ПЕРЕЗАРЯД.';
    $('#volley').textContent = c.cdVolley > 0 ? `ЗАЛП [${c.cdVolley.toFixed(0)}s]` : 'ЗАЛП';
  };

  const setEncounterCard = ({ icon, title, desc }) => $('#encounterText').innerHTML = `<div class='pill'>${icon} ${title}</div><div style='margin-top:0.3rem;'>${desc}</div>`;

  const show = (id, on) => {
    $(id).classList.toggle('show', on);
  };

  const triggerDamage = () => {
    document.body.classList.remove('shake');
    void document.body.offsetWidth;
    document.body.classList.add('shake');
    const modal = $('#battleModal .card');
    if (modal) {
      modal.classList.remove('flash-red');
      void modal.offsetWidth;
      modal.classList.add('flash-red');
    }
  };

  const triggerEnemyHit = () => {
    const el = $('.enemy');
    if (!el) return;
    el.style.transform = 'translate(4px, 2px)';
    el.style.borderColor = 'var(--line)';
    el.style.background = 'var(--line)';
    el.style.color = 'var(--bg)';
    setTimeout(() => {
      el.style.transform = '';
      el.style.borderColor = '';
      el.style.background = '';
      el.style.color = '';
    }, 80);
  };

  return { $, toast, clamp, renderTop, renderMain, renderBattle, setEncounterCard, show, triggerDamage, triggerEnemyHit };
})();
