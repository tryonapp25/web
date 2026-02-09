import React, { useEffect, useState } from "react";
import styles from "./CCFF02.module.css";
import Model3D from "../../components/3dModel";

const config = {
  camera_orbit: "auto 70deg",
}


export default function Template({data, pressable, onPress, onClickModel }) {
    const [template, setTemplate] = useState(data);
    const {contents} = template;
    useEffect(() => {
        setTemplate(data);
    }, [data]);

    const handlePress = () => {
      if (!pressable) return;
      onPress?.(template);
    };

    return (
        <div className={styles.page} onClick={handlePress}>
        <section className={styles.poster}>
            {/* Top hero panel */}
            <header className={styles.hero}>
            <div className={styles.heroInner}>
                <div className={styles.heroText}>
                <div className={styles.heroTitle}>
                    <div>{template?.heading}</div>
                </div>

                <p className={styles.heroPara}>{template?.subheading}</p>
                </div>

                <div className={styles.heroImageWrap}>
                <img
                    className={styles.heroImage}
                    src={template?.information?.more?.heroImage}
                    alt="Coffee cup and beans"
                    loading="lazy"
                />
                </div>
            </div>
            </header>

            {/* Cards grid */}
            <main className={styles.grid}>
            {contents.map((item, index) => (
                <article key={index} className={styles.card}>
                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDesc}>{item.description}</p>

                    {item.data.map((d, ix) => {
                        return <div key={ix} className={styles.cardPrice}>{d.price}</div>;
                    })}

                    <div className={styles.cardImageWrap}>
                        <Model3D
                            config={config}
                            model={item?.model}
                            onClick={() => onClickModel?.({data:item, config: config})}
                        />
                    </div>
                </div>
                </article>
            ))}
            </main>
        </section>
        </div>
    );
}
