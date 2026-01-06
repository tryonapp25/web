import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Questionnaire.module.css";
const STORAGE_KEY = "ai_style_answers_light_v1";

function clampNum(n, min, max) {
  if (Number.isNaN(n)) return n;
  return Math.min(max, Math.max(min, n));
}

function normalizeAnswersForSubmit(rawAnswers, questions) {
  const out = {};
  for (const q of questions) {
    const v = rawAnswers[q.id];

    if (
      v === undefined ||
      v === null ||
      v === "" ||
      (Array.isArray(v) && v.length === 0)
    ) {
      out[q.id] = v;
      continue;
    }

    if (q.type === "single") out[q.id] = q.mapValue ? q.mapValue(v) : v;
    else if (q.type === "multi") {
      if (!Array.isArray(v)) out[q.id] = [];
      else if (q.mapValue) {
        out[q.id] = v.flatMap((label) => {
          const mv = q.mapValue(label);
          return Array.isArray(mv) ? mv : [mv];
        });
      } else out[q.id] = v;
    } else if (q.type === "number") out[q.id] = Number(v);
    else out[q.id] = v;
  }
  return out;
}

function useTypingEffect(text, speedMs = 10) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speedMs);
    return () => clearInterval(t);
  }, [text, speedMs]);
  return shown;
}

export default function Questionnaire({
  onSubmit,
  title = "User profile",
  subtitle = "Answer a few quick questions so I can personalize your outfit suggestions.",
  QUESTIONS
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const q = QUESTIONS[index];
  const typed = useTypingEffect(q.question, 10);

  // load saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw));
    } catch {}
  }, []);

  // autosave
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  useEffect(() => {
    setError("");
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [index]);

  const total = QUESTIONS.length;
  const progress = useMemo(() => Math.round(((index + 1) / total) * 100), [index, total]);

  const value = answers[q.id];

  function validateCurrent() {
    if (!q.required) return true;
    const v = answers[q.id];
    if (q.type === "multi") return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && v !== "";
  }

  function next() {
    if (!validateCurrent()) {
      setError("Please answer this question to continue.");
      return;
    }
    if (index === total - 1) {
      onSubmit?.(normalizeAnswersForSubmit(answers, QUESTIONS));
      return;
    }
    setIndex((i) => i + 1);
  }

  function back() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function skip() {
    if (q.required) return;
    if (index === total - 1) {
      onSubmit?.(normalizeAnswersForSubmit(answers, QUESTIONS));
      return;
    }
    setIndex((i) => i + 1);
  }

  function setSingle(opt) {
    setAnswers((p) => ({ ...p, [q.id]: opt }));
    setError("");
  }

  function toggleMulti(opt) {
    setAnswers((p) => {
      const arr = Array.isArray(p[q.id]) ? p[q.id] : [];
      const active = arr.includes(opt);
      return { ...p, [q.id]: active ? arr.filter((x) => x !== opt) : [...arr, opt] };
    });
    setError("");
  }

  function setNumber(val) {
    // allow empty while typing
    if (val === "") {
      setAnswers((p) => ({ ...p, [q.id]: "" }));
      return;
    }

    // allow partial typing
    if (Number.isNaN(Number(val))) return;

    setAnswers((p) => ({ ...p, [q.id]: val }));
  }

  // keyboard Enter -> next
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, answers]);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.brandRow}>
              <div className={styles.aiDot} aria-hidden="true" />
              <h1 className={styles.title}>{title}</h1>
            </div>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <div className={styles.meta}>
            <span className={styles.step}>
              {index + 1} / {total}
            </span>
            <button
              className={styles.linkBtn}
              type="button"
              onClick={() => {
                setAnswers({});
                setIndex(0);
                try { localStorage.removeItem(STORAGE_KEY); } catch {}
              }}
            >
              Reset
            </button>
          </div>
        </header>

        <div className={styles.progress} aria-label="progress">
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressText}>
            {q.title} • {progress}%
          </div>
        </div>

        <main className={styles.card}>
          <div className={styles.aiRow}>
            <div className={styles.avatar} aria-hidden="true">
              AI
            </div>
            <div className={styles.bubble}>
              <div className={styles.bubbleTop}>
                <span className={styles.bubbleName}>AI Assistant</span>
                <span className={styles.badge}>
                  {q.required ? "Required" : "Optional"}
                </span>
              </div>

              <div className={styles.question}>
                {typed}
                <span className={styles.cursor} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className={styles.inputArea}>
            {q.type === "single" && (
              <div className={styles.grid}>
                {q.options.map((opt) => {
                  const active = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={styles.option}
                      data-active={active ? "1" : "0"}
                      onClick={() => setSingle(opt)}
                    >
                      <span className={styles.radio} aria-hidden="true" />
                      <span className={styles.optionText}>{opt}</span>
                      {active && <span className={styles.check}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "multi" && (
              <div className={styles.grid}>
                {q.options.map((opt) => {
                  const arr = Array.isArray(value) ? value : [];
                  const active = arr.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={styles.option}
                      data-active={active ? "1" : "0"}
                      onClick={() => toggleMulti(opt)}
                    >
                      <span className={styles.checkbox} aria-hidden="true" />
                      <span className={styles.optionText}>{opt}</span>
                      {active && <span className={styles.check}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "number" && (
              <div className={styles.numberRow}>
                <input
                  ref={inputRef}
                  className={styles.input}
                  type="number"
                  inputMode="numeric"
                  min={q.min}
                  max={q.max}
                  placeholder={q.placeholder}
                  value={value ?? ""}              // ✅ string only
                  onChange={(e) => setNumber(e.target.value)} // ✅ raw value
                />
                <div className={styles.helper}>
                  Range: {q.min} – {q.max}
                </div>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={back}
                disabled={index === 0}
              >
                Back
              </button>

              <div className={styles.rightActions}>
                {!q.required && (
                  <button type="button" className={styles.linkBtn} onClick={skip}>
                    Skip
                  </button>
                )}

                <button type="button" className={styles.btnPrimary} onClick={next}>
                  {index === total - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <span className={styles.footerText}>
            Answers autosave locally • Press Enter to go next
          </span>
        </footer>
      </div>
    </div>
  );
}
