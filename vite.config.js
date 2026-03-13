import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Use relative paths for built assets so it works on Yandex Games
    build: {
        minify: 'terser',
        terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            mangle: {
                // Reserve short names used as module import aliases in source,
                // so the minifier doesn't reuse them for other variables and cause crashes.
                reserved: ['GameState', 'GameData', 'GameUI', 'SoundManager', 'PlaygamaSDK', 'translate']
            }
        }
    }
});
