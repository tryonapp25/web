import React, { useState, useRef, useEffect } from "react";

export default function RatingModal() {
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hovered || rating;

  

  const getMessage = () => {
    if (rating >= 5) return "Amazing — thank you!";
    if (rating >= 4) return "Great — glad it felt smooth.";
    if (rating >= 3) return "Thanks — we can still improve.";
    if (rating >= 1) return "Thanks — your feedback helps a lot.";
    return "Rate your experience";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      rating,
      note,
    };

    console.log("Order flow feedback:", payload);
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={styles.popup}>
        {!submitted ? (
          <>
            <button style={styles.closeButton} onClick={() => setOpen(false)}>
              ×
            </button>

            <div style={styles.iconWrap}>
              <div style={styles.icon}>⭐</div>
            </div>

            <h2 style={styles.title}>What do you think about the order flow?</h2>
            <p style={styles.text}>
              Was it easy to order and follow the status of your order?
            </p>

            <div style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= activeRating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      ...styles.starButton,
                      transform: active ? "scale(1.08)" : "scale(1)",
                    }}
                    aria-label={`Rate ${star} stars`}
                  >
                    <span
                      style={{
                        ...styles.star,
                        color: active ? "#f59e0b" : "#d1d5db",
                        animation: active ? "starPop 0.2s ease" : "none",
                      }}
                    >
                      ★
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={styles.message}>{getMessage()}</div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a short comment..."
              style={styles.textarea}
            />

            <div style={styles.buttonRow}>
              <button style={styles.secondaryButton} onClick={() => setOpen(false)}>
                Later
              </button>
              <button
                style={{
                  ...styles.primaryButton,
                  opacity: rating ? 1 : 0.5,
                  cursor: rating ? "pointer" : "not-allowed",
                }}
                onClick={handleSubmit}
                disabled={!rating}
              >
                Send Feedback
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.iconWrap}>
              <div style={{ ...styles.icon, background: "#22c55e" }}>✅</div>
            </div>

            <h2 style={styles.title}>Thank you!</h2>
            <p style={styles.text}>
              Your feedback has been sent successfully.
            </p>

            <button style={styles.primaryButton} onClick={() => setOpen(false)}>
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
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    animation: "popIn 0.25s ease-out",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "999px",
    background: "#f3f4f6",
    color: "#111827",
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "14px",
  },
  icon: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    background: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(245, 158, 11, 0.35)",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "30px",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#111827",
  },
  text: {
    margin: "0 0 20px",
    fontSize: "18px",
    lineHeight: 1.5,
    color: "#4b5563",
  },
  starsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  starButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px",
  },
  star: {
    fontSize: "42px",
    lineHeight: 1,
    display: "inline-block",
    transition: "all 0.15s ease",
  },
  message: {
    minHeight: "24px",
    marginBottom: "16px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    resize: "vertical",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    padding: "14px",
    fontSize: "16px",
    outline: "none",
    marginBottom: "18px",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: "17px",
    fontWeight: 700,
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    fontSize: "17px",
    fontWeight: 700,
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
  },
};