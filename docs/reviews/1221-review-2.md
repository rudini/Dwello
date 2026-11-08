# Code-Review #1221, Runde 2 (Abschluss vor dem Push): 8bb1c26..f6f3d3a und cebc6a5..4a1996c

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/held-invoices.ts:34, src/lib/server/statement-generation.ts:339-358 | Unverändert offen aus Runde 1: `distributionKeyName` kommt als `nameDE \|\| name` am `localCheck` vorbei. Scheitert ein vordefinierter Schlüssel, steht sein Name in fr/it/en deutsch da |
| C-2 | Minor | backend/src/services/statement.service.ts:481 | Unverändert offen aus Runde 1: `refuseUncalculableKeys` läuft vor `CONTRACT_NOT_IN_PERIOD` bzw. `STATEMENT_NO_RENTAL_DAYS_*`. Dazu gibt es keinen Test |
| C-4 | Major | src/routes/statements/generate/StatementWizard.svelte:193, src/routes/statements/[id]/FormDialog.svelte:62-66 | Die beiden Persona-Fixes (Helga P-1: Fokus auf die Meldung, die den Lauf anhält; Marco P-2: Fokus auf die Ablehnung nach «Neu berechnen») ändern Verhalten, das der Benutzer sieht. Sie haben aber kein Szenario und auch kein `No scenario: <reason>` (`implementation_plan.md` ist leer). Der Diff ändert nichts unter `tests/e2e` |

## C-4 (Major): Fokus-Fixes ohne Szenario

Warum falsch: `CLAUDE.md` verlangt in «Workflow» 1 und in «Always check» für jeden Bugfix, den ein Benutzer sieht, ein Szenario ohne `@wip`. Beide Commits sind `fix(statements)` und beheben je ein Major einer Persona: Die Meldung blieb ausserhalb des Bildes, der Fokus lag woanders. Die E2E-Umgebung kann beide Zustände herstellen, darum greift «No scenario» nicht. Die vorhandenen Szenarien erreichen sie schon:
- `tests/e2e/features/statement-generate.feature:313ff.` (#1221: die Vorschau ist angehalten, «Weiter» wird abgelehnt) und das Szenario zu #382 im selben Feature;
- `tests/e2e/features/statement-detail.feature:1072-1079` («Kein Neuberechnen, solange sich ein Verteilschlüssel … nicht berechnen lässt») und `:1064-1069` (#382).

Für den Fokus gibt es schon eine Formulierung im Repo, zum Beispiel «Dann steht der Fokus wieder auf «Neu berechnen»» (`statement-detail.feature`, kurz vor :1060) und «steht der Fokus …» in `contract-detail.feature:28`, `statement-send.feature:92`. Persona-Fokusbefunde bekamen bisher ein Szenario, zum Beispiel `categories.feature:313` und `:323`, `contract-new.feature:179`.

Der DOM-Test prüft in jsdom nur, dass `document.activeElement` das Element `form-error` ist. Was er nicht abdeckt, sieht nur der Browser:
- Der Fokus in `FormDialog` gewinnt gegen die Rückgabe an den Öffner in der Cleanup-Funktion des `$effect` von `Dialog.svelte:59-73`. Das hängt von der Reihenfolge `tick()` → Effekt-Flush ab.
- Die Meldung liegt dank `scroll-mt-24` nicht unter der fixierten Kopfzeile. Genau das war der Befund von Helga P-1 («oberer Rand bei −0.5 px»).

So zeigt man es: In den beiden #1221-Szenarien einen Schritt «Und steht der Fokus auf der Meldung …» ergänzen und gegen 8bb1c26 laufen lassen. Dort liegt der Fokus auf «Die Abrechnungen trotzdem erstellen» bzw. wieder auf «Neu berechnen». Neue Schritte in bestehenden Szenarien sind keine Spec-Änderung, die eine Freigabe braucht: Sie prüfen mehr, nicht weniger. Ein neues Szenario wäre ohnehin frei.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - auf 4a1996c: `bun run lint`, `bun run check`, `bun run fitness`, Backend-`type-check`, Backend-Tests `statement*`, `invoice*`, `api-contracts`, `distribution-key*`, `apartment*`, `cost-reconciliation*`, `calculation*` (841 bestanden);
  - auf f6f3d3a: vitest `statement-wizard.dom` (108) und `statement-pages.dom` (268);
  - E2E chromium: `statement-generate.feature` und `statement-agreed-costs.feature` (133, auf 2bf7dcb), `statement-detail.feature` (142, auf f6f3d3a);
  - Rotläufe der Fokusprüfungen;
  - auf cebc6a5: `vitest --changed origin/main` (1176);
  - E2E nach dem Merge: läuft laut Aufrufer noch.
- Ob die Fokusprüfungen ohne den Fix rot sind, habe ich nur durch Lesen beurteilt. Plausibel ist es für beide: ohne `tabindex="-1"` keine Fokussierbarkeit, und der Selektor in `showErrors` trifft sonst `confirm-missing-invoices`; ohne den `failure`-Zweig gibt `Dialog.svelte:71` den Fokus an den Öffner zurück. Gelaufen bin ich nichts.
- Ob ein Fehlschlag mit `sendError` statt `actionError` (`+page.server.ts:72-75`) den Fokus wie vorher lässt: Laut Code ist das so (`getElementById` ergibt null, also no-op). Ein Test dazu fehlt.
- Dass der Umbau nach dem Merge (`held-invoices.ts`, `apartmentsOf` in `apartment.service.ts`) Ä1 jetzt erfüllt, habe ich nicht selbst geprüft (Fitness vom Aufrufer gemeldet). Der Umbau ändert kein Verhalten: Funktionskörper unverändert verschoben, keine anderen Aufrufer und keine Test-Mocks von `getUncategorizedInvoices` aus `invoice.service` (grep über `backend`, `src`, `tests`).

Geprüft: Doku C-3 (Feld `uncalculableKeys` und Parameter `key`, `building`, `invoices` wie in `statement.service.ts:949-955`); Reihenfolge im Selektor `showErrors` in Dokumentreihenfolge (die beiden Meldungen in `PreviewChecks` stehen vor der Bestätigung; `BuildingStep`, `PreviewEmpty`: `form-error` ohne `tabindex` wird nicht erfasst); keine neuen Texte, Bildschirme oder `data-testid`; `scroll-mt-24` kommt schon in `Panel.svelte` vor; Ponytail (kein ungenutzter Code, keine Kopie: `apartmentsOf` existiert nur einmal, und der Kommentarkopf in `held-invoices.ts` stimmt).
