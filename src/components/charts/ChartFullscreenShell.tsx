"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import ChartFullscreenButton from "@/components/charts/ChartFullscreenButton";

type ChartFullscreenContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const ChartFullscreenContext = createContext<ChartFullscreenContextValue | null>(null);

export function useChartFullscreen() {
  const ctx = useContext(ChartFullscreenContext);
  if (!ctx) {
    throw new Error("useChartFullscreen must be used within ChartFullscreenShell");
  }
  return ctx;
}

export function useChartFullscreenOptional() {
  return useContext(ChartFullscreenContext);
}

type ShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * Expands the same DOM subtree into a ~90vw × 90vh overlay.
 * Keeps a single React tree so lightweight-charts retains zoom, overlays, and series.
 */
export default function ChartFullscreenShell({
  title,
  subtitle,
  children,
  className = "",
  bodyClassName = "",
}: ShellProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [placeholderH, setPlaceholderH] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const setOpenSafe = useCallback((v: boolean) => {
    if (v && panelRef.current) {
      setPlaceholderH(panelRef.current.getBoundingClientRect().height);
    }
    setOpen(v);
  }, []);

  const toggle = useCallback(() => {
    setOpenSafe(!open);
  }, [open, setOpenSafe]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSafe(false);
    };
    window.addEventListener("keydown", onKey);
    const t1 = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
    const t2 = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 220);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
    };
  }, [open, setOpenSafe]);

  const ctx: ChartFullscreenContextValue = { open, setOpen: setOpenSafe, toggle };

  return (
    <ChartFullscreenContext.Provider value={ctx}>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open ? (
              <motion.button
                key="chart-fs-backdrop"
                type="button"
                aria-label="Close fullscreen"
                className="fixed inset-0 z-[70] cursor-default border-0 bg-black/75 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpenSafe(false)}
              />
            ) : null}
          </AnimatePresence>,
          document.body
        )}

      {open ? (
        <div className="w-full" style={{ height: placeholderH || undefined }} aria-hidden />
      ) : null}

      <motion.div
        ref={panelRef}
        layout={false}
        className={
          open
            ? `fixed left-[5vw] top-[5vh] z-[80] flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a12] shadow-2xl shadow-black/50 ${className}`
            : `relative ${className}`
        }
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-labelledby={open ? titleId : undefined}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {open && (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p id={titleId} className="truncate text-base font-semibold text-white sm:text-lg">
                {title}
              </p>
              {subtitle ? <p className="mt-0.5 truncate text-xs text-white/45">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setOpenSafe(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close fullscreen"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className={open ? `flex min-h-0 flex-1 flex-col overflow-auto ${bodyClassName}` : bodyClassName}>
          {children}
        </div>
      </motion.div>
    </ChartFullscreenContext.Provider>
  );
}

/** Remount-style modal for cases where cloning a chart is acceptable. */
export function FullscreenChartModal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby={titleId}
            className="relative z-10 flex h-[90vh] w-[90vw] max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a12] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p id={titleId} className="truncate text-base font-semibold text-white sm:text-lg">
                  {title}
                </p>
                {subtitle ? <p className="mt-0.5 truncate text-xs text-white/45">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close fullscreen"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function ChartFullscreenToggle({ className }: { className?: string }) {
  const { open, toggle } = useChartFullscreen();
  if (open) return null;
  return <ChartFullscreenButton onClick={toggle} className={className} />;
}
