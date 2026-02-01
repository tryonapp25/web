import styles from "../styles/NoFoundTemplate.module.css";



export default function NoFoundTemplate({onGoback}){
    return (
        <div className={styles.notFoundWrap}>
            <div className={styles.notFoundCard}>
            <div className={styles.notFoundIcon}>🍕</div>
            <h2 className={styles.notFoundTitle}>Template Not Found</h2>
            <p className={styles.notFoundText}>
                The menu template you’re looking for doesn’t exist or was removed.
            </p>
            <button className={styles.notFoundBtn} onClick={onGoback}>
                Go Back
            </button>
            </div>
        </div>
    );
}