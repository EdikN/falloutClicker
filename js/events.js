export const EventEmitter = {
    events: {},
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    },
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listenerToRemove);
    },
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(data));
    }
};

// === ДОМЕННЫЕ СОБЫТИЯ ===
// «Швы», вдоль которых ядро (game.js) развязывается с новыми системами
// (метапрогрессия, онбординг, аналитика) без жёстких связей.
export const GameEvents = {
    DAY_PASSED: 'game:dayPassed',           // { day }
    COMBAT_ENDED: 'game:combatEnded',       // { win, enemy, reward }
    PLAYER_DIED: 'game:playerDied',         // payload итогов забега (см. RUN_ENDED)
    RUN_ENDED: 'game:runEnded',             // { day, reason, kills, storyChoices, eliteKills, humanity, resources, earned }
    META_POINTS_EARNED: 'meta:pointsEarned',// { memoryPoints, dnaFragments }
    STORY_FLAG_SET: 'story:flagSet',        // { flag }
    TUTORIAL_STEP_CHANGED: 'tutorial:stepChanged' // { step, target }
};
