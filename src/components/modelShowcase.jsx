// ModelShowcase.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/modelShowcase.module.css";
import Model3D from "./3dModel";

export default function ModelShowcase({
  open,
  onClose,
  item,
  onOrder,
  orderFeatureEnabled,
  extras = [],
  data,
}) {
  const [currentStep, setCurrentStep] = useState("model");
  const [ingredients, setIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [priceandsize, setPriceAndSize] = useState([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const hasExtras = useMemo(
    () => Array.isArray(extras) && extras.length > 0,
    [extras]
  );

  // Initialize data when item changes
  useEffect(() => {
    if (!item) return;

    // Ingredients
    if (Array.isArray(item.data?.ingredients)) {
      setIngredients(item.data.ingredients.map((ing) => ({ ...ing })));
    } else {
      setIngredients([]);
    }

    // Price & Size options
    if (Array.isArray(item.data?.data) && item.data.data.length > 0) {
      setPriceAndSize(item.data.data);
      setSelectedPriceIndex(0);
    } else {
      setPriceAndSize([]);
      setSelectedPriceIndex(0);
    }
  }, [item]);

  // Initialize extras selection
  useEffect(() => {
    if (!extras?.length) {
      setSelectedExtras({});
      return;
    }

    const initial = {};
    extras.forEach((category, catIndex) => {
      initial[catIndex] = {};
      category.data?.forEach((_, itemIndex) => {
        initial[catIndex][itemIndex] = false;
      });
    });
    setSelectedExtras(initial);
  }, [extras]);

  // Reset step when modal is closed
  useEffect(() => {
    if (!open) {
      setCurrentStep("model");
    }
  }, [open]);

  // ESC key to close
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  // ─── Helpers ────────────────────────────────────────────────
  const toggleIngredient = (index) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, included: !ing.included } : ing
      )
    );
  };

  const toggleExtra = (catIndex, itemIndex) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [catIndex]: {
        ...prev[catIndex],
        [itemIndex]: !prev[catIndex]?.[itemIndex],
      },
    }));
  };

  const getSelectedExtrasData = () => {
    const selected = [];
    extras.forEach((category, catIndex) => {
      category.data?.forEach((extra, itemIndex) => {
        if (selectedExtras?.[catIndex]?.[itemIndex]) {
          selected.push({ ...extra, category: category.title });
        }
      });
    });
    return selected;
  };

  const buildOrderPayload = (extrasPayload = []) => {
    const chosen = priceandsize[selectedPriceIndex] || null;
    return {
      ...item,
      data: {
        ...item?.data,
        data: chosen ? [{ ...chosen, quantity: chosen.quantity ?? 1 }] : [],
        ingredients,
        extras: extrasPayload,
      },
    };
  };

  // ─── Navigation logic ───────────────────────────────────────
  const handleNext = () => {
    if (currentStep === "model") {
      if (priceandsize.length) return setCurrentStep("priceandsize");
      if (ingredients.length) return setCurrentStep("ingredients");
      if (hasExtras) return setCurrentStep("extras");
      return;
    }
    if (currentStep === "priceandsize") {
      if (ingredients.length) return setCurrentStep("ingredients");
      if (hasExtras) return setCurrentStep("extras");
      return;
    }
    if (currentStep === "ingredients") {
      if (hasExtras) return setCurrentStep("extras");
    }
  };

  const handleBack = () => {
    if (currentStep === "extras") {
      if (ingredients.length) return setCurrentStep("ingredients");
      if (priceandsize.length) return setCurrentStep("priceandsize");
      return setCurrentStep("model");
    }
    if (currentStep === "ingredients") {
      if (priceandsize.length) return setCurrentStep("priceandsize");
      return setCurrentStep("model");
    }
    if (currentStep === "priceandsize") {
      return setCurrentStep("model");
    }
  };

  const hasNextStep = priceandsize.length > 0 || ingredients.length > 0 || hasExtras;

  const stepLabel =
    currentStep === "model" ? "Preview" :
    currentStep === "priceandsize" ? "Size & Price" :
    currentStep === "ingredients" ? "Ingredients" : "Extras";

  const getOptionLabel = (option, index) => {
    return (
      option?.size ||
      option?.label ||
      option?.title ||
      (typeof option?.name === "string" && option.name.length > 26
        ? `Option ${index + 1}`
        : option?.name) ||
      `Option ${index + 1}`
    );
  };

  const getOptionSubLabel = (option) => option?.description || option?.note || "";
  const getOptionPrice = (option) => option?.price ?? "";

  return (
    <div
      className={`${styles.overlay} ${styles.overlayIn}`}
      onMouseDown={handleOverlayClick}
    >
      <div className={styles.stage}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.stepPill}>{stepLabel}</span>
            <div className={styles.topTitleWrap}>
              <div className={styles.topTitle} title={item?.data?.title || ""}>
                {item?.data?.title || "Item"}
              </div>
              {item?.data?.description && (
                <div className={styles.topSubTitle} title={item.data.description}>
                  {item.data.description}
                </div>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {currentStep === "model" && (
            <>
              <div className={styles.modelArea}>
                <Model3D
                  key={`model-${item?.id || item?.data?.title || "unknown"}`}
                  model={item?.data?.model}
                  config={item?.config}
                  images={item?.data?.images}
                  allowShowModel={true}
                />
              </div>

              <div className={styles.panel}>
                <h2 className={styles.panelTitle}>{item?.data?.title}</h2>
                {item?.data?.description && (
                  <p className={styles.panelDesc}>{item.data.description}</p>
                )}
              </div>
            </>
          )}

          {currentStep === "priceandsize" && (
            <div className={styles.scrollArea}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Choose Size & Price</h3>
                  <span className={styles.metaPill}>
                    {priceandsize?.[selectedPriceIndex]?.price
                      ? `Selected • ${priceandsize[selectedPriceIndex].price}${data?.currency || ""}`
                      : "Select one"}
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>Choose an option before continuing.</p>
              </div>

              <div className={styles.optionList}>
                {priceandsize.map((option, index) => {
                  const active = index === selectedPriceIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPriceIndex(index)}
                      className={`${styles.optionRow} ${active ? styles.optionRowActive : ""}`}
                    >
                      <div className={styles.optionLeft}>
                        <div className={styles.optionName}>{getOptionLabel(option, index)}</div>
                        {getOptionSubLabel(option) ? (
                          <div className={styles.optionSub}>{getOptionSubLabel(option)}</div>
                        ) : (
                          <div className={styles.optionSubMuted}>Tap to select</div>
                        )}
                      </div>
                      <div className={styles.optionRight}>
                        <div className={styles.optionPrice}>
                          {getOptionPrice(option)}{data?.currency || ""}
                        </div>
                        <div
                          className={`${styles.radioDot} ${active ? styles.radioDotOn : ""}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === "ingredients" && (
            <div className={styles.scrollArea}>
              {/* Ingredients list - same as before */}
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Ingredients</h3>
                  <span className={styles.metaPill}>
                    {ingredients.filter((i) => i.included).length}/{ingredients.length} included
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>Toggle items to customize your order.</p>
              </div>

              <div className={styles.listCard}>
                {ingredients.map((ing, index) => (
                  <label
                    key={index}
                    className={`${styles.checkRow} ${ing.included ? styles.rowOn : styles.rowOff}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!ing.included}
                      onChange={() => toggleIngredient(index)}
                      className={styles.hiddenCheck}
                    />
                    <span className={`${styles.fakeBox} ${ing.included ? styles.fakeBoxOn : ""}`}>
                      {ing.included && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.rowText}>
                      <span className={`${styles.rowTitle} ${!ing.included ? styles.rowTitleOff : ""}`}>
                        {ing.name}
                      </span>
                      <span className={styles.rowHint}>
                        {ing.included ? "Included" : "Removed"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === "extras" && (
            <div className={styles.scrollArea}>
              {/* Extras list - same as before */}
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Extras</h3>
                  <span className={styles.metaPill}>
                    {Object.values(selectedExtras).reduce(
                      (sum, cat) => sum + Object.values(cat).filter(Boolean).length,
                      0
                    )}{" "}
                    selected
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>Add upgrades and sides to your order.</p>
              </div>

              <div className={styles.categoryList}>
                {extras.map((category, catIndex) => (
                  <div key={catIndex} className={styles.categoryCard}>
                    <div className={styles.categoryHead}>
                      <div>
                        <div className={styles.categoryTitle}>{category.title}</div>
                        {category.description && (
                          <div className={styles.categoryDesc}>{category.description}</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.categoryItems}>
                      {category.data?.map((extraItem, itemIndex) => {
                        const checked = !!selectedExtras?.[catIndex]?.[itemIndex];
                        return (
                          <label
                            key={itemIndex}
                            className={`${styles.checkRow} ${checked ? styles.rowOnGreen : styles.rowOff}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleExtra(catIndex, itemIndex)}
                              className={styles.hiddenCheck}
                            />
                            <span className={`${styles.fakeBox} ${checked ? styles.fakeBoxGreen : ""}`}>
                              {checked && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            <span className={styles.rowText}>
                              <span className={styles.rowTitle}>{extraItem.name}</span>
                              <span className={styles.rowHint}>{checked ? "Added" : "Not added"}</span>
                            </span>
                            <span className={styles.pricePill}>
                              {extraItem.price}{data?.currency || ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {orderFeatureEnabled && (
          <div className={styles.footer}>
            {currentStep !== "model" && (
              <button className={styles.secondaryBtn} onClick={handleBack}>
                Back
              </button>
            )}

            <div className={styles.footerRight}>
              {currentStep === "model" && hasNextStep && (
                <button className={styles.primaryBtn} onClick={handleNext}>
                  Next
                </button>
              )}

              {currentStep === "priceandsize" &&
                (ingredients.length > 0 || hasExtras ? (
                  <button className={styles.primaryBtn} onClick={handleNext}>
                    Next
                  </button>
                ) : (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => onOrder?.(buildOrderPayload([]))}
                  >
                    Order
                  </button>
                ))}

              {currentStep === "ingredients" &&
                (hasExtras ? (
                  <button className={styles.primaryBtn} onClick={handleNext}>
                    Next
                  </button>
                ) : (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => onOrder?.(buildOrderPayload([]))}
                  >
                    Order
                  </button>
                ))}

              {currentStep === "extras" && (
                <button
                  className={styles.primaryBtn}
                  onClick={() => onOrder?.(buildOrderPayload(getSelectedExtrasData()))}
                >
                  Order
                </button>
              )}

              {currentStep === "model" && !hasNextStep && (
                <button
                  className={styles.primaryBtn}
                  onClick={() => onOrder?.(buildOrderPayload([]))}
                >
                  Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}