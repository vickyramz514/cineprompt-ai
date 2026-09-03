"use client";

import SupportDataCaptain from "@/components/support/SupportDataCaptain";
import { DONATION_CONFIG } from "@/lib/donation-config";

/** Top-right Support CTA for dashboard pages (outside the left sidebar). */
export default function DashboardSupportBar() {
  if (!DONATION_CONFIG.enabled) return null;

  return (
    <div className="mb-4 flex justify-end md:mb-5">
      <SupportDataCaptain variant="header" />
    </div>
  );
}
