/**
 * Payment options a customer can nominate when placing an order.
 *
 * These are peer-to-peer transfer apps, not integrated card processing. The
 * site never touches money: the customer states a preference, and the payment
 * details are sent to them afterwards. Nothing here collects an account
 * number, a card, or any credential.
 *
 * Names are used nominatively to identify each service. No logo artwork or
 * brand mark is reproduced.
 */

export type PaymentMethodId = "zelle" | "cashapp" | "apple" | "chime";

export type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  /** Shown under the name in the picker. */
  hint: string;
  /** Two-letter monogram used in place of a trademarked logo. */
  monogram: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "zelle",
    name: "Zelle",
    hint: "Bank-to-bank transfer",
    monogram: "Z",
  },
  {
    id: "cashapp",
    name: "Cash App",
    hint: "Pay to a $Cashtag",
    monogram: "$",
  },
  {
    id: "apple",
    name: "Apple Pay",
    hint: "Send via Apple Wallet",
    monogram: "A",
  },
  {
    id: "chime",
    name: "Chime",
    hint: "Pay anyone with Chime",
    monogram: "C",
  },
];

export const paymentMethodById = new Map(paymentMethods.map((m) => [m.id, m]));

export function paymentMethodName(id: string) {
  return paymentMethodById.get(id as PaymentMethodId)?.name ?? id;
}
