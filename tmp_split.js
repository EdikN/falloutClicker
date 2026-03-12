const fs = require('fs');
const path = require('path');

const srcPath = path.join('c:', 'Users', '1', 'Documents', 'Eduard', 'Web', 'falloutClicker', 'js', 'data.js');
const txt = fs.readFileSync(srcPath, 'utf8');

// A rudimentary object extractor up to the next `const ` or end of file
const extract = (name) => {
    const regex = new RegExp(`const ${name} = ([\\s\\S]*?)(?:\\n\\s*const |\\n\\s*//|\\n\\s*\\};\\s*\\n)`);
    const match = txt.match(regex);
    if (!match) {
        // Fallback for end of block
        const regex2 = new RegExp(`const ${name} = ([\\s\\S]*?)$`);
        const match2 = txt.match(regex2);
        if (match2) return `export const ${name} = ${match2[1]}`;
        return '';
    }
    return `export const ${name} = ${match[1]}`;
};

// However, STORY_EVENTS is huge and goes to the end. Let's strictly extract using block matching or just string splits.
// It's safer to just require the file as a module? No, data.js has exports.
// Let's do string split logic based on the known order of declarations:
// 1. SAVE_KEY, SAVE_VER
// 2. WEAPON_STATS
// 3. ARMOR_STATS
// 4. ENEMIES
// 5. ELITE_ENEMIES
// 6. LOCATIONS
// 7. SHOP_ITEMS
// 8. CRAFT_ITEMS
// 9. MEMORY_FRAGMENTS
// 10. STORY_EVENTS
// 11. STORY_ENEMIES
// 12. NOTES

let dItems = "export " + txt.substring(txt.indexOf('const WEAPON_STATS'), txt.indexOf('const ENEMIES'));
let dEnemies = "export " + txt.substring(txt.indexOf('const ENEMIES'), txt.indexOf('const LOCATIONS'));
let dLocations = "export " + txt.substring(txt.indexOf('const LOCATIONS'), txt.indexOf('const SHOP_ITEMS'));
dItems += "export " + txt.substring(txt.indexOf('const SHOP_ITEMS'), txt.indexOf('const MEMORY_FRAGMENTS'));
let dStory = "export " + txt.substring(txt.indexOf('const MEMORY_FRAGMENTS'), txt.indexOf('const STORY_ENEMIES'));
dEnemies += "export " + txt.substring(txt.indexOf('const STORY_ENEMIES'), txt.indexOf('const NOTES'));
dStory += "export " + txt.substring(txt.indexOf('const NOTES'), txt.lastIndexOf('return {'));

const dir = path.join('c:', 'Users', '1', 'Documents', 'Eduard', 'Web', 'falloutClicker', 'js', 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

fs.writeFileSync(path.join(dir, 'items.js'), dItems.replace(/const /g, 'export const ').replace(/export export/g, 'export'));
fs.writeFileSync(path.join(dir, 'enemies.js'), dEnemies.replace(/const /g, 'export const ').replace(/export export/g, 'export'));
fs.writeFileSync(path.join(dir, 'locations.js'), dLocations.replace(/const /g, 'export const ').replace(/export export/g, 'export'));
fs.writeFileSync(path.join(dir, 'story.js'), dStory.replace(/const /g, 'export const ').replace(/export export/g, 'export'));

const newDataJs = `import { WEAPON_STATS, ARMOR_STATS, SHOP_ITEMS, CRAFT_ITEMS } from './data/items.js';
import { ENEMIES, ELITE_ENEMIES, STORY_ENEMIES } from './data/enemies.js';
import { LOCATIONS } from './data/locations.js';
import { MEMORY_FRAGMENTS, NOTES, STORY_EVENTS } from './data/story.js';

export const GameData = {
  SAVE_KEY: 'fallout_clicker_save',
  SAVE_VER: 1.6,
  WEAPON_STATS, ARMOR_STATS, SHOP_ITEMS, CRAFT_ITEMS,
  ENEMIES, ELITE_ENEMIES, STORY_ENEMIES,
  LOCATIONS,
  MEMORY_FRAGMENTS, NOTES, STORY_EVENTS
};
`;

fs.writeFileSync(srcPath, newDataJs);
console.log('Split data.js successfully');
