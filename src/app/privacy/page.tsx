import type { Metadata } from "next";
import LegalDocumentView from "@/components/LegalDocumentView";
import { PRIVACY_POLICY } from "@/lib/legal-content";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Data Captain — how we collect, use, and protect your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalDocumentView
      document={PRIVACY_POLICY}
      sibling={{ href: "/terms", label: "Terms of Service" }}
    />
  );
}
