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

export default function Template1({ data, pressable, editable = false, onPress, onSave }) {
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
      setIsEditing(false); // ⬅ exit edit mode
      return;
    }
    if (!pressable || !draft?.id) return;
    onPress(data);
  };

  const stop = (e) => e.stopPropagation();

  const handleSaveButton = () => {
    if(!isEditing) return;
    onSave(draft)
  }

  return (
    <div className={styles.page} onClick={handlePress}>
      <div className={styles.bg} aria-hidden="true" />

      <main className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          {isEditing ? (
            <input
              className={styles.titleInput}
              value={draft.heading}
              onClick={stop}
              onChange={(e) =>
                setDraft({ ...draft, heading: e.target.value })
              }
            />
          ) : (
            <h1 className={styles.title}>{draft?.heading}</h1>
          )}

          {editable && (
            <button
              className={styles.editBtn}
              onClick={(e) => {
                stop(e);
                setIsEditing((v) => !v); // ⬅ toggle
                handleSaveButton()
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          )}
        </header>

        {/* CONTENT */}
        <section className={styles.grid}>
          {sections.map((section, sIndex) => (
            <article key={sIndex} className={styles.card}>
              <PlateImage model={section.model} />

              {section.data?.map((row, rIndex) => (
                <div
                  key={rIndex}
                  className={styles.meta}
                  onClick={stop}
                >
                  <div className={styles.rowTop}>
                    {isEditing ? (
                      <input
                        value={row.name}
                        onChange={(e) => {
                          const next = structuredClone(draft);
                          next.contents[sIndex].data[rIndex].name =
                            e.target.value;
                          setDraft(next);
                        }}
                      />
                    ) : (
                      <span className={styles.itemName}>
                        {row.name}
                        {row.quantity && (
                          <span className={styles.pieces}>
                            ({row.quantity})
                          </span>
                        )}
                      </span>
                    )}

                    <div className={styles.leader} />
                    {isEditing ? (
                      <input
                        value={row.price}
                        onChange={(e) => {
                          const next = structuredClone(draft);
                          next.contents[sIndex].data[rIndex].price =
                            e.target.value;
                          setDraft(next);
                        }}
                      />
                    ) : (
                      <div className={styles.price}>{row.price}</div>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={row.description}
                      onChange={(e) => {
                        const next = structuredClone(draft);
                        next.contents[sIndex].data[rIndex].description =
                          e.target.value;
                        setDraft(next);
                      }}
                    />
                  ) : (
                    <p className={styles.desc}>{row.description}</p>
                  )}
                </div>
              ))}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
