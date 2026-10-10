# Persona test: Dr. Weber (52), legally cautious landlord, round 7

Date: 10.10.2026 · Viewport: desktop (1440 x 900), zoom 100 %

## 1. Task completed

**Partly.** All three reading tasks were completed (nothing was sent, marked or saved):

1. Opened the only draft (`NK-11111111-2024-0002`, Anna Schmidt, Musterhaus Zentrum, Wohnung 1.02, 2024), recomputed every line and opened the PDF.
2. Checked `Verteilschlüssel`, `Heizprofile`, `Kategorien` and `Einstellungen`.
3. Opened the heating invoice behind the largest line (`Stadtwerke Zürich – Heizöl Lieferung Januar 2024`, CHF 4’250.00).

**Verdict: I would not send this statement.** The arithmetic is correct, but a tenant cannot trace it. The PDF is the document that actually goes out, and it is weaker than the screen: English category names, no Verteilschlüssel, no basis for the 3 % fee, and no repayment date. On top of that, the cost base itself looks incomplete or legally questionable (see section 5).

## 2. Effort

- Screens: 10 (Übersicht, statement list, statement detail, PDF, Einstellungen, Verteilschlüssel, Heizprofile, Kategorien, Gebäude, invoice list and detail)
- Clicks: about 20, plus my own recalculation on paper
- Time: about 25 minutes, most of it spent recalculating and cross-checking against the building page

## 3. Thinking aloud

1. **Übersicht** ([01](screens/weber-7/01-dashboard.png)). The card "Abrechnungen prüfen und versenden" says "1 Nebenkostenabrechnung ist noch im Entwurf". I click "Entwürfe ansehen" and land on the list ([02](screens/weber-7/02-statement-drafts.png)). Odd: the dashboard pushes "Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen", but the draft is for **2024**. Which year am I reviewing? I continue with 2024.
2. **Statement detail** ([03](screens/weber-7/03-statement-detail.png)). Good: a table with "Kategorie / Verteilschlüssel / Kosten des Gebäudes / Anteil / Betrag". I check the numbers:
   - Heizung: CHF 4’250.00 x 18.68 % = 793.91. Where do the 18.68 % come from? The screen does not say. Only on the building page (Gebäude → Musterhaus Zentrum) do I add up 75.5 + 92 + 85 + 65 + 120 + 55 = 492.5 m², and 92 / 492.5 = 18.68 %. Correct, and vacant flats are included (so the landlord bears the vacancy, which is right). But I had to work that out myself. The statement should say "92 m² von 492.5 m²".
   - "Pro Einheit" 16.67 % = 1 of 6 flats. Correct, but again not written out.
   - The Zwischensumme of CHF 1’785.57 adds up correctly.
   - "Verwaltungspauschale – 3 % der Nebenkosten der Liegenschaft, Anteil dieser Wohnung für 366 Mietstage": CHF 51.00. I tried 3 % of 1’785.57 = 53.57, which is wrong. Then 3 % of the building total of 10’200 = 306, divided by 6 flats = 51.00. So it is split **per unit**, not per m² like the heating. Neither the base (CHF 10’200) nor the key (1/6) is shown. A tenant who checks it gets a different number.
   - Saldo: "Saldo: Rückerstattung CHF 83.43", "Sie erstatten dem Mieter CHF 83.43 zurück", "Rückerstattung bis 9.11.2026". Clear on screen.
   - The table is slightly too wide even at 1440 px: the "Betrag" column touches the right edge and scrolls horizontally by a few pixels, and "18.68 %" wraps onto two lines.
   - No line links to the invoice(s) behind it. I cannot click from "Heizung CHF 4’250.00" to its receipt.
   - Which Heizprofil was used? Not stated anywhere. Here it does not matter because the tenant was there all 366 days, but I cannot tell that from the screen.
3. **PDF** ("PDF herunterladen", [04](screens/weber-7/04-statement-pdf.png)). This triggers a download with the file name `abrechnung-fe052376-541a-….pdf`, which is a technical ID instead of the statement number. Compared with the screen, the PDF:
   - shows the categories **in English**: "Heating, Cold Water, Caretaker, Electricity Common Areas, Elevator, Garden Maintenance, Waste Disposal". To a German-speaking tenant in Zürich, that looks unprofessional and could be grounds for a dispute.
   - has **no Verteilschlüssel column**. The tenant sees "18.68%" and "16.67%" without any explanation.
   - says only "Verwaltungskosten (3.0%)", with no base and no split. A tenant will compute 3 % of 1’785.57 and conclude that the amount is wrong.
   - has **no repayment date** and no payment section. "Rückerstattung CHF 83.43" stands alone.
   - has no tenant postal address (name only) and no PLZ/Ort for the property. I could not put it in a window envelope.
   - On the plus side, it does show "Fläche: 92.00 m²" and "Mietdauer (Tage): 366", which the screen does not.
4. **Einstellungen** ([05](screens/weber-7/05-settings.png)). The Verwaltungspauschale is explained ("ein Prozentsatz der Nebenkosten der Liegenschaft. 3 % ist der übliche Richtwert"). Good, but it does not say how the fee is split between flats.
5. **Verteilschlüssel** ([06](screens/weber-7/06-distribution-keys.png)). The help text is good ("Die Formel ergibt für jede Wohnung eine Zahl…"). Then I see "Heizung (Fläche 70% / Einheit 30%)" with the formula `0.7 * {area} + 0.3 * {units}`. By the page's own rule, each flat's number is 0.7 x 92 + 0.3 x 1 = 64.7. Here {area} is around 90, while {units} is 1, so the "30 % per unit" part has almost no effect. My calculation for Wohnung 1.02 gives 64.7 / 346.55 = **18.67 %**. A real 70/30 split would be 0.7 x 18.68 % + 0.3 x 16.67 % = **18.08 %**. **The key does not do what its name says.** It is used by 0 invoices today, but it is preset and appears in the "Standard-Verteilschlüssel" selection.
6. **Heizprofile** ([07](screens/weber-7/07-heating-profiles.png)). The bar charts are clear and all profiles add up to 100 %. Plausibility, however:
   - "Heizung + Warmwasser": December 25 %, but January only 14 %? January is normally the coldest month.
   - "Heizung Mittelland": January 28 %, but February only 14 % and December 18 %. A doubling from February to January is not plausible.
   - "Heizung Tessin": January 30 %, which is more than the mountain region (16 %). That is the opposite of what one would expect.
   - "Heizung Bergregion" and "Nur Warmwasser" look plausible.
   - No source is given (for example HEV/SVIT tables). I would not apply these profiles to a tenant who moves out mid-year.
7. **Kategorien** ([08](screens/weber-7/08-categories.png)). The names are German, but all descriptions are English ("Costs for heating the building", "Repairs and maintenance (owner responsibility)"). This is probably the same source as the English names in the PDF. The split into umlagefähig and nicht umlagefähig is sensible, and the repair invoice correctly shows "gemäss Art. 257a–257b OR nicht auf Mieter umlegbar".
8. **Invoice** ([09](screens/weber-7/09-invoices-heating-filter.png), [10](screens/weber-7/10-invoice-heizoel.png)). I filtered for Musterhaus Zentrum + Heizung: there is exactly one invoice, "Stadtwerke Zürich – Heizöl Lieferung Januar 2024", CHF 4’250.00, "Heizung", "Pro Fläche (m²)", "Umlagefähig", "Manuell kategorisiert". The category is right and heating is a valid utility cost in principle. **But** it is an oil **delivery**, not consumption. Under Swiss rules, only the oil actually used in the period may be charged (opening stock + purchases − closing stock). The app neither asks for nor shows stock levels. The invoice page also does not show which statement(s) it feeds into, and I could not see an attached receipt.
9. **Completeness of the 2024 cost base.** The other Musterhaus invoices are "Wasserverbrauch Q1 2024", "Allgemeinstrom Q1 2024", "Liftservice Q1 2024", "Hauswart März 2024" and "Kehrichtgebühren H1 2024". That is a full year of costs built mostly on one quarter or one half-year. The statement gives no warning that invoices for Q2–Q4 might be missing. As a landlord I would be undercharging here, and the tenant gets a refund that is only an artifact of the missing invoices.

## 4. Terms I did not understand

- "Pro Einheit": I understand it after reading the help ("1 für jede Wohnung"). A tenant reading the PDF would not; "zu gleichen Teilen pro Wohnung" would be clearer.
- "Anteil dieser Wohnung für 366 Mietstage" on the Verwaltungspauschale: a share by what? m², units or days?
- "Vordefiniert": it means "cannot be changed". That is clear only from the sentence above the list.
- "Heizprofil" on the statement: it is not mentioned there at all, so it is unclear whether and which one was used.
- In the PDF: "Heating", "Caretaker", "Elevator" and so on, which are English terms in a Swiss-German document.

## 5. Error risks

- **The preset 70/30 key splits about 99/1 instead of 70/30.** If someone uses it for heating, every tenant is charged wrongly, and a tenant who recalculates can successfully contest the statement.
- **The PDF lacks the Verteilschlüssel and the fee basis.** The tenant cannot check the statement, which is a classic reason for objections and requests to inspect the receipts.
- **The PDF has English category names.** This looks unprofessional and is confusing for tenants.
- **No payment or repayment date in the PDF.** For a Nachzahlung this would also be legally relevant (when it falls due).
- **Heating oil is charged by delivery instead of consumption.** Without stock levels, the heating line is legally contestable.
- **Probably incomplete invoices** (only Q1 or H1 for most categories), with no warning before sending.
- **Implausible Heizprofile** (Dec 25 %, Jan 28 % vs Feb 14 %, Tessin colder than the mountains). Pro-rating for tenants moving in or out would be wrong.
- The dashboard asks for the 2025 period while the only draft is for 2024. It is easy to lose track of which year is being reviewed.
- PDF file name with a UUID: easy to mix up PDFs when archiving or sending them by e-mail.

## 6. Suggestions

- **Blocker:** Fix the preset key "Heizung (Fläche 70% / Einheit 30%)" so that it really splits 70/30, by normalising each part to its building total. Alternatively, remove it or rename it to what it actually does. Show a preview of each flat's resulting percentage for each key in the settings.
- **Blocker:** In the PDF, use the German category names (as on the screen), add a "Verteilschlüssel" column and "Ihre Einheit / Total" (for example "92 m² von 492.5 m²", "1 von 6 Wohnungen"), and add the payment block with the due date ("Rückerstattung bis 9.11.2026" or "Zahlbar bis …" plus the QR-bill).
- **Major:** Make the Verwaltungspauschale traceable on screen and in the PDF: "3 % von CHF 10’200.00 = CHF 306.00, Anteil 1/6 = CHF 51.00".
- **Major:** Before sending, warn about gaps in the cost base, for example "Für Kaltwasser liegt nur eine Rechnung für Q1 2024 vor". Optionally, compare against the previous year.
- **Major:** For heating oil, ask for opening and closing stock (or the consumption) and show the consumption instead of the delivery.
- **Major:** Review the predefined Heizprofile and state their source (Mittelland Jan/Feb, Tessin, December 25 % in "Heizung + Warmwasser").
- **Minor:** Link each statement line to its invoice(s), and show "Fliesst in Abrechnung …" on each invoice.
- **Minor:** On the statement, say which Heizprofil was used, or "nicht nötig, ganze Periode gemietet".
- **Minor:** Translate the category descriptions into German.
- **Minor:** Name the PDF file after the statement number (`NK-11111111-2024-0002.pdf`) and include the tenant's postal address and the property's PLZ/Ort.
- **Minor:** Make the cost table fit at 1440 px without horizontal scrolling and without breaking "18.68 %" across two lines.
- **Minor:** On the dashboard, show the year of the draft ("1 Entwurf für 2024") so it does not get confused with the 2025 reminder.
