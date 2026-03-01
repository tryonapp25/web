// REST01.jsx
import React, { useMemo } from "react";
import styles from "./REST01.module.css";
import Model3D from "../../components/3dModel";

const config = { camera_orbit: "auto 55deg" };

function splitTitleForLayout(title) {
  const parts = String(title || "").trim().split(/\s+/);
  if (parts.length <= 1) return [title];
  if (parts.length === 2) return [parts[0], parts[1]];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

function money(v) {
  const s = v == null ? "" : String(v).trim();
  return s ? `${s}` : "";
}

export default function Template({ data = [], pressable, onPress, onClickModel }) {
  const { dishes, beverage, dessert } = useMemo(() => {
    const contents = Array.isArray(data?.contents) ? data.contents : [];
    const extras = Array.isArray(data?.extras) ? data.extras : [];

    // dishes always come from contents
    const dishItems = contents.filter(
      (c) => c?.title && c.title !== "Beverage" && c.title !== "Dessert"
    );

    // extras: prefer data.extras, fallback to searching in contents
    const bev =
      extras.find((x) => x?.title === "Beverage") ||
      contents.find((x) => x?.title === "Beverage") ||
      null;

    const des =
      extras.find((x) => x?.title === "Dessert") ||
      contents.find((x) => x?.title === "Dessert") ||
      null;

    return {
      dishes: dishItems.slice(0, 6),
      beverage: bev,
      dessert: des,
    };
  }, [data]);

  const renderPriceList = (section) => {
    const rows = Array.isArray(section?.data) ? section.data : [];
    if (!rows.length) return null;

    return (
      <div>
        <div className={styles.listTitle}>{section?.title || ""}</div>
        <ul className={styles.priceList}>
          {rows.map((r, idx) => (
            <li className={styles.priceRow} key={`${r?.name || "row"}-${idx}`}>
              <span className={styles.priceName}>{r?.name || ""}</span>
              <span className={styles.priceVal}>{money(r?.price)}{data?.currency}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <div className={styles.page} onClick={onSelectedTemplate}>
      <div className={styles.sheet}>
        {/* Top ornament rule */}
        <div className={styles.ornRule}>
          <span className={styles.ornLine} />
          <span className={styles.ornMark} />
          <span className={styles.ornLine} />
        </div>

        <div className={styles.brand}>{data?.subheading || ""}</div>
        <h1 className={styles.title}>{data?.heading || "FOOD MENU"}</h1>

        {/* Middle ornament rule */}
        <div className={styles.ornRuleSmall}>
          <span className={styles.ornLine} />
          <span className={styles.ornMarkSmall} />
          <span className={styles.ornLine} />
        </div>

        {/* Dishes */}
        <div className={styles.dishGrid}>
          {dishes.map((item, index) => {
            const price = money(item?.data?.[0]?.price);
            const model = item?.model || "";
            const lines = splitTitleForLayout(item.title);

            return (
              <div className={styles.dish} key={index} onClick={() => onClickModel({data: item, config: config})}>
                <div className={styles.dishText}>
                  <div className={styles.dishTitle}>
                    {lines.map((l, idx) => (
                      <span className={styles.dishTitleLine} key={idx}>
                        {l}
                      </span>
                    ))}
                  </div>

                  {price ? <div className={styles.dishPrice}>{price}{data?.currency}</div> : null}

                  {item?.description ? (
                    <p className={styles.dishDesc}>{item.description}</p>
                  ) : null}
                </div>

                <div className={styles.photoWrap}>
                  <div className={styles.photoRing}>
                    <div className={styles.photo}>
                      <Model3D model={model} config={config} images={item?.images}  onClick={() => onClickModel({data: item, config: config})}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom ornament rule (like the reference image) */}
        <div className={styles.ornRuleSmall}>
          <span className={styles.ornLine} />
          <span className={styles.ornMarkSmall} />
          <span className={styles.ornLine} />
        </div>

        {/* ✅ Extras */}
        <div className={styles.bottomGrid}>
          {renderPriceList(beverage)}
          {renderPriceList(dessert)}
        </div>
      </div>
    </div>
  );
}
