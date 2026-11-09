# Review #1270, Runde 2 (Delta 1c73dab5..e0412e2c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tools/open-work/check-issues.mjs:216 | Bei einem mehrzeiligen Schleifenkopf beginnt die Definition an der letzten Zeile in Spalte 0 vor dem Aufruf, also an `] as const)`, und nicht am `for`. Die Musterliste davor gehört dann zu keiner Definition. Wer dort einen Schritt entfernt, umbenennt oder auf eine andere Question umleitet, bekommt Exit 0 (fail-open). Genau dieser Fall stand in Runde 1 als erster Beleg. |

Geschlossen: C-2, C-3, C-4, C-5

## C-1 (Major, weiter offen): mehrzeiliger Schleifenkopf in invoice-detail.steps.ts:202–208

Warum falsch: `while (indent && start > 1 && !/^\S/.test(lines[start])) start--;` hält an der ersten Zeile in Spalte 0 über dem Aufruf. In tests/e2e/steps/invoice-detail.steps.ts sieht die Basis so aus:

```
202 for (const [step, question] of [
203 	['steht beim Betrag der Rechnung {string}', deductedHintAtAmount],
204 	['steht im Formular beim Betrag {string}', deductedHintAtAmount]
205 ] as const)
206 	Then(step, async ({ verwalter }, text: string) => {
```

Ich habe die Erkennung auf den Schrittdateien der Basis nachgebaut (/tmp/claude-0/-home-user-Dwello/df0d7af4-8938-5d06-a623-2029cb45ee99/scratchpad/r2-sim.mjs). Sie liefert `{ start: 205, call: 206, end: 208, literals: [] }`. Die anderen drei Schleifen (invoice-detail:210, invoice-upload:283, statement-detail:399) haben einen einzeiligen Kopf und werden richtig erkannt.

Folgen:
- Zeilen 202–204 liegen in keiner Definition. Ein Hunk `@@ -203 …` (der Schritt `steht beim Betrag der Rechnung {string}` wird entfernt oder seine Question `deductedHintAtAmount` gegen eine andere getauscht) trifft keine Definition. Das Skript endet dann mit Exit 0, obwohl invoices.feature:318 und invoice-detail.feature:178 (ohne `@wip`) den Schritt brauchen. Umleiten und Entfernen sind genau die Fälle, die #1270 rot haben will.
- Eine Änderung in 205–208 schlägt fehl, aber ohne Literale: das Skript meldet jeden Schritt aller Szenarien ohne `@wip` unter dem Muster `Then(step, async …`. Das bleibt fail-closed, nennt aber nicht mehr «den Schritt und seine Szenarien».

So zeigt man es: Im Testrepo von check-issues.test.ts den Loop-Test mit mehrzeiligem Kopf schreiben (`for (const step of [\n\t'sieht der Liegenschaftsverwalter nichts'\n])\n\tThen(step, …)`) und die Literalzeile auf dem Branch löschen. Erwartet wird eine Meldung mit «used by …buildings.feature:3», das Ergebnis ist Exit 0. Der neue Test deckt nur den einzeiligen Kopf ab.

Mögliche Abhilfe: Die Suche nach oben nicht an der ersten Zeile in Spalte 0 stoppen, sondern an der Zeile, die mit `for` beginnt, oder an einer Zeile, die eine vorige Definition schliesst. Alternativ als Beginn die Zeile nach dem `end` der vorigen Definition nehmen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `bunx vitest run tools/open-work tools/deepcheck/test src/__tests__/open-work.test.ts src/__tests__/e2e-screenplay-lint.test.ts tools/ci tools/claude-hooks`, Commit-Hooks, der Probelauf gegen das echte Repository (5 Treffer).
- Vom Aufrufer gemeldet: Rot gesehen für C-2 (Grenze auf `+start`), C-3 (cwd-Rückgriff entfernt) und «nur @wip» (Filter entfernt). Beim Lesen fällt der Loop-Test (C-1) ohne die Änderung rot aus, weil eingerückte Aufrufe dann nicht erkannt werden. Die Zeilennummer `:19` in seiner Erwartung habe ich nicht nachgezählt.
- Laut Aufrufer meldet fallow `@cucumber/cucumber-expressions` als ungenutzte devDependency und warnt nur. Ob `bunx fallow audit` in CI (ci.yml:246) bei dieser Warnung grün bleibt, habe ich nicht ausgeführt. `.fallowrc.json` (`ignoreDependencies`) nimmt das Paket nicht aus.
- Dass `bun install` im CI-Job das Paket ins Wurzel-`node_modules` legt, schliesse ich nur aus package.json und bun.lock. Der Worktree hat kein `node_modules`.

Geprüft: Ende der Definitionen mit Einrückung (`${indent})`/`${indent}}`) und unverändertes Verhalten in Spalte 0; Literal- und Schleifen-Muster in `matcher`, fail-closed ohne Literal; C-3-Test (Kopie in tmpdir, `node_modules`-Symlink); Text in tests/e2e/CLAUDE.md:86.
