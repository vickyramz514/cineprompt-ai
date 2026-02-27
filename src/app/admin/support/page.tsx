"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<adminService.SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<adminService.SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = () => {
    setLoading(true);
    adminService
      .getSupportTickets({ status: status || undefined })
      .then((data) => {
        setTickets(data.tickets);
        setTotal(data.total);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [status]);

  const openTicket = (t: adminService.SupportTicket) => {
    adminService.getSupportTicketById(t.id).then(setSelectedTicket);
  };

  const handleReply = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    setSubmitting(true);
    adminService
      .addSupportMessage(selectedTicket.id, newMessage)
      .then(() => {
        setNewMessage("");
        adminService.getSupportTicketById(selectedTicket.id).then(setSelectedTicket);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const handleClose = async () => {
    if (!selectedTicket) return;
    setSubmitting(true);
    adminService
      .closeSupportTicket(selectedTicket.id)
      .then(() => {
        setSelectedTicket(null);
        fetchTickets();
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  const statusColor = (s: string) =>
    s === "CLOSED" ? "bg-gray-500/20" : s === "IN_PROGRESS" ? "bg-amber-500/20" : "bg-green-500/20";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Support Tickets</h1>
      <p className="mt-1 text-white/60">Manage customer support requests</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium">Tickets ({total})</h2>
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
                  className={`w-full rounded-lg border p-4 text-left ${
                    selectedTicket?.id === t.id ? "border-indigo-500/50 bg-indigo-500/10" : "border-white/5 bg-white/5"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{t.subject}</span>
                    <span className={`rounded px-2 py-0.5 text-xs ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{t.user?.email}</p>
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
                <div>
                  <span className="font-medium">{selectedTicket.subject}</span>
                  <p className="text-sm text-white/60">{selectedTicket.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== "CLOSED" && (
                    <>
                      <button
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded bg-red-500/20 px-3 py-1 text-sm text-red-400"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {selectedTicket.messages?.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-3 ${m.sender === "ADMIN" ? "bg-amber-500/20 ml-8" : "bg-white/5 mr-8"}`}
                  >
                    <p className="text-sm font-medium text-white/60">{m.sender}</p>
                    <p className="mt-1">{m.message}</p>
                  </div>
                ))}
              </div>
              {selectedTicket.status !== "CLOSED" && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  />
                  <button
                    onClick={handleReply}
                    disabled={submitting || !newMessage.trim()}
                    className="rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-white/60">Select a ticket</p>
          )}
        </div>
      </div>
    </div>
  );
}
