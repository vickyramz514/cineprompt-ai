"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PromptEditor from "@/components/PromptEditor";
import ProgressBar from "@/components/ProgressBar";
import Loader from "@/components/Loader";
import { VIDEO_STYLES, ASPECT_RATIOS } from "@/lib/mock-data";
import { useCreditsStore } from "@/store/useStore";
import { useVideoJobs } from "@/hooks/useVideoJobs";
import * as videoService from "@/services/video.service";
import * as walletService from "@/services/wallet.service";

// Duration options: 5, 10, 15, 20... up to maxDuration
const getDurationOptions = (maxDuration: number) => {
  const options: number[] = [];
  for (let d = 5; d <= Math.min(maxDuration, 60); d += 5) {
    options.push(d);
  }
  if (options.length === 0) options.push(5);
  return options;
};
const ADVANCED_OPTIONS = [
  { id: "camera", label: "Camera movement", options: ["Static", "Pan", "Zoom", "Orbit"] },
  { id: "lighting", label: "Lighting", options: ["Natural", "Dramatic", "Soft", "Neon"] },
  { id: "mood", label: "Mood", options: ["Epic", "Calm", "Energetic", "Mysterious"] },
];

function CreateVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const credits = useCreditsStore((s) => s.credits);
  const { generateVideo, pollJob } = useVideoJobs();

  const [prompt, setPrompt] = useState("");
  const [maxDuration, setMaxDuration] = useState(5);

  useEffect(() => {
    walletService.getLimits().then((data) => setMaxDuration(data.maxDuration)).catch(() => {});
  }, []);

  useEffect(() => {
    const templatePrompt = searchParams.get("prompt");
    if (templatePrompt) setPrompt(decodeURIComponent(templatePrompt));
  }, [searchParams]);

  const durationOptions = getDurationOptions(maxDuration);
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [advanced, setAdvanced] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (durationOptions.length > 0 && !durationOptions.includes(duration)) {
      setDuration(durationOptions[0]);
    }
  }, [durationOptions, duration]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (credits < duration) {
      setError("Insufficient credits. Please add more credits.");
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      const jobId = await generateVideo({
        prompt: prompt.trim(),
        durationSeconds: duration,
        duration,
        aspectRatio,
        style,
      });
      pollJob(jobId);
      router.push("/dashboard/history");
    } catch (err) {
      setError(videoService.getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const hasInsufficientCredits = credits < duration;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold">Create Video</h1>
      <p className="mt-1 text-white/60">Generate cinematic videos from your prompts</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Prompt</label>
            <PromptEditor value={prompt} onChange={setPrompt} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Style</label>
            <div className="flex flex-wrap gap-2">
              {VIDEO_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    style === s.id
                      ? "bg-indigo-500 text-white"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Duration (max {maxDuration}s for your plan)</label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    disabled={credits < d}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      duration === d ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Aspect ratio</label>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      aspectRatio === r.id ? "bg-indigo-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <details className="group rounded-xl border border-white/5 bg-white/[0.02]">
            <summary className="cursor-pointer px-4 py-3 font-medium">Advanced settings</summary>
            <div className="space-y-4 border-t border-white/5 px-4 py-4">
              {ADVANCED_OPTIONS.map((opt) => (
                <div key={opt.id}>
                  <label className="mb-2 block text-sm text-white/70">{opt.label}</label>
                  <select
                    value={advanced[opt.id] || opt.options[0]}
                    onChange={(e) => setAdvanced((a) => ({ ...a, [opt.id]: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
                  >
                    {opt.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-800/50">
              {isGenerating ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <Loader size="lg" />
                  <ProgressBar progress={50} label="Generating..." />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-white/30">
                  Video preview
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-white/60">Cost: {duration} credits ({duration}s)</span>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || hasInsufficientCredits}
                className="rounded-xl bg-indigo-500 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
            {hasInsufficientCredits && (
              <p className="mt-2 text-sm text-amber-400">Insufficient credits. Add more in Wallet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateVideoPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><Loader size="lg" /></div>}>
      <CreateVideoContent />
    </Suspense>
  );
}
