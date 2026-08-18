"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

/** Counts up once the element scrolls into view; snaps instantly if reduced. */
export function Counter({ to, duration = 1.8, suffix = "", prefix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo — fast start, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat("en-US").format(value)}
      {suffix}
    </span>
  );
}
