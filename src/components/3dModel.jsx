import { useEffect } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({ model, images, config, onClick }) {
  useEffect(() => {
    if (customElements.get("model-viewer")) return;

    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }, []);

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <model-viewer
        //key={model}   // 🔥 forces reset when model changes
        src={model}
        alt="3D model"
        //poster=""
        camera-controls
        camera-orbit={config?.camera_orbit || "auto 10deg"} // x y z (in meters, model space)
        auto-rotate
        touch-action="pan-y"
        autoplay
        loading="eager"
        reveal="auto"
        animation-loop
        environment-image="neutral"
        shadow-intensity="1"
        exposure="1"
        className={styles.popModel}
      />
    </div>
  );
}
