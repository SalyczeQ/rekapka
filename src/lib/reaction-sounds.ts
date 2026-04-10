let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playPop() {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

const EMOJI_SOUNDS: Record<string, () => void> = {
  fire: () => {
    playTone(800, 0.12, "sawtooth", 0.1);
    setTimeout(() => playTone(1000, 0.08, "sawtooth", 0.08), 60);
  },
  laugh: () => {
    playTone(500, 0.08, "sine", 0.12);
    setTimeout(() => playTone(600, 0.08, "sine", 0.1), 80);
    setTimeout(() => playTone(500, 0.06, "sine", 0.08), 160);
  },
  skull: () => {
    playTone(200, 0.15, "triangle", 0.12);
    setTimeout(() => playTone(150, 0.2, "triangle", 0.08), 100);
  },
  clap: () => {
    playPop();
  },
  beer: () => {
    playTone(400, 0.06, "sine", 0.12);
    setTimeout(() => playTone(500, 0.06, "sine", 0.1), 70);
    setTimeout(() => playTone(600, 0.08, "sine", 0.12), 140);
  },
  thumbsdown: () => {
    playTone(400, 0.1, "triangle", 0.12);
    setTimeout(() => playTone(250, 0.15, "triangle", 0.1), 80);
  },
  love: () => {
    playTone(523, 0.1, "sine", 0.12);
    setTimeout(() => playTone(659, 0.12, "sine", 0.12), 100);
  },
  sleep: () => {
    playTone(300, 0.2, "sine", 0.08);
    setTimeout(() => playTone(250, 0.25, "sine", 0.06), 200);
  },
};

export function playReactionSound(emoji: string) {
  const fn = EMOJI_SOUNDS[emoji];
  if (fn) fn();
}
