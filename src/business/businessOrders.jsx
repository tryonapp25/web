import styles from "../styles/BusinessOrder.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import { getFeatureFlags } from "../featureFlags/featureFlags.js";
import Socket from "../model/socket";

import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import OrdersGrid from "../components_business/ordersGrid";

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
  const { socketRef, connected, socketEnabled } = useContext(SocketContext);
  const socketContext = useContext(SocketContext);
  const connectingRef = useRef(false);
  const flagRef = useRef(false);
  
  const { publicUser } = useContext(UserContext);
  const [orderFlag, setOrderFlag] = useState(null);
  const [orders, setOrders] = useState(ORDERS);

  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(flagRef.current) return;
    flagRef.current = true;
    getFlag(); 
  }, []); 


  // ✅ Establish socket connection and event listeners based on feature flag and connection status
  useEffect(() => {
    if (!connected) return;

    const socket = socketRef.current;
    if (!socket) return;

    console.log("✅ Socket connected, setting up event listeners...");
    const handleNewOrder = (order, ack) => {
      console.log("✅ Received new order:");
      setOrders(prev => [newOrder, ...prev]);  // if you want to add it
      if (ack) ack({ success: true }); // Acknowledge receipt to server
    };

    // pick the correct event name
    socket.on("new_order", handleNewOrder);


    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [connected]); // <- key change
  

  
  const handleEnableOrderOnline = () => {
    // TODO: Implement socket enable logic
    console.log("Enable order online feature clicked");
    navigation("/business/setting");
  }; 


  const getFlag = async() => {
    const flag = await getFeatureFlags("ORDER_FEATURE").catch((err) => {
      console.error("Failed to fetch feature flag", err);
    });
    setOrderFlag(flag);
    return flag;
  }

  const handleReconnect = async() => {
    try {
      setLoading(true);
      if (connected) return;
      if(connectingRef.current) return; // Prevent multiple simultaneous connection attempts
      connectingRef.current = true;
      const socketIo = new Socket(publicUser, socketContext); // ✅ pass value
      socketIo.connect();
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