const PATTERNS = {
  tap: [{ frequency: 440, duration: 0.035, gain: 0.035 }],
  correct: [
    { frequency: 660, duration: 0.06, gain: 0.055 },
    { frequency: 880, duration: 0.08, gain: 0.05, delay: 0.055 },
  ],
  wrong: [
    { frequency: 220, duration: 0.08, gain: 0.045 },
    { frequency: 180, duration: 0.1, gain: 0.035, delay: 0.07 },
  ],
  streak: [
    { frequency: 740, duration: 0.06, gain: 0.055 },
    { frequency: 988, duration: 0.07, gain: 0.05, delay: 0.055 },
    { frequency: 1175, duration: 0.09, gain: 0.045, delay: 0.12 },
  ],
  level: [
    { frequency: 523, duration: 0.07, gain: 0.05 },
    { frequency: 659, duration: 0.07, gain: 0.05, delay: 0.07 },
    { frequency: 784, duration: 0.12, gain: 0.045, delay: 0.14 },
  ],
  finish: [
    { frequency: 392, duration: 0.08, gain: 0.05 },
    { frequency: 523, duration: 0.08, gain: 0.05, delay: 0.08 },
    { frequency: 659, duration: 0.08, gain: 0.05, delay: 0.16 },
    { frequency: 1047, duration: 0.16, gain: 0.045, delay: 0.25 },
  ],
};

function getAudioContextClass() {
  return globalThis.AudioContext || globalThis.webkitAudioContext || null;
}

export function createSoundController({ AudioContextClass = getAudioContextClass() } = {}) {
  let enabled = true;
  let context = null;

  function ensureContext() {
    if (!AudioContextClass) return null;
    if (!context) context = new AudioContextClass();
    if (typeof context.resume === "function") context.resume();
    return context;
  }

  function playTone(audioContext, tone) {
    const startAt = audioContext.currentTime + (tone.delay || 0);
    const stopAt = startAt + tone.duration;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = tone.type || "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(tone.gain, startAt + 0.012);
    gain.gain.linearRampToValueAtTime(0.0001, stopAt);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(stopAt + 0.02);
  }

  return {
    isAvailable() {
      return Boolean(AudioContextClass);
    },
    isEnabled() {
      return enabled;
    },
    setEnabled(value) {
      enabled = Boolean(value);
    },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    play(name) {
      if (!enabled) return;
      const audioContext = ensureContext();
      if (!audioContext) return;
      const pattern = PATTERNS[name] || PATTERNS.tap;
      pattern.forEach((tone) => playTone(audioContext, tone));
    },
  };
}
