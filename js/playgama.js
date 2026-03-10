export const PlaygamaSDK = (() => {
  // Минимальный интервал между интерстишалами (секунды)
  const AD_COOLDOWN_SEC = 180;
  let lastAdTime = 0;
  let bridgeReady = false;

  // --- Прогресс загрузки ---
  const setSplash = (pct) => {
    if (window.Splash) window.Splash.setProgress(pct);
  };
  const hideSplash = () => {
    if (window.Splash) {
      window.Splash.setProgress(100);
      setTimeout(() => window.Splash.hide(), 400);
    }
  };

  // --- Сохранение ---
  const save = (data) => {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    // Всегда сохраняем в localStorage как fallback
    try { localStorage.setItem('fallout_save', json); } catch (_) { }

    // Playgama storage (async, не блокируем)
    if (bridgeReady && window.bridge) {
      try {
        window.bridge.storage.set('fallout_save', json).catch(() => { });
      } catch (_) { }
    }
  };

  // --- Загрузка ---
  const load = (callback) => {
    if (bridgeReady && window.bridge) {
      window.bridge.storage.get('fallout_save')
        .then(data => {
          if (data) {
            // Обновляем и localStorage тоже
            try { localStorage.setItem('fallout_save', data); } catch (_) { }
            callback(data);
          } else {
            // Fallback на localStorage
            callback(localStorage.getItem('fallout_save') || null);
          }
        })
        .catch(() => {
          callback(localStorage.getItem('fallout_save') || null);
        });
    } else {
      callback(localStorage.getItem('fallout_save') || null);
    }
  };

  // --- Реклама ---
  const showInterstitial = () => {
    if (!bridgeReady || !window.bridge) return;
    const now = Date.now() / 1000;
    if (now - lastAdTime < AD_COOLDOWN_SEC) return;
    lastAdTime = now;
    try {
      window.bridge.advertisement.showInterstitial();
    } catch (_) { }
  };

  // --- Инициализация ---
  const init = () => {
    setSplash(10);

    if (!window.bridge) {
      console.warn('[PlaygamaSDK] bridge не найден — работаем в автономном режиме.');
      hideSplash();
      return Promise.resolve();
    }

    setSplash(30);

    return window.bridge.initialize()
      .then(() => {
        bridgeReady = true;
        setSplash(80);

        // Сообщаем платформе что игра готова
        try {
          window.bridge.game.happyTime();
        } catch (_) { }

        setSplash(100);
        hideSplash();
        console.log('[PlaygamaSDK] Инициализирован успешно.');
      })
      .catch(err => {
        console.warn('[PlaygamaSDK] Ошибка инициализации:', err);
        hideSplash();
      });
  };

  // Запускаем инициализацию сразу при загрузке скрипта
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { save, load, showInterstitial };
})();
