import { useState, useRef, useEffect } from "react";
import http_order from "../http/http_order";
import httpMessage from "../http/httpMessage";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckoutForm from "../components/checkOutForm";
import FlashMessage from "../components/flashMessage";
import defaultMessage from "../utils/defaultMessage";
import LoadingModal from "../components/loading";
import PopupMessage from "../components/popupMessage";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const fetchedRef = useRef(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentIntentId = searchParams.get("paymentIntentId");

  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!paymentIntentId) {
      setMessage({
        visible: true,
        type: "error",
        msg: "No payment intent ID provided.",
      });
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    handleGetPayment(paymentIntentId);
  }, [paymentIntentId]);

  const handleGetPayment = async (paymentIntentId) => {
    try {
      setLoading(true);

      const res = await http_order.get(`/order/payment/intent/${paymentIntentId}`);

      if (res.data?.success) {
        setPaymentIntentData(res.data.data);

        if (res.data?.data?.status === "succeeded") {
          setPaymentSuccess(true);
          return;
        }

        setOpenCheckout(true);
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: "Payment information not found.",
        });
      }
    } catch (err) {
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(err) || "An error occurred while retrieving payment information.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (!orderId) {
      setMessage({
        visible: true,
        type: "error",
        msg: "Missing order ID.",
      });
      return;
    }

    const receiptBaseUrl = import.meta.env.VITE_APP_PUBLIC_URL;
    const url = `${receiptBaseUrl}/receipt/production?orderId=${orderId}`;

    Clear();

    // More reliable than window.open() on mobile Safari
    window.location.href = url;
  };

  const Clear = () => {
    setPaymentIntentData((prev) => ({
      ...prev,
      status: "succeeded",
    }));
    setPaymentSuccess(false);
    setMessage(defaultMessage);
    setOpenCheckout(false);
  };

  return (
    <div>
      <CheckoutForm
        open={openCheckout}
        clientSecret={paymentIntentData?.clientSecret || ""}
        orderId={orderId || null}
        onClose={() => setOpenCheckout(false)}
        onSuccess={handlePaymentSuccess}
      />

      <PopupMessage
        open={paymentSuccess}
        title="Payment Successful!"
        text="Your payment was successful. You can view your receipt now."
        onClose={() => setPaymentSuccess(false)}
        type="success"
      />

      <FlashMessage
        visible={message.visible}
        type={message.type}
        msg={message.msg}
      />

      <LoadingModal open={loading} />
    </div>
  );
}