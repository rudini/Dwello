# Persona test: Anna (first-time landlord, returning after months), run 4

Date: 2026-10-10 · Desktop 1440x900 · demo data · started at `/dashboard`

## 1. Task completed: partly

I found the next step and reached the page where it is done (the draft statement with «Versenden»). I did not press «Versenden» in this run. The deadlines question is only half answered: the dashboard says there are no deadlines, but the app never told me that the 2025 statements are missing.

## 2. Effort

About 3 clicks and 3 pages to reach the right page (Übersicht → «Entwürfe ansehen» → eye icon «Ansehen»). Then roughly 5 more pages to double-check deadlines (Hilfe, Mietverträge, all statements, «Abrechnungen erstellen»). About 2 minutes; fast start, doubt afterwards.

## 3. Walkthrough (thinking aloud)

- **Übersicht** ([01](screens/anna-4/01-dashboard.png)): "Was jetzt zu tun ist und welche Fristen anstehen." That is exactly my question. The «Nächster Schritt» box says «Abrechnungen prüfen und versenden – 1 Nebenkostenabrechnung ist noch im Entwurf». Under «Fristen» it says «In den nächsten Wochen stehen keine Fristen an.» I click «Entwürfe ansehen».
- **Nebenkostenabrechnungen, filtered to drafts** ([02](screens/anna-4/02-drafts.png)): one row, Anna Schmidt, «Periode 1.1.2024 - 31.12.2024», «CHF 83.43 Rückerstattung», «Entwurf». I click the name and nothing happens. Then I find two small icons under «Aktionen» and guess that the eye means "open". The heading says «1 Abrechnungen» (plural with 1). The blue «Abrechnungen erstellen» button is louder than anything about my draft.
- **Statement detail** ([03](screens/anna-4/03-detail.png)): here I have to "prüfen". The cost lines are in English: «Heating», «Cold Water», «Caretaker», «Garden Maintenance». The «Verteilschlüssel» column is empty in every row. Heating is 18.68 %, everything else 16.67 %, and I cannot tell why. «Wohnung 1.02 · 1»: what is the "1"? «Zahlungsfrist 9.11.2026»: that is a deadline, but the dashboard said there were none. Then I noticed it is a refund, so maybe the deadline is mine (I have to pay the tenant)? Unclear. «Versenden» is the obvious next click, and **this is where I stopped**.
- **Deadline check:** «Hilfe» ([05](screens/anna-4/05-help.png)) is a helpful step-by-step page, but it refers to «Verträge», «Abrechnungen» and «Konfiguration», and none of those names appear in the menu. «Mietverträge»: all «AKTIV», with no end dates or notice periods. Back in all statements, the only ones that exist are for **2024**. Today is October 2026. Where is 2025? Nobody told me I still have to produce a whole year of statements for 9 tenants. That may be the real most urgent thing, and the dashboard reports "no deadlines".
- **«Abrechnungen erstellen»** ([07](screens/anna-4/07-create.png)): a 4-step wizard. «Heizungsprofil» options «Heating Mittelland», «Hot Water Only» (English again). «Verwaltungspauschale», «Verteilung der Pauschale», «Pro Einheit». I would not know what to choose. There is also a typo: «Mietstagen».

## 4. Points of confusion / terms not understood

- «Verteilschlüssel» (menu, detail column): I can guess the meaning, but the column is empty, so I don't know which key was used.
- «Heizprofile» / «Heizungsprofil» (menu, wizard): what does a profile do, and why does it matter?
- «Wiedervermietet», «Gesperrt» (dashboard tiles): when is an apartment "gesperrt"?
- «Akontozahlungen» (detail): I roughly understand it; a one-line hint would help.
- «Verwaltungspauschale» vs «Verwaltungsgebühr (3%)»: two words, the same thing?
- «Pro Einheit» vs «Gleichmässig pro Wohnung» (wizard): what is the difference?
- «Wohnung 1.02 · 1» / «Wohnung A1 ·» (list): a dangling number and a dangling dot.
- «Zahlungsfrist» on a refund: who pays whom by when?
- English category and profile names in a German UI.
- Help page names («Verträge», «Abrechnungen», «Konfiguration») that don't match the menu.

## 5. Error risks

- **«Versenden»**: will it email Anna Schmidt immediately? Is there a confirmation, a preview of the email, or an undo? The button label doesn't say. I didn't dare.
- **Checking a statement I can't verify**: the empty «Verteilschlüssel» and the unexplained 18.68 % make me want to send it anyway, just to be done with it.
- **«Löschen»** sits right next to «Bearbeiten» with the same weight.
- **Missing 2025 statements**: the risk is the deadline I don't see. Under Swiss rules, a statement sent too late can mean losing the claim. The «Fristen» box gives me false comfort.
- **Wizard**: picking a heating profile or a fee distribution I don't understand could produce wrong statements for every tenant.

## 6. Improvement suggestions

- **Blocker**: «Fristen» / «Nächster Schritt» should flag periods that ended without a statement ("Abrechnung 2025 für 3 Gebäude noch nicht erstellt"). Right now "keine Fristen" is misleading.
- **Major**: «Versenden» needs a confirmation that says what happens (email or letter, to whom, with a PDF preview).
- **Major**: In the statement detail, show the «Verteilschlüssel» used for each line and explain the share (for example "62 m² von 340 m²").
- **Major**: Translate category and heating-profile names into German.
- **Major**: Make the whole list row (or the name) clickable. The eye icon alone is easy to miss.
- **Minor**: Make help-page names match the menu («Mietverträge», «Nebenkostenabrechnungen», «Einstellungen»).
- **Minor**: On a refund, explain «Zahlungsfrist» ("Sie zahlen dem Mieter bis …").
- **Minor**: Add short tooltips for «Gesperrt», «Wiedervermietet», «Akontozahlungen», «Pro Einheit», «Heizprofile».
- **Minor**: Fix «1 Abrechnungen», «Mietstagen», and the stray «· 1» / «·» after apartment numbers.
- **Minor**: Use one name for the fee: «Verwaltungsgebühr» or «Verwaltungspauschale».
- **Minor**: Use one colour for primary buttons (teal on the dashboard, bright blue on the statements pages).
