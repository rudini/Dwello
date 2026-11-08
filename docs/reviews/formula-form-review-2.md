# Code-Review #1200, Runde 2 (Schlussrunde, f2becd3..001604f)

Geschlossen: C-1, C-2

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-3 | Major | src/routes/config/distribution-keys/DistributionKeyForm.svelte:32-38, tests/e2e/features/distribution-keys.feature | Die Behebung von Helga P-1 (Fokus geht nach dem Einfügen ins Formelfeld) ändert ein Verhalten, das die Nutzerin sieht. Sie hat aber kein Szenario und keinen `No scenario: <reason>`. Abgedeckt ist sie nur durch den DOM-Test. |

## C-3: Für die Fokus-Behebung fehlt ein Szenario

- **Warum falsch:** `CLAUDE.md`, Workflow 1, verlangt für jede Verhaltensänderung ein Szenario ohne `@wip`, ausdrücklich auch für einen Bugfix, den die Nutzerin sieht. Der Fehler besteht schon auf `main`: Dort hängen die Baustein-Knöpfe mit `onclick={() => (formula += …)}` an (origin/main, DistributionKeyForm.svelte:83). Die Persona ist in ihrer Aufgabe zu dieser Änderung darauf gestossen. Das E2E-Stack kann den Zustand herstellen, ein Grund für «No scenario» besteht also nicht. Weder Commit 9879c22 noch die Archivnotiz (`docs/archive/sessions/1200.md:11`) nennt einen solchen Grund. Das bestehende Szenario «Eine Summe des Gebäudes in die Formel übernehmen» deckt den Fall nicht ab: `enterFormula` füllt das Feld vor dem Einfügen und tippt danach nicht weiter. Es läuft also auch mit dem alten Verhalten grün.
- **Wie zeigen:** Ein Szenario, etwa «Nach dem Übernehmen eines Bausteins weiterschreiben». Der Liegenschaftsverwalter übernimmt «{area}» und schreibt danach « / » über die Tastatur weiter, ohne vorher ins Feld zu gehen. Danach steht in der Formel «{area}{area} / ». Auf f2becd3 hat der Knopf noch den Fokus, und die Leertaste drückt ihn erneut, wie im Persona-Bericht beschrieben: Das Szenario wird dort rot. Für den neuen Task gilt: tippen mit `pressSequentially` bzw. `keyboard.type`, nicht mit `fill`, denn `fill` setzt den Fokus selbst und würde das Problem verdecken. Weil der DOM-Test rot gesehen wurde, braucht das Szenario keinen eigenen Rot-Lauf (Workflow 2).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, Backend-Type-Check, die Backend-Tests formula-codes und formula.service, Vitest distribution-keys-pages.dom, fallow audit, testcheck:audit, Prettier auf der geänderten Svelte-Datei und E2E chromium distribution-keys.feature samt den axe- und Sprachzeilen der Verteilschlüssel-Bildschirme (43 bestanden, auf 9879c22). `bun run fitness` steht nicht in der Liste des Aufrufers.
- Dass origin/main ohne Merge-Commit schon enthalten ist, habe ich nicht geprüft. Im Worktree habe ich kein `git fetch` ausgeführt.
- Rot-Lauf der neuen Tests, nur durch Lesen beurteilt:
  - `%{area}`, `{area} * % 2` und `({area} + 1) % 2` hätten auf f2becd3 zusätzlich bzw. stattdessen FORMULA_MISSING_OPERATOR gemeldet und sind dort rot, weil sie mit `toEqual` die ganze Liste prüfen.
  - `* {area}` und `({area} +)` prüfen Zeilen von `BREAK_AFTER`, die schon in f2becd3 stehen. Sie werden rot, wenn man die jeweilige Zeile herausnimmt.
  - Der DOM-Test wird ohne `insertBlock` am Fokus rot (`activeElement` bleibt nicht das Feld).

Geprüft: Dass `%` nach «)» gleich gelesen wird wie in der Auswertung (`(\d+…)\s*%` wirkt nur nach Ziffern, eingesetzte Variablen sind blanke Zahlen, und `) %` mit Leerzeichen geht ebenfalls auf Modulo); die Fundstellen `part` der vier C-1-Fälle mit `around`; `after` bleibt nach `%` unverändert; `insertBlock` mit `tick`, Fokus und Schreibmarke; `bind:this`; der Szenariotitel; keine neuen Texte oder Zustände; ponytail-review ohne Befund.
