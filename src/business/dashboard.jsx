import React from "react";
import styles from "../styles/DashboardPage.module.css";

const cookingOrders = [
  { OrderNumber: "0342" },
  { OrderNumber: "7C8D2" },
  { OrderNumber: "2BEF2" },
  { OrderNumber: "1208" },
];

const readyOrders = [
  { OrderNumber: "48E2" },
  { OrderNumber: "2B2" },
  { OrderNumber: "WRT3400" },
];

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>✦</div>
            <span className={styles.brandText}>Dashboard</span>
            <span className={styles.pill}>Collection</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.iconBtn}>↻</button>
            <button className={styles.iconBtn}>⚙</button>
          </div>
        </header>

        {/* Boards */}
        <main className={styles.boards}>
          {/* Cooking column */}
          <section className={styles.boardSection}>
            <div className={`${styles.boardHeader} ${styles.cookingHeader}`}>
              🔥 Cooking
            </div>

            <div className={styles.row}>
              {cookingOrders.map((o) => (
                <div key={o.OrderNumber} className={styles.lightCard}>
                  {o.OrderNumber}
                </div>
              ))}
            </div>
          </section>

          {/* Ready column */}
          <section className={styles.boardSection}>
            <div className={`${styles.boardHeader} ${styles.readyHeader}`}>
              ✓ Ready to collect
            </div>

            <div className={styles.row}>
              {readyOrders.map((o) => (
                <div key={o.OrderNumber} className={styles.greenCard}>
                  {o.OrderNumber}
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <span className={styles.footIcon} />
          <span>Collection Dashboard</span>
        </footer>
      </div>
    </div>
  );
}
