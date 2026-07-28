"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import HelpChatbot from "@/components/HelpChatbot";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <HelpChatbot />
    </ThemeProvider>
  );
}
