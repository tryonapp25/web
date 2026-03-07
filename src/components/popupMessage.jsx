import React, { useEffect } from "react";
import { unlockSound } from "../utils/sound";

export default function PopupMessage({open, onClose}) {

  useEffect(() => {
    if (!open) return;
    playSound();
    vibrateDevice();
  }, [open]);

  const playSound = async () => {
    try {
      const audio = new Audio("/sounds/order-ready.mp3");
      audio.volume = 0.8;
      await audio.play();
    } catch (e) {
      console.error("Sound failed:", e);
      playAlert();
    }
  };

  const vibrateDevice = () => {
    try {
      if ("vibrate" in navigator) {
        // Vibrate, pause, vibrate
        navigator.vibrate([250, 120, 250]);
      }
    } catch (e) {
      console.error("Vibration failed:", e);
    }
  };



  const playAlert = async () => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const notes = [880, 988, 880];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.08;

        osc.connect(gain);
        gain.connect(ctx.destination);

        const start = ctx.currentTime + i * 0.22;
        const end = start + 0.16;

        osc.start(start);
        osc.stop(end);
      });
    } catch (e) {
      console.error("Sound failed:", e);
    }
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.iconWrap}>
          <div style={styles.icon}>✅</div>
        </div>

        <h1 style={styles.title}>Order is Ready!</h1>
        <p style={styles.text}>
          Your order is ready for pickup.
          <br />
          Please come to the counter.
        </p>

        <div style={styles.buttonRow}>
          <button style={styles.primaryButton} onClick={() => {unlockSound().then(() => onClose())}}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

const pulse = {
  animation: "pulse 1.4s ease-in-out infinite",
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    padding: "20px",
  },
  popup: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    transform: "scale(1)",
    animation: "popIn 0.25s ease-out",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  icon: {
    width: "92px",
    height: "92px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(34, 197, 94, 0.35)",
    ...pulse,
  },
  title: {
    margin: "0 0 12px",
    fontSize: "36px",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#111827",
  },
  text: {
    margin: "0 0 24px",
    fontSize: "20px",
    lineHeight: 1.5,
    color: "#374151",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
  },
  primaryButton: {
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700,
    padding: "14px 28px",
    borderRadius: "14px",
    cursor: "pointer",
  },
};

// Add this once in your app, for example in index.html or with a style tag
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
`;
if (!document.getElementById("order-ready-popup-styles")) {
  styleTag.id = "order-ready-popup-styles";
  document.head.appendChild(styleTag);
}