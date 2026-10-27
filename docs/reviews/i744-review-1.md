# Code-Review #744, Runde 1 (da5ab947)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Diff `src/lib/invoice-upload.ts:159` (eine Zeile) gegen #744 und gegen die Verhaltensgleichheit. `REQUIRED` (`billingEntityName`, `invoiceDate`, `amount`, `description`) bildet über `FORM_FIELD` (Z. 216–225) auf `billingEntity`, `invoiceDate`, `amount`, `description` ab; keiner davon ist `category` oder `distributionKeyId`. `checkRow` (Z. 297–303) gibt dieselben `validateInvoice`-Fehler unter denselben Schlüsseln zurück (der Spread `...errors` überschreibt nichts davon; `servicePeriodErrors` liefert nur `servicePeriodStart`/`servicePeriodEnd`) und filtert nur falsy Einträge, die `toDoOf` ohnehin als «erfüllt» liest. Das Verhalten bleibt also gleich; die bestehenden Tests in `src/__tests__/invoice-upload.test.ts:211–237` (leer, `abc`, Leerzeichen, `failed`) decken die Regel weiter ab, ein Rot-Lauf ist für einen Refactor ohne neuen Test nicht nötig. `validateInvoice` bleibt in `checkRow` importiert und benutzt; der Kommentar Z. 132 stimmt weiter. Commit-Betreff (38 Zeichen, `chore(invoices)`) und `No scenario: …` im Commit passen. ponytail-review: Lean already. Ship. Plan-Eintrag in `implementation_plan.md` ist Teil des Workflows, keine fremde Änderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Prettier-Vergleich und `bunx vitest run --changed origin/main` (5 Dateien, 213 Tests): vom Aufrufer gemeldet. Selbst nachgefahren: `bunx vitest run src/__tests__/invoice-upload.test.ts src/__tests__/invoice-upload-dialog.dom.test.ts` im Review-Worktree, 82 von 82 grün.
