# Code-Review H-28 (#717) Schritt 2: Abschlussrunde, Korrekturen zu h28h C-1..C-5

Bereich: `git diff eee932dcc e72119574 -- . ':!docs/reviews'` (1 Commit, 5 Dateien), Worktree `review-h28i-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Status der Befunde aus `docs/reviews/h28h-review-1.md`:
- C-1 behoben. `categoryId` ist im Schema nur noch `t.String()`. `isFuelCategory` lehnt eine Nicht-UUID vor der Datenbankabfrage ab; ohne diese Prüfung gäbe der Cast in PostgreSQL einen 500. Die Felder werden in der Route vor der Kategorie geprüft. Ohne Kategorie und mit leerem Stichtag und Betrag kommen also die beiden Ursachen am Feld (Test `ohne Kategorie`). Mit gültigen Feldern kommt eine 400 ohne `code`, und das BFF zeigt dafür `buildings_fuel_not_saved` (`notSaved`, gleicher Weg wie der getestete Fall 500 `{}`). Beide neuen Backend-Fälle wären auf dem Basis-Commit rot (422 aus `format: 'uuid'`, ohne `causes`). Zum 404-Text: Er hält. `backend_building_not_found` lautet «Das Gebäude wurde nicht gefunden. Laden Sie die Seite neu.» Das sagt, was passiert ist, und nennt eine Handlung, die hilft. Das alte «Versuchen Sie es erneut» würde wieder scheitern. Hinweis: Die Commit-Nachricht nennt den Text «Liegenschaft nicht gefunden», der Schlüssel sagt «Gebäude». Das ist kein Fehler im Code.
- C-2 behoben. `asked` prüft die URL des Backends. Auf dem alten BFF, das selbst prüfte, bliebe `asked` leer, der Test wäre also rot.
- C-3 behoben. Der JSDoc steht wieder über `createFuelStock`.
- C-4 behoben. «1'450.-» wird als `1450.00` gespeichert. Der Commit nennt es als festgehaltenes, unverändertes Verhalten. Die Zeile stand schon auf `eee932dcc` in `typedAmount`. Es ist kein Bugfix, also braucht es keinen Rot-Lauf.
- C-5 behoben. Der Fall `reminder_after_days` «6» → 400 ist ergänzt. Die Untergrenze `v >= 7` bestand schon vorher, also braucht es keinen Rot-Lauf.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer ausgeführt (vom Aufrufer gemeldet, nicht wiederholt): die Rot-Läufe der neuen C-1-Backend-Fälle und des C-2-BFF-Tests, `fuel-stock.pg.test.ts` und `config.pg.test.ts` (61 bestanden), die Backend-Typprüfung und `bun run lint`. Die Backend-Tests habe ich auf Wunsch des Aufrufers nicht ausgeführt (gemeinsame Datenbanken). Ob sie rot wären, habe ich durch Lesen der Route und des Schemas auf dem Basis-Commit beurteilt.
- Selbst ausgeführt: `bunx vitest run src/__tests__/building-actions.test.ts` (31 bestanden).
- Der 404-Text im BFF ist durch keinen eigenen Test festgehalten. Er läuft über denselben `backendMessage`-Zweig wie die getesteten 409-Codes. Ich habe in `src/__tests__/building-actions.test.ts` gesucht.

Geprüft: `docs/api-specification.md:64` deckt eine Nicht-UUID als «400 category not allowed» ab, «422 invalid body» gilt weiter für fehlende Felder. An den Antworten ändert sich nichts, also brauchen die Verträge keine Änderung. Der Diff enthält nichts, was nicht zu den Korrekturen gehört.
