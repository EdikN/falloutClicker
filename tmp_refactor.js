const fs = require('fs');
const path = require('path');

const gamePath = path.join('c:', 'Users', '1', 'Documents', 'Eduard', 'Web', 'falloutClicker', 'js', 'game.js');
let code = fs.readFileSync(gamePath, 'utf8');

// Replacements
code = code.replace(/UI\.t\(/g, 't(');
code = code.replace(/UI\.loc\(/g, 'loc(');
code = code.replace(/UI\.renderTop\(\)/g, "Events.emit('ui:renderTop')");
code = code.replace(/UI\.renderMain\(\)/g, "Events.emit('ui:renderMain')");
code = code.replace(/UI\.renderBattle\(\)/g, "Events.emit('ui:renderBattle')");
code = code.replace(/UI\.toast\(/g, "Events.emit('ui:toast', ");
code = code.replace(/UI\.showDialogue\(/g, "Events.emit('ui:showDialogue', ");
code = code.replace(/UI\.setEncounterCard\(/g, "Events.emit('ui:setEncounterCard', ");
code = code.replace(/UI\.triggerDamage\(\)/g, "Events.emit('ui:triggerDamage')");
code = code.replace(/UI\.triggerEnemyHit\(\)/g, "Events.emit('ui:triggerEnemyHit')");

// UI.show('#modal', true) -> Events.emit('ui:show', { id: '#modal', on: true })
code = code.replace(/UI\.show\(([^,]+),\s*([^)]+)\)/g, "Events.emit('ui:show', { id: $1, on: $2 })");

// Defeat DOM manipulations were already removed and replaced by Events.emit('ui:defeat') in my previous manual plan? Oh wait, I DIDN'T DO THE DEFEAT REPLACEMENT in game.js yet!
// Let's replace the whole defeat function body in game.js via regex
const defeatRegex = /const defeat = \(reasonKey = 'defeat_reason_default'\) => \{[\s\S]*?S\.save\(\);\s*\};/;
const defeatReplacement = `const defeat = (reasonKey = 'defeat_reason_default') => {
  const st = S.get();
  st.dead = true;
  st.combat.active = false;
  const reason = t(reasonKey);

  Events.emit('ui:defeat', {
    reason: reason,
    day: st.day,
    reviveAvailable: st.reviveAvailable
  });

  if (PlaygamaSDK && !st.permanentBonuses.noAds) PlaygamaSDK.showInterstitial();

  const corpse = {
    day: st.day,
    reason: reason,
    resources: {
      materials: Math.floor((st.resources.materials || 0) * 0.5),
      ammo: Math.floor((st.resources.ammo || 0) * 0.5),
      caps: Math.floor((st.resources.caps || 0) * 0.5)
    }
  };
  S.getMeta().corpse = corpse;
  S.getMeta().deaths = (S.getMeta().deaths || 0) + 1;
  S.set(S.fresh());
  S.save();
};`;
code = code.replace(defeatRegex, defeatReplacement);

// UI.renderEquipment -> Events.emit('ui:renderEquipment', { onSwitchWeapon: switchWeapon, onSwitchArmor: switchArmor })
// Let's check `inventory/equip` usages
code = code.replace(/UI\.renderEquipment\(([^,]+),\s*([^)]+)\)/g, "Events.emit('ui:renderEquipment', { onSwitchWeapon: $1, onSwitchArmor: $2 })");

// Catch any remaining UI. usages to warn
const remaining = code.match(/UI\.\w+/g) || [];
console.log('Remaining UI. calls:', new Set(remaining));

fs.writeFileSync(gamePath, code, 'utf8');
console.log('Done refactoring UI. calls in game.js');
