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
  if (!open) return null;

  const [mounted, setMounted] = useState(open);
  const [currentStep, setCurrentStep] = useState("model");
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [priceandsize, setPriceAndSize] = useState([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const hasExtras = useMemo(() => Array.isArray(extras) && extras.length > 0, [extras]);

  // Initialize data
  useEffect(() => {
    if (item?.data?.ingredients && Array.isArray(item.data.ingredients)) {
      setIngredients(item.data.ingredients.map(ing => ({ ...ing, included: ing.included ?? true })));
    } else {
      setIngredients([]);
    }

    if (Array.isArray(item?.data?.data) && item.data.data.length > 0) {
      setPriceAndSize(item.data.data);
      // Auto-select first if only one option exists
      setSelectedPriceIndex(item.data.data.length === 1 ? 0 : 0);
    } else {
      setPriceAndSize([]);
      setSelectedPriceIndex(0);
    }
  }, [item]);

  // Reset extras
  useEffect(() => {
    if (extras?.length) {
      const init = {};
      extras.forEach((cat, catIdx) => {
        init[catIdx] = {};
        cat.data?.forEach((_, itemIdx) => {
          init[catIdx][itemIdx] = false;
        });
      });
      setSelectedExtras(init);
    } else {
      setSelectedExtras({});
    }
  }, [extras]);

  // Mount / unmount animation handling
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) setCurrentStep("model");
  }, [open]);

  // Keep your original ESC + scroll lock effects here...

  const toggleIngredient = (index) => {
    setIngredients(prev =>
      prev.map((ing, i) => (i === index ? { ...ing, included: !ing.included } : ing))
    );
  };

  const toggleExtra = (catIndex, itemIndex) => {
    setSelectedExtras(prev => ({
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
      category.data?.forEach((it, itemIndex) => {
        if (selectedExtras?.[catIndex]?.[itemIndex]) {
          selected.push({ ...it, category: category.title });
        }
      });
    });
    return selected;
  };

  // ─── Price Calculation ──────────────────────────────────────
  const basePrice = useMemo(() => {
    if (priceandsize.length === 0 || selectedPriceIndex >= priceandsize.length) return 0;
    return Number(priceandsize[selectedPriceIndex]?.price || 0);
  }, [priceandsize, selectedPriceIndex]);

  const extrasTotal = useMemo(() => {
    return getSelectedExtrasData().reduce((sum, ex) => sum + Number(ex.price || 0), 0);
  }, [selectedExtras, extras]); // depend on selectedExtras & extras

  const total = (basePrice + extrasTotal) * quantity;

  const currency = data?.currency || "€";

  const isPriceStepValid = priceandsize.length === 0 || selectedPriceIndex >= 0;

  // ─── Navigation ─────────────────────────────────────────────
  const handleNextClick = () => {
    if (currentStep === "priceandsize" && !isPriceStepValid) return;

    if (currentStep === "model") {
      if (priceandsize.length > 0) return setCurrentStep("priceandsize");
      if (ingredients.length > 0) return setCurrentStep("ingredients");
      if (hasExtras) return setCurrentStep("extras");
      return;
    }
    if (currentStep === "priceandsize") {
      if (ingredients.length > 0) return setCurrentStep("ingredients");
      if (hasExtras) return setCurrentStep("extras");
      return;
    }
    if (currentStep === "ingredients") {
      if (hasExtras) return setCurrentStep("extras");
      return;
    }
  };

  const handleBackClick = () => {
    if (currentStep === "extras") {
      if (ingredients.length > 0) return setCurrentStep("ingredients");
      if (priceandsize.length > 0) return setCurrentStep("priceandsize");
      return setCurrentStep("model");
    }
    if (currentStep === "ingredients") {
      if (priceandsize.length > 0) return setCurrentStep("priceandsize");
      return setCurrentStep("model");
    }
    if (currentStep === "priceandsize") {
      return setCurrentStep("model");
    }
  };

  const buildOrderPayload = () => {
    const chosenOption = priceandsize[selectedPriceIndex] || null;
    return {
      ...item,
      data: {
        ...item?.data,
        data: chosenOption ? [{ ...chosenOption, quantity }] : [],
        ingredients,
        extras: getSelectedExtrasData(),
      },
      quantity, // helpful for cart display
    };
  };

  const stepLabel = {
    model: "Preview",
    priceandsize: "Size & Price",
    ingredients: "Ingredients",
    extras: "Extras",
  }[currentStep] || "Item";

  if (!mounted) return null;

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayIn : styles.overlayOut}`}
      onMouseDown={e => e.target === e.currentTarget && onClose?.()}
      onAnimationEnd={() => !open && setMounted(false)}
    >
      <div className={styles.stage}>
        {/* Top Bar – unchanged */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.stepPill}>{stepLabel}</span>
            <div className={styles.topTitleWrap}>
              <div className={styles.topTitle} title={item?.data?.title || ""}>
                {item?.data?.title || "Item"}
              </div>
              {item?.data?.description && (
                <div className={styles.topSubTitle} title={item?.data?.description}>
                  {item.data.description}
                </div>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content – keep original structure */}
        <div className={styles.content}>
          {currentStep === "model" && (
            <>
              <div className={styles.modelArea}>
                <Model3D
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
                    {basePrice > 0 ? `Selected • ${basePrice}${currency}` : "Select one"}
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>
                  Choose an option before continuing.
                </p>
              </div>
              <div className={styles.optionList}>
                {priceandsize.map((option, index) => {
                  const active = index === selectedPriceIndex;
                  const label =
                    option?.size ||
                    option?.label ||
                    option?.title ||
                    (option?.name?.length > 26 ? `Option ${index + 1}` : option?.name) ||
                    `Option ${index + 1}`;

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedPriceIndex(index)}
                      className={`${styles.optionRow} ${active ? styles.optionRowActive : ""}`}
                    >
                      <div className={styles.optionLeft}>
                        <div className={styles.optionName}>{label}</div>
                        {option?.description && (
                          <div className={styles.optionSub}>{option.description}</div>
                        )}
                      </div>
                      <div className={styles.optionRight}>
                        <div className={styles.optionPrice}>
                          {option?.price || "—"}
                          {currency}
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

          {/* ingredients & extras steps – mostly unchanged, just keep your original markup */}

          {currentStep === "ingredients" && (
            <div className={styles.scrollArea}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Ingredients</h3>
                  <span className={styles.metaPill}>
                    {ingredients.filter(i => i.included).length}/{ingredients.length} included
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
                    <span
                      className={`${styles.fakeBox} ${ing.included ? styles.fakeBoxOn : ""}`}
                    >
                      {ing.included && (
                        <svg viewBox="0 0 24 24" className={styles.checkIcon}>
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
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Extras</h3>
                  <span className={styles.metaPill}>
                    {getSelectedExtrasData().length} selected
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
                            <span
                              className={`${styles.fakeBox} ${checked ? styles.fakeBoxGreen : ""}`}
                            >
                              {checked && (
                                <svg viewBox="0 0 24 24" className={styles.checkIcon}>
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            <span className={styles.rowText}>
                              <span className={styles.rowTitle}>{extraItem.name}</span>
                              <span className={styles.rowHint}>{checked ? "Added" : "Not added"}</span>
                            </span>
                            <span className={styles.pricePill}>
                              {extraItem.price}{currency}
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

        {/* Footer – enhanced with total & quantity */}
        {orderFeatureEnabled && (
          <div className={styles.footer}>
            {currentStep !== "model" ? (
              <button className={styles.secondaryBtn} onClick={handleBackClick}>
                Back
              </button>
            ) : (
              <div />
            )}

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {total.toFixed(2)}{currency}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ width: "36px", height: "36px", padding: 0 }}
                >
                  −
                </button>
                <span style={{ minWidth: "32px", textAlign: "center" }}>{quantity}</span>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: "36px", height: "36px", padding: 0 }}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.footerRight}>
              {currentStep !== "extras" ? (
                <button
                  className={styles.primaryBtn}
                  onClick={handleNextClick}
                  disabled={currentStep === "priceandsize" && !isPriceStepValid}
                >
                  Next
                </button>
              ) : (
                <button
                  className={styles.primaryBtn}
                  onClick={() => onOrder?.(buildOrderPayload())}
                >
                  Add to Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}