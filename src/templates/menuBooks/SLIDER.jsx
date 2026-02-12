import { lazy, Suspense, useMemo, useState } from "react";

const templateModules = import.meta.glob("../menu/*.jsx");

export default function Template({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const DynamicTemplate = useMemo(() => {
    const code = data?.templateCode;
    if (!code) return null;

    const key = `../menu/${code}.jsx`;
    const importer = templateModules[key];

    return importer ? lazy(importer) : null;
  }, [data?.templateCode]);

  if (!data?.templateCode) return <p>Missing templateCode</p>;
  if (!DynamicTemplate) return <p>Template not found: {data.templateCode}</p>;

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
      <Suspense fallback={<p>Loading template...</p>}>
        <DynamicTemplate data={contents[currentIndex]} />
      </Suspense>

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
