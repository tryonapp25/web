import React, { useEffect, useState } from "react";
import styles from "../styles/OrderViewModal.module.css";
import { Trash, Trash2 } from "lucide-react";

export default function OrderViewModal({
  open,
  onClose,
  orders = [],
  onUpdateQuantity,
  onRemoveItem,
  onRemoveIngredient,
  onRemoveExtra,
  onCheckout,
  data,
}) {
  const [mounted, setMounted] = useState(open);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = () => {
    let total = 0;
    orders.forEach((item) => {
      const quantity = item.quantity || 1;
      const basePrice = parseFloat(item.data?.[0]?.price) || 0;

      let extrasPrice = 0;
      if (item.extras && Array.isArray(item.extras)) {
        item.extras.forEach((extra) => {
          extrasPrice += parseFloat(extra.price) || 0;
        });
      }

      total += (basePrice + extrasPrice) * quantity;
    });
    return total;
  };

  useEffect(() => {
    if (open) {
      setTotalPrice(calculateTotalPrice());
      setMounted(true);
    }
  }, [open, orders]);

  useEffect(() => {
    if (!mounted) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mounted, onClose]);

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

  const totalItems = orders.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const getExtrasForItem = (item) => {
    const extras = item?.extras ?? item?.data?.extras ?? [];
    return Array.isArray(extras) ? extras : [];
  };

  const groupExtrasByCategory = (extras) => {
    const groups = {};
    extras.forEach((ex) => {
      const cat = ex.category || "Extras";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ex);
    });
    return groups;
  };

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayIn : styles.overlayOut}`}
      onMouseDown={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Order</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyText}>Your cart is empty</p>
              <p className={styles.emptySubtext}>Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className={styles.orderList}>
              {orders.map((item, index) => {
                const extras = getExtrasForItem(item);
                const grouped = groupExtrasByCategory(extras);

                return (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>

                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}

                      {/* Ingredients */}
                      {item.ingredients?.length > 0 && (
                        <div className={styles.itemIngredients}>
                          {item.ingredients
                            .filter((ing) => ing.included)
                            .map((ing, i) => (
                              <span key={i} className={styles.ingredientTag}>
                                <span>{ing.name}</span>
                                <button
                                  type="button"
                                  className={styles.inlineRemoveBtn}
                                  onClick={() => onRemoveIngredient?.(index, i)}
                                  aria-label={`Remove ${ing.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Extras */}
                      {extras.length > 0 && (
                        <div className={styles.itemExtras}>
                          {Object.entries(grouped).map(([category, list]) => (
                            <div key={category} className={styles.extrasGroup}>
                              <div className={styles.extrasGroupTitle}>{category}</div>
                              <div className={styles.extrasTags}>
                                {list.map((ex, i) => {
                                  const extraIndex = extras.findIndex(
                                    (itemEx) =>
                                      itemEx.name === ex.name &&
                                      itemEx.price === ex.price &&
                                      itemEx.category === ex.category
                                  );

                                  return (
                                    <span key={i} className={styles.extraTag}>
                                      <span className={styles.extraName}>{ex.name}</span>
                                      {ex.price ? (
                                        <span className={styles.extraPrice}>{ex.price}</span>
                                      ) : null}

                                      <button
                                        type="button"
                                        className={styles.inlineRemoveBtn}
                                        onClick={() => onRemoveExtra?.(index, extraIndex)}
                                        aria-label={`Remove ${ex.name}`}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => onUpdateQuantity?.(index, (item.quantity || 1) - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.quantity}>{item.quantity || 1}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => onUpdateQuantity?.(index, (item.quantity || 1) + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className={styles.removeBtn}
                        onClick={() => onRemoveItem?.(index)}
                        aria-label="Remove item"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {orders.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summary}>
              <span className={styles.summaryLabel}>Total Items:</span>
              <span className={styles.summaryValue}>{totalItems}x</span>
            </div>
            <p className={styles.totalPriceLabel}>
              Total Price: {totalPrice.toFixed(2)} {data?.currency}
            </p>
            <button className={styles.checkoutBtn} onClick={onCheckout}>
              Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}