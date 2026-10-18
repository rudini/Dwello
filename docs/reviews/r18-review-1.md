# Code-Review r18, Runde 1: R-1 bis R-8 aus `opus55-guide-review-2.md`

Geprüft: `git diff 0344415 6198743` (ein Commit), Worktree `review-r18`. Gelesen: alle fünf geänderten Dateien vollständig in neuer Fassung, dazu die alten Fassungen per `git diff --word-diff`, `docs/reviews/opus55-guide-review-2.md`, `docs/design/i18n-begriffe.md`, `backend/CLAUDE.md:18`, `tools/open-work/check-issues.mjs`, `src/__tests__/open-work.test.ts`, `tools/deepcheck/test/readme.test.ts`, `src/__tests__/design-guard.test.ts` (Lesezugriffe), alle «ask»-Stellen in `.claude/skills`, `.claude/agents`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `CLAUDE.md:71` (Workflow 7), `.claude/skills/workflow-review/SKILL.md:16` | Für einen Plan-Punkt «Workflow note: …» steht nirgends, wann er abgehakt wird. Der Skill sagt nur «Start from the plan items», nicht «tick». In einem Task nur mit Docs oder Regeln (wie diesem) wird `workflow-review` nicht geladen, also nimmt den Punkt niemand auf. Er bleibt offen, und eine Session mit offenem Punkt ist nach Workflow 8 nicht «finished (every item ticked)». Das Archivieren am Task-Ende (W8, letzter Satz) verlangt zwar keine Haken, aber der Zustand bleibt unklar. Vorschlag: «tick it when the note file takes it up; in a task without `workflow-review` it stays as a ticked line in the plan». |
| C-2 | Minor | `CLAUDE.md:76` gegen `.claude/skills/bdd-acceptance/SKILL.md:321` | R-5 entfernt «or a loaded skill says to ask». `bdd-acceptance:321` sagt aber «Ask the user which page to prioritize next». Das steht in keinem Punkt von «Ask only:». R-5 nahm an, die Liste decke jede Frage-Stelle eines Skills ab, und hat diese Stelle übersehen. Jetzt widersprechen sich der Skill und «Ask only». |
| C-3 | Minor | `CLAUDE.md:89` | «check markers, labels» ersetzt die bisherige Aufzählung. Dabei ist die Regel verloren gegangen, dass ein Pull Request kein Issue schliessen darf, das ein Marker noch nennt. `tools/open-work/check-issues.mjs:1-4` beruft sich für genau diese Regel auf «CLAUDE.md, "Open work"». Der Verweis führt jetzt an eine Stelle, die die Regel nicht mehr enthält. CI fängt den Fall ab, aber erst nach dem Push, und das kostet eine der drei CI-Runden. |
| C-4 | Nit | `.claude/skills/workflow-review/SKILL.md:3` gegen `:8`, `:14`, `CLAUDE.md:71` | «hooks and scripts included» steht nur in der Beschreibung. Der Körper zählt Hooks in `:8` zu den «rules» und schliesst in `:14` Tasks «only docs or rules» aus. Damit sagen Beschreibung und Text bei einer reinen Hook-Änderung weiter Verschiedenes, und R-7 ist nur halb erfüllt. |
| C-5 | Nit | `.claude/skills/pull-request/SKILL.md:24` | Der Verweis «`Refs #n`, `CLAUDE.md` "Open work"» führt auf einen weiteren Verweis: `CLAUDE.md:91` nennt `backend/CLAUDE.md` für den KI-Fall und für Split-Issues wieder diesen Skill (`:13`). Direkt «`backend/CLAUDE.md`; split issues: above» wäre ein Sprung. |
| C-6 | Nit | `CLAUDE.md:84` | In der Liste der Tests «for rule files» steht `design-guard`. Dieser Test liest nur `src/` (`design-guard.test.ts:56`) und keine Regeldatei. Er schadet nicht, aber die Liste soll ja zeigen, welche Tests Regeldateien lesen. |

Keine Blocker, keine Major.

## Zu den Hauptfragen

- **Verlorene oder verschobene Regeln:** Die Rundenregel steht jetzt einmal in W7. Die zwei Ausnahme-Arten stehen vollständig in «Done means», jetzt mit der Langdefinition aus dem alten `slice-review`. Die Minor/Nit-Triage steht in «Done means». Der Glossar-Fall, Split-Issues und «closes both» stehen in `pull-request:13-15`. Dass Minor/Nit-Fixes auf die Closing Round warten, ergibt sich aus W7 («only a fix that answers a Blocker/Major gets a re-review») zusammen mit `pull-request:20`. Gekürzt wurden auch die i18n-Stilangaben (Sie/vous/Lei, Guillemets, Verben). Sie stehen in `i18n-begriffe.md:5`, das als Quelle verlinkt ist. Weggefallen ist nur der Rat «use a getter or function». Die Regel «never called at module level» bleibt, das ist kein Befund. Verloren ist allein C-3.
- **Verweise:** W6 → `slice-review` «Triage», W7 → `pull-request`, `slice-review:41` → W7 und «Done means», `workflow-review:16` → W7, Design-Regeln → `pull-request`. Jeder dieser Verweise führt an eine Stelle, die die Regel enthält. Ausnahmen: C-3 (Code-Kommentar) und C-5 (doppelter Sprung).
- **Closing Round keine 4. Runde:** In `CLAUDE.md` steht das nicht mehr, wohl aber in `pull-request:20` («its own slice for the round limit»). Dieser Skill wird vor jedem Push geladen, und erst dort läuft die Closing Round. Wer die Closing Round durchführt, sieht die Regel also. Kein Befund.
- **«Workflow note» und Archivieren:** siehe C-1.
- **Tests, die Regeln lesen:** `open-work` (Plan, Checklisten in `.md`), `commit-msg-gate` (Commits-Zeile), `readme` (`deepcheck:audit`, `deepcheck:scan … only when`) und `check-issues` passen zur neuen Fassung. Andere Tests, die Regeldateien lesen, habe ich per grep nicht gefunden.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check` und `design-guard.test.ts`: vom Aufrufer gemeldet.
- Selbst wiederholt mit 40 von 40 grün: `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts`.
- Wortzahl `CLAUDE.md` 3'229 → 3'146 nachgezählt. Die Summe der Regeldateien (6'095 → 6'005) habe ich nicht nachgezählt.
- Ob `bdd-acceptance` (C-2) überhaupt noch in einem Ablauf geladen wird, habe ich nicht geprüft. Gesucht habe ich nur nach «ask» in Skills und Agents.
