import styles from "../styles/ProductGrid.module.css";
import ProductCard from "./businessProductCard";

export default function ProductGrid({ products }) {
  return (
    <section className={styles.section} aria-label="Produkter">
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <div className={styles.empty}>Ingen produkter matcher din søgning.</div>
      )}
    </section>
  );
}