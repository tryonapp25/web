import React, { useMemo, useState } from "react";
import styles from "../styles/ProfileQuestionnaire.module.css";
import http from "../http/http";
import { useNavigate } from "react-router-dom";

const DEFAULTS = {
  user_id: "user_001",
  profile: {
    gender_style: "menswear",
    age: 28,
    height_cm: 175,
    weight_kg: 72,
    sizes: { top: "M", bottom: "32", shoes_eu: 42 },
    body_preferences: {
      fit_preference: "regular",
      avoid_fits: ["skinny"],
      comfort_priority: true,
    },
    style_interests: ["minimal", "smart casual"],
    color_preferences: {
      liked: ["black", "navy", "grey", "white"],
      disliked: ["bright yellow", "neon green"],
    },
    brand_preferences: {
      preferred: ["Zalando", "H&M", "Nike"],
      avoid: [],
    },
    budget: { currency: "EUR", max_per_item: 120, max_outfit: 300 },
  },
  today_context: {
    occasion: "office",
    activity_level: "light_walking",
    formality_level: 4,
    location: { country: "DK", city: "Copenhagen" },
    weather: { temperature_c: 6, condition: "rain", wind: true },
    time_of_day: "day",
  },
  constraints: {
    must_have: ["water_resistant_outerwear"],
    avoid: ["heavy_logo", "loud_patterns"],
  },
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function clampNumber(v, min, max) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  return Math.max(min, Math.min(max, n));
}

function setAtPath(obj, path, value) {
  const next = clone(obj);
  let ref = next;
  for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
  ref[path[path.length - 1]] = value;
  return next;
}

function Field({ label, children, hint }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.mtSm}>{children}</div>
      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function NumberInput({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      className={styles.input}
      type="number"
      value={value === "" ? "" : value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className={styles.input} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, labelOn = "Yes", labelOff = "No" }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      {checked ? labelOn : labelOff}
    </button>
  );
}

function Pill({ text, onRemove }) {
  return (
    <span className={styles.pill}>
      {text}
      <button type="button" className={styles.pillRemove} onClick={onRemove} aria-label={`Remove ${text}`}>
        ×
      </button>
    </span>
  );
}

function MultiInput({ label, placeholder, values, onChange, hint }) {
  const [draft, setDraft] = useState("");

  function add() {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!parts.length) return;
    const merged = Array.from(new Set([...(values || []), ...parts]));
    onChange(merged);
    setDraft("");
  }

  function removeAt(i) {
    const next = [...(values || [])];
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <div className={styles.stackSm}>
      <div className={styles.rowBetween}>
        <label className={styles.label}>{label}</label>
      </div>

      <div className={styles.row}>
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" className={styles.btnPrimary} onClick={add}>
          Add
        </button>
      </div>

      {hint ? <div className={styles.hint}>{hint}</div> : null}

      {!!(values || []).length && (
        <div className={styles.pillRow}>
          {(values || []).map((t, i) => (
            <Pill key={`${t}-${i}`} text={t} onRemove={() => removeAt(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.h2}>{title}</h2>
        {subtitle ? <p className={styles.muted}>{subtitle}</p> : null}
      </div>
      <div className={styles.stack}>{children}</div>
    </section>
  );
}

export default function ProfileQuestionnaire() {
  const [data, setData] = useState(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  function update(path, value) {
    setData((prev) => setAtPath(prev, path, value));
  }

  const result = useMemo(() => {
    const r = clone(data);

    // normalize a few numeric fields safely
    r.profile.age = clampNumber(r.profile.age, 10, 110);
    r.profile.height_cm = clampNumber(r.profile.height_cm, 120, 230);
    r.profile.weight_kg = clampNumber(r.profile.weight_kg, 35, 200);

    r.profile.sizes.shoes_eu = clampNumber(r.profile.sizes.shoes_eu, 30, 52);

    r.profile.budget.max_per_item = clampNumber(r.profile.budget.max_per_item, 0, 100000);
    r.profile.budget.max_outfit = clampNumber(r.profile.budget.max_outfit, 0, 100000);

    r.today_context.formality_level = clampNumber(r.today_context.formality_level, 1, 5);
    r.today_context.weather.temperature_c = clampNumber(r.today_context.weather.temperature_c, -30, 50);

    // ensure arrays
    const arrayPaths = [
      ["profile", "body_preferences", "avoid_fits"],
      ["profile", "style_interests"],
      ["profile", "color_preferences", "liked"],
      ["profile", "color_preferences", "disliked"],
      ["profile", "brand_preferences", "preferred"],
      ["profile", "brand_preferences", "avoid"],
      ["constraints", "must_have"],
      ["constraints", "avoid"],
    ];

    for (const p of arrayPaths) {
      let ref = r;
      for (let i = 0; i < p.length - 1; i++) ref = ref[p[i]];
      const k = p[p.length - 1];
      if (!Array.isArray(ref[k])) ref[k] = [];
    }

    return r;
  }, [data]);

  async function copyJSON() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.user_id || "user"}_profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setData(DEFAULTS);
  }

  const SendData = async () => {
    try{
      const res = await http.post(`/user/generate-serpApi-query`,{
        data: JSON.stringify(data)
      });
      if(res.data.success){
        navigate("/recommendationsPage", {
          state: {
            recommendations: res.data.data,
            usage: res.data.usage
          }
        });
        console.log(res.data.data);
      }
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Style Profile Questionnaire</h1>
            <p className={styles.muted}>Answer the questions → output JSON updates live.</p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={copyJSON}>
              {copied ? "Copied!" : "Copy JSON"}
            </button>
            <button type="button" className={styles.btnGhost} onClick={downloadJSON}>
              Download JSON
            </button>
            <button type="button" className={styles.btnGhost} onClick={reset}>
              Reset
            </button>
          </div>
        </header>

        <div className={styles.grid2}>
          {/* LEFT: QUESTIONS */}
          <div className={styles.stackLg}>
            <Section title="Basics" subtitle="Who is this profile for?">
              <Field label="User ID">
                <TextInput value={data.user_id} onChange={(v) => update(["user_id"], v)} placeholder="user_001" />
              </Field>

              <Field label="Gender style">
                <Select
                  value={data.profile.gender_style}
                  onChange={(v) => update(["profile", "gender_style"], v)}
                  options={[
                    { value: "menswear", label: "Menswear" },
                    { value: "womenswear", label: "Womenswear" },
                    { value: "unisex", label: "Unisex" },
                  ]}
                />
              </Field>

              <div className={styles.grid3}>
                <Field label="Age">
                  <NumberInput value={data.profile.age} onChange={(v) => update(["profile", "age"], v)} min={10} max={110} />
                </Field>
                <Field label="Height (cm)">
                  <NumberInput value={data.profile.height_cm} onChange={(v) => update(["profile", "height_cm"], v)} min={120} max={230} />
                </Field>
                <Field label="Weight (kg)">
                  <NumberInput value={data.profile.weight_kg} onChange={(v) => update(["profile", "weight_kg"], v)} min={35} max={200} />
                </Field>
              </div>
            </Section>

            <Section title="Sizes" subtitle="So recommendations fit you.">
              <div className={styles.grid3}>
                <Field label="Top size (e.g. S/M/L)">
                  <TextInput value={data.profile.sizes.top} onChange={(v) => update(["profile", "sizes", "top"], v)} placeholder="M" />
                </Field>
                <Field label="Bottom size (e.g. 32)">
                  <TextInput value={data.profile.sizes.bottom} onChange={(v) => update(["profile", "sizes", "bottom"], v)} placeholder="32" />
                </Field>
                <Field label="Shoes (EU)">
                  <NumberInput value={data.profile.sizes.shoes_eu} onChange={(v) => update(["profile", "sizes", "shoes_eu"], v)} min={30} max={52} />
                </Field>
              </div>
            </Section>

            <Section title="Fit & comfort" subtitle="How do you like clothes to feel?">
              <Field label="Fit preference">
                <Select
                  value={data.profile.body_preferences.fit_preference}
                  onChange={(v) => update(["profile", "body_preferences", "fit_preference"], v)}
                  options={[
                    { value: "slim", label: "Slim" },
                    { value: "regular", label: "Regular" },
                    { value: "relaxed", label: "Relaxed" },
                    { value: "oversized", label: "Oversized" },
                  ]}
                />
              </Field>

              <MultiInput
                label="Fits to avoid"
                placeholder="skinny, super slim"
                values={data.profile.body_preferences.avoid_fits}
                onChange={(v) => update(["profile", "body_preferences", "avoid_fits"], v)}
                hint="Tip: type multiple separated by commas, then press Enter."
              />

              <Field label="Comfort priority">
                <Toggle
                  checked={!!data.profile.body_preferences.comfort_priority}
                  onChange={(v) => update(["profile", "body_preferences", "comfort_priority"], v)}
                  labelOn="Yes"
                  labelOff="No"
                />
              </Field>
            </Section>

            <Section title="Style & preferences" subtitle="What do you like?">
              <MultiInput
                label="Style interests"
                placeholder="minimal, smart casual"
                values={data.profile.style_interests}
                onChange={(v) => update(["profile", "style_interests"], v)}
              />

              <MultiInput
                label="Liked colors"
                placeholder="black, navy, grey, white"
                values={data.profile.color_preferences.liked}
                onChange={(v) => update(["profile", "color_preferences", "liked"], v)}
              />

              <MultiInput
                label="Disliked colors"
                placeholder="bright yellow, neon green"
                values={data.profile.color_preferences.disliked}
                onChange={(v) => update(["profile", "color_preferences", "disliked"], v)}
              />

              <MultiInput
                label="Preferred brands"
                placeholder="Uniqlo, COS, Arket"
                values={data.profile.brand_preferences.preferred}
                onChange={(v) => update(["profile", "brand_preferences", "preferred"], v)}
              />

              <MultiInput
                label="Brands to avoid"
                placeholder="(optional)"
                values={data.profile.brand_preferences.avoid}
                onChange={(v) => update(["profile", "brand_preferences", "avoid"], v)}
              />

              <div className={styles.grid3}>
                <Field label="Currency">
                  <Select
                    value={data.profile.budget.currency}
                    onChange={(v) => update(["profile", "budget", "currency"], v)}
                    options={[
                      { value: "EUR", label: "EUR" },
                      { value: "DKK", label: "DKK" },
                      { value: "USD", label: "USD" },
                      { value: "GBP", label: "GBP" },
                    ]}
                  />
                </Field>

                <Field label="Max per item">
                  <NumberInput value={data.profile.budget.max_per_item} onChange={(v) => update(["profile", "budget", "max_per_item"], v)} min={0} />
                </Field>

                <Field label="Max outfit">
                  <NumberInput value={data.profile.budget.max_outfit} onChange={(v) => update(["profile", "budget", "max_outfit"], v)} min={0} />
                </Field>
              </div>
            </Section>

            <Section title="Today context" subtitle="Situation + weather.">
              <Field label="Occasion">
                <Select
                  value={data.today_context.occasion}
                  onChange={(v) => update(["today_context", "occasion"], v)}
                  options={[
                    { value: "office", label: "Office" },
                    { value: "casual", label: "Casual" },
                    { value: "date", label: "Date" },
                    { value: "event", label: "Event" },
                    { value: "travel", label: "Travel" },
                    { value: "outdoors", label: "Outdoors" },
                  ]}
                />
              </Field>

              <div className={styles.grid2Sm}>
                <Field label="Activity level">
                  <Select
                    value={data.today_context.activity_level}
                    onChange={(v) => update(["today_context", "activity_level"], v)}
                    options={[
                      { value: "sedentary", label: "Sedentary" },
                      { value: "light_walking", label: "Light walking" },
                      { value: "active", label: "Active" },
                    ]}
                  />
                </Field>

                <Field label="Time of day">
                  <Select
                    value={data.today_context.time_of_day}
                    onChange={(v) => update(["today_context", "time_of_day"], v)}
                    options={[
                      { value: "day", label: "Day" },
                      { value: "evening", label: "Evening" },
                      { value: "night", label: "Night" },
                    ]}
                  />
                </Field>
              </div>

              <Field label="Formality level (1 casual → 5 formal)">
                <NumberInput
                  value={data.today_context.formality_level}
                  onChange={(v) => update(["today_context", "formality_level"], v)}
                  min={1}
                  max={5}
                />
              </Field>

              <div className={styles.grid2Sm}>
                <Field label="Country">
                  <TextInput value={data.today_context.location.country} onChange={(v) => update(["today_context", "location", "country"], v)} placeholder="DK" />
                </Field>
                <Field label="City">
                  <TextInput value={data.today_context.location.city} onChange={(v) => update(["today_context", "location", "city"], v)} placeholder="Copenhagen" />
                </Field>
              </div>

              <div className={styles.grid3}>
                <Field label="Temperature (°C)">
                  <NumberInput
                    value={data.today_context.weather.temperature_c}
                    onChange={(v) => update(["today_context", "weather", "temperature_c"], v)}
                    min={-30}
                    max={50}
                  />
                </Field>

                <Field label="Condition">
                  <Select
                    value={data.today_context.weather.condition}
                    onChange={(v) => update(["today_context", "weather", "condition"], v)}
                    options={[
                      { value: "clear", label: "Clear" },
                      { value: "cloudy", label: "Cloudy" },
                      { value: "rain", label: "Rain" },
                      { value: "snow", label: "Snow" },
                      { value: "windy", label: "Windy" },
                      { value: "mixed", label: "Mixed" },
                    ]}
                  />
                </Field>

                <Field label="Windy?">
                  <Toggle
                    checked={!!data.today_context.weather.wind}
                    onChange={(v) => update(["today_context", "weather", "wind"], v)}
                    labelOn="Yes"
                    labelOff="No"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Constraints" subtitle="Hard requirements for the outfit.">
              <MultiInput
                label="Must have"
                placeholder="water_resistant_outerwear"
                values={data.constraints.must_have}
                onChange={(v) => update(["constraints", "must_have"], v)}
              />

              <MultiInput
                label="Avoid"
                placeholder="heavy_logo, loud_patterns"
                values={data.constraints.avoid}
                onChange={(v) => update(["constraints", "avoid"], v)}
              />
            </Section>
          </div>

          {/* RIGHT: OUTPUT */}
          <div className={styles.stackLg}>
            <Section title="Result JSON" subtitle="This matches your required object shape.">
              <div className={styles.jsonBox}>
                <pre className={styles.jsonPre}>{JSON.stringify(result, null, 2)}</pre>
              </div>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.btnPrimary} onClick={copyJSON}>
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
                <button type="button" className={styles.btnGhost} onClick={downloadJSON}>
                  Download JSON
                </button>
              </div>
            </Section>

            <Section title="What this does" subtitle="So you know it's correct.">
              <ul className={styles.list}>
                <li>Asks the user questions for every field.</li>
                <li>Outputs the JSON live in the same structure you provided.</li>
                <li>Lets you copy or download the JSON.</li>
              </ul>
            </Section>

            <button onClick={()=> SendData()}>Gennerate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
