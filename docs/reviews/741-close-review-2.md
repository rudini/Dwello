# Code-Review 741-close, Runde 2 (Delta 7a4fa89..4aa7948, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine offenen oder neuen Befunde. |

Geschlossen: C-1, C-2

Geprüft: Der neue Step vergleicht die Linktexte in ihrer Reihenfolge mit `["2024 abrechnen", …, "<letztes Jahr> abrechnen"]` (`toEqual`); ohne `.toReversed()` in `src/routes/contracts/[id]/MissingStatement.svelte:39` käme die neueste Periode zuerst, und der Step schlüge fehl, solange mindestens zwei Perioden fehlen (heute 2024 und 2025). Das Target `/^contract-missing-statement-link-/` trifft nur die Abrechnen-Buttons (die Rechnungs-Buttons heissen `contract-missing-statement-invoices-…`). Der Text stammt aus `contracts_statement_create` («{period} abrechnen»). `lastYear` ist in der Step-Datei schon definiert (Z. 81). Die Frage gibt die Texte selbst zurück, und der Step ruft nur eine Frage auf. Das Szenario «Fehlende Abrechnungen auf dem Handy» gibt es auf `origin/main` noch nicht, die zusätzliche Zeile ist also frei. Der Kommentar des DOM-Tests (Z. 308) stimmt jetzt. ponytail-review: nichts zu melden.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (auf 4aa7948): das Szenario «Fehlende Abrechnungen auf dem Handy» grün, `bun run lint`, `bun run check`.
- Kein eigener roter Lauf des Szenarios. Nur gelesen: Es schlägt ohne die Änderung fehl (siehe oben). Nach Workflow 2 reicht das, weil der DOM-Test aus 8729f6d rot gesehen wurde.
- Am Datum hängt das Szenario so: Weil «bis zum letzten Jahr» der Uhr folgt, fehlte bei einem Lauf im Jahr 2025 nur eine Periode, und der Button hiesse dann anders. Heute (2026) ist das nicht relevant, nachgeprüft habe ich es nicht.
