import styles from "../styles/OrdersGrid.module.css";
import OrderDetailsModal from "./orderDetailsModal";
import OrderCard from "./orderCard";
import { useState } from "react";

export default function OrdersGrid({ orders = [], onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // sort by newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleUpdateStatus = (orderId) => {
    setSelectedOrder(null);
    onUpdateStatus?.(orderId, "READY");
  }

  const handleComplete = (orderId) => {
    setSelectedOrder(null);
    onUpdateStatus?.(orderId, "COMPLETED");
  }
  
  

  

  return (
    <section className={styles.section} aria-label="Orders">

      {sortedOrders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>No active orders</div>
          <div className={styles.emptySubtitle}>New orders will appear here in real-time</div>
          <div className={styles.emptyPulse} />
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

          <OrderDetailsModal open={selectedOrder === null ? false : true} order={selectedOrder} onClose={() => setSelectedOrder(null)} onReady={(o) => handleUpdateStatus(o)} onComplete={(o) => handleComplete(o)}/>
        </div>
      )}

    </section>
  );
}