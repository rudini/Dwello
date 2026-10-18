# Review 419, Runde 3 (Re-Review PR #421): Szenario für eine KI, die länger als 30 s braucht

Geprüft: `git diff 21a6515b 624f2cb2 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` im Worktree `review-419-code3` (detached, 624f2cb2). Alle 8 geänderten Dateien gelesen, dazu `InvoiceUploadRow.svelte`, die Targets und Tasks des Hochladens und der vollständige KI-Platzhalter `backend/scripts/llm-stub.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | `tests/e2e/features/invoices.feature:66-69` | Szenario für die sichtbare Fehlerbehebung vorhanden, ohne `@wip`; zeigt den Fehler mit dem alten Code (siehe unten). |
| C-2 | erledigt | `backend/scripts/llm-stub.ts:24` | Der veraltete Hinweis auf die 30 s ist entfernt. |
| C-3 | erledigt | `tests/unit/api-proxy.test.ts:205` | Testname «bricht %s %s erst nach %i ms ab» stimmt für alle sechs Zeilen. |
| C-4 | erledigt | `.env.example:38`, `.env.example:64` | Die Notizen sagen, dass KI-Anfragen 300 s bekommen und dass `KI_TIMEOUT` angepasst werden muss, wenn `LLM_TIMEOUT` über 150 s liegt. Der Inline-Kommentar hinter einem aktiven Wert ist unbedenklich: `parseInt` ignoriert ihn ohnehin, und `LLM_ENABLED=false   # …` ist ein Vorbild in derselben Datei. |
| C-5 | erledigt | `src/lib/server/api-proxy.ts:115-125` | `const verb` einmal berechnet; reine Umbenennung, ohne Verhaltensänderung. |
| C-6 | bewusst belassen | `backend/src/__tests__/llm-recipient.test.ts:40-52` | Die Begründung (einzige Unit-Test-Datei von `config/llm.ts`) trägt; bleibt Nit. |
| C-7 | Nit | `tests/e2e/steps/invoice-upload.steps.ts:156-164` | Ponytail `shrink:` Der neue Then-Schritt wiederholt die ersten zwei Zeilen von «schlägt die KI für … den Betrag …, die Rechnungsnummer … vor» und unterscheidet sich nur durch die Wartezeit. Vertretbar, weil die lange Wartezeit sonst für alle Szenarien des bestehenden Schritts gälte. Lean already. |

Keine neuen Blocker oder Majors.

## Bestätigt (C-1)

- **Der Zustand entsteht nur durch die Fehlerbehebung:** Der Platzhalter verzögert `read()` bei Dateinamen mit «Langsam» um 35 s (`llm-stub.ts:115-116`); `idleTimeout: 60` des Platzhalters erlaubt das. Das Kategorisieren danach geht über `categorize()` (Zweig «RECHNUNGSDATEN:», `/^Elektro Blitz/`) und nicht über `reply()` mit dem 25-s-Zweig `/langsam/i`. Insgesamt also etwa 35 s, unter den 120 s des Backends je KI-Aufruf und unter den 300 s des BFF. Mit dem alten Code bricht entweder das Backend (`LLM_TIMEOUT` 30 s) oder der BFF (30 s) ab. Das Szenario braucht deshalb beide Hälften der Fehlerbehebung. In Playwright-Konfiguration und Skripten setzt nichts `LLM_TIMEOUT` oder `BACKEND_API_TIMEOUT` (grep), also gelten die Standardwerte.
- **Rot durch Lesen nachvollziehbar:** `invoice-upload-row-toggle` erscheint nur bei `row.status === 'check' || 'failed'` (`InvoiceUploadRow.svelte:42,59`). `Wait.until(…, 90_000)` wartet also, bis das Lesen endet, erfolgreich oder nicht. Bei einem Abbruch öffnet sich die Zeile im Zustand `failed`, und die Frage `proposedAmount` meldet den Wert selbst (`""` statt `"1250.00"`). Das passt zum Rot-Bericht des Aufrufers.
- **Keine isolierten Klicks hintereinander:** `openBelegOnceRead` wartet auf den gelesenen Zustand, bevor es klickt. Der bestehende Schritt `openBeleg` ohne Warten bleibt unverändert.
- **Screenplay-Schichten:** Der Schritt ruft nur eine Task (`openBelegOnceRead`) und eine Frage (`proposedAmount`) auf; `$testInfo.setTimeout` hat Vorbilder (`language.steps.ts:63`, `accessibility.steps.ts:12`). `Wait.until` bekommt einen optionalen `timeout`. Ohne ihn bleibt das Verhalten gleich (`waitFor({ timeout: undefined })` = Standard), die übrigen Aufrufer sind also unberührt.
- **Isolation:** Der Rechnungssteller läuft über `supplierName`/`seed.unique`, und «Langsam» kommt in keinem anderen Dateinamen eines Szenarios vor (grep in `tests/e2e`, `tests/a11y`; «Langsame Prüfung» in `accessibility.ts:326` ist ein Kategoriename und geht nicht über `read()`).
- **Gherkin:** Fachlich formuliert, ohne «klickt», «Button» oder «Feld»; das Wort «KI-Ersatzattrappe» im Kommentar hat ein Vorbild (`invoices.feature:110`). Keine UI-Texte geändert, keine neuen Bildschirme, kein API-Vertrag betroffen.
- **Nichts Fremdes im Diff:** Alle acht Dateien gehören zu C-1 bis C-5.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend `type-check` und `bunx vitest run tests/unit/api-proxy.test.ts src/__tests__/open-work.test.ts src/__tests__/e2e-screenplay-lint.test.ts` (103 pass): vom Aufrufer gemeldet. Mein eigener Lauf von vitest im Worktree wurde von einer Zugriffsregel abgelehnt (`node_modules` zeigt in das Hauptrepo).
- E2E chromium+api für `invoices.feature`, `invoice-detail.feature`, `invoice-new.feature` und `categories.feature` (68 passed) und das Rot-Sehen des neuen Szenarios mit den alten Dateien `api-proxy.ts`/`llm.ts`: vom Aufrufer gemeldet. Ich habe sie nur durch Lesen beurteilt (siehe oben). Der Aufrufer meldet zudem, dass der E2E-Lauf ohne die C-5-Umbenennung lief; laut Diff ist sie reine Umbenennung.
- Nur der Leseweg (`/invoices/extract`) ist Ende-zu-Ende abgedeckt. `/invoices/categorize`, `/invoices/:id/recategorize` und POST `/invoices` mit KI deckt nur `tests/unit/api-proxy.test.ts` ab (gelesen in Runde 2). Für eine Fehlerbehebung mit demselben Mechanismus genügt das.
- Die PR-Beschreibung von #421 habe ich nicht gelesen. Ob sie das veraltete «No scenario: configuration and docs only» entfernt und die Timeout-Änderung nennt (Hinweis aus Runde 2, C-1), ist nicht bestätigt.
