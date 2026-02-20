// ModelShowcase.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/modelShowcase.module.css";
import Model3D from "./3dModel";

export default function ModelShowcase({
  open,
  onClose,
  item,
  onOrder,
  orderFeatureEnabled,
  extras = [],
}) {
  const [mounted, setMounted] = useState(open);
  const [currentStep, setCurrentStep] = useState("model"); // 'model' | 'ingredients' | 'extras'
  const [ingredients, setIngredients] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});

  // Initialize ingredients from item data
  useEffect(() => {
    if (item?.data?.ingredients) {
      setIngredients(item.data.ingredients.map((ing) => ({ ...ing })));
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
    }
  }, [extras]);

  // Reset step when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep("model");
    }
  }, [open]);

  // mount/unmount for fade animation
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

  // lock scroll
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

  // Order Handlers //
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
        ...prev[categoryIndex],
        [itemIndex]: !prev[categoryIndex]?.[itemIndex],
      },
    }));
  };

  const handleNextClick = () => {
    if (currentStep === "model") {
      setCurrentStep("ingredients");
    } else if (currentStep === "ingredients" && extras && extras.length > 0) {
      setCurrentStep("extras");
    }
  };

  const handleBackClick = () => {
    if (currentStep === "extras") {
      setCurrentStep("ingredients");
    } else if (currentStep === "ingredients") {
      setCurrentStep("model");
    }
  };

  const getSelectedExtrasData = () => {
    const selected = [];
    extras.forEach((category, catIndex) => {
      category.data?.forEach((it, itemIndex) => {
        if (selectedExtras[catIndex]?.[itemIndex]) {
          selected.push({ ...it, category: category.title });
        }
      });
    });
    return selected;
  };

  const hasExtras = extras && extras.length > 0;

  return (
    <div
      className={`${styles.overlay} ${
        open ? styles.overlayIn : styles.overlayOut
      }`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.stageWrapper}>
        <div className={styles.stage}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          {currentStep === "model" && (
            <>
              <Model3D
                model={item?.data?.model}
                config={item?.config}
                images={item?.data?.images}
              />

              {/* ✅ Premium Title/Description Card */}
              <div className={styles.infoCard}>
                <div className={styles.infoHeader}>
                  <h2 className={styles.itemTitle}>{item?.data?.title}</h2>
                </div>

                {item?.data?.description && (
                  <p className={styles.itemDesc}>{item.data.description}</p>
                )}
              </div>
                
              {orderFeatureEnabled == true && (
                <>
                  <div className={styles.actions}>
                    {ingredients.length > 0 ? 
                      <button
                        className={styles.nextBtn}
                        onClick={handleNextClick}
                        aria-label="Next"
                      >
                        Next
                      </button>
                      :
                      <button
                        className={styles.orderBtn}
                        onClick={() =>
                          onOrder?.({
                            ...item,
                            data: {
                              ...item.data,
                              ingredients,
                              extras: [],
                            },
                          })
                        }
                        aria-label="Order"
                      >
                        Order
                      </button>
                    }
                  </div>
                  <div className={styles.glow} />
                </>
              )}
            </>
          )}

          {currentStep === "ingredients" && (
            <>
              <div className={styles.ingredientsContainer}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionHeaderTop}>
                    <h3 className={styles.ingredientsTitle}>Ingredients</h3>
                    <span className={styles.sectionMeta}>
                      {ingredients.filter((i) => i.included).length}/
                      {ingredients.length} included
                    </span>
                  </div>
                  <p className={styles.sectionSubTitle}>
                    Toggle items to customize your order.
                  </p>
                </div>

                <div className={styles.ingredientsList}>
                  {ingredients.map((ing, index) => (
                    <label
                      key={index}
                      className={`${styles.ingredientItem} ${
                        !ing.included ? styles.itemOff : styles.itemOn
                      }`}
                    >
                      <span className={styles.checkWrap} aria-hidden="true">
                        <input
                          type="checkbox"
                          checked={ing.included}
                          onChange={() => toggleIngredient(index)}
                          className={styles.ingredientCheckbox}
                        />
                        <span className={styles.customCheck} />
                      </span>

                      <span className={styles.itemText}>
                        <span
                          className={`${styles.ingredientName} ${
                            !ing.included ? styles.ingredientExcluded : ""
                          }`}
                        >
                          {ing.name}
                        </span>
                        <span className={styles.itemHint}>
                          {ing.included ? "Included" : "Removed"}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.backBtn}
                  onClick={handleBackClick}
                  aria-label="Back"
                >
                  Back
                </button>

                {hasExtras ? (
                  <button
                    className={styles.nextBtn}
                    onClick={handleNextClick}
                    aria-label="Next"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className={styles.orderBtn}
                    onClick={() =>
                      onOrder?.({
                        ...item,
                        data: {
                          ...item.data,
                          ingredients,
                          extras: [],
                        },
                      })
                    }
                    aria-label="Order"
                  >
                    Order
                  </button>
                )}
              </div>
            </>
          )}

          {currentStep === "extras" && (
            <>
              <div className={styles.extrasContainer}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionHeaderTop}>
                    <h3 className={styles.extrasTitle}>Extras</h3>
                    <span className={styles.sectionMeta}>
                      {getSelectedExtrasData().length} selected
                    </span>
                  </div>
                  <p className={styles.sectionSubTitle}>
                    Add upgrades and sides to your order.
                  </p>
                </div>

                <div className={styles.extrasCategoriesList}>
                  {extras.map((category, catIndex) => (
                    <div key={catIndex} className={styles.extrasCategory}>
                      <div className={styles.extrasCategoryHead}>
                        <div>
                          <h4 className={styles.extrasCategoryTitle}>
                            {category.title}
                          </h4>
                          {category.description && (
                            <p className={styles.extrasCategoryDesc}>
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={styles.extrasItemsList}>
                        {category.data?.map((extraItem, itemIndex) => {
                          const checked =
                            selectedExtras[catIndex]?.[itemIndex] || false;

                          return (
                            <label
                              key={itemIndex}
                              className={`${styles.extrasItem} ${
                                checked ? styles.extraOn : styles.extraOff
                              }`}
                            >
                              <span className={styles.checkWrap} aria-hidden="true">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleExtra(catIndex, itemIndex)}
                                  className={styles.extrasCheckbox}
                                />
                                <span className={styles.customCheck} />
                              </span>

                              <span className={styles.itemText}>
                                <span className={styles.extrasItemName}>
                                  {extraItem.name}
                                </span>
                                <span className={styles.itemHint}>
                                  {checked ? "Added" : "Not added"}
                                </span>
                              </span>

                              <span className={styles.extrasItemPrice}>
                                {extraItem.price}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.backBtn}
                  onClick={handleBackClick}
                  aria-label="Back"
                >
                  Back
                </button>

                <button
                  className={styles.orderBtn}
                  onClick={() =>
                    onOrder?.({
                      ...item,
                      data: {
                        ...item.data,
                        ingredients,
                        extras: getSelectedExtrasData(),
                      },
                    })
                  }
                  aria-label="Order"
                >
                  Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

