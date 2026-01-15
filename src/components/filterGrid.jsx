import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoSparklesOutline, IoGlobeOutline, IoLockClosedOutline, IoCreateOutline } from "react-icons/io5";
import styles from "../styles/FilterGrid.module.css";


const formatCount = (n) => {
  const v = Number(n ?? 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`.replace(".0", "");
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`.replace(".0", "");
  return `${v}`;
};

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
};

function GridItem({
  item,
  onToggleLike,
  onPress,
  onOpenComment,
  disableAction,
  onPressEdit,
  onLongPress,
  enableComment,
}) {
  const longPressTimer = useRef(null);

  const handleMouseDown = () => {
    if (!onLongPress) return;
    longPressTimer.current = window.setTimeout(() => onLongPress(item), 450);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <button
      type="button"
      className={styles.itemWrapper}
      onClick={() => onPress?.(item)}
      onMouseDown={handleMouseDown}
      onMouseUp={clearLongPress}
      onMouseLeave={clearLongPress}
      onTouchStart={handleMouseDown}
      onTouchEnd={clearLongPress}
      aria-label={`Open ${item?.title ?? "filter"}`}
    >
      <div className={styles.card}>
        <img className={styles.image} src={item?.img} alt={item?.title ?? "filter"} loading="lazy" />

        {/* Top overlay */}
        <div className={styles.topOverlay}>
          <div className={styles.topRow}>
            <div className={styles.title} title={item?.title}>
              {item?.title}
            </div>

            <div className={styles.publicBadge}>
              {item?.isPublic ? <IoGlobeOutline size={12} /> : <IoLockClosedOutline size={12} />}
              <span className={styles.publicText}>{item?.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>
        </div>

        {/* Bottom overlay */}
        <div className={styles.bottomOverlay}>
          <div className={styles.creator}>
            @{item?.userName ? item.userName.slice(0, 6) : "user"} · In use ({item?.uses ?? 0})
          </div>

          {disableAction ? (
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.action}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike?.(item.id);
                }}
                aria-label={item?.isLiked ? "Unlike" : "Like"}
              >
                {item?.isLiked ? <IoHeart size={18} className={styles.heart} /> : <IoHeartOutline size={18} />}
                <span className={styles.count}>{formatCount(item?.likes)}</span>
              </button>

              {enableComment ? (
                <button
                  type="button"
                  className={styles.action}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenComment?.(item);
                  }}
                  aria-label="Open comments"
                >
                  <IoChatbubbleOutline size={18} />
                  <span className={styles.count}>{formatCount(item?.comments)}</span>
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                className={styles.useBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onPress?.(item); // or call a dedicated onUse callback if you want
                }}
                aria-label="Use filter"
              >
                <IoSparklesOutline size={14} />
                <span className={styles.useText}>Use</span>
              </button>
            </div>
          ) : (
            <div className={styles.editRow}>
              <div className={styles.meta}>{formatDate(item?.createdAt)}</div>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onPressEdit?.(item);
                }}
                aria-label="Edit"
              >
                <IoCreateOutline size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function FilterGrid({
  data = [],
  onToggleLike,
  onPressItem,
  onOpenComment,
  disableAction = true,
  enableComment = false,
  onPressEdit,
  onLongPress,
  isLoadingMore,
  onLoadMore,
}) {
  const sentinelRef = useRef(null);

  const renderItems = useMemo(() => {
    return (data ?? []).map((item) => (
      <GridItem
        key={String(item.id)}
        item={item}
        onToggleLike={onToggleLike}
        onPress={(item) => onPressItem(item)}
        onOpenComment={onOpenComment}
        disableAction={disableAction}
        onPressEdit={onPressEdit}
        onLongPress={onLongPress}
        enableComment={enableComment}
      />
    ));
  }, [data, onToggleLike, onPressItem, onOpenComment, disableAction, onPressEdit, onLongPress, enableComment]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    onLoadMore?.();
  }, [isLoadingMore, onLoadMore]);

  useEffect(() => {
    if (!onLoadMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { root: null, rootMargin: "300px", threshold: 0.01 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [handleLoadMore, onLoadMore]);

  return (
    <div className={styles.listWrap}>
      <div className={styles.grid}>{renderItems}</div>

      {/* Infinite scroll sentinel */}
      {onLoadMore ? (
        <div className={styles.sentinel} ref={sentinelRef} aria-hidden="true">
          {isLoadingMore ? <div className={styles.loading}>Loading…</div> : null}
        </div>
      ) : null}
    </div>
  );
}
