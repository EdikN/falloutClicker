// === ЭКРАН АРХИВА (метапрогрессия) ===
// Рендер дерева постоянных улучшений и обработка покупок (plan.md §5.4 этап C).
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

  const renderBalances = () => {
    const m = GameState.getMeta();
    const el = $('#archiveBalances');
    if (!el) return;
    el.innerHTML = `
      <div class='pill'>🧠 ${translate('meta_memory_points')}: ${m.memoryPoints || 0}</div>
      <div class='pill'>🧬 ${translate('meta_dna_fragments')}: ${m.dnaFragments || 0}</div>
      <div class='pill'>♻️ ${translate('meta_cycles')}: ${m.totalCycles || 0}</div>
      <div class='pill'>🏁 ${translate('meta_best_day')}: ${m.bestDay || 0}</div>`;
  };

  const renderTree = () => {
    const cont = $('#archiveTree');
    if (!cont) return;
    cont.innerHTML = '';

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

        const costLabel = node.costType === 'dna'
          ? `🧬 ${cost}` : `🧠 ${cost}`;

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
            } else {
              SoundManager.play('error');
            }
          };
        }
        section.appendChild(row);
      });
      cont.appendChild(section);
    });
  };

  const render = () => { renderBalances(); renderTree(); };

  const open = (fromDefeat = false) => {
    openedFromDefeat = fromDefeat;
    render();
    const cycleBtn = $('#archiveCycleBtn');
    if (cycleBtn) {
      cycleBtn.textContent = fromDefeat ? translate('btn_new_cycle') : translate('btn_close');
    }
    Events.emit('ui:show', { id: '#archiveModal', on: true });
  };

  // Привязка кнопок (DOM уже распаршен к моменту импорта модуля).
  const cycleBtn = $('#archiveCycleBtn');
  if (cycleBtn) {
    cycleBtn.onclick = () => {
      SoundManager.play('click');
      if (openedFromDefeat) {
        Events.emit('ui:startNewCycle');
      } else {
        Events.emit('ui:show', { id: '#archiveModal', on: false });
      }
    };
  }

  Events.on('ui:openArchive', (data) => open(data && data.fromDefeat));

  return { open, render };
})();
