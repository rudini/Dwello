# API-Verträge zwischen BFF und Backend

Jede Datei ist eine Beispielantwort des Backends mit genau den Feldern, die das Frontend liest.

- Die Frontend-Unit-Tests antworten mit diesen Beispielen statt mit eigenen Fakes (z.B. `src/__tests__/statement-mapping.test.ts`).
- `backend/src/__tests__/api-contracts.pg.test.ts` prüft gegen die echte API, dass jedes Feld des Beispiels mit demselben JSON-Typ geliefert wird.

Optionale Felder sind in den Testdaten gefüllt: Liefert die API `null`, prüft der Test den Typ nicht.

Eine Zählung mit `count(*)` in Drizzles `sql<number>` liefert PostgreSQL als String, trotz des Typs. Wandelt der Service sie nicht mit `Number()` (wie `building.service.ts`), steht sie im Beispiel als String (`category.json`), und das Frontend wandelt sie.

Ändert das Backend ein Feld, scheitert der Vertragstest; braucht das Frontend ein neues Feld, kommt es zuerst ins Beispiel.

| Datei | Endpunkt |
|---|---|
| `statement.json` | `GET /api/v1/statements/:id` |
| `statement-payment-reset.json` | `POST /api/v1/statements/:id/payment-reset` (die Abrechnung mit dem Zurücksetzen im Verlauf) |
| `statement-paid-date-refused.json` | `PUT /api/v1/statements/:id/status` mit einem Zahlungsdatum vor dem Abrechnungsdatum |
| `statement-send-refused.json` | `POST /api/v1/statements/:id/send`, wenn die E-Mail an einen Mieter mit Korrespondenzkanal E-Mail nicht hinausgeht (400) |
| `building-contracts.json` | `GET /api/v1/contracts?buildingId=…` |
| `contract-agreements.json` | `GET /api/v1/contracts/:id/agreements?periodStart=…&periodEnd=…` (Kategorien mit Kosten in der Periode und ob der Mietvertrag sie vereinbart, #91) |
| `contracts.json` | `GET /api/v1/contracts` (Mietvertragsliste, Übersicht) |
| `apartments.json` | `GET /api/v1/apartments` (Wohnungsliste, Gebäude, Übersicht) |
| `period-statements.json` | `GET /api/v1/statements?periodStart=…&periodEnd=…` (Übersicht), `?contractId=…` (fehlende Abrechnungen am Mietvertrag, Abrechnungen, die sein Löschen sperren) |
| `heating-profiles.json` | `GET /api/v1/heating-profiles` (Namen der Heizprofile und wann sie zuletzt bearbeitet wurden, Vorschau des Assistenten) |
| `statement-preview.json` | `POST /api/v1/statements/preview` |
| `statement-changed-invoices.json` | `GET /api/v1/statements/:id/changed-invoices` (Rechnungen der Periode, die die Abrechnung nicht so abrechnet, wie sie jetzt sind) |
| `invoice-statements.json` | `GET /api/v1/invoices/:id/statements` (Perioden mit Abrechnungen mit und ohne diese Rechnung) |
| `invoice-completeness.json` | `GET /api/v1/invoices/completeness/:buildingId` |
| `invoice.json` | `GET /api/v1/invoices/:id` |
| `invoice-extraction.json` | `POST /api/v1/invoices/extract` (was die KI aus einer hochgeladenen Datei liest) |
| `building.json` | `GET /api/v1/buildings/:id` |
| `fuel-stocks.json` | `GET /api/v1/buildings/:id/fuel-stocks` |
| `tenant.json` | `GET /api/v1/tenants/:id` |
| `buildings.json` | `GET /api/v1/buildings` |
| `tenants.json` | `GET /api/v1/tenants` |
| `config.json` | `GET /api/v1/config` (Einstellungen, Übersicht) |
| `category.json` | `GET /api/v1/categories/:id` (eigene Kategorie) |
| `category-proposal.json` | `POST /api/v1/categories/propose` (Vorschlag der KI für eine neue Kategorie) |
| `documents.json` | `GET /api/v1/documents` (Dokumente eines Mieters, Dokumentenliste) |
| `mail-transport.json` | `GET /api/v1/mail-transport` (Mailversand für die Datenschutzerklärung) |
| `document-not-deletable.json` | `DELETE /api/v1/documents/:id` einer Mahnung (409) |
| `document-uploaded.json` | `POST /api/v1/tenants/:id/documents` (Dokument hochladen) |
| `document-refused.json` | `POST /api/v1/tenants/:id/documents` mit einer zu grossen Datei (400) |
| `contract-end-refused.json` | `PUT /api/v1/contracts/:id` mit Vertragsdaten, die die abgerechneten Tage einer Abrechnung ändern (409) |
| `contract-delete-refused.json` | `DELETE /api/v1/contracts/:id?confirmMistake=true` eines Mietvertrags mit Abrechnung (409) |
| `statement-pdf-refused.json` | `GET /api/v1/statements/:id/pdf` einer Abrechnung, die es nicht gibt (404) |
| `statement-pdf-creditor-refused.json` | `POST /api/v1/statements/:id/generate-pdf` einer Abrechnung mit Zahlteil, solange Name, PLZ oder Ort der Firmenadresse fehlen (400, #450); dieselbe Antwort gibt `PUT /api/v1/documents/:id/sent` einer Mahnung «Zu versenden» (`reminders.pg.test.ts`) |
| `statement-calculation-refused.json` | `POST /api/v1/statements/preview` für einen Mietvertrag, den die Berechnung nicht lesen kann (400) |
| `statement-pdf-failed.json` | `POST /api/v1/statements/:id/generate-pdf`, die aus einem unerwarteten Grund scheitert (500) |
| `validation-refused.json` | jede Anfrage, die das Schema verletzt, z.B. `POST /api/v1/statements/preview` mit einer Zahl als `contractId` (422) |
| `audit-log.json` | `GET /api/v1/audit-log` (Protokoll unter «Einstellungen», neuste zuerst) |
| `tenant-export.json` | `GET /api/v1/tenants/:id/export` (#435: Name der ZIP-Datei, ihre Datendatei und ihre Dateien; das BFF schreibt `data` unverändert) |
