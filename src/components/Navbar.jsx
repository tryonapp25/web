import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.wrap} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav}>
        <a className={styles.brand} href="#top" aria-label="TryOn home">
          <div className={styles.logo} aria-hidden="true">
            <img className={styles.Icon} src={`${import.meta.env.BASE_URL}logos/logo.png`}/>
          </div>
          <span className={styles.brandText}>TryOn</span>
        </a>

        <div className={styles.links}>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className={styles.actions}>
          <a className={styles.ghost} href="#get-started">Request access</a>
          <a className={styles.cta} href="#get-started">Get started</a>
        </div>
      </nav>
    </div>
  );
}
