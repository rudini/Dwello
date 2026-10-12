import { expect, test } from "bun:test";
import { createCatalog } from "./catalog";
import { checkout } from "./checkout";
import { renderReceipt } from "./receipt";

test("renders a receipt with lines, total and VAT", () => {
  const catalog = createCatalog([
    { sku: "TASSE", name: "Espressotasse", priceCents: 1500, vat: "standard" },
    { sku: "BROT", name: "Ruchbrot", priceCents: 290, vat: "reduced" },
  ]);
  const receipt = checkout(
    [
      { sku: "TASSE", qty: 2 },
      { sku: "BROT", qty: 1 },
    ],
    catalog,
  );
  expect(renderReceipt(receipt)).toBe(
    [
      "2 x Espressotasse          CHF 30.00",
      "1 x Ruchbrot                CHF 2.90",
      "Total                      CHF 32.90",
      "inkl. MWST 8.1%             CHF 2.25",
      "inkl. MWST 2.6%             CHF 0.07",
    ].join("\n"),
  );
});
