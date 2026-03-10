// components/Model3D.jsx
import { useEffect, useState, useRef } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({
  model,                    // string: URL to .glb / .gltf file
  images = [],              // array of poster image URLs
  config = {},              // optional camera & other settings
  allowShowModel = false,   // boolean: whether to attempt showing 3D viewer
}) {
  const [posterUrl, setPosterUrl] = useState(
    images?.[0] ?? "/logos/logo.png"
  );
  const [isViewerReady, setIsViewerReady] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Update poster when images prop changes
  useEffect(() => {
    setPosterUrl(images?.[0] ?? "/logos/logo.png");
  }, [images]);

  // Load <model-viewer> web component script (only once)
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    if (customElements.get("model-viewer")) {
      setIsViewerReady(true);
      return;
    }

    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.async = true;

    script.onload = () => {
      console.log("model-viewer script loaded");
      setIsViewerReady(true);
    };

    script.onerror = (err) => {
      console.error("Failed to load model-viewer script:", err);
    };

    document.head.appendChild(script);

    // Optional: also load legacy support (for very old browsers)
    // const legacy = document.createElement("script");
    // legacy.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js";
    // document.head.appendChild(legacy);
  }, []);

  // If we shouldn't show 3D → just show poster image
  if (!allowShowModel) {
    return (
      <div className={styles.wrapper}>
        <img
          src={posterUrl}
          alt="3D model poster"
          className={styles.popModel}
        />
      </div>
    );
  }

  // Script not loaded yet → show poster as loading state
  if (!isViewerReady) {
    return (
      <div className={styles.wrapper}>
        <img
          src={posterUrl}
          alt="Loading 3D model..."
          className={styles.popModel}
        />
      </div>
    );
  }

  // Script is loaded → render <model-viewer>
  return (
    <div className={styles.wrapper}>
      <model-viewer
        // Use src + poster as part of key → helps React re-create when model changes
        key={`${model}-${posterUrl}`}

        src={model}
        alt="3D product model"
        poster={posterUrl}

        camera-controls
        camera-orbit={config?.camera_orbit || "auto 75deg 80% 0deg"}
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="30deg"

        touch-action="pan-y"
        // loading="lazy"         // can delay model download — remove if you want eager loading
        reveal="auto"
        animation-name={config?.animation_name} // optional
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
      >
      </model-viewer>
    </div>
  );
}