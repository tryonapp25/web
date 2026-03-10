// src/components/3dModel.jsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"; // ← Add this
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../styles/Model3D.module.css";

// Loading fallback
function LoadingFallback({posterUrl}) {
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
  allowShowModel = true,
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
      scene.background = new THREE.Color(0xf8f9fa);

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
      renderer.shadowMap.enabled = false;
      containerRef.current.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 5);
      scene.add(dirLight);

      // Controls
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
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Reliable Google CDN
      // Alternative: copy draco files to public/draco/ and use "/draco/"

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader); // ← This removes the warning!

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
          const scale = 3 / maxDim; // Adjust as needed
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

      // Resize
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

        dracoLoader?.dispose?.(); // Clean up Draco too
      };
    } catch (err) {
      console.error("Three.js error:", err);
      setError("3D viewer failed");
    }
  }, [model, allowShowModel]);

  if (!allowShowModel || !model) {
    return <img src={posterUrl} alt="Preview" className={styles.poster} />;
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {!loaded && !error && <LoadingFallback images={[posterUrl]} />}
      {error && (
        <div className={styles.errorOverlay}>
          <p>{error}</p>
          <img src={posterUrl} alt="Fallback" className={styles.poster} />
        </div>
      )}
    </div>
  );
}