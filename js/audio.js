export const SoundManager = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let enabled = true;

  const playOsc = (freq, type, duration, vol = 0.1) => {
    if (!enabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const SFX = {
    click: () => playOsc(800, 'sine', 0.1),
    hover: () => playOsc(400, 'sine', 0.05, 0.05),
    error: () => { playOsc(150, 'sawtooth', 0.2); playOsc(100, 'sawtooth', 0.3); },
    success: () => { playOsc(600, 'sine', 0.1); setTimeout(() => playOsc(900, 'sine', 0.1), 100); },
    damage: () => playOsc(100, 'square', 0.2, 0.2),
    heal: () => playOsc(400, 'sine', 0.4, 0.1),
    punch: () => { playOsc(120, 'square', 0.1, 0.2); playOsc(80, 'sine', 0.15, 0.3); },
    shoot: () => { playOsc(800, 'sawtooth', 0.05, 0.1); playOsc(400, 'sawtooth', 0.1, 0.1); },
    death: () => {
      playOsc(200, 'sawtooth', 0.5);
      playOsc(150, 'sawtooth', 0.8);
      playOsc(100, 'sawtooth', 1.2);
    }
  };

  return {
    play: (id) => { if (SFX[id]) SFX[id](); },
    toggle: (v) => { enabled = v; if (!enabled) ctx.suspend(); else ctx.resume(); },
    isEnabled: () => enabled,
    init: () => {
      // Resume context on first user interaction to satisfy browser policies
      const unlock = () => { ctx.resume(); document.removeEventListener('click', unlock); };
      document.addEventListener('click', unlock);
    }
  };
})();
