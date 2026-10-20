# Code-Review #451, Runde 7 (Abschlussrunde vor dem Push)

Geprüft im Worktree `review-451-code3` (detached, 9b935d31):
- dfb0efa2: Fix C-20 (`backend/src/services/pdf.service.ts:357`) und Bericht `docs/reviews/451-review-6.md`.
- 9b935d31: Merge von `origin/main` (59c9c2ff). Konflikt `tests/e2e/fixtures/screens.ts` mit `git show --remerge-diff` und gegen beide Eltern geprüft. Ausserdem habe ich die automatisch gemergten Stellen geprüft, an denen main den Heizhinweis dieses Branches berührt (`PreviewChecks.svelte`, `StatementWizard.svelte`, `statement-generation.ts`, `statement-wizard.ts`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Status der offenen IDs aus Runde 6

- C-20: erledigt. Die Zeile `pdf.service.ts:357` lautet jetzt «Costi dell’immobile per il combustibile del serbatoio: … Conta per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.» Darin stecken beide Änderungen: «dell’immobile» von main und «del serbatoio» aus V-21 dieses Branches. `grep -rn cisterna backend/src messages src/lib` findet nichts mehr. Ein roter Test war nicht nötig, weil es eine Übersetzungs-Formulierung aus einem Review ist (Skill `slice-review`, «Triage»).

## Konfliktauflösung `tests/e2e/fixtures/screens.ts` (in Ordnung)

- `:39` Liste der Zustände: Gegenüber main kommt nur `heating-hints` dazu, gegenüber dem Branch nur `buildings-overlap` (beide Diffs geprüft). Kein Eintrag fehlt.
- `:139–149` Seeding: Gegenüber main (`git diff 59c9c2ff 9b935d31`) kommen nur die zwei Heizrechnungen 2024 von Bergsicht für #339 dazu (`:140–141`). Gegenüber dem Branch kommen nur die Teile von main dazu: Seeblick-Rechnungen 2026 (`:96–99`), Gebäude Felsblick und Wohnung 2.06 dort (`:145–146`), Leas Abrechnung in Felsblick (`:149`). Von keiner Seite geht etwas verloren.
- `heating-hints` (`tasks/accessibility.ts:510`) erstellt die Vorschau 2024 für Seeblick und Bergsicht (`tankBuilding` = Bergsicht, `:219`). Bergsicht hat jetzt nur noch Idas Abrechnung 2024 und keine Teilperiode bis 30.06. mehr. Darum bleibt das Gebäude mit der Überschneidungsregel von main (#408 Punkt 2, «one Abrechnungsperiode per day and building») wählbar. Das ist derselbe Weg wie bei `old-address-preview`, den main mit genau diesem Ziel verschoben hat (Kommentar `:142–144`). Die zwei Rechnungen sind da. `heating-without-service-period` ist in `PreviewChecks.svelte:109` erhalten.
- `buildings-overlap` (`:533`) braucht die Abrechnungen 2025 von Anna und Bruno in Seeblick. Die sind unverändert (`:76–77`). Die Bergsicht-Rechnungen von 2024 berühren den Zeitraum 01.07.2025 – 30.06.2026 nicht.
- `partlyBilledContract` (`:194`) zeigt weiter auf Leas Vertrag, jetzt in Felsblick.
- `screens.json:76/79/492/499`, `accessibility.feature:157/164` und `sprachen-bildschirme.feature:158/165` führen beide Zustände.

## Auto-Merge an den Berührungsstellen (in Ordnung)

- `PreviewChecks.svelte`: main hat `unbilledDays` und `partlyBilled` entfernt. Der Hinweis `heating` dieses Branches mit `heatingWholeText` ist erhalten. `grep partlyBilled src/lib backend/src/services` findet keine Reste.
- `heatingWithoutServicePeriod` ist durchgehend vorhanden: `invoice-completeness.service.ts:359`, `statement-generation.ts:364/367/431`, `statement-wizard.ts:97/292/294`.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3349 passed; deepcheck `cli.test.ts` lief unter Last in einen Timeout und einzeln grün, 31 passed). Der Worktree hat keine `node_modules`, deshalb habe ich nichts davon erneut ausgeführt.
- vom Aufrufer gemeldet: backend `bun test` statement-pdf, statement-pdf-render, invoice-completeness, heating-distribution, prorating, statement-invoices, demo-data, api-contracts, invoice-amount (285 pass).
- E2E (statement-generate, statement-detail, invoice-new, Bildschirmzeilen `heating-hints`/`buildings-overlap`): nicht ausgeführt (Vorgabe), laufen laut Aufrufer noch. Dass beide Zustände ihre Datensätze bekommen, habe ich nur durch Lesen bestätigt.
- Die übrigen Dateien von main im Merge (u. a. privacy/terms, Login, Vertragsdetail, `statement-period-overlap`) habe ich nicht im Detail gelesen. Es sind Änderungen von main ohne Konflikt und ohne Berührung mit dem Heizhinweis.
