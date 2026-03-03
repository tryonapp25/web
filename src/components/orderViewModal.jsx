import React, { useEffect, useState } from "react";
import styles from "../styles/OrderViewModal.module.css";

export default function OrderViewModal({
  open,
  onClose,
  orders = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  data,
}) {
  const [mounted, setMounted] = useState(open);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = () => {
    console.log("Calculating total price for orders:", orders);
    let total = 0;
    orders.forEach((item) => {
      const quantity = item.quantity || 1;
      // Price is in item.data[0].price
      const basePrice = parseFloat(item.data?.[0]?.price) || 0;
      let extrasPrice = 0;
      if (item.extras && Array.isArray(item.extras)) {
        item.extras.forEach((extra) => {
          extrasPrice += parseFloat(extra.price) || 0;
        });
      }
      total += (basePrice + extrasPrice) * quantity;
    });
    console.log("Total price calculated:", total);
    return total;
  };

  useEffect(() => {
    if (open) {
      const totalPrice = calculateTotalPrice();
      setTotalPrice(totalPrice);
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
    // supports both shapes:
    // - item.extras (if you store directly at root)
    // - item.data.extras (matches how you set it in ModelShowcase)
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
                console.log("Rendering item:", item);

                return (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>

                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}

                      {/* Ingredients (included) */}
                      {item.ingredients?.length > 0 && (
                        <div className={styles.itemIngredients}>
                          {item.ingredients
                            .filter((ing) => ing.included)
                            .map((ing, i) => (
                              <span key={i} className={styles.ingredientTag}>
                                {ing.name}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* ✅ Extras */}
                      {extras.length > 0 && (
                        <div className={styles.itemExtras}>
                          {Object.entries(grouped).map(([category, list]) => (
                            <div key={category} className={styles.extrasGroup}>
                              <div className={styles.extrasGroupTitle}>{category}</div>
                              <div className={styles.extrasTags}>
                                {list.map((ex, i) => (
                                  <span key={i} className={styles.extraTag}>
                                    <span className={styles.extraName}>{ex.name}</span>
                                    {ex.price ? (
                                      <span className={styles.extraPrice}>{ex.price}</span>
                                    ) : null}
                                  </span>
                                ))}
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
                        🗑️
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
              <span className={styles.summaryValue}>{totalItems}</span>
            </div>
            <p className={styles.totalPriceLabel}>Total Price: {totalPrice.toFixed(2)} {data?.currency}</p>
            <button className={styles.checkoutBtn} onClick={onCheckout}>
              Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
