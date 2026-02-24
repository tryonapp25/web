import React, { useEffect, useState, useMemo } from "react";
import styles from "../styles/CreateTemplate.module.css";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import FlashMessage from "../components/flashMessage";

const defaultMsg = { visible: false, type: "", msg: "" };

const emptyPackage = {
  id: "",
  pack: "",
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
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyPackage);
  const [message, setMessage] = useState(defaultMsg);
  const [loading, setLoading] = useState(false);

  const createMode = selectedId === "";
  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!selectedId) return setForm(emptyPackage);
    const p = packages.find((x) => x.id === selectedId) || null;
    setForm(p ? { ...p, items: p.items || [] } : emptyPackage);
  }, [selectedId, packages]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await http.get(`/business/pricing`);
      if (res.data?.success) {
        setPackages(res.data.data || []);
        if ((res.data.data || []).length > 0) setSelectedId((res.data.data || [])[0].id || "");
      } else {
        setMessage({ visible: true, type: "error", msg: res.data?.message || "Failed to load pricing" });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const itemsText = useMemo(() => (form.items || []).join("\n"), [form.items]);

  const handleUpdate = async () => {
    // basic validation
    if (!form.pack || form.pack.trim() === "") return setMessage({ visible: true, type: "warn", msg: "Pack name is required" });
    try {
      setLoading(true);
      const payload = { ...form, items: (form.items || []) };
      // backend admin update endpoint - adjust if different
      const res = await http.put(`/admin/business/pricing`, payload);
      if (res.data?.success) {
        setMessage({ visible: true, type: "success", msg: res.data.message || "Updated" });
        // refresh list
        await fetchPackages();
      } else {
        setMessage({ visible: true, type: "error", msg: res.data?.message || "Update failed" });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.pack || form.pack.trim() === "") return setMessage({ visible: true, type: "warn", msg: "Pack name is required" });
    try {
      setLoading(true);
      const payload = { ...form, items: (form.items || []) };
      const res = await http.post(`/admin/business/pricing`, payload);
      if (res.data?.success) {
        setMessage({ visible: true, type: "success", msg: res.data.message || "Created" });
        await fetchPackages();
      } else {
        setMessage({ visible: true, type: "error", msg: res.data?.message || "Create failed" });
      }
    } catch (err) {
      setMessage({ visible: true, type: "error", msg: httpMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleItemsChange = (text) => {
    const arr = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange("items", arr);
  };

  const handleDelete = async () => {
    if (!form.id) return setMessage({ visible: true, type: "warn", msg: "Select a package to delete" });
    if (!confirm("Delete this pricing package?")) return;
    try {
      setLoading(true);
      const res = await http.delete(`/admin/business/pricing/${form.id}`);
      if (res.data?.success) {
        setMessage({ visible: true, type: "success", msg: res.data.message || "Deleted" });
        await fetchPackages();
        setSelectedId("");
      } else {
        setMessage({ visible: true, type: "error", msg: res.data?.message || "Delete failed" });
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
              setSelectedId("");
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
        <input className={styles.input} value={form.pack} onChange={(e) => onChange("pack", e.target.value)} />

        <label className={styles.label}>Price</label>
        <input className={styles.input} type="number" value={form.price} onChange={(e) => onChange("price", parseFloat(e.target.value || 0))} />

        <label className={styles.label}>Currency</label>
        <input className={styles.input} value={form.currency} onChange={(e) => onChange("currency", e.target.value)} />

        <label className={styles.label}>Tokens</label>
        <input className={styles.input} type="number" value={form.tokens} onChange={(e) => onChange("tokens", parseInt(e.target.value || 0))} />

        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} value={form.description} onChange={(e) => onChange("description", e.target.value)} />

        <label className={styles.label}>Items (one per line)</label>
        <textarea className={styles.textarea} value={itemsText} onChange={(e) => handleItemsChange(e.target.value)} />

        <div style={{ marginTop: 8 }}>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" checked={!!form.highlighted} onChange={(e) => onChange("highlighted", e.target.checked)} /> Highlighted
          </label>
          <label>
            <input type="checkbox" checked={!!form.popular} onChange={(e) => onChange("popular", e.target.checked)} /> Popular
          </label>
        </div>

        <div className={styles.buttonGroup} style={{ marginTop: 12 }}>
          {createMode && <button className={styles.primary} onClick={handleCreate} disabled={loading}>Create</button>}
          <button className={styles.secondary} onClick={handleUpdate} disabled={loading}>Update</button>
          <button className={styles.secondary} onClick={handleDelete} disabled={loading}>Delete</button>
        </div>

        <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage(defaultMsg)} />
      </aside>

      <main className={styles.right}>
        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {packages.map((p) => {
            const selected = p.id === selectedId;
            return (
              <div
                key={p.id || p.pack}
                className={styles.card}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: 14,
                  cursor: "pointer",
                  borderColor: selected ? "rgba(139,124,255,0.85)" : undefined,
                  boxShadow: selected ? "0 12px 30px rgba(0,0,0,0.4)" : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 800 }}>{p.pack}</div>
                  <div style={{ fontSize: 12, color: "#9aa3b2" }}>{p.tokens} tokens</div>
                </div>

                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>{(p.currency || "usd").toLowerCase() === "usd" ? "$" : "dkk"} {p.price}</div>
                  <div style={{ color: "#9aa3b2", fontSize: 12 }}>one-time</div>
                </div>

                <p style={{ color: "#9aa3b2", marginTop: 8 }}>{p.description}</p>

                <ul style={{ margin: 0, padding: 0, listStyle: "none", marginTop: 8 }}>
                  {(p.items || []).slice(0, 4).map((it) => (
                    <li key={it} style={{ color: "#9aa3b2", fontSize: 13 }}>{it}</li>
                  ))}
                </ul>

                <div style={{ marginTop: 8 }}>
                  {p.highlighted && <span className={styles.ribbon}>Highlighted</span>}
                  {p.popular && <span style={{ marginLeft: 8, fontWeight: 800 }}>Popular</span>}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
