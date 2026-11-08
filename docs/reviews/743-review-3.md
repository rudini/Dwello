# Code-Review 743, Runde 3 und Schlussrunde (Delta 41fa74a..5c28434, ohne docs/reviews)

Geschlossen: C-4, C-5, C-6

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (42 Dateien, 1848 Tests), `testcheck:audit` und `deepcheck:audit`, E2E chromium für invoices, invoice-new, invoice-edit, building-detail und contract-new (144 bestanden), die neuen Tests für C-4 und C-5 vor der Behebung rot gesehen.
- Rot-Läufe habe ich nur durch Lesen beurteilt. Der C-4-Test würde auf 41fa74a scheitern: Dort setzt `create()` die Fehler vor der um 400 ms verzögerten Anfrage `POST /invoices`. Die Frist von 300 ms läuft ab, während der Fokus noch auf dem Knopf steht. Die Live-Region nimmt die Ansage erst nach 2000 ms zurück, steht also bei 1200 ms noch. Der C-5-Test würde auf 41fa74a scheitern, weil `landed` dort false bleibt und die Seite den Fehler ansagt. Das Szenario für C-6 würde auf main scheitern: `create()` setzt dort die Fehler direkt neu, und der Fehler, den das Feld versteckt hat, bleibt versteckt. Weil der DOM-Test rot gesehen wurde, braucht das Szenario keinen eigenen Rot-Lauf (die Commit-Nachricht sagt das).
- Ob ein Screenreader die Ansage der Live-Region im Fall «Datei erstellt, Fokus auf dem Ergebnis» wirklich vorliest, habe ich nicht geprüft. Laut Entscheid ist sie dort gewollt.
- Den Merge 71d3d20 habe ich laut Auftrag nicht geprüft.

Geprüft: Der revidierte Entscheid in #743 vom 2026-11-07 deckt die Regel in DateInput.svelte:100–115 (kein Fehler der Seite, wenn der Fokus in einem Feld mit `aria-invalid` landet, sonst eine Ansage). Die Fehler in `create()` erscheinen erst direkt vor dem Fokuswechsel. Das `await tick()` trennt `errors = {}` auch ohne vollständige Dateien von `errors = found`. Schritte und Task halten die Screenplay-Schichten ein, die negative Prüfung folgt auf einen Schritt und wird danach positiv geprüft. Das Szenario sagt, was der Liegenschaftsverwalter tut, nicht wie. Der Delta ändert keine Texte.
