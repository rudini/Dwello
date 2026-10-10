# Persona test: Anna (6b), returning first-time landlord

Anna, 29, owns a handful of apartments and hasn't opened Dwello for months. She doesn't remember how it works. Desktop (1440x900), started at `/dashboard`, today 10.10.2026, fresh demo data.

## 1. Task completed: partly

Anna found the most important next step right away ("Nebenkostenabrechnungen erstellen" for 2025). She went through the wizard up to the last step and understood the warning that invoices are missing. She chose **not** to create the drafts, because all of them would be CHF 0.00 refunds of the full Akonto. That was the right decision, but it means the actual goal (correct 2025 statements) is blocked until she enters the 2025 invoices, and she has none of those at hand. Nothing was created and nothing was sent.

## 2. Effort

- About 8 clicks from the dashboard to step 5 of the wizard. No dead ends, no backtracking needed.
- About 3 minutes of reading. The preview step took the longest, because it holds the important warning.
- One extra detour (Rechnungen list) to check whether the invoices were really missing or only hidden. They were all from 2024.

## 3. Walkthrough (think-aloud)

1. **Dashboard** (screen 01). *"OK, 'Als Nächstes zu tun', and the first box is even marked 'Nächster Schritt': 'Nebenkostenabrechnungen erstellen', period 1.1.2025 – 31.12.2025 has ended, nothing settled for my three buildings. It also says 'Erfassen Sie zuerst alle Rechnungen dieser Periode'. Hmm, the big button says 'Abrechnungen erstellen', not 'Rechnungen erfassen'. I'll just click the button; it's the obvious one."* There's also a second box: one statement is still a draft. *"Is that a 2025 one? The first box says nothing has been settled yet, so probably an old one."*
2. **Wizard step 1, Abrechnungsperiode.** The 2025 period is pre-filled: *"good, I don't have to think."* The date fields show `01/01/2025` (US format), but the German text below ("Mittwoch, 1. Januar 2025") reassures me.
3. **Step 2, Gebäude.** I tick "Alle Gebäude". Nothing here tells me that invoices are missing; I only find out two steps later.
4. **Step 3, Heizprofil und Verwaltungspauschale.** *"Heizprofil? No idea, I'll keep the default."* The options are in English ("Heating + Hot Water (100%)", "Standard profile for combined heating and hot water systems"), which feels out of place. The 3 % fee and "Gleichmässig pro Wohnung" stay as they are. *"'nach Mietstagen'? I guess that means rental days."* "Entwurf gespeichert, 11:01" appears; *"a draft of what? Did it already create something?"*
5. **Step 4, Vorschau** (screen 02). Red "Keine Rechnungen erfasst" next to all three buildings, then a yellow box "Rechnungen fehlen": *"…Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück."* **Understood:** I haven't entered any 2025 bills, so the statements would refund every tenant their full advance payments (CHF 1'440 to 4'200 each, as the list below shows). That would cost me a lot of money. The text names the fix ("Rechnung erfassen") and the way out ("bestätigen Sie unten, dass es keine gibt").
6. I click "Weiter" without ticking the checkbox to see what happens: I stay on the step, and a red line says "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." (screen 03). *"Good, it doesn't let me slip through."*
7. **Detour: Rechnungen.** *"Did I really enter nothing?"* The list has 14 invoices, all dated 2024 (Jan–Jun). So it's true: nothing for 2025. Since the list has no year filter, I had to read the dates myself.
8. **Back in the wizard**, I tick "Die Abrechnungen trotzdem erstellen" only to look at step 5: "Es werden 9 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt." The reassurance is nice, but the CHF 0.00 warning is no longer shown here. **I do not click "Entwürfe erstellen".** *"Drafts that refund everything are useless. I'd only have to delete them again."*
9. **Second suggestion: Entwürfe ansehen** (screen 04). The one draft is a **2024** statement for Anna Schmidt (Wohnung 1.02, CHF 83.43 Rückerstattung). Clicking the row does nothing; only the small eye icon opens it. I didn't send anything.

**What I would do now as Anna:** collect the 2025 bills (heating, water, Hauswart, electricity, etc.) from my folder and email, enter them under "Rechnung erfassen", then run the wizard again. I'd also check that 2024 draft. And I'd wonder why only 3 statements exist for 2024 when 9 contracts are listed for 2025.

## 4. Points of confusion (incl. terms)

- **The dashboard text and its button disagree.** The text says "first enter invoices", but the only button starts the statement wizard. The missing invoices aren't detected until step 4, although the dashboard apparently already knows the period has no invoices.
- **"Entwurf gespeichert"** in the wizard, next to the statement drafts ("Entwürfe"), is ambiguous: is it a wizard draft or statement drafts? A new browser session started at step 1 again, so the "saved draft" didn't help me resume.
- **Heizprofil** is not explained for a beginner, and the profile names and description are in English.
- **"Mietstagen"** reads like a typo (Miettage / Mietdauer in Tagen).
- **"Akonto"** is fine for me, but "Rückerstattung CHF 4'200.00" only became alarming because I connected it to the warning myself.
- **"Wohnung 1.02 · 1"** in the statement list: what is the "· 1"?
- **"1 Abrechnungen"** heading (plural), shown while the list is filtered to drafts, while the tiles show 3 in total.
- **Draft from 2024 vs. "noch nicht abgerechnet" for 2025:** it took me a while to see that the two dashboard boxes are about different years. The draft box doesn't name the period.

## 5. Error risks

- **High:** a user in a hurry ticks "Die Abrechnungen trotzdem erstellen" and creates 9 drafts that refund every tenant the full Akonto (total about CHF 22'000). Step 5 no longer repeats that all costs are CHF 0.00, so the last screen before the action hides the consequence. If those drafts are later sent without a careful check, that is real money lost.
- **Medium:** in a building where only *some* invoices are missing (e.g. heating entered, Hauswart not), there would presumably be no warning at all. The wizard only flags "keine Rechnungen", not "suspiciously few".
- **Low:** a date entered in the US-style date field could be misread (01/12 vs 12/01). The German long date below mitigates this.

## 6. Improvement suggestions

- **Major:** Check for missing invoices on the dashboard already. If the ended period has no (or very few) invoices, make "Rechnungen erfassen" the primary action of the "Nächster Schritt" card, with the statement wizard as the secondary action.
- **Major:** Repeat the consequence on step 5 when the user confirmed despite the warning, e.g. "Alle 9 Abrechnungen ohne Kosten – jeder Mieter erhält das volle Akonto zurück (CHF 22'320.00)", and label the button accordingly.
- **Major:** In step 2 (Gebäude), show the invoice count or total for the period per building, so missing data is visible before configuring heating profiles.
- **Minor:** Translate the heating profile names and descriptions into German, and add a one-line explanation for beginners ("Wenn unsicher: Standard lassen").
- **Minor:** Name the period in the second dashboard card ("1 Abrechnung 2024 ist noch im Entwurf").
- **Minor:** Make the whole statement row clickable, not only the eye icon.
- **Minor:** Fix "Mietstagen", "1 Abrechnungen", and explain or remove "· 1" after the apartment number.
- **Minor:** Rename "Entwurf gespeichert" in the wizard to e.g. "Eingaben gespeichert", to avoid confusion with statement drafts.
- **Minor:** Add a year/period filter to the Rechnungen list, so checking "which bills do I have for 2025?" is one click.
- **Minor:** Use the same primary button colour on the statements list as elsewhere (bright blue there, dark teal on the dashboard and in the wizard).

## Screenshots

- `screens/anna-6b/01-dashboard.png`: dashboard with "Nächster Schritt"
- `screens/anna-6b/02-preview-rechnungen-fehlen.png`: wizard preview with the "Rechnungen fehlen" warning
- `screens/anna-6b/03-bestaetigung-erforderlich.png`: "Weiter" blocked until confirmed
- `screens/anna-6b/04-entwuerfe-liste.png`: the existing 2024 draft
