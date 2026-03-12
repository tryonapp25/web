import styles from "../SummaryBoard.module.css";
import SectionCard from "../ui/SectionCard";


export default function RecentOrdersRow({data = []}) {
  return (
    <section className={styles.fullRow}>
      <SectionCard title="Recent Orders">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data?.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>{order.status}</td>
                  <td>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </section>
  );
}