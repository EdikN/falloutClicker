# Fallout Clicker Core - Project Documentation

This document serves as an entry point for AI agents to understand the "Fallout Clicker" project.

## Quick Links
- **Playgama SDK Instructions**: [Plain JS SDK Intro](https://wiki.playgama.com/playgama/sdk/engines/core-plain-js/intro)
- **Technical Review**: [review_results.md](file:///c:/Users/1/Documents/Eduard/Web/falloutClicker/review_results.md)
- **Main Entry Point**: [main.js](file:///c:/Users/1/Documents/Eduard/Web/falloutClicker/js/main.js)
- **Game Engine**: [game.js](file:///c:/Users/1/Documents/Eduard/Web/falloutClicker/js/game.js)

## Project Overview
Fallout Clicker is a web-based clicker/RPG game built with Vanilla JavaScript and Vite. It features a retro CRT aesthetic and RPG elements like combat, inventory management, and story events.

### Project Structure
- `/js/`: Contains the core logic modules.
  - `main.js`: Initialization and SDK setup.
  - `game.js`: Core game loop and battle logic.
  - `ui.js`: DOM manipulation and localization.
  - `state.js`: Save/Load logic.
  - `playgama.js`: Bridge SDK integration.
- `index.html`: Main HTML structure with localized text handles.
- `styles.css`: Visual styling, including CRT effects.

## Key Considerations for Agents
- **CRT Effects**: The game uses complex CSS filters for the retro look. Avoid heavy DOM updates in high-frequency loops.
- **Localization**: Use `data-i18n` attributes for static text and `GameUI.t()` for dynamic strings.
- **State Management**: Game state is managed in `GameState`. Ensure any modifications are compatible with the `normalize` function in `state.js`.

## Saving & Versioning Rules
- **Versioning**: Every task or code change MUST increment `GameData.SAVE_VER` by at least `0.1`.
- **Save Keys**: The game uses versioned save keys in Playgama storage (e.g., `save_1_0`, `save_1_7`).
- **Compatibility**: The load system automatically falls back to older versions if the current version's save is missing.
