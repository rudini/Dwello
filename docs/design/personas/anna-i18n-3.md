# Persona run: Anna (i18n, round 3, after fixes)

Anna, 29, first-time landlord from Geneva, on her phone (390 px, mobile viewport, zoom 1). Language: Français.
Task: switch to Français, sign out with the app's own control, then on the sign-in page find the help by tapping only, read it a little, open the privacy notice and the terms, and go back to sign-in.

## 1. Task completed

**Yes.** Every step worked by tapping alone. Signing out left nothing that showed me as signed in, the help is one tap from the sign-in page, and all four pages (sign-in, help, privacy, terms) were fully in French with no sideways scrolling at 390 px.

## 2. Effort

- Screens: dashboard, language menu, user menu, sign-in, help, privacy, terms, and sign-in again (8 screens).
- Taps: 2 to switch the language, 2 to sign out («Menu utilisateur», «Se déconnecter»), 1 to «Aide», 1 to «Protection des données», 1 to «Conditions d’utilisation», 1 to «Se connecter». 8 taps in total.
- Time: about 3 minutes, most of it reading the help.

## 3. Thinking aloud

1. The dashboard opens in German. At the top I see a button «Sprache: Deutsch» with a language symbol. I tap it and pick «Français». The page switches right away: «Vue d’ensemble», «À faire ensuite», «Délais». ([03-dashboard-fr](screens/anna-i18n-3/03-dashboard-fr.png))
2. I want to sign out. The round button on the right is called «Menu utilisateur». It opens a menu with my e-mail «verwalter@example.com», «Paramètres» and «Se déconnecter». Clear. ([04-usermenu-fr](screens/anna-i18n-3/04-usermenu-fr.png))
3. I tap «Se déconnecter» and land straight on «Se connecter». No e-mail, no menu button, no app navigation. The page stays in French. At the top left there is a link «Aide», and at the top right «Français». ([05-signin](screens/anna-i18n-3/05-signin.png))
4. The sentence «Vous n’avez pas besoin d’un mot de passe propre à Dwello» reassures me: I use my Google account.
5. I tap «Aide». It opens a page that explains the main steps: «Saisir les immeubles et les appartements», «Gérer les locataires et les contrats de bail», «Saisir les factures», «Établir les décomptes des charges», «Paiements et rappels», and a glossary «Les termes en bref». The explanations are concrete. I like the glossary, which explains «Acompte», «Clé de répartition» and «Frais de gestion» («L’usage est de 3 % au maximum»). ([17-help-viewport](screens/anna-i18n-3/17-help-viewport.png))
6. The help page is long on the phone, about 5,600 px or roughly seven screens of scrolling. There is no table of contents at the top and no way to jump back up. I scroll to the bottom, where the footer has «Protection des données» and «Conditions d’utilisation».
7. On the help page the header shows only «Se connecter» and «Français». I am already on the help, so no «Aide» link is fine.
8. «Protection des données»: four cards, «Quelles données Dwello enregistre», «Connexion», «Transmission à des tiers», «Cookies». Easy to read. ([09-privacy](screens/anna-i18n-3/09-privacy.png)) Two things make me pause:
   - «La connexion se fait via Google ou Microsoft», but the sign-in page only offers «Se connecter avec Google». Where is Microsoft?
   - «Les polices et les symboles sont chargés depuis Google Fonts. Google reçoit alors l’adresse IP du navigateur.» So Google learns my IP address even when I am only reading the help. I note it, but it does not block me.
9. From the privacy page I tap «Conditions d’utilisation». Three short cards: «But», «Responsabilité des décomptes», «Disponibilité». The text is understandable. ([11-terms](screens/anna-i18n-3/11-terms.png))
10. At the top I tap «Se connecter» and I am back on the sign-in page. Done.
11. Extra check: after signing out I pressed the browser's back button several times. I never saw my e-mail or the user menu again. Opening `/dashboard` directly sends me to `/login?redirectTo=%2Fdashboard`. Good.

## 4. Language

- **German text:** none on the sign-in, help, privacy and terms pages, including the page titles («Se connecter - Dwello», «Aide - Dwello» …) and the screen-reader labels («Aller au contenu», «Choix de la langue», «Langue : Français», «Informations légales»). The only German I saw was demo data (building names «Musterhaus Zentrum», «Alpenblick», the tenant «Hans Müller»), which is expected.
- **The language choice survives signing out.** After «Se déconnecter» everything stayed in French.
- **Words I had to think about:**
  - «Immeubles sans décompte : Alpenblick» (dashboard) is fine.
  - In the terms, the same person is called «le gérant d’immeubles» and «la gérance» in consecutive paragraphs. As a private landlord I wonder whether I am either of them. One word, ideally a neutral «vous», would read better.
  - «Reloué» (glossary «Statut de location») is unusual French, but the glossary explains it («un futur contrat de bail est conclu»).
- **Reads oddly:** «Le loyer mensuel de base» for «Loyer net» is fine. «Imputable» is explained well in the glossary.

## 5. Layout at 390 px

- No horizontal scrolling on any screen (`scrollWidth` = 390 everywhere).
- No text cut off. In the footer, «Protection des données» and «Conditions d’utilisation» wrap onto two lines, which is clean and readable.
- The language control «Français» with its symbol sits at the top right of every page, including the signed-out ones. Its menu (Deutsch / Français ✓ / Italiano / English) opens below it without overlapping anything important.
- Tap targets in the header and footer are 48 px high. The exception is the inline link «Conditions d’utilisation» inside the sentence «En vous connectant, vous acceptez les …» on the sign-in card, which is only 20 px high. It is easy to hit by accident, but the same link is in the footer at full size.
- The help page is very long on a phone (about 7 screens) and has no in-page navigation.

## 6. Error risks

- A user who expects Microsoft sign-in (as the privacy notice says) will not find it on the sign-in page and may think something is broken.
- On the long help page it is easy to lose your place, and the way back to «Se connecter» is only at the very top.

## 7. Suggestions

- **Minor:** align the privacy notice with the sign-in page. Either offer Microsoft or remove «ou Microsoft» from «Connexion».
- **Minor:** give the help page a short list of its sections at the top (anchor links), so a phone user can jump to «Les termes en bref» or «Paiements et rappels» without scrolling seven screens.
- **Minor:** in the terms, use one consistent term for the user («gérant d’immeubles» vs «gérance»), or address the reader as «vous».
- **Minor:** the inline «Conditions d’utilisation» link on the sign-in card is 20 px high. Consider more line height or padding (the footer link covers it).
- **Minor (information):** the privacy notice says fonts and symbols load from Google Fonts and Google receives the IP address. If that is still true, a privacy-minded landlord in Geneva may dislike it. If it is no longer true, the text is out of date.

**Blocker / Major: none.**
