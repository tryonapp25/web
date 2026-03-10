// Payment.jsx
import { useEffect, useState, useContext, useMemo } from "react";
import styles from "../styles/BusinessPayment.module.css";
import { UserContext } from "../ApiContext/userContext";
import http from "../http/http";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/flashMessage";
import LoadingModal from "../components/loading";
import { useTranslation } from "react-i18next";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import httpMessage from "../http/httpMessage";

const defaultMessage = {
  visible: false,
  type: "",
  msg: "",
};

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

/** Stripe Checkout Form (Payment Element) */
function CheckoutForm({
  onClose,
  selected,
  loadingOuter,
  setLoadingOuter,
  onSuccess,
  t,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");


  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setMessage("");
    setLoadingOuter(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || t("payment.paymentFailed"));
      setLoadingOuter(false);
      return;
    }

    setLoadingOuter(false);
    onClose();
    onSuccess(selected);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.modalSub}>
        {selected?.pack} · {selected?.tokens} tokens ·{" "}
        {(selected?.currency || "usd").toLowerCase() === "usd" ? "$" : "DKK"}
        {selected?.price}
      </div>

      {/* Scroll will happen inside the form, so PaymentElement can grow safely */}
      <PaymentElement/>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
          disabled={loadingOuter}
        >
          {t("common.cancel")}
        </button>

        <button
          type="submit"
          className={styles.payBtn}
          disabled={!stripe || !elements || loadingOuter}
        >
          {loadingOuter ? (
            <>
              <Spinner />
              {t("payment.processing")}
            </>
          ) : (
            t("payment.pay")
          )}
        </button>
      </div>

      {message && <p className={styles.errorText}>{message}</p>}
      <p className={styles.finePrint}>{t("payment.secureCheckout")}</p>
    </form>
  );
}

export default function BusinessPayment() {
  const navigate = useNavigate();
  const { publicUser, setPublicUser } = useContext(UserContext);
  const { t } = useTranslation();

  const [pricing, setPricing] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [selected, setSelected] = useState(null);
  const [openPay, setOpenPay] = useState(false);

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await http.get(`/business/pricing`);
        if (res.data?.success) {
          const data = res.data.data || [];
          setPricing(data);

          const hi = data.findIndex((x) => x.highlighted === true);
          setHighlightedIndex(hi >= 0 ? hi : 0);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load pricing.");
      }
    };

    fetchPricing();
  }, []);

  const onClose = () => {
    setOpenPay(false);
    setClientSecret("");
  };

  const onChoose = async (plan) => {
    setSelected(plan);
    await createPaymentIntent(plan);
  };

  const createPaymentIntent = async (plan) => {
    if (!plan) return;

    try {
      setLoading(true);

      const res = await http.post(`/payment/create-intent`, {
        user: publicUser,
        package: plan,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Create intent failed");
      }

      const { clientSecret } = res.data.data;
      if (!clientSecret) throw new Error("Missing clientSecret from backend.");

      setClientSecret(clientSecret);
      setPaymentData(res.data.data);
      setOpenPay(true);
    } catch (e) {
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(e) || t("payment.paymentFailed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const HandlePaymentSuccess = async () => {
    if (!paymentData) {
      setMessage({
        visible: true,
        type: "warn",
        msg: t("payment.failedToUpdate"),
      });
      return;
    }

    let endpoint = `/payment/business/payment-success/${paymentData?.paymentIntentId}`;
    if (publicUser?.isCustomer === true) {
      endpoint = `/payment/business/update-subscription/${paymentData?.paymentIntentId}`;
    }

    try {
      setLoading(true);
      const res = await http.put(endpoint, {
        user: publicUser,
        package: selected,
      });

      if (res.data.success) {
        setPublicUser(res.data.data);
        setMessage({ visible: true, type: "success", msg: res.data.message });
        setTimeout(() => {
          navigate(`/business`);
        }, 700);
      }
    } catch (err) {
      setMessage({
        visible: true,
        type: "error",
        msg: httpMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const elementsOptions = useMemo(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      // optional:
      // appearance: { theme: "stripe" },
    };
  }, [clientSecret]);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>{t("payment.setup")}</h1>
            <p className={styles.subtitle}>{t("payment.setupSubtitle")}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {pricing.length > 0 &&
            pricing.map((p, idx) => (
              <div
                key={p.id || p.pack}
                className={`${styles.card} ${
                  p.highlighted ? styles.highlight : ""
                }`}
                aria-label={p.pack}
              >
                {idx === highlightedIndex && (
                  <div className={styles.ribbon}>Most Popular</div>
                )}

                {idx !== highlightedIndex && (
                  <div className={styles.cardTop}>
                    <h3 className={styles.plan}>{p.pack}</h3>
                    <div className={styles.tokens}>{p.tokens} tokens</div>
                  </div>
                )}

                <div className={styles.priceRow}>
                  <div className={styles.price}>
                    {p.currency === "usd"
                      ? "$"
                      : p.currency === "euro"
                      ? "€"
                      : p.currency}
                    {p.price}
                  </div>
                  <div className={styles.per}>one-time</div>
                </div>

                <p className={styles.description}>{p.description}</p>

                <ul className={styles.list}>
                  {(p.items || []).map((it) => (
                    <li key={it.description} className={styles.item}>
                      <span className={styles.check}>
                        {it?.included ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          color: "var(--text)",
                          textDecoration: it?.included ? "none" : "line-through",
                        }}
                      >
                        {it.description}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={
                    p.highlighted ? styles.primaryBtn : styles.secondaryBtn
                  }
                  onClick={() => onChoose(p)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Processing…
                    </>
                  ) : (
                    `Choose ${p.pack}`
                  )}
                </button>
              </div>
            ))}
        </div>

        <LoadingModal
          open={loading}
          title={t("payment.processing")}
          subtitle={t("payment.pleaseWait")}
        />
        <FlashMessage
          show={message.visible}
          type={message.type}
          message={message.msg}
          onClose={() => setMessage(defaultMessage)}
        />
      </div>

      {/* Payment modal */}
      {openPay && selected && elementsOptions && (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h2 className={styles.modalTitle}>{t("payment.checkout")}</h2>
                <p className={styles.modalSub}>
                  {selected.pack} · {selected.tokens} tokens ·{" "}
                  {(selected.currency || "usd").toLowerCase() === "usd"
                    ? "$"
                    : "DKK"}
                  {selected.price}
                </p>
              </div>

              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
                type="button"
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm
                onClose={onClose}
                selected={selected}
                loadingOuter={loading}
                setLoadingOuter={setLoading}
                onSuccess={() => HandlePaymentSuccess()}
                t={t}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}