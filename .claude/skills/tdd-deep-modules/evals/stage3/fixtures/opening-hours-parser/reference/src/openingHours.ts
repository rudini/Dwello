export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export interface TimeRange {
  from: string;
  to: string;
}

export type WeeklyHours = Record<Day, TimeRange[]>;

export type OpeningHoursErrorCode =
  | "EMPTY"
  | "UNKNOWN_DAY"
  | "INVALID_TIME"
  | "END_BEFORE_START"
  | "OVERLAP"
  | "DUPLICATE_DAY"
  | "UNEXPECTED";

export class OpeningHoursError extends Error {
  readonly code: OpeningHoursErrorCode;
  readonly column: number;

  constructor(code: OpeningHoursErrorCode, column: number, description: string) {
    super(`${description} (column ${column})`);
    this.name = "OpeningHoursError";
    this.code = code;
    this.column = column;
  }
}

const DAYS: Day[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type TokenKind = "word" | "time" | "-" | "," | ";" | "end";

interface Token {
  kind: TokenKind;
  text: string;
  column: number;
}

interface Minutes {
  from: number;
  to: number;
  range: TimeRange;
  column: number;
}

function createLexer(text: string) {
  let index = 0;
  let peeked: Token | undefined;

  function read(): Token {
    while (text[index] === " ") index++;
    const start = index;
    const column = start + 1;
    if (index >= text.length) return { kind: "end", text: "", column };
    const run = (pattern: RegExp) => {
      while (index < text.length && pattern.test(text[index])) index++;
      return text.slice(start, index);
    };
    const ch = text[index];
    if (/[A-Za-z]/.test(ch)) return { kind: "word", text: run(/[A-Za-z]/), column };
    if (/[0-9:]/.test(ch)) return { kind: "time", text: run(/[0-9:]/), column };
    if (ch === "-" || ch === "," || ch === ";") {
      index++;
      return { kind: ch, text: ch, column };
    }
    throw new OpeningHoursError("UNEXPECTED", column, `Unexpected character "${ch}"`);
  }

  return {
    peek(): Token {
      peeked ??= read();
      return peeked;
    },
    next(): Token {
      const token = this.peek();
      peeked = undefined;
      return token;
    },
  };
}

type Lexer = ReturnType<typeof createLexer>;

function unexpected(token: Token): OpeningHoursError {
  const what = token.kind === "end" ? "Unexpected end of text" : `Unexpected "${token.text}"`;
  return new OpeningHoursError("UNEXPECTED", token.column, what);
}

function expect(lexer: Lexer, kind: TokenKind): Token {
  const token = lexer.next();
  if (token.kind !== kind) throw unexpected(token);
  return token;
}

function parseDay(lexer: Lexer): { day: number; column: number } {
  const token = lexer.next();
  if (token.kind !== "word") throw unexpected(token);
  const day = DAYS.indexOf(token.text as Day);
  if (day < 0) throw new OpeningHoursError("UNKNOWN_DAY", token.column, `Unknown day "${token.text}"`);
  return { day, column: token.column };
}

function parseDays(lexer: Lexer): Day[] {
  const named: Day[] = [];
  do {
    const first = parseDay(lexer);
    let last = first.day;
    if (lexer.peek().kind === "-") {
      lexer.next();
      last = parseDay(lexer).day;
    }
    const span = (last - first.day + 7) % 7;
    for (let offset = 0; offset <= span; offset++) {
      const day = DAYS[(first.day + offset) % 7];
      if (named.includes(day)) {
        throw new OpeningHoursError("DUPLICATE_DAY", first.column, `${day} is named twice`);
      }
      named.push(day);
    }
  } while (lexer.peek().kind === "," && lexer.next());
  return named;
}

function parseTime(lexer: Lexer, isEnd: boolean): { text: string; minutes: number; column: number } {
  const token = expect(lexer, "time");
  const match = /^(\d\d):(\d\d)$/.exec(token.text);
  const hours = match ? Number(match[1]) : NaN;
  const minutes = match ? Number(match[2]) : NaN;
  const valid = (hours <= 23 && minutes <= 59) || (isEnd && hours === 24 && minutes === 0);
  if (!valid) throw new OpeningHoursError("INVALID_TIME", token.column, `Invalid time "${token.text}"`);
  return { text: token.text, minutes: hours * 60 + minutes, column: token.column };
}

function parseRanges(lexer: Lexer): TimeRange[] {
  const ranges: Minutes[] = [];
  do {
    const from = parseTime(lexer, false);
    expect(lexer, "-");
    const to = parseTime(lexer, true);
    if (to.minutes <= from.minutes) {
      throw new OpeningHoursError("END_BEFORE_START", from.column, `${to.text} is not after ${from.text}`);
    }
    if (ranges.some((r) => from.minutes < r.to && r.from < to.minutes)) {
      throw new OpeningHoursError("OVERLAP", from.column, `${from.text}-${to.text} overlaps another range`);
    }
    ranges.push({ from: from.minutes, to: to.minutes, column: from.column, range: { from: from.text, to: to.text } });
  } while (lexer.peek().kind === "," && lexer.next());
  return ranges.sort((a, b) => a.from - b.from).map((r) => r.range);
}

function parseRule(lexer: Lexer, hours: WeeklyHours): void {
  const days = parseDays(lexer);
  const token = lexer.peek();
  let ranges: TimeRange[];
  if (token.kind === "word" && token.text === "off") {
    lexer.next();
    ranges = [];
  } else if (token.kind === "time") {
    ranges = parseRanges(lexer);
  } else {
    throw unexpected(token);
  }
  for (const day of days) hours[day] = ranges.map((r) => ({ ...r }));
}

export function parseOpeningHours(text: string): WeeklyHours {
  if (/^ *$/.test(text)) throw new OpeningHoursError("EMPTY", 1, "No opening hours given");
  const hours = Object.fromEntries(DAYS.map((d) => [d, []])) as unknown as WeeklyHours;
  const lexer = createLexer(text);
  parseRule(lexer, hours);
  for (let token = lexer.next(); token.kind !== "end"; token = lexer.next()) {
    if (token.kind !== ";") throw unexpected(token);
    parseRule(lexer, hours);
  }
  return hours;
}
