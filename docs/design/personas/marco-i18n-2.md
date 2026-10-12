# Persona run: Marco (Italiano, mobile 390 px), confirmation run 2

Marco, 38, from Ticino, on his smartphone (390 px, zoom 1), little time. Task: switch the app to Italian, create the utility cost statements (conteggi spese accessorie) for the previous year (2025) for one building as far as the preview and the drafts (send nothing), note German, cut-off text and sideways scrolling, then sign out with the app's own control and check the sign-in page in Italian (privacy and terms links, language stays).

## 1. Task completed

**Yes.** Switched to Italiano in the header, started "Allestire i conteggi" from the dashboard, chose Alpenblick (named by the dashboard as "Non ancora conteggiati"), picked "Riscaldamento Montagna", checked the preview with its missing-invoice warning, confirmed "Allestire comunque i conteggi" and pressed "Creare le bozze". Two drafts were created (Laura Keller NK-33333333-2025-0001, Kevin Fischer NK-33333333-2025-0002); nothing was sent. Signed out via "Menu utente" > "Disconnettersi"; the sign-in page is in Italian, both legal links open Italian pages and the language stays Italian. One problem after signing out: the legal pages still show the signed-in header (see 3.10).

## 2. Effort

- Screens: dashboard, language menu, wizard steps 1 to 5, success state, drafts list, statement detail, user menu, sign-in page, privacy, terms (about 13).
- Clicks: about 12 for the statement path (language 2, start 1, Avanti 4, building 1, profile 1, confirmation 1, create 1, view drafts 1), 2 to sign out, 4 for the legal pages.
- Time: roughly 4 to 5 minutes; most of it reading the long help text in step 3.

## 3. Thinking aloud

1. The app opens in German. The language control "Deutsch" with a translation icon sits in the header; the list shows "Deutsch, Français, Italiano, English". One tap on "Italiano" and everything switches, including screen reader labels ("Lingua: Italiano", "Aprire il menu", "Menu utente", "Passare al contenuto"); `html lang="it"`.
2. Dashboard ([screenshot](screens/marco-i18n-2/03-dash-it.png)): "Prossimo passo – Allestire i conteggi spese accessorie … Non ancora conteggiati: Alpenblick." Clear. Tile labels stay singular next to counts: "7 Bozza", "9 Locato", "4 Sfitto", "9 Pagato". Reads like a label rather than a sentence, acceptable.
3. Step 1 "Periodo di conteggio": 01.01.2025 – 31.12.2025 prefilled with "mercoledì, 1 gennaio 2025". "Avanti".
4. Step 2 "Immobili": building cards are still cramped; "N appartamenti" takes a right column so the address and "6 fatture nel periodo di conteggio" wrap into a narrow column of 4–5 lines, and "6 / appartamenti" breaks for Musterhaus Zentrum. Readable. I tick Alpenblick.
5. Step 3 ([screenshot](screens/marco-i18n-2/06-step3.png)): still a 20-line paragraph above the heating profile dropdown, plus a 7-line paragraph above "Spese di gestione in %". On the phone I scroll past it. The dropdown is no longer cut off: options now read "Riscaldamento + acqua calda / Altipiano / Montagna / Ticino" without "(100%)" and fit. Default is still "Riscaldamento + acqua calda"; I pick "Riscaldamento Montagna". Month chart (Gen … Dic with %) wraps into three rows, clear.
6. Step 4 "Anteprima" ([screenshot](screens/marco-i18n-2/08b-btn.png)): tiles (2 conteggi, CHF 5’031.15, profile, 3 %), then the yellow "Forse mancano fatture" box (Spazzacamino missing, Acqua fredda 2° semestre missing). Good explanation. "Registrare una fattura" wraps onto two lines inside its button, fine. Pressing "Avanti" without ticking shows "Confermi che i conteggi devono essere allestiti comunque." at the checkbox. In "Conteggi per contratto di locazione" the "Costi CHF …" line is still indented differently per row (right-aligned) while "Rimborso CHF …" is left-aligned; looks misaligned.
7. Step 5 "Allestimento": "Verranno allestiti 2 conteggi spese accessorie come bozze. Non viene inviato nulla." plus a reminder about the missing invoices. Reassuring. "Creare le bozze".
8. Success: "2 conteggi spese accessorie sono stati allestiti come bozze." with "Visualizzare le bozze" / "Allestire altri conteggi".
9. Drafts list and detail ([screenshot](screens/marco-i18n-2/12-detail-top.png)): the two new drafts on top, badge "Bozza". Detail H1 still breaks inside the number ("Conteggio NK-" / "33333333-2025-0001"). Cost table as stacked cards, readable. "Cronologia: Creato 12.10.2026, 15:35", while the wizard said "Bozza salvata, 13:35" a minute earlier: still two hours apart.
10. Sign out: "Menu utente" shows my e-mail, "Impostazioni", "Disconnettersi". After "Disconnettersi" I land on "Accedere" ([screenshot](screens/marco-i18n-2/14-login.png)), fully Italian, language control "Italiano" at the top, "Accedere con Google", "Accedendo accetta le Condizioni d’uso", footer "Protezione dei dati", "Condizioni d’uso". Both links open Italian pages in the same tab, `lang="it"`, back returns to the Italian sign-in page. **But:** when I tap "Protezione dei dati" or "Condizioni d’uso" right after signing out, the page shows the full signed-in header again: hamburger with the whole app navigation, and "Menu utente" still listing "verwalter@example.com", "Impostazioni" and "Disconnettersi" ([screenshot](screens/marco-i18n-2/15c-privacy-usermenu.png)). It made me think the sign-out had failed. Tapping "Inquilini" in that menu does send me to the sign-in page (session cookie is gone), so no data is shown, but the e-mail address is. After a page reload the same page correctly shows only "Accedere" and the language control, and the same links opened from a freshly loaded sign-in page are correct too, so it is stale state carried over from the signed-in session.

## 4. Language

Not in my language:
- "NK-…" prefix of every statement number (list, detail H1, PDF link "Conteggio NK-…"): German abbreviation of Nebenkosten. Unchanged from the first run.
- Demo data: "Appartamento EG", "Appartamento OG1" (German floor abbreviations), street names. Data, acceptable.
- Return URL of "Registrare una fattura" still contains `schritt=3` (invisible to most users).

Everything else on every screen of the path, the sign-in page and both legal pages was Italian, including screen reader labels and page titles ("Allestire i conteggi - Dwello", "Accedere - Dwello", "Protezione dei dati - Dwello", "Condizioni d’uso - Dwello").

Reads oddly:
- "Bozza" for both the saved wizard state ("Bozza salvata, 13:35") and the statement drafts ("Creare le bozze").
- Singular labels with plural counts on the dashboard and filter tiles ("7 Bozza", "9 Pagato", "9 Locato").
- Privacy page: "Caratteri e simboli sono caricati da Google Fonts" – surprising, I did not expect an external font service.

## 5. Layout at 390 px

- No horizontal page scrolling on any screen (scrollWidth = 390 everywhere, including sign-in, privacy, terms).
- Language control fits in the header ("Italiano" fully visible) and at the top of the sign-in page.
- Fixed since run 1: the heating profile dropdown no longer clips its text.
- Still cramped: step 2 building cards (address and invoice count in a narrow column, "6 / appartamenti" wraps).
- Still awkward: detail H1 breaks after "NK-".
- Still misaligned: "Costi CHF …" vs "Rimborso CHF …" in the step 4 per-contract list.

## 6. Error risks

- After signing out, the legal pages show the signed-in header with the user's e-mail and a "Disconnettersi" button. On a shared or borrowed phone the next person sees who was signed in, and the user may believe the sign-out did not work.
- Step 3: the rule "if meters were read or allocators exist, bill outside Dwello and delete the drafts" is buried in a 20-line paragraph; easy to skip on a phone.
- Step 3: default profile is "Riscaldamento + acqua calda", not regional; one quick "Avanti" uses it.
- Times disagree: "Bozza salvata, 13:35" (wizard, apparently UTC) vs "Creato 12.10.2026, 15:35" (detail, Swiss time).
- Missing-invoice confirmation is enforced: good.

## 7. Suggestions

- **Major** – After "Disconnettersi", navigating from the sign-in page to "Protezione dei dati" / "Condizioni d’uso" shows the signed-in header (app menu, user menu with e-mail, "Impostazioni", "Disconnettersi"). Clear the user/session state on sign-out (or reload after sign-out) so the legal pages show the signed-out header ("Accedere" + language) as they do after a reload.
- **Major** – Step 3: shorten the heating profile help to two sentences at the field and put the "meters/allocators → bill outside Dwello" rule in a visible callout or yes/no question. (Unchanged from run 1.)
- **Minor** – Wizard "Bozza salvata, HH:MM" is two hours off the statement's "Creato" time; use Swiss time.
- **Minor** – Use another word for the saved wizard state (e.g. "Avanzamento salvato") to avoid confusion with "bozze".
- **Minor** – Step 2 building cards: put "N appartamenti" under the address on narrow screens.
- **Minor** – Detail H1: do not break inside the statement number.
- **Minor** – Align "Costi" and "Rimborso" lines in the step 4 per-contract list.
- **Minor** – Statement number prefix "NK-" is German in all languages; consider a neutral prefix or document it.
- **Minor** – Count tiles: plural labels with counts ("7 bozze", "9 pagati") or a label form that does not read as a wrong plural.

Blocker: none.
