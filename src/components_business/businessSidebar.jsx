import { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import styles from "../styles/BusinessSidebar.module.css";
import { BusinessContext } from "../ApiContext/businessContext";
import { UserContext } from "../ApiContext/userContext";
import http from "../http/http";

import {
  ScanLine,
  ShoppingCart,
  ClipboardList,
  StickyNote,
  Tag,
  Receipt,
  Settings,
  Banknote,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const checkedRef = useRef(false);
  const fileInputRef = useRef(null);
  const { socketRef, connected } = useContext(SocketContext);
  const { setIsPOSEnabled } = useContext(BusinessContext);
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [orderBadge, setOrderBadge] = useState(null);
  const { t } = useTranslation();

  const [items, setItems] = useState([
    { id: "orders", label: t('business.orders'), icon: ClipboardList, to: "/business/orders" },
  ]);

  const POS = [
    { id: "scan", label: "Scan", icon: ScanLine, to: "/business/scan" },
    { id: "cart", label: "Cart", icon: ShoppingCart, to: "/business/cart", badge: 0 },
    { id: "notes", label: "Notes", icon: StickyNote, to: "/business/notes" },
    { id: "discount", label: "Discount", icon: Tag, to: "/business/discount" },
    { id: "receipt", label: "Receipt", icon: Receipt, to: "/business/receipt" },
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


  useEffect(() => {
    if(!publicUser?.business?.id) return;
    if (checkedRef.current) return;
    checkedRef.current = true;
    checkPOSEnabled(); 
  }, []);

  const checkPOSEnabled = async () => {
    try {
      const response = await http.get(`/business/${publicUser?.business?.id}/feature/POS_SYSTEM`);
      if(response?.data?.success) {
        if(response.data.data === true) setItems(prev => [...prev, ...POS]);
        setIsPOSEnabled(response.data.data);
      }
    } catch (err) {
      console.error("Error checking POS enabled:", err);
    } 
  };

  const handleUploadBusinessLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user", JSON.stringify(publicUser));

      const res = await http.put(
        `/business/${publicUser?.business?.id}/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        setPublicUser((prev) => ({
          ...prev,
          business: { ...prev.business, logo: res.data.data },
        }));
        setPublicUser((prev) => ({
          ...prev,
          business: { ...prev.business, logo: res.data.data },
        }));
      }
    } catch (err) {
      console.error("Error uploading business logo:", err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUploadBusinessLogo}
      />

      {/* Brand */}
      <div
        className={styles.brand}
        aria-label="Brand"
        onClick={() => fileInputRef.current.click()}
      >
        {publicUser?.business?.logo ? (
          <img src={publicUser.business.logo} alt="Brand Logo" style={{ width: "100%", height: "100%", borderRadius: "14px", objectFit: "cover" }} />
        ) : (
          <div className={styles.brandDot} />
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Business Sidebar">
        {items.map((it) => (
          <Item
            key={it.id}
            icon={it.icon}
            label={it.label}
            to={it.to}
            badge={it.id === "orders" ? orderBadge : it.badge}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <NavLink
          to="/business/summary"
          className={({ isActive }) =>
            `${styles.profile} ${isActive ? styles.navItemActive : ""}`
          }
          aria-label="Summary"
        >
          <LayoutDashboard
            className={styles.icon}
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
        </NavLink>

        <NavLink
          to="/business/payment-method"
          className={({ isActive }) =>
            `${styles.profile} ${isActive ? styles.navItemActive : ""}`
          }
          aria-label="Payment Method"
        >
          <Banknote
            className={styles.icon}
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
        </NavLink>

        <NavLink
          to="/business/setting"
          className={({ isActive }) =>
            `${styles.profile} ${isActive ? styles.navItemActive : ""}`
          }
          aria-label="Settings"
        >
          <Settings
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