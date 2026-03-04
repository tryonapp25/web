import {useEffect, useContext, useRef} from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../ApiContext/userContext";
import { useTheme } from "../ApiContext/themeContext";

import styles from "../styles/BusinessPage.module.css";


export default function BusinessPage() {
  const navigate = useNavigate();
  const checkerRef = useRef(null);
  const { publicUser } = useContext(UserContext);
  const { forceTheme, restoreTheme } = useTheme();

  // Force light mode for business pages
  useEffect(() => {
    forceTheme("light");
    return () => restoreTheme();
  }, []);

  useEffect(() => {
    if(publicUser?.business || publicUser?.isCustomer === true) {
      const isCompleted = isCompletedSetup(publicUser?.business);
      if(isCompleted) {
        navigate("/business/orders");
      } else {
        navigate("/business/setting");
      }
    }
    else {
      navigate("/menu");
    }
  }, []);

  
  const isCompletedSetup = (business) => {
    console.log("Checking business setup:", business);

    if (!business) return false;

    if (!business.name) return false;
    if (!business.address) return false;
    if (!business.phone) return false;
    if (!business.email) return false;
    if (!business.openHours || Object.keys(business.openHours).length === 0) return false;

    return true;
  };

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