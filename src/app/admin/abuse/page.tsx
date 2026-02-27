"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminAbusePage() {
  const [logs, setLogs] = useState<adminService.AdminAbuseLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 20;

  const fetchLogs = () => {
    setLoading(true);
    adminService
      .getAbuseLogs({ page, limit, type: type || undefined })
      .then((data) => {
        setLogs(data.logs as adminService.AdminAbuseLog[]);
        setTotal(data.total);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page, type]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Abuse Logs</h1>
      <p className="mt-1 text-white/60">Rate limits, spam, and policy violations</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
        >
          <option value="">All types</option>
          <option value="RATE_LIMIT">Rate Limit</option>
          <option value="CONCURRENT_JOB">Concurrent Job</option>
          <option value="PROMPT_SPAM">Prompt Spam</option>
          <option value="DAILY_CAP">Daily Cap</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Meta</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Created</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    {l.user ? `${l.user.name} (${l.user.email})` : l.userId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                      {l.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/60">
                    {l.meta ? JSON.stringify(l.meta) : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="flex items-center px-4">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
