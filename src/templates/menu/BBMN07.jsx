import React, { useEffect, useState } from "react";
import styles from "./BBMN07.module.css";
import Model3D from "../../components/3dModel";


/* const data = {
    id: 202,
    category: "bubble",
    code: "BBMN07", // template name
    name: "Bubble",
    price:1,
    uid:5,
    type:"demo",
    subheading: "bubble tea",
    heading: "Special Signature",
    contents: [
    {
      title: "Taro Cream Milk Tea",
      description:
        "Smooth and nutty with a gentle vanilla sweetness. Taro gives it that dreamy purple color and a cozy, almost cookie-like flavor.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FTaro_Bubble.glb_e2b4db50-7bc2-453d-81aa-0fdac3286dc5.glb?alt=media&token=77b87f52-2c13-42c3-a76f-02b315e76ac6"
    },
    {
      title: "Brown Sugar",
      description:
        "Rich, caramel-like brown sugar syrup coats warm, chewy tapioca pearls, then blends into creamy milk tea.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FBrown_Sugar.glb_b876d796-40da-4af1-a676-882cf3ea2ca2.glb?alt=media&token=69f0cab6-a5f2-4971-95bc-ea7cdfd308d3"
    },
    {
      title: "Matcha Latte Boba",
      description:
        "Earthy green tea with a light bitterness balanced by milk and sugar. Fresh, grassy, and not too sweet.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FMatcha_Bubble.glb_5a807eb5-45f5-40ae-9a8a-710a60ebcdfd.glb?alt=media&token=0b2adf51-20ae-41ad-8bb7-fed68fe88970"
    },
    {
      title: "Strawberry Milk Tea",
      description:
        "Sweet, fruity, and creamy like a strawberry milkshake but lighter. Soft berry flavor with silky milk tea.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:"https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FStrawberry_Bubble.glb_02d7d794-c5db-4c9b-b233-751beeef21d2.glb?alt=media&token=0c2e78d8-20a1-42f6-bcf0-7ff572d24a21"
    },
    {
      title: "Fruit Milk Tea",
      description:
        "Creamy milk tea layered with vibrant fruit flavors and topped with chewy boba pearls.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FFruit_Milk.glb_c1e2fde9-7702-4338-be22-01fa7b47bb85.glb?alt=media&token=6b401ceb-d604-4a44-97d1-7a30d5a99577"
    },
    {
      title: "Thai Milk Tea",
      description:
        "Bold black tea mixed with condensed milk and spices. Strong, sweet, and super creamy.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FThai_Bubble.glb_93127e08-098f-48a3-91d1-62bfceddd7f0.glb?alt=media&token=abf5c34b-d17d-4b22-b947-9614c2a664d3"
    },
  ],
  infomation: {
    brand: "VIVI",
    more:{
      logo: "☠️"
    }
  }
}
 */


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
                  <Model3D model={it?.model} config={config} onClick={() => onClickModel?.(it)}/>
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
