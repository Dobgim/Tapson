export type ClassValue = string | false | null | undefined;

/** Tiny classname joiner — we don't need clsx's full surface area here. */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** "412 hrs" / "3,120 mi" */
export function formatUsage(usage?: { value: number; unit: string }) {
  if (!usage) return null;
  return `${formatNumber(usage.value)} ${usage.unit}`;
}
