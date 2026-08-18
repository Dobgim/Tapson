"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion/Reveal";

const SESSION_KEY = "repossessed-rides:intro-played";

/**
 * First-visit intro: the mark draws in, then two panels split away to reveal
 * the page. Plays once per session, and is skipped entirely for users who
 * prefer reduced motion.
 */
export function PageLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(false);
      document.body.style.overflow = "";
    }, 1750);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] grid place-items-center"
          exit={{ pointerEvents: "none" }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.75, ease: EASE }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-5"
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <motion.span
              className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-accent-500"
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <motion.svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <motion.path
                  d="M5 20V4h8.2a4.4 4.4 0 0 1 .9 8.7L19 20h-4.6l-4-6.6H9V20H5Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{ pathLength: { duration: 0.85, ease: "easeInOut" }, fillOpacity: { delay: 0.7, duration: 0.4 } }}
                  style={{ fill: "white" }}
                />
              </motion.svg>
            </motion.span>

            <motion.div
              className="h-px w-32 origin-left overflow-hidden bg-white/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="block h-full w-full bg-accent-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.15, delay: 0.3, ease: EASE }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>

            <motion.p
              className="font-display text-[0.625rem] font-bold uppercase tracking-[0.42em] text-white/45"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
            >
              Repossessed Rides
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
