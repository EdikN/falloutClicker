export const SoundManager = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let enabled = true;
  let systemMuted = false;
  let bgmOsc1 = null, bgmOsc2 = null, lfo = null, bgmGain = null;
  let melodyTimer = null;

  const startBGM = () => {
    if (bgmOsc1 || !enabled || systemMuted) return;
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.05;
    bgmGain.connect(ctx.destination);

    bgmOsc1 = ctx.createOscillator();
    bgmOsc1.type = 'sine';
    bgmOsc1.frequency.value = 55; // Low drone (A1)

    bgmOsc2 = ctx.createOscillator();
    bgmOsc2.type = 'triangle';
    bgmOsc2.frequency.value = 56; // Detune

    // Low Frequency Oscillator for pulsing volume
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Slow eerie pulse
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04; // modulate volume +/- 0.04

    lfo.connect(lfoGain);
    lfoGain.connect(bgmGain.gain);

    bgmOsc1.connect(bgmGain);
    bgmOsc2.connect(bgmGain);

    bgmOsc1.start();
    bgmOsc2.start();
    lfo.start();

    if (!melodyTimer) startMelody();
  };

  const startMelody = () => {
    if (!enabled || systemMuted) return;
    // Spooky minor/diminished notes: A3, Bb3, C4, Eb4, E3, F3
    const notes = [220.00, 233.08, 261.63, 311.13, 164.81, 174.61];
    const note = notes[Math.floor(Math.random() * notes.length)];

    // Play the note with a soft sine wave, louder now
    playOsc(note, 'sine', 2.8, 0.04 + Math.random() * 0.02);

    // Play a second harmonious or dissonant note more reliably
    if (Math.random() < 0.6) {
      setTimeout(() => {
        const note2 = notes[Math.floor(Math.random() * notes.length)];
        playOsc(note2, 'sine', 2.0, 0.03);
      }, 400 + Math.random() * 400);
    }

    melodyTimer = setTimeout(startMelody, 2500 + Math.random() * 3500);
  };

  const stopBGM = () => {
    if (bgmOsc1) {
      bgmOsc1.stop(); bgmOsc2.stop(); lfo.stop();
      bgmOsc1 = null; bgmOsc2 = null; lfo = null;
    }
    if (melodyTimer) {
      clearTimeout(melodyTimer);
      melodyTimer = null;
    }
  };

  const playOsc = (freq, type, duration, vol = 0.1) => {
    if (!enabled || systemMuted) return;
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
    toggle: (v) => {
      enabled = v;
      if (!enabled || systemMuted) { stopBGM(); }
      else { if (ctx.state === 'running') startBGM(); }
    },
    systemMute: (muted) => {
      systemMuted = muted;
      if (systemMuted || !enabled) {
        if (ctx.state === 'running') ctx.suspend();
        stopBGM();
      }
      else {
        if (ctx.state === 'suspended') ctx.resume();
        startBGM();
      }
    },
    isEnabled: () => enabled,
    init: () => {
      // Resume context on first user interaction to satisfy browser policies
      const unlock = () => {
        ctx.resume();
        startBGM();
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('click', unlock);
    }
  };
})();
