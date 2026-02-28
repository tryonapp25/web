import styles from "../styles/BusinessOrder.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import { getFeatureFlags } from "../featureFlags/featureFlags.js";
import Socket from "../model/socket";

import Sidebar from "../components_business/businessSidebar";
import LoadingModal from "../components/loading";
import FlashMessage from "../components/flashMessage";
import OrdersGrid from "../components_business/ordersGrid";


const ORDERS = [
  {
    id: 6,
    businessId: 21,
    data: [
      {
        data: [
          {
            "name": "Large",
            "description": "Stir-fried rice noodles with a medley of fresh vegetables and tofu in a tangy tamarind sauce, topped with crushed peanuts and lime wedges.",
            "price": "13.99",
            "quantity": "1"
          }
        ],
        model: 'https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FMEATLOAF_WITH_FRIED.glb_032d7ef8-a116-4ecf-8f34-c32b4b870dcb.glb?alt=media&token=0b5a73c0-ba11-4ee3-a42d-59da1a72a0c5',
        title: 'MEATLOAF WITH FRIED EGG &\nFRIED POTATOES',
        extras: {
          title: "Vegetable Pad Thai",
          description: "",
          data: null
        },
        images: [
          "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FGrilled_Salmon_image.png?alt=media&token=2d43764e-9fde-417d-9e03-390f731af438"
        ],
        quantity: 1,
        description: 'Fleischkäse mit Spiegelei & Bratkartoffeln',
        ingredients: []
      }
    ],
    status: 'PENDING',
    createdAt: "2026-02-28T01:02:29.000Z",
    updatedAt: "2026-02-28T01:02:29.000Z"
  },
  {
    id: 6,
    businessId: 21,
    data: [
      {
        data: [
          {
            "name": "Small",
            "description": "Stir-fried rice noodles with a medley of fresh vegetables and tofu in a tangy tamarind sauce, topped with crushed peanuts and lime wedges.",
            "price": "13.99",
            "quantity": "1"
          }
        ],
        model: 'https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FMEATLOAF_WITH_FRIED.glb_032d7ef8-a116-4ecf-8f34-c32b4b870dcb.glb?alt=media&token=0b5a73c0-ba11-4ee3-a42d-59da1a72a0c5',
        title: 'MEATLOAF WITH FRIED EGG &\nFRIED POTATOES',
        extras: {
          title: "",
          description: "",
          data: null
        },
        images: [
          "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FGrilled_Salmon_image.png?alt=media&token=2d43764e-9fde-417d-9e03-390f731af438"
        ],
        quantity: 1,
        description: 'Fleischkäse mit Spiegelei & Bratkartoffeln',
        ingredients: []
      }
    ],
    status: 'PENDING',
    createdAt: "2026-02-28T01:02:29.000Z",
    updatedAt: "2026-02-28T01:02:29.000Z"
  },
  {
    id: 6,
    businessId: 21,
    data: [
      {
        data: [
          {
            "name": "Medium",
            "description": "Stir-fried rice noodles with a medley of fresh vegetables and tofu in a tangy tamarind sauce, topped with crushed peanuts and lime wedges.",
            "price": "13.99",
            "quantity": "1"
          }
        ],
        model: 'https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FMEATLOAF_WITH_FRIED.glb_032d7ef8-a116-4ecf-8f34-c32b4b870dcb.glb?alt=media&token=0b5a73c0-ba11-4ee3-a42d-59da1a72a0c5',
        title: 'MEATLOAF WITH FRIED EGG &\nFRIED POTATOES',
        extras: {
          title: "",
          description: "",
          data: null
        },
        images: [
          "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FGrilled_Salmon_image.png?alt=media&token=2d43764e-9fde-417d-9e03-390f731af438"
        ],
        quantity: 1,
        description: 'Fleischkäse mit Spiegelei & Bratkartoffeln',
        ingredients: []
      }
    ],
    status: 'PENDING',
    createdAt: "2026-02-28T01:02:29.000Z",
    updatedAt: "2026-02-28T01:02:29.000Z"
  }
]

const newOrder = {
  id: 6,
  businessId: 21,
  data: [
    {
      data: [
        {
          "name": "Vegetable Pad Thai",
          "description": "Stir-fried rice noodles with a medley of fresh vegetables and tofu in a tangy tamarind sauce, topped with crushed peanuts and lime wedges.",
          "price": "13.99",
          "quantity": "1"
        }
      ],
      model: 'https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FMEATLOAF_WITH_FRIED.glb_032d7ef8-a116-4ecf-8f34-c32b4b870dcb.glb?alt=media&token=0b5a73c0-ba11-4ee3-a42d-59da1a72a0c5',
      title: 'MEATLOAF WITH FRIED EGG &\nFRIED POTATOES',
      extras: {
        title: "",
        description: "",
        data: null
      },
      images: [
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FGrilled_Salmon_image.png?alt=media&token=2d43764e-9fde-417d-9e03-390f731af438"
      ],
      quantity: 1,
      description: 'Fleischkäse mit Spiegelei & Bratkartoffeln',
      ingredients: []
    }
  ],
  status: 'PENDING',
  createdAt: "2026-02-28T01:02:29.000Z",
  updatedAt: "2026-02-28T01:02:29.000Z"
}

export default function BusinessOrders() {
  const navigation = useNavigate();
  const { socketRef, connected, orderFeatureEnabled } = useContext(SocketContext);
  const socketContext = useContext(SocketContext);
  const connectingRef = useRef(false);
  const flagRef = useRef(false);
  
  const [orderFlag, setOrderFlag] = useState(null);
  const [orders, setOrders] = useState([]);

  const [message, setMessage] = useState({ visible: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(flagRef.current) return;
    flagRef.current = true;
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
  

  
  const handleEnableOrderOnline = () => {
    // TODO: Implement socket enable logic
    console.log("Enable order online feature clicked");
    navigation("/business/setting");
  }; 


  const getFlag = async() => {
    const flag = await getFeatureFlags("ORDER_FEATURE").catch((err) => {
      console.error("Failed to fetch feature flag", err);
    });
    setOrderFlag(flag);
    return flag;
  }

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
        <OrdersGrid orders={orders} />
      </main>

      <LoadingModal open={loading} title="Reconnecting…" subtitle="Attempting to reconnect to the server." />
      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage({ visible: false, type: "", msg: "" })} />
    </div>
  );
}