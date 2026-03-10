import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { UserContext } from "../ApiContext/userContext.jsx";
import { SocketContext } from "../ApiContext/socketContext";
import { useTheme } from "../ApiContext/themeContext";

import http_order from "../http/http_order";
import httpMessage from "../http/httpMessage";
import { getFeatureFlags } from "../featureFlags/featureFlags.js";

import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import OrdersGrid from "../components_business/ordersGrid";

import styles from "../styles/BusinessOrder.module.css";

export default function BusinessOrders() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { publicUser } = useContext(UserContext);
  const { forceTheme, restoreTheme } = useTheme();
  const { socketRef, connected, orderFeatureEnabled } = useContext(SocketContext);

  const [orders, setOrders] = useState([]);
  const [featureFlag, setFeatureFlag] = useState(null); // null = loading, true/false = known
  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const connectingRef = useRef(false);

  // Force light theme on business pages
  useEffect(() => {
    forceTheme("light");
    return () => restoreTheme();
  }, [forceTheme, restoreTheme]);

  // Fetch feature flag + initial orders (only once)
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);

      try {
        // 1. Feature flag
        const flag = await getFeatureFlags("ORDER_FEATURE").catch(() => false);
        if (isMounted) setFeatureFlag(flag);

        // 2. Today's preparing orders
        if (!publicUser?.business?.id) throw new Error("No business ID");

        const res = await http_order.get(
          `/business/${publicUser.business.id}/orders/status/PREPARING/today`
        );

        if (res.data?.success && isMounted) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error("Init failed:", err);
        if (isMounted) {
          setMessage({
            visible: true,
            type: "error",
            msg: httpMessage(err) || "Failed to load orders. Please try again.",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [publicUser?.business?.id]);

  // Socket listeners – only when feature is enabled & socket is connected
  useEffect(() => {
    if (!orderFeatureEnabled || !connected || !socketRef.current) return;

    const socket = socketRef.current;

    const handleNewOrder = (newOrder, ack) => {
      console.log("New order received:", newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      setMessage({ visible: true, type: "success", msg: t("New order received!") });
      if (ack) ack({ success: true });
    };

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [connected, orderFeatureEnabled, socketRef, t]);

  const handleUpdateStatus = useCallback(async (order) => {
    if (!order?.id) return false;

    setLoading(true);

    try {
      const payload = {
        ...order,
        business: publicUser.business,
      };

      const res = await http_order.put("/order/status", payload);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }

      setOrders((prev) =>
        prev
          .map((o) =>
            o.id === order.id
              ? order.status === "COMPLETED"
                ? null
                : { ...o, status: order.status, updatedAt: new Date().toISOString() }
              : o
          )
          .filter(Boolean)
      );

      return true;
    } catch (err) {
      const msg = httpMessage(err) || "Failed to update order status";
      setMessage({ visible: true, type: "error", msg });
      console.error("Status update failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [publicUser?.business]);

  const handleEnableFeature = () => {
    navigate("/business/setting");
  };

  const handleReconnect = async () => {
    if (connected || connectingRef.current) return;

    connectingRef.current = true;
    setLoading(true);

    try {
      const Socket = (await import("../model/socket")).default; // dynamic if needed
      const socketIo = new Socket({ ...useContext(SocketContext) });
      socketIo.connect();
    } catch (err) {
      setMessage({
        visible: true,
        type: "error",
        msg: "Failed to reconnect. Please try again.",
      });
    } finally {
      setLoading(false);
      connectingRef.current = false;
    }
  };

  // ──────────────────────────────────────────────
  //  Derived UI states
  // ──────────────────────────────────────────────

  const showFeatureDisabledOverlay =
    featureFlag === false || (!orderFeatureEnabled && featureFlag === true);

  const showReconnectOverlay = connected === false && orderFeatureEnabled && featureFlag !== false;

  const isLoadingInitial = featureFlag === null || loading;

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        {/* Overlays – highest priority first */}
        {isLoadingInitial && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Loading...</h2>
              <p>Please wait while we fetch your orders and settings.</p>
            </div>
          </div>
        )}

        {showFeatureDisabledOverlay && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Online Orders Disabled</h2>
              <p>Contact your administrator or enable the feature in settings.</p>

              {orderFeatureEnabled && featureFlag === true ? (
                <button className={styles.enableButton} onClick={handleEnableFeature}>
                  Enable Online Orders
                </button>
              ) : (
                <p className={styles.disabledNote}>
                  This feature is disabled by the platform admin.
                </p>
              )}
            </div>
          </div>
        )}

        {showReconnectOverlay && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>Connection Lost</h2>
              <p>Real-time order updates are currently unavailable.</p>
              <button className={styles.enableButton} onClick={handleReconnect}>
                Reconnect Now
              </button>
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className={styles.socketStatus}>
          <span className={`${styles.statusDot} ${connected ? styles.online : styles.offline}`} />
          <span>{connected ? "Live — Connected" : "Disconnected"}</span>
        </div>

        <h3>
          {t("business.orders")}: {orders.length}
        </h3>

        <OrdersGrid orders={orders} onUpdateStatus={handleUpdateStatus} />
      </main>

      <LoadingModal
        open={loading && !isLoadingInitial}
        title="Processing…"
        subtitle="Updating order status or reconnecting…"
      />

      <FlashMessage
        show={message.visible}
        type={message.type}
        message={message.msg}
        onClose={() => setMessage({ visible: false, type: "", msg: "" })}
      />
    </div>
  );
}