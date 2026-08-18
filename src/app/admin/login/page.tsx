import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/admin/auth";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Dealer Console",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-ink-950 lg:grid-cols-[1fr_1.1fr]">
      {/* -------------------------------------------------- form ---------- */}
      <div className="flex min-w-0 flex-col justify-between px-5 py-10 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between gap-4">
          <Logo href="/" tone="light" />
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft
              aria-hidden
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Storefront
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm py-14">
          <p className="eyebrow mb-3 text-accent-400">Dealer console</p>
          <h1 className="display-lg text-white">Sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            Manage inventory, pricing and customer enquiries.
          </p>

          <LoginForm />

          <div className="mt-8 flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-400" />
            <p className="min-w-0 break-words text-xs leading-relaxed text-white/45">
              <span className="font-semibold text-white/70">Staff access only.</span>{" "}
              Accounts are created in the Supabase dashboard — there is no public sign-up.
            </p>
          </div>
        </div>

        <p className="text-xs text-white/25">
          &copy; {new Date().getFullYear()} Repossessed Rides. Internal use only.
        </p>
      </div>

      {/* ------------------------------------------------- artwork -------- */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/dealership/showroom.webp"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/70 to-accent-600/25" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white">
            Every unit, every enquiry,
            <span className="text-accent-400"> one console.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
