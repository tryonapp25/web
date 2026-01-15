import React, { useCallback, useRef } from "react";
import styles from "../styles/ImageGrid.module.css";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
};

const formatCount = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`.replace(".0", "");
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`.replace(".0", "");
  return `${n}`;
};

// Long-press helper for web (mouse + touch)
function useLongPress(callback, { ms = 450 } = {}) {
  const timerRef = useRef(null);

  const start = useCallback(
    (e, item) => {
      // prevent context menu on long press (mobile browsers)
      if (e?.type === "contextmenu") e.preventDefault();

      timerRef.current = window.setTimeout(() => {
        callback?.(item);
      }, ms);
    },
    [callback, ms]
  );

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { start, clear };
}

function GridItem({ item, onPress, onToggleLike, onLongPress }) {
  const { start, clear } = useLongPress(onLongPress, { ms: 450 });

  return (
    <button
      type="button"
      className={styles.itemWrapper}
      onClick={() => onPress?.(item)}
      onMouseDown={(e) => start(e, item)}
      onMouseUp={clear}
      onMouseLeave={clear}
      onTouchStart={(e) => start(e, item)}
      onTouchEnd={clear}
      onTouchCancel={clear}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles.card}>
        <img className={styles.image} src={item.img} alt="" loading="lazy" />

        <div className={styles.bottomOverlay}>
          <span className={styles.meta}>{formatDate(item.createdAt)}</span>

          {/* Like (optional) */}
          {/* <button
            type="button"
            className={styles.likeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(item.id);
            }}
          >
            <span
              className={`${styles.heart} ${
                item.isLiked ? styles.heartLiked : ""
              }`}
              aria-hidden="true"
            >
              {item.isLiked ? "♥" : "♡"}
            </span>
            <span className={styles.likeText}>{formatCount(item.likes)}</span>
          </button> */}
        </div>
      </div>
    </button>
  );
}

export default function ImageGrid({ data = [], onPressItem, onToggleLike, onLongPress }) {
  const renderItem = useCallback(
    (item) => (
      <GridItem
        key={String(item.id)}
        item={item}
        onPress={onPressItem}
        onToggleLike={onToggleLike}
        onLongPress={onLongPress}
      />
    ),
    [onPressItem, onToggleLike, onLongPress]
  );

  return <div className={styles.grid}>{data.map(renderItem)}</div>;
}
