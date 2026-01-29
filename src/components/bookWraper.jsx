import React, { useRef, useState } from "react";
import styles from "../styles/BookWraper.module.css";

export default function BookWraper({ data = [], children }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flipDir, setFlipDir] = useState(null); // "next" | "prev" | null
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  const startX = useRef(0);
  const pointerId = useRef(null);
  const areaRef = useRef(null);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const canNext = index < data.length - 1;
  const canPrev = index > 0;

  // Expect exactly one child renderer: <Template />
  const TemplateEl = React.Children.only(children);

  const renderTemplate = (pageData) => {
    if (!React.isValidElement(TemplateEl)) return null;
    return React.cloneElement(TemplateEl, {
      data: pageData,
      page: pageData,
      index,
    });
  };

  const begin = (e) => {
    if (animating) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    pointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;

    setDragging(true);
    setFlipDir(null);
    setProgress(0);
  };

  const move = (e) => {
    if (!dragging || pointerId.current !== e.pointerId) return;

    const rect = areaRef.current.getBoundingClientRect();
    const dx = e.clientX - startX.current;

    if (!flipDir && Math.abs(dx) > 5) {
      if (dx < 0 && canNext) setFlipDir("next");
      if (dx > 0 && canPrev) setFlipDir("prev");
    }
    if (!flipDir) return;

    const p = clamp(Math.abs(dx) / (rect.width * 0.6), 0, 1);
    setProgress(p);
  };

  const end = () => {
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
        pointerId.current = null;
      }
    };

    requestAnimationFrame(tick);
  };

  const angle =
    flipDir === "next" ? -progress * 180 : flipDir === "prev" ? progress * 180 : 0;

  const underIndex =
    flipDir === "next"
      ? clamp(index + 1, 0, data.length - 1)
      : flipDir === "prev"
      ? clamp(index - 1, 0, data.length - 1)
      : index;

  if (!data.length) return null;

  // subtle tilt while dragging for more “physical” feel
  const bookTilt = dragging ? (flipDir === "next" ? -6 : 6) * progress : 0;

  // dynamic shadow while flipping
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
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div className={styles.coverOuter}>
          <div className={styles.coverInner}>
            {/* Fixed rings (DO NOT flip) */}
            <p className={styles.pageNumber}>{index + 1} / {data.length}</p>

            {/* Under page */}
            <div className={styles.pageUnder}>
              {renderTemplate(data[underIndex])}
            </div>

            {/* Flipping page */}
            <div
              className={`${styles.pageFlip} ${dragging ? styles.dragging : ""}`}
              style={{
                transformOrigin: flipDir === "next" ? "0% 50%" : "100% 50%",
                transform: `rotateY(${angle}deg)`,
                boxShadow: flipShadow,
              }}
            >
              {/* thickness */}
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
