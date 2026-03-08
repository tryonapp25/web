import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "../styles/CheckoutForm.module.css";
import http_order from "../http/http_order";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Spinner({ size = 16 }) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}

function CheckoutInner({
  orderId,
  onClose,
  onSuccess,
  title = "Betaling",
  subtitle = "Sikker betaling drevet af Stripe",
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await http_order.put(`/order/${orderId}/payment-success/${paymentIntent.id}`);
      } catch (err) {
        console.error(err);
      }

      onSuccess?.(paymentIntent);
      setLoading(false);
      onClose?.();
      return;
    }

    setLoading(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
      </div>

      <div className={styles.stripeBox}>
        <PaymentElement />
      </div>

      {message && <p className={styles.errorText}>{message}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
          disabled={loading}
        >
          Annuller
        </button>

        <button
          type="submit"
          className={styles.payBtn}
          disabled={!stripe || !elements || loading}
        >
          {loading ? (
            <>
              <Spinner />
              Behandler...
            </>
          ) : (
            "Betal"
          )}
        </button>
      </div>

      <p className={styles.footerNote}>
        Sikker betaling drevet af Stripe. Dine kortoplysninger rører aldrig vores server.
      </p>
    </form>
  );
}

export default function CheckoutForm({
  open,
  clientSecret,
  orderId,
  onClose,
  onSuccess,
  title,
  subtitle,
}) {
  if (!open || !clientSecret || !orderId) return null;

  const elementsOptions = useMemo(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      // Optional appearance config:
      // appearance: { theme: "stripe" },
    };
  }, [clientSecret]);

  console.log("CheckoutForm rendered with clientSecret:", clientSecret);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Elements
          stripe={stripePromise}
          options={elementsOptions}
        >
          <CheckoutInner
            orderId={orderId}
            onClose={onClose}
            onSuccess={onSuccess}
            title={title}
            subtitle={subtitle}
          />
        </Elements>
      </div>
    </div>
  );
}