# Persona run: Dr. Weber (Français, desktop 1440 px), i18n run 4

Persona: Dr. Weber, 52, lawyer from Lausanne, legally cautious. Desktop 1440 px, plus a check of the sign-in page at 390 px.
Task: switch to Français, sign out with the app's own control, open «Protection des données» and the terms from the sign-in page by clicking only, return to sign-in. The completeness of the privacy notice's content was not judged (out of scope).

## 1. Task completed

**Yes.** The language switch, sign-out, the privacy notice, the terms and the way back to sign-in all work by clicking only, at 1440 px and at 390 px. The privacy notice is now linked directly from the sign-in page (footer link «Protection des données»). After sign-out, no page shows my name, my e-mail or the app menu. Every text I saw was in French.

## 2. Effort

- Screens: dashboard, user menu, sign-in, privacy notice, sign-in, terms, sign-in (7 screens), plus help and the browser Back button as extra checks.
- Clicks: language control 2, user menu 1, «Se déconnecter» 1, «Protection des données» 1, «Se connecter» 1, «Conditions d’utilisation» 1, «Se connecter» 1. That is 8 clicks.
- Time: about 2 minutes as a user, with no hesitation.

## 3. Thinking aloud

1. The dashboard opens in German. At the top right I see the translation icon with "Deutsch" and choose «Français». The whole app switches at once: «Vue d’ensemble», «Immeubles», «Contrats de bail», «Décomptes des charges».
2. I open my name, «Vera Verwalter». The menu shows my e-mail, «Paramètres» and «Se déconnecter» in red with an exit arrow, so the sign-out is clear and in French. ([user menu](screens/weber-i18n-4/02-usermenu-fr.png))
3. «Se déconnecter» takes me straight to «Se connecter», still in French. The header shows only «Aide» and «Français», with no name, no e-mail and no app menu. The footer has «Protection des données» and «Conditions d’utilisation». As a lawyer I am pleased that the privacy notice can now be reached before signing in. ([sign-in](screens/weber-i18n-4/03-login-fr.png))
4. The consent sentence under the button reads «En vous connectant, vous acceptez les Conditions d’utilisation.» It links only the terms. I would expect the privacy notice next to the consent too, but the footer link is two lines further down and easy to find.
5. I click «Protection des données». The page has a clear title, the subtitle «Quelles données Dwello traite et où elles vont.», and four sections: «Quelles données Dwello enregistre», «Connexion», «Transmission à des tiers» and «Cookies». The top left offers «Se connecter» and «Aide». No sign of my session. ([privacy notice](screens/weber-i18n-4/04-privacy-fr.png))
6. Without judging the content: the «Connexion» section says «La connexion se fait via Google ou Microsoft», while the sign-in page offers only «Se connecter avec Google». A careful reader notices that the two pages differ.
7. «Se connecter» at the top left takes me back to sign-in. The language stays French.
8. I click «Conditions d’utilisation» (inline link; the footer has the same link). It opens in the same tab. The sections are «But», «Responsabilité des décomptes» and «Disponibilité». The sentence «Chaque décompte devrait être vérifié avant l’envoi.» is clear. «Se connecter» takes me back again. ([terms](screens/weber-i18n-4/05-terms-fr.png))
9. Extra check: after signing out, the browser Back button and typing /dashboard both show the sign-in page (for a typed /dashboard, with `redirectTo`). /help, /privacy, /terms and /login contain neither "Vera" nor "verwalter@example.com". Nothing leaks.
10. At 390 px: the sign-in card fits, with «Aide» on the left and «Français» on the right. The footer links wrap onto two lines each («Protection des / données», «Conditions / d’utilisation»), which is readable. No sideways scrolling (scrollWidth 390). The privacy notice also fits without scrolling sideways, and the way back via «Se connecter» works. ([mobile sign-in](screens/weber-i18n-4/06-mobile-login.png), [mobile privacy notice](screens/weber-i18n-4/09-mobile-privacy.png))

## 4. Language

- **Wrong-language text:** none on sign-in, privacy notice, terms or help. The tab titles are French too («Se connecter - Dwello», «Protection des données - Dwello», «Conditions d’utilisation - Dwello»), and `lang="fr"` is set.
- German proper names stay as they are, which is correct: the demo user «Vera Verwalter» and the buildings «Musterhaus Zentrum», «Seepark Residenz» and «Alpenblick».
- **Words I did not understand:** none. «XSRF» and «PostgreSQL» in the privacy notice are technical, but each is explained in the same sentence or harmless.
- **Translations that read oddly:** none worth noting. The French typography is correct: «» with spaces, a space before «:» and «;», and the typographic apostrophe.

## 5. Layout

- **1440 px:** everything is centred and clean. The footer links are visible without scrolling at a height of 900 px.
- **390 px:** no horizontal overflow on sign-in or the privacy notice. Header links, the language control and the footer links are 48 px high. The only exception is the inline link «Conditions d’utilisation» in the consent sentence, which is 20 px high (inline text, so acceptable).
- **Language control:** visible on every page, labelled «Langue : Français», with the icon and the current language.

## 6. Error risks

- None that would block a user. After sign-out the session is gone; neither the browser Back button nor a direct URL shows any data.
- Low risk: the consent sentence names only the terms, so a user could miss that a separate privacy notice exists, even though it sits in the footer.
- The privacy notice names Microsoft as a sign-in provider, but the sign-in page has no Microsoft button. This could confuse a careful reader. I mention it as a consistency observation, not as a judgement of the content.

## 7. Suggestions

- **Minor:** add the privacy notice to the consent sentence, for example «… vous acceptez les Conditions d’utilisation et prenez connaissance de la Protection des données.»
- **Minor:** bring the providers named in the privacy notice in line with the sign-in buttons that are actually offered, or say that Microsoft only applies if the operator enables it.
- **Minor:** mark the current page in the footer with `aria-current="page"` (on /privacy the «Protection des données» link is not marked).

**Blocker/Major: none.**
