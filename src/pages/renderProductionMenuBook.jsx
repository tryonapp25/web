import { useMemo, useState, Suspense, lazy, useEffect, useContext, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import http_order from "../http/http_order";
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
const VITE_PUBLIC_RECEIPT_URL=import.meta.env.VITE_APP_PUBLIC_URL;

export default function RenderProductionMenuBook() {
  const isMobile = useIsMobile();

  // guards
  const fetchedRef = useRef(false);
  const { orderFeatureEnabled } = useContext(SocketContext);
  const { isBusinessOpen } = useContext(BusinessContext);
  
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

  const [currentContent, setCurrentContent] = useState(data?.contents?.[0] || null);

  useEffect(() => {
    if(fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData();
  }, [type, id, templatecode, menubookCode, publicCode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await http.get(
        `/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}/public/${publicCode}`
      );
      if (response?.data?.success) setData(response.data.data);
    } catch (error) {
      setMessage(httpMessage(error));
    } finally {
      setLoading(false);
    }
  };


  const handleSelectOrder = (order) => {
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
    try{
      set
      const newTab = window.open("", "_blank"); // open immediately to avoid popup blockers
      const ordersWithTemplate = { receiverId: template.uid, orders };

      const create = await createOrder(ordersWithTemplate);

      if (!create?.success) {
        newTab?.close();
        setMessage({
          visible: true,
          type: "error",
          msg: create?.error || "Failed to place order. Please try again."
        });
        return;
      }

      /* setMessage({
        visible: true,
        type: "success",
        msg: "Order placed successfully!"
      });

      const url = `${import.meta.env.VITE_PUBLIC_RECEIPT_URL}receipt/production?orderId=${create?.data?.id}`;

      if (newTab) {
        newTab.location.href = url;
      }

      Clear(); */
    }
    catch(error){
      setMessage({
        visible: true,
        type: "error",
        msg: error?.message || "Failed to place order. Please try again."
      });
    }
    finally{
      setLoading(false);
    }
  };

  const Clear = () => {
    setOrders([]);
    setOrderModalOpen(false);
    setShowPaymentMethod(false);
    setMessage(defaultMessage);
  }

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
          curentContent={(content) => setCurrentContent(content)}
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
        orderFeatureEnabled={orderFeatureEnabled}
        onOrder={handleSelectOrder}
        extras={data?.extras || []}
        data={currentContent}
      />

      <OrderViewModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orders={orders}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setShowPaymentMethod(true)}
        data={data}
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

      {orderFeatureEnabled && isBusinessOpen && <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />}
      {!isBusinessOpen && orderFeatureEnabled && <CloseBubble/>}
    </div>
  );
}