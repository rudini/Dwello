# #686: wording for fach-reviewer

Points 1 (P-4) and 4 (O-6) of #686, both decided by the product owner in the issue. Nothing below is in the app yet:
the tests that expect it are red (`backend/src/__tests__/statement-pdf-render.test.ts`, «Anteil nach Heizprofil mit dem
Wort der Tabelle»; `src/__tests__/statement-pages.dom.test.ts` and `statement-actions.test.ts`, «Zahlungsfrist … ab dem
Versand»; `tests/e2e/features/statement-detail.feature`, «Ein Entwurf erklärt, ab wann seine Zahlungsfrist gilt», `@wip`).
French uses U+00A0 before « » ; : ! ? as in the files.

## 1. P-4: heating note in the PDF names the table's «Wohnungsanteil»

Key `heatingNote` in `backend/src/services/pdf-texts/{de,fr,it,en}.ts` (line 57). It prints under «Heiz- und
Warmwasserkosten» when every heating invoice lacks a Leistungszeitraum. The table column it refers to is
`apartmentShareColumn` (de «Wohnungsanteil», fr «Part du logement», it «Quota appartamento», en «Apartment share»),
defined by `sharesNote`.

| Lang | Current | Proposed |
|---|---|---|
| de | Heizkosten nach Heizprofil «{profile}»: {percent} % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode | Heizkosten nach Heizprofil «{profile}»: {percent} % des Wohnungsanteils an den Heizkosten in der Abrechnungsperiode |
| fr | Frais de chauffage selon le profil « {profile} » : {percent} % des frais de chauffage de votre logement pour la période de décompte | Frais de chauffage selon le profil « {profile} » : {percent} % de la part du logement dans les frais de chauffage pour la période de décompte |
| it | Spese di riscaldamento secondo il profilo «{profile}»: {percent} % delle spese di riscaldamento del suo appartamento nel periodo di conteggio | Spese di riscaldamento secondo il profilo «{profile}»: {percent} % della quota appartamento delle spese di riscaldamento nel periodo di conteggio |
| en | Heating costs under the heating profile ‘{profile}’: {percent} % of your apartment’s heating costs for the billing period | Heating costs under the heating profile ‘{profile}’: {percent} % of the apartment share of the heating costs for the billing period |

Questions for the review:

- «des Wohnungsanteils» (the column's word, unchanged) or «Ihres Wohnungsanteils» (the triage's first draft)? The
  column is the apartment's share, not the tenant's, so the proposal drops «Ihres».
- The amount in brackets («(CHF 693.16)») from the persona report is left out (one more value to compute); say if it is
  needed.
- When the text lands, the existing expectation `statement-pdf-render.test.ts:765` («44.20 % der Heizkosten Ihrer
  Wohnung in der Abrechnungsperiode») changes with it.

## 4. O-6: help text at a draft's Zahlungsfrist

New key `statements_payment_deadline_draft_help` in `messages/{de,fr,it,en}.json`, shown under the date of
«Zahlungsfrist» (or «Rückerstattung bis» for a refund) in `src/routes/statements/[id]/PaymentPanel.svelte`, only on a
draft. `{n}` is `payment_deadline_days` of the settings (default 30), which sending and the draft's PDF apply
(`datedToday`, `backend/src/services/statement.service.ts:724`). There is no current text.

| Lang | Proposed |
|---|---|
| de | Gilt ab dem Versand. Versenden Sie später, verschiebt Dwello sie auf {n} Tage nach dem Versanddatum. |
| fr | Le délai court à partir de l’envoi. Si vous envoyez plus tard, Dwello le reporte à {n} jours après la date d’envoi. |
| it | Il termine decorre dall’invio. Se invia più tardi, Dwello lo sposta a {n} giorni dopo la data d’invio. |
| en | The deadline runs from the day it is sent. If you send it later, Dwello moves it to {n} days after the date it is sent. |

The fr, it and en wording follows `help_statements_4` («Le délai de paiement court à partir du jour de l’envoi», «Dal
giorno dell’invio decorre il termine di pagamento», «The payment deadline runs from the day it is sent»).

Questions for the review:

- `datedToday` keeps a deadline the landlord set later by hand («Frist und Bemerkungen bearbeiten») and moves only an
  earlier one. «verschiebt Dwello sie auf {n} Tage» is then not true for a later date. Alternative: «… verschiebt Dwello
  sie auf mindestens {n} Tage nach dem Versanddatum» (fr «au moins à {n} jours», it «ad almeno {n} giorni», en «to at
  least {n} days»), or show the text only while the deadline is not later than sending today would give.
- For a refund the label is «Rückerstattung bis»; «sie» and «Gilt ab dem Versand» then refer to that date. Is one text
  for both right, or does a refund need its own?
