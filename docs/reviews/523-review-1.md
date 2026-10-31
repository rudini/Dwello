# Code-Review #523, Runde 1 (1335e45..ce24925)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle 11 geänderten Dateien gelesen. Die vier Texte in `messages/{de,fr,it,en}.json` stimmen Wort für Wort mit dem Entscheid überein (Nachzahlung und Rückerstattung). Die Wahl in `PaidDateFields.svelte:42-44` (`balance < 0` heisst Rückerstattung) folgt `paidHelp` (`src/lib/statement.ts:51`). Bei Saldo 0 (Status `settled`) gibt es keinen Button «Als bezahlt markieren» (`StatusActions.svelte:28`), dort erscheint der Hinweis also nicht. Die Komponente nutzen die Liste und die Detailseite, der Hinweis steht damit an beiden Orten. Der DOM-Test (`statement-pages.dom.test.ts:1653`) deckt beide Varianten ab und ist ohne die Änderung rot (`byTestId(...)` ergibt null). Das Szenario (`statement-detail.feature:103`) ist ohne `@wip` und ohne die Änderung ebenfalls rot. Die Screenplay-Schichten sind eingehalten: Steps rufen nur Task und Question auf, die Question liefert den Text selbst. Bestehende Steps und Szenarien sind unverändert. Neue Bedienelemente gibt es nicht; die Zeilen `mark-paid-dialog` in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` decken den Dialog schon ab. Nur Token-Klassen verwendet. `ponytail-review`: kein ungenutzter Code und keine Kopie eines bestehenden Helfers. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet: eslint auf den geänderten Dateien, `bun run fitness`, `bunx vitest run src/__tests__/statement-pages.dom.test.ts` (196 pass, neuer Test vorher rot), E2E Chromium `statement-detail.feature`/`statements.feature -g "bezahlt|Zahlungseingang|Teilzahlung"` (11 pass, Szenario vorher als @wip rot), axe- und Sprachzeilen `-g mark-paid` (6 pass).
- Noch nicht gelaufen (laut Aufrufer vor dem Push): `bun run lint`, `bun run check`.
- Dass die Abrechnung 2024 von «Eva Frei» mit Heizprofil «Winter» eine Nachzahlung ist (Saldo > 0), habe ich nur aus dem gemeldeten grünen Lauf geschlossen; die Seed-Daten habe ich nicht nachgerechnet.
- Ob #523 geschlossen wird, steht nicht in der Commit-Nachricht (`Closes #523` fehlt); das gehört in den Text des Pull Requests und ist im Worktree nicht prüfbar.
