// components/Model3D.jsx
import { useEffect, useState, useRef } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({
  model,
  images = [],
  config = {},
  allowShowModel = false,
}) {
  const [posterUrl, setPosterUrl] = useState(
    images?.[0] ?? "/icons/noImage.png"
  );
  const [isViewerReady, setIsViewerReady] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    setPosterUrl(images?.[0] ?? "/icons/noImage.png");
  }, [images]);

  useEffect(() => {
    if (!allowShowModel) return;
    if (scriptLoadedRef.current) return;

    if (customElements.get("model-viewer")) {
      setIsViewerReady(true);
      return;
    }

    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.async = true;

    script.onload = () => {
      setIsViewerReady(true);
    };

    script.onerror = (err) => {
      console.error("Failed to load model-viewer script:", err);
    };

    document.head.appendChild(script);
  }, [allowShowModel]);

  const renderAnimatedImage = (altText) => (
    <div className={styles.wrapper}>
      <img
        src={posterUrl}
        alt={altText}
        className={`${styles.image} ${styles.movingImage}`}
      />
    </div>
  );

  if (!allowShowModel) {
    return renderAnimatedImage("3D model poster");
  }

  if (!isViewerReady) {
    return renderAnimatedImage("Loading 3D model...");
  }

  return (
    <div className={styles.wrapper}>
      <model-viewer
        key={model}
        src={model}
        alt="3D product model"
        poster={posterUrl}
        camera-controls
        camera-orbit={config?.camera_orbit || "auto 75deg 80% 0deg"}
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="30deg"
        touch-action="pan-y"
        reveal="auto"
        animation-name={config?.animation_name}
        animation-crossfade-duration="0"
        animation-loop
        environment-image="neutral"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="0.9"
        style={{ backgroundColor: "transparent" }}
        className={styles.popModel}
        onError={(e) => console.error("model-viewer error:", e.detail)}
        onLoad={(e) => console.log("model-viewer model loaded:", e)}
      />
    </div>
  );
}