"use client";

import { useAuthStore } from "@/store/useStore";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-white/60">Manage your account settings</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">User info</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-white/60">Name</label>
              <p className="mt-1 font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Email</label>
              <p className="mt-1 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">Plan</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300 capitalize">
              {user?.plan}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-lg font-medium">Settings</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/80">Email notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/80">Marketing emails</span>
              <input type="checkbox" className="rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
