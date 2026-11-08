# Code-Review #1138, Runde 2 (Schlussrunde: c90d956..16367c5^1 ohne Berichte, 16367c5..1bf517e)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2

Geprüft: `docs/api-specification.md:301` nennt `fuelStock { opening, closing } | null` je Position (null bei 0 und 0, wie `cost-reconciliation.service.ts:44–48`) und `vacancies [{ apartmentNumber, days }]` nach Geschoss und Nummer (wie `:113`); `/reports/reconciliation` (`:334`) verweist auf diese Antwort. `src/__tests__/cost-reconciliation-texts.test.ts` hält alle 20 Texte fest; ich habe sie Zeichen für Zeichen mit der Tabelle in `docs/reviews/1138-fachreview-1.md:30–34` verglichen, `nbsp` ist U+00A0 (Bytes C2 A0). Ein fehlender Schlüssel lässt den Test scheitern (`undefined` gegen Text). Kein Rot-Lauf nötig: der Test hält bestehende Texte fest, und die Nachricht von 52bf751 sagt das. 1bf517e ist nur Prettier auf einer Zeile des DOM-Tests, die Assertion ist gleich geblieben. Der Merge 16367c5 lief laut Aufrufer ohne Konflikt, deshalb habe ich ihn nicht geprüft.

## Nicht bestätigt

- Vom Aufrufer gemeldet: bun run lint, bun run check, bun run fitness, backend type-check, Prettier auf den hinzugefügten Dateien, bunx vitest run --changed origin/main (728) plus open-work, design-guard und tokens, backend cost-reconciliation.pg.test.ts und api-contracts.pg.test.ts (137 bestanden).
- Ob 16367c5 tatsächlich ohne Konflikt zusammengeführt wurde: nur nach Angabe des Aufrufers; den Inhalt des Merges von origin/main habe ich nicht gelesen.
- `Spec change approved: #1138` im Text des Pull Requests: einen Pull Request gibt es noch nicht (wie in Runde 1).
