# Review i834, Runde 1 (870405b7, `git diff origin/main 870405b7`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | docs/architecture/risks-and-tradeoffs.md:106 | Die Zeile RI-T1-5 (instabile Tests: #754, #778 behoben) hat mit der Shard-Zahl von #834 nichts zu tun: eine Änderung ausserhalb der Anforderung |

## C-1 (Major): Änderung ausserhalb der Anforderung

`docs/architecture/risks-and-tradeoffs.md:106` schreibt RI-T1-5 neu: «die Firefox-Suche in #754, axe nach dem Wiederherstellen eines Entwurfs in #778» statt «die übrigen offen als #778». Inhaltlich stimmt das (beide Issues sind laut REST-API geschlossen, #778 nennt «statement-generate draft-restored»). Es betrifft aber instabile Tests und nicht die Shard-Aufteilung, die #834 verlangt. Das «Where» von #834 nennt nur `ci.yml` und `test-pyramid.md`, die Commit-Nachricht erwähnt die Zeile nicht. Laut Prüfauftrag ist eine Änderung ausserhalb der Anforderung ein Major.
Nachweis: `git diff origin/main 870405b7 -- docs/architecture/risks-and-tradeoffs.md`, zweiter Hunk.
Behebung: die Zeile auf den Stand von `origin/main` zurücksetzen und die Korrektur getrennt einbringen (eigener Commit oder PR), oder im Pull Request ausdrücklich als mitkorrigierten veralteten Text nennen und begründen.

Geprüft:
- Die Outputs `shards` und `matrix` werden vor den beiden frühen `exit 0` geschrieben (ci.yml:55-60 vor 61-68). jq liefert einzeilig (`-c`) 8 bzw. 15 Einträge; selbst nachgerechnet. Das Quoting im Block-Scalar ist korrekt: `$e2e` steht in einfachen Anführungszeichen, im jq-Programm gibt es kein `${{ }}`.
- `include: ${{ fromJSON(...) }}` ohne weitere Matrix-Schlüssel ergibt ein Job pro Eintrag. Die Jobnamen lauten «E2E tests (n/12)», und `startswith("E2E tests (")` greift weiterhin. Die Artefaktnamen bleiben pro Shard eindeutig.
- Schlägt Changes fehl, wird e2e-tests übersprungen. e2e-results hat eine statische Matrix, `SHARDS` wird über `|| '{}'` leer, und der Schritt bricht vorher mit Fehler ab. Die Check-Namen «E2E tests» und «Accessibility (axe)» bleiben unverändert.
- Etwa 25 Jobs pro Lauf, also unter `per_page=100`.
- Die Docs in `test-pyramid.md` passen zum Code: 12 auf allen Ereignissen ausser `pull_request`.
- ponytail-review: nichts zu kürzen, keine ungenutzten Teile.

## Nicht bestätigt

- **Wandzeit ≤ 15 min auf `main` und Slowest-Shard ≈ 11 min:** Das lässt sich erst nach dem Merge im Job «CI duration» messen. Jeder Shard trägt eigene Fixkosten (Container, `bun install`, `build-if-changed` in `playwright.config.ts:142`), die mit 12 Shards nicht kleiner werden. Die Hochrechnung aus 92 min / 12 ist deshalb nur eine Schätzung.
- **Runner-Parallelität:** Bei einem Push auf `main` laufen nach Changes build, static-checks, unit-tests, fallow und fitness zusammen mit 12+3 Shards, also 20 Jobs gleichzeitig. Dazu kommt `release.yml` (push auf main), allenfalls `deploy-site.yml` und ein gleichzeitiger PR-Lauf. Das Limit des Kontos (Free 20, Pro 40 gleichzeitige Jobs) kenne ich nicht. Bei 20 warten einzelne Shards in der Queue und verlängern die Wandzeit. Geschaut in `.github/workflows/*.yml`, das Kontolimit nicht prüfbar.
- **actionlint / GitHub-Auswertung der Ausdrücke** (`fromJSON(...)[matrix.name]` mit Leerzeichen und Klammern im Schlüssel, `include` aus einem needs-Output): nur gelesen, nicht von GitHub ausgeführt.
- **Vom Aufrufer gemeldet:** `yaml.safe_load` von ci.yml, `bunx vitest run tools/deepcheck/test/workflows.test.ts`, `bun tools/fitness/fitness.ts` (alle pass). Nicht wiederholt. Der Test prüft nichts zu Shards oder Matrix.
