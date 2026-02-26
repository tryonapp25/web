import styles from "../styles/BusinessOrder.module.css";
import OrdersGrid from "../components_business/ordersGrid";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";

import handleBusinessSocketConnection from "../utils/businessConnection.js";

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
  const { socketRef, connectBusiness, connected, socketEnabled, setSocketEnabled } = useContext(SocketContext);
  const { publicUser } = useContext(UserContext);
  const [orders, setOrders] = useState(ORDERS);

  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = socketRef?.current;
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
  };

  const handleReconnect = async() => {
    try {
      setLoading(true);
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
    }
  };


  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        {!socketEnabled && (
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
        {!connected && socketEnabled &&(
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