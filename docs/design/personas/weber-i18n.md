# Persona run: Dr. Weber (i18n, Français, desktop)

Dr. Weber, 52, lawyer from Lausanne, legally cautious. Desktop viewport (1440 px), French UI.
Task: check an existing statement (décompte des charges), understand the cost table, the warnings and the help, judge whether the French terms are legally correct for Switzerland, open the PDF preview and compare its French with the app's French, and read the privacy and terms pages in French.

Screenshots: `screens/weber-i18n/`.

## 1. Task completed

**Partly.** I could switch to French, read two statements in full (one sent, one draft), open the send dialog with "Voir le PDF", read the French PDF (QR bill included), read the help and the warnings in the generation wizard, and read privacy and terms while signed in. Two things stopped me from finishing the legal check:
- I could not read the terms or the privacy notice **before** signing in. The login page says "En vous connectant, vous acceptez les Conditions d’utilisation", but that link sends me back to the login page.
- The privacy notice does not match what the app does (Google Fonts, cookies, Microsoft login), so I cannot sign off on it as accurate.

## 2. Effort

About 12 screens (dashboard, statement list, 4 statement details, edit page, 3 dialogs, generation wizard steps 1 to 4, help, documents, privacy, terms, login). About 45 clicks, about 35 minutes including reading the PDFs. I did not send, pay, delete or generate anything. Every dialog was cancelled.

## 3. Thinking aloud

1. The app opens in German. The language button "Sprache: Deutsch" at the top right is easy to find. "Français" switches at once and stays set when I go to other pages. Good.
2. Dashboard: "La période de décompte 01.01.2025 – 31.12.2025 est terminée. Immeubles sans décompte : Alpenblick." That is clear French. "Délai de paiement · Hans Müller dans 16 jours" is fine.
3. Statement list ("Décomptes des charges"): each row shows "Montant à payer CHF 91.40" or "Remboursement CHF 93.85". That is a clear split. The number "NK-22222222-2025-0004" uses the German abbreviation "NK" (Nebenkosten), which means nothing to a French reader. It also appears on the tenant's French PDF and QR bill.
4. Statement detail, NK-11111111-2025-0001 ([01](screens/weber-i18n/01-statement-detail.png)): the table "Détail des coûts" has the columns "Catégorie / Clé de répartition / Coûts de l’immeuble / Part / Montant". The calculation below the table is easy to follow: "Sous-total → Frais de gestion 3 % du sous-total → Coûts totaux → Acomptes versés → Montant à payer avant arrondi → Arrondi à 5 centimes → Solde : Montant à payer". "Arrondi à 5 centimes" with "+ CHF 0.02" or "− CHF 0.02" is correct for Switzerland.
5. The column "Part" shows only a percentage (15.33 %). I cannot see where the percentage comes from (75.50 m² of 492.50 m²). The PDF shows that ("75.50 / 492.50 m²"), but the app does not. In a dispute I would want this in the app too.
6. "Historique" of the sent statement: "Créé 12.10.2026, 11:55 … Envoyé 28.09.2026". The statement was sent before it was created. That is probably demo data, but a lawyer reading this as evidence of when the tenant was notified would be confused.
7. The address shows "Bahnhofstrasse 42" without postcode or town. The PDF has "8001 Zürich".
8. Draft statement for Pierre Dubois: "Marquer comme envoyé" opens a dialog ([02](screens/weber-i18n/02-send-dialog.png)): "Dwello n’envoie pas le décompte lui-même. Remettez le PDF au locataire… Dwello date le décompte du jour où vous le marquez comme envoyé. Remettez donc le PDF le même jour." This is a good and honest warning, because the date of delivery matters for the payment deadline. Twice, the first click on the button did nothing (the page was probably not ready yet). The third click opened the dialog.
9. "Voir le PDF" opens the PDF in a new tab (inline). Note that "Télécharger le PDF" on the detail page always downloads, so the only preview is inside the send dialog. The file name is German: "abrechnung-….pdf".
10. French PDF for Pierre Dubois ([03](screens/weber-i18n/03-pdf-page1-fr.png), [04](screens/weber-i18n/04-pdf-page2-fr.png)): legally this is the best part of the app. The "Remarques" section says "Vous-même ou une personne mandatée pouvez consulter les pièces justificatives… (art. 257b al. 2 CO)" and "Vous pouvez demander un décompte détaillé des frais de chauffage et d’eau chaude (art. 8 al. 1 OBLF)" and "(art. 8 al. 2 OBLF)". The citations are correct, in French Swiss form ("art. … al. … CO", OBLF and not VMWG). The QR bill uses the official SIX French wording ("Récépissé", "Section paiement", "Compte / Payable à", "Payable par", "Informations supplémentaires", "Monnaie", "Montant", "Point de dépôt", "À détacher avant le versement").
11. The PDF language follows the **tenant's** language: Hans Müller's PDF is German (with "Art. 257b Abs. 2 OR", "VMWG"), Marco Bernasconi's is Italian, Pierre Dubois's ("Langue : Français" on his tenant page) is French. That is legally right. The app never tells me this, though. With the app in French I download a German PDF and do not know why until I find the "Langue" field on the tenant page.
12. Comparing the app and the PDF (French): the same things have different names, see section 4. The worst case: "Part" in the app is a percentage, while "Part du logement" in the PDF is a CHF amount.
13. "Modifier le délai et les remarques": a clear form. The help under the date field, "Date à laquelle le locataire doit avoir payé le montant dû", is good. "Les coûts et les frais de gestion … ne peuvent pas être modifiés ici. Pour une correction, supprimez le brouillon…" is clear.
14. Delete dialog: "Le décompte NK-11111111-2025-0003 de Pierre Dubois sera supprimé. Cette action est irréversible." Fine. Payment dialog: "Vous ne pourrez ensuite plus envoyer de rappel." That is a good consequence statement. However, "Hans Müller: Montant à payer CHF 215.80" is missing the space before the colon, which French typography requires.
15. Warnings in the generation wizard (step 3, I stopped at step 4, "Aperçu"). The heating-profile text is long but legally careful: it says that meter readings at a tenant change take precedence ("ces valeurs font foi"), and that consumption-based billing ("décompter selon la consommation") is generally required with meters. The text about management fees is correct and important: "Ne demandez des frais de gestion que s’ils sont convenus dans le contrat de bail. Sinon, saisissez 0." (This matches art. 257a al. 2 CO.) But "L’usage est de 3 % au maximum" is stated as a rule without a source, and local practice varies.
16. Step 4 says "Nombre de décomptes 0 … Tous les contrats de bail ont déjà un décompte dans cette période" for Alpenblick, while the dashboard says "Immeubles sans décompte : Alpenblick". These two messages contradict each other. Which one is right? The link text also reads "Voir les décomptes de Alpenblick" ("d’Alpenblick" would be correct).
17. Help ("Aide"): well-written French. "Les termes en bref" is useful. "Rappel" is defined as "rappel de paiement, puis au plus un 2e et un 3e rappel". Nothing says that a rappel is **not** the formal notice with a deadline and threat of termination under art. 257d CO (30 days for housing). A layperson could think a "3e rappel" lets them terminate the lease.
18. Documents: "Pas encore de documents." No rappel exists in the demo data, so I could not check the French reminder letter itself.
19. Privacy ([05](screens/weber-i18n/05-privacy.png)): clear, short French. Problems in substance:
    - "Les polices et les symboles sont chargés depuis Google Fonts. Google reçoit alors l’adresse IP du navigateur." In my session every request went to localhost only. The notice states a transfer that does not happen.
    - "La connexion se fait via Google ou Microsoft." The login page only offers Google.
    - "Cookies": the notice names two cookies, but the app also sets a third one for the language (PARAGLIDE_LOCALE).
    - It does not name who is responsible for the data ("responsable du traitement"), does not mention the right of access (art. 25 nLPD) or how long data is kept, and does not say in which country Resend processes e-mails (disclosure abroad, art. 16 nLPD).
20. Terms ("Conditions d’utilisation"): short. "Le gérant d’immeubles reste responsable de l’exactitude des données saisies…" is good. Problems: it switches between "la gérance" and "le gérant d’immeubles", and there is no clause on applicable law or limitation of liability. "Chaque décompte devrait être vérifié avant l’envoi" is fine.
21. Signed out ([06](screens/weber-i18n/06-login-terms-link.png)): the login page keeps French (the "Langue : Français" button at the top right). The link "Conditions d’utilisation" sends me back to `/login`. `/privacy` also redirects to the login page. I am asked to accept terms I cannot read, and the login page has no link to the privacy notice at all.

## 4. Language

**Text not in French (French UI):**
- "NK-…" in every statement number (app list, detail, PDF, QR bill "Informations supplémentaires"). This is a German abbreviation.
- PDF file name "abrechnung-<id>.pdf", and the preview URL "…/pdf?ansehen". Only the file name is visible to users.
- Demo data: "Bahnhofstrasse", "Musterhaus Zentrum", "Muster Immobilien AG". This is fine, because it is data.
- PDFs for German or Italian tenants are in German or Italian. This is correct, but the app does not explain it (see 3.11).

**App vs PDF (both French, same statement):**

| App | PDF |
|---|---|
| "Détail des coûts" | "Aperçu des coûts (CHF)" |
| column "Part" (percentage) | "Part du logement" (CHF amount) and "Part temporelle" |
| column "Montant" | "Votre part" |
| "Coûts totaux" | "Vos frais accessoires" |
| "Solde : Montant à payer" | "Montant à payer" |
| "Appartement 2.01" | "Appartement 2.01, 2e étage" and "1 / 6 logements" |
| "Chauffage (surface 70% / unité 30%)" | the same, plus the calculation "70 % × 85.00 / 492.50 m²" |

The meaning is consistent apart from "Part", but I would have to explain to a tenant on the phone that "Coûts totaux" in my screen is "Vos frais accessoires" on their letter.

**Legal terminology:**
- "Frais de gestion": the OBLF term (art. 4 al. 3) is "frais administratifs" (for preparing the statement). "Frais de gestion" is used in practice but is not the legal term.
- "Décompte des charges" against "frais accessoires": art. 257a CO and the OBLF say "frais accessoires", and the PDF summary also says "Vos frais accessoires". The app mixes both: the sidebar group is "Frais accessoires" and the item is "Décomptes des charges". This is common usage in Romandie and acceptable, but not consistent.
- "Délai de paiement": correct. "Acomptes versés": correct. "Bail", "Contrat de bail", "bailleur": correct.
- "Rappel", "2e rappel", "3e rappel": acceptable for payment reminders. A link to "avis comminatoire (art. 257d CO)" is missing (see 6).
- "Loyer supplémentaire" (garage, parking) reads oddly. In Romandie a lease lists "loyer place de parc", "loyer garage", or "autres prestations".
- "Bloqué" as a rental status and "Canal de correspondance" are understandable but unusual ("mode d’envoi" would be more natural).

**Odd wording or typography:**
- PDF: "Veuillez payer le montant jusqu’au 11.11.2026 avec la section paiement." Better: "Veuillez verser ce montant d’ici au 11.11.2026 au moyen de la section paiement ci-jointe."
- Missing space before the colon: "Étape 2 sur 5: Immeubles" (wizard headings; the progress text above correctly has "Étape 2 sur 5 : Immeubles"), "Hans Müller: Montant à payer" (payment dialog).
- "70%" without a space, next to "16.67 %" with a space.
- "Voir les décomptes de Alpenblick" should be "d’Alpenblick".
- "Montant à payer avant arrondi" wraps onto two lines in the PDF table.

## 5. Layout at my viewport (1440 px desktop)

- No overflow and no clipped text. The table fits. Long category names wrap cleanly ("Électricité parties communes").
- The language control is visible at the top right on every page, including the login page ("Langue : Français"), and the choice persists.
- The summary below the table is narrow on the left and wide on the right. The amounts are far from their labels, but this is readable.

## 6. Error risks

1. **Terms not readable before acceptance.** Consent to terms that cannot be opened is legally weak, and the privacy notice cannot be reached before sign-in either.
2. **Inaccurate privacy notice** (Google Fonts, Microsoft login, missing language cookie). An inaccurate notice is worse than a short one under the nLPD duty to inform (art. 19 nLPD).
3. **Rappel and art. 257d CO**: nothing warns that the reminders are not a formal notice with a deadline and threat of termination. Landlords with little experience may terminate on the basis of a "3e rappel".
4. **PDF language differs from UI language without notice.** I might send a German PDF to a tenant whose "Langue" was set wrongly, or wonder whether the PDF is broken.
5. **Contradiction between dashboard and wizard** about Alpenblick ("sans décompte" against "tous les contrats de bail ont déjà un décompte").
6. **"Historique" dates** (sent before created) undermine its value as a record of delivery.
7. "Marquer comme envoyé" sometimes needed several clicks before the dialog appeared.
8. "L’usage est de 3 % au maximum" is presented as a fixed rule.

## 7. Suggestions

- **Major:** make `/terms` and `/privacy` reachable without signing in, and link both from the login page. Currently "Conditions d’utilisation" on the login page loops back to the login page.
- **Major:** correct the privacy notice: remove or verify the Google Fonts statement, mention only the login providers that are offered, list the language cookie, and add the responsible party, the right of access, the retention period and the country of the e-mail service.
- **Major:** in the help ("Rappel") and in the reminder flow, state that a rappel is not the formal notice under art. 257d CO, and that a termination for arrears requires that notice and the official form.
- **Major:** show the PDF's language near "Télécharger le PDF" and "Voir le PDF" ("PDF en allemand – langue du locataire"), with a link to change the tenant's language.
- **Minor:** align the app labels with the PDF ("Coûts totaux" / "Vos frais accessoires", "Montant" / "Votre part", "Détail" / "Aperçu"), and stop using "Part" for a percentage in the app while the PDF uses "Part du logement" for an amount. Show the key fraction ("75.50 / 492.50 m²") in the app as the PDF does.
- **Minor:** use "frais administratifs" (art. 4 al. 3 OBLF) or add it as an explanation. Use "frais accessoires" consistently, or explain that "charges" means the same thing.
- **Minor:** do not use the German "NK-" in statement numbers and PDF file names in French (for example "DC-" or a neutral prefix), or at least explain it.
- **Minor:** French typography: a non-breaking space before ":" ("Étape 2 sur 5 : …", "Hans Müller : …"), "70 %", and "d’Alpenblick".
- **Minor:** rephrase the PDF sentence "jusqu’au … avec la section paiement" to "d’ici au … au moyen de la section paiement ci-jointe".
- **Minor:** soften "L’usage est de 3 % au maximum" to "selon l’usage local, souvent 3 % au plus" with a reference to art. 4 al. 3 OBLF.
- **Minor:** resolve the Alpenblick contradiction between the dashboard and the wizard, and the "Envoyé" date that comes before "Créé" in "Historique".
- **Minor:** in the terms, use one term for the user ("gérant" or "gérance") and add applicable law and a liability clause.
