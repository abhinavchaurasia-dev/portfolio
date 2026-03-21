"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ArrowRight } from "lucide-react";

/* ============================================================
   AI ASSISTANT
   Zero dependency on ai/react or @ai-sdk/react.
   Uses native fetch + ReadableStream to consume the Vercel AI
   Data Stream Protocol directly — works with any SDK version.
   ============================================================ */

interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "How does CLIP work in PeerCampus?",
  "What did you build at Northern Railway?",
  "Which AI APIs have you used?",
  "Are you open to internships?",
] as const;

const panelVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.25, ease: [0, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: 12, transition: { duration: 0.15, ease: [0.4, 0, 1, 1]  } },
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AIAssistant() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const abortRef       = useRef<AbortController | null>(null);

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Focus on open */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 280);
  }, [isOpen]);

  /* Escape to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* ── Core send function ── */
  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);

    const userMsg: Message = { id: uid(), role: "user", content: trimmed };
    const assistantId = uid();

    setMessages(prev => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/assistant", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  abortRef.current.signal,
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          res.status === 429
            ? "Rate limit reached — max 20 messages/hour."
            : res.status === 401
            ? "API key missing or invalid. Check OPENROUTER_API_KEY in .env.local."
            : data?.error ?? `Request failed (${res.status})`
        );
      }

      /* ── Stream parsing ──
         Vercel AI SDK streams lines prefixed with "0:" (text delta)
         Format: 0:"token"\n
         We accumulate and update the assistant bubble in place.
      */
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith('0:"') || line.startsWith("0:'")) {
            try {
              const jsonStr = line.slice(2);
              const token   = JSON.parse(jsonStr) as string;
              accumulated  += token;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                )
              );
            } catch { /* malformed line, skip */ }
          } else if (line.startsWith("0:")) {
            const token = line.slice(2);
            if (token && !token.startsWith("{")) {
              accumulated += token;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                )
              );
            }
          }
        }
      }

      if (!accumulated) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: "Sorry, I didn't get a response. Please try again." }
              : m
          )
        );
      }

    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      const msg = (err as Error).message ?? "Something went wrong.";
      setError(msg);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="aia-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Portfolio Assistant"
          >
            {/* Header */}
            <div className="aia-header">
              <div className="aia-header-left">
                <span className="aia-dot" aria-hidden="true" />
                <span className="aia-title">Portfolio Assistant</span>
              </div>
              <button
                className="aia-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Messages */}
            <div className="aia-messages" aria-live="polite">

              {!hasMessages && (
                <div className="aia-greeting">
                  <p className="aia-greeting-text">
                    Ask me anything about Abhinav&rsquo;s projects, stack, or availability.
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`aia-bubble aia-bubble--${m.role}`}
                >
                  {m.content || (
                    m.role === "assistant" && loading ? (
                      <span className="aia-typing" aria-label="Thinking">
                        <span /><span /><span />
                      </span>
                    ) : null
                  )}
                </div>
              ))}

              {error && (
                <div className="aia-bubble aia-bubble--assistant aia-error">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {!hasMessages && (
              <div className="aia-quick">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="aia-quick-pill"
                    onClick={() => send(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form className="aia-input-row" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className="aia-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about my work..."
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="aia-send"
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Launch button ── */}
      <motion.button
        className="aia-launch"
        onClick={() => setIsOpen(p => !p)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.15 }}
        aria-label={isOpen ? "Close assistant" : "Open portfolio assistant"}
        aria-expanded={isOpen}
      >
        {isOpen
          ? <X size={18} strokeWidth={1.5} />
          : <MessageCircle size={18} strokeWidth={1.5} />
        }
      </motion.button>

      <style>{`
        /* ── Launch button ── */
        .aia-launch {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 90;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-default, #2A2A2A);
          color: var(--color-text-secondary, #888888);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 150ms ease;
        }
        .aia-launch:hover { border-color: var(--color-border-strong, #333333); }

        /* ── Panel — desktop default ── */
        .aia-panel {
          position: fixed;
          bottom: 80px;
          right: 24px;
          z-index: 89;
          width: 340px;
          height: 480px;
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 10px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Mobile: panel goes full width minus 32px margin ── */
        @media (max-width: 767px) {
          .aia-panel {
            /* Anchor to bottom-right, stretch left to 16px from edge */
            bottom: 0;
            right: 0;
            left: 0;
            width: auto;
            /* Height: almost full screen, leaving room for launch btn */
            height: calc(100dvh - 72px);
            /* Remove rounded bottom corners — flush with screen edge */
            border-radius: 12px 12px 0 0;
            border-bottom: none;
          }
          .aia-launch {
            bottom: 16px;
            right: 16px;
          }
        }

        .aia-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          padding: 0 16px;
          flex-shrink: 0;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .aia-header-left { display: flex; align-items: center; gap: 8px; }
        .aia-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          background-color: var(--color-accent, #4AFF91);
        }
        .aia-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
        }
        .aia-close {
          display: flex;
          align-items: center;
          justify-content: center;
          /* 44×44 touch target */
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          color: var(--color-text-muted, #444444);
          cursor: pointer;
          border-radius: 4px;
          transition: color 150ms ease;
        }
        .aia-close:hover { color: var(--color-text-primary, #F0F0F0); }

        .aia-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-default, #2A2A2A) transparent;
        }
        .aia-greeting {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .aia-greeting-text {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          line-height: 1.6;
          max-width: 220px;
          text-align: center;
          margin: 0;
        }

        .aia-bubble {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          line-height: 1.6;
          padding: 10px 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          max-width: 90%;
          word-break: break-word;
        }
        .aia-bubble--assistant {
          background-color: var(--color-bg-overlay, #141414);
          color: var(--color-text-secondary, #888888);
          align-self: flex-start;
        }
        .aia-bubble--user {
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          color: var(--color-text-primary, #F0F0F0);
          align-self: flex-end;
          margin-left: auto;
        }
        .aia-error { color: #FF6B6B; font-size: 12px; }

        /* Typing dots */
        .aia-typing {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 0;
        }
        .aia-typing span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-text-muted, #444444);
          display: inline-block;
          animation: aiaDot 1.2s ease-in-out infinite;
        }
        .aia-typing span:nth-child(2) { animation-delay: 0.2s; }
        .aia-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aiaDot {
          0%,80%,100% { opacity:.3; transform:scale(1); }
          40%          { opacity:1;  transform:scale(1.3); }
        }

        .aia-quick {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 16px 12px;
          flex-shrink: 0;
        }
        .aia-quick-pill {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          text-align: left;
          line-height: 1.4;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .aia-quick-pill:hover:not(:disabled) {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }
        .aia-quick-pill:disabled { opacity: 0.4; cursor: default; }

        .aia-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 48px;
          padding: 0 12px;
          flex-shrink: 0;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .aia-input {
          flex: 1;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-primary, #F0F0F0);
          background: transparent;
          border: none;
          outline: none;
          caret-color: var(--color-accent, #4AFF91);
          min-width: 0;
        }
        .aia-input::placeholder { color: var(--color-text-muted, #444444); }
        .aia-input:disabled { opacity: 0.5; }

        .aia-send {
          display: flex;
          align-items: center;
          justify-content: center;
          /* 44×44 touch target */
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          color: var(--color-text-muted, #444444);
          cursor: pointer;
          border-radius: 4px;
          flex-shrink: 0;
          transition: color 150ms ease;
        }
        .aia-send:hover:not(:disabled) { color: var(--color-text-primary, #F0F0F0); }
        .aia-send:disabled { opacity: 0.3; cursor: default; }

        @media (prefers-reduced-motion: reduce) {
          .aia-launch, .aia-close, .aia-quick-pill, .aia-send { transition: none; }
          .aia-typing span { animation: none; opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

