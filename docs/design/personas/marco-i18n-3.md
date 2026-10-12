# Persona run: Marco (Italiano, 390 px), repeat 3

Marco, 38, from Ticino, uses a smartphone (390 px) and has little time. Task: switch the app to Italiano from the header, sign out with the app's own control, then from the sign-in page open the privacy notice, the terms of use and the help by tapping only, and get back to sign-in each time.

## 1. Task completed

**Yes.** Every step worked by tapping. The language stayed Italiano on every page, including after signing out, after a reload and after using the browser's back button. None of the signed-out pages show my e-mail address or the app menu.

## 2. Effort

- Screens: dashboard, user menu, sign-in, privacy notice, terms of use (opened from the footer and again from the sentence under the button), help, and sign-in after each.
- Taps: 2 to switch the language ("Lingua: Italiano" button, then "Italiano"), 2 to sign out ("Menu utente", then "Disconnettersi"), then 2 per page (open it, then "Accedere"). About 12 taps in total.
- Time: about 1 to 2 minutes for a real user. Nothing made me stop and think.

## 3. Thinking aloud

1. The dashboard opens in German. The language button with the translation icon sits at the top right, and I switch to Italiano in two taps. Everything changes to Italian, for example "Panoramica", "Da fare ora" and "Allestire i conteggi". [02-dash-it](screens/marco-i18n-3/02-dash-it.png)
2. The person icon opens a small menu with my e-mail address, "Impostazioni" and "Disconnettersi" in red with an arrow. Signing out is easy to find. [03-usermenu](screens/marco-i18n-3/03-usermenu.png)
3. "Disconnettersi" takes me straight to "Accedere". The page is still in Italian ("Acceda con il suo account esistente…", "Accedere con Google"). There is no hamburger menu, no person icon and no e-mail address. At the top I see "Aiuto" and the language button, and the footer has "Protezione dei dati" and "Condizioni d’uso". [04-login](screens/marco-i18n-3/04-login.png)
4. I tap "Protezione dei dati" in the footer. The page opens in the same tab, in Italian. At the top left there are "Accedere" and "Aiuto", so the way back is obvious. "Accedere" brings me back to sign-in, still in Italian. [05-privacy](screens/marco-i18n-3/05-privacy.png)
5. I tap "Condizioni d’uso" in the footer. The page has the same top bar, and "Accedere" brings me back. I also tap the "Condizioni d’uso" link in the sentence "Accedendo accetta le Condizioni d’uso." It goes to the same page, and I get back the same way. [06-terms](screens/marco-i18n-3/06-terms.png)
6. I tap "Aiuto". The help page has "Accedere" at the top left. "Aiuto" is not shown there because I am already on it, which makes sense. "Accedere" brings me back. [07-help](screens/marco-i18n-3/07-help.png)
7. Extra checks: after a reload of the help page it is still Italian. When I use the browser's back button twice after signing out, I land on /dashboard, but it shows the Italian sign-in form and no data. That is good.

## 4. Language

- **German text:** none. Every label, heading, paragraph, the page titles ("Accedere - Dwello", "Protezione dei dati - Dwello", "Aiuto - Dwello"), the skip link "Passare al contenuto" and the landmark names ("Scelta della lingua", "Note legali") are Italian. `lang` is `it` on every page.
- **Words I did not understand:** none. "Pigione" and "NPA" in the help are normal Swiss Italian terms. The glossary "I termini in breve" at the end of the help is useful.
- **Wording that reads oddly:**
  - The privacy notice says sign-in works "tramite Google o Microsoft", but the sign-in page only offers "Accedere con Google". As a user I wonder where the Microsoft option is.
  - The help talks about «Immobili», «Fatture», «Impostazioni» and so on, but when I am signed out these menus are not visible. That is acceptable for a help page, but a short line such as "dopo l’accesso, nel menu…" would make it clearer.

## 5. Layout at 390 px

- No sideways scrolling on any page (scrollWidth = 390). The only clipped elements I found are the hidden screen-reader texts, which is intended.
- No cut-off or overlapping text. Long headings such as "Gestire inquilini e contratti di locazione" wrap cleanly.
- Tap targets: "Aiuto", "Accedere", the footer links and the language button are all 48 px high. "Aiuto" is only about 39 px wide, but that is still fine to hit with a thumb.
- The language control is in the same place (top right) on every page.

## 6. Error risks

- Low. Signing out ends the session properly: the browser's back button does not reveal data.
- If the privacy notice names Microsoft but the button is missing, a user with only a Microsoft account may think they cannot get in.

## 7. Suggestions

- **Minor:** Make the privacy notice match the sign-in options. Either offer "Accedere con Microsoft" or mention only Google.
- **Minor:** In the help, say once that the menus it names («Immobili», «Fatture» …) appear after signing in.

Blocker/Major: none.
