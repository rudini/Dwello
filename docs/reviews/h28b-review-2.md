# Code-Review H-28 (Paar #16), Runde 2 (Abschlussrunde)

Bereich: `git diff 1b0259099 6a65e773c` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-h28b-close`. Vorbericht: `docs/reviews/h28b-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Datei:Zeile | Status |
|---|---|---|---|
| D-1 | Minor | backend/src/services/statement-run.service.ts:231-232 | Teilweise behoben. Das Profil-Limit (Zeile 233) ist jetzt durch den neuen pg-Test belegt (backend/src/__tests__/statement-run.pg.test.ts:144-166). Der Test legt 100 `custom`-Profile und ein `predefined`-Profil «ZZZ …» an. Wegen `orderBy(type, name)` landet «ZZZ» hinter Platz 100, also wird der Test ohne `limit: 1000` rot. Weiterhin ungeprüft sind `limit: 1000` bei `listStatements` (Zeile 232, Standard 20) und bei `listContracts` (Zeile 231, Standard 50). Nimmt man eines davon heraus, bleiben alle Tests grün. Auf dem Basis-Commit hat der BFF-Test beide Limits über exakte URLs festgehalten (`statements?buildingId=b1&limit=1000`, `contracts?…&limit=1000`). Fehlt das Limit, verschweigt die Vorschau ab 21 behaltenen Abrechnungen einer Periode bzw. ab 51 Mietverträgen eines Gebäudes abweichende Einstellungen. Ein Minor ohne eigene Runde. |
| D-2 | Minor | src/__tests__/statement-generation.test.ts:491-504 | Behoben. `ownRate`/`notAgreed` sind entfernt, `/contracts?` antwortet mit `buildingContracts`. Die übrigen Treffer für `notAgreed`/`'eigen'` (Zeilen 196 und 629-655) gehören zu anderen `describe`-Blöcken. |

Keine neuen Befunde, keine Blocker, kein Major.

Geprüft: Der neue Test ruft die echte Route über `sendJson` auf und prüft `profile.run.name` als Wert. Er räumt seine Profile und Abrechnungen in `finally` auf. Er erfüllt die Pinning-Regel zu #588, und laut Aufrufer war er ohne das Limit rot. Beim Lesen ist das plausibel, siehe oben.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: Backend `bun test src/__tests__/statement-run.pg.test.ts` (10 bestanden, der neue Test ohne Limit rot), `bunx vitest run src/__tests__/statement-generation.test.ts` (36 bestanden), ESLint auf der Datei, Backend `type-check`, `fallow audit`.
- Ob die Testdatenbank vor dem Test mindestens ein Heizprofil enthält: Die Destrukturierung in Zeile 146 setzt das voraus. Laut dem grünen Lauf des Aufrufers trifft es zu. Selbst nicht geprüft.
