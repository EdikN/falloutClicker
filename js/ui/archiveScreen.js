// === ЭКРАН АРХИВА (метапрогрессия) ===
// Вкладки: дерево улучшений, журнал прошлых клонов, секретные записи (plan.md §5.2.3, §5.4).
// Самоинициализирующийся модуль: импортируется в main.js, привязывается к #archiveModal.
import { GameState } from '../state.js';
import { GameData } from '../data.js';
import { SoundManager } from '../audio.js';
import { translate, loc } from '../locales.js';
import { EventEmitter as Events } from '../events.js';
import { ArchiveTree } from '../meta/archiveTree.js';

export const ArchiveScreen = (() => {
  const $ = sel => document.querySelector(sel);
  let openedFromDefeat = false;
  let activeTab = 'upgrades';

  const renderBalances = () => {
    const m = GameState.getMeta();
    const el = $('#archiveBalances');
    if (!el) return;
    el.innerHTML = `
      <div class='pill'>🧠 ${translate('meta_memory_points')}: ${m.memoryPoints || 0}</div>
      <div class='pill'>🧬 ${translate('meta_dna_fragments')}: ${m.dnaFragments || 0}</div>
      <div class='pill'>🔑 ${translate('meta_keys')}: ${m.archiveKeys || 0}</div>
      <div class='pill'>♻️ ${translate('meta_cycles')}: ${m.totalCycles || 0}</div>
      <div class='pill'>🏁 ${translate('meta_best_day')}: ${m.bestDay || 0}</div>`;
  };

  // --- Вкладка: дерево улучшений ---
  const renderTree = (cont) => {
    GameData.META_BRANCHES.forEach(branch => {
      const section = document.createElement('div');
      section.className = 'archive-branch';
      const title = document.createElement('h3');
      title.className = 'archive-branch-title';
      title.textContent = `${branch.icon} ${loc(branch, 'name')}`;
      section.appendChild(title);

      GameData.META_TREE.filter(n => n.branch === branch.id).forEach(node => {
        const lvl = ArchiveTree.level(node.id);
        const cost = ArchiveTree.costFor(node);
        const maxed = cost === null;
        const reqMet = ArchiveTree.requirementsMet(node);
        const affordable = ArchiveTree.canBuy(node.id);
        const costLabel = node.costType === 'dna' ? `🧬 ${cost}` : `🧠 ${cost}`;

        let btnLabel, btnDisabled;
        if (maxed) { btnLabel = translate('meta_maxed'); btnDisabled = true; }
        else if (!reqMet) { btnLabel = translate('meta_locked'); btnDisabled = true; }
        else { btnLabel = `${translate('meta_buy')} (${costLabel})`; btnDisabled = !affordable; }

        const row = document.createElement('div');
        row.className = 'shopItem archive-node' + (maxed ? ' archive-node-maxed' : '') + (!reqMet ? ' archive-node-locked' : '');
        row.innerHTML = `
          <div>
            <div>${node.icon} ${loc(node, 'name')} <span class='archive-lvl'>[${lvl}/${node.maxLevel}]</span></div>
            <div class='sub'>${loc(node, 'desc')}</div>
          </div>
          <button class='btn ${btnDisabled ? '' : 'good'}' data-buy='${node.id}' ${btnDisabled ? 'disabled' : ''}>${btnLabel}</button>`;

        const btn = row.querySelector('[data-buy]');
        if (btn && !btnDisabled) {
          btn.onclick = () => {
            if (ArchiveTree.buy(node.id)) {
              SoundManager.play('success');
              Events.emit('ui:toast', translate('meta_purchased', loc(node, 'name')));
              render();
            } else { SoundManager.play('error'); }
          };
        }
        section.appendChild(row);
      });
      cont.appendChild(section);
    });
  };

  // --- Вкладка: журнал клонов ---
  const renderLog = (cont) => {
    const log = GameState.getMeta().cloneLog || [];
    if (!log.length) {
      cont.innerHTML = `<div class='sub'>${translate('archive_log_empty')}</div>`;
      return;
    }
    // Свежие сверху
    [...log].reverse().forEach(e => {
      const row = document.createElement('div');
      row.className = 'shopItem archive-log-entry';
      row.innerHTML = `
        <div>
          <div>${translate('archive_clone_n', e.cycle)} <span class='archive-lvl'>${translate('day_label', e.day)}</span></div>
          <div class='sub'>${e.reason || ''}</div>
          <div class='sub'>${translate('archive_log_stats', e.kills || 0, e.humanity ?? 0)}</div>
        </div>`;
      cont.appendChild(row);
    });
  };

  // --- Вкладка: секретные записи ---
  const renderRecords = (cont) => {
    const meta = GameState.getMeta();
    const unlocked = meta.unlockedRecords || {};
    (GameData.ARCHIVE_RECORDS || []).forEach(rec => {
      const isOpen = !!unlocked[rec.id];
      const canPay = (meta.archiveKeys || 0) >= (rec.cost || 1);
      const row = document.createElement('div');
      row.className = 'shopItem archive-record' + (isOpen ? ' archive-record-open' : '');
      if (isOpen) {
        row.innerHTML = `
          <div>
            <div>🔓 ${loc(rec, 'title')}</div>
            <div class='sub archive-record-text'>${loc(rec, 'text')}</div>
          </div>`;
      } else {
        row.innerHTML = `
          <div><div>🔒 ${loc(rec, 'title')}</div></div>
          <button class='btn ${canPay ? 'good' : ''}' data-unlock='${rec.id}' ${canPay ? '' : 'disabled'}>${translate('meta_unlock')} (🔑 ${rec.cost || 1})</button>`;
        const btn = row.querySelector('[data-unlock]');
        if (btn && canPay) {
          btn.onclick = () => {
            if (unlockRecord(rec.id)) {
              SoundManager.play('success');
              Events.emit('ui:toast', translate('meta_record_unlocked'));
              render();
            } else { SoundManager.play('error'); }
          };
        }
      }
      cont.appendChild(row);
    });
  };

  const unlockRecord = (id) => {
    const meta = GameState.getMeta();
    const rec = (GameData.ARCHIVE_RECORDS || []).find(r => r.id === id);
    if (!rec) return false;
    const cost = rec.cost || 1;
    if (!meta.unlockedRecords) meta.unlockedRecords = {};
    if (meta.unlockedRecords[id]) return false;
    if ((meta.archiveKeys || 0) < cost) return false;
    meta.archiveKeys -= cost;
    meta.unlockedRecords[id] = true;
    GameState.save();
    return true;
  };

  // --- Вкладка: донат-паки (IAP) ---
  let catalogCache = null;
  const renderStore = (cont) => {
    const sdk = window.PlaygamaSDK;
    if (!sdk || !sdk.isPaymentsSupported || !sdk.isPaymentsSupported()) {
      cont.innerHTML = `<div class='sub'>${translate('store_unavailable')}</div>`;
      return;
    }
    const platform = sdk.getPlatformId ? sdk.getPlatformId() : '';
    const priceFor = (sku) => {
      const c = catalogCache && catalogCache.find(x => x.id === sku.id);
      if (!c) return sku.fallback;
      if (c.price != null) return (platform === 'vk' || platform === 'ok') ? `${c.price} ${translate('vk_currency')}` : c.price;
      if (c.priceValue) return `${c.priceValue} ${c.priceCurrencyCode || ''}`.trim();
      return sku.fallback;
    };

    (GameData.META_SHOP || []).forEach(sku => {
      const row = document.createElement('div');
      row.className = 'shopItem';
      row.innerHTML = `
        <div style="display:flex; gap:0.4rem; align-items:center;">
          <img src="img/payments/${sku.icon}" style="width:2.5em; height:2.5em; object-fit:contain;" alt="">
          <div>${loc(sku, 'name')}<div class="sub">${loc(sku, 'desc')}</div></div>
        </div>
        <button class="btn good" data-store='${sku.id}' style="min-width:80px;">${priceFor(sku)}</button>`;
      const btn = row.querySelector('[data-store]');
      btn.onclick = () => {
        if (window.Game && window.Game.purchaseProduct) {
          window.Game.purchaseProduct(sku.id, () => render());
        }
      };
      cont.appendChild(row);
    });

    // Подгружаем реальные цены каталога и перерисовываем (один раз)
    if (!catalogCache && sdk.getCatalog) {
      sdk.getCatalog().then(items => { catalogCache = items || []; if (activeTab === 'store') renderContent(); });
    }
  };

  const renderContent = () => {
    const cont = $('#archiveContent');
    if (!cont) return;
    cont.innerHTML = '';
    if (activeTab === 'log') renderLog(cont);
    else if (activeTab === 'records') renderRecords(cont);
    else if (activeTab === 'store') renderStore(cont);
    else renderTree(cont);
  };

  const syncTabs = () => {
    document.querySelectorAll('[data-archive-tab]').forEach(t => {
      t.classList.toggle('active', t.dataset.archiveTab === activeTab);
    });
  };

  const render = () => { renderBalances(); syncTabs(); renderContent(); };

  const open = (fromDefeat = false) => {
    openedFromDefeat = fromDefeat;
    activeTab = 'upgrades';
    render();
    const cycleBtn = $('#archiveCycleBtn');
    if (cycleBtn) cycleBtn.textContent = fromDefeat ? translate('btn_new_cycle') : translate('btn_close');
    Events.emit('ui:show', { id: '#archiveModal', on: true });
  };

  // --- Привязка кнопок (DOM уже распаршен к моменту импорта модуля) ---
  document.querySelectorAll('[data-archive-tab]').forEach(tab => {
    tab.onclick = () => { SoundManager.play('click'); activeTab = tab.dataset.archiveTab; render(); };
  });

  const cycleBtn = $('#archiveCycleBtn');
  if (cycleBtn) {
    cycleBtn.onclick = () => {
      SoundManager.play('click');
      if (openedFromDefeat) Events.emit('ui:startNewCycle');
      else Events.emit('ui:show', { id: '#archiveModal', on: false });
    };
  }

  Events.on('ui:openArchive', (data) => open(data && data.fromDefeat));

  return { open, render };
})();
