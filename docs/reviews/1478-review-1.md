# Code-Review #1478, Runde 1 (origin/main..93a7f8e)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | src/routes/invoices/[id]/InvoiceFacts.svelte:46-48, src/lib/invoice.ts:24-31 | Die Rechnungsseite einer eintägigen Rechnung der zweiten Brennstoff-Kategorie sagt weiterhin «Nur die Tage in der Abrechnungsperiode zählen.» (`invoices_service_period_days`). Seit dieser Änderung stimmt das nicht mehr: Die Rechnung zählt über die ganze Periode. |
| C-2 | Minor | backend/src/__tests__/fuel-stock.pg.test.ts:86-88 | «zählt die Lieferung der zweiten Brennstoff-Kategorie nicht zum Verbrauch des Tanks» ist auch auf d2aa74a grün. Mit dem neuen Code lässt sich kein Guard entfernen, der ihn rot macht (`kind()` ist unverändert). Die Commit-Nachricht von 93a7f8e nennt als Test, der bestehendes Verhalten festhält, nur den Test über mehrere Tage. Dieser Test müsste dort auch stehen. |

## C-1: Die Rechnungsseite sagt bei der Holzlieferung etwas Falsches

- **Was falsch ist:**
  - `tankDelivery()` (`src/lib/invoice.ts:27-31`) gibt für jede Kategorie ausser der des Tanks `undefined` zurück.
  - `InvoiceFacts.svelte:47` zeigt darum bei `delivery !== true` den Satz `m.invoices_service_period_days()`, de: «Nur die Tage in der Abrechnungsperiode zählen.» (`messages/de.json:1227`).
  - Für eine Rechnung «Holz» mit Leistungszeitraum 30.09.2025–30.09.2025 neben einem Heizöl-Tankbestand rechnet das Backend jetzt aber die ganze Periode ab (`invoice.service.ts:588-590`, `inPeriod` 01.01.–31.12.).
  - Der Liegenschaftsverwalter liest also auf der Rechnung eine Regel, die die Abrechnung derselben Rechnung widerlegt. Das PDF sagt dazu 139/365 Tage und «gilt für die ganze Abrechnungsperiode».
  - Bei #1474 (ganz ohne Tankbestand) zeigt die Seite schon auf der Basis denselben Satz. Die Änderung erweitert den Widerspruch aber auf einen neuen Fall, den die Änderung selbst einführt. Er gilt darum nicht als schon vorher vorhanden (`CLAUDE.md`, «Done means»).
  - Der Fachreview hat nur `invoices_service_period_help` geprüft, diese Stelle nicht (`docs/reviews/1478-fachreview-1.md`, «Geprüft», «Rechnungsseite»).
- **So lässt sich das Scheitern zeigen:**
  - Die Givens des Szenarios «… nach den Mietstagen der ganzen Periode» (`statement-detail.feature:489-500`) aufsetzen.
  - Die Detailseite der Rechnung «Holz» öffnen. Sie zeigt unter dem Leistungszeitraum «Nur die Tage in der Abrechnungsperiode zählen.».
  - Ein DOM-Test von `InvoiceFacts` mit einer eintägigen Rechnung einer anderen Brennstoff-Kategorie als `tank` zeigt dasselbe.
- **Lösung:** Den Satz für eine eintägige Rechnung einer Brennstoff-Kategorie weglassen oder einen passenden Satz zeigen. Ob und welcher Text, entscheidet der `fach-reviewer` oder ein Issue. Der Satz ist neu und gehört in alle vier Sprachen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, `cd backend && bun run type-check`
  - Backend: `bun run test` (2450 pass, Abdeckung 97.5 %); `bunx vitest run --changed origin/main` (1037)
  - die Tests open-work, design-guard und backend-codes
  - E2E chromium+api `-g "Tank|Lieferung|Brennstoff|Heizprofil|PDF"` (173)
  - Prettier auf den neuen Dateien, die Commit-Hooks
  - die Rot-Läufe: pg-Test und beide Szenarien vor dem Code; je ein entfernter Guard `isFuel`, `!!tank ||` und `=== true`; Render- und DOM-Tests vor den Texten
- Durch Lesen bestätigt, dass die Tests ohne die Änderung rot wären: die pg-Tests über 365 Tage, V-2 und Hauswart (Guard `isFuel`), beide Szenarien (Basis 1/1 Tage bzw. 100 % statt 50 %), die PDF-Render-Tests und die DOM-Tests.
- Nicht bestätigt: ob das Issue `needs-decision` angelegt ist, das der Fachreview unter «Nicht bestätigt» vorschlägt («Gebäude ohne Tank» nach dem Wechsel des Heizmaterials). `implementation_plan.md` nennt es nur als Vorschlag. GitHub habe ich nicht abgefragt.

Geprüft: Regel `delivery()`/`kind()` in `getInvoicesForStatement` (mit Tank, ohne Tankbestand nach #1474, «Gebäude ohne Tank» mit/ohne `covered`, Rechnung ohne Leistungszeitraum, über mehrere Tage); Marker `delivery: 'fuel'` bis zu PDF (`partText`, `sharesNote` in beiden Zweigen, `tankDelivery`) und Detailseite; «nicht aktuell» über `billedAsIs` (start/end); Texte wortgleich mit dem Fachreview in allen vier Sprachen und `messages/*.json` (geschützte Leerzeichen wie in `statements_part_delivery`); Glossar wortgleich; Steps und Fixture (Screenplay, `invoiceOn` mit eigener Kategorie); keine neuen Bildschirme; ponytail-review: Lean already. Ship.
