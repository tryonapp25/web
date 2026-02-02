import styles from "./templateEditor.module.css";
import EditButom from "../../components/editButton";
import { useEffect, useState } from "react";


export default function TemplateEditor({ data = [], onChange}) {
  const [updateData, setUpdateData] = useState(data ?? null);

  // keep local state in sync when parent data changes
  useEffect(() => {
    setUpdateData(data ?? null);
  }, [data]);

  if (!updateData) return null;

  // ------------------------
  // update helpers
  // ------------------------

  const updateRoot = (key, value) => {
    setUpdateData((prev) => ({ ...prev, [key]: value }));
  };

  const updateSection = (index, patch) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      next[index] = { ...next[index], ...patch };
      return { ...prev, contents: next };
    });
  };

  const updateRow = (sectionIndex, rowIndex, patch) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const rows = [...next[sectionIndex].data];
      rows[rowIndex] = { ...rows[rowIndex], ...patch };
      next[sectionIndex] = { ...next[sectionIndex], data: rows };
      return { ...prev, contents: next };
    });
  };

  const addRow = (sectionIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const section = next[sectionIndex];

      next[sectionIndex] = {
        ...section,
        data: [...section.data, { name: "", price: "" }],
      };

      return { ...prev, contents: next };
    });
  };

  const removeRow = (sectionIndex, rowIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const rows = next[sectionIndex].data.filter((_, i) => i !== rowIndex);

      next[sectionIndex] = { ...next[sectionIndex], data: rows };
      return { ...prev, contents: next };
    });
  };



  return (
    <div className={styles.editor}>
      <main style={{width:"95%", height:"100%"}}>
        <EditButom text="Save" onClick={() => onChange(updateData)} />

        <div className={styles.header}>
          <h2 className={styles.title}>Pizza Menu Editor</h2>
          <p className={styles.subtitle}>
            Edit headings, sections, and menu items.
          </p>
        </div>

        {/* Header fields */}
        <div className={styles.card}>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Heading</span>
              <input
                className={styles.input}
                value={updateData.heading}
                onChange={(e) => updateRoot("heading", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Subheading</span>
              <input
                className={styles.input}
                value={updateData.subheading}
                onChange={(e) => updateRoot("subheading", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Sections */}
        {updateData.contents.map((section, i) => (
          <div key={i} className={styles.section}>
            <div className={styles.sectionTop}>
              <h3 className={styles.sectionTitle}>
                Section {i + 1}
                <span className={styles.sectionPill}>
                  {section.title || "Untitled"}
                </span>
              </h3>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.grid2}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Title</span>
                  <input
                    className={styles.input}
                    value={section.title}
                    onChange={(e) =>
                      updateSection(i, { title: e.target.value })
                    }
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>Model URL</span>
                  <input
                    className={styles.input}
                    value={section.model}
                    onChange={(e) =>
                      updateSection(i, { model: e.target.value })
                    }
                  />
                </label>
              </div>

              {/* Rows */}
              <div className={styles.rows}>
                <div className={styles.rowsHeader}>
                  <span>Items</span>
                  <button
                    type="button"
                    className={styles.addRow}
                    onClick={() => addRow(i)}
                  >
                    + Add row
                  </button>
                </div>

                {section.data.map((row, r) => (
                  <div key={r} className={styles.row}>
                    <input
                      className={styles.input}
                      placeholder="Name"
                      value={row.name}
                      onChange={(e) =>
                        updateRow(i, r, { name: e.target.value })
                      }
                    />
                    <input
                      className={`${styles.input} ${styles.price}`}
                      placeholder="Price"
                      value={row.price}
                      onChange={(e) =>
                        updateRow(i, r, { price: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className={styles.removeRow}
                      onClick={() => removeRow(i, r)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
