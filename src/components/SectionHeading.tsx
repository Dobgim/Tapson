import Link from "next/link";
import { Reveal } from "./motion/Reveal";
import { SlideArrow } from "./ui/Button";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  eyebrow,
  title,
  body,
  action,
  tone = "dark",
  align = "split",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  action?: { label: string; href: string };
  /** "dark" = dark text on a light section; "light" = the inverse. */
  tone?: "dark" | "light";
  align?: "split" | "center";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "split" ? "md:flex-row md:items-end md:justify-between" : "items-center text-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-3", light ? "text-accent-400" : "text-accent-500")}>{eyebrow}</p>
        )}
        <h2 id={id} className={cn("display-lg", light ? "text-white" : "text-ink-900")}>
          {title}
        </h2>
        {body && (
          <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/60" : "text-ink-500")}>
            {body}
          </p>
        )}
      </Reveal>

      {action && (
        <Reveal delay={0.12} direction="left" className="shrink-0">
          <Link
            href={action.href}
            className={cn(
              "group/btn inline-flex items-center gap-2 border-b-2 pb-1 font-display text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300",
              light
                ? "border-white/25 text-white hover:border-accent-400 hover:text-accent-400"
                : "border-ink-300 text-ink-900 hover:border-accent-500 hover:text-accent-500",
            )}
          >
            {action.label}
            <SlideArrow />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
