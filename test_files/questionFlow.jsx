import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/UserProfile.module.css";
import { useNavigate } from "react-router-dom";

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function QuestionFlow({
  title = "UserProfile",
  questions = [],
  onFinish,
  loading = false,
  durationSec = null, // set null if you don't want timer
}) {
  const navigate = useNavigate();

  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationSec);

  const q = questions[index];
  const progressPct = Math.round(((index + 1) / Math.max(total, 1)) * 100);

  // Timer (optional)
  useEffect(() => {
    if (durationSec == null) return;
    setTimeLeft(durationSec);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [durationSec]);

  const currentValue = useMemo(() => answers[q?.id], [answers, q?.id]);

  function goBack() {
    if (index > 0) setIndex((i) => i - 1);
    else navigate(-1);
  }

  function setValue(val) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  }

  function toggleMulti(option) {
    const mapped = q.mapValue ? q.mapValue(option) : option;

    const arr = Array.isArray(currentValue) ? currentValue : [];
    const exists = arr.includes(mapped);

    const next = exists
      ? arr.filter((x) => x !== mapped)
      : [...arr, mapped];

    setValue(next);
  }


  function isValid() {
    if (!q) return false;

    if (!q.required) return true;

    if (q.type === "single") return currentValue != null && currentValue !== "";
    if (q.type === "multi") return Array.isArray(currentValue) && currentValue.length > 0;
    if (q.type === "number") return currentValue !== "" && currentValue != null && Number.isFinite(Number(currentValue));

    return true;
  }

  function next() {
    if (!isValid()) return;

    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }

    // finish
    const mapped = mapAnswers(questions, answers);
    onFinish?.(mapped);
  }

  function skip() {
    if (q?.required) return;
    if (index < total - 1) setIndex((i) => i + 1);
    else onFinish?.(mapAnswers(questions, answers));
  }

  if (!q) {
    return (
      <div className={styles.content}>
        <div className={styles.question}>No questions provided.</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className={styles.headerRow}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Back">
          <span className={styles.backIcon}>‹</span>
        </button>

        <div className={styles.headerTitle}>{title}</div>

        {durationSec != null ? (
          <div className={styles.timer}>
            <span className={styles.timerIcon}>⏱</span>
            <span className={styles.timerText}>{formatTime(timeLeft ?? durationSec)}</span>
          </div>
        ) : (
          <div className={styles.timerSpacer} />
        )}
      </div>

      {/* Progress */}
      <div className={styles.progressTrack} aria-label="Progress">
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.smallMeta}>
          Questions {index + 1} of {total}
        </div>

        <h1 className={styles.question}>{q.question}</h1>

        <div className={styles.options}>
          {q.type === "single" &&
            q.options?.map((opt) => {
              const selected = currentValue === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                  onClick={() => setValue(q.mapValue ? q.mapValue(opt) : opt)}
                  aria-pressed={selected}
                >
                  <span className={styles.optionText}>{opt}</span>
                  {selected ? (
                    <span className={styles.checkWrap} aria-hidden="true">
                      <span className={styles.checkCircle}>✓</span>
                    </span>
                  ) : (
                    <span className={styles.radio} aria-hidden="true" />
                  )}
                </button>
              );
            })}

          {q.type === "multi" &&
            q.options?.map((opt) => {
              const selected = Array.isArray(currentValue) && currentValue.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                  onClick={() => toggleMulti(opt)}
                  aria-pressed={selected}
                >
                  <span className={styles.optionText}>{opt}</span>
                  {selected ? (
                    <span className={styles.checkWrap} aria-hidden="true">
                      <span className={styles.checkCircle}>✓</span>
                    </span>
                  ) : (
                    <span className={styles.radio} aria-hidden="true" />
                  )}
                </button>
              );
            })}

          {q.type === "number" && (
            <div className={styles.numberWrap}>
              <input
                className={styles.input}
                type="number"
                value={currentValue ?? ""}
                placeholder={q.placeholder || ""}
                min={q.min}
                max={q.max}
                onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                autoFocus
              />
              <div className={styles.numberHint}>
                {q.min != null || q.max != null ? `Range: ${q.min ?? "–"} to ${q.max ?? "–"}` : ""}
              </div>
            </div>
          )}

          {!isValid() && q.required && (
            <div className={styles.error}>Please select/enter an answer to continue.</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.nextBtn}
          onClick={next}
          disabled={loading || !isValid()}
        >
          {index === total - 1 ? (loading ? "Generating…" : "Finish") : "Next"}{" "}
          <span className={styles.arrow}>→</span>
        </button>

        <div className={styles.footerRow}>
          {!q.required && (
            <button type="button" className={styles.skipBtn} onClick={skip} disabled={loading}>
              Skip
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function mapAnswers(questions, rawAnswers) {
  // keeps ids stable + optional per-question mapping
  const out = {};
  for (const q of questions) {
    const val = rawAnswers[q.id];
    out[q.id] = val;
  }
  return out;
}
