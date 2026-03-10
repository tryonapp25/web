import styles from "../styles/OrderCard.module.css";
import Model3D from "../components/3dModel";
import { getStatusColor } from "./index";
import { useState, useEffect } from "react";

const config = {
  camera_orbit: "auto 70deg",
};

const MAX_EXTRAS_PREVIEW = 3;
const MAX_INGREDIENTS_PREVIEW = 4;

function formatWaitingTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }

  return `${secs}s`;
}

function getPreviewItems(list = [], max = 3) {
  return list.slice(0, max);
}

export default function OrderCard({ order, onSelected }) {
  const [waitingTime, setWaitingTime] = useState(0);

  useEffect(() => {
    if (order.status !== "READY") {
      setWaitingTime(0);
      return;
    }

    const startTime = order.updatedAt
      ? new Date(order.updatedAt).getTime()
      : Date.now();

    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setWaitingTime(elapsed);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [order.status, order.updatedAt]);

  return (
    <div className={styles.card} onClick={() => onSelected(order)}>
      <div className={styles.header}>
        <div className={styles.orderNumber}>#{order.id}</div>

        <div
          className={styles.status}
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status}
        </div>
      </div>

      {order.status === "READY" && (
        <div className={styles.waitingTimer}>
          <span className={styles.waitingIcon}>⏱️</span>
          <span className={styles.waitingText}>Waiting for pickup:</span>
          <span className={styles.waitingTime}>
            {formatWaitingTime(waitingTime)}
          </span>
        </div>
      )}

      <div className={styles.items}>
        {order.data.map((item, index) => {
          const extras = item?.extras || [];
          const ingredients = item?.ingredients || [];

          const previewExtras = getPreviewItems(extras, MAX_EXTRAS_PREVIEW);
          const hiddenExtrasCount = Math.max(
            extras.length - MAX_EXTRAS_PREVIEW,
            0
          );

          const previewIngredients = getPreviewItems(
            ingredients,
            MAX_INGREDIENTS_PREVIEW
          );
          const hiddenIngredientsCount = Math.max(
            ingredients.length - MAX_INGREDIENTS_PREVIEW,
            0
          );

          return (
            <div key={index} className={styles.item}>
              <div className={styles.itemTop}>
                <div className={styles.itemInfo}>
                  <div className={styles.name}>
                    {item?.data?.[0]?.name} - {item.title}
                  </div>

                  <p className={styles.description}>
                    {item?.data?.[0]?.price}
                    {order?.currency ? ` ${order.currency}` : ""}
                  </p>
                </div>

                <div className={styles.qty}>x{item.quantity}</div>
              </div>

              {previewIngredients.length > 0 && (
                <div className={styles.ingredients}>
                  <div className={styles.sectionTitle}>Ingredients</div>

                  <div className={styles.ingredientsList}>
                    {previewIngredients.map((ingredient, ingredientIndex) => (
                      <span key={ingredientIndex} className={styles.ingredientTag}>
                        {ingredient.name} {ingredient?.included ? "✓" : "✗"}
                      </span>
                    ))}

                    {hiddenIngredientsCount > 0 && (
                      <span className={styles.moreBadge}>
                        +{hiddenIngredientsCount} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {previewExtras.length > 0 && (
                <div className={styles.extras}>
                  <h4>Extras</h4>

                  {previewExtras.map((extra, extraIndex) => (
                    <div key={extraIndex} className={styles.extra}>
                      <div className={styles.extraMain}>
                        <div className={styles.extraNameRow}>
                          <span className={styles.extraName}>{extra.name}</span>
                          <span className={styles.qty}>x{extra.quantity}</span>
                        </div>

                        <div className={styles.meta}>
                          {extra.category && (
                            <span className={styles.category}>
                              {extra.category}
                            </span>
                          )}

                          {typeof extra.price !== "undefined" && (
                            <span className={styles.price}>
                              {extra.price}
                              {order?.currency ? ` ${order.currency}` : ""}
                            </span>
                          )}

                          {extra.description && (
                            <span className={styles.description}>
                              {extra.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {hiddenExtrasCount > 0 && (
                    <div className={styles.moreExtras}>
                      +{hiddenExtrasCount} more extras
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {order?.totalPrice && (
        <div className={styles.totalPrice}>
          Total: {order.totalPrice} {order?.currency}
        </div>
      )}
    </div>
  );
}