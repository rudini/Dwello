# Code-Review: E2E- und axe-Shards in CI (Runde 1)

Geprüft: `git diff b4c103c b68dac7` im Worktree `/tmp/claude-0/-home-user-Dwello/b7483af0-073c-5ce0-a2e3-cce576883509/scratchpad/review-shards-code` (Commit b68dac7). Gelesen: `.github/workflows/ci.yml` (ganz), `docs/test-pyramid.md` (Diff), `implementation_plan.md`, `playwright.config.ts`, `package.json` (`test:e2e`), `tools/e2e/build-if-changed.mjs`, `git log b4c103c..b68dac7`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | .github/workflows/ci.yml:203-219 | Das Gate meldet «E2E tests» und «Accessibility (axe)» grün, wenn kein einziger Shard lief, weil `changes` fehlschlug (oder der Matrix-Job aus einem anderen Grund nicht expandiert wurde): Es prüft nur «kein Shard mit Misserfolg», nicht «die Shards liefen bzw. wurden absichtlich übersprungen». |
| C-2 | Minor | .github/workflows/ci.yml:150-170 | Ohne UI-Änderung starten jetzt drei statt eines axe-Runners, jeder mit dem Postgres-Service-Container (Services starten unabhängig von `SKIP`); dazu zwei Gate-Jobs. Bei Abrechnung pro angefangene Minute im privaten Repo rund 4 zusätzliche Minuten pro PR ohne UI-Änderung, ohne Zeitgewinn. Ebenso wiederholt jeder Shard Install, `playwright install --with-deps` und `bun run build` (CI baut immer, `tools/e2e/build-if-changed.mjs:37`); auf `main` installiert jeder E2E-Shard alle Browser. Vom Auftrag (Wall-Clock vor Minuten) gedeckt, aber im PR erwähnen. |
| C-3 | Nit | .github/workflows/ci.yml:219 | `::error::Failed: $failed` mit mehreren Zeilen: Ein Workflow-Command endet am Zeilenumbruch, nur der erste Shard steht in der Annotation, die übrigen nur im Log. `${failed//$'\n'/, }` wie in Zeile 88. |
| C-4 | Nit | implementation_plan.md:14 | «Checks: lint, check» ist nicht abgehakt, obwohl laut Aufrufer beide auf b68dac7 gelaufen sind. |

## C-1 (Major): Gate besteht ohne gelaufene Shards

**Warum falsch:** `e2e-results` hängt nur von `e2e-tests` ab und läuft mit `if: ${{ !cancelled() }}` (Zeile 205-206) auch, wenn `e2e-tests` übersprungen wurde. Schlägt der Job `changes` fehl (Zeile 17-40, z. B. ein `git diff` gegen eine fehlende Basis), wird `e2e-tests` wegen `needs: changes` übersprungen, ohne die Matrix zu expandieren: Es gibt keinen Job, dessen Name mit `E2E tests (` oder `Accessibility (axe) (` beginnt. Der jq-Filter (Zeile 217-218) liefert dann nichts, `failed` ist leer, beide Gate-Jobs enden mit Erfolg. Vorher existierte in diesem Fall gar kein Check «E2E tests»/«Accessibility (axe)», ein Pflicht-Check blieb also offen und blockierte. Damit wird genau der Zweck des Gates (die Pflicht-Checks weiter aussagekräftig halten) umgangen: ein PR ist nach den Branch-Regeln mergebar, obwohl kein E2E- und kein axe-Test lief. Dasselbe gilt für jede künftige Umbenennung von `name` in Zeile 136 oder der Matrix-Namen, die den Präfix nicht mehr trifft: das Gate wird still dauerhaft grün.

**Wie zeigen:** Lokal mit dem Filter aus Zeile 218 auf eine Jobliste ohne expandierte Shards:
`{"jobs":[{"name":"Changes","conclusion":"failure"},{"name":"${{ matrix.name }} (${{ matrix.shard }}/${{ matrix.shards }})","conclusion":"skipped"}]}` ergibt für beide Suites eine leere Ausgabe, also `exit 0` (im Scratchpad nachgestellt). Auf GitHub: im PR-Branch `exit 1` in den Schritt `diff` des Jobs `changes` setzen; «E2E tests» und «Accessibility (axe)» erscheinen grün.

**Vorschlag:** `needs: [changes, e2e-tests]` und zuerst `needs.changes.result == 'success'` verlangen (sonst `exit 1`); bei `needs.changes.outputs.app == 'true'` zusätzlich prüfen, dass die erwartete Zahl Shards (2 bzw. 3) mit `success` gefunden wurde, statt nur das Fehlen von Fehlschlägen.

## Bestätigt

- Matrix: 2 E2E-Shards, 3 axe-Shards, `fail-fast: false`, `--shard=i/n` an `playwright test` (über `bun run test:e2e --`, `package.json:12`); Workers bleiben `process.env.CI ? 2 : 4` (`playwright.config.ts:58`, unverändert). Keine Testauswahl.
- SKIP-Verhalten aus PR #265 bleibt: `env.SKIP` hängt nur an `matrix.reports` und `needs.changes.outputs.ui` (Zeile 152), gilt für alle drei axe-Shards gleich; die Shards enden dann mit Erfolg und das Gate wertet `success` als bestanden.
- Gate bei `app=false`: `e2e-tests` übersprungen, Gate läuft (`!cancelled()`) und besteht; dass hier ein grüner statt gar kein Check erscheint, entspricht «übersprungen» und ist im Sinne des Auftrags. Bei Abbruch des ganzen Laufs (Concurrency) wird das Gate übersprungen. Ein durch `timeout-minutes` abgebrochener Shard (`cancelled`) lässt das Gate fehlschlagen (Filter nachgestellt).
- Das Gate zählt seine eigenen Jobs nicht mit: Deren Namen («E2E tests», «Accessibility (axe)») beginnen nicht mit `<Name> (`.
- Rechte: Job-`permissions: actions: read` reicht für `GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs`; andere Rechte braucht der Job nicht (kein Checkout).
- Artefaktnamen eindeutig: `e2e-reports-1/2`, `a11y-reports-1/2/3` (Zeile 195); `upload-artifact@v4` verlangt eindeutige Namen pro Lauf, erfüllt.
- Web-Server je Shard gleich: `usesExtraInstances` (`playwright.config.ts:21-23`) hängt an den von `bddgen` erzeugten Dateien, und `bddgen` erzeugt unabhängig von `--shard`/`--grep` alle Features ohne `@wip`; jeder Shard startet also dieselben Server und hat seinen eigenen Postgres-Service mit frischer `dwello_e2e` (`e2e-db`). Reihenfolgeabhängigkeit zwischen Tests war wegen `fullyParallel: true` schon vorher ausgeschlossen.
- `docs/test-pyramid.md` Zeilen 105-106 beschreiben Shards und Sammel-Check korrekt; keine weiteren Verweise auf die alten Artefaktnamen im Repo (grep).
- Commit-Nachricht: Conventional Commit, `No scenario: CI only`; keine neuen Tests, also keine `Red:`-Zeilen nötig. Kein UI-Text, keine `messages/*.json`, kein E2E-Code im Diff. Nichts Fachfremdes im Diff.

## Nicht bestätigt

- `bun run lint` sauber, `bun run check` 0/0, actionlint 1.7.7 sauber, `playwright test --list --shard` (axe 53/52/52, E2E 306/306): vom Aufrufer gemeldet, nicht wiederholt (kein App-Code geändert).
- Verhalten von `/actions/runs/{id}/jobs` (Standard `filter=latest`) bei «Re-run failed jobs»: dass die im ersten Versuch erfolgreichen Shards im neuen Versuch mit ihrem Ergebnis in der Liste stehen und der fehlgeschlagene nur mit dem neuesten Ergebnis. Laut GitHub-Doku liefert `latest` die jüngste Ausführung jedes Jobs; geprüft werden kann es nur auf GitHub.
- Wie GitHub einen auf Job-Ebene übersprungenen Matrix-Job benennt (unexpandierter Ausdruck oder Job-ID): für C-1 unerheblich, beide treffen den Präfix nicht.
- Ob die Branch-Regeln «E2E tests»/«Accessibility (axe)» tatsächlich verlangen (laut früherem Review `docs/reviews/axe-ui-only-review-1.md:32` per API nicht lesbar).
- Tatsächliche Wall-Clock- und Minutenbilanz: erst ein CI-Lauf des PR zeigt sie.
