# Code-Review 1480, Runde 2 (Abschlussrunde, Delta 4c19574..074a505)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2 (b2293a9: `src/__tests__/invoice-pages.dom.test.ts:597-618` pinnt `invoices_fuel_delivery_no_stock` in vier Sprachen über `invoice-fuel-hint` und prüft, dass «Nur die Tage in der Abrechnungsperiode zählen.» (`invoices_service_period_days`, `messages/de.json:1229`) fehlt; `src/__tests__/building-form.dom.test.ts:47-64` pinnt `buildings_no_tank_help` in vier Sprachen).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: auf d80676c `bun run lint` sauber, `bun run check` 0 Fehler, vitest `invoice-pages.dom` + `building-form.dom` 155 bestanden (vor den Texten 8 rot), Backend `statement-pdf-render.test.ts` 217 bestanden (vor den Texten 4 rot), E2E der drei Szenarien (chromium) 4 bestanden; auf 4c19574 ganze Backend-Suite, `vitest --changed`, E2E von fünf Feature-Dateien 368 bestanden, fitness 0 Fehler.
- Dass der Entscheid in #1480 die Glossarzeile «Gebäude ohne Tank» nennt (Bedingung von Fachreview 1480-2 V-9 für die geänderte Klammer, `UBIQUITOUS_LANGUAGE.md:164`): nur aus `implementation_plan.md` («Glossary rows «Gebäude ohne Tank», «Verbrauch (Heizmaterial)» with the wording of 1480-fachreview-1») und Fachreview 1480-1 gelesen; den Issue-Text habe ich nicht gelesen.
- Dass die Persona-Majors Helga P-1 und Dr. Weber P-1 behoben sind: nur die Berichte selbst (nicht gelesen, aus dem Delta ausgeschlossen) belegen das; die Texte selbst habe ich gegen den Wortlaut von Fachreview 1480-2 geprüft.

Geprüft: alle drei Texte in de/fr/it/en (`messages/*.json:400,1047`, `backend/src/services/pdf-texts/*.ts:136`) mit einem Skript Zeichen für Zeichen gegen die Tabelle «Wortlaut» in `docs/reviews/1480-fachreview-2.md` verglichen: alle gleich, im Französischen U+00A0 vor ; : und innerhalb « » (in `fr.ts` als ` `); die Testerwartungen sind gleich den Texten (im PDF-Test fr mit normalem Leerzeichen, weil `readPdf` U+00A0 als Leerzeichen liest, `backend/src/__tests__/helpers` Zeile 61); Glossarklammer wie V-9; Szenarioschritte in `invoice-detail.feature:271` und `statement-detail.feature:839-840,861-862` passen zu den Texten und sind in diesem PR neu; Testtitel decken, was die Tests prüfen; keine neuen Bildschirme oder Zustände, kein unbeteiligter Code im Delta.
