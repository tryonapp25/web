import styles from "./posterEditor.module.css";
import EditButton from "../../components/editButton";
import { useEffect, useState, Children, cloneElement } from "react";



export default function PosterEditor({children, data, onChange }) {
  const [updateData, setUpdateData] = useState(data ?? defaultData);

  // Keep local state in sync when parent data changes
  useEffect(() => {
    setUpdateData(data ?? defaultData);
  }, [data]);

  if (!updateData) return null;

  const info = updateData.information || {};
  const more = info.more || {};
  const firstContent = updateData.contents?.[0] || {};

  // Update helper for top-level fields
  const updateField = (key, value) => {
    setUpdateData((prev) => ({ ...prev, [key]: value }));
  };

  // Update helper for information fields
  const updateInfoField = (key, value) => {
    setUpdateData((prev) => ({
      ...prev,
      information: { ...prev.information, [key]: value }
    }));
  };

  // Update helper for information.more fields
  const updateMoreField = (key, value) => {
    setUpdateData((prev) => ({
      ...prev,
      information: {
        ...prev.information,
        more: { ...prev.information?.more, [key]: value }
      }
    }));
  };

  // Update helper for contents[0] fields
  const updateContentField = (key, value) => {
    setUpdateData((prev) => {
      const newContents = [...(prev.contents || [])];
      newContents[0] = { ...newContents[0], [key]: value };
      return { ...prev, contents: newContents };
    });
  };

  return (
    <div className={styles.editor}>
      <main className={styles.main}>
        <EditButton text="Save" onClick={() => onChange(updateData)} />

        <div className={styles.header}>
          <h2 className={styles.title}>Poster Editor</h2>
          <p className={styles.subtitle}>
            Customize text, images, colors, and styling.
          </p>
        </div>

        {/* Header Text */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Header Text</h3>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Subheading</span>
              <input
                className={styles.input}
                value={updateData.subheading || ""}
                onChange={(e) => updateField("subheading", e.target.value)}
                placeholder="THE FOOD RESTO"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Heading</span>
              <input
                className={styles.input}
                value={updateData.heading || ""}
                onChange={(e) => updateField("heading", e.target.value)}
                placeholder="MENU"
              />
            </label>
          </div>
        </div>

        {/* Image */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Image</h3>
          <label className={styles.label}>
            <span className={styles.labelText}>Model URL</span>
            <input
              className={styles.input}
              value={firstContent.model || ""}
              onChange={(e) => updateContentField("model", e.target.value)}
              placeholder="https://example.com/model.glb"
            />
          </label>
          {firstContent.model && (
            <div className={styles.imagePreview}>
              <img src={firstContent.model} alt="Preview" />
            </div>
          )}
        </div>

        {/* Badge */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Badge</h3>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Badge Small Text</span>
              <input
                className={styles.input}
                value={more.badgeSmall || ""}
                onChange={(e) => updateMoreField("badgeSmall", e.target.value)}
                placeholder="SPECIAL MENU"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Badge Large Text</span>
              <input
                className={styles.input}
                value={more.badgeLarge || ""}
                onChange={(e) => updateMoreField("badgeLarge", e.target.value)}
                placeholder="ENJOY 20% OFF"
              />
            </label>
          </div>

          <label className={styles.label} style={{ marginTop: 12 }}>
            <span className={styles.labelText}>Badge Rotation (degrees)</span>
            <div className={styles.sliderRow}>
              <input
                type="range"
                className={styles.slider}
                min="-15"
                max="15"
                value={more.badgeRotation ?? -5}
                onChange={(e) => updateMoreField("badgeRotation", Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{more.badgeRotation ?? -5}°</span>
            </div>
          </label>
        </div>

        {/* Contact Info */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Contact Information</h3>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>Hours</span>
              <input
                className={styles.input}
                value={more.hours || ""}
                onChange={(e) => updateMoreField("hours", e.target.value)}
                placeholder="OPEN 2 PM - 11 PM"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Phone</span>
              <input
                className={styles.input}
                value={info.phone || ""}
                onChange={(e) => updateInfoField("phone", e.target.value)}
                placeholder="123-555-2414"
              />
            </label>
          </div>

          <label className={styles.label} style={{ marginTop: 12 }}>
            <span className={styles.labelText}>Address</span>
            <input
              className={styles.input}
              value={info.address || ""}
              onChange={(e) => updateInfoField("address", e.target.value)}
              placeholder="555 YOUR CITY, AMAZING STATE 28888"
            />
          </label>

          <label className={styles.label} style={{ marginTop: 12 }}>
            <span className={styles.labelText}>Website</span>
            <input
              className={styles.input}
              value={info.website || ""}
              onChange={(e) => updateInfoField("website", e.target.value)}
              placeholder="WWW.YOURWEBSITE.COM"
            />
          </label>
        </div>

        {/* Colors & Styling */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Colors & Styling</h3>
          
          <div className={styles.colorGrid}>
            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Background</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={more.bgColor || "#111111"}
                  onChange={(e) => updateMoreField("bgColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={more.bgColor || "#111111"}
                  onChange={(e) => updateMoreField("bgColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Accent Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={more.accentColor || "#f5a623"}
                  onChange={(e) => updateMoreField("accentColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={more.accentColor || "#f5a623"}
                  onChange={(e) => updateMoreField("accentColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Text Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={more.textColor || "#ffffff"}
                  onChange={(e) => updateMoreField("textColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={more.textColor || "#ffffff"}
                  onChange={(e) => updateMoreField("textColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Muted Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={more.mutedColor || "#bbbbbb"}
                  onChange={(e) => updateMoreField("mutedColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={more.mutedColor || "#bbbbbb"}
                  onChange={(e) => updateMoreField("mutedColor", e.target.value)}
                />
              </div>
            </label>
          </div>

          <label className={styles.label} style={{ marginTop: 16 }}>
            <span className={styles.labelText}>Plate Size (px)</span>
            <div className={styles.sliderRow}>
              <input
                type="range"
                className={styles.slider}
                min="150"
                max="400"
                value={more.plateSize ?? 280}
                onChange={(e) => updateMoreField("plateSize", Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{more.plateSize ?? 280}px</span>
            </div>
          </label>
        </div>

        {/* Preview Section */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Live Preview</h3>
          <div className={styles.preview}>
            {Children.map(children, (child) =>
              cloneElement(child, { data: updateData })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
