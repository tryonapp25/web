import React, { useMemo } from "react";
import styles from "./TYPK10.module.css";
import Model3D from "../components/3dModel";

function SushiImage({ model }) {
  return (
    <div className={styles.imgWrap}>
      <div className={styles.img}>
        <Model3D model={model} />
      </div>
    </div>
  );
}

export default function Template({ data, pressable, onPress }) {
  const items = useMemo(() => {
    if (!data?.contents) return [];
    return data.contents.map((item) => ({
      title: item.title,
      model: item.model,
      price: item.data?.[0]?.price ?? "",
      note: item.data?.[0]?.name ?? "",
    }));
  }, [data]);

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <div className={styles.page} onClick={onSelectedTemplate}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{data?.heading}</h1>

        <div className={styles.subWrap}>
          <div className={styles.brush} />
          <div className={styles.subheading}>{data?.subheading}</div>
        </div>

        <p className={styles.note}>
          (2 pcs of sushi or sashimi per order)
        </p>
      </header>

      <section className={styles.grid}>
        {items.map((item, idx) => (
          <article key={idx} className={styles.item}>
            <SushiImage model={item.model} />

            <div className={styles.name}>{item.title}</div>
            <div className={styles.price}>{item.price}</div>
          </article>
        ))}
      </section>
    </div>
  );
}
