"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { SlideArrow } from "./ui/Button";
import { locations } from "@/data/site";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/finance";
import { cn, formatUsage } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const store = locations.find((l) => l.id === product.locationId);
  const usage = formatUsage(product.usage);

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-ink-300 hover:shadow-lift-lg",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.08]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm",
              product.condition === "New" ? "bg-accent-500" : "bg-ink-900/85",
            )}
          >
            {product.condition}
          </span>
          {product.savings > 0 && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white">
              Save {formatPrice(product.savings)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.title} from saved` : `Save ${product.title}`}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition-all duration-300",
            saved ? "bg-accent-500 text-white" : "bg-black/35 text-white hover:bg-black/60",
          )}
        >
          <motion.span animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
            <Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
          </motion.span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.18em] text-ink-400">
          {product.year} · {product.make}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-tight font-extrabold uppercase tracking-tight text-ink-900">
          <Link href={`/inventory/${product.slug}`} className="after:absolute after:inset-0">
            {product.model}
            {product.trim ? ` ${product.trim}` : ""}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          {store && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
              {store.city}
            </span>
          )}
          {usage && <span>{usage}</span>}
          <span>Stock {product.stockNumber}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              {product.msrp && (
                <p className="text-xs text-ink-400 line-through">{formatPrice(product.msrp)}</p>
              )}
              <p className="font-display text-2xl font-extrabold tracking-tight text-ink-900 transition-colors duration-300 group-hover/card:text-accent-500">
                {formatPrice(product.price)}
              </p>
            </div>
            <p className="text-right text-xs leading-tight text-ink-500">
              <span className="block font-display text-sm font-bold text-ink-900">
                ${product.monthlyPayment}/mo
              </span>
              est. w/ approved credit
            </p>
          </div>

          <span className="mt-4 flex items-center justify-between rounded-full bg-ink-50 px-4 py-2.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-900 transition-colors duration-500 group-hover/card:bg-ink-900 group-hover/card:text-white">
            View details
            <SlideArrow />
          </span>
        </div>
      </div>
    </article>
  );
}
