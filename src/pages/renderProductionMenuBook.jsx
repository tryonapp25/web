import { useMemo, useState, Suspense, lazy, useEffect } from "react";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import NoFoundTemplate from "../components/noFoundTemplate";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import defaultMessage from "../utils/defaultMessage";

import {HandeleConnect} from "../utils/socketio";

import ModelShowcase from "../components/modelShowcase";
import CartBubble from "../components/cartBubble";
import OrderViewModal from "../components/orderViewModal";
import PaymentMethodModal from "../components/paymentMethodModal";
import { getFeatureFlags } from "../featureFlags/featureFlags";

// load templates from templates folder (including subfolders) and menuBook wrappers
const templateModules = import.meta.glob("../templates/**/*.jsx");
const menuBookModules = import.meta.glob("../templates/menuBooks/*.jsx");

export default function RenderProductionMenuBook() {
  const isMobile = useIsMobile();
  const [orderFeatureEnabled, setOrderFeatureEnabled] = useState(true);

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
      try {
        const response = await http.get(`/${type}/menu-book/template/${templatecode}/menubook/${menubookCode}/id/${id}/public/${publicCode}`);
        if(response?.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        const msg = httpMessage(error);
        setMessage(msg);
      } finally {
        setLoading(false);
      } 
    }
    getFlags();
    fetchData();
  }, [type, id, templatecode, menubookCode]);

  const getFlags = async () => {
    const flags = await getFeatureFlags("ORDER_FEATURE");
    setOrderFeatureEnabled(flags);
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
    console.log("Checkout with orders:", orders);
    if (!orders || orders.length === 0) {
      console.warn("No orders to checkout");
      return;
    }

    try {
      const socket = await HandeleConnect();
      if (!socket || !socket.emit) {
        console.error("Socket not available");
        return;
      }

      const payload = {
        orders,
        templateCode: data?.templateCode || null,
        menuBookCode: data?.menuBookCode || null,
      };

      socket.emit("new_order", payload, (response) => {
        console.log("Server response to new_order:", response);
      });
    } catch (err) {
      console.error("Error during checkout emit:", err);
    }
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

  // tolerantly read possible code fields (handles typos like `teplateCode`)
  const templateCode = data?.templateCode 
  const menuBookCode = data?.menuBookCode


  const templatePath = `../templates/${templateCode}.jsx`;
  const templatePathAlt = `../templates/menu/${templateCode}.jsx`;
  const menuBookPath = `../templates/menuBooks/${menuBookCode}.jsx`;



  const LazyTemplate = templateMap[templatePath] || templateMap[templatePathAlt] || null;
  const LazyMenuBook = menuBookMap[menuBookPath] || null;

  if (loading) {
    return <LoadingModal message="Loading Menu Book..." />;
  }

  const Preview = (
    <Suspense fallback={<div style={{ padding: 12 }}>Loading…</div>}>
      {LazyMenuBook && LazyTemplate ? (
        <LazyMenuBook data={data} onSave={(tem) => console.log(tem)}
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

  return(
    <div>
      {isMobile ? Preview : <PdfPageWrapper>{Preview}</PdfPageWrapper>}

      {/* Render modal ONCE */}
      <ModelShowcase
        open={modelOpen}
        item={selectedModel}
        onClose={() => setModelOpen(false)}
        orderFeatureEnabled={orderFeatureEnabled}
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
        onPayNow={() => handleCheckout()}
      />

      {orderFeatureEnabled && <CartBubble count={orders.length} onClick={() => setOrderModalOpen(true)} />}
    </div>
  )
}
