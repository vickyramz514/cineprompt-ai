import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
