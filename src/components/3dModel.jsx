// src/components/Model3D.jsx
import { useEffect, useState } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({ model, images, config = {}, allowShowModel = false }) {
  const [posterUrl] = useState(
    images && images.length > 0 ? images[0] : "/fallback-poster.jpg"
  );

  if(!allowShowModel) return;

  useEffect(() => {
    // Load model-viewer script only once
    if (customElements.get("model-viewer")) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    // Optional: integrity + crossorigin for better security/performance
    // script.integrity = "..."; // get from unpkg if you want SRI
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Optional cleanup (rarely needed)
      document.head.removeChild(script);
    };
  }, []);

  // Recommended settings for natural-looking product viewer
  const viewerProps = {
    src: model,
    alt: "3D product model",
    poster: posterUrl,
    "camera-controls": true,
    "camera-orbit": config.cameraOrbit || "45deg 75deg 105% 0m", // nice angled start + distance
    "auto-rotate": true,
    "auto-rotate-delay": "3000",         // wait 3s before rotating (less annoying)
    "rotation-per-second": "30deg",      // smooth & not too fast
    "shadow-intensity": "1.2",           // soft shadows under model
    "shadow-softness": "0.8",            // 0 = hard, 1 = very soft
    exposure: "1.1",                     // slightly brighter than default (avoids dullness)
    "environment-image": "https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.jpg", // warm & soft – very popular for products
    // Alternative good ones (copy-paste to test):
    // "https://modelviewer.dev/shared-assets/environments/peppermint_powerplant_1k.hdr"
    // "https://modelviewer.dev/shared-assets/environments/whipple_creek_regional_park_1k.hdr"
    // or "neutral" (fallback if you want minimal)
    "skybox-image": "",                  // leave empty → no visible background (transparent)
    "background-color": "#f8f9fa00",     // fully transparent if you want page bg to show
    "touch-action": "pan-y",
    loading: "lazy",
    reveal: "auto",
    "animation-name": config.animation || "", // optional: specific animation
    "ar": true,                          // enable Quick Look / AR if model supports
    "ar-modes": "webxr scene-viewer quick-look",
    className: styles.popModel,
  };

  return (
    <div className={styles.wrapper}>
      <model-viewer {...viewerProps} />
    </div>
  );
}