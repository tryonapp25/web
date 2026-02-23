import styles from "../styles/BusinessSidebar.module.css";

const items = [
  { id: "scan", label: "Scan", icon: "⌁" },
  { id: "cart", label: "Kurv", icon: "🛒", badge: 2 },
  { id: "orders", label: "Ordrer", icon: "👤" },
  { id: "notes", label: "Noter", icon: "🧾" },
  { id: "discount", label: "Rabat", icon: "🏷️" },
  { id: "receipt", label: "Kvittering", icon: "🧾" },
];

export default function BusinessSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand} aria-label="Brand">
        <div className={styles.brandDot} />
      </div>

      <nav className={styles.nav} aria-label="Sidebar">
        {items.map((it) => (
          <button key={it.id} className={styles.navItem} type="button">
            <span className={styles.icon} aria-hidden="true">
              {it.icon}
            </span>
            <span className={styles.srOnly}>{it.label}</span>

            {typeof it.badge === "number" && (
              <span className={styles.badge} aria-label={`${it.badge} nye`}>
                {it.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.profile} type="button" aria-label="Profil">
          <span aria-hidden="true">🙂</span>
        </button>
      </div>
    </aside>
  );
}