# Persona test: Anna (29), first-time landlord returning after months, final round b

Date: 10.10.2026
Viewport: desktop 1440x900 (overview and invoice list also checked on mobile 390x844)

Task: without any memory, find out what to do next and take the first step far enough to know I am on the right path (no statements created). Can I see which invoices of the period are recorded, and does the app warn me about missing invoices before I create anything?

Note on shared data: during the session other testers added one 2025 invoice (Hauswartung Keller AG, 15.12.2025, CHF 600) and created 2025 draft statements for the buildings. Steps 1-4 below show the state at the start (no 2025 invoices). Step 5 shows the state afterwards. I did not save anything myself. I opened the invoice form and then left it with "Abbrechen".

## 1. Task completed

**Yes.** Within seconds the overview told me what to do next ("Nächster Schritt – Nebenkostenabrechnungen erstellen", period 1.1.2025 – 31.12.2025, all three buildings not yet billed). It also told me to record the invoices first. "Rechnungen 2025 ansehen" showed me that no 2025 invoices existed. The statement wizard warned me twice before anything was created: at step 2 for each building, and in the preview with a "Rechnung erfassen" button. That button opened the invoice form with the building and period pre-filled. So I knew my real first step was entering the 2025 invoices.

**Partly** on "which invoices are missing": the app warns when a building has *no* invoices, or invoices for only part of the period. It cannot tell me *which* invoices are missing (e.g. heating, water and caretaker were billed in 2024 but are missing in 2025). I still need my own paper checklist for that.

## 2. Effort

- Screens: overview -> invoices 2025 -> all invoices -> wizard steps 1-4 -> new invoice form -> back to wizard -> help -> statements list. About 10 screens.
- Clicks: about 4 to find out what to do; about 8 more to reach the preview warning.
- Time: about 1 minute to understand the task, about 5 minutes including the wizard and the help page.

## 3. Thinking aloud

1. **Overview** ([01](screens/anna-final-b/01-dashboard.png), mobile [02](screens/anna-final-b/02-dashboard-mobile.png)). "Als Nächstes zu tun" with a framed "Nächster Schritt" card is exactly what I need after months away. The sentence "Erfassen Sie zuerst alle Rechnungen dieser Periode und erstellen Sie dann die Abrechnungen" tells me the order. I hesitated only because the big dark button says "Abrechnungen erstellen" while the text tells me to do invoices first. The invoice link is the small, quieter one. On mobile the order is the same and readable; the button is full width under the link.
2. **"Rechnungen 2025 ansehen"** ([03](screens/anna-final-b/03-invoices-2025-empty.png), mobile [04](screens/anna-final-b/04-invoices-2025-mobile.png)). The year filter is already set to 2025: "Keine Rechnungen gefunden – Versuchen Sie es mit anderen Filtern." My first thought: "Did I filter wrong?" The hint to try other filters points me the wrong way. Here the truth is "you have not recorded any 2025 invoices yet". I switched to "Alle Jahre" and saw 14 invoices, all from 2024. That made it clear, but only because I compared them myself. The label "Manuell" on every invoice means nothing to me.
3. **"Abrechnungen erstellen"**, step 1 says "Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen". Good, I don't need to know the dates. Step 2 ([05](screens/anna-final-b/05-wizard-step2-buildings.png)) shows "Keine Rechnungen in der Abrechnungsperiode erfasst" in amber under each building. That is the first place where the app itself says invoices are missing. Clicking "Weiter" without a building gave the clear "Bitte wählen Sie mindestens ein Gebäude." The stepper label breaks badly: "Abrechnun / gsperiode".
4. **Step 3 -> Vorschau** ([06](screens/anna-final-b/06-preview-no-invoices.png)). Very good: "Rechnungen fehlen – … Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto zurück." Seeing a refund of CHF 4'200 for Maria Rossi scares me enough not to continue. The checkbox "Die Abrechnungen trotzdem erstellen" makes it a conscious choice. "Rechnung erfassen" ([07](screens/anna-final-b/07-invoice-new-prefilled.png)) opens the form with the building already selected. The hint under "Rechnungsdatum" ("Übernehmen Sie das Datum von der Rechnung, nicht das heutige") is helpful. "Abbrechen" brought me back into the wizard, but to step 3, not to the preview. One extra "Weiter", fine.
5. **Later state** (after another tester recorded one December invoice for Musterhaus Zentrum) ([08](screens/anna-final-b/08-preview-partial-period.png)). The preview now lists "1 Rechnung vom 15.12.2025" and warns "Rechnungen nur für einen Teil der Periode … mehr als drei Monate ohne Rechnung." Good, that catches "I entered only a few". It also warns "Es gibt schon Abrechnungen". But this partial-period warning has no "Rechnung erfassen" button, unlike the empty-period one. Afterwards the overview ([10](screens/anna-final-b/10-dashboard-after-drafts.png)) only says "10 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu." The "record invoices first" card is gone, although these drafts rest on one CHF 600 invoice. If I were the one returning now, I would go straight to "send".
6. **Hilfe** ([09](screens/anna-final-b/09-help.png)). The "Begriffe kurz erklärt" list is good: Abrechnungsperiode, Akonto, Verteilschlüssel, Heizprofil, Verwaltungspauschale, Umlagefähig and Saldo all match what I saw. It answers "the invoice date decides the period". It does not say how to check that all invoices of a year are recorded. The help says "Jede Rechnung gehört zu einer Kategorie", but the form says "Kategorie (optional)". The help also mentions "Entwürfe erstellen" while I only ever saw "Weiter" (I stopped before step 5).

## 4. Terms I did not understand

| Term | Where | Explained in Hilfe? |
|---|---|---|
| "Manuell" (badge on every invoice) | invoice list | No |
| "Entwurf gespeichert, 16:25" in the statement wizard vs. "Entwurf" as a statement status | wizard footer, overview | Partly. The help explains the browser draft only for contracts, not for the statement wizard. Two meanings of "Entwurf" on the same path. |
| Heizprofil "Heizung + Warmwasser (100%)" – which one is mine? | wizard step 3 | Term yes, choice no |
| Verwaltungspauschale "Gleichmässig pro Wohnung" vs. "Pro Einheit" | wizard step 3 | Verteilschlüssel yes, the difference between the two options no |
| "Wiedervermietet", "Gesperrt" | overview | Yes (Mietstatus) |
| Abrechnungsperiode, Akonto, Umlagefähig, Rückerstattung/Saldo | overview, preview | Yes |

## 5. Error risks

- **Drafts built on incomplete invoices go unnoticed afterwards.** Once drafts exist, the overview drops the "record invoices first" step and only pushes "prüfen und versenden". Nothing on the overview or the draft list says that the drafts cover only one invoice and 11 months have none.
- **Late invoices land in the wrong period.** The help and the form say the invoice date decides the period. A heating oil bill for Dec 2025 that is dated January 2026 silently counts toward 2026. There is no service-period field or warning.
- **The empty-year message misleads.** "Versuchen Sie es mit anderen Filtern" suggests a filter mistake rather than "nothing recorded yet".
- **No completeness check by category.** One invoice per building in each half year stops both warnings, even if heating and water are missing completely.
- **One checkbox confirms several warnings.** "Die Abrechnungen trotzdem erstellen" sits under both "Es gibt schon Abrechnungen" and "Rechnungen nur für einen Teil der Periode", so a single tick dismisses two different risks.

## 6. Suggestions

- **Major** – Keep the invoice hint on the overview while 2025 drafts exist. For example, add to "Abrechnungen prüfen und versenden": "Für Musterhaus Zentrum ist nur 1 Rechnung der Periode erfasst", linking to the invoices of that period.
- **Major** – In the wizard preview (and ideally on "Rechnungen 2025 ansehen"), compare with the previous period by category: "2024 erfasst, 2025 fehlt: Heizung, Kaltwasser, Hauswart …". This is the question a returning landlord actually has.
- **Major** – Change the empty state of the year-filtered invoice list to "Für 2025 sind noch keine Rechnungen erfasst", with a "Rechnung erfassen" button instead of "Versuchen Sie es mit anderen Filtern".
- **Minor** – Add the "Rechnung erfassen" button to the warning "Rechnungen nur für einen Teil der Periode", as the "Rechnungen fehlen" warning already has.
- **Minor** – On the overview card, make "Rechnungen 2025 ansehen" at least as prominent as "Abrechnungen erstellen", because the text says invoices come first.
- **Minor** – After "Abbrechen" or saving in the invoice form opened from the preview, return to step 4 (Vorschau), not step 3.
- **Minor** – Explain or remove the "Manuell" badge. Use a different word for the wizard's browser draft ("Eingaben zwischengespeichert") so it is not confused with statement drafts.
- **Minor** – Add a help item "Sind alle Rechnungen erfasst?" (how to check the year, and that late invoices count by invoice date). Align "Kategorie (optional)" with "Jede Rechnung gehört zu einer Kategorie".
- **Minor** – Fix the hyphenation of the stepper label "Abrechnun gsperiode" on desktop.
