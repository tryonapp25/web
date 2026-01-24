import { useEffect, useState } from "react";
import style from "./TYPK10.module.css";
import Model3D from "../components/3dModel";

export default function Template({ data = [], pressable, onPress }) {
  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }
  return (
    <div className={style.page} onClick={onSelectedTemplate}>
      <header className={style.header}>
        <h1 className={style.heading}>{data?.heading}</h1>

        <div className={style.subWrap}>
          <div className={style.brush} />
          <div className={style.subheading}>{data?.subheading}</div>
        </div>

        <p className={style.note}>
          (2 pcs of sushi or sashimi per order)
        </p>
      </header>

      <main className={style.grid}>
        {data.contents.map((item, i) => {
          const firstLine = item.data?.[0]; // { name: "2 pcs", price: "$6.25" }

          return (
            <div key={i} className={style.card}>
              <div className={style.imageWrap}>
                <Model3D model={item.model} />
              </div>

              <div className={style.name}>{item.title}</div>

              {/* show price */}
              <div className={style.price}>{firstLine?.price}</div>

              {/* if you also want "2 pcs" shown, uncomment:
              <div className={style.note}>{firstLine?.name}</div>
              */}
            </div>
          );
        })}
      </main>
    </div>
  );
}



