"use client";

import { useEffect } from "react";
import { useVideoJobs } from "@/hooks/useVideoJobs";
import { useVideoJobsStore } from "@/store/useStore";
import Loader from "@/components/Loader";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function HistoryPage() {
  const { jobs, isLoading, error, fetchHistory } = useVideoJobs();
  const storeError = useVideoJobsStore((s) => s.error);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const err = error || storeError;

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">History</h1>
      <p className="mt-1 text-white/60">Your video generation history</p>

      {err && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {err}
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Preview</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Prompt</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-white/50">
                  No videos yet. Create your first video!
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="h-12 w-20 overflow-hidden rounded-lg bg-zinc-800/50">
                      {job.thumbnail || job.videoUrl ? (
                        <img
                          src={job.thumbnail || job.videoUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/30 text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate text-sm text-white/90">{job.prompt}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status] || "bg-white/10 text-white/70"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {job.status === "completed" && (job.videoUrl || job.thumbnail) && (
                      <a
                        href={job.videoUrl || job.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30"
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
