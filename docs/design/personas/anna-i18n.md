# Persona run: Anna (fr, mobile 390 px)

Anna, 29, first-time landlord from Geneva, comes back after months, on her phone. Language: Français.
Task: switch to French, find out from the overview what to do next and why, read the help page and the glossary, check every term, reload and check that French stays.

## 1. Task completed

**Yes.** The language switch is easy to find, the whole flow I used was in French, the overview names the next step and gives the reason, and the help page has a glossary ("Les termes en bref") I could understand. French stays after a reload (cookie `PARAGLIDE_LOCALE=fr`). Two things slowed me down: the "Aide" link sits below the fold in the mobile menu, and the glossary is only the last section of a long help page with no table of contents.

## 2. Effort

- Screens: overview (de, then fr), language menu, main menu, help page, drafts list, generate wizard step 1, invoices 2025.
- Clicks: 2 to switch language (`Deutsch` button, then `Français`), 1 to open the menu, scroll inside the menu, 1 on `Aide`. That is 4 clicks plus a scroll to reach the help.
- Time: about 5 minutes, most of it reading the help page (about 5,600 px tall at 390 px).

## 3. Thinking aloud

1. The app opens in German ("Übersicht"). I can see "Deutsch" with a translation icon at the top right. It is clearly the language control, so I tap it. The list shows "Deutsch ✓, Français, Italiano, English", each language in its own name. Good. ([01-language-menu](screens/anna-i18n/01-language-menu.png))
2. After I pick "Français" I stay on the same page, and it is French right away: "Vue d’ensemble", "Ce qu’il faut faire maintenant et les délais à venir." ([02-dashboard-fr](screens/anna-i18n/02-dashboard-fr.png))
3. "À faire ensuite" › "Prochaine étape" › "Établir les décomptes des charges". The reason is right below it: "La période de décompte 01.01.2025 – 31.12.2025 est terminée. Immeubles sans décompte : Alpenblick. Saisissez d’abord toutes les factures de cette période, puis établissez les décomptes." Now I know what to do (enter the 2025 invoices for Alpenblick, then create the statements) and why (the period is over). The link "Voir les factures 2025" sits right there. Very helpful.
4. The second card says "7 décomptes des charges sont encore à l’état de brouillon. Vérifiez-les et remettez-les aux locataires." At first I wondered why I should create statements when 7 already exist. Then I worked it out: the drafts are for the other two buildings, and Alpenblick has none. The text does not say which buildings the drafts belong to.
5. The counters read a bit oddly: "7 Brouillon", "9 Payé", "9 Loué", "4 Vacant" (singular after a plural number). I understand them, but it looks like a translation mistake.
6. I look for help. I open the menu ("Ouvrir le menu"). It shows Gérer / Frais accessoires / Paramètres et aide, but **"Aide" is not visible**: it starts exactly at the bottom edge of the screen (top = 844 px at a viewport height of 844 px). I only found it by scrolling inside the menu. Someone who is unsure would probably stop at "Profils de chauffage". ([03-menu-fr](screens/anna-i18n/03-menu-fr.png))
7. The "Aide" page is fully in French, as steps per topic (immeubles, locataires et contrats, factures, décomptes, paiements et rappels). The language is simple and polite ("vous"). It is very long on a phone, though, with no table of contents and no jump links.
8. The glossary is the last box, "Les termes en bref". There is no separate page and no link from the top of the help page, so I had to scroll to the very bottom. ([04-help-glossary-fr](screens/anna-i18n/04-help-glossary-fr.png))
9. I check the glossary terms (see section 4). I understood all of them thanks to the explanations, and only "Imputable" and "Reloué" needed the explanation.
10. I reload the page: it stays "Vue d’ensemble", `lang="fr"`, tab title "Vue d’ensemble - Dwello". Good.
11. I follow "Voir les brouillons" and "Établir les décomptes": both are in French with no German. ([05-drafts-fr](screens/anna-i18n/05-drafts-fr.png), [06-generate-step1-fr](screens/anna-i18n/06-generate-step1-fr.png)) The date help is localized: "Format JJ.MM.AAAA", "mercredi, 1 janvier 2025".
12. Observation: in a new browser session (another device, or after the cookies are deleted) Dwello starts in German again. My language is not saved in my account.

## 4. Language

**Texts not in my language**
- Statement numbers start with "NK-" ("NK-22222222-2025-0004", drafts list and the PDF link label "Télécharger le PDF : Décompte NK-…"). "NK" is a German abbreviation and means nothing to me.
- Building names, invoice issuers and invoice descriptions are German ("Winterdienst Oberland Schneeräumung Dezember 2025", "Musterhaus Zentrum"). These are demo data, so this is fine.
- Apart from those, I found no German UI text on the overview, menu, help, drafts list, generate wizard or invoice list.

**Words I did not understand right away**
- "Imputable" / "Imputabilité" (invoice filter). In Romandie people say "frais à la charge du locataire" or "répercutables". The glossary explains it well, but the invoice filter "Imputabilité (facultatif)" has no help text at the field.
- "Reloué" (dashboard counter). I first thought it meant "rented again in the past". The glossary says "un futur contrat de bail est conclu", but the dashboard does not explain it.
- "Bloqué": understandable, but why would I block an apartment? The glossary only says that I set it myself.
- "Clés de répartition" and "Profils de chauffage" in the menu: unclear before I read the glossary, clear after.

**Translations that read oddly**
- Counters without plural agreement: "7 Brouillon", "9 Payé", "9 Loué", "13 Appartements" (this one is correct), "1 Envoyé".
- Inconsistent French typography: the wizard heading is "Étape 1 sur 5: Période de décompte" (no space before the colon, in the region/heading name read by the screen reader), while the visible progress line is "Étape 1 sur 5 : Période de décompte".
- "Immeubles sans décompte : Alpenblick" uses a plural label for a single building. Acceptable, but "Immeuble(s)" or a list sentence would read better.
- "Montants en retard CHF 0.00" is correct for Switzerland.

## 5. Layout at 390 px

- No horizontal scrolling on any page (scrollWidth 390 on overview, help, drafts, wizard, invoices).
- The language control fits in the header ("Français" with icon, next to the user icon). The open list overlaps the page title, which is expected for a dropdown.
- Mobile menu: the last entry "Aide" starts exactly at the bottom edge of the viewport and is invisible until you scroll inside the drawer, with no hint that more entries follow.
- The help page is about 5,600 px tall. Without a table of contents, the glossary is hard to reach.
- I found no clipped or overlapping text. Long French titles wrap cleanly ("Établir les décomptes des charges", "Appartements loués par immeuble").

## 6. Error risks

- A first-time user who does not find "Aide" in the menu may start "Établir les décomptes" before entering all the Alpenblick invoices. The overview warns about this, but the button is the primary action and the invoice link is only a text link above it.
- On a new device the app falls back to German, so a French-only user may get lost before finding the switch (the switch is visible, so the risk is low).
- "Reloué" next to "Loué" could be misread as a count of past re-lettings.

## 7. Suggestions

- **Major:** Make "Aide" reachable in the mobile menu without hidden scrolling. Move it up, pin it to the bottom of the drawer, or show that the list continues.
- **Major:** Give the glossary its own entry point: a table of contents or jump links at the top of the help page (at least "Les termes en bref"), or a link from the menu.
- **Minor:** Pluralize counter labels in French ("7 brouillons", "9 payés", "9 loués", "4 vacants").
- **Minor:** Add a space before the colon in "Étape 1 sur 5: Période de décompte" (screen reader name) to match the visible text.
- **Minor:** Localize the "NK-" statement number prefix or explain it.
- **Minor:** Explain "Imputable" and "Reloué" at the field or counter (help text), not only in the glossary.
- **Minor:** Name the buildings of the 7 drafts in the "Vérifier et envoyer les décomptes" card, so the two cards do not seem to contradict each other.
- **Minor:** Save the chosen language in the user account so it carries over to other devices.
