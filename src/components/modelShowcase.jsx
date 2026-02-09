import React, { useEffect, useState } from "react";
import styles from "../styles/modelShowcase.module.css";
import Model3D from "./3dModel";



export default function ModelShowcase({
  open,
  onClose,
  item,
  onOrder,
  orderFeatureEnabled,
}) {
  const [mounted, setMounted] = useState(open);
  const [showIngredients, setShowIngredients] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  // Initialize ingredients from item data
  useEffect(() => {
    if (item?.data?.ingredients) {
      setIngredients(item.data.ingredients.map(ing => ({ ...ing })));
    }
  }, [item]);

  // Reset showIngredients when modal closes
  useEffect(() => {
    if (!open) {
      setShowIngredients(false);
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

  const toggleIngredient = (index) => {
    setIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, included: !ing.included } : ing
      )
    );
  };

  const handleNextClick = () => {
    setShowIngredients(true);
  };

  const handleBackClick = () => {
    setShowIngredients(false);
  };

  return (
    <div
      className={`${styles.overlay} ${
        open ? styles.overlayIn : styles.overlayOut
      }`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={styles.stageWrapper}
      >
        <div className={styles.stage}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          
          {!showIngredients ? (
            <>
              <Model3D model={item?.data?.model} config={item?.config}/>
              <div className={styles.info}>
                <p>{item?.data?.title} : </p>
                <p>- {item?.data?.description}</p>
              </div>
              
              {orderFeatureEnabled && (
                <>
                  <div className={styles.actions}>
                    {ingredients.length > 0 && (
                      <button
                        className={styles.nextBtn}
                        onClick={handleNextClick}
                        aria-label="Next"
                      >
                        Next
                      </button>
                    )}
                  </div>
                  <div className={styles.glow} />
                </>
              )}
            </>
          ) : (
            <>
              <div className={styles.ingredientsContainer}>
                <h3 className={styles.ingredientsTitle}>Ingredients</h3>
                <div className={styles.ingredientsList}>
                  {ingredients.map((ing, index) => (
                    <label key={index} className={styles.ingredientItem}>
                      <input
                        type="checkbox"
                        checked={ing.included}
                        onChange={() => toggleIngredient(index)}
                        className={styles.ingredientCheckbox}
                      />
                      <span className={`${styles.ingredientName} ${!ing.included ? styles.ingredientExcluded : ''}`}>
                        {ing.name}
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
                <button
                  className={styles.orderBtn}
                  onClick={() => onOrder?.({ ...item, ingredients })}
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
