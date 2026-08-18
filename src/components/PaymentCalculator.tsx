"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ButtonLink, SlideArrow } from "./ui/Button";
import { DEFAULT_APR, DEFAULT_TERM_MONTHS, currencyCents, formatPrice, monthlyPayment } from "@/lib/finance";

const TERMS = [24, 36, 48, 60, 72, 84];

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-semibold tracking-wide text-ink-700">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-sm font-bold text-ink-900">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-offset-4
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:shadow-md
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent-500"
        style={{
          background: `linear-gradient(to right, var(--color-accent-500) ${pct}%, var(--color-ink-200) ${pct}%)`,
        }}
      />
    </div>
  );
}

export function PaymentCalculator({ initialPrice = 15000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(10);
  const [term, setTerm] = useState(DEFAULT_TERM_MONTHS);
  const [apr, setApr] = useState(DEFAULT_APR);
  const [trade, setTrade] = useState(0);

  const { payment, financed, totalInterest, totalPaid } = useMemo(() => {
    const down = (price * downPct) / 100;
    const financedAmount = Math.max(price - down - trade, 0);
    const monthly = monthlyPayment(financedAmount, apr, term);
    const paid = monthly * term;
    return {
      payment: monthly,
      financed: financedAmount,
      totalInterest: Math.max(paid - financedAmount, 0),
      totalPaid: paid,
    };
  }, [price, downPct, term, apr, trade]);

  return (
    <div className="grid gap-8 rounded-2xl border border-ink-200 bg-white p-6 shadow-lift sm:p-8 lg:grid-cols-5 lg:gap-10">
      <div className="min-w-0 space-y-6 lg:col-span-3">
        <Slider
          label="Vehicle price"
          value={price}
          min={1000}
          max={100000}
          step={500}
          format={formatPrice}
          onChange={setPrice}
        />
        <Slider
          label="Down payment"
          value={downPct}
          min={0}
          max={50}
          step={1}
          format={(v) => `${v}%  ·  ${formatPrice((price * v) / 100)}`}
          onChange={setDownPct}
        />
        <Slider
          label="Trade-in value"
          value={trade}
          min={0}
          max={40000}
          step={250}
          format={formatPrice}
          onChange={setTrade}
        />
        <Slider
          label="Interest rate (APR)"
          value={apr}
          min={2}
          max={22}
          step={0.25}
          format={(v) => `${v.toFixed(2)}%`}
          onChange={setApr}
        />

        <fieldset>
          <legend className="mb-2.5 text-xs font-semibold tracking-wide text-ink-700">Loan term</legend>
          <div className="flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                aria-pressed={term === t}
                className={`rounded-full border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                  term === t
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900"
                }`}
              >
                {t} mo
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="min-w-0 flex flex-col justify-between rounded-2xl bg-ink-950 p-7 text-white lg:col-span-2">
        <div>
          <p className="eyebrow text-accent-400">Estimated payment</p>
          <p className="mt-3 flex items-baseline gap-1">
            <motion.span
              key={Math.round(payment)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display text-5xl font-extrabold tracking-tight"
            >
              {currencyCents.format(payment)}
            </motion.span>
            <span className="text-sm text-white/50">/mo</span>
          </p>

          <dl className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/50">Amount financed</dt>
              <dd className="font-semibold">{formatPrice(financed)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Total interest</dt>
              <dd className="font-semibold">{formatPrice(totalInterest)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Total of payments</dt>
              <dd className="font-semibold">{formatPrice(totalPaid)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 space-y-3">
          <ButtonLink href="/financing#apply" size="lg" className="w-full">
            Apply for financing
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="/trade-in" variant="light" size="lg" className="w-full">
            Value my trade
          </ButtonLink>
          <p className="text-[0.625rem] leading-relaxed text-white/35">
            Estimates only. Excludes tax, title, registration and fees. Actual terms depend on
            lender approval and creditworthiness.
          </p>
        </div>
      </div>
    </div>
  );
}
