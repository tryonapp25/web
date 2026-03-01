import React, { useMemo, useState, useEffect } from "react";
import styles from "./BBMN26.module.css";
import Model3D from "../../components/3dModel";


function seedColor(idx) {
  // pastel blobs like the reference
  const colors = [
    ["#f3d3dc", "#f8efe9"],
    ["#d9efc7", "#f2f7ea"],
    ["#f2d1f0", "#f0f0ff"],
    ["#d5e7ff", "#f2f7ff"],
    ["#f6d7b8", "#fff1e1"],
    ["#d8d6ff", "#f2f2ff"],
  ];
  return colors[idx % colors.length];
}

const config = {
  camera_orbit: "auto 90deg",
}

export default function TestTemplate({data, pressable, onPress, onClickModel }) {
  const [draft, setDraft] = useState(data);
  useEffect(() => {
    setDraft(data);
  }, [data]);

  const sections = useMemo(() => draft?.contents ?? [], [draft]);

  const handlePress = () => {
    if (!pressable) return;
    onPress?.(draft);
  };

  return (
    <div className={styles.page} onClick={handlePress}>
      {/* Optional background layers if you still want them */}
      <div className={styles.bg} aria-hidden="true" />

      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>{draft?.heading}</h1>
            <div className={styles.titleSticker} aria-hidden="true" />
          </div>
          {draft?.subheading ? (
            <p className={styles.subheading}>{draft.subheading}</p>
          ) : null}
        </header>

        <section className={styles.grid}>
          {sections.slice(0, 6).map((section, idx) => {
            const [c1, c2] = seedColor(idx);
            return (
              <article className={styles.card} key={idx} onClick={() => onClickModel?.({data: section, config: config})}>
                {/* top blob */}
                <div
                  className={styles.cardBlob}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${c1} 0%, ${c2} 65%, rgba(255,255,255,0) 70%)`,
                  }}
                  aria-hidden="true"
                />

                {/* top */}
                <div className={styles.cardTop}>
                  <div className={styles.topText}>
                    <h3 className={styles.cardKicker} title={section?.title ?? ""}>
                      {section?.title}
                    </h3>
                  </div>

                  <div className={styles.modelWrap}>
                    <div className={styles.model3d}>
                      <Model3D
                        images={section?.images}
                        config={config}
                        model={section?.model}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.priceRow}>
                  {(section?.data || []).map((data, index) => {
                    return (
                        <span key={index}  className={styles.priceSection}>
                          {data?.name?.slice(0, 1)}.{data?.price}{draft?.currency}
                        </span>
                    )
                  })}
                 </div>


                {/* ingredients */}
                <div className={styles.ingredients}>
                  <div className={styles.ingredientsTitle}>ingredient</div>

                  <ul className={styles.ingList}>
                    {(section?.ingredients || []).map((item, index) => (
                      <li className={styles.ingItem} key={index}>
                        <span className={styles.ingText}>{item?.name}</span>
                        <span
                          className={`${styles.ingDot} ${
                            item?.included ? styles.ingDotOn : ""
                          }`}
                          aria-hidden="true"
                        />
                      </li>
                    ))}
                  </ul>

                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div> 
  );
}
