# Persona test: Sven (45), blind, screen reader and keyboard only, final round

Date: 10.10.2026
Viewport: desktop (1440 x 900), keyboard only (Tab, Shift+Tab, Enter, arrow keys), judged by what a screen reader announces (accessibility tree, focused element with name and description, live regions sampled for about 2 s after each action).

## 1. Task completed

**Yes.** Starting from the "Übersicht", I went through the "Neuer Mietvertrag" wizard without a mouse. I created a new tenant inside the wizard ("Neuen Mieter erfassen" -> "Jonas Brunner"), chose the free apartment "Wohnung 3.02 - Musterhaus Zentrum", start date 1.11.2026, open-ended ("Unbefristet"), "Nettomiete" CHF 1'450.00 and "Akonto" CHF 190.50, then saved. I heard "Mietvertrag von Jonas Brunner gespeichert", and the contract is now first in the list, marked "Künftig ab 1.11.2026, unbefristet".

On purpose I also submitted every step with missing input, entered the year 12025, entered an end date before the start date, typed Swiss amount formats, used "Ändern" on the review step, and reloaded the page halfway through.

## 2. Effort

- Screens: Übersicht -> wizard step 1 -> "Neuer Mieter" -> wizard steps 1 to 5 -> "Mietverträge" list (8 views).
- Keystrokes on the happy path: about 20 Tabs to reach "Mietvertrag erfassen" on the dashboard (there is a skip link, but the quick actions sit after it). After that, each wizard step takes 1 to 5 Tabs. The new-tenant form takes about 10 Tabs plus typing. In total roughly 70 keystrokes plus text entry.
- Time for a practised screen-reader user: about 6 to 8 minutes for the whole task, not counting my deliberate error tests.

## 3. Thinking aloud

1. **Dashboard.** "Zum Inhalt springen" is the first Tab stop. Good. Under "Häufige Arbeiten" I find "Mietvertrag erfassen" and press Enter. ([01](screens/sven-final/01-wizard-step1.png))
2. **Wizard opens.** The page title "Neuer Mietvertrag - Dwello" is announced (assertive), but focus stays on `body`, so my next Tab starts again at the skip link and the 16 navigation links. With headings navigation (H) I find "Schritt 1 von 5: Mieter" quickly. The step list ("1 Mieter, 2 Wohnung ...") has no `aria-current`, but the "Schritt 1 von 5" progress bar and the heading tell me where I am. That is enough.
3. **Step 1, empty "Weiter".** Focus jumps to the "Mieter" select, which is announced as invalid with "Bitte wählen Sie einen Mieter aus" as its description. Exactly right. ([02](screens/sven-final/02-step1-error.png))
4. **Which tenant has no running contract?** The select reads only names ("Hans Müller", "Maria Rossi" ...). Nothing tells me who already rents an apartment. In the "Mieter" list I would hear "Aktiv" or "Keine laufende Miete", but not here. I chose a tenant who already has a running lease (Hans Müller) as a test and went all the way to "Prüfen": no hint or warning. So I create a new tenant instead.
5. **"Neuen Mieter erfassen".** This opens the "Neuer Mieter" form. Every field has a label plus an example as its description ("Beispiel: Anna"). The help text on "Korrespondenzkanal" explains that "Per Brief" needs an address. The breadcrumb says "Mieter > Neuer Mieter", so I briefly wondered whether I had left the contract, but the intro text says "Danach geht es mit dem Mietvertrag weiter." ([03](screens/sven-final/03-new-tenant-form.png))
6. **Incomplete tenant form** (first name only). Focus goes to "Nachname", announced as invalid with "Nachname ist erforderlich". "Strasse und Hausnummer" and "Ort" are flagged too ("Für Briefe ist eine Adresse erforderlich"). Clear. I could not tell in advance that "Strasse" is required, because only "PLZ (optional)" carries the optional marker. That reads oddly, since a letter needs a postcode more than anything.
7. **Back in the wizard.** I hear only "Neuer Mietvertrag - Dwello", and focus is on `body` again. The confirmation "Mieter erfasst – Jonas Brunner ist gespeichert und für diesen Mietvertrag gewählt." is on the page, but it is not in a live region, so I only find it by reading on. Jonas Brunner is preselected, which is good. ([04](screens/sven-final/04-back-in-wizard.png))
8. **Step 2 "Wohnung".** After "Weiter", focus lands on the heading "Schritt 2 von 5: Wohnung". Good. I also hear "Entwurf gespeichert, 14:42". The help text explains that free apartments come first and occupied ones are marked "(nicht verfügbar)" and cannot be chosen. Excellent: I can arrow through the list without guessing. Empty "Weiter" gives "Bitte wählen Sie eine Wohnung aus", with focus on the select. ([05](screens/sven-final/05-step2-error.png)) While I was testing, another user took "Wohnung 2.02", so the list order changed between two runs. I only noticed because I hear every option as I arrow through.
9. **Step 3 "Vertragsdauer".** Empty "Weiter": "Vertragsbeginn ist erforderlich", focus on the date field. Good. The native date field takes 3 Tab stops (day, month, year segments) plus the picker button. That is tedious but familiar.
10. **Year 12025.** While I type, the polite live region reads "Mittwoch, 1. Januar 12025". That echo is nice. Then a status box says: **"Der Vertragsbeginn Mittwoch, 1. Januar 12025 liegt in der Vergangenheit. Stimmt das Datum?"** That is wrong: 12025 is not in the past, and it confused me. Only after "Weiter" does the correct error appear: "Bitte prüfen Sie das Datum: Das Jahr ist nicht möglich." By then the "Vergangenheit" warning is still showing, so I have two contradictory messages. ([06](screens/sven-final/06-year-12025.png))
11. **"Befristet".** Arrow down in the "Vertragsdauer" radio group. A "Vertragsende" field appears right after it in Tab order. Empty: "Vertragsende ist erforderlich bei befristetem Vertrag". End date before start: "Vertragsende muss nach Vertragsbeginn liegen". Both are clear. Each radio button's name already contains its description, and the description is read a second time, so I hear "Der Mietvertrag hat kein Vertragsende ..." twice.
12. **Step 4 "Miete".** The labels have good explanations ("Monatliche Grundmiete ohne Nebenkosten. Beispiel: 1500.00", plus "Akonto" explained as a monthly advance for utility costs). Empty: "Nettomiete ist erforderlich". I typed **"1'450.–"**, the way I write it on every rental contract. The line "Monatlich total CHF 1'640.50" happily added it up, but "Weiter" rejected it with "Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450." The field now held "1450.–", with the apostrophe silently removed. The comma in "190,50" was accepted. The "Monatlich total" line and the note "Kein Akonto ..." are not live regions and not linked to the fields, so I never hear the total while typing. ([07](screens/sven-final/07-rent-swiss-format.png))
13. **Step 5 "Prüfen".** Focus on the heading. A definition list follows: Mieter, Wohnung, Vertragsbeginn ("Sonntag, 1. November 2026"), Vertragsende ("Unbefristet"), Nettomiete, Akonto, Zusatzmiete, Monatlich total. Each item has a clearly named "Mieter ändern" / "Akonto ändern" button. Very good. ([08](screens/sven-final/08-review.png))
14. **"Akonto ändern".** It takes me to step 4, but focus lands on the heading "Schritt 4 von 5: Miete", not on the Akonto field. I typed right away and my input went nowhere. "Weiter" then brings me straight back to "Prüfen", which is good, but with the old value. If I had not checked, I would not have noticed.
15. **Reload in the middle.** I hear only the page title. "Entwurf wiederhergestellt – Ihre Angaben, zuletzt am 10.10.2026 um 14:45 bearbeitet, sind wieder da." is shown but not announced, and the wizard starts again at step 1 even though I had reached step 5. My data was there, though.
16. **"Mietvertrag speichern".** I am taken to "Mietverträge", focus is on the H1 "Mietverträge", and the status reads "Mietvertrag von Jonas Brunner gespeichert". The new contract is first in the list with "Künftig ab 1.11.2026, unbefristet". Done. Visually the toast covers part of the third row. ([09](screens/sven-final/09-saved-toast.png))

## 4. Terms I did not understand

- **"Entwurf gespeichert"**: I hear it after every step. Did I just save a contract draft somewhere in the system, or is it only stored in my browser? It is not clear whether another device would see it.
- **"Korrespondenzkanal"**: an office word, but the help text explains it well.
- **"Zusatzmiete"**: clear from its help text ("Garage, Parkplatz oder Keller").
- **"Akonto"**: clear from its help text.

## 5. Error risks

- **Year 12025:** the hint "liegt in der Vergangenheit" is wrong, and after submitting it contradicts the error message. A user could "correct" the date in the wrong direction.
- **Swiss amount format "1'450.–":** the total accepts it, the validation rejects it, and the value is changed silently. The error message names "1'450" as valid, which makes it more confusing.
- **"Ändern" on the review step** puts focus on the heading. Anyone who starts typing straight away loses the input and returns to "Prüfen" with the old value.
- **Tenant selection** gives no hint that a tenant already has a running lease. A wrong person, for example a same-named or existing tenant, can be chosen without any warning.
- **Concurrent use:** the apartment list order changes when someone else rents an apartment. Fixed arrow-key counts or memorised positions lead to the wrong apartment. The review step does show the apartment name, so this is caught there.
- **Confirmations not announced:** "Mieter erfasst" and "Entwurf wiederhergestellt" are only visible. A blind user does not know that the tenant was preselected, or that old data came back.

## 6. Suggestions

- **Major:** Fix the past-date check for impossible years. "12025" must not trigger "liegt in der Vergangenheit". The check seems to compare text, not dates. Show "Das Jahr ist nicht möglich" right away instead of the past-date warning, and hide the warning once the error appears.
- **Major:** "Ändern" on "Prüfen" should put focus on the field it names ("Akonto ändern" -> the "Akonto pro Monat" input), not on the step heading.
- **Major:** Put "Mieter erfasst – … ist gespeichert und für diesen Mietvertrag gewählt." and "Entwurf wiederhergestellt …" in a `role="status"` region, or move focus to them, so they are announced after the page load.
- **Minor:** Accept "1'450.–" and "1450.-" as amounts (the total already does), or at least make the total and the validation agree. Do not strip the apostrophe silently.
- **Minor:** In the "Mieter" select, mark tenants with a running lease (for example "Hans Müller (Wohnung 1.01, laufend)"), or warn on "Prüfen", as the apartment select already does with "(nicht verfügbar)".
- **Minor:** After reload with a restored draft, return to the last step reached, or say "Sie waren bei Schritt 5".
- **Minor:** On client-side navigation into the wizard and back from "Neuer Mieter", move focus to the H1 or step heading (as already done after saving) instead of leaving it on `body`.
- **Minor:** Mark the current step in the step list with `aria-current="step"`.
- **Minor:** Do not repeat the radio descriptions. The name already contains "Der Mietvertrag hat kein Vertragsende …", and the description reads it again.
- **Minor:** Announce "Entwurf gespeichert, hh:mm" less often (for example only on the first save or after a change), because it follows every "Weiter" and competes with the heading.
- **Minor:** Tenant form: mark "Strasse und Hausnummer" and "Ort" as required for "Per Brief" in their labels or descriptions. "PLZ (optional)" next to a required "Ort" is odd for a letter address.
- **Minor (visual):** The step label "Vertragsdauer" breaks inside the word ("Vertragsda / uer"). The success toast covers amounts in the list.
