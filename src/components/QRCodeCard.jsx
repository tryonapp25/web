import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ value }) {
  const [qrSize] = useState(200);
  const [fontSize] = useState(16);

  return (
      <div style={styles.card}>
        <h2 style={styles.title}>QR Code Preview</h2>

        <div style={styles.qrBox}>
          <QRCodeCanvas
            value={value}
            size={qrSize}
            bgColor="#ffffff"
            fgColor="#111827"
          />
        </div>

        <p style={{ ...styles.previewText, fontSize }}>
          Preview Text
        </p>
        <p style={styles.value}>
          {value || "(empty)"}
        </p>
      </div>

  );
}

const styles = {
  card: {
    maxWidth: 420,
    maxHeight:420,
    padding: 28,
    borderRadius: 16,
    background: "#ffffff",
    boxShadow:
      "0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },

  title: {
    margin: 0,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
  },

  qrBox: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px dashed #e5e7eb",
    display: "flex",
    justifyContent: "center",
  },

  previewText: {
    margin: 0,
    color: "#6b7280",
    fontWeight: 500,
  },

  value: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
  },
};
