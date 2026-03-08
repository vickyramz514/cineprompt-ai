import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProvider";

export const metadata: Metadata = {
  title: "Stock Data API - US Stock Market & ETF Historical Data",
  description: "US Stock Market and ETF Historical Data API (2000–Present). REST API for historical stock prices.",
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
