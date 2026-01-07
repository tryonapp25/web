import styles from "../styles/TopBanner.module.css";

export default function TopBanner() {
  return (
    <section className={styles.banner}>
      <div>
        <h2>Virtual Outfit Preview</h2>
        <p>Try on looks in real time with flexible 5–15s frame control.</p>
      </div>
      <button>Experience Now</button>
    </section>
  );
}
