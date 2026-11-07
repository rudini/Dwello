# Code-Review #1146, Runde 2 (Delta cb86a4ac9..1968f5cc2)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | tests/e2e/features/statement-generate.feature:913-918 | Die neuen Prüfungen sind Negativprüfungen ohne positiven Anker. «keine Angabe … mitten im Wort» auf Schritt 5 und alle drei Prüfungen nach «zum Schritt … zurückgeht» bestehen auch, wenn die Schrittanzeige oder der erwartete Schritt gar nicht gezeigt wird |

Geschlossen: C-1 (Schritt 3 mit Angaben bei 1280 und 1440 px geprüft, Rot vom Aufrufer gemeldet), C-2 (der Kommentar stimmt jetzt), C-3 (abgelehnt; die Begründung trägt: Absicht in beiden Assistenten, contract-new.feature:268 pinnt die ganzen Namen bei 1440 px).

## C-4 (Major)

`tests/e2e/CLAUDE.md`, «Rules», verlangt: Eine Negativprüfung braucht zuerst einen positiven Anker. Nach `CLAUDE.md`, «Done means», zählt ein Verstoss als Major.

`BrokenWords.in(target)` (tests/e2e/screenplay/questions.ts:223) gibt `[]` zurück, wenn das Ziel fehlt. `actor.sees` ist ein `expect.poll`, und `[]` hält schon beim ersten Abfragen. Zwei Stellen haben keinen Anker:

- `goBackToStep` (tests/e2e/tasks/contract-form.ts:119) ist nur `Click.on(finishedStep(label))`. Es wartet nicht, bis Schritt 3 der aktuelle ist. Darum laufen die Prüfungen auf Zeile 915-917 nach dem Klick ohne Anker. Sie bestehen auch dann, wenn die Liste noch Schritt 5 zeigt, wenn die Liste fehlt oder wenn der Klick woanders hinführt. «scrollt die Seite nicht seitwärts» ist ebenfalls negativ.
- Auf Schritt 5 kommt die neue Zeile 914 nach `goToGeneration`, und auch das ist nur ein Klick auf «Weiter». Fehlten dort die `wizard-step-value`-Elemente (z. B. weil die Angaben nicht übergeben werden), bliebe die Prüfung grün.

Das gemeldete Rot zeigt, dass der Lauf heute auf Schritt 3 ankommt. Es zeigt aber nicht, dass das Szenario einen Rückfall dorthin erkennt. Das Szenario misst also nicht sicher, was es behauptet.

**So zeigt sich der Fehler:** In `StatementWizard.svelte` `values` nicht an `<Stepper>` übergeben. Dann gibt es keine `wizard-step-value`-Elemente, und Zeile 914 und 916 bleiben grün.

**Fix:** Vor den Prüfungen den vorhandenen Schritt «zeigt die Schrittanzeige beim aktuellen Schritt den Namen {string}» (statement-generate.steps.ts:793) als Anker setzen, auf Schritt 5 und auf Schritt 3. Für die Angaben zusätzlich einen positiven Anker setzen, z. B. das vorhandene «nennt der erledigte Schritt "Gebäude" die Wahl "Lindenhof"».

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - E2E chromium statement-generate.feature und contract-new.feature (158 bestanden);
  - accessibility.feature und sprachen-bildschirme.feature, Zeilen statement-generate und contract-new (96 bestanden);
  - `bun run lint`, `bun run check`;
  - ui-navigation-parts.dom.test.ts (8 bestanden);
  - Rot von C-1 an Schritt 3 mit den Basisklassen;
  - Rot an den Angaben vor dem Fix bei allen vier Breiten.
- Mit Angaben trägt jetzt kein `li` mehr `min-w-0`. Die Liste kann also nicht schmaler werden als die Summe der längsten Wörter aller Angaben. Auf seitliches Scrollen prüft das Szenario nur Schritt 3 mit zwei Angaben, auf Deutsch. Schritt 5 hat vier Angaben, dort habe ich das bei 768 px nicht bestätigt. Ebenso wenig für fr, it und en. In sprachen-bildschirme.feature fand ich keine Prüfung auf seitliches Scrollen.
- Ohne Angaben (Mietvertrags-Assistent) kann der aktuelle Schritt bei md nicht unter sein längstes Wort schrumpfen. Ob die Seite dann seitwärts scrollt, habe ich nicht bestätigt: contract-new.feature:268 prüft nur 1440 px.

Geprüft: Klassenlogik `shrink`/`wrap`/`wide` mit und ohne Angaben; Ziel `stepValues` (kebab-case-testid `wizard-step-value`, vorhanden), Frage, Schritt und Ebenen nach Screenplay; Fachsprache ohne UI-Wörter; keine neuen Texte oder Bildschirme; nichts Fremdes im Delta.
