import React, { useEffect, useState } from "react";
import styles from "./CCFF02.module.css";
import Model3D from "../../components/3dModel";



/* const coffeeMenu = {
  id: 202,
  category: "coffee",
  code: "CCFF02",
  name: "Coffee",
  price: 1,
  uid: 5,
  type: "demo",
  subheading: "Freshly brewed coffee, silky milk, and cozy flavors — made to brighten your day. Choose a classic latte, a sweet mocha, or a smooth cold brew.",
  heading: "ENJOY A CUP OF HAPPINESS",
  contents: [
    {
      title: "Caramel Latte",
      description:
        "Espresso with steamed milk and buttery caramel. Smooth, sweet, and cozy.",
      data:[
        {name: "Medium", price: "$5"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FCaramel_Latte.glb_51bda9d5-d704-46b5-b138-f5a3a7164cee.glb?alt=media&token=533350cc-32bb-47c2-bcbc-bff76b51ab5a",
    },
    {
      title: "Vanilla Cappuccino",
      description:
        "Bold espresso with airy foam and a gentle vanilla aroma. Light but rich.",
      data:[
        {name: "Medium", price: "$4"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FVanilla_Cappuccino.glb_8362a68e-8bec-4860-ad93-8c6f82047851.glb?alt=media&token=ee5964d1-7eb0-4d3e-a8bc-92709ac66265",
    },
    {
      title: "Cinnamon Mocha Latte",
      description:
        "Chocolate + espresso with a drizzle of honey. Deep cocoa with warm sweetness.",
      data:[
        {name: "Medium", price: "$7"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FCinnamon_Mocha_Latte.glb_e562290c-5f67-4875-a253-4b9ec6a7b7b5.glb?alt=media&token=7b443719-804c-4e3d-910c-98cbde7d20f2"
    },
    {
      title: "Iced Latte",
      description:
        "Chilled espresso and milk over ice. Clean, creamy, and super refreshing.",
      data:[
        {name: "Medium", price: "$5"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FIced_Latte.glb_bf023458-a17e-40ca-9e64-361813e65be1.glb?alt=media&token=879eaabe-69f0-40c8-9833-2d92689d926c",
    },
    {
      title: "Cold Brew",
      description:
        "Slow-steeped for 16 hours. Naturally smooth, chocolatey, and low acidity.",
      data:[
        {name: "Medium", price: "$4"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FCold_Brew.glb_6f0740a5-a0b7-4f31-8168-49fad15a47d1.glb?alt=media&token=447835ce-7cc1-47f3-b3e6-9bc8460c7400",
    },
    {
      title: "Flat White",
      description:
        "Silky microfoam with a strong espresso base. Balanced, velvety, and modern.",
      data:[
        {name: "Medium", price: "$7"}
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FFlat_White.glb_d44343d1-b6fb-48ac-89f3-7f1d5d692773.glb?alt=media&token=6cb3a4c7-b59f-43f1-86c4-99f1d8ad531b"
    },
  ],

  information:{
    more:{
        heroImage: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2FtemplateImages%2Faaa.png?alt=media&token=8970db86-2853-41df-94e7-cbeb2ac3acb2",
    }
  }
}; */

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
