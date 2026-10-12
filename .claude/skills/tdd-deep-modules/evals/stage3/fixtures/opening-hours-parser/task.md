# Parse opening hours entered by shop owners

Shop owners type their opening hours into a single text field, for example

```
Mo-Fr 08:00-12:00,13:30-18:30; Sa 09:00-16:00; Su off
```

We need a parser that turns this text into a weekly schedule, and that tells the owner precisely what is wrong (with a column number the form can highlight) when the text cannot be understood.

## Entry point

`src/openingHours.ts` (the stub already contains the types and the error class; keep them as they are):

```ts
export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";
export interface TimeRange { from: string; to: string } // "HH:MM" exactly as written
export type WeeklyHours = Record<Day, TimeRange[]>;

export type OpeningHoursErrorCode =
  | "EMPTY" | "UNKNOWN_DAY" | "INVALID_TIME" | "END_BEFORE_START"
  | "OVERLAP" | "DUPLICATE_DAY" | "UNEXPECTED";

export class OpeningHoursError extends Error {
  readonly code: OpeningHoursErrorCode;
  readonly column: number; // 1-based column in the whole input text
  constructor(code: OpeningHoursErrorCode, column: number, description: string);
}

export function parseOpeningHours(text: string): WeeklyHours;
```

On success `parseOpeningHours` returns an object with **all seven days** as keys; a closed day has an empty array. On failure it throws an `OpeningHoursError` (the description text is free; the class appends the column).

## Format

```
spec     = rule { ";" rule }
rule     = days ( ranges | "off" )
days     = dayItem { "," dayItem }
dayItem  = DAY [ "-" DAY ]
ranges   = range { "," range }
range    = TIME "-" TIME
```

- `DAY` is one of `Mo Tu We Th Fr Sa Su` (case-sensitive). `off` is lowercase.
- A day range runs forward through the week and may wrap around: `Fr-Mo` means Fr, Sa, Su, Mo. `Mo-Mo` means Mo only.
- `TIME` is `HH:MM` with exactly two digits each, hours `00`-`23`, minutes `00`-`59`. `24:00` is allowed, but only as the end of a range.
- Spaces may appear anywhere between tokens and at the start and end; they carry no meaning (so `Mo,We 08:00 - 12:00` is fine).
- Within one rule, the ranges are returned sorted by start time. Ranges may touch (`08:00-12:00,12:00-14:00`) but must not overlap.
- Rules are applied left to right. A later rule **replaces** the hours of every day it names (`Mo-Su 08:00-20:00; Su off` closes Sunday; `Mo-Fr 08:00-12:00; We 14:00-18:00` leaves Wednesday open only in the afternoon). Days that no rule names are closed.

## Errors

The text is read from left to right and the first problem encountered is reported. To find tokens: a run of letters is one word, a run of digits and colons is one time, `-`, `,` and `;` are single tokens. The column is that of the first character of the offending token.

| Code | When | Column |
|---|---|---|
| `EMPTY` | the text is empty or contains only spaces | 1 |
| `UNKNOWN_DAY` | a word appears where a day is expected and is not one of the seven days | the word |
| `INVALID_TIME` | a time token is not a valid `TIME` as defined above (including `24:00` as a start) | the time token |
| `END_BEFORE_START` | a range's end is not later than its start | the range's start time |
| `OVERLAP` | a range overlaps an earlier range of the same rule | the start time of the later-written range |
| `DUPLICATE_DAY` | a day item names a day already named earlier in the same rule | that day item (for a day range: its first day) |
| `UNEXPECTED` | anything else: a token that does not fit the format at this point, a character that belongs to no token, or the text ending too early | that token or character; when the text ends too early, the length of the text + 1 |

Examples: `Mo-Fx 08:00-12:00` gives `UNKNOWN_DAY` at column 4; `Mo 08:00-` gives `UNEXPECTED` at column 10; `Mo off;` gives `UNEXPECTED` at column 8 (an empty rule is not allowed).
