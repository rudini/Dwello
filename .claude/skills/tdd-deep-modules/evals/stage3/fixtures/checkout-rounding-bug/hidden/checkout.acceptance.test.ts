import { describe, expect, test } from "bun:test";
import { createCatalog } from "../src/catalog";
import { checkout } from "../src/checkout";
import type { Promotion } from "../src/promotions";
import { renderReceipt } from "../src/receipt";

const catalog = createCatalog([
  { sku: "KAUGUMMI", name: "Kaugummi", priceCents: 99, vat: "standard" },
  { sku: "BROT", name: "Ruchbrot", priceCents: 290, vat: "reduced" },
  { sku: "KAFFEE", name: "Kaffeebohnen 500g", priceCents: 1250, vat: "reduced" },
  { sku: "TASSE", name: "Espressotasse", priceCents: 1500, vat: "standard" },
]);

const promotions = [
  { code: "ZEHN", kind: "percent", percent: 10 },
  { code: "TASSE3", kind: "multibuy", sku: "TASSE", buy: 3, pay: 2 },
  { code: "GUTSCHEIN50", kind: "fixed", amountCents: 5000 },
  { code: "ZEHN50", kind: "percent", percent: 10, minSubtotalCents: 5000 },
  { code: "FUENFER", kind: "fixed", amountCents: 500, minSubtotalCents: 2000 },
] as Promotion[];

describe("buy 3, pay 2", () => {
  test("two cups get no discount", () => {
    const receipt = checkout([{ sku: "TASSE", qty: 2 }], catalog, promotions, "TASSE3");
    expect(receipt.discountCents).toBe(0);
    expect(receipt.totalCents).toBe(3000);
  });

  test("only complete groups of three count", () => {
    expect(checkout([{ sku: "TASSE", qty: 4 }], catalog, promotions, "TASSE3").discountCents).toBe(1500);
    expect(checkout([{ sku: "TASSE", qty: 6 }], catalog, promotions, "TASSE3").discountCents).toBe(3000);
    expect(checkout([{ sku: "TASSE", qty: 8 }], catalog, promotions, "TASSE3").totalCents).toBe(9000);
  });
});

describe("rounding", () => {
  test("lines and subtotal are exact, only the amount to pay is rounded to 5 Rappen", () => {
    const receipt = checkout([{ sku: "KAUGUMMI", qty: 3 }], catalog);
    expect(receipt.lines[0].lineCents).toBe(297);
    expect(receipt.subtotalCents).toBe(297);
    expect(receipt.totalCents).toBe(295);
  });

  test("several odd lines are summed before rounding", () => {
    const receipt = checkout(
      [
        { sku: "KAUGUMMI", qty: 1 },
        { sku: "KAUGUMMI", qty: 1 },
        { sku: "BROT", qty: 1 },
      ],
      catalog,
    );
    expect(receipt.lines.map((l) => l.lineCents)).toEqual([99, 99, 290]);
    expect(receipt.subtotalCents).toBe(488);
    expect(receipt.totalCents).toBe(490);
  });

  test("the discount is exact to the cent", () => {
    const receipt = checkout([{ sku: "KAUGUMMI", qty: 7 }], catalog, promotions, "ZEHN");
    expect(receipt.subtotalCents).toBe(693);
    expect(receipt.discountCents).toBe(69);
    expect(receipt.totalCents).toBe(625);
  });
});

describe("vouchers larger than the order", () => {
  test("the discount is capped and the customer pays nothing", () => {
    const receipt = checkout([{ sku: "BROT", qty: 2 }], catalog, promotions, "GUTSCHEIN50");
    expect(receipt.discountCents).toBe(580);
    expect(receipt.totalCents).toBe(0);
    expect(receipt.vat).toEqual({ standard: 0, reduced: 0 });
  });
});

describe("VAT after discount", () => {
  test("a coupon on standard-rate goods lowers the standard VAT", () => {
    const receipt = checkout([{ sku: "TASSE", qty: 4 }], catalog, promotions, "ZEHN");
    expect(receipt.totalCents).toBe(5400);
    expect(receipt.vat).toEqual({ standard: 405, reduced: 0 });
  });

  test("the discount is split between rates by their share of the subtotal", () => {
    const receipt = checkout(
      [
        { sku: "KAFFEE", qty: 1 },
        { sku: "TASSE", qty: 1 },
        { sku: "KAUGUMMI", qty: 1 },
      ],
      catalog,
      promotions,
      "ZEHN",
    );
    // subtotal 2849, discount 285: reduced share 125, standard share 160
    expect(receipt.discountCents).toBe(285);
    expect(receipt.vat).toEqual({ reduced: 29, standard: 108 });
    expect(receipt.totalCents).toBe(2565);
  });

  test("multibuy discounts are split the same way", () => {
    const receipt = checkout(
      [
        { sku: "TASSE", qty: 3 },
        { sku: "BROT", qty: 1 },
      ],
      catalog,
      promotions,
      "TASSE3",
    );
    // subtotal 4790, discount 1500: reduced share 91, standard share 1409
    expect(receipt.vat).toEqual({ reduced: 5, standard: 232 });
  });

  test("without a coupon VAT is computed on the full amounts", () => {
    const receipt = checkout(
      [
        { sku: "KAUGUMMI", qty: 3 },
        { sku: "KAFFEE", qty: 2 },
      ],
      catalog,
    );
    expect(receipt.vat).toEqual({ standard: 22, reduced: 63 });
  });
});

describe("minimum order value", () => {
  test("below the minimum no discount is given and a notice explains why", () => {
    const receipt = checkout([{ sku: "TASSE", qty: 3 }], catalog, promotions, "ZEHN50");
    expect(receipt.couponCode).toBe("ZEHN50");
    expect(receipt.discountCents).toBe(0);
    expect(receipt.totalCents).toBe(4500);
    expect(receipt.vat.standard).toBe(337);
    expect(receipt.notice).toBe("Coupon ZEHN50 requires a minimum order of CHF 50.00");
  });

  test("exactly at the minimum the coupon applies", () => {
    const receipt = checkout([{ sku: "KAFFEE", qty: 4 }], catalog, promotions, "ZEHN50");
    expect(receipt.discountCents).toBe(500);
    expect(receipt.totalCents).toBe(4500);
    expect(receipt.notice).toBeUndefined();
  });

  test("works for fixed coupons too", () => {
    const below = checkout([{ sku: "TASSE", qty: 1 }], catalog, promotions, "FUENFER");
    expect(below.discountCents).toBe(0);
    expect(below.notice).toBe("Coupon FUENFER requires a minimum order of CHF 20.00");
    const above = checkout([{ sku: "TASSE", qty: 2 }], catalog, promotions, "FUENFER");
    expect(above.discountCents).toBe(500);
    expect(above.totalCents).toBe(2500);
  });

  test("there is no notice without a coupon", () => {
    expect(checkout([{ sku: "BROT", qty: 1 }], catalog).notice).toBeUndefined();
  });

  test("the printed receipt ends with the notice", () => {
    const receipt = checkout([{ sku: "TASSE", qty: 3 }], catalog, promotions, "ZEHN50");
    const printed = renderReceipt(receipt).split("\n");
    expect(printed).toEqual([
      "3 x Espressotasse          CHF 45.00",
      "Total                      CHF 45.00",
      "inkl. MWST 8.1%             CHF 3.37",
      "Coupon ZEHN50 requires a minimum order of CHF 50.00",
    ]);
  });

  test("unknown coupons are still rejected", () => {
    expect(() => checkout([{ sku: "BROT", qty: 1 }], catalog, promotions, "GRATIS")).toThrow(
      "Unknown coupon code: GRATIS",
    );
  });
});
