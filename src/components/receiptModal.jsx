import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/ReceiptModal.module.css";
import formatDate from "../utils/formatTime";

function formatMoney(amount, currency = "USD") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || ""}`.trim();
  }
}



function normalizeItems(order) {
  const possibleItems =
    order?.data?.items ??
    order?.items ??
    (Array.isArray(order?.data) ? order.data : []);

  if (!Array.isArray(possibleItems)) return [];

  return possibleItems.map((item, index) => {
    const qty = Number(item?.qty ?? item?.quantity ?? 1);
    const price = Number(item?.price ?? item?.data?.[0]?.price ?? 0);
    const total =
      item?.total != null
        ? Number(item.total)
        : Number.isFinite(qty) && Number.isFinite(price)
        ? qty * price
        : null;

    return {
      id: item?.id ?? `${index}-${item?.name ?? item?.title ?? "item"}`,
      name: item?.name ?? item?.title ?? `Item ${index + 1}`,
      qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
      price: Number.isFinite(price) ? price : null,
      total: Number.isFinite(total) ? total : null,
    };
  });
}

function Receipt({ order }) {
  const items = useMemo(() => normalizeItems(order), [order]);
  const currency = order?.currency ?? order?.data?.currency ?? "USD";

  const computedTotal = useMemo(() => {
    if (order?.totalPrice != null && Number.isFinite(Number(order.totalPrice))) {
      return Number(order.totalPrice);
    }

    if (!items.length) return null;

    const sum = items.reduce((acc, item) => acc + (item.total ?? 0), 0);
    return Number.isFinite(sum) ? sum : null;
  }, [order?.totalPrice, items]);

  const businessName = order?.businessName ?? "Business";
  const businessAddress = order?.businessAddress ?? order?.data?.businessAddress ?? "—";
  const businessPhone = order?.businessPhone ?? order?.data?.businessPhone ?? "—";
  const footerText =
    order?.footerText ??
    order?.data?.footerText ??
    "Keep this receipt for your records.";
  const notes = order?.notes ?? order?.data?.notes ?? "";
  const status = String(order?.status ?? "—").toUpperCase();

  return (
    <div className={styles.receipt} aria-label="Receipt">
      <header className={styles.receiptHeader}>
        <img
          src={order.businessLogo ?? "/logos/logo.png"}
          alt={`${businessName} logo`}
          className={styles.logo}
        />

        <div className={styles.brand}>{businessName}</div>
        <div className={styles.subtle}>ADR: {businessAddress}</div>
        <div className={styles.subtle}>TEL: {businessPhone}</div>
      </header>

      <div className={styles.hr} />

      <section className={styles.metaGrid}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>ORDER</span>
          <span className={`${styles.metaVal} ${styles.mono}`}>
            #{order?.id ?? "—"}
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaKey}>BUSINESS ID</span>
          <span className={`${styles.metaVal} ${styles.mono}`}>
            {order?.businessId ?? "—"}
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaKey}>STATUS</span>
          <span
            className={`${styles.metaVal} ${styles.statusBadge} ${
              styles[`status${status}`] || styles.statusDefault
            }`}
          >
            {status}
          </span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaKey}>CREATED</span>
          <span className={styles.metaVal}>{formatDate(order?.createdAt)}</span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaKey}>UPDATED</span>
          <span className={styles.metaVal}>{formatDate(order?.updatedAt)}</span>
        </div>
      </section>

      <div className={styles.hrDashed} />

      <section>
        <div className={styles.itemsHeader}>
          <span>ITEM</span>
          <span className={styles.right}>QTY</span>
          <span className={styles.right}>PRICE</span>
          <span className={styles.right}>TOTAL</span>
        </div>

        <div className={styles.hr} />

        {items.length ? (
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <span className={styles.itemName} title={item.name}>
                  {item.name}
                </span>

                <span className={`${styles.right} ${styles.mono}`}>
                  {item.qty}x
                </span>

                <span className={`${styles.right} ${styles.mono}`}>
                  {item.price == null ? "—" : formatMoney(item.price, currency)}
                </span>

                <span className={`${styles.right} ${styles.mono}`}>
                  {item.total == null ? "—" : formatMoney(item.total, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No line items available</div>
        )}
      </section>

      <div className={styles.hrDashed} />

      <section className={styles.metaGrid}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>PaymentId</span>
          <span className={styles.metaVal}>{order?.paymentIntentId || "—"}</span>
        </div>
      </section>

      <div className={styles.hrDashed} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>TOTAL</span>
        <span className={`${styles.totalValue} ${styles.mono}`}>
          {computedTotal == null ? "—" : formatMoney(computedTotal, currency)}
        </span>
      </div>

      {notes ? (
        <>
          <div className={styles.hr} />
          <section className={styles.notes}>
            <div className={styles.notesTitle}>NOTES</div>
            <div className={styles.subtle}>{String(notes)}</div>
          </section>
        </>
      ) : null}

      <footer className={styles.footer}>
        <div className={styles.center}>THANK YOU!</div>
        <div className={styles.centerSmall}>{footerText}</div>
      </footer>
    </div>
  );
}

export default function ReceiptModal({
  open,
  order,
  autoPrint = true,
  printDurationMs = 1400,
  onSendTomail,
}) {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPrinting(false);
      return;
    }

    if (!autoPrint) {
      setPrinting(false);
      return;
    }

    setPrinting(true);
    const timer = window.setTimeout(() => {
      setPrinting(false);
    }, printDurationMs);

    return () => window.clearTimeout(timer);
  }, [open, autoPrint, printDurationMs]);

 

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Receipt Modal"
    >
      <div className={styles.modal}>
        <div className={styles.topBar}>
          <div className={styles.titleWrap}>
            <div className={styles.modalTitle}>Receipt</div>
            <div className={styles.orderIdBig}>#{order?.id ?? "—"}</div>
            <div className={styles.modalSub}>
              {printing ? "Printing…" : "Receipt details and summary."}
            </div>
          </div>

          {/* <button
            type="button"
            className={styles.btnGhost}
            onClick={onSendTomail}
            aria-label="Close receipt modal"
          >
            Send to mail
          </button> */}
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
      </div>
    </div>
  );
}