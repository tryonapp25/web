import styles from "../styles/topbar.module.css";
import { Search } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ApiContext/userContext";




function IconButton({ children, label }) {
  return (
    <button className={styles.iconBtn} aria-label={label}>
      {children}
    </button>
  );
}

export default function Topbar() {
  const navigate = useNavigate();
  const {publicUser} = useContext(UserContext);
  return (
    <header className={styles.topbar}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search"
        />
        <IconButton label="Scan">
          <div className={styles.scanGlyph} onClick={() => navigate("/menu")} />
        </IconButton>
      </div>

      {/* Right actions */}
      <div className={styles.actions}>
        <button className={styles.subscribeBtn} onClick={() => navigate("/payment")}>
          Pricing
        </button>

        {/* <button className={styles.link}>Business</button> */}
        <button className={styles.link}>Tokens {publicUser?.token?.tokens}</button>
        <button className={styles.link}>About us</button>

        <button onClick={() => navigate("/profile")} className={styles.avatar}>SA</button>
      </div>
    </header>
  );
}
