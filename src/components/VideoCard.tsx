"use client";

import type { VideoJob } from "@/store/useStore";

interface VideoCardProps {
  job: VideoJob;
  onDownload?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function VideoCard({ job, onDownload }: VideoCardProps) {
  return (
    <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-800/50">
        {job.thumbnail ? (
          <img src={job.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-dashed border-white/20" />
          </div>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-white/80">{job.prompt}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
          {job.status}
        </span>
        <span className="text-xs text-white/50">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>
      {job.status === "completed" && onDownload && (
        <button
          onClick={() => onDownload(job.id)}
          className="mt-3 w-full rounded-lg bg-indigo-500/20 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/30"
        >
          Download
        </button>
      )}
    </div>
  );
}
