import React, { useMemo, useState, useContext } from "react";
import httpMessage from "../http/httpMessage";
import http from "../http/http";
import Model3D from "./3dModel";
import { UserContext } from "../ApiContext/userContext";
import FlashMessage from "../components/flashMessage";
import s from "../styles/UploadFileCard.module.css";

const defaultMessage = { visible: false, type: "", msg: "" };

export default function UploadFileCard() {
  const {publicUser} = useContext(UserContext);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [message, setMessage] = useState(defaultMessage);

  const prettySize = (bytes) => {
    if (bytes == null) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const meta = useMemo(() => {
    if (!file) return null;
    const name = file.name || "Unnamed";
    const ext = name.includes(".") ? name.split(".").pop().toUpperCase() : "FILE";
    return {
      name,
      ext,
      type: file.type || "unknown",
      size: prettySize(file.size),
    };
  }, [file]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setModelUrl(null);
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("user", JSON.stringify(publicUser));
      form.append("file", file);

      const res = await http.post(`/save/3dmodle`, form);

      if (res.data?.success) {
        setModelUrl(res.data.data);
        setMessage({
          visible: true,
          type: "success",
          msg: res.data.message || "Uploaded successfully",
        });
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Upload failed",
        });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const canUpload = !!file && !uploading;

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.inner}>
          {/* ===== TABS (optional, matches your style) ===== */}
          <div className={s.tabs}>
            <div className={`${s.tab} ${s.tabActive}`}>
              <span className={s.tabIcon}>🧊</span>
              3D Upload
            </div>
            <div className={s.tab}>
              <span className={s.tabIcon}>ℹ️</span>
              Details
            </div>
          </div>

          {/* ===== BODY ===== */}
          <div className={s.body}>
            {/* Left: file box + meta */}
            <div className={s.leftCol}>
              <div className={s.uploadWrap}>
                <div className={s.uploadBox}>
                  {meta ? (
                    <div className={s.filterImage}>
                      <div className={s.fileBadge}>{meta.ext}</div>
                      <div className={s.fileName} title={meta.name}>
                        {meta.name}
                      </div>
                      <div className={s.fileMeta}>
                        <span>{meta.size}</span>
                        <span className={s.dot}>•</span>
                        <span>{meta.type}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={s.uploadIcon}>⬆️</div>
                  )}
                </div>
              </div>

              <div className={s.controls}>
                <div className={s.dropRow}>
                  <label className={s.dropdown}>
                    📁 Choose file
                    <input
                      className={s.imgInput}
                      type="file"
                      accept=".glb,.gltf"
                      onChange={onPickFile}
                    />
                  </label>
                </div>

                <button
                  className={s.animateBtn}
                  onClick={uploadFile}
                  disabled={!canUpload}
                  data-disabled={!canUpload}
                >
                  {uploading ? "⏳ Uploading..." : "☁️ Upload"}
                </button>
              </div>

              <div className={s.footer}>
                {meta ? (
                  <>
                    Selected: <b>{meta.ext}</b> • {meta.size}
                  </>
                ) : (
                  <>Choose a .glb/.gltf to enable upload & preview</>
                )}
              </div>
            </div>

            {/* Right: preview canvas */}
            <div className={s.rightCol}>
              <div className={s.canvas}>
                <div className={s.canvasBg} />

                {modelUrl ? (
                  <div className={s.canvasImg}>
                    <Model3D model={modelUrl} />
                  </div>
                ) : (
                  <div className={s.previewEmpty}>
                    <div className={s.previewIcon}>🧊</div>
                    <div className={s.previewTitle}>No preview yet</div>
                    <div className={s.previewHint}>
                      Upload your model to render it here.
                    </div>
                  </div>
                )}

                {/* Center upload action (optional) */}
                {!modelUrl && (
                  <label className={s.centerUpload}>
                    Choose .glb/.gltf
                    <input
                      className={s.imgInput}
                      type="file"
                      accept=".glb,.gltf"
                      onChange={onPickFile}
                    />
                  </label>
                )}

                {/* Corner action (optional) */}
                {modelUrl && (
                  <div
                    className={s.edit}
                    title="Pick a different file"
                    onClick={() => {
                      setFile(null);
                      setModelUrl(null);
                    }}
                  >
                    ✕
                  </div>
                )}
              </div>

              <div className={s.warning}>
                Tip: If the preview is blank, confirm the file is a valid <b>.glb</b>.
              </div>
            </div>
          </div>
        </div>

        <FlashMessage
          show={message.visible}
          type={message.type}
          message={message.msg}
          onClose={() => setMessage(defaultMessage)}
        />
      </div>
    </div>
  );
}
