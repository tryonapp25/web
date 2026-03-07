let audioCtx = null;

export async function unlockSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    // play a tiny silent sound to unlock audio
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    gain.gain.value = 0.0001;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.01);

    return audioCtx;
  } catch (err) {
    console.error("Audio unlock failed:", err);
    return null;
  }
}