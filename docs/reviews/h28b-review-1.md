# Code-Review H-28 (Paar #16), Runde 1

Bereich: `git diff 205e2faac 1b0259099` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-h28b-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| D-1 | Minor | backend/src/services/statement-run.service.ts:233 | Die Regressionsprüfung zu #588 («auch ein Heizprofil nach dem hundertsten beim Namen») ist mit dem BFF-Test entfallen und wurde nicht ersetzt. `listHeatingProfiles` hat das Standard-Limit 100 und `listStatements` 20. Nimmt man `limit: 1000` in Zeile 232 oder 233 heraus, bleiben alle Tests grün (die Unit-Tests rufen `runDifferences` direkt auf, der pg-Test hat 1 Abrechnung und mehr als 100 Heizprofile nicht). |
| D-2 | Minor | src/__tests__/statement-generation.test.ts:491-492, 506 | Die Fixtures `ownRate` und `notAgreed` (Mietverträge `eigen`/`ohne`) dienten nur den verschobenen Pauschale-Tests. Kein verbliebener Test im `describe` braucht sie noch: Der Test zur alten Regel überschreibt `/contracts?`. Sie sind toter Testcode. |

Keine Blocker, kein Major.

Geprüft: Logik von `profileDifference`, `feeDifference` und `editedSince` gegen den Stand 205e2faac. Gleiche Fälle: wholePeriod, gespeicherte Namen (#209), unbekanntes Profil gibt «Unbekannt», byDays nur bei false, Herkunft des Satzes (none/contract/run), Toleranz 0.001, gleiche Periode (V-4), unbekannter Vertrag. Der Datumsvergleich `Date > Date` entspricht dem früheren `Date.parse` (beide auf ms genau). Die Route liegt hinter `authMiddleware`, und `namesOf` gibt nur die Namensfelder weiter, also keine `updatedAt`/ids. Der Fall «Lauf ohne Heizprofil» ist über den Assistenten nicht erreichbar: `settingErrors` verlangt ein Heizprofil und `isFeeRate` einen Satz von 0 bis 10, also passen die Grenzen von `t.Numeric`. Die Fehlertoleranz (C-1) bleibt durch `.catch` erhalten, und ein Test belegt sie. Der Vertrag `statement-run-differences.json` wird vom BFF-Test gelesen und im Vertragstest geprüft. Dort ist `profile` nicht null, weil 2024 keine Heizrechnung hat und deshalb `heatingShare` null bleibt. Rot-Lauf der neuen Tests beim Lesen plausibel. Keine neuen UI-Texte oder Bildschirme, kein E2E-Code. Ponytail: sonst nichts Ungenutztes.

## Nicht bestätigt

- Rerun von `bunx vitest run src/__tests__/statement-generation.test.ts`: 36 bestanden (selbst ausgeführt).
- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, Backend `bun run type-check`, `statement-wizard.dom.test.ts`, `statements-i18n.test.ts`, Backend `statement-run.test.ts`, `statement-run.pg.test.ts`, `api-contracts.pg.test.ts`, E2E `statement-generate.feature` und `heating-profiles.feature`, `fallow audit`, Prettier auf neuen Dateien.
- Ob das Backend vom BFF aufgerufen wird, wenn es nur überlappende Abrechnungen gibt und keine derselben Periode: Früher galt `same.length`, jetzt `overlapping.length`. Das ist ein zusätzlicher Request ohne Verhaltensänderung, nur gelesen.
