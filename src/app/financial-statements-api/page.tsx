import { SeoLandingView } from "@/components/seo/SeoLandingView";
import { getSeoLandingPage } from "@/lib/seo-landing-pages";
import { seoLandingMetadata } from "@/lib/seo-landing-metadata";
import { getSiteUrl } from "@/lib/site-url";

const SLUG = "financial-statements-api";
const page = getSeoLandingPage(SLUG)!;

export const metadata = seoLandingMetadata(SLUG);

export default function FinancialStatementsApiPage() {
  return <SeoLandingView page={page} siteUrl={getSiteUrl()} />;
}
