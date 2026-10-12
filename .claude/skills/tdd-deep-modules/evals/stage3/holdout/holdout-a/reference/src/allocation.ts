import type { Order } from "./orders";
import type { Pick, Shortage, StockLot } from "./pickList";

function fefo(a: StockLot, b: StockLot): number {
  if (a.expires !== b.expires) {
    if (a.expires === null) return 1;
    if (b.expires === null) return -1;
    return a.expires < b.expires ? -1 : 1;
  }
  return a.bin < b.bin ? -1 : a.bin > b.bin ? 1 : 0;
}

/** Allocates stock to orders (priority first, then text order), earliest expiry first. */
export function allocate(orders: Order[], stock: StockLot[]): { picks: Pick[]; shortages: Shortage[] } {
  const lots = stock.map((lot) => ({ ...lot })).sort(fefo);
  const sequence = [...orders.filter((o) => o.priority), ...orders.filter((o) => !o.priority)];
  const picks: Pick[] = [];
  const shortages: Shortage[] = [];

  for (const order of sequence) {
    for (const item of order.items) {
      let needed = item.qty;
      for (const lot of lots) {
        if (needed === 0) break;
        if (lot.sku !== item.sku || lot.qty === 0) continue;
        const taken = Math.min(needed, lot.qty);
        lot.qty -= taken;
        needed -= taken;
        picks.push({ bin: lot.bin, sku: item.sku, qty: taken, orderId: order.id });
      }
      if (needed > 0) shortages.push({ orderId: order.id, sku: item.sku, missing: needed });
    }
  }
  return { picks, shortages };
}
