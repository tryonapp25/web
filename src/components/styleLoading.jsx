import React from "react";
import styles from "../styles/StyleLoading.module.css";
import stylingIcon from "../assets/icons/stylingIcon.png"; // adjust path if needed

export default function StyleLoading({
  label = "AI is styling your UI…",
  sublabel = "Analyzing colors • Applying tokens • Polishing details",
  size = 96,
  visible = false
}) {
  if(visible) return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            <span className={styles.badgeText}>WORKING</span>
          </div>
        </div>

        <div className={styles.stage}>
          <div className={styles.iconFrame} style={{ width: size, height: size }}>
            <img
              src={stylingIcon}
              alt=""
              className={styles.icon}
              draggable="false"
            />
            <div className={styles.scan} />
            <div className={styles.glow} />
          </div>

          <div className={styles.text}>
            <div className={styles.labelRow}>
              <span className={styles.label}>{label}</span>
              <span className={styles.ellipsis} aria-hidden="true">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>

            <div className={styles.sublabel}>{sublabel}</div>

            <div className={styles.progress}>
              <div className={styles.bar} />
            </div>

            <div className={styles.chips} aria-hidden="true">
              <span className={styles.chip}>Contrast</span>
              <span className={styles.chip}>Spacing</span>
              <span className={styles.chip}>Typography</span>
              <span className={styles.chip}>Shadows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
