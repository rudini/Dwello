# Code-Review #535, Slice 535b (Abschlussrunde vor dem Push), Runde 1

Worktree `/tmp/scratchpad/review-535b-code-reviewer` @ 35d6d6a, Bereich `eab2329..35d6d6a`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine Befunde. Keine Blocker, keine Major, keine Minor.

Geprüft: alle 3 geänderten Dateien. C-1: Der Link `invoice-upload-record-rest` (`src/routes/invoices/UploadResult.svelte:25`) hat jetzt `inline-flex min-h-12 items-center underline underline-offset-4`, wie `MissedWarning.svelte:24`. C-2: `createMixed` (`tests/e2e/tasks/accessibility.ts:235`) ruft `enterAmount(mixed, '180.00')` vor `Check.the(belegSelected(mixed))` auf, wie im Kommentar und im Szenario (`invoices.feature:199`). `enterAmount` öffnet die Datei bei Bedarf selbst (`invoice-upload.ts:104-107`). `docs/reviews/535-review-1.md` ist der Bericht der Vorrunde und liegt neben den anderen Berichten. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, E2E chromium mit dem Szenario «Nach dem Erstellen nennt Dwello den Rest einer Rechnung mit Kosten, die nicht umlagefähig sind» und den Axe- und Sprachzeilen von `upload-mixed-rest` (3 bestanden).
- Dass der Link im Browser tatsächlich 48 px hoch ist, habe ich nicht gemessen. Die Klasse `min-h-12` ergibt das, und Axe prüft nur 24 px. Ein Test für diese Höhe fehlt, wie bei den anderen Links mit demselben Muster. Ein jsdom-Test kann die Höhe nicht zeigen.
- Ob der Zustand `upload-mixed-rest` den Satz zum Rest wirklich zeigt, habe ich nur aus dem Code geschlossen. `createMixed` wählt keine Kategorie. Der Satz erscheint nur bei einer umlagefähigen Kategorie, die hier aus der KI-Attrappe kommen muss. Das galt schon vor diesem Diff, und die Vorrunde hat den Zustand geprüft.
