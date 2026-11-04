# Code-Review 6 (Abschlussrunde), #1096 / PR #1114, `71a92d160..4d287f6e3`

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/ToastRegion.svelte:73 | `onresize` ist eine geänderte Zeile ohne eigenen Test: der neue DOM-Test löst nur `scroll` aus; ohne den `onresize`-Handler bliebe er grün. Ein zweiter Fall mit `window.dispatchEvent(new Event('resize'))` (oder ein `it.each` über `scroll`/`resize`) im Test in `src/__tests__/ui-layout-parts.dom.test.ts:141` würde ihn decken. |

Keine Blocker, keine Major.

Geprüft: Korrektheit von `place()` bei Scroll/Resize (Handler nur zählend in `untrack`, wie `onfocusin`); der neue Test ist ohne die Änderung rot (`moved` ändert sich ohne `onscroll` nicht, `atTop` bleibt `false`, Klasse `bottom-4`) und rechnet mit jsdom-`innerHeight` 768 richtig (740/760 gegen Schwelle 736). Kosten: pro Scroll-Ereignis (im Browser höchstens einmal pro Frame) läuft der Effekt; ohne sichtbare Bestätigung endet `place()` vor jedem Layout-Zugriff, mit Bestätigung zwei `getBoundingClientRect` – vertretbar. Ponytail-Review: kürzester Weg (gleicher Zähler, umbenannt), nichts Ungenutztes, nichts Fremdes im Diff. Keine UI-Texte, keine neuen Bildschirme, kein Szenario-Bedarf über die vorhandenen Toast-/Fokus-Szenarien hinaus (Verhalten bleibt dasselbe, nur öfter ausgewertet).

## Nicht bestätigt

- Lint, svelte-check, Layout-DOM-Tests (19 bestanden), Chromium-E2E der Toast- und Fokus-Szenarien (10 bestanden): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Scrollen in inneren Containern (`Table.svelte:24` `overflow-x-auto`, Navigationen) löst kein `scroll` auf `window` aus; ein fokussierter Teil, der dort waagrecht unter die Meldung wandert, wird nicht neu geprüft. Seitenlayout scrollt im Fenster (`src/routes/+layout.svelte:97`, `min-h-screen`), Dialoge liegen in der Top-Layer; ob der waagrechte Fall in einer Tabelle real unter die Meldung führt, nicht im Browser geprüft.
- Kein eigener Worktree genannt; gelesen nur über `git show 4d287f6e3:<pfad>` bzw. `git diff`, nicht aus dem Arbeitsbaum.
