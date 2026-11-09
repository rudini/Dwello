# Code-Review #1409 Jahresbericht, Abschlussrunde 2 (Delta 7f6ce481..67dfead8 ohne `docs/reviews`; Vorbericht `docs/reviews/1409-review-3.md`)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-14 | Minor | backend/src/services/annual-income.ts:13 | `sum` ist eine Kopie von `sum` in `annual-report.service.ts:19`, das dort weiter gebraucht wird. Mit der Auslagerung gibt es denselben Helfer zweimal; exportieren und importieren statt kopieren (ponytail-review `reuse`). |
| C-15 | Minor | src/lib/server/annual-report.ts:40; tests/e2e/features/analytics.feature | Das `No scenario` für die Gebäude nach Namen stützt sich auf die Vorauswahl. Die kann ein Szenario in der geteilten Datenbank nicht festhalten (`tests/e2e/CLAUDE.md`, «Isolation»), das stimmt. Die Reihenfolge in der Liste kann der E2E-Stack aber zeigen: «Bergsicht …» steht vor «Seeblick …», egal welche Gebäude parallele Szenarien anlegen. Der neue Szenario-Aufbau hat beide Gebäude schon. Der Grund deckt also nur die Vorauswahl. Der Unit-Test `annual-report.test.ts:58-73` prüft beides. |

Geschlossen: C-11, C-12, C-13.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check` (auf e2ba036a), `cd backend && bun run type-check`, `bun run fitness -- --base origin/main --structure` (0 Fehler), `bunx vitest run --changed origin/main` (2250 bestanden, auf e2ba036a vor der Backend-Aufteilung), `bun test annual-report.pg.test.ts api-contracts.pg.test.ts cost-reconciliation.pg.test.ts` (154 bestanden), E2E analytics/navigation/help (92 bestanden) und die a11y- und Sprachzeilen von analytics, help und help-public (12 bestanden) auf e2ba036a. Ebenfalls gemeldet: der Rot-Lauf des neuen Szenarios mit entfernter Download-Bedingung und der Rot-Lauf des Hilfe-Tests vor `help_statements_6`.
- Auf 67dfead8 (Routen und Dienst aufgeteilt) ist kein E2E-Lauf gemeldet. Gelesen habe ich: dieselben Pfade `/api/v1/reports/annual` und `/reports/pdf`, `.use(annualReportRoutes)` nach `authMiddleware` (app.ts:111), dieselbe Ablehnung `BUILDING_NOT_FOUND` mit 404, dasselbe Body-Schema. Die pg-Tests rufen beide Pfade auf.
- Das `No scenario` im Text des Pull Requests gibt es noch nicht. Die Commit-Nachricht e2ba036a nennt den Grund, ohne die Form `No scenario: <Grund>`.
- Den C-11-Test mit `amount: 50` als Zahl habe ich nur gelesen: Der Mapper reicht `amount` unverändert weiter (`annual-report.ts:66`). Fällt der Rückgriff `m.invoices_no_category()` weg, wird der Test rot.

Geprüft: `help_statements_6` in vier Sprachen, Wort für Wort wie in `1409-fachreview-4.md`. Das neue Szenario hat einen positiven Anker (die Überschrift) vor der Negativprüfung, eine Frage mit Wert (Anzahl, Titel), einen Schritt, der nur Task und Question aufruft, Gebäude-IDs aus dem Seed statt aus der Vorauswahl, und ohne die Bedingung `shown` würde es rot. `annual-income.ts` ist eine Verschiebung ohne Verhaltensänderung, ebenso `periodEndingIn`, `billedOutside` und `categoryRank`. `reports.ts` ist bis auf die entfernten Routen gleich und hat keine ungenutzten Importe.
