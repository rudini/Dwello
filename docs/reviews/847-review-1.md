# Review #847, Slice 1 (683661b80..db518f627), Abschlussrunde vor dem Push

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Beurteilung der gestellten Fragen

- **«No scenario»:** trägt, aber mit dem passenden Punkt der Liste in `tests/e2e/CLAUDE.md:72` («how the UI shows a refusal its own checks never send»): Mit JavaScript lehnen `src/lib/invoice-upload.ts:87` und `TenantDocumentUpload.svelte:59` die Datei ab, bevor sie gesendet wird. Ein Kontext ohne JavaScript ist im Screenplay nicht vorgesehen (kein `javaScriptEnabled` in `tests/e2e`, `playwright.config.ts`), und `Navigate.to` wartet auf `body[data-hydrated]`. Die Begründung im Pull-Request-Text sollte diesen Punkt nennen, nicht nur «die Browser laufen mit JavaScript».
- **Fehlende a11y-/Sprachzeilen:** tragen. Die Fehlerseite steht schon in `tests/a11y/screens.json:190` (`error-404`) und in beiden Features (Zeile 32 bzw. 33). Die 413-Variante hat keine eigenen Bedienelemente, nur anderen Text (`src/routes/+error.svelte:34-41`), also braucht es nach CLAUDE.md («once per variant with its own controls») keine eigene Zeile. Ausserdem kann E2E den Zustand nicht erreichen.
- **`MAX_MEGABYTES` aus `invoice-upload.ts`:** richtig. Es ist der einzige exportierbare Wert im Frontend, und die Meldung entspricht wörtlich der Meldung der Upload-Prüfung (`invoice-upload.ts:87`). Die eigene Kopie in `TenantDocumentUpload.svelte:23` gab es schon vorher, und die Änderung macht sie nicht widersprüchlicher. Der Text «grösser als 10 MB» stimmt auch für den 413, der erst ab 11 MB kommt (ADR 0006).

Geprüft: alle 7 Dateien des Diffs. Die Schlüssel `error_413` stehen in allen vier `messages/*.json`, die Übersetzungen passen. Überschrift und Hinweis kommen über `hints[$page.status]`, ohne Rückfall auf «Versuchen Sie es später erneut.». Der neue Test in `src/__tests__/error-page.test.ts:39-45` schlägt ohne die Änderung fehl, weil dann «Payload Too Large» in der h1 steht. Es gibt keine weitere 413-Quelle in `src`. Der Commit-Betreff hat 49 Zeichen. Nach ponytail-review gibt es nichts zu kürzen («Lean already. Ship.»), und nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `error-page.test.ts` zuerst rot, dann grün; `bun run lint`; `bun run check`; vitest über 20 Dateien mit 744 bestandenen Tests.
- Ob SvelteKit bei einer Formular-Action ohne JavaScript für einen Body über BODY_SIZE_LIMIT wirklich die Wurzel-`+error.svelte` mit Status 413 zeigt: Ich habe das nur aus dem Verhalten von SvelteKit erschlossen (`get_raw_body` meldet `SvelteKitError(413)` beim Lesen in der Action), nicht im Code von `node_modules` nachgesehen (der Worktree hat keine `node_modules`). Es gibt keinen eigenen `handleError` in `src/hooks.server.ts` und nur eine `+error.svelte` (`src/routes/+error.svelte`).
- Dass fr/it/en auf der 413-Seite kein Deutsch zeigen, prüft kein Test. Ich habe nur die vier JSON-Einträge gelesen.
