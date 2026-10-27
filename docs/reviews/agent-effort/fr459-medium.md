# Fachreview #459 Slice B (Mieter anonymisieren), vor der Umsetzung

Gegenstand: `git diff 35db6f79^ 35db6f79 -- tests/e2e/features` (`tenant-detail.feature` Z. 69-84, `privacy.feature` Z. 35-38) und `implementation_plan.md` Z. 145-146, Worktree `bench-fr459-med` (35db6f79). Massstab: #459 «Decided (product owner)» im Stand dieses Commits (Punkt 3 vom 2026-10-19, «Stop and ask» vom 2026-10-19).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Major | Bestätigung und Datenschutzerklärung sagen «Dokumente … werden endgültig entfernt», der Entscheid vom 2026-10-19 lässt versendete PDFs aber unverändert; dazu fehlen `contract_pdf`, Notizen und `documents.recipient` im Plan. Der Mieter wäre nicht anonymisiert (Art. 6 Abs. 4 DSG). |
| R-2 | Rechtstexte | Major | `privacy_retention_1` sagt weiter «Nicht löschen lassen sich … alle Mahnungen», obwohl das Anonymisieren die Mahnungs-PDFs entfernt. Der neue Satz lässt mit «oder» offen, welches Ereignis zählt. |
| V-1 | Verwalter | Major | Der Ersatzname «Ehemaliger Mieter» (tenant-detail.feature Z. 79) ist der Glossar-Status «ehemalig», den jeder ausgezogene Mieter hat. Fix: «Anonymisierter Mieter», neuer Begriff. |
| V-2 | Verwalter | Major | Welches Datum bei jedem Ereignis zählt, ist nicht festgelegt (Abrechnung: `statementDate`, Status; Mahnung: `sentAt` oder Erstellung; Zahlung). Plan und Szenarien prüfen nur das Vertragsende. |
| V-3 | Verwalter | Major | Wann Dwello das Anonymisieren auch nach Ablauf der Frist ablehnt, ist nicht festgelegt: bei einem laufenden oder künftigen Mietvertrag, bei einem Entwurf einer Abrechnung oder bei einem Brief «zu versenden». |
| M-1 | Mietrecht | Minor | Mit den Dokumenten verschwindet auch ein hochgeladener Verlustschein, und dessen Forderung verjährt erst nach 20 Jahren (Art. 149a Abs. 1 SchKG). Fix: In der Bestätigung einen Satz ergänzen, der zum vorherigen Herunterladen rät (Wortlaut unten), Entscheid PO. |
| V-4 | Verwalter | Minor | Das Szenario «vor Ablauf» (Z. 81-84) nutzt feste Daten und schlägt ab dem 01.01.2030 fehl. Fix: das Vertragsende relativ zum Vorjahr angeben (Schritt mit «vor N Jahren»). |
| V-5 | Verwalter | Minor | Der Plan (Z. 145-146) führt für Slice B weder die pg-Tests aus #459 «Done means» (Datum, was entfernt wird und was bleibt) auf noch die neuen Zustände in `tests/a11y/screens.json` und `sprachen-bildschirme.feature` (Bestätigung, Hinweis «ab dem …», anonymisierter Mieter). Fix: Diese Punkte in den Plan aufnehmen. |

## R-1 (Major): Anonymisierung unvollständig, Folge falsch angegeben

- **Beleg:** `tenant-detail.feature` Z. 77: «Name, Kontaktdaten und Dokumente von Lea Frei werden endgültig entfernt. Die Beträge der Abrechnungen bleiben.» `privacy.feature` Z. 38: «Dwello entfernt dann Name, Kontaktdaten und Dokumente». Dagegen steht #459, Entscheid 2026-10-19: «stored PDFs that were sent stay unchanged as records (retention duty)». Wo heute personenbezogene Daten liegen (`backend/src/db/schema.ts`):
  - `utility_statements.pdf_blob` (Z. 477): Name, Korrespondenzadresse und QR-Zahlteil mit Schuldner;
  - `documents` mit `type = 'statement'` und `'reminder'`: PDFs; dazu `recipient` mit der E-Mail-Adresse (Z. 581);
  - `rental_contracts.contract_pdf` und `notes` (Z. 139-140) sowie `utility_statements.notes` (Z. 480);
  - `audit_log.details` (Z. 609 ff.; z. B. `recordStatementCorrection`).
  
  Nach dem Glossar ist ein «Dokument» ein «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF, oder vom Liegenschaftsverwalter hochgeladene Datei» (UBIQUITOUS_LANGUAGE.md Z. 216). Die per E-Mail versendeten Abrechnungen fallen also darunter, und der Satz verspricht ihr Entfernen.
- **Warum falsch:** Art. 6 Abs. 4 DSG (Fedlex, Stand 7. Juli 2025): «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Bleiben PDFs mit Name und Adresse, ist der Mieter weiterhin bestimmbar, also nicht anonymisiert. Dann sind die Bestätigung und die Datenschutzerklärung irreführend. Den Grund «retention duty» gibt es an diesem Tag nicht mehr: Freigegeben wird das Anonymisieren erst, wenn die Frist nach Art. 958f Abs. 1 OR abgelaufen ist. Ausserdem ist der Entscheid in sich widersprüchlich: Die Mahnungs-PDFs (ebenfalls versendet) werden entfernt, die Abrechnungs-PDFs bleiben.
- **Fix (Entscheid PO, `needs-decision`):**
  - Das Anonymisieren entfernt auch `pdf_blob`, die Dokumente vom Typ `statement`, `contract_pdf`, die Notizen von Mietvertrag und Abrechnung und `documents.recipient`. Ein späterer Download erzeugt das PDF neu, mit dem Ersatznamen und ohne Adresse.
  - Den Namen im Protokoll ersetzt Dwello, wie am 2026-10-19 entschieden.
  - Im Plan je ein pg-Test pro Ort.
  - Entscheidet der PO dagegen, dass PDFs bleiben, müssen Bestätigung und Datenschutzerklärung das ausdrücklich sagen.

## R-2 (Major): `privacy_retention_1` widersprüchlich und mehrdeutig

- **Beleg:** `messages/de.json:173` sagt: «Nicht löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt.» Der neue Satz in `privacy.feature` Z. 38 lautet: «… seit dem Ende des Jahres, in dem sein letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung an ihn ging, 10 Jahre vergangen …». Der Plan sagt nicht, ob der Satz den bisherigen ersetzt oder ergänzt; das bestehende Szenario «Wie lange Dwello Daten aufbewahrt» (Z. 92-93) braucht den Satz «Dwello löscht nichts von selbst».
- **Warum falsch:** Nach dem Anonymisieren sind die Mahnungs-PDFs entfernt (#459, 2026-10-19). Die Aussage «alle Mahnungen» lassen sich nicht löschen trifft dann nicht mehr zu. Mit «oder» lässt sich der Satz so lesen, dass ein beliebiges Ereignis die Frist auslöst, etwa das frühere Vertragsende, obwohl das Letzte gilt. Die Korrespondenzadresse ist nach dem Glossar (Z. 24) kein Teil der «Kontaktdaten», wird aber entfernt.
- **Fix:** Den Satz an `privacy_retention_1` anhängen und den bisherigen auf «nicht einzeln» einschränken (Wortlaut unten). Die Szenariozeile Z. 38 entsprechend anpassen (sie ist `@wip`).

## V-1 (Major): Ersatzname «Ehemaliger Mieter»

- **Beleg:** `tenant-detail.feature` Z. 79 «Dann heisst der Mieter "Ehemaliger Mieter"». Das Glossar (Z. 24) definiert «ehemalig, wenn alle seine Mietverträge beendet sind», und `i18n-begriffe.md` Z. 27 übersetzt mit «ancien / ex / former».
- **Warum falsch:**
  - Jeder ausgezogene Mieter ist «ehemalig». In der Vertragshistorie, in der Mieterliste und auf der Abrechnung liest der Verwalter den Namen darum als Status, nicht als Anonymisierung.
  - Wer später einen echten Mieter mit diesem Nachnamen sucht oder die Liste nach «ehemalig» liest, wird in die Irre geführt.
  - Der Ersatzname ist nicht entschieden (#459 nennt keinen).
- **Fix:** «Anonymisierter Mieter» (fr/it/en unten). Den Ersatznamen in der Sprache der Oberfläche zum Zeitpunkt des Anonymisierens speichern, oder ihn bei der Anzeige übersetzen und `tenants.anonymised_on` als Kennzeichen führen. Neuer Glossarbegriff, siehe unten.

## V-2 (Major): Ereignisse und ihr Datum nicht festgelegt

- **Beleg:** #459 Punkt 3: «the latest of contract end, last sent statement, last reminder». Szenario Z. 72 legt nur einen Mietvertrag an. Der Plan Z. 145 sagt nichts zu den Tests. `utility_statements` hat kein Versanddatum, nur `statementDate`, `status` (draft/sent/paid/settled/replaced), `paidDate` und `reminderSentDate` (schema.ts, Block ab Z. 427). Ein Brief hat `documents.sentAt` und `status` sent/to_send.
- **Nachgerechnet** (erster Tag = 1. Januar des Jahres des letzten Ereignisses + 11):

  | Fall | Ereignisse | Erster Tag | Folge |
  |---|---|---|---|
  | Szenario 1 | Vertragsende 31.12.2014 | 01.01.2025 | heute (26.10.2026) angeboten, stimmt |
  | Szenario 2 | Vertragsende 31.12.2019 | 01.01.2030 | stimmt |
  | Mieterwechsel | Vertragsende 30.06.2015, Schlussabrechnung vom 15.03.2016 | 01.01.2027 | heute noch nicht |
  | Mahnung | Vertragsende 2014, Mahnung 05.01.2016 | 01.01.2027 | heute noch nicht |
  | Rückerstattung | Vertragsende 31.12.2014, Abrechnung vom 10.03.2015 mit Rückerstattung, Vermieter zahlt sie 2017 zurück | ohne Zahlung als Ereignis 01.01.2026, mit Zahlung 01.01.2028 | heute angeboten, obwohl der Buchungsbeleg von 2017 nach Art. 958f Abs. 1 OR bis Ende 2027 aufzubewahren ist |

  Art. 958f Abs. 1 OR (Fedlex, Stand 1. Oktober 2026): «Die Geschäftsbücher und die Buchungsbelege … sind während zehn Jahren aufzubewahren. Die Aufbewahrungsfrist beginnt mit dem Ablauf des Geschäftsjahres.»
- **Warum falsch:** Ohne festgelegte Daten kann die Umsetzung zu früh freigeben, zum Beispiel wenn sie die Periode statt `statementDate` nimmt oder eine Mahnung «zu versenden» ohne `sentAt` übergeht. Ein zu früh gelöschter Datensatz lässt sich nicht wiederherstellen.
- **Fix:**
  - Ereignisse festlegen: Vertragsende des letzten Mietvertrags; `statementDate` jeder nicht als Entwurf geführten Abrechnung, ersetzte eingeschlossen; Tag des Versands der letzten Mahnung (Schweizer Tag).
  - Ob eine Zahlung oder Rückerstattung (`paidDate`) zählt, entscheidet der PO. Für Buchführungspflichtige wäre sie ein eigener Buchungsbeleg.
  - pg-Tests mit den vier Fällen oben in den Plan aufnehmen.

## V-3 (Major): Ablehnungsgründe neben der Frist fehlen

- **Beleg:** Szenarien Z. 69-84 und Plan Z. 145. #459 «Done means» verlangt nur: «Before that date … the backend refuses it (coded error)».
- **Warum falsch:**
  - Ein Mieter mit einem künftigen Mietvertrag ist nach dem Glossar (Z. 24) «künftig», nicht «ehemalig». Ein altes Vertragsende darf ihn also nicht freigeben.
  - Ein Entwurf einer Abrechnung oder ein Brief «zu versenden» würde nach dem Anonymisieren ohne Namen und ohne Korrespondenzadresse erstellt oder versendet: eine Abrechnung an niemanden, die Art. 257b OR nicht erfüllt.
- **Fix:** Das Backend lehnt mit je einem eigenen Code ab: bei einem laufenden oder künftigen Mietvertrag, bei einem Entwurf, bei einem Brief «zu versenden». Je ein pg-Test, und die Seite nennt den Grund. Ob eine überfällige Abrechnung das Anonymisieren sperrt oder nur einen Hinweis auslöst, entscheidet der PO (vgl. M-1).

## Formulierungen

| key | de | fr | it | en |
|---|---|---|---|---|
| tenants_anonymised_name | Anonymisierter Mieter | Locataire anonymisé | Inquilino anonimizzato | Anonymised tenant |
| privacy_retention_1 | Ausser in der öffentlichen Demo löscht Dwello keine gespeicherten Daten von selbst. Was Sie erfassen, bleibt gespeichert, bis Sie es löschen. Nicht einzeln löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt. Ist ein Mieter ehemalig und sind seit dem Ende des Jahres, in dem das Letzte davon geschah (sein letzter Mietvertrag endete, die letzte Abrechnung oder Mahnung ging an ihn), 10 Jahre vergangen, können Sie ihn anonymisieren: Dwello entfernt dann Name, Kontaktdaten, Korrespondenzadresse und Dokumente; die Beträge der Abrechnungen bleiben. | Sauf dans la démo publique, Dwello ne supprime aucune donnée enregistrée de lui-même. Ce que vous saisissez reste enregistré jusqu’à ce que vous le supprimiez. Ne peuvent pas être supprimés individuellement les décomptes envoyés, tous les rappels ainsi que les locataires et les contrats de bail pour lesquels il existe des décomptes. Lorsqu’un locataire est un ancien locataire et que 10 ans se sont écoulés depuis la fin de l’année où a eu lieu le dernier de ces événements (fin de son dernier contrat de bail, envoi du dernier décompte ou rappel), vous pouvez l’anonymiser : Dwello supprime alors le nom, les coordonnées, l’adresse de correspondance et les documents ; les montants des décomptes restent. | Tranne che nella demo pubblica, Dwello non elimina da sé alcun dato salvato. Ciò che registra rimane salvato finché non lo elimina. Non possono essere eliminati singolarmente i conteggi inviati, tutti i solleciti nonché gli inquilini e i contratti di locazione per cui esistono conteggi. Se si tratta di un ex inquilino e sono trascorsi 10 anni dalla fine dell’anno in cui è avvenuto l’ultimo di questi eventi (fine del suo ultimo contratto di locazione, invio dell’ultimo conteggio o sollecito), può anonimizzarlo: Dwello rimuove allora nome, dati di contatto, indirizzo di corrispondenza e documenti; gli importi dei conteggi restano. | Except in the public demo, Dwello deletes no stored data by itself. What you enter stays stored until you delete it. What cannot be deleted one by one: statements that were sent, all reminders, and tenants and rental contracts that have statements. Once a tenant is a former tenant and 10 years have passed since the end of the year in which the last of these happened (their last rental contract ended, the last statement or reminder went to them), you can anonymise them: Dwello then removes the name, contact details, correspondence address and documents; the amounts of the statements stay. |
| tenants_anonymise_consequence | Name, Kontaktdaten, Korrespondenzadresse und Dokumente von {name} werden endgültig entfernt. Die Beträge der Abrechnungen bleiben. Laden Sie vorher herunter, was Sie noch brauchen, etwa einen Verlustschein. | Le nom, les coordonnées, l’adresse de correspondance et les documents de {name} seront définitivement supprimés. Les montants des décomptes restent. Téléchargez d’abord ce dont vous avez encore besoin, par exemple un acte de défaut de biens. | Nome, dati di contatto, indirizzo di corrispondenza e documenti di {name} vengono rimossi definitivamente. Gli importi dei conteggi restano. Scarichi prima ciò che le serve ancora, ad esempio un attestato di carenza beni. | The name, contact details, correspondence address and documents of {name} will be removed for good. The amounts of the statements stay. First download what you still need, such as a certificate of unpaid debt (Verlustschein). |
| tenants_anonymise_from | Ab dem {date} können Sie diesen Mieter anonymisieren: Dann sind 10 Jahre seit dem Ende von {year} vergangen, dem Jahr, in dem sein letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung an ihn ging, je nachdem, was später war. | Vous pourrez anonymiser ce locataire à partir du {date} : 10 ans se seront alors écoulés depuis la fin de {year}, l’année où son dernier contrat de bail a pris fin ou où le dernier décompte ou rappel lui a été envoyé, selon ce qui est le plus tardif. | Potrà anonimizzare questo inquilino a partire dal {date}: saranno allora trascorsi 10 anni dalla fine del {year}, l’anno in cui è terminato il suo ultimo contratto di locazione o gli è stato inviato l’ultimo conteggio o sollecito, a seconda di quale evento sia l’ultimo. | You can anonymise this tenant from {date}: by then 10 years will have passed since the end of {year}, the year in which their last rental contract ended or the last statement or reminder went to them, whichever was later. |

## Fehlende Begriffe

- **Anonymisierter Mieter** (zu #623, kein neues Issue): «Ehemaliger Mieter, den der Vermieter nach Ablauf der Aufbewahrung anonymisiert hat; Dwello zeigt ihn ohne Name, Kontaktdaten, Korrespondenzadresse und Dokumente, mit den Beträgen seiner Abrechnungen.» fr «locataire anonymisé», it «inquilino anonimizzato», en «anonymised tenant». Labels `domain`, `needs-decision`.
- **Mieter anonymisieren:** schon #623.

## Nicht bestätigt

- **Ob ein privater Vermieter ohne Unternehmen Belege 10 Jahre aufbewahren muss:** Nach Art. 957 OR (Fedlex, Stand 1. Oktober 2026) gilt die Buchführungspflicht nur für Einzelunternehmen, Personengesellschaften und juristische Personen. Art. 127 OR («Mit Ablauf von zehn Jahren verjähren alle Forderungen, für die das Bundeszivilrecht nicht etwas anderes bestimmt») trägt die 10 Jahre als allgemeine Frist, und für Mietzins gilt Art. 128 Ziff. 1 OR (5 Jahre). Steuerrechtliche Aufbewahrungsfristen für Private habe ich nicht auf Fedlex nachgeschlagen (DBG/StHG): **unsicher**. Der Entscheid (feste 10 Jahre, kein kürzerer Zeitraum) ist konservativ und bleibt davon unberührt.
- **Was «anonymisiert» im Sinne des DSG genau verlangt:** Gelesen habe ich nur Art. 6 DSG (Fedlex, Stand 7. Juli 2025), nicht die Begriffe in Art. 5; R-1 stützt sich nur darauf, dass Name und Adresse im PDF den Mieter offensichtlich bestimmbar lassen.
- **Ob eine Betreibung oder ein Verlustschein die Frist verlängern sollte:** Dwello erfasst beides nicht. Art. 149a Abs. 1 SchKG (Fedlex, Stand 1. Januar 2026): «Die durch den Verlustschein verurkundete Forderung verjährt 20 Jahre nach der Ausstellung des Verlustscheines». M-1 behandelt das nur als Hinweis; ob mehr nötig ist, entscheidet der PO.
- **Welche Angaben die Protokolleinträge (`audit_log.details`) zu einem Mieter enthalten:** nur `audit-log.service.ts` und die Aufrufer gegrept, die einzelnen Einträge nicht gelesen.

Geprüft: Fristberechnung der beiden Szenarien (01.01.2025 bzw. 01.01.2030, Art. 958f Abs. 1 OR); Bestätigungstext entspricht dem Entscheid vom 2026-10-19; Mieterliste ohne «Lea Frei» nach dem Anonymisieren; Ablehnung vor Ablauf ohne Knopf.
