# Code-Review W6d (#94): Mindest-Saldo CHF 5, Runde 2 (Abschlussrunde)

Gegenstand: `git diff 00ea019 4e7bad1`, Worktree `review-w6d-code2` (detached 4e7bad1): Merge 52ff3d2 (origin/main, PR #341) und Fix-Commit 4e7bad1. Alle Dateien des Fix-Commits gelesen; beim Merge die drei Konfliktdateien (`git show 52ff3d2 --cc`) und den Rest per Diffstat gegen 00ea019 geprüft (nur Inhalte von main).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Major | `src/routes/statements/[id]/edit/+page.svelte:71`, `tests/e2e/features/statement-minimum-balance.feature` | Sichtbare Änderung aus Persona Marco P-1 (Bearbeiten-Seite ohne Fristfeld unter CHF 5) hat kein Szenario und kein `No scenario: <reason>` |
| C-11 | Minor | `src/routes/statements/[id]/edit/+page.svelte:70`, `[id]/+page.svelte:187`, `messages/*.json` (`statements_deadline_notes`, `statements_edit_button`) | Unter CHF 5 heissen Link und Panel weiter «Frist und Bemerkungen (bearbeiten)», obwohl es keine Frist mehr gibt; die Persona schlug «Bemerkungen bearbeiten» und den Satz aus dem Zahlungsfeld vor. Der Link führt den Verwalter genau zu der Frage, die P-1 auslöste |
| C-12 | Minor | `src/routes/statements/+page.svelte:185` | C-3-Fix in der Liste (`claimed(paying.balance)`) ohne Test; nur die Detailseite hat den neuen DOM-Test (`statement-pages.dom.test.ts:1006`) |
| C-13 | Minor | `src/routes/statements/[id]/edit/+page.svelte:71`, `tests/a11y/screens.json` | Zustand «Bearbeiten unter CHF 5» (ohne Fristfeld) nicht in `screens.json`/`accessibility.feature`/`sprachen-bildschirme.feature`; wie C-6 nur ein Feld weniger, kein neuer Text, daher Minor |
| C-14 | Nit | `src/routes/statements/[id]/edit/+page.svelte:21-25` | ponytail shrink: `deadlineField` als `$derived`-Objekt nur für das Verschieben ins `{#if}`; die beiden Ternaries konnten inline bleiben (+5 Zeilen, ohne Verhaltensänderung) |
| C-15 | Nit | `backend/src/__tests__/statement-lock.pg.test.ts:133` | C-9 nur halb erledigt: Leerzeilen korrigiert, `today` weiter von Hand statt `swissToday()` aus `../services/today` |

## C-10 (Major): Kein Szenario für die Bearbeiten-Seite ohne Fristfeld

- **Warum falsch:** 4e7bad1 ändert, was der Verwalter sieht: unter CHF 5 zeigt `/statements/<id>/edit` kein Feld «Zahlungsfrist»/«Rückerstattung bis» mehr, und die Aktion speichert ohne das Feld nur die Bemerkungen (`edit/+page.server.ts:19-29`). CLAUDE.md Workflow 1 und die Pflichtprüfung: jede für den Benutzer sichtbare Verhaltensänderung hat ein Szenario ohne `@wip`, sonst `No scenario: <reason>`. Der Commit hat nur das Zurücksetzen-Szenario (C-2) ergänzt; Commit-Text und Plan nennen keinen Grund. Der E2E-Stack kann den Zustand herstellen: Grundlage und Rechnung «1197» aus `statement-minimum-balance.feature`, dazu Task und Targets aus `tests/e2e/tasks/statement-edit.ts` / `targets/statement-edit.ts` (`statement-edit.feature:16-20` zeigt den Ablauf mit Bemerkung).
- **Wie zeigen:** `{#if !belowMinimum(statement.balance)}` in `edit/+page.svelte:71` entfernen und in `+page.server.ts` wieder `String(form.get('paymentDeadline') ?? '')` mit `!paymentDeadline` prüfen: kein E2E-Szenario wird rot (nur die DOM- und Aktionstests). Fix: Szenario z. B. «Bei einer kleinen Rückerstattung hält der Liegenschaftsverwalter nur eine Bemerkung fest» (1197, Bearbeiten-Seite: keine Frist angefragt, Bemerkung festgehalten, Abrechnung enthält die Bemerkung).

## Bestätigt

- **Merge 52ff3d2:** `pdf-format.ts` behält `roundTo5Rappen` von main (#79) und hängt `belowMinimum` an; PRD und `nebenkostenabrechnung-anforderungen.md` behalten den #79-Satz und ergänzen die #94-Zeile bzw. «ab CHF 5.00 (#94)». Keine weiteren Hunks im kombinierten Diff ausser den Konfliktdateien; übrige Merge-Änderungen sind 1:1 die von main. Grenzfälle mit der neuen Rundung: Szenariogrundriss 1205.02/1195.02 ergibt 5.00/−5.00 in beiden Rundungen; die Regel vergleicht den gespeicherten (gerundeten) Saldo, so in allen Docs.
- **C-1:** DOM-Test `statement-pages.dom.test.ts:491-501` (4.95 bezahlt: keine `statement-payment-deadline`, kein «Bezahlt am»; Gegenbeispiel 5). Rot ohne `{#if !waived}`/`waived ? null :` (gelesen).
- **C-2:** Szenario `statement-minimum-balance.feature:58-67`, alle Schritte vorhanden (`statement-detail.steps.ts:328`, `documents.steps.ts:100,108`); ohne `@wip`; «bietet keine Mahnung an» ist ein echter Zustand (angezeigt/nicht). Rot mit `owes={balance > 0}` (gelesen; Aufrufer meldet es gesehen).
- **C-3:** Detailseite und Liste nutzen `claimed()`; DOM-Test für die Detailseite rot mit `balance > 0` (Dialog nennt sonst «Mahnung»).
- **C-8:** Variable umbenannt, Saldo 4.10 auf dem 5-Rappen-Raster.
- **Marco P-1:** Feld nur ab CHF 5 (`belowMinimum` aus `$lib/statement`, keine Kopie der Regel); Aktion: fehlendes Feld → nur Bemerkungen (`...(paymentDeadline !== null && { paymentDeadline })`), leeres Feld weiter abgelehnt (bestehender Test «meldet eine fehlende Frist»). Backend nimmt `paymentDeadline` schon optional an (`backend/src/routes/statements.ts:194`), keine neue Lücke. Tests: DOM `statement-pages.dom.test.ts:1188-1193` und Aktion `statement-edit-actions.test.ts:39-47`, beide rot ohne die Änderung (gelesen: vorher Feld vorhanden bzw. `fail(400)` statt 303).
- Keine neuen UI-Texte im Fix-Commit; Tokens/Komponenten unverändert; nichts Fremdes ausser C-14.

## Ponytail

- `edit/+page.svelte:21-25`: shrink: `deadlineField`-Objekt. Die bisherigen `label={refund ? … : …}`/`help={…}` innerhalb des `{#if}` lassen (C-14).
- net: -5 Zeilen möglich.

## Nicht bestätigt

- Neu ausgeführt: `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/statement-edit-actions.test.ts`: 107 bestanden.
- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bun run lint`, `bun run check`, Backend `type-check`, Backend-Tests `statement-pdf-render`, `statement-lock`, `reminders`, `statement-pdf-data`, E2E `statement-minimum-balance.feature` (11 Szenarien, chromium), volles vitest (2792) auf 52ff3d2. Volles vitest und Backend-Suite auf 4e7bad1 nicht gelaufen (laut Aufruf).
- Rot-Sehen von C-2 und P-1 nur aus dem Lesen der Tests und laut Aufrufer; nicht selbst durch Zurücknehmen geprüft (keine Dateiänderung erlaubt).
- Offene Punkte aus Runde 1 (C-4 → #291, C-5, C-6) nicht erneut bewertet; C-7 (abgelehnt) akzeptiert, die Begründung (CHF 5 an einer Stelle) trägt.
- Übersicht (`src/lib/overview.ts`) bei zurückgesetzter Kleinsaldo-Abrechnung weiter als «Überfällig»-Aufgabe: wie in Runde 1 nicht gewertet (#291).
