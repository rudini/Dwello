# Review #1273 «Reviewer report per PR», Runde 1 (a852a25f..c5c63afe)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Blocker | .github/workflows/ci.yml:255 | `fitness.ts … \| tee build/review/fitness.txt` ohne `pipefail`: der Exit-Code von Fitness geht verloren, das Gate «Architecture fitness» wird auf PRs nie mehr rot |
| C-2 | Blocker | tools/fitness/fitness.ts:574 (mit tools/arch-baseline/measure.sh:18-19) | Ein relativer `REVIEW_DIR` (CI: `build/review`) ergibt ein relatives `out`; `measure.sh` leitet `fallow health` erst nach `cd "$wt"` nach `$out/…` um, die Datei landet im Worktree (oder es scheitert still), `structureIn` wirft ENOENT; zusammen mit C-1 fehlen in CI alle Struktur-Befunde und alle Fitness-Fehler, und der Lauf bleibt grün |
| C-3 | Major | tools/review-report/report.ts:77, 83 | Der Ablauf erkennt Backend-Aufrufe nur an einem wörtlichen `/api/v1/<segment>` und an Elysia-Routen mit `prefix: '/api/v1/<segment>'`; viele BFF-Dateien bauen die URL aus einer Konstante `…/api/v1` (`${API}/…`), dazu `api-proxy.ts` und 3 von 20 Backend-Routen mit `prefix: '/api/v1'`. Für diese Routen meldet der Bericht fälschlich «ohne geänderten Aufruf» |
| C-4 | Minor | tools/review-report/report.ts:78, 95 | Der Schritt «Browser → BFF: request» wird immer erzeugt, auch auf der Seite, auf der die Route fehlt: bei einer neuen Route ist er nicht grün, bei einer entfernten nicht rot; eine neue Route ohne Backend-Aufruf bekommt `changes: 0` und landet unter «Flows without a changed call» |
| C-5 | Minor | tools/review-report/report.ts:112-116 | `flowsFor` wählt nur geänderte BFF-Routendateien und Aufrufer geänderter Elysia-Routen. Eine Änderung in einem `src/lib/server/*`-Helfer, wo die meisten Backend-Aufrufe stehen (CLAUDE.md: «mapping and form handling live in src/lib/server»), zeigt keinen Ablauf, obwohl `calls` die Helfer selbst verfolgt |
| C-6 | Minor | tools/review-report/report.ts:239 | Schlüsselwörter `fixes\|closes\|resolves` statt `fix(?:es\|ed)?\|close[sd]?\|resolve[sd]?` wie in `check-issues.mjs:59`: bei «Fix #n» oder «Closed #n» fehlt das Issue-Label |
| C-7 | Minor | tools/review-report/report.ts:233, 32 | `cycles` werden anders als die Kanten (`prod`, Z. 232) und als `fitness.ts:467` (`isProdModule`) nicht gefiltert: ein neuer Zyklus unter Testmodulen erscheint als «New cycle» |
| C-8 | Minor | tools/review-report/report.ts:45-47 (lib.ts:155) | `tablesOf` kennt nur Feldnamen. Ein Feld, dessen Typ, Nullbarkeit oder Default sich ändert, erscheint nicht im Datenmodell (die Anforderung verlangt «changed … fields»); nur die Migrationsnotiz deutet es an |
| C-9 | Minor | tools/review-report/report.ts:207-263 | Die CLI-Logik ist ungetestet: das Parsen von `fitness.txt` (Regex Z. 253), das Lesen der Labels, die Auswahl der geänderten Module (Z. 236) und das Zusammensetzen der Bäume. Belegt ist sie nur durch einen Handlauf |
| C-10 | Minor | tools/review-report/report.ts:196 | `marked.parse` setzt den PR-Text («Decisions», «Risks», «Type») ungefiltert als `innerHTML` ins HTML-Artefakt, ein `<img onerror>` im PR-Text läuft beim Öffnen. Das betrifft nur PRs aus diesem Repository, sonst wäre der Rang höher |

## C-1 (Blocker): `tee` schluckt den Exit-Code des Fitness-Gates

Die Workflow-Datei setzt weder `defaults.run.shell` noch `shell:` (grep auf `shell|pipefail` in ci.yml findet nichts). GitHub startet `run:` dann mit `bash -e {0}`, ohne `-o pipefail`. In `fitness.ts … --format github | tee build/review/fitness.txt` bestimmt deshalb `tee` den Status der Pipeline. `fitness.ts:602` (`process.exit(errors.length ? 1 : 0)`) und jeder Absturz werden auf Pull Requests ignoriert. Der Schritt «Architecture fitness» mit `id: fitness` bleibt grün, und «Failed checks» nennt ihn nicht. Damit fällt ein Gate weg, das `CLAUDE.md` («Before marking anything complete», CI) voraussetzt.
Nachweis: `bash -e -c 'false | tee /dev/null'; echo $?` gibt 0. Oder in einem PR ein `ratchet.json`-Wert, der schlechter wird: der Schritt bleibt grün.
Lösung: `set -o pipefail` im Schritt oder `shell: bash`. Lässt `workflows.test.ts` das zu, ist ein Pin auf `pipefail` sinnvoll, damit der Fehler wieder rot wird.

## C-2 (Blocker): relativer `REVIEW_DIR` bricht die Strukturmessung

`fitness.ts:574` übergibt `join('build/review', 'base')` als `keep`, `structureAt` (Z. 524) verwendet diesen Pfad unverändert als `out`. `measure.sh` wechselt in Z. 4 ins Repo-Root, deshalb gehen `01-map` und `02-imports` (ARCH_OUT, relativ zum Root) noch auf. Z. 18-19 leiten die Ausgabe von `fallow health` aber innerhalb von `(cd "$wt" && … >"$out/fallow-health.json")` um. Die Umleitung gilt damit relativ zum frischen Worktree, in dem `build/review/base` nicht existiert. Bash meldet «No such file or directory», `|| true` schluckt es, und `structureIn` (Z. 537) wirft beim `readFileSync(join(out, 'fallow-health.json'))` ENOENT. Mit `mkdtemp` war `out` immer absolut, deshalb trat das bisher nicht auf. Ob der Handlauf des Aufrufers (`REVIEW_DIR=…`) einen absoluten Pfad nutzte, lässt sich nicht erkennen.
Folge in CI (wegen C-1 still): keine Struktur-Befunde von #1272, keine Fitness-Fehler und -Warnungen (sie werden erst nach dem Strukturblock ausgegeben), keine `structure.md`. Der Prüfbericht zeigt dann «_No errors or warnings._» und eine leere Kennzahlentabelle.
Nachweis: `REVIEW_DIR=build/review bun tools/fitness/fitness.ts --base HEAD~1 --structure; echo $?` bricht mit ENOENT für `build/review/base/fallow-health.json` ab.
Lösung: `resolve(review, 'base')` in fitness.ts, oder `out=$(cd "$2" && pwd)` in measure.sh.

## C-3 (Major): Ablaufdiagramm übersieht die meisten Backend-Aufrufe

`calls` (Z. 77) sucht `/\/api\/v1\/[a-z0-9-]+/` im Text der Route und ihrer Helfer. Belege aus dem Worktree:
- Eine Basis-Konstante `…/api/v1` mit anschliessendem `${API}/<pfad>` haben `src/lib/server/{ki-settings,documents,apartment,statement-generation,category}.ts`, `src/routes/config/+page.server.ts`, `src/routes/config/export/+server.ts`, `src/routes/tenants/[id]/+page.server.ts` und `src/routes/documents/+page.server.ts`. Die Regex findet darin kein Segment.
- `src/lib/server/api-proxy.ts:58` baut `/api/v1${path}`.
- `backend/src/routes/{ki-settings,documents,reports}.ts` haben `prefix: '/api/v1'`. `backendCalls` (Z. 83) verlangt `prefix: '${prefix}'` mit Segment und findet sie nie.
Für diese Routen hat das Diagramm nur «Browser → Route». Ein neuer oder entfernter Backend-Aufruf ergibt `changes: 0`, und der Kommentar führt die Route unter «Flows without a changed call». Das ist eine falsche Aussage in einer der drei verlangten Diagrammarten. Die Tests (report.test.ts:92) prüfen nur die wörtliche Form `/api/v1/buildings`.
Nachweis: Den Fixture in report.test.ts:92 ersetzen durch ``const API = `${B}/api/v1`; fetch(`${API}/buildings`)``, sonst gleich. `flowDiagram(...).nodes` ist dann `['Browser', page]`, `changes` ist 0.
Lösung: Die Pfade an den Aufrufen ermitteln, auch die aus einer Konstante. Für Routen mit `prefix: '/api/v1'` die Pfade ihrer Handler einbeziehen. Oder wenigstens «Flow not resolved» statt «without a changed call» melden.

## Nicht bestätigt

- Alle Prüfläufe auf c5c63afe meldet der Aufrufer: `bunx vitest run tools/review-report` (12), tools/ci, `tools/deepcheck/test/workflows.test.ts`, `tools/testcheck/test/wiring.test.ts`, tools/open-work, tools/fitness, tools/arch-baseline (230), eslint, `bun run check`, fallow-, deepcheck- und testcheck-Audit, sowie der Handlauf auf den letzten 6 Merges von main. Selbst ausgeführt habe ich keinen davon.
- Darstellung der Mermaid-Diagramme, nur gelesen. Flowchart (`-->|new|`, `-.->|removed|`, `linkStyle i`) und sequenceDiagram (`participant pN as <Pfad mit [id] und +>`, `rect rgb(…)`/`end`) sehen syntaktisch korrekt aus. Im erDiagram brauchen die Entity-Aliase `t0["name"]` Mermaid ≥ 10.5 (HTML lädt 10.9.1). Ob ein alleinstehendes `t3["buildings"]` ohne Block die Grammatik passiert und welche Mermaid-Version GitHub im Kommentar nutzt, konnte ich nicht prüfen.
- Ob die Sektionen «Type», «Decisions» und «Risks» des Templates aus #1271 (nicht gemergt) Platzhalter-Kommentare enthalten. Bleibt nur `<!-- … -->` stehen, zeigt der Kommentar einen leeren Wert statt «Not given».
- Ob «Reviewer report» ein Required Check ist (Branch Protection nicht einsehbar). Bei Dependabot-PRs (gleiches Repository, Token nur lesend) schlägt `createComment` fehl. `ui-screenshots` (ci.yml:539) verhält sich gleich.
- Ob `imports-file.csv` `$lib/server/…` auf `src/lib/server/….ts` auflöst, worauf die Helfersuche in `calls` (Z. 76) baut. Nachgesehen in `02-imports.ts`, nicht ausgeführt.

Geprüft: ci.yml-Job (Bedingung nur gleiches Repository, Berechtigungen, `PR_BODY` per env ohne Injection, Marker des klebenden Kommentars), CSV-Spalten von `02-imports` und `01-map` passend zu report.ts, die sortierten Tarjan-Zyklen, `GATE_FILE` gegen check-issues.mjs, `AGAINST` gegen `crossesBoundary` (#857), `tablesOf`-Erweiterung, Doku-Zeile in fitness-functions.md, Grössengrenze und Testfälle je Diagrammart (neu, entfernt, unverändert, über 30 Knoten).
