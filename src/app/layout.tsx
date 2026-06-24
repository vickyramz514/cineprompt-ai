import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProvider";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Data Captain — US ETF Data API, Backtesting & Portfolio Tools",
    template: "%s | Data Captain",
  },
  description:
    "US ETF historical data API, backtesting, and portfolio comparison for developers and fintech teams. Free tier with clear upgrade path.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Data Captain",
    title: "Data Captain — US ETF Data Platform",
    description: "ETF APIs, backtesting, and portfolio tools for US market data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Captain",
    description: "US ETF data API with backtesting built in.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GoogleOAuthProviderWrapper>
          {children}
        </GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}
