# Code-Review #656, Runde 2 (Delta `git diff 0052436 cd4de24 -- . ':!docs'`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2, C-3

- C-1: `src/__tests__/public-pages-layout.dom.test.ts:39` prüft jetzt `header-logo` null statt «kein `<header>`». Das Store-Double (Zeilen 6-20) benachrichtigt jeden Abonnenten, also auch die Fusszeile.
- C-2: Den Zustand `language-changed` gibt es jetzt mit Bedeutung (`tests/a11y/screens.json:129`) für login und dashboard (`screens.json:174`, `:228`). Er hat Zeilen in `accessibility.feature:27`, `:47` und `sprachen-bildschirme.feature:28`, `:48`. Die Task `tests/e2e/tasks/accessibility.ts:347-353` wechselt die Sprache in jeder Variante neu und wartet auf die Meldung. In den Zeilen für die Sprachen bleibt dabei die Sprache der Seite gleich: zuerst auf Deutsch, dann zurück zur Sprache der Seite. `Click.toReload` wartet auf `load` und auf die Hydrierung (`tests/e2e/screenplay/interactions.ts:56-59`). Deshalb trifft `Wait.until(savedToast)` nicht noch die Meldung der Seite davor.
- C-3: `src/lib/ui/LanguageSwitcher.svelte:25`: Wer die Sprache wählt, die schon gilt, schliesst nur die Liste. Das Flag wird nicht gesetzt und `setLocale` nicht aufgerufen. Der DOM-Test `language-switcher.dom.test.ts:72-85` wäre ohne die Zeile rot gewesen (`setLocale` aufgerufen, Meldung beim nächsten Einhängen). Der Fall «Wechsel abgebrochen» kommt in der App nicht vor: Es gibt in `src` weder `beforeunload` noch `beforeNavigate`.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`; `bunx vitest run --changed origin/main` (52 grün); `bunx vitest run tests/unit/a11y-screens.test.ts tests/unit/i18n-screens.test.ts` (5 grün); `language-switcher.dom.test.ts` (11 grün); E2E chromium `accessibility.feature` und `sprachen-bildschirme.feature` mit `-g language-changed` (4 grün). Der Aufrufer weiss selbst nicht sicher, ob `public-pages-layout.dom.test.ts` unter den 52 war. Die Datei hängt `+layout.svelte` ein. Ich habe nur gelesen, dass sie jetzt grün sein sollte.
- `bun run check` hat der Aufrufer für cd4de24 nicht gemeldet. Neu ist dort `languageName` mit dem Non-null-Assert `!` (`tests/e2e/questions/language.ts:8`). Ich erwarte dort keinen Fehler, geprüft ist es aber nicht.
- Die Ansage der Meldung durch einen Screenreader, während der Fokus auf der Sprachwahl liegt: Das geht ohne Browser nicht (wie in Runde 1).

Geprüft: Rot-Prüfung des neuen DOM-Tests durch Lesen; Screenplay-Schichten der neuen Task (nur Tasks, Fragen und Targets); keine fremden Änderungen im Delta.
