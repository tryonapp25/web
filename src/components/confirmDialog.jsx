import { useEffect } from "react";
import styles from "../styles/ConfirmDialog.module.css";
import ActivityIndicator from "./activityIndicator";

export default function ConfirmDialog({
  open,
  title = "Delete item?",
  subtitle = "This action cannot be undone.",
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  onConfirm,
  variant = "primary", // danger | primary | success
  onCancel,
  loading = false
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={`${styles.confirm} ${styles[variant]}`}
            onClick={onConfirm}
          >
            {loading ? <ActivityIndicator/> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
