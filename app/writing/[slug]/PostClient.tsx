"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/* ============================================================
   READING PROGRESS BAR — top of viewport
   ============================================================ */

function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function calc() {
      const prose = document.getElementById("post-prose");
      if (!prose) return;
      const start = prose.offsetTop - window.innerHeight * 0.2;
      const end   = prose.offsetTop + prose.offsetHeight - window.innerHeight * 0.8;
      const range = end - start;
      if (range <= 0) { setPct(100); return; }
      setPct(Math.min(100, Math.max(0, ((window.scrollY - start) / range) * 100)));
    }
    window.addEventListener("scroll", calc, { passive: true });
    calc();
    return () => window.removeEventListener("scroll", calc);
  }, []);

  return (
    <>
      <div className="rp" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
        <div className="rp-bar" style={{ width: `${pct}%` }} />
      </div>
      <style>{`
        .rp { position:fixed; top:0; left:0; right:0; height:2px; background:var(--color-border-subtle,#1F1F1F); z-index:100; pointer-events:none; }
        .rp-bar { height:100%; background:var(--color-accent,#4AFF91); transition:width 80ms linear; }
        @media(prefers-reduced-motion:reduce){ .rp-bar{transition:none;} }
      `}</style>
    </>
  );
}

/* ============================================================
   TABLE OF CONTENTS — floating pill with SVG progress arc
   ============================================================ */

interface TocItem { id: string; text: string; }

function TableOfContents() {
  const [items, setItems]   = useState<TocItem[]>([]);
  const [active, setActive] = useState(0);
  const [pct, setPct]       = useState(0);
  const [open, setOpen]     = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Build TOC from rendered H2s */
  useEffect(() => {
    const prose = document.getElementById("post-prose");
    if (!prose) return;
    const headings = Array.from(prose.querySelectorAll("h2"));
    setItems(headings.map((h, i) => {
      if (!h.id) h.id = `h2-${i}`;
      return { id: h.id, text: h.textContent ?? "" };
    }));
  }, []);

  /* Track active section + reading progress */
  useEffect(() => {
    if (!items.length) return;

    function onScroll() {
      /* Reading progress % */
      const prose = document.getElementById("post-prose");
      if (prose) {
        const start = prose.offsetTop - window.innerHeight * 0.2;
        const end   = prose.offsetTop + prose.offsetHeight - window.innerHeight * 0.8;
        const range = end - start;
        setPct(range <= 0 ? 100 : Math.min(100, Math.max(0, ((window.scrollY - start) / range) * 100)));
      }

      /* Active section */
      const threshold = window.scrollY + window.innerHeight * 0.35;
      let cur = 0;
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= threshold) cur = i;
      });
      setActive(cur);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  /* Close on outside click */
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (!items.length) return null;

  /* SVG arc math */
  const R          = 8;            // radius
  const C          = 2 * Math.PI * R; // circumference ≈ 50.27
  const dashOffset = C - (pct / 100) * C;

  return (
    <>
      <div className="toc-wrap" ref={wrapRef}>
        {/* Panel */}
        {open && (
          <nav className="toc-panel" aria-label="Table of contents">
            <p className="toc-panel-heading">TABLE OF CONTENTS</p>
            <ul className="toc-list">
              {items.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`toc-link ${i === active ? "toc-link--active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="toc-num">{i + 1}.</span>
                    <span className="toc-text">{item.text}</span>
                    {i === active && <span className="toc-active-dot" aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Pill trigger */}
        <button className="toc-pill" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Table of contents">
          {/* Accent dot */}
          <span className="toc-pill-dot" aria-hidden="true" />

          {/* Current section label */}
          <span className="toc-pill-label">
            {active + 1}. {items[active]?.text}
          </span>

          {/* SVG progress arc — shows reading % */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="toc-arc">
            {/* Track */}
            <circle cx="10" cy="10" r={R} stroke="var(--color-border-default,#2A2A2A)" strokeWidth="2" fill="none" />
            {/* Progress */}
            <circle
              cx="10" cy="10" r={R}
              stroke="var(--color-accent,#4AFF91)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 10 10)"
              style={{ transition: "stroke-dashoffset 200ms linear" }}
            />
          </svg>
        </button>
      </div>

      <style>{`
        .toc-wrap {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 60; display: flex; flex-direction: column; align-items: center; gap: 8px;
        }

        /* Panel */
        .toc-panel {
          background: var(--color-bg-overlay,#141414);
          border: 1px solid var(--color-border-default,#2A2A2A);
          border-radius: 12px; padding: 16px;
          min-width: 280px; max-width: 360px;
          max-height: 320px; overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          animation: toc-in 150ms ease;
        }
        .toc-panel::-webkit-scrollbar { width:4px; }
        .toc-panel::-webkit-scrollbar-thumb { background:var(--color-border-default,#2A2A2A); border-radius:2px; }

        .toc-panel-heading {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 9px; font-weight: 500; letter-spacing: 0.1em;
          color: var(--color-text-muted,#444444); margin: 0 0 10px;
        }

        .toc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }

        .toc-link {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-geist,"Geist",sans-serif);
          font-size: 13px; color: var(--color-text-secondary,#888888);
          padding: 7px 10px; border-radius: 6px; text-decoration: none;
          transition: background 150ms ease, color 150ms ease;
        }
        .toc-link:hover { background: var(--color-bg-inset,#1A1A1A); color: var(--color-text-primary,#F0F0F0); }
        .toc-link--active { background: var(--color-bg-inset,#1A1A1A); color: var(--color-text-primary,#F0F0F0); font-weight: 500; }

        .toc-num { font-family: var(--font-geist-mono,"Geist Mono",monospace); font-size: 11px; color: var(--color-text-muted,#444444); flex-shrink: 0; min-width: 18px; }
        .toc-text { flex: 1; }
        .toc-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent,#4AFF91); flex-shrink: 0; margin-left: auto; }

        /* Pill */
        .toc-pill {
          display: flex; align-items: center; gap: 8px;
          background: var(--color-bg-overlay,#141414);
          border: 1px solid var(--color-border-default,#2A2A2A);
          border-radius: 100px; padding: 8px 10px 8px 10px;
          cursor: pointer;
          font-family: var(--font-geist,"Geist",sans-serif);
          font-size: 12px; color: var(--color-text-secondary,#888888);
          transition: border-color 150ms ease, color 150ms ease;
          max-width: min(340px, calc(100vw - 40px));
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .toc-pill:hover { border-color: var(--color-border-strong,#3A3A3A); color: var(--color-text-primary,#F0F0F0); }

        .toc-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-accent,#4AFF91); flex-shrink: 0; }
        .toc-pill-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .toc-arc { flex-shrink: 0; }

        @keyframes toc-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        @media(max-width:560px){ .toc-wrap{bottom:20px;} .toc-pill{font-size:11px;} }
        @media(prefers-reduced-motion:reduce){ .toc-arc circle{transition:none;} .toc-link,.toc-pill{transition:none;} .toc-panel{animation:none;} }
      `}</style>
    </>
  );
}

/* ============================================================
   SHARE BUTTON — rendered into #post-share-anchor in topbar
   ============================================================ */

function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <button className="share-topbar-btn" onClick={onClick} aria-label="Share this post">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share
      </button>
      <style>{`
        .share-topbar-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-geist,"Geist",sans-serif);
          font-size: 12px; font-weight: 500;
          color: var(--color-text-secondary,#888888);
          background: var(--color-bg-elevated,#0F0F0F);
          border: 1px solid var(--color-border-default,#2A2A2A);
          border-radius: 6px; padding: 6px 12px;
          cursor: pointer; transition: border-color 150ms ease, color 150ms ease;
        }
        .share-topbar-btn:hover { border-color: var(--color-border-strong,#3A3A3A); color: var(--color-text-primary,#F0F0F0); }
        @media(prefers-reduced-motion:reduce){ .share-topbar-btn{transition:none;} }
      `}</style>
    </>
  );
}

/* ============================================================
   SHARE MODAL
   ============================================================ */

function ShareModal({ title, slug, onClose }: { title: string; slug: string; onClose: () => void }) {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/writing/${slug}`
    : `https://abhinavchaurasia.in/writing/${slug}`;

  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { (document.getElementById("smi") as HTMLInputElement)?.select(); }
  }, [url]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  const encodedUrl   = encodeURIComponent(url);
  const mdxUrl       = url.replace("https://abhinavchaurasia.in/writing/", "https://abhinavchaurasia.in/writing/") + ".mdx";
  const tweetUrl     = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${title}"`)}&url=${encodedUrl}`;
  const linkedInUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const prompt       = encodeURIComponent(`Read ${url}, I want to ask questions about it.`);
  const chatgptUrl   = `https://chatgpt.com/?q=${prompt}&hints=search`;
  const claudeUrl    = `https://claude.ai/new?q=${prompt}`;

  return (
    <>
      <div className="sm-bg" onClick={onClose} aria-hidden="true" />
      <div className="sm" role="dialog" aria-modal="true" aria-labelledby="sm-h">
        <div className="sm-top">
          <h2 className="sm-h" id="sm-h">Share this post</h2>
          <button className="sm-x" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <p className="sm-sub">"{title}"</p>

        {/* Copy link */}
        <p className="sm-label">Copy link</p>
        <div className="sm-row">
          <input id="smi" className="sm-input" type="text" value={url} readOnly onClick={(e) => (e.target as HTMLInputElement).select()} />
          <button className={`sm-copy ${copied ? "sm-copy--ok" : ""}`} onClick={copy} aria-label={copied ? "Copied" : "Copy"}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 1V3.5H1V13h8v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            }
          </button>
        </div>

        {/* Share on */}
        <p className="sm-label">Share on</p>
        <div className="sm-socials">
          <a href={tweetUrl}    target="_blank" rel="noopener noreferrer" className="sm-social">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
            X / Twitter
          </a>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="sm-social">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>

        {/* Open in AI */}
        <p className="sm-label">Open in AI</p>
        <div className="sm-ai">
          <a href={chatgptUrl} target="_blank" rel="noopener noreferrer" className="sm-ai-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zm-9.022 12.609a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zm-9.661-4.126a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 01.071 0l4.83 2.786a4.494 4.494 0 01-.678 8.121v-5.694a.79.79 0 00-.4-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08L8.704 5.46a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
            ChatGPT
          </a>
          <a href={claudeUrl}  target="_blank" rel="noopener noreferrer" className="sm-ai-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.23-4.72-2.648v-1.27l6.327 3.604v.688L4.71 17.225v-1.27zm6.571 3.694H9.803l-1.37-3.894H3.697l-1.366 3.894H.847L5.457 6.65h1.37l4.453 12.999zM12.93 6.65h1.71l3.094 10.087 3.007-10.087H22.4l-4.013 13h-1.43L12.93 6.65z"/></svg>
            Claude
          </a>
        </div>
      </div>

      <style>{`
        .sm-bg { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; backdrop-filter:blur(4px); animation:sm-fade 150ms ease; }
        .sm { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:201; background:var(--color-bg-overlay,#141414); border:1px solid var(--color-border-default,#2A2A2A); border-radius:10px; padding:24px; width:min(440px,calc(100vw - 32px)); animation:sm-up 200ms ease; }
        .sm-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
        .sm-h { font-family:var(--font-geist,"Geist",sans-serif); font-size:16px; font-weight:600; color:var(--color-text-primary,#F0F0F0); margin:0; }
        .sm-x { width:28px; height:28px; display:flex; align-items:center; justify-content:center; background:transparent; border:1px solid var(--color-border-subtle,#1F1F1F); border-radius:4px; color:var(--color-text-muted,#444444); cursor:pointer; transition:border-color 150ms,color 150ms; }
        .sm-x:hover { border-color:var(--color-border-strong,#3A3A3A); color:var(--color-text-primary,#F0F0F0); }
        .sm-sub { font-family:var(--font-geist,"Geist",sans-serif); font-size:13px; color:var(--color-text-secondary,#888888); margin:0 0 20px; font-style:italic; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .sm-label { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-text-muted,#444444); margin:0 0 8px; display:block; }
        .sm-row { display:flex; gap:8px; margin-bottom:16px; }
        .sm-input { flex:1; font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:12px; color:var(--color-text-secondary,#888888); background:var(--color-bg-inset,#1A1A1A); border:1px solid var(--color-border-default,#2A2A2A); border-radius:4px; padding:8px 10px; outline:none; min-width:0; }
        .sm-copy { width:34px; height:34px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:var(--color-bg-inset,#1A1A1A); border:1px solid var(--color-border-default,#2A2A2A); border-radius:4px; color:var(--color-text-secondary,#888888); cursor:pointer; transition:border-color 150ms,color 150ms; }
        .sm-copy:hover { border-color:var(--color-border-strong,#3A3A3A); color:var(--color-text-primary,#F0F0F0); }
        .sm-copy--ok { border-color:var(--color-accent-border,#4AFF9130); color:var(--color-accent,#4AFF91); }
        .sm-socials { display:flex; gap:8px; margin-bottom:16px; }
        .sm-social { display:inline-flex; align-items:center; gap:7px; font-family:var(--font-geist,"Geist",sans-serif); font-size:13px; font-weight:500; color:var(--color-text-secondary,#888888); background:var(--color-bg-inset,#1A1A1A); border:1px solid var(--color-border-default,#2A2A2A); border-radius:4px; padding:7px 14px; text-decoration:none; transition:border-color 150ms,color 150ms; }
        .sm-social:hover { border-color:var(--color-border-strong,#3A3A3A); color:var(--color-text-primary,#F0F0F0); }
        .sm-ai { display:flex; gap:8px; }
        .sm-ai-btn { display:inline-flex; align-items:center; gap:7px; font-family:var(--font-geist,"Geist",sans-serif); font-size:13px; font-weight:500; color:var(--color-text-secondary,#888888); background:var(--color-bg-inset,#1A1A1A); border:1px solid var(--color-border-default,#2A2A2A); border-radius:4px; padding:7px 14px; text-decoration:none; transition:border-color 150ms,color 150ms; }
        .sm-ai-btn:hover { border-color:var(--color-border-strong,#3A3A3A); color:var(--color-text-primary,#F0F0F0); }
        @keyframes sm-fade{from{opacity:0}to{opacity:1}}
        @keyframes sm-up{from{opacity:0;transform:translate(-50%,calc(-50% + 10px))}to{opacity:1;transform:translate(-50%,-50%)}}
        @media(prefers-reduced-motion:reduce){.sm-bg,.sm{animation:none;}}
      `}</style>
    </>
  );
}

/* ============================================================
   SHARE PORTAL — renders into #post-share-anchor
   ============================================================ */

function SharePortal({ title, slug }: { title: string; slug: string }) {
  const [mounted, setMounted]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const anchor = document.getElementById("post-share-anchor");
  if (!anchor) return null;

  return createPortal(
    <>
      <ShareButton onClick={() => setModalOpen(true)} />
      {modalOpen && <ShareModal title={title} slug={slug} onClose={() => setModalOpen(false)} />}
    </>,
    anchor
  );
}

/* ============================================================
   MAIN EXPORT
   ============================================================ */

export default function PostClient({
  title,
  slug,
  postUrl,
  content: _content,
}: {
  title: string;
  slug: string;
  postUrl: string;
  content: string;
}) {
  return (
    <>
      <ReadingProgress />
      <TableOfContents />
      <SharePortal title={title} slug={slug} />
    </>
  );
}