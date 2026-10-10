# Persona test: Anna (6)

Anna, 29, first-time landlord. She comes back to Dwello after several months and does not remember how it works. Desktop (1440 px), demo data, today is 10.10.2026. Other testers used the same data at the same time (for example, an invoice "Fernwärme 2025 (Marco-6 Test)" and Seepark drafts appeared during the run).

Task: start at `/dashboard`, find out what to do next, and follow the most important suggestion as far as possible without sending anything to a tenant.

## 1. Task completed

**Partly.** I found the next step right away and created 2 statement drafts for Alpenblick for 2025, as far as I could go without sending. I recorded one 2025 invoice on the way. A real 2025 statement was not possible, because the demo data has no 2025 invoices except the ones testers added. The app warned me about that clearly.

## 2. Effort

- About 25 user actions over 6 screens (dashboard, wizard steps 1 to 5, new invoice, invoice list, draft list, draft detail).
- One detour: the wizard sent me to "Rechnung erfassen", and coming back started the wizard again at step 1.
- No dead ends. I did not need the help page.

## 3. Walkthrough

1. **Dashboard** ([01](screens/anna-6/01-dashboard.png)). "Als Nächstes zu tun" has a highlighted card, "Nächster Schritt – Nebenkostenabrechnungen erstellen": *"Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen, aber noch nicht abgerechnet. Erfassen Sie die Rechnungen dieser Periode und erstellen Sie dann die Abrechnungen."* Below it is a second card, "Abrechnungen prüfen und versenden" (1 draft). *Thinking aloud:* "Great, it tells me what, why and in which order. But the button says 'Abrechnungen erstellen' and not 'Rechnungen erfassen'. Did I record the invoices? No idea. I'll trust the button."
2. **Wizard step 1, Abrechnungsperiode** ([02](screens/anna-6/02-wizard-step1.png)). The intro says *"Es entstehen Entwürfe, die Sie danach prüfen und versenden."* "Good, nothing goes out yet." The date fields show `01/01/2025` and `12/31/2025` (US format), but the line below says "Mittwoch, 1. Januar 2025", which reassured me.
3. **Step 2, Gebäude.** Three buildings, none pre-selected. I clicked "Weiter" with none selected and got *"Bitte wählen Sie mindestens ein Gebäude."* That is fine. I chose "Alle Gebäude". "I don't see whether a building already has 2025 statements or any invoices."
4. **Step 3, Heizprofil und Verwaltungspauschale.** The profiles are named in English ("Heating + Hot Water (100%)", "Heating Mountain"), and the description is English too. There is one profile for all buildings, although one building is in Interlaken and another in Zürich. "Verwaltungspauschale in %: 3, 'Üblich sind bis 3 %'". That is helpful. The distribution list includes "Heizung (Fläche 70% / Einheit 30%)" as an option for the management fee, which seems odd. The help text says "nach Mietstagen" (typo?). A note "Entwurf gespeichert, 10:42" appeared, and I briefly thought statements had already been created.
5. **Step 4, Vorschau** ([03](screens/anna-6/03-preview-missing-invoices.png)). Very good. It shows "Keine Rechnungen erfasst" in red for every building and a warning box, "Rechnungen fehlen": *"Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück."* It offers a "Rechnung erfassen" button and a checkbox, "Die Abrechnungen trotzdem erstellen". "Weiter" without the checkbox shows *"Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."* "It stopped me from refunding everybody's full Akonto. Exactly what I needed."
6. **Detour: Rechnung erfassen.** The link opens `/invoices/new` in the same tab. When I went back, the wizard restarted at step 1. On reopening, it said "Entwurf wiederhergestellt – Ihre Angaben … sind wieder da", but I still had to click through every step again. The invoice form defaults "Rechnungsdatum" to **today (10.10.2026)**. Had I not changed it, my 2025 invoice would have landed in 2026. Picking the category "Kaltwasser" did not suggest a Verteilschlüssel, so I picked "Pro Fläche (m²)" myself. After saving, I landed on the invoice list with the toast "Rechnung erfolgreich erstellt" ([04](screens/anna-6/04-invoice-list-after-save.png)). Nothing took me back to the wizard I came from. The table is cut off on the right at 1440 px (Status and Aktionen only half visible), and this page uses bright blue buttons while the rest of the app uses dark teal.
7. **Wizard again, Alpenblick only.** I chose "Heating Mountain". The preview showed "1 Rechnung vom 15.12.2025", 2 statements and "Kosten aller Abrechnungen CHF 659.20". "My invoice was CHF 960 plus a 3 % fee. Where did the other CHF 300 go?" The vacant third apartment is not mentioned anywhere. There was no warning that one invoice for a whole year looks incomplete (last year Alpenblick also had heating oil and snow clearing).
8. **Step 5, Erstellen.** *"Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt. Sie prüfen danach jede Abrechnung und versenden sie einzeln."* This is exactly the reassurance I wanted. I clicked "Entwürfe erstellen" and got "2 Nebenkostenabrechnungen sind als Entwurf erstellt", with "Entwürfe ansehen" and "Weitere Abrechnungen erstellen".
9. **Draft detail** ([05](screens/anna-6/05-draft-detail.png)). For Laura Keller, Kostenaufstellung shows "Cold Water" (English, though I chose "Kaltwasser"), and the column "Verteilschlüssel" is **empty**, although I picked "Pro Fläche". It lists "Verwaltungsgebühr (3%)" (the wizard said "Verwaltungspauschale"), and "Rückerstattung an Mieter CHF 1’879.34" in green. "Wohnung EG ·" has a stray dot. The primary button is "Versenden". To check it safely, I blocked all writes in the browser and clicked it. A dialog opened, "Abrechnung als versendet markieren": *"Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu …"*, with recipient, e-mail and "PDF ansehen". I cancelled.
10. **Back on the dashboard.** The "Nebenkostenabrechnungen erstellen" card is **gone**, and the next step is now "Abrechnungen prüfen und versenden (6 Entwürfe)". Musterhaus Zentrum (4 rented apartments) still has no 2025 statement, and nothing reminds me of it.

## 4. Points of confusion (incl. terms)

- **Dashboard text vs. button:** the text says "Erfassen Sie die Rechnungen … und erstellen Sie dann die Abrechnungen", but the only button skips to "Abrechnungen erstellen". There is no "Rechnungen erfassen" button and no count of invoices for the period.
- **"Entwurf" means two things:** "Entwurf gespeichert / wiederhergestellt" (the wizard's form input) and "Entwurf" (a statement status). At step 3 I thought statements already existed.
- **"Verwaltungspauschale"** (wizard) vs. **"Verwaltungsgebühr"** (statement). Are they the same thing?
- **"Versenden"** button vs. the dialog "Als versendet markieren – Dwello verschickt die Abrechnung nicht selbst". The button promises more than it does.
- **English leftovers:** heating profile names and description ("Heating Mountain", "Standard profile for …") and the category "Cold Water" on the statement.
- **Heizprofil:** one profile for all selected buildings, with no hint which one fits which building, and even when a building has no heating invoice.
- **Preview total CHF 659.20 vs. invoice CHF 960:** no explanation of the vacancy share (the landlord carries it).
- **"Mietstagen"** looks like a typo of "Miettagen".
- **"Heizung (Fläche 70% / Einheit 30%)"** offered as a key for the management fee.
- Date inputs in `MM/DD/YYYY` (the German echo below them helps).

## 5. Error risks

- **High:** after statements exist for some buildings, the dashboard drops the "Nebenkostenabrechnungen erstellen" reminder, although Musterhaus Zentrum has no 2025 statement. A landlord could miss a whole building.
- **High:** the preview only warns when a building has *no* invoices. One invoice for a full year (where last year had several categories, including heating) passes silently and produces large refunds (CHF 1’879.34 and CHF 2’621.46). A wrong refund is hard to take back once the statement reaches the tenant.
- **Medium:** "Rechnungsdatum" defaults to today. Invoices recorded late for the previous period end up in the wrong period, and the statement then silently misses them.
- **Medium:** the Verteilschlüssel chosen on the invoice does not show on the statement, so I cannot check that the split is right before sending.
- **Low:** leaving the wizard for "Rechnung erfassen" loses the step position, and there is no way back from the invoice form to the wizard.
- **Well prevented:** no building selected, the zero-invoice run (confirmation checkbox required), "Es wird nichts verschickt" on the create step, and a confirmation dialog before marking a statement as sent.

## 6. Improvement suggestions

| Severity | Suggestion |
|---|---|
| **Major** | Keep the dashboard step "Nebenkostenabrechnungen erstellen" until **every** building with contracts in the period has statements, and name the missing buildings ("Musterhaus Zentrum: noch nicht abgerechnet"). |
| **Major** | In the preview, compare each building's invoices with the previous period (categories or total) and warn: "Für Alpenblick fehlen gegenüber 2024: Heizung, Schneeräumung". |
| **Major** | Show the Verteilschlüssel on the statement's Kostenaufstellung (the column is empty) and use German category names ("Kaltwasser", not "Cold Water"). |
| **Major** | Rename the button "Versenden" to "Als versendet markieren", or "Zustellen…", to match what it does. |
| Minor | Add a "Rechnungen erfassen (0 für 2025)" action to the dashboard card, matching its text. |
| Minor | Open "Rechnung erfassen" from the wizard so that saving returns to the preview step, or restore the last step and not just the inputs. |
| Minor | Pre-fill "Rechnungsdatum" empty, or warn when the date is in a period that is still open, rather than defaulting to today. |
| Minor | Explain the vacancy share in the preview ("CHF 329.60 trägt der Eigentümer für die leere Wohnung"). |
| Minor | Rename the wizard's autosave note to "Eingaben gespeichert" so it is not confused with statement drafts. Use one term for "Verwaltungspauschale"/"Verwaltungsgebühr". |
| Minor | Translate the demo heating profiles, fix "Mietstagen", show dates in `TT.MM.JJJJ`, remove the stray "·" after the apartment name, and make the invoice table fit at 1440 px. |

## Data changes made

- Invoice "Gemeinde Interlaken – Wasser und Abwasser 2025 (Persona Anna)", Alpenblick, 15.12.2025, CHF 960.00.
- Statement drafts NK-33333333-2025-0001 (Laura Keller) and NK-33333333-2025-0002 (Kevin Fischer). Nothing was sent or marked as sent.
