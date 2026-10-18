# Code-Review: CI, E2E-Shards auf main mit 60 Minuten (fe09f93c..8e2c8e4b)

Worktree: /tmp/claude-0/-home-user-Dwello/fb6bec91-79af-59a0-af59-fc55d530205d/scratchpad/review-ci2-code (HEAD 8e2c8e4b)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | .github/workflows/ci.yml:142 | Im Kommentar steht «a pull request (Chromium only)», aber Pull Requests laufen mit Chromium und dem API-Treiber (Z. 157 und 201 sagen das richtig). Vorschlag: «(Chromium and the API driver)». |
| C-2 | Nit | implementation_plan.md:5 | Vor `## Session` stehen zwei Leerzeilen statt einer. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Kontext für `jobs.<id>.timeout-minutes`:** Laut der GitHub-Tabelle «Context availability» darf `jobs.<job_id>.timeout-minutes` die Kontexte `github`, `needs`, `strategy`, `matrix`, `vars` und `inputs` verwenden. `github.event_name` ist also erlaubt. Dieselbe Datei nutzt `github.event_name` schon auf Job-Ebene, in `concurrency` (Z. 12) und `env` (Z. 158).
- **Typ des Ergebnisses:** In Ausdrücken liefern `&&` und `||` den Wert eines ihrer Operanden, nicht einen Boolean. `cond && 30 || 60` ergibt also die Zahl 30 oder 60. Das Muster «a && b || c» ist hier sicher, weil `30` truthy ist und deshalb nie fälschlich zu 60 durchfällt. Eine Zahl aus einem Ausdruck nimmt `timeout-minutes` an, wie das verbreitete `timeout-minutes: ${{ matrix.x }}` zeigt.
- **Ereignisse:** `on` kennt nur `push` (nur `main`) und `pull_request` (Z. 3–6), es gibt keinen `workflow_dispatch` und keinen `schedule`. Der 60er-Zweig trifft damit genau die Pushes auf main. Kommt später ein anderes Ereignis dazu, fällt es in den 60er-Zweig. Das passt, denn `BROWSERS` (Z. 158) und der Projektfilter (Z. 201) nutzen dieselbe Bedingung `github.event_name == 'pull_request'`: Jedes Ereignis ausser einem Pull Request läuft mit allen Browsern und bekommt 60 Minuten.
- **Pull Requests behalten 30:** Das ist so verlangt und erfüllt.
- **Ponytail-Review:** Keine Kürzung, die die Anforderung erfüllt. `timeout-minutes: 60` für alle wäre kürzer, nimmt Pull Requests aber den 30-Minuten-Schutz gegen hängende Läufe, und die Anforderung verlangt den Erhalt. Ein genauerer Ausdruck, der den axe-Shards (immer nur Chromium) auch auf main 30 lässt, wäre länger und brächte nichts, denn ein Zeitlimit ist nur eine Obergrenze. Mehr Shards auf main kosten Runner und ändern mehr. Die Änderung ist eine Zeile mit Kommentar und damit minimal.
- **Nichts Fremdes im Diff:** Er enthält nur die Zeitlimit-Zeile, ihren Kommentar und die Session im Plan. Der Plan hat den Eintrag «No scenario: CI configuration only». Das ist korrekt, weil sich das Verhalten der App nicht ändert.
- **Tests:** Es gibt keine Verhaltensänderung, die ein Unit- oder E2E-Test zeigen könnte. `tools/deepcheck/test/workflows.test.ts` liest `ci.yml`, prüft aber nur den Job `deepcheck` und keine Zeitlimits. Die Commit-Nachricht folgt Conventional Commits (`fix(ci): …`, 38 Zeichen).

## Nicht bestätigt

- Ob GitHub den Ausdruck bei einem echten Lauf annimmt, ist nicht live geprüft. Kein actionlint, kein Lauf auf dem Branch. Die Aussage stützt sich auf die GitHub-Dokumentation (Context availability, Operatoren). Der 60er-Zweig greift erst nach dem Merge auf main. Ein Pull-Request-Lauf dieses Branches zeigt nur, dass der Workflow parst und der 30er-Zweig wirkt.
- Ob 5 Shards auf main ohnehin unter 30 Minuten bleiben und die Änderung also nur eine Reserve ist, ist nicht gemessen (Lauf 39026875343 läuft noch). Ob 60 Minuten reichen, ist ebenso offen: Mit 2 Shards wurden die Läufe bei 30:20 abgebrochen, ihre volle Dauer ist unbekannt. Bei etwa 2/5 der Tests pro Shard ist 60 sehr wahrscheinlich genug.
- Die Angabe «about three times the tests» im Kommentar habe ich nicht nachgezählt.
- Vom Aufrufer gemeldet, nicht neu ausgeführt: YAML parst, `bun run lint`, `bunx vitest run src/__tests__/open-work.test.ts tools/deepcheck/test/workflows.test.ts`.
