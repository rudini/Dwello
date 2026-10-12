# Persona run: Helga (i18n, confirmation run 2)

Helga, 68, inherited an apartment building, little computer experience, reads with a large font. Desktop viewport at 150 % zoom (960 CSS px wide). Language: Deutsch. Also tried the language control once (Français) and came back to Deutsch.

Task: create the first tenant and a rental contract for a free apartment; sign out with the app's own control; on the sign-in page find the privacy notice and the terms and come back to sign-in.

## 1. Task completed

**Yes.** Tenant "Margrit Helga-Brunner" created, rental contract for "Wohnung B1 - Seepark Residenz" from 01.11.2026 saved, signed out via "Vera Verwalter" > "Abmelden", read "Nutzungsbedingungen" and "Datenschutz" and got back to "Anmelden".

One real snag: right after signing out, the legal pages still showed me as signed in (see 3.9). Signing out itself works (the session cookie is gone, `/dashboard` redirects to sign-in), but the screen told me otherwise.

## 2. Effort

- Screens: dashboard, language menu, new tenant (with one empty-submit attempt), tenant detail, contract wizard (5 steps), contracts list, user menu, sign-in, terms, privacy.
- Clicks: about 25 (tenant 8 incl. typing, contract 9, sign-out and legal pages 8).
- Rough time for Helga: 15 to 20 minutes, most of it reading the help texts.

## 3. Thinking aloud

1. Dashboard: "Übersicht" with "Häufige Arbeiten". "Mieter erfassen" is right there. Good. The top bar shows "Deutsch" next to a language symbol; I know what that is.
2. Language: I click "Deutsch", a small list opens with "Deutsch" ticked, "Français", "Italiano", "English" ([screenshot](screens/helga-i18n-2/02-langmenu.png)). I pick Français: everything turns French ("Vue d’ensemble", "À faire ensuite"), even the "Langue : Français" button. I go back the same way to Deutsch; it stays German after a reload. Easy.
3. "Mieter erfassen": every field has a label and an example ("Beispiel: Anna"). "Korrespondenzkanal" is an odd word, but the line under it explains it ("Wie der Mieter Post erhält, zum Beispiel Mahnungen …"). I pressed the button without filling anything in to see what happens: red frames and plain messages "Vorname ist erforderlich", "Für Briefe ist eine Adresse erforderlich". I know what to do.
4. Saved: green message "Margrit Helga-Brunner gespeichert", and the next button is "Mietvertrag erfassen" ([screenshot](screens/helga-i18n-2/06-tenant-saved.png)). The name heading is squeezed into a narrow left column and breaks after "Helga-", while the buttons take the rest of the line.
5. Contract step 1 "Mieter": my new tenant is already chosen. "Weiter".
6. Step 2 "Wohnung": the help text says free apartments are on top and rented ones are marked "(nicht verfügbar)". I pick "Wohnung B1 - Seepark Residenz, 3.5 Zimmer, 75 m²".
7. Step 3 "Vertragsdauer": "Vertragsbeginn" with format help "TT.MM.JJJJ". I typed "1.11.2026" and it was accepted. "Unbefristet" / "Befristet" each have a one-line explanation. "Entwurf gespeichert, 13:35" appears; I wondered for a moment whether the contract was already saved.
8. Step 4 "Miete": "Nettomiete", "Akonto" and "Zusatzmiete" each explained in plain words ([screenshot](screens/helga-i18n-2/10-step4.png)). At my zoom the step bar only shows ticks and numbers; the step names are gone, so I rely on the line "Schritt 4 von 5: Miete". Step 5 "Prüfen" lists everything with "Ändern" next to each line, "Sonntag, 1. November 2026" and "Monatlich total CHF 1’630.00". Clear. "Mietvertrag speichern" took me to the contracts list with "Mietvertrag von Margrit Helga-Brunner gespeichert" and my contract on top ("Künftig ab 01.11.2026, unbefristet"). I had started from her tenant page and expected to land there, but the list is fine.
9. Sign out: "Vera Verwalter" opens a menu with the e-mail, "Einstellungen" and "Abmelden". "Abmelden" brings me to "Anmelden" ([screenshot](screens/helga-i18n-2/14-login.png)). There is no line telling me I am now signed out, but the sign-in page is clear enough.
10. Legal pages: the sentence "Mit der Anmeldung akzeptieren Sie die Nutzungsbedingungen." has a link; "Datenschutz" is only in the footer, which I had to scroll to at my zoom. I click it, and the page shows the full app header again: menu button, "Vera Verwalter", and in its menu my e-mail and "Abmelden" ([screenshot](screens/helga-i18n-2/15b-privacy-menu.png)). Did the sign-out not work? Same on "Nutzungsbedingungen". Only after reloading the page does it show the signed-out header with an "Anmelden" link ([screenshot](screens/helga-i18n-2/17-privacy-signedout.png)). Checked: the session is really gone (clicking "Dwello" sends me to sign-in), so only the header is stale after in-app navigation.
11. Back to sign-in: from the stale header there is no "Anmelden" link; I got back with the browser's back button or by clicking "Dwello" (which lands on "Anmelden"). After a reload, the "Anmelden" link at the top left takes me straight there.

## 4. Language

- No wrong-language text in Deutsch on any screen I visited. French was complete on the dashboard during the short test.
- Words I did not understand or stumbled on: "Korrespondenzkanal" (explained at the field, fine), "Akonto" (explained), "Entwurf gespeichert" in the contract wizard (sounds like the contract is saved). On "Datenschutz": "PostgreSQL-Datenbank", "SMTP-Server oder Resend", "XSRF" mean nothing to me.
- "Datenschutz" says sign-in is "über Google oder Microsoft", but the sign-in page only offers "Mit Google anmelden".
- "Datenschutz" says "Schriften und Symbole werden von Google Fonts geladen". I cannot check this as a user, but it is worth confirming that the text is still true.

## 5. Layout at my viewport (desktop, 150 %)

- No sideways scrolling (page width 960 = window width) on the dashboard and sign-in.
- Tenant detail: the H1 "Margrit Helga-Brunner" wraps in a narrow column beside the action buttons.
- Contract wizard: step names are hidden at this width; only ticks and numbers remain in the step bar.
- The language control is easy to find (symbol plus "Deutsch") in the header and at the top right of sign-in and the signed-out legal pages. In the open list, the current language is shown only by a tick; a screen reader just reads "button Deutsch" without saying it is the current one.
- Full-page screenshots show the sticky header in the middle of the page; that is a capture artifact, not visible in normal use.

## 6. Error risks

- After signing out, the legal pages show the previous user's name, e-mail and "Abmelden". On a shared computer the next person sees who used it, and the person who just signed out may think the sign-out failed and do it again, or worry.
- "Entwurf gespeichert" in the wizard could make someone close the page thinking the contract exists.
- No "Sie sind abgemeldet" confirmation after signing out.

## 7. Suggestions

- **Major:** After "Abmelden", clicking "Datenschutz" or "Nutzungsbedingungen" from the sign-in page shows the signed-in header (name "Vera Verwalter", menu with e-mail "verwalter@example.com", "Einstellungen", "Abmelden", and the main menu button) until the page is reloaded. Reload the layout's user data after sign-out (or do a full page load on sign-out) so the legal pages show the signed-out header with "Anmelden".
- **Minor:** Show a short confirmation on the sign-in page after signing out, e.g. "Sie sind abgemeldet."
- **Minor:** "Datenschutz" mentions Microsoft sign-in, which the sign-in page does not offer; and it uses technical words (PostgreSQL, SMTP, Resend, XSRF) without explanation.
- **Minor:** Contract wizard "Entwurf gespeichert": add "Der Mietvertrag ist erst nach «Mietvertrag speichern» erstellt" or similar.
- **Minor:** Keep the step names visible in the wizard step bar at 150 % zoom (or wrap them).
- **Minor:** Tenant detail: let the name heading use the full width and put the buttons below it when space is short.
- **Minor:** Language menu: mark the current language for screen readers (e.g. `aria-current` or a checked state), not only with a tick.
- **Minor:** After saving a contract started from a tenant's page, return to that tenant's page.
