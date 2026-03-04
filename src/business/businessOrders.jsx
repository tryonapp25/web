import styles from "../styles/BusinessOrder.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../ApiContext/userContext.jsx";
import { useTheme } from "../ApiContext/themeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import httpMessage from "../http/httpMessage";
import { SocketContext } from "../ApiContext/socketContext";
import { getFeatureFlags } from "../featureFlags/featureFlags.js";
import Socket from "../model/socket";
import http_order from "../http/http_order";
import { useTranslation } from "react-i18next";

import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import OrdersGrid from "../components_business/ordersGrid";


export default function BusinessOrders() {
  const navigation = useNavigate();
  const { socketRef, connected, orderFeatureEnabled } = useContext(SocketContext);
  const { publicUser } = useContext(UserContext);
  const { forceTheme, restoreTheme } = useTheme();
  const socketContext = useContext(SocketContext);
  const connectingRef = useRef(false);
  const flagRef = useRef(false);
  const { t } = useTranslation();

  // Force light mode for business pages
  useEffect(() => {
    forceTheme("light");
    return () => restoreTheme();
  }, []);
  
  const [orderFlag, setOrderFlag] = useState(null);
  const [orders, setOrders] = useState([]);

  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(flagRef.current) return;
    flagRef.current = true;
    fetchTodayOrders();
    getFlag(); 
  }, []); 


  // ✅ Establish socket connection and event listeners based on feature flag and connection status
  useEffect(() => {
    if (!orderFeatureEnabled) return; // Don't connect if feature is disabled
    if(!connected) return; // Don't set up listeners if not connected
    const socket = socketRef.current;
    if (!socket) return;

    console.log("✅ Socket connected, setting up event listeners...");
    const handleNewOrder = (order, ack) => {
      console.log("✅ Received new order:", order);
      setOrders(prev => [order, ...prev]);  // if you want to add it
      if (ack) ack({ success: true }); // Acknowledge receipt to server
    };

    // pick the correct event name
    socket.on("new_order", handleNewOrder);


    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [connected, orderFeatureEnabled]); // <- key change
  
  async function fetchTodayOrders() {
    try {
      console.log(publicUser);
      setLoading(true);
      const res = await http_order.get(`/business/${publicUser?.business?.id}/orders/status/PENDING/today`);
      if(res.data.success){
        console.log("Fetched today's orders successfully:", res.data.data);
        setOrders(res.data.data);
      }
    }
    catch (err) {
      setMessage({ visible: true, type: "error", msg: "Failed to fetch today's orders. Please try again." });
      console.error("Error fetching today's orders:", err);
    }
    finally {
      setLoading(false);
    }
  }

  const getFlag = async() => {
    const flag = await getFeatureFlags("ORDER_FEATURE").catch((err) => {
      console.error("Failed to fetch feature flag", err);
    });
    setOrderFlag(flag);
    return flag;
  }

  const handleEnableOrderOnline = () => {
    // TODO: Implement socket enable logic
    console.log("Enable order online feature clicked");
    navigation("/business/setting");
  }; 

  const handleReconnect = async() => {
    try {
      setLoading(true);
      if (connected) return;
      if(connectingRef.current) return; // Prevent multiple simultaneous connection attempts
      connectingRef.current = true;
      const socketIo = new Socket(socketContext); // ✅ pass value
      socketIo.connect();
    } catch (err) {
      console.error("Reconnection failed", err);
      setMessage({ visible: true, type: "error", msg: "Failed to reconnect. Please try again." });
    } finally {
      setLoading(false);
      connectingRef.current = false;
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
      try {
          const token = sessionStorage.getItem("token");
          if(!token) {
              console.error("No token available for updating order status");
              return false;
          }
          setLoading(true);
          const res = await http_order.put(`/order/${orderId}/status`,{status: status});
          if(res.data.success){
              console.log("update order status successfully:", res.data.data);
              if(status === "COMPLETED"){
                setOrders((prev) =>
                  prev.filter((order) => order.id !== orderId)
                );
                return true;
              }
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === orderId
                    ? {
                        ...order,
                        status: status,
                        updatedAt: new Date().toISOString(), // current time
                      }
                    : order
              )
          );
          }
      } catch (err) {
          setMessage({visible: true, msg: httpMessage(err), type: "error"});
          console.error("Error fetching order details:", err);
      }
      finally {
          setLoading(false);
      }
  }

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
        {!orderFeatureEnabled && orderFlag && (
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
        {!connected && orderFeatureEnabled && orderFlag && (
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
        <h3>{t('business.orders')}: {orders.length}</h3>
        <OrdersGrid orders={orders} onUpdateStatus={handleUpdateStatus} />
      </main>

      <LoadingModal open={loading} title="Reconnecting…" subtitle="Attempting to reconnect to the server." />
      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage({ visible: false, type: "", msg: "" })} />
    </div>
  );
}