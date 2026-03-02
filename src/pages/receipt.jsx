import {useSearchParams, useNavigate } from "react-router-dom";
import ReceiptModal from "../components/receiptModal";
import axios from "axios";
import httpMessage from "../http/httpMessage";
import { useEffect, useState } from "react";
import styles from "../styles/Receipt.module.css";
import http_order from "../http/http_order";

import FlashMessage from "../components/flashMessage";




export default function Receipt() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState({visible: false, msg: "", type: ""});
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!orderId) {
            navigate("/"); // Redirect to home if no orderId
            return;
        }
        getOrderDetails(orderId);
    }, [orderId, navigate]);

    const getOrderDetails = async (orderId) => {
        try {
            setLoading(true);
            const res = await http_order.get(`/order/${orderId}`);
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
            <FlashMessage message={message.msg} type={message.type} visible={message.visible} onClose={() => setMessage({visible: false, msg: "", type: ""})} />
        </main>
    );
}