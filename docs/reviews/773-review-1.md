# Code-Review #773, Runde 1 (030dbbb gegen origin/main)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `stateOf` (byHand + 'check' -> 'fill', 'failed' behält «Fehler – erneut versuchen»), Badge und Statuszeile im Dialog (mit «Keine KI» keine Fortschrittsangabe, die Zählungen pro Badge bleiben), die Texte in allen vier `messages/*.json` wie in #773 entschieden, keine alten «Fertig»-Texte mehr in Tests oder Features, DOM-Tests (der neue Test und die angepassten wären ohne die Änderung rot: kein `invoice-upload-row-status`, alte Texte), E2E-Schichten (Step -> Question `belegStatusText` -> Target, Text-Wert), Feature-Formulierung, `data-testid`, a11y-Zustände (der neue Badge erscheint im bestehenden Zustand `upload-unreadable`, gleiche Bedienelemente, keine neue Zeile nötig), Spec-Änderung in `invoices.feature` und `ki-einstellungen.feature` durch #773 gedeckt (`Spec change approved: #773` im PR, wie angekündigt), Ponytail (nichts Unbenutztes, kein kopierter Helper).

## Nicht bestätigt

- E2E chromium für «Rechnungen hochladen, wenn keine KI gewählt ist», «Das Auslesen einer Datei scheitert» und «Dwello sagt, was nach dem Lesen zu tun ist, und meldet eine entfernte Datei», samt deren Rotlauf: vom Aufrufer gemeldet; nur gelesen (Steps, Question, Target).
- `bun run lint`, `bun run check`, Commit-Hooks: vom Aufrufer gemeldet.
- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts src/__tests__/i18n*.test.ts`, 112 bestanden.
- Dass `sprachen-bildschirme.feature` für fr/it/en im Zustand `upload-unreadable` den neuen Badge ohne deutschen Text zeigt: nicht ausgeführt; die drei Übersetzungen stehen in `messages/{fr,it,en}.json`.
