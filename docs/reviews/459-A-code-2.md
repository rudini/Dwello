# Code-Review #459 Teil A, Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: `git diff 9b032ee..f5a62e2` (7073952: C-1/C-2 aus `docs/reviews/459-A-code-1.md`; f5a62e2: Helga P-1, Sven P-2), Worktree `review-459-A-2` (detached bei f5a62e2).

Keine Blocker, keine Majors.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | `src/routes/tenants/[id]/TenantDocumentsCard.svelte:102` | `describedby="tenant-former-documents-check-help"` ist die Behebung von Sven P-2, aber kein Test prüft sie. Der DOM-Test (`tenant-detail-page.dom.test.ts:362-365`) prüft nur den Text des Hilfesatzes. Er bliebe grün, wenn das `aria-describedby` am Knopf fehlt oder auf eine falsche id zeigt. Dieselbe Datei hat das Muster schon bei Z. 114 (`expect(button.getAttribute('aria-describedby')).toBe(byTestId('tenant-export-help')!.id)`). |

## Status der Befunde aus Runde 1

- C-1: behoben. `check` ruft nach `update()` zuerst `tick()` und dann `notice?.focus()` auf. Der neue DOM-Test «setzt den Fokus nach der Prüfung auf den Hinweis» würde ohne die Änderung fehlschlagen, weil der Fokus dann auf `body` bleibt.
- C-2: behoben. `docs/api-specification.md:100` nennt jetzt `documentsChecked: true`, `documentsCheckedOn` (Schweizer Tag) und dass ein geändertes `endDate` das Feld löscht. Das stimmt mit `contract.service.ts:446-447` überein.

## Nicht bestätigt

- `bun run lint`, `bun run check`, die i18n-Tests und `design-guard`: vom Aufrufer gemeldet. Den vollen `bunx vitest run` hat der Aufrufer auf 9b032ee laufen lassen, nicht auf f5a62e2. Selbst neu laufen lassen: `tenant-detail-page.dom.test.ts` (30 grün).
- axe und «kein Deutsch in fr/it/en» für den Hinweis mit Hilfesatz: Der Zustand steht nicht in `tests/a11y/screens.json`. Das «No scenario» von Teil A gilt (Begründung in Runde 1 geprüft), die E2E-Umgebung kann den Zustand nicht erzeugen.
- Wie Screenreader den Fokus auf den Hinweis vorlesen (Sven P-1, Minor): Das steht im Persona-Bericht und wurde hier nicht nachgeprüft.

Geprüft: Übersetzungen des Hilfesatzes. «vue d’ensemble», «panoramica» und «overview» folgen `i18n-begriffe.md:127`. «tâche» und «compito» sind die Begriffe, die `statements_decline_correction_text` und `dashboard_all_done_text` schon verwenden. Die Anrede ist förmlich («vous», im Italienischen «Lei» mit «segni» und «le serve»). Der Satz stimmt in der Sache: Die Aufgabe entfällt laut `dashboard.test.ts`. ponytail-review: Die bindbare Prop `element` in `Alert.svelte` (zwei Zeilen) ist verhältnismässig, und es gibt keinen bestehenden Helfer, den sie kopiert. Im Diff gibt es nichts Fremdes und keinen unbenutzten Code.
