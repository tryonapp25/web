import styles from "./AXQP83.module.css";
import Model3D from "../components/3dModel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import http from "../http/http";
import httpMessage from "../http/httpMessage";

export default function PizzaTemplate2({ data, pressable, editable = false, onPress, onSave }) {
  const navigate = useNavigate();
  if (!data) return null;

  const [isEditable, setIsEditable] = useState(false);

  const [heading, setHeading] = useState(data?.heading ?? "");
  const [subheading, setSubheading] = useState(data?.subheading ?? "");

  const [phone, setPhone] = useState(data?.information?.phone ?? "");
  const [address, setAddress] = useState(data?.information?.address ?? "");

  const [contents, setContents] = useState(data?.contents || []);

  const handlePress = () => {
    if (isEditable) return;
    if (!pressable) return;
    if (!data?.id) return;
    onPress(data);
  };

  const updateItemTitle = (itemIndex, newTitle) => {
    setContents((prev) =>
      prev.map((it, i) => (i === itemIndex ? { ...it, title: newTitle } : it))
    );
  };

  const updateRow = (itemIndex, rowIndex, field, value) => {
    setContents((prev) =>
      prev.map((it, i) => {
        if (i !== itemIndex) return it;
        return {
          ...it,
          data: (it.data || []).map((r, j) => (j === rowIndex ? { ...r, [field]: value } : r)),
        };
      })
    );
  };

  const addRow = (itemIndex) => {
    setContents((prev) =>
      prev.map((it, i) => {
        if (i !== itemIndex) return it;
        const nextData = Array.isArray(it.data) ? it.data : [];
        return { ...it, data: [...nextData, { name: "", price: "" }] };
      })
    );
  };

  const removeRow = (itemIndex, rowIndex) => {
    setContents((prev) =>
      prev.map((it, i) => {
        if (i !== itemIndex) return it;
        return { ...it, data: (it.data || []).filter((_, j) => j !== rowIndex) };
      })
    );
  };

  const handleSaveButton = () => {
    onSave(data)
  }


  return (
    <div
      className={`${styles.stage} ${isEditable ? styles.editing : ""}`}
      onClick={handlePress}
      role="button"
      tabIndex={0}
    >
      {editable && (
        <button
          type="button"
          className={`${styles.editButton} ${isEditable ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditable((p) => !p);
            handleSaveButton();
          }}
        >
          {isEditable ? "Save" : "Edit"}
        </button>
      )}

      <header className={styles.header}>
        <div className={styles.brandLine}>
          <span className={styles.logoDot} />
          <span className={styles.brandText}>DOMEENOSE PIZZA AND FRIES</span>
        </div>

        <div className={styles.titleWrap}>
          <div className={styles.bigPizza}>
            {isEditable ? (
              <input
                className={styles.input}
                value={heading}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setHeading(e.target.value);
                  data.heading = e.target.value; // consider lifting state instead of mutating props
                }}
              />
            ) : (
              heading
            )}
          </div>

          <div className={styles.scriptMenu}>
            {isEditable ? (
              <input
                className={styles.input}
                value={subheading}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setSubheading(e.target.value);
                  data.subheading = e.target.value;
                }}
              />
            ) : (
              subheading
            )}
          </div>
        </div>
      </header>

      <main className={styles.grid}>
        {contents.length > 0 &&
          contents.map((it, index) => (
            <article key={index} className={styles.item}>
              <div className={styles.pizzaCircle}>
                {!isEditable ? (
                  <Model3D model={it.model} />
                ) : (
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: open file picker to change model/image
                    }}
                  >
                    Upload / Change
                  </button>
                )}
              </div>

              <div className={styles.priceBox}>
                <div className={styles.itemName}>
                  {isEditable ? (
                    <input
                      className={styles.input}
                      value={it?.title ?? ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateItemTitle(index, e.target.value)}
                    />
                  ) : (
                    it?.title
                  )}
                </div>

                {(it.data || []).map((row, i) => (
                  <div key={i} className={styles.priceRows} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.priceRow}>
                      <span>
                        •{" "}
                        {isEditable ? (
                          <input
                            className={styles.input}
                            value={row?.name ?? ""}
                            onChange={(e) => updateRow(index, i, "name", e.target.value)}
                          />
                        ) : (
                          row?.name
                        )}
                      </span>

                      <span className={styles.priceValue}>
                        {isEditable ? (
                          <input
                            className={styles.input}
                            value={row?.price ?? ""}
                            onChange={(e) => updateRow(index, i, "price", e.target.value)}
                          />
                        ) : (
                          row?.price
                        )}

                        {isEditable && (
                          <button
                            type="button"
                            className={styles.removeRowButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRow(index, i);
                            }}
                            title="Remove row"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
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
            </article>
          ))}
      </main>

    </div>
  );
}
