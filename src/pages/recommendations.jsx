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

function ProductCard({ item }) {
  // Your backend sends wrapper: { type: "...", item: {...product...} }
  // Support both wrapper and direct product shape:
  const itemObj = item?.item ?? item;

  const type = getSafeString(item?.type);

  const title = getSafeString(itemObj?.title) || "Untitled product";
  const priceText = getSafeString(itemObj?.price);
  const extractedPrice = getSafeNumber(itemObj?.extracted_price);
  const link = getSafeString(itemObj?.product_link);

  const images = useMemo(() => getSafeImages(itemObj), [itemObj]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Keep index valid if images change
  const safeActiveIdx =
    images.length > 0 ? Math.min(activeIdx, images.length - 1) : 0;

  useEffect(() => {
    // reset index when product changes / images change
    setActiveIdx(0);
  }, [itemObj]);

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
        {/* Optional: show type if you have a badge style */}
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
        </div>
      </div>
    </article>
  );
}


function OutfitSection({ index, outfit, onsubmit }) {
  const outfitNumber = index + 1;
  const items = Array.isArray(outfit) ? outfit : [];

  return (
    <section className={styles.outfitSection}>
      <div className={styles.outfitHeader}>
        <h2 className={styles.outfitTitle}>Outfit {outfitNumber}</h2>
        <span className={styles.outfitMeta}>{items.length} items</span>
      </div>

      <div className={styles.grid}>
        {items.map((wrappedItem, i) => (
          <ProductCard
            key={`${outfitNumber}-${i}`}
            item={wrappedItem} // pass wrapper (has type + item)
          />
        ))}
      </div>

      <div className={styles.tryonRow}>
        <button
          className={styles.tryonButton}
          onClick={() => onsubmit(outfit)}
        >
          Try on outfit
        </button>
      </div>
    </section>
  );
}

export default function Recommendations() {
  const {publicUser} = useContext(UserContext);
  const { state } = useLocation();
  const [query, setQuery] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [openSelectPose, setOpenSelectPoses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // recommendations shape: [ [ {type, item}, {type, item}, ... ], [ ... ], ... ]
  const [finalResults] = useState(state?.recommendations || []);
  const [usage] = useState(state?.usage || {});

  useEffect(() => {
    console.log("recommendations:", state?.recommendations);
    console.log("usage:", state?.usage);
  }, [state]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return finalResults;

    return finalResults
      .map((outfit) =>
        (Array.isArray(outfit) ? outfit : []).filter((wrapped) => {
          const itemObj = wrapped?.item ?? wrapped;
          const title = getSafeString(itemObj?.title).toLowerCase();
          const price = getSafeString(itemObj?.price).toLowerCase();
          const type = getSafeString(wrapped?.type).toLowerCase();
          return title.includes(q) || price.includes(q) || type.includes(q);
        })
      )
      .filter((outfit) => outfit.length > 0);
  }, [finalResults, query]);


  
const handleTryOnOutfit = async (pose) => {
  console.log("Try on outfit:", selectedOutfit);
  const body = [];
  for (const item of selectedOutfit) {
    const url = item?.item?.thumbnail;
    const type = item?.type;
    body.push({type: type, url: url});
  }
  setOpenSelectPoses(false);
  await sendOutFit(body, pose?.selectedPose);
};

const sendOutFit = async (data, pose) => {
  try{
    setLoading(true)
    const res = await http.post(`/generate-tryOn/full-outfit`, {user: publicUser, outfit: data, pose: pose});
    if(res.data.success){
      setResult(res.data.data.url);
    }
  }
  catch(err){
    alert(err)
  }
  finally{
    setLoading(false);
  }
}


  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>Recommended Outfits</h1>
          <p className={styles.sub}>Browse outfits and open a product in a new tab.</p>
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
        {filtered.length === 0 ? (
          <div className={styles.empty}>No results. Try a different search.</div>
        ) : (
          filtered.map((outfit, idx) => (
            <OutfitSection key={idx} index={idx} outfit={outfit} onsubmit={(d) => {setSelectedOutfit(d), setOpenSelectPoses(true)}}/>
          ))
        )}
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerNote}>
          Prices and availability may change.
        </span>
      </footer>
      <ChoosePoses poses={publicUser?.poses} isOpen={openSelectPose} onClose={()=> setOpenSelectPoses(false)} generate={(p) => handleTryOnOutfit(p)}/>
      <StyleLoading visible={loading}/>
      <PreviewImage isOpen={!result ? false : true} initialUrl={result} onClose={()=> setResult(null)}/>
    </div>
  );
}
