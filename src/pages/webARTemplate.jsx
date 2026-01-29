import styles from "../styles/ARTemplate.module.css"
import { useEffect, useState, useContext } from "react";
import {UserContext} from "../ApiContext/userContext";
import { useNavigate } from "react-router-dom";
import { defaultMessage } from "../config";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import LoadingModal from "../components/loading";
import { fakeTemplate } from "../config";


export default function ARTemplate() {
  const navigation = useNavigate();
  const { publicUser } = useContext(UserContext);
  const [template, setTemplate] = useState(fakeTemplate);
  const [message, setMessage] = useState(defaultMessage);


  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try{
        setLoading(true);
        const res = await http.get(``);
        if(res.data.success){
          setTemplate(res.data.data);
        }
      }
      catch(err){
        setMessage({visible: true, type: "error", msg: httpMessage(err)});
      }
      finally{
        setLoading(false);
      }
    }
   
    fetchTemplate();
    showHtmlCard();
    setLight(); 
  },[]);

  const showHtmlCard = () => {
    const timer = setTimeout(() => {
      const ui = document.querySelector("#htmlUI");
      if (ui) ui.setAttribute("visible", true);
    }, 5000);

    return () => clearTimeout(timer);
  }

  const setLight = () => {
    if (window.AFRAME && !AFRAME.components["tune-gltf"]) {
      AFRAME.registerComponent("tune-gltf", {
        schema: {
          metalness: { default: 0 },
          roughness: { default: 1 },
        },

        init() {
          this.el.addEventListener("model-loaded", () => {
            const mesh = this.el.getObject3D("mesh");
            if (!mesh) return;

            mesh.traverse((n) => {
              if (n.isMesh && n.material) {
                n.material.metalness = this.data.metalness;
                n.material.roughness = this.data.roughness;

                if (n.material.color) {
                  n.material.color.multiplyScalar(1);
                }

                n.material.needsUpdate = true;
              }
            });
          });
        },
      });
    }
  }

  return (
    <div className={styles.page}>
      <div id="htmlPanel" className={styles.htmlPanel}>
        <div  className={styles.artboard}>
          <div className={styles.fuzz}></div>
          <div id="grid" className={styles.grid}>
            {template?.contents?.length > 0 && template.contents.map((review, index) => (
              <div className={styles.cell} key={index}>
                <div className={styles.review_header}>
                  <img
                    className={styles.avatar}
                    crossOrigin="anonymous"
                    src={review.avatar}
                    alt=""
                  />
                  <div className={styles.review_name}>
                    <span>{review.userName}</span>
                  </div>
                </div>

                <div className={styles.stars}>
                  {"★".repeat(review.ratingStars)}
                </div>

                <div className={styles.review_text}>
                  <p>{review.text}</p>
                </div>

                <div className={styles.item_image}>
                  <img crossOrigin="anonymous" src={review.img} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <a-scene
        embedded
        arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false;
                smooth: true; smoothCount: 10; smoothTolerance: 0.01; smoothThreshold: 5;"
        renderer="antialias: true; alpha: true; colorManagement: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false"
        background="transparent: true"
        loading-screen="enabled: false"
      >

        <a-light type="ambient" intensity="2.0"></a-light>
        <a-light type="hemisphere" intensity="1.0" color="#ffffff" groundColor="#888888"></a-light>
        <a-light type="directional" intensity="2.5" position="1.5 2 1"></a-light>

        <a-assets timeout="20000">
          {template.contents.map((item, index) => (
            <a-entity key={index}>
              <a-asset-item id={`gltfAsset-${index}`} src={item.model} crossOrigin="anonymous" />
              <img id={`ratingAsset-${index}`} src={item.rating} crossOrigin="anonymous" alt="" />
            </a-entity>
          ))}
        </a-assets>
        

        <a-marker type="pattern" url={template?.marker}
          onMarkerFound={() => console.log("MARKER FOUND")}
          onMarkerLost={() => console.log("MARKER LOST")}
          emitevents="true"
        >
          <a-image
            id="ratingEntity-0"
            src="#ratingAsset-0"
            rotation="-90 0 0"
            position="0 0 -1"
            width="2"
            height="1.2"
            material="transparent: true; opacity: 0.1"

            animation__move="property: position;
                    to: 2 0 -1;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__fade="property: material.opacity;
                    to: 1;
                    dur: 5000;
                    easing: easeOutCubic"
          
          >
          </a-image>

          <a-image
            id="ratingEntity-1"
            src="#ratingAsset-1"
            rotation="-90 0 0"
            position="0 0 0.5"
            width="2"
            height="1.2"
            material="transparent: true; opacity: 0.1"

            animation__move="property: position;
                    to: 2 0 0.5;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__fade="property: material.opacity;
                    to: 1;
                    dur: 5000;
                    easing: easeOutCubic"
          
          >
          </a-image>

        
          <a-image
            id="ratingEntity-2"
            src="#ratingAsset-2"
            rotation="-90 0 0"
            position="0 0 1.4"
            width="2"
            height="1.2"
            material="transparent: true; opacity: 0.1"

            animation__move="property: position;
                    to: 2 0 2;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__fade="property: material.opacity;
                    to: 1;
                    dur: 5000;
                    easing: easeOutCubic"
          
          >
          </a-image>

         
          <a-gltf-model
            id="model-0"
            src="#gltfAsset-0"
            onModelLoaded={() => console.log("MODEL LOADED 0")}
            onModelError={(e) => console.log("MODEL ERROR 0", e)} 
            rotation="-50 0 0"
            position="0 0 -1.5"
            scale="0.1 0.1 0.1"
            animation-mixer="clip: *; loop: repeat"
            material="transparent: true; opacity: 1"
            animation__move="property: position;
                    to: 2 0 -1.5;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__grow="property: scale;
                  from: 0.1 0.1 0.1;
                  to: 0.7 0.7 0.7;
                  dur: 5000;
                  easing: easeOutCubic"
            animation__pluse="property: scale;
                  dir: alternate;
                  dur: 1500;
                  easing: easeInOutSine;
                  loop: true;
                  from: 0.6 0.6 0.6;
                  to: 0.7 0.7 0.7"
          >
          </a-gltf-model>

          <a-gltf-model
            id="model-1"
            src="#gltfAsset-1"
            onModelLoaded={() => console.log("MODEL LOADED 0")}
            onModelError={(e) => console.log("MODEL ERROR 0", e)}
            position="0 0 0"
            rotation="-50 0 -0.25"
            scale="0.1 0.1 0.1"
            animation-mixer="clip: *; loop: repeat"
            material="transparent: true; opacity: 1"
            animation__move="property: position;
                    to: 2 0 -0.25;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__grow="property: scale;
                  from: 0.1 0.1 0.1;
                  to: 0.7 0.7 0.7;
                  dur: 5000;
                  easing: easeOutCubic"
            animation__pluse="property: scale;
                  dir: alternate;
                  dur: 1500;
                  easing: easeInOutSine;
                  loop: true;
                  from: 0.6 0.6 0.6;
                  to: 0.7 0.7 0.7"
          >
          </a-gltf-model>

          <a-gltf-model
            id="model-2"
            src="#gltfAsset-2"
            onModelLoaded={() => console.log("MODEL LOADED 0")}
            onModelError={(e) => console.log("MODEL ERROR 0", e)}
            rotation="-50 0 0"
            position="0 0 1.3"
            scale="0.1 0.1 0.1"
            animation-mixer="clip: *; loop: repeat"
            material="transparent: true; opacity: 1"
            animation__move="property: position;
                    to: 2 0 1.3;
                    dur: 5000;
                    easing: easeOutCubic"
            animation__grow="property: scale;
                  from: 0.1 0.1 0.1;
                  to: 0.7 0.7 0.7;
                  dur: 5000;
                  easing: easeOutCubic"
            animation__pluse="property: scale;
                  dir: alternate;
                  dur: 1500;
                  easing: easeInOutSine;
                  loop: true;
                  from: 0.6 0.6 0.6;
                  to: 0.7 0.7 0.7"
            tune-gltf
          >
          </a-gltf-model> 

          <a-entity
            id="htmlUI"
            html="html:#htmlPanel; transparent:true; ratio: 1; width: 1.5;"
            position="3.7 0 0.2" 
            rotation="-90 0 0"
            scale="1 1 1"
            
          ></a-entity>

          <a-image
            id="ctaBtn"
            src="https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2FAR-web%2Favatar2.png?alt=media&token=ff436b44-42cd-4954-a928-47fb6f21b10f"
            class="clickable"
            rotation="-90 0 0"
            position="0 0 0"
            width="1"
            height="1"
            material="transparent: true; opacity: 1; side: double"
          >
          </a-image> 
        </a-marker>

        {/* Camera */}
        <a-entity
            camera
            cursor="rayOrigin: mouse; fuse: false"
            raycaster="objects: .clickable"
        ></a-entity>
      </a-scene>
    </div>
  );
}
