import LegalDocumentView from "@/components/LegalDocumentView";
import { TERMS_OF_SERVICE } from "@/lib/legal-content";

export const metadata = {
  title: "Terms of Service | Data Captain",
  description: "Terms of Service for the Data Captain US stock and ETF data API.",
};

export default function TermsPage() {
  return (
    <LegalDocumentView
      document={TERMS_OF_SERVICE}
      sibling={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
