"use client";

interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export default function ProgressBar({ progress, label, className = "" }: ProgressBarProps) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-white/70">{label}</span>
          <span className="text-indigo-400">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
