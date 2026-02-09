import React from "react";
import styles from "../styles/CartBubble.module.css";

export default function CartBubble({ count = 0, onClick }) {
  return (
    <button className={styles.cartBubble} onClick={onClick} aria-label="Cart">
      <svg
        className={styles.cartIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  );
}