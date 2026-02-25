window.GameUI = (() => {
  const S = window.GameState;
  const $ = sel => document.querySelector(sel);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const toast = msg => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $('#toasts').prepend(el);
    setTimeout(() => el.remove(), 3500);
  };

  const renderTop = () => {
    const st = S.get();
    $('#day').textContent = `День ${st.day}`;
    $('#phase').textContent = st.phase;
    $('#capsTop').textContent = `🧢 Крышки: ${st.resources.caps}`;
    $('#weaponPill').textContent = `Оружие: ${st.player.weaponName}`;
    $('#storyChapter').textContent = 'Глава 1: Пробуждение без памяти';
  };

  const renderMain = () => {
    const st = S.get();
    const p = st.player;
    const dmg = p.baseDmg + p.dmgBonus;
    $('#statusText').textContent = 'Вы собираете следы прошлого, чтобы понять, кто стёр вашу память.';
    $('#statusBars').innerHTML = `
      <div>❤️ HP ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%;background:var(--bad)'></div></div></div>
      <div>🧠 Настроение ${Math.round(p.mood)}/${p.maxMood}<div class='bar'><div class='fill' style='width:${clamp(p.mood / p.maxMood * 100, 0, 100)}%;background:var(--ok)'></div></div></div>
      <div>🛡 Стабильность ${Math.round(p.stability)}/${p.maxStab}<div class='bar'><div class='fill' style='width:${clamp(p.stability / p.maxStab * 100, 0, 100)}%;background:var(--info)'></div></div></div>
      <div>⚡ Импульс ${Math.round(p.impulse)}/100<div class='bar'><div class='fill' style='width:${clamp(p.impulse, 0, 100)}%;background:var(--warn)'></div></div></div>`;

    $('#res').innerHTML = `
      <div class='pill'>🍖 Еда: ${st.resources.food}</div>
      <div class='pill'>💧 Вода: ${st.resources.water}</div>
      <div class='pill'>🧱 Материалы: ${st.resources.materials}</div>
      <div class='pill'>🔸 Патроны: ${st.resources.ammo}</div>
      <div class='pill'>🩹 Аптечки: ${st.resources.medkits}</div>
      <div class='pill'>🎯 Урон: ${dmg}</div>`;
  };

  const renderBattle = () => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!e) return;
    $('#battleTimer').textContent = `${c.time.toFixed(1)}с`;
    $('#pBars').innerHTML = `
      <div>❤️ HP ${Math.round(p.hp)}/${p.maxHp}<div class='bar'><div class='fill' style='width:${clamp(p.hp / p.maxHp * 100, 0, 100)}%;background:var(--bad)'></div></div></div>
      <div>⚡ Импульс ${Math.round(p.impulse)}/100<div class='bar'><div class='fill' style='width:${clamp(p.impulse, 0, 100)}%;background:var(--warn)'></div></div></div>`;
    $('#enemyName').textContent = `${e.icon} ${e.name} (${Math.max(0, Math.round(e.hp))}/${e.maxHp})`;
    $('#eHp').style.width = `${clamp(e.hp / e.maxHp * 100, 0, 100)}%`;
    $('#telegraph').textContent = `АТАКА ЧЕРЕЗ ${Math.max(0, c.enemyAtk).toFixed(1)}с`;
    $('#teleFill').style.width = `${clamp((1 - c.enemyAtk / e.atk) * 100, 0, 100)}%`;
    $('#reload').disabled = c.cdReload > 0;
    $('#volley').disabled = c.cdVolley > 0;
    $('#reload').textContent = c.cdReload > 0 ? `Перезарядка ${c.cdReload.toFixed(1)}с` : 'Перезарядка';
    $('#volley').textContent = c.cdVolley > 0 ? `Залп ${c.cdVolley.toFixed(1)}с` : 'Залп';
  };

  const setEncounterCard = ({ icon, title, desc }) => $('#encounterText').innerHTML = `<div class='pill'>${icon} ${title}</div><div>${desc}</div>`;
  const show = (id, on) => $(id).classList.toggle('show', on);

  return { $, toast, clamp, renderTop, renderMain, renderBattle, setEncounterCard, show };
})();
