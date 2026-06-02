// === ЛОГИКА ДЕРЕВА АРХИВА (покупка узлов) ===
// Тонкий слой над metaState.upgrades: проверка доступности и покупка узлов
// за очки памяти / ДНК-фрагменты (plan.md §5.3).
import { GameState } from '../state.js';
import { META_TREE, nodeCost } from '../data/metaTree.js';

const getMeta = () => GameState.getMeta();
const findNode = (id) => META_TREE.find(n => n.id === id);

export const ArchiveTree = {
  nodes: () => META_TREE,
  findNode,

  level: (id) => {
    const m = getMeta();
    return (m.upgrades && m.upgrades[id]) || 0;
  },

  balance: (costType) => {
    const m = getMeta();
    return costType === 'dna' ? (m.dnaFragments || 0) : (m.memoryPoints || 0);
  },

  // Стоимость следующего уровня узла (или null, если максимум достигнут).
  costFor: (node) => {
    const lvl = ArchiveTree.level(node.id);
    if (lvl >= node.maxLevel) return null;
    return nodeCost(node, lvl);
  },

  requirementsMet: (node) =>
    (node.requires || []).every(reqId => ArchiveTree.level(reqId) > 0),

  // Можно ли купить следующий уровень: есть узел, не максимум, выполнены требования, хватает валюты.
  canBuy: (id) => {
    const node = findNode(id);
    if (!node) return false;
    const cost = ArchiveTree.costFor(node);
    if (cost === null) return false;
    if (!ArchiveTree.requirementsMet(node)) return false;
    return ArchiveTree.balance(node.costType) >= cost;
  },

  // Покупка следующего уровня. Возвращает true при успехе.
  buy: (id) => {
    const node = findNode(id);
    if (!node || !ArchiveTree.canBuy(id)) return false;
    const cost = ArchiveTree.costFor(node);
    const m = getMeta();
    if (!m.upgrades) m.upgrades = {};
    if (node.costType === 'dna') m.dnaFragments -= cost;
    else m.memoryPoints -= cost;
    m.upgrades[id] = (m.upgrades[id] || 0) + 1;
    GameState.save();
    return true;
  }
};
