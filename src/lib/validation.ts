export type Rule = (value: string) => string | null;

export const required =
  (label = "This field"): Rule =>
  (v) =>
    v.trim() ? null : `${label} is required.`;

export const email: Rule = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Enter a valid email address.";

export const phone: Rule = (v) =>
  v.replace(/\D/g, "").length >= 10 ? null : "Enter a valid 10-digit phone number.";

export const minLength =
  (n: number, label = "This field"): Rule =>
  (v) =>
    v.trim().length >= n ? null : `${label} must be at least ${n} characters.`;

export const numeric =
  (label = "This field"): Rule =>
  (v) =>
    v.trim() === "" || /^\d+$/.test(v.trim()) ? null : `${label} must be a number.`;

/** Runs rules in order and returns the first failure. */
export function validate(value: string, rules: Rule[]): string | null {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}

export type FieldSpec = Record<string, Rule[]>;

export function validateAll(values: Record<string, string>, spec: FieldSpec) {
  const errors: Record<string, string> = {};
  for (const [name, rules] of Object.entries(spec)) {
    const error = validate(values[name] ?? "", rules);
    if (error) errors[name] = error;
  }
  return errors;
}
