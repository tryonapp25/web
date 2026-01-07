import { useMemo, useState } from "react";
import styles from "../styles/PricingPayment.module.css";
import ConfirmDialog from "../components/confirmDialog"; 
import Header from "../components/header";


const PRICING = [
  {
    id: "starter",
    pack: "Starter",
    price: "$1.99",
    currency: "usd",
    tokens: 10,
    desc: "Try TryOn with a few realistic previews.",
    items: [
      "10 try-on tokens",
      "Realistic full-body previews",
      "Side-by-side outfit comparison",
      "No charge for failed results",
    ],
    highlighted: false,
    popular: false
  },
  {
    id: "popular",
    pack: "Popular",
    price: "$4.99",
    currency: "usd",
    tokens: 30,
    desc: "Best value for everyday outfit decisions.",
    items: [
      "30 try-on tokens",
      "Everything in Starter Pack",
      "Color & fit guidance",
      "Context-aware styling",
    ],
    highlighted: true,
    popular: true
  },
  {
    id: "pro",
    pack: "Pro",
    price: "$9.99",
    currency: "usd",
    tokens: 80,
    desc: "For frequent shoppers and creators.",
    items: [
      "80 try-on tokens",
      "Everything in Popular Pack",
      "Faster processing priority",
      "Early access to new features",
    ],
    highlighted: false,
    popular: false
  },
];

function Spinner({ size = 16 }) {
  return <span className={styles.spinner} style={{ width: size, height: size }} />;
}

export default function Payment() {
  const [selected, setSelected] = useState(null);
  const [openPay, setOpenPay] = useState(false);
  const [loading, setLoading] = useState(false);

  // demo “payment form”
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const highlightedIndex = useMemo(
    () => PRICING.findIndex((p) => p.highlighted),
    []
  );

  const onChoose = (plan) => {
    setSelected(plan);
    onPay()
  };

  const resetForm = () => {
    setEmail("");
    setCard("");
    setExp("");
    setCvc("");
  };

  const onClose = () => {
    if (loading) return;
    setOpenPay(false);
    resetForm();
  };

  const onPay = async () => {
    if (!selected) return;

    try {
      setLoading(true);

      // TODO: replace with your real payment endpoint (Stripe/PayPal/etc)
      await new Promise((r) => setTimeout(r, 900));
      resetForm()
      alert(`Payment success! You purchased ${selected.name} (${selected.tokens} tokens).`);
    } catch (e) {
      setLoading(false);
      alert("Payment failed.");
    }
    finally{
        setLoading(false)
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <Header/>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>Buy Tokens</h1>
            <p className={styles.subtitle}>
              Choose a pack and unlock more try-on previews anytime.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {PRICING.map((p, idx) => (
            <div
              key={p.pack}
              className={`${styles.card} ${p.highlighted ? styles.highlight : ""}`}
              aria-label={p.pack}
            >
              {idx === highlightedIndex && (
                <div className={styles.ribbon}>Most Popular</div>
              )}

              <div className={styles.cardTop}>
                <h3 className={styles.plan}>{p.pack}</h3>
                <div className={styles.tokens}>{p.tokens} tokens</div>
              </div>

              <div className={styles.priceRow}>
                <div className={styles.price}>{p.price}</div>
                <div className={styles.per}>one-time</div>
              </div>

              <p className={styles.desc}>{p.desc}</p>

              <ul className={styles.list}>
                {p.items.map((it) => (
                  <li key={it} className={styles.item}>
                    <span className={styles.check}>✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <button
                className={p.highlighted ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => onChoose(p)}
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
      </div>

      {/* Payment modal /}
      {openPay && selected && (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h2 className={styles.modalTitle}>Checkout</h2>
                <p className={styles.modalSub}>
                  {selected.name} · {selected.tokens} tokens · {selected.price}
                </p>
              </div>

              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <div className={styles.form}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                type="email"
                disabled={loading}
              />

              <label className={styles.label}>Card number</label>
              <input
                className={styles.input}
                value={card}
                onChange={(e) => setCard(e.target.value.replace(/\s/g, ""))}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                disabled={loading}
              />

              <div className={styles.row2}>
                <div>
                  <label className={styles.label}>Expiry</label>
                  <input
                    className={styles.input}
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    placeholder="MM/YY"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={styles.label}>CVC</label>
                  <input
                    className={styles.input}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    inputMode="numeric"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                  Cancel
                </button>

                <button className={styles.payBtn} onClick={onPay} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner />
                      Processing…
                    </>
                  ) : (
                    `Pay ${selected.price}`
                  )}
                </button>
              </div>

              <p className={styles.finePrint}>
                Secure checkout. Your card details are not stored in this demo UI.
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
