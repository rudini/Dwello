# Code-Review 1173, Runde 2 (Schlussrunde vor dem Push)

Bereich: `git diff 3107351 0f2d074 -- . ':!docs/reviews' ':!docs/design/personas'` (Commit 0f2d074), dazu `docs/design/personas/sven-1173.md` überflogen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geschlossen: keine offenen IDs aus `docs/reviews/1173-review-1.md` (dort keine Befunde).

Geprüft: `src/routes/+layout.svelte:58-64` setzt neben `aria-live="off"` auch `aria-hidden="true"` auf `#svelte-announcer`, genau wie Sven es vorschlägt; die eigene Ansage-Region (`page-title-announcer`, Z. 112) ist ein Geschwister und davon nicht betroffen. SvelteKit rendert die Attribute des Announcers statisch, ein späteres Rendern setzt `aria-hidden` also nicht zurück. Der erweiterte DOM-Test (`src/__tests__/layout-hydrated.dom.test.ts:84-99`) schlägt ohne die neue Zeile fehl (`aria-hidden` wäre `null`), Titel und Kommentar sagen, was er prüft. Kein neuer UI-Text, kein neuer Bildschirm und kein neuer Zustand, also keine Änderung an `messages/*.json` und `tests/a11y` nötig. Die Änderung betrifft nur den Accessibility-Tree; der DOM-Test ist die tiefste Schicht, die das zeigen kann, und die bestehenden Szenarien zu #1173 sagen weiterhin nur das Ergebnis an. Nichts im Diff hat keinen Bezug zur Anforderung.

## Nicht bestätigt

- bun run lint, bun run check, vitest `layout-hydrated.dom.test.ts` (7), E2E chromium `tenant-documents.feature` + `tenants.feature` (27 bestanden), Prettier auf neuen Dateien: vom Aufrufer gemeldet.
- Wie ein echter Screenreader im Lesemodus mit `aria-hidden` umgeht: nicht geprüft; Sven konnte ebenfalls keinen echten Screenreader starten (Bericht, «Nicht geprüft»).
