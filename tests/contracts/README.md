# API-Verträge zwischen BFF und Backend

Jede Datei ist eine Beispielantwort des Backends mit genau den Feldern, die das Frontend liest.

- Die Frontend-Unit-Tests antworten mit diesen Beispielen statt mit eigenen Fakes (z.B. `src/__tests__/statement-mapping.test.ts`).
- `backend/src/__tests__/api-contracts.pg.test.ts` prüft gegen die echte API, dass jedes Feld des Beispiels mit demselben JSON-Typ geliefert wird.

Optionale Felder sind in den Testdaten gefüllt: Liefert die API `null`, prüft der Test den Typ nicht.

Ändert das Backend ein Feld, scheitert der Vertragstest; braucht das Frontend ein neues Feld, kommt es zuerst ins Beispiel.

| Datei | Endpunkt |
|---|---|
| `statement.json` | `GET /api/v1/statements/:id` |
| `building-contracts.json` | `GET /api/v1/contracts?buildingId=…` |
| `statement-preview.json` | `POST /api/v1/statements/preview` |
| `invoice.json` | `GET /api/v1/invoices/:id` |
| `building.json` | `GET /api/v1/buildings/:id` |
| `tenant.json` | `GET /api/v1/tenants/:id` |
