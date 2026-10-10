# Persona test: Marco (38), employed, phone-only, impatient, final round

Date: 10.10.2026
Viewport: mobile (390 x 844, touch, de-CH), zoom 1

Task: create the 2025 utility cost statements (Nebenkostenabrechnungen) for all buildings on the phone, through to created drafts.

## 1. Task completed

**Yes.** 9 statement drafts for 1.1.2025 – 31.12.2025 were created for all three buildings (Musterhaus Zentrum, Seepark Residenz, Alpenblick). On the way I recorded one missing invoice ("Hauswartung Keller AG", 15.12.2025, CHF 600.00, category "Hauswart", Musterhaus Zentrum) from inside the wizard, then confirmed "Die Abrechnungen trotzdem erstellen" for the two buildings without any invoices. The dashboard afterwards shows "10 Nebenkostenabrechnungen sind noch im Entwurf" (9 new + 1 older 2024 draft).

Sideways scrolling: **none on any screen**. `scrollWidth == clientWidth == 390` on dashboard, wizard steps 1-5, the invoice form, the result screen, the drafts list and the dashboard afterwards.

Too-small targets: none that matter. The only element under 44 px besides the hidden skip link are the 24 x 24 px checkboxes, but each sits inside a label of 48-160 px height (whole building card / whole "Umlagefähig" / "trotzdem erstellen" row is tappable), so they were easy to hit.

## 2. Effort

- Screens: dashboard -> wizard step 1 -> 2 -> 3 -> 4 -> invoice form -> wizard step 1 (restored) -> 2 -> 3 -> 4 -> 5 -> result -> drafts list. About 12 screens.
- Taps: about 13 without the invoice detour (Abrechnungen erstellen, Weiter, Alle Gebäude, Weiter, Weiter, trotzdem erstellen, Weiter, Entwürfe erstellen, Entwürfe ansehen); the invoice detour added about 10 (form fields, save, and three "Weiter" taps again).
- Time: about 4 minutes for Marco, of which about 1.5 minutes was the invoice. Creating the drafts took about 4 seconds after tapping.

## 3. Thinking aloud

1. **Dashboard** ([01](screens/marco-final/01-dashboard.png)). "Nächster Schritt – Nebenkostenabrechnungen erstellen", with the period and the three buildings named. Exactly what I came for, big button "Abrechnungen erstellen". The sentence "Erfassen Sie zuerst alle Rechnungen dieser Periode" I skimmed past – I'm in a hurry.
2. **Step 1 of 5, Abrechnungsperiode** ([02](screens/marco-final/02-step1-period.png)). 1.1.2025 – 31.12.2025 already filled in, and spelled out as "Mittwoch, 1. Januar 2025". Good, "Weiter". The date field itself showed "01/01/2025" (US order) in my browser; the German line under it saved me.
3. **Step 2, Gebäude** ([03](screens/marco-final/03-step2-buildings.png)). Tapped "Alle Gebäude" -> "3 von 3 gewählt". Big cards, easy. "Weiter".
4. **Step 3, Heizprofil und Verwaltungspauschale** ([04](screens/marco-final/04-step3-heating-fee.png)). Hesitated here: do I have to understand this? The bar chart is nice but I don't know if "Heizung + Warmwasser" or "Heizung Mittelland" is right for me. Defaults are filled (3 %, "Gleichmässig pro Wohnung"), so I just tapped "Weiter". "je Mieter nach Mietstagen" – read twice, looks like a typo.
5. **Step 4, Vorschau** ([05](screens/marco-final/05-step4-missing-invoices.png)). Shock: "Kosten aller Abrechnungen CHF 0.00", "Keine Rechnungen erfasst" for all three buildings, and the yellow box "Rechnungen fehlen ... jeder Mieter erhält sein Akonto zurück." That would hand back CHF 22'320 of Akonto. The warning is clear, but it comes at step 4 of 5 – I already clicked through three screens. The "Rechnung erfassen" button is right in the box, so I tapped it.
6. **Invoice form** ([06](screens/marco-final/06-invoice-form.png)). Date was pre-filled with today (10.10.2026) and immediately the warning "Ausserhalb der Abrechnungsperiode" – helpful, but why not pre-fill a date inside 2025 when I came from the 2025 wizard? Building was not pre-selected either. I filled building, 15.12.2025, 600.00, "Hauswartung Keller AG", description, category "Hauswart"; the warning disappeared. "Verteilschlüssel (optional)" I left empty – the hint says it then goes per apartment, fine. "Rechnung speichern".
7. **Back in the wizard** ([07](screens/marco-final/07-back-at-step1-toast.png)). Toast "Rechnung von Hauswartung Keller AG gespeichert" – good. But I'm back at **Schritt 1 von 5**, not at the preview. A blue box "Entwurf wiederhergestellt" with a button "Entwurf verwerfen". For a second I thought "Entwurf" meant the statements – would "verwerfen" delete something? I left it alone. The toast also covers the period card. Tapped "Weiter" three times (buildings were still selected, settings kept) to get back to the preview.
8. **Step 4 again**. Now "Musterhaus Zentrum – 1 Rechnung vom 15.12.2025", "Kosten aller Abrechnungen CHF 412.00". Wait – I entered 600, plus 3 % fee. Why 412? I guess the two empty apartments in Musterhaus Zentrum carry their share (4 of 6 apartments rented, 4 x CHF 103), but the screen doesn't say so. A second warning "Rechnungen nur für einen Teil der Periode" for Musterhaus Zentrum. True, but I only have this one invoice on hand – for Marco that's "later".
9. Tapped "Weiter" without ticking anything: the page jumped to the checkbox, red text "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." ([08](screens/marco-final/08-confirm-required.png)). Clear. Ticked "Die Abrechnungen trotzdem erstellen", "Weiter".
10. **Step 5, Erstellen** ([09](screens/marco-final/09-step5-create.png)). "Es werden 9 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt." Reassuring. One more reminder "Ohne Rechnungen – Seepark Residenz, Alpenblick". Next to it "Entwurf gespeichert, 14:43" and the button "Entwürfe erstellen" – two different "Entwurf"s on one screen. Tapped "Entwürfe erstellen".
11. **Result** ([10](screens/marco-final/10-result.png)). "9 Nebenkostenabrechnungen sind als Entwurf erstellt." Done. The buttons "Entwürfe ansehen" / "Weitere Abrechnungen erstellen" are below the fold on my phone, but the message is visible.
12. **Drafts list** ([11](screens/marco-final/11-drafts-list.png)). 10 drafts, the 9 new 2025 ones on top with "Rückerstattung" amounts. The page title breaks as "Nebenkostenabrechnun / gen" without a hyphen. Only the old 2024 draft has a "PDF" link; the new ones don't – I don't know why.

## 4. Terms I did not understand

- "Heizprofil" and the profile names ("Heizung Mittelland", "Heizung Bergregion"): which one is mine? Not explained in the wizard.
- "Verteilung der Verwaltungspauschale" / "Pro Einheit" vs. "Gleichmässig pro Wohnung": what's the difference?
- "Mietstagen" (likely a typo for "Miettagen").
- "Entwurf" used twice: the saved wizard state ("Entwurf gespeichert", "Entwurf wiederhergestellt", "Entwurf verwerfen") and the statement drafts ("Entwürfe erstellen").
- "Umlagefähig": I left it ticked because the hint said it goes into the statement.
- "Kosten aller Abrechnungen": I expected it to equal my invoice total plus fee.

## 5. Error risks

- **Refunding all Akonto by accident.** A hurried user who skimmed the dashboard only learns at step 4 that no invoices exist. One tick on "trotzdem erstellen" creates statements refunding the full Akonto. It is only drafts and warned twice, so recoverable, but the warning comes late.
- **"Entwurf verwerfen" misread** as deleting statement drafts, so the user may hesitate or tap it by mistake (it only resets the wizard, but nothing says so).
- **Invoice date** defaults to today even when coming from the 2025 wizard. Without the yellow warning, the invoice would silently fall outside the period.
- **CHF 412 vs CHF 600** isn't explained, so the user may think the calculation is wrong or record the invoice twice.
- Wizard state seems kept only in the current browser: opening the wizard on another device starts from scratch (step 2 showed "0 von 3 gewählt").

## 6. Suggestions

- **Major** – After saving an invoice from the wizard ("Rechnung erfassen" in step 4), return to **step 4 (Vorschau)**, not step 1. Today it costs three extra "Weiter" taps, and the user has to check that nothing was lost.
- **Major** – Warn about missing invoices earlier: show "Keine Rechnungen erfasst" next to each building in step 2 (building cards), so the user can fix it before going through steps 3-4.
- **Major** – Explain the gap between invoice total and "Kosten aller Abrechnungen" in the preview, e.g. "CHF 206.00 entfallen auf leere Wohnungen (Eigentümer)".
- **Minor** – On the invoice form opened from the wizard, pre-select the building that has no invoices and pre-fill a date inside the period (e.g. the period end), or leave the date empty instead of today.
- **Minor** – Rename the wizard-state terms so they don't clash with statement drafts: e.g. "Eingaben gespeichert", "Eingaben wiederhergestellt", "Eingaben verwerfen".
- **Minor** – The toast "Rechnung ... gespeichert" covers the wizard card on mobile; place it at the bottom or let it auto-dismiss sooner.
- **Minor** – Fix "nach Mietstagen" -> "nach Miettagen".
- **Minor** – Step 3: one sentence on which Heizprofil to choose (or "Wenn unsicher: Vorschlag übernehmen").
- **Minor** – Page title "Nebenkostenabrechnungen" breaks mid-word without a hyphen at 390 px; add `hyphens: auto` (lang="de") or a soft hyphen.
- **Minor** – Result screen: put "Entwürfe ansehen" above the fold (directly under the success message, less top padding).
- **Minor** – Drafts list: the "PDF" link appears only on the 2024 draft, not the new 2025 drafts. Show it consistently, or explain why it's missing.
- **Minor** – Date inputs render as "01/01/2025" (US order) in the browser; the German spelled-out line below helps, keep it.
