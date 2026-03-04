import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`${styles.wrap} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav}>
        <a className={styles.brand} href="#top" onClick={(e) => scrollToSection(e, "top")} aria-label="TryOn home">
          <div className={styles.logo} aria-hidden="true">
            <img className={styles.Icon} src={`${import.meta.env.BASE_URL}logos/logo.png`}/>
          </div>
          <span className={styles.brandText}>TryOn</span>
        </a>

        <div className={styles.links}>
          <a href="#features" onClick={(e) => scrollToSection(e, "features")}>Features</a>
          <a href="#how" onClick={(e) => scrollToSection(e, "how")}>How it works</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")}>Pricing</a>
        </div>

        <div className={styles.actions}>
          <a className={styles.ghost} href="#get-started" onClick={(e) => scrollToSection(e, "get-started")}>Request access</a>
          <Link to="/login" className={styles.cta}>Get started</Link>
        </div>
      </nav>
    </div>
  );
}
