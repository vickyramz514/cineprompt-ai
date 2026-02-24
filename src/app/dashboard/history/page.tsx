"use client";

import { useVideoJobsStore } from "@/store/useStore";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function HistoryPage() {
  const jobs = useVideoJobsStore((s) => s.jobs);

  return (
    <div>
      <h1 className="text-2xl font-semibold">History</h1>
      <p className="mt-1 text-white/60">Your video generation history</p>

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
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="h-12 w-20 overflow-hidden rounded-lg bg-zinc-800/50">
                    <div className="flex h-full w-full items-center justify-center text-white/30 text-xs">
                      —
                    </div>
                  </div>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate text-sm text-white/90">{job.prompt}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white/60">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {job.status === "completed" && (
                    <button className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30">
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
