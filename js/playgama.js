import { SoundManager } from './audio.js';

export const PlaygamaSDK = (() => {
  // Минимальный интервал между интерстишалами (секунды)
  const AD_COOLDOWN_SEC = 90;
  let lastAdTime = 0;
  let initTime = 0;
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
  let lastSavedKey = null;

  async function tryStorageSet(storageType, key, json) {
    try {
      await window.bridge.storage.set(key, json, storageType);
      console.log(`[PlaygamaSDK] Прогресс сохранён (${key}) в ${storageType}.`);
      return true;
    } catch (e) {
      console.warn(`[PlaygamaSDK] Ошибка сохранения (${key}) в ${storageType}:`, e == null ? 'storage unavailable' : e);
      return false;
    }
  }

  async function tryStorageGet(storageType, key) {
    try {
      let data = await window.bridge.storage.get(key, storageType);
      if (data === null || data === undefined || data === '') return null;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) {}
      }
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        return data;
      }
    } catch (e) {
      console.warn(`[PlaygamaSDK] Ошибка загрузки (${key}) из ${storageType}:`, e == null ? 'storage unavailable' : e);
    }
    return null;
  }

  const save = async (data, key = 'save') => {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    if (json === lastSavedJson && key === lastSavedKey) return;

    if (bridgeReady && window.bridge && window.bridge.storage) {
      const isAuthorized = !!(window.bridge.player && window.bridge.player.isAuthorized);
      const isCloudSupported = window.bridge.storage.isSupported('platform_internal');

      let success = false;
      if (isAuthorized && isCloudSupported) {
        success = await tryStorageSet('platform_internal', key, json);
      } else {
        success = await tryStorageSet('local_storage', key, json);
      }

      if (success) {
        lastSavedJson = json;
        lastSavedKey = key;
      }
    }
  };

  // --- Загрузка ---
  const load = async (callback, key = 'save') => {
    const safeCallback = (data) => {
      if (typeof callback === 'function') {
        // Всегда делайте колбэк асинхронным, чтобы избежать переполнения стека в вызывающем коде
        setTimeout(() => callback(data), 0);
      }
    };

    if (bridgeReady && window.bridge && window.bridge.storage) {
      const isAuthorized = !!(window.bridge.player && window.bridge.player.isAuthorized);
      const isCloudSupported = window.bridge.storage.isSupported('platform_internal');

      let resultData = null;

      if (isAuthorized && isCloudSupported) {
        const cloudData = await tryStorageGet('platform_internal', key);
        if (cloudData) {
          resultData = cloudData;
        } else {
          const localData = await tryStorageGet('local_storage', key);
          if (localData) {
            console.log('[PlaygamaSDK] Migrated from local_storage ✓');
            resultData = localData;
          }
        }
      } else {
        const localData = await tryStorageGet('local_storage', key);
        if (localData) {
          resultData = localData;
        }
      }

      if (resultData) {
        lastSavedJson = typeof resultData === 'string' ? resultData : JSON.stringify(resultData);
        lastSavedKey = key;
      }

      safeCallback(resultData);
    } else {
      safeCallback(null);
    }
  };

  // --- Межстраничная реклама ---
  const canShowInterstitial = () => {
    if (!bridgeReady || !window.bridge) return false;
    const now = Date.now() / 1000;
    
    // Задержка первого показа для vk/ok
    const platform = getPlatformId();
    if ((platform === 'vk' || platform === 'ok') && lastAdTime === 0 && initTime > 0) {
        if (now - initTime < 60) {
            return false;
        }
    }

    return (now - lastAdTime >= AD_COOLDOWN_SEC);
  };

  const showInterstitial = () => {
    if (!canShowInterstitial()) return false;

    lastAdTime = Date.now() / 1000;
    try {
      window.bridge.advertisement.showInterstitial();
      return true;
    } catch (err) {
      console.warn('[PlaygamaSDK] Ошибка показа интерстишала:', err);
      return false;
    }
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

  // --- Баннерная реклама ---
  const showBanner = (position = 'bottom', placement = 'default') => {
    if (!bridgeReady || !window.bridge || !window.bridge.advertisement.isBannerSupported) return;

    try {
      window.bridge.advertisement.showBanner(position, placement);
      console.log(`[PlaygamaSDK] Показ баннера: ${position}, ${placement}`);
    } catch (_) { }
  };

  const hideBanner = () => {
    if (!bridgeReady || !window.bridge) return;
    try {
      window.bridge.advertisement.hideBanner();
      console.log('[PlaygamaSDK] Скрытие баннера');
    } catch (_) { }
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
        .catch((err) => {
          console.warn('[PlaygamaSDK] Ошибка получения списка покупок:', err);
        });
    } catch (err) {
      console.error('[PlaygamaSDK] Ошибка при вызове getPurchases:', err);
    }
  };

  const consumePurchase = (purchaseToken) => {
    if (!bridgeReady || !window.bridge || !window.bridge.payments.isSupported) return Promise.resolve();
    return window.bridge.payments.consumePurchase(purchaseToken)
      .catch((err) => {
        console.warn('[PlaygamaSDK] Ошибка потребления покупки:', err);
      });
  };

  // --- Игровое состояние ---
  const gameReady = () => {
    if (bridgeReady && window.bridge) {
      try { window.bridge.platform.sendMessage('game_ready'); } catch (_) { }
    }
  };

  const setGameplayState = (state) => {
    if (!bridgeReady || !window.bridge) return;
    try {
      if (state === 'start') window.bridge.platform.sendMessage('gameplay_started');
      else if (state === 'stop') window.bridge.platform.sendMessage('gameplay_stopped');
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
      .catch((err) => {
        console.warn('[PlaygamaSDK] Ошибка получения каталога:', err);
        return [];
      });
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

  // --- Платформа ---
  const getPlatformId = () => {
    if (bridgeReady && window.bridge && window.bridge.platform) {
      return (window.bridge.platform.id || '').toLowerCase();
    }
    return '';
  };

  const isBridgeReady = () => bridgeReady;

  // --- Авторизация ---
  const isAuthorizationSupported = () => {
    try { return !!(window.bridge && window.bridge.player && window.bridge.player.isAuthorizationSupported); }
    catch (_) { return false; }
  };

  const isAuthorized = () => {
    try { return !!(window.bridge && window.bridge.player && window.bridge.player.isAuthorized); }
    catch (_) { return false; }
  };

  // Вызывается ТОЛЬКО по явному действию пользователя
  const authorize = () => {
    if (!bridgeReady || !window.bridge || !window.bridge.player) {
      return Promise.reject(new Error('bridge not ready'));
    }
    return window.bridge.player.authorize()
      .then(() => {
        localStorage.setItem('auth', 'authorized');
        console.log('[PlaygamaSDK] Авторизация успешна.');
      })
      .catch((err) => {
        console.warn('[PlaygamaSDK] Авторизация отклонена или не поддерживается:', err);
        throw err;
      });
  };

  // --- Социальные функции ---
  const social = {
    isShareSupported: () => !!(bridgeReady && window.bridge && window.bridge.social && window.bridge.social.isShareSupported),
    share: (options) => {
      if (bridgeReady && window.bridge && window.bridge.social) {
        return window.bridge.social.share(options);
      }
      return Promise.reject('bridge not ready');
    },
    isJoinCommunitySupported: () => !!(bridgeReady && window.bridge && window.bridge.social && window.bridge.social.isJoinCommunitySupported),
    joinCommunity: (options) => {
      if (bridgeReady && window.bridge && window.bridge.social) {
        return window.bridge.social.joinCommunity(options);
      }
      return Promise.reject('bridge not ready');
    },
    isInviteFriendsSupported: () => {
      if (getPlatformId() === 'ok') return false;
      return !!(bridgeReady && window.bridge && window.bridge.social && window.bridge.social.isInviteFriendsSupported);
    },
    inviteFriends: (options) => {
      if (bridgeReady && window.bridge && window.bridge.social) {
        return window.bridge.social.inviteFriends(options);
      }
      return Promise.reject('bridge not ready');
    },
    isAddToFavoritesSupported: () => !!(bridgeReady && window.bridge && window.bridge.social && window.bridge.social.isAddToFavoritesSupported),
    addToFavorites: () => {
      if (bridgeReady && window.bridge && window.bridge.social) {
        return window.bridge.social.addToFavorites();
      }
      return Promise.reject('bridge not ready');
    }
  };

  // --- Хелперы паузы звука во время рекламы и сворачивания ---
  let isAdShowing = false;
  let isPlatformHidden = false;
  let isAudioMutedByPlatform = false;

  const isAppPaused = () => isAdShowing || isPlatformHidden;

  const updateAudioState = () => {
    try {
      if (SoundManager && SoundManager.systemMute) {
        const isDocumentHidden = typeof document !== 'undefined' && document.hidden;
        const shouldMute = isAdShowing || isPlatformHidden || isDocumentHidden || isAudioMutedByPlatform;
        SoundManager.systemMute(shouldMute);
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

  const isPaymentsSupported = () => {
    try {
      return !!(window.bridge && window.bridge.payments && window.bridge.payments.isSupported);
    } catch (_) {
      return false;
    }
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

        initTime = Date.now() / 1000;

        // Устанавливаем минимальный интервал между интерстишалами через SDK
        try {
          window.bridge.advertisement.setMinimumDelayBetweenInterstitial(90);
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

        // Подписка на изменение состояния видимости игры (вкладки)
        try {
          if (window.bridge.game && window.bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED) {
            window.bridge.game.on(window.bridge.EVENT_NAME.VISIBILITY_STATE_CHANGED, state => {
              isPlatformHidden = (state === 'hidden');
              updateAudioState();
            });
          }
        } catch (_) { }

        // Подписка на изменение звука платформы
        try {
          if (window.bridge.platform && window.bridge.EVENT_NAME.AUDIO_STATE_CHANGED) {
            window.bridge.platform.on(window.bridge.EVENT_NAME.AUDIO_STATE_CHANGED, isEnabled => {
              isAudioMutedByPlatform = !isEnabled;
              updateAudioState();
            });
          }
        } catch (_) { }

        // Подписка на состояние паузы от платформы
        try {
          if (window.bridge.platform && window.bridge.EVENT_NAME.PAUSE_STATE_CHANGED) {
            window.bridge.platform.on(window.bridge.EVENT_NAME.PAUSE_STATE_CHANGED, isPaused => {
              isPlatformHidden = isPaused; // Используем как скрытие окна
              updateAudioState();
            });
          }
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
    showInterstitial, showRewarded, canShowInterstitial,
    showBanner, hideBanner,
    buyProduct, checkPurchases, getCatalog, consumePurchase,
    gameReady, setGameplayState,
    getLanguage, getPlatformId, isBridgeReady, isAppPaused, isPaymentsSupported,
    isAuthorizationSupported, isAuthorized, authorize,
    social
  };
})();
