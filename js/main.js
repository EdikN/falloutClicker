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
    // Init SDK first, wait, then init game logic
    const checkSDK = setInterval(() => {
        if (window.PlaygamaSDK && window.PlaygamaSDK.isBridgeReady()) {
            clearInterval(checkSDK);

            // Force UI language correctly right at start
            GameUI.applyLanguage();

            GameState.load((success) => {
                if (!success) {
                    GameState.set(GameState.fresh());
                }

                // Start the core logic
                Game.init();

                // Tell platform game is ready
                if (window.bridge) {
                    window.bridge.platform.sendMessage("game_ready");
                }
            });
        }
    }, 100);
});
