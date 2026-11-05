# Code-Review 1113c, Runde 1 (Delta 3ede1b658..38f278c68)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/zugangsschluessel.feature:95, :101 | Titel und Dann-Schritt sagen «verdeckt keinen Knopf». Damit nennt das Feature das Bedienelement, nicht das Ziel des Liegenschaftsverwalters. `tests/e2e/CLAUDE.md` schliesst «Button» ausdrücklich aus. Fachlich gemeint ist etwa «verdeckt nichts, was zum neuen Zugangsschlüssel gehört». |

Keine Blocker oder Major.

Geprüft:
- `place()` in `ToastRegion.svelte`: Oben und unten steht die Meldung in derselben Spalte. Nur `top-4` und `bottom-4` wechseln, darum gilt `own.left/right` auch oben. Auf dem Telefon (`inset-x-4`) ist `sameColumn(focus)` immer wahr. Dort bleibt das Verhalten wie bisher, auch beim C-2-Test mit dem Rechteck 0×0 von jsdom.
- Der neue DOM-Test ist ohne den Fix rot. Nach dem alten Code bleibt die Meldung unten, weil `focus.top` (20) kleiner ist als 112. Nach dem neuen Code steht sie oben, weil der Link (0–400) nicht in der Spalte 984–1440 liegt.
- `data-testid="access-key-new-actions"` ist kebab-case und hat Kontext. Das Target, die Question (Wert in px, `null` bei Überdeckung) und der Schritt halten die Screenplay-Schichten ein.
- Keine neuen Texte, also keine Änderung an `messages/*.json`. Kein neuer Zustand, also keine Änderung an `screens.json`. Nichts im Delta gehört nicht zur Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run --changed origin/main` (70 bestanden), E2E Chromium `--grep "Erfolgsmeldung|Fokus|Zugangsschlüssel"` (23 bestanden).
- Ob das neue Szenario ohne `data-focus-row` rot ist (laut Aufrufer −34 px in einem Beispiel), konnte ich durch Lesen nicht bestätigen. Das hängt vom Umbruch der drei Knöpfe und von `bringTheAddressCopyToTheBottomEdge` je Fenstergrösse ab. Das Szenario ist neu und damit frei.
- Für die Ausnahme bei hohen Zeilen (200 % Zoom), samt der neuen horizontalen Unterscheidung, gibt es nur den DOM-Test und kein Browser-Szenario. Ob der PR-Text dafür `No scenario: <reason>` nennt, habe ich nicht gesehen: Der PR-Text liegt nicht im Worktree. Laut Aufrufer ist C-2 aus 1113-review-2 erledigt.
