import React from "react";
import styles from "../styles/Waitlist.module.css";

function AnimatedNumber({ value, duration = 450 }) {
  const [display, setDisplay] = React.useState(value ?? 0);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof value !== "number") return;

    const start = display;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(start + (end - start) * eased));

      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export default function WaitlistCard({
  count = 0,
  live = false,
  label = "Waitlist",
  title = "Live total waiting",
  subtitle = "People are lining up for early access.",
}) {
  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.top}>
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.title}>
            <span
              className={styles.liveDot}
              data-live={live ? "1" : "0"}
              aria-hidden="true"
            />
            {title}
          </div>
        </div>

        <div className={styles.pill}>
          <span className={styles.pulse} aria-hidden="true" />
          Live
        </div>
      </div>

      <div className={styles.number}>
        <AnimatedNumber value={count} />
      </div>

      <div className={styles.sub}>{subtitle}</div>

      <div className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} />
      </div>
    </div>
  );
}
