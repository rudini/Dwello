# Persona test: Helga (68, inherited a building, 150 % zoom), run 5

Task: create tenant Herr Peter Brunner (Musterstrasse 12, 8400 Winterthur, peter.brunner@example.ch), ideally from inside the contract flow, then a Mietvertrag for a vacant apartment from 01.11.2026 with Nettomiete CHF 1'450 and Nebenkosten-Akonto CHF 180 per month. Desktop, 150 % zoom, demo data, today 10.10.2026.

## 1. Task completed

**Yes**, but only because I noticed two wrong values on the review step and corrected them. Typed the way I always write them, the date would have been saved as 11 January 2026 and the Nettomiete as CHF 1.00.

Result: tenant Peter Brunner (with address and e-mail), contract on "Wohnung OG2 - Alpenblick", Vertragsbeginn 01.11.2026, unbefristet, Nettomiete CHF 1'450.00, Akonto CHF 180.00, Total Bruttomiete CHF 1'630.00.

## 2. Effort

- Pages: Übersicht, contract wizard (5 steps on one page), Neuer Mieter, back to the wizard, contract list, contract detail (only to check). There were 4 distinct screens.
- Clicks: about 22 (including about 5 for corrections: "Ändern" on Nettomiete, retyping the date, going back through the steps).
- Felt like: 6 to 8 minutes for me. The wizard felt calm and guided. The two corrections were the stressful part, because I had to look closely to catch them.

## 3. Walkthrough (thinking aloud)

1. **Übersicht.** "A lot of numbers. But under 'Häufige Arbeiten' I see 'Mieter erfassen' and 'Mietvertrag erfassen'. I'm supposed to do the contract and the tenant together, so I'll try 'Mietvertrag erfassen'." Sure: high.
2. **Wizard step 1 "Mieter".** "Step 1 of 5, good, I like knowing how long this takes. 'Die Person, die die Wohnung mietet. Steht sie noch nicht in der Liste, erfassen Sie sie zuerst.' Herr Brunner is not in the list, and there is a button 'Neuen Mieter erfassen'. Wonderful." Sure: high.
3. **"Neuen Mieter erstellen"** ([screenshot](screens/helga-5/01-tenant-form.png)). "'Danach geht es mit dem Mietvertrag weiter', so I won't lose my place. Good. There is no field for 'Herr', so I'll just leave it out. Hm, the street field already says 'Musterstrasse 12'. Did someone fill that in already? Oh, it's grey, only an example. That's exactly his address, which confused me for a second." I filled in Vorname, Nachname, E-Mail, Strasse, PLZ, Ort. "Korrespondenz 'Per E-Mail', fine. Why is this button bright blue when everything else is dark green-blue?" Sure: medium. I wasn't sure whether 'Herr' matters for letters.
4. **Back in the wizard** ([screenshot](screens/helga-5/02-tenant-confirmed-in-wizard.png)). "Green box: 'Mieter erfasst – Peter Brunner ist gespeichert und für diesen Mietvertrag gewählt.' He's already selected. That's a clear confirmation." Sure: high.
5. **Step 2 "Wohnung".** "'Freie Wohnungen stehen zuoberst.' The list shows 'Wohnung OG2 - Alpenblick', 'Wohnung 2.02 - Musterhaus Zentrum'... I don't know these well. How big is OG2, and what did it cost before? I just take the first one." Sure: medium. The list gives nothing to tell the flats apart: no rooms, no size, no floor in words.
6. **Step 3 "Vertragsdauer"** ([screenshot](screens/helga-5/03-date-typed-swiss-order.png)). "Vertragsbeginn, 'Erster Tag des Mietverhältnisses.' The box says 'mm/dd/yyyy'. What does mm mean? I type 01.11.2026 as always." Underneath it then said **"Sonntag, 11. Januar 2026"**. "January? I wanted November! And January 2026 is in the past, yet nobody complains." Only the written-out line saved me. I retyped it month first, and it then read "Sonntag, 1. November 2026". "'Unbefristet' is already chosen and explained well." Sure: low, then medium.
7. **Step 4 "Miete"** ([screenshot](screens/helga-5/04-rent-apostrophe-total-181.png)). "'Nettomiete pro Monat – Monatliche Grundmiete ohne Nebenkosten.' Good, I understand that. 'Akonto pro Monat (optional) – Monatlicher Vorschuss des Mieters für Nebenkosten (Heizung, Wasser usw.)'. My task says 'Nebenkosten Akonto', so this must be it. I'm glad it's explained." I typed 1'450, the Swiss way, and 180. "**Monatlich total CHF 181.00**? That can't be right." The field still showed "1'450" and gave no error message. Sure: low.
8. **Step 5 "Prüfen"** ([screenshot](screens/helga-5/05-review-nettomiete-1.png)). "'Nettomiete CHF 1.00'. So it really took only the 1. Good that this summary exists." I clicked "Ändern" next to Nettomiete. It took me back to the step, but the cursor was not in the field. I typed 1450 without the apostrophe and the total became CHF 1'630.00. Back on "Prüfen", everything was right, so I clicked "Mietvertrag speichern".
9. **Contract list** ([screenshot](screens/helga-5/06-contract-list-saved.png)). "A message 'Mietvertrag von Peter Brunner gespeichert', and he's at the top. But it says '01.11.2026 - heute'? It hasn't even started, so why 'heute'? And it's already 'AKTIV'. And 'Mietzins CHF 1'630', is that with or without Nebenkosten?" The detail page then showed Nettomiete 1'450, Akonto 180 and "Total Bruttomiete" 1'630, which was clear. Sure that it's saved: high. Sure that it's correct: only after checking the detail page.

## 4. Points of confusion (incl. terms)

- **Date format "mm/dd/yyyy"**: an American order shown to a Swiss user. I don't know what "mm/dd" means, and typing "01.11.2026" silently becomes 11 January. (Note: the format comes from the browser. A Swiss-German Chrome may show TT.MM.JJJJ, but the app does not guard against it either way.)
- **"1'450" accepted as CHF 1.00**: no error message, and the field keeps showing 1'450 while the total says 181.00.
- **"01.11.2026 - heute" and "AKTIV"** for a contract that starts in three weeks: it reads as if Herr Brunner already lives there.
- **Mietzins / Nettomiete / Bruttomiete / Monatlich total**: four words for rent amounts. The list column "Mietzins" shows the gross amount, the wizard says "Monatlich total", the detail page says "Total Bruttomiete". I could follow it only because the detail page lists the parts.
- **Akonto**: explained well in the wizard. My task said "Nebenkosten Akonto", and the hint text made the connection.
- **Zusatzmiete**: understood thanks to the example (Garage, Parkplatz).
- **"Wohnung OG2"**: OG means Obergeschoss, I think? On the detail page there is a lone "2" under it, which I didn't understand.
- **No "Herr/Frau" (Anrede)**: I was told "Herr Peter Brunner" and found no place for it. Will letters say "Sehr geehrter Herr Brunner"?
- **Placeholder "Musterstrasse 12"**: looks like pre-filled data, and here it happened to be the real address.

## 5. Error risks

1. **Wrong start date** (high): DD.MM typed into an MM/DD field swaps day and month. The past date (Jan 2026) is accepted without a warning. The weekday line below is the only safety net, and it is small and easy to skip.
2. **Rent of CHF 1.00** (high): the Swiss thousands separator `'` cuts off the number. No validation message, and the input still looks correct. Only the total and the review step reveal it. A tired user clicks "Mietvertrag speichern", and later the QR-bills and Nebenkostenabrechnung are wrong.
3. **Choosing a flat blindly** (medium): the apartment dropdown gives no rooms, size, floor or previous rent, so it's easy to pick the wrong flat.
4. **"AKTIV" before the start** (low/medium): this may lead to sending documents or invoices too early, or to believing the flat is occupied already.

## 6. Readability at 150 % zoom

- The wizard is very readable: large labels, explanations in full sentences, roomy buttons, and the step bar with checkmarks fits on one line.
- The weekday confirmation under the date field ("Sonntag, 11. Januar 2026") is bold but the same size as the help text. It deserves more prominence because it's the main error catcher.
- On the contract list, the toast "Mietvertrag von Peter Brunner gespeichert" covers the second row and part of the new contract's row. Columns wrap ("01.07.2023 -" / "heute", "/Mt." on its own line). The status badge "AKTIV" and the uppercase column headers are small.
- The detail page is clear. "Total Bruttomiete" in large blue is easy to find.
- Inconsistent button colours: bright blue "Mieter erstellen", "Neuer Vertrag" and "Suchen" next to dark teal "Weiter" and "Mietvertrag speichern". It made me wonder whether I had landed in a different program.

## 7. Improvement suggestions

| # | Severity | Suggestion |
|---|----------|-----------|
| 1 | **Blocker** | Parse Swiss amounts: accept `1'450`, `1’450`, `1 450` and `1450.–` as 1450. If the input cannot be read fully, show an error at the field instead of silently using a part of it. |
| 2 | **Major** | Date input independent of browser locale: show "TT.MM.JJJJ" (or a text field that accepts 01.11.2026) so the Swiss order cannot flip day and month. |
| 3 | **Major** | Warn when Vertragsbeginn lies in the past ("Der Vertragsbeginn liegt in der Vergangenheit. Stimmt das?"), and make the written-out date more prominent. |
| 4 | **Major** | Contracts that have not started yet: show "ab 01.11.2026" instead of "01.11.2026 - heute", and a status like "Beginnt am 01.11.2026" instead of "AKTIV". |
| 5 | Minor | Apartment dropdown: add rooms, m² and floor (e.g. "OG2 – 3.5 Zimmer, 85 m² – Alpenblick, Interlaken"). |
| 6 | Minor | Use one name for the gross amount everywhere ("Bruttomiete pro Monat") in the wizard total, the list column (instead of "Mietzins") and the detail page. |
| 7 | Minor | "Ändern" on the review step should put the cursor into the field it refers to. |
| 8 | Minor | Offer an optional "Anrede" (Herr/Frau/–) on the tenant form for letters. |
| 9 | Minor | Use a neutral placeholder or drop it ("z. B. Bahnhofstrasse 1"). A realistic example looks like pre-filled data. |
| 10 | Minor | The success toast on the contract list should not cover table rows, or the new row should be highlighted instead. Unify the primary button colour (blue vs. teal). |
