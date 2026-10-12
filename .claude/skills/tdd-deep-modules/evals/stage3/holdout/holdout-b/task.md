# Team board with WIP limits and cycle time

Our support team tracks work on a board with columns (for example *Backlog, Doing, Review, Done*). We want the board logic as a library: cards move through the columns under a few rules, columns can have work-in-progress limits, cards can be blocked, and we measure how long a card took from start to finish and how much of that time it was blocked.

## Entry point

`src/board.ts` (the stub already contains the types and the error class; keep them as they are):

```ts
export type BoardErrorCode =
  | "UNKNOWN_CARD" | "UNKNOWN_COLUMN" | "SAME_COLUMN" | "BLOCKED" | "SKIP_NOT_ALLOWED"
  | "WIP_LIMIT" | "ALREADY_BLOCKED" | "NOT_BLOCKED" | "EMPTY_TITLE";

export class BoardError extends Error {
  readonly code: BoardErrorCode;
  constructor(code: BoardErrorCode, message: string);
}

export interface ColumnConfig { name: string; wipLimit?: number }
export interface BoardOptions { columns: ColumnConfig[]; now: () => number } // epoch ms
export interface CycleTime { totalMs: number; blockedMs: number }

export interface Board {
  addCard(title: string): string;
  move(cardId: string, toColumn: string): void;
  block(cardId: string, reason: string): void;
  unblock(cardId: string): void;
  cardsIn(column: string): string[];
  cycleTime(cardId: string): CycleTime | null;
}

export function createBoard(options: BoardOptions): Board;
```

Columns are given in board order (at least two). The first column is where new cards arrive; the last column is "done". All failures throw `BoardError` with the code named below (message free) and leave the board unchanged. The board reads the time through `options.now()` whenever it needs it; time moves between calls.

## Rules

**Adding.** `addCard(title)` puts a new card at the end of the first column and returns its id: `"C1"`, `"C2"`, ... in the order cards are successfully added. A title that is empty after trimming: `EMPTY_TITLE`. If the first column is at its WIP limit: `WIP_LIMIT`.

**WIP limits.** A column with `wipLimit` never holds more than that many cards. Blocked cards count like any other card.

**Moving.** `move(cardId, toColumn)` checks, in this order:

1. unknown card: `UNKNOWN_CARD`; 2. unknown column: `UNKNOWN_COLUMN`; 3. the card is already in that column: `SAME_COLUMN`; 4. the card is blocked: `BLOCKED`; 5. moving forward by more than one column: `SKIP_NOT_ALLOWED` (moving backwards by any number of columns is allowed); 6. the target column is at its WIP limit: `WIP_LIMIT`.

A moved card goes to the end of the target column.

**Blocking.** `block(cardId, reason)` marks a card as blocked (unknown card: `UNKNOWN_CARD`; already blocked: `ALREADY_BLOCKED`). `unblock(cardId)` lifts it (unknown: `UNKNOWN_CARD`; not blocked: `NOT_BLOCKED`). Cards can be blocked in any column.

**Listing.** `cardsIn(column)` returns the ids of the cards in that column, in the order they arrived there. Unknown column: `UNKNOWN_COLUMN`.

## Cycle time

`cycleTime(cardId)` (unknown card: `UNKNOWN_CARD`) returns `null` unless the card is currently in the last column. Otherwise:

- the card **started** at the moment it first left the first column (later trips back to the first column do not change this);
- it **finished** at the moment it most recently arrived in the last column;
- `totalMs` is finished minus started;
- `blockedMs` is the time between started and finished during which the card was blocked. Blocked time outside that interval (e.g. while still in the first column before starting, or after finishing) does not count.
