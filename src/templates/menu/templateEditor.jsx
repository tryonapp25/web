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
        data: [...section.data, { name: "", price: "", description: "", quantity: "" }],
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

  // images helpers for sections
  const addImage = (sectionIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const imgs = next[sectionIndex].images ? [...next[sectionIndex].images] : [];
      imgs.push("");
      next[sectionIndex] = { ...next[sectionIndex], images: imgs };
      return { ...prev, contents: next };
    });
  };

  const updateImage = (sectionIndex, imgIndex, value) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const imgs = [...(next[sectionIndex].images || [])];
      imgs[imgIndex] = value;
      next[sectionIndex] = { ...next[sectionIndex], images: imgs };
      return { ...prev, contents: next };
    });
  };

  const removeImage = (sectionIndex, imgIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const imgs = (next[sectionIndex].images || []).filter((_, i) => i !== imgIndex);
      next[sectionIndex] = { ...next[sectionIndex], images: imgs.length ? imgs : null };
      return { ...prev, contents: next };
    });
  };

  // ingredients helpers for sections
  const addIngredient = (sectionIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const ing = next[sectionIndex].ingredients ? [...next[sectionIndex].ingredients] : [];
      ing.push("");
      next[sectionIndex] = { ...next[sectionIndex], ingredients: ing };
      return { ...prev, contents: next };
    });
  };

  const updateIngredient = (sectionIndex, ingIndex, value) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const ing = [...(next[sectionIndex].ingredients || [])];
      const current = ing[ingIndex];
      if (current && typeof current === "object" && !Array.isArray(current)) {
        ing[ingIndex] = { ...current, name: value };
      } else {
        ing[ingIndex] = value;
      }
      next[sectionIndex] = { ...next[sectionIndex], ingredients: ing };
      return { ...prev, contents: next };
    });
  };

  const removeIngredient = (sectionIndex, ingIndex) => {
    setUpdateData((prev) => {
      const next = [...prev.contents];
      const ing = (next[sectionIndex].ingredients || []).filter((_, i) => i !== ingIndex);
      next[sectionIndex] = { ...next[sectionIndex], ingredients: ing.length ? ing : null };
      return { ...prev, contents: next };
    });
  };

  // extras root helper (JSON textarea)
  const updateExtras = (value) => {
    try {
      const parsed = value ? JSON.parse(value) : null;
      updateRoot("extras", parsed);
    } catch (e) {
      // if invalid JSON, keep as string until valid
      updateRoot("extras", value);
    }
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

        {/* Extras & Information */}
        <div className={styles.card}>
          <h4 className={styles.labelText}>Extras (JSON)</h4>
          <textarea
            className={styles.input}
            style={{minHeight: 300, width: '95%', overflowY:"auto", scrollbarWidth:"none", msOverflowStyle:"none"}}
            value={typeof updateData.extras === 'string' ? updateData.extras : JSON.stringify(updateData.extras || null, null, 2)}
            onChange={(e) => updateExtras(e.target.value)}
          />

          <h4 className={styles.labelText} style={{marginTop:12}}>Information</h4>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Brand</span>
              <input className={styles.input} value={updateData.information?.brand || ""} onChange={(e)=> updateRoot('information', {...(updateData.information||{}), brand: e.target.value})} />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Website</span>
              <input className={styles.input} value={updateData.information?.website || ""} onChange={(e)=> updateRoot('information', {...(updateData.information||{}), website: e.target.value})} />
            </label>
          </div>

          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <input className={styles.input} value={updateData.information?.email || ""} onChange={(e)=> updateRoot('information', {...(updateData.information||{}), email: e.target.value})} />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Phone</span>
              <input className={styles.input} value={updateData.information?.phone || ""} onChange={(e)=> updateRoot('information', {...(updateData.information||{}), phone: e.target.value})} />
            </label>
          </div>

          <label className={styles.label}>
            <span className={styles.labelText}>Address</span>
            <input className={styles.input} value={updateData.information?.address || ""} onChange={(e)=> updateRoot('information', {...(updateData.information||{}), address: e.target.value})} />
          </label>
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

              <label className={styles.label}>
                <span className={styles.labelText}>Section Description</span>
                <input className={styles.input} value={section.description || ""} onChange={(e)=> updateSection(i, { description: e.target.value })} />
              </label>

              {/* Images */}
              <div style={{marginTop:8}}>
                <div className={styles.rowsHeader}>
                  <span>Images</span>
                  <button type="button" className={styles.addRow} onClick={()=> addImage(i)}>+ Add image</button>
                </div>
                {(section.images || []).map((img, idx) => (
                  <div key={idx} style={{display:'flex', gap:8, marginTop:6}}>
                    <input className={styles.input} placeholder="Image URL" value={img} onChange={(e)=> updateImage(i, idx, e.target.value)} />
                    <button type="button" className={styles.removeRow} onClick={()=> removeImage(i, idx)}>✕</button>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div style={{marginTop:8}}>
                <div className={styles.rowsHeader}>
                  <span>Ingredients</span>
                  <button type="button" className={styles.addRow} onClick={()=> addIngredient(i)}>+ Add ingredient</button>
                </div>
                {(section.ingredients || []).map((ing, idx) => (
                  <div key={idx} style={{display:'flex', gap:8, marginTop:6}}>
                    <input
                      className={styles.input}
                      placeholder="Ingredient"
                      value={
                        typeof ing === "string"
                          ? ing
                          : ing && typeof ing === "object"
                          ? ing.name || ""
                          : String(ing || "")
                      }
                      onChange={(e) => updateIngredient(i, idx, e.target.value)}
                    />
                    <button type="button" className={styles.removeRow} onClick={()=> removeIngredient(i, idx)}>✕</button>
                  </div>
                ))}
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
                    <input
                      className={styles.input}
                      placeholder="Quantity"
                      value={row.quantity || ""}
                      onChange={(e) => updateRow(i, r, { quantity: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      placeholder="Description"
                      value={row.description || ""}
                      onChange={(e) => updateRow(i, r, { description: e.target.value })}
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
