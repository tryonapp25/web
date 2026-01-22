// Template.jsx (or Template.tsx)
// Keep your existing imports/paths; only the layout + save/edit logic is kept same.
import React, { useMemo, useState, useEffect } from "react";
import styles from "./ABCD12.module.css";
import Model3D from "../components/3dModel";

function PlateImage({ model }) {
  return (
    <div className={styles.plateWrap}>
      <div className={styles.plate}>
        <div className={styles.model3d}>
          <Model3D model={model} />
        </div>
        <div className={styles.plateShadow} />
      </div>
    </div>
  );
}

// Sushi Template //
export default function Template({
  data,
  pressable,
  editable = false,
  onPress,
  onSave,
}) {
  // local editable copy
  const [draft, setDraft] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  const sections = useMemo(() => draft?.contents ?? [], [draft]);

  // click page
  const handlePress = () => {
    if (isEditing) {
      setIsEditing(false); // exit edit mode
      return;
    }
    if (!pressable || !draft?.id) return;
    onPress?.(data);
  };

  const stop = (e) => e.stopPropagation();

  const handleSaveButton = () => {
    if (!isEditing) return;
    onSave?.(draft);
  };

  return (
    <div className={styles.page} onClick={handlePress}>
      <div className={styles.bg} aria-hidden="true" />

      <main className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.title}>{draft?.heading}</h1>

          {editable && (
            <button
              className={styles.editBtn}
              onClick={(e) => {
                stop(e);
                // if we are currently editing, save on click
                if (isEditing) handleSaveButton();
                setIsEditing((v) => !v);
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          )}
        </header>

        {/* CONTENT: ALWAYS 2 columns x 3 rows, NO overflow, 100% height */}
        <section className={styles.grid}>
          {sections.slice(0, 6).map((section, sIndex) => (
            <article key={sIndex} className={styles.card}>
              <PlateImage model={section?.model} />

              {section?.data?.map((row, rIndex) => (
                <div key={rIndex} className={styles.meta} onClick={stop}>
                  <div className={styles.rowTop}>
                    <span className={styles.itemName} title={row?.name ?? ""}>
                      {row?.name}
                      {row?.quantity && (
                        <span className={styles.pieces}>({row.quantity})</span>
                      )}
                    </span>

                    <div className={styles.leader} />

                    <div className={styles.price}>{row?.price}</div>
                  </div>

                  <p className={styles.desc} title={row?.description ?? ""}>
                    {row?.description}
                  </p>
                </div>
              ))}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
