import { useState, useEffect, useContext, useMemo, useRef } from "react";
import http from "../http/http";
import styles from "../styles/BusinessSetting.module.css";
import { UserContext } from "../ApiContext/userContext";
import { SocketContext } from "../ApiContext/socketContext";
import Sidebar from "../components_business/businessSidebar";
import FlashMessage from "../components/flashMessage"

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
      description: "",
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
      _saving: !!f._saving,
      _error: f._error ?? "",
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
            {busyId ? <span className={styles.pill}>Business: #{busyId}</span> : null}
            {f.featureId ? <span className={styles.pill}>Feature: #{f.featureId}</span> : null}
            <span className={`${styles.pill} ${f.isEnabled ? styles.enabled : styles.disabled}`}>
              {f.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {f._error ? <div className={styles.errorText}>{f._error}</div> : null}
        </div>
      ))}
    </div>
  );
}

// ---------- Open Hours Editor ----------
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function parseOpenHours(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function OpenHoursEditor({ value, onChange }) {
  const hours = parseOpenHours(value);

  const handleDayChange = (day, field, val) => {
    const updated = { ...hours };
    if (!updated[day]) updated[day] = { open: "09:00", close: "17:00" };
    updated[day] = { ...updated[day], [field]: val };
    onChange(updated);
  };

  const handleToggleClosed = (day, isClosed) => {
    const updated = { ...hours };
    if (isClosed) {
      updated[day] = null;
    } else {
      updated[day] = { open: "09:00", close: "17:00" };
    }
    onChange(updated);
  };

  return (
    <div className={styles.openHoursEditor}>
      {DAYS.map((day) => {
        const dayData = hours[day];
        const isClosed = dayData === null || dayData === undefined;
        return (
          <div key={day} className={styles.dayRow}>
            <div className={styles.dayName}>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
            <div className={styles.dayControls}>
              <label className={styles.closedToggle}>
                <input
                  type="checkbox"
                  checked={isClosed}
                  onChange={(e) => handleToggleClosed(day, e.target.checked)}
                />
                <span>Closed</span>
              </label>
              {!isClosed && (
                <>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={dayData?.open ?? "09:00"}
                    onChange={(e) => handleDayChange(day, "open", e.target.value)}
                  />
                  <span className={styles.timeSeparator}>–</span>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={dayData?.close ?? "17:00"}
                    onChange={(e) => handleDayChange(day, "close", e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- page ----------
export default function BusinessSetting() {
  const fetchingRef = useRef(false);
  const { publicUser, setPublicUser } = useContext(UserContext);
  const { setOrderFeatureEnabled } = useContext(SocketContext);

  const businessId = publicUser?.business?.id;

  const [rawFeatures, setRawFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({visible: false, msg: "", type: "" });

  const features = useMemo(() => normalizeFeatures(rawFeatures), [rawFeatures]);

  useEffect(() => {
    if (!businessId) return;
    if (fetchingRef.current) return; // prevent duplicate fetches
    fetchingRef.current = true;
    fetchBusinessFeature();
    setBusinessData(publicUser.business);
  }, [businessId]);

  async function fetchBusinessFeature() {
    try {
      // features
      const res = await http.get(`/business/${businessId}/features`);
      if (res?.data?.success) {
        setRawFeatures(res.data.data);
      } else {
        console.error("API returned success=false", res?.data);
      }

      // OPTIONAL: if you have an endpoint to fetch business info, uncomment:
      // const resBiz = await http.get(`/business/${businessId}`);
      // if (resBiz?.data?.success) setBusinessData(resBiz.data.data);

    } catch (err) {
      console.error("Failed to fetch business info:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(feature, nextEnabled) {
    // optimistic update (also mark as saving)
    setRawFeatures((prev) => {
      const list = normalizeFeatures(prev).map((f) => {
        const same =
          (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
        return same ? { ...f, isEnabled: nextEnabled, _saving: true, _error: "" } : f;
      });
      return list; // store as array from now on
    });

    try {
      await http.put(`/business/feature`, {
        businessId,
        featureId: feature.featureId,
        name: feature.name,
        isEnabled: nextEnabled,
      });

      // clear saving state
      setRawFeatures((prev) =>
        normalizeFeatures(prev).map((f) => {
          const same =
            (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
          return same ? { ...f, _saving: false, _error: "" } : f;
        })
      );

      setOrderFeatureEnabled(nextEnabled);
    } catch (err) {
      console.error("Failed to update feature:", err);

      // revert + show error
      setRawFeatures((prev) =>
        normalizeFeatures(prev).map((f) => {
          const same =
            (feature.featureId && f.featureId === feature.featureId) || f.name === feature.name;
          return same
            ? {
                ...f,
                isEnabled: !nextEnabled,
                _saving: false,
                _error: "Failed to update. Please try again.",
              }
            : f;
        })
      );
    }
  }

  async function handleSaveBusiness() {
    if (!businessId || !businessData) return;
    setSaving(true);

    try {
      const payload = {
        id: businessId,
        uid: businessData.uid,
        name: businessData.name,
        description: businessData.description,
        address: businessData.address,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website,
        openHours: businessData.openHours,
      };

      const res = await http.put(`/business/${businessId}/info`, payload);
      if (res?.data?.success) {
        setPublicUser((u) => ({ ...u, business: { ...u.business, ...payload } }));
        setMessage({visible: true, msg: "Business updated successfully.", type: "success"});
      } else {
        console.error("Update failed:", res?.data);
        setMessage({visible: true, msg: "Failed to update business.", type: "error"});
      }
    } catch (err) {
      console.error("Error updating business:", err);
      setMessage({visible: true, msg: "Error updating business. See console.", type: "error"});
    } finally {
      setSaving(false);
    }
  }

  function handleFieldChange(field, value) {
    setBusinessData((b) => ({ ...(b || {}), [field]: value }));
  }

  if (loading) {
    return (
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.main}>
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.pageTitle}>Business Settings</div>
              <div className={styles.pageSubtitle}>Manage your features and business profile.</div>
            </div>
          </div>

          <div className={styles.skeletonGrid}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <FlashMessage message={message.msg} type={message.type} show={message.visible} onClose={() => setMessage({visible: false, msg: "", type: ""})} />

      <div className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageTitle}>Business Settings</div>
            <div className={styles.pageSubtitle}>Manage your features and business profile.</div>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.primaryButton}
              onClick={handleSaveBusiness}
              disabled={saving || !businessId || !businessData}
              title={!businessData ? "Business info not loaded" : ""}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <div className={styles.twoColumnLayout}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.panelTitle}>Features</div>
                <div className={styles.panelSubtitle}>
                  Enable or disable modules for your business.
                </div>
              </div>
            </div>

            <FeaturesGrid features={features} busyId={businessId} onToggle={handleToggle} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.panelTitle}>Business Info</div>
                <div className={styles.panelSubtitle}>Keep your profile up to date.</div>
              </div>
            </div>

            <div className={styles.businessForm}>
              {/* <div className={styles.row}>
                <label>Id</label>
                <div className={styles.readOnlyValue}>{businessData?.id ?? businessId ?? "-"}</div>
              </div>

              <div className={styles.row}>
                <label>UID</label>
                <div className={styles.readOnlyValue}>{businessData?.uid ?? "-"}</div>
              </div> */}

              <div className={styles.row}>
                <label>Name</label>
                <input
                  value={businessData?.name ?? ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Business name"
                />
              </div>

              <div className={styles.row}>
                <label>Description</label>
                <textarea
                  value={businessData?.description ?? ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Short description..."
                />
              </div>

              <div className={styles.rowDouble}>
                <div className={styles.field}>
                  <label>Address</label>
                  <input
                    value={businessData?.address ?? ""}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    placeholder="Street, city..."
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    value={businessData?.phone ?? ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="+45 ..."
                  />
                </div>
              </div>

              <div className={styles.row}>
                <label>Email</label>
                <input
                  value={businessData?.email ?? ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="name@company.com"
                />
              </div>

              <div className={styles.row}>
                <label>Website</label>
                <input
                  value={businessData?.website ?? ""}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.row}>
                <label>Open Hours</label>
                <OpenHoursEditor
                  value={businessData?.openHours}
                  onChange={(val) => handleFieldChange("openHours", val)}
                />
              </div>
              <div className={styles.formFooter}>
                <button
                  className={styles.secondaryButton}
                  onClick={handleSaveBusiness}
                  disabled={saving || !businessData}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}