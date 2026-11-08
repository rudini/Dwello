# Code-Review #845, Abschlussrunde (Delta 1b390690..c87f3dd7)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| – | – | – | Keine Befunde |

Geprüft: `^tools/(?!ci/e2e-areas\.mjs$|e2e/)` lässt `tools/e2e/build-if-changed.mjs` (playwright.config.ts:150, auf CI immer ausgeführt) nicht mehr aus, `tools/e2e/build-if-changed.test.ts` bleibt über `\.test\.ts$` aussen vor; die neue Zeile in tools/ci/e2e-areas.test.ts:73 erwartet den Vollauf und fällt mit dem alten Muster (Datei ignoriert, nur Rechnungs-Features gewählt); docs/test-pyramid.md:105 sagt dasselbe. Weitere Einspeisungen in E2E-Läufe gesucht: playwright.config.ts startet sonst nur `backend/scripts`-Befehle (nicht ignoriert), `test:e2e` nutzt `svelte-kit sync`, `bddgen`, `playwright`; der E2E-Job in .github/workflows/ci.yml ruft unter `tools/` nur `tools/ci/e2e-areas.mjs` (schon ausgenommen); tests/e2e, vite/svelte/vitest-Konfiguration verweisen auf kein weiteres `tools/`-Skript. Wurzel-Konfigurationen (playwright.config.ts, package.json, paraglide.config.ts, *.config.*) stehen nicht in `ignore` und lösen den Vollauf aus.

## Nicht bestätigt

- vitest tools/ci (63), lint, prettier, testcheck audit: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Der rote Lauf der neuen Testzeile vor der json-Änderung: nur durch Lesen beurteilt (alter Ausschluss deckte `tools/e2e/` ab, also lieferte `filters` den Rechnungs-Filter statt `[]`).
