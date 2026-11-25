# Code-Review #1477, Runde 1 (de7066f..6e3801b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Erster Satz von `sharesNoteDelivery` in de/fr/it/en (`backend/src/services/pdf-texts/*.ts:133/134`) entspricht wortgleich dem Entscheid, Rest des Texts unverändert, `partDelivery`/`heatingNoteDelivery` nicht berührt; Unit-Test `statement-pdf-render.test.ts:693-705` pinnt den neuen Text in allen vier Sprachen und schlägt gegen den alten Text fehl; Szenariozeile `statement-detail.feature:793` folgt (Spec change approved #1477); Glossarzeile «Brennstoff (Kategorie)» ergänzt wie entschieden, Zielzeile «Verbrauch (Heizmaterial)» existiert (`UBIQUITOUS_LANGUAGE.md:163`); keine Fundstelle des alten Satzes ausserhalb von reviews/archive; Diff minimal, nichts Fremdes.

## Nicht bestätigt

- Dass die Notiz bei fehlendem Anfangs- *oder* Endbestand (einer oder beide) erscheint: der Text hängt nur an `tankDelivery` (`backend/src/services/pdf-cost-table.ts:235`); dessen Setzung ist durch den Diff unverändert und hier nicht neu geprüft.
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, Backend type-check, `bunx vitest run --changed origin/main`, vitest contract-rent-labels und open-work, `bun test statement-pdf-render.test.ts` (199 pass, 4 Zeilen rot gesehen vor der Textänderung) und `pdf-translations.test.ts`, E2E chromium -g "Eine Lieferung in den Tank ohne Anfangs- und Endbestand" (4 passed).
