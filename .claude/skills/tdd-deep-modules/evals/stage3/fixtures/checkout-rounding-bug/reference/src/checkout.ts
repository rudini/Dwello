import { findProduct, VAT_RATES, type Catalog, type VatCategory } from "./catalog";
import { formatChf, roundToRappen, vatIncluded } from "./money";
import { discountFor, findPromotion, type Promotion } from "./promotions";

export interface CartLine {
  sku: string;
  qty: number;
}

export interface ReceiptLine {
  sku: string;
  name: string;
  qty: number;
  unitCents: number;
  lineCents: number;
  vat: VatCategory;
}

export interface Receipt {
  lines: ReceiptLine[];
  subtotalCents: number;
  couponCode?: string;
  discountCents: number;
  totalCents: number;
  vat: Record<VatCategory, number>;
  notice?: string;
}

function applyCoupon(
  lines: ReceiptLine[],
  subtotalCents: number,
  promotions: Promotion[],
  couponCode: string | undefined,
): { discountCents: number; notice?: string } {
  if (couponCode === undefined) return { discountCents: 0 };
  const promotion = findPromotion(promotions, couponCode);
  if (promotion.minSubtotalCents !== undefined && subtotalCents < promotion.minSubtotalCents) {
    return {
      discountCents: 0,
      notice: `Coupon ${couponCode} requires a minimum order of ${formatChf(promotion.minSubtotalCents)}`,
    };
  }
  return { discountCents: discountFor(promotion, lines) };
}

function vatAfterDiscount(lines: ReceiptLine[], subtotalCents: number, discountCents: number) {
  const gross = (category: VatCategory) =>
    lines.filter((l) => l.vat === category).reduce((sum, l) => sum + l.lineCents, 0);
  const reducedGross = gross("reduced");
  const reducedShare = subtotalCents === 0 ? 0 : Math.round((discountCents * reducedGross) / subtotalCents);
  const standardShare = discountCents - reducedShare;
  return {
    standard: vatIncluded(gross("standard") - standardShare, VAT_RATES.standard),
    reduced: vatIncluded(reducedGross - reducedShare, VAT_RATES.reduced),
  };
}

export function checkout(
  cart: CartLine[],
  catalog: Catalog,
  promotions: Promotion[] = [],
  couponCode?: string,
): Receipt {
  const lines: ReceiptLine[] = cart.map(({ sku, qty }) => {
    const product = findProduct(catalog, sku);
    return {
      sku,
      name: product.name,
      qty,
      unitCents: product.priceCents,
      lineCents: product.priceCents * qty,
      vat: product.vat,
    };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  const { discountCents, notice } = applyCoupon(lines, subtotalCents, promotions, couponCode);

  return {
    lines,
    subtotalCents,
    couponCode,
    discountCents,
    totalCents: roundToRappen(subtotalCents - discountCents),
    vat: vatAfterDiscount(lines, subtotalCents, discountCents),
    notice,
  };
}
