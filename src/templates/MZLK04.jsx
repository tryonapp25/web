import styles from "./MZLK04.module.css";
import Model3D from "../components/3dModel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import http from "../http/http";
import httpMessage from "../http/httpMessage";

export default function PizzaTemplate1({ data, pressable, editable = false, onPress }) {
  const navigate = useNavigate();
  if (!data) return null;

  const [contents, setContents] = useState(data?.contents || []);
  const [isEditable, setIsEditable] = useState(false);

  const [heading, setHeading] = useState(data?.heading ?? "");
  const [subheading, setSubheading] = useState(data?.subheading ?? "");

  const handlePress = () => {
    if (isEditable) return;
    if (!pressable) return;
    if (!data?.id) return;
    onPress(data);
  };

  const updateSectionTitle = (sectionIndex, newTitle) => {
    setContents((prev) =>
      prev.map((sec, i) => (i === sectionIndex ? { ...sec, title: newTitle } : sec))
    );
  };

  const updateRow = (sectionIndex, rowIndex, field, value) => {
    setContents((prev) =>
      prev.map((sec, i) => {
        if (i !== sectionIndex) return sec;
        return {
          ...sec,
          data: (sec.data || []).map((r, j) => (j === rowIndex ? { ...r, [field]: value } : r)),
        };
      })
    );
  };

  // ✅ Add a new row to a section
  const addRow = (sectionIndex) => {
    setContents((prev) =>
      prev.map((sec, i) => {
        if (i !== sectionIndex) return sec;

        const nextData = Array.isArray(sec.data) ? sec.data : [];
        return {
          ...sec,
          data: [...nextData, { name: "", price: "" }],
        };
      })
    );
  };

  // ✅ Optional: remove a row from a section
  const removeRow = (sectionIndex, rowIndex) => {
    setContents((prev) =>
      prev.map((sec, i) => {
        if (i !== sectionIndex) return sec;
        return {
          ...sec,
          data: (sec.data || []).filter((_, j) => j !== rowIndex),
        };
      })
    );
  };

  return (
    <div className={styles.stage} onClick={handlePress} role="button" tabIndex={0}>
      {editable && (
        <button
          type="button"
          className={`${styles.editButton} ${isEditable ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditable((p) => !p);
          }}
        >
          {isEditable ? "Done" : "Edit"}
        </button>
      )}

      <div className={styles.topbar}>
        <div className={styles.brand}>
          {isEditable ? (
            <input
              value={heading}
              onChange={(e) => {
                setHeading(e.target.value);
                data.heading = e.target.value; // (consider lifting state instead of mutating props)
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.input}
            />
          ) : (
            heading
          )}
        </div>
      </div>

      <div className={styles.title}>
        {isEditable ? (
          <input
            value={subheading}
            onChange={(e) => {
              setSubheading(e.target.value);
              data.subheading = e.target.value; // (consider lifting state instead of mutating props)
            }}
            onClick={(e) => e.stopPropagation()}
            className={styles.input}
          />
        ) : (
          subheading
        )}
      </div>

      {contents.length > 0 &&
        contents.map((item, index) => (
          <div key={index}>
            <div className={`${styles.section} ${styles[`index${index}`]}`}>
              <h3>
                {isEditable ? (
                  <input
                    value={item.title ?? ""}
                    onChange={(e) => updateSectionTitle(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={styles.input}
                  />
                ) : (
                  item.title
                )}
              </h3>

              <div className={styles.lines}>
                {item.data?.map((row, i) => (
                  <Row
                    key={i}
                    name={row.name}
                    price={row.price}
                    editable={isEditable}
                    onChangeName={(val) => updateRow(index, i, "name", val)}
                    onChangePrice={(val) => updateRow(index, i, "price", val)}
                    onRemove={() => removeRow(index, i)}
                  />
                ))}

                {isEditable && (
                  <button
                    type="button"
                    className={styles.addRowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      addRow(index);
                    }}
                  >
                    + Add row
                  </button>
                )}
              </div>
            </div>

            <div className={`${styles.pizzaSlot} ${styles[`slot${index}`]}`}>
              {!isEditable ? (
                <Model3D model={item?.model} />
              ) : (
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: open file picker here
                  }}
                >
                  Upload image
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

function Row({ name, price, editable, onChangeName, onChangePrice, onRemove }) {
  return (
    <div className={styles.row} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dots}>
        {editable ? (
          <input
            value={name ?? ""}
            onChange={(e) => onChangeName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={styles.input}
          />
        ) : (
          <span className={styles.name}>{name}</span>
        )}
      </div>

      <div className={styles.price}>
        {editable ? (
          <input
            value={price ?? ""}
            onChange={(e) => onChangePrice(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={styles.input}
          />
        ) : (
          price
        )}

        {editable && (
          <button
            type="button"
            className={styles.removeRowButton}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            title="Remove row"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
