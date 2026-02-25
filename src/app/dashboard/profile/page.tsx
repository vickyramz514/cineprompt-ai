"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const { user, profile, isLoading, error, fetchProfile, updateProfile } = useProfile();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) setName(user.name ?? "");
    if (profile) {
      setBio(profile.bio ?? "");
      setCompany(profile.company ?? "");
      setWebsite(profile.website ?? "");
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: name || undefined,
        bio: bio || undefined,
        company: company || undefined,
        website: website || undefined,
      });
    } catch {
      // Error in store
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-white/60">Manage your account settings</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">User info</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Email</label>
              <p className="font-medium text-white/80">{user?.email}</p>
              <p className="text-xs text-white/50">Email cannot be changed</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">Plan</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300 capitalize">
              {user?.plan ?? "Free"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-500 px-6 py-2.5 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
