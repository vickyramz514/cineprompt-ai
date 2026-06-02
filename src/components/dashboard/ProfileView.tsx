"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40";

const QUICK_LINKS = [
  { href: "/dashboard/api-keys", label: "API Keys", desc: "Manage keys" },
  { href: "/dashboard/usage", label: "Usage", desc: "View quota" },
  { href: "/dashboard/wallet", label: "Billing", desc: "Plans & credits" },
  { href: "/dashboard/notifications", label: "Notifications", desc: "Alerts" },
];

function ProfileAvatar({
  name,
  email,
  avatar,
  plan,
}: {
  name: string;
  email: string;
  avatar?: string | null;
  plan?: string;
}) {
  const initial = (name?.[0] || email?.[0] || "?").toUpperCase();

  return (
    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-5">
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/50 to-violet-500/30 blur-sm" />
        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 to-violet-600/20 text-3xl font-semibold text-indigo-100">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-1">
        <h2 className="text-xl font-semibold text-white">{name || "Developer"}</h2>
        <p className="mt-0.5 text-sm text-white/50">{email}</p>
        {plan && (
          <span className="mt-2 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-0.5 text-xs font-medium capitalize text-indigo-200">
            {plan} plan
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProfileView() {
  const { user, profile, isLoading, error, fetchProfile, updateProfile } = useProfile();
  const { logout } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setSaveSuccess(false);
    try {
      await updateProfile({
        name: name || undefined,
        bio: bio || undefined,
        company: company || undefined,
        website: website || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      // error in hook
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="space-y-8">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-sky-300/80">Account</p>
        <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-white/50">Your identity and developer account settings</p>
      </motion.div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <span className="text-emerald-400">✓</span>
            <p className="text-sm text-emerald-200">Profile saved successfully</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
        {/* Sidebar summary */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-sky-500/5 p-6"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative">
              {user && (
                <ProfileAvatar
                  name={user.name}
                  email={user.email}
                  avatar={user.avatar}
                  plan={user.plan}
                />
              )}
              {user?.provider && (
                <p className="mt-4 text-center text-xs text-white/40 sm:text-left">
                  Signed in with <span className="capitalize text-white/60">{user.provider}</span>
                </p>
              )}
            </div>
          </motion.div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-white/35">Shortcuts</p>
            <ul className="mt-3 space-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                  >
                    <span className="text-white/80">{link.label}</span>
                    <span className="text-xs text-white/35">{link.desc} →</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => logout()}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6"
          >
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="mt-1 text-sm text-white/45">Basic information tied to your login</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="profile-name">
                  Display name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email</label>
                <div className="rounded-xl border border-white/5 bg-black/30 px-4 py-2.5">
                  <p className="text-sm text-white/85">{user?.email}</p>
                  <p className="mt-0.5 text-xs text-white/40">Email cannot be changed here</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6"
          >
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-1 text-sm text-white/45">Optional details for your developer profile</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className={labelClass} htmlFor="profile-bio">
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your project or use case…"
                  className={`${inputClass} resize-y min-h-[100px]`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="profile-company">
                  Company
                </label>
                <input
                  id="profile-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                  placeholder="Company or organization"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6"
          >
            <h2 className="text-lg font-semibold">Links</h2>
            <p className="mt-1 text-sm text-white/45">Public profile links</p>
            <div className="mt-5">
              <label className={labelClass} htmlFor="profile-website">
                Website
              </label>
              <input
                id="profile-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className={inputClass}
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6"
          >
            <div>
              <h2 className="text-lg font-semibold">Subscription</h2>
              <p className="mt-1 text-sm text-white/45">
                You&apos;re on the <span className="capitalize text-indigo-300">{user?.plan ?? "free"}</span> plan
              </p>
            </div>
            <Link
              href="/dashboard/wallet"
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-5 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/25"
            >
              Manage billing
            </Link>
          </motion.section>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </motion.button>
            <button
              type="button"
              onClick={() => {
                if (user) setName(user.name ?? "");
                if (profile) {
                  setBio(profile.bio ?? "");
                  setCompany(profile.company ?? "");
                  setWebsite(profile.website ?? "");
                }
              }}
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
