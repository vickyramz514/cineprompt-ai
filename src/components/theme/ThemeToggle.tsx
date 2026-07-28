"use client";

import { THEMES, useTheme, type AppTheme } from "@/components/theme/ThemeProvider";

const ICONS: Record<AppTheme, string> = {
  dark: "M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
  light:
    "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
  ocean:
    "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
};

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, cycleTheme } = useTheme();

  if (compact) {
    const meta = THEMES.find((t) => t.id === theme)!;
    return (
      <button
        type="button"
        onClick={cycleTheme}
        title={`Theme: ${meta.label}. Click to change.`}
        aria-label={`Current theme ${meta.label}. Change theme.`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] bg-[var(--dc-elevated)] text-[var(--dc-fg)] transition hover:border-[var(--dc-accent)]/40 hover:bg-[var(--dc-accent-soft)]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[theme]} />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-[var(--dc-border)] bg-[var(--dc-elevated)] p-1"
      role="group"
      aria-label="Color theme"
    >
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            title={t.hint}
            aria-pressed={active}
            onClick={() => setTheme(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-[var(--dc-accent-soft)] text-[var(--dc-accent)] ring-1 ring-[var(--dc-accent)]/30"
                : "text-[var(--dc-muted)] hover:text-[var(--dc-fg)]"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[t.id]} />
            </svg>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
