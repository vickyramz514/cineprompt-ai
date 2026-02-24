import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "starter" | "creator" | "pro";
};

export type VideoJob = {
  id: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  thumbnail?: string;
  createdAt: string;
  style?: string;
  duration?: number;
};

export type UIState = {
  sidebarOpen: boolean;
  modalOpen: string | null;
  setSidebarOpen: (open: boolean) => void;
  setModalOpen: (modal: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  modalOpen: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setModalOpen: (modal) => set({ modalOpen: modal }),
}));

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
}>((set) => ({
  user: {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    plan: "creator",
  },
  setUser: (user) => set({ user }),
}));

export const useCreditsStore = create<{
  credits: number;
  setCredits: (credits: number) => void;
  deductCredits: (amount: number) => void;
}>((set) => ({
  credits: 450,
  setCredits: (credits) => set({ credits }),
  deductCredits: (amount) => set((s) => ({ credits: Math.max(0, s.credits - amount) })),
}));

export type FavoriteTemplate = { templateId: string; addedAt: string };
export type UsedTemplate = { templateId: string; usedAt: string };

export const useTemplateStore = create<{
  selectedNiche: string | null;
  favorites: FavoriteTemplate[];
  usedTemplates: UsedTemplate[];
  setSelectedNiche: (niche: string | null) => void;
  addFavorite: (templateId: string) => void;
  removeFavorite: (templateId: string) => void;
  addUsedTemplate: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;
}>((set, get) => ({
  selectedNiche: null,
  favorites: [],
  usedTemplates: [],
  setSelectedNiche: (niche) => set({ selectedNiche: niche }),
  addFavorite: (id) =>
    set((s) => ({
      favorites: [...s.favorites, { templateId: id, addedAt: new Date().toISOString() }],
    })),
  removeFavorite: (id) =>
    set((s) => ({ favorites: s.favorites.filter((f) => f.templateId !== id) })),
  addUsedTemplate: (id) =>
    set((s) => ({
      usedTemplates: [...s.usedTemplates, { templateId: id, usedAt: new Date().toISOString() }],
    })),
  isFavorite: (id) => get().favorites.some((f) => f.templateId === id),
}));

export const useVideoJobsStore = create<{
  jobs: VideoJob[];
  addJob: (job: VideoJob) => void;
  updateJob: (id: string, updates: Partial<VideoJob>) => void;
  getJobs: () => VideoJob[];
}>((set, get) => ({
  jobs: [
    {
      id: "1",
      prompt: "A drone flying over misty mountains at sunrise",
      status: "completed",
      createdAt: "2025-02-20T10:30:00Z",
    },
    {
      id: "2",
      prompt: "Cinematic city night time-lapse",
      status: "processing",
      createdAt: "2025-02-24T09:15:00Z",
    },
    {
      id: "3",
      prompt: "Underwater coral reef exploration",
      status: "pending",
      createdAt: "2025-02-24T11:00:00Z",
    },
  ],
  addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
  updateJob: (id, updates) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  getJobs: () => get().jobs,
}));
