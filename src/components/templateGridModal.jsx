import TemplateGrid from "./templateGrid";

export default function TemplateGridModal({
  open,
  onClose,
  templates = [],
  title = "Templates",
}) {
  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
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
          <TemplateGrid templates={templates} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
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
};
