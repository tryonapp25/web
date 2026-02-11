// PizzaTemplate1.jsx — Fullscreen (100% x 100%), screenshot-like layout
import styles from "./MZLK04.module.css";
import Model3D from "../../components/3dModel";
import { useState } from "react";


const config = {
  camera_orbit: "auto 55deg",
}

export default function Template({ data = [], pressable, onPress, onClickModel }) {
  const [template] = useState(data)
  const { subheading, heading, contents } = template;

  const pizzaPosClass = [styles.pizzaTop, styles.pizzaMid, styles.pizzaBottom];
  const blockPosClass = [styles.blockTopRight, styles.blockMidLeft, styles.blockBottomRight];

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <div className={styles.page} onClick={onSelectedTemplate}>
        {/* Header */}
        <div className={styles.badge}>{subheading}</div>
        <div className={styles.title}>{heading}</div>

        {/* 3 circular pizzas / models */}
        {contents.slice(0, 3).map((section, i) => (
          <div key={`pizza-${i}`} className={`${styles.pizzaWrap} ${pizzaPosClass[i]}`}>
            
            <div className={styles.pizzaInner} >
              {/* Use 3D model */}
              <Model3D config={config} images={section?.images} model={section.model} onClick={() => onClickModel({data: section, config: config})}/>
            </div>
          </div>
        ))}

        {/* Menu blocks */}
        {contents.slice(0, 3).map((section, i) => (
          <div key={`block-${i}`} className={`${styles.block} ${blockPosClass[i]}`}>
            <div className={styles.blockTitle}>{section.title}</div>

            <div className={styles.rows}>
              {section.data.map((item, idx) => (
                <div key={`${i}-${idx}`} className={styles.row}>
                  <span className={styles.item}>{item.name}</span>
                  <span className={styles.leader} />
                  <span className={styles.price}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
