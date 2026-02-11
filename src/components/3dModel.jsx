import { useEffect } from "react";
import styles from "../styles/Model3D.module.css";

export default function Model3D({ model, images, config }) {
  useEffect(() => {
    if (customElements.get("model-viewer")) return;

    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }, []);

  return (
    <div className={styles.wrapper}>
      <model-viewer
        //key={model}   // 🔥 forces reset when model changes
        src={model}
        alt="3D model"
        //poster="https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FFrisk_sashimi_preview.png?alt=media&token=fa67ddb4-1454-4f3c-997b-a3e99c79c670"
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
