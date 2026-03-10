import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
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
const VITE_PUBLIC_CHECKOUT_URL = import.meta.env.VITE_APP_PUBLIC_URL;

class TemplateErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Template render crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.notFoundWrap}>
          <div className={styles.notFoundCard}>
            <div className={styles.notFoundIcon}>⚠️</div>
            <h2 className={styles.notFoundTitle}>Something went wrong</h2>
            <p className={styles.notFoundText}>
              The menu template failed to load correctly.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function RenderProductionMenu() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const checkoutWindowRef = useRef(null);


  const { orderFeatureEnabled } = useContext(SocketContext);
  const { isBusinessOpen } = useContext(BusinessContext);

  const { type, id } = useParams();
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [message, setMessage] = useState(defaultMessage);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const [allowShowModel, setAllowShowModel] = useState(false);

  const fetchTemplate = useCallback(
    async (isMountedRef) => {
      setLoading(true);
      setFetchFailed(false);

      try {
        const res = await http.get(
          `/${type}/code/${code}/template/${id}/public/${publicCode}`
        );

        if (!isMountedRef.current) return;

        if (res?.data?.success && res?.data?.data) {
          setTemplate(res.data.data);
          setAllowShowModel(!!res.data.show3dModel);
        } else {
          setTemplate(null);
          setFetchFailed(true);
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        console.error("fetchTemplate error:", err);
        setTemplate(null);
        setFetchFailed(true);
        setMessage({
          visible: true,
          type: "error",
          msg: httpMessage(err) || "Failed to load template. Please try again.",
        });
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [type, code, id, publicCode]
  );

  useEffect(() => {
    const isMountedRef = { current: true };
    fetchTemplate(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchTemplate]);

  const handleSelectOrder = useCallback((order) => {
    setOrders((prevOrders) => {
      const existingIndex = prevOrders.findIndex(
        (item) => item.title === order?.data?.title
      );

      if (existingIndex !== -1) {
        return prevOrders.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevOrders, { ...order.data, quantity: 1 }];
    });

    setModelOpen(false);
    setOrderModalOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((index, newQuantity) => {
    if (newQuantity < 1) {
      setOrders((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setOrders((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveExtra = useCallback((itemIndex, extraIndex) => {
    setOrders((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const newExtras = item.extras?.filter((_, j) => j !== extraIndex) ?? [];
        return { ...item, extras: newExtras };
      })
    );
  }, []);

  const handleRemoveIngredient = useCallback((itemIndex, ingredientIndex) => {
    setOrders((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const newIngs = item.ingredients?.filter((_, j) => j !== ingredientIndex) ?? [];
        return { ...item, ingredients: newIngs };
      })
    );
  }, []);

  const clearAll = useCallback(() => {
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
    setMessage(defaultMessage);
  }, []);

  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);

      if (!template?.uid || orders.length === 0) {
        setMessage({
          visible: true,
          type: "error",
          msg: "Missing order information.",
        });
        return;
      }

      const ordersWithTemplate = { receiverId: template.uid, orders };
      const create = await createOrder(ordersWithTemplate);

      if (!create?.success) {
        setMessage({
          visible: true,
          type: "error",
          msg: create?.error || "Failed to place order.",
        });
        return;
      }

      const payment = create?.payment || {};
      payment.orderId = create?.data?.id;

      const url = `${VITE_PUBLIC_CHECKOUT_URL}/checkout?paymentIntentId=${
        payment.paymentIntentId || ""
      }&orderId=${payment.orderId || ""}`;

      let checkoutWindow = checkoutWindowRef.current;

      if (!checkoutWindow || checkoutWindow.closed) {
        checkoutWindow = window.open(url, "checkout-tab");
        checkoutWindowRef.current = checkoutWindow;
      } else {
        checkoutWindow.location.href = url;
        checkoutWindow.focus();
      }

      clearAll();
    } catch (err) {
      console.error("Checkout error:", err);
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(err) || "Checkout failed.",
      });
    } finally {
      setLoading(false);
    }
  }, [template, orders, clearAll]);

  const key = template?.code ? `../templates/menu/${template.code}.jsx` : null;
  const hasTemplateModule = !!(key && modules[key]);

  const Template = useMemo(() => {
    if (!hasTemplateModule) return null;
    return lazy(modules[key]);
  }, [key, hasTemplateModule]);

  if (loading) {
    return <LoadingModal open={true} title="Menu" subtitle="Loading..." />;
  }

  if (fetchFailed || !template || !Template) {
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  }

  const content = (
    <TemplateErrorBoundary>
      <Suspense
        fallback={<LoadingModal open={true} title="Menu" subtitle="Loading template..." />}
      >
        <Template
          data={template}
          onSave={(tem) => console.log("Saved template:", tem)}
          onClickModel={(item) => {
            setSelectedModel(item);
            setModelOpen(true);
          }}
        />
      </Suspense>
    </TemplateErrorBoundary>
  );

  const wrappedContent = isMobile ? content : <PdfPageWrapper>{content}</PdfPageWrapper>;

  // Generate a stable key that changes when the selected model item changes
  const modelKey = selectedModel
    ? `model-${selectedModel.id || selectedModel.data?.title || selectedModel.data?.model || "unknown"}`
    : null;

  return (
    <div>
      {wrappedContent}

      {orderFeatureEnabled && isBusinessOpen && (
        <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />
      )}

      {!isBusinessOpen && orderFeatureEnabled && <CloseBubble />}

      {modelOpen && selectedModel && (
        <ModelShowcase
          key={modelKey}                      // ← helps force clean remount
          open={modelOpen}
          item={selectedModel}
          onClose={() => setModelOpen(false)}
          orderFeatureEnabled={orderFeatureEnabled}
          onOrder={handleSelectOrder}
          extras={template?.extras || []}
          data={template}
          allowShowModel={allowShowModel}
        />
      )}

      {orderModalOpen && (
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
      )}

      {showPaymentMethod && (
        <PaymentMethodModal
          open={showPaymentMethod}
          onClose={() => setShowPaymentMethod(false)}
          onPayInKasse={() => console.log("pay in kasse")}
          onPayNow={handleCheckout}
        />
      )}

      <FlashMessage
        show={message?.visible}
        type={message?.type || ""}
        message={message?.msg || ""}
        onClose={() => setMessage(defaultMessage)}
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