export type Promotion = (
  | { code: string; kind: "percent"; percent: number }
  | { code: string; kind: "fixed"; amountCents: number }
  | { code: string; kind: "multibuy"; sku: string; buy: number; pay: number }
) & { minSubtotalCents?: number };

export interface PricedLine {
  sku: string;
  qty: number;
  unitCents: number;
  lineCents: number;
}

export function findPromotion(promotions: Promotion[], code: string): Promotion {
  const promotion = promotions.find((p) => p.code === code);
  if (!promotion) throw new Error(`Unknown coupon code: ${code}`);
  return promotion;
}

/** Discount in cents that a promotion grants on the given lines, never more than their sum. */
export function discountFor(promotion: Promotion, lines: PricedLine[]): number {
  const subtotal = lines.reduce((sum, l) => sum + l.lineCents, 0);
  return Math.min(subtotal, uncappedDiscount(promotion, lines, subtotal));
}

function uncappedDiscount(promotion: Promotion, lines: PricedLine[], subtotal: number): number {
  switch (promotion.kind) {
    case "percent":
      return Math.round((subtotal * promotion.percent) / 100);
    case "fixed":
      return promotion.amountCents;
    case "multibuy": {
      const line = lines.find((l) => l.sku === promotion.sku);
      if (!line) return 0;
      const groups = Math.floor(line.qty / promotion.buy);
      return groups * (promotion.buy - promotion.pay) * line.unitCents;
    }
  }
}
