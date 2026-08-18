"use client";

import { useId, useState, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateAll, type FieldSpec } from "@/lib/validation";
import { EASE } from "../motion/Reveal";

const controlBase =
  "w-full rounded-xl border bg-white px-4 text-sm text-ink-900 transition-[border-color,box-shadow] duration-200 " +
  "placeholder:text-ink-400 focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/12 " +
  "disabled:cursor-not-allowed disabled:bg-ink-50";

function Wrapper({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold tracking-wide text-ink-700">
        {label}
        {required && <span className="ml-0.5 text-accent-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[0.6875rem] text-ink-500">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-accent-500"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

type BaseProps = { label: string; error?: string; hint?: string; className?: string };

export function TextField({
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper label={label} htmlFor={id} error={error} hint={hint} required={props.required} className={className}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlBase, "h-11", error ? "border-accent-500" : "border-ink-200")}
        {...props}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper label={label} htmlFor={id} error={error} hint={hint} required={props.required} className={className}>
      <textarea
        id={id}
        rows={4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlBase, "resize-y py-3", error ? "border-accent-500" : "border-ink-200")}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className,
  options,
  ...props
}: BaseProps & { options: { value: string; label: string }[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrapper label={label} htmlFor={id} error={error} hint={hint} required={props.required} className={className}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlBase, "h-11 appearance-none bg-[length:1rem] pr-9", error ? "border-accent-500" : "border-ink-200")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2355606f' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.85rem center",
        }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

export function FileField({
  label,
  hint,
  className,
  onFiles,
  ...props
}: BaseProps & { onFiles?: (names: string[]) => void } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [names, setNames] = useState<string[]>([]);
  return (
    <Wrapper label={label} htmlFor={id} hint={hint} className={className}>
      <input
        id={id}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []).map((f) => f.name);
          setNames(list);
          onFiles?.(list);
        }}
        className="block w-full cursor-pointer rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-3 text-sm text-ink-600 transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-ink-900 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-white hover:border-accent-500"
        {...props}
      />
      {names.length > 0 && (
        <p className="text-[0.6875rem] text-ink-600">
          {names.length} file{names.length > 1 ? "s" : ""} ready: {names.join(", ")}
        </p>
      )}
    </Wrapper>
  );
}

/* ------------------------------------------------------------- form runtime */

export type SubmitState = "idle" | "submitting" | "success" | "error";

export function useLeadForm(kind: string, spec: FieldSpec, initial: Record<string, string>) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const set = (name: string) => (value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Clear an error as soon as the user starts fixing it.
    setErrors((e) => (e[name] ? { ...e, [name]: "" } : e));
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateAll(values, spec);
    const active = Object.fromEntries(Object.entries(found).filter(([, v]) => v));
    setErrors(active);
    if (Object.keys(active).length > 0) {
      setState("error");
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setState("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, fields: values }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("success");
      setMessage(data.reference as string);
      reset();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return { values, errors, state, message, set, submit, setState };
}

export function FormStatus({
  state,
  message,
  successTitle,
  successBody,
}: {
  state: SubmitState;
  message: string;
  successTitle: string;
  successBody: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {state === "success" && (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">{successTitle}</p>
            <p className="mt-0.5 text-xs text-emerald-800">
              {successBody} Reference <span className="font-mono font-semibold">{message}</span>.
            </p>
          </div>
        </motion.div>
      )}
      {state === "error" && message && (
        <motion.div
          key="error"
          role="alert"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3 rounded-xl border border-accent-300 bg-accent-500/8 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
          <p className="text-sm text-accent-600">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SubmitSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
}
