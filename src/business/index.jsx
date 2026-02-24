import styles from "../styles/OrderBoard.module.css";
import Sidebar from "../components_business/businessSidebar";
import BusinessOrders from "./businessOrders";
import { useContext, useEffect } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";



export default function OrderBoard(){
  const { publicUser } = useContext(UserContext);
  const { connected, connectBusiness } = useContext(SocketContext);
  useEffect(() => {
    if (!connected && publicUser) {
      connectBusiness(publicUser);
    }
  }, [connected]);


  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <BusinessOrders/>
      </main>
    </div>
  );
}