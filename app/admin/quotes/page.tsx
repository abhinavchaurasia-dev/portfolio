// FILE: app/admin/quotes/page.tsx
// PAGE URL: /admin/quotes?key=YOUR_SECRET

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Check, ExternalLink } from "lucide-react";

/* ============================================================
   QUOTES ADMIN PAGE
   Private: /admin/quotes?key=YOUR_SECRET

   - Shows all current quotes with delete per item
   - Form to add new quote (text + author + optional source)
   - Max 30 quotes
   - Changes persist to Redis immediately
   ============================================================ */

interface Quote {
  id:      string;
  text:    string;
  author:  string;
  source?: string;
}

interface Status {
  type:    "success" | "error" | "idle";
  message: string;
}

export default function AdminQuotesPage() {
  const searchParams = useSearchParams();
  const secretKey    = searchParams.get("key") ?? "";

  const [quotes, setQuotes]   = useState<Quote[]>([]);
  const [text, setText]       = useState("");
  const [author, setAuthor]   = useState("");
  const [source, setSource]   = useState("");
  const [status, setStatus]   = useState<Status>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  function flashStatus(type: Status["type"], message: string) {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
  }

  /* ── Fetch current quotes ── */
  const fetchQuotes = useCallback(async () => {
    if (!secretKey) return;
    try {
      const res  = await fetch(`/api/quotes?key=${secretKey}`);
      if (res.status === 401) return;
      const data = await res.json() as { quotes: Quote[] };
      setQuotes(data.quotes ?? []);
    } catch { /* silent */ }
  }, [secretKey]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  /* ── Add quote ── */
  async function handleAdd() {
    if (!text.trim())   { flashStatus("error", "Quote text is required"); return; }
    if (!author.trim()) { flashStatus("error", "Author is required");     return; }
    if (quotes.length >= 30) {
      flashStatus("error", "Maximum 30 quotes — remove one first");
      return;
    }

    setLoading(true);
    const newQuote: Quote = {
      id:     `q${Date.now().toString(36)}`,
      text:   text.trim(),
      author: author.trim(),
      source: source.trim() || undefined,
    };

    const updated = [...quotes, newQuote];

    try {
      const res = await fetch("/api/quotes", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key":  secretKey,
        },
        body: JSON.stringify({ quotes: updated }),
      });

      if (res.status === 401) { flashStatus("error", "Invalid secret key"); return; }
      if (!res.ok)            { flashStatus("error", "Failed to save");      return; }

      const data = await res.json() as { quotes: Quote[] };
      setQuotes(data.quotes);
      setText("");
      setAuthor("");
      setSource("");
      flashStatus("success", "Added");
    } catch {
      flashStatus("error", "Network error");
    } finally {
      setLoading(false);
    }
  }

  /* ── Remove quote ── */
  async function handleRemove(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes?id=${id}`, {
        method:  "DELETE",
        headers: { "x-admin-key": secretKey },
      });

      if (res.status === 401) { flashStatus("error", "Invalid secret key"); return; }
      if (!res.ok)            { flashStatus("error", "Failed to remove");    return; }

      const data = await res.json() as { quotes: Quote[] };
      setQuotes(data.quotes);
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
        <p>Access denied. Secret key required.</p>
      </div>
    );
  }

  return (
    <div className="adm">

      {/* Header */}
      <div className="adm-header">
        <span className="adm-title">Footer Quotes</span>
        <a href="/" className="adm-back" target="_blank" rel="noopener noreferrer">
          View Portfolio <ExternalLink size={11} strokeWidth={1.5} />
        </a>
      </div>

      {/* Current quotes */}
      <div className="adm-section">
        <span className="adm-label-section">
          Quotes in rotation
          <span className="adm-count">{quotes.length} / 30</span>
        </span>

        {quotes.length === 0 ? (
          <div className="adm-empty">No quotes yet — add one below</div>
        ) : (
          <div className="adm-items">
            {quotes.map((q) => (
              <div key={q.id} className="adm-item">
                <div className="adm-item-info">
                  <span className="adm-item-text">{q.text}</span>
                  <span className="adm-item-meta">
                    — {q.author}
                    {q.source && (
                      <span className="adm-item-source">, {q.source}</span>
                    )}
                  </span>
                </div>
                <button
                  className="adm-remove"
                  onClick={() => handleRemove(q.id)}
                  disabled={loading}
                  aria-label={`Remove quote by ${q.author}`}
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
        <span className="adm-label-section">Add quote</span>

        {/* Quote text */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="q-text">Quote *</label>
          <textarea
            id="q-text"
            className="adm-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Make it work, make it right, make it fast."
            rows={3}
          />
        </div>

        {/* Author */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="q-author">Author *</label>
          <input
            id="q-author"
            className="adm-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Kent Beck"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            autoComplete="off"
          />
        </div>

        {/* Source */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="q-source">
            Source
            <span className="adm-optional">(optional)</span>
          </label>
          <input
            id="q-source"
            className="adm-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Refactoring, SICP"
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
          disabled={loading || !text.trim() || !author.trim() || quotes.length >= 30}
        >
          <Plus size={14} strokeWidth={2} />
          {loading ? "Saving..." : "Add quote"}
        </button>
      </div>

      {/* Hint */}
      <p className="adm-hint">
        One quote is picked at random each time the footer renders.
        Quotes are fetched from Redis — no redeploy needed.
      </p>

      {/* ── Styles ── (identical tokens to currently-into admin) */}
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
          color: #444;
          font-size: 13px;
          font-family: monospace;
        }

        .adm {
          max-width: 520px;
          margin: 0 auto;
          padding: 48px 24px 96px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

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

        .adm-count { font-size: 10px; color: #333; }
        .adm-empty { font-size: 13px; color: #333; }

        .adm-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .adm-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: #080808;
          border: 1px solid #1A1A1A;
          border-radius: 6px;
        }

        .adm-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .adm-item-text {
          font-size: 13px;
          color: #F0F0F0;
          line-height: 1.5;
          font-style: italic;
        }

        .adm-item-meta {
          font-family: "Geist Mono", monospace;
          font-size: 10px;
          color: #444;
        }

        .adm-item-source { color: #333; }

        .adm-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          background: transparent;
          border: 1px solid #1F1F1F;
          border-radius: 4px;
          color: #444;
          cursor: pointer;
          transition: color 150ms, border-color 150ms;
        }
        .adm-remove:hover { color: #FF6B6B; border-color: #FF6B6B30; }
        .adm-remove:disabled { opacity: 0.3; cursor: default; }

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

        .adm-optional { color: #333; font-size: 10px; }

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

        .adm-textarea {
          font-family: "Geist", sans-serif;
          font-size: 13px;
          font-style: italic;
          color: #F0F0F0;
          background: #080808;
          border: 1px solid #1F1F1F;
          border-radius: 6px;
          padding: 8px 12px;
          outline: none;
          width: 100%;
          resize: vertical;
          line-height: 1.6;
          transition: border-color 150ms;
        }
        .adm-textarea:focus { border-color: #333; }
        .adm-textarea::placeholder { color: #2A2A2A; font-style: normal; }

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

        .adm-hint {
          font-family: "Geist Mono", monospace;
          font-size: 11px;
          color: #333;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

