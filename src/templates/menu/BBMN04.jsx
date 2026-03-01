// BBMN04.jsx
import styles from "./BBMN04.module.css";
import Model3D from "../../components/3dModel";
import { useEffect, useState, useMemo } from "react";




const config = {
  camera_orbit: "auto 90deg",
}

function Stars({ value = 4 }) {
  return (
    <div className={styles.stars} aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={styles.star}>
          {i < value ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}


function QrPlaceholder() {
  return (
    <div className={styles.qrBox} aria-label="QR code placeholder">
      <div className={styles.qrGrid}>
        {Array.from({ length: 64 }).map((_, i) => (
          <span key={i} className={styles.qrDot} />
        ))}
      </div>
      <div className={styles.qrLabel}>QR</div>
    </div>
  );
}




export default function BBMN04({data, pressable, onPress, onClickModel }) {
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
      <div className={styles.poster} role="img" aria-label="Menu Special poster template">
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headlineTop}>{draft.heading}</div>
            <div className={styles.headlineScript}>{draft?.information?.more?.headlineScript}</div>
            <div className={styles.headerSubtitle}>{draft.subheading}</div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.discountRow}>
              <div className={styles.discount}>{draft?.information?.more?.discount}%</div>
              <div className={styles.off}>OFF</div>
            </div>

            <div className={styles.headerSmall}>
              {draft?.information?.more?.headerSmall}
            </div>

            <Stars value={draft?.information?.more?.rating} />
          </div>
        </header>

        {/* BODY */}
        <main className={styles.body}>
          {/* LEFT LIST */}
          <section className={styles.menuList}>
            {sections.map((item, idx) => {
                const priceText = item?.data?.at(-1)?.price ?? "$0";
                return (
                <div key={idx} className={styles.menuItem}>
                    <div className={styles.menuItemRow}>
                    <div className={styles.menuTitle}>{item.title}</div>
                    <div className={styles.dots} />
                    <div className={styles.menuPrice}>{priceText}{data?.currency}</div>
                    </div>

                    <div className={styles.menuDesc}>{item.description}</div>

                    {/* ✅ sizes row */}
                    <div className={styles.sizeRow}>
                    {item?.data?.map((size, index) => (
                        <div key={index} className={styles.sizeItem}>
                        <span className={styles.sizeName}>{size.name}</span>
                        <span className={styles.sizePrice}>{size.price}{data?.currency}</span>
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
           </section>


          {/* RIGHT GRID */}
          <section className={styles.drinksGrid}>
            {sections.map((item, idx) => (
              <div key={idx} className={styles.drinkCard} title={item.model} onClick={() => onClickModel({data: item, config: config})}>
                <div style={{ width: "100px", height: "100px" }} className={styles.model3d}>
                  <Model3D model={item?.model} images={item?.images} config={config}/>
                </div>
                <div className={styles.drinkName}>{item.title}</div>
              </div>
            ))}
          </section>
        </main>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.footerNote}>{draft.footerLeftNote}</div>
            <div className={styles.footerLeftRow}>
              <QrPlaceholder />
              <div className={styles.socialBlock}>
                <Stars value={draft?.information?.more?.rating} />
                <div className={styles.handle}>@{draft?.information?.brand}</div>
                <div className={styles.website}>{draft?.information?.website}</div>
              </div>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.dontMiss}>Don’t Miss!</div>
            <div className={styles.promoTitle}>{draft?.information?.more?.promoTitle}</div>
            <div className={styles.promoNote}>{draft?.information?.more?.promoNote}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
