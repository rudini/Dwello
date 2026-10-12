import { describe, expect, test } from "bun:test";
import { createCatalog } from "./catalog";
import { checkout } from "./checkout";
import type { Promotion } from "./promotions";

const catalog = createCatalog([
  { sku: "BROT", name: "Ruchbrot", priceCents: 290, vat: "reduced" },
  { sku: "KAFFEE", name: "Kaffeebohnen 500g", priceCents: 1250, vat: "reduced" },
  { sku: "TASSE", name: "Espressotasse", priceCents: 1500, vat: "standard" },
]);

const promotions: Promotion[] = [
  { code: "ZEHN", kind: "percent", percent: 10 },
  { code: "TASSE3", kind: "multibuy", sku: "TASSE", buy: 3, pay: 2 },
];

describe("checkout", () => {
  test("sums the lines", () => {
    const receipt = checkout(
      [
        { sku: "BROT", qty: 2 },
        { sku: "KAFFEE", qty: 1 },
      ],
      catalog,
    );
    expect(receipt.lines.map((l) => l.lineCents)).toEqual([580, 1250]);
    expect(receipt.subtotalCents).toBe(1830);
    expect(receipt.totalCents).toBe(1830);
  });

  test("includes VAT per rate", () => {
    const receipt = checkout(
      [
        { sku: "KAFFEE", qty: 1 },
        { sku: "TASSE", qty: 1 },
      ],
      catalog,
    );
    expect(receipt.vat).toEqual({ reduced: 32, standard: 112 });
  });

  test("applies a percent coupon", () => {
    const receipt = checkout([{ sku: "KAFFEE", qty: 4 }], catalog, promotions, "ZEHN");
    expect(receipt.discountCents).toBe(500);
    expect(receipt.totalCents).toBe(4500);
  });

  test("buy three, pay two", () => {
    const receipt = checkout([{ sku: "TASSE", qty: 3 }], catalog, promotions, "TASSE3");
    expect(receipt.discountCents).toBe(1500);
    expect(receipt.totalCents).toBe(3000);
  });

  test("rejects unknown products and coupons", () => {
    expect(() => checkout([{ sku: "TEE", qty: 1 }], catalog)).toThrow("Unknown product: TEE");
    expect(() => checkout([{ sku: "BROT", qty: 1 }], catalog, promotions, "GRATIS")).toThrow(
      "Unknown coupon code: GRATIS",
    );
  });
});
