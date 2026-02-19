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

  // Update helper
  const updateField = (key, value) => {
    setUpdateData((prev) => ({ ...prev, [key]: value }));
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
              <span className={styles.labelText}>Kicker</span>
              <input
                className={styles.input}
                value={updateData.kicker || ""}
                onChange={(e) => updateField("kicker", e.target.value)}
                placeholder="THE FOOD RESTO"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Title</span>
              <input
                className={styles.input}
                value={updateData.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="MENU"
              />
            </label>
          </div>
        </div>

        {/* Image */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Image</h3>
          <label className={styles.label}>
            <span className={styles.labelText}>Image URL</span>
            <input
              className={styles.input}
              value={updateData.imageUrl || ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </label>
          {updateData.imageUrl && (
            <div className={styles.imagePreview}>
              <img src={updateData.imageUrl} alt="Preview" />
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
                value={updateData.badgeSmall || ""}
                onChange={(e) => updateField("badgeSmall", e.target.value)}
                placeholder="SPECIAL MENU"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Badge Large Text</span>
              <input
                className={styles.input}
                value={updateData.badgeLarge || ""}
                onChange={(e) => updateField("badgeLarge", e.target.value)}
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
                value={updateData.badgeRotation ?? -5}
                onChange={(e) => updateField("badgeRotation", Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{updateData.badgeRotation ?? -5}°</span>
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
                value={updateData.hours || ""}
                onChange={(e) => updateField("hours", e.target.value)}
                placeholder="OPEN 2 PM - 11 PM"
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Phone</span>
              <input
                className={styles.input}
                value={updateData.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="123-555-2414"
              />
            </label>
          </div>

          <label className={styles.label} style={{ marginTop: 12 }}>
            <span className={styles.labelText}>Address</span>
            <input
              className={styles.input}
              value={updateData.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="555 YOUR CITY, AMAZING STATE 28888"
            />
          </label>

          <label className={styles.label} style={{ marginTop: 12 }}>
            <span className={styles.labelText}>Website</span>
            <input
              className={styles.input}
              value={updateData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
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
                  value={updateData.bgColor || "#111111"}
                  onChange={(e) => updateField("bgColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={updateData.bgColor || "#111111"}
                  onChange={(e) => updateField("bgColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Accent Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={updateData.accentColor || "#f5a623"}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={updateData.accentColor || "#f5a623"}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Text Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={updateData.textColor || "#ffffff"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={updateData.textColor || "#ffffff"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                />
              </div>
            </label>

            <label className={styles.colorLabel}>
              <span className={styles.labelText}>Muted Color</span>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={updateData.mutedColor || "#bbbbbb"}
                  onChange={(e) => updateField("mutedColor", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorText}
                  value={updateData.mutedColor || "#bbbbbb"}
                  onChange={(e) => updateField("mutedColor", e.target.value)}
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
                value={updateData.plateSize ?? 280}
                onChange={(e) => updateField("plateSize", Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{updateData.plateSize ?? 280}px</span>
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
