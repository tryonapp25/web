import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Model3D.module.css";

let modelViewerScriptPromise = null;

function loadModelViewerScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("model-viewer")) return Promise.resolve();

  if (!modelViewerScriptPromise) {
    modelViewerScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-model-viewer="true"]'
      );

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      script.setAttribute("data-model-viewer", "true");
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return modelViewerScriptPromise;
}

export default function Model3D({ model, images, config }) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [shouldLoadModel, setShouldLoadModel] = useState(false);
  const viewerRef = useRef(null);

  const posterUrl = useMemo(() => images?.[0] || "", [images]);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Desktop can load sooner, mobile waits for tap
    if (!mobile) {
      setShouldLoadModel(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoadModel) return;

    let mounted = true;

    loadModelViewerScript()
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err) => {
        console.error("Failed to load model-viewer:", err);
      });

    return () => {
      mounted = false;
    };
  }, [shouldLoadModel]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const handleLoad = () => setModelLoaded(true);
    el.addEventListener("load", handleLoad);

    return () => {
      el.removeEventListener("load", handleLoad);
    };
  }, [ready]);

  // Optional: free memory when component goes off-screen / unmounts
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.src = "";
      }
    };
  }, []);

  if (!model) return null;

  return (
    <div className={styles.wrapper}>
      {/* Poster / click-to-load on mobile */}
      {!shouldLoadModel && posterUrl && (
        <button
          type="button"
          className={styles.posterButton}
          onClick={() => setShouldLoadModel(true)}
        >
          <img
            src={posterUrl}
            alt="3D preview"
            className={styles.poster}
            loading="lazy"
          />
          <span className={styles.play3d}>View 3D</span>
        </button>
      )}

      {/* Keep poster visible until model is actually loaded */}
      {shouldLoadModel && !modelLoaded && posterUrl && (
        <img
          src={posterUrl}
          alt="3D preview"
          className={styles.poster}
          loading="lazy"
        />
      )}

      {ready && shouldLoadModel && (
        <model-viewer
          ref={viewerRef}
          src={model}
          alt="3D model"
          poster={posterUrl}
          camera-controls
          touch-action="pan-y"
          loading={isMobile ? "lazy" : "auto"}
          reveal={isMobile ? "interaction" : "auto"}
          interaction-prompt="none"
          environment-image="neutral"
          shadow-intensity="0.5"
          exposure="1"
          disable-pan
          camera-orbit={config?.camera_orbit || "0deg 75deg auto"}
          className={styles.popModel}
          style={{ opacity: modelLoaded ? 1 : 0 }}
          {...(!isMobile ? { "auto-rotate": true } : {})}
        />
      )}
    </div>
  );
}