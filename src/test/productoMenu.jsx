import React, { Suspense, lazy, useEffect, useMemo, useState, useRef, useContext} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/renderProductionMenu.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import useIsMobile from "../utils/deviceCheck";

import { SocketContext } from "../ApiContext/socketContext";
import { BusinessContext } from "../ApiContext/businessContext";
import { createOrder } from "../utils/socketio";

import LoadingModal from "../components/loading";
import PdfPageWrapper from "../components/pdfPageWrapper";
import ModelShowcase from "../components/modelShowcase";
import CartBubble from "../components/cartBubble";
import CloseBubble from "../components/closeBubble";
import OrderViewModal from "../components/orderViewModal";
import PaymentMethodModal from "../components/paymentMethodModal";
import FlashMessage from "../components/flashMessage";
import defaultMessage from "../utils/defaultMessage";




const modules = import.meta.glob("../templates/**/*.jsx");
const VITE_PUBLIC_CHECKOUT_URL=import.meta.env.VITE_APP_PUBLIC_URL;


export default function RenderProductionMenu() {
  const fetchedRef = useRef(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState(defaultMessage);
  const { orderFeatureEnabled } = useContext(SocketContext);

  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const { isBusinessOpen } = useContext(BusinessContext);

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);




  useEffect(() => {
    if(fetchedRef.current) return;
    fetchedRef.current = true;
    fetchTemplate();
  }, [type, id, code, publicCode]);

  const fetchTemplate = async () => {
    setLoading(true);
    setFetchFailed(false);
    try {
      const res = await http.get(`/${type}/code/${code}/template/${id}/public/${publicCode}`);
      if (res.data?.success && res.data?.data) {
        setTemplate(res.data.data);
      } else {
        setTemplate(null);
        setFetchFailed(true);
      }
    } catch (err) {
      setTemplate(null);
      setFetchFailed(true);
      setMessage({visible: true, type: "error", msg: httpMessage(err) || "Failed to load template. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
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

  const handleRemoveExtra = (itemIndex, extraIndex) => {
    setOrders((prevOrders) =>
      prevOrders.map((item, i) => {
        if (i === itemIndex) {
          const newExtras = item.extras ? item.extras.filter((_, j) => j !== extraIndex) : [];
          return { ...item, extras: newExtras };
        }
        return item;
      })
    );
  }

  const handleRemoveIngredient = (itemIndex, ingredientIndex) => {
    setOrders((prevOrders) =>
      prevOrders.map((item, i) => {
        if (i === itemIndex) {
          const newIngredients = item.ingredients ? item.ingredients.filter((_, j) => j !== ingredientIndex) : [];
          return { ...item, ingredients: newIngredients };
        }
        return item;
      })
    );
  };

  const handleCheckout = async () => {
    const newTab = window.open("", "_blank"); // open immediately from user gesture

    try {
      setLoading(true);

      const ordersWithTemplate = { receiverId: template.uid, orders };
      const create = await createOrder(ordersWithTemplate);

      if (!create?.success) {
        if (newTab) newTab.close();

        setMessage({
          visible: true,
          type: "error",
          msg: create?.error || "Failed to place order. Please try again."
        });
        return;
      }

      const payment = create?.payment || {};
      payment.orderId = create?.data?.id;

      const url = `${VITE_PUBLIC_CHECKOUT_URL}/checkout?paymentIntentId=${payment.paymentIntentId}&orderId=${payment.orderId || ""}`;

      if (newTab) {
        newTab.location.href = url;
      } else {
        // fallback if popup still blocked
        window.location.href = url;
      }

      Clear();
    } finally {
      setLoading(false);
    }
  };

  const Clear = () => {
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
    setMessage(defaultMessage);
  }

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
      {orderFeatureEnabled && isBusinessOpen && <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />}
      {!isBusinessOpen && orderFeatureEnabled && <CloseBubble/>}

      {/* Render modal ONCE */}
      <ModelShowcase
        open={modelOpen}
        item={selectedModel}
        onClose={() => setModelOpen(false)}
        orderFeatureEnabled={orderFeatureEnabled}
        onOrder={handleSelectOrder}
        extras={template?.extras || []}
        data={template}
      />

      <OrderViewModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orders={orders}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onRemoveExtra={handleRemoveExtra}
        onRemoveIngredient={handleRemoveIngredient}
        onCheckout={() => setShowPaymentMethod(true)}
        data={template}
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
