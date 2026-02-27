"use client";

import { useState, useEffect } from "react";
import * as supportService from "@/services/support.service";
import Loader from "@/components/Loader";

export default function SupportPage() {
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

  const fetchTickets = () => {
    setLoading(true);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createSubject.trim() || !createMessage.trim()) return;
    setSubmitting(true);
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
        setSelectedTicket(ticket);
        fetchTickets();
      })
      .catch((err) => setError(supportService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    setSubmitting(true);
    supportService
      .addMessage(selectedTicket.id, newMessage)
      .then(() => {
        setNewMessage("");
        supportService.getTicketById(selectedTicket.id).then(setSelectedTicket);
      })
      .catch((err) => setError(supportService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const openTicket = (t: supportService.SupportTicket) => {
    supportService.getTicketById(t.id).then(setSelectedTicket);
  };

  const statusColor = (s: string) =>
    s === "CLOSED" ? "bg-gray-500/20 text-gray-400" : s === "IN_PROGRESS" ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="mt-1 text-white/60">Create and manage support tickets</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600"
        >
          New Ticket
        </button>
      </div>

      {showCreate && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">Create Ticket</h2>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Subject"
              value={createSubject}
              onChange={(e) => setCreateSubject(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              required
            />
            <select
              value={createPriority}
              onChange={(e) => setCreatePriority(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <textarea
              placeholder="Describe your issue..."
              value={createMessage}
              onChange={(e) => setCreateMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-white/20 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium">Your Tickets ({total})</h2>
          {loading ? (
            <div className="mt-4 flex justify-center">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openTicket(t)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    selectedTicket?.id === t.id
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{t.subject}</span>
                    <span className={`rounded px-2 py-0.5 text-xs ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-medium">Conversation</h2>
          {selectedTicket ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex justify-between">
                <span className="font-medium">{selectedTicket.subject}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${statusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {selectedTicket.messages?.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-3 ${
                      m.sender === "USER" ? "bg-indigo-500/20 ml-8" : "bg-white/5 mr-8"
                    }`}
                  >
                    <p className="text-sm font-medium text-white/60">{m.sender}</p>
                    <p className="mt-1">{m.message}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              {selectedTicket.status !== "CLOSED" && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={submitting || !newMessage.trim()}
                    className="rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-white/60">Select a ticket to view conversation</p>
          )}
        </div>
      </div>
    </div>
  );
}
