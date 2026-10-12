export type VatCategory = "standard" | "reduced";

/** Swiss VAT rates in percent. Prices in the catalog include VAT. */
export const VAT_RATES: Record<VatCategory, number> = {
  standard: 8.1,
  reduced: 2.6,
};

export interface Product {
  sku: string;
  name: string;
  priceCents: number;
  vat: VatCategory;
}

export type Catalog = ReadonlyMap<string, Product>;

export function createCatalog(products: Product[]): Catalog {
  return new Map(products.map((p) => [p.sku, p]));
}

export function findProduct(catalog: Catalog, sku: string): Product {
  const product = catalog.get(sku);
  if (!product) throw new Error(`Unknown product: ${sku}`);
  return product;
}
