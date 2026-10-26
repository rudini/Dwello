# Code-Review #790 Teil a (ddce6ae..56635d3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/package.json:31 | Formatierung einer nicht berührten Zeile (`"e2e-purge-statements":"bun …"` → mit Leerzeichen), gehört nicht zur Anforderung |
| C-2 | Minor | backend/src/routes/invoices.ts:198 | `!isRealDate(query.periodStart) \|\| !isRealDate(query.periodEnd)` ist jetzt toter Code: das Schema (`format: 'date'`, Z. 206) weist einen nicht existierenden Tag schon mit 422 ab; der 400-Text «must be existing dates» trifft nur noch für «Ende vor Beginn» zu |
| C-3 | Minor | backend/src/services/real-date.ts:1 | Kommentar «Elysia's format 'date' lets 2025-02-30 and 2025-1-1 through» ist seit dem Plugin-Wechsel falsch (beides gibt jetzt 422) |
| C-4 | Minor | docs/api-specification.md:278 | `PUT /statements/:id`: «400 date that does not exist» stimmt nicht mehr; `paymentDeadline` hat `format: 'date'`, ein Tag wie 2025-02-30 gibt jetzt 422 `VALIDATION_ERROR` |

## C-1 (Major)

Warum: `CLAUDE.md` und der Prüfauftrag verlangen, dass nichts im Diff ohne Bezug zur Anforderung ist, ausdrücklich auch Formatierung unberührter Zeilen. Die Zeile `"e2e-purge-statements"` hat mit dem Plugin-Wechsel und den Abhängigkeiten nichts zu tun (vermutlich hat `bun add`/`bun remove` die Datei neu geschrieben).
Nachweis: `git diff ddce6ae 56635d3 -- backend/package.json`, erster Hunk, Zeile 31. Behebung: Zeile auf den Stand von ddce6ae zurücksetzen.

## Anmerkung zur Verhaltensänderung (kein Befund)

Ein Verhaltenstest bestätigt die Aussage der Commit-Message: Schon der Import von `@elysiajs/openapi` macht `t.String({ format: 'date' })` global strikt. Geprüft wurde das mit `bun -e` gegen eine leere Elysia-App, einmal vor und einmal nach dem Import. Vorher kamen 2025-02-30, 2025-1-1, 2025-02-29 und `2025-01-01T00:00:00.000Z` mit 200 durch, nachher bekommen alle vier 422. Betroffen sind alle 24 Datumsfelder der Routen. Im BFF fand ich keinen Aufrufer, der Zeitstempel oder ungepolsterte Tage sendet. Die Bearbeitung der Abrechnung zeigt bei jedem Fehler denselben Text (`statements_save_failed`). Die Vollständigkeitsprüfung schluckt Fehler (`.catch`). Die Landlord-Oberfläche ändert sich also nicht sichtbar, und ein Szenario ist nicht nötig.

## Nicht bestätigt

- Lint, Backend-Type-Check und «betroffene Backend-Tests» auf 56635d3: vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich `api-docs.test.ts`, `invoice-completeness`, `api-contracts`, `contract-advance`, `statement-lock`, `fuel-stock` und `statement-run`: 178 grün. Dabei liefen die node_modules der neueren Checkouts, nicht der Lockfile-Stand des Commits.
- Frontend: Für `bunx vitest run`, `bun run check` und E2E liegt keine Meldung vor, obwohl sich vite (6.4.5) und das Override `cookie` 0.7 ändern. Letzteres betrifft SvelteKit zur Laufzeit. Der Override `postcss-selector-parser` 7 liegt ausserhalb des deklarierten Bereichs `^6` von `eslint-plugin-svelte` 2.46.1, und nur Lint deckt ihn ab. Mit den verlinkten neueren node_modules liess sich das nicht aussagekräftig nachprüfen.
- fallow 3.35 (Major-Sprung) mit `.fallowrc.json` und `bunx fallow audit` (CI, Commit-Hook): nicht ausgeführt.
- Rotlauf von `api-docs.test.ts` auf dem Basis-Commit (`@elysiajs/swagger` 1.3.1): Laut Commit läuft der Test dort grün (gepinntes Verhalten). Das liess sich nicht prüfen, weil die Abhängigkeiten der Basis nicht installiert sind. `node_modules` kann ich nicht lesen (Deny-Regel).
- Anforderung «Teil a»: `implementation_plan.md` auf 56635d3 enthält keine Session zu #790. Deshalb konnte ich die Teilung nicht prüfen. Die Anpassungen an zod, nodemailer/mailparser/smtp-server, vite, fallow und den Overrides habe ich den Dependabot-Alerts aus #790 zugeordnet. `bun audit` auf den Lockfiles von ddce6ae zeigt genau diese Advisories, auf 56635d3 sind sie weg. Offen bleiben zwei SvelteKit-Advisories mit Stufe «low» (<3.0.0). Ob sie in einem anderen Teil von #790 behandelt werden, ist offen.
- `No scenario: <reason>` im Pull Request, der #790 schliesst: nicht einsehbar.

Geprüft: Plugin-Konfiguration (`exclude: { paths }`, `/swagger`, `/swagger/json` ohne Anmeldung), Nutzung von zod 4 (`auth.ts`, `local-account.service.ts`), angepasster 422-Test (ohne die Änderung rot), Commit-Message, tech-stack.md.
