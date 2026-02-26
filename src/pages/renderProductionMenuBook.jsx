import { useMemo, useState, Suspense, lazy, useEffect, useContext, useRef } from "react";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import NoFoundTemplate from "../components/noFoundTemplate";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import defaultMessage from "../utils/defaultMessage";

import { SocketContext } from "../ApiContext/socketContext";

import ModelShowcase from "../components/modelShowcase";
import CartBubble from "../components/cartBubble";
import OrderViewModal from "../components/orderViewModal";
import PaymentMethodModal from "../components/paymentMethodModal";

// load templates from templates folder (including subfolders) and menuBook wrappers
const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");

export default function RenderProductionMenuBook() {
  const { sendOrder, socketEnabled, connected } = useContext(SocketContext);
  const isMobile = useIsMobile();

  // guards
  const fetchedRef = useRef(false);

  const [showCartBubble, setShowCartBubble] = useState(false);
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const templatecode = searchParams.get("template");
  const menubookCode = searchParams.get("code");
  const publicCode = searchParams.get("public");

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState(defaultMessage);

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchedRef.current = true; // mark that we've fetched at least once
      try {
        const response = await http.get(
          `/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}/public/${publicCode}`
        );
        if (response?.data?.success) setData(response.data.data);
      } catch (error) {
        setMessage(httpMessage(error));
      } finally {
        setLoading(false);
        fetchedRef.current = false;
      }
    };
    if(fetchedRef.current) return;
    fetchData();
  }, [type, id, templatecode, menubookCode, publicCode]);

  useEffect(() => {
    if (connected && socketEnabled) setShowCartBubble(true);
  }, [connected, socketEnabled]);

  const handleSelectOrder = (order) => {
    if (!socketEnabled) return;

    setOrders((prevOrders) => {
      const existingIndex = prevOrders.findIndex((item) => item.title === order.data.title);

      if (existingIndex !== -1) {
        return prevOrders.map((item, index) =>
          index === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevOrders, { ...order.data, quantity: 1 }];
    });

    setModelOpen(false);
    setOrderModalOpen(true);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
      return;
    }
    setOrders((prevOrders) => prevOrders.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item)));
  };

  const handleRemoveItem = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    const ordersWithTemplate = { receiver: data?.uid, orders };
    const res = await sendOrder(ordersWithTemplate);
    if (!res.success) {
      setMessage({ visible: true, type: "error", msg: `Failed to place order: ${res.error}` });
      return;
    }
    setMessage({ visible: true, type: "success", msg: "Order placed successfully!" });
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
  };

  const templateMap = useMemo(() => {
    const out = {};
    for (const p of Object.keys(templateModules)) out[p] = lazy(templateModules[p]);
    return out;
  }, []);

  const menuBookMap = useMemo(() => {
    const out = {};
    for (const p of Object.keys(menuBookModules)) out[p] = lazy(menuBookModules[p]);
    return out;
  }, []);

  const templateCode = data?.templateCode;
  const menuBookCode = data?.menuBookCode;

  const templatePath = `../templates/${templateCode}.jsx`;
  const templatePathAlt = `../templates/menu/${templateCode}.jsx`;
  const menuBookPath = `../templates/menuBooks/${menuBookCode}.jsx`;

  const LazyTemplate = templateMap[templatePath] || templateMap[templatePathAlt] || null;
  const LazyMenuBook = menuBookMap[menuBookPath] || null;

  if (loading) return <LoadingModal message="Loading Menu Book..." />;

  const Preview = (
    <Suspense fallback={<div style={{ padding: 12 }}>Loading…</div>}>
      {LazyMenuBook && LazyTemplate ? (
        <LazyMenuBook
          data={data}
          onSave={(tem) => console.log(tem)}
          onClickModel={(item) => {
            setSelectedModel(item);
            setModelOpen(true);
          }}
        >
          <LazyTemplate />
        </LazyMenuBook>
      ) : (
        <NoFoundTemplate onGoback={() => navigate("menu")} />
      )}
    </Suspense>
  );

  return (
    <div>
      {isMobile ? Preview : <PdfPageWrapper>{Preview}</PdfPageWrapper>}

      <ModelShowcase
        open={modelOpen}
        item={selectedModel}
        onClose={() => setModelOpen(false)}
        orderFeatureEnabled={socketEnabled}
        onOrder={handleSelectOrder}
        extras={data?.extras || []}
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
        onPayNow={handleCheckout}
      />

      <FlashMessage
        show={message?.visible}
        type={message?.type || ""}
        message={message?.msg || ""}
        onClose={() => setMessage(null)}
        duration={3000}
      />

      {showCartBubble && <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />}
    </div>
  );
}