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
| `building-contracts.json` | `GET /api/v1/contracts?buildingId=…` |
| `contracts.json` | `GET /api/v1/contracts` (Mietvertragsliste, Übersicht) |
| `apartments.json` | `GET /api/v1/apartments` (Wohnungsliste, Gebäude, Übersicht) |
| `period-statements.json` | `GET /api/v1/statements?periodStart=…&periodEnd=…` (Übersicht), `?contractId=…` (fehlende Abrechnungen am Mietvertrag, Abrechnungen, die sein Löschen sperren) |
| `statement-preview.json` | `POST /api/v1/statements/preview` |
| `invoice-completeness.json` | `GET /api/v1/invoices/completeness/:buildingId` |
| `invoice.json` | `GET /api/v1/invoices/:id` |
| `invoice-extraction.json` | `POST /api/v1/invoices/extract` (was die KI aus einer hochgeladenen Datei liest) |
| `building.json` | `GET /api/v1/buildings/:id` |
| `fuel-stocks.json` | `GET /api/v1/buildings/:id/fuel-stocks` |
| `tenant.json` | `GET /api/v1/tenants/:id` |
| `buildings.json` | `GET /api/v1/buildings` |
| `tenants.json` | `GET /api/v1/tenants` |
| `category.json` | `GET /api/v1/categories/:id` (eigene Kategorie) |
| `category-proposal.json` | `POST /api/v1/categories/propose` (Vorschlag der KI für eine neue Kategorie) |
| `documents.json` | `GET /api/v1/documents` (Dokumente eines Mieters, Dokumentenliste) |
| `document-not-deletable.json` | `DELETE /api/v1/documents/:id` einer Mahnung (409) |
| `document-uploaded.json` | `POST /api/v1/tenants/:id/documents` (Dokument hochladen) |
| `document-refused.json` | `POST /api/v1/tenants/:id/documents` mit einer zu grossen Datei (400) |
| `contract-end-refused.json` | `PUT /api/v1/contracts/:id` mit Vertragsdaten, die die abgerechneten Tage einer Abrechnung ändern (409) |
| `contract-delete-refused.json` | `DELETE /api/v1/contracts/:id?confirmMistake=true` eines Mietvertrags mit Abrechnung (409) |
| `statement-pdf-refused.json` | `GET /api/v1/statements/:id/pdf` einer Abrechnung, die es nicht gibt (404) |
| `statement-calculation-refused.json` | `POST /api/v1/statements/preview` für einen Mietvertrag, den die Berechnung nicht lesen kann (400) |
| `statement-pdf-failed.json` | `POST /api/v1/statements/:id/generate-pdf`, die aus einem unerwarteten Grund scheitert (500) |
| `validation-refused.json` | jede Anfrage, die das Schema verletzt, z.B. `POST /api/v1/statements/preview` mit einer Zahl als `contractId` (422) |
