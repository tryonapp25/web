// Model3D.jsx  — improved version
import React,{ useEffect, useMemo, useRef, useState, Suspense } from "react";
import styles from "../styles/Model3D.module.css";
const Lottie = React.lazy(() => import("lottie-react"));
import loading from "../assets/lottiefiles/cat-Mark-loading.json";

export default function Model3D({
  model,
  images,
  config,
  allowShowModel = false,
}) {
  const [ready, setReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  const posterUrl = useMemo(() => images?.[0] || null, [images]);

  // Load script only once
  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.onload = () => setReady(true);
    script.onerror = (err) => console.error("model-viewer load failed", err);
    document.head.appendChild(script);

    return () => {
      // Optional: don't remove script — it's shared
    };
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  // Track load
  useEffect(() => {
    if (!viewerRef.current) return;

    const onLoad = () => setModelLoaded(true);
    viewerRef.current.addEventListener("load", onLoad);
    viewerRef.current.addEventListener("error", () => console.error("model-viewer error"));

    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener("load", onLoad);
      }
      setModelLoaded(false); // reset for next mount
    };
  }, [ready, model]); // re-attach when model changes

  if (!allowShowModel || !model || !ready) {
    return null; // or fallback image / nothing
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* Poster while loading */}
      {!modelLoaded && posterUrl && (
        <img src={posterUrl} alt="3D preview" className={styles.popModel} />
      )}
      {!modelLoaded && !posterUrl && (
        <img src="/logos/logo.png" alt="Placeholder" className={styles.popModel} />
      )}

      {/* Loading animation */}
      {!modelLoaded && (
        <Suspense fallback={null}>
          <Lottie
            animationData={loading}
            loop
            autoplay
            className={styles.popModel}
          />
        </Suspense>
      )}

      {/* model-viewer — key forces remount on model change */}
      <model-viewer
        key={`mv-${model}`} // ← critical: forces full destroy + recreate
        ref={viewerRef}
        src={model}
        alt="3D model"
        poster={posterUrl || ""}
        camera-controls
        touch-action="pan-y"
        loading="eager"
        reveal="auto"
        interaction-prompt="auto"
        environment-image="neutral"
        shadow-intensity="0.7"
        exposure="1"
        camera-orbit={config?.camera_orbit || "0deg 75deg auto"}
        disable-pan
        className={styles.popModel}
        style={{
          visibility: modelLoaded ? "visible" : "hidden", // better than opacity=0
          width: "100%",
          height: "100%",
        }}
        auto-rotate={!isMobile}
      />
    </div>
  );
}