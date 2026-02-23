import styles from "../styles/OrdersGrid.module.css";
import OrderCard from "./orderCard";

export default function OrdersGrid({ orders }) {
  return (
    <section className={styles.section} aria-label="Orders">

      <div className={styles.grid}>
        {orders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>

      {orders.length === 0 && (
        <div className={styles.empty}>
          No active orders
        </div>
      )}

    </section>
  );
}