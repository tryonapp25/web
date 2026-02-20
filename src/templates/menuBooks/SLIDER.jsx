import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const templateModules = import.meta.glob([
  "../menu/*.jsx",
  "../posters/*.jsx",
]);

// Component to load a single content item with its own template
function ContentItem({ content, currentIndex }) {
  const DynamicTemplate = useMemo(() => {
    const code = content?.code;
    if (!code) return null;

    const entry = Object.entries(templateModules).find(([path]) =>
      path.endsWith(`/${code}.jsx`)
    );

    return entry ? lazy(entry[1]) : null;
  }, [content?.code, currentIndex]);

  if (!content?.code) return <p>Missing code for item</p>;
  if (!DynamicTemplate) return <p>Template not found: {content.code}</p>;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DynamicTemplate data={content} />
    </Suspense>
  );
}

export default function Template({ data = {}, pressable, onPress }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contents = Array.isArray(data?.contents) ? data.contents : [];
  if (contents.length === 0) return <p>No content available</p>;

  const next = () => {
    setCurrentIndex((prev) => (prev < contents.length - 1 ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <main
      style={{
        position: "relative",   // ✅ needed for absolute arrows
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",  
        cursor: "pointer",   // ✅ so arrows have space even if template is small
      }}
      onClick={onSelectedTemplate}
    >
      <ContentItem content={contents[currentIndex]} currentIndex={currentIndex} />

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
