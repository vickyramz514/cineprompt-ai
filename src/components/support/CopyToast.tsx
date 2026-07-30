"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function CopyToast({ show, message }: { show: boolean; message: string }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {show ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--dc-fg)] shadow-lg"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
