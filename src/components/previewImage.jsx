import { useEffect, useMemo, useState } from "react";
import "../styles/PreviewImage.css";
import ActivityIndicator from "./activityIndicator";
import FlashMessage from "../components/flashMessage";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import { useNavigate } from "react-router-dom";

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isDataImageUrl(value) {
  const v = (value || "").trim();
  // data:image/png;base64,AAAA...
  return /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(v);
}

const defaultMessage = {
  visible: false,
  type: "",
  msg: "",
};

export default function PreviewImage({
  isOpen,
  initialUrl = "",
  title = "Set image by URL",
  onClose,
  onSave, // ({ url })
  showSave = true,
}) {
  const navigate = useNavigate(); // (unused, keep if you plan to use)
  const [url, setUrl] = useState(initialUrl || "");
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl || "");
      setImgError(false);
    }
  }, [isOpen, initialUrl]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const trimmed = useMemo(() => (url || "").trim(), [url]);

  // Accept BOTH: http(s) URLs and data:image/...;base64,... strings
  const validSource = useMemo(() => {
    return isValidHttpUrl(trimmed) || isDataImageUrl(trimmed);
  }, [trimmed]);

  // For "Search product" endpoint: only allow http(s) (backend/cloud vision likely needs a URL)
  const validHttpOnly = useMemo(() => isValidHttpUrl(trimmed), [trimmed]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    setImgError(false);
  };

  const handleSave = () => {
    onSave?.({ url: initialUrl });
  };

  const handleSerchforProduct = async () => {
    if (loading) return;
    if (!validHttpOnly) {
      setMessage({
        visible: true,
        msg: "Search product requires a public http(s) URL (base64 data URLs won’t work).",
        type: "warn",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await http.post(`/user/cloud-vision/search-product`, { url: trimmed });
      if (res.data.success) {
        const { url: productUrl } = res.data.data[0];
        window.open(productUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setMessage({
        visible: true,
        msg: httpMessage(err),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ium-overlay" onMouseDown={handleOverlayMouseDown}>
      <div className="ium-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ium-header">
          <div>
            <div className="ium-title">{title}</div>
            <div className="ium-subtitle">
              Paste an https:// image URL or a base64 data:image/... string to preview and save.
            </div>
          </div>
          <button className="ium-iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ium-body">
          <label className="ium-label" htmlFor="imageUrlInput">
            Image URL / Base64
          </label>

          <div className="ium-inputRow">
            {/* Use textarea so base64 is usable */}
            <textarea
              id="imageUrlInput"
              className="ium-input"
              value={url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg OR data:image/jpeg;base64,/9j/..."
              autoFocus
              rows={4}
            />
            <button
              className="ium-btn ghost"
              type="button"
              onClick={() => {
                setUrl("");
                setImgError(false);
              }}
            >
              Clear
            </button>
          </div>

          {!trimmed ? (
            <div className="ium-hint">Paste a URL or base64 data URL to see a preview.</div>
          ) : !validSource ? (
            <div className="ium-error">
              Please enter a valid http(s) image URL or a base64 data URL like{" "}
              <code>data:image/jpeg;base64,...</code>.
            </div>
          ) : (
            <div className="ium-previewCard">
              <div className="ium-previewHeader">Preview</div>

              <div className="ium-previewBox">
                {!imgError ? (
                  <img
                    className="ium-img"
                    src={trimmed}
                    alt="Preview"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="ium-errorBox">
                    Couldn’t load this image. Check the URL/base64 string and try again.
                  </div>
                )}
              </div>

              <div className="ium-meta">
                <span className="ium-pill">{imgError ? "Invalid image" : "Looks good"}</span>
                <span className="ium-metaUrl" title={trimmed}>
                  {trimmed}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="ium-footer">
          <button className="ium-btn ghost" onClick={onClose}>
            Cancel
          </button>

          {showSave ? (
            <button className="ium-btn primary" onClick={handleSave} disabled={!validSource || imgError}>
              Save
            </button>
          ) : (
            <button
              className="ium-btn primary"
              onClick={handleSerchforProduct}
              disabled={!validHttpOnly || imgError}
            >
              {loading ? <ActivityIndicator /> : "Search product"}
            </button>
          )}
        </div>
      </div>

      <FlashMessage
        show={message.visible}
        onClose={() => setMessage(defaultMessage)}
        type={message.type}
        message={message.msg}
      />
    </div>
  );
}
