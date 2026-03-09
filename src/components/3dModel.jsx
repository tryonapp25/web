import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Model3D.module.css";

let modelViewerScriptPromise = null;

function loadModelViewerScript() {
  if (customElements.get("model-viewer")) {
    return Promise.resolve();
  }

  if (!modelViewerScriptPromise) {
    modelViewerScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-model-viewer="true"]');

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
      script.onerror = (err) => reject(err);

      document.head.appendChild(script);
    });
  }

  return modelViewerScriptPromise;
}

export default function Model3D({ model, images, config }) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const posterUrl = useMemo(() => images?.[0] || "", [images]);

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

  if (!model) return null;

  return (
    <div className={styles.wrapper}>
      {ready ? (
        <model-viewer
          src={model}
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
          {...(!isMobile ? { "auto-rotate": true } : {})}
        />
      ) : (
        <div className={styles.posterWrap}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt="3D preview"
              className={styles.popModel}
              loading="lazy"
            />
          ) : (
            <div className={styles.loadingBox}>Loading 3D...</div>
          )}
        </div>
      )}
    </div>
  );
}