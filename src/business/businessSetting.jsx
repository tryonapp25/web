import { useState, useEffect, useContext, useMemo, useRef } from "react";
import http from "../http/http";
import styles from "../styles/BusinessSetting.module.css";
import { UserContext } from "../ApiContext/userContext";
import { SocketContext } from "../ApiContext/socketContext";
import Sidebar from "../components_business/businessSidebar";

// ---------- helpers ----------
function normalizeFeatures(input) {
  if (!input) return [];

  // If backend returns map: { featureName: boolean }
  if (!Array.isArray(input) && typeof input === "object") {
    return Object.entries(input).map(([name, isEnabled]) => ({
      name,
      isEnabled: !!isEnabled,
      featureId: null,
      businessId: null,
    }));
  }

  // If backend returns array of objects
  if (Array.isArray(input)) {
    return input.map((f) => ({
      name: f.name ?? f.featureName ?? "",
      isEnabled: !!(f.isEnabled ?? f.enabled),
      featureId: f.featureId ?? f.id ?? null,
      businessId: f.businessId ?? null,
      description: f.description ?? "",
    }));
  }

  return [];
}

// ---------- UI components ----------
function Toggle({ checked, disabled, onChange, label }) {
  return (
    <label className={styles.toggleWrap} aria-label={label}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.toggleTrack} />
    </label>
  );
}

function FeaturesGrid({ features, busyId, onToggle }) {
  if (!features?.length) {
    return <div className={styles.emptyState}>No features found.</div>;
  }

  return (
    <div className={styles.featuresGrid}>
      {features.map((f) => (
        <div key={f.featureId ?? f.name} className={styles.featureCard}>
          <div className={styles.featureCardHeader}>
            <div>
              <div className={styles.featureTitle}>{f.name}</div>
              {f.description ? (
                <div className={styles.featureDesc}>{f.description}</div>
              ) : (
                <div className={styles.featureDescMuted}>
                  Enable/disable this feature for your business.
                </div>
              )}
            </div>

            <Toggle
              checked={f.isEnabled}
              disabled={!!f._saving}
              label={`Toggle ${f.name}`}
              onChange={(next) => onToggle(f, next)}
            />
          </div>

          <div className={styles.featureMeta}>
            {busyId ? <span>Business: #{busyId}</span> : null}
            {f.featureId ? <span>Feature: #{f.featureId}</span> : null}
            <span className={f.isEnabled ? styles.enabled : styles.disabled}>
              {f.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {f._error ? <div className={styles.errorText}>{f._error}</div> : null}
        </div>
      ))}
    </div>
  );
}

// ---------- page ----------
export default function BusinessSetting() {
  const fetchingRef = useRef(false);
  const { publicUser } = useContext(UserContext);
  const { setOrderFeatureEnabled } = useContext(SocketContext);

  const businessId = publicUser?.business?.id;

  const [rawFeatures, setRawFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  const features = useMemo(() => normalizeFeatures(rawFeatures), [rawFeatures]);

  useEffect(() => {
    if (!businessId) return;

    async function fetchBusinessInfo() {
      try {
        if (fetchingRef.current) return; // prevent duplicate fetches
        fetchingRef.current = true;
        const res = await http.get(`/business/features/business/${businessId}`);
        if (res?.data?.success) {
          setRawFeatures(res.data.data);
        } else {
          console.error("API returned success=false", res?.data);
        }
      } catch (err) {
        console.error("Failed to fetch business info:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessInfo();
  }, [businessId]);

  async function handleToggle(feature, nextEnabled) {
    // optimistic update (also mark as saving)
    setRawFeatures((prev) => {
      const list = normalizeFeatures(prev).map((f) => {
        const same = (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
        return same ? { ...f, isEnabled: nextEnabled, _saving: true, _error: "" } : f;
      });
      return list; // store as array from now on (fine)
    });

    try {
      await http.put(`/business/feature`, {
        businessId,
        featureId: feature.featureId,
        name: feature.name, // helpful if backend toggles by name
        isEnabled: nextEnabled,
      });

      // clear saving state
      setRawFeatures((prev) =>
        normalizeFeatures(prev).map((f) => {
          const same = (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
          return same ? { ...f, _saving: false, _error: "" } : f;
        })
      );
      setOrderFeatureEnabled(nextEnabled); // immediately reflect socket-related changes
    } catch (err) {
      console.error("Failed to update feature:", err);

      // revert + show error
      setRawFeatures((prev) =>
        normalizeFeatures(prev).map((f) => {
          const same = (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
          return same
            ? {
                ...f,
                isEnabled: !nextEnabled, // revert
                _saving: false,
                _error: "Failed to update. Please try again.",
              }
            : f;
        })
      );
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <h2>Business Settings</h2>

        <h3 className={styles.sectionTitle}>Features</h3>
        <FeaturesGrid features={features} busyId={businessId} onToggle={handleToggle} />
      </div>
    </div>
  );
}