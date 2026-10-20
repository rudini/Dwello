# Code-Review Runde 6, #452 (PR #539): `git diff ad46979f fafade0b`

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-452-code6` (detached auf fafade0b). Geändert: nur `tests/e2e/fixtures/screens.ts` (+2 Zeilen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Keine Blocker/Major, keine neuen IDs (die nächste freie bleibt C-19).

## Geprüft

- **Korrektheit:** `seedFor` legt für `upload-partial` und `upload-discard-created` eine Rechnung in «Seeblick» in der vordefinierten Kategorie mit `nameDE === 'Allgemeinstrom'` an (`backend.ts:45`, `invoiceOn`), mit dem Schlüssel «Per Area (m²)» (`backend.ts:104`). Der KI-Stand-in ordnet «Elektro Blitz…» «Electricity Common Areas» zu (`backend/scripts/llm-stub.ts:141`), also derselben Kategorie (`invoices.feature:56` zeigt sie als «Allgemeinstrom»). `InvoiceUploadDialog.svelte:52-58` schlägt über `proposedKey` (`src/lib/invoice.ts:69`) den Schlüssel der letzten Rechnung dieser Kategorie im Gebäude vor. Damit ist der Pflicht-Schlüssel gesetzt, ohne Auswahl über ein deutsches Label, also in jeder Sprache. Beide Zustände laden in `example.building` hoch (`accessibility.ts:259-261`). Das ist Seeblick, denn beide Zustände stehen in der Ausnahmeliste von `screens.ts:39` und erreichen deshalb das Seeding.
- **Seiteneffekte:** Die Rechnung kommt nur in diesen zwei Zuständen dazu. Der Schlüssel `Rechnung Allgemeinstrom 2025-03-31` überschneidet sich mit keinem anderen `invoiceOn` in `seedFor`. Die Bedeutung in `tests/a11y/screens.json:24-25` stimmt weiterhin.
- **Rot ohne Änderung:** Ohne Vorschlag und ohne Standard-Schlüssel kann die Datei «Elektro Blitz» nicht erstellt werden (#452 Punkt 7), und `Wait.until(uploadResult)` läuft in den Timeout. Das passt zum gemeldeten CI-Fehler. Die App ändert sich nicht, darum braucht es weder ein neues Szenario noch Texte in `messages/*.json`.
- **Layer und Ponytail:** Die Änderung liegt in der Fixture-Schicht, Steps und Tasks sind unberührt. Der Diff ist minimal, es bleibt kein ungenutzter Code zurück, und die Änderung hat nichts mit fremden Themen zu tun.

## Nicht bestätigt

- Axe- und Sprachzeilen «Bildschirm ohne .* invoices upload», 10 passed: vom Aufrufer gemeldet, nicht neu ausgeführt (E2E ist laut Auftrag verboten). Insbesondere habe ich nicht im Browser gesehen, dass die Beschreibung «Allgemeinstrom 2025-03-31» der neuen Rechnung in fr/it/en die Sprachprüfung (`tests/e2e/questions/language.ts`) besteht. Die vorhandene Rechnung «Hauswart 2025-01-31» folgt demselben Muster.
- `bun run lint` grün: vom Aufrufer gemeldet.
- Dass in der E2E-Datenbank kein `default_distribution_key_id` gesetzt ist (sonst wäre der CI-Fehler anders zu erklären): aus dem CI-Fehler geschlossen, nicht in der Datenbank nachgesehen.
- CI-Run 39453805767: nicht angesehen.
