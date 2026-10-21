# Review #568 (8552249..a8f2c94), Runde 1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docker-compose.prod.yml:72, backend/src/__tests__/compose-prod.test.ts:3 | Der Kommentar sagt, ohne `MAIL_TRANSPORT` werde «every e-mail» als «zu versenden» abgelegt. Das gilt nur für Mahnungen (`reminder.service.ts:124`). Eine Nebenkostenabrechnung per E-Mail wird mit `STATEMENT_MAIL_NOT_CONFIGURED` abgelehnt und bleibt Entwurf (`statement-send.service.ts:48`). Der Kommentar ist also falsch. |
| C-2 | Minor | docker-compose.prod.yml:76 | Der Standardwert `SMTP_PORT=${SMTP_PORT:-587}` ist nicht getestet. Der Test prüft nur das Präfix `- KEY=${KEY`. Würde daraus `${SMTP_PORT:-}`, bliebe er grün, obwohl das Backend dann `Number('')` = Port 0 nutzt (`backend/src/mail/smtp.ts:11`). `docker compose config` lief nur mit gesetzten Werten aus `.env.example`, deckt den Fall «nicht gesetzt» also nicht ab. |

Keine Blocker oder Majors.

Geprüft: Das Backend erhält alle 8 Schlüssel, die `backend/src/mail/*` liest (`MAIL_TRANSPORT`, `MAIL_FROM`, `SMTP_HOST/PORT/SECURE/USER/PASSWORD`, `RESEND_API_KEY`). Die Standardwerte verhalten sich wie «nicht gesetzt»: `SMTP_SECURE === 'true'`, `required()` behandelt einen leeren String als fehlend, und `SMTP_USER` leer heisst keine Anmeldung. Der Test schlägt auf dem Basis-Commit fehl, denn dort fehlen alle 8 Schlüssel im Backend-Service. Seine Regex erfasst `env.X` und `required(env, 'X')`, und `.env.example` dokumentiert alle 8 Schlüssel (`RESEND_API_KEY` auskommentiert). Der Ausschnitt `backend:`…`postgres:` passt zur Reihenfolge der Services. «No scenario» ist im Commit begründet. `implementation_plan.md` ist Workflow-Pflege. Es gibt keine UI-Texte, Contracts oder a11y-Bildschirme, und nichts im Diff gehört nicht zur Anforderung. Ein Hinweis zum Verhalten: Wer `.env.example` unverändert übernimmt (dort ist `MAIL_TRANSPORT=smtp` mit Platzhalter-Host gesetzt), bekommt jetzt `MAIL_DELIVERY_FAILED` statt «zu versenden». Ausserdem nennt die Datenschutzerklärung jetzt den SMTP-Versand. Beides ist die beabsichtigte Folge davon, dass `.env` gilt.

## Nicht bestätigt

- `bun run lint`, `cd backend && bun run type-check`, `bun test src/__tests__/compose-prod.test.ts` (grün, und rot vor der Compose-Änderung) und `docker compose ... config` mit `.env.example`: vom Aufrufer gemeldet. Nicht erneut ausgeführt, weil der Preload des Backend-Tests `dwello_test` neu anlegt. Rot und grün habe ich durch Lesen von Test und Compose-Datei nachvollzogen.
- Dass tatsächlich eine E-Mail versendet wird, ist nur durch Lesen von `backend/src/mail/*` und der Compose-Datei belegt, nicht durch einen laufenden Container.
