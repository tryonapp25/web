import styles from "../styles/OrdersGrid.module.css";
import OrderDetailsModal from "./orderDetailsModal";
import OrderCard from "./orderCard";
import { useState } from "react";

export default function OrdersGrid({ orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

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
              onSelected={(order) => {
                setSelectedOrder(order);
              }}
            />
          ))}

          <OrderDetailsModal open={selectedOrder === null ? false : true} order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
      )}

    </section>
  );
}