import { findProduct, VAT_RATES, type Catalog, type VatCategory } from "./catalog";
import { roundToRappen, vatIncluded } from "./money";
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
      lineCents: roundToRappen(product.priceCents * qty),
      vat: product.vat,
    };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);

  let discountCents = 0;
  if (couponCode !== undefined) {
    const promotion = findPromotion(promotions, couponCode);
    discountCents = roundToRappen(discountFor(promotion, lines));
  }

  const vat: Record<VatCategory, number> = { standard: 0, reduced: 0 };
  for (const category of Object.keys(vat) as VatCategory[]) {
    const gross = lines.filter((l) => l.vat === category).reduce((sum, l) => sum + l.lineCents, 0);
    vat[category] = vatIncluded(gross, VAT_RATES[category]);
  }

  return {
    lines,
    subtotalCents,
    couponCode,
    discountCents,
    totalCents: subtotalCents - discountCents,
    vat,
  };
}
