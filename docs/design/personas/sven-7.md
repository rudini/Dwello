# Persona test: Sven (45), blind, screen reader + keyboard only, round 7

Date: 10.10.2026
Viewport: desktop 1440x900, keyboard only (Tab, Shift+Tab, Enter, Space, Escape). Decisions made from the accessibility tree (ARIA snapshot), the focused element and live regions; screenshots are only for this report.

## 1. Task completed

**Yes, with one adaptation.**

1. Tenant e-mail: Übersicht → "Mieter" → "Hans Müller" → "Bearbeiten" → E-Mail set to `sven.test@example.ch` → "Änderungen speichern". The detail page showed the new address and a `role="status"` toast "Hans Müller gespeichert". Afterwards I put the original address (`hans.mueller@example.ch`) back so other testers keep the demo data.
2. Category: "Gartenpflege" **already exists** (1 Rechnung, cannot be deleted). Saving it again gave the alert "Kategorie wurde nicht gespeichert – Eine Kategorie mit dem Namen "Gartenpflege" existiert bereits." So I created "Gartenpflege Sven" (umlagefähig) and deleted it through the confirm dialog. Both steps showed a toast.
3. Gebäude → "Musterhaus Zentrum" → "Wohnung 2.02": reached. The headings are in a logical order and the status is given as text.
4. Form errors triggered on purpose: empty Vorname and E-Mail (tenant), empty Name (category), duplicate name (category).

## 2. Effort

- Screens: 10 (Übersicht, Mieter, Mieter-Detail, Mieter bearbeiten, Einstellungen, Kategorien, Neue Kategorie, Gebäude, Gebäude-Detail, Wohnung).
- Keystrokes: the main cost is Tab. After each page change focus goes back to `<body>`, so every page starts at the top. I need Tab plus Enter on "Zum Inhalt springen" and then 1 to 6 Tabs. Without the skip link I would need 16 Tabs through the sidebar each time. Roughly 15 to 25 keystrokes per task.
- Time: about 4 to 6 minutes per task for a real screen reader user. Most of the extra time came from the lost focus after saving.

## 3. Thinking aloud

**Overview.** The page starts with "Zum Inhalt springen", which is good. The landmarks are banner, "Hauptnavigation", main and contentinfo. The sidebar has `aria-current="page"` on "Übersicht". The regions "Als Nächstes zu tun", "Fristen", "Häufige Arbeiten" and "Gebäude auf einen Blick" each have a heading. I can find my way here.

**Task 1.** I Tab 7 times to "Mieter" and press Enter. SvelteKit's announcer reads "Mieter - Dwello", so I know I arrived. Focus sits on `<body>`, so I start with Tab, then the skip link. The tenant list is a region "9 Mieter" with an h2. Each tenant link is the person's name, so the links name the record. Under "Hans Müller" I find "Bearbeiten", "Mietvertrag erfassen" and "Löschen" (screen 01).

I hesitate at one point: in "Aktuelle Miete" the link is called "Wohnung 1.01" and goes to the apartment. In "Mietverträge" there is a second link, also called "Wohnung 1.01", that goes to the contract. In my links list I hear "Wohnung 1.01" twice, with two different targets.

The edit form is clean. Every field has a label and an example through `aria-describedby`, and required fields have `aria-required="true"`. The address fields are a group "Adresse". I select E-Mail, press Ctrl+A and type the new address, Tab to "Änderungen speichern" and press Enter. The page moves to the detail view, the announcer reads "Hans Müller - Dwello" (assertive), and the new address is there. A toast "Hans Müller gespeichert" appears as `role="status"`. It is inserted into the DOM together with its text, and the assertive page-title announcement comes in the same moment. With NVDA or VoiceOver I would likely hear only the page title and miss the confirmation. The toast is also gone after about 3 to 5 seconds (screen 03).

**Task 4, tenant.** I cleared Vorname and E-Mail and submitted.
- With Enter inside the E-Mail field, focus stayed on E-Mail, which is now `aria-invalid="true"` and described by "Für die Korrespondenz per E-Mail ist eine E-Mail-Adresse erforderlich". Good. But nobody tells me that Vorname above is also wrong.
- With Enter on "Änderungen speichern", the page did a server round trip and **focus fell back to `<body>`**. No alert and no live region. To my ears nothing happened. I have to Tab through the whole sidebar again to find out that the form has errors (screen 02).
- Once I find the fields, the errors are tied correctly: `aria-describedby="firstName-help firstName-error"` gives "Vorname ist erforderlich". That part is good.

**Task 2.** I reached the page through Einstellungen → "Stammdaten" → "Kategorien". The filter is a group "Kategorien anzeigen" of toggle buttons with `aria-pressed`, which is good. The delete buttons are named "Kategorie «Warmwasser» löschen", which is excellent. Delete buttons for categories that are in use are disabled and skipped by Tab. The paragraph above the list explains why.

The descriptions of the categories are **English** ("Costs for heating the building", "Pest control services"), so my German voice reads them with German pronunciation.

"Kategorie erfassen" leads to a form with Name, Beschreibung, the checkbox "Umlagefähige Nebenkosten" (already ticked, and its help text is linked), Reihenfolge and the group "Übersetzungen".
- Empty name with Enter in the field: "Name ist erforderlich" is tied to the field and focus stays there. With Enter on "Kategorie speichern", focus again goes to `<body>` and nothing is announced (screen 04).
- "Gartenpflege": a `role="alert"` box "Kategorie wurde nicht gespeichert …" is announced, which is good. But focus is on `<body>` and the Name field is **not** marked invalid and not linked to the message (screen 05).
- "Gartenpflege Sven" saved: back to the list, with a toast "Kategorie «Gartenpflege Sven» gespeichert". It has the same toast issue as in task 1.

The delete dialog is good overall (screen 06):
- It has `role="dialog"`, `aria-modal="true"`, a name from its heading "Kategorie «Gartenpflege Sven» löschen?" and a description from "Die Kategorie verschwindet aus der Auswahl beim Erfassen von Rechnungen."
- Focus starts on "Abbrechen", which is the safe choice.
- Tab and Shift+Tab stay inside the dialog (Abbrechen ↔ Löschen).
- Escape closes it and returns focus to "Kategorie «Gartenpflege Sven» löschen".

After I confirmed with "Löschen", the list reloaded with a toast "Kategorie «Gartenpflege Sven» gelöscht", but **focus went to `<body>`** instead of a sensible place in the list. Two smaller points: the background is not `inert` (it relies on `aria-modal` only), and the dialog heading is an h2 inside the page.

**Task 3.** The building list has h1 "Gebäude" and one h2 per building, and the h2 is the link. Each card has "6 Wohnungen / 4 vermietet / 1 leer". The numbers do not add up: the sixth apartment, the one marked "Wiedervermietet", is not mentioned. Each card also has a link "Route planen (öffnet in neuem Tab)". It is good that the link warns about the new tab, but all three links have the same name and do not say which building they are for (screen 07).

The building detail has these headings: h1 "Musterhaus Zentrum" → h2 "Angaben zum Gebäude" → region h2 "Wohnungen" → h3 "1. OG", "2. OG", "3. OG" → h2 "Was bedeutet der Mietstatus?". The order is logical. The map is an image with the alt text "Karte: Bahnhofstrasse 42, 8001 Zürich". The status is **text** ("Vermietet", "Wiedervermietet", "Leer") with an icon, not colour only, which is good. The summary line "6, davon 4 vermietet und 1 leer" again skips the Wiedervermietet apartment (screen 08).

On "Wohnung 2.02" (screen 09), several things contradict each other:
- Mietstatus says "Vermietet ab 1.11.2026", while the building page called the same apartment "Wiedervermietet". The explanation below it is the one for Wiedervermietet: "Ein künftiger Mietvertrag ist abgeschlossen."
- "Aktueller Mieter" says "Diese Wohnung ist derzeit nicht vermietet."
- The contract shows "1.11.2026 - heute". Today is 10.10.2026, so "heute" as the end of a contract that starts in the future makes no sense.
- The contract link is named "Ruth Meier", which sounds like a link to the tenant, but it opens the contract.
- The breadcrumb starts with "Wohnungen" although I came from "Gebäude". That is acceptable.
- The page title "Wohnung 2.02 - Dwello" does not say which building the apartment is in.

## 4. Terms I did not understand

- "Wiedervermietet" vs. "Vermietet ab 1.11.2026" vs. "Künftig": these are three words for the same state, depending on the page.
- "Umlagefähig" is clear thanks to the help text (Art. 257a–257b OR).
- "Reihenfolge (optional)": the help text explains it.
- The category descriptions are in English. I understand them, but they are not German, and the screen reader voice reads them wrongly.

## 5. Error risks

- **Lost after a failed save:** after a server-side validation error, focus goes to `<body>` and nothing is announced. A blind user believes the save worked or that nothing happened, and may leave the page with unsaved data.
- **Confirmation not heard:** the success toast is inserted already filled and appears together with the assertive route announcement, then disappears after a few seconds. The user cannot be sure the change was saved and may submit again.
- **Duplicate name not tied to the field:** the alert is heard once, but on the Name field there is no `aria-invalid` and no description, so when returning to the field the reason is gone.
- **Contradicting rental status** (Vermietet ab / derzeit nicht vermietet / Wiedervermietet; "– heute" for a future contract): risk of renting an apartment twice or misjudging vacancies. The building summary also leaves out the re-let apartment.
- **Ambiguous link texts:** "Wohnung 1.01" twice with different targets, the contract link named after the tenant, and three identical "Route planen" links. This leads to opening the wrong record.

## 6. Suggestions

- **Major:** After a form submit that returns errors, move focus to an error summary (`role="alert"`, with links to the fields) or to the first invalid field. Use the same behaviour for Enter in a field and for the save button. It affects all forms (Mieter bearbeiten and Neue Kategorie were tested).
- **Major:** Make save and delete confirmations reliably audible. Keep one persistent `role="status"` / `aria-live="polite"` container in the layout and put only the text into it, after the route announcement, or put the message into the h1 or announcer text of the target page. Keep it visible for at least 5 to 10 seconds, or until it is dismissed.
- **Major:** Use one consistent status for apartment 2.02. Choose "Wiedervermietet (ab 1.11.2026)" everywhere. On the apartment page, "Aktueller Mieter" should point to the future contract. Show a future contract as "ab 1.11.2026, unbefristet" instead of "1.11.2026 - heute".
- **Minor:** On a server error such as a duplicate name, mark the field `aria-invalid="true"`, link the message with `aria-describedby`, and move focus to the field.
- **Minor:** After a delete is confirmed, move focus to the list heading or the next item, not to `<body>`.
- **Minor:** Name the links after their target. In the tenant's "Mietverträge" use "Mietvertrag Wohnung 1.01". On the apartment page use "Mietvertrag Ruth Meier". In the building list use "Route planen zu Musterhaus Zentrum (öffnet in neuem Tab)", for example with a visually hidden part.
- **Minor:** Include Wiedervermietet and Gesperrt in the building summaries ("6 Wohnungen, 4 vermietet, 1 wiedervermietet, 1 leer"), in the list and on the detail page.
- **Minor:** Translate the category descriptions to German, or mark English text with `lang="en"`.
- **Minor:** Add the building to the apartment page title ("Wohnung 2.02 – Musterhaus Zentrum - Dwello") so the screen reader announcement after navigation is unique.
- **Minor:** Make the dialog background `inert` in addition to `aria-modal`, so browse mode cannot wander out of the dialog.

Screens: `screens/sven-7/01-tenant-detail.png` … `09-apartment-detail.png`.
