"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-white/60">Admin and platform configuration</p>

      <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="font-medium">Platform Settings</h2>
        <p className="mt-2 text-sm text-white/60">
          Configuration is managed via environment variables on the backend.
          Contact your system administrator for changes.
        </p>
      </div>
    </div>
  );
}
