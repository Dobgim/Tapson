"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ComponentType, ElementType, ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * motion.create() must not run during render: a fresh component identity each
 * pass would remount the subtree. Cache one motion component per tag.
 */
const motionCache = new Map<ElementType, MotionTagComponent>();

/**
 * All tags we render through here are ordinary block/inline HTML elements, so
 * the div prop surface is the right shape to expose to callers.
 */
type MotionTagComponent = ComponentType<HTMLMotionProps<"div">>;

function motionTag(as: ElementType): MotionTagComponent {
  let cached = motionCache.get(as);
  if (!cached) {
    cached = motion.create(as as string) as MotionTagComponent;
    motionCache.set(as, cached);
  }
  return cached;
}

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  /** Adds a subtle blur-in. Skipped when the user prefers reduced motion. */
  blur?: boolean;
  as?: ElementType;
  once?: boolean;
};

/**
 * Scroll-triggered entrance. Under `prefers-reduced-motion` it degrades to a
 * plain opacity fade with no transform, per the WCAG motion guidance.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  direction = "up",
  blur = false,
  as = "div",
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motionTag(as);
  const { x, y } = reduced ? offset.none : offset[direction];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x, y, filter: blur && !reduced ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.35 : duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its Reveal-styled children. Pair with <StaggerItem>. */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  as?: ElementType;
}) {
  const MotionTag = motionTag(as);
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motionTag(as);
  const { x, y } = reduced ? offset.none : offset[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: reduced ? 0.3 : 0.65, ease: EASE } },
  };

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}

