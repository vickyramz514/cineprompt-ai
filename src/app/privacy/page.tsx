import LegalDocumentView from "@/components/LegalDocumentView";
import { PRIVACY_POLICY } from "@/lib/legal-content";

export const metadata = {
  title: "Privacy Policy | Data Captain",
  description: "Privacy Policy for Data Captain — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentView
      document={PRIVACY_POLICY}
      sibling={{ href: "/terms", label: "Terms of Service" }}
    />
  );
}
