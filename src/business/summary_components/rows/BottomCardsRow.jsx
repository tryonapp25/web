import styles from "../SummaryBoard.module.css";
import SectionCard from "../ui/SectionCard";


export default function BottomCardsRow({orderStatus = [], topProducts = []}) {
  return (
    <section className={styles.bottomGrid}>
      <SectionCard title="Order Status">
        <ul className={styles.statusList}>
          {orderStatus.length > 0 && orderStatus.map((item) => (
            <li key={item.label} className={styles.statusItem}>
              <span className={styles.statusDot} />
              <span>
                {item.label}: {item.value}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Top Products">
        <ol className={styles.productList}>
          {topProducts.length > 0 && topProducts.map((product) => (
            <li key={product}>{product}</li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="Top Products">
        <ol className={styles.productList}>
          {topProducts.length > 0 && topProducts.map((product) => (
            <li key={`${product}-duplicate`}>{product}</li>
          ))}
        </ol>
      </SectionCard>
    </section>
  );
}