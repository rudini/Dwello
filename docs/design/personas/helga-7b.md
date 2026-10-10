# Persona test: Helga (68), inherited an apartment building, little computer experience, round 7b

Date: 10.10.2026
Viewport: desktop 1440x900 at browser zoom 150 % (960x600 CSS px), locale de-CH

## 1. Task completed

**Yes, all four parts.**

1. **Statuses:** I found free, rented and "rented from later" apartments on the building pages. The explanation box "Was bedeutet der Mietstatus?" told me what each one means. All the numbers added up: on the building page, in the building list and on the overview.
2. **Elsa Brunner** (Dorfstrasse 12, 8820 Wädenswil) is recorded. Her rental contract for Wohnung 2.02, Musterhaus Zentrum, starts 1.11.2026, unbefristet, at CHF 1'400 rent plus CHF 150 Akonto.
3. **Apartment page and Elsa's page** agree on who moves in, where and when. Nothing contradicts.
4. **Empty last name:** saving stops, the field turns red and shows "Nachname ist erforderlich", the cursor jumps there, and everything else I typed is kept.

## 2. Effort

- About 11 screens: overview, 3 building pages, building list, tenant form (2x), Elsa's page, contract wizard (5 steps), contract list, apartment page.
- About 25 clicks/inputs.
- Roughly 12-15 minutes at Helga's pace. Most of that was reading the status explanation and the contract wizard texts.

## 3. Thinking aloud

1. **Overview ([11](screens/helga-7b/11-dashboard-after.png) shows it after my change).** "Gebäude und Wohnungen: 13 Wohnungen, 9 Vermietet, 0 Wiedervermietet, 4 Leer, 0 Gesperrt." 9 + 4 = 13, good. But what is "Wiedervermietet"? It is not explained here, so I clicked my first building.
2. **Musterhaus Zentrum ([01](screens/helga-7b/01-building.png)).** At the top it says "6, davon 4 vermietet und 2 leer", and below I count 4 green "Vermietet" and 2 yellow "Leer". It adds up. The box "Was bedeutet der Mietstatus?" at the bottom helped a lot:
   - **Vermietet:** someone lives there with a running contract.
   - **Leer:** free, I can rent it out.
   - **Wiedervermietet:** a contract is already signed for later, and the flat is rented from that date even if it is still empty.
   - **Gesperrt:** I closed it myself, e.g. for painting.

   I only found that box after scrolling past everything. Seepark Residenz (4 = 3 + 1) and Alpenblick (3 = 2 + 1) also add up. The building list shows the same counts.
3. **Free apartments.** 2.02 and 3.02 (Musterhaus), B1 (Seepark), OG2 (Alpenblick). I chose 2.02.
4. **New tenant ([02](screens/helga-7b/02-tenant-form.png)).** I clicked "Mieter erfassen" on the overview. The form is clear: big fields, examples under each label, optional fields say "(optional)".

   I hesitated at "Korrespondenzkanal". The help text "Wie der Mieter Post erhält" explained it, and "Per Brief" was already chosen, so I left it.
5. **Last name left empty on purpose ([03](screens/helga-7b/03-empty-lastname.png)).** I filled in only Elsa, the street, the PLZ and the place, then clicked "Mieter erfassen". I stayed on the page; the Nachname box got a red frame, the message "Nachname ist erforderlich" appeared under it, and the cursor jumped into it. Nothing I had typed was lost. That felt safe. I typed "Brunner" and saved.
6. **Elsa's page ([04](screens/helga-7b/04-tenant-saved.png)).** I got "Elsa Brunner gespeichert", and her address is correct. "Aktuelle Miete: Dieser Mieter hat keinen laufenden oder künftigen Mietvertrag" is fair, since I haven't made one yet. The big blue "Mietvertrag erfassen" button right there told me the next step.
7. **Contract wizard.**
   - **Step 1:** Elsa was already selected. Nice, I didn't have to search.
   - **Step 2:** the dropdown lists the free flats first and greys out the others as "(nicht verfügbar)". Easy.
   - **Step 3 ([05](screens/helga-7b/05-step3.png)):** the date field showed "mm/dd/yyyy". I am Swiss and write day first, so I was not sure what to type. After I chose the date the page wrote out "Sonntag, 1. November 2026", so I knew it was right. "Unbefristet" was already chosen, and its explanation "läuft, bis er gekündigt wird" I understood.
   - **Step 4:** "Akonto" is a word I've heard but wasn't sure of. The text "Monatlicher Vorschuss des Mieters für Nebenkosten (Heizung, Wasser usw.)" explained it. I entered 1400 and 150, and the total updated.
   - **Step 5 ([06](screens/helga-7b/06-review.png)):** a calm summary, with "Ändern" next to every line. I clicked "Mietvertrag speichern".
8. **After saving ([07](screens/helga-7b/07-contract-saved.png)).** I landed on the long list of all contracts, not back on Elsa's page where I had started. A little disorienting with 11 contracts. Elsa is at the top with "Künftig, ab 1.11.2026, unbefristet". **"Künftig"? On the building it was called "Wiedervermietet".** Are those the same thing? I assume so.
9. **Building again ([08](screens/helga-7b/08-building-after.png)).** "6, davon 4 vermietet, 1 wiedervermietet und 1 leer". 4 + 1 + 1 = 6, correct. Wohnung 2.02 now says "Wiedervermietet ab 1.11.2026", with the date, which is good. The overview now shows 9 / 1 / 3 / 0, which sums to 13. The bar "Musterhaus Zentrum 4/6 vermietet" still says 4. That is correct, since Elsa isn't in yet, but nothing says so.
10. **Apartment page ([09](screens/helga-7b/09-apartment.png)).**
    - "Mietstatus: Wiedervermietet ab 1.11.2026", with the explanation underneath.
    - "Künftiger Mieter: Ab 1.11.2026 vermietet an Elsa Brunner. Bis dahin läuft kein Mietvertrag."
    - The contract list shows "Künftig".

    Very clear about who comes when.
11. **Elsa's page ([10](screens/helga-7b/10-elsa.png)).** "Künftige Miete: Wohnung 2.02, Musterhaus Zentrum, Monatlich total CHF 1'550.00, Einzug am 1.11.2026", plus her contract marked "Künftig". This matches the apartment page exactly: same flat, same date, same amount. **No contradiction.**

    The only wording mismatch: the flat says "Wiedervermietet", while the contract and Elsa's page say "Künftig" and "Künftige Miete".

## 4. Terms I did not understand

- **"Wiedervermietet"**: "wieder" means "again", but 2.02 was empty, so who rented it before? The explanation box clears it up, but the word alone made me think something else. In the same place the contract is called "Künftig", which is easier.
- **"Korrespondenzkanal"**: an office word, but the help text made it clear.
- **"Akonto"**: clear only thanks to the help text.
- **"Unbefristet / Befristet"**: understood thanks to the descriptions.
- **"Gesperrt"**: understood from the explanation box.

## 5. Error risks

- **Date format "mm/dd/yyyy" in the Vertragsbeginn field ([05](screens/helga-7b/05-step3.png)).** A Swiss user typing "01.11." order could swap day and month, e.g. 11 January instead of 1 November. The spelled-out confirmation underneath catches it only if she reads it. This may be how the test browser displays dates and not the app; it needs checking in a real de-CH browser.
- **Two words for one state ("Wiedervermietet" and "Künftig").** A user may think these are different things.
- **"4/6 vermietet" on the overview** does not count the future rental. It is correct, but someone glancing at it may think the new contract was not saved.
- **After saving the contract I land on the full contract list.** A nervous user may not see "her" new contract right away. Here it was at the top with a toast, so the risk is low.
- **Validation on an empty last name works well** ([03](screens/helga-7b/03-empty-lastname.png)): there is no risk of losing input.

## 6. Suggestions

- **Minor:** Rename the apartment status "Wiedervermietet" to something like "Vermietet ab …" or "Künftig vermietet". That fits the contract badge "Künftig" and the box "Künftiger Mieter", and avoids the "wieder" (again) confusion for flats that were empty.
- **Minor:** On the overview, add a short hint or tooltip for the status tiles, or a link "Was bedeutet der Mietstatus?" to the explanation. Right now it exists only at the bottom of each building page.
- **Minor:** Under "Vermietete Wohnungen pro Gebäude", show future rentals, e.g. "4/6 vermietet, 1 ab 1.11.2026". This avoids "did my contract save?" doubts.
- **Minor:** When the contract wizard was started from a tenant's page (`?tenant=`), return to that tenant's page after "Mietvertrag speichern" instead of the full contract list.
- **Minor (verify):** The Vertragsbeginn date field showed "mm/dd/yyyy". Make sure Swiss users see day.month.year (e.g. "TT.MM.JJJJ" placeholder or a hint "Beispiel: 1.11.2026" like the other fields).
- **Minor:** Move the status explanation box higher, or make the badges link to it. At 150 % zoom it sits below all the apartments.
