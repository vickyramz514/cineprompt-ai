"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import { useAuth } from "@/hooks/useAuth";

const SIDEBAR_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/jobs", label: "Jobs", icon: "🎬" },
  { href: "/admin/payments", label: "Payments", icon: "💳" },
  { href: "/admin/support", label: "Support", icon: "💬" },
  { href: "/admin/affiliate", label: "Affiliates", icon: "🤝" },
  { href: "/admin/growth", label: "Growth", icon: "📈" },
  { href: "/admin/investor", label: "Investor", icon: "💰" },
  { href: "/admin/abuse", label: "Abuse Logs", icon: "🛡️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <aside className="w-64 shrink-0 border-r border-white/5 bg-black/40">
          <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
            <span className="text-lg font-semibold">
              CinePrompt <span className="text-amber-400">Admin</span>
            </span>
          </div>
          <nav className="space-y-1 p-4">
            {SIDEBAR_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${
                  pathname === item.href ? "bg-amber-500/20 text-amber-300" : "text-white/80"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/40 px-6">
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder="Search..."
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">
                {user?.name} ({user?.role})
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-white/60 hover:text-white"
              >
                ← App
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
