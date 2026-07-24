import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProvider";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "US ETF Data API & Backtesting — Free Tier | Data Captain",
    template: "%s | Data Captain",
  },
  description:
    "Build with a US ETF API: historical prices, screener, heatmap, and backtesting. Free API key for developers — upgrade when you need higher limits.",
  icons: {
    icon: "/logo/logo.jpeg",
    apple: "/logo/logo.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Data Captain",
    title: "US ETF Data API & Backtesting | Data Captain",
    description:
      "Historical ETF prices, screener, and backtesting API for developers. Start free.",
    images: [
      {
        url: "/logo/logo.jpeg",
        width: 1254,
        height: 1254,
        alt: "Data Captain — Navigate Smarter Investments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "US ETF Data API — Free Tier | Data Captain",
    description: "Historical prices, ETF screener, and backtesting for developers.",
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
