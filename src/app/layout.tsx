import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProvider";
import AppChrome from "@/components/AppChrome";
import { getSiteUrl } from "@/lib/site-url";
import { OG_IMAGE } from "@/lib/page-metadata";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";

const siteUrl = getSiteUrl();

const themeBootScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="dark"||t==="ocean"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){document.documentElement.setAttribute("data-theme","dark")}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "US ETF Data API & Backtesting — Free Tier | Data Captain",
    template: "%s | Data Captain",
  },
  description:
    "Build with a US ETF API: historical prices, screener, heatmap, rankings, and backtesting. Free API key for developers — upgrade when you need higher limits.",
  keywords: [
    "ETF API",
    "US ETF data API",
    "historical ETF prices",
    "ETF backtesting",
    "market data API",
    "Data Captain",
  ],
  authors: [{ name: "Data Captain", url: siteUrl }],
  creator: "Data Captain",
  publisher: "Data Captain",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Data Captain",
    title: "US ETF Data API & Backtesting",
    description:
      "Historical ETF prices, screener, and backtesting API for developers. Start free.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "US ETF Data API — Free Tier",
    description: "Historical prices, ETF screener, and backtesting for developers.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="antialiased">
        <GoogleOAuthProviderWrapper>
          <AppChrome>{children}</AppChrome>
        </GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}
