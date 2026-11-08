# Code-Review #733, Runde 1 (75b78a9..3ba46e2)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/statements.feature:124, :128 | Titel und Schritt «in das Feld «Gebäude» des Filters geht» beschreiben ein Bedienelement («Feld») statt dessen, was der Liegenschaftsverwalter will. Die Feature-Regel nennt «Feld» ausdrücklich. Ein Vorschlag ohne UI-Wort: «… sobald der Liegenschaftsverwalter das Gebäude des Filters wählen will». Das Verhalten ist davon nicht betroffen. |

Keine Blocker oder Major.

Geprüft: Das Szenario setzt die Entscheidung von #733/#1096 um: Es prüft nur den fokussierten Zustand und keine App-Änderung. Der Schritt ruft nur den Task `focusBuildingFilter` auf (`Focus.on` auf das bestehende Target `statementBuildingFilter`), die Screenplay-Schichten sind eingehalten. Die Prüfung nutzt die bestehende Question `roomAroundConfirmation` (Abstand in px, Wert statt ja/nein). Ist keine Meldung da, liefert sie `null`. Das Szenario kann darum nicht grundlos grün werden, wenn die Meldung schon weg ist. `ToastRegion.svelte` berechnet `atTop` bei `focusin` neu, deshalb ist die Reihenfolge von Meldung und Fokus egal. `deleteStatement` wartet zwar nicht auf die Liste, aber `Locator.focus()` wartet, bis der Filter der Liste da ist. Die Grundlage öffnet die Abrechnungsliste, die Grösse des Fensters wird danach gesetzt, das wirkt sich auf die Meldung erst aus, wenn sie erscheint. Pinnen von bestehendem Verhalten: Die Commit-Message sagt das, die Entscheidung verlangt keine App-Änderung, es ist also kein Bugfix. Laut Aufrufer zeigt die Mutation von `atTop` bei beiden Zeilen rot. Keine neuen Texte, Bildschirme oder Verträge. Keine unbenutzten Imports. Bestehende Szenarien und Schritte sind nicht verändert.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Prettier auf den geänderten Zeilen, das Szenario grün in Chromium (2 passed) und die Commit-Hooks: vom Aufrufer gemeldet.
- Den roten Lauf mit `atTop = false` bei 1029x643 und 960x600 (Abstand -7 px) und den grünen Lauf der weggelassenen Zeilen unter der Mutation: vom Aufrufer gemeldet. Nicht selbst ausgeführt. Gelesen: `src/lib/ui/ToastRegion.svelte` (Berechnung von `atTop`, `onfocusin`).
- Dass auf `main` der Fokus nach dem Löschen auf dem Seitentitel liegt und die Meldung das Feld bei etwa 1030 px verdeckt: vom Aufrufer gemeldet, nicht geprüft.
- Den Verweis «persona Helga, Marco, #125» im Kommentar in `tests/e2e/tasks/statements.ts:50`: nicht anhand der Issues geprüft.
