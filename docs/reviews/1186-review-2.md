# Code-Review #1186, Runde 2 (Abschlussrunde, 77afb3c..HEAD)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/+page.svelte:43-56, 218-225 | Unverändert offen (wie in Runde 1 beschrieben, vom Aufrufer als Minor belassen): Eine leere Seite hinter der letzten widerspricht sich (der Satz unter den Kacheln nennt `data.total`, die leere Liste sagt «keine Abrechnung»). |

Geschlossen: C-2, C-3

## Nicht bestätigt

- Vom Aufrufer gemeldet: eslint auf den geänderten Dateien ok. Die zwei neuen DOM-Tests laufen grün und waren rot, als die Status-Überschriften aus `+page.svelte` herausgenommen waren. Beim Lesen stimmt das: Ohne `counts` mit Status liefern `statements_count_many` und `statements_count_page_one` keinen «mit dem Status …»-Teil, also scheitern beide `toBe`.
- Der E2E-Lauf von statements mit dem geänderten Task `showOverdueOfBuilding` läuft laut Aufrufer noch. Ein Ergebnis habe ich nicht gesehen. Beim Lesen ist `statusFilter('overdue')` (tests/e2e/targets/statements.ts:46) derselbe Locator `filter-overdue` wie das entfernte `overdueFilter`. Auf das Ergebnis des Laufs wirkt sich der Tausch also nicht aus.

Geprüft: Die Testdaten treffen die Zweige `many` (2 von 2, Seite 1) und `pageOne` (11 von 11, Seite 2 bei pageSize 10). Die erwarteten Texte stimmen mit `messages/de.json:1334-1335` überein. Kein Verweis auf `overdueFilter` ist übrig. Der Diff enthält nichts, was nicht zu C-2/C-3 gehört.
