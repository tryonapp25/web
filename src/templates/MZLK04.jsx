// PizzaTemplate1.jsx — Fullscreen (100% x 100%), screenshot-like layout
import styles from "./MZLK04.module.css";
import Model3D from "../components/3dModel";
import { useEffect, useState } from "react";
import TemplateEditor from "./templateEditor";

export default function Template({
  data,
  editable = false,
  pressable = false,
  onPress
}) {
  if (!data) return null;
  const [contents, setContents] = useState(data?.contents || []);
  const [isEditable, setIsEditable] = useState(false);
  const [onEditMode, setOnEditMode] = useState(false);
  const [template, setTemplate] = useState(null);

  const [heading, setHeading] = useState(data?.heading ?? "");
  const [subheading, setSubheading] = useState(data?.subheading ?? "");

  // keep state in sync if parent changes data
  useEffect(() => {
    setTemplate(data);
    setContents(data?.contents || []);
    setHeading(data?.heading ?? "");
    setSubheading(data?.subheading ?? "");
  }, [data, template]);


  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }
  
  const blocks = (contents || []).slice(0, 3);
  if(onEditMode) return <TemplateEditor data={template}/>

  return (
    <div
      className={`${styles.stage} ${isEditable ? styles.editing : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelectedTemplate()}
    >
      {/* Top right edit */}
      {editable && (
        <button
          type="button"
          className={`${styles.editButton} ${isEditable ? styles.active : ""}`}
          onClick={() => setOnEditMode(true)}
        >
          Edit
        </button>
      )}

      {/* Center pill */}
      <div className={styles.pillTop} onClick={(e) => e.stopPropagation()}>
        {heading}
      </div>

      {/* Title */}
      <div className={styles.hero} onClick={(e) => e.stopPropagation()}>
        <div className={styles.heroTitle}>{data?.heroTitle}</div>

        <div className={styles.heroSubtitle}>
          {subheading}
        </div>
      </div>

      {/* Blocks */}
      {blocks.map((item, index) => (
        <div key={index}>
          {/* Circle */}
          <div className={`${styles.pizzaSlot} ${styles[`slot${index}`]}`}>
            {!isEditable ? (
              <Model3D model={item?.model} />
            ) : (
              <button
                type="button"
                className={styles.uploadButton}
                onClick={(e) => e.stopPropagation()}
              >
                Upload image
              </button>
            )}
          </div>

          {/* Text section */}
          <div className={`${styles.section} ${styles[`section${index}`]}`}>
            <h3 className={styles.sectionTitle}>
              {item.title}
            </h3>

            <div className={styles.lines}>
              {item.data?.map((row, i) => (
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

      <div className={styles.cornerGlow} />
    </div>
  );
}

function Row({ name, price}) {
  return (
    <div className={styles.row} onClick={(e) => e.stopPropagation()}>
      <div className={styles.rowLeft}>
        <span className={styles.name}>{name}</span>
        <span className={styles.leader} />
      </div>

      <div className={styles.rowRight}>
        <span className={styles.price}>{price}</span>
      </div>
    </div>
  );
}
