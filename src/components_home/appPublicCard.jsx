import React from "react";
import styles from "../styles/AppPublicCard.module.css";

export default function AppPublicCard({
  title = "Wink Mobile",
  subtitle = "Edit anytime, anywhere, on the go.",
  phoneLeftSrc,
  phoneRightSrc,
  appStoreBadgeSrc="icons/appStoreIcon.png",
  googlePlayBadgeSrc="icons/googlePlayIcon.png",
  appStoreHref = "#",
  googlePlayHref = "#",
}) {
  return (
    <section className={styles.card}>
      <div className={styles.inner}>
        {/* Left mockups */}
        <div className={styles.mockups}>
          <div className={styles.phoneWrapA}>
            <img className={styles.phone} src={phoneLeftSrc} alt="App screen 1" />
          </div>
          <div className={styles.phoneWrapB}>
            <img className={styles.phone} src={phoneRightSrc} alt="App screen 2" />
          </div>
        </div>

        {/* Right content */}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.badges}>
            <a className={styles.badgeLink} href={appStoreHref} target="_blank" rel="noreferrer">
              <img className={styles.badgeImg} src={appStoreBadgeSrc} alt="Download on the App Store" />
            </a>

            <a className={styles.badgeLink} href={googlePlayHref} target="_blank" rel="noreferrer">
              <img className={styles.badgeImg} src={googlePlayBadgeSrc} alt="Get it on Google Play" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
