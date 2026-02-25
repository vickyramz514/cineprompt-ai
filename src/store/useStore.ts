import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: "free" | "starter" | "creator" | "pro" | string;
  credits?: number;
};

export type VideoJob = {
  id: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  thumbnail?: string;
  videoUrl?: string;
  createdAt: string;
  style?: string;
  duration?: number;
  progress?: number;
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

export const useAuthStore = create<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, isAuthenticated: false, error: null }),
}));

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
}>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useCreditsStore = create<{
  credits: number;
  isLoading: boolean;
  error: string | null;
  setCredits: (credits: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  deductCredits: (amount: number) => void;
}>((set) => ({
  credits: 0,
  isLoading: false,
  error: null,
  setCredits: (credits) => set({ credits }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
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
  isLoading: boolean;
  error: string | null;
  setJobs: (jobs: VideoJob[]) => void;
  addJob: (job: VideoJob) => void;
  updateJob: (id: string, updates: Partial<VideoJob>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getJobs: () => VideoJob[];
}>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
  updateJob: (id, updates) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getJobs: () => get().jobs,
}));
