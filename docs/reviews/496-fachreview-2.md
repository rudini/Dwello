# Fachprüfung #496 «Alle Daten jederzeit exportieren», Schritt 5, Runde 1

Gegenstand: `git diff 2352a1a a00c03f` (ohne `docs/reviews`), Worktree `/tmp/scratchpad/review-496-fach-reviewer` @ a00c03f; Vorbericht `docs/reviews/496-fachreview-1.md`.

Geschlossen: V-1, V-2, V-3, V-5, V-6, V-7, V-8, V-9, V-10, M-1, R-1 (R-2 bleibt wie entschieden bis zur nächsten Änderung der Datenschutzerklärung offen, nicht Teil dieser Runde)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-11 | Verwalter | Major | `wohnungen.csv`, Spalte «Status», zeigt den gespeicherten Code (`vacant`) statt des Mietstatus: Eine vermietete Wohnung steht dort als `vacant`. |
| V-12 | Verwalter | Minor | Im README fehlt das Vorzeichen bei einer Rückerstattung. «Bereits bezahlt», «Bezahlter Betrag», «Offener Betrag» und die Beträge in `zahlungen.csv` sind dann negativ, und bei einer ersetzten Abrechnung kann «Bezahlter Betrag» eine Verrechnung sein und keine Zahlung (`statement.service.ts:910`, `:947`). Ausserdem stimmt der Begriff im README it/en nicht mit der Spalte überein: «Importo ancora dovuto» / «Amount still outstanding» gegenüber der Spalte «Importo dovuto» / «Amount outstanding». Fix: Wortlaut `readme_balance` |
| V-13 | Verwalter | Minor | Spaltennamen fr/it weichen von der Oberfläche und von `i18n-begriffe.md` ab: `correctionDeclined` fr «Non corrigé le» (i18n:98 «non rectifié»), `carrySettledOn` fr «Soldé à la main le» / it «Pareggiato a mano il» (`statements_carry_settled_on`: «soldé manuellement» / «saldato manualmente»), `flatRateUtilityCharge` it «Forfait spese accessorie» (`common_flat_rate_utility_charge`: «Forfait per le spese accessorie»), `movedOut` fr «Départ confirmé» (`contracts_moved_out_confirm`: «Confirmer le déménagement»). Fix: Wortlaut-Tabelle |
| V-4 | Verwalter | Minor | Noch offen ist nur ein Teil: «Vereinbarte Verwaltungspauschale» zeigt ja/nein und nicht die Werte des Formulars (`data-export.service.ts:91`, Schema `management_fee_agreed` boolean). Fix: Werte `contracts_fee_run` / `contracts_fee_own` / `contracts_fee_none` («Ja, zum Satz des Abrechnungslaufs», «Ja, mit eigenem Satz», «Nein»), abgeleitet aus `managementFeeAgreed` und `managementFeePercent`. |
| V-14 | Verwalter | Minor | Gespeicherte Codes stehen in den Tabellen der Oberflächensprache: in `dokumente.csv` Art, Kanal und Status (`letter`, `to_send` …), in `mieter.csv` der Korrespondenzkanal, in `einstellungen.csv` `accounting_period` (`calendar`) und `default_distribution_key_id` / `default_heating_profile_id` (UUID statt Name). Bei Verteilschlüsseln und Heizprofilen steht «Von Dwello» statt «Vordefiniert» (`keys_predefined`, `profiles_predefined`; «Von Dwello» gilt nur für Kategorien, `categories_kind_predefined`). Fix: Wörter aus der Wortlaut-Tabelle, Namen statt IDs; die Datendatei bleibt bei den Codes. |
| V-15 | Verwalter | Minor | `SETTINGS` behauptet «by the names of the form» (`data-export.service.ts:209`). Abweichungen: `company_address` heisst im Formular «Strasse und Hausnummer» (`buildings_street`), it `company_name` «Nome dell’azienda» (`settings_company_name`) statt «Nome della ditta», `management_fee_pct` «Verwaltungspauschale in %» (`settings_fee_label`). Fix: die Texte dieser Schlüssel übernehmen. |

## V-11 (Major): Mietstatus in `wohnungen.csv`

**Beleg:**
- `data-export.service.ts:270` liest `tx.select().from(apartments)`, und `:385` schreibt `status` unverändert in die Spalte «Status».
- `schema.ts:68`: `status … default('vacant'), // vacant, reserved; occupied is computed from the contracts (apartmentStatus)`.
- `apartment.service.ts:59-67`: Der Mietstatus wird bei jedem Lesen aus den Mietverträgen berechnet (`occupied`, `relet`, sonst der gespeicherte Wert).
- UL:23 **Mietstatus**: «Vermietet (`occupied`, ein Vertrag läuft), Vermietet ab {Datum} (`relet`, …), Leer (`vacant`), Gesperrt (`reserved`)».

**Nachgerechnet:**
- (a) Wohnung 2.01 mit einem Mietvertrag ab 2024-01-01 ohne Vertragsende: Die Oberfläche zeigt «Vermietet», die CSV `vacant`.
- (b) Wohnung ohne Vertrag, von Hand gesperrt: Die CSV zeigt `reserved` statt «Gesperrt».
- (c) Wohnung mit nur einem künftigen Vertrag ab 2027-01-01: Die Oberfläche zeigt «Vermietet ab 01.01.2027», die CSV `vacant`.

**Warum falsch:** Wer die Verwaltung übernimmt, liest aus der Tabelle Leerstände, die es nicht gibt. Den Leerstand trägt der Vermieter (UL:203, Art. 7 Abs. 1 VMWG). Ein Leser rechnet daraus falsche Anteile oder fragt einen Mieter an, der längst eingezogen ist. Ausserdem steht ein englischer Code in einer deutschen Tabelle.

**Fix:**
- Die Spalte heisst «Mietstatus» und zeigt die Wörter der Oberfläche (Tabelle unten), berechnet mit `apartmentStatus` am Tag des Exports; bei `relet` mit dem Datum `JJJJ-MM-TT`.
- Die Datendatei behält `status` wie gespeichert und bekommt dazu `rentalStatus` (berechnet), damit auch ein Programm nicht `vacant` als Leerstand liest.
- Ein `*.pg.test.ts`: eine Wohnung mit laufendem Vertrag → «Vermietet», eine gesperrte → «Gesperrt».

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| readme_balance | Saldo: positiv ist eine Nachzahlung des Mieters, negativ eine Rückerstattung. Der Saldo ist auf 5 Rappen gerundet. Bereits bezahlt, Bezahlter Betrag, Offener Betrag und die Beträge in ${payments} haben das Vorzeichen des Saldos: Bei einer Rückerstattung sind sie negativ und nennen, was Sie zurückerstattet haben oder noch zurückerstatten. Offener Betrag: Saldo minus die Teilzahlungen in ${payments}. Bei einer ersetzten Abrechnung kann Bezahlter Betrag auch einen Saldo enthalten, den die nächste Abrechnung als Übertrag verrechnet hat oder den Sie von Hand ausgeglichen haben. | Solde : positif, c’est un montant à payer par le locataire ; négatif, un remboursement. Le solde est arrondi à 5 centimes. Déjà payé, Montant payé, Montant dû et les montants de ${payments} ont le signe du solde : pour un remboursement, ils sont négatifs et indiquent ce que vous avez remboursé ou devez encore rembourser. Montant dû : solde moins les paiements partiels de ${payments}. Pour un décompte remplacé, Montant payé peut aussi contenir un solde que le décompte suivant a compensé comme report ou que vous avez soldé manuellement. (Leerzeichen vor : und ; geschützt, U+00A0) | Saldo: positivo è un importo dovuto dall’inquilino, negativo un rimborso. Il saldo è arrotondato a 5 centesimi. Già pagato, Importo pagato, Importo dovuto e gli importi in ${payments} hanno il segno del saldo: per un rimborso sono negativi e indicano ciò che ha rimborsato o deve ancora rimborsare. Importo dovuto: saldo meno i pagamenti parziali in ${payments}. Per un conteggio sostituito, Importo pagato può contenere anche un saldo che il conteggio successivo ha compensato come riporto o che Lei ha saldato manualmente. | Balance: positive is an amount due from the tenant, negative a refund. The balance is rounded to 5 centimes. Already paid, Amount paid, Amount outstanding and the amounts in ${payments} have the sign of the balance: for a refund they are negative and show what you have refunded or still have to refund. Amount outstanding: the balance minus the part payments in ${payments}. For a replaced statement, Amount paid may also hold a balance that the next statement offset as carried over or that you settled by hand. |
| COLUMNS.status (wohnungen.csv) → rentalStatus | Mietstatus | Statut de location | Stato di locazione | Rental status |
| WORDS occupied / relet / vacant / reserved | Vermietet / Vermietet ab {Datum} / Leer / Gesperrt | Loué / Loué dès le {date} / Vacant / Bloqué | Locato / Locato dal {data} / Sfitto / Bloccato | Let / Let from {date} / Vacant / Blocked |
| COLUMNS.correctionDeclined | Nicht berichtigt am | Non rectifié le | Non rettificato il | Not corrected on |
| COLUMNS.carrySettledOn | Von Hand ausgeglichen am | Soldé manuellement le | Saldato manualmente il | Settled by hand on |
| COLUMNS.flatRateUtilityCharge | Nebenkostenpauschale | Forfait de frais accessoires | Forfait per le spese accessorie | Flat-rate utility charge |
| COLUMNS.movedOut | Auszug bestätigt | Déménagement confirmé | Trasloco confermato | Move-out confirmed |
| WORDS fee: run / own / none (V-4) | Ja, zum Satz des Abrechnungslaufs / Ja, mit eigenem Satz / Nein | Texte von `contracts_fee_run` / `contracts_fee_own` / `contracts_fee_none` in fr.json | dito it.json | dito en.json |
| WORDS letter / email (Kanal, Korrespondenzkanal) | Per Brief / Per E-Mail | Par lettre / Par e-mail | Per lettera / Per e-mail | By letter / By email |
| WORDS sent / to_send (Status Dokument) | Versendet / Zu versenden | Envoyé / À envoyer | Inviato / Da inviare | Sent / To send |
| WORDS predefined (Verteilschlüssel, Heizprofile) | Vordefiniert | Prédéfinie (Heizprofil: Texte von `profiles_predefined`) | Preimpostata (Heizprofil: `profiles_predefined`) | Predefined |
| SETTINGS.company_address | Strasse und Hausnummer | Rue et numéro | Via e numero civico | Street and house number |
| SETTINGS.company_name | Firmenname | Nom de l’entreprise | Nome dell’azienda | Company name |
| SETTINGS.management_fee_pct | Verwaltungspauschale in % | Frais d’administration en % | Spese amministrative in % | Management fee in % |

Für die Art eines Dokuments (`reminder`, `statement`, `new_pdf`, `pdf_before_change`, `upload`) gibt es in `messages/*.json` keine eigenen Bezeichnungen. Vorschlag: Mahnung / Abrechnung / Neues PDF / PDF vor der Änderung / Hochgeladen, in den anderen Sprachen nach `i18n-begriffe.md:115` und `:81` (rappel / décompte …). Die Mahnstufe steht schon in der eigenen Spalte. Das gehört zu #1039 (`domain`, `needs-decision`).

## Nicht bestätigt

- Ob `defaultNow()` in `timestamp`-Spalten ohne Zeitzone UTC speichert: Das hängt von der Zeitzone der PostgreSQL-Sitzung ab (`schema.ts:43`; in `connection.ts` ist keine gesetzt). Drizzle liest den Wert als UTC; läuft die Sitzung in Europe/Zurich, liegen «Erfasst am» und die Zeit im Protokoll um 1–2 Stunden daneben. Gesucht in `backend/src/db/connection.ts` und `docker-compose*`. Das gilt schon vor #496.
- Ob `fflate` `zipSync` das UTF-8-Flag für Namen mit é, ä und ü setzt (F-6), und ob der Explorer von Windows sie richtig zeigt. Nicht getestet.
- Excel mit fr-CH und en (Dezimalpunkt, Strichpunkt beim Doppelklick) und `JJJJ-MM-TT` als Datum: offen wie in Runde 1.
- Ob es Abrechnungen gibt, die vor #93 ohne Betrag bezahlt wurden (`paid_amount` null). Ihre Zeile in `zahlungen.csv` hätte einen leeren Betrag. Die Daten habe ich nicht geprüft.

Geprüft: Saldo = Kostenanteil + Übertrag − Akontobeiträge − Bereits bezahlt, nachgerechnet mit dem Test (1030.00 + 4.00 − 900.00 − 100.00 = 34.00; offen 34.00 − 30.00 = 4.00), mit einer Rückerstattung (−166.00, Teilrückerstattung −50.00 → offen −116.00) und mit einem übertragenen Saldo von −3.00. Übertrag = Saldo der übertragenden Abrechnung, wie `statement.service.ts:432`. Überfällig = versendet und Zahlungsfrist vor heute, wie `statusCondition` und `getStatements`. Offener Betrag 0.00 bei Bezahlt, Erledigt und Ersetzt, leer beim Entwurf. Ebenso geprüft: die Zeilen in `zahlungen.csv` (je Teilzahlung eine; die Verrechnung beim Ersetzen ergibt zu Recht keine), der Schutz vor Formeln (`config/export/+server.ts:22-28`), die Statuswörter gegen `statements_status_*`, `config_export_*`, `audit_data_exported`, die angehängten Sätze von `audit_purpose` und `audit_empty_text` in vier Sprachen (fr mit geschützten Leerzeichen), die übrigen Texte des README, die Ordner- und Tabellennamen und die Einstellungen ohne Geheimnisse (`config.service.ts` CONFIG_KEYS).
