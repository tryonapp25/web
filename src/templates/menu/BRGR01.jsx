import React from "react";
import styles from "./BRGR01.module.css";
import Model3D from "../../components/3dModel";


const config = {
  camera_orbit: "auto 70deg",
}


export default function Template({ data }) {
  if (!data) return null;

  const { drinks = [], extras = [] } = data;
  const { heading, subheading, contents = []} = data;

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.scribblesTopLeft} aria-hidden="true" />
          <h1 className={styles.title}>{(data.code || "BURGER MENU").toUpperCase()}</h1>
          <p className={styles.subtitle}>{heading || subheading || "Burger Spot"}</p>
        </header>

        {/* Grid */}
        <div className={styles.grid}>
          {contents.map((item, idx) => {
            // Pick a display price (example uses item.data[0].price or item.price)
            const displayPrice =
              item?.price ??
              item?.data?.[0]?.price ??
              "$0";

            return (
              <article className={styles.card} key={`${item.title}-${idx}`}>
                <div className={styles.priceBadge}>{String(displayPrice).replace("$", "$")}</div>

                <div className={styles.imageWrap}>
                  <div className={styles.image}>
                    <Model3D model={item.model} config={config}/>
                  </div>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>

                {/* Small ingredient line like the poster */}
                {Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
                  <p className={styles.cardDesc}>
                    {item.ingredients
                      .filter((x) => x?.included)
                      .map((x) => x.name)
                      .join(" + ")}
                  </p>
                ) : (
                  <p className={styles.cardDesc}>{item.description}</p>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom lists */}
        <div className={styles.bottom}>
          <div className={styles.listBlock}>
            <h4 className={styles.listTitle}>Adds-on</h4>
            <ul className={styles.list}>
              {extras.length !== 0 && extras.map((row, i) => (
                <li className={styles.listRow} key={`addon-${i}`}>
                  <span className={styles.listName}>{row.name}</span>
                  <span className={styles.dots} aria-hidden="true" />
                  <span className={styles.listPrice}>{row.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.listBlock}>
            <h4 className={styles.listTitle}>Drinks</h4>
            <ul className={styles.list}>
              {drinks.length !== 0 && drinks.map((row, i) => (
                <li className={styles.listRow} key={`drink-${i}`}>
                  <span className={styles.listName}>{row.name}</span>
                  <span className={styles.dots} aria-hidden="true" />
                  <span className={styles.listPrice}>{row.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.scribblesBottomRight} aria-hidden="true" />
      </div>
    </section>
  );
}

