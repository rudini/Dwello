# Persona test: Marco (38), smartphone only, impatient, final round b

Date: 10.10.2026
Viewport: mobile (390 x 844, touch, de-CH), zoom 100 %

Task: create the Nebenkostenabrechnungen for 2025 for all buildings, on the phone, through to created drafts. Record one missing invoice from inside the wizard if needed.

## 1. Task completed

**Yes.** 9 drafts for 1.1.2025 – 31.12.2025 were created for all three buildings ("9 Nebenkostenabrechnungen sind als Entwurf erstellt."). Along the way I recorded one invoice from inside the wizard: "Hauswartung Keller AG", 15.12.2025, CHF 600.00, Musterhaus Zentrum, category "Hauswart". For Seepark Residenz and Alpenblick I confirmed "Die Abrechnungen trotzdem erstellen" (CHF 0.00 costs, full Akonto refund).

## 2. Effort

- Screens: Dashboard -> wizard steps 1-4 -> "Neue Rechnung" -> back in the wizard (step 3) -> steps 4, 5 -> result -> draft list. That is 9 screens.
- Taps: about 22, with 5 form fields typed and 2 dropdowns chosen.
- Time: about 3-4 minutes for a real user. Most of it went on the invoice form and on scrolling the long step 4 preview (about 3450 px, roughly 4 phone screens).
- No horizontal scrolling on any screen: `scrollWidth` = `clientWidth` = 390 on the dashboard, every wizard step, the invoice form, the result and the draft list.

## 3. Thinking aloud

1. **Dashboard** ([01](screens/marco-final-b/01-dashboard.png)): the first card is "Nächster Schritt: Nebenkostenabrechnungen erstellen". It says that 2025 has not been billed for any of the three buildings and "Erfassen Sie zuerst alle Rechnungen dieser Periode…". That is a hint, but I'm in a hurry. I skip "Rechnungen 2025 ansehen" and tap the big button "Abrechnungen erstellen". Good: the right next step sits at the top of the page.
2. **Step 1 "Abrechnungsperiode"** ([02](screens/marco-final-b/02-step1-period.png)): 2025 is already filled in. The date field shows "01/01/2025" in US format, but the line underneath says "Mittwoch, 1. Januar 2025", so I'm sure it's right. I tap "Weiter".
3. **Step 2 "Gebäude"** ([03](screens/marco-final-b/03-step2-buildings-warning.png)): **this is the first place the app tells me that invoices are missing.** Each building card has an orange line "Keine Rechnungen in der Abrechnungsperiode erfasst". Honestly, I tap "Alle Gebäude" and move on without reading it, because it's only a line of text and the step does not stop me. Visually, the building cards and the "0 von 3 gewählt" counter reach past the right edge of the white panel and end about 2 px from the screen edge. It looks unfinished, although nothing scrolls sideways.
4. **Step 3 "Heizprofil und Verwaltungspauschale"**: I keep the defaults (Heizung + Warmwasser, 3 %, Gleichmässig pro Wohnung) and tap "Weiter". The bar chart is nice, but I don't need it.
5. **Step 4 "Vorschau"** ([04](screens/marco-final-b/04-step4-missing-invoices.png)): "Kosten aller Abrechnungen CHF 0.00" and a yellow box "Rechnungen fehlen" with a "Rechnung erfassen" button. Now I get it. I first tap "Weiter" anyway, impatiently. The app stops me, scrolls to the checkbox and shows in red: "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." ([05](screens/marco-final-b/05-step4-confirm-required.png)). That is clear and I can't miss it.
6. **Recording an invoice from the wizard:** I tap "Rechnung erfassen" and the form "Neue Rechnung" opens ([06](screens/marco-final-b/06-invoice-form-filled.png)).
   - The date is empty, not pre-filled with the period. That's fine, since the hint tells me to take the date from the invoice.
   - The amount field has a "CHF" prefix, which is good.
   - The "Kategorie" dropdown only showed "Kategorie auswählen" until I had picked a building. For a moment I thought there were no categories at all.
   - I fill in Musterhaus Zentrum, 15.12.2025 ("Montag, 15. Dezember 2025" is shown), 600.00, Hauswartung Keller AG, "Hauswartung Dezember 2025", category Hauswart, and tap "Rechnung speichern".
7. **What happens after saving** ([07](screens/marco-final-b/07-back-at-step3.png)): I'm back in the wizard with the toast "Rechnung von Hauswartung Keller AG gespeichert" and a box "Entwurf wiederhergestellt". My inputs are kept, which is good. **But I land on step 3 (Heizprofil), not on step 4 (Vorschau) where I tapped the button.** I wonder whether I did something wrong and have to tap "Weiter" again. The return link is `/statements/generate?schritt=3`, which looks like an off-by-one. The toast also covers the heading of the step-3 card.
8. **Step 4 again** ([08](screens/marco-final-b/08-step4-after-invoice.png)): Musterhaus Zentrum now shows "1 Rechnung vom 15.12.2025". The "Rechnungen fehlen" box only names Seepark Residenz and Alpenblick, so the invoice really arrived. There is a new box "Rechnungen nur für einen Teil der Periode" for Musterhaus Zentrum, which is fair. "Kosten aller Abrechnungen CHF 412.00" confused me for a moment because I had entered 600. The small print explains that the share of vacant apartments stays with the landlord, and per tenant it is CHF 103.00 × 4. Fine, but you have to do the maths yourself. I don't have the other invoices with me, so I tick "Die Abrechnungen trotzdem erstellen" and tap "Weiter".
9. **Step 5 "Erstellen"** ([09](screens/marco-final-b/09-step5-create.png)): "Es werden 9 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt." and a repeat warning "Ohne Rechnungen" for Seepark/Alpenblick. Clear. I tap "Entwürfe erstellen".
10. **Result** ([10](screens/marco-final-b/10-drafts-created.png)): after about 2.5 s, "9 Nebenkostenabrechnungen sind als Entwurf erstellt." with "Entwürfe ansehen". The draft list ([11](screens/marco-final-b/11-draft-list.png)) shows "10 Entwurf": my 9 for 2025 plus an older 2024 draft. The page heading breaks as "Nebenkostenabrechnun / gen" without a hyphen. The 2025 drafts have no "PDF" link, while the older 2024 draft does, so I can't quickly glance at one. The dashboard now shows "10 Nebenkostenabrechnungen sind noch im Entwurf".

## 4. Terms I did not understand

- **"Heizprofil"**: I understand roughly "split heating costs by month", but not why it matters for a whole-year statement.
- **"Verteilung der Verwaltungspauschale" / "Pro Einheit"**: which unit? An apartment? I don't know how that differs from "Gleichmässig pro Wohnung".
- **"Kosten aller Abrechnungen" (CHF 412.00 instead of 600.00)**: understandable only after reading the small print.
- **"Akonto"**: I know it, but a less experienced landlord might not.

## 5. Error risks

- **The warning in step 2 is easy to skip.** The orange text does not stop anyone; only step 4 makes you confirm. A hurried user who ticks the confirmation without thinking sends refunds of the whole Akonto to tenants (e.g. CHF 4'097.00 to Maria Rossi). They are only drafts, though, and there is a second warning in step 5.
- **The return after recording an invoice lands one step too early (step 3).** I could have thought the invoice had reset my progress. If someone hurriedly changes the Verwaltungspauschale on that step, it goes unnoticed.
- **One invoice for a whole year:** the "nur für einen Teil der Periode" warning catches this, but it is just one more yellow box among several. Once there are three warnings, people stop reading.
- **Shared test system:** other drafts (e.g. the 2024 draft) mix into the same "Entwurf" list, so it's not obvious which ones I just created. The "Entwürfe ansehen" link from the result screen does not filter by 2025.

## 6. Suggestions

- **Major:** after "Rechnung speichern" from the wizard, return to step 4 "Vorschau" (where the user left), not step 3. The return link is `returnTo=/statements/generate?schritt=3`, so the step index looks 0-based on one side and 1-based on the other.
- **Minor:** step 2: stop the building cards and the "0 von 3 gewählt" counter from overflowing the panel on a 390 px screen. The fieldset is wider than its card; it is probably the default `min-width: min-content` of `<fieldset>`, and `min-w-0` would fix it.
- **Minor:** the toast "Rechnung … gespeichert" covers the card heading of the current wizard step on mobile. Place it lower or let it disappear sooner.
- **Minor:** in step 2, give the orange "Keine Rechnungen…" line a direct "Rechnung erfassen" action, or show one short summary box above the list. Then the first warning also offers the fix, not only the one in step 4.
- **Minor:** in the invoice form, load the categories even before a building is chosen, or show a hint ("Zuerst Gebäude wählen"). An empty dropdown looks broken.
- **Minor:** pre-fill the invoice date with the end of the period when it is opened from the wizard (the `periodEnd` parameter is already passed), or at least limit the date picker to the period.
- **Minor:** in step 4, show the invoice total next to "Kosten aller Abrechnungen" (e.g. "Rechnungen CHF 600.00, davon Leerstand CHF 206.00 zulasten Vermieter"). Then the gap from 600 to 412 needs no maths.
- **Minor:** "Entwürfe ansehen" on the result screen should filter to the period just created (2025), and the new drafts should offer a PDF preview just like the older draft.
- **Minor:** the list heading "Nebenkostenabrechnungen" breaks without a hyphen at 390 px. Use `hyphens: auto` (with `lang="de"`) or a smaller heading size on mobile.
- **Minor:** the date fields render as "MM/DD/YYYY" in this browser even with de-CH. The spelled-out date below saves it, but a Swiss format (TT.MM.JJJJ) would avoid doubt.

Tap targets: every interactive element in the wizard, the invoice form and the draft list is at least 24 × 24 px. Checkboxes are 24 × 24 inside labels of 48 px or more (the "trotzdem erstellen" label is 308 × 48), and buttons are full width. Only inline text links (breadcrumb, footer) are lower than 44 px. Nothing was too small to tap.
