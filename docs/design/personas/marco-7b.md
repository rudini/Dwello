# Persona test: Marco (38), employed, phone only, impatient, round 7b

Date: 10.10.2026
Viewport: mobile (390 x 844, touch, de-CH), zoom 1, demo data on http://localhost:3300

## 1. Task completed

**Yes, with two snags.**

- (1) Recorded "Gartenbau Keller GmbH", 20.10.2025, CHF 320.00, for Seepark Residenz. Saved without a category (the app gives no automatic category on save; the AI "Neu kategorisieren" failed). I then set "Gartenpflege" by hand via "Rechnung bearbeiten". The form explains the missing Verteilschlüssel clearly ("Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt."); the invoice detail page does not repeat it.
- (2) Wizard "Abrechnungen erstellen" for Alpenblick, 1.1.2025 – 31.12.2025, up to step 4 "Vorschau". It warned "Rechnungen fehlen" with a "Rechnung erfassen" button. The invoice form opened with Alpenblick preselected and immediately warned "Ausserhalb der Abrechnungsperiode" because the date was still today; the warning disappeared once I entered 15.06.2025. "Abbrechen" leads back to the wizard. Stopped there; no statements created and no second invoice saved.
- (3) Statements list and two details (Versendet, Entwurf). **No screen scrolls sideways**: `scrollWidth == clientWidth == 390` on every screen visited. But on the detail page the cost table is cut off inside its box, and the amounts are hidden (see below). Nothing marked paid.

## 2. Effort

- Invoice: 3 screens (dashboard, form, list), about 8 taps plus typing, about 1.5 min. Fixing the category: about 3 more taps plus about 30 s waiting for the failed AI.
- Wizard to "Rechnung erfassen": 4 wizard steps, 6 taps, about 1 min.
- Statements: menu, list, 2 details, about 6 taps, about 1 min.

## 3. Thinking aloud

1. Dashboard: big card "Nebenkostenabrechnungen erstellen" says 2025 is over and "Erfassen Sie zuerst alle Rechnungen". Good, that is exactly what I want. Under "Häufige Arbeiten" I tap "Rechnung erfassen".
2. Invoice form ([01](screens/marco-7b/01-invoice-form.png)): the date help is clear: "Übernehmen Sie das Datum von der Rechnung, nicht das heutige." The date field shows `10/10/2026` (US-style in this browser), but the line under it, "Samstag, 10. Oktober 2026", reassures me. I enter 20.10.2025 and the line says "Montag, 20. Oktober 2025". Nice.
3. "Kategorie (optional)" contains only "Kategorie auswählen" until I pick a building, which irritated me for a second. After that the list is long (21 entries). I would expect the AI to fill it, so I leave it empty. The Verteilschlüssel help tells me what happens without one: equal per apartment. Understood.
4. "Rechnung speichern" leads to the list with a toast "Rechnung von Gartenbau Keller GmbH gespeichert". My invoice is on top with "Ohne Kategorie" and a yellow "Kategorie fehlt" ([02](screens/marco-7b/02-invoice-saved-no-category.png)). Why didn't the AI do it? The form never said categorizing would happen, or that I have to do it myself.
5. Detail ([03](screens/marco-7b/03-invoice-detail.png)): "Nicht kategorisiert – bitte Kategorie wählen", "Verteilschlüssel: Nicht zugewiesen". "Nicht zugewiesen" sounds like a problem. The calming explanation from the form ("gleichmässig pro Wohnung") is missing here.
6. I tap "Neu kategorisieren" (at the bottom of the page). Nothing visible happens: no spinner, no text near the button. After about 25 s still nothing ([04](screens/marco-7b/04-recategorize-no-feedback.png)). Only after scrolling up do I find a red box at the top: "Kategorisierung fehlgeschlagen – Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert." On the phone that box was about 600 px above my viewport. I would have tapped again or given up.
7. "Rechnung bearbeiten": I pick "Gartenpflege" and save, which shows "Manuell kategorisiert". The list also contains "Gartenpflege Test" (probably another tester's category), so there are two similar entries.
8. Wizard: dashboard, "Abrechnungen erstellen". Step 1 already proposes 1.1.2025 – 31.12.2025. Step 2: I tap "Alpenblick" (the whole row is tappable, 136 px high). Step 3 (Heizprofil, Verwaltungspauschale): I just tap "Weiter". The word "Mietstagen" looks odd to me.
9. Step 4 "Vorschau" ([05](screens/marco-7b/05-wizard-missing-invoices.png)): "Rechnungen fehlen … Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück." Very clear, and the tenant refunds below (CHF 2'160 / 3'000) make the risk obvious. The "trotzdem erstellen" checkbox guards the next step. Good.
10. "Rechnung erfassen" opens the form with Alpenblick already chosen and, right away, a yellow box "Ausserhalb der Abrechnungsperiode – Das Rechnungsdatum liegt nicht in der Abrechnungsperiode 1.1.2025 – 31.12.2025 …" ([06](screens/marco-7b/06-invoice-from-wizard-date-warning.png)). Helpful, but why is the date still prefilled with today, when the app knows I want a 2025 invoice? The native date picker opens in October 2026, so I have to page back about 12 months. Entering 15.06.2025 removes the warning. "Abbrechen" goes back to the wizard; the breadcrumb "Rechnungen" would take me elsewhere.
11. Statements list ([07](screens/marco-7b/07-statements-list.png)): no sideways scroll. The heading breaks as "Nebenkostenabrechnun / gen", which looks broken. Cards are tappable as a whole, and "PDF" and "Als bezahlt markieren" are 48 px high. The four status tiles are clear. The "Bezahlt" tile had a darker border although no filter was active, so I briefly thought it was selected.
12. Detail "Versendet" ([10](screens/marco-7b/10-detail-sent-full.png)): buttons "PDF herunterladen", "Mahnung senden", "Als bezahlt markieren", all 48 px, labels clear. "Mahnung senden" is offered although the "Zahlungsfrist" (9.11.2026) has not passed yet; that would be impolite towards the tenant. I did not tap "Als bezahlt markieren", so I don't know whether it asks for confirmation.
13. "Kostenaufstellung" ([08](screens/marco-7b/08-detail-table-amounts-hidden.png)): I see only "Kategorie" and "Verteilschlüssel". Where is the money? The table is 648 px wide in a 306 px box, and nothing shows that it can be swiped. Only after swiping inside the table do I see "Kosten des Gebäudes", "Anteil" and "Betrag" ([09](screens/marco-7b/09-detail-table-swiped.png)), and then the category names are gone. "15.33 %" breaks onto two lines. Under the table, "Geleistete Akontobeiträge" shows the minus "−" on its own line, separated from "CHF 1'440.00".
14. The draft detail (Anna Schmidt) has the same table. Its buttons are "PDF herunterladen", "Versenden" and "Abrechnung löschen", all 48 px.

### Sideways scroll / target size measurements

| Screen | scrollWidth / clientWidth | Targets < 44 px |
|---|---|---|
| /dashboard | 390 / 390 | none |
| /invoices/new (also from wizard) | 390 / 390 | none |
| /invoices (list) | 390 / 390 | none |
| /invoices/{id}, /edit | 390 / 390 | none |
| /statements/generate steps 1-4 | 390 / 390 | checkbox box 24 px, but the label row is 48-160 px tall (OK) |
| /statements | 390 / 390 | none (all 48 px) |
| /statements/{id} (Versendet, Entwurf) | 390 / 390 (table scrolls inside its own box: 648 / 306) | breadcrumb link "Nebenkostenabrechnungen" 24 px high |

## 4. Terms I did not understand

- "Nicht zugewiesen" (Verteilschlüssel on the invoice detail): sounds like an error; I only learned on the form that it means equal per apartment.
- "Mietstage" / "Mietstagen": I would say "Miettage".
- "Umlagefähig": guessable thanks to the line "fliesst in die Nebenkostenabrechnung ein".
- "Heizprofil": the bar list helps, but I simply accepted the default.

## 5. Error risks

- Hidden amounts in "Kostenaufstellung": on the phone I could send or accept a statement without ever seeing the per-category amounts.
- Failed AI categorization with off-screen feedback: I may tap repeatedly or assume a category was set.
- Wizard-launched invoice prefilled with today: when I am in a hurry the invoice lands in 2026 and is missing from the 2025 statement. The warning mitigates this, but it is a yellow box I am used to ignoring.
- "Mahnung senden" before the due date: an accidental reminder to a tenant who is not late.
- Two near-identical categories "Gartenpflege" / "Gartenpflege Test": easy to pick the wrong one.

## 6. Suggestions

- **Major:** Statement detail "Kostenaufstellung" on mobile: show each position as a stacked card (Kategorie, Verteilschlüssel, Anteil, **Betrag**), or at least keep "Betrag" visible and show a swipe hint or edge shadow. Keep "%" values from wrapping (`white-space: nowrap`). ([08](screens/marco-7b/08-detail-table-amounts-hidden.png), [09](screens/marco-7b/09-detail-table-swiped.png))
- **Major:** "Neu kategorisieren": show progress on the button itself ("Kategorisiere …", disabled), and show the result or error next to the button, or scroll to or focus the alert. Today the error appears about 600 px above the viewport. ([04](screens/marco-7b/04-recategorize-no-feedback.png))
- **Major:** When the invoice form is opened from the wizard with `periodStart/periodEnd`, prefill the date inside the period (for example the period end) or leave it empty, and limit the picker with `min`/`max` so it opens in 2025.
- **Minor:** On save without a category, tell the user what happens next (AI categorizes, or "bitte Kategorie wählen") instead of silently showing "Kategorie fehlt".
- **Minor:** Invoice detail: next to "Verteilschlüssel: Nicht zugewiesen", add "– Kosten werden gleichmässig pro Wohnung verteilt".
- **Minor:** Only offer "Mahnung senden" after the "Zahlungsfrist", or label it differently before then.
- **Minor:** Keep "−" and the amount together (`white-space: nowrap`) in "Geleistete Akontobeiträge".
- **Minor:** Hyphenate the long H1 (`hyphens: auto` with `lang="de"`, or a soft hyphen in "Nebenkosten&shy;abrechnungen") so it does not break as "Nebenkostenabrechnun / gen".
- **Minor:** The breadcrumb link on the statement detail is only 24 px high; make it 44 px tall.
- **Minor:** Fill the "Kategorie" dropdown before a building is chosen, or say "Zuerst Gebäude wählen".
- **Minor:** Wizard-launched invoice form: the breadcrumb should lead back to "Abrechnungen erstellen", like "Abbrechen" does.
- **Minor:** "Mietstagen" should read "Miettagen" (wizard step 3, statement detail).
