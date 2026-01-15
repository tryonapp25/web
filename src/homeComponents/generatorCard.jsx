import { useState ,useContext, useEffect, useRef} from "react";
import styles from "../styles/generatorCard.module.css";
import {
  Image as ImageIcon,
  Video,
  ChevronDown,
  Wand2,
  Gift,
} from "lucide-react";
import { UserContext } from "../ApiContext/userContext";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";
import PreviewImage from "../components/previewImage";
import LoadingModal from "../components/loading";


const defaultMessage = {visible: false,type: "",msg: ""}
const cx = (...c) => c.filter(Boolean).join(" ");

export default function GeneratorCard({filter, scroll, onClear}) {
  const [mode, setMode] = useState("filters");
  const [result, setResult] = useState(null);
  const { publicUser, setPublicUser } = useContext(UserContext);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const didInitFetch = useRef(false);

  useEffect(()=> {
    if(filter){
      if (didInitFetch.current) return;
      didInitFetch.current = true;
      getTokenUsage();
    }
  },[filter]);

  const getTokenUsage = async () => {
    try{
      const res = await http.get(`/token-usage`);
      if(res.data.success){
        setTokenUsage(res.data.data);
      }
    }
    catch(err){
      setMessage({visible:true, type:"error", msg: httpMessage(err)})
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClearFileImage = () => {
    setFile(null);
    setPreview(null);
    scroll()
  }


  const handleUseFilter = async () => {
  if (loading) return;
  if (!file) return setMessage({ visible: true, msg: "Please select an image.", type: "warn" });
  if (!filter) return setMessage({ visible: true, msg: "Please select filter.", type: "warn" });

  try {
    setLoading(true);

      const formData = new FormData();
      formData.append("user", JSON.stringify(publicUser));
      formData.append("filter", JSON.stringify(filter));
      formData.append("tokenUsage", JSON.stringify(tokenUsage));

      // ✅ THIS is the key: append the File directly
      formData.append("image", file, file.name);

      // ✅ Don’t set Content-Type manually with axios
      const res = await http.post("/use/filter", formData);

      if (res.data.success) {
        setResult(res.data.url);
        setPublicUser(res.data.data);
      }
    } catch (err) {
      setMessage({ visible: true, msg: httpMessage(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if(loading) return;
    try{
      setLoading(true)
      const res = await http.post(`/save/image`, {user: publicUser, img: result});
      if(res.data?.success){
        setMessage({visible: true, type:"success", msg: res.data.message});
      }
    }
    catch(err){
      setMessage({visible: true, type:"error", msg: httpMessage(err)});
    }
    finally{ 
      setLoading(false);
      Clear();
    }
  }

  const Clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    onClear()
    onscroll();
  }


  return (
    <section className={styles.card}>
      <div className={styles.inner}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={cx(styles.tab, mode === "filters" && styles.tabActive)}
            onClick={() => setMode("filters")}
          >
            <div className={styles.tabIcon}>
              <ImageIcon size={16} />
            </div>
            Use Filters
          </button>

          <button
            className={cx(styles.tab, mode === "imageToVideo" && styles.tabActive)}
            onClick={() => setMode("imageToVideo")}
          >
            <div className={styles.tabIcon}>
              <Video size={16} />
            </div>
            Image to Video
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.uploadWrap}>
            <div className={styles.uploadBox}>
              {!filter ?
                <div className={styles.uploadIcon}>
                  <ImageIcon size={18} />
                </div>
                :
                <img  className={styles.filterImage} src={filter?.img} alt={filter?.title ?? "filter"} loading="lazy" />
              }
            </div>
          </div>

          <div className={styles.canvas}>
            <div className={styles.canvasBg} />

            {preview && (
              <img src={preview} alt="preview" className={styles.canvasImg} />
            )}

            <input
              id="imgUpload"
              type="file"
              accept="image/*"
              className={styles.imgInput}
              onChange={handleChange}
            />

            {!preview && (
              <label htmlFor="imgUpload" className={styles.centerUpload}>
                Choose image
              </label>
            )}

            <button className={styles.edit} onClick={handleClearFileImage}>🗑</button>
          </div>
        </div>

        {/* Warning */}
        {publicUser?.token?.tokens === 0 ?
          <div className={styles.warning}>
            You’ve reached your free video limit.{" "}
            <a href="#subscribe">Subscribe now</a> to generate more videos
          </div>
          :
          <div className={styles.warning}>
            {!filter ?
              <p style={{paddingLeft:"12px"}}>No filter selected</p>
              :
              <p style={{paddingLeft:"12px"}}>{filter?.title}.</p>
            }
          </div>
        }

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.dropRow}>
            <button className={styles.dropdown}>
              Nano-Banana Pro. <ChevronDown size={16} />
            </button>
            <button className={styles.dropdown}>
              HD <ChevronDown size={16} />
            </button>
          </div>

          <button className={styles.animateBtn} onClick={() => handleUseFilter()}>
            Generate <Wand2 size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Gift size={16} />
          <span>
            Generate tokens: <b>{publicUser?.token?.tokens}</b>
          </span>
        </div>
      </div>

      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={()=> setMessage(defaultMessage)}/>
      <PreviewImage isOpen={!result ? false : true} initialUrl={result} onClose={() => setResult(null)} onSave={(uri)=> handleSaveImage(uri)}/>
      <LoadingModal open={loading}/>
    </section>
  );
}
