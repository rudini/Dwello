# Persona test: Sven (45), blind, screen reader and keyboard only, round 7b

Date: 10.10.2026
Viewport: desktop (1440 x 900), keyboard only (Tab, Shift+Tab, Enter, arrows, Escape), no mouse. Judged from the accessibility tree (ARIA snapshot, Chromium AX tree), the focused element with its accessible name and description, and the live regions (`[role=status]`, `[aria-live]`) sampled at 0 / 0.3 / 0.8 / 1.5 / 2.2 s after each action.

## 1. Task completed

**Yes**, all four parts.

1. "Neuer Mieter": empty submit puts focus on "Vorname" with the error tied to the field. I fixed the fields and saved "Sven Probe" (sven.probe@example.ch, "Per E-Mail"). The success message was announced and focus moved to the H1 "Sven Probe". **However:** the old errors stay on the fields after I correct them (see 5).
2. Categories: I created "Gartenpflege Test". The duplicate attempt shows the error on the Name field with focus there. The delete dialog works well: focus, Tab trap, Escape, inert background, focus after delete, and the announcement.
3. Future-rented apartment "Wohnung 2.02" (Musterhaus Zentrum, Elsa Brunner from 1.11.2026), found with "Künftige Mietverträge". The status is announced, but with three different words depending on the page. Record links name the record. The generic action links/buttons on detail pages do not.
4. I deleted "Sven Probe" again, but **nothing was announced** after the delete, and focus landed on the top of the page.

## 2. Effort

- About 9 screens: tenant list, new tenant, tenant detail, settings, categories, new category, contracts (filtered), contract detail, apartment detail, apartment list.
- About 30 Tab stops on each page with the side navigation. 16 nav links come before the content every time focus resets to the page top. The skip link "Zum Inhalt springen" helps: 2 keystrokes.
- Rough time for a real screen reader user: 20-25 min.

## 3. Thinking aloud

**Tenant (screens 01-03, 09-10)**
- On "Mieter" I hear the link "Mieter erfassen". The task said "Neuer Mieter", but the page is announced as "Neuer Mieter - Dwello", so I know I'm right.
- After the page change focus is on the document (body), and the title is announced. I tab: Vorname, Nachname, Korrespondenzkanal, E-Mail (optional), Telefon (optional), Sprache, then the group "Adresse" with Strasse und Hausnummer, PLZ (optional), Ort, Abbrechen, Mieter erfassen. Each field reads its hint ("Beispiel: Anna") as its description. Fields without "(optional)" are `aria-required`.
- I press "Mieter erfassen" with everything empty. **Focus jumps to "Vorname"**, which is announced as invalid with the description "Beispiel: Anna | Vorname ist erforderlich". Nachname, Strasse und Hausnummer ("Für Briefe ist eine Adresse erforderlich") and Ort ("Für Briefe ist ein Ort erforderlich") are also `aria-invalid` with their messages in `aria-describedby`. Good. There is no summary saying "4 fields have errors", so I only find the other three by tabbing on.
- I type "Sven" and tab to Nachname. **Vorname still says "ungültig … Vorname ist erforderlich"**, and so does Nachname after I type "Probe". The errors clear only on the next submit.
- I set Korrespondenzkanal to "Per E-Mail" with the down arrow. The labels change quietly: "E-Mail (optional)" becomes "E-Mail", and "Strasse und Hausnummer" becomes "Strasse und Hausnummer (optional)". Nothing is announced. The address fields are now announced as **"Strasse und Hausnummer (optional), ungültig, Für Briefe ist eine Adresse erforderlich"**, which contradicts itself (screen 02).
- I submit. The URL changes to the tenant page, focus is on **H1 "Sven Probe"**, the assertive route announcer says "Sven Probe - Dwello" (at about 0.3 s), and at about 0.8 s the status region gets **"Sven Probe gespeichert"**. Exactly what I want. The toast also contains a button "Meldung schliessen".
- Later, to clean up: on the tenant page I tab to "Löschen" (the button does not name the tenant; I rely on the H1 for context). Enter opens the dialog **"Sven Probe löschen?"** with focus on "Abbrechen". Tab cycles "Mieter löschen" / "Abbrechen". My first try landed on "Abbrechen", and focus returned to "Löschen". Good.
- I confirm "Mieter löschen". The page jumps to "Mieter", the route announcer says "Mieter - Dwello", **focus is on body, and the status region stays empty for the whole 2.2 s**. No toast is visible either (screen 10). I only know it worked because the heading now says "10 Mieter" and Sven Probe is not in the list. This differs from category delete and tenant save, which both confirm.

**Categories (screens 04-05)**
- Einstellungen → "Stammdaten" list → "Kategorien" (the side nav also has it directly). Focus on body, title announced.
- "Kategorie erfassen" → "Neue Kategorie". Name, Beschreibung (optional), checkbox "Umlagefähige Nebenkosten", Reihenfolge (optional), group "Übersetzungen", "Kategorie speichern". I save "Gartenpflege Test". I'm back on "Kategorien", **focus on H1**, and the status says "Kategorie «Gartenpflege Test» gespeichert". Good.
- Duplicate: same name, Enter in the field. **Focus stays on Name**, which is invalid with the description "Eine Kategorie mit dem Namen "Gartenpflege Test" existiert bereits." The lowercase "gartenpflege test" is also caught. Good. One oddity: after this server round trip the assertive announcer is filled again with "Neue Kategorie - Dwello", the same as after the empty tenant submit ("Neuer Mieter - Dwello"). With a real screen reader this may talk over or interrupt the field's error announcement.
- Delete: every row's button has a name like "Kategorie «Warmwasser» löschen". Blocked ones are `disabled` (out of the Tab order), and a paragraph explains why ("Kategorien, nach denen schon Rechnungen eingeordnet sind, lassen sich nicht löschen."). On "Kategorie «Gartenpflege Test» löschen" + Enter:
  - Dialog "Kategorie «Gartenpflege Test» löschen?" (`role=dialog`, `aria-modal`, labelled and described), focus on "Abbrechen".
  - The Tab and Shift+Tab trap works: only "Abbrechen" / "Löschen".
  - The background is `inert`. The Chromium AX tree contains only the dialog heading and the two buttons, so it cannot be reached with virtual cursor or Tab.
  - Escape closes it and focus returns to the trigger button.
  - Reopen, confirm "Löschen": focus goes to H1 "Kategorien", and the status says "Kategorie «Gartenpflege Test» gelöscht" (at about 0.8 s). The category is gone.

**Future-rented apartment (screens 06-08)**
- On "Mietverträge" I set "Vertragsstatus" to "Künftige Mietverträge" with the arrow keys (it does not auto-submit, good) and press "Suchen". The page reloads with `?status=future`. **Focus resets to body, the top of the page.** The announcer only says "Mietverträge - Dwello"; the result count "1 Mietvertrag" is not announced. I need "Zum Inhalt springen" plus 7 Tabs to reach the result.
- Result row: link "Elsa Brunner", text "Wohnung 2.02 · Musterhaus Zentrum Künftig ab 1.11.2026, unbefristet", link "Mietvertrag von Elsa Brunner bearbeiten". The edit link is properly named. The main link only says the person's name, not "Mietvertrag von Elsa Brunner".
- Contract detail: H1 "Mietvertrag von Elsa Brunner", status "Künftig". The actions "Bearbeiten", "Beenden", "Löschen" carry no record name. Link "Wohnung 2.02" (building not in the name, but the next definition is the building).
- Apartment detail "Wohnung 2.02": Mietstatus **"Wiedervermietet ab 1.11.2026"** with an explanation, heading "Künftiger Mieter" ("Ab 1.11.2026 vermietet an Elsa Brunner. Bis dahin läuft kein Mietvertrag."). The contract list says "Mietvertrag von Elsa Brunner … Künftig". The page reads well top to bottom.
- Apartment list: "Wohnung 2.02 … Wiedervermietet ab 1.11.2026"; the legend "Was bedeutet der Mietstatus?" explains it. Link names are "Wohnung 2.02" etc., without the building, so in a links list (NVDA Insert+F7) I cannot tell buildings apart. This list has **no result-count heading or region**, unlike "Mieter" and "Mietverträge".
- Tenant list for the same person: "Elsa Brunner – Mietvertrag ab 1.11.2026 – **Aktiv**".
- So one situation is announced as "Künftig" (contract), "Wiedervermietet" (apartment) and "Aktiv" (tenant). "Aktiv" is plainly wrong for someone who does not live there yet. "Wiedervermietet" is explained, but the apartment was never let before in this data.

## 4. Terms I did not understand

- **"Wiedervermietet"**: for an apartment that is empty now and rented from 1.11.2026. "Wieder" suggests it was let before. The legend explains it, but I would have said "Vermietet ab …" or "Künftig vermietet".
- **"Aktiv"** next to "Mietvertrag ab 1.11.2026" in the tenant list: active how, if the contract hasn't started?
- "Korrespondenzkanal" is understandable thanks to its description.

## 5. Error risks

- **Stale field errors** (tenant form): after correcting a field it is still announced as "ungültig" with "… ist erforderlich". After switching to "Per E-Mail" the address fields read "(optional), ungültig, Für Briefe ist eine Adresse erforderlich". A screen reader user re-checking the form believes it is still wrong, and may fill in an address they don't have or give up.
- **Silent tenant delete:** no confirmation, focus at page top. I might delete again, or think it failed and look for another way.
- **Focus to page top after filtering** (contracts, and likely all list filters): the result count is not announced, so I don't know whether the filter matched anything without hunting for it.
- **Ambiguous link names in link lists:** "Wohnung 2.02" without the building; "Bearbeiten" / "Löschen" / "Beenden" on detail pages without the record. With two buildings having the same apartment number, I could open or delete the wrong one from a links list.
- **Three status words** for one situation: I may misjudge whether a tenant is actually living there (for example for reminders or statements).
- **Possible double announcement** after a server-validated form: the assertive route announcer is refilled with the page title while focus moves to the invalid field.

## 6. Suggestions

- **Major**: After tenant delete, show and announce a status message like the other deletes ("Mieter «Sven Probe» gelöscht"), and move focus to the H1 "Mieter".
- **Major**: In the tenant form, clear `aria-invalid` and the error text once the field is valid: on input, or at the latest on blur. Re-evaluate the "Für Briefe ist … erforderlich" errors when "Korrespondenzkanal" changes, so that an "(optional)" field is never "ungültig".
- **Major**: After submitting a list filter ("Suchen") on Mietverträge (and Mieter, Wohnungen, Rechnungen …), move focus to the result heading (for example "1 Mietvertrag") or announce the count in the status region, instead of resetting focus to the page top.
- **Major**: Use one consistent wording for a future tenancy. Tenant list: not "Aktiv" but for example "Künftig" / "Mietbeginn 1.11.2026". Apartment status: "Vermietet ab 1.11.2026" (or "Künftig vermietet") instead of "Wiedervermietet".
- **Minor**: On empty submit, also announce a short summary in the status region ("4 Felder sind unvollständig"), so the user knows how many errors to look for beyond the focused one.
- **Minor**: Give detail-page actions record context, for example `aria-label`/visually hidden text "Mieter Sven Probe löschen", "Mietvertrag von Elsa Brunner bearbeiten/beenden", "Wohnung 2.02 bearbeiten". The list pages already do this ("Kategorie «Heizung» löschen").
- **Minor**: Apartment links in lists: include the building ("Wohnung 2.02, Musterhaus Zentrum"), as the page title already does. Name the main contract-list link "Mietvertrag von Elsa Brunner" as on the apartment page.
- **Minor**: Give the apartment list the same result-count heading or region as the Mieter and Mietverträge lists ("13 Wohnungen").
- **Minor**: Avoid refilling the assertive route announcer with the same page title after a form action that stays on the page (empty tenant submit, duplicate category). It can cut off the focused field's error announcement.
- **Minor**: Detail-page navigation (for example contract → apartment) leaves focus on body, while saves put it on the H1. Moving focus to the H1 on all page changes would be consistent.

What works well and should stay: focus to the first invalid field with errors in `aria-describedby`; the save/delete toasts in a polite status region after the page change; the category delete dialog (labelled, focus on "Abbrechen", Tab trap, Escape returns focus, background `inert`); named row buttons ("Kategorie «…» löschen", "Mietvertrag von … bearbeiten"); the skip link.

Screenshots (`screens/sven-7b/`):
- 01-tenant-empty-submit.png: errors after the empty submit
- 02-tenant-stale-errors.png: corrected and "(optional)" fields still marked as errors
- 03-tenant-saved.png: tenant page after save, with the toast
- 04-category-duplicate.png: duplicate-name error at the Name field
- 05-category-delete-dialog.png: delete dialog with focus on "Abbrechen"
- 06-contracts-future-filter.png: "Künftige Mietverträge" result
- 07-apartment-future.png: "Wiedervermietet ab 1.11.2026" next to "Künftig"
- 08-apartments-list.png: apartment list without a result count, links without the building
- 09-tenant-delete-dialog.png: tenant delete dialog
- 10-after-tenant-delete.png: no confirmation after the tenant delete
