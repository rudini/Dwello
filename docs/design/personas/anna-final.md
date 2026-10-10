# Persona test: Anna (29), first-time landlord, returning after months, final round

Date: 10.10.2026
Viewport: desktop (1440 x 900, de-CH), zoom 1; overview also checked on mobile (390 x 844, touch)

Task: with no memory of the app, find out what to do next, understand why, and take the first step far enough to know I am on the right path (no statements created). Note unclear terms and whether «Hilfe» explains them.

## 1. Task completed

**Yes.** The overview told me straight away what to do next: «Nebenkostenabrechnungen erstellen» for the period 1.1.2025 – 31.12.2025, which has ended, for all three buildings. It also said why: «Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen. Noch nicht abgerechnet: …». I opened the wizard, chose Musterhaus Zentrum and went as far as «Vorschau». There the app stopped me with «Rechnungen fehlen», because no invoices were recorded for 2025. That told me what my real first job is: record the 2025 invoices. I opened «Rechnung erfassen» from the warning, saw that the form already had the building and the period, and cancelled. I did not create any statements.

The one thing I did not fully understand at first: the card says «Erfassen Sie zuerst alle Rechnungen dieser Periode», but its only button is «Abrechnungen erstellen». Only the wizard's preview showed me that I really had no invoices for 2025.

## 2. Effort

- Screens: overview, wizard steps 1 to 4, invoice form, invoice list, statements list, help (about 9).
- Clicks: 6 to reach the "invoices missing" warning (button, «Weiter», tick building, «Weiter», «Weiter», then reading), plus 1 to open the invoice form.
- Time: about 3 minutes until I knew what to do, plus about 3 minutes reading «Hilfe».

## 3. Thinking aloud

1. **Overview, desktop** ([01](screens/anna-final/01-overview-desktop.png)). "Okay, «Als Nächstes zu tun», and a highlighted card «Nächster Schritt: Nebenkostenabrechnungen erstellen». The 2025 period has ended and none of my three buildings is billed. That makes sense, it's October." The second card, «Abrechnungen prüfen und versenden – 1 Nebenkostenabrechnung ist noch im Entwurf», confused me: which statement, and from which year? It doesn't say. Only on the statements list did I see that it is **Anna Schmidt's statement for 2024**. A tenant has been waiting for that one for almost a year, so it might be more urgent than the 2025 run. «Fristen: keine» calmed me down.
2. **Overview, mobile** ([02](screens/anna-final/02-overview-mobile.png)). Same order and the same cards stacked, with the main button full width. Very clear, nothing missing. The page is long, but the important part is at the top.
3. I read "Erfassen Sie zuerst alle Rechnungen dieser Periode". "Have I done that? No idea." There is no button for it on the card, so I clicked **«Abrechnungen erstellen»** and hoped the app would tell me.
4. **Wizard step 1** ([03](screens/anna-final/03-wizard-step1-period.png)). The period was filled in for me: «Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen». Good. The date fields show `01/01/2025` (US style), but the German line below («Mittwoch, 1. Januar 2025») reassured me. The step labels break mid-word: «Abrechnun / gsperiode», «Verwaltung / spauschale». That looks broken.
5. **Step 2.** I clicked «Weiter» without choosing anything and got «Bitte wählen Sie mindestens ein Gebäude.» Fair. I ticked Musterhaus Zentrum.
6. **Step 3** ([04](screens/anna-final/04-wizard-step3-heating-fee.png)). «Heizprofil» and «Verwaltungspauschale» came with defaults (3 %, «Gleichmässig pro Wohnung») and a monthly bar chart. I wouldn't know what to change, so I kept the defaults. «je Mieter nach Mietstagen» was a word I didn't know. «Entwurf gespeichert, 14:41» appeared and gave me a scare: "Did I just create a draft statement?" (No. It is the wizard's own input being saved.)
7. **Step 4, Vorschau** ([05](screens/anna-final/05-wizard-step4-preview-invoices-missing.png)). This is the moment it made sense. «Keine Rechnungen erfasst» in red, then a yellow box «Rechnungen fehlen … Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück.» Below it, every tenant shows «Kosten CHF 0.00 / Rückerstattung CHF 2’640.00». "I would have refunded everyone! Good that it stops me." «Die Abrechnungen trotzdem erstellen» is an unticked checkbox, so I can't do it by accident.
8. **«Rechnung erfassen» from the warning** ([06](screens/anna-final/06-invoice-form-from-wizard.png)). The form already has Musterhaus Zentrum selected, and «Abbrechen» goes back to the wizard. But the date is **today (10.10.2026)**, and a yellow warning «Ausserhalb der Abrechnungsperiode» shows before I've typed anything. "I came here *for* the 2025 period. Why does it start with a date the app knows is wrong?" The hint «Übernehmen Sie das Datum von der Rechnung, nicht das heutige» does help. I cancelled.
9. **Back in the wizard** ([07](screens/anna-final/07-wizard-restored-at-step1.png)). «Entwurf wiederhergestellt – Ihre Angaben … sind wieder da». Nice, but I'm back at **step 1**, not at the preview I left, so I'd have to click «Weiter» three times. Again «Entwurf», this time with a «Entwurf verwerfen» button. "Does that delete a statement?"
10. **«Rechnungen»** ([08](screens/anna-final/08-invoice-list-no-period-filter.png)). I wanted to see which invoices of 2025 I already have. The list has search, building, category and «Umlagefähigkeit» filters, but **no year or period filter**. I scrolled 14 invoices: all of them are from 2024. Fine in this case, but with 100 invoices I couldn't check "is 2025 complete?".
11. **«Hilfe»** ([09](screens/anna-final/09-help.png)). A good step-by-step page and a «Begriffe kurz erklärt» section. It answered most of my questions (see section 4). It also confirmed that only «Entwürfe erstellen» actually creates statements, which took away my fear from step 6.

Note: while I was testing, other testers created invoices and statements for 2025. Afterwards my overview only showed «10 Nebenkostenabrechnungen sind noch im Entwurf». Everything above describes the state I saw first.

## 4. Terms I did not understand

| Term (where) | Answered by «Hilfe»? |
|---|---|
| «Akonto» (preview warning) | Yes: "monatlicher Vorschuss des Mieters für die Nebenkosten" |
| «Heizprofil» (step 3) | Yes |
| «Verwaltungspauschale» (step 3) | Yes, including "üblich sind 3 %" |
| «Mietstage» (step 3) | Yes. In the wizard it appears as «Mietstagen», which I read as a typo of "Miettagen". |
| «Verteilschlüssel» (step 3, invoice form) | Yes |
| «Abrechnungsperiode» | Yes |
| «Umlagefähig» (invoice form, invoice list) | **Partly.** Mentioned ("umlagefähiger Kategorien") but not in the glossary. The form's own line «Die Rechnung fliesst in die Nebenkostenabrechnung ein» explains it better. |
| «Rückerstattung» vs «Nachzahlung» vs «Saldo» | Partly: «Saldo» is explained, but the words the screens actually show (Rückerstattung / Nachzahlung) are not. |
| «Wiedervermietet», «Gesperrt» (overview tiles) | **No** |
| «Entwurf» (wizard save vs. draft statement) | **No.** Same word for two different things. |

## 5. Error risks

- **Refunding all Akonto by mistake:** well guarded. The preview warning plus the unticked «trotzdem erstellen» checkbox prevents it.
- **Booking an invoice in the wrong year:** the invoice form opened from the wizard pre-fills today's date. A hurried user saves it and the invoice ends up in 2026. The warning is there, but it shows by default, so people learn to ignore it.
- **Forgetting the old 2024 draft:** the overview's draft card hides the period, so a tenant's year-old statement looks the same as a fresh one.
- **Misreading «Entwurf gespeichert» / «Entwurf verwerfen»:** I briefly thought I had created or would delete a statement.
- **Incomplete invoices:** with no period filter on «Rechnungen», I can't check that 2025 is complete before I start the run.

## 6. Suggestions

- **Major:** On the overview's "Nebenkostenabrechnungen erstellen" card, add a secondary action for the step the text tells me to do first, e.g. «Rechnungen 2025 prüfen». It would link to «Rechnungen» filtered to the period, or show a count such as «0 Rechnungen in dieser Periode erfasst». Right now the text says "invoices first" but the only button says "statements".
- **Major:** Add a period or date filter (or at least year grouping) to «Rechnungen», so I can check that a period is complete.
- **Major:** When «Rechnung erfassen» is opened from the wizard with `periodStart`/`periodEnd`, don't pre-fill today's date. Leave it empty, or use a date inside the period, so the «Ausserhalb der Abrechnungsperiode» warning only appears after a wrong entry.
- **Minor:** Show the period on the draft card («1 Nebenkostenabrechnung 2024 ist noch im Entwurf») and rank a year-old draft higher, or flag it as overdue to send.
- **Minor:** After returning from «Rechnung erfassen», restore the wizard at the step I left (Vorschau), not at step 1.
- **Minor:** Rename the wizard's autosave so it doesn't clash with draft statements, e.g. «Eingaben gespeichert» / «Eingaben verwerfen».
- **Minor:** Step labels in the wizard progress break mid-word («Abrechnun gsperiode», «Verwaltung spauschale»). Allow wrapping only at spaces/hyphens or use shorter labels.
- **Minor:** «Mietstagen» → «Miettagen» (wizard step 3 and help).
- **Minor:** Add «Umlagefähig», «Rückerstattung / Nachzahlung», «Wiedervermietet» and «Gesperrt» to «Begriffe kurz erklärt».
- **Minor (verify):** Date inputs show `MM/DD/YYYY` in the test browser. This may only come from the headless browser's locale, but if real Swiss users see it, use a DD.MM.YYYY format.
