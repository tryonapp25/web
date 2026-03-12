import styles from "../SummaryBoard.module.css";

export default function StatCard({ title, value, icon, large = false }) {
  return (
    <article
      className={`${styles.statCard} ${large ? styles.statCardLarge : styles.statCardSmall}`}
    >
      <div className={styles.statTop}>
        <div className={styles.statTitleWrap}>
          <span className={styles.statIcon}>{icon}</span>
          <span className={styles.statTitle}>{title}</span>
        </div>

        <div className={styles.statIconCircle}>{icon}</div>
      </div>

      <div className={styles.statValue}>{value}</div>
    </article>
  );
}