import React, { useEffect, useState, useRef } from "react";

export default function SendToMailPopup() {
  const startRef = useRef(false);
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);

    try {
      // TODO: connect to backend
      console.log("Send to email:", email);

      await new Promise((r) => setTimeout(r, 800)); // fake delay

      setSent(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (startRef.current) return;
    startRef.current = true;
    const existing = sessionStorage.getItem("sendToMail");
    if (existing) {
      setOpen(false);
      return;
    }
    sessionStorage.setItem("sendToMail", "true");
  }, []);

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes popIn {
          from { opacity:0; transform:scale(0.92); }
          to { opacity:1; transform:scale(1); }
        }
      `}</style>

      <div style={styles.popup}>
        {!sent ? (
          <>
            <button style={styles.close} onClick={() => setOpen(false)}>
              ×
            </button>

            <div style={styles.icon}>📧</div>

            <h2 style={styles.title}>Send receipt to Email</h2>
            <p style={styles.text}>
              Enter your email to receive your receipt.
            </p>

            <form onSubmit={sendEmail}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />

              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: email ? 1 : 0.5,
                  cursor: email ? "pointer" : "not-allowed",
                }}
                disabled={!email || loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ ...styles.icon, background: "#22c55e" }}>✅</div>

            <h2 style={styles.title}>Email Sent</h2>
            <p style={styles.text}>
              Your order details were sent successfully.
            </p>

            <button style={styles.button} onClick={() => setOpen(false)}>
              Close
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
    background: "rgba(0, 0, 0, 0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },

  popup: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "22px",
    padding: "32px 24px",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
    animation: "popIn .25s ease",
    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
  },

  close: {
    position: "absolute",
    top: "10px",
    right: "14px",
    border: "none",
    background: "transparent",
    fontSize: "26px",
    cursor: "pointer",
  },

  icon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    fontSize: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },

  title: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#111",
  },

  text: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#555",
  },

  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginBottom: "16px",
    outline: "none",
  },

  button: {
    width: "100%",
    border: "none",
    background: "#111",
    color: "#fff",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "12px",
    fontWeight: "600",
  },
};