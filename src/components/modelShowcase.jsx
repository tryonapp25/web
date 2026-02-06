import React, { useEffect, useState } from "react";
import styles from "../styles/modelShowcase.module.css";
import Model3D from "./3dModel";



export default function ModelShowcase({
  open,
  onClose,
  item
}) {
  const [mounted, setMounted] = useState(open);
  // mount/unmount for fade animation
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!mounted) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mounted, onClose]);

  // lock scroll
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

  return (
    <div
      className={`${styles.overlay} ${
        open ? styles.overlayIn : styles.overlayOut
      }`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={styles.stageWrapper}
      >
        <div className={styles.stage}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <Model3D model={item?.data?.model} config={item?.config}/>
          <div className={styles.info}>
            <p>{item?.data?.title} : </p>
            <p>- {item?.data?.description}</p>
          </div>
          <div className={styles.glow} />
        </div>
      </div>
    </div>
  );
}
