(() => {
  const D = window.GameData, S = window.GameState, UI = window.GameUI;
  const rng = () => Math.random();
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const totalDmg = () => S.get().player.baseDmg + S.get().player.dmgBonus;

  const weaponUnlock = id => {
    const st = S.get();
    if (id === 'pipe' && !st.weapons.pipe) { st.weapons.pipe = true; st.player.dmgBonus += 3; st.player.weaponName = 'САМОПАЛ'; }
    if (id === 'laser' && !st.weapons.laser) { st.weapons.laser = true; st.player.dmgBonus += 6; st.player.weaponName = 'ЛАЗЕРНЫЙ ПИСТОЛЕТ'; }
    if (id === 'knife' && !st.weapons.knife) { st.weapons.knife = true; st.player.dmgBonus += 2; st.player.weaponName = 'САМОДЕЛЬНЫЙ НОЖ'; }
    if (id === 'rifleMod' && !st.weapons.rifleMod) { st.weapons.rifleMod = true; st.player.dmgBonus += 4; st.player.weaponName = 'УСИЛЕННЫЙ КАРАБИН'; }
  };

  const maybeShowNote = () => {
    const st = S.get();
    if (st.day < st.nextNoteDay) return;
    const note = D.NOTES[st.noteIndex % D.NOTES.length];
    UI.toast(note);
    st.noteIndex += 1;
    st.lastNoteDay = st.day;
    st.nextNoteDay = st.day + 5 + Math.floor(rng() * 6);
  };

  const newEnemy = elite => {
    const st = S.get();
    const base = pick(elite ? D.ELITE_ENEMIES : D.ENEMIES);
    const scale = elite ? (1 + Math.min(.85, st.day * 0.045)) : (1 + Math.min(.6, st.day * 0.024));
    return { ...base, elite, maxHp: Math.round(base.hp * scale), hp: Math.round(base.hp * scale), dmg: Math.round(base.dmg * scale) };
  };

  const upkeep = () => {
    const st = S.get(), p = st.player;
    st.resources.food = Math.max(0, st.resources.food - 2);
    st.resources.water = Math.max(0, st.resources.water - 2);
    if (st.resources.food === 0) { p.hp -= 7; p.mood = Math.max(0, p.mood - 9); UI.toast('КРИТИЧЕСКИЙ ГОЛОД. ПОТЕРЯ HP.'); UI.triggerDamage(); }
    if (st.resources.water === 0) { p.hp -= 10; p.mood = Math.max(0, p.mood - 12); UI.toast('ОБЕЗВОЖИВАНИЕ. ПОТЕРЯ HP.'); UI.triggerDamage(); }
    p.mood = Math.max(0, p.mood - 1.2);
    p.stability = Math.min(p.maxStab, p.stability + 5);
    if (p.mood < 25) { p.hp -= 2; UI.triggerDamage(); }
    if (p.hp <= 0) defeat();
  };

  const encounterRoll = () => {
    const st = S.get();
    const enemyChance = Math.min(.38, .12 + st.day * 0.008);
    const locationChance = 0.2;
    const roll = rng();
    if (roll < enemyChance) return { type: 'enemy', enemy: newEnemy(false) };
    if (roll < enemyChance + locationChance) return { type: 'location', location: pick(D.LOCATIONS) };
    return { type: 'calm' };
  };

  const applyReward = reward => Object.entries(reward).forEach(([key, value]) => S.get().resources[key] = (S.get().resources[key] || 0) + value);

  const renderMerchant = () => {
    const st = S.get();
    UI.$('#merchantStock').innerHTML = D.SHOP_ITEMS.map((item, i) => `<div class='shopItem'><div>${item.label} <span class='sub'>(ЦЕНА ${item.price} [К])</span></div><button class='btn good' data-buy='${i}'>КУПИТЬ</button></div>`).join('');
    UI.$('#merchantStock').querySelectorAll('[data-buy]').forEach(btn => btn.onclick = () => {
      const product = D.SHOP_ITEMS[Number(btn.dataset.buy)];
      if (!product || st.resources.caps < product.price) return UI.toast('ОШИБКА: НЕДОСТАТОЧНО КРЫШЕК.');
      st.resources.caps -= product.price;
      if (product.type === 'weapon') weaponUnlock(product.weaponId); else st.resources[product.key] = (st.resources[product.key] || 0) + product.amount;
      UI.toast(`ТРАНЗАКЦИЯ УСПЕШНА: ${product.label}`);
      S.save(); UI.renderTop(); UI.renderMain(); renderMerchant();
    });
  };

  const renderCraft = () => {
    const st = S.get();
    UI.$('#craftStock').innerHTML = D.CRAFT_ITEMS.map((item, i) => `<div class='shopItem'><div>${item.label}<div class='sub'>ТРЕБУЕТСЯ: [M]${item.materials}, [A]${item.ammo}</div></div><button class='btn good' data-craft='${i}'>СОЗДАТЬ</button></div>`).join('');
    UI.$('#craftStock').querySelectorAll('[data-craft]').forEach(btn => btn.onclick = () => {
      const rec = D.CRAFT_ITEMS[Number(btn.dataset.craft)];
      if (!rec) return;
      if (st.resources.materials < rec.materials || st.resources.ammo < rec.ammo) return UI.toast('ОШИБКА: НЕТ МАТЕРИАЛОВ ДЛЯ СИНТЕЗА.');
      st.resources.materials -= rec.materials;
      st.resources.ammo -= rec.ammo;
      if (rec.unlock) weaponUnlock(rec.unlock);
      if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
      UI.toast(`СИНТЕЗ ЗАВЕРШЕН: ${rec.label}`);
      S.save(); UI.renderTop(); UI.renderMain(); renderCraft();
    });
  };

  const startDay = () => {
    const st = S.get();
    if (st.combat.active || st.dead) return;
    st.day++;
    st.phase = 'ИССЛЕДОВАНИЕ';
    upkeep();
    if (st.dead) return;

    if (st.day <= 5) UI.toast(D.STORY[st.day - 1]);
    maybeShowNote();

    const event = encounterRoll();
    if (event.type === 'enemy') {
      st.encounter = event;
      UI.setEncounterCard({ icon: event.enemy.icon, title: `КОНТАКТ: ${event.enemy.name}`, desc: 'СКАНЕР ОТМЕТИЛ УГРОЗУ. ВСТУПИТЬ В БОЙ?' });
      UI.$('#encounterYes').textContent = 'В БОЙ'; UI.$('#encounterNo').textContent = 'УЙТИ'; st.phase = 'КОНТАКТ'; UI.show('#encounterModal', true);
    } else if (event.type === 'location') {
      st.encounter = event;
      UI.setEncounterCard({ icon: event.location.icon, title: `ЛОКАЦИЯ: ${event.location.name}`, desc: event.location.desc });
      UI.$('#encounterYes').textContent = 'ИССЛЕДОВАТЬ'; UI.$('#encounterNo').textContent = 'ОБОЙТИ'; st.phase = 'РАЗВЕДКА'; UI.show('#encounterModal', true);
    } else {
      const calmReward = { materials: 2 + Math.floor(rng() * 2), ammo: 1 + Math.floor(rng() * 2), caps: 1 + Math.floor(rng() * 3) };
      applyReward(calmReward);
      UI.toast('СЕКТОР ЧИСТ. НАЙДЕНЫ ОСТАТКИ ПРИПАСОВ.');
    }

    S.save(); UI.renderTop(); UI.renderMain();
  };

  const beginFight = () => {
    const st = S.get(), c = st.combat;
    if (!c.enemy) return;
    UI.show('#encounterModal', false);
    Object.assign(c, { active: true, time: 0, enemyAtk: 1.5, dodge: 0, cdReload: 0, cdVolley: 0, lastTs: 0 });
    st.phase = 'БОЙ';
    UI.show('#battleModal', true);
    tick(performance.now());
  };

  const resolveLocationExplore = () => {
    const st = S.get();
    const loc = st.encounter?.location;
    if (!loc) return;
    applyReward(loc.reward);
    UI.toast(`${loc.name.toUpperCase()}: ПОЛУЧЕН ДОСТУП К РЕСУРСАМ.`);
    if (rng() < loc.danger) {
      st.combat.enemy = newEnemy(rng() < loc.elite);
      UI.toast('ВНИМАНИЕ: ЗАСАДА!');
      beginFight();
      return;
    }
    st.phase = 'ИССЛЕДОВАНИЕ';
  };

  const finishFight = win => {
    const st = S.get(), c = st.combat;
    c.active = false; UI.show('#battleModal', false); st.phase = 'ИССЛЕДОВАНИЕ';
    let txt = '';
    if (win) {
      const reward = { materials: 5 + Math.floor(rng() * 5), ammo: 4 + Math.floor(rng() * 5), food: 1, water: 1, caps: 3 + Math.floor(rng() * 4) };
      applyReward(reward);
      txt = `УГРОЗА ЛИКВИДИРОВАНА. ИЗВЛЕЧЕНО: [M]${reward.materials}, [A]${reward.ammo}, [F]1, [W]1, [К]${reward.caps}`;
    } else {
      st.player.mood = Math.max(0, st.player.mood - 8);
      txt = 'ТАКТИЧЕСКОЕ ОТСТУПЛЕНИЕ. ПОТЕРЯ БОЕВОГО ДУХА.';
    }
    c.reward = txt; UI.$('#rewardText').textContent = txt; UI.show('#rewardModal', true);
    S.save(); UI.renderTop(); UI.renderMain();
  };

  const defeat = () => {
    const st = S.get(); st.dead = true; st.combat.active = false; UI.show('#battleModal', false); UI.show('#defeatModal', true); S.save();
  };

  const tick = ts => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy;
    if (!c.active || !e || st.dead) return;
    const last = c.lastTs || ts;
    const dt = Math.min(.08, (ts - last) / 1000 || .016);
    c.lastTs = ts; c.time += dt; c.enemyAtk -= dt;
    if (c.dodge > 0) c.dodge -= dt;
    if (c.cdReload > 0) c.cdReload -= dt;
    if (c.cdVolley > 0) c.cdVolley -= dt;

    if (c.enemyAtk <= 0) {
      if (c.dodge > 0) { c.dodge = 0; UI.toast('УКЛОНЕНИЕ ПРОШЛО УСПЕШНО.'); }
      else {
        let dmg = e.mark ? Math.round(e.dmg * 1.15) : e.dmg;
        p.hp -= dmg; p.mood = Math.max(0, p.mood - 2);
        UI.triggerDamage();
        if (p.hp <= 0) return defeat();
      }
      c.enemyAtk = e.atk;
    }
    if (e.hp <= 0) return finishFight(true);
    UI.renderTop(); UI.renderBattle();
    requestAnimationFrame(tick);
  };

  const actAttack = () => {
    const st = S.get(), c = st.combat, e = c.enemy;
    if (!c.active || !e) return;
    if (st.resources.ammo < 1) return UI.toast('ОШИБКА: ПУСТОЙ МАГАЗИН.');
    st.resources.ammo--;
    let dmg = totalDmg() + Math.floor(rng() * 5);
    if (rng() < 0.12) { dmg = Math.round(dmg * 1.5); UI.toast('КРИТИЧЕСКИЙ УРОН!'); }
    if (e.armor) dmg = Math.round(dmg * (1 - e.armor));
    e.hp -= Math.max(1, dmg);
    st.player.impulse = Math.min(100, st.player.impulse + 8);
    UI.triggerEnemyHit();
    UI.renderTop(); UI.renderBattle();
  };

  const actDodge = () => {
    const st = S.get();
    if (st.player.impulse < 20) return UI.toast('НЕДОСТАТОЧНО ИМПУЛЬСА (ТРЕБ. 20).');
    st.player.impulse -= 20; st.combat.dodge = 1.2; UI.renderBattle();
  };

  const actMed = () => {
    const st = S.get();
    if (st.resources.medkits < 1) return UI.toast('СТИМПАКИ ОТСУТСТВУЮТ.');
    st.resources.medkits--; st.player.hp = Math.min(st.player.maxHp, st.player.hp + 24); st.player.mood = Math.min(st.player.maxMood, st.player.mood + 6);
    UI.renderTop(); UI.renderBattle();
  };

  const actReload = () => {
    const st = S.get(), c = st.combat;
    if (c.cdReload > 0) return;
    st.resources.ammo += 8; st.player.impulse = Math.min(100, st.player.impulse + 10); c.cdReload = 11; UI.renderTop(); UI.renderBattle();
  };

  const actVolley = () => {
    const st = S.get(), c = st.combat, e = c.enemy;
    if (c.cdVolley > 0 || !e) return;
    if (st.resources.ammo < 6) return UI.toast('НЕДОСТАТОЧНО ПАТРОНОВ ДЛЯ ЗАЛПА.');
    st.resources.ammo -= 6; e.hp -= Math.round((totalDmg() + 5) * 1.45); c.cdVolley = 16;
    UI.triggerEnemyHit();
    UI.renderTop(); UI.renderBattle();
  };

  UI.$('#charBtn').onclick = startDay;
  UI.$('#merchantBtn').onclick = () => { renderMerchant(); UI.show('#merchantModal', true); };
  UI.$('#merchantClose').onclick = () => UI.show('#merchantModal', false);
  UI.$('#craftBtn').onclick = () => { renderCraft(); UI.show('#craftModal', true); };
  UI.$('#craftClose').onclick = () => UI.show('#craftModal', false);

  UI.$('#encounterYes').onclick = () => {
    const st = S.get(), encounter = st.encounter;
    if (!encounter) return;
    if (encounter.type === 'enemy') { st.combat.enemy = encounter.enemy; st.encounter = null; beginFight(); }
    else if (encounter.type === 'location') { UI.show('#encounterModal', false); resolveLocationExplore(); st.encounter = null; S.save(); UI.renderTop(); UI.renderMain(); }
  };
  UI.$('#encounterNo').onclick = () => {
    const st = S.get(); st.player.mood = Math.max(0, st.player.mood - 2); st.phase = 'ИССЛЕДОВАНИЕ'; st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain();
  };

  UI.$('#atk').onclick = actAttack;
  UI.$('#dodge').onclick = actDodge;
  UI.$('#med').onclick = actMed;
  UI.$('#reload').onclick = actReload;
  UI.$('#volley').onclick = actVolley;
  UI.$('#retreat').onclick = () => finishFight(false);
  UI.$('#rewardOk').onclick = () => { UI.show('#rewardModal', false); const st = S.get(); st.combat.enemy = null; S.save(); UI.renderMain(); };
  UI.$('#newRun').onclick = () => { S.set(S.fresh()); UI.show('#defeatModal', false); UI.renderTop(); UI.renderMain(); S.save(); };
  UI.$('#loadRun').onclick = () => { if (S.load()) { UI.show('#defeatModal', false); UI.toast('ДАННЫЕ ВОССТАНОВЛЕНЫ'); UI.renderTop(); UI.renderMain(); } };

  if (!S.load()) S.set(S.fresh());
  S.normalize();
  UI.renderTop(); UI.renderMain(); renderMerchant(); renderCraft(); S.save();
})();
