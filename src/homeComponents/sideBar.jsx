import styles from "../styles/sidebar.module.css";
import {
  Image,
  FilePlus,
  Star,
  Download,
  LayoutGrid,
  Plus,
  Library 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import {UserContext} from "../ApiContext/userContext";

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

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ current route
  const {publicUser}  = useContext(UserContext)

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className={styles.sidebar}>
      {/* LOGO */}
      <div className={styles.logoRow}>
        <div className={styles.logoMark}>
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
        <Item
          icon={Image}
          label="AI Image"
          active={isActive("/home")}
          onPress={() => navigate("/home")}
        />

        <Item
          icon={LayoutGrid}
          label="3D Menu"
          active={isActive("/menu")}
          onPress={() => navigate("/menu")}
        />

        <Item
          icon={Library}
          label="My Collection"
          active={isActive("/collection")}
          onPress={() => navigate("/collection")}
        />

        {publicUser?.role === "admin" &&
          <Item
            icon={Library}
            label="Create Template"
            active={isActive("/create-template")}
            onPress={() => navigate("/create-template")}
          />
        }
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
