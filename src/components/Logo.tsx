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
    <span className={cn("group/logo flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[0.55rem] bg-accent-500 sm:h-10 sm:w-10 sm:rounded-[0.6rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/logo:scale-105"
      >
        <span className="absolute -left-2 top-0 h-full w-3 -skew-x-12 bg-white/20" />
        <span className="absolute -right-3 top-0 h-full w-5 -skew-x-12 bg-black/15" />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
          <path
            d="M5 20V4h8.2a4.4 4.4 0 0 1 .9 8.7L19 20h-4.6l-4-6.6H9V20H5Zm4-9.6h3.6a1.6 1.6 0 0 0 0-3.2H9v3.2Z"
            fill="white"
          />
        </svg>
      </span>
      <span className="hidden min-w-0 flex-col leading-none xs:flex">
        <span
          className={cn(
            "truncate font-display text-base font-extrabold uppercase tracking-[0.02em] sm:text-lg lg:text-xl",
            tone === "light" ? "text-white" : "text-ink-900",
          )}
        >
          Repossessed Rides
        </span>
        <span
          className={cn(
            "hidden font-display text-[0.5625rem] font-bold uppercase tracking-[0.34em] sm:block",
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
    <Link href={href} aria-label="Repossessed Rides — home" className="flex min-w-0 shrink">
      {mark}
    </Link>
  );
}
