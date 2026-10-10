# Persona test: Anna (5)

Anna, 29, first-time landlord. She is back in the app after several months and does not remember how it works. Desktop viewport (1440x900), demo data, today is 10.10.2026.

**Task:** starting at `/dashboard`, find out what to do next and which deadlines are coming up. Then follow the most important suggestion far enough to know how to do it, without sending anything to tenants.

## 1. Task completed

**Partly.** Within seconds I knew what the app wanted me to do: create the 2025 statements. I also learned how the wizard works. But following that suggestion would have produced 9 statements with **CHF 0.00 costs**, because no invoices for 2025 exist. The app showed this but never warned me about it. It also left out something more urgent: a statement from **2024** is still unsent. And "keine Fristen" left me unsure whether anything was due at all.

## 2. Effort

- Clicks from the dashboard to the end of the wizard (not submitted): 6
- Pages visited: dashboard, wizard steps 1 to 4, invoices list, drafts list, draft detail
- Time to understand "what's next": under 10 seconds
- Time to see that the next step was a trap: about 3 minutes, and only because I went to Rechnungen on my own
- One dead end: clicking the draft row did nothing; only the small eye icon opens it

## 3. Walkthrough (thinking aloud)

**Dashboard** ([01-dashboard.png](screens/anna-5/01-dashboard.png)). "Übersicht – Was jetzt zu tun ist und welche Fristen anstehen." Perfect, that's exactly my question. The first card is highlighted as "Nächster Schritt: Nebenkostenabrechnungen erstellen. Die Abrechnungsperiode 1.1.2025 – 31.12.2025 ist abgelaufen, aber noch nicht abgerechnet. Erfassen Sie die Rechnungen dieser Periode und erstellen Sie dann die Abrechnungen." OK, so the order is: first invoices, then statements. The big button, though, is "Abrechnungen erstellen", not "Rechnungen erfassen". So which one do I click first? The second card says one statement is still a draft: "Prüfen Sie sie und stellen Sie sie den Mietern zu." "Fristen: In den nächsten Wochen stehen keine Fristen an." Good, nothing is burning... or is it? 2025 ended almost ten months ago. Is that really not a deadline?

**Following the main suggestion** ([02-create.png](screens/anna-5/02-create.png)). I click "Abrechnungen erstellen" and get a 4-step wizard: Periode, Gebäude, Vorschau, Erstellen. The period is already filled in with 2025, nice. But the dates read "01/01/2025" and "12/31/2025", American style. The heating profiles are in English ("Heating + Hot Water (100%)", "Standard profile for combined heating..."). I don't know what a Heizungsprofil is and I'll just leave the default. "Verwaltungspauschale 3 %, üblich sind bis 3 %": fine. Under "Verteilung der Pauschale" it says "je Mieter nach Mietstagen". Is "Mietstagen" a typo?

**Buildings.** "Alle Gebäude auswählen" is easy. I can't tell whether a building already has statements for 2025 or whether its invoices are complete.

**Preview** ([04-preview.png](screens/anna-5/04-preview.png)). "Anzahl Abrechnungen 9", "Gesamtkosten CHF 0.00". Wait, zero? Every row shows "Kosten CHF 0.00" and a Saldo like "CHF-2'640.00". Does that mean every tenant gets their whole Akonto back, or that they owe me 2'640? There is no label. A yellow box says "Alle Rechnungen für die Periode sollten erfasst sein". It's the same generic hint for everyone, even though the app clearly *knows* there are zero costs right now. "Weiter" is still bright blue and active.

**Step 4.** "Bereit zum Erstellen ... um 9 Abrechnungen zu generieren." It doesn't say whether these become drafts or go straight to tenants. I didn't dare click. As a hurried user I *would* have clicked, because the wizard told me everything was "bereit".

**Checking invoices myself** ([06-invoices.png](screens/anna-5/06-invoices.png)). Rechnungen shows 14 invoices, and all of them are from **2024**. Not a single 2025 invoice. So the dashboard text was right that I have to enter invoices first, but the main button skipped that step. There is no year or period filter here, so I had to read the dates one by one.

**The draft** ([07-drafts.png](screens/anna-5/07-drafts.png)). "Entwürfe ansehen" takes me to a filtered list: one statement, NK-...-**2024**-0002, Anna Schmidt, "CHF 83.43 Rückerstattung". That's a statement for **2024** that was never sent, almost two years later. That feels more urgent than 2025, yet the dashboard ranked it second. Clicking the row does nothing. I had to find the tiny eye icon.

**Draft detail** ([09-detail.png](screens/anna-5/09-detail.png)). Now it's clear: costs minus Akonto gives "Rückerstattung an Mieter CHF 83.43", and the sign makes sense here. But the categories read "Heating", "Cold Water", "Caretaker", "Elevator", in English, on something I'm about to send to my tenant. The Verteilschlüssel column is empty. "Zahlungsfrist 9.11.2026" for a *refund*: who pays whom by when? The wizard said "Verwaltungspauschale"; here it says "Verwaltungsgebühr". "Wohnung 1.02 · 1": what is the "· 1"? "Versenden" sits top-right as the primary button, so I'd know how to send it. I did not click it.

**Verdict.** The dashboard tells me *what* to do and gives a reason. That's good. But the *why now* and the *in which order* break down: the primary button jumps past the invoice step, the wizard lets me generate empty statements, and the old 2024 draft is not flagged as overdue.

## 4. Points of confusion incl. terms

| Where | What | Why it confused me |
|---|---|---|
| Dashboard | Text says "Erfassen Sie die Rechnungen ... und erstellen Sie dann", but the button is "Abrechnungen erstellen" | The text names two steps and the button covers only the second |
| Dashboard | "Fristen: keine" | 2025 is not settled and a 2024 draft is unsent. As a layperson I don't know whether there is a legal deadline |
| Dashboard | Order of the cards | The 2024 draft (older, almost ready to send) ranks below "create 2025" |
| Wizard step 1 | "Heizungsprofil", "Heating + Hot Water (100%)", "Heating Mittelland" | English labels and an unexplained concept |
| Wizard step 1 | Dates "01/01/2025" | US format in a Swiss app |
| Wizard step 1 | "Mietstagen" | Looks like a typo (Miettagen) |
| Wizard step 3 | "Saldo CHF-2'640.00" | No sign explanation; the list and detail views say "Rückerstattung" in green instead |
| Wizard step 4 | "generieren" | Unclear whether this creates drafts or sends to tenants |
| Draft list | Row not clickable | Only the small eye icon ("Ansehen") opens the detail |
| Draft detail | "Heating", "Cold Water", "Caretaker", "Elevator" | English category names, while the invoices page shows "Heizung", "Kaltwasser" and so on |
| Draft detail | "Zahlungsfrist" on a refund | Sounds like the tenant has to pay |
| Draft detail | "Verwaltungsgebühr" vs. "Verwaltungspauschale" | Same thing under two names |
| Draft detail | "1.02 · 1" | Meaning of "· 1" unknown |
| Wizard vs. dashboard | Button colors | Bright blue in the wizard vs. dark teal on the dashboard; feels like a different app |

## 5. Error risks

1. **Empty statements:** the wizard creates 9 statements with CHF 0.00 costs and no warning, even though it calculated zero itself. If these are sent, every tenant gets their full Akonto back as a "refund".
2. **Skipped invoice step:** the dashboard's primary button goes straight to statement creation, against its own advice to enter invoices first.
3. **English categories on tenant documents:** the PDF a tenant receives would probably show "Heating" and "Caretaker".
4. **Forgotten old draft:** the 2024 statement may never be sent, because it ranks second and no Frist reminds me.
5. **Possible duplicates:** step 2 doesn't show whether a building already has statements for the period.

## 6. Improvement suggestions

- **Blocker:** In the wizard preview, when total costs are CHF 0.00 (or a building has no invoices in the period), show a clear warning naming the building, e.g. "Für Musterhaus Zentrum sind für 2025 keine Rechnungen erfasst". Disable "Weiter" or ask for explicit confirmation, and link to "Rechnungen erfassen".
- **Major:** When no invoices exist for the period, the dashboard "Nächster Schritt" card should point to the invoice step first, e.g. a button "Rechnungen 2025 erfassen", or two buttons in the stated order.
- **Major:** Translate the category names on statements (and so in the PDF) into German, matching the invoice categories. Translate the heating profile names and descriptions too.
- **Major:** Rank an old unsent draft (2024) above creating the next period, or mark it as overdue ("seit X Monaten im Entwurf"). Show deadlines such as the statement's Zahlungsfrist or "Abrechnung 2025 fällig" under Fristen instead of "keine Fristen".
- **Major:** Step 4 should say "Die Abrechnungen werden als Entwurf erstellt. Nichts wird an Mieter versendet."
- **Minor:** Label the sign of the Saldo in the preview (Nachzahlung / Rückerstattung), as the list already does.
- **Minor:** Show dates in Swiss format (dd.mm.yyyy) in the wizard.
- **Minor:** Make the whole statement row clickable.
- **Minor:** Use one term, Verwaltungspauschale or Verwaltungsgebühr. Fix "Mietstagen". Explain or drop "· 1" after the apartment number.
- **Minor:** Rename "Zahlungsfrist" for refunds (e.g. "Rückerstattung bis").
- **Minor:** Add a year/period filter to the invoices list.
- **Minor:** Give buttons one primary color across dashboard and wizard.
