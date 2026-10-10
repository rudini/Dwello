# Persona test: Dr. Weber (52), cautious landlord, round 6

Date: 10.10.2026 · Desktop 1440×900 · Demo data · Playwright, operated like a user only

## 1. Task completed

**Partly.**
- (1) I worked through the wizard for 2025 to the preview (step 4) for all three buildings, and looked at step 5 without creating anything. Done.
- (2) I opened the only draft (NK-11111111-2024-0002, Anna Schmidt), checked the numbers, opened "Versenden" and the PDF. I did not confirm sending.
- The numbers add up, but I could only follow two of them by rebuilding them myself from other pages. I would not send this statement as it is.

## 2. Effort

- About 10 screens in total.
- The wizard was quick: 4 clicks to the preview.
- Checking the draft took the most time. I had to open the building page (apartment areas) and calculate by hand to find out where "18.68%" for heating and the "Verwaltungsgebühr (3%) CHF 51.00" come from.

## 3. Walkthrough

1. **Übersicht.** "Als Nächstes zu tun" tells me plainly that the 2025 period has ended and has not been billed yet, and that 1 statement is still a draft. Good: I know right away what is pending.
2. **Abrechnungen erstellen, Schritt 1.** The period 1.1.2025 – 31.12.2025 is suggested. Below the fields the date is written out ("Mittwoch, 1. Januar 2025"). That reassures me, because the input field itself showed "01/01/2025" in US order.
3. **Schritt 2 Gebäude.** Checkboxes with address and number of apartments. I chose "Musterhaus Zentrum".
4. **Schritt 3 Heizprofil und Verwaltungspauschale** (screen 01).
   - The heating profiles are named in English: "Heating + Hot Water (100%)", with the description "Standard profile for combined heating and hot water systems".
   - The monthly bar chart has no values. I can see the shape but not the percentages.
   - Verwaltungspauschale 3 % is preset, with the hint "Üblich sind bis 3 %". That helps.
   - The sentence "Die Pauschale wird so auf die Wohnungen verteilt, je Mieter nach Mietstagen" reads awkwardly ("Mietstagen").
5. **Schritt 4 Vorschau** (screen 02).
   - A clear warning "Rechnungen fehlen": no invoices for 2025, so CHF 0.00 is distributed and every tenant gets their Akonto back.
   - "Weiter" is blocked until I tick "Die Abrechnungen trotzdem erstellen" ("Bestätigen Sie, dass …"). Very good: I could not produce a wrong statement by accident.
   - The list per tenant shows Kosten CHF 0.00 and Rückerstattung (e.g. Maria Rossi CHF 4'200.00).
   - Same result for Seepark Residenz and Alpenblick. The invoice list confirms it: all 14 invoices are from 2024.
6. **Schritt 5 Erstellen** (viewed only). "Es wird nichts verschickt. Sie prüfen danach jede Abrechnung und versenden sie einzeln." Exactly what I want to read. I did not click "Entwürfe erstellen".
7. **Draft NK-11111111-2024-0002** (screen 03).
   - The cost table, subtotal, fee, Akonto and refund are all there, and the sums are arithmetically correct. I recalculated them: 1'785.57 + 51.00 = 1'836.57, and 1'920.00 − 1'836.57 = 83.43.
   - The "Verteilschlüssel" column is empty for every line.
   - The categories are in English: "Heating", "Cold Water", "Caretaker", "Elevator" …
8. **Versenden** (screen 04).
   - The dialog title is honest: "Abrechnung als versendet markieren".
   - It says: "Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu …". It shows Empfänger: Anna Schmidt, Korrespondenzweg: Per E-Mail, anna.schmidt@example.ch, and the button "PDF ansehen".
   - I clicked "Abbrechen", not "Als versendet markieren".
9. **PDF** (screen 05).
   - One A4 page: sender "Muster Immobilien AG", tenant name, apartment (1.OG, 92 m²), period, 366 days, cost table, "Verwaltungskosten (3.0%)", Akonto, "Rückerstattung CHF 83.43".
   - It matches the screen exactly, but it has the same gaps (see 5).

## 4. Points of confusion (incl. terms)

- **Three names for one fee:**
  - "Verwaltungspauschale" in the wizard
  - "Verwaltungsgebühr (3%)" on the detail page
  - "Verwaltungskosten (3.0%)" in the PDF
- **"(3%)" does not match the amount.** 3 % of Anna's subtotal CHF 1'785.57 would be CHF 53.57, but the statement shows CHF 51.00. I only understood it after calculating: 3 % of all building costs (CHF 10'200 → 306) divided equally over 6 apartments = 51.00. That fits the wizard setting "Gleichmässig pro Wohnung", but a tenant reading "3%" next to their own subtotal will think it is wrong.
- **"Heating 18.68%" vs. "16.67%" for everything else.** It is not explained. I worked it out: 92 m² / 492.5 m² of the building's area means heating is split by area, and the rest by apartment (1/6). The empty "Verteilschlüssel" column is exactly where this should be stated.
- **English category and profile names** in an otherwise German app and in the tenant's PDF ("Heating", "Waste Disposal", "Heating Mountain").
- **"Wohnung 1.02 · 1"** in the list and on the detail page. The "· 1" is apparently the floor, but nothing says so ("Wohnung A1 ·" even ends with an empty dot).
- **"Entwurf" means two things:** the saved wizard state ("Entwurf gespeichert, 10:42") and the statement status "Entwurf".
- **"Zahlungsfrist 9.11.2026"** on a statement that pays money back to the tenant. Who has to pay whom by that date?
- **Date fields** display MM/DD/YYYY ("12/31/2025"). Only the written-out line below makes the date unambiguous.

## 5. Legal/correctness concerns and error risks

- **Distribution key missing on the statement and in the PDF.** In my understanding, a Swiss utility statement must let the tenant see how each cost item was split (VMWG Art. 4 / OR 257b), so a tenant can check it. Today the PDF shows only percentages without a basis. Risk: the tenant disputes it and I cannot point to anything on the paper.
- **Fee basis not traceable.** "(3.0%)" next to CHF 51.00 looks like a calculation error to the reader.
- **Incomplete year.** The 2024 statement for Musterhaus Zentrum is based on invoices that cover parts of the year only: water, common electricity and lift "Q1 2024", caretaker "März 2024", one heating-oil delivery in January. The year is 366 days. No warning appeared for these gaps. The wizard catches "no invoices at all" well, but not "only one quarter". The draft looks plausible and would short-bill the tenant (or, the other way round, a missing credit note could overbill them).
- **Heating oil billed by purchase.** "Heizöl Lieferung Januar 2024" is billed as the heating cost. In practice, oil is billed by consumption (opening stock + purchases − closing stock). Nothing asks for the stock levels.
- **PDF content gaps for a document that goes to a tenant:**
  - no tenant postal address (the tenant record shows "Adresse –")
  - the building address has no postcode or place ("Bahnhofstrasse 42")
  - no note about the tenant's right to inspect receipts (Belegeinsicht)
  - no word on how the CHF 83.43 refund will be paid (bank transfer? offset against the next rent?)
  - no contact person
- **Delivery proof.** Sending is only a manual mark, which the dialog states honestly. The app records nothing about how and when the PDF actually reached the tenant. E-mail is allowed, but if there is a dispute I have no proof of receipt.
- **PDF frozen at creation** ("PDF erstellt 10.10.2026, 10:41:11"). If I edit the draft via "Bearbeiten", I am not sure whether the PDF I send matches the screen. The app does not say. I did not test editing.
- **"Bearbeiten" on a draft:** I did not try it. If amounts can be changed by hand, there should be a visible trail of the change.

## 6. Improvement suggestions

| Priority | Suggestion |
|---|---|
| **Blocker** | Show the distribution key per line on the detail page and in the PDF (e.g. "Fläche: 92.00 / 492.50 m²", "pro Wohnung: 1 / 6"). The "Verteilschlüssel" column is empty today. |
| **Blocker** | Show German category names in the statement and PDF (the invoice list already shows "Heizung", "Kaltwasser"). |
| **Major** | Show the fee basis: "Verwaltungspauschale 3 % von CHF 10'200.00, gleichmässig auf 6 Wohnungen = CHF 51.00". Use one term ("Verwaltungspauschale") everywhere. |
| **Major** | Add a preview warning for incomplete cost coverage, e.g. "Kaltwasser: nur Rechnungen für Jan–März" or categories present in the previous year but missing now. |
| **Major** | Add the tenant postal address and the full building address (PLZ/Ort) to the PDF, plus a standard footer: right to inspect receipts, how the refund is paid out, contact. |
| **Major** | For refunds, replace "Zahlungsfrist" with something like "Auszahlung bis" (or hide it), so the direction of payment is unambiguous. |
| **Minor** | Use German names and descriptions for the heating profiles; show the monthly percentages on the bars. |
| **Minor** | Label the floor ("1. OG") instead of "· 1", and remove the empty "·". |
| **Minor** | Call the wizard state something other than "Entwurf" (e.g. "Eingaben gespeichert"). |
| **Minor** | Make the date input follow the Swiss format (dd.mm.yyyy). |
| **Minor** | In the Versenden dialog, optionally note the delivery date and channel, to keep as proof. |

Screens: `screens/weber-6/01-step3-heizprofil.png`, `02-preview-rechnungen-fehlen.png`, `03-draft-detail.png`, `04-versenden-dialog.png`, `05-pdf.png`

What worked well: the "Rechnungen fehlen" warning with its mandatory confirmation, the "Es wird nichts verschickt" note in step 5, and the honest Versenden dialog (recipient, channel, PDF link, no automatic sending). The arithmetic of the draft is correct.
