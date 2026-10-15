# Code-Review «App-Version und Release-Tags» (#173), Runde 1

Geprüft: Worktree `review-version-code`, Commit-Bereich `ba76d45..1dca4e7` (1 Commit, 26 Dateien, alle gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | .github/workflows/release.yml:36-38, vite.config.ts:12, deploy/demo/update.sh:14,20 | Eine von Hand gesetzte Version (1.0.0 über `workflow_dispatch`) landet als zweiter Tag auf einem Commit, den der Push-Lauf schon getaggt hat. `git describe` wählt bei zwei Lightweight-Tags auf demselben Commit den alphabetisch ersten (v0.x): Fusszeile, Demo und der nächste Release-Lauf ignorieren 1.0.0 |
| C-2 | Minor | src/lib/ui/Footer.svelte:12-14 | Der Zustand «Version unbekannt» (Anforderung: kein git/Tag) hat keinen Test. `__APP_VERSION__` wird zur Build-Zeit ersetzt, deshalb kann kein DOM-Test den Zweig erreichen, und kein E2E-Lauf zeigt fr/it/en «Version inconnue/sconosciuta/unknown» |
| C-3 | Minor | .github/workflows/release.yml:8-12,38 | `workflow_dispatch` lässt sich auf jedem Branch starten (`--target "$GITHUB_SHA"` taggt dann einen Commit ausserhalb von main), und die Eingabe wird nicht geprüft (`1.0` ergibt Tag `v1.0`; danach gibt `next-version.mjs` `1.0.NaN` aus bzw. `versionFrom` liefert nichts, also «Version unbekannt») |
| C-4 | Minor | .github/workflows/release.yml:14-17 | Wegen der Concurrency-Gruppe bekommt der mittlere von drei schnellen Merges keinen Tag (im Kommentar vermerkt). Die Anforderung «jeder Push auf main bekommt einen Tag» gilt also nur mit dieser Einschränkung; README «Versions» sagt das nicht |
| C-5 | Minor | deploy/demo/update.sh:14 | Bleibt main ungetaggt (z. B. Release-Lauf fehlgeschlagen, Basis-Tag fehlt), endet `update.sh` alle 5 Minuten stumm mit `exit 0`; das Log zeigt nicht, warum die Demo stehen bleibt |
| C-6 | Nit | README.md:275, deploy/demo/README.md:73 | `APP_VERSION=$(git describe --tags)` ohne `--match 'v*'`, anders als vite.config.ts und update.sh; ein Nicht-v-Tag ergäbe «Version unbekannt» |
| C-7 | Nit | tests/e2e/steps/app-frame.steps.ts:128 | Der Schritt «zeigt die Fusszeile {string}» klingt allgemein, liest aber nur `footer-version`. Ein späteres `zeigt die Fusszeile "Datenschutz"` würde irreführend fehlschlagen |

## Blocker/Major

### C-1: Eine von Hand gesetzte Version geht verloren

Warum es falsch ist: Jeder Push auf main wird sofort getaggt (`release.yml`, Push-Lauf). Ein späterer `workflow_dispatch` mit `version: 1.0.0` läuft auf dem HEAD von main, und der trägt schon z. B. `v0.5.0`. `gh release create v1.0.0 --target $GITHUB_SHA` legt einen zweiten Lightweight-Tag auf denselben Commit. `git describe` ersetzt bei Tags gleicher Priorität (beide lightweight) den zuerst gefundenen nicht; Refs werden alphabetisch durchlaufen, also gewinnt `v0.5.0`. Folgen:
- `vite.config.ts:12` (`git describe --tags --match "v*"`) und `update.sh:20`: Die Fusszeile zeigt 0.5.0, nicht 1.0.0.
- `release.yml:36` (`git describe --tags --abbrev=0`): Beim nächsten Merge ist `last=v0.5.0`, und `next-version.mjs` vergibt 0.5.1/0.6.0. 1.0.0 wird nie Basis, und die Regel «Major ab 1.0» greift nie.

Nachweis (git 2.43, im Scratchpad nachgestellt):
```
git commit --allow-empty -m "feat: a"; git tag v0.5.0; git tag v1.0.0
git describe --tags --exact-match --match 'v*' HEAD   # v0.5.0
git describe --tags --abbrev=0 --match 'v*'           # v0.5.0
git commit --allow-empty -m "fix: b"
git describe --tags --match 'v*'                      # v0.5.0-1-g…
```
Mögliche Lösung: Den letzten Tag nach Version sortiert bestimmen (`git tag --merged HEAD --list 'v*' --sort=-v:refname | head -1`) und für Fusszeile/Demo genauso. Alternativ ersetzt der Dispatch den automatischen Tag des Commits (Release und Tag löschen), oder er verweigert einen schon getaggten Commit und setzt die Version dann beim nächsten Merge. Ein Test dafür fehlt bisher; `next-version.test.ts` prüft nur die Zählregeln.

## Bestätigt

- next-version.mjs: feat → Minor, sonst Patch; `!`/`BREAKING CHANGE:` → Minor bei 0.x, Major ab 1.x. Die Body-Zeile des Merge-Commits (PR-Titel) zählt nicht als `feat`, weil `^feat` ohne `m` gilt. Abgedeckt durch `tools/release/next-version.test.ts` (in `vitest.config.ts` über `tools/**/*.test.ts` eingeschlossen).
- release.yml Shell-Logik: Mit `bash -eo pipefail` (GitHub-Standard) bricht die Zeile `[ -z "$VERSION" ] && git describe … && exit 0` nicht ab, wenn `describe` fehlschlägt. Ein Fehler in `git log | node` innerhalb von `next=${VERSION:-$(…)}` beendet den Lauf, `[ -z ]` mit gesetzter VERSION ebenfalls nicht (beides lokal mit bash nachgeprüft). Ohne Basis-Tag bricht `last=$(git describe …)` ab, deshalb muss v0.1.0 vor dem Merge gepusht sein. `inputs.version` geht über `env` und nicht über Interpolation ins Skript, also keine Injection. `contents: write` reicht für `gh release create` mit `GITHUB_TOKEN`. `fetch-depth: 0` holt die Tags.
- Docker: `ARG APP_VERSION=` steht in der Builder-Stage vor `RUN bun run build` und ist dort als Umgebungsvariable sichtbar. `.git` steht in `.dockerignore`, ohne Argument also «Version unbekannt». docker-compose.prod.yml reicht `${APP_VERSION:-}` weiter; deploy/demo/docker-compose.yml überschreibt `build` nicht.
- update.sh: Holt Tags, baut nur bei getaggtem `origin/main` (`set -eu`, `|| exit 0` korrekt) und übergibt APP_VERSION nach dem Merge.
- vite define: gilt für SSR- und Client-Build gleich; vitest definiert fest `1.4.0`; `app.d.ts` und die ESLint-Globals sind ergänzt. `versionFrom` liefert «0.4.0» bzw. «0.4.0+3-gabc1234» bzw. undefined (version.test.ts).
- i18n: `footer_version` und `footer_version_unknown` stehen in allen vier `messages/*.json`. «Version» in fr/en löst die Deutsch-Prüfung (`tests/e2e/questions/language.ts`) nicht aus, weil das Wort im eigenen Vokabular vorkommt.
- E2E: Das Szenario in `navigation.feature` (Grundlage: Gebäudeliste) ist ohne `@wip` und im Plan als rot notiert. Die Frage liefert den Text, der Schritt ruft nur die Frage auf, das Target nutzt `data-testid="footer-version"`. Die Screenplay-Schichten sind eingehalten.
- Plan: `Skills: tdd, ponytail, ponytail-review` und eine `Test red`-Zeile je neuem Test sind vorhanden.
- Kein Link, keine Tokenverletzung (nur bestehende Klassen), keine fremden Änderungen im Diff.

## Nicht bestätigt

- Lint, check, test:coverage (2334), Backend-Tests (554) und type-check, deepcheck:audit, fallow audit, E2E (navigation, sprachen*, accessibility; 313): vom Aufrufer gemeldet, nicht neu ausgeführt.
- Das Verhalten des Workflows auf GitHub: Ob `gh release create` einen Lightweight-Tag anlegt (angenommen, C-1 gilt aber auch für zwei annotierte Tags mit gleichem Datum nicht sicher), ob `--generate-notes` beim ersten Release ohne vorherigen Release (nur Tag v0.1.0) die ganze Historie aufführt, und ob Tag-Rulesets im Repo das Taggen mit `GITHUB_TOKEN` verbieten. Nicht prüfbar ohne Lauf; nachgesehen nur in `release.yml`.
- Die Behauptung im Concurrency-Kommentar, dass GitHub nur den neuesten wartenden Lauf behält: entspricht der Doku, nicht nachgestellt.
- Ob die Fusszeile auf jeder Seite erscheint (Login, öffentliche Seiten): Das Layout ist nicht Teil des Diffs und nicht erneut geprüft.
