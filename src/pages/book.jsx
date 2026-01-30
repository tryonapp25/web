import React from "react";
import styles from "./book.module.css";

export default function Book() {
  return (
    <div className={styles.app}>
      <div className={styles.scene}>
        <div className={styles.book} aria-label="3D menu book" role="img">
          {/* Rings */}
          <div className={styles.rings} aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={styles.ring} />
            ))}
          </div>

          {/* Back pages */}
          <div className={styles.pages} aria-hidden="true" />
          <div className={styles.pages2} aria-hidden="true" />

          {/* Cover */}
          <div className={styles.cover}>
            <div className={styles.panel}>
              <header className={styles.header}>
                <div className={styles.badgeTop}>FUNNY</div>
                <div className={styles.badgeMid}>MENU BOOK</div>
                <div className={styles.badgeSub}>Open me 😋</div>
              </header>

              <section className={styles.items}>
                <MenuRow icon="coffee" title="Caffeinated Chaos" desc="Espresso • Latte • Cold brew" price="$4–$7" />
                <MenuRow icon="burger" title="Big Mood Burger" desc="Cheesy • Saucy • Dramatic" price="$10–$14" />
                <MenuRow icon="fries" title="Fries Before Guys" desc="Crispy • Salty • Addictive" price="$5–$8" />
              </section>

              <footer className={styles.footer}>
                <span className={styles.tip}>Tip: Tap items on your real app later 🔥</span>
              </footer>

              <div className={styles.footerGlow} aria-hidden="true" />
            </div>

            <div className={styles.cornerCutTL} aria-hidden="true" />
            <div className={styles.cornerCutBR} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuRow({ icon, title, desc, price }) {
  return (
    <div className={styles.row}>
      <div className={styles.iconTile} aria-hidden="true">
        <div className={`${styles.icon} ${styles[icon]}`} />
      </div>
      <div className={styles.text}>
        <div className={styles.rowTop}>
          <div className={styles.title}>{title}</div>
          <div className={styles.price}>{price}</div>
        </div>
        <div className={styles.desc}>{desc}</div>
        <div className={styles.fakeLines} aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
