# Persona test: Sven (6b) – keyboard and screen reader, "Abrechnungen erstellen" and "Versenden"

Persona: Sven, 45, blind, uses a screen reader and keyboard only. Date in app: 10.10.2026, fresh demo data, desktop viewport.
Method: Playwright, keyboard only (Tab, Shift+Tab, Enter, Space, Escape). After every key: `document.activeElement`, its accessible name, its `aria-describedby` texts, live regions (`role=status/alert`, `aria-live`), dialogs. Nothing was created or sent.

## 1. Task completed

**Yes.** I reached the preview (step 4 of 5) for period 2025 and "Musterhaus Zentrum", triggered both validation errors, then opened the "Versenden" dialog of the draft NK-11111111-2024-0002 and closed it without confirming. The status stayed "Entwurf".

## 2. Effort

Low to moderate. About 17 Tabs from the dashboard to "Abrechnungen erstellen". Inside the wizard, focus moves to each new step heading, so each step takes only 3–8 Tabs. The extra effort came from:

- not hearing which page loaded (focus stays on `body`);
- the "Ansehen" links in the statements table all sounding the same;
- English category and heating-profile names.

## 3. Walkthrough (think-aloud)

1. **Übersicht.** I hear the "Zum Inhalt springen" skip link, the navigation, and then under "Als Nächstes zu tun" the "Nächster Schritt: Nebenkostenabrechnungen erstellen". It tells me which buildings are not yet billed. Very helpful. I Tab to the link "Abrechnungen erstellen" and press Enter.
2. **Wizard, step 1 "Abrechnungsperiode".**
   - The page title "Abrechnungen erstellen - Dwello" is announced (assertive), but focus stays on the body. I have to Tab through all 16 navigation links again, or know to use the skip link.
   - "Beginn" 2025-01-01 and "Ende" 2025-12-31 are prefilled. Each date field takes 4 Tab stops (native segments).
   - The weekday text below ("Mittwoch, 1. Januar 2025") is not connected to the field, so I only hear it when reading in browse mode.
   - I press "Weiter".
3. **Step 2 "Gebäude".**
   - Focus lands on the heading "Schritt 2 von 5: Gebäude". Good, I know where I am.
   - The group "Gebäude" has the checkboxes "Alle Gebäude" plus three buildings, each with address and apartment count in the name. Excellent.
4. **"Weiter" without a building.**
   - Focus jumps to the first building checkbox. I hear "Musterhaus Zentrum …, Kontrollkästchen, nicht aktiviert, ungültig, Bitte wählen Sie mindestens ein Gebäude." The error is read out.
   - I press Space on "Musterhaus Zentrum". `aria-invalid` and the error text disappear immediately.
   - The polite status says "1 von 3 gewählt". At the same time a second status says "Entwurf gespeichert, 11:02". I briefly wondered whether a statement draft had been created, because "Entwurf" is also a statement status.
5. **Step 3 "Heizprofil und Verwaltungspauschale".**
   - Focus is on the step heading. All three fields have a label and a description (`aria-describedby`). Good.
   - The profile options are in English ("Heating + Hot Water (100%)"). The profile description "Standard profile for combined heating and hot water systems" is English and not linked to the select.
   - "Monatliche Verteilung" reads only as "J F M A M J J A S O N D", with no percentages. For me that chart is empty.
6. **"Weiter" to the preview.**
   - The button text changes to "Vorschau wird berechnet …" and the button gets `aria-busy`. That text has no live region, and a name change on the focused button is usually not announced, so I did not hear that it was calculating. The calculation was very fast, so here it did not matter much.
   - During loading, focus briefly fell to `body` and the page title "Abrechnungen erstellen - Dwello" was announced again. It sounded like a new page.
   - Then focus landed on the heading "Schritt 4 von 5: Vorschau". Good.
7. **Preview.**
   - I hear the description list "Abrechnungsperiode 1.1.2025 – 31.12.2025, Anzahl Abrechnungen 4, Kosten aller Abrechnungen CHF 0.00".
   - The region "Rechnungen in der Abrechnungsperiode" says "Musterhaus Zentrum Keine Rechnungen erfasst".
   - Then the warning "Rechnungen fehlen". It is a plain paragraph: not a heading, not a role, not linked to the checkbox. When tabbing from the heading I land on "Rechnung erfassen" and then on "Die Abrechnungen trotzdem erstellen" without hearing why I should confirm.
8. **"Weiter" without confirming.**
   - Focus jumps to the checkbox. I hear "Die Abrechnungen trotzdem erstellen, ungültig, Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." The error is read out.
   - After Space, the error disappears. I stopped here and did not continue to "Erstellen".
9. **Nebenkostenabrechnungen.**
   - Via the navigation I reach the list. Focus again stays on `body`.
   - The table has proper headers. The row name contains everything, including "Entwurf".
   - When tabbing, I hear "Ansehen, PDF herunterladen, Ansehen, PDF herunterladen, Ansehen, …" with no tenant or number in the link name. In a links list I cannot tell them apart.
   - I take the second "Ansehen" (Anna Schmidt, Entwurf).
10. **Detail NK-11111111-2024-0002.**
    - Order: "Zurück zu den Abrechnungen", H1 with the number, "Entwurf", "PDF herunterladen", "Versenden". Clear.
    - The cost table uses `colspan` correctly in the totals rows.
    - The "Verteilschlüssel" column is empty in every row, and the categories are in English ("Heating", "Cold Water").
11. **"Versenden" dialog.**
    - The `role=dialog` is `aria-modal`, labelled "Abrechnung als versendet markieren" and described by the explanation, recipient and delivery channel.
    - Focus starts on "Abbrechen" (the safe choice). Tab and Shift+Tab stay trapped inside the dialog.
    - The link "PDF ansehen (öffnet in neuem Tab)" says that it opens a new tab.
    - Escape closes the dialog, and so does Enter on "Abbrechen". Focus returns to "Versenden" both times. The status is still "Entwurf". Very good.

## 4. Focus, labels, error messages, dialog – findings

| Area | Finding | Rating |
|---|---|---|
| Focus on page load | After every page navigation (Übersicht → wizard, → list, → detail) focus stays on `body`. Only the page title is announced. | Minor (title is announced) |
| Focus between steps | Focus moves to the step heading `h2` ("Schritt n von 5: …"). | Good |
| Focus after preview | Lands on "Schritt 4 von 5: Vorschau", but only after a brief drop to `body` with a second page-title announcement. | Minor |
| "Being calculated" | "Vorschau wird berechnet …" only replaces the text of the focused button (`aria-busy`). There is no `role=status`, so it is usually not announced. | Major (with slower data or LLM latency, a blind user hears silence) |
| Error "Gebäude" | Focus goes to the first checkbox, with `aria-invalid` and `aria-describedby` set to the error text. The error is read out and disappears after a choice. However, "Alle Gebäude" is not marked invalid and has no description. | Good / Minor |
| Warning "Rechnungen fehlen" | The warning text is a plain paragraph: not a heading, not linked to the checkbox. Tabbing skips it. | Major |
| Error "confirm" | Focus goes to the checkbox, which is invalid and described by "Bestätigen Sie, dass …". It is read out and disappears after Space. | Good |
| Labels step 1 | Date fields are labelled. The weekday hint is not linked to them. | Minor |
| Labels step 3 | Labels and descriptions are linked. The profile description is not linked and is in English. The monthly distribution reads only as letters. | Minor / Major (chart) |
| Status "Entwurf gespeichert, 11:02" | Polite status on every change in the wizard. The word "Entwurf" collides with the statement status "Entwurf". | Minor |
| Statements table | Action links "Ansehen" and "PDF herunterladen" have no context (tenant or number). | Major |
| Dialog "Versenden" | Correct modal semantics, focus on "Abbrechen", focus trap, Escape, focus return. The button "Versenden" vs. the dialog title "als versendet markieren" is clarified in the dialog. | Good |
| Language | Categories and heating profiles are in English, so a German voice mispronounces them. | Minor (demo data) |

## 5. Error risks

- **Creating statements with CHF 0.00 by mistake:** if I miss the warning (it is not linked to the checkbox), I only find out when the error forces me to confirm. Without knowing why, a blind user might tick "trotzdem erstellen" just to get past the error. Result: 4 statements with CHF 0.00 costs and the full Akonto refunded.
- **"Entwurf gespeichert"** while I am still in the wizard can make me think statements already exist. I might leave the wizard believing I'm done.
- **"Ansehen" links without context:** opening the wrong statement and then sending it is plausible, although the dialog names the recipient, which reduces the risk.
- **Silent calculation:** with a slow preview I hear nothing after pressing "Weiter" and might press it again.

## 6. Improvement suggestions

- **Major:** Link the warning "Rechnungen fehlen" to the checkbox (`aria-describedby` on "Die Abrechnungen trotzdem erstellen" pointing to the warning text). Optionally make the warning a heading or `role=note`/region, so it can be found with H or landmark navigation.
- **Major:** Announce the calculation through a live region (`role=status`: "Vorschau wird berechnet …", then "Vorschau geladen"), instead of only changing the button text.
- **Major:** Give the table action links context, e.g. `aria-label="NK-11111111-2024-0002 ansehen"` / "PDF von Anna Schmidt herunterladen", or visually hidden text.
- **Major:** Make the "Monatliche Verteilung" chart accessible (a list or table of month and percentage, or `aria-label` per bar).
- **Minor:** Avoid the focus drop to `body` and the repeated page-title announcement when loading the preview.
- **Minor:** On page navigation, move focus to the H1 (or `main`) instead of leaving it on `body`.
- **Minor:** Rename the autosave status to something like "Eingaben gespeichert, 11:02" so it does not collide with the statement status "Entwurf". It also fires on every change, which is chatty.
- **Minor:** Link the weekday hint below the date fields with `aria-describedby`. Mark "Alle Gebäude" as invalid too, or put the error on the group (`aria-describedby` on the fieldset).
- **Minor:** Link the heating-profile description to the select. Translate the demo profile and category names into German.
- **Minor:** Fill in or remove the empty "Verteilschlüssel" column in the statement detail. Empty cells read as "leer" five times.

Screenshots: `screens/sven-6b/01-gebaeude-fehler.png`, `02-vorschau.png`, `03-vorschau-bestaetigung-fehler.png`.
