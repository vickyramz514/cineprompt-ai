import type { Metadata } from "next";
import "./globals.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProvider";

export const metadata: Metadata = {
  title: "CinePrompt AI - Create cinematic videos from text",
  description: "Turn imagination into reality using AI powered video generation.",
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
