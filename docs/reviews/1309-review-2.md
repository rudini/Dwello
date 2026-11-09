# Code-Review #1309 / #1310 / #1315 / #1323 / #1331, Runde 2 (Schlussrunde, 5a78e0b..7ee611a)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/held-invoices.ts:36-39 | offen aus Runde 1 (Veränderung Tankbestand von 0.00 hält an) |
| C-2 | Minor | backend/src/services/fuel-stock.service.ts:80, held-invoices.ts:39 | offen aus Runde 1 (Standard-Verteilschlüssel ohne Lieferung hält nicht an) |
| C-4 | Minor | backend/src/services/statement-invoices.service.ts:113, src/routes/statements/[id]/LaterChanges.svelte:50 | `uncalculableKeys` gibt bei `invoices` das `fuelStock` der Lieferung nicht mit. Stammt die Lieferung, deren Verteilschlüssel die Veränderung Tankbestand verteilt, aus einer anderen Periode (#1323), zeigt der Hinweis auf der Abrechnung 2024 eine Rechnung von 2023 unter «Der Verteilschlüssel einiger Rechnungen …» ohne die Bemerkung, mit der die Vorschau genau diesen Fall erklärt (`note`, `statements_key_not_calculable_fuel_stock`). Kein Test für diesen Fall auf der Detailseite |
| C-5 | Minor | tests/contracts/statement-changed-invoices.json:4 | Die Antwort von `GET /statements/:id/changed-invoices` hat neu `uncalculableKeys[].invoices`, der Contract hält aber nur `"uncalculableKeys": []`. `api-contracts.pg.test.ts:191` prüft darum die Form der Einträge nicht (weder `key`/`reason`/`apartment` noch `invoices`), und der DOM-Test (`statement-pages.dom.test.ts:900-907`) baut die Einträge von Hand statt aus dem Contract (CLAUDE.md, Gotchas «API contracts»). Die Form ist nur im pg-Test `statement-key-failure.pg.test.ts:214-227` festgehalten |

Keine Blocker, keine Majors.

Geschlossen: C-3.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check` (grün auf 7ee611a); vitest `statement-pages.dom` und `statement-wizard.dom` (382) auf 7ee611a; volles vitest (4671) und Backend `bun run test` (2168, Coverage) nur auf ac684d3, also vor dem Umbau zu `HintedInvoices.svelte`; E2E chromium `statement-generate.feature` und `statement-detail.feature` (254) und accessibility/sprachen `-g "uncalculable|late|uncategorized|heating-without"` (14) auf 7ee611a.
- Rot gesehen habe ich nichts. Beim Lesen schlägt jeder neue Test ohne die Änderung fehl: der DOM-Test findet keinen Link im Hinweis, der pg-Test vergleicht den Eintrag mit `invoices` exakt, das neue Szenario und der neue Schritt in «… hält die Abrechnung an» finden `statement-later-key-invoice` nicht.
- Das Szenario «Rechnung mit einem nicht berechenbaren Verteilschlüssel aus der Abrechnung öffnen» prüft nur, dass «Rechnung bearbeiten» offen ist, nicht die richtige Rechnung und nicht den Rückweg zur Abrechnung; `returnTo` ist nur im DOM-Test (`href`) belegt.
- Merge ac684d3: `apartmentsOf` ist unverändert die Fassung von main (mit `number` und `discontinuedFrom`), die beiden E2E-Dateien behalten beide Seiten. Nicht geprüft habe ich das Zusammenspiel mit #1284 jenseits der Konfliktauflösung: `keyFailure` (`held-invoices.ts:19-24`) rechnet den Verteilschlüssel über alle Wohnungen, auch über die mit «Aufgehoben ab» vor der Periode, die Berechnung (`calculation.service.ts:367`, `lineByParts`) nur über die je Teil zählenden. Ob ein Verteilschlüssel, der nur an einer aufgehobenen Wohnung scheitert (oder nur über die zählenden), dadurch falsch anhält oder nicht anhält, ist durch keinen Test belegt.
- Abgelehnte Persona-Befunde (Anna P-2, P-3, Dr. Weber P-1) habe ich nicht am Code nachgeprüft; Dr. Weber P-3 liegt als Produktentscheid in #1333.

Geprüft: fd22663 wörtlich gleich dem Entscheid in #1331 (Option A, Code-Spalte `uncalculableKeys`); d18f415 und 7ee611a vollständig (Backend-Dienst, Mapper-Typ, `HintedInvoices.svelte` ersetzt die Liste in `InvoiceHint.svelte` ohne Verhaltensänderung, `returnTo` dort weiterhin einmal kodiert, 48-px-Links, Tokens, kein neuer Text, `data-testid` von `a` auf `li` verschoben und Target mit `getByRole('link')` nachgeführt); API-Doku (C-3) vollständig; Screenplay-Schichten, Frage liefert den Text, Aufgabe wartet auf die URL; Szenario ohne «klickt»; bestehende Zeilen `statement-uncalculable-*-detail` decken den Hinweis mit Links ab; ponytail-review: nichts Unbenutztes, die Kopie der Liste ist mit 7ee611a aufgelöst.
