/** Rounds an amount in cents to the nearest 5 Rappen (Swiss cash rounding). */
export function roundToRappen(cents: number): number {
  return Math.round(cents / 5) * 5;
}

/** Formats cents as "CHF 12.35" (negative amounts as "-CHF 0.50"). */
export function formatChf(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}CHF ${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** VAT contained in a gross (VAT-inclusive) amount, rounded to the cent. */
export function vatIncluded(grossCents: number, ratePercent: number): number {
  return Math.round((grossCents * ratePercent) / (100 + ratePercent));
}
