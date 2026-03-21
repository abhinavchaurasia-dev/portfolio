// FILE: app/admin/currently-into/page.tsx
// PAGE URL: /admin/currently-into

"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Check, ExternalLink } from "lucide-react";

/* ============================================================
   CURRENTLY INTO ADMIN PAGE
  Private: /admin/currently-into
   
   - Shows current items with delete per item
   - Form to add new item (category + label + optional sub)
   - Max 6 items
   - Changes persist to Redis immediately
   ============================================================ */

type Category = "reading" | "watching" | "building" | "listening";

interface Item {
  id:       string;
  category: Category;
  label:    string;
  sub?:     string;
}

interface Status {
  type:    "success" | "error" | "idle";
  message: string;
}

const CATEGORIES: Category[] = ["reading", "watching", "building", "listening"];

const CATEGORY_EXAMPLES: Record<Category, string> = {
  reading:   "e.g. Designing Data-Intensive Applications",
  watching:  "e.g. Mr. Robot",
  building:  "e.g. This portfolio",
  listening: "e.g. Dark Side of the Moon",
};

const SUB_EXAMPLES: Record<Category, string> = {
  reading:   "e.g. Martin Kleppmann",
  watching:  "e.g. Season 2",
  building:  "e.g. Next.js 15 + AI",
  listening: "e.g. Pink Floyd",
};

export default function AdminCurrentlyIntoPage() {
  const [secretKey, setSecretKey] = useState("");
  const [secretInput, setSecretInput] = useState("");

  const [items, setItems]       = useState<Item[]>([]);
  const [category, setCategory] = useState<Category>("reading");
  const [label, setLabel]       = useState("");
  const [sub, setSub]           = useState("");
  const [status, setStatus]     = useState<Status>({ type: "idle", message: "" });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const storedKey = window.sessionStorage.getItem("admin-secret") ?? "";
    setSecretKey(storedKey);
    setSecretInput(storedKey);
  }, []);

  function saveSecret() {
    const trimmed = secretInput.trim();
    if (!trimmed) {
      flashStatus("error", "Secret key is required");
      return;
    }
    window.sessionStorage.setItem("admin-secret", trimmed);
    setSecretKey(trimmed);
    flashStatus("success", "Secret key saved for this session");
  }

  function flashStatus(type: Status["type"], message: string) {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
  }

  /* ── Fetch current items ── */
  const fetchItems = useCallback(async () => {
    if (!secretKey) return;
    try {
      const res = await fetch("/api/currently-into", {
        headers: { "x-admin-key": secretKey },
      });
      if (res.status === 401) return;
      const data = await res.json() as { items: Item[] };
      setItems(data.items ?? []);
    } catch { /* silent */ }
  }, [secretKey]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  /* ── Add item ── */
  async function handleAdd() {
    if (!secretKey) {
      flashStatus("error", "Secret key is required");
      return;
    }
    if (!label.trim()) {
      flashStatus("error", "Label is required");
      return;
    }
    if (items.length >= 6) {
      flashStatus("error", "Maximum 6 items — remove one first");
      return;
    }

    setLoading(true);
    const newItem: Item = {
      id:       `${category[0]}${Date.now().toString(36)}`,
      category,
      label:    label.trim(),
      sub:      sub.trim() || undefined,
    };

    const updated = [...items, newItem];

    try {
      const res = await fetch("/api/currently-into", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key":  secretKey,
        },
        body: JSON.stringify({ items: updated }),
      });

      if (res.status === 401) { flashStatus("error", "Invalid secret key"); return; }
      if (!res.ok)            { flashStatus("error", "Failed to save");      return; }

      const data = await res.json() as { items: Item[] };
      setItems(data.items);
      setLabel("");
      setSub("");
      flashStatus("success", "Added");
    } catch {
      flashStatus("error", "Network error");
    } finally {
      setLoading(false);
    }
  }

  /* ── Remove item ── */
  async function handleRemove(id: string) {
    if (!secretKey) {
      flashStatus("error", "Secret key is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/currently-into?id=${id}`, {
        method:  "DELETE",
        headers: { "x-admin-key": secretKey },
      });

      if (res.status === 401) { flashStatus("error", "Invalid secret key"); return; }
      if (!res.ok)            { flashStatus("error", "Failed to remove");    return; }

      const data = await res.json() as { items: Item[] };
      setItems(data.items);
      flashStatus("success", "Removed");
    } catch {
      flashStatus("error", "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!secretKey) {
    return (
      <div className="adm-gate">
        <div className="adm-gate-card">
          <p>Enter admin secret key</p>
          <input
            className="adm-gate-input"
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Admin secret"
            autoComplete="off"
            onKeyDown={(e) => { if (e.key === "Enter") saveSecret(); }}
          />
          <button className="adm-gate-submit" onClick={saveSecret}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm">

      {/* Header */}
      <div className="adm-header">
        <span className="adm-title">Currently Into</span>
        <a href="/" className="adm-back" target="_blank" rel="noopener noreferrer">
          View Portfolio <ExternalLink size={11} strokeWidth={1.5} />
        </a>
      </div>

      {/* Current items */}
      <div className="adm-section">
        <span className="adm-label-section">
          Showing now
          <span className="adm-count">{items.length} / 6</span>
        </span>

        {items.length === 0 ? (
          <div className="adm-empty">No items yet — add one below</div>
        ) : (
          <div className="adm-items">
            {items.map((item) => (
              <div key={item.id} className="adm-item">
                <span className="adm-item-cat">{item.category}</span>
                <div className="adm-item-info">
                  <span className="adm-item-label">{item.label}</span>
                  {item.sub && (
                    <span className="adm-item-sub">{item.sub}</span>
                  )}
                </div>
                <button
                  className="adm-remove"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading}
                  aria-label={`Remove ${item.label}`}
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add form */}
      <div className="adm-section">
        <span className="adm-label-section">Add item</span>

        {/* Category tabs */}
        <div className="adm-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`adm-cat-btn${category === cat ? " adm-cat-btn--active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Label */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="ci-label">What *</label>
          <input
            id="ci-label"
            className="adm-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={CATEGORY_EXAMPLES[category]}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            autoComplete="off"
          />
        </div>

        {/* Sub */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="ci-sub">
            By / subtitle
            <span className="adm-optional">(optional)</span>
          </label>
          <input
            id="ci-sub"
            className="adm-input"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            placeholder={SUB_EXAMPLES[category]}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            autoComplete="off"
          />
        </div>

        {/* Status */}
        {status.type !== "idle" && (
          <div className={`adm-status adm-status--${status.type}`}>
            {status.type === "success" && <Check size={12} strokeWidth={2} />}
            {status.message}
          </div>
        )}

        <button
          className="adm-submit"
          onClick={handleAdd}
          disabled={loading || !label.trim() || items.length >= 6}
        >
          <Plus size={14} strokeWidth={2} />
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      {/* ── Styles ── */}
      <style>{`
        * { box-sizing: border-box; }
        body {
          background: #080808;
          margin: 0;
          font-family: "Geist", -apple-system, sans-serif;
        }

        .adm-gate {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .adm-gate-card {
          width: 100%;
          max-width: 360px;
          border: 1px solid #1F1F1F;
          background: #0F0F0F;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .adm-gate-card p {
          margin: 0;
          color: #888;
          font-size: 12px;
          font-family: "Geist Mono", monospace;
        }
        .adm-gate-input {
          width: 100%;
          height: 36px;
          border: 1px solid #2A2A2A;
          border-radius: 6px;
          background: #141414;
          color: #F0F0F0;
          font-size: 13px;
          padding: 0 10px;
          outline: none;
        }
        .adm-gate-input:focus { border-color: #3A3A3A; }
        .adm-gate-submit {
          height: 34px;
          border: 1px solid #2A2A2A;
          border-radius: 6px;
          background: #1A1A1A;
          color: #F0F0F0;
          font-size: 12px;
          font-family: "Geist Mono", monospace;
          cursor: pointer;
          transition: border-color 150ms ease;
        }
        .adm-gate-submit:hover { border-color: #3A3A3A; }
        .adm-gate-submit:active { opacity: 0.9; }

        .adm {
          max-width: 480px;
          margin: 0 auto;
          padding: 48px 24px 96px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Header */
        .adm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .adm-title {
          font-size: 15px;
          font-weight: 600;
          color: #F0F0F0;
        }
        .adm-back {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #444;
          text-decoration: none;
          transition: color 150ms;
        }
        .adm-back:hover { color: #888; }

        /* Section */
        .adm-section {
          background: #0F0F0F;
          border: 1px solid #1F1F1F;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .adm-label-section {
          font-family: "Geist Mono", monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #444;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .adm-count {
          font-size: 10px;
          color: #333;
        }

        .adm-empty {
          font-size: 13px;
          color: #333;
        }

        /* Items list */
        .adm-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .adm-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #080808;
          border: 1px solid #1A1A1A;
          border-radius: 6px;
        }

        .adm-item-cat {
          font-family: "Geist Mono", monospace;
          font-size: 10px;
          color: #444;
          width: 60px;
          flex-shrink: 0;
        }

        .adm-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .adm-item-label {
          font-size: 13px;
          color: #F0F0F0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .adm-item-sub {
          font-family: "Geist Mono", monospace;
          font-size: 10px;
          color: #444;
        }

        .adm-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: transparent;
          border: 1px solid #1F1F1F;
          border-radius: 4px;
          color: #444;
          cursor: pointer;
          flex-shrink: 0;
          transition: color 150ms, border-color 150ms;
        }
        .adm-remove:hover { color: #FF6B6B; border-color: #FF6B6B30; }
        .adm-remove:disabled { opacity: 0.3; cursor: default; }

        /* Category tabs */
        .adm-cats {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .adm-cat-btn {
          font-family: "Geist Mono", monospace;
          font-size: 11px;
          color: #444;
          background: transparent;
          border: 1px solid #1F1F1F;
          border-radius: 4px;
          padding: 4px 10px;
          cursor: pointer;
          transition: color 150ms, border-color 150ms, background 150ms;
        }

        .adm-cat-btn:hover { color: #888; border-color: #333; }

        .adm-cat-btn--active {
          color: #4AFF91;
          border-color: #4AFF9140;
          background: #4AFF9110;
        }

        /* Form fields */
        .adm-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .adm-label {
          font-family: "Geist Mono", monospace;
          font-size: 11px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .adm-optional {
          color: #333;
          font-size: 10px;
        }

        .adm-input {
          font-family: "Geist", sans-serif;
          font-size: 13px;
          color: #F0F0F0;
          background: #080808;
          border: 1px solid #1F1F1F;
          border-radius: 6px;
          padding: 8px 12px;
          outline: none;
          width: 100%;
          transition: border-color 150ms;
        }
        .adm-input:focus { border-color: #333; }
        .adm-input::placeholder { color: #2A2A2A; }

        /* Status */
        .adm-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          padding: 7px 10px;
          border-radius: 4px;
        }
        .adm-status--success {
          color: #4AFF91;
          background: #4AFF9112;
          border: 1px solid #4AFF9125;
        }
        .adm-status--error {
          color: #FF6B6B;
          background: #FF6B6B12;
          border: 1px solid #FF6B6B25;
        }

        /* Submit */
        .adm-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: "Geist", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #080808;
          background: #4AFF91;
          border: none;
          border-radius: 6px;
          padding: 9px 16px;
          cursor: pointer;
          transition: opacity 150ms;
          width: 100%;
        }
        .adm-submit:hover:not(:disabled) { opacity: 0.85; }
        .adm-submit:disabled { opacity: 0.3; cursor: default; }
      `}</style>
    </div>
  );
}

