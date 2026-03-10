import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const templateModules = import.meta.glob([
  "../menu/*.jsx",
  "../posters/*.jsx",
]);

// Component to load a single content item with its own template
function ContentItem({ content, currentIndex, onClickModel }) {
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
      <DynamicTemplate data={content} onClickModel={onClickModel} />
    </Suspense>
  );
}

export default function Template({ data = {}, pressable, onPress, onClickModel, curentContent }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contents = Array.isArray(data?.contents) ? data.contents : [];
  if (contents.length === 0) return <p>No content available</p>;

  const next = () => {
    setCurrentIndex((prev) => (prev < contents.length - 1 ? prev + 1 : prev));
    curentContent(contents[currentIndex + 1])
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    curentContent(contents[currentIndex - 1])
  };

  const onSelectedTemplate = () => {
    if(!pressable) return;
    onPress(data);
  }

  return (
    <main
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        cursor: "pointer",
      }}
      onClick={onSelectedTemplate}
    >
      <ContentItem
        content={contents[currentIndex]}
        currentIndex={currentIndex}
        onClickModel={(d) => onClickModel(d)}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          transform: "translateY(-50%)",
          zIndex: 99,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "999px",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: currentIndex === 0 ? 0.4 : 1,
        }}
      >
        ◀
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        disabled={currentIndex === contents.length - 1}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          zIndex: 999,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "999px",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: currentIndex === contents.length - 1 ? 0.4 : 1,
        }}
      >
        ▶
      </button>
    </main>
  );
}
