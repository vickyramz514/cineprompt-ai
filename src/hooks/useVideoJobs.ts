"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVideoJobsStore } from "@/store/useStore";
import * as videoService from "@/services/video.service";
import type { VideoJob as ApiVideoJob } from "@/services/video.service";

const POLL_INTERVAL_MS = 3000;

function mapStatus(s: string): "pending" | "processing" | "completed" | "failed" {
  const lower = s.toLowerCase();
  if (lower === "pending") return "pending";
  if (lower === "processing") return "processing";
  if (lower === "completed") return "completed";
  if (lower === "failed") return "failed";
  return lower === "failed" ? "failed" : "processing";
}

function mapJob(j: ApiVideoJob) {
  return {
    id: j.id,
    prompt: j.prompt,
    status: mapStatus(j.status),
    thumbnail: j.videoUrl ?? undefined,
    createdAt: j.createdAt,
    style: undefined,
    duration: undefined,
    videoUrl: j.videoUrl ?? undefined,
    progress: j.progress,
  };
}

export function useVideoJobs() {
  const { jobs, isLoading, error, setJobs, addJob, updateJob, setLoading, setError } = useVideoJobsStore();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await videoService.getVideoHistory(50, 0);
      setJobs(data.jobs.map(mapJob));
    } catch (err) {
      setError(videoService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setJobs, setLoading, setError]);

  const generateVideo = useCallback(
    async (payload: { prompt: string; duration?: number; aspectRatio?: string; style?: string }) => {
      setError(null);
      const data = await videoService.generateVideo({
        prompt: payload.prompt,
        duration: payload.duration ?? 10,
        aspectRatio: (payload.aspectRatio as "16:9" | "9:16" | "1:1") ?? "16:9",
        style: (payload.style as "cinematic" | "anime" | "realistic" | "fantasy") ?? "cinematic",
      });
      const job = mapJob({
        id: data.job.id,
        prompt: payload.prompt,
        status: data.job.status as ApiVideoJob["status"],
        progress: data.job.progress,
        creditsUsed: data.job.creditsUsed,
        createdAt: data.job.createdAt,
      });
      addJob(job);
      return data.job.id;
    },
    [addJob, setError]
  );

  const pollJob = useCallback(
    (jobId: string) => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const { job } = await videoService.getVideoById(jobId);
          updateJob(jobId, mapJob(job));
          if (job.status === "COMPLETED" || job.status === "FAILED") {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        } catch {
          // ignore poll errors
        }
      }, POLL_INTERVAL_MS);
    },
    [updateJob]
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return {
    jobs,
    isLoading,
    error,
    fetchHistory,
    generateVideo,
    pollJob,
  };
}
