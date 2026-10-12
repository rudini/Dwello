import { OrderFormatError } from "./pickList";

export interface OrderItem {
  sku: string;
  qty: number;
}

export interface Order {
  id: string;
  priority: boolean;
  items: OrderItem[];
}

const ORDER_LINE = /^ORDER +([A-Za-z0-9-]+)( +!)?$/;
const ITEM_LINE = /^([A-Z0-9-]+) +x([1-9]\d*)$/;

/** Parses the orders text; returns orders in text order. */
export function parseOrders(text: string): Order[] {
  const orders: (Order & { line: number })[] = [];
  const requireItems = (order: (typeof orders)[number] | undefined) => {
    if (order && order.items.length === 0) throw new OrderFormatError(order.line, `order ${order.id} has no items`);
  };

  text.split(/\r?\n/).forEach((raw, index) => {
    const line = index + 1;
    const content = raw.trim();
    if (content === "" || content.startsWith("#")) return;

    const orderMatch = ORDER_LINE.exec(content);
    if (orderMatch) {
      requireItems(orders.at(-1));
      const id = orderMatch[1];
      if (orders.some((o) => o.id === id)) throw new OrderFormatError(line, `order ${id} appears twice`);
      orders.push({ id, priority: orderMatch[2] !== undefined, items: [], line });
      return;
    }

    const itemMatch = ITEM_LINE.exec(content);
    if (!itemMatch) throw new OrderFormatError(line, `cannot read "${content}"`);
    const current = orders.at(-1);
    if (!current) throw new OrderFormatError(line, "item before the first ORDER line");
    const [, sku, qty] = itemMatch;
    const existing = current.items.find((i) => i.sku === sku);
    if (existing) existing.qty += Number(qty);
    else current.items.push({ sku, qty: Number(qty) });
  });

  requireItems(orders.at(-1));
  return orders.map(({ id, priority, items }) => ({ id, priority, items }));
}
