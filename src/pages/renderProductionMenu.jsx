import React, { Suspense, lazy, useEffect, useMemo, useState, useRef} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/renderProductionMenu.module.css";
import http from "../http/http";
import LoadingModal from "../components/loading";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import ModelShowcase from "../components/modelShowcase";
import { getFeatureFlags } from "../featureFlags/featureFlags";
import CartBubble from "../components/cartBubble";
import OrderViewModal from "../components/orderViewModal";
import PaymentMethodModal from "../components/paymentMethodModal";
import FlashMessage from "../components/flashMessage";
import defaultMessage from "../utils/defaultMessage";

import { HandeleConnect, sendOrder } from "../utils/socketio";

const modules = import.meta.glob("../templates/**/*.jsx");

export default function RenderProductionMenu() {
  const socketRef = useRef(null);
  const hasConnected = useRef(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [orderFeatureEnabled, setOrderFeatureEnabled] = useState(true);
  const [message, setMessage] = useState(defaultMessage);

  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    const fetchTemplate = async () => {
      setLoading(true);
      setFetchFailed(false);

      try {
        const res = await http.get(`/${type}/code/${code}/template/${id}/public/${publicCode}`);
        if (!alive) return;
        if (res.data?.success && res.data?.data) {
          setTemplate(res.data.data);
        } else {
          setTemplate(null);
          setFetchFailed(true);
        }
      } catch (err) {
        if (!alive) return;
        setTemplate(null);
        setFetchFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchTemplate();
    getFlags();
    return () => {
      alive = false;
    };
  }, [type, id, code, publicCode]);

  const getFlags = async () => {
    const flags = await getFeatureFlags("ORDER_FEATURE");
    setOrderFeatureEnabled(flags);
    if(flags == true){
      if (!hasConnected.current) {
        hasConnected.current = true;
        HandeleConnect(publicCode);
      }
    }
  }

  const handleSelectOrder = (order) => {
    if (!orderFeatureEnabled) return;
    console.log("Ordering item:", order);
    
    setOrders((prevOrders) => {
      const existingIndex = prevOrders.findIndex(
        (item) => item.title === order.data.title
      );
      
      if (existingIndex !== -1) {
        // Item exists, increment quantity
        return prevOrders.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // New item, add with quantity 1
        return [...prevOrders, { ...order.data, quantity: 1 }];
      }
    });
    
    setModelOpen(false);
    setOrderModalOpen(true);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }
    setOrders((prevOrders) =>
      prevOrders.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    const ordersWithTemplate = { receiver: template.uid, orders: orders };
    const res = await sendOrder(socketRef, ordersWithTemplate);
    if(!res.success) {
      setMessage({ visible: true, type: "error", msg: `Failed to place order: ${res.error}` });
      return;
    } 
    setMessage({visible: true, type: "success", msg: "Order placed successfully!" });
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
  };

  const key = template?.code ? `../templates/menu/${template.code}.jsx` : null;

  const Template = useMemo(() => {
    if (!key) return null;
    const loader = modules[key];
    return loader ? lazy(loader) : null;
  }, [key]);

  if (loading) {
    return <LoadingModal open={true} title="Menu" subtitle="Loading..." />;
  }

  if (fetchFailed || !template || !Template) {
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  }

  const content = (
    <Suspense
      fallback={
        <LoadingModal open={true} title="Menu" subtitle="Loading template..." />
      }
    >
      <Template
        data={template}
        onSave={(tem) => console.log(tem)}
        onClickModel={(item) => {
          setSelectedModel(item);
          setModelOpen(true);
        }}
      />
    </Suspense>
  );

  const wrappedContent = isMobile ? content : <PdfPageWrapper>{content}</PdfPageWrapper>;

  return (
    <div>
      {wrappedContent}
      {orderFeatureEnabled && <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />}

      {/* Render modal ONCE */}
      <ModelShowcase
        open={modelOpen}
        item={selectedModel}
        onClose={() => setModelOpen(false)}
        orderFeatureEnabled={orderFeatureEnabled}
        onOrder={handleSelectOrder}
        extras={template?.extras || []}
      />

      <OrderViewModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orders={orders}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setShowPaymentMethod(true)}
      />

      <PaymentMethodModal
        open={showPaymentMethod}
        onClose={() => setShowPaymentMethod(false)}
        onPayInKasse={() => console.log("pay in kasse")}
        onPayNow={() => handleCheckout()}
      />

      <FlashMessage
        show={message?.visible}
        type={message?.type || ""}
        message={message?.msg || ""}
        onClose={() => setMessage(null)}
        duration={3000}
      />

    </div>
  );
}

function NoFoundTemplate({ onGoback }) {
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.notFoundCard}>
        <div className={styles.notFoundIcon}>🍕</div>
        <h2 className={styles.notFoundTitle}>Template Not Found</h2>
        <p className={styles.notFoundText}>
          The menu template you’re looking for doesn’t exist or was removed.
        </p>
        <button className={styles.notFoundBtn} onClick={onGoback}>
          Go Back
        </button>
      </div>
    </div>
  );
}
