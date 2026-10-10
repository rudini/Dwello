# Persona test: Sven (6): wizard "Abrechnungen erstellen" and "Versenden" dialog, screen reader + keyboard only

Persona: Sven, 45, blind, uses a screen reader and the keyboard only. Date in the app: 10.10.2026, demo data.
Method: Playwright, input only through `page.keyboard`. After each key press I checked the focused element, its accessible name, aria-describedby, aria-invalid, live regions (`role=status/alert`, `aria-live`) and open dialogs. I read the accessibility tree with `ariaSnapshot`.

## 1. Task completed

**Yes.** I went through the wizard for 1.1.2025 to 31.12.2025 with "Musterhaus Zentrum" up to step 5 "Erstellen" and did **not** press "Entwürfe erstellen". I pressed "Weiter" without a building and without the confirmation on purpose. In draft NK-11111111-2024-0002 I opened the "Versenden" dialog, checked it, and closed it twice: once with Escape and once with "Abbrechen". The status stayed "Entwurf".

## 2. Effort

- **151 key presses** in total, counting exploration and two slips where I landed on "Zurück" instead of "Weiter".
- The ideal path is about 95 presses: about 75 for the wizard and about 20 for the dialog part.
- The date fields cost a lot. Each one takes 4 Tab stops (day, month, year, then the field), so step 1 needs about 10 Tab presses just to reach "Weiter".
- After every page change focus goes to `BODY`, so I always had to use the skip link "Zum Inhalt springen" (2 extra presses per page).

## 3. Walkthrough

1. **Dashboard:** I hear the skip link, banner and "Hauptnavigation". There is **no "Abrechnungen erstellen" entry in the navigation**, only "Nebenkostenabrechnungen". (On the dashboard the link exists under "Als Nächstes zu tun" and "Häufige Arbeiten".) I took the navigation route: 10 Tab presses to "Nebenkostenabrechnungen", then Enter.
2. **List:** the route announcer says "Nebenkostenabrechnungen - Dwello" (assertive), good. Focus is on `BODY`, and the next Tab starts again at "Zum Inhalt springen". Skip link, then Tab: "Abrechnungen erstellen", Enter.
3. **Step 1 "Abrechnungsperiode":** Beginn 2025-01-01 and Ende 2025-12-31 are filled in already ("Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode"). The weekday hint "Mittwoch, 1. Januar 2025" is not linked to the field, so I don't hear it when focus is on the date. "Weiter".
4. **Step 2 "Gebäude":** focus moves to the heading "Schritt 2 von 5: Gebäude", very good. The polite live region says "0 von 3 gewählt". I tabbed past all checkboxes to "Weiter", Enter **without a selection**. Focus jumps to the first building checkbox, which is `aria-invalid=true` with the description "Bitte wählen Sie mindestens ein Gebäude." That's exactly right (screenshot 01). Space on "Musterhaus Zentrum" gives "1 von 3 gewählt". **But the error stays:** the checkbox is still `invalid` and still announces "Bitte wählen Sie mindestens ein Gebäude." At the same time a `role=status` says "Entwurf gespeichert, 10:42".
5. **Slip 1:** I counted one Tab too few and pressed Enter on "Zurück", which put me back in step 1. Focus moved to the step heading, so I noticed it. The building selection was kept.
6. **Step 3 "Heizprofil und Verwaltungspauschale":** the fields have good labels and descriptions through aria-describedby. Still:
   - The heating profiles are English: "Heating + Hot Water (100%)", with the description "Standard profile for combined heating and hot water systems".
   - "Monatliche Verteilung" reads only "J F M A M J J A S O N D". The percentages exist only as `title` tooltips on the bars, which neither a screen reader nor the keyboard can reach.
   - The description of "Verteilung der Verwaltungspauschale" says "Die Pauschale wird **so** auf die Wohnungen verteilt …", which only makes sense if you can see what "so" refers to.
7. **Step 4 "Vorschau":** this time focus goes to the whole `MAIN` element, not the step heading as in steps 2, 3 and 5. The screen reader reads from the breadcrumb on. "Rechnungen fehlen" is a plain paragraph, not a heading and not an alert, so I can only find it by reading through.
8. **Slip 2:** three Shift+Tab presses from the footer landed on "Zurück" again, and I was back in step 3.
9. **"Weiter" without confirming:** focus jumps to the checkbox "Die Abrechnungen trotzdem erstellen", but I only hear "Kontrollkästchen, nicht aktiviert". The red text "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen." has no id, no `role=alert`, no `aria-describedby` and no `aria-invalid` (screenshot 02). This is inconsistent with the good behavior in step 2.
10. Space, then "Weiter", brings me to **step 5 "Erstellen"** with focus on the heading. "Es werden 4 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt." The button is "Entwürfe erstellen". **Stopped here.**
11. **Draft:** I left through the breadcrumb (no warning, the wizard saves itself), used the "1 Entwürfe" filter, skip link, 11 Tab presses to the icon link "Ansehen" (name only from `title`), Enter. The title "Abrechnung NK-11111111-2024-0002 - Dwello" is announced.
12. **"Versenden":** skip link, 3 Tab presses. The dialog has `role=dialog`, `aria-modal=true`, the title "Abrechnung als versendet markieren" (aria-labelledby), and the content linked through aria-describedby: "Dwello verschickt die Abrechnung nicht selbst … Empfänger: Anna Schmidt, Korrespondenzweg: Per E-Mail …". Initial focus is on "Abbrechen", the safe choice. Tab cycles only through "Als versendet markieren", "PDF ansehen (öffnet in neuem Tab)" and "Abbrechen", so the focus trap works. **Escape** closes the dialog and focus returns to "Versenden". **"Abbrechen"** does the same. The status stays "Entwurf" (screenshot 03).

## 4. Focus, labels, error messages, dialog: findings

**Good**
- The route announcer tells me every page change ("… - Dwello").
- Wizard steps 2, 3 and 5 put focus on the step heading. The progress is reachable as a "Fortschritt" navigation with a progressbar "Schritt n von 5", and finished steps are buttons "… (erledigt)".
- Step 2 error: focus goes to the field, `aria-invalid`, and the message comes through `aria-describedby`. Model behavior.
- The building checkboxes have full names (name, address, number of apartments), and the selection count is announced politely.
- Step 3 fields: labels and help texts are linked through `aria-describedby`.
- The "Versenden" dialog is exemplary: modal, labelled, described, safe initial focus, focus trap, Escape, and focus returns to the trigger. The text clearly states that Dwello sends nothing itself.

**Problems**
- F1: After "Weiter" in step 4 there is **no announced error** for the missing confirmation. Focus lands on the checkbox without any explanation.
- F2: The step 2 error **stays after it's fixed** (`aria-invalid` and the description remain after a building is checked).
- F3: Focus target is inconsistent: `MAIN` in step 4, the H2 heading in the other steps.
- F4: The "Rechnungen fehlen" warning is not structured: no heading, no alert, not linked to the checkbox.
- F5: The "Monatliche Verteilung" chart is visual only. The values are in `title` and inaccessible.
- F6: Heating profiles, their descriptions and the cost categories on the detail page are English ("Heating", "Cold Water", "Caretaker"). The "Verteilschlüssel" column on the detail page is empty, so I hear empty cells.
- F7: After every full page navigation focus is on `BODY` instead of the H1 or `main`. The skip link is needed every time.
- F8: "Ansehen" / "PDF herunterladen" in the list are the same in every row, with no statement number. The name comes only from `title`.
- F9: The status "Entwurf gespeichert, 10:42" in the wizard is easy to confuse with the statement status "Entwurf" and the button "Entwürfe erstellen". I wondered for a moment whether something had already been created.
- F10: "Versenden" (button) and "Als versendet markieren" (dialog) don't match. The button promises an action that Dwello doesn't do.
- F11: Navigation: "Abrechnungen erstellen" is not in the main navigation. The task wording expects it there.
- F12: Terms are inconsistent: "Verwaltungspauschale" in the wizard and "Verwaltungsgebühr (3%)" on the detail page. On the detail page "3%" sits next to CHF 51.00 on a subtotal of CHF 1'785.57, which doesn't add up for me without explanation, even though the wizard says the percentage refers to the costs of the whole property.

## 5. Error risks

- **Creating by mistake with CHF 0.00 costs:** in step 4 I don't hear the actual risk ("jeder Mieter erhält sein Akonto zurück", refunds of CHF 1'440 to 4'200) when I land on the checkbox, because it isn't described. A screen reader user might check "trotzdem erstellen" without knowing the consequence.
- **"Zurück" right before "Weiter":** I slipped twice. Going back is harmless because the data is kept and focus goes to the heading. But it costs time and causes confusion, especially because "Zurück" sits before "Weiter" when moving backwards with Shift+Tab from the footer.
- **Stale error message in step 2:** it makes me think my selection didn't count, so I might press Space again and uncheck the building.
- **"Versenden":** someone who closes the dialog quickly or skims it might press "Als versendet markieren" without having delivered the PDF. The dialog explains it well, but the button wording sets a different expectation.

## 6. Improvement suggestions

| # | Severity | Suggestion |
|---|---|---|
| 1 | **Major** | Step 4: link the confirmation error to the checkbox through `aria-describedby` and set `aria-invalid`, as in step 2. Also link the warning text ("Ohne Rechnungen … Akonto zurück") to the checkbox through `aria-describedby`. |
| 2 | **Major** | Step 2: remove `aria-invalid` and the error message as soon as at least one building is checked. |
| 3 | **Major** | Step 4: put focus on the step heading after "Weiter", like the other steps. Mark "Rechnungen fehlen" as a heading or `role=alert` (group) so I can find it by heading navigation. |
| 4 | Minor | "Monatliche Verteilung": add text alternatives (visually hidden table or list "Januar 14 %, Februar 12 % …") instead of `title`. |
| 5 | Minor | Translate the heating profile names and descriptions and the cost categories into German. Hide the empty "Verteilschlüssel" column or fill it. |
| 6 | Minor | After page navigation, move focus to the H1 or `main` instead of `BODY`. |
| 7 | Minor | Give the list action links an accessible name with context, e.g. `aria-label="NK-11111111-2024-0002 ansehen"`. |
| 8 | Minor | Rename the button "Versenden" to "Als versendet markieren …", or describe it so it matches the dialog. |
| 9 | Minor | Word the autosave status distinctly, e.g. "Eingaben gespeichert, 10:42", so it can't be confused with the statement status "Entwurf". |
| 10 | Minor | Add "Abrechnungen erstellen" to the main navigation under "Nebenkosten", or name it in the description of the "Nebenkostenabrechnungen" entry. |
| 11 | Minor | Link the date fields' weekday hint to the field through `aria-describedby`. Use the same term for the management fee ("Verwaltungspauschale") everywhere and explain the basis it is calculated on. |

## Screenshots

- `screens/sven-6/01-gebaeude-fehler.png`: step 2 after "Weiter" without a building (error correctly linked)
- `screens/sven-6/02-vorschau-bestaetigung-stumm.png`: step 4 after "Weiter" without confirming (error visible but not announced)
- `screens/sven-6/03-versenden-dialog.png`: "Abrechnung als versendet markieren" dialog
