import styles from "../styles/TopBanner.module.css";

export default function TopBanner() {
  return (
    <section className={styles.banner}>
      <div>
        <h2>TryOn Virtual Outfit Preview</h2>
        <p>Control your frames with 3–10s flexibility</p>
      </div>
      <button>Experience Now</button>
    </section>
  );
}
