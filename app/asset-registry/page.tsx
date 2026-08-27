"use client";

import { useEffect, useMemo, useState } from "react";

type SolutionAsset = {
  id: string;
  name: string;
  slug: string;
  url: string;
  family?: string | null;
  asset_type?: string | null;
  markets?: string[] | null;
  sectors?: string[] | null;
  use_cases?: string[] | null;
  commercial_status?: string | null;
  description?: string | null;
  best_used_for?: string | null;
  related_products?: string[] | null;
  notes?: string | null;
  last_reviewed_date?: string | null;
  is_active?: boolean | null;
  sort_order?: number | null;
};

type FormState = {
  name: string;
  slug: string;
  url: string;
  family: string;
  asset_type: string;
  markets: string;
  sectors: string;
  use_cases: string;
  commercial_status: string;
  description: string;
  best_used_for: string;
  related_products: string;
  notes: string;
  last_reviewed_date: string;
  is_active: boolean;
  sort_order: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  url: "",
  family: "",
  asset_type: "proof-asset",
  markets: "",
  sectors: "",
  use_cases: "",
  commercial_status: "active",
  description: "",
  best_used_for: "",
  related_products: "",
  notes: "",
  last_reviewed_date: "",
  is_active: true,
  sort_order: "0",
};

const accent = "#5B8CFF";
const green = "#43B581";
const amber = "#D9A441";
const violet = "#9B7CF6";

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "999px",
  background: "#0b0b0b",
  color: "#fff",
  padding: "10px 14px",
  textDecoration: "none",
  cursor: "pointer",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#0a0a0a",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "13px",
  padding: "12px 13px",
  fontSize: "15px",
};

function csv(value?: string[] | null) {
  return (value || []).join(", ");
}

function arrayFromCsv(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AssetRegistryPage() {
  const [assets, setAssets] = useState<SolutionAsset[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadAssets() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/assets?active_only=false", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load assets.");
        return;
      }

      setAssets(data.assets || []);
    } catch {
      setMessage("Something went wrong loading the Asset Registry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assets;

    return assets.filter((asset) => {
      const haystack = [
        asset.name,
        asset.family,
        asset.asset_type,
        asset.commercial_status,
        ...(asset.markets || []),
        ...(asset.sectors || []),
        ...(asset.use_cases || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [assets, search]);

  const activeCount = assets.filter((asset) => asset.is_active !== false).length;
  const familyCount = new Set(assets.map((asset) => asset.family).filter(Boolean)).size;
  const namibiaCount = assets.filter((asset) =>
    (asset.markets || []).some((market) => market.toLowerCase() === "namibia")
  ).length;

  function updateForm(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(asset: SolutionAsset) {
    setEditingId(asset.id);
    setForm({
      name: asset.name || "",
      slug: asset.slug || "",
      url: asset.url || "",
      family: asset.family || "",
      asset_type: asset.asset_type || "proof-asset",
      markets: csv(asset.markets),
      sectors: csv(asset.sectors),
      use_cases: csv(asset.use_cases),
      commercial_status: asset.commercial_status || "active",
      description: asset.description || "",
      best_used_for: asset.best_used_for || "",
      related_products: csv(asset.related_products),
      notes: asset.notes || "",
      last_reviewed_date: asset.last_reviewed_date || "",
      is_active: asset.is_active !== false,
      sort_order: String(asset.sort_order ?? 0),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAsset() {
    if (!form.name.trim() || !form.url.trim()) {
      setMessage("Name and URL are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      url: form.url.trim(),
      family: form.family.trim(),
      asset_type: form.asset_type,
      markets: arrayFromCsv(form.markets),
      sectors: arrayFromCsv(form.sectors),
      use_cases: arrayFromCsv(form.use_cases),
      commercial_status: form.commercial_status,
      description: form.description.trim(),
      best_used_for: form.best_used_for.trim(),
      related_products: arrayFromCsv(form.related_products),
      notes: form.notes.trim(),
      last_reviewed_date: form.last_reviewed_date || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order || 0),
    };

    try {
      const response = await fetch(
        editingId ? `/api/assets/${editingId}` : "/api/assets",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not save asset.");
        return;
      }

      setMessage(editingId ? "Asset updated." : "Asset added to Alfred.");
      resetForm();
      await loadAssets();
    } catch {
      setMessage("Something went wrong saving the asset.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAsset(asset: SolutionAsset) {
    if (!window.confirm(`Delete ${asset.name}? This cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not delete asset.");
        return;
      }

      setMessage(`${asset.name} deleted.`);
      await loadAssets();
    } catch {
      setMessage("Something went wrong deleting the asset.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "28px 18px 60px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
          <div>
            <div style={{ fontSize: "26px", fontWeight: 800 }}>Alfred</div>
            <div style={{ color: "#999", fontSize: "14px" }}>Product & Proof Asset Registry</div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href="/" style={buttonStyle}>Mission Control</a>
            <a href="/alfred" style={buttonStyle}>Command Centre</a>
          </div>
        </nav>

        <section style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "26px", padding: "28px", background: "rgba(255,255,255,0.025)" }}>
          <div style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Alfred Asset Registry
          </div>

          <h1 style={{ margin: "10px 0 12px", fontSize: "clamp(38px, 7vw, 68px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>
            What have we built?
          </h1>

          <p style={{ color: "#aaa", maxWidth: "760px", lineHeight: 1.6, fontSize: "17px" }}>
            Give Alfred a structured view of every product, demo, proof asset and commercial tool so he can choose the right asset for a prospect, proposal, campaign or market-entry conversation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginTop: "22px" }}>
            <Stat label="Assets" value={assets.length} colour={accent} />
            <Stat label="Active" value={activeCount} colour={green} />
            <Stat label="Families" value={familyCount} colour={violet} />
            <Stat label="Namibia" value={namibiaCount} colour={amber} />
          </div>
        </section>

        <section style={{ marginTop: "22px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "26px", padding: "24px", background: "rgba(255,255,255,0.025)" }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? "Edit asset" : "Add new asset"}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            <Field label="Name" value={form.name} onChange={(value) => {
              updateForm("name", value);
              if (!editingId && !form.slug) updateForm("slug", slugify(value));
            }} />
            <Field label="Slug" value={form.slug} onChange={(value) => updateForm("slug", value)} />
            <Field label="URL" value={form.url} onChange={(value) => updateForm("url", value)} />
            <Field label="Family" value={form.family} onChange={(value) => updateForm("family", value)} />
            <Field label="Asset type" value={form.asset_type} onChange={(value) => updateForm("asset_type", value)} placeholder="live-product, demo, proof-asset, calculator" />
            <Field label="Commercial status" value={form.commercial_status} onChange={(value) => updateForm("commercial_status", value)} placeholder="active, proof-asset, experimental, parked" />
            <Field label="Markets" value={form.markets} onChange={(value) => updateForm("markets", value)} placeholder="United Kingdom, Namibia" />
            <Field label="Sectors" value={form.sectors} onChange={(value) => updateForm("sectors", value)} placeholder="Trades & Home Services, Dental Practice" />
            <Field label="Use cases" value={form.use_cases} onChange={(value) => updateForm("use_cases", value)} placeholder="Lead Capture, After-hours Enquiries" />
            <Field label="Related products" value={form.related_products} onChange={(value) => updateForm("related_products", value)} placeholder="Fredi, Voice Demo" />
            <Field label="Last reviewed" type="date" value={form.last_reviewed_date} onChange={(value) => updateForm("last_reviewed_date", value)} />
            <Field label="Sort order" type="number" value={form.sort_order} onChange={(value) => updateForm("sort_order", value)} />
          </div>

          <TextArea label="Description" value={form.description} onChange={(value) => updateForm("description", value)} />
          <TextArea label="Best used for" value={form.best_used_for} onChange={(value) => updateForm("best_used_for", value)} />
          <TextArea label="Notes" value={form.notes} onChange={(value) => updateForm("notes", value)} />

          <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", color: "#ccc" }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => updateForm("is_active", event.target.checked)} />
            Active in Alfred
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
            <button type="button" onClick={saveAsset} disabled={saving} style={{ ...buttonStyle, background: accent, borderColor: accent, color: "#081225", fontWeight: 800 }}>
              {saving ? "Saving..." : editingId ? "Update asset" : "Add to Alfred"}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={buttonStyle}>Cancel edit</button>}
            <button type="button" onClick={loadAssets} style={buttonStyle}>Refresh</button>
          </div>

          {message && <div style={{ marginTop: "16px", color: "#bbb" }}>{message}</div>}
        </section>

        <section style={{ marginTop: "22px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "26px", padding: "24px", background: "rgba(255,255,255,0.025)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0 }}>Registered assets</h2>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets..." style={{ ...inputStyle, minWidth: "240px", maxWidth: "420px" }} />
          </div>

          {loading ? (
            <p style={{ color: "#999" }}>Loading Alfred&apos;s assets...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginTop: "18px" }}>
              {filteredAssets.map((asset) => (
                <article key={asset.id} style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderTop: `2px solid ${(asset.markets || []).includes("Namibia") ? amber : asset.commercial_status === "active" ? green : accent}`,
                  borderRadius: "18px",
                  padding: "18px",
                  background: "#0a0a0a",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px" }}>{asset.name}</h3>
                      <div style={{ color: "#888", fontSize: "13px" }}>
                        {asset.family || "No family"} · {asset.asset_type || "asset"}
                      </div>
                    </div>
                    <span style={{ color: asset.is_active !== false ? green : "#777", fontSize: "12px", fontWeight: 800 }}>
                      {asset.is_active !== false ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <p style={{ color: "#aaa", lineHeight: 1.5 }}>{asset.description || "No description yet."}</p>

                  <div style={{ color: "#888", fontSize: "13px", lineHeight: 1.6 }}>
                    <div>Markets: {(asset.markets || []).join(", ") || "None"}</div>
                    <div>Sectors: {(asset.sectors || []).join(", ") || "None"}</div>
                    <div>Status: {asset.commercial_status || "not set"}</div>
                  </div>

                  {asset.best_used_for && (
                    <p style={{ color: "#ccc", lineHeight: 1.5 }}>
                      <strong>Best used for:</strong> {asset.best_used_for}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
                    <a href={asset.url} target="_blank" rel="noreferrer" style={buttonStyle}>Open</a>
                    <button type="button" onClick={() => startEdit(asset)} style={buttonStyle}>Edit</button>
                    <button type="button" onClick={() => deleteAsset(asset)} style={{ ...buttonStyle, color: "#E36B5D" }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, colour }: { label: string; value: number; colour: string }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderTop: `2px solid ${colour}`, borderRadius: "16px", padding: "16px", background: "#0a0a0a" }}>
      <div style={{ color: "#888", fontSize: "13px" }}>{label}</div>
      <div style={{ color: colour, fontSize: "30px", fontWeight: 800, marginTop: "4px" }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "7px", color: "#bbb", fontSize: "13px", fontWeight: 700 }}>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
    </label>
  );
}

function TextArea({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "block", marginTop: "14px" }}>
      <span style={{ display: "block", marginBottom: "7px", color: "#bbb", fontSize: "13px", fontWeight: 700 }}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
    </label>
  );
}
