import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/ReceiptModal.module.css";

function formatMoney(amount, currency = "USD") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    // fallback if currency code is invalid
    return `${Number(amount).toFixed(2)} ${currency || ""}`.trim();
  }
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleString();
}

/**
 * Receipt expects an "order" shaped like:
 * {
 *   id, businessId, status, createdAt, updatedAt, totalPrice, currency,
 *   data: { items?: [{ name, qty, price, total }], customer?, notes?, ... }
 * }
 */
function Receipt({ order }) {
  const data = order;
  const items = Array.isArray(data.data) ? data.data : [];

  const computedTotal = useMemo(() => {
    if (order?.totalPrice != null) return Number(order.totalPrice);
    // Try compute from items if totalPrice missing
    if (!items.length) return null;
    const sum = items.reduce((acc, it) => {
      const line =
        it?.total != null
          ? Number(it.total)
          : Number(it?.qty ?? 1) * Number(it?.price ?? 0);
      return acc + (Number.isFinite(line) ? line : 0);
    }, 0);
    return Number.isFinite(sum) ? sum : null;
  }, [order?.totalPrice, items]);


  const currency = order?.currency ?? data.currency ?? "";

  return (
    <div className={styles.receipt} aria-label="Receipt">
      <div className={styles.receiptHeader}>
        <img
          src={order?.businessLogo || null}
          alt={`${order?.businessName || "Business"} logo`}
          className={styles.logo}
        />
        <div className={styles.brand}>
          {order?.businessName || "Business"}
        </div>
        <div className={styles.subtle}>
          Adr:{data.businessAddress || "—"}
        </div>
        <div className={styles.subtle}>
          Tlf: {data.businessPhone ||  ""}
        </div>
      </div>

      <div className={styles.hr} />

      <div className={styles.metaGrid}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Order ID</span>
          <span className={styles.metaVal}>#{order?.id ?? "—"}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>{order?.businessName}</span>
          <span className={styles.metaVal}>{order?.businessId ?? "—"}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Status</span>
          <span className={`${styles.metaVal} ${styles.statusBadge} ${styles[`status${order?.status}`] || ''}`}>
            {order?.status ?? "—"}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Created</span>
          <span className={styles.metaVal}>{formatDate(order?.createdAt)}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Updated</span>
          <span className={styles.metaVal}>{formatDate(order?.updatedAt)}</span>
        </div>
      </div>

      <div className={styles.hrDashed} />

      <div className={styles.itemsHeader}>
        <span>Item</span>
        <span className={styles.right}>Qty</span>
        <span className={styles.right}>Price</span>
        <span className={styles.right}>Total</span>
      </div>

      <div className={styles.hr} />

      {items.length ? (
        <div className={styles.items}>
          {items.map((it, idx) => {
            const name = it?.title ?? `Item ${idx + 1}`;
            const qty = it?.qty ?? 1;
            const price = it?.data[0]?.price ?? null;
            const lineTotal = order?.totalPrice

            return (
              <div key={idx} className={styles.itemRow}>
                <span className={styles.itemName} title={name}>
                  {name}
                </span>
                <span className={`${styles.right} ${styles.mono}`}>
                  {qty}
                </span>
                <span className={`${styles.right} ${styles.mono}`}>
                  {price == null ? "—" : formatMoney(price, currency)}
                </span>
                <span className={`${styles.right} ${styles.mono}`}>
                  {lineTotal == null ? "—" : formatMoney(lineTotal, currency)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          No line items in <span className={styles.mono}>data.items</span>
        </div>
      )}

      <div className={styles.hrDashed} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>TOTAL</span>
        <span className={`${styles.totalValue} ${styles.mono}`}>
          {computedTotal == null
            ? "—"
            : formatMoney(computedTotal, currency)}
        </span>
      </div>

      {data.notes ? (
        <>
          <div className={styles.hr} />
          <div className={styles.notes}>
            <div className={styles.notesTitle}>Notes</div>
            <div className={styles.subtle}>{String(data.notes)}</div>
          </div>
        </>
      ) : null}

      <div className={styles.footer}>
        <div className={styles.center}>Thank you!</div>
        <div className={styles.centerSmall}>
          {data.footerText || "Keep this receipt for your records."}
        </div>
      </div>
    </div>
  );
}

export default function ReceiptModal({
  open,
  onClose,
  order,
  onSendEmail,
  autoPrint = true,
  printDurationMs = 1600,
}) {
  const [printing, setPrinting] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setPrinting(false);
      return;
    }
    console.log("ReceiptModal opened with order:", order);
    if (!autoPrint) return;

    setPrinting(true);
    const t = setTimeout(() => setPrinting(false), printDurationMs);
    return () => clearTimeout(t);
  }, [open, autoPrint, printDurationMs]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Receipt Modal"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.topBar}>
          <div className={styles.titleWrap}>
            <div className={styles.modalTitle}>Receipt</div>
            <div className={styles.orderIdBig}>#{order?.id ?? "—"}</div>
            <div className={styles.modalSub}>
              {printing ? "Printing…" : "Ready"}
            </div>
          </div>
        </div>

        <div className={styles.viewer}>
          
          <div
            className={`${styles.paperFrame} ${
              printing ? styles.printing : styles.ready
            }`}
          >
            <div className={styles.paperTop} />

            <div className={styles.paper}>
              <div className={styles.scanline} />
              <Receipt order={order} />
            </div>

            <div className={styles.paperBottom} />
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={async () => {
              setSending(true);
              await onSendEmail?.(order);
              setSending(false);
            }}
            type="button"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send to my email"}
          </button>
        </div>
      </div>
    </div>
  );
}