import '../styles.css';
import { GameData } from './data.js';
import { GameState } from './state.js';
import { GameUI } from './ui.js';
import { SoundManager } from './audio.js';
import { Game } from './game.js';
import { PlaygamaSDK } from './playgama.js';
import { translate } from './locales.js';

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

    imagesToLoad.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Prevent context menu and accidental selections
    document.addEventListener('contextmenu', e => e.preventDefault());
    // Prevent dragging images or elements
    document.addEventListener('dragstart', e => e.preventDefault());

    // Tutorial Setup
    const tutorialBtn = document.getElementById('tutorialBtn');
    const tutorialModal = document.getElementById('tutorialModal');
    const tutorialOk = document.getElementById('tutorialOk');
    if (tutorialBtn) tutorialBtn.addEventListener('click', () => tutorialModal && tutorialModal.classList.add('show'));
    if (tutorialOk) tutorialOk.addEventListener('click', () => tutorialModal && tutorialModal.classList.remove('show'));

    // Settings Setup
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsClose = document.getElementById('settingsClose');
    if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal && settingsModal.classList.add('show'));
    if (settingsClose) settingsClose.addEventListener('click', () => settingsModal && settingsModal.classList.remove('show'));

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

            modal.classList.add('show');

            const loginBtn = document.getElementById('authLoginBtn');
            const skipBtn  = document.getElementById('authSkipBtn');
            const close    = () => modal.classList.remove('show');

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


    // Финальный запуск игры — после всех проверок авторизации и загрузки
    const applyData = () => {
        GameUI.applyLanguage();
        preloadImages();
        Game.init();
        // Обновляем кнопку авторизации в HUD
        updateAuthBtn();
        initAuthBtn();
        // Tutorial first time check
        if (!localStorage.getItem('tutorial_shown')) {
            localStorage.setItem('tutorial_shown', 'true');
            const tm = document.getElementById('tutorialModal');
            if (tm) tm.classList.add('show');
        }

        // game_ready отправляем только ПОСЛЕ applyData — всегда с финальными данными
        try {
            if (window.PlaygamaSDK && window.PlaygamaSDK.isBridgeReady()) {
                window.PlaygamaSDK.gameReady();
            } else if (window.bridge) {
                const p = window.bridge.platform.sendMessage('game_ready');
                if (p && typeof p.catch === 'function') p.catch(() => {});
            }
        } catch (_) { }
    };

    // Загрузить сохранение и запустить игру
    const loadAndStart = () => {
        GameState.load((success) => {
            if (!success) GameState.set(GameState.fresh());
            applyData();
        });
    };

    // Тихая авторизация (по localStorage.auth или уже залогинен) → затем load из облака
    const silentAuthorizeAndLoad = () => {
        const sdk = window.PlaygamaSDK;
        if (!sdk || !sdk.isBridgeReady()) {
            loadAndStart();
            return;
        }

        if (sdk.isAuthorized()) {
            // Уже залогинен — сразу грузим (читает platform_internal / облако)
            console.log('[App] \u0423\u0436\u0435 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d, \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043e\u0431\u043b\u0430\u043a\u0430...');
            loadAndStart();
            return;
        }

        if (localStorage.getItem('auth') === 'authorized' && sdk.isAuthorizationSupported()) {
            // Был залогинен раньше — тихо авторизуемся, затем грузим облако
            console.log('[App] localStorage.auth \u043d\u0430\u0439\u0434\u0435\u043d, \u0442\u0438\u0445\u0430\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f...');
            sdk.authorize()
                .catch(() => {}) // Даже если не удалось — всё равно грузим
                .finally(() => loadAndStart());
            return;
        }

        // Неизвестный статус — сначала грузим, потом решаем
        loadAndStart();
    };

    // Показать AuthModal для новых игроков (нет сохранения, авторизация поддерживается)
    const maybeShowAuthModal = (onDone) => {
        const sdk = window.PlaygamaSDK;
        const hasAuth = sdk && sdk.isBridgeReady() && sdk.isAuthorizationSupported() && !sdk.isAuthorized();
        if (!hasAuth) { onDone(); return; }

        const modal = document.getElementById('authModal');
        if (!modal) { onDone(); return; }

        modal.classList.add('show');

        const loginBtn = document.getElementById('authLoginBtn');
        const skipBtn = document.getElementById('authSkipBtn');

        const close = () => modal.classList.remove('show');

        loginBtn.onclick = () => {
            close();
            sdk.authorize()
                .then(() => {
                    // После авторизации перезагружаем — вдруг есть облачное сохранение
                    GameState.load((success) => {
                        if (!success) GameState.set(GameState.fresh());
                        onDone();
                    });
                })
                .catch(() => onDone()); // Отказался — запускаем без аккаунта
        };

        skipBtn.onclick = () => {
            close();
            onDone();
        };
    };

    // --- Основной flow ---
    const startGame = () => {
        GameUI.applyLanguage();
        preloadImages();

        const sdk = window.PlaygamaSDK;

        // Если уже залогинен или был залогинен — тихая авторизация и загрузка
        if (sdk && sdk.isBridgeReady() &&
            (sdk.isAuthorized() || localStorage.getItem('auth') === 'authorized')) {
            silentAuthorizeAndLoad();
            return;
        }

        // Первичная загрузка сохранения
        GameState.load((hasSave) => {
            if (hasSave) {
                // Есть сохранение — просто стартуем
                applyData();
            } else {
                // Нет сохранения — предлагаем авторизоваться (только первый раз)
                GameState.set(GameState.fresh());
                maybeShowAuthModal(() => applyData());
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
