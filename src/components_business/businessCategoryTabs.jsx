import styles from "../styles/CategoryTabs.module.css";

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Kategorier">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => onChange(c)}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}