// Template.jsx
import React, { useMemo, useState, useEffect } from "react";
import styles from "./ABCD12.module.css";
import Model3D from "../../components/3dModel";

function PlateImage({ model, onClickModel, images }) {
  return (
    <div className={styles.plateWrap} onClick={onClickModel}>
      <div className={styles.plate}>
        <div className={styles.model3d}>
          <Model3D model={model} config={config} images={images} />
        </div>
        <div className={styles.plateShadow} />
      </div>
    </div>
  );
}

const config = {
  camera_orbit: "auto 60deg",
}
// Sushi Template //
export default function Template({
  data,
  pressable,
  onPress,
  onClickModel,
}) {
  const [draft, setDraft] = useState(data);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  const sections = useMemo(() => draft?.contents ?? [], [draft]);

  const handlePress = () => {
    if (!pressable) return;
    onPress?.(data);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.page} onClick={handlePress}>
      <div className={styles.bg} aria-hidden="true" />
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
              <PlateImage model={section?.model} images={section?.images} onClickModel={() => onClickModel({data: section, config: config})} />

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
