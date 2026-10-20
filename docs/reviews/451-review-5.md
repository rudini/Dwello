# Code-Review #451, Runde 5 (Abschlussrunde vor dem Push)

Worktree: `review-451-code3` auf `c9439466`, Bereich `2736fe64..c9439466` (70341d17, Merge c9439466).
Vorheriger Bericht: `docs/reviews/451-review-4.md` (offene ID: C-19).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Status der offenen IDs aus Runde 4

- **C-19: geschlossen.** `src/__tests__/invoice-upload-dialog.dom.test.ts:153-163` öffnet den Dialog mit `tank: 'c1'` für Seeblick (b1), wählt b1, lädt eine Datei, deren Vertrag-Antwort (`tests/contracts/invoice-extraction.json:21`) die Kategorie `c1` hat, und prüft den Satz «Tragen Sie als Beginn und als Ende den Tag der Lieferung ein.» in `invoice-service-period-help`. Der Weg im Code: `InvoiceUploadDialog.svelte:262` (`tank` des gewählten Gebäudes) -> `InvoiceUploadRow.svelte:90` -> `UploadRowFields.svelte:76` (`deliversToTank`) -> `InvoiceDataFields.svelte:86` (`invoices_service_period_fuel`, `messages/de.json:889`). Rot ohne die Änderung nach Lesen bestätigt: ohne `tank` ist `fuel` false und der Absatz fehlt; der Satz steht in keinem anderen Hilfetext. Der Test läuft grün (36/36, selbst ausgeführt).

## Merge c9439466

- `git merge-tree --write-tree c9439466^1 c9439466^2` ergibt einen Baum, der sich von `c9439466` nur in `docs/design/offene-punkte.md` unterscheidet (der Konflikt). Alle automatisch gemergten Dateien, auch die von beiden Seiten berührten (`messages/*.json`, `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tests/e2e/tasks/accessibility.ts`, `api-contracts.pg.test.ts`, `docs/api-specification.md`, `docs/design/i18n-begriffe.md`), sind damit genau das Ergebnis von Git, ohne Handänderung.
- Konfliktauflösung `docs/design/offene-punkte.md:118-119`: O-42 (main) und O-43 (Branch) beide erhalten, nichts sonst verändert (`git show c9439466 --cc`).
- `messages/{de,fr,it,en}.json`: gültiges JSON, je 1816 Schlüssel, keine doppelten Schlüssel.
- Die Zustände von #479 (`register-*`) stehen in `screens.json` (mit `stateMeanings`), in beiden Features und in `tasks/accessibility.ts`; die Zustände von #451 bleiben erhalten.
- Keine inhaltliche Überschneidung: main ändert an `POST /buildings` nur den Request (Wohnungen aus dem Gebäuderegister); die Gebäudeliste, die `src/routes/invoices/+page.server.ts:55-57` um `tank` ergänzt, bleibt unverändert.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (168 Dateien), die Backend-Tests (statement-pdf, statement-pdf-render, invoice-completeness, heating-distribution, prorating, statement-invoices, demo-data, api-contracts, invoice-amount): vom Aufrufer gemeldet. Selbst ausgeführt nur `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts` (grün).
- Rotlauf des neuen Tests mit `tank={undefined}`: vom Aufrufer gemeldet, nach Lesen plausibel (siehe C-19), nicht selbst wiederholt.
- E2E der betroffenen Features: noch nicht gelaufen (beim Aufrufer in der Warteschlange); hier nicht gestartet.
- `docs/reviews/451-review-3.md` und `-4.md`: Berichte, nicht geprüft.
