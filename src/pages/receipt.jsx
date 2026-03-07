import {useSearchParams, useNavigate } from "react-router-dom";
import ReceiptModal from "../components/receiptModal";
import httpMessage from "../http/httpMessage";
import { useEffect, useState, useContext, useRef, use } from "react";
import styles from "../styles/Receipt.module.css";
import http_order from "../http/http_order";

import {SocketContext} from "../ApiContext/socketContext";
import Socket from "../model/socket";

import FlashMessage from "../components/flashMessage";
import PopupMessage from "../components/popupMessage";
import RatingModal from "../components/ratingModal";




export default function Receipt() {
    const navigate = useNavigate();
    const fetchingRef = useRef(false);
    const socketContext = useContext(SocketContext);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [onReady , setOnReady] = useState(false);

    const { socketRef, connected } = useContext(SocketContext);

    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState({visible: false, msg: "", type: ""});
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!orderId) { navigate("/")
            return
        };

        if (fetchingRef.current) return; // Prevent multiple fetches
        fetchingRef.current = true;
        getOrderDetails();
    }, [orderId, navigate]);

    useEffect(() => {
        const socket = new Socket(socketContext);
        socket.connectAsGuest();
        if (!connected) return;

        console.log("✅ Socket connected, setting up event listeners...");

        const handleStatusUpdate = async (data, ack) => {
            console.log("orderStatusUpdate received:", data);
            setOrder(prev => prev ? { ...prev, status: data.status } : prev);
            if(data.status === "READY") {
                setOnReady(true);
            }
            // Show notification and vibrate on status update
            if (ack) ack({ success: true });
        };

        socketRef.current.on("orderStatusUpdate", handleStatusUpdate);

        return () => {
            socketRef.current.off("orderStatusUpdate", handleStatusUpdate);
        };
    }, [connected, socketRef]);

    const getOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await http_order.get(`/order`);
            if(res.data.success){
                console.log("get order details successfully:");
                setOrder(res.data.data);
                console.log(res.data.data);
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
        <main className={styles.page}>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <span>Loading receipt...</span>
                    </div>
                ) : order ? (
                    <>
                        <ReceiptModal open={true} onClose={() => navigate("/")} order={order} />
                        <button className={styles.backBtn} onClick={() => navigate("/menu")}>
                            ← Back to Home
                        </button>
                    </>
                ) : (
                    <div className={styles.error}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <div className={styles.errorText}>Order not found</div>
                        <div className={styles.errorSubtext}>Unable to load receipt for order #{orderId}</div>
                        <button className={styles.backBtn} onClick={() => navigate("/menu")}>
                            ← Back to Home
                        </button>
                    </div>
                )}
            </div>
            <RatingModal />
            <PopupMessage open={onReady} onClose={() => setOnReady(false)} />
            <FlashMessage message={message.msg} type={message.type} visible={message.visible} onClose={() => setMessage({visible: false, msg: "", type: ""})} />
        </main>
    );
}