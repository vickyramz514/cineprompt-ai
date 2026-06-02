import { Suspense } from "react";
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
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <main className="min-h-screen md:pl-[17.5rem]">
            <div className="p-4 pt-16 md:p-6 md:pt-6 lg:p-8">{children}</div>
          </main>
        </div>
      </DashboardProvider>
    </AuthGuard>
  );
}
