import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({ model, images, config }) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const viewerRef = useRef(null);

  const posterUrl = useMemo(() => images?.[0] || "", [images]);

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

  useEffect(() => {
    let mounted = true;

    setIsMobile(window.innerWidth < 768);

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
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;

    const handleLoad = () => {
      setModelLoaded(true);
    };

    viewerRef.current.addEventListener("load", handleLoad);

    return () => {
      viewerRef.current?.removeEventListener("load", handleLoad);
    };
  }, [ready]);

  if (!model) return null;

  return (
    <div className={styles.wrapper}>
      
      {/* IMAGE FIRST */}
      {!modelLoaded && posterUrl && (
        <img
          src={posterUrl}
          alt="3D preview"
          className={styles.poster}
        />
      )}

      {/* MODEL */}
      {ready && (
        <model-viewer
          ref={viewerRef}
          src="https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2Ffinal.glb_0e36412f-4b54-4cf0-a455-51a876dbd6b7.glb?alt=media&token=3494f158-8643-439e-b85f-73d1ab61d432"
          alt="3D model"
          poster={posterUrl}
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
          style={{ opacity: modelLoaded ? 1 : 0 }}
          {...(!isMobile ? { "auto-rotate": true } : {})}
        />
      )}

    </div>
  );
}