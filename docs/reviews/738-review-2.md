# Code-Review #738, Runde 2 (00ca14e65..0d2f80c18, Abschlussrunde vor dem Push)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine offenen und keine neuen Befunde |

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` (103 Tests; die neuen Tests waren gegen die origin/main-Fassung der drei Komponenten rot, ausser «sagt nichts, wenn beide Zählungen geladen sind», der bestehendes Verhalten festhält; die Tests zu P-1 und P-2 waren vor ihrem Fix rot) und E2E auf Chromium (29 Szenarien). Firefox und WebKit liefen nicht.
- Rot ohne die Änderung habe ich nur durch Lesen beurteilt. Auf 00ca14e65 schlagen diese Prüfungen fehl: der Test mit beiden Fehlern (dort steht «Laden Sie die Seite neu.» zweimal), der `aria-describedby`-Test am `fieldset` (dort nur `buildings-error`) und die Beschreibung «… erfasst. 1 Wohnung» in DOM-Test und Szenario (dort ohne Punkt). Das Szenario «Ein Gebäude heisst bei der Wahl nach Name und Adresse» ist nicht auf `origin/main`. Seine geänderte Zeile braucht deshalb keine Freigabe.
- Dass Playwright (`Accessible.descriptionOf`) und Screenreader den Text eines `hidden`-Spans lesen, auf den `aria-describedby` direkt verweist, folgt aus der accname-Spezifikation. Belegt ist es nur durch den gemeldeten E2E-Lauf. Ohne Browser kann ich es nicht prüfen. Dasselbe gilt für die 390-px-Messung ohne den `sr-only`-Punkt.

Geprüft: alle Dateien der Änderung; die drei neuen und geänderten Texte in allen vier `messages/*.json` (kein bestehender Schlüssel hat denselben Text); keine doppelten Punkte, weil die Texte zu Rechnungen und Wohnungen in keiner Sprache auf «.» enden; `describedBy` wird `undefined`, wenn nichts fehlt; Screenplay-Schichten und dass `invoicesCannotBeCounted`/`billedCannotBeChecked` wiederverwendet werden; das entfernte Target `stepHeading` wird nirgends mehr verwendet; nichts in der Änderung gehört nicht zur Anforderung.
