import styles from "./menuBookEditor.module.css";
import EditButom from "../../components/editButton";
import { useEffect, useState } from "react";


const defaultMessage = { visible: false, type: "", msg: "" };

export default function MenuBookEditor({ data, onChange}) {
  const [updateData, setUpdateData] = useState(data ?? null);

  useEffect(() => {
    setUpdateData(data ?? null);
  }, [data]);

  if (!updateData) return null;

  // ------------------------
  // root updates (menubook)
  // ------------------------
  const updateRoot = (key, value) => {
    setUpdateData((prev) => ({ ...prev, [key]: value }));
  };

  const updateRootInfo = (key, value) => {
    setUpdateData((prev) => ({
      ...prev,
      information: { ...(prev.information ?? {}), [key]: value },
    }));
  };

  // ------------------------
  // template (menu) updates
  // updateData.contents = array of templates
  // each template has .contents = array of sections
  // ------------------------
  const updateTemplate = (tplIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      nextTemplates[tplIndex] = { ...nextTemplates[tplIndex], ...patch };
      return { ...prev, contents: nextTemplates };
    });
  };

  const updateTemplateInfo = (tplIndex, key, value) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];
      nextTemplates[tplIndex] = {
        ...tpl,
        information: { ...(tpl.information ?? {}), [key]: value },
      };
      return { ...prev, contents: nextTemplates };
    });
  };

  const addTemplate = () => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      nextTemplates.push({
        id: Date.now(),
        uid: prev.uid ?? 0,
        isPublic: false,
        publicCode: { String: "", Valid: false },
        price: 0,
        code: "",
        type: "menu",
        category: "food",
        heading: "New Menu",
        subheading: "",
        contents: [
          {
            title: "Section 1",
            model: "",
            data: [],
          },
        ],
        information: { email: "", phone: "", address: "" },
      });

      return { ...prev, contents: nextTemplates };
    });
  };

  const removeTemplate = (tplIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = (prev.contents ?? []).filter((_, i) => i !== tplIndex);
      return { ...prev, contents: nextTemplates };
    });
  };

  // ------------------------
  // section updates (inside a template)
  // ------------------------
  const updateSection = (tplIndex, sectionIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      nextSections[sectionIndex] = { ...nextSections[sectionIndex], ...patch };

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const addSection = (tplIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      nextSections.push({
        title: `Section ${nextSections.length + 1}`,
        model: "",
        data: [],
      });

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const removeSection = (tplIndex, sectionIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = (tpl.contents ?? []).filter((_, i) => i !== sectionIndex);

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  // ------------------------
  // row/item updates (inside section)
  // ------------------------
  const updateRow = (tplIndex, sectionIndex, rowIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      const nextRows = [...(section.data ?? [])];
      nextRows[rowIndex] = { ...nextRows[rowIndex], ...patch };

      nextSections[sectionIndex] = { ...section, data: nextRows };
      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };

      return { ...prev, contents: nextTemplates };
    });
  };

  const addRow = (tplIndex, sectionIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      nextSections[sectionIndex] = {
        ...section,
        data: [
          ...(section.data ?? []),
          { name: "", description: "", price: "", quantity: "1" },
        ],
      };

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const removeRow = (tplIndex, sectionIndex, rowIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      const nextRows = (section.data ?? []).filter((_, i) => i !== rowIndex);

      nextSections[sectionIndex] = { ...section, data: nextRows };
      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };

      return { ...prev, contents: nextTemplates };
    });
  };

  const handleOnchange = () => {
    onChange(updateData)
  }


  return (
    <div className={styles.editor}>
      <main style={{ width: "95%", height: "100%" }}>
        <EditButom text="Save" onClick={() => handleOnchange()} />

        <div className={styles.header}>
          <h2 className={styles.title}>Menu Book Editor</h2>
          <p className={styles.subtitle}>
            Edit menu book info, templates, sections, and items.
          </p>
        </div>

        {/* Root (MenuBook) */}
        <div className={styles.card}>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>MenuBook Heading</span>
              <input
                className={styles.input}
                value={updateData.heading ?? ""}
                onChange={(e) => updateRoot("heading", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>MenuBook Subheading</span>
              <input
                className={styles.input}
                value={updateData.subheading ?? ""}
                onChange={(e) => updateRoot("subheading", e.target.value)}
              />
            </label>
          </div>

          <div className={styles.grid3}>
            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <input
                className={styles.input}
                value={updateData.information?.email ?? ""}
                onChange={(e) => updateRootInfo("email", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Phone</span>
              <input
                className={styles.input}
                value={updateData.information?.phone ?? ""}
                onChange={(e) => updateRootInfo("phone", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Address</span>
              <input
                className={styles.input}
                value={updateData.information?.address ?? ""}
                onChange={(e) => updateRootInfo("address", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Templates list */}
        <div className={styles.templatesTop}>
          <h3 className={styles.sectionTitle}>Templates</h3>
          <button type="button" className={styles.addRow} onClick={addTemplate}>
            + Add template
          </button>
        </div>

        {(updateData.contents ?? []).map((tpl, t) => (
          <div key={tpl.id ?? t} className={styles.section}>
            <div className={styles.sectionTop}>
              <h3 className={styles.sectionTitle}>
                Template {t + 1}
                <span className={styles.sectionPill}>{tpl.code || "No code"}</span>
              </h3>

              <button
                type="button"
                className={styles.removeTemplate}
                onClick={() => removeTemplate(t)}
                title="Remove template"
              >
                Remove
              </button>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.grid2}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Template Heading</span>
                  <input
                    className={styles.input}
                    value={tpl.heading ?? ""}
                    onChange={(e) => updateTemplate(t, { heading: e.target.value })}
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>Template Subheading</span>
                  <input
                    className={styles.input}
                    value={tpl.subheading ?? ""}
                    onChange={(e) => updateTemplate(t, { subheading: e.target.value })}
                  />
                </label>
              </div>

              <div className={styles.grid3}>
                <label className={styles.label}>
                  <span className={styles.labelText}>Email</span>
                  <input
                    className={styles.input}
                    value={tpl.information?.email ?? ""}
                    onChange={(e) => updateTemplateInfo(t, "email", e.target.value)}
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>Phone</span>
                  <input
                    className={styles.input}
                    value={tpl.information?.phone ?? ""}
                    onChange={(e) => updateTemplateInfo(t, "phone", e.target.value)}
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>Address</span>
                  <input
                    className={styles.input}
                    value={tpl.information?.address ?? ""}
                    onChange={(e) => updateTemplateInfo(t, "address", e.target.value)}
                  />
                </label>
              </div>

              {/* Sections inside template */}
              <div className={styles.rows}>
                <div className={styles.rowsHeader}>
                  <span>Sections</span>
                  <button
                    type="button"
                    className={styles.addRow}
                    onClick={() => addSection(t)}
                  >
                    + Add section
                  </button>
                </div>

                {(tpl.contents ?? []).map((section, s) => (
                  <div key={s} className={styles.sectionBox}>
                    <div className={styles.sectionBoxTop}>
                      <div className={styles.sectionBoxTitle}>
                        Section {s + 1}
                        <span className={styles.sectionPill}>{section.title || "Untitled"}</span>
                      </div>

                      <button
                        type="button"
                        className={styles.removeSection}
                        onClick={() => removeSection(t, s)}
                        title="Remove section"
                      >
                        Remove
                      </button>
                    </div>

                    <div className={styles.grid2}>
                      <label className={styles.label}>
                        <span className={styles.labelText}>Title</span>
                        <input
                          className={styles.input}
                          value={section.title ?? ""}
                          onChange={(e) => updateSection(t, s, { title: e.target.value })}
                        />
                      </label>

                      <label className={styles.label}>
                        <span className={styles.labelText}>Model URL</span>
                        <input
                          className={styles.input}
                          value={section.model ?? ""}
                          onChange={(e) => updateSection(t, s, { model: e.target.value })}
                        />
                      </label>
                    </div>

                    {/* Items */}
                    <div className={styles.items}>
                      <div className={styles.rowsHeader}>
                        <span>Items</span>
                        <button
                          type="button"
                          className={styles.addRow}
                          onClick={() => addRow(t, s)}
                        >
                          + Add item
                        </button>
                      </div>

                      {(section.data ?? []).map((row, r) => (
                        <div key={r} className={styles.itemRow}>
                          <input
                            className={styles.input}
                            placeholder="Name"
                            value={row.name ?? ""}
                            onChange={(e) => updateRow(t, s, r, { name: e.target.value })}
                          />

                          <input
                            className={styles.input}
                            placeholder="Description"
                            value={row.description ?? ""}
                            onChange={(e) =>
                              updateRow(t, s, r, { description: e.target.value })
                            }
                          />

                          <input
                            className={`${styles.input} ${styles.price}`}
                            placeholder="Price"
                            value={row.price ?? ""}
                            onChange={(e) => updateRow(t, s, r, { price: e.target.value })}
                          />

                          <input
                            className={`${styles.input} ${styles.qty}`}
                            placeholder="Qty"
                            value={row.quantity ?? ""}
                            onChange={(e) =>
                              updateRow(t, s, r, { quantity: e.target.value })
                            }
                          />

                          <button
                            type="button"
                            className={styles.removeRow}
                            onClick={() => removeRow(t, s, r)}
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
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
