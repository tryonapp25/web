import React, { useEffect, useState } from "react";
import styles from "./BBMN07.module.css";
import Model3D from "../../components/3dModel";


function Crown({ className = "" }) {
  return (
    <svg className={`${styles.crown} ${className}`} viewBox="0 0 64 48" aria-hidden="true">
      <path
        d="M8 18c4 0 7-3 7-7S12 4 8 4 1 7 1 11s3 7 7 7Zm48 0c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7ZM32 22c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9Z"
        fill="#FFD24A"
        stroke="#F2B300"
        strokeWidth="2"
      />
      <path
        d="M6 18l8 18 18-14 18 14 8-18-12 6-14-10-14 10-12-6Z"
        fill="#FFD24A"
        stroke="#F2B300"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 40h44c2 0 3 1 3 3v2H7v-2c0-2 1-3 3-3Z"
        fill="#FFD24A"
        stroke="#F2B300"
        strokeWidth="2"
      />
    </svg>
  );
}

const config = {
  camera_orbit: "auto 90deg",
}

export default function Template({data = {}, pressable, onPress, onClickModel }) {
  const [template, setTemplate] = useState(data || {});
  const { contents } = data;
  useEffect(() => {
    if(!data) return setTemplate(data);
  },[data]);


  const handlePress = () => {
    if (!pressable) return;
    onPress?.(template);
  };

  return (
    <section className={styles.page} onClick={handlePress}>
      <div className={styles.bgBubbles} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoBlock}>
            <div className={styles.logoText}>{template?.infomation?.brand}</div>
            <div className={styles.brandPill}>{template?.subheading}</div>
          </div>
        </div>

        <h1 className={styles.headline} aria-label={template?.heading}>
          <span className={styles.headlineTop}>{template?.heading}</span>
        </h1>

        <div className={styles.stickerLeft} aria-hidden="true">
          <div className={styles.stickerFace}>{template?.infomation?.more?.logo ?? "☠️"}</div>
          <div className={styles.stickerMiniCrownWrap}>
            <Crown className={styles.stickerMiniCrown} />
          </div>
        </div>

        <div className={styles.stickerRight} aria-hidden="true">
          <div className={styles.stickerFace}>{template?.infomation?.more?.logo ?? "☠️"}</div>
          <div className={styles.stickerMiniCrownWrap}>
            <Crown className={styles.stickerMiniCrown} />
          </div>
        </div>
      </header>

      <div className={styles.grid} role="list">
        {contents.map((it, index) => {
           const isRight = index % 2 === 1; // ← every other card
          return (
            <article
              key={it.id}
              className={`${styles.card} ${isRight ? styles.cardRight : styles.cardLeft}`}
              role="listitem"
            >
              <div className={styles.cardInner}>
                <div className={styles.crownWrap} aria-hidden="true">
                  <Crown />
                </div>

                <div className={styles.drinkWrap}>
                  <Model3D model={it?.model} images={it?.images} config={config} onClick={() => onClickModel?.({data: it, config: config})}/>
                </div>

                <div className={styles.textWrap}>
                  <div className={styles.cardTitle}>
                    {it.title.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.sizeCard}>
                  {it?.data.map((d, index) =>(
                    <p className={styles.size} key={index}>{d.name} <span className={styles.price}>{d.price}</span></p>
                  ))}
              </div>
              <div className={styles.description}>
                <p className={styles.desText}>{it?.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
