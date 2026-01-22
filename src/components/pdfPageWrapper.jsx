import styles from "../styles/PdfPageWrapper.module.css";


export default function PdfPageWrapper({ children }) {
  return (
    <div className={styles.viewer}>
      <div className={styles.pageWrapper}>
        <section className={styles.pdfPage}>
          {children}
        </section>
      </div>
    </div>
  );
}




