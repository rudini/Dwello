# Persona test: Dr. Weber (52, legally cautious landlord), run 5

Task: open an existing Nebenkostenabrechnung in status "Entwurf" and check whether the amounts, the Verteilschlüssel, each cost's share, the Akonto and the balance can be understood and traced. Read any warnings, judge the PDF before sending. Do not send anything and do not mark anything as paid.

Setup: desktop 1440x900, demo data, today 10.10.2026. Draft checked: **NK-11111111-2024-0002**, Anna Schmidt, Musterhaus Zentrum, Wohnung 1.02, period 1.1.2024 - 31.12.2024.

## 1. Task completed

**Partly.** I found the draft, re-calculated every line and the balance, and read the PDF. I could only trace the Verteilschlüssel by opening each invoice on its own page and adding up the apartment areas myself. I found one fee amount I cannot explain from the label. The app showed no warnings or hints. I would **not** send this draft in its current form.

## 2. Effort

- About 10 page views: Übersicht -> Entwürfe -> Abrechnung -> PDF -> Bearbeiten -> Rechnungen -> 2 single invoices -> Gebäude -> Wohnung -> Verteilschlüssel -> Einstellungen.
- Finding the draft was easy (1 click from the dashboard). Checking it was hard: about 15 minutes with a calculator and notepad. Without both I could not have checked it.

## 3. Walkthrough (thinking aloud)

1. **Übersicht.** "Abrechnungen prüfen und versenden - 1 Nebenkostenabrechnung ist noch im Entwurf." Good, that is exactly what I am looking for. I click "Entwürfe ansehen".
2. **List** (screen 01). One row: NK-11111111-2024-0002, Anna Schmidt, "Wohnung 1.02 · 1", 1.1.2024 - 31.12.2024, 366 Tage, "CHF 83.43 Rückerstattung", "Entwurf". What does the "· 1" after 1.02 mean? Later I learn it is the floor, but a bare "1" says nothing. The period is **2024** and today is October **2026**. I am almost two years late with this statement, and nothing warns me about that.
3. **Detail** (screen 02). The table has the columns "Kategorie | Verteilschlüssel | Gesamtkosten | Anteil | Betrag".
   - The category names are **in English**: "Heating", "Cold Water", "Caretaker", "Electricity Common Areas", "Elevator", "Garden Maintenance", "Waste Disposal". My tenant in Zürich gets English cost names on a German document?
   - The **"Verteilschlüssel" column is empty in every row.** That was the main thing I wanted to see. Is something missing, or is it a display error?
   - Heating shows 18.68 %, all other rows 16.67 %. 16.67 % is clearly 1/6, and the building has 6 apartments. But why 18.68 % for heating? Hovering over the row shows nothing.
   - I add up the lines: 793.91 + 308.33 + 200.00 + 113.33 + 158.33 + 125.00 + 86.67 = **1'785.57**. That matches "Zwischensumme".
   - "Verwaltungsgebühr (3%) CHF 51.00". But 3 % of 1'785.57 is **53.57**, not 51.00. I checked several times and cannot get 51.00 from the numbers shown. Eventually I find that 51.00 = 3 % of 1'700.00, and 1'700.00 = 1/6 of the building total of 10'200.00. So the fee seems to be split per apartment and not calculated on my tenant's share. The label "(3%)" next to 1'785.57 suggests otherwise. If the tenant checks it, I cannot explain this.
   - "Gesamtkosten CHF 1'836.57" = 1'785.57 + 51.00. Correct. But "Gesamtkosten" is also the heading of the column with the **building** totals (4'250.00 ...). The same word means two different things on one card.
   - "Akontozahlungen - CHF 1'920.00". The source of this number is not shown. Only on the apartment page do I find "Nebenkosten (Aconto) CHF 160.00" per month, and 160 x 12 = 1'920. Correct, but I had to work it out myself. The page does not say whether these are payments **actually received** or only the amount agreed in the contract.
   - "Rückerstattung an Mieter CHF 83.43" = 1'920.00 - 1'836.57. Correct.
   - "Zahlungsfrist 9.11.2026" on a refund: does the tenant have to pay something, or do I? For a refund the deadline should be mine, but the label does not say who it applies to.
   - The page shows no warnings, hints or check results.
4. **PDF** (screen 03). The PDF downloads straight away. There is no preview in the app, so I have to open a file. One page. Sender "Muster Immobilien AG", tenant "Anna Schmidt" **without an address**, the apartment with area 92.00 m². The table has the columns "Gebäudekosten | Anteil % | Ihr Anteil". The PDF has **no Verteilschlüssel either**, the categories are again in English, and the fee is called "Verwaltungskosten (3.0%)" this time. There is no explanation of how the refund is paid out (bank transfer? set off against rent?), no notice that the tenant may inspect the receipts, and no contact person. Visually it is clean. As a document I would have to defend, it is too thin.
5. **Bearbeiten** (screen 04). I hoped to find more detail here. Instead the page says: "Kosten und Verwaltungspauschale werden beim Erstellen der Abrechnungen berechnet. Für eine Korrektur den Entwurf löschen und die Abrechnungen der Liegenschaft neu erstellen." That is honest, but now the fee has a **third** name, "Verwaltungspauschale", and Akonto is called "Akontobeiträge". The balance appears as **"Saldo CHF-83.43"**: a minus sign glued to "CHF", with no word saying who owes whom. The detail page shows the same amount as positive with "Rückerstattung". The date field shows "11/09/2026". Is that 11 September or 9 November? The detail page said 9.11.2026. I leave with "Abbrechen".
6. **Rechnungen** (screen 05). The statement has no link to the invoices behind it, so I go via the navigation. For Musterhaus Zentrum 2024 I find exactly one invoice per category. Here the categories are in German ("Heizung", "Kehricht"). Looking at the descriptions:
   - "Heizöl Lieferung **Januar** 2024": one oil delivery is not the oil actually used in 2024. There is no opening or closing stock.
   - "Hauswart **März** 2024", 1'200.00: only one month of caretaker costs for the whole year?
   - "Wasserverbrauch **Q1** 2024", "Allgemeinstrom **Q1** 2024", "Liftservice **Q1** 2024", "Kehrichtgebühren **H1** 2024": these cover only part of the year.
   - This means the statement probably contains **only part of the year's costs**. That would explain why the tenant gets money back. The app does not warn about this at all.
   - "Reparatur Boiler Wohnung 2.01", 2'350.00, is marked "Nicht umlagefähig" and correctly left out of the statement. Good.
7. **Single invoices.** Heating: "Verteilschlüssel: Pro Fläche (m²)". Caretaker: "Pro Einheit". So the key is stored on the invoice; the statement just does not show it.
8. **Gebäude.** Areas 75.5 + 92 + 85 + 65 + 120 + 55 = 492.5 m². 92 / 492.5 = **18.68 %**. That explains the heating share. But the Swiss standard key "Heizung (Fläche 70% / Einheit 30%)" exists and was **not** used ("0 Rechnungen").
9. **Verteilschlüssel** (screen 06). The names are German, but the descriptions are English ("Equal distribution per apartment", "Swiss standard heating distribution"). Under Einstellungen > Standard-Verteilschlüssel the same keys are called "Per Unit", "Per Area (m²)" and so on. That makes three languages or spellings for the same thing.
10. I do **not** click "Versenden". Nothing tells me whether it asks for confirmation or sends straight away. As a cautious user I expect a confirmation step with a final check, and I cannot see whether there is one.

## 4. Points of confusion (incl. terms)

| Where | What I see | Why it confuses me |
|---|---|---|
| Detail, PDF | "Heating", "Cold Water", "Caretaker" ... | English categories on a German statement; the invoice list says "Heizung", "Kaltwasser", "Hauswart" |
| Detail | Column "Verteilschlüssel" is empty | The column suggests information that is not there |
| Detail | "Gesamtkosten" (column) vs. "Gesamtkosten" (sum) | Building total and tenant total have the same name |
| Detail / PDF / Edit / Settings | "Verwaltungsgebühr" / "Verwaltungskosten" / "Verwaltungspauschale" | Three names for one item |
| Detail / Edit / PDF / Apartment | "Akontozahlungen" / "Akontobeiträge" / "Geleistete Akonto-Zahlungen" / "Nebenkosten (Aconto)" | Four spellings; "Aconto" vs. "Akonto" |
| Edit | "Saldo CHF-83.43" | Sign without words; looks like a debt; formatted differently from everywhere else |
| Edit | Date "11/09/2026" | US date format in a Swiss app, ambiguous |
| Detail | "Zahlungsfrist" on a refund | Unclear who has to pay by when |
| List / Detail | "Wohnung 1.02 · 1" | The floor number has no label |
| Detail | "Anteil 18.68%" | No explanation (92 of 492.5 m²) |
| Apartment | "Zusatzmiete CHF 120.00" | Unclear whether this belongs in the Nebenkosten (e.g. parking) or not |
| Verteilschlüssel | English descriptions, "Per Unit" in settings | Mixed languages |

## 5. Legal/correctness concerns and error risks

1. **Fee does not match its label.** "Verwaltungsgebühr (3%)" = CHF 51.00, but 3 % of the Nebenkosten shown (1'785.57) is 53.57. The fee is apparently split per apartment and not calculated on the tenant's share. If a tenant or the Schlichtungsbehörde checks it, the statement cannot be traced. Either the calculation or the label is wrong.
2. **Incomplete costs for the period, with no warning.** The invoices cover only January, March, Q1 or H1 2024. The app creates a full-year statement anyway and shows no warning such as "Für Kategorie X fehlen Rechnungen für Monate ...". This is a risk both ways: the landlord gives away money, and a later correction is legally difficult.
3. **Heating oil by delivery, not by consumption.** For heating, the oil actually used counts (stock at the start + deliveries - stock at the end). The app takes the invoice amount of one delivery. It has no field for stock levels and no hint.
4. **Heating split purely by area,** even though the app offers a Swiss 70/30 heating key. That may be allowed by the contract, but the statement shows nothing about it. The tenant cannot see the key at all, neither in the app nor in the PDF.
5. **The PDF is thin as a legal document:** no tenant address, no Verteilschlüssel, no reference to the right to inspect receipts, no refund method or payment details for the refund, no note on how the share was calculated (area, units).
6. **Late statement:** a 2024 period settled in October 2026, with no notice about how late it is.
7. **Akonto source unclear:** the page does not show whether 1'920.00 are payments actually received or just the contract amount (if a payment was missed, the balance would be wrong).
8. **"Versenden" is the most prominent button** (blue, top right) and sits directly next to "PDF herunterladen". It is unclear whether there is a confirmation step. Sending by mistake would be hard to undo.
9. **Correction only by deleting and creating again.** That is clear and documented, but there is no audit trail or version comparison showing what changed between two drafts.

## 6. Improvement suggestions

**Blocker**
- B1: Make the fee traceable. Either calculate 3 % on the tenant's own Nebenkosten, or label it correctly (e.g. "Verwaltungspauschale 3 % von CHF 10'200.00, Anteil 1/6") on screen and in the PDF.
- B2: Fill the Verteilschlüssel column (e.g. "Pro Fläche: 92.00 von 492.50 m²", "Pro Einheit: 1 von 6") in the detail view **and** the PDF.
- B3: Check completeness before sending: warn when a category's invoices do not cover the whole period, or when a category billed in earlier periods is missing.

**Major**
- M1: Show category names in German everywhere (statement, PDF, settings), matching the invoice list.
- M2: One term each for the fee ("Verwaltungspauschale") and for Akonto ("Akontozahlungen") across detail, edit, PDF and apartment pages.
- M3: Explain the Akonto: "12 x CHF 160.00 = CHF 1'920.00 (gemäss Mietvertrag / eingegangen)".
- M4: Link each cost line to the invoice(s) behind it (drill-down).
- M5: Complete the PDF: tenant address, Verteilschlüssel, notice of the right to inspect receipts, how the refund is paid out.
- M6: Let "Versenden" open a confirmation step with a checklist and the PDF preview; show the PDF inside the app before sending, not only as a download.
- M7: Heating: support stock levels (opening/closing stock) or at least show a hint for fuel deliveries.

**Minor**
- m1: Rename the column "Gesamtkosten" to "Gebäudekosten" (as in the PDF) so it is not confused with the tenant total.
- m2: Edit page: show the balance as "Rückerstattung an Mieter CHF 83.43" instead of "CHF-83.43"; show the date as dd.mm.yyyy.
- m3: Rename "Zahlungsfrist" for refunds (e.g. "Auszahlung bis").
- m4: "Wohnung 1.02 · 1" -> "Wohnung 1.02 · 1. OG".
- m5: Hint about late statements (period ended more than 12 months ago).
- m6: Verteilschlüssel page: translate the descriptions into German.

## Screenshots

- `screens/weber-5/01-draft-list.png`: draft list
- `screens/weber-5/02-draft-detail.png`: detail view with the empty Verteilschlüssel column, English categories, fee 51.00
- `screens/weber-5/03-pdf-preview.png`: rendered PDF
- `screens/weber-5/04-edit-saldo.png`: edit page with "Saldo CHF-83.43" and date "11/09/2026"
- `screens/weber-5/05-invoices-2024.png`: invoice list (Q1/H1 invoices only for 2024)
- `screens/weber-5/06-distribution-keys.png`: Verteilschlüssel with English descriptions
