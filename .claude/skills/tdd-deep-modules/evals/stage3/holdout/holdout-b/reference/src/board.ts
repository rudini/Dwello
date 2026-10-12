export type BoardErrorCode =
  | "UNKNOWN_CARD"
  | "UNKNOWN_COLUMN"
  | "SAME_COLUMN"
  | "BLOCKED"
  | "SKIP_NOT_ALLOWED"
  | "WIP_LIMIT"
  | "ALREADY_BLOCKED"
  | "NOT_BLOCKED"
  | "EMPTY_TITLE";

export class BoardError extends Error {
  readonly code: BoardErrorCode;

  constructor(code: BoardErrorCode, message: string) {
    super(message);
    this.name = "BoardError";
    this.code = code;
  }
}

export interface ColumnConfig {
  name: string;
  /** Maximum number of cards in the column; no limit when absent. */
  wipLimit?: number;
}

export interface BoardOptions {
  columns: ColumnConfig[];
  /** Current time in epoch milliseconds. */
  now: () => number;
}

export interface CycleTime {
  totalMs: number;
  blockedMs: number;
}

export interface Board {
  addCard(title: string): string;
  move(cardId: string, toColumn: string): void;
  block(cardId: string, reason: string): void;
  unblock(cardId: string): void;
  cardsIn(column: string): string[];
  cycleTime(cardId: string): CycleTime | null;
}

interface Card {
  id: string;
  column: number;
  arrivedAt: number;
  startedAt: number | null;
  blockedSince: number | null;
  blockedIntervals: Array<[number, number]>;
  finishedAt?: number;
}

function overlap([from, to]: [number, number], start: number, end: number): number {
  return Math.max(0, Math.min(to, end) - Math.max(from, start));
}

export function createBoard(options: BoardOptions): Board {
  const columns = options.columns;
  const last = columns.length - 1;
  const cards = new Map<string, Card>();
  const order: Card[] = [];
  let added = 0;

  function card(cardId: string): Card {
    const found = cards.get(cardId);
    if (!found) throw new BoardError("UNKNOWN_CARD", `Unknown card ${cardId}`);
    return found;
  }

  function columnIndex(name: string): number {
    const index = columns.findIndex((c) => c.name === name);
    if (index < 0) throw new BoardError("UNKNOWN_COLUMN", `Unknown column ${name}`);
    return index;
  }

  function cardsAt(index: number): Card[] {
    return order.filter((c) => c.column === index).sort((a, b) => a.arrivedAt - b.arrivedAt);
  }

  function requireRoom(index: number): void {
    const limit = columns[index].wipLimit;
    if (limit !== undefined && cardsAt(index).length >= limit) {
      throw new BoardError("WIP_LIMIT", `Column ${columns[index].name} is full`);
    }
  }

  let arrivals = 0;
  function place(c: Card, index: number): void {
    c.column = index;
    c.arrivedAt = arrivals++;
  }

  return {
    addCard(title) {
      if (title.trim() === "") throw new BoardError("EMPTY_TITLE", "A card needs a title");
      requireRoom(0);
      added += 1;
      const c: Card = { id: `C${added}`, column: 0, arrivedAt: 0, startedAt: null, blockedSince: null, blockedIntervals: [] };
      place(c, 0);
      cards.set(c.id, c);
      order.push(c);
      return c.id;
    },

    move(cardId, toColumn) {
      const c = card(cardId);
      const target = columnIndex(toColumn);
      if (target === c.column) throw new BoardError("SAME_COLUMN", `${cardId} is already in ${toColumn}`);
      if (c.blockedSince !== null) throw new BoardError("BLOCKED", `${cardId} is blocked`);
      if (target > c.column + 1) throw new BoardError("SKIP_NOT_ALLOWED", `${cardId} cannot skip columns`);
      requireRoom(target);
      const now = options.now();
      if (c.column === 0 && c.startedAt === null) c.startedAt = now;
      place(c, target);
      if (target === last) c.finishedAt = now;
    },

    block(cardId, _reason) {
      const c = card(cardId);
      if (c.blockedSince !== null) throw new BoardError("ALREADY_BLOCKED", `${cardId} is already blocked`);
      c.blockedSince = options.now();
    },

    unblock(cardId) {
      const c = card(cardId);
      if (c.blockedSince === null) throw new BoardError("NOT_BLOCKED", `${cardId} is not blocked`);
      c.blockedIntervals.push([c.blockedSince, options.now()]);
      c.blockedSince = null;
    },

    cardsIn(column) {
      return cardsAt(columnIndex(column)).map((c) => c.id);
    },

    cycleTime(cardId) {
      const c = card(cardId);
      if (c.column !== last || c.startedAt === null || c.finishedAt === undefined) return null;
      const start = c.startedAt;
      const end = c.finishedAt;
      const intervals = [...c.blockedIntervals];
      if (c.blockedSince !== null) intervals.push([c.blockedSince, options.now()]);
      const blockedMs = intervals.reduce((sum, i) => sum + overlap(i, start, end), 0);
      return { totalMs: end - start, blockedMs };
    },
  };
}
