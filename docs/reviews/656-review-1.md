# Code-Review #656, Runde 1 (Commit 0052436, `git diff origin/main 0052436`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | src/__tests__/public-pages-layout.dom.test.ts:34 (verursacht von src/routes/+layout.svelte:115) | Der Test prüft noch `querySelector('header')` null; das neue `<header>` im öffentlichen Layout macht alle drei Fälle «%s hat ohne Kopfzeile denselben Rand wie mit Kopfzeile» rot. Der Aufrufer hat die Datei nicht laufen lassen. |
| C-2 | Major | tests/a11y/screens.json:128, accessibility.feature, sprachen-bildschirme.feature | Die Erfolgsmeldung «Sprache: …» nach dem Sprachwechsel ist ein neuer UI-Zustand (Vorbild: `saved-toast`) und hat keine Zeile. Die bestehenden `other-language`-Zeilen sehen sie nur in der ersten Variante, und die Beschreibung des Zustands stimmt nicht mehr. |
| C-3 | Minor | src/lib/ui/LanguageSwitcher.svelte:24-31 | `choose()` setzt das sessionStorage-Flag auch dann, wenn die Seite nicht neu lädt: bei der Sprache, die schon gilt (Paraglide 2.29.3 lädt nur bei `newLocale !== currentLocale` neu, `set-locale.js` ab Zeile 159), oder wenn der Wechsel abgebrochen wird. Das Flag bleibt dann liegen. Beim nächsten Einhängen der Sprachwahl erscheint «Sprache: Deutsch», und der Fokus springt auf die Sprachwahl, ohne dass jemand die Sprache gewechselt hat. Das Einhängen geschieht beim nächsten vollen Laden oder beim Wechsel zwischen öffentlichem und angemeldetem Layout, z. B. nach dem Abmelden mit `goto('/login')`. Dazu fehlt ein Test. |

## C-1 (Blocker)

`src/routes/+layout.svelte:115` ersetzt das `<div>` über den öffentlichen Seiten durch `<header>`. In `src/__tests__/public-pages-layout.dom.test.ts:31-38` (`it.each(['/help', '/privacy', '/terms'])`) steht weiterhin `expect(document.querySelector('header')).toBeNull();`. Auf jeder der drei Seiten findet das jetzt das neue `<header>`, und der Test schlägt fehl. CI läuft rot.

Der Aufrufer hat diesen Fehler in `language-switcher.dom.test.ts` behoben, diese zweite Stelle aber übersehen. Gelaufen sind nur `shell.dom.test.ts` und `language-switcher.dom.test.ts`, obwohl `public-pages-layout.dom.test.ts` die geänderte Datei `+layout.svelte` einhängt. Mit `bunx vitest run src/__tests__/public-pages-layout.dom.test.ts` lässt sich das zeigen.

Fix wie im anderen Test: prüfen, dass die Kopfzeile der App fehlt (`header-logo` und `user-menu-button` null), statt dass gar kein `<header>` da ist. Der Titel des Tests passt dann weiter.

## C-2 (Major)

Nach `CLAUDE.md`, "Design-Regeln/Process", gehört jeder neue Zustand in `tests/a11y/screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Das gilt auch, wenn ein bestehender Zustand dadurch eine andere Variante zeigt. Das Repo führt eine Erfolgsmeldung auf einer Seite als eigenen Zustand (`saved-toast`, screens.json:126). Die neue Meldung, die die Sprache nennt, ist so ein Zustand.

Indirekt abgedeckt ist sie nur teilweise. `tests/e2e/tasks/accessibility.ts:341-345` (`other-language`) klickt die französische Option nur, wenn die Seite noch nicht französisch ist, also nur in der ersten Variante von `checkAccessibilityOf`. Die späteren Varianten laden ohne Flag und zeigen keine Meldung. `checkLanguagesOf` setzt die Sprache vorher und sieht die Meldung nie. axe prüft die Meldung also auf einem einzigen Viewport in einem Farbschema, die Prüfung auf Deutsch für fr/it/en gar nicht. Die Beschreibung in screens.json:128 nennt die Meldung nicht.

Der Fix: einen Zustand (z. B. `language-changed`) mit Bedeutung und Zeilen für die Orte anlegen, an denen die Sprachwahl steht: die Kopfzeile der App (z. B. dashboard) und das öffentliche Layout (z. B. login oder help). Der Zustand muss in jeder Variante die Option wählen. Eine andere Möglichkeit ist, `other-language` so zu ändern, dass jede Variante die Meldung zeigt, und seine Bedeutung nachzuführen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run src/__tests__/shell.dom.test.ts src/__tests__/language-switcher.dom.test.ts` (31 grün), E2E chromium navigation.feature + sprachen.feature (80 grün), jedes neue Szenario vorher rot gesehen, Prettier.
- Nicht gelaufen: `public-pages-layout.dom.test.ts`, `layout-hydrated.dom.test.ts` und `ui-layout-parts.dom.test.ts`, die das Layout oder die Fusszeile einhängen. C-1 habe ich nur durch Lesen festgestellt. Die beiden anderen Dateien mocken `$page.url`, ich erwarte dort keinen Bruch.
- Ob ein Screenreader die Meldung ansagt, wenn gleichzeitig der Fokus auf die Sprachwahl geht (der Name der Sprachwahl enthält schon «Sprache: …»), kann ich ohne Browser nicht prüfen. ToastRegion fügt die Meldung 500 ms später in die Status-Region ein, die schon da ist (`src/lib/ui/ToastRegion.svelte:22-35`).
- Ob Seiten, die beim Einhängen selbst fokussieren, den Fokus nach dem Neuladen wieder wegnehmen. Beim Lesen der `focus()`-Stellen in `src/routes` (Wizards, statements) habe ich keinen Mount-Fokus gefunden; im E2E-Test ist nur `/help` abgedeckt.

Geprüft: `menu-keys.ts` als gemeinsamer Helfer (ersetzt die Kopie in LanguageSwitcher, ponytail: nichts zu kürzen); die Tasten im Benutzermenü, auch das Öffnen vom geschlossenen Knopf aus, mit DOM-Test und Szenario; `aria-current` in der Fusszeile mit DOM-Test und Szenario; `<header>` als Landmark `banner` mit Szenario; die Meldung nutzt das bestehende `language_prefix` in allen vier `messages/*.json`; Screenplay-Schichten, Targets, Fragen nach Wert oder Anzahl; die Rot-Prüfung der neuen Tests durch Lesen (der Test, der beibehaltenes Verhalten festhält, ist in der Commit-Message genannt); keine fremden Änderungen im Diff.
