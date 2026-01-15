import { useEffect } from "react";
import styles from "../styles/LoadingModal.module.css";

export default function LoadingModal({
  open,
  title = "Processing…",
  subtitle = "Please wait a moment.",
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.spinner} aria-label="Loading" />
        <div className={styles.text}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
