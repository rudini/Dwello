# Code-Review «App-Version und Release-Tags» (#173), Runde 2 (Delta)

Geprüft: Worktree `review-version-code-2`, Delta `1dca4e7..7609154` (1 Commit, 13 Dateien, alle gelesen, die zwei Persona-Berichte und den Bericht der Runde 1 eingeschlossen), dazu die Befunde C-1 bis C-7 der Runde 1.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | deploy/demo/update.sh:12,16,20 | Nach dem Ersetzen per Hand (C-1-Fix) bleibt die alte Version in bestehenden Klonen: `git fetch --tags` löscht den entfernten Tag `v0.5.0` lokal nicht (kein `--prune-tags`), und `update.sh` baut nicht neu, weil `origin/main` schon in `.git/demo-deployed` steht. Die Demo zeigt bis zum nächsten Merge weiter 0.5.0, und auch ein Neubau dieses Commits ergäbe 0.5.0 (zwei Tags, alphabetisch der erste). Im Scratchpad nachgestellt: Nach dem Löschen von v0.5.0 und Pushen von v1.0.0 auf der Gegenseite zeigt der Demo-Klon nach `git fetch -q --tags origin main` `git tag` = v0.5.0, v1.0.0 und `git describe --tags --exact-match --match 'v*' origin/main` = v0.5.0. Ab dem nächsten Merge (eigener Tag v1.0.1) stimmt es wieder. |
| C-9 | Minor | .github/workflows/release.yml:37-44,50 | Eine von Hand eingegebene Version, die als Tag schon auf einem älteren Commit liegt (Tippfehler, z. B. 0.3.0), wird nicht abgelehnt. Die Schleife löscht zuerst Tag und Release von HEAD, danach hängt `gh release create v0.3.0 --target …` den Release an den bestehenden Tag (laut gh wird `--target` nur ohne bestehenden Tag verwendet) oder scheitert. So oder so ist main danach ungetaggt, und die Demo bleibt stehen («main not tagged yet»). Vor der Schleife prüfen: `git rev-parse -q --verify "refs/tags/v$VERSION"` und dann abbrechen. |
| C-10 | Minor | .github/workflows/release.yml:36-50, implementation_plan.md:19 | Der C-1-Fix ändert das Verhalten, hat aber keinen wiederholbaren Test. Er wurde nur einmal von Hand mit einem gestubbten gh simuliert, und der Plan hat keine `Test red`-Zeile dafür. Das Skript liegt inline im YAML; ausgelagert nach `tools/release/` liesse es sich wie `next-version.test.ts` gegen ein Bare-Repo testen. |

## Blocker/Major

Keine.

## Status der Befunde aus Runde 1

- **C-1 (Major): behoben.** Ein Lauf per Hand prüft die Eingabe und löscht Release und Tag jedes `v*`-Tags auf HEAD (`git push origin :refs/tags/$tag`, die Checkout-Credentials reichen mit `contents: write`), bevor er `v$VERSION` anlegt. Damit trägt der Commit auf GitHub nur noch einen Tag, und der nächste Push-Lauf (frischer Klon, `fetch-depth: 0`) nimmt 1.0.0 als Basis. `bash -e` bricht ab, wenn das Löschen des Tags scheitert, bevor etwas angelegt wird. Ein zweiter Lauf per Hand mit derselben Version löscht v1.0.0 und legt ihn neu an; das ist harmlos. Nicht abgedeckt sind die bestehenden Klone (C-8), Tippfehler (C-9) und ein Test (C-10).
- **C-2 (Minor): Open Work** O-15 in `docs/design/offene-punkte.md:80`. Der Eintrag ist korrekt formuliert.
- **C-3 (Minor): behoben.** `if: github.ref == 'refs/heads/main'` (release.yml:27) und Regex `^[0-9]+\.[0-9]+\.[0-9]+$` (release.yml:38). `[[ =~ ]]` braucht bash, und das ist die Standard-Shell von `run` auf ubuntu-latest. Eine Eingabe wie «v1.0.0» wird jetzt abgelehnt statt (wie bisher über `${next#v}`) angenommen; die Fehlermeldung sagt, wie die Eingabe aussehen muss. Das ist vertretbar.
- **C-4 (Minor): behoben** (README.md:282, «Merges that land while a release still runs share the next version»).
- **C-5 (Minor): behoben** (update.sh:14, Logzeile).
- **C-6 (Nit): behoben** (README.md:275, deploy/demo/README.md:73).
- **C-7 (Nit): behoben.** Schritt «zeigt die Fusszeile die Version {string}» (app-frame.steps.ts:128). Er ruft weiter nur die Frage `footerVersionText` auf, und das Szenario in navigation.feature:53 passt dazu. Andere Verwender des alten Schritttexts gibt es nicht (grep über `tests/e2e/features`).

## Persona-Befunde

- **Sven P-1: behoben.** Footer.svelte:10 `<span aria-hidden="true">·</span>`, zwischen Text und Span bleibt Whitespace. Der DOM-Test shell.dom.test.ts:131-134 ist im Plan rot notiert («Received undefined»). Keine neuen Texte, nur bestehende Klassen.
- **Marco P-2:** wird zu U-28 (offene-punkte.md). **Marco P-1:** abgelehnt mit Verweis auf #173. Plausibel; den Issue-Text habe ich nicht gelesen.

## Nicht bestätigt

- Lint, check, deepcheck:audit, fallow audit, shell.dom-, open-work- und tools/release-Tests sowie das E2E-Szenario «Die Fusszeile zeigt die Version der App»: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Die Simulation des C-1-Fixes (gestubbtes gh, Bare-Remote): vom Aufrufer gemeldet, nicht wiederholt. Selbst nachgestellt habe ich nur das Verhalten bestehender Klone (C-8).
- Wie sich GitHub verhält: dass `gh release delete` ohne `--cleanup-tag` den Tag stehen lässt (das spielt keine Rolle, er wird danach per Push gelöscht), dass Tag-Rulesets das Löschen mit `GITHUB_TOKEN` erlauben, und wie sich `gh release create` bei einem bestehenden Tag auf einem anderen Commit verhält (C-9, nur nach der gh-Doku). Ohne einen Lauf auf GitHub nicht prüfbar.
- Ob Marco P-1 wirklich in #173 entschieden ist: Issue nicht gelesen.
