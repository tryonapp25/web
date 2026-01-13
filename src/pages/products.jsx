import React, { useEffect, useMemo, useState, useContext } from "react";
import styles from "../styles/Recommendations.module.css";
import { useLocation } from "react-router-dom";
import http from "../http/http";
import { UserContext } from "../ApiContext/userContext";
import ChoosePoses from "../components/choosePoses";
import StyleLoading from "../components/styleLoading";
import PreviewImage from "../components/previewImage";

function getSafeString(v) {
  return typeof v === "string" ? v : "";
}

function getSafeNumber(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Safely get an array of image URLs (supports both google thumbs + serpapi thumbs)
function getSafeImages(itemObj) {
  const thumbs = itemObj?.thumbnails || itemObj?.serpapi_thumbnails;

  if (Array.isArray(thumbs)) {
    const cleaned = thumbs
      .filter((x) => typeof x === "string")
      .map((x) => x.trim())
      .filter(Boolean);

    if (cleaned.length) return cleaned;
  }

  const fallback =
    getSafeString(itemObj?.thumbnail).trim() ||
    getSafeString(itemObj?.serpapi_thumbnail).trim();

  return fallback ? [fallback] : [];
}

function ProductCard({ item, onSelect, selected }) {
  // Support both wrapper and direct product shape:
  const itemObj = item?.item ?? item;

  const type = getSafeString(item?.type);

  const title = getSafeString(itemObj?.title) || "Untitled product";
  const priceText = getSafeString(itemObj?.price);
  const extractedPrice = getSafeNumber(itemObj?.extracted_price);
  const link = getSafeString(itemObj?.product_link);

  const images = useMemo(() => getSafeImages(itemObj), [itemObj]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [itemObj]);

  const safeActiveIdx =
    images.length > 0 ? Math.min(activeIdx, images.length - 1) : 0;

  const activeImg = images[safeActiveIdx] || "";
  const canNav = images.length > 1;

  const goPrev = () => {
    if (!canNav) return;
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!canNav) return;
    setActiveIdx((i) => (i + 1) % images.length);
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        {activeImg ? (
          <>
            <img
              className={styles.thumb}
              src={activeImg}
              alt={title}
              loading="lazy"
            />

            {canNav && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navPrev}`}
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navNext}`}
                  onClick={goNext}
                  aria-label="Next image"
                >
                  ›
                </button>

                <div className={styles.dots} role="tablist" aria-label="Images">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.dot} ${
                        idx === safeActiveIdx ? styles.dotActive : ""
                      }`}
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`Show image ${idx + 1} of ${images.length}`}
                      aria-selected={idx === safeActiveIdx}
                      role="tab"
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={styles.thumbPlaceholder}>No image</div>
        )}
      </div>

      <div className={styles.cardBody}>
        {type ? <div className={styles.badge}>{type}</div> : null}

        <h3 className={styles.cardTitle} title={title}>
          {title}
        </h3>

        <div className={styles.priceRow}>
          {priceText ? (
            <span className={styles.price}>{priceText}</span>
          ) : extractedPrice != null ? (
            <span className={styles.price}>{extractedPrice} kr.</span>
          ) : (
            <span className={styles.priceMuted}>Price unavailable</span>
          )}
        </div>

        <div className={styles.actions}>
          {link ? (
            <a
              className={styles.button}
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              View product
            </a>
          ) : (
            <span className={styles.buttonDisabled}>No link</span>
          )}

          {/* Optional select button (for Try-on flow) */}
          {typeof onSelect === "function" ? (
            <button
              type="button"
              className={selected ? styles.buttonDisabled : styles.button}
              onClick={onSelect}
            >
              {selected ? "Selected" : "Select"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Products() {
  const { publicUser } = useContext(UserContext);
  const { state } = useLocation();

  const [query, setQuery] = useState("");

  // Expect a FLAT array of ShoppingResult or wrapped items
  // Prefer state.products, fallback to state.recommendations if that's what you already send
  const [products] = useState(() => {
    const arr = state?.products ?? state?.recommendations ?? [];
    return Array.isArray(arr) ? arr : [];
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openSelectPose, setOpenSelectPoses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    console.log("products:", products);
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((wrapped) => {
      const itemObj = wrapped?.item ?? wrapped;
      const title = getSafeString(itemObj?.title).toLowerCase();
      const price = getSafeString(itemObj?.price).toLowerCase();
      const type = getSafeString(wrapped?.type).toLowerCase();
      return title.includes(q) || price.includes(q) || type.includes(q);
    });
  }, [products, query]);

  const toggleSelect = (item) => {
    setSelectedProducts((prev) => {
      const key = (x) => (x?.item ?? x)?.product_link || (x?.item ?? x)?.title;
      const k = key(item);
      if (!k) return prev;

      const exists = prev.some((p) => key(p) === k);
      if (exists) return prev.filter((p) => key(p) !== k);
      return [...prev, item];
    });
  };

  const handleTryOnSelected = () => {
    if (!selectedProducts.length) return;
    setOpenSelectPoses(true);
  };

  const handleTryOn = async (pose) => {
    // Your old API expects {type, url}[]
    // Map selected product(s) into that structure.
    const outfit = selectedProducts.map((wrapped) => {
      const itemObj = wrapped?.item ?? wrapped;
      return {
        type: getSafeString(wrapped?.type) || "product",
        url: getSafeString(itemObj?.thumbnail) || getSafeImages(itemObj)[0] || "",
      };
    });

    setOpenSelectPoses(false);
    await sendOutFit(outfit, pose?.selectedPose);
  };

  const sendOutFit = async (data, pose) => {
    try {
      setLoading(true);
      const res = await http.post(`/generate-tryOn/full-outfit`, {
        user: publicUser,
        outfit: data,
        pose: pose,
      });
      if (res.data.success) {
        setResult(res.data.data.url);
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          {/* ✅ Page name changed */}
          <h1 className={styles.h1}>Products Search</h1>
          <p className={styles.sub}>
            Browse products and open a product in a new tab.
          </p>
        </div>

        <div className={styles.searchWrap}>
          <input
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, type, or price…"
            aria-label="Search products"
          />
        </div>
      </header>

      <main className={styles.main}>
        {/* Optional action row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            className={styles.tryonButton}
            disabled={!selectedProducts.length}
            onClick={handleTryOnSelected}
          >
            Try on selected ({selectedProducts.length})
          </button>

          <button
            className={styles.tryonButton}
            disabled={!selectedProducts.length}
            onClick={() => setSelectedProducts([])}
          >
            Clear selection
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No results. Try a different search.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, idx) => {
              const keyObj = item?.item ?? item;
              const key = keyObj?.product_link || `${keyObj?.title}-${idx}`;

              const isSelected = selectedProducts.some((p) => {
                const a = (p?.item ?? p)?.product_link || (p?.item ?? p)?.title;
                const b = keyObj?.product_link || keyObj?.title;
                return a && b && a === b;
              });

              return (
                <ProductCard
                  key={key}
                  item={item}
                  selected={isSelected}
                  onSelect={() => toggleSelect(item)}
                />
              );
            })}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerNote}>Prices and availability may change.</span>
      </footer>

      <ChoosePoses
        poses={publicUser?.poses}
        isOpen={openSelectPose}
        onClose={() => setOpenSelectPoses(false)}
        generate={(p) => handleTryOn(p)}
      />
      <StyleLoading visible={loading} />
      <PreviewImage
        isOpen={!!result}
        initialUrl={result}
        onClose={() => setResult(null)}
      />
    </div>
  );
}
