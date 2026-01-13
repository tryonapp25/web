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

  // ✅ NEW: url input state
  const [imageUrl, setImageUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [status, setStatus] = useState("idle"); // idle | ready | trying | done | error
  const [selectedPose, setSelectedPose] = useState(null);
  const [openSelectPose, setOpenSelectPose] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Upload your outfit to see how it looks on you."
  );

  // ✅ NEW: choose which preview to show
  const previewSrc = useMemo(() => {
    setResult(null);

    // Prefer file if present
    if (file) return URL.createObjectURL(file);

    // Else use URL if present
    if (imageUrl?.trim()) return imageUrl.trim();

    return "";
  }, [file, imageUrl]);

  // ✅ cleanup object URL only when file is used
  useEffect(() => {
    if (!file) return;
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const isValidHttpUrl = (value) => {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setFile(null);
      setStatus("error");
      setMessage("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    // ✅ If user uploads a file, clear URL mode
    setImageUrl("");
    setUrlError("");

    setFile(f);
    setStatus("ready");
    setMessage("Nice! Now click “Try on” to see how it could look on you.");
  };

  // ✅ NEW: handle URL input
  const onUrlChange = (e) => {
    const v = e.target.value;
    setImageUrl(v);
    setUrlError("");

    // If user starts using URL, clear file mode
    if (v?.trim()) setFile(null);

    if (!v.trim()) {
      setStatus("idle");
      setMessage("Upload your outfit to see how it looks on you.");
      return;
    }

    if (!isValidHttpUrl(v.trim())) {
      setStatus("error");
      setUrlError("Please enter a valid http/https URL.");
      setMessage("Please enter a valid image URL.");
      return;
    }

    setStatus("ready");
    setMessage("Nice! Now click “Try on” to see how it could look on you.");
  };

  const clearFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage("Upload your outfit to see how it looks on you.");
  };

  // ✅ NEW: clear URL
  const clearUrl = () => {
    setImageUrl("");
    setUrlError("");
    setStatus("idle");
    setMessage("Upload your outfit to see how it looks on you.");
  };

  // Demo try-on (replace with real API call later)
  const handleTryOn = async (pose) => {
    // ✅ allow either file OR url
    const url = imageUrl?.trim();
    const hasUrl = !!url;
    const hasFile = !!file;

    if (!hasFile && !hasUrl) return;
    if (hasUrl && !isValidHttpUrl(url)) return;
    if (!pose.selectedPose) return;
    const arr = [];
    arr.push(pose?.selectedPose);

    setStatus("trying");
    setMessage("Uploading…");

    try {
      setOpenSelectPose(false);
      setLoading(true);

      const formData = new FormData();

      // ✅ Send file OR url (depending on which user used)
      if (hasFile) {
        formData.append("itemImage", file, file.name || "itemImage.jpg");
      } else {
        // IMPORTANT: backend must support this field
        formData.append("itemImageUrl", url, "itemImage.jpg");
      }

      formData.append("user", JSON.stringify(publicUser));
      formData.append("poses", JSON.stringify(arr));
      formData.append("tokens", JSON.stringify(pose?.tokenUsage));

      const res = await http.post("/generate-tryOn", formData);

      if (res.data?.success) {
        setStatus("done");
        setMessage("Done ✅");
        setOpenSelectPose(false);
        setSelectedPose(pose?.selectedPose);
        setResult(res.data.data.url);
      } else {
        setStatus("error");
        setMessage(res.data?.message || "Try-on failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const canTryOn = !!file || !!imageUrl.trim();

  return (
    <div className="tlight-page">
      <div className="tlight-shell">
        <header className="tlight-header">
          <Header />
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

              {(file || imageUrl.trim()) && (
                <button
                  className="tlight-btn ghost"
                  onClick={() => (file ? clearFile() : clearUrl())}
                >
                  Remove
                </button>
              )}
            </div>

            {/* ✅ NEW: URL input (optional) */}
            <div className="tlight-urlRow">
              <input
                className="tlight-urlInput"
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={imageUrl}
                onChange={onUrlChange}
              />
              {imageUrl.trim() && (
                <button className="tlight-btn ghost" onClick={clearUrl}>
                  Clear
                </button>
              )}
            </div>
            {urlError && <div className="tlight-urlError">{urlError}</div>}

            {/* Upload */}
            <label className="tlight-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="tlight-fileInput"
                // optional: disable file input when URL is being used
                disabled={!!imageUrl.trim()}
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
                disabled={!canTryOn || status === "trying"}
              >
                {status === "trying" ? "Trying on…" : "Try on"}
              </button>
            </div>

            {!canTryOn && (
              <div className="tlight-message">
                Upload an image or paste a URL to enable Try on.
              </div>
            )}

            {canTryOn && (
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
              {!previewSrc ? (
                <div className="tlight-previewEmpty">
                  <div className="tlight-previewBig">No image yet</div>
                  <div className="tlight-previewSmall">
                    Upload an outfit image or paste a URL to see it here.
                  </div>
                </div>
              ) : (
                <img
                  className="tlight-previewImg"
                  src={previewSrc}
                  alt="Outfit preview"
                  onError={() => {
                    // If URL fails to load, show error
                    if (imageUrl.trim()) {
                      setStatus("error");
                      setUrlError("Could not load image from that URL.");
                      setMessage("Could not load image from that URL.");
                    }
                  }}
                />
              )}
            </div>

            <div className="tlight-hint">
              Tip: Clear outfit photo + good lighting = better results.
            </div>
          </section>
        </div>
      </div>

      <PreviewImage
        isOpen={!result ? false : true}
        onClose={() => setResult(null)}
        initialUrl={result}
        onSave={() => setResult(null)}
      />
      <StyleLoading visible={loading} label="AI applying outfit on you." />
      <ChoosePoseModal
        isOpen={openSelectPose}
        poses={publicUser?.poses}
        onClose={() => setOpenSelectPose(false)}
        generate={(pose) => handleTryOn(pose)}
      />
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
