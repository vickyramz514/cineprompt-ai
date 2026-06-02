"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as supportService from "@/services/support.service";
import Loader from "@/components/Loader";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40";

const HELP_LINKS = [
  {
    href: "/dashboard/api-docs",
    title: "API documentation",
    desc: "Endpoints, auth, and examples",
    accent: "from-sky-500/20 to-indigo-500/10 border-sky-500/25",
  },
  {
    href: "/dashboard/usage",
    title: "Usage & limits",
    desc: "Quota, rate limits, and history",
    accent: "from-violet-500/20 to-indigo-500/10 border-violet-500/25",
  },
  {
    href: "/dashboard/wallet",
    title: "Billing",
    desc: "Plans, credits, and invoices",
    accent: "from-emerald-500/20 to-indigo-500/10 border-emerald-500/25",
  },
];

type StatusFilter = "ALL" | "OPEN" | "CLOSED";

function statusStyles(status: string) {
  if (status === "CLOSED") return "border-white/15 bg-white/5 text-white/50";
  if (status === "IN_PROGRESS") return "border-amber-500/30 bg-amber-500/15 text-amber-300";
  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
}

function priorityStyles(priority: string) {
  if (priority === "HIGH") return "text-red-300";
  if (priority === "LOW") return "text-white/45";
  return "text-amber-300/90";
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default function SupportView() {
  const [tickets, setTickets] = useState<supportService.SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<supportService.SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [createSubject, setCreateSubject] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createPriority, setCreatePriority] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchTickets = () => {
    setLoading(true);
    setError(null);
    supportService
      .getTickets()
      .then((data) => {
        setTickets(data.tickets);
        setTotal(data.total);
      })
      .catch((err) => setError(supportService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    if (statusFilter === "ALL") return tickets;
    if (statusFilter === "CLOSED") return tickets.filter((t) => t.status === "CLOSED");
    return tickets.filter((t) => t.status !== "CLOSED");
  }, [tickets, statusFilter]);

  const openCount = useMemo(() => tickets.filter((t) => t.status !== "CLOSED").length, [tickets]);
  const closedCount = useMemo(() => tickets.filter((t) => t.status === "CLOSED").length, [tickets]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createSubject.trim() || !createMessage.trim()) return;
    setSubmitting(true);
    setError(null);
    supportService
      .createTicket({
        subject: createSubject,
        message: createMessage,
        priority: createPriority,
      })
      .then((ticket) => {
        setShowCreate(false);
        setCreateSubject("");
        setCreateMessage("");
        setCreatePriority("MEDIUM");
        setSelectedTicket(ticket);
        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 4000);
        fetchTickets();
      })
      .catch((err) => setError(supportService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    setSubmitting(true);
    setError(null);
    supportService
      .addMessage(selectedTicket.id, newMessage)
      .then(() => {
        setNewMessage("");
        return supportService.getTicketById(selectedTicket.id);
      })
      .then(setSelectedTicket)
      .catch((err) => setError(supportService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const openTicket = (t: supportService.SupportTicket) => {
    setError(null);
    supportService.getTicketById(t.id).then(setSelectedTicket).catch((err) => {
      setError(supportService.getErrorMessage(err));
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sky-300/80">Help</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Support</h1>
          <p className="mt-1 text-sm text-white/50">
            Open a ticket and track replies from our team
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400"
        >
          {showCreate ? "Cancel" : "New ticket"}
        </button>
      </motion.div>

      <AnimatePresence>
        {createSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <span className="text-emerald-400">✓</span>
            <p className="text-sm text-emerald-200">Ticket created — we&apos;ll respond soon</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {HELP_LINKS.map((link, i) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={link.href}
              className={`block rounded-2xl border bg-gradient-to-br p-4 transition-colors hover:bg-white/[0.03] ${link.accent}`}
            >
              <p className="font-medium text-white/90">{link.title}</p>
              <p className="mt-1 text-xs text-white/45">{link.desc}</p>
              <span className="mt-3 inline-block text-xs text-indigo-300/80">Open →</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0c0c14]/90 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-white/35">Open</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">{openCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0c0c14]/90 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-white/35">Closed</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">{closedCount}</p>
        </div>
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-white/35">Total</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums text-indigo-200">{total}</p>
        </div>
        <a
          href="mailto:sales@datacaptain.com?subject=Support%20—%20Enterprise"
          className="ml-auto flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white/80"
        >
          Email sales for enterprise →
        </a>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-[#0c0c14] p-6"
          >
            <h2 className="text-lg font-semibold">Create a ticket</h2>
            <p className="mt-1 text-sm text-white/45">
              Include steps to reproduce, API endpoint, and any error IDs from responses
            </p>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className={labelClass} htmlFor="ticket-subject">
                  Subject
                </label>
                <input
                  id="ticket-subject"
                  type="text"
                  placeholder="Brief summary of your issue"
                  value={createSubject}
                  onChange={(e) => setCreateSubject(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="ticket-priority">
                  Priority
                </label>
                <select
                  id="ticket-priority"
                  value={createPriority}
                  onChange={(e) => setCreatePriority(e.target.value)}
                  className={inputClass}
                >
                  <option value="LOW">Low — general question</option>
                  <option value="MEDIUM">Medium — blocking my work</option>
                  <option value="HIGH">High — production outage</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="ticket-message">
                  Message
                </label>
                <textarea
                  id="ticket-message"
                  placeholder="Describe your issue in detail…"
                  value={createMessage}
                  onChange={(e) => setCreateMessage(e.target.value)}
                  rows={5}
                  className={`${inputClass} min-h-[120px] resize-y`}
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Creating…" : "Submit ticket"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Ticket list */}
        <section className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Your tickets</h2>
            <span className="text-xs text-white/40">{filteredTickets.length} shown</span>
          </div>
          <div className="mt-4 flex gap-1 rounded-lg border border-white/10 bg-black/30 p-1">
            {(["ALL", "OPEN", "CLOSED"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === f
                    ? "bg-indigo-500/25 text-indigo-200"
                    : "text-white/45 hover:text-white/70"
                }`}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center">
              <p className="text-sm text-white/50">No tickets yet</p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Create your first ticket
              </button>
            </div>
          ) : (
            <ul className="mt-4 max-h-[min(28rem,60vh)] space-y-2 overflow-y-auto pr-1">
              {filteredTickets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openTicket(t)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedTicket?.id === t.id
                        ? "border-indigo-500/40 bg-indigo-500/10 shadow-md shadow-indigo-500/5"
                        : "border-white/5 bg-black/25 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 font-medium text-white/90">{t.subject}</span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyles(t.status)}`}
                      >
                        {formatStatus(t.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      <span className={priorityStyles(t.priority)}>{t.priority}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Conversation */}
        <section className="flex min-h-[min(24rem,50vh)] flex-col rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 lg:min-h-[28rem]">
          <h2 className="text-lg font-semibold">Conversation</h2>
          {selectedTicket ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                <p className="font-medium text-white/90">{selectedTicket.subject}</p>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase ${statusStyles(selectedTicket.status)}`}
                >
                  {formatStatus(selectedTicket.status)}
                </span>
                <span className={`text-xs ${priorityStyles(selectedTicket.priority)}`}>
                  {selectedTicket.priority} priority
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {selectedTicket.messages?.length ? (
                  selectedTicket.messages.map((m) => {
                    const isUser = m.sender === "USER";
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            isUser
                              ? "rounded-br-md border border-indigo-500/25 bg-indigo-500/15"
                              : "rounded-bl-md border border-white/10 bg-black/40"
                          }`}
                        >
                          <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                            {isUser ? "You" : "Support"}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
                            {m.message}
                          </p>
                          <p className="mt-2 text-[10px] text-white/35">
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-white/45">No messages in this thread yet.</p>
                )}
              </div>

              {selectedTicket.status !== "CLOSED" ? (
                <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                  <input
                    type="text"
                    placeholder="Type your reply…"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={inputClass}
                  />
                  <motion.button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={submitting || !newMessage.trim()}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Send
                  </motion.button>
                </div>
              ) : (
                <p className="mt-4 border-t border-white/10 pt-4 text-sm text-white/45">
                  This ticket is closed. Open a new ticket if you need more help.
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
              <p className="text-sm text-white/50">Select a ticket to view the conversation</p>
              <p className="mt-2 max-w-xs text-xs text-white/35">
                Or create a new ticket — include error IDs from API responses when possible
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
