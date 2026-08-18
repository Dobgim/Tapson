"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { loginAction, type FormState } from "@/lib/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group/btn mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent-500 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Signing in
        </>
      ) : (
        <>
          Sign in
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </>
      )}
    </button>
  );
}

const field =
  "h-12 w-full rounded-lg border border-white/12 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/25 transition-colors duration-200 focus:border-accent-400 focus:bg-white/[0.06] focus:outline-none";

export function LoginForm() {
  const [state, formAction] = useActionState<FormState, FormData>(loginAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 p-3 text-xs leading-relaxed text-accent-300"
        >
          <AlertCircle aria-hidden className="mt-px size-4 shrink-0" />
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/45"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@dealership.com"
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-display text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/45"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={field}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
