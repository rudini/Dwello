# Persona test: Anna (29), first-time landlord returning after months, round 7

Date: 10.10.2026 · Viewport: desktop 1440×900 (main), mobile 390×844 (Übersicht, Nebenkostenabrechnungen, Rechnungen) · Demo data, signed in as "Vera Verwalter"

## 1. Task completed

**Partly (the app part is done; I stopped on purpose).** Within seconds the Übersicht told me what to do next: "Nebenkostenabrechnungen erstellen" for 1.1.2025 – 31.12.2025, but "Erfassen Sie zuerst alle Rechnungen dieser Periode". I started the wizard and went as far as step 5 ("Entwürfe erstellen"). The "Vorschau" step warned me correctly that invoices are missing ("Rechnungen fehlen"), so I did **not** create the drafts. I opened "Rechnung erfassen" from the warning and filled in a few fields, but did not save, because as Anna I have no real 2025 invoice in hand. Then I toured every area (section 3) and read the Hilfe page.

## 2. Effort

- About 20 screens and 35 clicks/inputs, roughly 25 minutes including reading.
- Finding the next step took 1 screen and 0 clicks; the dashboard does this very well.
- Finding out that **no 2025 invoices exist** took 4 steps through the wizard. The Rechnungen list has no period filter, so it doesn't tell me this at a glance.

## 3. Thinking aloud

1. **Übersicht** ([01](screens/anna-7/01-uebersicht.png)): "OK, 'Nächster Schritt: Nebenkostenabrechnungen erstellen'. It even lists my three buildings. But first 'alle Rechnungen dieser Periode'. Have I recorded them? No idea." The second card, "1 Nebenkostenabrechnung ist noch im Entwurf", is a reminder that something from last time is unfinished. "Fristen: keine". Good, nothing is burning.
2. **Rechnungen** ([02](screens/anna-7/02-rechnungen-nur-2024.png)): 14 invoices, all dated **2024**. I have to read every date myself, because there is no filter for "Abrechnungsperiode" or year. Every row has a grey badge "Manuell". Manual as opposed to what? On desktop the "Bearbeiten" links stick out past the right edge of the card, and the page scrolls sideways (1478px content in a 1440px window).
3. **Abrechnungen erstellen** wizard:
   - Step 1 "Abrechnungsperiode" is prefilled with 2025. Good.
   - Step 2 "Gebäude": nothing is ticked, although the dashboard had just named all three. I clicked "Weiter" and got "Bitte wählen Sie mindestens ein Gebäude." Then I ticked "Alle Gebäude".
   - Step 3: "Heizprofil" and "Verwaltungspauschale". The profile description under the dropdown is in **English**: "Standard profile for combined heating and hot water systems". The fee hint says "je Mieter nach Mietstagen". I didn't know the word "Mietstage" (Hilfe explains it later). "Gleichmässig pro Wohnung" here, but "Pro Einheit" elsewhere: is that the same thing?
   - Step 4 "Vorschau" ([03](screens/anna-7/03-assistent-vorschau-rechnungen-fehlen.png)): very helpful. "Musterhaus Zentrum – Keine Rechnungen erfasst", "Seepark Residenz – Keine Rechnungen erfasst", "Alpenblick – 1 Rechnung vom 15.11.2025" (apparently recorded by someone else in the meantime). The warning explains the consequence ("jeder Mieter erhält sein Akonto zurück") and offers "Rechnung erfassen" plus a checkbox "Die Abrechnungen trotzdem erstellen". "Akonto": I've heard it but couldn't explain it.
   - Step 5 says "Es wird nichts verschickt", which is reassuring. I stopped here.
   - "Entwurf gespeichert, 12:26" appears in the wizard. Is that a draft *Abrechnung*? No, it's my half-filled wizard. That's the same word as the status "Entwurf" of a statement.
4. **Rechnung erfassen** from the warning ([04](screens/anna-7/04-rechnung-erfassen-kategorie-leer.png)): good hints ("Übernehmen Sie das Datum von der Rechnung, nicht das heutige"). The date defaults to today (10.10.2026), although I came from a 2025 settlement. That's easy to save wrong. In my first attempt the "Kategorie (optional)" dropdown showed **only "Kategorie auswählen"**, with no categories. Three later attempts showed all 21, so I can't reproduce it. Also: why is Kategorie "optional" when the Hilfe says "Jede Rechnung gehört zu einer Kategorie"? I clicked "Abbrechen" and didn't save.
5. **Gebäude**: "3 Gebäude in Ihrer Verwaltung" with addresses, number of apartments, rented/empty, and "Route planen". *Purpose: my properties and their occupancy.* Attention: Musterhaus shows "6 Wohnungen, 4 vermietet, 1 leer". Where is the sixth?
6. **Wohnungen** ([05](screens/anna-7/05-wohnungen-status.png)): 13 apartments over 2 pages, with a nice legend "Was bedeutet der Mietstatus?". *Purpose: each unit with size, rooms and rental status.* Attention: Wohnung 2.02 has the badge "Vermietet ab 1.11.2026". By the legend that's "Wiedervermietet" ("Ein künftiger Mietvertrag ist abgeschlossen"). The **Übersicht says "0 Wiedervermietet" and "4 Leer"**, but clicking those tiles lists **1** Wiedervermietet (2.02) and **3** Leer. So one apartment has three different states depending on where I look: "Leer" on the dashboard, "Vermietet ab …" in the list, "Wiedervermietet" in the filter, and missing on the building card. I can't trust the numbers now. 3 apartments are really empty (OG2, 3.02, B1), and that does need my attention: they bring in no rent.
7. **Mieter**: 10 tenants with contact details and "Aktiv" badges. *Purpose: my tenants' contact data.* Odd: "Ruth Meier – Keine laufende Miete – **Aktiv**". Is she active or not? (Mietverträge shows her contract starts 1.11.2026.) Tenants are "Aktiv / Ehemalig", contracts are "Laufend / Beendet / Künftig": two vocabularies for the same idea.
8. **Mietverträge**: 11 contracts, all "unbefristet", one "Künftig" (Ruth Meier from 1.11.2026), one "Beendet". *Purpose: who rents what, since when, for how much.* Nothing is ending, good. The difference between "Nettomiete" and "Monatlich total" is presumably the Nebenkosten-Akonto, but it isn't shown.
9. **Nebenkostenabrechnungen** ([06](screens/anna-7/06-abrechnungen-liste.png)): 3 statements for 2024. *Purpose: settle and track the yearly utility costs per tenant.* Attention:
   - Anna Schmidt is still a draft ("Entwurf"), with a refund of CHF 83.43 that I owe her.
   - Hans Müller is "Versendet" with a "Nachzahlung CHF 254.18", **not yet paid**, "Zahlungsfrist 9.11.2026" ([07](screens/anna-7/07-abrechnung-versendet.png)).
   - In the list his row has a "Bezahlt" button right next to the "Versendet" badge. It looks almost like the green "Bezahlt" status badge of Thomas Weber, so for a second I thought it was already paid. It also sticks out past the card edge, and the page scrolls sideways (1452px).
   - On the detail page "Mahnung senden" is offered although the deadline is a month away.
   - The "Verlauf" shows only "Erstellt" and "PDF erstellt", with no "Versendet" entry.
   - "Versenden" on the draft sounds like Dwello e-mails it. Only the Hilfe says it doesn't.
10. **Dokumente**: "Noch keine Dokumente". *Purpose: reminder letters to print and post.* Nothing to do.
11. **Einstellungen**: sender address, IBAN, Verwaltungspauschale 3 %, default period, Heizprofil and Verteilschlüssel. *Purpose: what goes on every statement / QR bill, plus default values.* All filled in, nothing to do. "Stammdaten" is a heading I wouldn't use myself.
12. **Kategorien**: 21 categories (14 umlagefähig, 7 not). *Purpose: types of costs and whether tenants pay them.* **Every description is English** ("Costs for heating the building", "Caretaker wages and services", "Pest control services", …).
13. **Verteilschlüssel** ([08](screens/anna-7/08-verteilschluessel-formeln.png)): "Formel: {units}", "{area}", "0.7 * {area} + 0.3 * {units}". *Purpose: how a building's costs are split across apartments.* The explanation below ("Bausteine", examples) is good, but the formulas themselves are code with English words. "Pro Einheit" = "{units}" = "Gleichmässig pro Wohnung" = "gleich viel pro Wohnung" (Hilfe): four names for one rule.
14. **Heizprofile**: monthly percentage bars. *Purpose: split heating costs over the months when tenants move.* Fine, nothing to do.
15. **Hilfe**: **it helped.** The section "Begriffe kurz erklärt" explained "Akonto", "Mietstage", "Saldo", "Verwaltungspauschale" and "Korrespondenzkanal", all words I had stumbled on. It also confirmed that "Versenden" only records the sending. Small mismatches: the Hilfe says "«Als bezahlt markieren»" (true on the detail page, but the list button just says "Bezahlt"), and "Jede Rechnung gehört zu einer Kategorie" (the form says "optional"). The Hilfe is only reachable from the sidebar, and the wizard step texts don't link to it.
16. **Mobile** ([09](screens/anna-7/09-mobile-uebersicht.png), [10](screens/anna-7/10-mobile-abrechnungen-titel-abgeschnitten.png)): the Übersicht reads well and the next step is the first thing I see. On "Nebenkostenabrechnungen" the page title is **cut off** ("Nebenkostenabrechnunge…") and the page scrolls sideways (425px in a 390px viewport). The hamburger button is announced without a name.

**My to-do list as Anna:** collect and record all 2025 invoices (Musterhaus and Seepark have none, Alpenblick only one from November) → create the 2025 statements. Send Anna Schmidt's 2024 draft and refund her CHF 83.43. Watch Hans Müller's CHF 254.18 until 9.11.2026. Find tenants for OG2, 3.02 and B1.

## 4. Terms I did not understand

| Term | Where | Comment |
|---|---|---|
| "Akonto", "Geleistete Akontobeiträge" | Wizard Vorschau, statement detail | Explained only in the Hilfe |
| "Mietstage" | Wizard step 3, statement detail | Unusual word (I'd say "Miettage"); Hilfe explains it |
| "Saldo" | Statement detail | Hilfe explains it |
| "Manuell" (badge) | Rechnungen list | Manual as opposed to what? Not explained anywhere |
| "Umlagefähig / Umlagefähigkeit" | Rechnungen, Kategorien | Explained in the page intro, OK |
| "Wiedervermietet" | Übersicht, Wohnungen filter | The legend explains it, but the badge never uses the word ("Vermietet ab …") |
| "Gesperrt" | Übersicht | Clear only after reading the legend |
| "Stammdaten" | Einstellungen | Jargon |
| "Verwaltungspauschale" | Wizard, Einstellungen | Explained, OK |
| "{units}", "{area}", "{rooms}", "{volume}", "Formel" | Verteilschlüssel | Code-like, English |
| "NK-11111111-2024-0001" | Statements | Long technical number |

**English words:** "Standard profile for combined heating and hot water systems" (wizard step 3), every category description ("Costs for heating the building", "Elevator maintenance and operation", …), and the formula placeholders "{units}/{area}/{rooms}/{volume}". "PDF" and "IBAN" are fine.

**Same thing, two (or more) names:**
- "Pro Einheit" / "Gleichmässig pro Wohnung" / "{units}" / "gleich viel pro Wohnung"
- "Wiedervermietet" / "Vermietet ab 1.11.2026" / "Künftig" (contract) / counted as "Leer" on the Übersicht
- Tenant "Aktiv/Ehemalig" vs contract "Laufend/Beendet"; Ruth Meier is "Aktiv" with "Keine laufende Miete"
- "Bezahlt" (status badge) vs "Bezahlt" (button) vs "Als bezahlt markieren" (detail page and Hilfe)
- "Entwurf" = a draft statement, and "Entwurf gespeichert" = the half-filled wizard
- "Nebenkostenabrechnungen" vs "Abrechnungen" (button, wizard)
- "Gebäude" vs "Liegenschaft" ("Nebenkosten der Liegenschaft" in wizard and statement)
- "Zustellen" (Übersicht) vs "Versenden" (button)

## 5. Error risks

1. **Wrong vacancy picture:** the Übersicht says 4 Leer / 0 Wiedervermietet, but the lists say 3 / 1. I might advertise 2.02, which is already rented from 1.11.2026.
2. **Invoice date defaults to today**, even when I come from the 2025 wizard. A 2025 invoice saved with 10.10.2026 would silently fall into the wrong period.
3. **"Bezahlt" button looks like a status badge.** It's easy to misread the row as paid, or to mark it paid with one click and no confirmation.
4. **"Mahnung senden" is offered before the Zahlungsfrist** has passed, so I could send a reminder to a tenant who isn't late.
5. **"Versenden"** sounds like Dwello sends the e-mail. I could forget to actually send the PDF.
6. **"Die Abrechnungen trotzdem erstellen"** creates 9 statements that refund every tenant's full Akonto. The warning is good, but it's still one checkbox away.
7. **Kategorie dropdown was empty once** (not reproducible). An invoice saved without a category might be skipped in the settlement.
8. **No period filter on Rechnungen**: I could easily believe the period's invoices are complete when they aren't.

## 6. Suggestions

- **Major:** Make the Übersicht counts match the filtered lists. Count a unit with a future contract as "Wiedervermietet" (not "Leer"), and show the same word as the badge in the Wohnungen list and on the Gebäude card (6 = 4 vermietet + 1 leer + 1 wiedervermietet).
- **Major:** In "Rechnung erfassen" opened from the wizard (`returnTo=/statements/generate`), prefill the date inside the chosen Abrechnungsperiode, or warn when the date is outside it ("Diese Rechnung fällt nicht in die Periode 2025").
- **Major:** Translate every category description and the default Heizprofil description into German ("Kosten für die Heizung des Gebäudes", "Standardprofil für Heizung und Warmwasser").
- **Major:** In the statements list, make "Bezahlt" a clearly labelled action button ("Als bezahlt markieren", same as the detail page and Hilfe), visually distinct from the status badge and inside the card.
- **Minor:** Fix the horizontal overflow on desktop for Rechnungen (1478px) and Nebenkostenabrechnungen (1452px): the "Bearbeiten" and "Bezahlt/PDF" columns stick out of the cards.
- **Minor:** On mobile, let the "Nebenkostenabrechnungen" heading wrap or hyphenate (`hyphens: auto`, lang de) so it isn't cut off. Give the hamburger button an accessible name ("Menü öffnen").
- **Minor:** Add a "Abrechnungsperiode / Jahr" filter to Rechnungen, and show per building how many invoices exist for the current open period.
- **Minor:** In wizard step 2, preselect the buildings the Übersicht says are still open.
- **Minor:** Hide or disable "Mahnung senden" until the Zahlungsfrist has passed, or show "Frist läuft bis 9.11.2026".
- **Minor:** Explain or drop the "Manuell" badge on invoices.
- **Minor:** Use one name for the equal split ("Gleichmässig pro Wohnung" everywhere instead of "Pro Einheit"), and show formulas in words ("Fläche × 0.7 + Wohnung × 0.3") instead of "{area}/{units}".
- **Minor:** Tenant badge: show "Künftig" (or "Einzug 1.11.2026") instead of "Aktiv" for Ruth Meier, or align tenant and contract states.
- **Minor:** Record "Versendet" in the statement's "Verlauf". Rename "Versenden" to "Als versendet markieren" to match what it does.
- **Minor:** Link Hilfe terms inline (e.g. "Akonto", "Mietstage" as small "?" links in the wizard and statement detail). Make "Kategorie" required or change the Hilfe sentence.
- **Minor (unconfirmed):** The Kategorie dropdown in "Neue Rechnung" showed no options once; it did not happen again in three retries.
