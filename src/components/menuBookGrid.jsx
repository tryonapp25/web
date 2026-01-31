
import React, { Suspense, lazy, useMemo } from "react";
import styles from "../styles/MenuBookGrid.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";

const templateModules = import.meta.glob("../templates/menu/*.jsx");
const menuBookModules = import.meta.glob("../menuBookTemplates/*.jsx");

export default function MenuBookGrid({ templates = []}) {

    const templateMap = useMemo(() => {
        const out = {};
        for (const p of Object.keys(templateModules)) out[p] = lazy(templateModules[p]);
        return out;
    }, []);

    const menuBookMap = useMemo(() => {
        const out = {};
        for (const p of Object.keys(menuBookModules)) out[p] = lazy(menuBookModules[p]);
        return out;
    }, []);

  
    return (
        <div className={styles.page}>
            <div className={styles.grid}>
                {templates.map((item, index) => {
                    // determine template and menuBook file names (fallbacks)
                    const templateCode = item?.templateCode
                    const menuBookCode = item?.menuBookCode 

                    const templatePath = `../templates/menu/${templateCode}.jsx`;
                    const menuBookPath = `../menuBookTemplates/${menuBookCode}.jsx`;

                    const LazyTemplate = templateMap[templatePath]
                    const LazyMenuBook = menuBookMap[menuBookPath]

                    const pages = (item.contents || []).map((p) => ({
                        ...p,
                        contents: p.contents || p.sections || [],
                    }));

                    return (
                        <div key={item.id ?? index} className={styles.card}>
                            <div className={styles.preview}>
                                <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
                                    {LazyMenuBook && LazyTemplate ?  (
                                        <LazyMenuBook data={pages}>
                                            <LazyTemplate />
                                        </LazyMenuBook>
                                    ) : (
                                        <NoFoundTemplate />
                                    )}
                                </Suspense>
                            </div>

                            <div className={styles.meta}>
                                <div className={styles.title}>{item.heading || item.name}</div>
                                <div className={styles.subtitle}>{item.subheading}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}




function NoFoundTemplate({ onGoback }) {
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.notFoundCard}>
        <div className={styles.notFoundIcon}>🍕</div>
        <h2 className={styles.notFoundTitle}>Template Not Found</h2>
        <p className={styles.notFoundText}>
          The menu template you’re looking for doesn’t exist or was removed.
        </p>
        <button className={styles.notFoundBtn} onClick={onGoback}>
          Go Back
        </button>
      </div>
    </div>
  );
}
