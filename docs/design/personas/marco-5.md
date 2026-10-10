# Persona test: Marco (mobile), Nebenkostenabrechnung 2025

Persona: Marco, 38, landlord, does everything on his smartphone between appointments, little patience.
Device: 390×844 touch (Playwright mobile emulation), demo data, today 10.10.2026.
Task: create the 2025 utility statements for one building, up to the drafts; do not send.

## 1. Task completed

**Partly yes.** Two draft statements for "Alpenblick", period 1.1.2025 – 31.12.2025, were created (NK-33333333-2025-0001 Laura Keller, CHF 489.06 "Nachzahlung"; NK-33333333-2025-0002 Kevin Fischer, CHF 169.45 "Rückerstattung"). Nothing was sent.

The catch: no building had any 2025 invoices, so the wizard first offered statements with "Gesamtkosten CHF 0.00" for every building. I had to leave the wizard, enter two 2025 invoices (heating, water) by hand, and restart the wizard. If I had not noticed the zero, I could have produced drafts that refund all advance payments to every tenant.

## 2. Effort

- About 45 taps/inputs and roughly 8 to 10 minutes on the phone. Of that, the wizard itself was about 6 taps (it is quick); the rest was entering invoices and going back.
- The wizard keeps its state only in the page. Leaving it to enter invoices means starting again at step 1.
- Each invoice: building, date, amount, supplier, description, category, distribution key = 7 fields, about 1.5 minutes each on a phone keyboard. A real year with 8 to 12 invoices per building would be 15 to 20 minutes of typing before the wizard is even useful.
- Feeling: the wizard is fast, but the way to "real numbers" is long and the wizard does not tell me that it is missing.

## 3. Walkthrough (thinking aloud)

1. **Übersicht.** "Nice, the very first card says 'Nebenkostenabrechnungen erstellen' with the period 1.1.2025 – 31.12.2025 and a big button. That's exactly what I want." It also says "Erfassen Sie die Rechnungen dieser Periode", but I skip text on the phone and tap "Abrechnungen erstellen".
2. **Step 1 "Periode".** Dates are already 2025, good. "Heizungsprofil: Heating + Hot Water (100%)" with an English description: "Why is this suddenly English? What does 100% mean?" I leave it. "Verwaltungspauschale (%) 3" and "Verteilung der Pauschale": I don't know whether I'm allowed to charge 3 %, but the hint "Üblich sind bis 3 %" calms me down. The page can be pushed sideways: the step bar ("1 Periode 2 Gebäude 3 Vorschau 4 Erstellen") and the title are wider than the screen (page width 539 px on a 390 px phone). The "Weiter" button sits at the bottom right. In the test, a normal element tap on it failed (another element was reported on top of it) because of the wider layout; tapping by screen position worked.
3. **Step 2 "Gebäude".** Three cards with checkboxes. Tapping the building name selects it, which is good because the checkbox itself is only 20×20 px. I pick "Seepark Residenz".
4. **Step 3 "Vorschau".** "Anzahl Abrechnungen 3, **Gesamtkosten CHF 0.00**." "Hm? Zero costs? Did I pay nothing in 2025?" The table "Aufschlüsselung nach Mietvertrag" shows "Kosten CHF 0.00" for every tenant. The "Saldo" column is cut off on the right; only by swiping inside the table do I see "CHF-2’760.00", that is, the whole advance payments as a refund. The yellow box "Vor dem Erstellen beachten" lists generic hints but does not say "no invoices found for this building and period". I go back and try the other two buildings: all CHF 0.00.
5. **Rechnungen.** Via the hamburger menu (clear, large entries) to "Rechnungen". The list only has 2024 invoices, so that's the reason. The table columns Kategorie/Betrag are cut off on the right; I only see date and supplier.
6. **Neue Rechnung.** The form fits the screen nicely, one column. Danger: "Rechnungsdatum" is pre-filled with **today (10.10.2026)**. If I'm in a hurry and enter a 2025 invoice today, it falls outside 2025 and will be silently missing from the statement. There is no "Leistungsperiode" field. I enter "BKW Energie, Heizöl Heizperiode 2025, CHF 6200, 15.12.2025, Kategorie Heizung". I leave "Verteilschlüssel" empty because I don't know which one; it saves anyway with the toast "Rechnung erfolgreich erstellt". Second invoice: "Gemeinde Interlaken, Wasser und Abwasser 2025, CHF 1780, Kaltwasser, Pro Fläche (m²)".
7. **Wizard again**, from step 1 (the previous run is gone). Alpenblick → Vorschau: "Gesamtkosten CHF 5’479.61". "Wait, I entered 7'980 francs. Where is the rest?" Probably the vacant third apartment, but nothing on the screen says so.
8. **Step 4 "Erstellen".** A whole extra page with only "Bereit zum Erstellen" and one button "Abrechnungen erstellen". Tap: "Abrechnungen erstellt! 2 Nebenkostenabrechnungen wurden erfolgreich erstellt." with "Abrechnungen anzeigen" / "Weitere erstellen". Good feedback.
9. **List of drafts.** The four status tiles (Entwürfe, Versendet, Bezahlt, Überfällig) take up the whole first screen. The table only shows number, flat and period; amount, status and the "Ansehen" eye icon are off-screen to the right. Tapping the tenant's name does nothing. I have to swipe the table sideways and hit a 30×36 px eye icon. The flat column shows "Wohnung EG ·" with a stray dot.
10. **Draft detail.** Page again wider than the screen (519 px). The "Kostenaufstellung" table is squeezed: categories show in English ("Heating", "Cold Water"), the "Verteilschlüssel" column is empty, "Akontozahlungen - CHF 2’160.00" breaks the minus sign onto its own line. Right at the top, next to "PDF generieren", is a big blue **"Versenden"** button, the most prominent action on the page, although I only want to check the draft. I don't tap it. Done.

## 4. Points of confusion, including terms

- **"Gesamtkosten CHF 0.00" without a warning**: the wizard lets me create statements without any invoices in the period.
- **"Heizungsprofil"**, options in English ("Heating + Hot Water (100%)", "Heating Mountain", "Hot Water Only") and an English help text. What does "100%" mean? What does the monthly chart change for me?
- **"Verwaltungspauschale" and "Verteilung der Pauschale"**: is this allowed, and what is "Pro Einheit" compared with "Gleichmässig pro Wohnung"?
- **"Saldo" with a minus sign** ("CHF-2’760.00"): is minus good or bad for me? In the list it later says "Rückerstattung"/"Nachzahlung", which is clearer; the preview should say the same.
- **Preview total lower than the invoices** (5’479.61 vs 7’980 + fee): the vacant flat's share is not explained.
- **"Verteilschlüssel" optional** on the invoice: what happens when I leave it empty? In the statement the column is just blank.
- **Category names in English** on the statement ("Heating", "Cold Water"), although the invoice form showed "Heizung", "Kaltwasser". A tenant would see this too.
- **"Rechnungsdatum" versus the period the costs belong to**: an invoice from January 2026 for 2025 heating would land in the wrong year.
- **"Wohnung EG ·" / "Wohnung OG1 · 1"**: what is the dot and the "1"?

## 5. Mobile problems

- **Horizontal page overflow**: statement wizard (539 px wide on a 390 px screen: the step bar and the title "Nebenkostenabrechnungen erstellen" are too wide) and statement detail (519 px). The page wobbles sideways while scrolling. In the emulation, an element tap on "Weiter" was even blocked; only a tap by screen position worked.
- **Tables that need sideways scrolling**: wizard preview (Saldo hidden), invoice list (Kategorie/Betrag hidden), statement list (Saldo, Status and actions hidden). The most important column is always the one you cannot see.
- **Small targets**: the eye icon "Ansehen" is 30×36 px and the PDF icon is similar; the wizard checkboxes are 20×20 px (the card label helps). The rows themselves cannot be tapped.
- **Status tiles** on the statements page take up a full screen height before the list starts.
- **Step 4** is an extra screen with a single button. It could be the primary button on the preview.
- **Squeezed cost table** on the detail page: five columns on 390 px, labels wrap ("Cold / Water"), the minus sign wraps.
- **Wizard state is lost** when leaving it (for example to add a missing invoice) and has to be redone.
- Native date picker showed "12/31/2025" (US order) in the emulation; probably browser locale, but worth checking on a real Swiss phone.

## 6. Error risks

- **Drafts with CHF 0.00 costs** can be created; if sent, every tenant gets their full advance payments "refunded" (for example CHF 2’760.00).
- **Invoice date defaults to today**: invoices for the previous year entered now end up in the wrong period without notice.
- **Invoice saved without a Verteilschlüssel**: the statement then distributes it in some way the user did not choose (heating showed 33.33 % per flat), and the column stays empty.
- **"Versenden" is the most prominent button on a draft**, directly next to "PDF generieren" and close to the thumb. One wrong tap sends to the tenant.
- **Hidden Saldo column** in the preview: the one number that shows the result is not visible, so mistakes go unnoticed.

## 7. Improvement suggestions

| Severity | Suggestion |
|---|---|
| **Blocker** | Wizard preview: if a building has no (or suspiciously few) invoices in the period, show a clear warning ("Für Alpenblick sind für 2025 keine Rechnungen erfasst") with a link to add them, and make "Weiter" require confirmation. |
| **Major** | Remove the horizontal page overflow in the statement wizard (step bar, title) and on the statement detail page. |
| **Major** | Replace the wide tables on mobile with cards (preview, statement list, invoice list) showing tenant, amount with "Nachzahlung/Rückerstattung" and status, with the whole card tappable to open. |
| **Major** | Invoice form: add a "Leistungsperiode" (or ask which statement year the invoice belongs to); at least warn when the invoice date is in the current year while the previous year is still open. |
| **Major** | On a draft, make "PDF generieren"/check the primary action; move "Versenden" lower or into a secondary style, with a confirmation. |
| **Major** | Translate heating profiles and the cost categories shown on statements into German (they are what tenants read). |
| **Minor** | Preview: show "Nachzahlung"/"Rückerstattung" instead of a negative "Saldo", and explain why the total is below the invoice sum (vacancy share). |
| **Minor** | Make "Verteilschlüssel" required on the invoice or show which default will be used. |
| **Minor** | Merge step 4 into the preview (button "2 Abrechnungen erstellen"). |
| **Minor** | Keep the wizard state when leaving to add an invoice (or offer "Rechnung erfassen" inline). |
| **Minor** | Make the status tiles on the statements page a compact row of chips; enlarge action icons to 44×44 px; fix "Wohnung EG ·". |

## Screenshots

- `screens/marco-5/01-wizard-step1-overflow.png`: wizard step 1, step bar and title wider than the screen, English heating profile
- `screens/marco-5/02-preview-saldo-cut.png`: preview, Saldo column cut off on the right
- `screens/marco-5/03-new-invoice-form.png`: new invoice, date pre-filled with today
- `screens/marco-5/04-statement-list.png`: drafts list, tiles fill the screen, amounts and status hidden
- `screens/marco-5/05-list-scrolled-actions.png`: list after swiping sideways, small eye icon
- `screens/marco-5/06-draft-detail.png`: draft detail, prominent "Versenden", English categories, empty distribution key column
