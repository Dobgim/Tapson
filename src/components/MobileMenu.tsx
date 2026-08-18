"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail, MapPin, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink, SlideArrow } from "./ui/Button";
import { locations, primaryNav, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { EASE } from "./motion/Reveal";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock the page behind the drawer and trap Escape.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.46, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col bg-white shadow-lift-lg outline-none"
          >
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 hover:text-accent-500"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}
                className="space-y-1"
              >
                {primaryNav.map((item) => {
                  const isOpen = expanded === item.label;
                  return (
                    <motion.li
                      key={item.label}
                      variants={{
                        hidden: { opacity: 0, x: 24 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
                      }}
                      className="border-b border-ink-100 last:border-0"
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex-1 py-3.5 font-display text-lg font-bold uppercase tracking-[0.04em] text-ink-900"
                        >
                          {item.label}
                        </Link>
                        {item.columns && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : item.label)}
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                            className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
                          >
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && item.columns && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.34, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pb-4">
                              {item.columns.map((col) => (
                                <div key={col.heading}>
                                  <p className="eyebrow mb-2 text-ink-400">{col.heading}</p>
                                  <ul className="space-y-0.5">
                                    {col.links.map((link) => (
                                      <li key={link.label}>
                                        <Link
                                          href={link.href}
                                          onClick={onClose}
                                          className="block rounded-lg px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-50 hover:text-accent-500"
                                        >
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease: EASE }}
                className="mt-7 space-y-3"
              >
                <ButtonLink href="/inventory" size="lg" className="w-full" onClick={onClose}>
                  Shop Inventory
                  <SlideArrow />
                </ButtonLink>
                <ButtonLink href="/financing" variant="outline" size="lg" className="w-full" onClick={onClose}>
                  Apply for Financing
                </ButtonLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 space-y-3 rounded-2xl bg-ink-50 p-5 text-sm"
              >
                <a href={site.phoneHref} className="flex items-center gap-3 text-ink-700">
                  <Phone className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink-700">
                  <Mail className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {site.email}
                </a>
                <div className="flex items-start gap-3 text-ink-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  <span>
                    {locations.length} South Florida stores —{" "}
                    <Link href="/locations" onClick={onClose} className="font-semibold text-accent-500 underline-offset-4 hover:underline">
                      see all
                    </Link>
                  </span>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
