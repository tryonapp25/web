import { useEffect, useRef, useState } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({ model, images, config }) {
  const [loaded, setLoaded] = useState(false);
  const [posterUrl] = useState(
    images && images.length > 0 ? images[0] : "/icons/loading.png"
  );
  const viewerRef = useRef(null);

  // ────────────────────────────────────────────────
  // 1. Load script only once + only when needed
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setLoaded(true); // already available (e.g. loaded by another component)
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer@latest/dist/model-viewer.min.js";
    // script.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@latest/dist/model-viewer.min.js"; // alternative CDN
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => console.error("Failed to load model-viewer");

    document.head.appendChild(script);

    return () => {
      // optional: don't remove if shared across page
      // document.head.removeChild(script);
    };
  }, []);

  // Optional: detect low-end device & reduce quality
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
    // Very rough heuristic — feel free to use more precise libraries
    if (
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 4 ||
      /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)
    ) {
      setIsLowPower(true);
    }
  }, []);

  if (!loaded) {
    return (
      <div className={styles.wrapper}>
        <img src={posterUrl} alt="3D model poster" className={styles.popModel} />
        <div>Loading 3D viewer...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <model-viewer
        ref={viewerRef}
        src={model}
        alt="3D model"
        poster={posterUrl}
        camera-controls
        camera-orbit={config?.camera_orbit || "auto 10deg"}
        auto-rotate={isLowPower ? false : true}           // ← important on mobile
        autoplay={isLowPower ? false : true}
        touch-action="pan-y"
        loading="lazy"
        reveal="auto"               // or "interaction" to save even more resources
        // reveal="interaction"     // ← often best choice on mobile
        animation-loop
        environment-image="neutral"
        shadow-intensity={isLowPower ? "0.5" : "1"}
        exposure={isLowPower ? "0.8" : "1"}
        // ─── Most important mobile perf attributes ───
        power-preference="low-power"          // or "default"
        // progressive           // not needed anymore (automatic now)
        ar ar-modes="webxr scene-viewer quick-look"
        // ios-src={iosUsdzUrl}   // ← if you have pre-converted .usdz → much better iOS AR
        className={styles.popModel}
      />
    </div>
  );
}