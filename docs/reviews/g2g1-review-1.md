# Code-Review G2/G1, Runde 1 (`ddd2fe20..fbfc7d24`)

Gelesen: alle vier geänderten Dateien (`CLAUDE.md`, `.claude/skills/pull-request/SKILL.md`, `.github/ISSUE_TEMPLATE/decision.md`, `implementation_plan.md`), dazu G1, G2, G8 und G14 in `docs/reviews/workflow-rules-review-2026-10-17.md`, `.claude/skills/workflow-review/SKILL.md` ("Collected review"), `.claude/skills/issue-triage/SKILL.md`, `backend/CLAUDE.md` (KI-Fall), `tools/open-work/check-issues.mjs`.

Ergebnis: Die Regeländerung deckt beide Anforderungen ab. Ich habe keinen Blocker und keinen Major gefunden.

- G2: In `pull-request` "Which pull requests" steht jetzt: verwandte Issues (gleiche Dateien, Texte, Zeilen oder Bildschirme, oder vom Auftrag zusammen genannt) kommen in einen Pull Request, mit einem `Fixes #n` pro Issue. Ein Issue, das sich als nicht bereit erweist, bekommt `Refs #n`, eine Frage im Issue und einen Eintrag unter "Blocked on me". Unverwandte Issues bekommen weiterhin je einen Pull Request. `CLAUDE.md` "Open work" verweist für "split or related issues" auf den Skill.
- G1: `CLAUDE.md` "Open work" und `decision.md` "Done means" sagen jetzt: Ein Auftrag zur Umsetzung macht die Entscheidung zur Anforderung, und der Pull Request der Umsetzung schliesst das Issue mit `Fixes #n`. Ein Umsetzungs-Issue bleibt nur noch als Alternative stehen.
- Kein Widerspruch zu anderen Regeln:
  - `check-issues.mjs` findet mehrere `Fixes #n` einzeln (Regex mit `matchAll`, Zeile 30) und prüft Marker für jedes davon.
  - `CLAUDE.md` Workflow 8 ("a request that covers several issues is one session") und "Done means" ("with several pull requests, before the last one") passen weiterhin.
  - `workflow-review` "Collected review" ("in the session of the last one") passt auch, wenn alle Issues in einem Pull Request stecken.
  - Der KI-Fall in `backend/CLAUDE.md` mit `Refs` bleibt unberührt.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | `CLAUDE.md:93`, `.github/ISSUE_TEMPLATE/decision.md:4` | Ein Issue aus der Vorlage "Decision" trägt `entscheiden`, und `CLAUDE.md:93` sagt, ein `entscheiden`-Issue ist nicht bereit. Entfernt wird das Label nur, wenn ein Abschnitt "Proposed (confirm before starting)" bestätigt wird; die Vorlage "Decision" hat keinen solchen Abschnitt, sondern "Options". Wird eine aufgezeichnete Entscheidung direkt umgesetzt, sagt keine Regel, dass das Label dann wegfällt. Genau an dieser Lücke haben laut G1 alle Worker nachgefragt. Vorschlag: ein Halbsatz «recording the decision removes `entscheiden`». |
| C-2 | Nit | `.claude/skills/pull-request/SKILL.md:12` | `check-issues.mjs:37` setzt die Szenario-Prüfung für den ganzen Pull Request aus, sobald irgendwo `No scenario:` steht. Ein Pull Request mit mehreren `Fixes` kann so ein Issue ohne Szenario verdecken. G2 schlug vor, «name each issue's scenario»; der Satz fehlt. |
| C-3 | Nit | `.github/ISSUE_TEMPLATE/decision.md:19` | «markers point to that issue or are removed»: Bei direkter Umsetzung gibt es kein «that issue». Die Marker müssen dann entfernt werden, sonst lehnt `check-issues.mjs:31` das `Fixes #n` ab. Das folgt aus dem Text, steht aber nur indirekt da. |
| C-4 | Nit | `.claude/skills/pull-request/SKILL.md:24` | "Open and drive" spricht weiter von «with `Fixes #n`» in der Einzahl. Nach Zeile 12 ist das zwar nicht falsch, aber «one `Fixes #n` per closed issue» wäre eindeutig. |

## Nicht bestätigt

- Die Tests `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/e2e-screenplay-lint.test.ts tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/open-work/check-issues.test.ts` (94 Tests) sind vom Aufrufer gemeldet. Mein erneuter Lauf im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab: Dort sind keine Abhängigkeiten installiert, und ich habe nichts installiert.
- Rote Tests und Szenarien: entfallen, weil sich am Verhalten der App nichts ändert (nur Regeltext).
- Den Halbsatz «decide before the first scenario» aus G2 und die Anpassung von "Done means" durch den Product Owner aus G1 fordert die Anforderung nicht; ich führe sie deshalb nicht als Befund.
