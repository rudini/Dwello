# Persona test: Helga (68), inherited an apartment building, final round

Date: 10.10.2026
Viewport: desktop 1440x900 at 150 % browser zoom (CSS width 960 px), locale de-CH, signed in, demo data

Task: create my first tenant "Margrit Huber", Kirchgasse 3, 8001 Zürich, and a rental contract for a free apartment, starting on the 1st of next month (1.11.2026), at a plausible rent. Then check that it is recorded.

## 1. Task completed

**Yes, without help from outside the app.**

- Tenant "Margrit Huber" created ("Margrit Huber gespeichert").
- Contract created: Wohnung 2.02, Musterhaus Zentrum, from 1.11.2026, unbefristet, Nettomiete CHF 1'650.00 + Akonto CHF 200.00 = "Monatlich total CHF 1'850.00" ("Mietvertrag von Margrit Huber gespeichert").
- Checked in three places: contract list (badge "Künftig", "ab 1.11.2026, unbefristet"), tenant page (section "Künftige Miete", "Einzug am 1.11.2026"), and apartment list (Wohnung 2.02 now "Wiedervermietet ab 1.11.2026").

## 2. Effort

- Screens: Übersicht -> Neuer Mieter -> tenant page -> contract wizard (5 steps) -> Mietverträge list -> tenant page -> Wohnungen list. About 7 distinct screens.
- Clicks: about 20 (incl. typing 8 fields, 4x "Weiter", 1x "Mietvertrag speichern"), plus 3 for checking.
- Time for Helga: about 8-10 minutes, most of it spent deciding the rent.

## 3. Thinking aloud

1. **Übersicht** ([01](screens/helga-final/01-dashboard.png)). "Oh, the first big box says 'Nebenkostenabrechnungen erstellen' with a dark button. Do I have to do that first? It sounds urgent... No, I want a tenant. Further down: 'Häufige Arbeiten' - 'Mieter erfassen'. That's it." I hesitated because the most prominent thing on the page is not what I came for, and its text ("Abrechnungsperiode ... ist abgelaufen") made me nervous that I am already late with something.
2. **Neuer Mieter** ([02](screens/helga-final/02-tenant-form.png)). Large, clear fields, each with an "Beispiel:" line - very reassuring. "Korrespondenzkanal" is a strange word, but the sentence under it explains it ("Wie der Mieter Post erhält..."). I left "Per Brief". "Sprache" - fine. "Adresse": "Kirchgasse 3 is where Frau Huber lives now. Once she moves into my building, is this still her address? Should I have put my building's address?" I entered Kirchgasse 3 as the task said, but I was unsure.
3. I tried "Mieter erfassen" too early once (only the first name filled) and got friendly red messages per field ("Nachname ist erforderlich", "Für Briefe ist eine Adresse erforderlich") ([11](screens/helga-final/11-tenant-errors.png)). Nothing lost.
4. **Tenant saved** ([03](screens/helga-final/03-tenant-saved.png)). Green note "Margrit Huber gespeichert", and right next to her name a dark button "Mietvertrag erfassen". "Perfect, that's my next step." Also a red "Löschen" right next to it - I kept my mouse away from it.
5. **Wizard step 1 "Mieter"**: Margrit Huber was already selected. Good, I did not have to look for her.
6. **Step 2 "Wohnung"** ([04](screens/helga-final/04-step2.png)): a dropdown "Wohnung OG2 - Alpenblick", "Wohnung 2.02 - Musterhaus Zentrum", ... and many "(nicht verfügbar)". The note says free ones come first - nice. **But I can't see how big the apartments are.** How do I choose a fitting rent if I don't know if 2.02 has 2 or 5 rooms? I picked 2.02. (Only later, on the "Wohnungen" list, I saw it has 2.5 Zimmer, 65 m².)
7. "Entwurf gespeichert, 14:42" appeared. Comforting: if my phone rings, I don't lose everything.
8. **Step 3 "Vertragsdauer"** ([05](screens/helga-final/05-step3.png)): the date field showed **"mm/dd/yyyy"**. "Month first? In Switzerland we write the day first!" I typed 11, 01, 2026 as the pattern asked, and luckily the app wrote underneath "Sonntag, 1. November 2026" - only then was I sure it was right. "Unbefristet" was preselected and explained; that matched.
9. **Step 4 "Miete"** ([06](screens/helga-final/06-step4.png)): "Nettomiete", "Akonto", "Zusatzmiete". Each has an explanation. "Akonto = Vorschuss für Nebenkosten" - ok, I understood. I typed "1'650" with an apostrophe as I would on paper, and it was accepted; the "Monatlich total CHF 1'850.00" updated live. The rent amount itself was a guess - the app gives no hint (no size, no rent of comparable apartments).
10. The step circles at the top show only check marks and numbers, no names, at my zoom level. I did not know what "3" was without reading the line "Schritt 4 von 5: Miete".
11. **Step 5 "Prüfen"** ([07](screens/helga-final/07-step5.png)): a summary with "Ändern" buttons next to each line. Very good - I read it twice, then pressed "Mietvertrag speichern".
12. **Mietverträge list** ([08](screens/helga-final/08-contract-saved.png)): green note "Mietvertrag von Margrit Huber gespeichert", and Margrit at the top with "Künftig ab 1.11.2026". "Künftig - yes, because she moves in next month."
13. **Checking**: tenant page ([09](screens/helga-final/09-tenant-with-contract.png)) shows "Künftige Miete", "Wohnung 2.02", "Einzug am 1.11.2026". Apartments list ([10](screens/helga-final/10-apartments.png)): Wohnung 2.02 is "Wiedervermietet ab 1.11.2026". "Wieder-vermietet? It was empty, I'm renting it for the first time!" The legend at the bottom explains it ("Ein künftiger Mietvertrag ist abgeschlossen..."), but the word made me doubt for a moment whether I had overwritten someone else's contract.

## 4. Terms I did not understand

- **"Wiedervermietet"** - suggests "rented out again"; for an apartment that was empty it reads like a mistake. The legend explains it, but only at the bottom of the list.
- **"Korrespondenzkanal"** - jargon; the help text saved me.
- **"Akonto"** - known from my own rent bill, the help text confirms it.
- **"Nettomiete"** vs **"Monatlich total"** - fine thanks to the explanation.
- **"Nebenkostenabrechnungen erstellen" / "Abrechnungsperiode"** on the Übersicht - not part of my task, but it is the first and biggest thing I see and I did not understand whether I must do it first.

## 5. Error risks

- **Date format:** the date field shows "mm/dd/yyyy" (screenshot 05). A Swiss user typing "01.11.2026" day-first could end up with 11 January. The long-form confirmation ("Sonntag, 1. November 2026") catches it only if one reads it. (Possibly the test browser's date widget locale; still worth checking on real Swiss browsers.)
- **Rent without context:** in the wizard the apartment has no rooms/area, so the rent is a blind guess; a typo like 16'500 would also be accepted without a plausibility hint.
- **Tenant address:** unclear whether to enter the current or the future address. With "Per Brief", letters (e.g. statements, Mahnungen) might go to Kirchgasse 3 after she has moved into my building.
- **"Löschen"** sits directly next to "Mietvertrag erfassen" on the tenant page (red text, but same row). Not tested whether it asks for confirmation.
- No deposit (Mietzinsdepot) field - I wondered if I forgot something, but there was nowhere to enter it.

## 6. Suggestions

- **Major:** Show apartment details (rooms, m², floor, and maybe last net rent) in wizard step 2 or next to the selection, so the rent in step 4 can be chosen sensibly.
- **Major:** Make the "Vertragsbeginn" date input clearly day-first for de-CH (TT.MM.JJJJ), or offer "1. des nächsten Monats" as a quick choice.
- **Minor:** Rename or reword the status for a first future rental: "Vermietet ab 1.11.2026" instead of "Wiedervermietet ab 1.11.2026" when there was no previous tenant.
- **Minor:** Under "Adresse" on Neuer Mieter, add a hint: "Aktuelle Postadresse des Mieters; nach dem Einzug ändern Sie sie auf die Wohnungsadresse" (or offer to switch automatically on move-in).
- **Minor:** Show the step names next to the step circles at 150 % zoom (currently only check marks/numbers).
- **Minor:** On the Übersicht, make "Häufige Arbeiten" (Mieter erfassen, Mietvertrag erfassen) reachable without having to pass the large overdue-sounding Nebenkosten box, or tone that box down so a beginner does not feel obliged to do it first.
- **Minor:** Optional plausibility warning for unusual rent amounts (e.g. far above other apartments in the building).
