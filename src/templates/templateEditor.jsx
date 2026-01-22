import styles from "./templateEditor.module.css";

export default function TemplateEditor({ data, onChange }) {
  if (!data) return null;

  const updateRoot = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const updateSection = (index, patch) => {
    const next = [...data.contents];
    next[index] = { ...next[index], ...patch };
    onChange({ ...data, contents: next });
  };

  const updateRow = (sectionIndex, rowIndex, patch) => {
    const next = [...data.contents];
    const rows = [...next[sectionIndex].data];
    rows[rowIndex] = { ...rows[rowIndex], ...patch };
    next[sectionIndex].data = rows;
    onChange({ ...data, contents: next });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pizza Menu Editor</h2>
        <p className={styles.subtitle}>Edit headings, sections, and menu items.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.grid2}>
          <label className={styles.label}>
            <span className={styles.labelText}>Heading</span>
            <input
              className={styles.input}
              value={data.heading}
              onChange={(e) => updateRoot("heading", e.target.value)}
            />
          </label>

          <label className={styles.label}>
            <span className={styles.labelText}>Subheading</span>
            <input
              className={styles.input}
              value={data.subheading}
              onChange={(e) => updateRoot("subheading", e.target.value)}
            />
          </label>
        </div>
      </div>

      {data.contents.map((section, i) => (
        <div key={i} className={styles.section}>
          <div className={styles.sectionTop}>
            <div>
              <h3 className={styles.sectionTitle}>
                Section {i + 1}
                <span className={styles.sectionPill}>{section.title || "Untitled"}</span>
              </h3>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.grid2}>
              <label className={styles.label}>
                <span className={styles.labelText}>Title</span>
                <input
                  className={styles.input}
                  value={section.title}
                  onChange={(e) => updateSection(i, { title: e.target.value })}
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Model URL</span>
                <input
                  className={styles.input}
                  value={section.model}
                  onChange={(e) => updateSection(i, { model: e.target.value })}
                />
              </label>
            </div>

            <div className={styles.rows}>
              <div className={styles.rowsHeader}>
                <span>Items</span>
                <span className={styles.muted}>Name • Price</span>
              </div>

              {section.data.map((row, r) => (
                <div key={r} className={styles.row}>
                  <input
                    className={styles.input}
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => updateRow(i, r, { name: e.target.value })}
                  />
                  <input
                    className={`${styles.input} ${styles.price}`}
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => updateRow(i, r, { price: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
