import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/BookWraper.module.css";

export default function BookWraperTemplate({ data = [], children }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flipDir, setFlipDir] = useState(null); // "next" | "prev" | null
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  const areaRef = useRef(null);

  // gesture tracking
  const isDown = useRef(false);
  const decided = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const canNext = index < data.length - 1;
  const canPrev = index > 0;

  const TemplateEl = React.Children.only(children);

  const renderTemplate = (pageData) => {
    if (!React.isValidElement(TemplateEl)) return null;
    return React.cloneElement(TemplateEl, {
      data: pageData,
      page: pageData,
      index,
    });
  };

  const underIndex =
    flipDir === "next"
      ? clamp(index + 1, 0, data.length - 1)
      : flipDir === "prev"
      ? clamp(index - 1, 0, data.length - 1)
      : index;

  const updateProgressFromDx = (dx) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (!flipDir && Math.abs(dx) > 5) {
      if (dx < 0 && canNext) setFlipDir("next");
      if (dx > 0 && canPrev) setFlipDir("prev");
    }
    if (!flipDir) return;

    const p = clamp(Math.abs(dx) / (rect.width * 0.6), 0, 1);
    setProgress(p);
  };

  const beginGesture = (x, y) => {
    if (animating) return;
    isDown.current = true;
    decided.current = false;
    startX.current = x;
    startY.current = y;
    lastX.current = x;

    setDragging(true);
    setFlipDir(null);
    setProgress(0);
  };

  const moveGesture = (x, y, nativeEvent) => {
    if (!isDown.current || !dragging) return;

    const dx = x - startX.current;
    const dy = y - startY.current;
    lastX.current = x;

    // decide once: horizontal vs vertical
    if (!decided.current) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;

      // Vertical intent -> cancel flipping, allow scroll
      if (Math.abs(dy) > Math.abs(dx)) {
        isDown.current = false;
        setDragging(false);
        setFlipDir(null);
        setProgress(0);
        return;
      }

      // Horizontal intent -> lock in flip
      decided.current = true;
    }

    // IMPORTANT: stop browser scrolling/back-swipe while flipping
    if (nativeEvent && typeof nativeEvent.preventDefault === "function") {
      nativeEvent.preventDefault();
    }

    updateProgressFromDx(dx);
  };

  const endGesture = () => {
    if (!dragging) return;

    const shouldTurn = progress > 0.33 && flipDir;
    setAnimating(true);

    const start = performance.now();
    const from = progress;
    const to = shouldTurn ? 1 : 0;
    const duration = 260;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const val = from + (to - from) * ease(t);
      setProgress(val);

      if (t < 1) requestAnimationFrame(tick);
      else {
        if (shouldTurn) {
          setIndex((i) =>
            flipDir === "next"
              ? clamp(i + 1, 0, data.length - 1)
              : clamp(i - 1, 0, data.length - 1)
          );
        }
        setProgress(0);
        setFlipDir(null);
        setDragging(false);
        setAnimating(false);
        isDown.current = false;
        decided.current = false;
      }
    };

    requestAnimationFrame(tick);
  };

  // ---- Desktop mouse support ----
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    beginGesture(e.clientX, e.clientY);
  };
  const onMouseMove = (e) => {
    if (!isDown.current) return;
    moveGesture(e.clientX, e.clientY, e);
  };
  const onMouseUp = () => endGesture();

  // ---- Mobile touch support (NON-PASSIVE MOVE!) ----
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (animating) return;
      const t = e.touches[0];
      beginGesture(t.clientX, t.clientY);
    };

    const onTouchMove = (e) => {
      if (!isDown.current) return;
      const t = e.touches[0];
      moveGesture(t.clientX, t.clientY, e);
    };

    const onTouchEnd = () => endGesture();
    const onTouchCancel = () => endGesture();

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    // KEY LINE: must be passive:false so preventDefault works
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [animating, dragging, flipDir, progress, canNext, canPrev]);

  if (!data.length) return null;

  const angle =
    flipDir === "next"
      ? -progress * 180
      : flipDir === "prev"
      ? progress * 180
      : 0;

  const bookTilt = dragging ? (flipDir === "next" ? -6 : 6) * progress : 0;

  const flipShadow = flipDir
    ? `${(flipDir === "next" ? -1 : 1) * (10 + progress * 30)}px 0 ${
        20 + progress * 80
      }px rgba(0,0,0,${0.18 + progress * 0.22})`
    : "0 0 0 rgba(0,0,0,0)";

  return (
    <div className={styles.stage}>
      <div
        ref={areaRef}
        className={styles.book}
        style={{ transform: `rotateX(8deg) rotateY(${bookTilt}deg)` }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className={styles.coverOuter}>

          <div className={styles.rings} aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={styles.ring} />
            ))}
          </div>
          <div className={styles.coverInner}>
            <p className={styles.pageNumber}>
              {index + 1} / {data.length}
            </p>

            <div className={styles.pageUnder}>
              {renderTemplate(data[underIndex])}
            </div>

            <div
              className={`${styles.pageFlip} ${dragging ? styles.dragging : ""}`}
              style={{
                transformOrigin: flipDir === "next" ? "0% 50%" : "100% 50%",
                transform: `rotateY(${angle}deg)`,
                boxShadow: flipShadow,
              }}
            >
              <div className={styles.pageEdge} />
              <div className={styles.front}>{renderTemplate(data[index])}</div>
              <div className={styles.back}>{renderTemplate(data[underIndex])}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
