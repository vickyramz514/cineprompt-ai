import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="md:pl-64">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
