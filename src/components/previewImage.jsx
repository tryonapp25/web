import { useEffect, useMemo, useState } from "react";
import "../styles/PreviewImage.css";

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function PreviewImage({
  isOpen,
  initialUrl = "",
  title = "Set image by URL",
  onClose,
  onSave, // ({ url })
}) {
  const [url, setUrl] = useState(initialUrl || "");
  const [imgError, setImgError] = useState(false);

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

  const validUrl = useMemo(() => isValidHttpUrl(url.trim()), [url]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    setImgError(false);
  };

  const handleSave = () => {
    const cleaned = url.trim();
    onSave?.({ url: cleaned });
  };

  return (
    <div className="ium-overlay" onMouseDown={handleOverlayMouseDown}>
      <div className="ium-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ium-header">
          <div>
            <div className="ium-title">{title}</div>
            <div className="ium-subtitle">Paste an https:// image URL to preview and save.</div>
          </div>
          <button className="ium-iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ium-body">
          <label className="ium-label" htmlFor="imageUrlInput">
            Image URL
          </label>

          <div className="ium-inputRow">
            <input
              id="imageUrlInput"
              className="ium-input"
              value={url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              autoFocus
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

          {!url.trim() ? (
            <div className="ium-hint">Paste a URL to see a preview.</div>
          ) : !validUrl ? (
            <div className="ium-error">Please enter a valid http(s) URL.</div>
          ) : (
            <div className="ium-previewCard">
              <div className="ium-previewHeader">Preview</div>

              <div className="ium-previewBox">
                {!imgError ? (
                  <img
                    className="ium-img"
                    src={url.trim()}
                    alt="Preview"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="ium-errorBox">
                    Couldn’t load this image. Check the URL or try another one.
                  </div>
                )}
              </div>

              <div className="ium-meta">
                <span className="ium-pill">{imgError ? "Invalid image" : "Looks good"}</span>
                <span className="ium-metaUrl" title={url.trim()}>{url.trim()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="ium-footer">
          <button className="ium-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ium-btn primary"
            onClick={handleSave}
            disabled={!validUrl || imgError}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
