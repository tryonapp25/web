import React, { useMemo, useState, useEffect, useContext } from "react";
import "../styles/TryOn.css";
import http from "../http/http";
import ChoosePoseModal from "../components/choosePoses";
import { UserContext } from "../ApiContext/userContext";
import StyleLoading from "../components/styleLoading";
import Header from "../components/header";
import PreviewImage from "../components/previewImage";

export default function TryOn() {
  const { publicUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | trying | done | error
  const [selectedPose, setSelectedPose] = useState(null);
  const [openSelectPose, setOpenSelectPose] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] =  useState(false);
  const [message, setMessage] = useState(
    "Upload your outfit to see how it looks on you."
  );

  
  const previewUrl = useMemo(() => {
    if (!file) return "";
    setResult(null);
    return URL.createObjectURL(file);
  }, [file]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setFile(null);
      setStatus("error");
      setMessage("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    setFile(f);
    setStatus("ready");
    setMessage("Nice! Now click “Try on” to see how it could look on you.");
  };

  const clearFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage("Upload your outfit to see how it looks on you.");
  };

  // Demo try-on (replace with real API call later)
  const handleTryOn = async (pose) => {
    if (!file) return;
    if (!pose.selectedPose) return; // use pose argument, not selectedPose state
    const arr = [];
    arr.push(pose?.selectedPose)

    setStatus("trying");
    setMessage("Uploading…");

    try {
      setOpenSelectPose(false)
      setLoading(true);
      const formData = new FormData();

      // ✅ WEB: append the File directly
      formData.append("itemImage", file, file.name || "itemImage.jpg");

      formData.append("user", JSON.stringify(publicUser));
      formData.append("poses", JSON.stringify(arr));
      formData.append("tokens", JSON.stringify(pose?.tokenUsage));

      // Optional: debug keys/values
      // for (const [k, v] of formData.entries()) console.log(k, v);

      const res = await http.post("/generate-tryOn", formData);
      // ✅ no headers needed

      if (res.data?.success) {
        setStatus("done");
        setMessage("Done ✅");
        setOpenSelectPose(false);
        setSelectedPose(pose?.selectedPose);
        setResult(res.data.data.url)
      } else {
        setStatus("error");
        setMessage(res.data?.message || "Try-on failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.message || err.message || "Something went wrong");
    }
    finally{
      setLoading(false)
    }
  };



  return (
    <div className="tlight-page">
      <div className="tlight-shell">
        <header className="tlight-header">
          <Header/>
          <h1 className="tlight-title">Try-on</h1>
          <p className="tlight-subtitle">
            Upload an outfit image and preview how it could look on you.
          </p>
        </header>

        <div className="tlight-grid">
          {/* Upload Card */}
          <section className="tlight-card">
            <div className="tlight-cardHead">
              <div className="tlight-cardTitle">Upload outfit</div>
              {file && (
                <button className="tlight-btn ghost" onClick={clearFile}>
                  Remove
                </button>
              )}
            </div>

            <label className="tlight-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="tlight-fileInput"
              />
              <div className="tlight-dzInner">
                <div className="tlight-dzIcon">📷</div>
                <div>
                  <div className="tlight-dzStrong">Click to upload</div>
                  <div className="tlight-dzMuted">JPG, PNG, WEBP</div>
                </div>
              </div>
            </label>

            {file && (
              <div className="tlight-fileMeta">
                <div className="tlight-fileName" title={file.name}>
                  {file.name}
                </div>
                <div className="tlight-fileSize">{formatBytes(file.size)}</div>
              </div>
            )}

            <div className="tlight-actions">
              <button
                className="tlight-btn primary"
                onClick={() => setOpenSelectPose(true)}
                disabled={!file || status === "trying"}
              >
                {status === "trying" ? "Trying on…" : "Try on"}
              </button>
            </div>

            {!file && (
              <div className="tlight-message">
                Upload an image to enable Try on.
              </div>
            )}

            {file && (
              <div
                className={`tlight-message ${
                  status === "error"
                    ? "error"
                    : status === "done"
                    ? "success"
                    : ""
                }`}
              >
                {message}
              </div>
            )}
          </section>

          {/* Preview Card */}
          <section className="tlight-card">
            <div className="tlight-cardHead">
              <div className="tlight-cardTitle">Preview</div>
            </div>

            <div className="tlight-preview">
              {!file ? (
                <div className="tlight-previewEmpty">
                  <div className="tlight-previewBig">No image yet</div>
                  <div className="tlight-previewSmall">
                    Upload an outfit image to see it here.
                  </div>
                </div>
              ) : (
                <img
                  className="tlight-previewImg"
                  src={previewUrl}
                  alt="Outfit preview"
                />
              )}
            </div>

            <div className="tlight-hint">
              Tip: Clear outfit photo + good lighting = better results.
            </div>
          </section>
        </div>
      </div>

      <PreviewImage isOpen={!result ? false : true} onClose={() => setResult(null)} initialUrl={result} onSave={() => setResult(null)}/>
      <StyleLoading visible={loading} label="AI applying outfit on you."/>
      <ChoosePoseModal isOpen={openSelectPose} poses={publicUser?.poses} onClose={() => setOpenSelectPose(false)} generate={(pose) => handleTryOn(pose)}/>
    </div>
  );
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
