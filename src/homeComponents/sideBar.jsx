import styles from "../styles/sidebar.module.css";
import {
  Sparkles,
  Home,
  Video,
  Image,
  Mic,
  Music,
  Grid,
  Star,
  Download,
  Plus,
} from "lucide-react";

function Item({ icon: Icon, label, active }) {
  return (
    <button
      className={`${styles.item} ${active ? styles.itemActive : ""}`}
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
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoRow}>
        <div className={styles.logoMark}>
          <img style={{width:"100%", height:"100%", borderRadius:100}} src={`${import.meta.env.BASE_URL}logos/logo.png`}/>
        </div>
        <div className={styles.logoText}>TryOn</div>
      </div>

      <div className={styles.section}>
        <Item icon={Home} label="Home" />
        <Item icon={Image} label="AI Image" active/>
       {/*  <Item icon={Video} label="AI Video" />
        <Item icon={Mic} label="AI Voiceover" />
        <Item icon={Music} label="Music" />
        <Item icon={Grid} label="Creative Assets" /> */}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <Item icon={Star} label="Favorites" />
        <Item icon={Download} label="Downloads" />
      </div>

      <div className={styles.bottom}>
        <div className={styles.artboardsRow}>
          <span>Artboards</span>
          <button className={styles.addBtn}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
