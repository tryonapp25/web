import React, {
  useMemo,
  useState,
  Suspense,
  lazy,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import defaultMessage from "../utils/defaultMessage";
import useIsMobile from "../utils/deviceCheck";
import { createOrder } from "../utils/socketio";

import ModelShowcase from "../components/modelShowcase";
import CartBubble from "../components/cartBubble";
import CloseBubble from "../components/closeBubble";
import OrderViewModal from "../components/orderViewModal";
import PaymentMethodModal from "../components/paymentMethodModal";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import NoFoundTemplate from "../components/noFoundTemplate";
import PdfPageWrapper from "../components/pdfPageWrapper";

import { SocketContext } from "../ApiContext/socketContext";
import { BusinessContext } from "../ApiContext/businessContext";

// load templates from templates folder (including subfolders) and menuBook wrappers
const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");
const VITE_PUBLIC_CHECKOUT_URL = import.meta.env.VITE_APP_PUBLIC_URL;

class RenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MenuBook render crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>This menu book could not be rendered.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function RenderProductionMenuBook() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { orderFeatureEnabled } = useContext(SocketContext);
  const { isBusinessOpen } = useContext(BusinessContext);

  const { type, id } = useParams();
  const [searchParams] = useSearchParams();

  const templatecode = searchParams.get("template");
  const menubookCode = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  const [allowShowModel, setAllowShowModel] = useState(false);

  const fetchData = useCallback(async (mountedRef) => {
    setLoading(true);
    setFetchFailed(false);

    try {
      const response = await http.get(
        `/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}/public/${publicCode}`
      );

      if (!mountedRef.current) return;

      if (response?.data?.success && response?.data?.data) {
        const result = response.data.data;
        setData(result);
        setCurrentContent(result?.contents?.[0] || null);
        setAllowShowModel(response?.data?.show3dModel);
      } else {
        setData(null);
        setCurrentContent(null);
        setFetchFailed(true);
      }
    } catch (error) {
      if (!mountedRef.current) return;

      console.error("fetch menu book error:", error);
      setData(null);
      setCurrentContent(null);
      setFetchFailed(true);
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(error) || "Failed to load menu book.",
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [type, id, templatecode, menubookCode, publicCode]);

  useEffect(() => {
    const mountedRef = { current: true };

    fetchData(mountedRef);

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const handleSelectOrder = useCallback((order) => {
    setOrders((prevOrders) => {
      const title = order?.data?.title;
      const existingIndex = prevOrders.findIndex((item) => item.title === title);

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
      setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
      return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
    setMessage(defaultMessage);
  }, []);

  const handlePaymentSuccess = useCallback((payment, newTab) => {
    const { paymentIntentId } = payment || {};

    const url = `${VITE_PUBLIC_CHECKOUT_URL}/checkout?paymentIntentId=${
      paymentIntentId || ""
    }&orderId=${payment?.orderId || ""}`;

    if (newTab) {
      newTab.location.href = url;
    } else {
      window.location.href = url;
    }

    clearAll();
  }, [clearAll]);

  const handleCheckout = useCallback(async () => {
    const newTab = window.open("", "_blank", "noopener,noreferrer");

    try {
      setLoading(true);

      if (!data?.uid || orders.length === 0) {
        if (newTab) newTab.close();

        setMessage({
          visible: true,
          type: "error",
          msg: "Missing order information.",
        });
        return;
      }

      const ordersWithTemplate = {
        receiverId: data.uid,
        orders,
      };

      const create = await createOrder(ordersWithTemplate);

      if (!create?.success) {
        if (newTab) newTab.close();

        setMessage({
          visible: true,
          type: "error",
          msg: create?.error || "Failed to place order. Please try again.",
        });
        return;
      }

      const payment = create?.payment || {};
      payment.orderId = create?.data?.id;

      handlePaymentSuccess(payment, newTab);
    } catch (error) {
      console.error("checkout error:", error);

      if (newTab) newTab.close();

      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(error) || error?.message || "Failed to place order.",
      });
    } finally {
      setLoading(false);
    }
  }, [data, orders, handlePaymentSuccess]);

  const templateMap = useMemo(() => {
    const out = {};
    for (const path of Object.keys(templateModules)) {
      out[path] = lazy(templateModules[path]);
    }
    return out;
  }, []);

  const menuBookMap = useMemo(() => {
    const out = {};
    for (const path of Object.keys(menuBookModules)) {
      out[path] = lazy(menuBookModules[path]);
    }
    return out;
  }, []);

  const templateCode = data?.templateCode;
  const menuBookCode = data?.menuBookCode;

  const templatePath = templateCode ? `../templates/${templateCode}.jsx` : null;
  const templatePathAlt = templateCode ? `../templates/menu/${templateCode}.jsx` : null;
  const menuBookPath = menuBookCode ? `../templates/menuBooks/${menuBookCode}.jsx` : null;

  const LazyTemplate =
    (templatePath && templateMap[templatePath]) ||
    (templatePathAlt && templateMap[templatePathAlt]) ||
    null;

  const LazyMenuBook = menuBookPath ? menuBookMap[menuBookPath] || null : null;

  if (loading) {
    return <LoadingModal open={true} title="Menu Book" subtitle="Loading..." />;
  }

  if (fetchFailed || !data || !LazyTemplate || !LazyMenuBook) {
    return <NoFoundTemplate onGoback={() => navigate("/menu")} />;
  }

  const preview = (
    <RenderErrorBoundary>
      <Suspense fallback={<div style={{ padding: 12 }}>Loading…</div>}>
        <LazyMenuBook
          data={data}
          onSave={(tem) => console.log("saved:", tem)}
          onClickModel={(item) => {
            setSelectedModel(item);
            setModelOpen(true);
          }}
          curentContent={(content) => setCurrentContent(content)}
        >
          <LazyTemplate />
        </LazyMenuBook>
      </Suspense>
    </RenderErrorBoundary>
  );

  return (
    <div>
      {isMobile ? preview : <PdfPageWrapper>{preview}</PdfPageWrapper>}

      {modelOpen && (
        <ModelShowcase
          open={modelOpen}
          item={selectedModel}
          onClose={() => setModelOpen(false)}
          orderFeatureEnabled={orderFeatureEnabled}
          onOrder={handleSelectOrder}
          extras={data?.extras || []}
          data={currentContent}
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
          onCheckout={() => setShowPaymentMethod(true)}
          data={data}
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

      {orderFeatureEnabled && isBusinessOpen && (
        <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />
      )}

      {!isBusinessOpen && orderFeatureEnabled && <CloseBubble />}
    </div>
  );
}