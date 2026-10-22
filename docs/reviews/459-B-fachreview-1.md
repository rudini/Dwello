# Fachprüfung #459 Slice B («Mieter anonymisieren»), Runde 1

Gegenstand: Commit 35db6f79 (Worktree `review-459-B-fach`): `@wip`-Szenarien in `tests/e2e/features/tenant-detail.feature:69-84` und `tests/e2e/features/privacy.feature:35-38` sowie der Plan des Aufrufers (Punkte 1–6). Noch kein Code.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte / Mietrecht | Blocker | Versendete Abrechnungs-PDFs (`utility_statements.pdf_blob`, `documents.type = 'statement'`) mit Name und Adresse bleiben. Das widerspricht Art. 6 Abs. 4 DSG, dem Glossar «Dokument» und den entschiedenen Texten. Braucht einen Produktentscheid. |
| R-2 | Rechtstexte | Major | `documents.recipient` der versendeten Abrechnungen enthält die E-Mail-Adresse des Mieters. Der Plan lässt sie stehen, obwohl Dwello die «Kontaktdaten» zu entfernen verspricht. |
| R-3 | Rechtstexte | Minor | `privacy_retention_1` (entschieden): Das «oder» in «letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung» lässt sich auch als «das früheste Ereignis» lesen. Der Satz davor sagt zudem «Nicht löschen lassen sich … alle Mahnungen», beim Anonymisieren gehen sie aber. Vorschlag für den PO: «… seit dem Ende des Jahres, in dem das Letzte davon geschah (sein letzter Mietvertrag endete, die letzte Abrechnung oder Mahnung ging an ihn) …», dazu «Nicht einzeln löschen lassen sich …». |
| V-1 | Verwalter | Minor | Ersatzname in der Sprache der Oberfläche im Moment des Anonymisierens gespeichert: Wechselt der Vermieter später nach fr/it/en, steht dort Deutsch. Ausserdem lässt sich «Ehemaliger Mieter» mit dem Status «ehemalig» bzw. dem Filter «Ehemalige Mieter» verwechseln. Besser: Namensfelder leer lassen, `anonymised_on` setzen und beim Anzeigen aus `messages` übersetzen, als «Anonymisierter Mieter» (Wortlaut unten). |
| V-2 | Verwalter | Minor | Hilfetext «Die Aufbewahrungsfrist von 10 Jahren ist abgelaufen.» trifft für private Vermieter ohne Buchführungspflicht nicht zu (`privacy_retention_2` sagt das selbst). Er übergeht auch eine Unterbrechung der Verjährung (Art. 135 Ziff. 2, Art. 137 OR), etwa durch eine Betreibung. Ersetzen durch den Wortlaut unten. |
| V-3 | Verwalter | Minor | Bemerkung der Abrechnung (`utility_statements.notes`) behalten: Sie wird ins PDF gedruckt (`statement.service.ts:703`) und ist Freitext, der den Namen enthalten kann. Leeren wie die Bemerkung des Mietvertrags. Die Beträge berührt das nicht. |
| V-4 | Verwalter | Minor | Der Plan regelt nicht, was nach dem Anonymisieren geschieht: Ein Entwurf könnte noch an «Ehemaliger Mieter» ohne Adresse versendet werden. Eine Mahnung begänne nach dem Löschen der Mahnungs-Dokumente wieder bei Stufe 1 (`countReminders`, `document.service.ts:140`). Versenden und Mahnen für anonymisierte Mieter im Backend ablehnen (mit Code). |
| V-5 | Verwalter | Minor | Der Backend-Code `TENANT_ANONYMISE_TOO_EARLY {date}` passt nicht zu einem Mieter mit laufendem oder künftigem Mietvertrag (Punkt 6: es gibt kein Datum). Er braucht eine eigene Ablehnung, z. B. `TENANT_NOT_FORMER`, mit Text. |
| V-6 | Verwalter | Minor | Szenario «Mieter vor Ablauf der Aufbewahrung nicht anonymisieren» (`tenant-detail.feature:80-84`) wird am 01.01.2030 rot, denn ab dann ist Lea Frei anonymisierbar. Die Uhr im Test festsetzen oder Jahre relativ zu heute seeden. |
| V-7 | Verwalter | Minor | Unsicher: Eine Zahlung in einem späteren Jahr als die Abrechnung (`paid_date`, auch die Rückerstattung bei negativem Saldo) ist für Buchführungspflichtige ein Geschäftsvorfall dieses späteren Jahres (Art. 958f Abs. 1 OR). Der Plan zählt sie nicht. Vorschlag: `paid_date` als viertes Ereignis zählen. Das ändert die entschiedene Regel und ist daher Sache des PO. |

## R-1 (Blocker): versendete Abrechnungs-PDFs bleiben mit Name und Adresse

- **Beleg:**
  - Der Plan (Punkt 2) behält `utility_statements.pdf_blob` und `documents.type = 'statement'`. Beide enthalten Name und Korrespondenzadresse (`pdf.service.ts:722`). Bei E-Mail-Versand enthalten sie auch den Empfänger (`statement-send.service.ts:54-64`).
  - Glossar `UBIQUITOUS_LANGUAGE.md:216`, **Dokument**: «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF, oder vom Liegenschaftsverwalter hochgeladene Datei zu einem Mieter.» Eine versendete Abrechnung ist damit ein Dokument.
  - Die entschiedene Bestätigung sagt «Name, Kontaktdaten und Dokumente von {name} werden endgültig entfernt», `privacy_retention_1` sagt «Dwello entfernt dann Name, Kontaktdaten und Dokumente». «Done means» verlangt, «the name in stored statement data» zu entfernen. Im Code steht der Name ausserhalb der PDFs nirgends in Abrechnungsdaten (siehe Geprüft). Diese Vorgabe zielt also auf die PDFs.
  - Art. 6 Abs. 4 DSG: «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.»
  - Art. 958f Abs. 1 OR: «Die Geschäftsbücher und die Buchungsbelege sowie der Geschäftsbericht und der Revisionsbericht sind während zehn Jahren aufzubewahren. Die Aufbewahrungsfrist beginnt mit dem Ablauf des Geschäftsjahres.»
- **Warum falsch:**
  - Der Entscheid vom 2026-10-19 begründet das Behalten mit der Aufbewahrungspflicht («retention duty»). Anonymisieren ist aber erst möglich, wenn diese Pflicht für die letzte Abrechnung abgelaufen ist (Ende des Jahres der letzten versendeten Abrechnung + 10). Die Begründung trägt also nicht mehr.
  - Behält Dwello die PDFs, ist der Mieter nicht anonymisiert, sondern nur in den Stammdaten umbenannt. Der Name steht weiter in jedem PDF, das man über die Abrechnung herunterladen kann.
  - Bestätigung und Datenschutzerklärung würden dann etwas Falsches versprechen: die Dokumente nach der Glossardefinition (Art. 6 Abs. 2 DSG, Treu und Glauben; Art. 19 Abs. 2 DSG, transparente Bearbeitung).
  - Auch die Spannung, die der Aufrufer sieht, löst sich nicht: Mahnungs-PDFs und Abrechnungs-PDFs sind beide versendet. Es gibt keinen rechtlichen Grund, sie verschieden zu behandeln.
- **Fix:** Produktentscheid einholen. Er widerspricht dem Wortlaut des Entscheids vom 2026-10-19, also gehört er unter «Blocked on me». Meine Empfehlung:
  - Beim Anonymisieren auch `utility_statements.pdf_blob` (auf `null`) und die Dokumente vom Typ `statement` entfernen. Beträge, Positionen, Zahlungen und Nummern bleiben.
  - Folge prüfen: `getStatementPdf` (`statement-pdf.service.ts:351-360`) erzeugt bei `pdf_blob = null` ein neues PDF aus den aktuellen Daten, mit dem Ersatznamen und ohne Adresse. Entweder ist das gewollt und der Text sagt es, oder der Download wird danach abgelehnt.
  - Will der PO die PDFs doch behalten, müssen Bestätigung und `privacy_retention_1` das sagen, z. B. «… Die Beträge der Abrechnungen und die versendeten Abrechnungen als PDF bleiben.». Dann gilt R-2 erst recht. Rechtlich halte ich das nach Ablauf der Frist für schwer haltbar (Art. 6 Abs. 4 DSG, siehe oben).

## R-2 (Major): E-Mail-Adresse in `documents.recipient`

- **Beleg:**
  - `statement-send.service.ts:62`: `recipient: tenant.email` bei Dokumenten vom Typ `statement`.
  - `schema.ts`, `documents.recipient`: «the e-mail address it went to (#449)».
  - Punkt 2 des Plans nennt nur die Felder in `tenants`.
- **Warum falsch:** Die E-Mail-Adresse ist Kontaktdaten. «Done means» und die Bestätigung versprechen, dass Dwello sie entfernt. Sie bliebe in jeder Zeile, die Dwello behält, und erschiene in der Liste der Dokumente.
- **Fix:** Beim Anonymisieren `recipient` auf `null` setzen für jedes Dokument des Mieters, das bleibt. Mit R-1 nach Empfehlung entfällt das, weil die Zeilen gehen. Den `*.pg.test.ts` für «was bleibt» um diese Spalte ergänzen.

## Bestätigung der Punkte des Plans

1. **Datum:** bestätigt, mit V-7 als offene Frage.
   - 01.01. des Jahres (Ereignisjahr + 11) ist der erste Tag nach Art. 958f Abs. 1 OR («beginnt mit dem Ablauf des Geschäftsjahres» → 1.1. Jahr+1, zehn Jahre → bis 31.12. Jahr+10).
   - Art. 127 OR: «Mit Ablauf von zehn Jahren verjähren alle Forderungen, für die das Bundeszivilrecht nicht etwas anderes bestimmt.»
   - Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.» Forderungen, die mit dem Ereignis fällig werden, sind damit gedeckt.
   - Art. 128 Ziff. 1 OR («Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen») ist kürzer. Auch eine Nebenkostenforderung, die erst im Folgejahr fällig wird, ist damit gedeckt.
   - Das Abrechnungsdatum ist der Versandtag (`statement.service.ts:716-721`, Glossar «Abrechnungsdatum»). (b) ist damit dasselbe wie «ging an ihn».
   - Nachgerechnet:
     - Vertragsende 31.12.2019, keine Abrechnung → 01.01.2030 (Szenario richtig).
     - Vertragsende 31.12.2014 → 01.01.2025, am 22.10.2026 also angeboten (Szenario richtig).
     - Mieterwechsel: Vertrag A endet 31.03.2016, Vertrag B desselben Mieters 01.04.2016–30.09.2018 → 01.01.2029.
     - Mahnung mit `sent_at` 2017-01-02T23:30Z, Schweizer Tag 03.01.2017 → 01.01.2028; mit dem UTC-Tag wäre es fälschlich 01.01.2027. Der Schweizer Tag ist also nötig.
     - Rückerstattung: Abrechnung vom 20.12.2019 mit negativem Saldo, erstattet am 10.02.2020 → Plan 01.01.2030, mit V-7 01.01.2031.
2. **Was entfernt wird:**
   - Bestätigt: Name, E-Mail, Telefon, Adresse, PLZ, Ort; Dokumente `upload` und `reminder`.
   - Bestätigt: `contract_pdf` entfernen. Er ist ein Dokument zum Mieter, auch `tenant-export.service.ts:73-74` legt ihn unter «documents» ab. Ebenso die Bemerkung des Mietvertrags.
   - Land und Sprache dürfen bleiben.
   - Korrigiert: Abrechnungs-PDFs (R-1), `recipient` (R-2), Bemerkung der Abrechnung (V-3).
3. **Ersatzname:** siehe V-1. `anonymised_on` bestätigt.
4. **Protokoll:** bestätigt.
   - `recordAudit` speichert für `statement_corrected` und `payment_reset` nur Nummer, ID und Datum (`audit-log.service.ts:28`, `statement.service.ts:803`).
   - Für Kategorien und Rechnungen speichert es Kategorie- bzw. Rechnungsdaten (`category.service.ts:219`, `invoice.service.ts:403`), für `login` den Anbieter. Nirgends einen Mieternamen.
   - Die JSON-Spalten der Abrechnungen (`advance_lines`, `invoices`, `payment_resets`, `key_values`, `heating_share`, `correction_declined`) enthalten keinen Namen. Die Titel der Dokumente sind feste Bezeichnungen (`reminder-letter.ts:29-86`), ausser bei hochgeladenen Dokumenten, und die gehen.
5. **Texte:** siehe V-2, R-3 und die Wortlaute unten.
6. **Laufender oder künftiger Mietvertrag:** nicht angeboten, kein Datum. Bestätigt (Glossar «Mieter»: ehemalig erst, «wenn alle seine Mietverträge beendet sind»). Zur Ablehnung im Backend siehe V-5.

## Wortlaute (de / fr / it / en)

| Schlüssel (Vorschlag) | de | fr | it | en |
|---|---|---|---|---|
| Knopf | Mieter anonymisieren | Anonymiser le locataire | Anonimizzare l’inquilino | Anonymise tenant |
| Bestätigung (entschieden) | Name, Kontaktdaten und Dokumente von {name} werden endgültig entfernt. Die Beträge der Abrechnungen bleiben. | Le nom, les coordonnées et les documents de {name} seront définitivement supprimés. Les montants des décomptes sont conservés. | Il nome, i dati di contatto e i documenti di {name} verranno eliminati definitivamente. Gli importi dei conteggi restano. | The name, contact details and documents of {name} will be removed permanently. The amounts of the statements stay. |
| Hilfetext über dem Knopf (V-2; {year} = Jahr des letzten Ereignisses) | Seit dem Ende des Jahres {year} sind 10 Jahre vergangen: Damals endete der letzte Mietvertrag oder ging die letzte Abrechnung oder Mahnung an {name}. Läuft noch eine Betreibung oder ein Verfahren, warten Sie damit. | 10 ans se sont écoulés depuis la fin de l’année {year} : cette année-là, le dernier contrat de bail a pris fin ou le dernier décompte ou rappel a été envoyé à {name}. Si une poursuite ou une procédure est encore en cours, attendez. | Sono trascorsi 10 anni dalla fine dell’anno {year}: in quell’anno è terminato l’ultimo contratto di locazione o è stato inviato a {name} l’ultimo conteggio o sollecito. Se è ancora in corso un’esecuzione o una procedura, attenda. | 10 years have passed since the end of {year}: that year the last rental contract ended or the last statement or reminder went to {name}. If debt collection or proceedings are still under way, wait. |
| Vor dem Datum | Anonymisieren können Sie {name} ab dem {date}. | Vous pourrez anonymiser {name} dès le {date}. | Potrà anonimizzare {name} dal {date}. | You can anonymise {name} from {date}. |
| Toast (Muster wie `tenants_deleted_toast`) | Mieter «{name}» anonymisiert | Locataire « {name} » anonymisé | Inquilino «{name}» anonimizzato | Tenant «{name}» anonymised |
| `backend_TENANT_ANONYMISE_TOO_EARLY` | Diesen Mieter können Sie erst ab dem {date} anonymisieren. | Vous ne pourrez anonymiser ce locataire qu’à partir du {date}. | Potrà anonimizzare questo inquilino solo dal {date}. | You can only anonymise this tenant from {date}. |
| `backend_TENANT_NOT_FORMER` (V-5) | Diesen Mieter können Sie nicht anonymisieren, solange ein Mietvertrag läuft oder bevorsteht. | Vous ne pouvez pas anonymiser ce locataire tant qu’un contrat de bail est en cours ou à venir. | Non può anonimizzare questo inquilino finché un contratto di locazione è in corso o futuro. | You cannot anonymise this tenant while a rental contract is running or upcoming. |
| Ersatzname (V-1, beim Anzeigen) | Anonymisierter Mieter | Locataire anonymisé | Inquilino anonimizzato | Anonymised tenant |
| Ersatzname (Plan des Aufrufers, falls der PO ihn will) | Ehemaliger Mieter | Ancien locataire | Ex inquilino | Former tenant |
| `privacy_retention_1`, angehängter Satz (entschieden, ohne R-3) | Ist ein Mieter ehemalig und sind seit dem Ende des Jahres, in dem sein letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung an ihn ging, 10 Jahre vergangen, können Sie ihn anonymisieren: Dwello entfernt dann Name, Kontaktdaten und Dokumente; die Beträge der Abrechnungen bleiben. | Lorsqu’un locataire est un ancien locataire et que 10 ans se sont écoulés depuis la fin de l’année au cours de laquelle son dernier contrat de bail a pris fin ou le dernier décompte ou rappel lui a été envoyé, vous pouvez l’anonymiser : Dwello supprime alors le nom, les coordonnées et les documents ; les montants des décomptes sont conservés. | Se un inquilino è un ex inquilino e sono trascorsi 10 anni dalla fine dell’anno in cui è terminato il suo ultimo contratto di locazione o gli è stato inviato l’ultimo conteggio o sollecito, può anonimizzarlo: Dwello elimina allora nome, dati di contatto e documenti; gli importi dei conteggi restano. | If a tenant is a former tenant and 10 years have passed since the end of the year in which their last rental contract ended or the last statement or reminder went to them, you can anonymise them: Dwello then removes the name, contact details and documents; the amounts of the statements stay. |

- Begriffe nach `docs/design/i18n-begriffe.md`: locataire / inquilino / tenant; ancien / ex / former; document / documento; décompte / conteggio / statement; rappel / sollecito / reminder; contrat de bail / contratto di locazione / rental contract.
- «coordonnées», «dati di contatto» und «contact details» wie in `privacy_stored_1` bzw. `help_tenants_1`.
- fr mit geschütztem Leerzeichen (U+00A0) vor «:» und «;» und in « … », wie in `fr.json`; en mit -ise, wie in `en.json`.

## Fehlende Begriffe

- **Mieter anonymisieren:** Issue #623 besteht. Vorschlag zur Ergänzung der Glossarzeile des Reviewers um den Ersatznamen (V-1): «**Anonymisierter Mieter**: Ehemaliger Mieter, den der Vermieter nach Ablauf der Aufbewahrung anonymisiert hat; Dwello zeigt ihn ohne Namen, Kontaktdaten und Dokumente, mit den Beträgen seiner Abrechnungen.» (`anonymised_on`). In #623 ergänzen, kein neues Issue.

## Nicht bestätigt

- **Ob eine Zahlung im Folgejahr zählt (V-7):** Ob Dwellos Zahlungsdatum für den Vermieter ein Buchungsbeleg ist und ob ein Beleg ohne Namen der Gegenpartei noch nachweist (Geschäftsbücherverordnung, GeBüV), habe ich nicht geprüft. Die GeBüV ist nicht geladen.
- **Ob eine Anonymisierung im Sinn des DSG vorliegt:** Wohnung, Mietdauer, Miete und Beträge bleiben. Der Vermieter (und wer das Haus kennt) kann den Mieter darüber weiterhin bestimmen. Personendaten sind nach Art. 5 Bst. a DSG «alle Angaben, die sich auf eine bestimmte oder bestimmbare natürliche Person beziehen». Rechtlich ist das eher Pseudonymisierung. Den PO-Entscheid (Option A) stelle ich nicht in Frage, Lehre und Rechtsprechung zur relativen Bestimmbarkeit habe ich aber nicht geprüft (**unsicher**).
- **Belege der Rechnungen** (`invoice_documents`): Sie können den Mieternamen enthalten, etwa eine Handwerkerrechnung «Wohnung Frei». Dwello entfernt sie beim Anonymisieren nicht, `privacy_stored_1` beschreibt das separat. Ob sie dazugehören, habe ich nicht entschieden.
- **Ausserhalb der Datenbank:** Protokolle des Servers bei Fehlern beim Mailversand (`console.error`) und Protokolle des Mailanbieters habe ich nicht geprüft.
- **Rückgabe nach dem Vertragsende:** Dwello speichert kein Rückgabedatum. Fällt eine späte Rückgabe ins Folgejahr, beginnt die Frist für Schadenersatz später (Art. 130 Abs. 1 OR). Nicht geprüft, wie oft das vorkommt.
- **Fedlex-Fassungen:**
  - OR in der Fassung vom 1.1.2025, geladen vom Filestore von Fedlex.
  - Eine Fassung vom 1.1.2026 lieferte nur die Seitenhülle. Ob es eine neuere Fassung gibt, ist offen.
  - DSG in der Fassung vom 1.9.2023.
  - Zitiert: Art. 5 Bst. a, 6 Abs. 2 und 4, 19 Abs. 2 DSG; Art. 127, 128 Ziff. 1, 130 Abs. 1, 135, 137, 957, 958f Abs. 1 OR.

Geprüft: Szenarientext `privacy.feature` gleich dem entschiedenen Satz; Szenarien `tenant-detail.feature` (Daten, Erwartungen, Bestätigung) gegen die Regel; Glossar «Mieter», «Dokument», «Abrechnungsdatum», «Mahnung»; Schema aller Tabellen auf Mieternamen; Protokoll.
