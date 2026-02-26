import styles from "../styles/BusinessOrder.module.css";
import OrdersGrid from "../components_business/ordersGrid";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import { getFeatureFlags } from "../featureFlags/featureFlags.js";

import handleBusinessSocketConnection from "../utils/socket_businessConnection.js";

const ORDERS = [
  {
    title: "Order #1001",
    model: "Food",
    ingredients: "No sugar",
    data: [
      {
        name: "Latte",
        description: "Oat milk",
        price: "40",
        quantity: "2",
      },
    ],
  },
  {
    title: "Order #1002",
    model: "Food",
    ingredients: "Extra cheese",
    data: [
      {
        name: "Burger",
        description: "No onion",
        price: "80",
        quantity: "1",
      },
    ],
  },
];

const newOrder = {
  title: "Order #1002",
  model: "Food",
  ingredients: "Extra cheese",
  data: [
    {
      name: "Burger",
      description: "No onion",
      price: "80",
      quantity: "1",
    },
  ],
};

export default function BusinessOrders() {
  const navigation = useNavigate();
  const { socketRef, connectBusiness, connected, socketEnabled, setSocketEnabled } = useContext(SocketContext);
  const connectingRef = useRef(false);
  const connectedRef = useRef(connected);
  const flagRef = useRef(false);
  
  const { publicUser } = useContext(UserContext);
  const [orderFlag, setOrderFlag] = useState(null);
  const [orders, setOrders] = useState(ORDERS);

  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFlag(); // Awlays check feature flag on mount to determine if socket connection should be established
    const id = setInterval(async () => {
      console.log("Checking socket connection status...", connectedRef.current);

      if (connectedRef.current) return;
      console.warn("Socket disconnected. Attempting to reconnect...");
      flagRef.current = false; // reset startup flag to allow feature flag check after reconnection
      const flag = await getFlag(); // check feature flag before attempting reconnection
      if(flag) await handleReconnect();
    }, 15000); // Check every 15 seconds

    return () => clearInterval(id);
  }, []); // create interval once

  useEffect(() => {
    const socket = socketRef?.current;
    connectedRef.current = connected;
    if (!socket) return;
    const handleNewOrder = (order, ack) => {
      //alert("Ny ordre modtaget! Tjek ordreliste.");
      console.log("Received new order:", order);
      setOrders((prev) => [newOrder, ...prev]);
      if (ack) ack({ success: true });
    };

    // server-side/sendOrder uses `new_order` (underscore)
    socket.on("new_order", handleNewOrder);
    
    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [socketRef?.current, connected, socketEnabled]);


  const handleEnableOrderOnline = () => {
    // TODO: Implement socket enable logic
    console.log("Enable order online feature clicked");
    navigation("/business/setting");
  };


  const getFlag = async() => {
    if(flagRef.current) return;
    flagRef.current = true;
    const flag = await getFeatureFlags("ORDER_FEATURE");
    setOrderFlag(flag);
    return flag;
  }



  const handleReconnect = async() => {
    try {
      setLoading(true);
      if(connectingRef.current) return; // Prevent multiple simultaneous connection attempts
      connectingRef.current = true;
      await handleBusinessSocketConnection({
        publicUser,
        setSocketEnabled,
        connectBusiness
      });
    } catch (err) {
      console.error("Reconnection failed", err);
      setMessage({ visible: true, type: "error", msg: "Failed to reconnect. Please try again." });
    } finally {
      setLoading(false);
      connectingRef.current = false;
    }
  };


  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        {orderFlag !== null && !orderFlag && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Order Online Feature Disabled</h2>
              <p>Enable this feature to receive online orders in real-time.</p>
              <button className={styles.enableButton} onClick={() => console.log("Redirect to settings to enable")}>
                 Online Orders is Disabled by Admin. Please contact admin to enable this feature.
              </button>
            </div>
          </div>
        )}
        {!socketEnabled && orderFlag && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Order Online Feature Disabled</h2>
              <p>Enable this feature to receive online orders in real-time.</p>
              <button className={styles.enableButton} onClick={handleEnableOrderOnline}>
                Enable Online Orders
              </button>
            </div>
          </div>
        )}
        {!connected && socketEnabled && orderFlag && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Connection Lost</h2>
              <p>Your connection appears to be unstable. Please reconnect to continue.</p>
              <button className={styles.enableButton} onClick={handleReconnect}>
                Reconnect
              </button>
            </div>
          </div>
        )}
        <p>Socket Status: {connected ? "Connected" : "Disconnected"}</p>
        <OrdersGrid orders={orders} />
      </main>

      <LoadingModal open={loading} title="Reconnecting…" subtitle="Attempting to reconnect to the server." />
      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage({ visible: false, type: "", msg: "" })} />
    </div>
  );
}