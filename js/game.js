(() => {
  const D = window.GameData, S = window.GameState, UI = window.GameUI;
  const rng = () => Math.random();
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const totalDmg = () => S.get().player.baseDmg + S.get().player.dmgBonus;

  // Таблица оружия — id → {dmg, name, isGun}
  const WEAPON_STATS = {
    knife: { dmg: 3, name: 'ЗАТОЧКА', isGun: false },
    wrench: { dmg: 4, name: 'ГАЕЧНЫЙ КЛЮЧ', isGun: false },
    pickaxe: { dmg: 10, name: 'КИРКА-КЛИНОК', isGun: false },
    shockrod: { dmg: 18, name: 'ШОКОВЫЙ ЖЕЗЛ', isGun: false },
    vibrofist: { dmg: 26, name: 'ВИБРО-КУЛАК', isGun: false },
    pistol: { dmg: 8, name: '10ММ ПИСТОЛЕТ', isGun: true },
    shotgun: { dmg: 16, name: 'ДРОБОВИК', isGun: true },
    rifle: { dmg: 20, name: 'ШТУРМ. ВИНТОВКА', isGun: true },
    plasma: { dmg: 32, name: 'ПЛАЗМОГАН', isGun: true },
    launcher: { dmg: 45, name: 'ГРАНАТОМЕТ', isGun: true },
    laserc: { dmg: 55, name: 'ЛАЗЕРНАЯ ПУШКА', isGun: true }
  };

  const weaponUnlock = id => {
    const st = S.get(), p = st.player;
    if (st.weapons[id]) return UI.toast('ОРУЖИЕ УЖЕ ИМЕЕТСЯ.');
    st.weapons[id] = true;
    const w = WEAPON_STATS[id];
    if (w) { p.dmgBonus = w.dmg; p.weaponName = w.name; p.isGun = w.isGun; }
  };

  const defeat = () => {
    const st = S.get(); st.dead = true; st.combat.active = false;
    UI.show('#battleModal', false); UI.show('#encounterModal', false);
    UI.renderMain(); UI.renderTop(); UI.show('#defeatModal', true); S.save();
  };

  const typeText = (el, text, speed = 22) => {
    el.innerHTML = ''; let i = 0; const btn = UI.$('#storyOk'); btn.disabled = true;
    const t = () => { if (i < text.length) { el.innerHTML += text.charAt(i); i++; setTimeout(t, speed); } else btn.disabled = false; };
    t();
  };

  const checkStoryEvents = () => {
    const st = S.get();
    if (st.day >= st.nextStoryDay && st.storyIndex < D.STORY_CHAPTERS.length) {
      UI.show('#storyModal', true);
      typeText(UI.$('#storyText'), D.STORY_CHAPTERS[st.storyIndex].text);
      st.storyIndex++;
      st.nextStoryDay = st.day + 3 + Math.floor(rng() * 5);
      return true;
    }
    if (st.day >= st.nextNoteDay) {
      UI.show('#storyModal', true);
      typeText(UI.$('#storyText'), pick(D.NOTES));
      st.nextNoteDay = st.day + 15 + Math.floor(rng() * 6);
      return true;
    }
    return false;
  };

  const newEnemy = elite => {
    const st = S.get(), base = pick(elite ? D.ELITE_ENEMIES : D.ENEMIES);
    const scale = elite ? (1 + Math.min(1.5, st.day * 0.05)) : (1 + Math.min(1.0, st.day * 0.03));
    const maxHp = Math.round(base.hp * scale);
    const dmg = Math.round(base.dmg * scale);
    return { ...base, elite, maxHp, hp: maxHp, dmg, threat: Math.round(maxHp / 10 + dmg) };
  };

  const upkeep = () => {
    const st = S.get(), p = st.player;
    st.resources.food = Math.max(0, st.resources.food - 2);
    st.resources.water = Math.max(0, st.resources.water - 2);
    if (st.resources.food === 0) { p.hp -= 5; p.mood -= 5; UI.toast('ГОЛОД: -5 HP'); UI.triggerDamage(); }
    if (st.resources.water === 0) { p.hp -= 8; p.mood -= 8; UI.toast('ЖАЖДА: -8 HP'); UI.triggerDamage(); }
    p.mood = Math.max(0, p.mood - 1);
    if (p.mood < 20) { p.hp -= 2; UI.triggerDamage(); }
  };

  const encounterRoll = () => {
    const st = S.get();
    const enemyChance = Math.min(.45, .15 + st.day * 0.01), roll = rng();
    if (roll < enemyChance) return { type: 'enemy', enemy: newEnemy(st.day > 10 && rng() < 0.15) };
    if (roll < enemyChance + 0.25) return { type: 'location', location: pick(D.LOCATIONS) };
    return { type: 'calm' };
  };

  const applyReward = r => Object.entries(r).forEach(([k, v]) => S.get().resources[k] = (S.get().resources[k] || 0) + v);

  /* ---------- ТОРГОВЕЦ ---------- */
  const renderMerchant = () => {
    const st = S.get();
    UI.$('#merchantStock').innerHTML = D.SHOP_ITEMS.map((item, i) =>
      `<div class='shopItem'>
         <div>${item.label}
           <div class='sub'>${item.type === 'weapon' ? 'ОРУЖИЕ' : 'РАСХОДНИК'}</div>
         </div>
         <button class='btn good' data-buy='${i}'>${item.price} КР</button>
       </div>`
    ).join('');
    UI.$('#merchantStock').querySelectorAll('[data-buy]').forEach(btn => btn.onclick = () => {
      const p = D.SHOP_ITEMS[+btn.dataset.buy];
      if (st.resources.caps < p.price) return UI.toast('МАЛО КРЕДИТОВ');
      st.resources.caps -= p.price;
      if (p.type === 'weapon') weaponUnlock(p.weaponId);
      else st.resources[p.key] = (st.resources[p.key] || 0) + p.amount;
      UI.toast(`КУПЛЕНО: ${p.label}`); S.save(); UI.renderTop(); UI.renderMain(); renderMerchant();
    });
  };

  /* ---------- СИНТЕЗАТОР ---------- */
  const renderCraft = () => {
    const st = S.get();
    UI.$('#craftStock').innerHTML = D.CRAFT_ITEMS.map((item, i) => {
      const costStr = item.ammo > 0
        ? `МАТ: ${item.materials} | ПАТР: ${item.ammo}`
        : `МАТ: ${item.materials}`;
      return `<div class='shopItem'>
        <div>${item.label}
          <div class='sub'>${item.desc}</div>
          <div class='sub'>СТОИМОСТЬ: ${costStr}</div>
        </div>
        <button class='btn good' data-craft='${i}'>СОЗДАТЬ</button>
      </div>`;
    }).join('');

    UI.$('#craftStock').querySelectorAll('[data-craft]').forEach(btn => btn.onclick = () => {
      const rec = D.CRAFT_ITEMS[+btn.dataset.craft];
      if (st.resources.materials < rec.materials) return UI.toast('МАЛО МАТЕРИАЛОВ');
      if (rec.ammo > 0 && st.resources.ammo < rec.ammo) return UI.toast('МАЛО ПАТРОНОВ');
      st.resources.materials -= rec.materials;
      if (rec.ammo) st.resources.ammo -= rec.ammo;
      if (rec.unlock) weaponUnlock(rec.unlock);
      if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
      if (rec.healBoost) st.player.healPower = (st.player.healPower || 30) + rec.healBoost;
      UI.toast(`СОЗДАНО: ${rec.label}`); S.save(); UI.renderTop(); UI.renderMain(); renderCraft();
    });
  };

  /* ---------- ДЕНЬ ---------- */
  const startDay = () => {
    const st = S.get(); if (st.combat.active || st.dead) return;
    st.day++; st.phase = 'ИССЛЕДОВАНИЕ'; upkeep();
    if (st.player.hp <= 0) { defeat(); return; }
    UI.renderTop(); UI.renderMain();
    checkStoryEvents();

    const event = encounterRoll();
    if (event.type === 'enemy') {
      st.encounter = event;
      const threat = event.enemy.threat;
      const threatLabel = threat < 15 ? '🟢 СЛАБЫЙ' : threat < 30 ? '🟡 СРЕДНИЙ' : threat < 50 ? '🟠 ОПАСНЫЙ' : '🔴 СМЕРТЕЛЬНЫЙ';
      UI.setEncounterCard({ icon: event.enemy.icon, title: `УГРОЗА: ${event.enemy.name}`, desc: `УРОВЕНЬ СИЛЫ: ${threat} — ${threatLabel}\nВСТУПИТЬ В БОЙ?` });
      UI.$('#encounterYes').textContent = 'В БОЙ'; UI.$('#encounterNo').textContent = 'БЕЖАТЬ';
      st.phase = 'КОНТАКТ'; UI.show('#encounterModal', true);
    } else if (event.type === 'location') {
      st.encounter = event;
      UI.setEncounterCard({ icon: event.location.icon, title: `НАЙДЕНО: ${event.location.name}`, desc: event.location.desc });
      UI.$('#encounterYes').textContent = 'ОБЫСКАТЬ'; UI.$('#encounterNo').textContent = 'ИГНОРИРОВАТЬ';
      st.phase = 'РАЗВЕДКА'; UI.show('#encounterModal', true);
    } else {
      applyReward({ materials: 2 + Math.floor(rng() * 3), caps: 1 + Math.floor(rng() * 2) });
      UI.toast('ТИХИЙ ДЕНЬ. НАЙДЕНЫ ОБЛОМКИ.');
    }
    S.save();
  };

  const beginFight = () => {
    const st = S.get(), c = st.combat; if (!c.enemy) return;
    UI.show('#encounterModal', false);
    Object.assign(c, { active: true, time: 0, enemyAtk: 1.5, cdDodge: 0, dodge: 0, lastTs: 0 });
    st.phase = 'БОЙ'; UI.show('#battleModal', true); tick(performance.now());
  };

  const finishFight = win => {
    const st = S.get(), c = st.combat; c.active = false; UI.show('#battleModal', false); st.phase = 'ИССЛЕДОВАНИЕ';
    let txt = win
      ? (() => { const r = { materials: 5 + Math.floor(rng() * 5), caps: 3 + Math.floor(rng() * 5) }; if (rng() < .3) r.food = 1; applyReward(r); return `ПОБЕДА. МАТЕРИАЛЫ +${r.materials}, КР +${r.caps}`; })()
      : (() => { st.player.mood = Math.max(0, st.player.mood - 15); return 'ВЫ СБЕЖАЛИ. РАССУДОК УПАЛ.'; })();
    UI.$('#rewardText').textContent = txt; UI.show('#rewardModal', true); S.save(); UI.renderTop(); UI.renderMain();
  };

  const tick = ts => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy; if (!c.active || !e || st.dead) return;
    const dt = Math.min(.08, (ts - (c.lastTs || ts)) / 1000 || .016);
    c.lastTs = ts; c.time += dt; c.enemyAtk -= dt;
    if (c.cdDodge > 0) c.cdDodge -= dt;
    if (c.dodge > 0) c.dodge -= dt;

    if (c.enemyAtk <= 0) {
      if (c.dodge > 0) { UI.toast('УКЛОНЕНИЕ!'); }
      else { p.hp -= e.dmg; p.mood = Math.max(0, p.mood - 1); UI.triggerDamage(); if (p.hp <= 0) { defeat(); return; } }
      c.enemyAtk = e.atk;
    }
    if (e.hp <= 0) return finishFight(true);
    UI.renderTop(); UI.renderBattle(); requestAnimationFrame(tick);
  };

  const actAttack = () => {
    const st = S.get(), c = st.combat, e = c.enemy; if (!c.active || !e) return;
    const isGun = st.player.isGun;
    if (isGun && st.resources.ammo < 1) return UI.toast('НЕТ ПАТРОНОВ! СМЕНИТЕ ОРУЖИЕ.');
    if (isGun) st.resources.ammo--;
    let dmg = totalDmg() + Math.floor(rng() * 4);
    if (rng() < 0.1) { dmg = Math.round(dmg * 1.5); UI.toast('КРИТ!'); }
    if (e.armor) dmg = Math.round(dmg * (1 - e.armor));
    e.hp -= Math.max(1, dmg);
    UI.triggerEnemyHit(); UI.renderTop(); UI.renderBattle();
  };

  const actDodge = () => { const c = S.get().combat; if (c.cdDodge > 0) return; c.dodge = 1.5; c.cdDodge = 5; UI.renderBattle(); };

  const actMed = () => {
    const st = S.get(); if (st.resources.medkits < 1) return UI.toast('НЕТ АПТЕЧЕК.');
    st.resources.medkits--;
    st.player.hp = Math.min(st.player.maxHp, st.player.hp + (st.player.healPower || 30));
    UI.toast(`+${st.player.healPower || 30} HP`); UI.renderTop(); UI.renderBattle();
  };

  /* ---------- СОБЫТИЯ ---------- */
  UI.$('#charBtn').onclick = startDay;
  UI.$('#merchantBtn').onclick = () => { renderMerchant(); UI.show('#merchantModal', true); };
  UI.$('#merchantClose').onclick = () => UI.show('#merchantModal', false);
  UI.$('#craftBtn').onclick = () => { renderCraft(); UI.show('#craftModal', true); };
  UI.$('#craftClose').onclick = () => UI.show('#craftModal', false);
  UI.$('#storyOk').onclick = () => UI.show('#storyModal', false);

  UI.$('#encounterYes').onclick = () => {
    const st = S.get(), enc = st.encounter; if (!enc) return;
    if (enc.type === 'enemy') { st.combat.enemy = enc.enemy; st.encounter = null; beginFight(); }
    else { applyReward(enc.location.reward); UI.toast(`ПОЛУЧЕНО: ${enc.location.name}`); st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain(); }
  };
  UI.$('#encounterNo').onclick = () => { const st = S.get(); st.player.mood = Math.max(0, st.player.mood - 5); st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain(); };

  UI.$('#atk').onclick = actAttack;
  UI.$('#dodge').onclick = actDodge;
  UI.$('#med').onclick = actMed;
  UI.$('#retreat').onclick = () => finishFight(false);
  UI.$('#rewardOk').onclick = () => { UI.show('#rewardModal', false); S.save(); UI.renderMain(); };
  UI.$('#newRun').onclick = () => { S.set(S.fresh()); UI.show('#defeatModal', false); UI.renderTop(); UI.renderMain(); S.save(); };
  UI.$('#loadRun').onclick = () => { if (S.load()) { UI.show('#defeatModal', false); UI.toast('ЗАГРУЖЕНО'); UI.renderTop(); UI.renderMain(); } };

  UI.$('#res').addEventListener('click', e => {
    const btn = e.target.closest('[data-use]'); if (!btn) return;
    const type = btn.dataset.use, st = S.get(), p = st.player;
    if (st.resources[type] < 1) return UI.toast('НЕТ ПРЕДМЕТА');
    st.resources[type]--;
    if (type === 'food') { p.hp = Math.min(p.maxHp, p.hp + 6); p.mood = Math.min(p.maxMood, p.mood + 10); UI.toast('+6 HP, +10 РАССУДОК'); }
    if (type === 'water') { p.hp = Math.min(p.maxHp, p.hp + 4); p.mood = Math.min(p.maxMood, p.mood + 15); UI.toast('+4 HP, +15 РАССУДОК'); }
    if (type === 'medkits') { const h = p.healPower || 30; p.hp = Math.min(p.maxHp, p.hp + h); UI.toast(`+${h} HP`); }
    S.save(); UI.renderTop(); UI.renderMain();
  });

  if (!S.load()) S.set(S.fresh());
  S.normalize(); UI.renderTop(); UI.renderMain(); renderMerchant(); renderCraft(); S.save();
})();
