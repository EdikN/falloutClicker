// === НАЧИСЛЕНИЕ МЕТА-ВАЛЮТЫ ===
// Считает очки памяти и ДНК-фрагменты, заработанные за завершённый забег,
// и зачисляет их в metaState (plan.md §5.2). Вызывается из defeat() ДО сброса state.
import { META_BALANCE } from '../config/metaBalance.js';

// Дефолтная форма мета-состояния (используется state.js для нормализации старых сейвов).
export const freshMeta = () => ({
  deaths: 0,
  corpse: null,
  memoryPoints: 0,
  dnaFragments: 0,
  archiveKeys: 0,
  upgrades: {},          // { nodeId: level }
  totalCycles: 0,
  bestDay: 0,
  onboardingDone: false,
  cloneLog: [],          // журнал прошлых клонов (последние записи)
  lastHumanity: 0,       // финальная человечность последнего клона (для hum_carryover)
  unlockedRecords: {}    // { recordId: true } — открытые секретные записи
});

// Подсчёт награды за забег. runStats — это state.stats + контекст ({ day, humanity }).
// meta — текущий metaState (для пассивных узлов, напр. mem_archive_access).
// Возвращает { memoryPoints, dnaFragments } — сколько начислено (для экрана итогов).
export const computeReward = (ctx, meta) => {
  const m = META_BALANCE.memory;
  const d = META_BALANCE.dna;
  const kills = ctx.kills || 0;
  const storyChoices = ctx.storyChoices || 0;
  const eliteKills = ctx.eliteKills || 0;
  const day = ctx.day || 1;

  const memoryPoints = Math.round(
    m.base + day * m.perDay + kills * m.perKill +
    storyChoices * m.perStoryChoice + eliteKills * m.perElite
  );

  let dnaFragments = eliteKills * d.perElite;
  if (day >= d.survivalThreshold) dnaFragments += d.survivalBonus;
  // Пассивный узел «Доступ к архиву»: +1 ДНК за цикл.
  if (meta && meta.upgrades && meta.upgrades.mem_archive_access > 0) dnaFragments += 1;

  return { memoryPoints, dnaFragments };
};

// Начисляет награду в meta и обновляет статистику циклов. Возвращает начисленное
// (включая archiveKeys, если в этом забеге побит рекорд по дню).
export const awardOnDeath = (ctx, meta) => {
  const earned = computeReward(ctx, meta);

  // Архивный ключ за новый рекорд по прожитым дням (считаем ДО обновления bestDay)
  const newRecord = (ctx.day || 0) > (meta.bestDay || 0);
  earned.archiveKeys = newRecord ? META_BALANCE.keys.perRecord : 0;

  meta.memoryPoints = (meta.memoryPoints || 0) + earned.memoryPoints;
  meta.dnaFragments = (meta.dnaFragments || 0) + earned.dnaFragments;
  meta.archiveKeys = (meta.archiveKeys || 0) + earned.archiveKeys;
  meta.totalCycles = (meta.totalCycles || 0) + 1;
  meta.bestDay = Math.max(meta.bestDay || 0, ctx.day || 0);
  meta.lastHumanity = ctx.humanity || 0;
  return earned;
};
