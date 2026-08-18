import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Original wordmark authored for this build — an angled "R" counter inside a
 * speed block, set against a condensed uppercase logotype.
 */
export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string | null;
}) {
  const mark = (
    <span className={cn("group/logo flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] bg-accent-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/logo:scale-105"
      >
        <span className="absolute -left-2 top-0 h-full w-3 -skew-x-12 bg-white/20" />
        <span className="absolute -right-3 top-0 h-full w-5 -skew-x-12 bg-black/15" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5" aria-hidden="true">
          <path
            d="M5 20V4h8.2a4.4 4.4 0 0 1 .9 8.7L19 20h-4.6l-4-6.6H9V20H5Zm4-9.6h3.6a1.6 1.6 0 0 0 0-3.2H9v3.2Z"
            fill="white"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-extrabold uppercase tracking-[0.02em]",
            tone === "light" ? "text-white" : "text-ink-900",
          )}
        >
          Riva
        </span>
        <span
          className={cn(
            "font-display text-[0.5625rem] font-bold uppercase tracking-[0.34em]",
            tone === "light" ? "text-white/60" : "text-ink-500",
          )}
        >
          Motorsports
        </span>
      </span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label="RIVA Motorsports — home">
      {mark}
    </Link>
  );
}
