# Review #890 (PR #892), Runde 3: CI-Fix Architecture fitness (9463231c..8511d2fe)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/fitness/ratchet.json:381 | Die Ausnahme `consumption|deviation|gap|missing|new|stock|tank` (files: 2) ist nach dem Fix verwaltet: Die Liste steht nur noch in `backend/src/api/invoice.ts`. `tighten` entfernt sie nur bei `bun run fitness -- --update`, CI regeneriert nichts; `docs/architecture/fitness-functions.md` §2 «Verbesserung festschreiben» verlangt, das Ergebnis mit der Verbesserung zu committen. Solange der Eintrag bleibt, dürfte eine spätere Änderung die alte Liste wieder in zwei Schichten abschreiben, ohne dass der Check rot wird. Fix: `bun run fitness -- --update` laufen lassen und den Diff von `ratchet.json` (nur dieser Eintrag erwartet) mitcommitten. |

Antwort auf die Frage: Das Werkzeug regeneriert `ratchet.json` nicht selbst; entfernen mit `bun run fitness -- --update` (siehe C-1).

Geprüft: alle vier geänderten Dateien; die Liste ist nur noch einmal deklariert (`backend/src/api/invoice.ts:36`), Werte unverändert gegenüber den beiden alten Deklarationen; `import type` aus `backend/src/api` wie in `src/lib/types.ts`, zur Laufzeit gelöscht; Test-Helfer `finding` mit `CategoryFinding['kind']` typgleich, Verhalten der App unverändert (kein Szenario, kein Rot-Lauf nötig); nichts Fremdes im Diff.

## Nicht bestätigt
- `bun run fitness` (läuft durch, cross-layer value lists 9, boundary imports 0), `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` von statement-wizard.test.ts, statement-wizard.dom.test.ts, statements-i18n.test.ts (145 bestanden), Prettier: vom Aufrufer gemeldet, nicht neu gestartet (fitness schreibt in ein Temp-Verzeichnis; der Rest ändert nichts am Urteil).
