import React, { useState } from "react";

export default function TemplateGridModal({
  open,
  onClose,
  templates = [],
  title = "Templates",
  onSelect,
}) {
  const [hovered, setHovered] = useState(null);
  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {(!templates || templates.length === 0) && (
            <div style={styles.empty}>No templates found</div>
          )}

          <div style={styles.grid}>
            {templates.length > 0 && templates.map((t, i) => (
              <div
                key={t?.id ?? i}
                style={styles.card}
                onClick={() => {
                  try { onSelect?.(t); } catch (e) {}
                  onClose?.();
                }}
                onMouseEnter={() => setHovered(t?.id ?? i)}
                onMouseLeave={() => setHovered(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    try { onSelect?.(t); } catch (e) {}
                    onClose?.();
                  }
                }}
              >
                <p>ID: #{t?.id}</p>
                <div style={styles.thumb}>
                  {t?.thumbnail ? (
                    <img src={t.thumbnail} alt={t.name || t.code} style={styles.img} />
                  ) : (
                    <div style={styles.placeholder}>{t.name?.[0] ?? "T"}</div>
                  )}
                </div>
                <div style={styles.meta}>
                  <div style={styles.name}>{t.name ?? t.code ?? `Template ${i + 1}`}</div>
                  <div style={styles.sub}>{t.type ?? "menu"}</div>
                </div>
                {hovered === (t?.id ?? i) && <div style={styles.overlay}>Select</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    position: "relative",
    width: "90%",
    maxWidth: 1200,
    maxHeight: "85vh",
    backgroundColor: "#0B0F19",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.92)",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.7)",
    padding: 8,
    borderRadius: 8,
    transition: "background 0.2s",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  card: {
    position: "relative",
    background: "linear-gradient(180deg,#0d1726,#071018)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 12,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minHeight: 140,
    overflow: "hidden",
  },
  thumb: {
    height: 88,
    borderRadius: 8,
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  placeholder: { color: "rgba(255,255,255,0.45)", fontSize: 28 },
  meta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  name: { color: "rgba(255,255,255,0.92)", fontSize: 14, fontWeight: 600 },
  sub: { color: "rgba(255,255,255,0.5)", fontSize: 12 },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontWeight: 700,
    pointerEvents: "none",
  },
  empty: { color: "rgba(255,255,255,0.6)", textAlign: "center", padding: 40 },
};
