// Model3D.jsx — improved cleanup attempt
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import styles from "../styles/Model3D.module.css";
const Lottie = React.lazy(() => import("lottie-react"));
import loading from "../assets/lottiefiles/cat-Mark-loading.json";

export default function Model3D({ model, images, config, allowShowModel = false }) {
  const [ready, setReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewerRef = useRef(null);

  const posterUrl = useMemo(() => images?.[0] || null, [images]);

  // Load script once
  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.onload = () => setReady(true);
    script.onerror = (err) => console.error("Failed to load model-viewer", err);
    document.head.appendChild(script);

    // Optional: preload models if same ones repeat often
    // model-viewer supports <model-viewer preload src="..."> but needs separate elements
  }, []);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) || window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;

    const onLoad = () => setModelLoaded(true);
    const onError = (e) => console.error("model-viewer error", e);

    viewerRef.current.addEventListener("load", onLoad);
    viewerRef.current.addEventListener("error", onError);

    return () => {
      viewerRef.current?.removeEventListener("load", onLoad);
      viewerRef.current?.removeEventListener("error", onError);
      setModelLoaded(false);
    };
  }, [model]); // Re-attach on model change

  if (!allowShowModel || !model || !ready) return null;

  return (
    <div className={styles.wrapper}>
      {/* Poster / fallback */}
      {!modelLoaded && posterUrl && (
        <img src={posterUrl} alt="3D preview" className={styles.poster} />
      )}
      {!modelLoaded && !posterUrl && (
        <img src="/logos/logo.png" alt="Placeholder" className={styles.poster} />
      )}

      {/* Loading spinner */}
      {!modelLoaded && (
        <Suspense fallback={null}>
          <Lottie animationData={loading} loop autoplay className={styles.popModel} />
        </Suspense>
      )}

      {/* Critical: key forces full destroy + recreate */}
      {ready && (
        <model-viewer
          key={`modelviewer-${model}`} // ← forces browser to kill old instance
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
            visibility: modelLoaded ? "visible" : "hidden", // better than opacity=0 for resource release
            width: "100%",
            height: "100%",
          }}
          auto-rotate={!isMobile}
        />
      )}
    </div>
  );
}