# Code-Review #1309 / #1310 / #1315 / #1323 / #1331 / #1333 / #1336, Runde 4 (Schlussrunde, Delta 58270f7..0aa5a55)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/held-invoices.ts (Stand Runde 1) | offen aus Runde 1: Eine Veränderung Tankbestand von 0.00 hält den Lauf an |
| C-2 | Minor | backend/src/services/fuel-stock.service.ts:80, held-invoices.ts | offen aus Runde 1: Ein Standard-Verteilschlüssel ohne Lieferung hält den Lauf nicht an |
| C-9 | Minor | backend/src/services/held-invoices.ts:34-42 | offen aus Runde 3: Die Prüfung rechnet jeden Teil der Periode, die Berechnung (`partShare`) nur die Teile, in denen eine Rechnung Tage abrechnet |
| C-12 | Minor | docs/api-specification.md:321-322 | Die Zeilen `POST /:id/generate-pdf` und `GET /:id/pdf` nennen die neue Ablehnung 400 `STATEMENT_KEY_NOT_CALCULABLE` (Entwurf, `then: STATEMENT_KEY_THEN_RECALCULATE_PDF`, gespeichertes PDF verworfen) nicht. Sie steht nur in der Zeile von `GET /invoices/completeness` (Zeile 142). Das ist dieselbe Lücke wie C-11 in Runde 3, diesmal bei den PDF-Zeilen |

Geschlossen: C-6, C-7, C-8, C-10, C-11.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (alle auf 0aa5a55): `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, volles vitest (4673), Backend `bun run test` (2175, Coverage), E2E chromium `statement-detail.feature`, `statement-generate.feature` und die Zeilen von accessibility/sprachen zu `uncalculable|late|uncategorized|heating-without|statement-pdf-refused` (275). Ebenfalls vom Aufrufer gemeldet: Das neue PDF-Szenario war an der Ablehnung rot, der C-8-Test rot ohne die Teilung.
- Rot gesehen habe ich nichts. Beim Lesen schlägt jeder neue Test ohne die Änderung fehl:
  - pg-Test zum PDF: ohne Prüfung 200 bzw. `IBAN_MISSING`, nicht der Code.
  - C-8-Test: ohne `cuts` zählt 3.01 am 01.01., die Formel gelingt.
  - `pdf-refusal`-Test: ohne Eintrag erscheint die Meldung des Backends ohne Parameter.
  - `backend-error`-Test und DOM-Texte: neue bzw. geänderte Schlüssel.
  - PDF-Szenario: ohne Prüfung Erfolg oder `IBAN_MISSING`, ohne den Text des Verteilschlüssels.
  - Das #1336-Szenario kommt nach dem Fix, dessen pg-Tests rot waren (Workflow 2, keine eigene Rotprobe nötig). Ohne den Fix zählt 3.02 (55 m²) mit, die Formel teilt durch 0, und die Vorschau hält an.
- Wie `invoice.start`/`end` bei einer Rechnung ohne Leistungszeitraum gesetzt werden, habe ich nicht verfolgt. Davon hängt ab, ob der C-8-Test (Rechnung vom 31.03.2026) den Fall von C-9 als richtig festschreibt. Das gilt dann, wenn die Rechnung nur den ersten Teil abrechnet.
- Nur gelesen, nicht durch einen Test belegt: Der ZIP-Download eines Abrechnungslaufs (`src/routes/statements/zip/+server.ts`) geht über `GET /:id/pdf` und wird jetzt ganz abgelehnt, wenn sich bei einem Entwurf der Verteilschlüssel nachträglich nicht mehr berechnen lässt. Die Ablehnungsseite zeigt dann den neuen Satz. Das folgt aus dem Entscheid in #1333 und ist darum kein Befund.
- Keine eigene Zeile in screens.json für `/documents/refused?code=STATEMENT_KEY_NOT_CALCULABLE`. Ich teile die Begründung «gleiche Seite und Bedienelemente, nur ein anderer Satz je Code», denn auch andere Codes der Seite haben keine eigene Zeile. Die zweite Begründung des Aufrufers trägt dagegen nicht: Die Fixture darf die Seite über Adresse und Query öffnen (wie `documents-refused-settings`). Dass fr/it/en hier kein Deutsch zeigen, prüft darum kein Bildschirmlauf, nur der Vergleich der JSON-Texte unten.

Geprüft: Texte von `backend_statement_key_then_recalculate_pdf`, `documents_refused_key_not_calculable`, `statements_later_key_draft` und `statements_send_outdated_key` in allen vier Sprachen wörtlich gleich der Tabelle in docs/reviews/1333-fachreview-2.md (per Skript verglichen); `documents_to_draft` bewusst weggelassen. Die Prüfung in `generateStatementPdf` gilt nur für Entwürfe und steht vor der IBAN-Prüfung, sie verwirft das gespeicherte PDF und wirkt auch für `GET /:id/pdf`, `/pdf/base64` und den ZIP-Download. Die übrigen Aufrufer prüfen vorher selbst (Versand, Brief) oder betreffen keine Entwürfe (Status «versendet», Mahnung, `keepNewPdf`). `pdfFailure` antwortet mit 400 und Code. C-10 und C-11 behoben. Szenarien ohne UI-Wörter; der neue Task `tryToGenerateStatementPdf` klickt einmal, die folgende Frage wartet auf die Meldung. ponytail-review: nichts Unbenutztes, keine Kopie eines bestehenden Helfers.
