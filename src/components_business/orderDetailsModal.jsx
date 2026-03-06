import { useEffect } from "react";
import styles from "../styles/OrderDetailsModal.module.css";
import OrderCardDetails from "./orderCardDetails"; // adjust path if needed

export default function OrderDetailsModal({ open, order, onClose, onReady, onComplete }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
        onClick={stop}
      >
        <div className={styles.topBar}>
          <div className={styles.title}>
            Order <span className={styles.orderId}>#{order?.id}</span>
          </div>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {order ? (
            <OrderCardDetails order={order} />
          ) : (
            <div className={styles.empty}>No order selected</div>
          )}
        </div>

        {/* Ready Button - Always visible */}
        {order?.status !== "READY" ?
          <div className={styles.actions}>
            <button 
              className={styles.readyBtn} 
              onClick={() => onReady?.(order)}
            >
              Ready
            </button>
          </div>
          :
          <div className={styles.actions}>
            <button 
              className={styles.confirmedBtn} 
              onClick={() => onComplete?.(order)}
            >
              ✓ COMPLETED
            </button>
          </div>
        }
      </div>
    </div>
  );
}