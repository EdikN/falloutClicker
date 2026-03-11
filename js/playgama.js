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
  let lastSavedJson = null;

  const save = (data) => {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    if (json === lastSavedJson) return; // Prevent duplicate identical saves

    // Playgama storage (async, не блокируем)
    if (bridgeReady && window.bridge) {
      try {
        const storageType = cachedStorageType || (cachedStorageType = window.bridge.STORAGE_TYPE.PLATFORM_INTERNAL);
        window.bridge.storage.set('fallout_save', json, storageType)
          .then(() => { lastSavedJson = json; })
          .catch(() => { });
      } catch (_) { }
    }
  };

  // --- Загрузка ---
  const load = (callback) => {
    if (bridgeReady && window.bridge) {
      const storageType = cachedStorageType || (cachedStorageType = window.bridge.STORAGE_TYPE.PLATFORM_INTERNAL);
      window.bridge.storage.get('fallout_save', storageType)
        .then(data => {
          if (data) lastSavedJson = typeof data === 'string' ? data : JSON.stringify(data);
          callback(data || null);
        })
        .catch(() => {
          callback(null);
        });
    } else {
      callback(null);
    }
  };

  // --- Межстраничная реклама ---
  const showInterstitial = () => {
    if (!bridgeReady || !window.bridge) return;
    const now = Date.now() / 1000;
    if (now - lastAdTime < AD_COOLDOWN_SEC) return;
    lastAdTime = now;
    try {
      window.bridge.advertisement.showInterstitial();
    } catch (_) { }
  };

  // --- Реклама за награду ---
  // onRewarded вызывается ТОЛЬКО когда state === 'rewarded'
  const showRewarded = (placement, onRewarded) => {
    if (!bridgeReady || !window.bridge) {
      // В dev-режиме без моста — всегда даём награду
      if (onRewarded) onRewarded();
      return;
    }

    if (!window.bridge.advertisement.isRewardedSupported) {
      if (onRewarded) onRewarded();
      return;
    }

    const handler = (state) => {
      if (state === 'rewarded') {
        if (onRewarded) onRewarded();
      }
      if (state === 'closed' || state === 'failed') {
        try {
          window.bridge.advertisement.off(window.bridge.EVENT_NAME.REWARDED_STATE_CHANGED, handler);
        } catch (_) { }
        _resumeSound();
      }
    };

    try {
      window.bridge.advertisement.on(window.bridge.EVENT_NAME.REWARDED_STATE_CHANGED, handler);
      _muteSound();
      window.bridge.advertisement.showRewarded(placement || 'default');
    } catch (_) {
      _resumeSound();
    }
  };

  // --- IAP: покупка ---
  const buyProduct = (productId, onSuccess, onError) => {
    if (!bridgeReady || !window.bridge) {
      if (onError) onError('SDK не инициализирован');
      return;
    }
    if (!window.bridge.payments.isSupported) {
      if (onError) onError('Покупки не поддерживаются на этой платформе');
      return;
    }
    window.bridge.payments.purchase(productId)
      .then((purchase) => {
        console.log('[PlaygamaSDK] Покупка завершена:', purchase);
        if (onSuccess) onSuccess(purchase);
      })
      .catch((err) => {
        console.warn('[PlaygamaSDK] Ошибка покупки:', err);
        if (onError) onError(err);
      });
  };

  // --- IAP: восстановление незавершённых покупок ---
  const checkPurchases = (onResult) => {
    if (!bridgeReady || !window.bridge || !window.bridge.payments.isSupported) return;
    try {
      window.bridge.payments.getPurchases()
        .then((purchases) => {
          if (onResult && purchases && purchases.length > 0) onResult(purchases);
        })
        .catch(() => { });
    } catch (_) { }
  };

  // --- Игровое состояние ---
  const gameReady = () => {
    if (bridgeReady && window.bridge) {
      try { window.bridge.game.gameReady(); } catch (_) { }
    }
  };

  const setGameplayState = (state) => {
    if (!bridgeReady || !window.bridge) return;
    try {
      if (state === 'start') window.bridge.game.gameplayStart();
      else if (state === 'stop') window.bridge.game.gameplayStop();
    } catch (_) { }
  };

  // --- IAP: каталог ---
  let cachedCatalog = null;
  const getCatalog = () => {
    if (cachedCatalog) return Promise.resolve(cachedCatalog);
    if (!bridgeReady || !window.bridge || !window.bridge.payments.isSupported) return Promise.resolve([]);
    return window.bridge.payments.getCatalog()
      .then(items => {
        cachedCatalog = items || [];
        return cachedCatalog;
      })
      .catch(() => []);
  };

  // --- Локализация ---
  let cachedLanguage = null;
  let cachedStorageType = null;
  const getLanguage = () => {
    if (cachedLanguage) return cachedLanguage;
    if (bridgeReady && window.bridge) {
      cachedLanguage = window.bridge.platform.language || 'ru';
      return cachedLanguage;
    }
    return 'ru';
  };

  const isBridgeReady = () => bridgeReady;

  // --- Хелперы паузы звука во время рекламы ---
  let isAdShowing = false;

  const updateAudioState = () => {
    try {
      if (window.SoundManager && window.SoundManager.systemMute) {
        const shouldMute = isAdShowing || (typeof document !== 'undefined' && document.hidden);
        window.SoundManager.systemMute(shouldMute);
      }
    } catch (_) { }
  };

  const _muteSound = () => {
    isAdShowing = true;
    updateAudioState();
  };
  const _resumeSound = () => {
    isAdShowing = false;
    updateAudioState();
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', updateAudioState);
  }

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

        // Устанавливаем минимальный интервал между интерстишалами через SDK
        try {
          window.bridge.advertisement.setMinimumDelayBetweenInterstitial(180);
        } catch (_) { }

        // Подписка на события интерстишала — мьютим игру
        try {
          window.bridge.advertisement.on(
            window.bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED,
            (state) => {
              if (state === 'opened') _muteSound();
              if (state === 'closed' || state === 'failed') _resumeSound();
            }
          );
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

  return {
    save, load,
    showInterstitial, showRewarded,
    buyProduct, checkPurchases, getCatalog,
    gameReady, setGameplayState,
    getLanguage, isBridgeReady
  };
})();
