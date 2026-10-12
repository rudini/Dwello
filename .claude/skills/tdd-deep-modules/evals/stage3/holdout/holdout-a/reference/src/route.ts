import type { Pick } from "./pickList";

function location(bin: string) {
  const [aisle, rack, level] = bin.split("-");
  return { aisle, rack: Number(rack), level: Number(level) };
}

/** Sorts picks into the serpentine walking order; stable for picks at the same bin. */
export function walkingOrder(picks: Pick[]): Pick[] {
  const aisles = [...new Set(picks.map((p) => location(p.bin).aisle))].sort();
  const ascending = (aisle: string) => aisles.indexOf(aisle) % 2 === 0;
  return [...picks].sort((a, b) => {
    const la = location(a.bin);
    const lb = location(b.bin);
    if (la.aisle !== lb.aisle) return la.aisle < lb.aisle ? -1 : 1;
    if (la.rack !== lb.rack) return ascending(la.aisle) ? la.rack - lb.rack : lb.rack - la.rack;
    return la.level - lb.level;
  });
}
