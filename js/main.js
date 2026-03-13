import '../styles.css';
import { GameData } from './data.js';
import { GameState } from './state.js';
import { GameUI } from './ui.js';
import { SoundManager } from './audio.js';
import { Game } from './game.js';
import { PlaygamaSDK } from './playgama.js';

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
    
    const startGame = () => {
        GameUI.applyLanguage();
        preloadImages();

        GameState.load((success) => {
            if (!success) {
                GameState.set(GameState.fresh());
            }
            Game.init();
            // Tell platform game is ready
            try {
                if (window.bridge) {
                    const p = window.bridge.platform.sendMessage("game_ready");
                    if (p && typeof p.catch === 'function') p.catch(() => {});
                }
            } catch (_) { }
        });
    };

    // Init SDK first, wait, then init game logic
    // Fallback: start game after 5s even if bridge never becomes ready
    const timeout = setTimeout(() => {
        clearInterval(checkSDK);
        console.warn('[App] Bridge readiness timeout — starting game in offline mode.');
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
