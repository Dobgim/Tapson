"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bike,
  Inbox,
  MapPin,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/inventory", label: "Inventory", icon: Bike },
  { href: "/admin/leads", label: "Enquiries", icon: Inbox },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="space-y-1" aria-label="Console">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-accent-500/12 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon aria-hidden className={cn("size-4", active && "text-accent-400")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {/* ------------------------------------------------ sidebar --------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between border-r border-ink-800 bg-ink-950 p-5 lg:flex">
        <div>
          <Logo href="/admin" tone="light" />
          <div className="mt-8">{nav}</div>
        </div>
        <Footer email={email} />
      </aside>

      {/* -------------------------------------------- mobile bar ---------- */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-800 bg-ink-950 px-4 py-3 lg:hidden">
        <Logo href="/admin" tone="light" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="sticky top-[57px] z-30 border-b border-ink-800 bg-ink-950 p-4 lg:hidden">
          {nav}
          <div className="mt-4 border-t border-white/10 pt-4">
            <Footer email={email} />
          </div>
        </div>
      )}

      <div className="lg:pl-60">{children}</div>
    </div>
  );
}

function Footer({ email }: { email: string }) {
  return (
    <div className="space-y-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
      >
        <ExternalLink aria-hidden className="size-3.5" />
        View storefront
      </Link>
      <div className="border-t border-white/10 pt-3">
        <p className="truncate text-xs text-white/40" title={email}>
          {email}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-1.5 flex items-center gap-1.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-accent-400"
          >
            <LogOut aria-hidden className="size-3" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
