import styles from "../SummaryBoard.module.css";
import { useContext } from "react";
import {UserContext} from "../../../ApiContext/userContext";

export default function StatCard({ title, value, icon, large = false, isCurrency = false, description = "" }) {
  const { publicUser } = useContext(UserContext);

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

      <div className={styles.statValue}>{Number(value).toFixed(0)} {isCurrency && publicUser?.currency}</div>
      {description && <p className={styles.statDescription}>{description}</p>}
    </article>
  );
}