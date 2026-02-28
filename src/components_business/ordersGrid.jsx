import styles from "../styles/OrdersGrid.module.css";
import OrderCard from "./orderCard";

export default function OrdersGrid({ orders = [] }) {

  // sort by newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <section className={styles.section} aria-label="Orders">

      {sortedOrders.length === 0 ? (
        <div className={styles.empty}>
          No active orders
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedOrders.map((order, index) => (

            // combine id + index to avoid duplicate key bug
            <OrderCard
              key={`${order.id}-${index}`}
              order={order}
            />

          ))}
        </div>
      )}

    </section>
  );
}