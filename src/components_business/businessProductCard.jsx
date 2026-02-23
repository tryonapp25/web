import styles from "../styles/ProductCard.module.css";

function formatPriceDKK(price) {
  if (!price) return null;
  return `${price.toFixed(2).replace(".", ",")} kr.`;
}

export default function ProductCard({ product }) {
  const price = formatPriceDKK(product.price);

  return (
    <button className={styles.card} type="button">
      <div className={styles.thumb} aria-hidden="true">
        <div className={styles.thumbInner} />
      </div>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <div className={styles.name}>{product.name}</div>
          {price && <div className={styles.price}>{price}</div>}
        </div>

        {product.subtitle ? (
          <div className={styles.subtitle}>{product.subtitle}</div>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
    </button>
  );
}