# Code-Review #948, Runde 1 (6648054..ef3a1c6, ohne docs/archive)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | CLAUDE.md:61 | Der neue Satz sagt nur, dass das Issue zum Rechtstext den «Stand» «also approves». Die Zeile `Spec change approved: #<n>` erwähnt er nicht. `tools/open-work/check-issues.mjs:73-98` verlangt sie aber für jede geänderte Zeile eines Szenarios ohne `@wip`, also auch für «Stand der Datenschutzerklärung» (`privacy.feature:121`) und «Stand der Nutzungsbedingungen» (`terms.feature:41`). Wer den Satz als Ausnahme liest, lässt die Zeile weg, und CI wird rot. Vorschlag: «… in the same pull request, with `Spec change approved: #<n>` naming that issue.» |

Geprüft: Alle drei Änderungen treffen den Wortlaut des Entscheids in #948 und stehen in den Dateien, die das Issue nennt. Der Verweis «a failure only between server parts» («No scenario») entspricht `tests/e2e/CLAUDE.md:69`. `codeWords` greift nicht zu weit: Die Ausnahme gilt für ein einziges Wort und nur im Zweig mit dem Wortschatz, der nur deutsche Texte kennt. Der Zweig für ä, ö, ü, ß und der Zweig für ganze kopierte Meldungen bleiben unverändert, und deutscher Text mit «lang» fällt über seine anderen Wörter weiterhin auf. Ein Red-Lauf ist nicht nötig: Keine Meldung in `messages/de.json` enthält heute «lang», die Basis zeigt das Verhalten also schon, und die Commit-Message nennt die Änderung ausdrücklich. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/no-german-in-code.test.ts src/__tests__/open-work.test.ts` (431 grün): vom Aufrufer gemeldet.
- Die Szenarien nach Workflow 1 laufen unter dem neuen Satz durch CI. Das zeigt sich erst am pull request, der den nächsten Rechtstext ändert. Gelesen habe ich nur `check-issues.mjs:66-98`.
