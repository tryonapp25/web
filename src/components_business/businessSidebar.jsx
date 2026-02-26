"use client";
import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import styles from "../styles/BusinessSidebar.module.css";
import {
  ScanLine,
  ShoppingCart,
  ClipboardList,
  StickyNote,
  Tag,
  Receipt,
  Smile,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Item({ icon: Icon, label, to, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
      }
      aria-label={label}
    >
      <span className={styles.iconWrapper}>
        <Icon
          className={`${styles.icon}`}
          size={22}
          strokeWidth={2}
          aria-hidden="true"
        />

        {typeof badge === "number" && (
          <span className={styles.badge} aria-label={`${badge} nye`}>
            {badge}
          </span>
        )}
      </span>

      <span className={styles.srOnly}>{label}</span>
    </NavLink>
  );
}


export default function BusinessSidebar() {
  const { socketRef, connected } = useContext(SocketContext);
  const [orderBadge, setOrderBadge] = useState(null);

  const items = [
    { id: "orders", label: "Ordrer", icon: ClipboardList, to: "/business/orders", badge: orderBadge },
    { id: "scan", label: "Scan", icon: ScanLine, to: "/business/scan" },
    { id: "cart", label: "Kurv", icon: ShoppingCart, to: "/business/cart", badge: 0 },
    { id: "notes", label: "Noter", icon: StickyNote, to: "/business/notes" },
    { id: "discount", label: "Rabat", icon: Tag, to: "/business/discount" },
    { id: "receipt", label: "Kvittering", icon: Receipt, to: "/business/receipt" },
  ];

  useEffect(() => {
      const socket = socketRef?.current;
      if (!socket) return;

      const handleNewOrder = (order) => {
        console.log("Received new order:", order);
        setOrderBadge((prev) => (prev === null ? 1 : prev + 1));
      };

      // server-side/sendOrder uses `new_order` (underscore)
      socket.on("new_order", handleNewOrder);

      return () => {
        socket.off("new_order", handleNewOrder);
      };
  }, [socketRef?.current, connected]);

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand} aria-label="Brand">
        <div className={styles.brandDot} />
      </div>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Business Sidebar">
        {items.map((it) => (
          <Item
            key={it.id}
            icon={it.icon}
            label={it.label}
            to={it.to}
            badge={it.badge}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <NavLink
          to="/business/setting"
          className={({ isActive }) =>
            `${styles.profile} ${isActive ? styles.navItemActive : ""}`
          }
          aria-label="Profil"
        >
          <Smile
            className={styles.icon}
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
        </NavLink>
      </div>
    </aside>
  );
}