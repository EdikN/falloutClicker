// === ПРИМЕНЕНИЕ МЕТА-БОНУСОВ К НОВОМУ КЛОНУ ===
// Читает купленные узлы из metaState.upgrades и патчит свежее состояние нового цикла
// (plan.md §5.4 этап D). Вызывается РОВНО ОДИН РАЗ на каждое созданное fresh-состояние.
import { META_TREE } from '../data/metaTree.js';

// fresh — только что созданное GameState.fresh(); meta — metaState.
export const applyMetaBonuses = (fresh, meta) => {
  if (!fresh || !meta || !meta.upgrades) return fresh;

  // Множители-аккумуляторы (потребляются game.js: upkeep / награды).
  fresh.meta_upkeepMult = 1;
  fresh.meta_lootMult = 1;

  META_TREE.forEach(node => {
    const level = meta.upgrades[node.id] || 0;
    if (level > 0 && typeof node.apply === 'function') {
      node.apply(fresh, level);
    }
  });

  // Если открыто стартовое оружие — экипируем его в новом цикле.
  if (fresh.meta_startWeapon && fresh.weapons[fresh.meta_startWeapon]) {
    fresh._equipStartWeapon = fresh.meta_startWeapon;
  }

  return fresh;
};
