# Code-Review A-6 (#115), Runde 3: Merge-Commit b9b1744 (origin/main in den Branch)

Worktree: `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/review-a6-code3` (detached, b9b1744).
Gegenstand: `git show --cc b9b1744` (alle Konfliktdateien) sowie die automatisch zusammengeführten Dateien, die beide Seiten geändert haben (`src/routes/contracts/[id]/+page.server.ts`, `+page.svelte`, `src/routes/dashboard/+page.server.ts`, `src/lib/contract-status.ts`, `src/__tests__/contract-detail-page.dom.test.ts`, `contract-actions.test.ts`, `dashboard.test.ts`, `buildings-i18n.test.ts`, `messages/*.json`, `tests/e2e/targets/*`, `tests/e2e/tasks/dashboard.ts`, `docs/anforderungen-vertragsende.md`). Ausserdem gelesen: `git diff b9b1744^1 b9b1744 --stat` (was main mitbringt) und `git diff b9b1744^2 b9b1744 --stat` (was der Branch gegenüber main bringt).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | `docs/archive/implementation-plan-verlauf.md` (Session W7c, letzte Zeilen) | Die archivierte Session nennt den zweiten Merge von `main`, die Umbenennung des Seed-Mieters zu «Gina» und diese Review-Runde nicht; «Closing code review … `a6-review-2.md` (after the merge of `main`)» bezieht sich auf den ersten Merge. |
| C-2 | Nit | `tests/a11y/screens.json:295-301` | Der Bildschirm `contract-detail-ended` (main, Emil 2010–2014) zeigt nach dem Merge zusätzlich den A-6-Kasten «Befristeten Mietvertrag prüfen», weil Emils Vertragsende vereinbart, vorbei und ohne Nachmieter ist. Das ist nach dem Entscheid des Product Owners in #115 gewollt (`docs/anforderungen-vertragsende.md:53`: «Ohne Stichtag … auch nach alten»), und axe und Sprachprüfung laufen über die ganze Seite. Nur steht es nirgends: weder im Kommentar des Seeds (`tests/e2e/fixtures/screens.ts:85`) noch im Plan. |

Keine Blocker oder Majors.

ponytail-review: Die Konfliktlösung ist additiv. Es gibt keine doppelten Importe oder Steps, keine verwaisten Symbole und keine Änderungen ausserhalb der Konfliktstellen. Nichts gefunden.

## Geprüft und bestätigt

- **Konfliktlösung, alle zehn Dateien:** Beide Seiten bleiben vollständig erhalten. In `questions/`, `tasks/` und `steps/contract-detail` stehen die Importe und Steps von A-8 (main) und A-6 (Branch) nebeneinander, ohne doppelte Step-Ausdrücke. `dashboard.steps.ts` enthält main's «nennt die Belegung …»/«erklärt die Belegung …» und die A-6-Steps. In `contract-detail.feature` bleiben die drei A-8-Szenarien vor den fünf A-6-Szenarien. `accessibility.feature` und `sprachen-bildschirme.feature` haben je zwei Zeilen `contract-detail-ended` und drei Zeilen `contract-detail-expired`, passend zu `screens.json`. Die `stateMeanings` von `moved-out-dialog` und `continue-refused` sind vorhanden, `tasks/accessibility.ts:234-235` verdrahtet beide. Keine Konfliktmarker mehr in den geänderten Dateien.
- **Seed `tests/e2e/fixtures/screens.ts`:** Die Mieter Anna, Bruno, Carla, Dora, Emil, Fritz und Gina sind eindeutig. Gina mietet Talblick 3.01 (2024-01-01 bis 2025-06-30), mit Entwurf 2025. `expiredContract` → «Mietvertrag Gina», `endedContract` → «Mietvertrag Emil», `vacantApartment` → «2.02» (die Nummer gibt es nur einmal). Der Zustand `continue-refused` braucht Ginas Entwurf, der vorhanden ist. Emils Vertrag hat 2025 keine Miettage, die A-6-Daten verschieben also keine Abrechnungsperiode.
- **Gehen main's neue Tests davon aus, dass A-6 fehlt?**
  - `dashboard.feature` «Leere Wohnung in der Belegung» (Bruno 2019 bis 2024-03-31) erzeugt jetzt auch die Aufgabe A-6. Das Szenario prüft aber nur `occupancyText(...).toContain('Wohnung 1.02 leer seit 01.04.2024')` und den Hilfetext, keine Liste der Aufgaben: kein Widerspruch.
  - Die übrigen Negativprüfungen «nennt die Übersicht keine Aufgabe für den Mietvertrag von …» (Zeilen 167, 195, 202) haben einen Nachfolgevertrag oder «ausgezogen» und bleiben gültig.
  - Die A-8-Szenarien in `contract-detail.feature` (Bruno bis 2021 bzw. 2025, ohne Nachmieter) zeigen nun auch den A-6-Kasten. `deleteDialog` und `deleteDialogStatementLink` suchen `getByRole('dialog')`, und der Auszugsdialog von `FixedTermCheck` wird erst geöffnet gerendert (`Dialog.svelte:125`, `{#if open}`). Ein zweiter Treffer entsteht also nicht.
  - Die Bildschirme `dashboard` und `contract-detail-ended` zeigen mehr Inhalt (zwei Aufgaben A-6, der A-6-Kasten bei Emil). Das wird bei axe und in der Sprachprüfung gesehen, eine Zählung prüft dort niemand.
- **Automatisch zusammengeführter Code:** Im Loader der Detailseite stehen `billedBy` (main: mit `id`, `null` bei einem Ladefehler) und `fixedTermCheck` (Branch) nebeneinander. Der Dashboard-Loader enthält `vacant`/`reletStarts` (main) und `const today` mit `expired(allContracts, today)` (Branch). `expired` filtert unverändert auf vereinbartes Ende vor heute, `!terminated`, `!movedOut` und kein späterer Vertrag. In `contract-status.ts` stehen `historyPeriod` (main) und die A-6-Ergänzungen ohne Überschneidung.
- **Texte:** Alle vier `messages/*.json` haben 1547 Schlüssel und keine doppelten Schlüssel (mit `object_pairs_hook` geprüft). Main's Umbenennung «Wiedervermietet» → «Vermietet ab …» hat in `src`, `messages` und `tests/e2e` keine Reste ausser Testnamen und einem Feature-Kommentar, die den alten Begriff absichtlich nennen.
- **Nichts Fremdes:** Der Merge-Commit enthält ausser den Konfliktlösungen keine eigenen Änderungen. Der geänderte Kommentar in `tests/e2e/tasks/dashboard.ts:4` stammt von main.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run` (157 Dateien / 2745 Tests) auf b9b1744. Selbst nachlaufen konnte ich die betroffenen Vitest-Dateien (`dashboard-page`, `dashboard`, `overview`, `contract-actions`, `contract-detail-page.dom`, `buildings-i18n`) nicht: Der Zugriff auf `node_modules` (Verweis nach `/home/user/Dwello/node_modules`) ist durch eine Zugriffsregel gesperrt.
- E2E nach dem Merge (laut Aufrufer läuft es noch). Vor allem offen: ob die Bildschirme `contract-detail-ended` (jetzt mit dem A-6-Kasten) und `dashboard` (zwei Aufgaben A-6) bei axe hell und dunkel 0 Verstösse haben und in fr/it/en kein Deutsch zeigen, und ob die A-8-Szenarien neben dem A-6-Kasten grün bleiben.
- Backend-Typecheck und `bun test` (main hat `apartment.service.ts` und `tenant.service.ts` geändert, der Branch `contract.service.ts`): nicht gemeldet, nicht ausgeführt. Laut `git show --cc` hatten diese Dateien keine Konflikte.
