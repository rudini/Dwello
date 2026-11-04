# Code-Review 651, Runde 2 (Abschluss vor dem Push)

Delta: `git diff ab2ce7b dad0f9c -- . ':!docs/reviews'` (nur `src/lib/ui/MobileNav.svelte`, Zeilen 26–27).

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1

Geprüft: `new MediaQuery('min-width: 64rem')` entspricht `--breakpoint-lg: 64rem` von `lg:hidden`/`lg:block`; Svelte setzt die fehlenden Klammern selbst; der Kommentar stimmt; das Delta enthält nichts ausserhalb von C-1.

## Nicht bestätigt

- Ob die Abfrage bei grösserer Standardschrift wirklich mit `lg` zusammen umschaltet: Keine Testebene kann das zeigen. Der jsdom-Stub in `src/__tests__/shell.dom.test.ts:42` beachtet den Abfragetext nicht, und E2E läuft mit der Standardschrift. Bestätigt nur durch Lesen der Zeile.
- shell.dom.test.ts (18 bestanden) und Prettier auf MobileNav.svelte auf dad0f9c: vom Aufrufer gemeldet.
- Alle Unit-Tests, lint, check, navigation.feature (51) und die Zeilen axe/Sprachen für mobile-menu-open auf ab2ce7b: vom Aufrufer gemeldet.
