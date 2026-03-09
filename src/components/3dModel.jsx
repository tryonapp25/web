import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Model3D.module.css";
import React, { Suspense } from "react";
const Lottie = React.lazy(() => import("lottie-react"));
import loading from "../assets/lottiefiles/cat-Mark-loading.json";

export default function Model3D({ model, images, config, allowShowModel = true, loadDelay = 800 }) {
  const [ready, setReady] = useState(false);
  const [shouldRenderModel, setShouldRenderModel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const viewerRef = useRef(null);

  const posterUrl = useMemo(() => images?.[0] || null, [images]);

  let modelViewerScriptPromise = null;

  function loadModelViewerScript() {
    if (customElements.get("model-viewer")) {
      return Promise.resolve();
    }

    if (!modelViewerScriptPromise) {
      modelViewerScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(
          'script[data-model-viewer="true"]'
        );

        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", reject, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.type = "module";
        script.src =
          "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
        script.setAttribute("data-model-viewer", "true");

        script.onload = () => resolve();
        script.onerror = reject;

        document.head.appendChild(script);
      });
    }

    return modelViewerScriptPromise;
  }

  function loadingModal() {
    return (
      <Suspense fallback={<div style={{width:24,height:24}}/>}>
        <Lottie 
          animationData={loading}
          loop={true}
          autoplay={true}
          style={{width:"100%", height:"100%"}}
        />
      </Suspense>
    );
  }

  useEffect(() => {
    let mounted = true;
    if (!allowShowModel) return;

    setIsMobile(window.innerWidth < 768); // Adjust breakpoint if needed

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
  }, [allowShowModel]);

  useEffect(() => {
    if (!ready) return;

    if (!isMobile) {
      setShouldRenderModel(true);
      return;
    }

    const timer = setTimeout(() => {
      setShouldRenderModel(true);
    }, loadDelay);

    return () => clearTimeout(timer);
  }, [ready, isMobile, loadDelay]);

  useEffect(() => {
    if (!viewerRef.current) return;

    const handleLoad = () => {
      setModelLoaded(true);
    };

    viewerRef.current.addEventListener("load", handleLoad);

    return () => {
      viewerRef.current?.removeEventListener("load", handleLoad);
    };
  }, [shouldRenderModel]); // Run when model is rendered

  if (!model) return null;

  return (
    <div className={styles.wrapper}>
      {/* IMAGE FIRST */}
      {!modelLoaded && posterUrl !== null && (
        <img
          src={posterUrl}
          alt="3D preview"
          className={styles.poster}
        />
      )}
      {posterUrl === null && !modelLoaded &&
        loadingModal()
      }

      {/* MODEL */}
      {ready && shouldRenderModel && (
        <model-viewer
          ref={viewerRef}
          src={model}
          alt="3D model"
          poster={posterUrl || ""}
          camera-controls
          touch-action="pan-y"
          loading="lazy" // Changed to lazy for deferred loading
          reveal="auto"
          interaction-prompt="auto"
          environment-image="neutral"
          shadow-intensity={isMobile ? "0" : "0.7"} // Disable shadows on mobile
          exposure="1"
          camera-orbit={config?.camera_orbit || "0deg 75deg auto"}
          disable-pan
          className={styles.popModel}
          style={{ opacity: modelLoaded ? 1 : 0 }}
          {...(!isMobile ? { "auto-rotate": true } : {})}
          minimum-render-scale={isMobile ? "0.5" : "1"} // Lower resolution on mobile
          power-preference={isMobile ? "low-power" : "high-performance"} // Save battery/GPU on mobile
        />
      )}
    </div>
  );
}