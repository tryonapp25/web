import { useEffect, useState } from "react";
import styles from "./AXQP83.module.css";
import Model3D from "../components/3dModel";

export default function Temolate2({
  data,
  pressable,
  editable = false,
  onPress,
  onSave,
}) {
  if (!data) return null;

  const [contents, setContents] = useState(data?.contents || []);
  const [isEditable, setIsEditable] = useState(false);

  const [heading, setHeading] = useState(data?.heading ?? "");
  const [subheading, setSubheading] = useState(data?.subheading ?? "");

  useEffect(() => {
    setContents(data?.contents || []);
    setHeading(data?.heading ?? "DOMEENOSE PIZZA AND FRIES");
    setSubheading(data?.subheading ?? "PIZZA MENU");
  }, [data]);

  const handlePress = () => {
    if(!pressable) return;
    onPress(data);
  }


  const toggleEdit = (e) => {
    e.stopPropagation();
    setIsEditable((prev) => {
      const next = !prev;
      if (prev === true && next === false) {
        onSave?.({
          ...data,
          heading,
          subheading,
          contents,
        });
      }
      return next;
    });
  };

  // ✅ 3 columns x 2 rows = 6 cards
  const cards = (contents || []).slice(0, 6);

  return (
    <div className={styles.stage} onClick={() => handlePress()}>
      {editable && (
        <button
          type="button"
          className={`${styles.editButton} ${isEditable ? styles.active : ""}`}
          onClick={toggleEdit}
        >
          {isEditable ? "Save" : "Edit"}
        </button>
      )}

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.bigTitle}>
          <div className={styles.bigPizza}>{heading}</div>
          <div className={styles.scriptMenu}>{subheading}</div>
        </div>
      </div>

      {/* GRID: 3 columns x 2 rows */}
      <div className={styles.grid}>
        {cards.map((item, index) => (
          <div key={index} className={styles.card} onClick={(e) => e.stopPropagation()}>
            {/* CIRCLE */}
            <div className={styles.pizzaCircle}>
              <Model3D model={item?.model} />
            </div>

            {/* INFO BOX */}
            <div className={styles.infoBox}>
              <div className={styles.cardTitle}>
                {item.title}
              </div>

              <div className={styles.rows}>
                {/* ✅ limit rows so NO overflow */}
                {(item.data || []).slice(0, 3).map((row, i) => (
                  <Row
                    key={i}
                    name={row.name}
                    price={row.price}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ name, price}) {
  return (
    <div className={styles.row}>
      <div className={styles.bullet}>•</div>
      <div className={styles.rowName}>
        {name}
      </div>
      <div className={styles.rowPrice}>
        {price}
      </div>
    </div>
  );
}
