# Review #691, Runde 1 (7d41353f0..391baa6e0)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/[id]/CostTable.svelte:128 | Der Kommentar «Phones get the lines one below the other …; the table from md» stimmt mit `stacked` nicht mehr: auf der Bearbeitungsseite zeigt der Code die Liste bei jeder Breite und die Tabelle nie. |
| C-2 | Minor | src/__tests__/statement-pages.dom.test.ts:2389 | Kein DOM-Test deckt `stacked` ab, obwohl die Detailseite die Wahl der Variante auf dieser Ebene festhält (Z. 1414 ff., `.md:hidden`). Der bestehende Test der Bearbeitungsseite prüft weiter `statement-line-item`, also Zeilen einer Tabelle, die dort jetzt immer `hidden` ist. Er bleibt grün, prüft aber etwas, das der Liegenschaftsverwalter nicht mehr sieht. Das Überlaufen selbst zeigt nur E2E. Das neue Szenario deckt es ab. |

Keine Blocker, keine Majors.

Geprüft: alle 7 geänderten Dateien gelesen.
- `Panel` nimmt `testid` an (src/lib/ui/Panel.svelte:9,18).
- Neue Texte: keine, also keine Einträge in `messages/*.json` nötig.
- Tokens: nur die bestehenden Klassen.
- Screenplay-Schichten: der Step ruft nur die Question auf, und die Question gibt die verdeckten Pixel als Wert zurück.
- Das Szenario ist ohne `@wip` und legt eine eigene Rechnung an. Ohne Rechnung hätte die Abrechnung aus der Grundlage keine Positionen, und das Szenario wäre auch ohne die Änderung grün.
- Rot ohne die Änderung: beim Lesen plausibel. Die Panel-Breite ist durch `max-w-3xl` begrenzt, auch beim Playwright-Standard-Viewport von 1280 px liegt sie unter der Tabellenbreite. Es läuft nicht im Projekt `api` (kein `@api`).
- Bestehende Zeilen in `screens.json` für `statement-edit` decken die geänderte Variante ab. Eine neue Variante mit eigenen Bedienelementen gibt es nicht.
- Die Detailseite bleibt bewusst unverändert (#658).
- Keine Änderungen ohne Bezug zur Anforderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (322 passed), `design-guard.test.ts` + `statement-pages.dom.test.ts` (695 passed): vom Aufrufer gemeldet.
- E2E: neues Szenario rot unter `@wip` (203 px), dann grün; `statement-edit.feature` + `statement-detail.feature` (132 passed); axe- und Sprachzeilen von `statement-edit` (4 passed): vom Aufrufer gemeldet. Diese Läufe waren auf dem Commit vor dem Umbau auf `shown`. Am Diff lässt sich ablesen, dass dieselben Klassen nur in das Script verschoben sind, nachgeprüft habe ich es nicht.
- `HiddenSideways.within` nimmt das Maximum von `scrollWidth - clientWidth` über alle Nachkommen. Ein sichtbares `sr-only`-Element im Panel würde die Frage über 0 heben. Nach dem Code sitzt in der Kostenaufstellung keines im sichtbaren Teil: Tabellen-Caption und Spaltenköpfe liegen in der versteckten Tabelle. `LineInvoices.svelte` habe ich darauf nicht gelesen. Für eine Rechnung ohne Belegliste bestätigt der grüne Lauf des Aufrufers das Ergebnis 0.
- 1440 × 900 selbst habe ich nicht gemessen. Die Breiten 1010 px und 716 px kommen vom Aufrufer.
