// Template.jsx
import React, { useMemo, useState, useEffect } from "react";
import styles from "./ABCD12.module.css";
import Model3D from "../../components/3dModel";
import EditButton from "../../components/editButton";
import TemplateEditor from "./templateEditor";

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
  const [draft, setDraft] = useState(data);
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  const sections = useMemo(() => draft?.contents ?? [], [draft]);

  const handlePress = () => {
    if (!pressable) return;
    onPress?.(data);
  };

  const stop = (e) => e.stopPropagation();

  const handleUpdateTemplate = async (data) => {
    setDraft(data);
    setOnEdit(false);
  }

  if(onEdit) return <TemplateEditor data={draft} onChange={(d) => handleUpdateTemplate(d)}/>

  return (
    <div className={styles.page} onClick={handlePress}>
      <div className={styles.bg} aria-hidden="true" />
      {editable && <EditButton onClick={() => setOnEdit(true)}/>}

      <main className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.title}>{draft?.heading}</h1>
          {draft?.subheading ? (
            <p className={styles.subheading}>{draft.subheading}</p>
          ) : null}
        </header>

        {/* GRID */}
        <section className={styles.grid}>
          {sections.slice(0, 6).map((section, sIndex) => (
            <article key={sIndex} className={styles.card}>
              <PlateImage model={section?.model} />

              {section?.data?.map((row, rIndex) => (
                <div key={rIndex} className={styles.meta} onClick={stop}>
                  <div className={styles.rowTop}>
                    <span className={styles.itemName} title={row?.name ?? ""}>
                      {row?.name}
                      {row?.quantity ? (
                        <span className={styles.pieces}> ({row.quantity})</span>
                      ) : null}
                    </span>

                    <div className={styles.price}>{row?.price}</div>
                  </div>

                  {row?.description ? (
                    <p className={styles.desc} title={row?.description ?? ""}>
                      {row?.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
