# Review #568 (a8f2c94..81a9169), Runde 2 (Abschlussrunde)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docker-compose.prod.yml:72, backend/src/__tests__/compose-prod.test.ts:3 | **Behoben.** Der Compose-Kommentar trennt jetzt Mahnungen («zu versenden», `reminder.service.ts:123-125`) von Abrechnungen («not sent»). Abrechnungen werden mit `STATEMENT_MAIL_NOT_CONFIGURED` abgelehnt (`statement-send.service.ts:48`). Der Testkopf sagt «no e-mail reaches a tenant», und das stimmt für beide Fälle. |
| C-2 | Minor | backend/src/__tests__/compose-prod.test.ts:35-37 | **Behoben.** Der neue Test verlangt wörtlich `- SMTP_PORT=${SMTP_PORT:-587}`. Mit `${SMTP_PORT:-}` schlägt er fehl, das ergibt sich schon beim Lesen. Er passt zu docker-compose.prod.yml:76. |

Neue Befunde im Delta: keine. Keine Blocker oder Majors offen.

Geprüft: Das Delta ändert nur einen YAML-Kommentar, den Kommentar im Testkopf und fügt einen Test hinzu. Nichts davon gehört nicht zur Anforderung. Der Testname ist deutsch, und die Commit-Nachricht hat 47 Zeichen im Conventional-Commits-Format.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/compose-prod.test.ts` (3 grün; der neue Test war mit `${SMTP_PORT:-}` rot): vom Aufrufer gemeldet. Nicht erneut ausgeführt, weil der Preload `dwello_test` neu anlegt.
- Lint, `bun run type-check` und `bun run check`: vom Aufrufer gemeldet, und zwar für den vorherigen Commit a8f2c94, nicht für 81a9169.
