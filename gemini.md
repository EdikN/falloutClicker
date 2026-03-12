# Fallout Clicker: Project Instructions for AI

This document provides essential context and guidelines for AI agents working on the Fallout Clicker project.
# инструкции к playgama sdk - https://wiki.playgama.com/playgama/sdk/engines/core-plain-js
## 🟢 Project Overview
A retro-futuristic, post-apocalyptic idle clicker game inspired by the Fallout universe and Pip-Boy interface.

## 🛠 Tech Stack
*   **Vite** - Build tool and development server.
*   **Vanilla JavaScript** - Core game logic and UI management.
*   **Vanilla CSS** - Styling with a focus on monochromatic CRT aesthetics.
*   **Main Modules:**
    *   `js/data.js` - Central data repository (weapons, enemies, events, stats).
    *   `js/game.js` - Core engine, state management, and rewards.
    *   `js/ui.js` - UI rendering, dialogue systems, and toasts.
    *   `js/main.js` - Entry point and event listeners.

## 📟 Visual Style & Aesthetic
*   **Core Theme:** Retro-futuristic, monochromatic green phosphor CRT.
    *   `#00ff41` (Matrix green) on `#000` (Black).
    *   Scanline effects and CRT flicker.
*   **Design Rules:**
    *   Avoid heavy blending/filters (e.g., `backdrop-filter`) to maintain performance.
    *   Use high-contrast monochromatic pixel art for icons.
    *   Consistent use of "Pip-Boy" style borders and typography.
*   **Asset Generation:**
    *   Use `prompts.md` templates for DALL-E/Image generation.
    *   Style: "pixel art icon, monochromatic green on black, retro-futuristic, high contrast, no background".

## 📊 Data Structure (`js/data.js`)
*   **Localization:** Support for `ru` and `en` is mandatory. Most objects have `name_ru`/`name_en` or `text_ru`/`text_en`.
*   **Story Events (`STORY_EVENTS`):**
    *   Can include choices with logic in `action()`.
    *   Can trigger combat using `isCombat: true` and `enemyId`.
    *   Can unlock flags in `window.GameState`.
*   **GameState:** Access state via `window.GameState.get()`. Modifying state should ideally be done through defined methods in `window.Game`.

## ⚡ Technical Guidelines
*   **DOM Performance:** Avoid `innerHTML` in frequent updates (like HP bars or resource counts). Use direct text/style manipulation.
*   **Global Access:** The game exposing `window.Game`, `window.GameUI`, and `window.GameState` for easy interaction from data-driven events.
*   **Localization Key:** Use `window.GameUI.t('key')` for fetching translated strings.

## 📂 Key Files
*   `index.html` - Game structure and main containers.
*   `styles.css` - CRT effect and layout.
*   `js/data.js` - The main place to add new content (quests, weapons, balance).
*   `read` - Developer cheat-sheet for adding content.

## 🚩 Известные проблемы и бэклог (Review Results)
Этот раздел содержит результаты полного ревью проекта. Исправление этих пунктов является приоритетом при рефакторинге.

### Архитектура
*   **Сильная связанность:** `game.js` и `ui.js` слишком тесно переплетены. Рекомендуется переход на событийную модель (EventEmitter).
*   **Глобальные объекты:** Активно используются `window.Game`, `window.GameState` и др.
*   **Масштабируемость `data.js`:** Файл перегружен данными и логикой (поля `action()`). Желательно разделить на модули.

### Производительность
*   **CSS Фильтры:** Удалить оставшиеся `backdrop-filter: blur(4px)`.
*   **DOM Updates:** Оптимизировать частоту вызовов `renderBattle` в `tick`, избегать лишних манипуляций в каждом кадре.

### Локализация и данные
*   **Локализация:** Вынести огромный объект `TRANSLATIONS` из `ui.js` в отдельный JSON/модуль.

### Системные модули
*   **State:** Автоматизировать нормализацию состояния (сейчас прописана вручную в `normalize`).
*   **Playgama SDK:** Покупки не обрабатываются если у игрока пропал интернет во время покупки, необходимо реализовать метод консумирования и вывести сообщение о успешной покупки.

