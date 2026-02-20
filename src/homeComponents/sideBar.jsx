import styles from "../styles/Sidebar.module.css";
import {
  Star,
  Download,
  LayoutGrid,
  Library 
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function Item({ icon: Icon, label, active, onPress }) {
  return (
    <button
      className={`${styles.item} ${active ? styles.itemActive : ""}`}
      onClick={onPress}
    >
      <Icon
        className={`${styles.icon} ${active ? styles.iconActive : ""}`}
      />
      <span
        className={`${styles.label} ${active ? styles.labelActive : ""}`}
      >
        {label}
      </span>
    </button>
  );
}

const defaultItems = [
  /* { icon: Image, label: "AI Image", path: "/home" }, */
  { icon: LayoutGrid, label: "3D Menu", path: "/menu" },
  { icon: Library, label: "My Collection", path: "/collection" },
]

export default function Sidebar({items}) {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ current route
  const [sidebarItems] = useState(items || defaultItems);

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className={styles.sidebar}>
      {/* LOGO */}
      <div className={styles.logoRow}>
        <div className={styles.logoMark} onClick={() => navigate("/menu")}>
          <img
            src={`${import.meta.env.BASE_URL}logos/logo.png`}
            alt="logo"
            style={{ width: "100%", height: "100%", borderRadius: "100%" }}
          />
        </div>
        <div className={styles.logoText}>TryOn</div>
      </div>

      {/* MAIN */}
      <div className={styles.section}>
        {sidebarItems.map(({ icon: Icon, label, path }) => (
          <Item
            key={path}
            icon={Icon}
            label={label}
            active={isActive(path)}
            onPress={() => navigate(path)}
          />
        ))}
      </div>

      <div className={styles.divider} />

      {/* SECONDARY */}
      <div className={styles.section}>
        <Item
          icon={Star}
          label="Favorites"
          active={isActive("/favorites")}
          onPress={() => navigate("/favorites")}
        />

        <Item
          icon={Download}
          label="Downloads"
          active={isActive("/downloads")}
          onPress={() => navigate("/downloads")}
        />
      </div>

      {/* BOTTOM */}
      {/* <div className={styles.bottom}>
        <div className={styles.artboardsRow}>
          <span>Artboards</span>
          <button className={styles.addBtn}>
            <Plus size={16} />
          </button>
        </div>
      </div> */}
    </aside>
  );
}
