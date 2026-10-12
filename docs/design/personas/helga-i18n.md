# Persona run: Helga (i18n, Deutsch)

Helga, 68, inherited an apartment building, little computer experience, reads with a large font (desktop viewport, browser zoom 1.5, about 960 CSS px wide). Language: Deutsch (the default). Task: create a first tenant and a rental contract for a free apartment, switch the language once and back, then find where to change the language again.

Date: 2026-10-12. App: http://localhost:3300 with demo data.

## 1. Task completed

**Yes.** Tenant "Rosmarie Brunner-Helga" (Lindenweg 7, 8400 Winterthur) was created, and a rental contract for "Wohnung 3.02 - Musterhaus Zentrum" from 01.11.2026, open-ended, CHF 1'350.00 net rent plus CHF 160.00 Akonto, was saved. The contract list shows it as "Künftig". The language was switched to Français and back to Deutsch without trouble, and the language control is always at the top right of the header.

## 2. Effort

- Screens: dashboard, language menu, "Neuer Mieter" form (once with errors), tenant detail page, five contract wizard steps, contract list, plus a look at the side menu, the user menu and "Einstellungen". About 12 screens.
- Clicks: about 25 in total, plus typing about 10 fields. Language switch and return: 4 clicks.
- Time: about 6 to 8 minutes for a careful, slow user.

## 3. Thinking aloud

1. Dashboard: "Übersicht, Was jetzt zu tun ist." At the top right I see a little symbol with "Deutsch". Good, that is my language. Under "Häufige Arbeiten" there is "Mieter erfassen", exactly what I want. The red-bordered first card about "Nebenkostenabrechnungen erstellen" for 2025 worries me a little, but it is not my task today.
2. I click "Deutsch". A small list opens: "Deutsch ✓, Français, Italiano, English". Each language is written in its own words, so I would find my way back even if everything else were French. ([02-langmenu](screens/helga-i18n/02-langmenu.png))
3. I pick "Français". The page turns French ("Vue d'ensemble", "À faire ensuite"), the button now reads "Français". I click it again and choose "Deutsch": everything is German again, same page. That was easy.
4. "Mieter erfassen": the form "Neuer Mieter" has labels above the fields and an example under each label ("Beispiel: Anna"). I like that. "Korrespondenzkanal" is a word I would not use, but the sentence under it explains it ("Wie der Mieter Post erhält ...").
5. A second "Sprache" field appears in the tenant form. For a moment I wonder whether this changes my screen language. The help text says it is the language of the utility cost statement for the tenant, so I leave it on Deutsch.
6. I type only the name and press "Mieter erfassen". Three red messages appear under the address: "Für Briefe ist eine Adresse erforderlich", "... eine PLZ ...", "... ein Ort ...". The cursor jumps to the street field, good. But which address? The tenant's current home or the apartment she will move into? I am not sure. I enter her current address. ([05-tenant-error](screens/helga-i18n/05-tenant-error.png))
7. Saved: "Rosmarie Brunner-Helga gespeichert". The page offers "Mietvertrag erfassen" as the big blue button, exactly my next step. The name breaks into "Brunner-" / "Helga" over two lines because the buttons take the right half. The red "Löschen" sits right next to the main button, which makes me a little nervous. ([06-tenant-saved](screens/helga-i18n/06-tenant-saved.png))
8. Contract wizard "Neuer Mietvertrag", "Schritt 1 von 5: Mieter". My tenant is already selected. "Weiter".
9. Step 2 "Wohnung": the list says free apartments come first and rented ones are marked "nicht verfügbar". I pick "Wohnung 3.02 - Musterhaus Zentrum, 2 Zimmer, 55 m²". With my large font the step bar shows only the numbers 1 to 5 and ticks, without names.
10. Step 3 "Vertragsdauer": after "Weiter" the page scrolls so that the line "Schritt 3 von 5: Vertragsdauer" is half hidden under the white top bar. I can still read the box heading "Vertragsdauer", so I continue. ([10-step3-viewport](screens/helga-i18n/10-step3-viewport.png)) "Vertragsbeginn" with "Format TT.MM.JJJJ" — I type "1.11.2026" and it is accepted. "Unbefristet" is already chosen and explained ("läuft, bis er gekündigt wird").
11. Step 4 "Miete": "Nettomiete pro Monat" is clear. "Akonto" I did not know, but the help text says it is the monthly advance for heating, water and so on. I enter 160. The total "Monatlich total" updates.
12. Step 5 "Prüfen": a clear table with "Ändern" on every row; it says "Sonntag, 1. November 2026", total CHF 1'510.00. Button "Mietvertrag speichern". I feel safe here. ([12-review](screens/helga-i18n/12-review.png))
13. Saved: I land on the list "Mietverträge" with "Mietvertrag von Rosmarie Brunner-Helga gespeichert". My contract is first, marked "Künftig ab 01.11.2026". The green message box covers part of the "Vertragsstatus" filter for a few seconds. ([13-contract-saved](screens/helga-i18n/13-contract-saved.png))
14. Where would I change the language next time? First I looked under my name ("Vera Verwalter"), then "Einstellungen": no language there. Then I remembered: the "Deutsch" button with the symbol at the top right, on every page. That is where it is.

## 4. Language

- No text in another language appeared while Deutsch was selected. After switching to Français and back, everything was German again; nothing stuck in French.
- Language names in the menu are in their own language ("Français", "Italiano", "English"), which makes it easy to come back.
- Words I did not know or hesitated over: "Korrespondenzkanal", "Akonto", "Nettomiete", "Zusatzmiete", "Verteilschlüssel" (in Einstellungen). All had visible help text that explained them, so none blocked me. "Korrespondenzkanal" still reads like office language; "Wie erhält der Mieter Post?" would be plainer.
- Two "Sprache" fields with different meanings: the header control (screen language) and the tenant form field (language of the tenant's statement). The help text clears it up, but the label alone is ambiguous. "Sprache der Abrechnung" would remove the doubt.
- The user menu label "Vera Verwalter Benutzermenü" (screen reader) is fine.
- Nothing read oddly in the German texts I saw.

## 5. Layout at my viewport (desktop, zoom 1.5)

- No horizontal scrolling (scrollWidth equals the window width, 960 px) on dashboard, tenant form and contract wizard.
- Language control: visible at the top right on every page, with a translation symbol and the current language as text. Clear and large enough.
- Contract wizard: after "Weiter" the step label "Schritt N von 5: …" lands under the sticky header and is half cut off. Step names under the numbers are not shown at this width, so only the card heading tells me where I am.
- Tenant detail: the long name wraps after the hyphen in a narrow column while the three action buttons sit beside it.
- Success message (toast) overlays the filter fields on the contract list for a few seconds.

## 6. Error risks

- Address in the tenant form: it is not said whether the tenant's current address or the rented apartment's address is meant. A beginner may type the apartment address, or the wrong one, and letters would go there.
- The header language and the tenant's "Sprache" could be confused; a user might change the tenant's language believing it changes the screen.
- "Löschen" on the tenant page sits right next to "Mietvertrag erfassen". I did not test it, so I assume (not verified) that it asks for confirmation.
- Concurrency: free apartments may be taken by someone else between step 2 and saving; I did not hit this.

## 7. Suggestions

- **Minor:** On "Weiter" in the contract wizard, scroll so that "Schritt N von 5: …" is not hidden under the sticky header (scroll-margin on the step heading or progress), and keep the step names visible at zoom 1.5.
- **Minor:** Add one line of help to the tenant address ("Adresse, an die Briefe an den Mieter gehen, z. B. die neue Wohnung") so users know which address is meant.
- **Minor:** Rename the tenant field "Sprache" to something like "Sprache der Abrechnung" to separate it from the screen language.
- **Minor:** In "Einstellungen", mention where the screen language is changed (the header control), since users look there first.
- **Minor:** Place the success toast where it does not cover form fields (or let it shift content less intrusively).
- **Minor:** On the tenant detail page, give the heading the full width (actions below it) when space is tight, so names do not break after a hyphen.

Blocker / Major: none.
