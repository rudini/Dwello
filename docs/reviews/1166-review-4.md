# Code-Review 1166, Runde 4: Konfliktauflösung im Merge a016589

Umfang: `git show --remerge-diff a016589`, ein Konflikt in `src/lib/ui/Field.svelte` (`describedBy`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Die Auflösung (`src/lib/ui/Field.svelte:81-92`) übernimmt die Reihenfolge von main (#677: eigener Fehler, dann `flagged`, Hinweis, `describedby`, Hilfe) und die Regel des Branches (`flagged !== errorId && flagged`, 1166 C-3). Beide Tests liegen im Merge vor und passen zum aufgelösten Code: «liest den Fehler vor dem Hinweis und der Hilfe vor» (`src/__tests__/ui-fields.dom.test.ts:56`) und «liest die eigene Fehlermeldung einmal vor, auch wenn die Ablehnung das Feld nennt» (`:128`, erwartet genau `accountHolderName-error`). Fall `invalidBy` = eigene Fehler-ID ohne sichtbaren Fehler: Es entsteht kein Verweis auf ein fehlendes Element, weil `#errorId` nur bei `shown` gerendert wird (`Field.svelte:116`). Die Verweise auf ein anderes Feld (`iban-error`, `:99`, `:117`) bleiben unverändert. Gegenüber main ändert der Merge in `src/lib/ui` und `ui-fields.dom.test.ts` nur die Zeilen von #1166.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (1716 Tests), E2E chromium `-g "Bildschirm ohne .* config |Kontoinhaber"` (13 bestanden).
- Die ohne Konflikt zusammengeführten Dateien (47 Dateien im Diff gegenüber dem Branch-Elternteil) habe ich nicht inhaltlich geprüft. Das liegt ausserhalb dieses Auftrags, der nur die Konfliktauflösung betrifft.
