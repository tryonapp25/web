// src/components/3dModel.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import styles from "../styles/Model3D.module.css";

// Reliable mobile detection
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.matchMedia("(pointer:coarse)").matches;

function LoadingFallback({ posterUrl }) {
  return (
    <img
      src={posterUrl}
      alt="3D preview"
      className={styles.popModel}
      loading="lazy"
    />
  );
}

export default function Model3D({
  model,
  images,
  config = {},
  allowShowModel = false,
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const posterUrl = images?.[0] || "/logos/logo.png";

  const rendererSettings = useMemo(
    () => ({
      antialias: !isMobile,
      powerPreference: "low-power",
      alpha: true,                    // Required for transparent background
    }),
    []
  );

  const pixelRatio = useMemo(
    () => (isMobile ? Math.min(window.devicePixelRatio, 1.2) : Math.min(window.devicePixelRatio, 1.5)),
    []
  );

  useEffect(() => {
    if (!allowShowModel || !model || !containerRef.current) return;

    let renderer = null;
    let scene = null;
    let camera = null;
    let controls = null;
    let animationFrameId = null;
    let currentModel = null;
    let envTexture = null;
    let needsRender = true;

    try {
      const container = containerRef.current;

      // ─── Scene ────────────────────────────────────────
      scene = new THREE.Scene();
      // IMPORTANT: Do NOT set scene.background → keeps it transparent

      // ─── Camera ───────────────────────────────────────
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        200
      );
      camera.position.set(0, 1.2, 5.5);

      // ─── Renderer ─────────────────────────────────────
      renderer = new THREE.WebGLRenderer({
        ...rendererSettings,
        canvas: document.createElement("canvas"),
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);           // Transparent clear color
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      renderer.toneMapping = isMobile ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = isMobile ? 1.0 : 0.9;
      renderer.shadowMap.enabled = false;

      container.appendChild(renderer.domElement);

      // ─── Environment ──────────────────────────────────
      console.time("hdr-load");
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr",
        (texture) => {
          console.timeEnd("hdr-load");
          texture.mapping = THREE.EquirectangularReflectionMapping;
          envTexture = texture;
          scene.environment = texture;
          scene.environmentIntensity = isMobile ? 0.45 : 0.65;
          needsRender = true;
        },
        undefined,
        () => {
          console.warn("HDR failed → using fallback lights");
          scene.add(new THREE.AmbientLight(0xffffff, isMobile ? 1.1 : 0.9));
          const dir = new THREE.DirectionalLight(0xffffff, isMobile ? 1.4 : 1.8);
          dir.position.set(4, 6, 5);
          scene.add(dir);
          needsRender = true;
        }
      );

      // ─── Controls ─────────────────────────────────────
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = !isMobile;
      controls.autoRotateSpeed = 0.7;
      controls.minDistance = 2.2;
      controls.maxDistance = 9;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.8;

      // ─── Model Loading with timing ────────────────────
      console.time("full-model-load");

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      const loader = new GLTFLoader().setDRACOLoader(dracoLoader);

      loader.load(
        model,
        (gltf) => {
          console.timeEnd("full-model-load");

          currentModel = gltf.scene;
          currentModel.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = true;

            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (!mat) return;
              if ("envMapIntensity" in mat) mat.envMapIntensity = isMobile ? 0.4 : 0.6;
              if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0, 0.38);
              if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0, 0.65);
              mat.needsUpdate = true;
            });
          });

          // Center & scale
          const box = new THREE.Box3().setFromObject(currentModel);
          const center = box.getCenter(new THREE.Vector3());
          currentModel.position.sub(center);

          const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray());
          const scale = 3.2 / maxDim;
          currentModel.scale.setScalar(scale);

          const scaledBox = new THREE.Box3().setFromObject(currentModel);
          const scaledSize = scaledBox.getSize(new THREE.Vector3());
          currentModel.position.y += scaledSize.y * 0.08;

          scene.add(currentModel);

          controls.target.set(0, scaledSize.y * 0.12, 0);
          controls.update();

          setLoaded(true);
          needsRender = true;
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            setProgress(percent);
            console.log(`Model download: ${percent}%`);
          }
        },
        (err) => {
          console.timeEnd("full-model-load");
          console.error("Model load failed:", err);
          setError("Failed to load 3D model");
        }
      );

      // ─── On-demand rendering ──────────────────────────
      const render = () => {
        if (!renderer || !scene || !camera) return;
        controls.update();
        renderer.render(scene, camera);
        needsRender = false;
      };

      const animate = () => {
        if (needsRender || (controls.enabled && controls.autoRotate)) {
          render();
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      controls.addEventListener("change", () => { needsRender = true; });
      controls.addEventListener("end", () => { needsRender = true; });

      animate();

      // ─── Throttled resize ─────────────────────────────
      let rafResize = null;
      const onResize = () => {
        if (rafResize) cancelAnimationFrame(rafResize);
        rafResize = requestAnimationFrame(() => {
          if (!containerRef.current || !camera || !renderer) return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          needsRender = true;
        });
      };

      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);

      // ─── Cleanup ──────────────────────────────────────
      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId);
        controls?.removeEventListener("change", () => {});
        controls?.removeEventListener("end", () => {});
        controls?.dispose();

        scene?.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              if (!m) return;
              ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap", "alphaMap", "envMap"]
                .forEach((k) => m[k]?.dispose?.());
              m.dispose?.();
            });
          }
        });

        scene?.clear();
        envTexture?.dispose?.();
        dracoLoader?.dispose?.();
        renderer?.dispose();
        renderer?.forceContextLoss?.();
        renderer?.domElement?.remove();
      };
    } catch (err) {
      console.error("Three.js setup failed:", err);
      setError("3D viewer error");
    }
  }, [model, allowShowModel]);

  if (!allowShowModel || !model) {
    return <img src={posterUrl} alt="Preview" className={styles.popModel} loading="lazy" />;
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {!loaded && !error && (
        <div className={styles.loadingOverlay}>
          <LoadingFallback posterUrl={posterUrl} />
          {/* <div className={styles.progress}>
            Loading model... {progress > 0 ? `${progress}%` : ""}
          </div> */}
        </div>
      )}

      {error && (
        <div className={styles.errorOverlay}>
          <p>{error}</p>
          <img src={posterUrl} alt="Fallback" className={styles.poster} loading="lazy" />
        </div>
      )}
    </div>
  );
}