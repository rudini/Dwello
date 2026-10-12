# Persona run: Marco (Italiano, mobile 390 px)

Marco, 38, from Ticino, on his smartphone (390 px, zoom 1), little time. Task: switch the app to Italian, create the utility cost statements (conteggi spese accessorie) for the previous year (2025) for one building as far as the preview and the drafts, and check every screen for horizontal scrolling, cut text and non-Italian text.

## 1. Task completed

**Yes.** I switched to Italiano from the header, started "Allestire i conteggi" from the dashboard, chose Alpenblick (the building the dashboard named as "Non ancora conteggiati"), picked the heating profile "Riscaldamento Montagna", reviewed the preview with its missing-invoice warning, confirmed "Allestire comunque i conteggi" and pressed "Creare le bozze". Two drafts were created (Laura Keller NK-33333333-2025-0001, Kevin Fischer NK-33333333-2025-0002) and I opened one to check it.

## 2. Effort

- Screens: dashboard, language menu, wizard steps 1 to 5, success state, drafts list, statement detail, navigation menu (about 10).
- Clicks: about 12 for the main path (language 2, start 1, Avanti 4, building 1, profile 1, confirmation 1, create 1, view drafts 1).
- Time: roughly 4 to 5 minutes for a first-timer; most of it was reading the long help text in step 3.

## 3. Thinking aloud

1. The app opens in German. The language control "Deutsch" with a translation icon is in the header, easy to find with the thumb; the list shows "Deutsch, Français, Italiano, English" in their own names. One tap and everything switches, including the screen reader labels ("Lingua: Italiano", "Aprire il menu"). `html lang` becomes `it`.
2. Dashboard ([screenshot](screens/marco-i18n/03-dashboard-it.png)): "Prossimo passo – Allestire i conteggi spese accessorie … Non ancora conteggiati: Alpenblick." Great, it tells me exactly which building is left. I tap "Allestire i conteggi".
3. Step 1 "Periodo di conteggio": 01.01.2025 – 31.12.2025 already filled in, with the weekday written out ("mercoledì, 1 gennaio 2025"). Nothing to do, "Avanti".
4. Step 2 "Immobili" ([screenshot](screens/marco-i18n/05-step2.png)): three building cards with a checkbox, "6 fatture nel periodo di conteggio", "3 appartamenti". The address and the invoice count are squeezed into a narrow column ("Bergstrasse / 8, 3800 / Interlaken") because "3 appartamenti" sits on the right; for Musterhaus Zentrum even "6 / appartamenti" breaks. Readable, but cramped. I tick Alpenblick.
5. Step 3 "Profilo di riscaldamento e spese di gestione" ([screenshot](screens/marco-i18n/06-step3.png)): first a wall of about 15 lines of text before the dropdown. I skimmed it; in a hurry I would not read it. The dropdown text is cut: "Riscaldamento + acqua calda (10" – the "(100%)" is clipped. I chose "Riscaldamento Montagna (100%)" because Interlaken is in the mountains; nice that there is also "Riscaldamento Ticino". The month chart is clear (Gen … Dic with %). "Spese di gestione in %" prefilled with 3, again with a long paragraph above.
6. Step 4 "Anteprima" ([screenshot](screens/marco-i18n/07-step4.png)): summary tiles (2 conteggi, CHF 5'031.15), then a yellow warning "Forse mancano fatture": Spazzacamino missing, Acqua fredda 2nd semester missing. Clear and well explained. I pressed "Avanti" without ticking: the error "Confermi che i conteggi devono essere allestiti comunque." appears at the checkbox – good. In the per-contract list, "Costi CHF 2'130.83" is indented a few pixels to the right of "Rimborso CHF 149.15", which looks like a misalignment.
7. Step 5 "Allestimento" ([screenshot](screens/marco-i18n/09-step5.png)): "Verranno allestiti 2 conteggi spese accessorie come bozze. Non viene inviato nulla." Reassuring. "Creare le bozze".
8. Success: "2 conteggi spese accessorie sono stati allestiti come bozze." with "Visualizzare le bozze" and "Allestire altri conteggi". Done.
9. Drafts list: the two new Alpenblick drafts at the top with "Rimborso CHF …" and the badge "Bozza". No horizontal scroll.
10. Detail ([screenshot](screens/marco-i18n/12-detail.png)): the cost table becomes stacked cards on mobile, readable. The H1 "Conteggio NK-33333333-2025-0001" breaks inside the number ("NK-" / "33333333-2025-0001"). The "Cronologia" says "Creato 12.10.2026, 12:08", while the wizard had shown "Bozza salvata, 10:07" a minute earlier – two hours apart.
11. Navigation menu: fully Italian ("Gestire", "Spese accessorie", "Impostazioni e aiuto", "Profili di riscaldamento").

## 4. Language

Not in my language:
- "NK-…" prefix of every statement number (list, detail H1, PDF link label "Conteggio NK-…"): NK is the German abbreviation of Nebenkosten. In Italian I would expect "SA-…" or a neutral prefix. Probably intentional (stable number), but it is visibly German.
- Demo data: apartment names "Appartamento EG", "Appartamento OG1" (EG/OG are German floor abbreviations), street names. This is data, not UI text, so acceptable.
- Not visible but noticed in a link: the return URL of "Registrare una fattura" contains `schritt=3` (German). Invisible to most users.

Everything else on every screen of the path was Italian, including screen reader labels, date words ("mercoledì, 1 gennaio 2025"), month abbreviations and the page title "Allestire i conteggi - Dwello".

Words that read oddly or that I had to think about:
- "Bozza" is used for two different things: the saved wizard state ("Bozza salvata, 10:07") and the statement drafts ("Creare le bozze"). On step 5 I briefly wondered if "Bozza salvata" meant the statements were already created.
- "Rimborso prima dell'arrotondamento" and "Arrotondamento a 5 centesimi": fine.
- "Allestire" is correct Swiss-Italian administrative language, ok for me; an Italian from Italy would rather say "Creare/Preparare".
- "Riscaldamento + acqua calda" as a profile name next to "Riscaldamento Altipiano/Montagna/Ticino": unclear how it differs; it is the preselected default.

## 5. Layout at 390 px

- No horizontal page scrolling on any screen (scrollWidth = 390 everywhere).
- Language control: fits in the header next to the menu and user icons; label "Italiano" fully visible.
- Clipped: the heating profile dropdown in step 3 cuts the option text ("Riscaldamento + acqua calda (10").
- Cramped: building cards in step 2 wrap the address and invoice count into a very narrow column; "6 appartamenti" wraps onto two lines.
- Awkward wrap: H1 on the statement detail breaks inside "NK-33333333-2025-0001".
- Small misalignment: "Costi CHF …" indented relative to "Rimborso CHF …" in the step 4 per-contract list.

## 6. Error risks

- Step 3: the important rule (meter readings at tenant change, consumption-based billing must be done outside Dwello) is buried in a 15-line paragraph above the dropdown. On a phone, in a hurry, I skipped it. Someone with heat cost allocators could create wrong drafts without noticing.
- Step 3: the default heating profile is "Riscaldamento + acqua calda", not a regional one; one "Avanti" too fast and the wrong profile is used.
- Time stamps disagree: "Bozza salvata, 10:07" (wizard) vs "Creato … 12:08" (detail) for the same minute. Looks like one is UTC and one Swiss time; could confuse when checking what was done when.
- Missing-invoice confirmation is properly enforced, good.

## 7. Suggestions

- **Major** – Step 3: shorten the heating profile help to two sentences at the field and move the "do it outside Dwello if you have meters/allocators" rule into a visible callout (or a yes/no question) so it cannot be skipped on mobile.
- **Minor** – Heating profile dropdown clips its option text at 390 px; shorten the labels or drop the "(100%)" suffix from the visible text.
- **Minor** – Wizard "Bozza salvata, HH:MM" shows a time two hours off from the statement's "Creato" time; use the same (Swiss) time zone.
- **Minor** – Use a different word for the saved wizard state (e.g. "Avanzamento salvato") so it is not confused with the statement drafts ("bozze").
- **Minor** – Step 2 building cards: put "N appartamenti" under the address on narrow screens instead of in a right column.
- **Minor** – Statement number prefix "NK-" is German in all languages; consider a language-neutral prefix or accept and document it.
- **Minor** – Detail H1 breaks inside the statement number; keep the number together (no break after "NK-").
- **Minor** – Align "Costi" and "Rimborso" lines in the step 4 per-contract list.

Blocker: none.
