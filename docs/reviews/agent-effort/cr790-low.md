# Code-Review #790a (ddce6ae..56635d3)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | package.json:55,69,75-79; backend/package.json:39,55-56 | Abhängigkeits-Updates ausserhalb der Anforderung (vite, fallow 3, Overrides cookie/postcss-selector-parser, nodemailer, mailparser, smtp-server) im selben Commit wie der Plugin-Wechsel |
| C-2 | Major | backend/src/__tests__/invoice-completeness.pg.test.ts:73 | Sichtbare Verhaltensänderung (unmögliches Datum: 400 mit Service-Code -> 422 `VALIDATION_ERROR`, auf allen 23 Routen mit `format: 'date'`) ohne Szenario und ohne `No scenario: <reason>`; bestehende Erwartung wurde angepasst statt als Spezifikationsänderung behandelt |
| C-3 | Minor | docs/api-specification.md:135 | Doku nennt für ungültige Periode weiter nur 400; ein unmögliches Datum ergibt jetzt 422 |
| C-4 | Minor | implementation_plan.md | Keine `## Session` mit den Punkten der Aufgabe (Workflow Schritt 8) |

## C-1
Die Anforderung ist Teil a von #790: API-Dokumentation mit `@elysiajs/openapi` und Schema-Validierung. Frontend-Updates (vite, fallow-Major-Sprung 2->3, npm-`overrides`) und Mail-Pakete gehören nicht dazu (CLAUDE.md: nichts ausserhalb der Anforderung). fallow 3 ist zudem ein Commit-Gate-Werkzeug; ein Major-Sprung kann die Gates anders urteilen lassen, ohne dass der Slice das prüft. Zeigen: `git diff ddce6ae 56635d3 -- package.json` enthält nichts, was der Plugin-Wechsel braucht. Abtrennen in eigenen Slice/PR (oder Teil b), falls #790 das dort verlangt.

## C-2
Vorher lieferte `periodStart=2025-02-30` die fachliche 400-Ablehnung des Service; jetzt lehnt das Schema global mit 422 `VALIDATION_ERROR` ab. Das gilt für alle Body-/Query-Felder mit `format: 'date'` (Verträge, Rechnungen, Abrechnungen), d.h. die Meldung, die die UI zeigt, ändert sich. Der Commit behandelt das als Nebeneffekt; es fehlt ein Szenario (oder ein begründetes `No scenario`) sowie ein Test auf Body-Ebene (z.B. Vertrag mit `startDate: '2025-02-30'`), der die neue Ablehnung festhält. Der Service-Zweig für ungültige Kalendertage ist damit möglicherweise toter Code.

## Nicht bestätigt
- Lint, Backend-Type-Check und betroffene Backend-Tests: vom Aufrufer gemeldet (nicht neu gelaufen; benötigt PostgreSQL).
- zod 3 -> 4: `z.string().email()` in backend/src/middleware/auth.ts:18 und backend/src/services/local-account.service.ts:23 ist in v4 strenger (anderes Regex); ob bestehende Konten/JWTs mit ungewöhnlichen Adressen abgewiesen werden, nicht geprüft.
- Ob die übrigen 22 `format: 'date'`-Routen bisher eigene Codes lieferten, die die UI übersetzt: nicht einzeln geprüft.

Geprüft: app.ts Plugin-Tausch und `exclude.paths`, api-docs.test.ts (Pin bestehenden Verhaltens, im Commit begründet), tech-stack.md.
