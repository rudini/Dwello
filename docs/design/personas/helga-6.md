# Persona test: Helga (68, inherited building, little computer experience, 150 % zoom)

Task: "Make the Nebenkostenabrechnung for 2025" (from the accountant). Date: 10.10.2026, demo data, desktop at 150 % zoom. I was not allowed to mark anything as sent.

## 1. Task completed

**Partly.** I found the right place at once and went through the wizard up to step 5 ("Entwürfe erstellen"). I deliberately did not create the drafts. The app told me that no invoices are recorded for 2025 in any building ("Keine Rechnungen erfasst"). Creating drafts would have handed every tenant their whole Akonto back. To finish, I would first have to type in all my 2025 bills, and I didn't feel confident doing that.

## 2. Effort

- About 6 screens and 10 clicks to reach step 5. No dead ends.
- The way in was easy because the dashboard put it first.
- The hard part is not the wizard, it is everything *before* it: entering the invoices. That form has its own problems (see 4 and 5).

## 3. Walkthrough (thinking aloud)

1. **Übersicht (dashboard).** "Oh, right at the top: 'Nächster Schritt – Nebenkostenabrechnungen erstellen', and it even says 'Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen'. That's exactly what my accountant meant. It also says 'Erfassen Sie die Rechnungen dieser Periode'. Did I do that? I don't know." I clicked the big blue "Abrechnungen erstellen". (screen 01)
2. **Schritt 1 von 5: Abrechnungsperiode.** "Five steps, I can see where I am. That's nice." The dates are already filled in. The date box shows "12/31/2025" in a foreign order, but below it says "Mittwoch, 31. Dezember 2025" in plain words, so I trusted that. "Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen": I never made any 'Einstellungen', but fine. Weiter.
3. **Schritt 2: Gebäude.** Three buildings with addresses and the number of apartments. "Which ones? The accountant didn't say." I pressed Weiter with nothing ticked and got a polite "Bitte wählen Sie mindestens ein Gebäude." I ticked "Alle Gebäude". After Weiter, the page jumped down so far that the step bar was hidden under the top bar.
4. **Schritt 3: Heizprofil und Verwaltungspauschale.** (screen 02) "Heizprofil – 'Verteilt die Heizkosten auf die Monate.' Why would heating costs need spreading over months if I bill the whole year?" The choices are in English: "Heating + Hot Water (100%)", "Heating Mountain", "Heating Tessin", and the description too: "Standard profile for combined heating and hot water systems". "My house is in Interlaken. Is that 'Mountain'? But it's one choice for all three buildings." The bar chart is pretty but tells me nothing. I left the preset. "Verwaltungspauschale in %: 3 – 'Üblich sind bis 3 %'." That reassured me, so I left it. "Verteilung der Verwaltungspauschale: 'Gleichmässig pro Wohnung' or 'Pro Einheit'. Isn't an Einheit a Wohnung?" Left the preset. I noticed "Entwurf gespeichert, 10:42", which was good: I can stop and come back.
5. **Schritt 4: Vorschau.** (screen 03) "Kosten aller Abrechnungen: CHF 0.00 … 'Keine Rechnungen erfasst' in red for every building." The yellow box explains: "Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück." "That would be a disaster: Maria Rossi would get CHF 4'200 back!" Weiter without the tick is blocked: "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." I felt protected here.
6. **"Rechnung erfassen"** (from the warning box). (screen 04) "This page looks different: smaller letters, grey boxes, a bright blue button." The Rechnungsdatum is set to today, "10/10/2026", but my bills are from 2025. "Do I have to change that every time? What if I forget?" The "Kategorie" list is empty except "Kategorie auswählen...". "Verteilschlüssel: 'Pro Einheit', 'Pro Fläche (m²)', 'Heizung (Fläche 70% / Einheit 30%)'. No idea which one my water bill needs." There is no way back to the wizard on this page. I didn't have my paper folder, so I typed nothing.
7. **"Entwürfe ansehen" → existing draft** (to see what a finished one looks like). The list says "1 Abrechnungen" and has a column "Saldo" showing "CHF 83.43 Rückerstattung". The draft is for **2024**, not 2025. "Hasn't last year's even been sent yet?" In the detail (screen 05), the cost lines are in English ("Heating", "Cold Water", "Caretaker", "Garden Maintenance"). The "Verteilschlüssel" column is empty. Here it says "Verwaltungsgebühr (3%)", in the wizard "Verwaltungspauschale". "Is that the same?" The dark "Versenden" button sits right next to "PDF herunterladen" at the top. I didn't touch it.
8. **Back to the wizard, step 5.** I ticked "trotzdem erstellen" only to look. Step 5 says "Es werden 9 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt." "That calms me." But nine statements with zero costs make no sense, so I did **not** press "Entwürfe erstellen". I went back and unticked the box.

## 4. Points of confusion incl. terms

| Term / spot | Explained? | My understanding |
|---|---|---|
| **Abrechnungsperiode** | Partly: the dashboard says "1.1.2025 – 31.12.2025 ist abgelaufen". No definition. | Guessed it from the dates: "the year". OK. |
| **Heizprofil** | One line: "Verteilt die Heizkosten auf die Monate." Options and description in English. | Did not understand why it matters or which to choose. Picked the default blindly. |
| **Verwaltungspauschale** | Yes, roughly: "Prozentsatz der Nebenkosten der Liegenschaft … Üblich sind bis 3 %." | Understood "a fee for me, max 3 %". Confused that the statement calls it "Verwaltungsgebühr". |
| **Verteilschlüssel** | No. Not in the wizard; on the invoice form it is a bare dropdown. On the statement the column is empty. | Not understood at all. |
| **Saldo** | No. Only a column header in the list. The detail page says "Rückerstattung an Mieter" instead. | Guessed from "Rückerstattung" beneath it. |
| **Akonto** | No. Used in the warning ("erhält sein Akonto zurück") and as "Akontozahlungen" on the statement. | Guessed "what tenants paid in advance" from the minus sign. Not sure. |

Other confusion:
- The dashboard "Nächster Schritt" sends me to *create statements* although no invoices exist. The real next step is "enter invoices".
- "Gleichmässig pro Wohnung" vs "Pro Einheit": what is the difference?
- "Mietstagen" (step 3 hint) looks like a typo of "Miettagen".
- "1 Abrechnungen" (wrong plural).
- The only draft is from 2024 and still unsent. It is unclear whether that is a problem.

## 5. Error risks

- **Zero-cost statements:** well guarded (warning, explicit tick, reminder that nothing is sent). Without this I would probably have created them.
- **Invoice dated today:** the new-invoice form defaults to 10.10.2026. A 2025 bill entered with the default date falls outside the 2025 period and silently goes missing from the statement.
- **Empty Kategorie dropdown:** I can't categorise. It is unclear whether saving is even possible or whether the result is right.
- **Wrong Verteilschlüssel:** no guidance. A wrong pick distributes costs unfairly, and I wouldn't notice.
- **One Heizprofil for all buildings:** a Zürich house and an Interlaken house share one profile, chosen blindly.
- **"Versenden" next to "PDF herunterladen"** on the draft, as a filled primary button. An accidental click could send a statement, and I did not check whether it asks for confirmation.
- **Leaving the wizard via "Rechnung erfassen"** has no way back. The draft autosave helps, but nothing tells me that I can resume.

## 6. Readability at 150 % zoom

- Wizard and dashboard: good. Large type, comfortable buttons, no horizontal scrolling, and the stepper fits (step 3 label wraps to two lines).
- After each "Weiter" the page scrolls so that the sticky top bar covers the step bar and the page title. I lose my bearings.
- The date fields show the US format (MM/DD/YYYY). The spelled-out date underneath rescues it.
- The new-invoice form and the statement detail use noticeably smaller, lighter-grey text (labels, "Verwaltungsgebühr (3%)", the e-mail address). It is harder to read than the wizard and looks like a different app.
- The heating-profile chart has no values. It is just bars with month initials.

## 7. Improvement suggestions

- **Blocker:** Translate the heating-profile names and descriptions and the cost categories into German ("Heizung", "Kaltwasser", "Hauswart", …). English text on a statement a tenant receives is unacceptable.
- **Blocker:** The Kategorie dropdown on "Neue Rechnung" is empty. Show the categories.
- **Major:** When the period has no invoices, make the dashboard's "Nächster Schritt" read "Rechnungen 2025 erfassen", not "Abrechnungen erstellen".
- **Major:** When opening "Rechnung erfassen" from the wizard, prefill the date inside the period (or the building), warn when the date is outside the open period, and offer "Zurück zur Abrechnung".
- **Major:** Explain Verteilschlüssel, Akonto and Saldo in plain words where they appear (short hint or info icon), and suggest a default Verteilschlüssel per category. Fill the empty Verteilschlüssel column on the statement.
- **Major:** Suggest a Heizprofil per building (by location), or explain in one sentence why the choice matters and when the default is fine.
- **Minor:** Use one word everywhere: "Verwaltungspauschale" (wizard) vs "Verwaltungsgebühr" (statement).
- **Minor:** Keep the step bar visible after "Weiter" (scroll offset for the sticky header).
- **Minor:** Show dates in Swiss format (TT.MM.JJJJ) in the date inputs.
- **Minor:** Make "Versenden" less dominant on a draft, or separate it from "PDF herunterladen". Make sure it asks for confirmation.
- **Minor:** Fix "Mietstagen" → "Miettagen" and "1 Abrechnungen" → "1 Abrechnung". Align the invoice form and statement detail with the wizard's type size and colours.
- **Minor:** Explain "Gleichmässig pro Wohnung" vs "Pro Einheit".

Screens (`screens/helga-6/`): 01-dashboard, 02-heizprofil-pauschale, 03-vorschau-rechnungen-fehlen, 04-neue-rechnung, 05-entwurf-detail.
