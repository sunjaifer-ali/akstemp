/** Money is represented in paise for arithmetic to avoid floating-point drift. */
export function rupeesToPaise(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Invalid money amount");
  return Math.round(parsed * 100);
}

export function paiseToRupees(paise: number): string {
  if (!Number.isSafeInteger(paise)) throw new Error("Amount must be an integer number of paise");
  return (paise / 100).toFixed(2);
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(paise / 100);
}
