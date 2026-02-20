import styles from "../styles/topBar.module.css";
import { Search } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ApiContext/userContext";


function GetLetters(name) {
  const words = name
    .replace(/[^a-zA-Z ]/g, "") // remove numbers & symbols
    .trim()
    .split(/\s+/);

  // if there's only one word, take first 2 letters
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  // otherwise take first letter of each word
  return words
    .map(word => word[0])
    .join("")
    .toUpperCase();
}

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
        <button className={styles.tokenBtn}>
          <span className={styles.tokenIcon} aria-hidden>🪙</span>
          <span className={styles.tokenLabel}>Tokens</span>
          <span className={styles.tokenValue}>{publicUser?.token?.tokens ?? 0}</span>
        </button>
        <button onClick={() => navigate("/profile")} className={styles.avatar}>{GetLetters(publicUser?.userName || "")}</button>
      </div>
    </header>
  );
}
