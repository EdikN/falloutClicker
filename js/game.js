(() => {
  const D = window.GameData, S = window.GameState, UI = window.GameUI;
  const rng = () => Math.random();
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const totalDmg = () => S.get().player.baseDmg + S.get().player.dmgBonus;

  const weaponUnlock = id => {
    const st = S.get();
    if (st.weapons[id]) return UI.toast('ОРУЖИЕ УЖЕ ИМЕЕТСЯ.');
    st.weapons[id] = true;
    switchWeapon(id);
  };

  const switchWeapon = id => {
    const st = S.get(), p = st.player, w = D.WEAPON_STATS[id];
    if (!w || !st.weapons[id]) return;
    p.dmgBonus = w.dmg;
    p.weaponName = w.name;
    p.isGun = w.isGun;
    p.atkCdMax = w.cd;
    p.atkCd = 0;
    UI.toast(`ЭКИПИРОВАНО: ${w.name}`);
    UI.renderTop();
  };

  const switchArmor = id => {
    const st = S.get(), p = st.player, a = D.ARMOR_STATS[id];
    if (!a || !st.armors[id]) return;

    // Снимаем старые бонусы (если были)
    const oldA = Object.values(D.ARMOR_STATS).find(x => x.name === p.armorName);
    if (oldA) p.maxHp -= oldA.hp;

    p.armorName = a.name;
    p.armorClass = a.armorClass;
    p.maxHp += a.hp;
    p.hp = Math.min(p.maxHp, p.hp); // Не хилим просто так, но ограничиваем

    UI.toast(`ЭКИПИРОВАНА БРОНЯ: ${a.name}`);
    UI.renderTop();
    UI.renderMain();
  };

  const armorUnlock = id => {
    const st = S.get();
    st.armors[id] = true;
    switchArmor(id);
  };

  // --- НОВАЯ СИСТЕМА СМЕРТИ ---
  const defeat = (reason = "ПОТЕРЯ ЖИЗНЕННЫХ ПОКАЗАТЕЛЕЙ") => {
    const st = S.get();
    st.dead = true;
    st.combat.active = false;

    // Скрываем все игровые окна
    UI.show('#battleModal', false);
    UI.show('#encounterModal', false);
    UI.show('#storyModal', false);

    // Обновляем статистику экрана поражения
    const defeatDaysEl = UI.$('#defeatDays');
    const defeatReasonEl = UI.$('#defeatReason');
    const defeatMsgEl = UI.$('#defeatMsg');

    if (defeatDaysEl) defeatDaysEl.textContent = `ПРОЖИТО ЦИКЛОВ: ${st.day}`;
    if (defeatReasonEl) defeatReasonEl.textContent = `ПРИЧИНА СМЕРТИ: ${reason}`;

    const msgs = [
      "ОБЪЕКТ СПИСАН. ЗАГРУЗКА СЛЕДУЮЩЕГО.",
      "БИОМАТЕРИАЛ НЕПРИГОДЕН. УТИЛИЗАЦИЯ.",
      "ПОПЫТКА ПРОВАЛЕНА. ДАННЫЕ СОХРАНЕНЫ В АРХИВ.",
      "ВЫ БЫЛИ ТАК БЛИЗКО... ИЛИ НЕТ?",
      "СИСТЕМА: «СЛАБАЯ ОСОБЬ. ОЧИСТИТЬ СЕКТОР»."
    ];
    if (defeatMsgEl) defeatMsgEl.textContent = `"${pick(msgs)}"`;

    UI.renderMain();
    UI.renderTop();
    UI.show('#defeatModal', true);

    // ПЕРМАСМЕРТЬ: удаляем сохранение
    localStorage.removeItem(D.SAVE_KEY);
  };

  const typeText = (el, text, speed = 22) => {
    el.innerHTML = ''; let i = 0; const btn = UI.$('#storyOk'); btn.disabled = true;
    const t = () => { if (i < text.length) { el.innerHTML += text.charAt(i); i++; setTimeout(t, speed); } else btn.disabled = false; };
    t();
  };

  const checkStoryEvents = () => {
    const st = S.get();
    const event = D.STORY_EVENTS.find(e => e.day === st.day);
    if (!event) {
      if (st.day >= st.nextNoteDay) {
        UI.showDialogue({ speaker: 'АРХИВ', text: pick(D.NOTES) });
        st.nextNoteDay = st.day + 15 + Math.floor(rng() * 10);
        return true;
      }
      return false;
    }

    if (event.isBranching && event.id === 'bar_woman') {
      handleBarWoman(event);
    } else if (event.isCombat) {
      handleStoryCombat(event);
    } else {
      UI.showDialogue({ speaker: event.speaker, text: event.text, img: event.img });
    }
    return true;
  };

  const handleBarWoman = (event) => {
    const st = S.get();
    const negotiate = () => {
      if (rng() < 0.25) {
        UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Ладно, ты всегда умел заговорить зубы... Слушай, ты работал на Амазонка-Синт. Она тебя и прихлопнула. Ищи ее в секторе 7». ВЫ ПОЛУЧИЛИ ПОЛНУЮ ИНФОРМАЦИЮ И ЗАПАСЫ.', choices: [{ text: 'ПРИНЯТЬ', action: () => applyReward({ food: 5, water: 5, ammo: 10 }) }] });
      } else {
        UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Не пытайся меня обмануть! Либо плати, либо проваливай!»' });
      }
    };
    const pay = () => {
      if (st.resources.caps < 50) return UI.toast('НЕДОСТАТОЧНО КРЕДИТОВ (НУЖНО 50)');
      st.resources.caps -= 50;
      UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Хм, ну ладно. Ты был с Амазонка-Синт. Больше ничего не скажу». ВЫ ПОЛУЧИЛИ ЧАСТЬ ИНФОРМАЦИИ.' });
    };
    const fight = () => {
      const enemy = { name: 'Пьяный вышибала', hp: 40, dmg: 8, atk: 3.5, img: 'img/enemy_scavenger.png', icon: '[👊]' };
      st.combat.enemy = { ...enemy, maxHp: 40 };
      st.combat.onWin = () => {
        UI.showDialogue({ speaker: event.speaker, img: event.img, text: '«Хорошо, хорошо! Ты победил! Ты был связан с Амазонка-Синт. Она где-то в лабораториях на севере». ВЫ ПОЛУЧИЛИ 50% ИНФОРМАЦИИ.' });
      };
      beginFight();
    };

    UI.showDialogue({
      speaker: event.speaker,
      img: event.img,
      text: event.text,
      choices: [
        { text: 'ДОГОВОРИТЬСЯ (25%)', action: negotiate },
        { text: 'ЗАПЛАТИТЬ 50 КР', action: pay },
        { text: 'УГРОЖАТЬ (БОЙ)', action: fight }
      ]
    });
  };

  const handleStoryCombat = (event) => {
    const st = S.get();
    const enemyData = D.STORY_ENEMIES[event.enemyId];
    st.combat.enemy = { ...enemyData, maxHp: enemyData.hp };

    // Специальная логика для Амазонки (оставить в живых)
    if (event.enemyId === 'amazon_weak') {
      st.combat.onWin = () => {
        UI.showDialogue({ speaker: 'АМАЗОНКА-СИНТ', img: event.img, text: '«Кхм... Живучий ублюдок... Я еще вернусь...» ОНА СБЕГАЕТ, ОСТАВИВ ПРИПАСЫ.', choices: [{ text: 'ПОПРОЩАТЬСЯ', action: () => applyReward({ medkits: 2, ammo: 20 }) }] });
      };
    } else if (event.enemyId === 'amazon_full') {
      st.combat.onWin = () => {
        UI.showDialogue({ speaker: 'СИСТЕМА', img: event.img, text: 'ПОСЛЕ ПОБЕДЫ ВЫ НАХОДИТЕ В КОМПЬЮТЕРЕ ИНФОРМАЦИЮ О ПЕРЕМЕЩЕНИИ ЛЮДЕЙ В ГЛАВНУЮ ЛАБОРАТОРИЮ. ПУТЬ СВОБОДЕН.' });
      };
    } else if (event.enemyId === 'boss_technician') {
      st.combat.onWin = () => {
        UI.showDialogue({ speaker: 'ФИНАЛ', img: event.img, text: 'ТЕХНИК ПОВЕРЖЕН. СИСТЕМА ИЕРИХОН ДЕСТАБИЛИЗИРОВАНА. ВЫ СВОБОДНЫ... ИЛИ ЭТО ЛИШЬ НАЧАЛО НОВОГО ЦИКЛА?' });
      };
    }

    UI.showDialogue({
      speaker: event.speaker,
      img: event.img,
      text: event.text,
      choices: [{ text: 'В БОЙ', action: beginFight }]
    });
  };

  const newEnemy = elite => {
    const st = S.get(), base = pick(elite ? D.ELITE_ENEMIES : D.ENEMIES);
    // Прогрессирующая сложность: экспоненциальный рост каждые 10 дней
    const scale = elite
      ? (1 + Math.pow(st.day / 12, 1.25))
      : (1 + Math.pow(st.day / 15, 1.15));
    const maxHp = Math.round(base.hp * scale);
    const dmg = Math.round(base.dmg * scale);
    return { ...base, elite, maxHp, hp: maxHp, dmg, threat: Math.round(maxHp / 8 + dmg * 1.5) };
  };

  const upkeep = () => {
    const st = S.get(), p = st.player;
    st.resources.food = Math.max(0, st.resources.food - 2);
    st.resources.water = Math.max(0, st.resources.water - 2);

    if (st.resources.food === 0) {
      p.hp -= 5; p.mood -= 5; UI.toast('ГОЛОД: -5 HP'); UI.triggerDamage();
      if (p.hp <= 0) { defeat("КРИТИЧЕСКОЕ ИСТОЩЕНИЕ"); return; }
    }

    if (st.resources.water === 0) {
      p.hp -= 8; p.mood -= 8; UI.toast('ЖАЖДА: -8 HP'); UI.triggerDamage();
      if (p.hp <= 0) { defeat("ОБЕЗВОЖИВАНИЕ"); return; }
    }

    p.mood = Math.max(0, p.mood - 1);
    if (p.mood < 20) {
      p.hp -= 2; UI.triggerDamage();
      if (p.hp <= 0) { defeat("ОСТРЫЙ ПСИХОЗ"); return; }
    }
  };

  const encounterRoll = () => {
    const st = S.get();
    const enemyChance = Math.min(.55, .20 + st.day * 0.005), roll = rng();
    if (roll < enemyChance) return { type: 'enemy', enemy: newEnemy(st.day > 10 && rng() < 0.2) };
    if (roll < enemyChance + 0.20) return { type: 'location', location: pick(D.LOCATIONS) };
    return { type: 'calm' };
  };

  const applyReward = r => {
    const st = S.get();
    Object.entries(r).forEach(([k, v]) => st.resources[k] = (st.resources[k] || 0) + v);
    UI.renderTop(); UI.renderMain();
  };

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
      if (rec.armorId) armorUnlock(rec.armorId); // Для брони
      if (rec.hpBoost) { st.player.maxHp += rec.hpBoost; st.player.hp = Math.min(st.player.maxHp, st.player.hp + rec.hpBoost); }
      if (rec.healBoost) st.player.healPower = (st.player.healPower || 30) + rec.healBoost;
      UI.toast(`СОЗДАНО: ${rec.label}`); S.save(); UI.renderTop(); UI.renderMain(); renderCraft();
    });
  };

  const startDay = () => {
    const st = S.get(); if (st.combat.active || st.dead) return;

    // Счётчик дней
    if (st.day === 1 && !st.initialized) {
      st.initialized = true;
      checkStoryEvents();
      UI.renderTop(); UI.renderMain();
      return;
    }

    st.day++; st.phase = 'ИССЛЕДОВАНИЕ'; upkeep();
    window.SoundManager.play('click');
    if (st.player.hp <= 0) return; // Убит при upkeep

    UI.renderTop(); UI.renderMain();
    if (checkStoryEvents()) return; // Если сюжетка — не запускаем обычный энкаунтер в этот день

    const event = encounterRoll();
    if (event.type === 'enemy') {
      st.encounter = event;
      const threat = event.enemy.threat;
      const threatLabel = threat < 25 ? '🟢 СЛАБЫЙ' : threat < 60 ? '🟡 СРЕДНИЙ' : threat < 120 ? '🟠 ОПАСНЫЙ' : '🔴 СМЕРТЕЛЬНЫЙ';
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
    st.phase = 'БОЙ'; UI.show('#battleModal', true);
    window.SoundManager.play('success');
    tick(performance.now());
  };

  const finishFight = win => {
    const st = S.get(), c = st.combat; c.active = false; UI.show('#battleModal', false); st.phase = 'ИССЛЕДОВАНИЕ';

    if (win) {
      window.SoundManager.play('success');
      if (c.onWin) { const cb = c.onWin; delete c.onWin; cb(); return; }
    } else {
      window.SoundManager.play('error');
    }

    let txt = win
      ? (() => {
        const baseCaps = Math.round(c.enemy.threat * 0.8) + Math.floor(rng() * 5);
        const r = { materials: 3 + Math.floor(rng() * 5), caps: Math.max(10, baseCaps) };
        if (rng() < .3) r.food = 1;
        applyReward(r);
        return `ПОБЕДА. МАТЕРИАЛЫ +${r.materials}, КР +${r.caps}`;
      })()
      : (() => { st.player.mood = Math.max(0, st.player.mood - 15); return 'ВЫ СБЕЖАЛИ. РАССУДОК УПАЛ.'; })();
    UI.$('#rewardText').textContent = txt; UI.show('#rewardModal', true); S.save(); UI.renderTop(); UI.renderMain();
  };

  const tick = ts => {
    const st = S.get(), c = st.combat, p = st.player, e = c.enemy; if (!c.active || !e || st.dead) return;
    const dt = Math.min(.08, (ts - (c.lastTs || ts)) / 1000 || .016);
    // Игрок: откат атаки
    if (st.player.atkCd > 0) st.player.atkCd = Math.max(0, st.player.atkCd - dt);

    // Враг: таймер атаки
    c.lastTs = ts; c.time += dt; c.enemyAtk -= dt;
    if (c.cdDodge > 0) c.cdDodge -= dt;
    if (c.dodge > 0) c.dodge -= dt;

    if (c.enemyAtk <= 0) {
      if (c.dodge > 0) { UI.toast('УКЛОНЕНИЕ!'); }
      else {
        let dmg = e.dmg;
        if (p.armorClass) dmg = Math.round(dmg * (1 - p.armorClass));
        p.hp -= Math.max(1, dmg);
        p.mood = Math.max(0, p.mood - 1); UI.triggerDamage();
        if (p.hp <= 0) { defeat(`УБИТ: ${e.name.toUpperCase()}`); return; }
      }
      c.enemyAtk = e.atk;
    }
    if (e.hp <= 0) return finishFight(true);
    UI.renderTop(); UI.renderBattle(); requestAnimationFrame(tick);
  };

  const actAttack = () => {
    const st = S.get(), c = st.combat, p = st.player;
    if (!c.active || p.hp <= 0 || p.atkCd > 0) return;

    const isGun = p.isGun;
    if (isGun && st.resources.ammo <= 0) return UI.toast('НЕТ ПАТРОНОВ!');

    p.atkCd = p.atkCdMax || 1; // Сброс КД (минимум 1 сек если не задано)
    if (isGun) { st.resources.ammo--; window.SoundManager.play('shoot'); }
    else { window.SoundManager.play('punch'); }

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

  /* ---------- ПРИВЯЗКА СОБЫТИЙ ---------- */
  UI.$('#charBtn').onclick = startDay;
  UI.$('#merchantBtn').onclick = () => { renderMerchant(); UI.show('#merchantModal', true); };
  UI.$('#merchantClose').onclick = () => UI.show('#merchantModal', false);
  UI.$('#equipBtn').onclick = () => { UI.renderEquipment(switchWeapon, switchArmor); UI.show('#equipModal', true); };
  UI.$('#equipClose').onclick = () => UI.show('#equipModal', false);
  UI.$('#craftBtn').onclick = () => { renderCraft(); UI.show('#craftModal', true); };
  UI.$('#craftClose').onclick = () => UI.show('#craftModal', false);
  UI.$('#storyOk').onclick = () => UI.show('#storyModal', false);

  UI.$('#encounterYes').onclick = () => {
    const st = S.get(), enc = st.encounter; if (!enc) return;
    if (enc.type === 'enemy') { st.combat.enemy = enc.enemy; st.encounter = null; beginFight(); }
    else { applyReward(enc.location.reward); UI.toast(`ПОЛУЧЕНО: ${enc.location.name}`); st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain(); }
  };

  UI.$('#encounterNo').onclick = () => {
    const st = S.get(); st.player.mood = Math.max(0, st.player.mood - 5); st.encounter = null; UI.show('#encounterModal', false); S.save(); UI.renderTop(); UI.renderMain();
  };

  UI.$('#atk').onclick = actAttack;
  UI.$('#dodge').onclick = actDodge;
  UI.$('#med').onclick = actMed;
  UI.$('#retreat').onclick = () => finishFight(false);
  UI.$('#rewardOk').onclick = () => { UI.show('#rewardModal', false); S.save(); UI.renderMain(); };

  // Кнопка рестарта после поражения
  UI.$('#newRun').onclick = () => {
    window.SoundManager.play('click');
    S.set(S.fresh());
    UI.show('#defeatModal', false);
    UI.renderTop(); UI.renderMain();
    S.save();
    UI.toast('НОВЫЙ ЦИКЛ ИНИЦИАЛИЗИРОВАН');
  };

  UI.$('#res').addEventListener('click', e => {
    const btn = e.target.closest('[data-use]'); if (!btn) return;
    const type = btn.dataset.use, st = S.get(), p = st.player;
    if (st.resources[type] < 1) { window.SoundManager.play('error'); return UI.toast('НЕТ ПРЕДМЕТА'); }
    st.resources[type]--;
    window.SoundManager.play('heal');
    if (type === 'food') { p.hp = Math.min(p.maxHp, p.hp + 6); p.mood = Math.min(p.maxMood, p.mood + 10); UI.toast('+6 HP, +10 РАССУДОК'); }
    if (type === 'water') { p.hp = Math.min(p.maxHp, p.hp + 4); p.mood = Math.min(p.maxMood, p.mood + 15); UI.toast('+4 HP, +15 РАССУДОК'); }
    if (type === 'medkits') { const h = p.healPower || 30; p.hp = Math.min(p.maxHp, p.hp + h); UI.toast(`+${h} HP`); }
    S.save(); UI.renderTop(); UI.renderMain();
  });

  UI.$('#muteBtn').onclick = () => {
    window.SoundManager.toggle(!window.SoundManager.isEnabled());
    UI.$('#muteBtn').textContent = window.SoundManager.isEnabled() ? '🔊 ЗВУК' : '🔇 ТИШИНА';
  };

  // Запуск
  if (!S.load()) S.set(S.fresh());
  S.normalize(); UI.renderTop(); UI.renderMain(); renderMerchant(); renderCraft(); S.save();

  // При первом запуске или загрузке проверяем день 1
  if (S.get().day === 1 && !S.get().initialized) {
    checkStoryEvents();
    S.get().initialized = true;
    S.save();
  };

  // Экспорт для диалогов из data.js
  window.Game = { applyReward, switchWeapon, switchArmor, weaponUnlock, armorUnlock };
})();
