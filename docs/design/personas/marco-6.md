# Persona test: Marco (6), utility statements 2025 on the phone

Persona: Marco, 38, landlord. Does everything on his smartphone and has little time.
Device: 390×844, touch (Playwright, Chromium). Date: 10.10.2026, demo data shared with other testers.
Task: create the Nebenkostenabrechnungen for 2025 for one building, as far as the drafts. Do not send anything.

## 1. Task completed

**Yes.** I created 3 drafts for Seepark Residenz, period 1.1.2025 – 31.12.2025 (NK-22222222-2025-0001..0003, all "Nachzahlung"). I sent nothing.
To get there I first had to record a 2025 invoice, because no building had any invoices for 2025.

## 2. Effort

- About 25 taps, roughly 6 to 8 minutes including the detour to record an invoice (the wizard itself is about 2 minutes).
- The wizard has 5 steps: Abrechnungsperiode, Gebäude, Heizprofil/Verwaltungspauschale, Vorschau, Erstellen. The defaults were right, so steps 1 and 3 were just "Weiter".
- The detour cost the most: wizard, then "Rechnung erfassen", the form, the invoice list, back to the dashboard, and the wizard again from step 1.

## 3. Walkthrough (thinking aloud)

1. **Dashboard.** "Nächster Schritt: Nebenkostenabrechnungen erstellen. Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen …" That is exactly what I came for. One big button, "Abrechnungen erstellen". Great.
2. **Step 1, Abrechnungsperiode.** 2025 is already filled in. The date field shows "12/31/2025" in US format, but luckily the line below says "Mittwoch, 31. Dezember 2025". "Weiter".
3. **Step 2, Gebäude.** Three cards with checkboxes, big enough for my thumb. I pick Seepark Residenz (4 Wohnungen). "Entwurf gespeichert, 10:42" appears. Wait, did it already create a draft statement? I'm a bit nervous.
4. **Step 3, Heizprofil und Verwaltungspauschale.** "Heating + Hot Water (100%)", "Standard profile for combined heating and hot water systems": English, in an otherwise German app. The little monthly bar chart is nice. Verwaltungspauschale 3 %, "Gleichmässig pro Wohnung". I don't touch any of it.
5. **Step 4, Vorschau.** Yellow box "Rechnungen fehlen": "Für Seepark Residenz sind in der Abrechnungsperiode keine Rechnungen erfasst. Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück." Very clear, and I'm glad it stops me: I would have given CHF 7'000 of Akonto back. The "Weiter" button only works once I tick "Die Abrechnungen trotzdem erstellen". (Screenshot 01)
6. I go back and try Musterhaus Zentrum and Alpenblick: the same warning everywhere. The invoice list confirms it: all 14 invoices are from 2024. On the phone the invoice table is cut off after "Lieferant / Beschreibung", so I can't see the amounts without scrolling sideways.
7. **Detour, "Rechnung erfassen"** (link inside the warning). The form doesn't remember that I came from Seepark, so I choose the building again. The date defaults to **today (10/10/2026)**. If I weren't careful, my invoice would fall outside 2025 and the warning would stay. On my first attempt, the **"Kategorie" dropdown was empty** (only "Kategorie auswählen..."); on a later visit it had all the categories after a few seconds. I set the Verteilschlüssel to "Heizung (Fläche 70% / Einheit 30%)" and save "EWL Luzern, Fernwärme 2025, CHF 9'800". (Screenshot 02)
8. After saving I land on the **invoice list**, not back in my statement run. There's no "Zurück zur Abrechnung" link. The invoice shows category "-" and status "Ausstehend". What does "Ausstehend" mean: not paid? Not checked? Will it count?
9. **Back to the wizard** through the dashboard. It starts at step 1 again, but the period and building are still selected, so it's 3× "Weiter".
10. **Vorschau again.** "Seepark Residenz, 1 Rechnung vom 31.12.2025", "Kosten aller Abrechnungen CHF 7'722.81", three tenants with "Nachzahlung". The warning is gone. I entered CHF 9'800 though, so where are the other CHF 2'000? Probably the vacant 4th apartment that I pay myself, but the screen doesn't say so. And with only *one* invoice (no water, no caretaker, which existed in 2024) there's no hint at all. (Screenshot 03)
11. **Step 5, Erstellen.** "Es werden 3 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt. Sie prüfen danach jede Abrechnung und versenden sie einzeln." That's exactly what I want to know before the final tap. I'm not afraid to press "Entwürfe erstellen". (Screenshot 04)
12. **Result.** "3 Nebenkostenabrechnungen sind als Entwurf erstellt." with buttons "Entwürfe ansehen" and "Weitere Abrechnungen erstellen". Good.
13. **Draft list.** A table on the phone: number, tenant, apartment and period are visible; **Saldo, Status and "Ansehen" are off-screen to the right**. "NK-22222222-2025-0003" breaks over three lines. (Screenshot 05)
14. **Check.** I ran the wizard again for Seepark 2025 up to step 5 (without pressing). There was no hint that drafts for this building and period already exist; it would create "3 Nebenkostenabrechnungen" again.

## 4. Points of confusion (incl. terms)

- **"Entwurf gespeichert" / "Entwurf wiederhergestellt"** (wizard autosave) vs. **"Entwürfe erstellen"** (statement drafts). The same word for two different things; at step 2 I thought statements were already being created.
- **Heating profiles in English** ("Heating Mittelland", "Hot Water Only", English description).
- **"Kosten aller Abrechnungen"** is lower than the invoice total, with no explanation (vacancy / landlord share).
- **"Ausstehend"** status on the new invoice: unclear whether it is still being categorized, unpaid, or not counted.
- **"Verwaltungspauschale … je Mieter nach Mietstagen"**: "Mietstagen" reads like a typo (should be "Miettagen").
- "Wohnung A2 ·" and "Wohnung B2 · 1": what does the dot and the trailing number mean?

## 5. Mobile problems

- **The draft list and invoice list are wide tables.** Saldo, Status and actions are cut off on the right, you have to scroll sideways, and long numbers wrap over 3 lines. On a phone, cards per statement would be much better.
- **Date fields show US format** (12/31/2025, 10/10/2026); only the wizard adds a written-out German date below. The invoice form has no such help.
- **Leaving the wizard to record an invoice** means losing my place: after saving I land on the invoice list and have to go back through the dashboard and tap through steps 1 to 3 again.
- The sticky header overlaps content in full-page screenshots; in the normal viewport it's fine.
- Buttons are inconsistent: the wizard is dark teal, while "Neue Rechnung", "Abrechnungen erstellen" (list) and "Rechnung erstellen" are bright blue.
- Positive: the wizard buttons are full-width and thumb-friendly, the building cards have large tap areas, and "Weiter" is directly below the content.

## 6. Error risks

- **Duplicates:** the wizard doesn't warn when drafts already exist for the same building and period. It announces "Es werden 3 … erstellt" again (I did not test whether the backend refuses).
- **Incomplete invoices:** the warning only fires when there are *zero* invoices. With 1 invoice out of the usual 3 to 4 (water and caretaker missing), it creates statements without comment, so tenants are under-charged and the money is lost.
- **Invoice date defaults to today:** after-the-fact invoices for the previous year are easily recorded with the wrong date and don't land in the period.
- **Uncategorized invoice ("-", "Ausstehend")** still counts towards the statement, and there's no warning in the Vorschau.
- **Category list loads late / is empty at first:** a fast user saves without a category.
- Positive: zero invoices are reliably blocked (checkbox "trotzdem erstellen" required), and the final step clearly says nothing will be sent.

## 7. Improvement suggestions

| Severity | Suggestion |
|---|---|
| **Major** | Before creating, warn about existing drafts or statements for the same building and period ("Für Seepark Residenz 2025 bestehen bereits 3 Entwürfe"), or offer to replace them. |
| **Major** | Draft list and invoice list as cards on mobile (number, tenant, amount + Nachzahlung/Rückerstattung, status, tap opens). No horizontal scroll. |
| **Major** | Vorschau: compare invoice categories with last year ("2024 gab es Kaltwasser und Hauswart, 2025 fehlen sie") or at least list the categories per building. |
| **Major** | "Rechnung erfassen" from the wizard: preselect the building, default the date to the end of the period, and return to the Vorschau after saving. |
| Minor | Show why "Kosten aller Abrechnungen" is lower than the invoice total (e.g. "Leerstand Wohnung B1: CHF 2'077.19 trägt der Eigentümer"). |
| Minor | Mark uncategorized / "Ausstehend" invoices in the Vorschau. |
| Minor | Category dropdown: show a loading state instead of an empty list. |
| Minor | Rename the wizard autosave to "Eingaben gespeichert" so it isn't confused with statement drafts. |
| Minor | Translate the heating profile names and descriptions into German; fix "Mietstagen". |
| Minor | Step 5: repeat the building and period ("3 Entwürfe für Seepark Residenz, 2025"). |
| Minor | Date inputs in Swiss format (dd.mm.yyyy) or with a written-out date below, as in the wizard. |

## Screenshots

1. `screens/marco-6/01-warning-no-invoices.png`: Vorschau with the "Rechnungen fehlen" warning
2. `screens/marco-6/02-invoice-form.png`: invoice form, date in US format, empty category
3. `screens/marco-6/03-preview-with-invoice.png`: Vorschau with 1 invoice, no warning, costs lower than the invoice total
4. `screens/marco-6/04-final-step.png`: final step "Entwürfe erstellen", clear wording
5. `screens/marco-6/05-draft-list-cut-off.png`: draft list, columns cut off on the right
