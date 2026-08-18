"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { email as emailRule, validate } from "@/lib/validation";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(value, [emailRule]);
    setError(err);
    if (err) return;

    setState("busy");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", fields: { email: value } }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setValue("");
    } catch {
      setState("idle");
      setError("We couldn't sign you up just then. Try again?");
    }
  };

  if (state === "done") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
        <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
        You're on the list. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-accent-400">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="you@email.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35"
        />
        <button
          type="submit"
          disabled={state === "busy"}
          aria-label="Subscribe"
          className={cn(
            "grid w-11 shrink-0 place-items-center bg-accent-500 text-white transition-colors hover:bg-accent-400 disabled:opacity-60",
          )}
        >
          {state === "busy" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="text-[0.6875rem] text-accent-300">
          {error}
        </p>
      )}
    </form>
  );
}
