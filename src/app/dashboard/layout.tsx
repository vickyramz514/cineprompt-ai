import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import DashboardProvider from "@/components/DashboardProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardProvider>
        <div className="min-h-screen bg-[#0a0a0f]">
          <Navbar />
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <main className="md:pl-64">
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </DashboardProvider>
    </AuthGuard>
  );
}
