function playNewOrderSound() {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio("/sounds/new-notification.mp3"); // file in public folder
    audio.volume = 0.8;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch((err) => {
        const msg = err && err.message ? err.message : String(err);
        const autoplayBlocked = /didn't interact|user gesture|play\(\) failed/i.test(msg);
        if (autoplayBlocked) {
          // Defer playing until the next user interaction (click/keydown/touchstart)
          const tryPlay = () => {
            try {
              audio.play().catch((e) => {
                console.error('playNewOrderSound: deferred play failed', e);
              });
            } finally {
              window.removeEventListener('click', tryPlay);
              window.removeEventListener('keydown', tryPlay);
              window.removeEventListener('touchstart', tryPlay);
            }
          };
          // Use passive one-time listeners where supported
          window.addEventListener('click', tryPlay, { once: true });
          window.addEventListener('keydown', tryPlay, { once: true });
          window.addEventListener('touchstart', tryPlay, { once: true });
        } else {
          console.error("playNewOrderSound: play prevented or failed:", err);
        }
      });
    }
  } catch (err) {
    console.error("playNewOrderSound: failed to play sound", err);
  }
}

export default playNewOrderSound;