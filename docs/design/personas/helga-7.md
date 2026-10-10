# Persona test: Helga (68), inherited an apartment building, little computer experience, round 7

Date: 10.10.2026
Viewport: desktop (1440x900) at 150 % browser zoom (CSS width 960 px), locale de-CH

## 1. Task completed

**Yes.**

- (1) The building "Ahornhof" does not exist, so I used the first building shown, "Musterhaus Zentrum". It has 6 apartments: 4 "Vermietet" and 2 "Leer" (2.02 and 3.02). The page explains all four statuses itself.
- (2) I recorded Ruth Meier (Seestrasse 4, 8800 Thalwil) as a tenant. I then created her contract for Wohnung 2.02 (2.5 Zimmer, 65 m²), starting 1.11.2026, "Unbefristet", Nettomiete CHF 1450, Akonto CHF 180, "Monatlich total" CHF 1630. I learned what "Akonto" means from the help text on the rent step.
- (3) Ruth's page shows "Künftige Miete" with Wohnung 2.02 and "Einzug am 1.11.2026". The apartment page shows "Vermietet ab 1.11.2026" and Ruth's contract. I changed the phone number to "079 123 45 67", and it was saved.

## 2. Effort

- 11 screens: Übersicht, Gebäude-Detail, Wohnung-Detail, Neuer Mieter, Mieter-Detail, contract wizard steps 1 to 5, Mietverträge list, Wohnung-Detail again, Mieter bearbeiten.
- About 30 clicks and inputs.
- About 12 to 15 minutes for Helga, mostly reading the help texts slowly.

## 3. Thinking aloud

1. **Overview** ([01](screens/helga-7/01-dashboard.png)): "Oh, lots of text. 'Nebenkostenabrechnungen erstellen', is that urgent? I'm afraid I'll press something wrong." There is no "Ahornhof". At the bottom, under "Vermietete Wohnungen pro Gebäude", I click the first building, "Musterhaus Zentrum". The small numbers like "0 Wiedervermietet" and "0 Gesperrt" mean nothing to me yet.
2. **Building** ([02](screens/helga-7/02-building.png)): This is nice. Every apartment has a coloured label, and the box "Was bedeutet der Mietstatus?" explains everything. In my own words:
   - **Vermietet:** somebody lives there right now with a contract.
   - **Wiedervermietet:** there is already a signed contract for a new tenant who moves in later.
   - **Leer:** nobody has a contract, so I can rent it out.
   - **Gesperrt:** I closed it myself, for example during renovation.

   The yellow warning triangle on "Leer" frightened me a little: is an empty flat an error? The grey box above (the map) is empty and shows only a square.
3. **Apartment 2.02** ([03](screens/helga-7/03-apartment-before.png)): It says "Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden." There is a big "Mietvertrag erfassen" button. But Ruth isn't in the system yet, so I go back to the overview and click "Mieter erfassen".
4. **New tenant** ([04](screens/helga-7/04-tenant-form.png)): The examples above each field are very helpful. "Korrespondenzkanal" is a stiff word, but the sentence under it explains it. I hesitated over the address: Ruth lives in Thalwil now but will move into my building. Which address do I enter? The form doesn't say. I entered Thalwil and left the phone empty. The green message "Ruth Meier gespeichert" reassured me.
5. **Contract, step 1** ([05](screens/helga-7/05-contract-form.png)): I clicked "Mietvertrag erfassen" on Ruth's page. Ruth was already selected. "Schritt 1 von 5" helps me know how much is left. There is also a "Sarah Meier" in the list, so I have to be careful not to pick the wrong Meier.
6. **Step 2, apartment** ([06](screens/helga-7/06-step2.png)): A dropdown with names like "Wohnung OG2 - Alpenblick". Rented ones are greyed out, "(nicht verfügbar)". Good. But I don't see the number of rooms or the size here, so I had to remember from earlier that 2.02 is the 2.5-room flat.
7. **Step 3, dates:** The date field showed "mm/dd/yyyy", American order. I hesitated whether 1 November is "11/01" or "01/11". I typed it through the calendar. "Unbefristet" was already chosen, and the explanation is clear. "Entwurf gespeichert, 12:26" appeared. Is the contract now saved? I wasn't sure. When I opened the page again, I was back at step 1 anyway.
8. **Step 4, rent** ([07](screens/helga-7/07-step4-rent.png)): "Akonto" is explained right below the field: "Monatlicher Vorschuss des Mieters für Nebenkosten (Heizung, Wasser usw.). Wird mit der Nebenkostenabrechnung verrechnet." So it is a monthly advance payment for heating and water, settled later with the yearly statement. I followed the example values: 1450 rent and 180 Akonto. The total below updates itself, which I like. I had no idea what rent is appropriate. The app gives no hint, for example a rent per m² compared with other flats in the building.
9. **Step 5, review** ([08](screens/helga-7/08-step5-review.png)): A clear summary with "Ändern" next to each line. "Sonntag, 1. November 2026" is nicely written out. I clicked "Mietvertrag speichern".
10. **After saving:** I landed on the list of all 11 contracts, not back on Ruth's page. Ruth is at the top with "Künftig ab 1.11.2026", and the message "Mietvertrag von Ruth Meier gespeichert" appeared.
11. **Ruth's page** ([09](screens/helga-7/09-tenant-with-contract.png)): "Künftige Miete", Wohnung 2.02, "Einzug am 1.11.2026". Everything is there.
12. **Apartment page** ([10](screens/helga-7/10-apartment-after.png)): The label says "Vermietet ab 1.11.2026". But under "Mietverträge der Wohnung" it says **"1.11.2026 - heute"**. Today is 10 October, so how can it run from November until today? This confused me. "Aktueller Mieter: Diese Wohnung ist derzeit nicht vermietet." is correct, but Ruth's name should appear there as the coming tenant. The big "Mietvertrag erfassen" button is still the main button, as if the flat were still free.
13. **Building again** ([11](screens/helga-7/11-building-after.png)): Here 2.02 is now called "Wiedervermietet", while the apartment page says "Vermietet ab 1.11.2026". Two different words for the same thing. "Wiedervermietet" sounds as if someone lived there before. The summary reads "6, davon 4 vermietet und 1 leer". Where is the sixth? It doesn't add up for me.
14. **Phone number** ([12](screens/helga-7/12-phone-saved.png)): On Ruth's page I clicked "Bearbeiten", filled in "Telefon", and clicked "Änderungen speichern". "Ruth Meier gespeichert" appeared, and the number shows on her page. Easy.

## 4. Terms I did not understand

- **Wiedervermietet:** sounds like "rented again". For a flat that was empty, "schon vermietet, Einzug folgt" would be clearer. The apartment page itself calls it "Vermietet ab …".
- **Akonto:** understood thanks to the help text, but the word alone means nothing to a layperson.
- **Nettomiete / Zusatzmiete:** understandable thanks to the help texts.
- **Korrespondenzkanal:** stiff, but explained.
- **OG / EG** in the apartment names: I know these as floors, but "Wohnung OG2" vs. "2. OG" is mixed.
- **Entwurf gespeichert:** I wasn't sure whether the contract was already valid.
- **Nebenkostenabrechnung, Abrechnungsperiode** on the overview: frightening to see as the first thing on the page.

## 5. Error risks

- The two tenants with the same surname ("Ruth Meier" / "Sarah Meier") sit next to each other in the tenant dropdown. Picking the wrong one is easy.
- The apartment dropdown in the wizard shows no rooms or area, so I could pick the wrong free flat.
- The date field shows "mm/dd/yyyy" in my browser, so 1.11. could be entered as 11.1. This may be a test-browser quirk, but if it happens for real users it means a wrong start date.
- The tenant address stays the old Thalwil address after the move-in. Letters ("Per Brief") and statements would go to the old address, and nothing reminds me to change it.
- "Entwurf gespeichert" can make a user believe the contract is finished and leave the wizard before "Mietvertrag speichern". Reopening the wizard starts again at step 1, so the draft is not visible.
- The rent amount has no plausibility hint, so a typo like 14500 would only show in the total.

## 6. Suggestions

- **Major:** On the apartment page, a future contract shows "1.11.2026 - heute". It should read "ab 1.11.2026" or "1.11.2026 – unbefristet" ([10](screens/helga-7/10-apartment-after.png)).
- **Major:** The same state has two names: "Wiedervermietet" in the building list and on the dashboard, "Vermietet ab 1.11.2026" on the apartment page. Use one wording everywhere, preferably "Vermietet ab …", and replace "Wiedervermietet" for a flat that was empty.
- **Major:** The building summary "6, davon 4 vermietet und 1 leer" leaves the future-let flat out, so the numbers don't add up. Mention it, for example "und 1 ab 1.11.2026 vermietet".
- **Minor:** On the apartment page, "Aktueller Mieter" should name the coming tenant, for example "Ruth Meier zieht am 1.11.2026 ein". Make "Mietvertrag erfassen" less prominent once a future contract exists.
- **Minor:** In wizard step 2, show rooms and area in the apartment options, for example "Wohnung 2.02 – Musterhaus Zentrum (2.5 Zi., 65 m²)".
- **Minor:** In the tenant form, explain which address belongs there, for example "Bisherige Adresse; nach dem Einzug anpassen". Or offer to switch the address to the apartment on move-in.
- **Minor:** After "Mietvertrag speichern" started from a tenant's page, return to that tenant's page instead of the contract list.
- **Minor:** Make "Entwurf gespeichert" clearer, for example "Zwischenstand gespeichert – der Mietvertrag ist erst mit «Mietvertrag speichern» erstellt". Resume the draft when the wizard is reopened.
- **Minor:** Use a neutral or info icon for "Leer" instead of a warning triangle. An empty flat is not an error, and the triangle alarms anxious users.
- **Minor:** Check that the date field shows the Swiss order (TT.MM.JJJJ) for de-CH users. The test browser showed "mm/dd/yyyy".
- **Minor:** The map box on the building page shows only a grey area with a square ([02](screens/helga-7/02-building.png)). Show a real map or hide the box.
