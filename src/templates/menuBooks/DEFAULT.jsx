import { lazy, Suspense, useMemo, useEffect, useRef, useState } from "react";
import styles from "./DEFAULT.module.css";

const templateModules = import.meta.glob("../menu/*.jsx");

// Component to load a single content item with its own template
function ContentItem({ content }) {
  const DynamicTemplate = useMemo(() => {
    const code = content?.code;
    if (!code) return null;

    const key = `../menu/${code}.jsx`;
    const importer = templateModules[key];
    return importer ? lazy(importer) : null;
  }, [content?.code]);

  if (!content?.code) return <p>Missing code for item</p>;
  if (!DynamicTemplate) return <p>Template not found: {content.code}</p>;

  return (
    <Suspense fallback={<p>Loading item...</p>}>
      <DynamicTemplate data={content} />
    </Suspense>
  );
}

export default function TemplateLoader({ data }) {
  const contents = Array.isArray(data?.contents) ? data.contents : [];
  if (contents.length === 0) return <p>No content available</p>;

  // how many items are currently visible/rendered
  const [visibleCount, setVisibleCount] = useState(1);

  // reset when data changes
  useEffect(() => {
    setVisibleCount(1);
  }, [contents.length]);

  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + 1, contents.length));
        }
      },
      {
        root: null,          // page scroll
        rootMargin: "400px", // preload next item before user reaches bottom
        threshold: 0.01,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [contents.length]);

  const visibleItems = contents.slice(0, visibleCount);

  return (
    <main className={styles.main}>
      {visibleItems.map((content, index) => (
        <ContentItem key={content?.id ?? index} content={content} />
      ))}

      {/* sentinel: when user scrolls near the end, load the next one */}
      {visibleCount < contents.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </main>
  );
}
