import React, { useEffect, useState, useRef, Suspense } from "react";
const Lottie = React.lazy(() => import("lottie-react"));

import emailIcon from "../assets/lottiefiles/email.json";
import emailsent from "../assets/lottiefiles/sunrise.json";
import { t } from "i18next";

export default function SendToMailPopup() {
  const hasShown = useRef(false);
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);

    try {
      // TODO: real API call here
      console.log("Sending receipt to:", email);
      await new Promise((r) => setTimeout(r, 900)); // simulate network
      setSent(true);
    } catch (err) {
      console.error(err);
      // optionally: show error message to user
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    if (sessionStorage.getItem("sendToMail")) {
      return;
    }

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("sendToMail", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {!sent ? (
          <>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>
              ×
            </button>

            <div style={styles.iconWrapper}>
              <Suspense fallback={<div style={styles.iconFallback} />}>
                <Lottie
                  animationData={emailIcon}
                  loop
                  autoplay
                  style={styles.lottie}
                />
              </Suspense>
            </div>

            <h2 style={styles.title}>Email Receipt</h2>
            <p style={styles.subtitle}>
              Enter your email address to receive a copy of your receipt.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                autoFocus
              />

              <button
                type="submit"
                style={{
                  ...styles.btn,
                  opacity: email.trim() && !sending ? 1 : 0.6,
                  cursor: email.trim() && !sending ? "pointer" : "not-allowed",
                }}
                disabled={!email.trim() || sending}
              >
                {sending ? "Sending…" : "Send Receipt"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={styles.iconWrapper}>
              <Suspense fallback={<div style={styles.iconFallback} />}>
                <Lottie
                  animationData={emailsent}
                  loop
                  autoplay
                  style={styles.lottie}
                />
              </Suspense>
            </div>

            <h2 style={styles.title}>Sent Successfully</h2>
            <p style={styles.subtitle}>
              Your receipt has been sent to <strong>{email}</strong>
            </p>

            <button style={styles.btn} onClick={() => setOpen(false)}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "28px 24px",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  },

  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "28px",
    color: "#999",
    cursor: "pointer",
    lineHeight: 1,
  },

  iconWrapper: {
    margin: "0 auto 20px",
  },

  lottie: {
    width: 88,
    height: 88,
    margin: "0 auto",
  },

  iconFallback: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "#f0f0f0",
    margin: "0 auto",
  },

  title: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },

  subtitle: {
    fontSize: "15px",
    color: "#555",
    margin: "0 0 24px 0",
    lineHeight: 1.45,
  },

  input: {
    width: "100%",
    padding: "13px 16px",
    fontSize: "16px",
    border: "1px solid #d0d0d0",
    borderRadius: "10px",
    marginBottom: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },

  btn: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    background: "#111111",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};