// ────────────────────────────────────────────────────────────────
export default function Model3D({ model, images, config, allowShowModel = false }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  const posterUrl = images?.[0] ?? null;

  useEffect(() => {
    if (!allowShowModel) return;
    setIsMobile(window.matchMedia("(max-width: 768px)").matches || /Mobi|Android/i.test(navigator.userAgent));
  }, [allowShowModel]);

  // Option A: Load only when in viewport (most recommended for mobile)
  useEffect(() => {
    if (!allowShowModel || !containerRef.current || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" } // start loading ~200px before visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [allowShowModel, shouldLoad]);

  // Option B: Load on first user interaction (tap/click)
  // const handleShowModel = () => !shouldLoad && setShouldLoad(true);

  useEffect(() => {
    if (!viewerRef.current) return;
    const onLoad = () => setModelLoaded(true);
    viewerRef.current.addEventListener("load", onLoad);
    return () => viewerRef.current?.removeEventListener("load", onLoad);
  }, [shouldLoad]);

  if (!model || !allowShowModel) return null;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* Poster or fallback loading animation */}
      {!modelLoaded && (
        <>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt="3D model preview"
              className={styles.poster}
              // Important: use decoding="async" + fetchpriority="low" if poster is large
              decoding="async"
              fetchPriority="low"
            />
          ) : (
            // your cat loading lottie
            <Suspense fallback={null}>
              <Lottie
                animationData={loading}
                loop
                autoplay
                style={{ width: "90%", height: "90%" }}
              />
            </Suspense>
          )}
        </>
      )}

      {/* The model viewer – only mount when we decide to load */}
      {shouldLoad && (
        <model-viewer
          ref={viewerRef}
          src={model}
          alt="3D model"
          poster={posterUrl || ""}
          camera-controls
          touch-action="pan-y"
          loading="lazy"           // ← most important change
          reveal="auto"            // or "manual" if you want to call .showModel() later
          // reveal-when-visible    ← experimental in some versions – check docs
          interaction-prompt="when-focused"
          environment-image="neutral"
          shadow-intensity="0.6"
          exposure="0.9"
          camera-orbit={config?.camera_orbit || "0deg 75deg auto"}
          disable-pan
          className={styles.popModel}
          style={{ opacity: modelLoaded ? 1 : 0.01, transition: "opacity 0.4s" }}
          {...(!isMobile && { "auto-rotate": true, "auto-rotate-delay": "3000" })}
        />
      )}

      {/* Optional: tap-to-load overlay when poster is shown */}
      {!shouldLoad && posterUrl && (
        <button
          className={styles.loadButton}
          onClick={() => setShouldLoad(true)}
          aria-label="Load 3D model"
        >
          View in 3D
        </button>
      )}
    </div>
  );
}