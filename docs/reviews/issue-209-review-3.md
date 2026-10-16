# Code-Review #209, Runde 1 des Fix-Slices (Feature-Review-Fixes)

Gegenstand: `git diff 6e569c26 637ad2b6` im Worktree `review-209-code3` (Commit `637ad2b6 fix(statements): store the heating share rounded`). Gelesen habe ich alle 8 geänderten Dateien: `backend/src/__tests__/statement-pdf.pg.test.ts`, `backend/src/services/calculation.service.ts`, `docs/data-model.md`, `implementation_plan.md`, `docs/reviews/issue-209-review-2.md`, `docs/reviews/issue-209-fachreview-2.md`, `docs/reviews/issue-209-datenpruefung-1.md` und `docs/reviews/workflow-rules-review-issue-209.md`. Zum Vergleich habe ich ausserdem `statement-pdf.service.ts` (`heatingOf`), `pdf.service.ts` (`formatShare`, Hinweis Z. 642-647), `prorating.service.ts` (`handleMidYearMoves`) und `heating-profile.service.ts` (`calculateHeatingShare`) gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor (bestand schon vorher, auch auf dem Basis-Commit `f106ec6b`) | backend/src/services/pdf.service.ts:644 gegen :394 und calculation.service.ts:355 | Der Hinweis rundet `percent` einmal auf zwei Stellen. Die Zeile druckt `period_share`, und das ist `percent / 100` auf vier Stellen gerundet und dann noch einmal gerundet. Liegt ein Wert genau auf x.xx5, laufen die beiden Rundungen wegen der Gleitkomma-Darstellung auseinander. Beispiel: ein eigenes Profil mit Zweistellen-Monaten (4.05, 5.03, 18.03, 2.1, 1.5, 4.05, 9.27, 4.26, 14.16, 12.57, 18.58, 6.4) und Einzug am 4. Juni 2025 ergibt `percent` = 68.88499999999999. Der Hinweis zeigt dann «68.88 %», die Zeile «68.89 %». In einer Zufallssimulation mit 300 000 eigenen Profilen und Einzugstagen trat das etwa 550 Mal auf. Das Delta ändert daran nichts: Die Rundung von `twoPlaces` ist idempotent, der Hinweis bleibt also bitgleich (Details unter «Weiter geprüft»). |
| C-2 | Minor | implementation_plan.md:24-26 | Der Fix-Slice ändert Code (`calculation.service.ts`). Trotzdem fehlt für ihn die Zeile `Skills: tdd, ponytail, ponytail-review`. Die vorhandene Skills-Zeile (Z. 17) gehört zum ersten Slice. |
| C-3 | Nit | implementation_plan.md:25 | «Fixes of the feature review as a new slice (Workflow 7): code-reviewer round below» ist schon abgehakt, obwohl die Runde noch läuft (dieser Bericht) und es noch keine Zeile für sie gibt. |

Keine Blocker, keine Major.

## Weiter geprüft

- **Frage des Aufrufers (kann die Rundung den Hinweis von der Zeile abweichen lassen?): Nein, das Delta schafft keine neue Abweichung.**
  - Der Hinweis druckt `(Math.round(percent * 100) / 100).toFixed(2)` (`pdf.service.ts:644`). Mit dem gespeicherten `twoPlaces(p)` ergibt das dasselbe wie mit dem rohen `p`, denn `twoPlaces(twoPlaces(p)) === twoPlaces(p)`. Geprüft mit 2 Mio. Werten, auch auf genauen Halb-Grenzen: 0 Abweichungen.
  - Die Zeile druckt `formatShare(period_share)`. `period_share` kommt aus demselben `handleMidYearMoves`-Aufruf (`calculation.service.ts:321-334`, gleiche Vertrags- und Periodendaten; `percentage` hängt nicht vom Betrag ab), und das Delta fasst es nicht an.
  - Gezählt gegen die Zeile: Wie oft Hinweis und Zeile auseinanderlaufen, ist mit dem rohen und mit dem gerundeten `percent` gleich. Die verbleibende Abweichung ist C-1, und die bestand schon vor #209.
  - Die Monate waren schon gerundet, das Delta lässt sie unverändert.
- **Test «speichert den Anteil nach dem Heizprofil auf zwei Stellen»:** Ich habe nachgerechnet, wie der Rot-Lauf ausfällt. «Heating + Hot Water» (Migration `0002`, Juli bis Dezember 3.7, 3.6, 3.7, 9.5, 10.7, 13.00) ergibt Mieter 44.2 und Periode 100.00000000000001. Daraus folgt `percent` = 44.199999999999996, gerundet 44.2, genau wie im Plan angegeben. Ohne `twoPlaces` würde `toMatchObject({ percent: 44.2 })` also rot. Der Test liegt auf der untersten Schicht, die den gespeicherten Wert zeigt (pg), und räumt seine Abrechnung vor dem `expect` auf.
- **Kein Szenario nötig:** Das PDF druckte schon vorher «44.20 %», für den Liegenschaftsverwalter ändert sich also nichts Sichtbares. Gespeichert wird nur der Wert in `heating_share`, und der geht nicht ans Frontend: `heatingShare` und `heating_share` kommen in `src/` und `tests/` nicht vor. Ein Vertrag muss deshalb nicht angepasst werden.
- **V-1 (`docs/data-model.md`):** «without heating costs» stimmt mit `heatingOfRun` überein (`calculation.service.ts:410`, `!groups.some(isHeatingCost)` gibt `null` zurück).
- **C-5, V-2 (Testname und Kommentar):** Name und Kommentar sagen jetzt, dass der Anteil neu gerechnet wird, und nennen #229 (F-3). Was der Test prüft, ist unverändert.
- **C-6 (Plan):** Die Zeile von Runde 1 sagt jetzt «`handleMidYearMoves` reads the profile once more». Die Begründung, warum der Zweig ohne Profil keinen eigenen Test hat (Fremdschlüssel), steht im Plan.
- **Umfang:** Das Delta enthält nur die Fixes, die Berichte, die Planzeilen und den Workflow-Review (nur das Dokument, keine Regeländerung). Fremdes ist nicht dabei. Es gibt keine Änderungen an Texten (`messages/*.json`), an der UI oder an E2E-Dateien.
- **Einfachheit:** `twoPlaces` als lokale Funktion bündelt die bisher inline geschriebene Rundung der Monate. Das ist das kürzeste Delta, das passt.

## Nicht bestätigt

- Backend `bun test src/__tests__/statement-pdf.pg.test.ts` (30 pass), `bun run type-check` und `bunx fallow audit` auf 637ad2b6: vom Aufrufer gemeldet. Nicht selbst gestartet, weil der Reviewer nur Vitest ausführen darf.
- Dass der neue Test vor dem Fix tatsächlich rot lief: Das steht nur im Plan. Ich habe den Wert 44.199999999999996 mit derselben Arithmetik nachgerechnet (siehe oben), den Test aber nicht ausgeführt.
- Backend-Gesamtlauf, `test:coverage`, `lint`, `check`, `deepcheck:audit` und die betroffenen E2E-Szenarien auf 637ad2b6: Der Aufrufer meldet sie für diesen Commit nicht. Der Plan-Punkt «Checks» ist offen.
- Die Simulation zu C-1 lief ausserhalb des Worktrees mit nachgebauten Formeln aus `calculateHeatingShare` und `handleMidYearMoves`, nicht gegen die Datenbank.
