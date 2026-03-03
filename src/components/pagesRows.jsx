import React from "react";

export default function PagesRows({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPrev,
  onNext,
  showingItems = 0,
}) {

  return (
    <div style={styles.wrapper}>
      <div style={styles.topRow}>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          style={{
            ...styles.arrowButton,
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          ‹
        </button>

        <span style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          style={{
            ...styles.arrowButton,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          ›
        </button>
      </div>

      <div style={styles.bottomRow}>
        Showing {showingItems} of {totalItems} products
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    fontFamily: "sans-serif",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  pageText: {
    fontSize: "16px",
    fontWeight: 500,
  },
  bottomRow: {
    fontSize: "14px",
    color: "#555",
  },
  arrowButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
};
