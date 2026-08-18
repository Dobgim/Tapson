"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { categories } from "@/data/categories";
import { locations } from "@/data/site";
import type { Product } from "@/data/products";
import type { FormState } from "@/lib/admin/actions";

const input =
  "h-11 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors focus:border-accent-500 focus:outline-none";
const area =
  "w-full rounded-lg border border-ink-200 bg-white p-3 text-sm leading-relaxed text-ink-900 transition-colors focus:border-accent-500 focus:outline-none";
const labelCls =
  "mb-1.5 block font-display text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink-400";

/** Label + control pair, so the grid stays a flat list of equal cells. */
function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 font-display text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-accent-400 disabled:opacity-60"
    >
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {pending ? "Saving" : label}
    </button>
  );
}

export function UnitForm({
  action,
  product,
  submitLabel,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  product?: Product;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, null);
  const p = product;

  return (
    <form action={formAction} className="space-y-6">
      {p && <input type="hidden" name="id" value={p.id} />}

      {state?.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-accent-500/30 bg-accent-500/8 p-3 text-sm text-accent-600"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      {/* -------------------------------------------------- identity ------ */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
          Unit
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="year" label="Year">
            <input
              id="year"
              name="year"
              type="number"
              required
              defaultValue={p?.year ?? new Date().getFullYear()}
              className={input}
            />
          </Field>
          <Field id="make" label="Make">
            <input id="make" name="make" required defaultValue={p?.make} placeholder="Yamaha" className={input} />
          </Field>
          <Field id="model" label="Model">
            <input id="model" name="model" required defaultValue={p?.model} placeholder="MT-09" className={input} />
          </Field>
          <Field id="trim" label="Trim (optional)">
            <input id="trim" name="trim" defaultValue={p?.trim ?? ""} placeholder="SP" className={input} />
          </Field>

          <Field id="category" label="Category">
            <select id="category" name="category" defaultValue={p?.category ?? categories[0].slug} className={input}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="condition" label="Condition">
            <select id="condition" name="condition" defaultValue={p?.condition ?? "New"} className={input}>
              <option value="New">New</option>
              <option value="Pre-Owned">Pre-Owned</option>
            </select>
          </Field>
          <Field id="stockNumber" label="Stock number">
            <input id="stockNumber" name="stockNumber" defaultValue={p?.stockNumber} placeholder="RM-24901" className={input} />
          </Field>
          <Field id="color" label="Colour">
            <input id="color" name="color" defaultValue={p?.color} placeholder="Matte Raven Black" className={input} />
          </Field>
        </div>
      </section>

      {/* --------------------------------------------------- pricing ------ */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
          Pricing and location
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="price" label="Price (USD)">
            <input id="price" name="price" type="number" min="0" required defaultValue={p?.price} className={input} />
          </Field>
          <Field id="msrp" label="MSRP (optional)">
            <input id="msrp" name="msrp" type="number" min="0" defaultValue={p?.msrp ?? ""} className={input} />
          </Field>
          <Field id="usageValue" label="Mileage / hours">
            <input id="usageValue" name="usageValue" type="number" min="0" defaultValue={p?.usage?.value ?? ""} className={input} />
          </Field>
          <Field id="usageUnit" label="Usage unit">
            <select id="usageUnit" name="usageUnit" defaultValue={p?.usage?.unit ?? "mi"} className={input}>
              <option value="mi">Miles</option>
              <option value="hrs">Hours</option>
            </select>
          </Field>
          <Field id="locationId" label="Store" className="min-w-0 sm:col-span-2">
            <select id="locationId" name="locationId" defaultValue={p?.locationId ?? locations[0].id} className={input}>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-5 border-t border-ink-100 pt-4">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="featured" defaultChecked={p?.featured} className="size-4" />
            Show in featured carousel
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="special" defaultChecked={p?.special} className="size-4" />
            Include in manager&rsquo;s specials
          </label>
        </div>
      </section>

      {/* --------------------------------------------------- content ------ */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
          Description and specs
        </h2>

        <label htmlFor="description" className={labelCls}>
          Description
        </label>
        <textarea id="description" name="description" rows={4} defaultValue={p?.description} className={area} />

        <label htmlFor="specifications" className={`${labelCls} mt-4`}>
          Specifications — one per line, as Label | Value
        </label>
        <textarea
          id="specifications"
          name="specifications"
          rows={6}
          defaultValue={p?.specifications.map((s) => `${s.label} | ${s.value}`).join("\n")}
          placeholder={"Engine | 890cc inline 3-cylinder\nTransmission | 6-speed"}
          className={`${area} font-mono text-xs`}
        />

        <label htmlFor="features" className={`${labelCls} mt-4`}>
          Features — one per line
        </label>
        <textarea
          id="features"
          name="features"
          rows={5}
          defaultValue={p?.features.join("\n")}
          placeholder={"Cruise control\nQuickshifter"}
          className={`${area} font-mono text-xs`}
        />
      </section>

      <div className="flex items-center gap-3">
        <Save label={submitLabel} />
        <Link
          href="/admin/inventory"
          className="inline-flex h-11 items-center px-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-ink-900"
        >
          Cancel
        </Link>
      </div>

      {!p && (
        <p className="text-xs text-ink-400">
          Photography is matched from <code>/public/images/products/</code> by unit id, so a new
          unit shows broken images until files with the matching name are added.
        </p>
      )}
    </form>
  );
}
