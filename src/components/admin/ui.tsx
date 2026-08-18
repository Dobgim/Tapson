import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink-200 bg-white px-5 py-6 sm:px-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-ink-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-accent-500 px-5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-accent-400"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-ink-200 bg-white", className)}>{children}</div>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <p className="font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </Card>
  );
}

const TONES = {
  new: "bg-accent-500/12 text-accent-600",
  contacted: "bg-marine-500/12 text-marine-500",
  won: "bg-emerald-500/12 text-emerald-700",
  closed: "bg-ink-200 text-ink-500",
  New: "bg-emerald-500/12 text-emerald-700",
  "Pre-Owned": "bg-ink-200 text-ink-600",
} as const;

export function Badge({ tone, children }: { tone?: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em]",
        tone ? TONES[tone] : "bg-ink-200 text-ink-600",
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink-900">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">{body}</p>
    </div>
  );
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
