import { lazy, Suspense, useMemo, useState } from "react";

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
    <Suspense fallback={<p>Loading template...</p>}>
      <DynamicTemplate data={content} />
    </Suspense>
  );
}

export default function Template({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contents = Array.isArray(data?.contents) ? data.contents : [];
  if (contents.length === 0) return <p>No content available</p>;

  const next = () => {
    setCurrentIndex((prev) => (prev < contents.length - 1 ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <main
      style={{
        position: "relative",   // ✅ needed for absolute arrows
        overflow: "hidden",
        width: "100%",
        minHeight: "200px",     // ✅ so arrows have space even if template is small
      }}
    >
      <ContentItem content={contents[currentIndex]} />

      {/* LEFT ARROW */}
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "999px",
          width: "44px",
          height: "44px",
          cursor: "pointer",
          opacity: currentIndex === 0 ? 0.4 : 1,
        }}
      >
        ◀
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={next}
        disabled={currentIndex === contents.length - 1}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "999px",
          width: "44px",
          height: "44px",
          cursor: "pointer",
          opacity: currentIndex === contents.length - 1 ? 0.4 : 1,
        }}
      >
        ▶
      </button>
    </main>
  );
}
