import styles from "../styles/OrderBoard.module.css";
import Sidebar from "../components_business/businessSidebar";
import BusinessOrders from "./businessOrders";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";



export default function OrderBoard(){
  const { publicUser } = useContext(UserContext);
  const { connected, connectBusiness } = useContext(SocketContext);
  const connectingRef = useRef(false);

  useEffect(() => {
    if (connected) return; // already connected
    if (connectingRef.current) return; // connection already in progress
    if (!publicUser) return; // wait for user info

    connectingRef.current = true;
    (async () => {
      try {
        await connectBusiness(publicUser);
      } catch (err) {
        connectingRef.current = false; // allow retry on error
        console.error("connectBusiness failed", err);
      }
    })();
  }, [publicUser, connected]);


  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <BusinessOrders/>
      </main>
    </div>
  );
}