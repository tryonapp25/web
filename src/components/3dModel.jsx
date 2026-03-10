// src/components/3dModel.jsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // ← Add for HDR env
import styles from "../styles/Model3D.module.css";

// Loading fallback
function LoadingFallback({ posterUrl }) {
  return (
    <img
      src={posterUrl}
      alt="3D preview"
      className={styles.popModel}
    />
  );
}

export default function Model3D({
  model,           // URL to .glb / .gltf
  images,          // poster images
  config = {},
  allowShowModel = false,
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const posterUrl = images?.[0] || "/logos/logo.png";

  useEffect(() => {
    if (!allowShowModel || !model || !containerRef.current) return;

    let renderer = null;
    let scene = null;
    let camera = null;
    let controls = null;
    let animationFrameId = null;

    try {
      // ─── Scene setup ───
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa); // light gray like model-viewer neutral

      camera = new THREE.PerspectiveCamera(
        50,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.5, 5);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = false; // disable for perf (or enable later)
      renderer.toneMapping = THREE.ACESFilmicToneMapping; // close to model-viewer "neutral"
      renderer.toneMappingExposure = 0.7; // matches exposure="1"
      containerRef.current.appendChild(renderer.domElement);

      // ─── Neutral-like lighting (match model-viewer "neutral") ───
      // Option 1: HDR environment (best match – recommended)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr", // neutral studio HDR
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture; // PBR lighting + reflections
          // scene.background = texture; // optional – shows environment as bg
        },
        undefined,
        (err) => console.warn("HDR load failed, using fallback lights", err)
      );

      // Option 2: Fallback manual lights (if HDR fails or you want lighter bundle)
      scene.add(new THREE.AmbientLight(0xffffff, 0.8)); // strong ambient for even fill

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
      keyLight.position.set(5, 10, 7);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
      fillLight.position.set(-4, 8, -5);
      scene.add(fillLight);

      // Optional rim for product pop
      const rimLight = new THREE.DirectionalLight(0xfff5e1, 1.0);
      rimLight.position.set(0, 5, -8);
      scene.add(rimLight);

      // Controls (same as before)
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.minPolarAngle = Math.PI / 6;
      controls.maxPolarAngle = Math.PI - Math.PI / 6;
      controls.autoRotate = !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      controls.autoRotateSpeed = 1.0;

      // ─── Draco + GLTF Loader ───
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        model,
        (gltf) => {
          const modelObj = gltf.scene;
          modelObj.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = false;
              child.receiveShadow = false;
            }
          });

          // Center & scale
          const box = new THREE.Box3().setFromObject(modelObj);
          const center = box.getCenter(new THREE.Vector3());
          modelObj.position.sub(center);

          const maxDim = Math.max(
            box.max.x - box.min.x,
            box.max.y - box.min.y,
            box.max.z - box.min.z
          );
          const scale = 3 / maxDim;
          modelObj.scale.multiplyScalar(scale);

          scene.add(modelObj);
          setLoaded(true);
        },
        undefined,
        (err) => {
          console.error("Model load error:", err);
          setError("Failed to load 3D model");
        }
      );

      // ─── Render loop ───
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const onResize = () => {
        if (!containerRef.current) return;
        camera.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      };
      window.addEventListener("resize", onResize);

      // ─── Cleanup ───
      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss?.();
          renderer.domElement.remove();
        }

        if (scene) {
          scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              mats.forEach((mat) => {
                ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap"].forEach(
                  (key) => mat[key] && mat[key].dispose()
                );
                mat.dispose();
              });
            }
          });
          scene.clear();
        }

        dracoLoader?.dispose?.();
      };
    } catch (err) {
      console.error("Three.js error:", err);
      setError("3D viewer failed");
    }
  }, [model, allowShowModel]);

  if (!allowShowModel || !model) {
    return <img src={posterUrl} alt="Preview" className={styles.popModel} />;
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {!loaded && !error && <LoadingFallback posterUrl={posterUrl} />}
      {error && (
        <div className={styles.errorOverlay}>
          <p>{error}</p>
          <img src={posterUrl} alt="Fallback" className={styles.poster} />
        </div>
      )}
    </div>
  );
}