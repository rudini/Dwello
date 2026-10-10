# Persona test: Dr. Weber (52), legally cautious landlord, final round

Date: 10.10.2026
Viewport: desktop (1440 x 900), zoom 100 %, locale de-CH

Task: walk through the statement wizard for 2025 up to the preview (create nothing), understand its warnings; open the existing draft and its PDF; judge whether every number can be traced and whether I would send it. Nothing was sent, marked or created.

## 1. Task completed

**Yes.** Wizard 2025 walked through steps 1-4 (period, all three buildings, heating profile and fee, preview) and left without creating. Draft `NK-11111111-2024-0002` (Anna Schmidt, Wohnung 1.02, 2024) opened, every number traced back to invoices, building areas and contract, PDF downloaded and read.

Verdict: **I would not send this draft yet** – but not because of the screens. The screens let me check everything (with some mental arithmetic). What stops me is the PDF content (English category names, missing distribution key, missing refund date and landlord contact) and the data (2024 invoices only cover Q1 for most categories).

## 2. Effort

- Screens: Übersicht, wizard (4 steps), statement list, statement detail, PDF, building page, tenant page, contract page, invoice list = about 12 screens.
- Clicks: about 20 (wizard 5, draft 2, PDF 1, cross-checking 10+).
- Time: about 15 minutes, of which 10 minutes were cross-checking numbers on other pages, because the statement shows the share (18.68 %) but not where it comes from (92 m² of 492.5 m²).

## 3. Thinking aloud

1. **Übersicht** ([01](screens/weber-final/01-dashboard.png)). "Nächster Schritt: Nebenkostenabrechnungen erstellen – Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen. ... Erfassen Sie zuerst alle Rechnungen dieser Periode". Good, the app tells me to collect invoices first. Also "1 Nebenkostenabrechnung ist noch im Entwurf." Clear.
2. **Wizard step 1** ([02](screens/weber-final/02-wizard-period.png)). Period 2025 is proposed, with the weekday spelled out below ("Mittwoch, 1. Januar 2025") – reassuring, because the date field itself shows `01/01/2025` in US order in my browser. The step labels wrap mid-word ("Abrechnun / gsperiode", "Verwaltung / spauschale") – looks careless.
3. **Step 2.** "Alle Gebäude" ticked, "0 von 3 gewählt" updates. Fine.
4. **Step 3** ([03](screens/weber-final/03-wizard-heating-fee.png)). Heizprofil "Heizung + Warmwasser (100%)" with a monthly bar chart. I paused: **December 25 %, January only 14 %** – that is not a plausible heating curve; the other profiles might fit better, but nothing tells me which profile suits which building. (Seed data, but the app accepts it without comment.) Verwaltungspauschale 3 %, "Üblich sind bis 3 %." – helpful. The hint under "Verteilung der Verwaltungspauschale" reads "Die Pauschale wird so auf die Wohnungen verteilt, je Mieter nach Mietstagen." – "so" points at nothing and "Mietstagen" is not a word I know (I would write "Miettagen"). Then "Entwurf gespeichert, 14:41" appears – I was briefly alarmed: did I just create a statement draft? I had not; it is the wizard's own state. When I reopened the wizard later it started again at step 1, so I do not know what was "gespeichert".
5. **Step 4 Vorschau** ([04](screens/weber-final/04-wizard-preview-warning.png)). Red "Keine Rechnungen erfasst" for all three buildings, and the box "Rechnungen fehlen: ... Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück. Erfassen Sie zuerst die Rechnungen – oder bestätigen Sie unten, dass es keine gibt." **Understandable and correct**: I checked the invoice list, all 14 invoices are from 2024. The consequence is stated in money terms, there is a "Rechnung erfassen" button and an explicit "Die Abrechnungen trotzdem erstellen" checkbox. The per-contract list confirms it: e.g. Anna Schmidt "Kosten CHF 0.00 / Rückerstattung CHF 1’920.00" = 12 x CHF 160 Akonto. This is exactly the warning I want. I left via the breadcrumb without creating.
6. **Statement list** ([05](screens/weber-final/05-statements-list.png)). Three 2024 statements; the draft is Anna Schmidt, "Rückerstattung CHF 83.43". The list says "PDF", the detail page says "PDF herunterladen" – there is no "PDF ansehen"; it downloads, it does not preview.
7. **Draft detail** ([06](screens/weber-final/06-draft-detail.png)). Table with Kategorie, Verteilschlüssel, Kosten des Gebäudes, Anteil, Betrag. On my 1440 px screen the **"Betrag" column is cut off** ("CHF 793." / "Betr") – the most important column needs horizontal scrolling inside the card, and nothing indicates that. Below: Zwischensumme, Verwaltungspauschale "3 % der Nebenkosten der Liegenschaft, Anteil dieser Wohnung für 366 Mietstage" CHF 51.00, Gesamtkosten, Akonto, Saldo, "Sie erstatten dem Mieter CHF 83.43 zurück", "Rückerstattung bis 9.11.2026". There are **no warnings at all on the statement itself**, although I found two things worth flagging (see 8).
8. **Tracing the numbers** ([08](screens/weber-final/08-building-areas.png)):
   - Positions sum: 793.91 + 308.33 + 200.00 + 113.33 + 158.33 + 125.00 + 86.67 = 1’785.57. Correct.
   - Heizung 18.68 %: 92 m² / (75.5 + 92 + 85 + 65 + 120 + 55 = 492.5 m²) = 18.68 %. Correct, vacant apartments carry their share (landlord pays) – correct practice. But I had to open the building page and add six areas myself.
   - "Pro Einheit" 16.67 % = 1/6 apartments. Correct.
   - Verwaltungspauschale: 3 % of 10’200 (all positions) = 306, / 6 apartments = 51.00. Correct, but the line does not say "gleichmässig pro Wohnung", so I had to guess the key.
   - Akonto 1’920 = 12 x CHF 160 (contract page). Correct. 366 days = 2024 leap year. Correct.
   - **Plausibility**: Kaltwasser "Q1 2024", Allgemeinstrom "Q1 2024", Lift "Q1 2024", Hauswart "März 2024", Kehricht "H1 2024" – a full-year statement with one quarter of the costs. The tenant gets money back that she will owe next year. The app did not warn; it only warns when there are *no* invoices at all. Heizung is one "Heizöl Lieferung Januar 2024" with no stock reading.
   - Tenant has "Keine Adresse erfasst" – fine for e-mail, but the PDF has no address block either.
9. **PDF** ([07](screens/weber-final/07-pdf-page1.png)). File name `abrechnung-bee27b21-....pdf` (internal id, not the NK number). Content: category names in **English** ("Heating", "Cold Water", "Caretaker", "Elevator", "Waste Disposal") in a German document; **no Verteilschlüssel column** (the screen has one); "Verwaltungskosten (3.0%)" instead of "Verwaltungspauschale" and without basis; **no refund date** ("Rückerstattung bis 9.11.2026" from the screen is missing); no landlord contact, IBAN request or note on the tenant's right to inspect the invoices. Sender "Muster Immobilien AG, Bahnhofstrasse 1" is demo data. The numbers themselves match the screen exactly.

## 4. Terms I did not understand

- "Mietstagen" / "Mietstage" – unusual; I assume "Miettage" (days rented within the period).
- "Entwurf gespeichert" in the wizard – draft of what? Statements are also called "Entwurf".
- "Kosten aller Abrechnungen" (preview) – total costs distributed, or including the fee? With CHF 0.00 I could not tell.
- "Verwaltungskosten (3.0%)" in the PDF vs. "Verwaltungspauschale" on screen – same thing? 3 % of what?
- "Zusatzmiete" on the contract (not part of this task, but appears next to Akonto and I am unsure if it is a cost advance).

## 5. Error risks

- Sending a full-year statement built from Q1 invoices: refund now, large back payment next year, tenant disputes. The app does not detect partial coverage (e.g. a category with only one quarter, or a category missing that was billed last year).
- Missing the cut-off "Betrag" column and reading "CHF 793." as the full amount.
- Tenant receives an English/German mixed PDF without distribution keys – under Swiss practice the tenant can ask how each share was computed; the PDF gives no way to check it.
- Tenant does not know by when the refund comes (date missing in PDF).
- Heating profile with December 25 % chosen by default – would distort costs for any tenant who moved in or out during the year.

## 6. Suggestions

- **Major (backend/PDF):** PDF in German throughout (category names), add the Verteilschlüssel column, the refund/payment date, landlord contact and a line on the right to inspect the invoices; name the file after the NK number. (Known backend point.)
- **Major (data/app):** warn on the preview and on the statement when invoices do not cover the whole period (e.g. "Kaltwasser: Rechnungen nur für 1.1.–31.3.2024") – the current warning only covers "no invoices at all". The seed data itself (Q1-only invoices, December-heavy heating profile) should be made plausible. (Partly known.)
- **Major (screen):** the "Betrag" column of "Abrechnungspositionen" is clipped at 1440 px desktop; make the table fit (e.g. drop "CHF" in the share columns or narrow the "Verteilschlüssel" column) so all five columns are visible without inner scrolling.
- **Minor:** show the basis of each share on the statement, e.g. "92 m² von 492.5 m²" or "1 von 6 Wohnungen", and link "Kosten des Gebäudes" to the underlying invoices. Then I can trace everything without opening three other pages.
- **Minor:** Verwaltungspauschale line: name the key ("gleichmässig pro Wohnung") and the basis ("3 % von CHF 10’200.00").
- **Minor:** offer "PDF ansehen" (open inline) next to "PDF herunterladen"; a cautious user wants to look before a file lands in Downloads.
- **Minor:** wizard "Entwurf gespeichert" – rename (e.g. "Eingaben gespeichert") and actually resume at the saved step, or drop it.
- **Minor:** fix the hint text "Die Pauschale wird so auf die Wohnungen verteilt, je Mieter nach Mietstagen." (dangling "so", "Mietstagen").
- **Minor:** step labels in the progress bar break mid-word ("Abrechnun gsperiode", "Verwaltung spauschale"); use hyphenation or shorter labels.
- **Minor:** date inputs show `01/01/2025` (browser locale); the spelled-out date below saves it, keep that.

What works well: the 2025 "Rechnungen fehlen" warning is correct, states the money consequence, offers the fix and requires an explicit confirmation; the per-contract preview lets me sanity-check each tenant before anything is created; every number on the draft was arithmetically correct and matched the PDF.
