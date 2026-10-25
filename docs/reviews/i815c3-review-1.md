# Review i815c3 (Schlussrunde, 90f42fee..ab4d0fa3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Keine Blocker, keine Major.

## Status der offenen IDs aus i815c2-review-1.md

- **C-1: behoben.** Der Kommentar in `src/__tests__/helpers/statement.ts:16-18` sagt jetzt: «a test whose result depends on these fields states the backend's answer for its Saldo». Die Tests aus C-1 hängen nachgelesen nur von Status, Vorzeichen oder `carried` ab. Für sie behauptet der Kommentar also nichts Falsches mehr. Die Tests, deren Ergebnis von den Feldern abhängt, geben die Felder laut i815c2 («Geprüft», Z. 352 … 1981) an.
- **C-2: behoben.** `backend/src/__tests__/api-contracts.pg.test.ts:378` hat jetzt einen eigenen Kommentar zur Abrechnungsperiode. Der Kommentar zum Vertragsbeginn steht wieder über `check-start` (Z. 384).
- **C-3: offen (Minor),** wie vom Aufrufer angegeben. Der Delta berührt die Stelle nicht.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/statement-pages.dom.test.ts` (194 bestanden), die beiden «check»-Fälle in `api-contracts.pg.test.ts` (2 bestanden), Prettier-Diff auf `helpers/statement.ts` (keiner).
- Ob jeder Test, dessen Ergebnis von `unpaid`/`claimed`/`noPayment`/`waived`/`carried` abhängt, diese Felder angibt, habe ich in dieser Runde nicht erneut Test für Test geprüft. Ich stütze mich dafür auf die Zeilenliste in i815c2.

Geprüft: Der Delta ändert nur Kommentare und die Reihenfolge von Kommentaren. Code und Testinhalte bleiben gleich, es gibt keine fremden Änderungen.
