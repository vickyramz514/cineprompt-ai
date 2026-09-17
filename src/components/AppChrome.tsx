"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import HelpChatbot from "@/components/HelpChatbot";
import SentryInit from "@/components/SentryInit";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SentryInit />
      {children}
      <HelpChatbot />
    </ThemeProvider>
  );
}
