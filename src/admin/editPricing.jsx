import React, { useEffect, useState } from "react";
import styles from "../styles/CreateTemplate.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";

const defaultMsg = { visible: false, type: "", msg: "" };

const emptyPackage = {
  id: 0,
  pack: "",
  type: "business_package",
  price: 0,
  currency: "usd",
  tokens: 0,
  description: "",
  items: [],
  highlighted: false,
  popular: false,
};

export default function EditPricing() {
  const [packages, setPackages] = useState([]);
  const [appFeatures, setAppFeatures] = useState([]);

  const [selectedId, setSelectedId] = useState(0);
  const [form, setForm] = useState(emptyPackage);
  const [message, setMessage] = useState(defaultMsg);
  const [loading, setLoading] = useState(false);

  const createMode = selectedId === 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [features, pricingPackages] = await Promise.all([
          fetchAppFeatures(),
          fetchPackages(),
        ]);

        setAppFeatures(features);
        setPackages(pricingPackages);
      } catch (err) {
        console.error(err);
        setMessage({
          visible: true,
          type: "error",
          msg: "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setForm(emptyPackage);
      return;
    }

    const p = packages.find((x) => x.id === selectedId) || null;
    setForm(p ? { ...p, items: parseItems(p.items) } : emptyPackage);
  }, [selectedId, packages]);

  const fetchPackages = async () => {
    try {
      const res = await http.get(`/business/pricing`);
      if (res.data?.success) {
        const data = res.data.data || [];
        if (data.length > 0) setSelectedId(data[0].id || 0);
        return data;
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Failed to load pricing",
        });
        return [];
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
      return [];
    }
  };

  const fetchAppFeatures = async () => {
    try {
      const res = await http.get(`/features`);
      if (res.data?.success) {
        return res.data.data || [];
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Failed to load app features",
        });
        return [];
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
      return [];
    }
  };

  const onChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const parseItems = (items) => {
    if (!items) return [];

    if (Array.isArray(items)) {
      return items.map((it) => {
        if (typeof it === "string") {
          const feature = appFeatures.find(
            (f) => String(f.name).toLowerCase() === String(it).toLowerCase()
          );

          return feature
            ? {
                id: feature.id,
                name: feature.name,
                description: feature.description,
                included: true,
              }
            : {
                id: "",
                name: it,
                description: "",
                included: true,
              };
        }

        return {
          id: it.id || "",
          name: it.name || "",
          description: it.description || "",
          included: it.included ?? true,
        };
      });
    }

    if (typeof items === "string") {
      const s = items.trim();

      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map((it) =>
            typeof it === "string"
              ? { id: "", name: it, description: "", included: true }
              : {
                  id: it.id || "",
                  name: it.name || "",
                  description: it.description || "",
                  included: it.included ?? true,
                }
          );
        }
      } catch (e) {
        return s
          .split(/\r?\n/)
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => ({
            id: "",
            name: x,
            description: "",
            included: true,
          }));
      }
    }

    return [];
  };

  const handleFeatureChange = (idx, featureId) => {
    const feature = appFeatures.find((f) => String(f.id) === String(featureId));
    if (!feature) return;

    const arr = [...(form.items || [])];
    arr[idx] = {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      included: arr[idx]?.included ?? true,
    };
    onChange("items", arr);
  };

  const handleUpdate = async () => {
    if (!form.pack || form.pack.trim() === "") {
      return setMessage({
        visible: true,
        type: "warn",
        msg: "Pack name is required",
      });
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        items: parseItems(form.items),
      };

      const res = await http.put(`/admin/business/pricing`, payload);

      if (res.data?.success) {
        setMessage({
          visible: true,
          type: "success",
          msg: res.data.message || "Updated",
        });

        const refreshedPackages = await fetchPackages();
        setPackages(refreshedPackages);
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Update failed",
        });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.pack || form.pack.trim() === "") {
      return setMessage({
        visible: true,
        type: "warn",
        msg: "Pack name is required",
      });
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        items: parseItems(form.items),
      };

      const res = await http.post(`/admin/business/pricing`, payload);

      if (res.data?.success) {
        setMessage({
          visible: true,
          type: "success",
          msg: res.data.message || "Created",
        });

        const refreshedPackages = await fetchPackages();
        setPackages(refreshedPackages);
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Create failed",
        });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      return setMessage({
        visible: true,
        type: "warn",
        msg: "Select a package to delete",
      });
    }

    if (!window.confirm("Delete this pricing package?")) return;

    try {
      setLoading(true);
      const res = await http.delete(`/admin/business/pricing/${form.id}`);

      if (res.data?.success) {
        setMessage({
          visible: true,
          type: "success",
          msg: res.data.message || "Deleted",
        });

        const refreshedPackages = await fetchPackages();
        setPackages(refreshedPackages);
        setSelectedId(0);
      } else {
        setMessage({
          visible: true,
          type: "error",
          msg: res.data?.message || "Delete failed",
        });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <h2 className={styles.title}>Pricing Packages</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className={styles.secondary}
            onClick={() => {
              setSelectedId(0);
              setForm(emptyPackage);
            }}
          >
            Create new
          </button>
          <div style={{ color: "#9aa3b2", fontSize: 13 }}>
            {packages.length} packages
          </div>
        </div>

        <label className={styles.label}>Pack name</label>
        <input
          className={styles.input}
          value={form.pack}
          onChange={(e) => onChange("pack", e.target.value)}
        />

        <label className={styles.label}>Type</label>
        <input
          className={styles.input}
          value={form.type}
          onChange={(e) => onChange("type", e.target.value)}
        />

        <label className={styles.label}>Price</label>
        <input
          className={styles.input}
          type="number"
          value={form.price}
          onChange={(e) => onChange("price", parseFloat(e.target.value || 0))}
        />

        <label className={styles.label}>Currency</label>
        <input
          className={styles.input}
          value={form.currency}
          onChange={(e) => onChange("currency", e.target.value)}
        />

        <label className={styles.label}>Tokens</label>
        <input
          className={styles.input}
          type="number"
          value={form.tokens}
          onChange={(e) => onChange("tokens", parseInt(e.target.value || 0, 10))}
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />

        <label className={styles.label}>Items</label>
        {(form.items || []).map((it, idx) => (
          <div key={idx} style={{ marginBottom: 12, display: "grid", gap: 8 }}>
            <select
              className={styles.input}
              value={it.id || ""}
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
            >
              <option value="">Select feature</option>
              {appFeatures.map((feature) => (
                <option key={feature.id} value={feature.id}>
                  {feature.name}
                </option>
              ))}
            </select>

            <input
              className={styles.input}
              placeholder="Description"
              value={it.description || ""}
              readOnly
            />

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={!!it.included}
                onChange={(e) => {
                  const arr = [...(form.items || [])];
                  arr[idx] = { ...arr[idx], included: e.target.checked };
                  onChange("items", arr);
                }}
              />
              Included
            </label>

            <div>
              <button
                className={styles.secondary}
                onClick={() => {
                  const arr = [...(form.items || [])];
                  arr.splice(idx, 1);
                  onChange("items", arr);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <button
            className={styles.secondary}
            onClick={() =>
              onChange("items", [
                ...(form.items || []),
                { id: "", name: "", description: "", included: true },
              ])
            }
          >
            Add feature
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              checked={!!form.highlighted}
              onChange={(e) => onChange("highlighted", e.target.checked)}
            />{" "}
            Highlighted
          </label>
          <label>
            <input
              type="checkbox"
              checked={!!form.popular}
              onChange={(e) => onChange("popular", e.target.checked)}
            />{" "}
            Popular
          </label>
        </div>

        <div className={styles.buttonGroup} style={{ marginTop: 12 }}>
          {createMode && (
            <button
              className={styles.primary}
              onClick={handleCreate}
              disabled={loading}
            >
              Create
            </button>
          )}
          <button
            className={styles.secondary}
            onClick={handleUpdate}
            disabled={loading}
          >
            Update
          </button>
          <button
            className={styles.secondary}
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
        </div>

        <FlashMessage
          show={message.visible}
          type={message.type}
          message={message.msg}
          onClose={() => setMessage(defaultMsg)}
        />
      </aside>

      <main className={styles.right}>
        <div
          style={{
            padding: 24,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {packages.map((p) => {
            const selected = p.id === selectedId;
            const parsedItems = parseItems(p.items);

            return (
              <div
                key={p.id || p.pack}
                className={styles.card}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: 14,
                  cursor: "pointer",
                  borderColor: selected
                    ? "rgba(139,124,255,0.85)"
                    : undefined,
                  boxShadow: selected
                    ? "0 12px 30px rgba(0,0,0,0.4)"
                    : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{p.pack}</div>
                  <div style={{ fontSize: 12, color: "#9aa3b2" }}>
                    {p.tokens} tokens
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 20 }}>
                    {(p.currency || "usd").toLowerCase() === "usd" ? "$" : "dkk"}{" "}
                    {p.price}
                  </div>
                  <div style={{ color: "#9aa3b2", fontSize: 12 }}>one-time</div>
                </div>

                <p style={{ color: "#9aa3b2", marginTop: 8 }}>
                  {p.description}
                </p>

                <div
                  style={{
                    background: "transparent",
                    padding: 8,
                    borderRadius: 6,
                    color: "#24303a",
                    fontSize: 12,
                    overflow: "auto",
                    maxWidth: 480,
                    marginTop: 8,
                  }}
                >
                  {parsedItems.length > 0 &&
                    parsedItems.map((it, idx) => (
                      <div
                        key={it.id || `${it.name}-${idx}`}
                        className={styles.item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <span className={styles.check}>✓</span>
                        <span style={{ color: "var(--text)" }}>
                          {it.name || it.description}
                        </span>
                      </div>
                    ))}
                </div>

                <div style={{ marginTop: 8 }}>
                  {p.highlighted && (
                    <span className={styles.ribbon}>Highlighted</span>
                  )}
                  {p.popular && (
                    <span style={{ marginLeft: 8, fontWeight: 800 }}>
                      Popular
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}