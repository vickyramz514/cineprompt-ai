"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<adminService.AdminJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const limit = 20;

  const fetchJobs = () => {
    setLoading(true);
    adminService
      .getJobs({ page, limit, status: status || undefined })
      .then((data) => {
        setJobs(data.jobs as adminService.AdminJob[]);
        setTotal(data.total);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [page, status]);

  const handleCancel = async (jobId: string) => {
    setCancelling(jobId);
    adminService
      .cancelJob(jobId)
      .then(fetchJobs)
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setCancelling(null));
  };

  const totalPages = Math.ceil(total / limit);
  const canCancel = (s: string) =>
    ["PENDING", "QUEUED", "PROCESSING"].includes(s);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <p className="mt-1 text-white/60">Monitor and manage video generation jobs</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="QUEUED">Queued</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
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
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Job ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Provider</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Cost</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-mono text-xs">{j.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    {j.user?.name} ({j.user?.email})
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        j.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : j.status === "FAILED" || j.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{j.provider}</td>
                  <td className="px-4 py-3">{j.creditsUsed}s</td>
                  <td className="px-4 py-3">${(j.cost ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {new Date(j.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {canCancel(j.status) && (
                      <button
                        onClick={() => handleCancel(j.id)}
                        disabled={cancelling === j.id}
                        className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                      >
                        {cancelling === j.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
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
