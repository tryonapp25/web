// PaymentMethodModal.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/PaymentMethodModal.module.css";

export default function PaymentMethodModal({
  open,
  onClose,
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

  if (!mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleAnimationEnd = () => {
    if (!open) setMounted(false);
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
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headText}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <button
            className={styles.payNowBtn}
            onClick={handlePayNow}
            aria-label="Pay now"
          >
            <span className={styles.btnTitle}>Pay now</span>
            <span className={styles.btnDesc}>
              Pay immediately using online payment.
            </span>
          </button>

          {/* PAYMENT ICONS */}
          <div className={styles.paymentIcons}>
            <img src="/payment_images/visa_card.png" alt="Visa" />
            <img src="/payment_images/master_card.png" alt="Mastercard" />
            <img style={{ borderRadius:"2px" }} src="/payment_images/mobile_pay.png" alt="MobilePay" />
            <img src="/payment_images/apple_pay.png" alt="Apple Pay" />
            <img src="/payment_images/google_pay.png" alt="Google Pay" />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}