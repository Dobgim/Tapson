"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X, ZoomIn, ZoomOut } from "lucide-react";
import { EASE } from "./motion/Reveal";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((images.length + next) % images.length);
      setZoom(1);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, index, go]);

  // Horizontal swipe on the main frame and inside the lightbox.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 48) go(index + (delta < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <div>
      <div
        className="group/frame relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Image
              src={images[index]}
              alt={`${title} — view ${index + 1} of ${images.length}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open fullscreen gallery"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/70"
        >
          <Expand className="h-4 w-4" aria-hidden="true" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 focus-visible:opacity-100 group-hover/frame:opacity-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 focus-visible:opacity-100 group-hover/frame:opacity-100"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        <p className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {index + 1} / {images.length}
        </p>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-lg border-2 transition-all duration-300",
                  i === index ? "border-accent-500" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex flex-col bg-ink-950/96 backdrop-blur-sm"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z - 0.5).toFixed(1))))}
                  disabled={zoom <= 1}
                  aria-label="Zoom out"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  <ZoomOut className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, Number((z + 0.5).toFixed(1))))}
                  disabled={zoom >= 3}
                  aria-label="Zoom in"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox(false)}
                  aria-label="Close gallery"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-auto">
              <motion.div
                key={images[index]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative mx-auto h-full w-full max-w-6xl"
              >
                <div
                  className="relative h-full w-full transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <Image
                    src={images[index]}
                    alt={`${title} — view ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-4 px-4 py-5">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous image"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink-900"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="font-display text-xs font-bold tracking-[0.2em] text-white/60">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next image"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink-900"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
