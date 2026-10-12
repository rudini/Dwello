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

export function createBoard(_options: BoardOptions): Board {
  throw new Error("Not implemented");
}
