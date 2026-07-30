"use client";

import SupportDataCaptain from "@/components/support/SupportDataCaptain";

/** Top-right Support CTA for dashboard pages (outside the left sidebar). */
export default function DashboardSupportBar() {
  return (
    <div className="mb-4 flex justify-end md:mb-5">
      <SupportDataCaptain variant="header" />
    </div>
  );
}
