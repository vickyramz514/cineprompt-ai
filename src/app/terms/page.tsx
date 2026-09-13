import type { Metadata } from "next";
import LegalDocumentView from "@/components/LegalDocumentView";
import { TERMS_OF_SERVICE } from "@/lib/legal-content";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for the Data Captain US ETF data API, dashboard, and related services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocumentView
      document={TERMS_OF_SERVICE}
      sibling={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
