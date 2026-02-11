// PaymentMethodModal.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/PaymentMethodModal.module.css";

export default function PaymentMethodModal({
  open,
  onClose,
  onPayInKasse,
  onPayNow,
  title = "Choose payment method",
  subtitle = "Select how you’d like to pay.",
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mounted, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleAnimationEnd = () => {
    if (!open) setMounted(false);
  };

  const handlePayAtCounter = () => {
    onPayAtCounter?.();
    onClose?.();
  };

  const handlePayNow = () => {
    onPayNow?.();
    onClose?.();
  };

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayIn : styles.overlayOut}`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Payment method modal"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headText}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <button
            className={styles.kasseBtn}
            onClick={handlePayAtCounter}
            aria-label="Pay at the counter"
          >
            <span className={styles.btnTitle}>Pay at the counter</span>
            <span className={styles.btnDesc}>Pay at the counter when you pick up.</span>
          </button>

          <button
            className={styles.payNowBtn}
            onClick={handlePayNow}
            aria-label="Pay now"
          >
            <span className={styles.btnTitle}>Pay now</span>
            <span className={styles.btnDesc}>Pay immediately using online payment.</span>
          </button>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} aria-label="Cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
