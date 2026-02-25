import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BusinessPage.module.css";
;

export default function BusinessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/business/orders");
    }, 1500);
  }, []);

  return (
    <div className={styles.shell} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className={styles.connectingText}>
        <span>Connecting to the business management</span>
        <span className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </span>
      </h1>
    </div>
  );
}