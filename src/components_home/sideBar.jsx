import styles from "../styles/Sidebar.module.css";
import {
  Star,
  Download,
  LayoutGrid,
  Library ,
  Plus,
  Building2 
} from "lucide-react";
import { useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {UserContext} from "../ApiContext/userContext";
import { useTranslation } from "react-i18next";


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

export default function Sidebar({items}) {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ current route
  const { t } = useTranslation();
  
  const sidebarItems = useMemo(() => items || [
    { icon: LayoutGrid, label: t('nav.3dMenu'), path: "/menu" },
    { icon: Library, label: t('nav.myCollection'), path: "/collection" },
  ], [t, items]);

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
        <div className={styles.logoText}>Taply</div>
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
          icon={Building2}
          label={t('nav.business')}
          active={isActive("/business")}
          onPress={() => navigate("/business")}
        />
        <Item
          icon={Star}
          label={t('nav.favorites')}
          active={isActive("/favorites")}
          onPress={() => navigate("/favorites")}
        />

        <Item
          icon={Download}
          label={t('nav.downloads')}
          active={isActive("/downloads")}
          onPress={() => navigate("/downloads")}
        />
      </div>

      {/* BOTTOM */}
      {/* <div className={styles.bottom}>
        <div className={styles.artboardsRow}>
          <span>{t('nav.artboards')}</span>
          <button className={styles.addBtn}>
            <Plus size={16} />
          </button>
        </div>
      </div> */}
    </aside>
  );
}
