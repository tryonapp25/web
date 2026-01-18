import { useState } from "react";
import QRCodeCard from "./QRCodeCard";

const VITE_PUBLIC_TEMPLATE_URL = import.meta.env.VITE_PUBLIC_TEMPLATE_URL;

export default function QrCodeModal({
  open,
  onClose,
  onEdit,
  onPublish,
  onDownload,
  template
}) {
  if (!open) return null;

  const [qrValue] = useState(`${VITE_PUBLIC_TEMPLATE_URL}#menu/${template?.type}/template/${template?.id}?code=${template.code}&public=${template?.publicCode?.String}`) 

  return (
    <div style={styless.overlay}>
      <div style={styless.modal}>
        {/* Download Icon */}
        <button style={styless.downloadBtn} onClick={onDownload}>
          ⬇
        </button>

        {/* Close Icon */}
        <button style={styless.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* QR Code */}
        <div style={styless.qrWrapper}>
          <QRCodeCard value={qrValue}/>
        </div>

        {/* Buttons */}
        <div style={styless.actions}>
          <button style={styless.editBtn} onClick={() => onEdit(template)}>
            Edit
          </button>
          <button style={styless.publishBtn} onClick={() => onPublish(template)}>
            {template?.isPublic ? "unPublished" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styless = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    minWidth: 500 ,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  downloadBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },
  qrWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  qrImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    border: "1px solid #eee",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
  editBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
  publishBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 10,
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
};
