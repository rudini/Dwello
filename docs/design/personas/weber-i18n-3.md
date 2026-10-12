# Persona run: Dr. Weber (French, desktop 1440 px), second repeat run

Dr. Weber, 52, lawyer from Lausanne, legally cautious. Uses French and a desktop browser at 1440 px. I also checked the pages at 390 px.

## 1. Task completed

**Yes.** I signed out through the user menu, switched the sign-in page to Français and read the terms of use. From the terms I clicked through to the privacy notice and back to sign-in. I typed `/help` and clicked back to sign-in from there. None of these pages is a dead end, and every text I saw after the switch was in French.

## 2. Effort

- **Screens:** 5 (sign-in DE, sign-in FR, terms, privacy notice, help).
- **Clicks:** about 8 (user menu, "Abmelden", language button, "Français", "Conditions d’utilisation", footer "Protection des données", "Se connecter", then "Se connecter" again from help).
- **Typed address:** one, `/help`.
- **Time:** about 2 minutes.

## 3. Thinking aloud

1. On the dashboard I open the user menu and choose "Abmelden". The app sends me to the sign-in page, which is still in German ("Anmelden").
2. I click the language button at the top right ("Sprache: Deutsch") and choose "Français". The whole page switches at once: "Se connecter", "Connectez-vous avec votre compte existant. Vous n’avez pas besoin d’un mot de passe propre à Dwello.", "Se connecter avec Google" and "En vous connectant, vous acceptez les Conditions d’utilisation." The browser tab reads "Se connecter - Dwello" and the page language is `fr`. ([03-login-fr](screens/weber-i18n-3/03-login-fr.png))
3. As a lawyer I read the consent sentence first. It names the terms and links them, but the **privacy notice is not linked on the sign-in page**. Signing in with Google sends my name, e-mail and photo to Dwello, and at that moment I cannot see where this is explained. I find the privacy notice only after I open the terms.
4. "Conditions d’utilisation" opens in the same tab. It has three short sections: "But", "Responsabilité des décomptes" and "Disponibilité". They are clear and in good French. A link "Se connecter" sits at the top left, and the footer links "Protection des données" and "Conditions d’utilisation". ([04-terms-fr](screens/weber-i18n-3/04-terms-fr.png))
   - The terms use two words for the responsible party: "Le gérant d’immeubles reste responsable…" and "La gérance est responsable d’informer les locataires…". The subtitle also says "la gérance". As a lawyer I ask whether these are the same party. They probably are, but a contract text should use one term.
   - The footer link to the page I am already on ("Conditions d’utilisation") looks like every other link. Nothing tells me I am already there.
5. I click "Protection des données" in the footer. The privacy notice has four sections: "Quelles données Dwello enregistre", "Connexion", "Transmission à des tiers" and "Cookies". All of it is in French. Following the brief, I do not judge whether the content is complete. ([05-desktop-privacy](screens/weber-i18n-3/05-desktop-privacy.png))
   - One point confused me as a user. Under "Connexion" it says "La connexion se fait via Google ou Microsoft", but the sign-in page offers only "Se connecter avec Google". I wondered whether I had missed a Microsoft option.
6. I click "Se connecter" at the top left and land on the French sign-in page. The language choice is kept.
7. I type `/help`. The page "Aide" ("Les principales étapes dans Dwello, pas à pas.") is long and entirely in French. It ends with a well-made glossary, "Les termes en bref". "Se connecter" at the top left takes me back to sign-in, and the footer links are there too. ([06-desktop-help](screens/weber-i18n-3/06-desktop-help.png))
   - While signed out, I can reach the help only by typing its address. Neither the sign-in page nor the footer links to it.
8. I repeat the whole path at 390 px with the same result. There is no sideways scrolling: the page width equals the 390 px window on every page. Text wraps cleanly, and the two footer links each wrap onto two lines without overlapping. ([05-mobile-privacy](screens/weber-i18n-3/05-mobile-privacy.png), [06-mobile-help](screens/weber-i18n-3/06-mobile-help.png))

## 4. Language

- **Wrong-language text after the switch:** none. Everything was in French on sign-in, terms, privacy and help, including the skip link "Aller au contenu", the language region "Choix de la langue", the button "Langue : Français", the footer region "Informations légales" and the browser tab titles.
- **Words I did not understand:** none.
- **Translations that read oddly:**
  - Terms: "gérant d’immeubles" and "gérance" are used side by side for what seems to be the same party (Minor).
  - Help: "décompte des charges" and "frais accessoires" are mixed. Both are common in Suisse romande, so the text is understandable, but one term would be cleaner.
  - Help: "Loyer supplémentaire" (garage, place de parc) reads a little like a literal translation. I would expect something like "loyer accessoire" or "loyer annexe". This is a matter of taste, not an error.

## 5. Layout at my viewport

- **1440 px:** content is a readable column of about 770 px. The language control and "Se connecter" are both clearly visible at the top, and nothing is cut off or overlapping.
- **390 px:** no horizontal scrolling and no clipped text. The language control is visible at the top right.
- The link "Se connecter" in the top bar is plain underlined text, so its clickable area looks smaller than the app's other controls.

## 6. Error risks

- A legally cautious user signs in without having seen the privacy notice, because sign-in links only the terms.
- "Google ou Microsoft" in the privacy notice can make a user search for a Microsoft sign-in that does not exist on this installation.
- A signed-out user who needs help on the sign-in page cannot find the help page.

## 7. Suggestions

- **Major:** Link the privacy notice ("Protection des données") on the sign-in page, next to the terms in the consent sentence. Personal data is collected at sign-in, and today the notice is reachable only through the terms footer.
- **Minor:** Make the privacy notice's "Connexion" section match the sign-in options this installation actually offers (it says "Google ou Microsoft"; only Google is offered).
- **Minor:** Use one term in the terms of use for the responsible party ("gérant d’immeubles" or "gérance").
- **Minor:** Add "Aide" to the footer or the sign-in page so signed-out users can find the help without typing its address.
- **Minor:** Mark the current page in the footer's "Informations légales" links, for example with `aria-current` and a visible style.
- **Minor:** Give the top-bar link "Se connecter" a control-sized clickable area (48 px).

No Blocker. No dead ends. The French translation is complete on all pages I visited.
