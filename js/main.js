import '../styles.css';
import { GameData } from './data.js';
import { GameState } from './state.js';
import { GameUI } from './ui.js';
import { SoundManager } from './audio.js';
import { Game } from './game.js';
import { PlaygamaSDK } from './playgama.js';
import { translate } from './locales.js';
import { ArchiveScreen } from './ui/archiveScreen.js';
import { OnboardingFlow } from './onboarding/onboardingFlow.js';

// Expose archive screen (self-initializing on import; referenced to avoid tree-shaking)
window.ArchiveScreen = ArchiveScreen;

// Expose modules to window for data.js actions
window.GameState = GameState;
window.GameUI = GameUI;
window.Game = Game;
window.PlaygamaSDK = PlaygamaSDK;
window.SoundManager = SoundManager;

// Init sound
SoundManager.init();

// Preload images to prevent UI flicker
const preloadImages = () => {
    console.log('[App] Preloading images...');
    const imagesToLoad = new Set();

    // Add player image
    imagesToLoad.add('img/person.webp');

    // Add enemy images
    if (GameData.ENEMIES) {
        GameData.ENEMIES.forEach(e => { if (e.img) imagesToLoad.add(e.img); });
    }
    // Add story enemies
    if (GameData.STORY_ENEMIES) {
        Object.values(GameData.STORY_ENEMIES).forEach(e => { if (e.img) imagesToLoad.add(e.img); });
    }
    // Add story event portraits
    if (GameData.STORY_EVENTS) {
        GameData.STORY_EVENTS.forEach(e => { if (e.img) imagesToLoad.add(e.img); });
    }

    const promises = Array.from(imagesToLoad).map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            const done = () => resolve();
            img.onload = done;
            img.onerror = done; // continue even if error
            // Safety: на скрытой вкладке (сплеш Yandex) onload/onerror не срабатывают —
            // резолвим по таймеру, чтобы Promise.all никогда не зависал.
            setTimeout(done, 2000);
            img.src = src;
        });
    });

    return Promise.all(promises);
};

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // === Fix #1: Prevent browser scroll during gameplay ===
    // Используем CSS touch-action вместо JS touchmove preventDefault
    // passive:false touchmove блокирует compositor thread и лагает кнопки

    // === Fix #3: Prevent context menu, text selection, long-press popups ===
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());

    // Tutorial Setup
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const tutorialOk = document.getElementById('tutorialOk');
    if (tutorialBtn) tutorialBtn.addEventListener('click', () => GameUI.show('#tutorialModal', true));
    if (tutorialOk) tutorialOk.addEventListener('click', () => GameUI.show('#tutorialModal', false));

    // Settings Setup
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsClose = document.getElementById('settingsClose');
    if (settingsBtn) settingsBtn.addEventListener('click', () => GameUI.show('#settingsModal', true));
    if (settingsClose) settingsClose.addEventListener('click', () => GameUI.show('#settingsModal', false));

    // Global listener for "Accept" buttons to show interstitial ads
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        
        const isAccept = (
            btn.dataset.i18n === 'btn_accept' || 
            btn.dataset.i18n === 'btn_continue' || 
            btn.dataset.i18n === 'btn_confirm' ||
            (btn.textContent && (
                btn.textContent.includes(translate('btn_accept')) ||
                btn.textContent.includes(translate('btn_continue')) ||
                btn.textContent.includes(translate('btn_confirm'))
            ))
        );

        if (isAccept && window.PlaygamaSDK) {
            window.PlaygamaSDK.showInterstitial();
        }
    });

    // --- Управление кнопкой ВОЙТИ в HUD ---
    const updateAuthBtn = () => {
        const btn = document.getElementById('authBtn');
        if (!btn) return;
        const sdk = window.PlaygamaSDK;
        const shouldShow = sdk && sdk.isBridgeReady() && sdk.isAuthorizationSupported() && !sdk.isAuthorized();
        btn.style.display = shouldShow ? '' : 'none';
    };

    // Общая логика после успешной авторизации — подгрузить сохранение и обновить UI
    const onAuthSuccess = () => {
        GameState.load((success) => {
            if (success) GameState.normalize();
            if (window.GameUI) {
                window.GameUI.applyLanguage();
                window.GameUI.renderTop && window.GameUI.renderTop();
                window.GameUI.renderMain && window.GameUI.renderMain();
            }
            updateAuthBtn();
        });
    };

    const initAuthBtn = () => {
        const btn = document.getElementById('authBtn');
        if (!btn) return;
        btn.onclick = () => {
            const sdk = window.PlaygamaSDK;
            if (!sdk || !sdk.isBridgeReady()) return;

            // Показываем модальное окно — пусть игрок сам нажмёт ВОЙТИ
            const modal = document.getElementById('authModal');
            if (!modal) {
                // Если модалки нет — авторизуем напрямую (fallback)
                btn.disabled = true;
                btn.innerHTML = translate('auth_loading');
                sdk.authorize()
                    .then(onAuthSuccess)
                    .catch(() => { btn.disabled = false; btn.innerHTML = translate('auth_hud_btn'); });
                return;
            }

            GameUI.show('#authModal', true);

            const loginBtn = document.getElementById('authLoginBtn');
            const skipBtn  = document.getElementById('authSkipBtn');
            const close    = () => GameUI.show('#authModal', false);

            // Переопределяем обработчики под этот сценарий
            loginBtn.onclick = () => {
                close();
                btn.disabled = true;
                btn.innerHTML = translate('auth_loading');
                sdk.authorize()
                    .then(onAuthSuccess)
                    .catch(() => { btn.disabled = false; btn.innerHTML = translate('auth_hud_btn'); });
            };

            skipBtn.onclick = () => close();
        };
    };


    // =======================================================
    // --- СОЦИАЛЬНАЯ СИСТЕМА (SOCIAL PROMPT) ---
    // =======================================================
    const SocialPrompt = (() => {
        const SOCIAL_INTERVAL = 10;
        const STORAGE_KEY = 'social_done';
        const LAST_DAY_KEY = 'social_last_prompt_day';

        const getDone = () => GameState.get().social.done;
        const setDone = (obj) => { GameState.get().social.done = obj; GameState.save(); };
        const getLastDay = () => GameState.get().social.lastPromptDay;
        const setLastDay = (day) => { GameState.get().social.lastPromptDay = day; GameState.save(); };
        const getNeverRemind = () => GameState.get().social.neverRemind;
        const setNeverRemind = (v) => { GameState.get().social.neverRemind = v; GameState.save(); };

        const ACTIONS = [
            {
                id: 'share', icon: '🔗',
                titleKey: 'social_action_share_title', descKey: 'social_action_share_desc',
                check: () => !!(window.PlaygamaSDK?.social?.isShareSupported()),
                exec: () => {
                    const sdk = window.PlaygamaSDK;
                    const platform = sdk?.getPlatformId();
                    let options = {};
                    if (platform === 'vk') options = { link: window.location.href };
                    return sdk?.social?.share(options) || Promise.resolve();
                }
            },
            {
                id: 'join', icon: '👥',
                titleKey: 'social_action_join_title', descKey: 'social_action_join_desc',
                check: () => !!(window.PlaygamaSDK?.social?.isJoinCommunitySupported()),
                exec: () => window.PlaygamaSDK?.social?.joinCommunity() || Promise.resolve()
            },
            {
                id: 'invite', icon: '📨',
                titleKey: 'social_action_invite_title', descKey: 'social_action_invite_desc',
                check: () => !!(window.PlaygamaSDK?.social?.isInviteFriendsSupported()),
                exec: () => window.PlaygamaSDK?.social?.inviteFriends({ text: document.title }) || Promise.resolve()
            },
            {
                id: 'fav', icon: '⭐',
                titleKey: 'social_action_fav_title', descKey: 'social_action_fav_desc',
                check: () => !!(window.PlaygamaSDK?.social?.isAddToFavoritesSupported()),
                exec: () => window.PlaygamaSDK?.social?.addToFavorites() || Promise.resolve()
            }
        ];

        const getAvailable = () => ACTIONS.filter(a => a.check());
        const allDone = (done, available) => available.length === 0 || available.every(a => done[a.id]);

        const buildModal = (done) => {
            const list = document.getElementById('socialActionsList');
            if (!list) return false;
            const available = getAvailable();
            if (available.length === 0) return false;
            list.innerHTML = '';

            available.forEach(action => {
                const isDone = !!done[action.id];
                const card = document.createElement('button');
                card.className = 'social-action-card social-btn-hidden' + (isDone ? ' social-action-done' : '');
                card.disabled = isDone;
                card.innerHTML = `
                    <span class="social-action-icon-wrap">${action.icon}</span>
                    <span class="social-action-text">
                        <span class="social-action-title">${translate(action.titleKey)}</span>
                        <span class="social-action-desc">${translate(action.descKey)}</span>
                    </span>
                    <span class="${isDone ? 'social-done-badge' : 'social-action-arrow'}">${
                        isDone ? translate('social_status_done') : '›'
                    }</span>`;

                if (!isDone) {
                    card.onclick = () => {
                        card.disabled = true;
                        card.classList.add('social-action-done');
                        const arrow = card.querySelector('.social-action-arrow');
                        if (arrow) {
                            arrow.className = 'social-done-badge';
                            arrow.textContent = translate('social_status_done');
                        }
                        action.exec().catch(() => {});
                        const newDone = getDone();
                        newDone[action.id] = true;
                        setDone(newDone);
                        const skipBtn = document.getElementById('socialSkipBtn');
                        if (skipBtn && allDone(newDone, getAvailable())) {
                            skipBtn.textContent = translate('social_done_all');
                        }
                    };
                }
                list.appendChild(card);
            });
            return true;
        };

        const show = (currentDay) => {
            const modal = document.getElementById('socialModal');
            if (!modal) return;
            if (document.querySelector('.overlay.show:not(#socialModal)')) return;
            const done = getDone();
            if (allDone(done, getAvailable())) return;
            if (!buildModal(done)) return;
            setLastDay(currentDay);
            GameUI.show('#socialModal', true);
            
            const btns = [
                { id: 'socialSkipBtn', key: 'social_skip', offset: 0 },
                { id: 'socialMonthBtn', key: 'social_remind_30', offset: 20 },
                { id: 'socialNeverBtn', key: 'social_never', never: true }
            ];

            btns.forEach(b => {
                const btn = document.getElementById(b.id);
                if (btn) {
                    btn.classList.add('social-btn-hidden');
                    btn.classList.remove('social-btn-visible');
                    btn.textContent = translate(b.key);
                    btn.onclick = () => {
                        GameUI.show('#socialModal', false);
                        if (b.never) setNeverRemind(true);
                        else setLastDay(currentDay + b.offset);
                    };
                }
            });

            // Reveal buttons with delay
            setTimeout(() => {
                const allSocialBtns = modal.querySelectorAll('.social-btn-hidden');
                allSocialBtns.forEach(btn => {
                    btn.classList.remove('social-btn-hidden');
                    btn.classList.add('social-btn-visible');
                });
            }, 1000);
        };

        const checkOnDay = (day) => {
            if (getNeverRemind()) return;
            if (day - getLastDay() >= SOCIAL_INTERVAL) {
                setTimeout(() => show(day), 800);
            }
        };

        const initSettingsButtons = () => {
            const sdk = window.PlaygamaSDK;
            if (!sdk || !sdk.social) return;
            ACTIONS.forEach(action => {
                const btnMap = { share: 'shareBtn', join: 'joinBtn', invite: 'inviteBtn', fav: 'favBtn' };
                const btn = document.getElementById(btnMap[action.id]);
                if (btn && action.check()) {
                    btn.style.display = '';
                    btn.onclick = () => action.exec().catch(() => {});
                }
            });
        };

        return { show, checkOnDay, initSettingsButtons };
    })();

    // Слушаем смену дня из game.js
    document.addEventListener('dayadvanced', (e) => {
        SocialPrompt.checkOnDay(e.detail.day);
    });


    // === Защита от повторного вызова gameReady ===
    let _gameReadySent = false;

    /**
     * Скрыть сплеш и отправить gameReady платформе.
     * Вызывается в ДВУХ сценариях:
     *   A) Auth modal показывается → сплеш скрыть, gameReady, юзер видит модал
     *   B) Нет auth modal → после Game.init() + рендера UI → сплеш скрыть, gameReady
     * Флаг _gameReadySent гарантирует что gameReady отправится ровно 1 раз.
     */
    const sendGameReady = () => {
        if (_gameReadySent) return;
        _gameReadySent = true;

        // Скрываем сплеш
        if (window.Splash) {
            window.Splash.setProgress(100);
            window.Splash.hide();
        }

        // Отправляем gameReady платформе
        const sdk = window.PlaygamaSDK;
        if (sdk && sdk.isBridgeReady()) {
            sdk.gameReady();
            console.log('[App] game_ready sent');
        }
    };

    // --- Патч-ноты / бонус для вернувшихся игроков ---
    const PATCH_FLAG = 'patch_v26_seen';
    const WHATS_NEW_BONUS = { caps: 500, food: 20, water: 20, medkits: 5, materials: 40, ammo: 40 };

    const showWhatsNew = () => {
        if (localStorage.getItem(PATCH_FLAG) === '1') return;   // уже видел (надёжно)
        const content = document.getElementById('whatsNewContent');
        if (!content) return;

        const makeList = (key) => translate(key).split('|')
            .map(s => `<div style="margin:0.25rem 0">— ${s}</div>`).join('');

        content.innerHTML =
            `<div style="color:var(--warn);margin-bottom:0.5rem">${translate('whats_new_fixes_label')}</div>` +
            makeList('whats_new_fixes') +
            `<div style="color:var(--ok);margin:0.75rem 0 0.5rem">${translate('whats_new_content_label')}</div>` +
            makeList('whats_new_content') +
            `<div style="border:1px solid var(--line);padding:0.75rem;margin-top:0.75rem;background:rgba(29,242,58,0.04)">` +
            `<div style="color:var(--text);margin-bottom:0.4rem">${translate('whats_new_bonus_label')}</div>` +
            `<div style="color:var(--ok);font-size:1.05em">${translate('whats_new_bonus_items')}</div></div>`;

        const res = GameState.get().resources;
        Object.entries(WHATS_NEW_BONUS).forEach(([k, v]) => { res[k] = (res[k] || 0) + v; });

        // Отмечаем показ: localStorage (на устройстве, синхронно) + meta (на аккаунте, в облако)
        localStorage.setItem(PATCH_FLAG, '1');
        GameState.getMeta().whatsNewV26Shown = true;
        GameState.save();

        GameUI.show('#whatsNewModal', true);
        const okBtn = document.getElementById('whatsNewOk');
        if (okBtn) okBtn.onclick = () => {
            GameUI.show('#whatsNewModal', false);
            GameUI.renderTop && GameUI.renderTop();
            GameUI.renderMain && GameUI.renderMain();
        };
    };

    // Финальный запуск игры — после всех проверок авторизации и загрузки
    const applyData = async (hasSave = false) => {
        GameUI.applyLanguage();

        // Ветераны со старым сейвом: пропускаем онбординг (onboardingDone было false из deepMerge)
        if (hasSave && !GameState.getMeta().onboardingDone) {
            GameState.getMeta().onboardingDone = true;
        }

        // Прогресс сплеша: инициализация игры
        if (window.Splash && !_gameReadySent) window.Splash.setProgress(96);

        // Рендерим UI СРАЗУ — не блокируем первый кадр предзагрузкой картинок
        // (на скрытой вкладке Yandex img.onload не срабатывает и await зависал).
        Game.init();

        // Картинки грузим в фоне для устранения мерцания — без await.
        preloadImages();

        // Обновляем кнопку авторизации в HUD
        updateAuthBtn();
        initAuthBtn();
        SocialPrompt.initSettingsButtons();

        // Обучение при первом запуске.
        // Новые игроки проходят лор-онбординг с подсветкой UI (metaState.onboardingDone),
        // а статичная справка остаётся доступной из «Настройки → Обучение».
        if (!GameState.getMeta().onboardingDone) {
            GameState.get().tutorialShown = true;
            GameState.save();
            OnboardingFlow.start();
        } else if (!GameState.get().tutorialShown) {
            GameState.get().tutorialShown = true;
            GameState.save();
            GameUI.show('#tutorialModal', true);
        }

        // Сценарий B: если gameReady ещё не отправлен (не было auth modal)
        // → скрываем сплеш и отправляем gameReady ПОСЛЕ полной отрисовки UI
        if (!_gameReadySent) {
            sendGameReady();
        }

        // Всегда определяем gameplay state и баннер после рендера UI
        const sdk = window.PlaygamaSDK;
        if (sdk && sdk.isBridgeReady()) {
            const overlayOpen = document.querySelector('.overlay.show');
            const isBattleOpen = overlayOpen && overlayOpen.id === 'battleModal';
            sdk.setGameplayState(overlayOpen && !isBattleOpen ? 'stop' : 'start');

            // Показываем баннер если нет бонуса "No Ads"
            if (!GameState.get().permanentBonuses.noAds) {
                sdk.showBanner('bottom');
            }
        }
        // What's new: для вернувшихся игроков, один раз. Ждём, пока закроются стартовые
        // модалки (story-модалка дня 1), затем показываем — иначе пропускалось до перезахода.
        if (hasSave && localStorage.getItem(PATCH_FLAG) !== '1' && !GameState.getMeta().whatsNewV26Shown) {
            const tryShowPatch = () => {
                if (localStorage.getItem(PATCH_FLAG) === '1') return;
                if (document.querySelector('.overlay.show')) { setTimeout(tryShowPatch, 500); return; }
                showWhatsNew();
            };
            setTimeout(tryShowPatch, 150);
        }

        // Soft prompt для вернувшихся гостей (1500ms — после what's new)
        if (sdk && sdk.isBridgeReady() && sdk.isAuthorizationSupported() && !sdk.isAuthorized()) {
            setTimeout(() => {
                if (!document.querySelector('.overlay.show')) {
                    const modal = document.getElementById('authModal');
                    if (!modal) return;
                    GameUI.show('#authModal', true);
                    const loginBtn = document.getElementById('authLoginBtn');
                    const skipBtn  = document.getElementById('authSkipBtn');
                    const close = () => GameUI.show('#authModal', false);
                    loginBtn.onclick = () => { close(); sdk.authorize().then(onAuthSuccess).catch(() => {}); };
                    skipBtn.onclick = () => close();
                }
            }, 1500);
        }

        console.log('[App] applyData complete — game fully ready.');
    };

    // Загрузить сохранение и запустить игру
    const loadAndStart = () => {
        GameState.load((success) => {
            if (!success) GameState.set(GameState.fresh());
            applyData(success);
        });
    };

    // Показать AuthModal для новых игроков (нет сохранения, авторизация поддерживается)
    const maybeShowAuthModal = (onDone) => {
        const sdk = window.PlaygamaSDK;
        const hasAuth = sdk && sdk.isBridgeReady() && sdk.isAuthorizationSupported() && !sdk.isAuthorized();
        if (!hasAuth) { onDone(); return; }

        const modal = document.getElementById('authModal');
        if (!modal) { onDone(); return; }

        // Сценарий A: auth modal будет показан → скрываем сплеш → gameReady
        // Юзер видит интерактивный модал = игра "загружена"
        sendGameReady();

        GameUI.show('#authModal', true);

        const loginBtn = document.getElementById('authLoginBtn');
        const skipBtn = document.getElementById('authSkipBtn');

        const close = () => GameUI.show('#authModal', false);

        loginBtn.onclick = () => {
            close();
            sdk.authorize()
                .then(() => {
                    GameState.load((success) => {
                        if (!success) GameState.set(GameState.fresh());
                        onDone();
                    });
                })
                .catch(() => onDone());
        };

        skipBtn.onclick = () => {
            close();
            onDone();
        };
    };

    // --- Основной flow ---
    const startGame = () => {
        GameUI.applyLanguage();

        const sdk = window.PlaygamaSDK;

        if (!sdk || !sdk.isBridgeReady()) { loadAndStart(); return; }
        if (sdk.isAuthorized()) { loadAndStart(); return; }

        // Passive check: platform session → lightweight authorize() window
        const playerData = window.bridge?.player;
        if (sdk.isAuthorizationSupported() && playerData?.id && playerData?.name) {
            sdk.authorize().catch(() => {}).finally(() => loadAndStart());
            return;
        }

        // Guest: load local save, decide on auth modal
        GameState.load((hasSave) => {
            if (!hasSave) {
                GameState.set(GameState.fresh());
                // Новым игрокам патч-ноты не показываем — помечаем сразу
                GameState.getMeta().whatsNewV26Shown = true;
                localStorage.setItem('patch_v26_seen', '1');
                GameState.save();
                maybeShowAuthModal(() => applyData(false));
            } else {
                // Returning guest — what's new + soft prompt fires from applyData()
                applyData(true);
            }
        });
    };

    // Init SDK first, wait, then init game logic
    // Fallback: start game after 5s even if bridge never becomes ready
    const timeout = setTimeout(() => {
        clearInterval(checkSDK);
        console.warn('[App] Bridge readiness timeout \u2014 starting game in offline mode.');
        startGame();
    }, 5000);

    const checkSDK = setInterval(() => {
        if (window.PlaygamaSDK && window.PlaygamaSDK.isBridgeReady()) {
            clearInterval(checkSDK);
            clearTimeout(timeout);
            startGame();
        }
    }, 100);
});
