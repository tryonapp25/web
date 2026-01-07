import styles from "../styles/ActivityIndicator.module.css";

function ActivityIndicator({ size = 20 }) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
    />
  );
}

export default ActivityIndicator;

