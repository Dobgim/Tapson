"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, MapPin, Phone, Search } from "lucide-react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { ButtonLink, SlideArrow } from "./ui/Button";
import { primaryNav, locations, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { EASE } from "./motion/Reveal";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationId, setLocationId] = useState(locations[0].id);
  const [locationOpen, setLocationOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Any navigation closes every transient surface.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
    setLocationOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setLocationOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Small grace period so a diagonal mouse path to the panel doesn't close it.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeLocation = locations.find((l) => l.id === locationId) ?? locations[0];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <>
      {/* Utility bar — collapses away as soon as you scroll. */}
      <div
        className={cn(
          "relative z-50 hidden overflow-hidden bg-ink-950 text-white transition-[height,opacity] duration-500 ease-[var(--ease-out-expo)] xl:block",
          scrolled ? "h-0 opacity-0" : "h-10 opacity-100",
        )}
      >
        <div className="shell flex h-10 items-center justify-between text-[0.6875rem]">
          <p className="tracking-[0.16em] text-white/60 uppercase font-display font-semibold">
            {site.tagline}
          </p>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationOpen((v) => !v)}
                aria-expanded={locationOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-1.5 text-white/75 transition-colors hover:text-white"
              >
                <MapPin className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                <span>{activeLocation.city}</span>
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-300", locationOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {locationOpen && (
                  <motion.ul
                    role="listbox"
                    aria-label="Choose a store"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-ink-900 p-1.5 shadow-lift-lg"
                  >
                    {locations.map((loc) => (
                      <li key={loc.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={loc.id === locationId}
                          onClick={() => {
                            setLocationId(loc.id);
                            setLocationOpen(false);
                          }}
                          className={cn(
                            "w-full rounded-lg px-3 py-2 text-left transition-colors",
                            loc.id === locationId
                              ? "bg-accent-500 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          <span className="block font-semibold">{loc.city}</span>
                          <span className="block text-[0.625rem] opacity-70">{loc.phone}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <a href={site.phoneHref} className="flex items-center gap-1.5 text-white/75 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
              {activeLocation.phone}
            </a>
            <Link href="/contact" className="text-white/75 transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]",
          scrolled
            ? "bg-white/85 shadow-[0_1px_0_rgba(6,8,11,0.08),0_12px_30px_-18px_rgba(6,8,11,0.35)] backdrop-blur-xl"
            : "bg-white",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          <Logo className="min-w-0 shrink" />

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {primaryNav.map((item) => {
              const hasPanel = Boolean(item.columns);
              const open = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(hasPanel ? item.label : null);
                  }}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasPanel ? open : undefined}
                    onFocus={() => setOpenMenu(hasPanel ? item.label : null)}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-3.5 py-2 font-display text-[0.8125rem] font-bold uppercase tracking-[0.1em] transition-colors duration-200",
                      isActive(item.href) || open ? "text-accent-500" : "text-ink-800 hover:text-accent-500",
                    )}
                  >
                    {item.label}
                    {hasPanel && (
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")}
                        aria-hidden="true"
                      />
                    )}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent-500"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search inventory"
              className="grid h-11 w-11 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 hover:text-accent-500 xl:h-10 xl:w-10"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
            </button>

            <a
              href={site.phoneHref}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-100 hover:text-accent-500 md:flex"
            >
              <Phone className="h-4 w-4 text-accent-500" aria-hidden="true" />
              <span className="hidden 2xl:inline">{activeLocation.phone}</span>
            </a>

            <ButtonLink
              href="/specials"
              size="sm"
              className="h-10 px-3.5 text-[0.625rem] tracking-[0.1em] sm:h-9 sm:px-4 sm:text-[0.6875rem] sm:tracking-[0.12em]"
            >
              Specials
              <SlideArrow />
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-900 transition-colors hover:bg-ink-100 active:bg-ink-200 xl:hidden"
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <span className="h-[2px] w-full rounded-full bg-current" />
                <span className="h-[2px] w-full rounded-full bg-current" />
                <span className="h-[2px] w-3/5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              key={openMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: EASE }}
              onMouseEnter={cancelClose}
              className="absolute inset-x-0 top-full hidden border-t border-ink-200 bg-white/95 backdrop-blur-xl shadow-lift-lg xl:block"
            >
              {primaryNav
                .filter((item) => item.label === openMenu)
                .map((item) => (
                  <div key={item.label} className="shell grid grid-cols-12 gap-8 py-9">
                    <div className="min-w-0 col-span-8 grid grid-cols-3 gap-8">
                      {item.columns?.map((col) => (
                        <div key={col.heading}>
                          <p className="eyebrow mb-4 text-ink-400">{col.heading}</p>
                          <ul className="space-y-2.5">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 transition-colors hover:text-accent-500"
                                >
                                  <span className="h-px w-0 bg-accent-500 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover/link:w-3" />
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {item.featured && (
                      <Link
                        href={item.featured.href}
                        className="min-w-0 group/card col-span-4 flex flex-col justify-between overflow-hidden rounded-2xl bg-ink-900 p-7 text-white transition-shadow duration-500 hover:shadow-lift-lg"
                      >
                        <div>
                          <p className="eyebrow text-accent-400">{item.featured.heading}</p>
                          <p className="mt-3 text-lg leading-snug font-display font-bold">
                            {item.featured.body}
                          </p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-[0.14em] text-white">
                          {item.featured.cta}
                          <SlideArrow />
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
