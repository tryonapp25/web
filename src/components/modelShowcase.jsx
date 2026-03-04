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
  const [mounted, setMounted] = useState(open);
  const [currentStep, setCurrentStep] = useState("model"); // 'model' | 'priceandsize' | 'ingredients' | 'extras'
  const [ingredients, setIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [priceandsize, setPriceAndSize] = useState([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const hasExtras = useMemo(
    () => Array.isArray(extras) && extras.length > 0,
    [extras]
  );

  // Initialize ingredients + price/size from item
  useEffect(() => {
    if (item?.data?.ingredients && Array.isArray(item.data.ingredients)) {
      setIngredients(item.data.ingredients.map((ing) => ({ ...ing })));
    } else {
      setIngredients([]);
    }

    if (Array.isArray(item?.data?.data) && item.data.data.length > 0) {
      setPriceAndSize(item.data.data);
      setSelectedPriceIndex(0);
    } else {
      setPriceAndSize([]);
      setSelectedPriceIndex(0);
    }
  }, [item]);

  // Initialize selected extras state
  useEffect(() => {
    if (extras && extras.length > 0) {
      const initialExtras = {};
      extras.forEach((category, catIndex) => {
        initialExtras[catIndex] = {};
        category.data?.forEach((_, itemIndex) => {
          initialExtras[catIndex][itemIndex] = false;
        });
      });
      setSelectedExtras(initialExtras);
    } else {
      setSelectedExtras({});
    }
  }, [extras]);

  // Reset step when modal closes
  useEffect(() => {
    if (!open) setCurrentStep("model");
  }, [open]);

  // Mount/unmount for fade animation
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!mounted) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mounted, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleAnimationEnd = () => {
    if (!open) setMounted(false);
  };

  // ===== Helpers =====
  const toggleIngredient = (index) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, included: !ing.included } : ing
      )
    );
  };

  const toggleExtra = (categoryIndex, itemIndex) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [categoryIndex]: {
        ...(prev?.[categoryIndex] || {}),
        [itemIndex]: !prev?.[categoryIndex]?.[itemIndex],
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

  const buildOrderPayload = (extrasPayload = []) => {
    const chosenOption =
      priceandsize.length > 0 ? priceandsize[selectedPriceIndex] : null;

    return {
      ...item,
      data: {
        ...item?.data,
        data: chosenOption
          ? [{ ...chosenOption, quantity: chosenOption.quantity ?? 1 }]
          : [],
        ingredients,
        extras: extrasPayload,
      },
    };
  };

  // Step flow
  const handleNextClick = () => {
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

  const hasNextStep =
    priceandsize.length > 0 || ingredients.length > 0 || hasExtras;

  const stepLabel =
    currentStep === "model"
      ? "Preview"
      : currentStep === "priceandsize"
      ? "Size & Price"
      : currentStep === "ingredients"
      ? "Ingredients"
      : "Extras";

  // If option.name is huge (like your screenshot), we fall back to a short label.
  const getOptionLabel = (option, index) => {
    return (
      option?.size ||
      option?.label ||
      option?.title ||
      // if name is huge dish title, use generic label:
      (typeof option?.name === "string" && option.name.length > 26
        ? `Option ${index + 1}`
        : option?.name) ||
      `Option ${index + 1}`
    );
  };

  const getOptionSubLabel = (option) => {
    // Optional, only show if exists
    return option?.description || option?.note || "";
  };

  const getOptionPrice = (option) => option?.price ?? "";

  return (
    <div
      className={`${styles.overlay} ${
        open ? styles.overlayIn : styles.overlayOut
      }`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.stage}>
        {/* ===== Top Bar ===== */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.stepPill}>{stepLabel}</span>
            <div className={styles.topTitleWrap}>
              <div className={styles.topTitle} title={item?.data?.title || ""}>
                {item?.data?.title || "Item"}
              </div>
              {item?.data?.description ? (
                <div
                  className={styles.topSubTitle}
                  title={item?.data?.description || ""}
                >
                  {item?.data?.description}
                </div>
              ) : null}
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* ===== Content ===== */}
        <div className={styles.content}>
          {/* ================== MODEL STEP ================== */}
          {currentStep === "model" && (
            <>
              <div className={styles.modelArea}>
                <Model3D
                  model={item?.data?.model}
                  config={item?.config}
                  images={item?.data?.images}
                />
              </div>

              <div className={styles.panel}>
                <h2 className={styles.panelTitle}>{item?.data?.title}</h2>
                {item?.data?.description ? (
                  <p className={styles.panelDesc}>{item.data.description}</p>
                ) : null}
              </div>
            </>
          )}

          {/* ================== PRICE & SIZE STEP ================== */}
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
                <p className={styles.sectionSubTitle}>
                  Choose an option before continuing.
                </p>
              </div>

              <div className={styles.optionList}>
                {priceandsize.map((option, index) => {
                  const active = index === selectedPriceIndex;
                  const label = getOptionLabel(option, index);
                  const sub = getOptionSubLabel(option);
                  const price = getOptionPrice(option);

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedPriceIndex(index)}
                      className={`${styles.optionRow} ${
                        active ? styles.optionRowActive : ""
                      }`}
                    >
                      <div className={styles.optionLeft}>
                        <div className={styles.optionName}>{label}</div>
                        {sub ? (
                          <div className={styles.optionSub}>{sub}</div>
                        ) : (
                          <div className={styles.optionSubMuted}>
                            Tap to select
                          </div>
                        )}
                      </div>

                      <div className={styles.optionRight}>
                        <div className={styles.optionPrice}>{price}{data?.currency || ""}</div>
                        <div
                          className={`${styles.radioDot} ${
                            active ? styles.radioDotOn : ""
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================== INGREDIENTS STEP ================== */}
          {currentStep === "ingredients" && (
            <div className={styles.scrollArea}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Ingredients</h3>
                  <span className={styles.metaPill}>
                    {ingredients.filter((i) => i.included).length}/
                    {ingredients.length} included
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>
                  Toggle items to customize your order.
                </p>
              </div>

              <div className={styles.listCard}>
                {ingredients.map((ing, index) => (
                  <label
                    key={index}
                    className={`${styles.checkRow} ${
                      ing.included ? styles.rowOn : styles.rowOff
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!ing.included}
                      onChange={() => toggleIngredient(index)}
                      className={styles.hiddenCheck}
                    />

                    <span
                      className={`${styles.fakeBox} ${
                        ing.included ? styles.fakeBoxOn : ""
                      }`}
                      aria-hidden="true"
                    >
                      {ing.included && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>

                    <span className={styles.rowText}>
                      <span
                        className={`${styles.rowTitle} ${
                          !ing.included ? styles.rowTitleOff : ""
                        }`}
                      >
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

          {/* ================== EXTRAS STEP ================== */}
          {currentStep === "extras" && (
            <div className={styles.scrollArea}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderTop}>
                  <h3 className={styles.sectionTitle}>Extras</h3>
                  <span className={styles.metaPill}>
                    {getSelectedExtrasData().length} selected
                  </span>
                </div>
                <p className={styles.sectionSubTitle}>
                  Add upgrades and sides to your order.
                </p>
              </div>

              <div className={styles.categoryList}>
                {extras.map((category, catIndex) => (
                  <div key={catIndex} className={styles.categoryCard}>
                    <div className={styles.categoryHead}>
                      <div>
                        <div className={styles.categoryTitle}>{category.title}</div>
                        {category.description ? (
                          <div className={styles.categoryDesc}>
                            {category.description}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.categoryItems}>
                      {category.data?.map((extraItem, itemIndex) => {
                        const checked =
                          selectedExtras?.[catIndex]?.[itemIndex] || false;

                        return (
                          <label
                            key={itemIndex}
                            className={`${styles.checkRow} ${
                              checked ? styles.rowOnGreen : styles.rowOff
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleExtra(catIndex, itemIndex)}
                              className={styles.hiddenCheck}
                            />

                            <span
                              className={`${styles.fakeBox} ${
                                checked ? styles.fakeBoxGreen : ""
                              }`}
                              aria-hidden="true"
                            >
                              {checked && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>

                            <span className={styles.rowText}>
                              <span className={styles.rowTitle}>
                                {extraItem.name}
                              </span>
                              <span className={styles.rowHint}>
                                {checked ? "Added" : "Not added"}
                              </span>
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

        {/* ===== Footer Actions ===== */}
        {orderFeatureEnabled === true && (
          <div className={styles.footer}>
            {currentStep !== "model" ? (
              <button className={styles.secondaryBtn} onClick={handleBackClick}>
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Right side */}
            <div className={styles.footerRight}>
              {currentStep === "model" && hasNextStep ? (
                <button className={styles.primaryBtn} onClick={handleNextClick}>
                  Next
                </button>
              ) : null}

              {currentStep === "priceandsize" ? (
                ingredients.length === 0 && !hasExtras ? (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => onOrder?.(buildOrderPayload([]))}
                  >
                    Order
                  </button>
                ) : (
                  <button className={styles.primaryBtn} onClick={handleNextClick}>
                    Next
                  </button>
                )
              ) : null}

              {currentStep === "ingredients" ? (
                hasExtras ? (
                  <button className={styles.primaryBtn} onClick={handleNextClick}>
                    Next
                  </button>
                ) : (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => onOrder?.(buildOrderPayload([]))}
                  >
                    Order
                  </button>
                )
              ) : null}

              {currentStep === "extras" ? (
                <button
                  className={styles.primaryBtn}
                  onClick={() => onOrder?.(buildOrderPayload(getSelectedExtrasData()))}
                >
                  Order
                </button>
              ) : null}

              {/* If model is last step (no next steps) */}
              {currentStep === "model" && !hasNextStep ? (
                <button
                  className={styles.primaryBtn}
                  onClick={() => onOrder?.(buildOrderPayload([]))}
                >
                  Order
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}