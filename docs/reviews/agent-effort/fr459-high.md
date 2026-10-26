# Fachreview #459 Teil B, Runde 1 (vor der Umsetzung)

Gegenstand: `git diff 35db6f79^ 35db6f79 -- tests/e2e/features` (`tenant-detail.feature:69-84`, `privacy.feature:35-38`) und der Plan für Teil B (`implementation_plan.md:145-146`). Worktree `bench-fr459-high`, detached bei 35db6f79. Entscheidungsstand: #459 «Decided» bis und mit 2026-10-19 und der Kommentar zu #411 (issuecomment-6249574737, «Punkt 3»). Spätere Einträge im Issue (2026-10-22) sind Antworten auf diese Runde und galten hier nicht als Quelle.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Blocker | Der Entscheid vom 2026-10-19 lässt versendete PDFs unverändert. Bestätigung und Datenschutzerklärung versprechen dagegen, dass «Dokumente» endgültig entfernt werden. Auch Art. 6 Abs. 4 DSG verlangt das. |
| R-2 | Rechtstexte | Major | Der Satz in `privacy_retention_1` ist mehrdeutig («oder» statt «das Letzte davon»). Er widerspricht dem Satz davor («Nicht löschen lassen sich … alle Mahnungen»), und es fehlt die Korrespondenzadresse. |
| V-1 | Verwalter | Major | Der Ersatzname «Ehemaliger Mieter» ist der Mieterstatus «ehemalig». Er wäre als deutscher Text gespeichert. |
| V-2 | Verwalter | Major | Die Ereignisse der Frist sind nicht festgelegt (welches Datum der Abrechnung, welcher Mahnung, welche Status). Die Szenarien prüfen nur das Vertragsende, nicht den üblichen Fall der Schlussabrechnung im Folgejahr. |
| V-3 | Verwalter | Major | Weitere Stellen mit dem Namen sind weder im Entscheid noch im Plan genannt: PDF des Mietvertrags, Bemerkungen der Abrechnungen (stehen im PDF), Notizen der Mietverträge, Titel und Dateinamen der Dokumente. |
| V-4 | Verwalter | Major | Für «die Beträge bleiben» und für die entfernten Daten ausserhalb der Mieterliste gibt es weder ein Szenario noch einen geplanten Test. Dasselbe gilt für die Ablehnung durch das Backend (Code). Der Plan für Teil B hat nur einen Punkt. |
| V-5 | Verwalter | Minor | Der Text bei «erst ab dem {date}» ist nicht festgelegt, und das Szenario prüft nur das Datum (`tenant-detail.steps.ts:118`). Wortlaut siehe Tabelle `tenants_anonymise_from`. |
| V-6 | Verwalter | Minor | Kein Szenario und kein geplanter Test zeigt, dass ein aktiver oder künftiger Mieter oder ein Mieter ohne Mietvertrag keinen Knopf bekommt und das Backend ablehnt (#459 «Done means»: «a former tenant's page»). Fix: eine Examples-Zeile oder einen `*.pg.test.ts`-Fall ergänzen. |
| V-7 | Verwalter | Minor | Das Szenario «vor Ablauf» schlägt ab dem 01.01.2030 fehl: Die E2E-Tests laufen mit der echten Uhr (keine `clock.install` in `tests/e2e`). Fix: Vertragsende «2025-01-01» bis «2025-12-31», erwartet «01.01.2036». |
| M-1 | Mietrecht | Minor | Eine überfällige Abrechnung eines anonymisierten Mieters bietet weiter eine Mahnung an, jetzt an einen Mieter ohne Adresse. Fix: Mahnung und Versand für anonymisierte Mieter ablehnen (Code). Die Forderung ist dann ohnehin verjährt (Art. 128 Ziff. 1 OR, 5 Jahre). |

## Blocker und Majors

### R-1: Versendete PDFs bleiben, laut Texten werden «Dokumente» entfernt

- **Belege:**
  - #459 «Decided», 2026-10-19: «anonymising removes the name from the master data and the audit log ("Protokoll"); stored PDFs that were sent stay unchanged as records (retention duty).»
  - Dagegen verspricht die Bestätigung (`tenant-detail.feature:75`): «Name, Kontaktdaten und Dokumente von Lea Frei werden endgültig entfernt.»
  - Die Datenschutzerklärung (`privacy.feature:38`) sagt: «Dwello entfernt dann Name, Kontaktdaten und Dokumente».
  - Ein per E-Mail versendetes PDF ist nach dem Glossar ein Dokument (`UBIQUITOUS_LANGUAGE.md:216`: «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF») und liegt als `documents.type = 'statement'` (`backend/src/db/schema.ts:571`). Versendete Abrechnungen per Brief liegen als `utility_statements.pdf_blob` (`schema.ts:477`). Beide enthalten Name, Korrespondenzadresse und den Zahlteil «Zahlbar durch».
- **Warum falsch:**
  - Setzt die Umsetzung den Entscheid um, sind Bestätigung und Datenschutzerklärung falsch. Bei einer irreversiblen Aktion ist das besonders schwer, denn der Vermieter glaubt, die Daten seien weg.
  - Zudem ist der Mieter dann nicht anonymisiert: Name und Adresse stehen weiter in den PDFs.
  - Die Begründung «retention duty» trägt nicht. Anonymisieren ist erst erlaubt, wenn die Frist von 10 Jahren abgelaufen ist; danach gilt Art. 6 Abs. 4 DSG (SR 235.1, Stand 7.7.2025): «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Auch Art. 958f Abs. 1 OR (SR 220, Stand 1.10.2026) verlangt die Aufbewahrung nur «während zehn Jahren».
- **Fix (Entscheid des Product Owners nötig):** Variante (a), empfohlen: Anonymisieren entfernt auch `pdf_blob` und die per E-Mail versendeten Abrechnungen (`documents.type = 'statement'`). Ein späterer Download erzeugt das PDF neu, mit Ersatzname und ohne Adresse. Die Texte bleiben dann richtig. Variante (b): Die PDFs bleiben. Dann müssen Bestätigung und Datenschutzerklärung das sagen, und der Mieter gilt nicht als anonymisiert, was Art. 6 Abs. 4 DSG verletzt. Bis zum Entscheid: keine Tests dazu grün.

### R-2: Satz zur Aufbewahrung mehrdeutig und im Widerspruch

- **Belege:**
  - `privacy.feature:38`: «… seit dem Ende des Jahres, in dem sein letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung an ihn ging, 10 Jahre vergangen …». Mit «oder» kann man auch das früheste Ereignis meinen; die Regel aus #411 «Punkt 3» ist aber «das Späteste dieser Ereignisse».
  - Der heutige Satz im selben Schlüssel (`messages/de.json:173`) lautet: «Nicht löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt.» Das Anonymisieren entfernt aber die PDFs der Mahnungen.
  - `privacy_stored_1` (`de.json:153`) nennt «Mieter mit Kontaktdaten und Korrespondenzadresse» getrennt. Der neue Satz nennt die Adresse nicht, obwohl sie entfernt wird (#411 «Punkt 3»).
  - Ob der Satz den bisherigen Text ersetzt oder ergänzt, sagen weder das Szenario noch der Plan («gets»).
- **Warum falsch:** Die Datenschutzerklärung muss beschreiben, was die App tut. In der Lesart «frühestes Ereignis» verspricht sie das Anonymisieren zu früh. Die Sätze «nicht löschen» und «entfernt Dokumente» widersprechen sich.
- **Fix:** Den Satz an den bestehenden Text anhängen. Wortlaut siehe Tabelle, `privacy_retention_1` als ganzer Wert. Da der Wortlaut entschieden ist, braucht die Änderung den Product Owner. Das Szenario `privacy.feature:38` ist `@wip` und kann frei angepasst werden. Die Bestätigung nennt ebenfalls die Korrespondenzadresse (`tenants_anonymise_confirm`).

### V-1: Ersatzname «Ehemaliger Mieter»

- **Belege:**
  - `tenant-detail.feature:77` («Dann heisst der Mieter "Ehemaliger Mieter"»).
  - Das Glossar (`UBIQUITOUS_LANGUAGE.md:24`) definiert «ehemalig, wenn alle seine Mietverträge beendet sind».
  - Die Mieterliste filtert nach «Ehemalige Mieter» (`messages/de.json:650`).
  - Den Namen speichert die App in `tenants.first_name/last_name` (`schema.ts:91-92`). Ein deutscher Ersatzname erschiene in fr/it/en und in Abrechnungen in der Sprache des Mieters.
- **Warum falsch:** Im Filter «Ehemalige Mieter» stünden nicht anonymisierte ehemalige Mieter neben Einträgen namens «Ehemaliger Mieter». Wer wenig Erfahrung hat, hält den Namen für den Status. Zudem zeigen fr/it/en Deutsch.
- **Fix:** «Anonymisierter Mieter» / «Locataire anonymisé» / «Inquilino anonimizzato» / «Anonymised tenant» (Tabelle `tenants_anonymised_name`). Am saubersten speichert die App das Anonymisieren (z.B. Tag) und zeigt den Namen in der Sprache der Oberfläche bzw. im PDF in der Sprache des Mieters. Sonst speichert sie den Namen in der Sprache der Oberfläche zum Zeitpunkt des Anonymisierens. Das Szenario (`@wip`) entsprechend anpassen. Glossar-Issue #623 um den Ersatznamen ergänzen.

### V-2: Die Ereignisse der Frist sind nicht festgelegt

- **Belege:**
  - Szenarien `tenant-detail.feature:72, 82` haben nur ein Vertragsende, keine Abrechnung und keine Mahnung.
  - Der Plan (`implementation_plan.md:145-146`) definiert nichts.
  - Mögliche Datenfelder: `utility_statements.statement_date` und `status` (draft, sent, paid, settled, replaced; `schema.ts:443, 472`), `reminder_sent_date` (`schema.ts:476`), `documents.sent_at` und `status` (sent, to_send; `schema.ts:578-579`). Ein Versanddatum für Abrechnungen per Brief gibt es nicht.
- **Warum falsch:** In der Praxis geht die Schlussabrechnung erst im Folgejahr an den ausgezogenen Mieter. Das Vertragsende entscheidet also oft nicht über die Frist. Eine Umsetzung, die nur das Vertragsende nimmt, besteht beide Szenarien und gibt das Anonymisieren ein Jahr zu früh frei.
- **Nachrechnung** (erster Tag = 1. Januar des Jahres «Jahr des spätesten Ereignisses + 11»):
  - Vertragsende 31.12.2014 → 01.01.2025, heute (26.10.2026) angeboten; Szenario 1 stimmt.
  - Vertragsende 31.12.2019 → 01.01.2030; Szenario 2 stimmt.
  - Randfall: Vertragsende 01.01.2015 → 01.01.2026. Ein Tag später verschiebt die Frist um ein Jahr, das entspricht der Regel.
  - Randfall: Vertragsende 30.09.2015, Abrechnung 2015 mit Abrechnungsdatum 20.04.2016 → 01.01.2027, heute **nicht** angeboten. Nur nach dem Vertragsende wäre es seit 01.01.2026 angeboten.
  - Die Regel ist grosszügiger als die Verjährung. Art. 127 OR: «Mit Ablauf von zehn Jahren verjähren alle Forderungen, für die das Bundeszivilrecht nicht etwas anderes bestimmt.» Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.» Das Jahresende verlängert also nur.
- **Fix (im Plan festhalten, dazu ein Szenario mit einem Mieter, der wie im Randfall nach dem Vertragsende eine Abrechnung erhielt):**
  - Ereignisse sind (1) das Vertragsende des letzten Mietvertrags; (2) das Abrechnungsdatum der letzten Abrechnung mit Status sent, paid, settled oder replaced (Entwürfe zählen nicht); (3) der Schweizer Tag, an dem die letzte Mahnung versendet wurde (`sent_at`, sonst `reminder_sent_date`; eine Mahnung «to_send» zählt nicht).
  - Eine Zahlung (`paid_date`) ist kein Ereignis.

### V-3: Weitere Stellen mit dem Namen

- **Belege:**
  - `rental_contracts.contract_pdf` und `notes` (`schema.ts:139-140`; API `backend/src/routes/contracts.ts:62-63`; Export `tenant-export.service.ts:71-74`).
  - `utility_statements.notes` (`schema.ts:480`). Die UI sagt dazu: «Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF, das der Mieter erhält.» (`messages/de.json:1376`).
  - `documents.title`, `file_name`, `recipient` (E-Mail-Adresse, `schema.ts:573-581`).
  - Der Entscheid (#411 «Punkt 3») nennt nur «Name, Kontaktdaten, Korrespondenzadresse, hochgeladene Dokumente und die PDFs der Mahnungen … den Namen in gespeicherten Abrechnungsdaten».
  - Nach dem Glossar ist das PDF des Mietvertrags kein «Dokument» (`UBIQUITOUS_LANGUAGE.md:216`).
- **Warum falsch:** Der unterschriebene Mietvertrag und frei geschriebene Bemerkungen enthalten Name und oft Adresse. Bleiben sie, ist der Mieter nicht anonymisiert, und Datenschutzerklärung und Bestätigung stimmen nicht. Die Bemerkungen erschienen zudem in jedem neu erzeugten PDF. #459 «Stop and ask» verlangte genau diese Liste; der Plan hat sie nicht.
- **Fix:** Im Plan festhalten, dass das Anonymisieren auch `contract_pdf` und die Notizen der Mietverträge und Bemerkungen der Abrechnungen leert (der Entscheid liegt beim Product Owner, weil er über #411 hinausgeht). Mit dem Mieter gehen alle `documents` samt `recipient`. Das Protokoll unter «Einstellungen» nennt heute keine Mieternamen (`recordAudit` in `statement.service.ts:803`, `audit-log.service.ts:28`: nur Abrechnungsnummer), dort ist nichts zu tun. Glossarzeile «Mieter anonymisieren» (#623) entsprechend vervollständigen.

### V-4: «Die Beträge bleiben» ist nicht festgehalten

- **Belege:**
  - `tenant-detail.feature:71-79`: Lea Frei hat keine Abrechnung, keine Mahnung, kein Dokument. Geprüft werden nur Seitentitel und Mieterliste (`tenant-detail.steps.ts:111-112`, `:88`).
  - Der Plan (`implementation_plan.md:145-146`) nennt weder die `*.pg.test.ts` noch Migration noch Ablehnungscode, die #459 «Done means» verlangt («what anonymising removes and keeps (also statement snapshots and stored PDFs)», «the backend refuses it (coded error)»).
- **Warum falsch:** Eine Umsetzung, die die Abrechnungen mit dem Mieter löscht, oder eine, die den Namen in Vertragshistorie und Abrechnungsliste stehen lässt, besteht das Szenario. Für den Vermieter ist das Bleiben der Beträge der Kern des Entscheids, denn Gebäudekosten früherer Jahre bleiben vollständig.
- **Fix:**
  - Szenario 1 um eine versendete Abrechnung 2014 für Lea Frei ergänzen und nach dem Anonymisieren prüfen: In der Abrechnungsliste steht der Saldo unverändert beim Ersatznamen; die Vertragshistorie der Wohnung «1.01» nennt den Ersatznamen (vorhandene Frage `contractHistoryNaming`).
  - Im Plan zudem folgende `*.pg.test.ts` aufführen: was entfernt und was behalten wird (Felder aus V-3, R-1); der erste Tag aus V-2 mit den vier Werten oben; Ablehnung mit eigenem Code vor dem ersten Tag und für einen nicht ehemaligen Mieter.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| privacy_retention_1 | Ausser in der öffentlichen Demo löscht Dwello keine gespeicherten Daten von selbst. Was Sie erfassen, bleibt gespeichert, bis Sie es löschen. Nicht einzeln löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt. Ist ein Mieter ehemalig und sind seit dem Ende des Jahres, in dem das Letzte davon geschah (sein letzter Mietvertrag endete, die letzte Abrechnung oder Mahnung ging an ihn), 10 Jahre vergangen, können Sie ihn anonymisieren: Dwello entfernt dann Name, Kontaktdaten, Korrespondenzadresse und Dokumente; die Beträge der Abrechnungen bleiben. | Sauf dans la démo publique, Dwello ne supprime aucune donnée enregistrée de lui-même. Ce que vous saisissez reste enregistré jusqu’à ce que vous le supprimiez. Ne peuvent pas être supprimés individuellement les décomptes envoyés, tous les rappels ainsi que les locataires et les contrats de bail pour lesquels il existe des décomptes. Pour un ancien locataire, une fois écoulés 10 ans depuis la fin de l’année où a eu lieu le dernier de ces événements (fin de son dernier contrat de bail, envoi du dernier décompte ou du dernier rappel), vous pouvez l’anonymiser : Dwello supprime alors le nom, les coordonnées, l’adresse de correspondance et les documents ; les montants des décomptes sont conservés. | Tranne che nella demo pubblica, Dwello non elimina da sé alcun dato salvato. Ciò che registra rimane salvato finché non lo elimina. Non possono essere eliminati singolarmente i conteggi inviati, tutti i solleciti nonché gli inquilini e i contratti di locazione per cui esistono conteggi. Per un ex inquilino, trascorsi 10 anni dalla fine dell’anno in cui è avvenuto l’ultimo di questi eventi (fine del suo ultimo contratto di locazione, invio dell’ultimo conteggio o sollecito), può anonimizzarlo: Dwello elimina allora nome, dati di contatto, indirizzo di corrispondenza e documenti; gli importi dei conteggi rimangono. | Except in the public demo, Dwello deletes no stored data by itself. What you enter stays stored until you delete it. What cannot be deleted individually: statements that were sent, all reminders, and tenants and rental contracts that have statements. For a former tenant, once 10 years have passed since the end of the year in which the last of these happened (their last rental contract ended, the last statement or reminder went to them), you can anonymise them: Dwello then removes the name, contact details, correspondence address and documents; the amounts of the statements remain. |
| tenants_anonymise_confirm | Name, Kontaktdaten, Korrespondenzadresse und Dokumente von {name} werden endgültig entfernt. Die Beträge der Abrechnungen bleiben. | Le nom, les coordonnées, l’adresse de correspondance et les documents de {name} seront définitivement supprimés. Les montants des décomptes sont conservés. | Il nome, i dati di contatto, l’indirizzo di corrispondenza e i documenti di {name} saranno eliminati definitivamente. Gli importi dei conteggi rimangono. | The name, contact details, correspondence address and documents of {name} will be removed permanently. The amounts of the statements remain. |
| tenants_anonymised_name | Anonymisierter Mieter | Locataire anonymisé | Inquilino anonimizzato | Anonymised tenant |
| tenants_anonymise_from | Sie können den Mieter ab dem {date} anonymisieren, 10 Jahre nach dem Ende von {year}. In diesem Jahr endete sein letzter Mietvertrag oder ging zuletzt eine Abrechnung oder Mahnung an ihn. | Vous pourrez anonymiser ce locataire à partir du {date}, 10 ans après la fin de {year}. C’est l’année où son dernier contrat de bail a pris fin ou où il a reçu son dernier décompte ou rappel. | Potrà anonimizzare questo inquilino dal {date}, 10 anni dopo la fine del {year}. In quell’anno è terminato il suo ultimo contratto di locazione o gli è stato inviato l’ultimo conteggio o sollecito. | You can anonymise this tenant from {date}, 10 years after the end of {year}. In that year, their last rental contract ended or they last received a statement or reminder. |

## Fehlende Begriffe

#623 («Mieter anonymisieren») besteht. Vorschlag zur Ergänzung der Zeile dort (V-1, V-3, R-1 Variante a):

| Begriff | Definition (Vorschlag) | Code |
|---|---|---|
| **Mieter anonymisieren** | Entfernt bei einem ehemaligen Mieter, sobald seit dem Ende des Jahres des spätesten Ereignisses (Vertragsende des letzten Mietvertrags, letzte versendete Abrechnung, letzte versendete Mahnung) 10 Jahre vergangen sind, Name, Kontaktdaten, Korrespondenzadresse, alle Dokumente (auch die PDFs der Abrechnungen und des Mietvertrags) sowie Notizen und Bemerkungen. Der Mieter heisst danach «Anonymisierter Mieter»; die Beträge seiner Abrechnungen bleiben (Art. 6 Abs. 4 DSG). | geplant (#459) |

i18n: anonymiser le locataire / anonimizzare l’inquilino / anonymise the tenant.

## Nicht bestätigt

- **Stand des Issues:** #459 enthält heute Einträge vom 2026-10-22, die auf diese Runde antworten. Geprüft habe ich gegen den Stand bis 2026-10-19 und gegen #411 «Punkt 3».
- **Sicherungen des Betreibers:** Ob anonymisierte Daten in Datenbanksicherungen weiterleben und ob die Datenschutzerklärung das sagen müsste, habe ich nicht geprüft. In `README.md` und `messages/de.json` steht nichts zu Sicherungen.
- **Steuerrechtliche Aufbewahrung** für private Vermieter (Nachsteuer, kantonale Fristen): nicht geprüft. Die Frist stützt sich nur auf Art. 127, 130 und 958f OR. Art. 958f gilt nur für Buchführungspflichtige nach Art. 957 OR; viele private Vermieter sind das nicht. Für sie trägt Art. 127 OR die Frist.
- **Weitere Kopien des Namens** (Mail-Ausgang, Protokoll des Servers, Rechnungsbelege mit Mieternamen): nur das Schema und `recordAudit` angesehen, keine weiteren Dienste.

Geprüft: Art. 958f Abs. 1, 957, 127, 128, 130 Abs. 1 OR (SR 220, Stand 1.10.2026), Art. 6 Abs. 4 und 19 DSG (SR 235.1, Stand 7.7.2025) im Wortlaut von Fedlex; Nachrechnung beider Szenariodaten (01.01.2025 angeboten, 01.01.2030) mit zwei Randfällen; die Bestätigung entspricht wörtlich #411 «Punkt 3»; Szenario-Schritte gegen `tenant-detail.steps.ts`, Grundlage (`tenant-detail.feature:8-12`) ohne weitere Mietverträge von Lea Frei.
