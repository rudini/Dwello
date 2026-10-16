# Fachreview Hilfetexte (#109, #67, #69), Runde 2

Gegenstand: Worktree `review-help-fach2`, Commit c035d78; Delta `git diff 4234f26 c035d78 -- messages src/routes`. Runde 1: `docs/reviews/help-fachreview-1.md`.
Gesetzestexte: Fedlex-Filestore OR (SR 220) de/fr/it, wie in Runde 1 geladen (`scratchpad/fedlex/or*.html`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-14 | Verwalter | Minor | `glossary_period_text` (fr, it): «ses jours comptent dans la période de décompte» / «contano i suoi giorni nel periodo di conteggio» lässt sich lesen, als zählten alle Tage des Leistungszeitraums in dieser Periode |
| V-15 | Verwalter | Nit | `settings_iban_help` (it): «comunicarle il suo IBAN»: «suo» kann «Ihre» IBAN heissen; «le» klein, sonst «Le» |
| V-16 | Verwalter | Nit | `glossary_deadline_text` (fr): «doit avoir payé un montant à payer» doppelt |
| V-17 | Verwalter | Nit | `glossary_manual_text` (it): «il motivo della modifica durante la modifica della fattura» doppelt |

Kein Blocker, kein Major. Alle Befunde aus Runde 1 sind wie vorgeschlagen umgesetzt (siehe «Runde-1-Befunde»).

---

## Runde-1-Befunde: Stand

Geprüft in `messages/{de,fr,it,en}.json` und den Svelte-Dateien in c035d78.

| ID | Stand | Beleg |
|----|-------|-------|
| M-1 | erledigt, alle 4 Sprachen wörtlich | `glossary_allocable_text` |
| M-2 + V-3 | erledigt, alle 4 Sprachen wörtlich | `glossary_reminder_text`; fr/it decken sich mit Art. 257d Abs. 1 OR fr «lui fixer par écrit un délai de paiement et lui signifier qu’à défaut de paiement dans ce délai il résiliera le bail … de 30 jours au moins», it «fissargli per scritto un termine per il pagamento e avvertirlo che … il rapporto di locazione sarà disdetto … di 30 giorni almeno» |
| M-3 | erledigt (de wörtlich); fr/it/en neu, Sinn stimmt | `glossary_fixed_term_*`; Art. 266 Abs. 2 OR fr «Si le bail est reconduit tacitement, il devient un contrat de durée indéterminée.», it «In caso di riconduzione tacita, la locazione è considerata a tempo indeterminato.» Glossarzeile beim Product Owner (#317) |
| M-4 | erledigt (de wörtlich); fr/it/en Sinn stimmt | `glossary_termination_date_*`; Art. 266a Abs. 1 OR it «… le scadenze di disdetta, sempreché non abbiano pattuito … un’altra scadenza di disdetta» |
| V-1 | erledigt, 4 Sprachen | `glossary_profile_text` |
| V-2 | erledigt, 4 Sprachen; «Leerstand» vermieden | `glossary_days_text` |
| V-4 | erledigt, 4 Sprachen; Zitat passt zum Label `statements_refund_by` (fr «Remboursement au plus tard le», it «Rimborso entro il», en «Refund by») | `glossary_deadline_text` (Nit zu fr: V-16) |
| V-5 | erledigt, 4 Sprachen | `glossary_fee_text`, `config_help_management_fee` |
| V-6 | erledigt | it `glossary_balance_text` «gli viene rimborsata» |
| V-7 | erledigt, 4 Sprachen | `settings_key_suggested` |
| V-8 | erledigt, 4 Sprachen, sichtbar unter der Legende | `categories_translations_help`, `CategoryForm.svelte:174` |
| V-9 | erledigt (de wörtlich); fr/it/en mit Badge-Wörtern «Manuelle», «Manuale», «Manual» (`invoices_status_manual`) und «motif de la modification», «motivo della modifica», «reason for the change» (`invoices_override_reason`) | `glossary_manual_*` (Nit zu it: V-17) |
| V-10 | erledigt, 4 Sprachen | `settings_iban_help` (Nit zu it: V-15) |
| V-11 | erledigt, 4 Sprachen | `categories_sort_order_help` |
| V-12 | erledigt, 4 Sprachen | `config_help_accounting_period` |
| V-13 | erledigt, 4 Sprachen; fr/it/en mit denselben Wörtern wie `contracts_notice_period_short` («locataire de remplacement», «nuovo inquilino», «replacement tenant») | `glossary_notice_period_text` |

`config_help_distribution_key` (neu): de deckt sich mit Regel 3 (`docs/nebenkostenabrechnung-anforderungen.md:143`); fr «à parts égales par appartement», it «in parti uguali per appartamento», en «equally per apartment» wie `invoices_key_help`, `invoices_no_key`, `statements_equal_per_apartment`. Bestätigt.

---

## Befunde

### V-14 (Minor): `glossary_period_text` fr/it mehrdeutig

**Belege**
- de: «Mit Leistungszeitraum zählen dessen Tage in der Abrechnungsperiode.» (gleich wie PR #289, `src/__tests__/help-page.dom.test.ts:61`)
- `UBIQUITOUS_LANGUAGE.md:158` (Abgerechnete Tage): «mit Leistungszeitraum dessen Tage innerhalb der Abrechnungsperiode».
- fr: «Avec une période de prestation, ses jours comptent dans la période de décompte.»
- it: «Con un periodo di prestazione contano i suoi giorni nel periodo di conteggio.»
- en: «With a service period, its days in the billing period count.» (eindeutig)
- Die App sagt es an der Rechnung eindeutig: `invoices_service_period_days` fr «Seuls les jours compris dans la période de décompte comptent.», it «Contano solo i giorni nel periodo di conteggio.»

**Warum.** fr «ses jours comptent dans la période de décompte» liest man zuerst als «seine Tage werden in der Abrechnungsperiode gezählt», also alle Tage. Gemeint ist: nur die Tage, die in die Periode fallen. Für eine Rechnung über zwei Perioden ist das der Unterschied zwischen ganz und anteilig. Nachgerechnet wie in Runde 1: CHF 1'200.00, Leistungszeitraum 01.11.2025–31.01.2026 (92 Tage), Periode 2025 → 61 Tage → 795.65, nicht 1'200.00. Grenzfall: Leistungszeitraum ganz in der Periode → ganzer Betrag; ganz ausserhalb → 0.00. it «contano i suoi giorni nel periodo di conteggio» hat dieselbe Lesart. de bleibt (Wortlaut von PR #289, Test).

**Ersatz (nur der letzte Satz)**
- fr: «Avec une période de prestation, seuls ses jours compris dans la période de décompte comptent.»
- it: «Con un periodo di prestazione contano solo i suoi giorni compresi nel periodo di conteggio.»

### V-15 (Nit): `settings_iban_help` (it): «comunicarle il suo IBAN»

**Belege.** it: «… il conteggio gli chiede di comunicarle il suo IBAN.» Die App schreibt die Höflichkeitsform als Klitikon gross (37 Stellen mit «Le »), z. B. auch «Lei» im selben Satz davor.
**Warum.** «suo» kann im Höflichkeitsstil «Ihr» (des Vermieters) heissen; mit kleinem «le» kann der Leser auch «ihr» (einer Frau) lesen. Gemeint ist die IBAN des Mieters.
**Ersatz (it, nur der zweite Satzteil):** «… il conteggio gli chiede di comunicarLe il proprio IBAN.»

### V-16 (Nit): `glossary_deadline_text` (fr)

**Beleg.** fr: «La date à laquelle le locataire doit avoir payé un montant à payer.» (mein Vorschlag aus Runde 1)
**Warum.** «payé … à payer» liest sich doppelt.
**Ersatz (fr, erster Satz):** «La date à laquelle le locataire doit avoir réglé un montant à payer.»

### V-17 (Nit): `glossary_manual_text` (it)

**Beleg.** it: «Può indicare il motivo della modifica durante la modifica della fattura.»
**Ersatz (it, zweiter Satz):** «Può indicare il motivo della modifica quando modifica la fattura.»

---

## Übersetzungen: bestätigt

Geprüft gegen `docs/design/i18n-begriffe.md`, die Labels der App und die deutschen Texte. Anrede vous / Lei / you durchgehend; kein deutsches Wort; französische Guillemets mit geschütztem Leerzeichen innen (geprüft auf U+00A0/U+202F); en mit «…» wie die übrigen en-Texte der Hilfe.

- `help_contents`: «Sommaire», «Indice», «Contents». Bestätigt.
- `glossary_fixed_term_*`: Begriffe «durée déterminée / durée indéterminée», «a tempo determinato / a tempo indeterminato», «fixed-term / open-ended» (`i18n-begriffe.md`, Zeile Befristet / Unbefristet; `contracts_overlap_open_ended`). Sinn = de. Bestätigt.
- `glossary_termination_date_*`: «terme de résiliation», «scadenza di disdetta» (= Fedlex it Art. 266a), «termination date»; «est dit résilié», «si dice disdetto», «is called terminated by notice» = Glossarwort «gekündigt» (`i18n-begriffe.md`). Bestätigt.
- `glossary_notice_period_*`: «délai de résiliation», «termine di disdetta», «notice period» wie die App, bis #83 entscheidet. Sinn = de (Art. 266a Abs. 2 OR fr «la résiliation produit effet pour le prochain terme pertinent», it «la disdetta produce effetto per la scadenza successiva di disdetta»). Bestätigt.
- `glossary_manual_*`: Begriffe «modifié manuellement / motif de la modification», «modificato manualmente / motivo della modifica», «manually overridden / reason for the change». Bestätigt (Nit V-17).
- `categories_translations_help`: Sinn = de; «décompte des charges», «conteggio spese accessorie», «utility cost statement». Bestätigt.
- `glossary_period_text`: en bestätigt; fr/it siehe V-14; «période de prestation», «periodo di prestazione», «service period» wie `i18n-begriffe.md`.
- `config_help_distribution_key`: «imputable», «addebitabile», «allocable» (❓ in `i18n-begriffe.md`, #83) wie im Rest der App. Bestätigt.
- `settings_iban_help`: fr/en bestätigt; «délai de paiement», «termine di pagamento», «payment deadline», «QR-facture», «QR-fattura», «QR-bill». it siehe V-15.
- `settings_key_suggested`: Begriffe «clé de répartition», «chiave di riparto», «distribution key». Bestätigt.

## Fehlende Begriffe

Keine neuen. Die drei Punkte aus Runde 1 liegen beim Product Owner (#317 «Befristet / Unbefristet», #279, #83 «Kündigungsfrist» und die Fedlex-Wörter «délai de congé» / «termine di preavviso»).

## Nicht bestätigt

- **Rechtsprechung zur stillschweigenden Fortsetzung** und **Rechtsfolge einer Kündigung ohne Fristansetzung nach Art. 257d OR**: weiterhin nur der Gesetzestext belegt (wie Runde 1).
- **Üblicher Satz der Verwaltungspauschale «etwa 3 %»**: folgt dem Glossar (`UBIQUITOUS_LANGUAGE.md:154`); Fedlex nennt keine Zahl (wie Runde 1).
- **Englische Rechtsbegriffe**: Fedlex hat keine amtliche englische Fassung des OR; «notice period», «termination date», «fixed-term / open-ended» nur gegen `i18n-begriffe.md` geprüft.
- **Typografie fr vor «;» und «:»**: Die neuen fr-Texte setzen dort ein normales Leerzeichen; `fr.json` ist darin uneinheitlich (108 geschützt, 65 normal), `i18n-begriffe.md` verlangt das geschützte Leerzeichen nur in Guillemets. Kein Befund.
- **Rendering**: Inhaltsverzeichnis, Anker und neue Glossarzeilen nur im Quelltext gelesen (`src/routes/help/+page.svelte`, `Glossary.svelte`), nicht im Browser.
