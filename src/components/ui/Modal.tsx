"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "../motion/Reveal";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Minimal focus trap so keyboard users can't tab behind the dialog.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift-lg outline-none sm:rounded-3xl ${
              size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl"
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
