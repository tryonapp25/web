import { lazy, Suspense, useMemo } from "react";
import styles from "./DEFAULT.module.css";

const templateModules = import.meta.glob("../menu/*.jsx");

export default function TemplateLoader({ data }) {
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

  return (
    <main className={styles.main}>
      <Suspense fallback={<p>Loading template...</p>}>
        {contents.map((content, index) => (
          <DynamicTemplate key={index} data={content} />
        ))}
      </Suspense>
    </main>
  );
}
