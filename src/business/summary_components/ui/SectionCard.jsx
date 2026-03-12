import styles from "../SummaryBoard.module.css";

export default function SectionCard({ title, children }) {
  return (
    <article className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionDivider} />
      {children}
    </article>
  );
}