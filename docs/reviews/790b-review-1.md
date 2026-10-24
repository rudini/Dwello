# Review 790b, Runde 1 (`git diff 56635d3 aa699c6`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | .github/workflows/security-alerts.yml:22-27 | Ohne `shell: bash` läuft der Schritt mit `bash -e {0}` ohne `pipefail`: scheitert `gh api …/code-scanning/alerts` (403, 404, Ratenlimit), endet die Pipeline mit dem Status der leeren `while`-Schleife (0), und der Lauf ist grün, ohne dass ein Issue entsteht. |
| C-2 | Major | Commit aa699c6 (Betreff) | «docs(privacy): write down how security alerts are handled» hat 57 Zeichen; `commit-msg-gate.mjs --check` lehnt ihn ab (Exit 2), damit wird der CI-Schritt «Commit subjects» im Pull Request rot. |

## C-1: Fehlschlag beim Lesen der Alerts bleibt unbemerkt

Wenn `shell` nicht angegeben ist, startet GitHub Actions den Schritt mit `bash -e {0}`. Mit `shell: bash` wäre es `bash --noprofile --norc -eo pipefail {0}`. In
`gh api --paginate "repos/$GH_REPO/code-scanning/alerts?…" --jq '.[] | @base64' | while read -r row; do …; done`
bestimmt ohne `pipefail` nur die Schleife den Exit-Status. Schlägt `gh api` fehl, liest die Schleife nichts und endet mit 0. Der Schritt bleibt grün, und kein Issue wird angelegt. Genau das soll die Anforderung verhindern («Claude sessions can't read alerts, only issues»): Fällt der Kanal still aus, bemerkt niemand mehr neue Alerts. Beispiele sind ein fehlendes Recht, ein Default-Setup ohne Analyse (404 «no analysis found») oder ein Ratenlimit.
Nachweis: `bash -e -c 'false | while read -r r; do :; done; echo weiter'` gibt «weiter» aus und endet mit 0. Mit `-eo pipefail` endet der Aufruf mit 1. Die Abhilfe ist `shell: bash` am Schritt (oder `set -o pipefail`). Die Zuweisung `known=$(gh api …)` bricht dagegen schon heute korrekt ab.

## C-2: Commit-Betreff zu lang

`node .claude/hooks/commit-msg-gate.mjs --check "docs(privacy): write down how security alerts are handled"` meldet «57 characters, at most 50» und endet mit 2. ci.yml:118-126 prüft jeden Betreff zwischen Basis und HEAD, deshalb schlägt der Pull Request fehl. Abhilfe: den Betreff von aa699c6 auf höchstens 50 Zeichen kürzen.

Geprüft: Alle Jobs ohne eigenen `permissions`-Block (build, unit-tests, e2e-tests mit `actions/cache` und `upload-artifact`, fallow, dependency-review ohne PR-Kommentar, deepcheck nur mit Workflow-Annotationen, deepcheck-scan) brauchen nur `contents: read`. Die Jobs mit `gh`- oder Issue-Zugriffen haben eigene Blöcke. Weiter geprüft wurden: die YAML-Einrückung (10 Leerzeichen) gegenüber dem Heredoc-Ende `BODY` in Spalte 0, `@base64`/`jq -r`, die Dedupe über `(CodeQL #<n>)` (die schliessende Klammer verhindert, dass #1 auf #12 trifft) mit Paginierung über `state=all`, keine `${{ }}` im Skript und keine Alert-Texte, die als Shell-Code ausgewertet werden (eine Command-Substitution im Heredoc wird nicht erneut geparst). Der Issue-Body folgt den Abschnitten von `nfr.md`, und das Label `nfr:security` existiert. Die Fristen stimmen mit #790 und SECURITY.md überein.

## Nicht bestätigt

- SECURITY.md: «a pull request with a new CodeQL alert of severity high or critical cannot be merged, nor one that adds a dependency …». Dafür müssten der CodeQL-Check und «Dependency review» Pflicht-Checks sein. `rulesets` liefert `[]`, Branch-Protection und `code-scanning/default-setup` liefern 403. Unklar ist deshalb auch, ob das Default-Setup läuft und ob Dependabot-Sicherheitsupdates eingeschaltet sind; beides sind Repo-Einstellungen ausserhalb des Diffs.
- SECURITY.md: «nightly Claude routine that works the nfr:security issues»: Im Repo ist keine solche Routine zu sehen.
- Der Lauf gegen die echte API (Rechte von `security-events: read`, Feldnamen `rule.security_severity_level`, `most_recent_instance.*`): nur durch Lesen und den vom Aufrufer gemeldeten Trockenlauf mit `gh`-Stub.
- Vom Aufrufer gemeldet, nicht wiederholt: lokales CodeQL 2.27.3 (0 statt 7 Alerts), `prettier --check` auf den drei Dateien, Trockenlauf des Skripts, `bunx vitest run tools/deepcheck/test/workflows.test.ts src/__tests__/open-work.test.ts` (7 bestanden).
