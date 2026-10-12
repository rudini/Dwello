# Persona run: Anna (Français, mobile 390 px), confirmation run 2

Anna, 29, first-time landlord from Geneva, comes back after months, on her phone. Run on 2026-10-12 against http://localhost:3300 with demo data, `open({ viewport: 'mobile' })`.

## 1. Task completed

**Partly.**

- Switching to French, reading the overview, the help page and its glossary, and checking that French stays after a reload all worked without problems.
- Signing out with the app's own control worked. The privacy notice opens from the sign-in page.
- **Help from the signed-out pages:** the sign-in page, the privacy notice and the terms have no link to "Aide". I could reach help only by typing `/help` or through a leftover signed-in menu (see below). When I loaded `/help` directly, it was in French and had a "Se connecter" link back to sign-in.
- **Leftover signed-in header:** after signing out, I tapped "Protection des données" on the sign-in page. The privacy page still showed the full signed-in header: the main menu, and a "Menu utilisateur" with my e-mail address `verwalter@example.com` and "Se déconnecter". The session cookie was already gone, so tapping a menu entry (e.g. "Immeubles") sent me to `/login?redirectTo=%2Fbuildings`. No data leaked. Still, it looks like I am signed in, and it shows my e-mail address on a device I thought I had signed out of.

## 2. Effort

- About 9 screens: overview DE, language list, overview FR, menu, help, help after reload, user menu, sign-in, privacy notice (stale header and direct load), help when signed out, sign-in again.
- Switching to French takes 2 taps. Getting to help takes 2 taps (menu, then "Aide"). Signing out takes 2 taps (user icon, then "Se déconnecter").
- Rough time for a real user: 6–8 minutes, most of it reading the help page. It is about 5600 px tall on the phone.

## 3. Thinking aloud

1. The app opens in German ("Übersicht"). Top right shows a translate icon and "Deutsch". It is clearly the language control. One tap opens the list Deutsch / Français / Italiano / English. Deutsch has a check mark.
2. I tap "Français" and the page turns French straight away ([03](screens/anna-i18n-2/03-dashboard-fr.png)). "Vue d'ensemble", "À faire ensuite", "Prochaine étape: Établir les décomptes des charges". The text explains why: "La période de décompte 01.01.2025 – 31.12.2025 est terminée. Immeubles sans décompte : Alpenblick. Saisissez d'abord toutes les factures de cette période, puis établissez les décomptes." So I know what to do and why. There is one main button, "Établir les décomptes", and a link "Voir les factures 2025". The second card says 7 decomptes are drafts: "Vérifiez-les et remettez-les aux locataires."
3. "Délais: 28.10.2026 Délai de paiement · Hans Müller, dans 16 jours". This is clear.
4. In the figures block, "9 Loué", "4 Vacant", "7 Brouillon" and "9 Payé" read like singular labels after plural numbers. I understand them, but they read oddly next to "3 Immeubles" and "13 Appartements".
5. I open the hamburger menu ([04](screens/anna-i18n-2/04-menu-fr.png)). All entries are French: "Gérer", "Frais accessoires", "Paramètres et aide", "Aide". The group is called "Frais accessoires", but the entry under it is "Décomptes des charges". Two words for the same thing made me pause for a moment.
6. "Aide" ([05](screens/anna-i18n-2/05-help-fr.png)) has five step-by-step sections and then "Les termes en bref", a glossary with 15 terms (Acompte, Loyer net, Clé de répartition, Solde, Rappel, Statut de location …). The texts are good, plain French. I understood "Solde" and "Imputable" thanks to the glossary. The page is very long on a phone, and there is no jump link at the top to the glossary. I had to scroll a lot.
7. I reload the help page. It is still French: "Langue : Français", h1 "Aide". It is also still French after going back to the overview.
8. I tap the person icon. It shows my e-mail address, "Paramètres" and "Se déconnecter" (in red, with an arrow). I tap "Se déconnecter" and land on "Se connecter", in French ([09](screens/anna-i18n-2/09-signed-out.png)). It says "Vous n'avez pas besoin d'un mot de passe propre à Dwello". This is reassuring.
9. I want to look at the help before signing in again, but the sign-in page has no "Aide" link. The footer offers only "Protection des données" and "Conditions d'utilisation".
10. I tap "Protection des données". Surprise: the page shows the full app header with the menu and my user icon. The user menu still shows `verwalter@example.com` and "Se déconnecter" ([15](screens/anna-i18n-2/15-stale-usermenu.png)). Did the sign-out fail? Through this menu I can open "Aide". Tapping "Immeubles" sends me to sign-in, so I am in fact signed out.
11. When I load `/privacy` or `/help` directly while signed out, the header is the correct one: just a "Se connecter" link and the language control ([10](screens/anna-i18n-2/10-help-direct.png)). "Se connecter" takes me back to sign-in. The French content was complete on both pages.
12. The privacy notice says "La connexion se fait via Google ou Microsoft", but the sign-in page only offers "Se connecter avec Google". Where is Microsoft?

## 4. Language

- **No German text** on any screen I visited after the switch: overview, menu, help and glossary, user menu, sign-in, privacy notice, terms. The building names ("Musterhaus Zentrum", "Seepark Residenz", "Alpenblick") are proper names, which is fine.
- **Odd or inconsistent wording:**
  - "9 Loué", "4 Vacant", "0 Bloqué", "7 Brouillon", "1 Envoyé", "9 Payé" (overview): the labels are singular after counts above 1. This is not consistent with "3 Immeubles" and "13 Appartements".
  - "Frais accessoires" (menu group) versus "Décomptes des charges" (entry and everywhere else): two terms for the same cost type.
  - "66.7 %" and "CHF 0.00": decimal point. This is acceptable for CHF amounts, but percentages in Swiss French usually use a comma.
- **Words I did not understand at first:** "Reloué" (overview). The glossary entry "Statut de location" explains it. "Bloqué": same entry.
- **Language persistence:** the choice is stored in this browser. A fresh browser starts in German again. On the same phone it stayed French, which is what I expect.

## 5. Layout at 390 px

- No horizontal scrolling on any page (scrollWidth 390 everywhere).
- The language control is visible in the header on every page, including signed-out pages. Its label is "Français" with a translate icon and it is easy to find.
- No clipped or overlapping text. The footer links "Protection des données" and "Conditions d'utilisation" wrap onto two lines each, which is fine.
- The help page is about 5600 px tall. On a phone, the glossary at the end is hard to reach.

## 6. Error risks

- After signing out, a page opened by link from sign-in still shows the signed-in header with the user's e-mail address. On a shared or borrowed phone, the user may think the sign-out failed, or the next person sees the e-mail address.
- Signed out, there is no way to reach the help except typing the URL. Someone stuck at sign-in cannot find guidance.
- The privacy notice promises Microsoft sign-in, which the sign-in page does not offer. This could confuse users or create a trust problem.

## 7. Suggestions

- **Major:** after sign-out, client-side navigation to `/privacy` (and through it `/help`) keeps the signed-in shell (main menu, "Menu utilisateur" with `verwalter@example.com`, "Se déconnecter"). Signed-out pages should always show the signed-out header ("Se connecter" and language), the same as on a direct load.
- **Major:** the signed-out pages (sign-in, privacy notice, terms) have no link to "Aide". The task "open the help from the signed-out pages" is only possible by typing the URL. Add "Aide" to the signed-out footer or header.
- **Minor:** add a short table of contents, or at least a jump link to "Les termes en bref", at the top of the help page. On mobile it is about 5600 px tall.
- **Minor:** use plural labels in the overview figures ("9 Loués", "7 Brouillons", "9 Payés"), or use a label form that works for any number.
- **Minor:** use one term for the cost type: "Frais accessoires" in the menu group, "charges" in "Décomptes des charges".
- **Minor:** the privacy notice mentions Microsoft sign-in, but only Google is offered. Align the text with the sign-in page.
- **Minor:** in French, show percentages with a decimal comma ("66,7 %").
