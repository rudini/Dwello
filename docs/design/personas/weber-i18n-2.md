# Persona run (repeat): Dr. Weber, French, signed-out pages

Persona: Dr. Weber, 52, lawyer from Lausanne, legally cautious. Desktop 1440 px (one check at 390 px). Language: French. Date: 2026-10-12.

## 1. Task completed

**Yes.**
- I signed out with the app's own control ("Vera Verwalter" user menu, then "Abmelden"), which took me to `/login`.
- On the sign-in page I switched to "Français" and opened "Conditions d'utilisation". I read the terms in French before signing in.
- Still signed out, I opened `/privacy` and `/help` in French at 1440 px and at 390 px. Neither page sent me back to sign-in.
- After signing in again, the UI was in French, but only in the same browser (see the note on step 3 below).

## 2. Effort

- 6 screens: user menu, sign-in, terms, privacy, help, dashboard.
- About 6 clicks: user menu, "Abmelden", language button, "Français", terms link, then direct URLs.
- About 3 minutes as a user.

## 3. Thinking aloud

1. On the dashboard (still German) I open the user menu at the top right. It shows my e-mail, "Einstellungen" and "Abmelden". It is clear and needs no searching. ([02-usermenu](screens/weber-i18n-2/02-usermenu.png))
2. "Abmelden" takes me straight to the sign-in page, with no confirmation. That is fine for signing out.
3. The language control is at the top right of the sign-in page. I choose "Français" and the whole card switches:
   - "Se connecter"
   - "Connectez-vous avec votre compte existant. Vous n'avez pas besoin d'un mot de passe propre à Dwello."
   - "Se connecter avec Google"
   - "En vous connectant, vous acceptez les Conditions d'utilisation."
   - The skip link ("Aller au contenu") and the navigation label ("Choix de la langue") are French too.

   ([04-login-fr](screens/weber-i18n-2/04-login-fr.png))
4. The terms link opens `/terms` in the same tab. The page is entirely French, and so is the tab title ("Conditions d'utilisation - Dwello"). ([05-terms-fr](screens/weber-i18n-2/05-terms-fr.png))
5. Reading the terms as a lawyer:
   - The wording is grammatically correct and sounds natural.
   - "selon le droit suisse du bail" is the right reference.
   - "Il n'existe aucun droit à une disponibilité ininterrompue" is a clean exclusion.

   Three things catch my eye:
   - **Who is responsible?** The subtitle says "ce dont **la gérance** est responsable". The section on statements then says "**Le gérant d'immeubles** reste responsable…". The last paragraph says "**La gérance** est responsable d'informer les locataires…". In Swiss French, "la gérance" usually means a management firm and "le gérant" a person. In a text about responsibility, two names for the same party create doubt. The target user is often a private landlord, the "bailleur", who is neither.
   - "Chaque décompte **devrait** être vérifié avant l'envoi" is a recommendation, not an obligation. If the aim is to shift responsibility, "doit être vérifié" is clearer. This is a wording point, not a translation error.
   - "décomptes **des charges**": Swiss rental law (CO art. 257a/b) and Romand practice say "frais accessoires" ("décompte des frais accessoires", often "de chauffage et frais accessoires"). "Charges" is understood in Romandie but sounds French-from-France in a legal text. The help and the navigation use both terms (see section 4).
6. The terms page has no link back to "Se connecter" and no link to the privacy notice. I have to use the browser's Back button.
7. The sign-in page links only to the terms, not to the privacy notice. I typed `/privacy` myself.
   - The page opens signed out, in French, with no redirect to sign-in.
   - All sections are French: "Quelles données Dwello enregistre", "Connexion", "Transmission à des tiers", "Cookies".
   - The text is clear and well written, with correct French typography (« », a space before ":" and ";", typographic apostrophe).

   ([06-desktop-privacy](screens/weber-i18n-2/06-desktop-privacy.png))
8. `/help` also opens signed out, in French.
   - The step lists and the glossary ("Les termes en bref") read well.
   - The help uses Swiss terms correctly: NPA, "place de parc", "arrondie à 5 centimes", "frais accessoires".
   - It refers to screens I cannot see before signing in. That is expected.
9. At 390 px the help page wraps cleanly, with no sideways scroll (scrollWidth 390 = clientWidth). I checked privacy at 390 px as well and it is the same. ([06-mobile-help](screens/weber-i18n-2/06-mobile-help.png))
10. Signing in again:
    - **Same browser** (after choosing French on the sign-in page, then signing in): the dashboard is fully French ("Vue d'ensemble", "Frais accessoires", "Décomptes des charges", "Paramètres et aide"), with `lang="fr"`. The signed-in footer now offers "Protection des données" and "Conditions d'utilisation". ([09-signedin-same-browser](screens/weber-i18n-2/09-signedin-same-browser.png))
    - **Fresh browser** (a new `open()`, no earlier language choice): the dashboard is in German ("Übersicht", `lang="de"`). The language is kept only in a browser cookie (`PARAGLIDE_LOCALE`), not with my account. On a second computer, or after clearing cookies, I start in German again.
    - The kit's `open()` does not go through Google. I simulated the Google round trip by giving my French-language browser a fresh session.

## 4. Language

- **No German text** on the sign-in, terms, privacy or help pages in French, including tab titles, the skip link and the navigation label.
- **Words I did not understand:** none.
- **Translations that read oddly or are legally imprecise:**
  - Terms: "la gérance" and "le gérant d'immeubles" are used for the same responsible party.
  - Terms: "Chaque décompte devrait être vérifié" is weak for a statement of responsibility.
  - "Décompte(s) des charges" (terms, privacy, help, navigation) sits next to "Frais accessoires" (navigation group heading, help glossary). Swiss legal usage is "décompte des frais accessoires". In the sidebar, the group "Frais accessoires" contains "Décomptes des charges", which mixes two terms on one screen.
  - Help, "Loyer supplémentaire" for a garage or parking space: understandable. A Romand lease would more often say "loyer accessoire" or name the object (e.g. "loyer place de parc"). This is a minor point that needs a domain check.
  - Dashboard: percentages are shown as "66.7 %". In fr-CH, plain numbers usually take a decimal comma ("66,7 %"); amounts in CHF with a point are fine. This is a nit.

## 5. Layout at my viewport

- **1440 px:** terms and privacy use a readable column (about 770 px) with normal left margins. The language control sits at the top right. Nothing is clipped. The help page has the same layout.
- **390 px:** no horizontal scroll, and cards and headings wrap cleanly. The language control stays visible at the top right.
- **No way out of the signed-out pages:**
  - The terms, privacy and help pages have no header and no footer when signed out.
  - None of them links back to "Se connecter" or to each other. Only the browser's Back button helps.
  - When signed in, a footer links privacy and terms. Signed out, it is missing.

## 6. Error risks

- A user who signs in on another device lands in German and has to find the language control again. This is mild, because the control is visible and labelled with the language name.
- The privacy notice cannot be reached from the sign-in page. A careful user who wants to read how data is handled before signing in has to guess the URL. Under the revised Swiss data protection law (nLPD), you would expect the notice to be offered where the data is first collected, i.e. at sign-in. I am not judging the notice's content here, only whether it can be found.
- Mixed names for the responsible party in the terms could be read against the drafter (in dubio contra stipulatorem).

## 7. Suggestions

- **Major:** Link "Protection des données" on the sign-in page next to "Conditions d'utilisation". Give the signed-out terms, privacy and help pages a way back to "Se connecter" and links to each other. A signed-out footer like the signed-in one would cover both.
- **Minor:** In the terms, name one responsible party throughout. Either "la gérance" everywhere, or the plain "l'utilisateur / le bailleur" that fits private landlords.
- **Minor:** In the terms, use "doit être vérifié" instead of "devrait être vérifié" if the sentence is meant to set responsibility.
- **Minor:** Have someone with domain knowledge check "décompte des charges" against "décompte des frais accessoires". At least make the sidebar consistent: the group "Frais accessoires" contains "Décomptes des charges".
- **Minor:** Store the chosen language with the account, or accept that a new device starts in German. If the cookie-only approach is deliberate, document it.
- **Minor:** Check "Loyer supplémentaire" and the fr-CH decimal separator in percentages ("66.7 %").

**Blocker items:** none.
**Major items:** 1 (the privacy notice is not linked from the sign-in page, and the signed-out pages have no way back or to each other).
