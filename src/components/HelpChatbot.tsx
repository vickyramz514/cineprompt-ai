"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatHelpReply, HELP_QUICK_PROMPTS } from "@/lib/help-knowledge";

type ChatMsg = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: { label: string; href: string }[];
  suggestions?: string[];
};

const WELCOME: ChatMsg = {
  id: "welcome",
  role: "bot",
  text: `Hi — I'm the Data Captain helper. Ask about signup, API keys, SDKs, ETF tools, backtesting, portfolio, plans, billing, or market hours.

Try a quick prompt below or type your own question.`,
  suggestions: HELP_QUICK_PROMPTS,
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function HelpChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    const reply = formatHelpReply(q);
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text: q },
      {
        id: uid(),
        role: "bot",
        text: reply.text,
        links: reply.links,
        suggestions: reply.suggestions,
      },
    ]);
    setInput("");
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          className="pointer-events-auto flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--dc-border)] bg-[var(--dc-elevated)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          role="dialog"
          aria-label="Help chatbot"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--dc-border)] bg-[var(--dc-accent-soft)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--dc-fg)]">Help Captain</p>
              <p className="text-[11px] text-[var(--dc-muted)]">App flows · API · billing</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm text-[var(--dc-muted)] hover:bg-[var(--dc-bg)] hover:text-[var(--dc-fg)]"
              aria-label="Close help chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "dc-on-accent bg-[var(--dc-accent)] text-white"
                      : "border border-[var(--dc-border)] bg-[var(--dc-bg)] text-[var(--dc-fg)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className="rounded-full border border-[var(--dc-accent)]/30 bg-[var(--dc-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--dc-accent)] hover:brightness-110"
                          onClick={() => setOpen(false)}
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => ask(s)}
                          className="rounded-full border border-[var(--dc-border)] px-2.5 py-1 text-[11px] text-[var(--dc-muted)] hover:border-[var(--dc-accent)]/40 hover:text-[var(--dc-fg)]"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-[var(--dc-border)] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Data Captain…"
                className="min-w-0 flex-1 rounded-xl border border-[var(--dc-border)] bg-[var(--dc-bg)] px-3 py-2.5 text-sm text-[var(--dc-fg)] placeholder:text-[var(--dc-muted)] focus:border-[var(--dc-accent)]/50 focus:outline-none"
              />
              <button
                type="submit"
                className="dc-on-accent shrink-0 rounded-xl bg-[var(--dc-accent)] px-3.5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="dc-on-accent pointer-events-auto inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--dc-accent)] to-[var(--dc-accent-2)] px-5 text-sm font-semibold text-white shadow-[0_12px_40px_-10px_var(--dc-glow)] transition hover:brightness-110"
        aria-expanded={open}
        aria-controls="help-chat"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337l-4.197 1.399a.75.75 0 01-.95-.95l1.4-4.197A9.25 9.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
        <span className="hidden sm:inline">{open ? "Close help" : "Help"}</span>
      </button>
    </div>
  );
}
