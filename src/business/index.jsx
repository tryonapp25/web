import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import http from "../http/http";
import styles from "../styles/BusinessPage.module.css";

export default function BusinessPage() {
  const navigate = useNavigate();
  const { publicUser } = useContext(UserContext);
  const { connected, connectBusiness, setSocketEnabled } = useContext(SocketContext);
  const connectingRef = useRef(false);

  useEffect(() => {
    if (!publicUser) {
      navigate("/login");
      return;
    }
    initializePage();
  }, []);

  const initializePage = async () => {
    const isEnabled = await checkPermissions();
    if (isEnabled) {
      await socketConnect();
      navigate("/business/orders");
    } else {
      navigate("/business/products");
    }
  };

  const socketConnect = async () => {
    if (!publicUser?.isCustomer || connected || connectingRef.current) return;

    connectingRef.current = true;
    try {
      await connectBusiness(publicUser);
    } catch (err) {
      connectingRef.current = false;
      console.error("connectBusiness failed", err);
    }
  };

  const checkPermissions = async () => {
    try {
      const res = await http.get(`/business/permission/ORDER_ONLINE/business/${publicUser?.business?.id}`);
      const enabled = res.data?.data ?? false;
      setSocketEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error("Error checking permissions:", err);
      return false;
    }
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