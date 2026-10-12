import { VAT_RATES, type VatCategory } from "./catalog";
import type { Receipt } from "./checkout";
import { formatChf } from "./money";

const WIDTH = 36;

function row(label: string, amount: string): string {
  return label + amount.padStart(WIDTH - label.length);
}

/** Renders a receipt as fixed-width text for the till printer. */
export function renderReceipt(receipt: Receipt): string {
  const out = receipt.lines.map((l) => row(`${l.qty} x ${l.name}`, formatChf(l.lineCents)));
  if (receipt.discountCents > 0) {
    out.push(row(`Rabatt (${receipt.couponCode})`, formatChf(-receipt.discountCents)));
  }
  out.push(row("Total", formatChf(receipt.totalCents)));
  for (const category of Object.keys(receipt.vat) as VatCategory[]) {
    if (receipt.vat[category] > 0) {
      out.push(row(`inkl. MWST ${VAT_RATES[category]}%`, formatChf(receipt.vat[category])));
    }
  }
  return out.join("\n");
}
