# Code-Review G-10 (eine Quelle je E2E-Regel), Runde 1

Commit: 9822a51 (`git diff HEAD~1 HEAD` im Worktree `review-g10`). Geändert: `.claude/agents/code-reviewer.md`, `CLAUDE.md`, `docs/test-pyramid.md`, `implementation_plan.md`, `tests/e2e/CLAUDE.md`. Alle fünf Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `.claude/skills/bdd-acceptance/SKILL.md:21`, `:185` | Der Skill kopiert die Regel weiter: `:21` die Fehler-Antwort («all its calls», «error status at the browser boundary», «never with invented data») und verweist auf `docs/test-pyramid.md`, wo jetzt nur noch ein Verweis steht (Verweis auf einen Verweis); `:185` beschreibt die Isolation mit UUID-Namen zum zweiten Mal. Die Anforderung «one source per E2E rule» ist damit nicht ganz erfüllt, und der Plan-Punkt «is the one source» ist zu früh abgehakt. Heute widerspricht der Skill der Quelle nicht (deshalb kein Major), er kann aber auseinanderlaufen. Vorschlag: `:21` auf `tests/e2e/CLAUDE.md`, "Rules" kürzen (nur «No mocks: seed data through real backend endpoints» und den Verweis behalten). |
| C-2 | Nit | `CLAUDE.md:59`, `docs/test-pyramid.md:30`, `:80` | «"Failure states"» und «"Isolation"» stehen in der Form eines Abschnittsnamens (wie «"No scenario"» im selben Satz, das eine echte Überschrift ist), sind aber fett gesetzte Einträge unter `## Rules`. Man findet sie trotzdem, eindeutiger wäre aber «"Rules", Failure states». |
| C-3 | Nit | `tests/e2e/CLAUDE.md:73`, `docs/test-pyramid.md:78-80` | Farleys Einteilung geht verloren: «Isolation» in `tests/e2e/CLAUDE.md` nennt nicht mehr, welcher Teil *funktional* ist (`seed.names`) und welcher *zeitlich* (eigene Daten anlegen und wieder entfernen). `test-pyramid.md` fasst beide in einer Zeile zusammen. Der Inhalt fehlt nicht, nur die Zuordnung. |

Keine Blocker oder Majors.

## Vergleich der entfernten Passagen mit `tests/e2e/CLAUDE.md`, "Rules" (Stand 9822a51)

- «all its calls, e.g. one per apartment»: steht in `:75` («one endpoint with all its calls (a page that loads contracts per apartment sends several)»).
- «an error status only, e.g. 500»: steht in `:75` («with an error status … status 500 and no data»).
- «never with invented data»: steht in `:75`.
- «only requests the browser makes, so not in `@api`»: steht in `:75`.
- «no API mocks, except one»: steht in `:75` («the only API mock in a scenario»). `test-pyramid.md:30` nennt die Ausnahme weiterhin.
- Code-Reviewer, «`FailRequests` … only reaches a failure state»: steht in `:33` und `:75`.
- Positiver Anker mit Beispielen («empty-state notice, page title»): steht in `:74` («an empty-state hint or the page title»), dazu die Begründung mit der Fehlerseite.
- Isolation, funktional und zeitlich: beide Inhalte stehen in `:73` (Zuordnung zu Farleys Begriffen siehe C-3).
- `@api`, wofür und «UI only: interaction flows, navigation, forms»: steht in `:77`.
- «A new `@api` step needs both paths; the API path lives in `tasks/<area>-api.ts`»: steht in `:77` (auch `:37`).
- `@api`-Beispiele: bleiben in `test-pyramid.md:76`, `:77` verweist auf "Two protocol drivers" (`test-pyramid.md:72`, die Überschrift gibt es).
- CLAUDE.md Workflow 1 («answered with an error status at the browser boundary … so not `@api`»): durch den Verweis auf `:75` abgedeckt.

Kein Detail ist verloren gegangen.

## Weitere Prüfungen

- Verweisziele: `tests/e2e/CLAUDE.md` hat die Überschriften `## Rules` (`:71`) und `## No scenario` (`:61`), `docs/test-pyramid.md` hat `### Two protocol drivers` (`:72`). «Failure states» und «Isolation» gibt es als Einträge unter Rules (C-2).
- Code-Reviewer-Agent (`.claude/agents/code-reviewer.md:22`): Der Verweis steht unter derselben Bedingung wie vorher («when the diff touches `tests/e2e/`»). Er nennt Datei und Abschnitt, und der Agent liest Dateien. Damit kann er die Regeln weiter prüfen; Isolation kommt sogar neu hinzu.
- Andere Regeldateien: `backend/CLAUDE.md:34` ist eine eigene Backend-Regel, keine Kopie. `.claude/agents/persona.md:14` beschreibt, wie die Persona eine Anfrage fehlschlagen lässt (`page.route`). Das ist keine E2E-Regel. Die einzige verbleibende Kopie ist C-1.
- `implementation_plan.md`: Die neue Session entspricht der Anforderung; zum abgehakten Punkt siehe C-1.
- Kein Szenario nötig: Der Commit ändert nur Regeltexte, kein Verhalten der App.
- Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- `bun run lint` 0, `bun run check` 0: vom Aufrufer gemeldet.
- `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts tools/open-work/check-issues.test.ts src/__tests__/e2e-screenplay-lint.test.ts`: vom Aufrufer gemeldet.
- Selbst neu ausgeführt: `bunx vitest run tools/deepcheck/test/readme.test.ts src/__tests__/open-work.test.ts`, 12 von 12 grün.
- Nach Kopien gesucht habe ich nur in `CLAUDE.md`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `docs/design/personas/README.md`, `.claude/` und `.github/`. `docs/reviews/` und `docs/archive/` sind Verlauf und nicht durchsucht.
