export const DEFAULT_APR = 8.99;
export const DEFAULT_TERM_MONTHS = 60;
export const DEFAULT_DOWN_RATE = 0.1;

/**
 * Standard amortised payment. Returns 0 for a non-positive principal so the
 * calculator never renders NaN while a field is mid-edit.
 */
export function monthlyPayment(
  principal: number,
  aprPercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = aprPercent / 100 / 12;
  if (r === 0) return principal / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (principal * r * factor) / (factor - 1);
}

/** Payment shown on inventory cards: price less a 10% down payment. */
export function estimatedPayment(price: number, apr = DEFAULT_APR, term = DEFAULT_TERM_MONTHS) {
  return Math.round(monthlyPayment(price * (1 - DEFAULT_DOWN_RATE), apr, term));
}

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const currencyCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return currency.format(value);
}
