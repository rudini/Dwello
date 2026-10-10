# Persona test: Sven (5b), screen reader and keyboard only

Sven, 45, blind, uses a screen reader and only the keyboard. Task: starting at `/dashboard`, create a new Mietvertrag for an existing tenant and a free apartment, starting 01.01.2027, unbefristet, Nettomiete 1'250, Akonto 140. Deliberate detours: "Weiter" without a tenant, go back a step, a start date in the past. Run on 10.10.2026 against the demo data at desktop size (1440 x 900). The browser was driven only with `page.keyboard`, and what I "heard" came from the accessibility tree, the focused element's name and description, and the live regions.

## 1. Task completed

**Yes.** The contract "Marco Bernasconi, Wohnung OG2 - Alpenblick, ab 01.01.2027, unbefristet, CHF 1'250 + 140 Akonto" was saved and shows up first in the "Mietverträge" list.

## 2. Effort

- **About 124 key presses** with all the deliberate detours. These include one empty "Weiter", a "Zurück" round trip, and about 35 presses spent entering and then correcting the past date.
- **About 85 key presses** for a direct run without detours. This drops to **about 70** if I use "Zum Inhalt springen" on the dashboard (Tab, Enter, then 4 Tabs) instead of 20 Tabs through the header and sidebar.
- On every step the wizard needs only a few Tabs: field, (Zurück), Weiter. On the summary I have to pass 7 "… ändern" buttons before I reach "Mietvertrag speichern" (9 Tabs).

## 3. Walkthrough (thinking aloud)

1. **Dashboard.** The page title is announced as "Übersicht - Dwello". I tab through the skip link, the logo, the user menu and 13 sidebar links. After Tab 20 I hear "Mietvertrag erfassen, Link" under "Häufige Arbeiten". I press Enter.
2. **New page.** The route announcer (assertive) says "Neuer Mietvertrag - Dwello". Focus is on `body`, so I start again from the top. 18 Tabs later I reach the combobox **"Mieter"**, described as "Die Person, die die Wohnung mietet. Steht sie noch nicht in der Liste, erfassen Sie sie zuerst." Good. The region and heading "Schritt 1 von 5: Mieter" and a progressbar "Schritt 1 von 5" are also there.
3. **"Weiter" without a tenant.** I tab past "Neuen Mieter erfassen" and "Abbrechen" to "Weiter" and press Enter. Focus jumps back to the combobox, which is now **invalid**. Its description is "Die Person … zuerst. | Bitte wählen Sie einen Mieter aus". I hear the error because focus lands on the field, which works well. The error comes *after* the long help text, so I have to listen through the help sentence first (screenshot 01).
4. **Choose a tenant.** ArrowDown gives "Marco Bernasconi". `aria-invalid` and the error text disappear right away. The polite status says "Entwurf gespeichert, 09:35".
5. **Step 2.** "Weiter" moves focus to the heading **"Schritt 2 von 5: Wohnung"**, which is exactly what I want to hear. The combobox "Wohnung" says that free apartments are at the top and rented ones are marked «nicht verfügbar» and disabled. ArrowDown gives "Wohnung OG2 - Alpenblick".
6. **Back.** Tab, then "Zurück" and Enter. Focus is on "Schritt 1 von 5: Mieter" and Marco Bernasconi is still selected. Then Weiter, Weiter: "Schritt 2 von 5: Wohnung" (the apartment is kept), then **"Schritt 3 von 5: Vertragsdauer"**. Every step change landed on the step heading.
7. **Past start date.** The date field "Vertragsbeginn" (native `type=date`) is described as "Erster Tag des Mietverhältnisses." I type 01012026. A polite live region echoes "Donnerstag, 1. Januar 2026", which is a nice confirmation. A caution box now appears: **"Vertragsbeginn prüfen – Der Vertragsbeginn Donnerstag, 1. Januar 2026 liegt in der Vergangenheit. Stimmt das Datum?"** It is **not announced**: it is not in a live region and not in the field's `aria-describedby`. I only found it by reading the whole page (screenshot 02).
8. **Correcting the date.** I go back with Shift+Tab and type "2027". The value stays 2026-01-01. ArrowLeft twice and retyping also leave it at 2026-01-01, and Backspace changes nothing either. Only on a later attempt do 4 digits in the year segment work. The live region then says "Freitag, 1. Januar 2027" and the warning disappears. Overwriting a date in this field was confusing because I could not tell which part I was editing. I am not sure whether the app or the browser's date field causes this (see 5).
9. **Vertragsdauer.** The radio "Unbefristet" is already selected. Its name *and* its description are the same sentence, so I hear "Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird. … Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird." twice.
10. **Step 4 "Miete".** The field "Nettomiete pro Monat" says "Beispiel: 1500.00". I type `1'250` the Swiss way and it is accepted. "Akonto pro Monat (optional)" also has a clear description, and I type 140. The text "Monatlich total CHF 1'390.00" updates, but nobody tells me. I only hear it if I read on.
11. **Step 5 "Prüfen".** Focus is on "Schritt 5 von 5: Prüfen". The summary is a description list: Mieter Marco Bernasconi, Wohnung OG2 - Alpenblick, Vertragsbeginn Freitag, 1. Januar 2027, Vertragsende Unbefristet, Nettomiete CHF 1'250.00, Akonto CHF 140.00, Zusatzmiete CHF 0.00, Monatlich total CHF 1'390.00. The "Ändern" buttons have clear names ("Nettomiete ändern" and so on). Very good (screenshot 03).
12. **Save.** 9 Tabs, then Enter on "Mietvertrag speichern". The page changes to "Mietverträge - Dwello" (assertive) and focus goes to `body` again. A role=status says "Mietvertrag von Marco Bernasconi gespeichert", but it competes with the assertive page title and with **11 other role=status elements** (each "AKTIV"/"Beendet" badge in the table). A few seconds later it was gone and I could not find it again. The new row reads "01.01.2027 - heute … Status: AKTIV", which is confusing for a contract that has not started yet (screenshot 04).

## 4. Focus, labels, error messages: findings

**What works well**
- Every field has a visible, programmatically linked label and a help text in `aria-describedby`. Required fields have `aria-required`.
- The validation error moves focus to the invalid field, sets `aria-invalid` and adds the error to the description. The error clears as soon as the field is valid.
- Every step change moves focus to the H2 "Schritt n von 5: <Name>". The progressbar has `aria-valuenow`/`aria-label`, and the current step has `aria-current="step"`. Completed steps are buttons such as "Mieter (erledigt)".
- Back navigation keeps all entries.
- Disabled apartments are marked «nicht verfügbar» in their name.
- The date is echoed in words ("Freitag, 1. Januar 2027"), which is great for catching typos.
- The summary is semantic (`dl`) and the "Ändern" buttons are specific.
- `1'250` is accepted as an amount.

**Problems**
- The past-date warning is visual only. It is not linked to the field, has no live region, and focus stays on the field.
- After page loads (wizard start, after save) focus stays on `body`. Only the route announcer speaks.
- The save confirmation is short-lived and competes with the assertive title and with 11 status badges that are each `role=status`.
- In the list, a future contract is shown as "01.01.2027 - heute" with "AKTIV".
- The radio names repeat their description.
- The error text comes after the help text in the description and has no final period.
- "Monatlich total" is not announced when it changes.
- On steps 2 to 5, nothing says which tenant (step 2) or which tenant and apartment (step 3) I am working on. "Mieter (erledigt)" does not say *who*.

## 5. Error risks

- **Past start date can be saved without noticing.** A screen reader user never hears the warning, so a mistyped year (2026 instead of 2027) goes straight to the summary. The summary does read the date out, which is the last chance to catch it.
- **Date field segments.** I could not reliably overwrite an existing date by typing. My first attempts left the old value in place without any feedback. Typing in the year segment then passes through 0002, 0020, 0202 before 2027. Each step can briefly trigger the past-date warning and an announcement in the date echo.
- **Missed save confirmation.** The status toast disappears within seconds and is drowned out by the page-title announcement, so I may not know whether the contract was saved.
- **Wrong status in the list.** "AKTIV … heute" for a contract starting in 2027 can lead me to think the apartment is already rented out from today.
- **"Mietzins" column shows the total (CHF 1'390) and not the Nettomiete (1'250).** Listening to the list, I could think I entered the wrong amount.

## 6. Improvement suggestions

- **Major:** Announce the past-date warning. Add its ID to the date field's `aria-describedby` (and/or put it in a `role=status` region). Leave it non-blocking.
- **Major:** After saving, move focus to a persistent confirmation (for example a heading or message at the top of `main`, or the new row) instead of `body`. Keep the toast until it is dismissed, or for at least 10 s.
- **Major:** Remove `role=status` from the static status badges in the contracts table. They are not live updates, and they compete with real announcements.
- **Major:** Show contracts that start in the future as such in the list (for example "ab 01.01.2027", status "Zukünftig") instead of "01.01.2027 - heute / AKTIV".
- **Minor:** On page load of the wizard, move focus to the H1 or to "Schritt 1 von 5: Mieter", so I don't have to tab past 17 navigation stops.
- **Minor:** Investigate why overwriting an already filled `type=date` value by typing sometimes has no effect. Consider a text field with format hint "TT.MM.JJJJ" together with the existing date echo.
- **Minor:** Don't repeat the radio description in its accessible name (label only "Unbefristet", description via `aria-describedby`).
- **Minor:** Put the error text before the help text in `aria-describedby` and end it with a period ("Bitte wählen Sie einen Mieter aus.").
- **Minor:** Announce "Monatlich total" politely when it changes, or link it to the amount fields.
- **Minor:** Name the chosen values in the completed-step buttons ("Mieter: Marco Bernasconi (erledigt)").
- **Minor:** Clarify the "Mietzins" column in the list (for example "Total/Mt." or show Nettomiete and Akonto separately).

No Blocker found: the task can be completed by keyboard and screen reader alone.

## Screenshots

- `screens/sven-5b/01-tenant-error.png`: "Weiter" without a tenant: error at the field, focus on the combobox
- `screens/sven-5b/02-past-date-warning-silent.png`: past-date warning, visible but not announced
- `screens/sven-5b/03-summary.png`: step 5 summary
- `screens/sven-5b/04-confirmation-list.png`: list after saving (toast already gone; new row "01.01.2027 - heute / AKTIV")
