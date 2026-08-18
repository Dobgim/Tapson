import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-display font-bold uppercase tracking-[0.12em] " +
  "transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white shadow-[0_8px_24px_-8px_var(--color-accent-600)] hover:bg-accent-400 hover:shadow-[0_14px_36px_-10px_var(--color-accent-500)]",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 shadow-[0_8px_24px_-10px_rgba(6,8,11,0.6)]",
  outline:
    "border border-ink-300 bg-transparent text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white",
  light:
    "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20",
  ghost: "text-ink-700 hover:text-accent-500",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-11 px-6 text-xs",
  lg: "h-13 px-8 text-sm",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function buttonClass({ variant = "primary", size = "md", className }: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

export function ButtonLink({ variant, size, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<"button">;

export function Button({ variant, size, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

/** Arrow that slides on parent hover — used inside buttons and cards. */
export function SlideArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1 group-hover/card:translate-x-1",
        className,
      )}
    >
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
