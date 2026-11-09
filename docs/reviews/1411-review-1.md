# Code-Review Slice 1411, Runde 1

Bereich: `git diff 3ee7579f c3a5c5e8 -- . ':!docs/reviews' ':!docs/archive'` (implementation_plan.md mitgeprüft), Worktree `review-1411-cr` auf c3a5c5e8.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | tools/open-work/check-issues.mjs:366-371 | `onlyImports` lässt jede Änderung an `import … from`-Zeilen ohne Freigabe durch, also auch geänderte Bindungen, neue und gestrichene Imports. Dazu kommt jede Datei ohne `+`/`-`-Zeile im Diff (Modus- oder Binäränderung). Erlaubt ist laut Vorschlag 10 aber nur ein Importpfad, der einer verschobenen Funktion folgt, «with no change to what the tool checks». |
| C-2 | Minor | tools/fitness/fitness.ts:608, 326-329 | Bei `--base --update` bleibt der Grenzwert einer umbenannten fetten Datei unter dem alten Pfad liegen. `changedFiles` (`-M`) liefert nur den neuen Pfad, also gilt der alte als «nicht geändert». Ohne `--base` wurde der Eintrag gestrichen; jetzt bleibt eine Grenze für einen Pfad stehen, den es nicht mehr gibt. Kein Test deckt das ab. |
| C-3 | Minor | tools/fitness/fitness.ts:608 | Ohne `--base` senkt `--update` weiter alle Grenzen. Das ist der Fall #1362, der `main` rot gemacht hat. Laut Entscheid senkt `fitness --update` nur die Grenzen der Dateien, die der Branch ändert; das hängt jetzt nur daran, dass man `--base` mitgibt (ADRs und Gewohnheit zeigen `fitness --update` ohne `--base`). |
| C-4 | Minor | CLAUDE.md, Design-Regeln «Process» (unverändert) | Punkt 20 ist nur in `screens.json` und den Features umgesetzt. Die Regel, aus der die Frage kam («once per variant with its own controls»), sagt weiter nicht, dass eine spätere Seite einer Liste keine eigene Variante ist. Das nächste Review kann deshalb wieder eine `paged-older`-Zeile verlangen. |

## C-1 (Major): Import-Ausnahme im Freigabe-Gate ist zu weit

`check-issues.mjs` setzt die Regel «eine Änderung an einer Gate-Datei braucht `Gate change approved: #n`» in CI durch. Das neue `onlyImports` prüft nur, ob jede `+`/`-`-Zeile im `-U0`-Diff dem Muster `^[-+]\s*import\b.*\bfrom\s+['"][^'"]+['"];?\s*$` entspricht. Es vergleicht keine Zeilenpaare. Darum gehen ohne Freigabe durch:

- eine andere Bindung, die das Verhalten des Tools ändert: Basis `import { strict as check } from './rules';`, Head `import { lenient as check } from './rules';` ergibt Code 0;
- ein zusätzlicher oder gestrichener Import, z. B. eines Moduls mit Code auf oberster Ebene;
- eine Datei in `tools/`, deren Diff keine `+`/`-`-Zeile hat (`chmod` eines Skripts, eine Binärdatei): `[].every(...)` ist `true`;
- mehrere Anweisungen in einer Zeile: `.*` ist gierig und deckt `import a from 'x'; doSomething(); import b from 'y'` als eine Zeile.

Damit sagt der Code mehr als der neue Satz in CLAUDE.md («a change only of import lines … that follows a function the change moved») und mehr als der Vorschlag 10, den der Product Owner übernommen hat («a pure import-path update … with no change to what the tool checks»).

So lässt sich das Scheitern zeigen: im neuen Test in `check-issues.test.ts` als Basis `"import { a as x } from '../src/m';\nrun(x);\n"` und als Head `"import { b as x } from '../src/m';\nrun(x);\n"`. Erwartet ist `changes a check`, geliefert wird Code 0. Für die Modusänderung: dieselbe Datei mit `chmod -x` committen; auch das ergibt Code 0.

Lösung: Entfernte und hinzugefügte Zeilen paarweise vergleichen. Beide Listen müssen gleich lang sein, und jedes Paar darf sich nur im Pfad nach `from` unterscheiden. Ein leerer `+`/`-`-Diff zählt als Änderung.

Zum Umfang: Die Freigabe in #1411 gilt für «the rule files, skills, templates and tools these points touch». Vorschlag 10 nennt als Ort nur CLAUDE.md, «When to ask». Ob die Ausnahme in `check-issues.mjs` (Zusatz (a)) von dieser Freigabe gedeckt ist, entscheidet der Product Owner. Sachlich ist sie nötig, damit CI dem neuen CLAUDE.md-Satz nicht widerspricht, aber nur in der engen Form oben.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run tools/fitness/fitness.test.ts tools/open-work/ src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/deepcheck/test/readme.test.ts tests/unit/a11y-screens.test.ts tests/unit/i18n-screens.test.ts`, `bunx vitest run --changed origin/main`, Prettier auf den geänderten Zeilen, die Commit-Hooks; die Rot-Läufe des `tighten`-Tests und des Import-Tests. Durch Lesen geprüft: Beide Tests schlagen auf der Basis fehl (`tighten` ignoriert dort das dritte Argument; ohne `onlyImports` meldet das Gate `tools/a.ts`). Die E2E-Läufe der audit-log-Zeilen für axe und Sprachen laufen laut Aufrufer noch.
- Pull-Request-Text: Die gestrichenen Examples-Zeilen `audit-log | paged-older` in `accessibility.feature` und `sprachen-bildschirme.feature` gehören zu Szenarien ohne `@wip` auf `main`. Sie brauchen neben `Gate change approved: #1411` auch `Spec change approved: #1411`. Der Entscheid 20 in #1411 deckt die Streichung inhaltlich, aber im Diff gibt es noch keinen PR-Text, den ich prüfen könnte.
- Punkt 1, «the coordinator's own brief template should say the same»: Im Repository gibt es keine solche Vorlage; `grep brief .claude/skills` findet nur den neuen Satz in `pull-request`.
- Punkt 13 (Zusatz (b)): Ob GitHub einen direkten Merge zulässt, wenn Auto-Merge bei grünen Pflicht-Checks `blocked` zeigt, ohne dass ein Admin-Bypass nötig ist, hängt am Ruleset (z. B. einer Code-Scanning-Regel). Das sieht man nicht im Repository. Die Wortwahl «every required check», «never with an admin bypass» und «a required check still pending keeps it waiting» ist in sich schlüssig.

Geprüft: Punkte 1–3, 5–10, 12–19, 21 und 22 stehen mit Wortlaut und Ort, wie das Review sie nennt (`git show 96d91d5d:docs/reviews/workflow-rules-review-2026-11-09.md`). Punkt 11 ändert `.claude/settings.json` nicht. Punkt 20: `paged-older` ist aus `screens.json`, beiden Features, dem Task und dem Target entfernt, ohne Reste (`pagination-prev` bleibt in der DOM-Test-Abdeckung von `Pagination.svelte`); #1413 ist offen mit `nfr:usability`. `seed.noLocalAccount()` und der Lock `local-accounts` existieren (`tests/e2e/fixtures/backend.ts:767-776`). Die Logik von `tightenFat` und `classify` für Module ist geprüft, ebenso, dass `--base` die Merge-Base ist (`fitness.ts:570`).
