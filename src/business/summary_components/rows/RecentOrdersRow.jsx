import styles from "../SummaryBoard.module.css";
import SectionCard from "../ui/SectionCard";


export default function RecentOrdersRow({data = []}) {
  console.log("RecentOrdersRow data:", data);
  return (
    <section className={styles.fullRow}>
      <SectionCard title="Recent Orders">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>CustomerId</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data?.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerId.slice(-10)}</td>
                  <td>{order.totalPrice}{order.currency}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </section>
  );
}