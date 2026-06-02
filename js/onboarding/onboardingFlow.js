// === ОНБОРДИНГ-ФЛОУ ===
// Пошаговое обучение, встроенное в лор (plan.md §7). Проходится один раз за игрока:
// факт прохождения хранится в metaState.onboardingDone (переживает циклы и смерти).
import { GameState } from '../state.js';
import { translate, loc } from '../locales.js';
import { EventEmitter as Events, GameEvents } from '../events.js';
import { Highlights } from '../ui/highlights.js';
import { TUTORIAL_STEPS } from './tutorialSteps.js';

export const OnboardingFlow = (() => {
  let idx = 0;
  let active = false;
  let dayHandler = null;

  const clearDayHandler = () => {
    if (dayHandler) { Events.off(GameEvents.DAY_PASSED, dayHandler); dayHandler = null; }
  };

  const finish = () => {
    active = false;
    clearDayHandler();
    Highlights.hide();
    const meta = GameState.getMeta();
    meta.onboardingDone = true;
    GameState.save();
    Events.emit(GameEvents.TUTORIAL_STEP_CHANGED, { step: 'done' });
  };

  // Ждём, пока экран освободится от модалок (диалоги, авторизация и т.п.),
  // чтобы подсветка онбординга не накладывалась на стартовый сюжетный диалог.
  const whenClear = (cb) => {
    if (!active) return;
    if (document.querySelector('.overlay.show')) {
      setTimeout(() => whenClear(cb), 400);
      return;
    }
    cb();
  };

  const showStep = (i) => {
    const step = TUTORIAL_STEPS[i];
    if (!step) return finish();
    idx = i;
    Events.emit(GameEvents.TUTORIAL_STEP_CHANGED, { step: step.id, target: step.target });

    if (step.advanceOn === 'dayPassed') {
      // Ждём первого прожитого дня — кнопку не показываем
      Highlights.show({ target: step.target, text: loc(step, 'text'), showButton: false });
      clearDayHandler();
      dayHandler = () => { clearDayHandler(); next(); };
      Events.on(GameEvents.DAY_PASSED, dayHandler);
    } else {
      Highlights.show({
        target: step.target, text: loc(step, 'text'),
        buttonText: i === TUTORIAL_STEPS.length - 1 ? translate('btn_continue') : translate('ob_next'),
        onNext: next
      });
    }
  };

  const next = () => {
    if (!active) return;
    if (idx + 1 >= TUTORIAL_STEPS.length) return finish();
    // Небольшая пауза + ожидание чистого экрана, чтобы не перекрывать диалоги/тосты дня
    setTimeout(() => whenClear(() => showStep(idx + 1)), 400);
  };

  const start = () => {
    if (GameState.getMeta().onboardingDone) return;
    active = true;
    // Стартуем только после закрытия стартового диалога «Пробуждение» (день 1)
    whenClear(() => showStep(0));
  };

  return { start, finish };
})();
