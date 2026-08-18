"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Scroll-snap rail. Native scrolling means it swipes correctly on touch with no
 * gesture library; the arrows page by one card width on pointer devices.
 */
export function ProductCarousel({
  products,
  className,
  tone = "dark",
}: {
  products: Product[];
  className?: string;
  tone?: "dark" | "light";
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const light = tone === "light";

  return (
    <div className={cn("relative", className)}>
      <div ref={railRef} className="rail pb-2">
        {products.map((product, i) => (
          <div key={product.id} className="w-[86vw] max-w-[22rem] sm:w-[20rem] lg:w-[21.5rem]">
            <ProductCard product={product} priority={i < 2} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className={cn("text-xs", light ? "text-white/45" : "text-ink-500")}>
          Swipe or use the arrows — {products.length} units
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous units"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 disabled:opacity-30",
              light
                ? "border-white/20 text-white hover:border-white hover:bg-white hover:text-ink-900"
                : "border-ink-300 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="Next units"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 disabled:opacity-30",
              light
                ? "border-white/20 text-white hover:border-white hover:bg-white hover:text-ink-900"
                : "border-ink-300 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
            )}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
