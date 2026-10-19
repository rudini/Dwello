# Fachreview #435 «Daten eines Mieters exportieren», Runde 1

Gegenstand: Commit 80b68d52, Worktree `fach-435` (nur gelesen). Geprüft: `@wip`-Szenario `tests/e2e/features/tenants.feature:59-69`, Vorschlag `implementation_plan.md:132-143`, dazu `backend/src/db/schema.ts`, `backend/src/services/statement-pdf.service.ts`, `statement.service.ts`, `statement-send.service.ts`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md` und `messages/*.json`. Rechtsquellen: DSG (SR 235.1, Stand 7.7.2025) und DSV (SR 235.11, Stand 1.12.2025), beide aus dem Fedlex-Filestore (de/fr/it).

Bindend und nicht in Frage gestellt: Der Produktentscheid vom 2026-10-19 (Knopf «Daten exportieren» auf der Mieterseite; eine ZIP-Datei mit Stammdaten, Mietverträgen, Abrechnungen und Mahnungen als JSON und mit den hochgeladenen Dokumenten und den Abrechnungs-PDFs dieses Mieters).

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Verwalter | Major | Das Szenario prüft keine Mahnung, obwohl der Entscheid Mahnungen im Export verlangt. |
| F-2 | Rechtstexte (DSG) | Major | Das Szenario prüft nicht, dass Daten anderer Mieter fehlen. Das ist das Hauptrisiko des Exports. |
| F-3 | Rechtstexte (DSG) | Major | Am Knopf fehlt ein Hinweis: Dritte prüfen (Dokumente, Notizen), Datei nur dem Mieter selbst geben, Frist 30 Tage. Wortlaut siehe unten. |
| F-4 | Verwalter | Major | «Das PDF, wie der Mieter es erhielt» stimmt mit dem Code nicht sicher: Die gespeicherte PDF kann später neu erzeugt worden sein. Die genaue E-Mail-Kopie liegt in `documents` (`type = 'statement'`) und fehlt in der Liste des Plans. Ein Erzeugen beim Export hätte Nebenwirkungen. |
| F-5 | Verwalter | Minor | Der Plan nennt «earlier addresses». Dwello speichert keine früheren Adressen (`schema.ts:89-103`, nur die aktuelle Korrespondenzadresse). Streichen; frühere Adressen stehen nur in den gespeicherten PDFs. |
| F-6 | Rechtstexte (DSG) | Minor | «values as stored» ist zu weit: Interne Kennungen weglassen (`id`, `tenantId`, `categoryId`, `invoices[].id` der Positionen, `heatingProfileId`). Bezüge mit fachlichen Werten ausdrücken: `replacesId` durch die Abrechnungsnummer, `agreedCategoryIds` durch Kategorienamen. Base64-Inhalte (`pdfBlob`, `content`) gehören nicht ins JSON, sie liegen als Dateien bei. |
| F-7 | Verwalter | Minor | Im JSON zum Mietvertrag fehlen Zusatzmiete, Referenzindex, «Auszug bestätigt» und der Eingang der Kündigung (`notice_received_on`). Zur Wohnung fehlen Wohnungsnummer, Stockwerk, Fläche und Zimmeranzahl. «Akonto or Pauschale» ist falsch: Ein Mietvertrag kann beides haben (Glossar «Monatlich total»). Richtig ist «Akonto und Nebenkostenpauschale». |
| F-8 | Verwalter | Minor | «Überfällig» wird berechnet, nicht gespeichert (`schema.ts`, Kommentar zu `status`). Mit «values as stored» stünde eine überfällige Abrechnung als `sent` im Export. Den angezeigten Status exportieren (`overdue`). |
| F-9 | Verwalter | Minor | «Stammdaten» ist im Glossar kein Begriff für den Mieter (nur «Stammdaten» unter Einstellungen). Im Szenario stattdessen «Name und Kontaktdaten» schreiben, wie die Glossarzeile «Mieter». |
| F-10 | Rechtstexte (DSG) | Minor | Die Hilfe darf nicht sagen, der Export allein erfülle eine Auskunft (Art. 25 Abs. 2 Bst. c–g DSG verlangen Zweck, Aufbewahrung, Herkunft, Empfänger). Art. 28 DSG ist zugleich enger als der Export (Art. 20 Abs. 2 DSV). Die Hilfe nennt Art. 28 und verweist für die Auskunft auf die Datenschutzerklärung. |
| F-11 | Verwalter | Minor | Dateinamen im ZIP: Zwei Uploads mit gleichem Namen überschreiben sich. Namen von Nutzern können `/`, `..` oder `\` enthalten. Vorschlag: `dokumente/<JJJJ-MM-TT> <Titel>.<ext>`, bereinigt, bei Doppelungen mit Zähler. ZIP-Name mit Umlaut («Müller»): `Content-Disposition` mit `filename*` (UTF-8) und ASCII-Ersatz. |
| F-12 | Verwalter | Minor | Die Mahnungsbriefe als Dateien und die E-Mail-Kopien der Abrechnungen gehen über die Liste im Entscheid hinaus («uploaded documents and statement PDFs»). Sie passen aber zu «Done means» («all data Dwello holds»). Empfehlung: beilegen. Der Product Owner bestätigt das (siehe Offene Punkte). |
| F-13 | Verwalter | Nit | Den Knopf als Nebenaktion gestalten (Design-Regel: eine Hauptaktion pro Bildschirm). |
| F-14 | Verwalter | Nit | Eine Mahnung mit dem Status «Zu versenden» kommt mit diesem Status ins JSON, damit sie nicht als zugestellt gilt. |

### F-1 (Major): Mahnung fehlt im Szenario
- Beleg: Das Szenario (`tenants.feature:61-69`) prüft «die Stammdaten, den Mietvertrag und die Abrechnung», das «Dokument» und «das PDF der Abrechnung». Eine Mahnung kommt nicht vor. Der Entscheid in #435 verlangt «master data, contracts, statements and reminders».
- Warum falsch: Das Szenario muss das entschiedene Ergebnis nachweisen. Ohne Mahnung könnte eine Umsetzung ohne Mahnungen grün werden.
- Korrektur: Die Abrechnung überfällig machen und den vorhandenen Schritt nutzen (`documents.feature:18`, «"Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten»). Dann: «Und enthält der Export die Zahlungserinnerung an "Hans Müller"». Die Abrechnung mit «Zahlungsfrist in 30 Tagen» passt dafür nicht.

### F-2 (Major): Kein Nachweis, dass fremde Daten fehlen
- Beleg: Art. 26 Abs. 1 Bst. b DSG: «Der Verantwortliche kann die Auskunft verweigern, einschränken oder aufschieben, wenn: … b. dies aufgrund überwiegender Interessen Dritter erforderlich ist». Für die Herausgabe gilt das nach Art. 29 Abs. 1 DSG: «Der Verantwortliche kann die Herausgabe oder Übertragung der Personendaten aus den in Artikel 26 Absätze 1 und 2 aufgeführten Gründen verweigern, einschränken oder aufschieben.» Das Szenario hat nur einen Mieter im Gebäude.
- Warum falsch: Abrechnungen, Positionen und Dokumente hängen über Gebäude und Wohnung zusammen. Ein Fehler beim Filtern (z.B. alle Abrechnungen des Gebäudes oder der Wohnung, auch die eines Vormieters) gibt einem Mieter Namen und Beträge anderer. Das ist eine Verletzung der Datensicherheit (Art. 5 Bst. h DSG: «… Unbefugten offengelegt …»). Ein solcher Fehler ist schwerer als ein fehlendes Feld.
- Korrektur: Ein zweiter Mieter in derselben Wohnung (Vormieter) oder im selben Gebäude, mit eigener Abrechnung und eigenem Dokument. Dann: «Und enthält der Export keine Daten von "Anna Keller"». Dazu ein `*.pg.test.ts`, das den Inhalt des ZIP ohne fremde Abrechnungsnummern, Namen und Dateien nachweist.

### F-3 (Major): Hinweis am Knopf fehlt
- Beleg: Art. 26 Abs. 1 Bst. b und Art. 29 DSG (oben). Art. 22 DSV: «Die Artikel 16 Absätze 1 und 5 sowie 17–19 gelten sinngemäss für das Recht auf Datenherausgabe oder -übertragung.» Art. 16 Abs. 5 DSV: «Der Verantwortliche muss angemessene Massnahmen treffen, um die betroffene Person zu identifizieren.» Art. 18 Abs. 1 DSV: «Die Auskunft muss innerhalb von 30 Tagen seit dem Eingang des Begehrens erteilt werden.»
- Warum falsch: Der Export legt alle hochgeladenen Dokumente und Notizen bei. In der Praxis liegen in der Mieterakte oft Beschwerden von Nachbarn, Übergabeprotokolle mit Namen des Nachmieters oder Korrespondenz mit Dritten. Ein Vermieter mit wenig Erfahrung gibt die Datei sonst ungeprüft weiter. Die Pflicht, die Person zu identifizieren, und die Frist kennt er meist nicht.
- Korrektur: Hilfetext am Knopf, siehe «UI-Texte».

### F-4 (Major): Welches Abrechnungs-PDF in den Export kommt
- Beleg:
  - `statement.service.ts:612`: Beim Versenden wird `pdfBlob` geleert.
  - `statement-pdf.service.ts:327-332`: Fehlt die PDF, wird sie bei der ersten Anfrage neu erzeugt, mit der Adresse und den Einstellungen von dann.
  - `statement-pdf.service.ts:280-301`: Für einen Entwurf schreibt `generateStatementPdf` Abrechnungsdatum und Zahlungsfrist von heute in die Datenbank.
  - `statement-send.service.ts:51-61`: Die per E-Mail versandte PDF liegt unverändert als `documents.type = 'statement'`.
  - Der Plan nennt unter `dokumente/` nur Uploads, die PDF des Mietvertrags und Mahnungen.
- Warum falsch: Der Plan verspricht «the PDF as the tenant received it». Für den E-Mail-Versand ist nur die Kopie in `documents` sicher genau das. Wurde beim Versenden keine PDF erzeugt (z.B. ohne IBAN), entstünde sie erst beim Export, mit heutiger Adresse. Ruft der Export `getStatementPdf` auf, ändert er unter Umständen Daten. Ein Export darf nichts ändern.
- Korrektur: Pro Abrechnung, die kein Entwurf ist:
  1. die E-Mail-Kopie aus `documents`, falls vorhanden;
  2. sonst die gespeicherte `pdfBlob`;
  3. sonst keine Datei und im JSON `pdf: null`.

  Kein Erzeugen beim Export. Die E-Mail-Kopie nur einmal ablegen (unter `abrechnungen/`), nicht zusätzlich unter `dokumente/`. Test: Der Export lässt `utility_statements` unverändert.

## Offene Punkte: Empfehlungen

1. **Entwürfe im Export:** Ja, nur in `daten.json`, mit `status: "draft"`, ohne PDF.
   - Begründung: Art. 25 Abs. 2 Bst. b DSG nennt «die bearbeiteten Personendaten als solche». Ein Entwurf ist eine solche Bearbeitung, und «Done means» verlangt «all data Dwello holds about them».
   - Ohne PDF, weil die PDF eines Entwurfs einen Zahlteil trägt und «als ob heute versendet» datiert ist. Der Mieter könnte sie bezahlen. Erzeugen hätte ausserdem die Nebenwirkung aus F-4.
   - Der Plan schlägt das schon vor. Bestätigt.
2. **Mahnungsbriefe als Dateien:** Ja, unter `dokumente/`, mit Mahnstufe und Datum im Namen.
   - Begründung: Sie sind Dokumente des Mieters (Glossar «Dokument»: «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF»), und #459 behandelt die Mahnungs-PDFs als Personendaten, die beim Anonymisieren gehen.
   - Der Entscheid nennt sie bei den Dateien nicht ausdrücklich (F-12). **Product Owner bestätigt.** Ich entscheide das nicht selbst. Dasselbe gilt für die E-Mail-Kopien der Abrechnungen aus F-4.
3. **Eintrag im Protokoll (#357):** Nein, nicht in diesem Issue.
   - Begründung: Das Glossar definiert das Protokoll als Liste von «Anmeldungen und Änderungen, die Abrechnungen beeinflussen». Ein Export ändert nichts.
   - Eine Pflicht zur Protokollierung besteht nicht. Art. 4 Abs. 1 DSV verlangt sie nur, wenn «besonders schützenswerte Personendaten in grossem Umfang automatisiert bearbeitet» werden «oder … ein Profiling mit hohem Risiko durchgeführt» wird. Das trifft auf einen privaten Vermieter mit unter 50 Wohnungen nicht zu.
   - Den Nachweis, dass er fristgerecht geantwortet hat, führt der Vermieter mit seiner Antwort an den Mieter.
   - Will der Product Owner den Eintrag trotzdem, braucht es eine Änderung der Glossarzeile «Protokoll» (Labels `fachlich`, `entscheiden`).
   - Personenbezogene Einträge des Protokolls (`payment_reset`, `statement_corrected`) stehen schon in den Abrechnungsdaten (`paymentResets`, Status «Ersetzt»). Das Protokoll muss deshalb nicht in den Export.
4. **Sprache von Dateinamen und JSON:**
   - JSON-Schlüssel und Codes (`status: "sent"`, `channel: "letter"`) neutral auf Englisch, wie vorgeschlagen. Art. 21 Abs. 1 DSV verlangt nur ein Format, das «mit verhältnismässigem Aufwand übertragen und … weiterverwendet» werden kann. Stabile Schlüssel dienen dem.
   - Ordner- und Dateinamen sowie Kategorienamen in der **Sprache des Mieters** (`tenants.language`): Er ist der Empfänger, und seine Abrechnungen und Mahnungen sind schon in dieser Sprache. Also `Daten-…`/`Données-…`/`Dati-…`/`Data-…`, `dokumente/`/`documents/`/`documenti/`/`documents/`, `abrechnungen/`/`decomptes/`/`conteggi/`/`statements/`.
   - Nicht die Sprache der Oberfläche des Vermieters: Sie sagt nichts über den Empfänger.
   - Die Abrechnungsnummer als Dateiname bleibt sprachneutral.

Weitere Hinweise zum Inhalt von `daten.json`:
- Aufnehmen: Notizen am Mietvertrag und an der Abrechnung. Sie sind Personendaten des Mieters (Art. 5 Bst. a DSG) und keine Bearbeitung «zum ausschliesslich persönlichen Gebrauch». Deshalb nennt die Hilfe die Notizen (F-3).
- Aufnehmen: `qrBillReference`, `paymentResets` (Datum, zurückgesetzte Zahlung), Mietstage und abgerechnete Zeit.
- Positionen so, wie die PDF sie zeigt: Kategorie, Kosten des Gebäudes, Verteilschlüssel, Wohnungsanteil, Zeitanteil, Mieteranteil, Beschreibungen der Rechnungen.
- Nicht aufnehmen: Rechnungen und Belege des Gebäudes, andere Wohnungen, Einstellungen (IBAN), Kategorien- und Verteilschlüssel-Stammdaten. Das sind Geschäftsdaten des Vermieters. Der Mieter sieht die Belege über die Belegeinsicht (Art. 257b Abs. 2 OR), nicht über diesen Export.
- Optional (Nit): Firmenname und Firmenadresse als `controller`, weil Art. 25 Abs. 2 Bst. a DSG «die Identität und die Kontaktdaten des Verantwortlichen» nennt. Sie stehen ohnehin auf jeder PDF.
- Formeln: Der Vorschlag rechnet nichts neu, er exportiert gespeicherte Beträge. Deshalb gibt es keine Nachrechnung. Einzige Abweichung vom gespeicherten Wert: der berechnete Status «Überfällig» (F-8).

## UI-Texte (Vorschlag, de)

- Knopf: **«Daten exportieren»** (entschieden).
- Hilfetext sichtbar unter dem Knopf:
  > Lädt alles, was Dwello über diesen Mieter speichert, als ZIP-Datei herunter: Kontaktdaten, Mietverträge, Abrechnungen, Mahnungen und Dokumente. Verlangt ein Mieter seine Daten (Art. 28 DSG), geben Sie ihm diese Datei innert 30 Tagen. Prüfen Sie vorher, ob Dokumente oder Notizen Daten anderer Personen enthalten. Geben Sie die Datei nur dem Mieter selbst.
- Optionaler Satz (F-10), wenn der Platz reicht: «Verlangt er Auskunft (Art. 25 DSG), geben Sie ihm auch die Datenschutzerklärung.» Erst sinnvoll, wenn #458 die Datenschutzerklärung für Mieter verständlich macht.

fr/it/en (Begriffe nach `i18n-begriffe.md`: locataire/inquilino/tenant, contrat de bail/contratto di locazione/rental contract, décompte/conteggio/statement, rappel/sollecito/reminder; Abkürzung wie in `privacy_controller_3`: LPD/LPD/FADP):
- fr: «Exporter les données». « Télécharge sous forme de fichier ZIP tout ce que Dwello enregistre sur ce locataire : coordonnées, contrats de bail, décomptes, rappels et documents. Si un locataire demande ses données (art. 28 LPD), remettez-lui ce fichier dans les 30 jours. Vérifiez d’abord si des documents ou des notes contiennent des données d’autres personnes. Ne remettez le fichier qu’au locataire lui-même. »
- it: «Esportare i dati». «Scarica come file ZIP tutto ciò che Dwello registra su questo inquilino: dati di contatto, contratti di locazione, conteggi, solleciti e documenti. Se un inquilino chiede i suoi dati (art. 28 LPD), gli consegni questo file entro 30 giorni. Verifichi prima se documenti o note contengono dati di altre persone. Consegni il file solo all’inquilino stesso.»
- en: «Export data». «Downloads everything Dwello stores about this tenant as a ZIP file: contact details, rental contracts, statements, reminders and documents. If a tenant asks for their data (Art. 28 FADP), give them this file within 30 days. First check whether documents or notes contain other people's data. Give the file only to the tenant in person.»
- Vorsicht bei den Übersetzungen:
  - Der Titel von Art. 28 lautet amtlich fr «Droit à la remise ou à la transmission des données personnelles» und it «Diritto di farsi consegnare dati o di esigerne la trasmissione a terzi».
  - Deshalb «remettre»/«consegnare», nicht «portabilité»/«portabilità» (Begriff der DSGVO).
  - Englisch ist keine Amtssprache. «data portability» vermeiden, «give them this file» genügt.
  - «Kontaktdaten» heisst fr «coordonnées», nicht «données de contact».

Fehlender Begriff (Vorschlag für ein Issue, Labels `fachlich`, `entscheiden`): Glossarzeile **«Daten exportieren (Mieter)»**: «Lädt alle Daten, die Dwello über einen Mieter speichert, als ZIP-Datei herunter: Name, Kontaktdaten und Korrespondenzadresse, Mietverträge, Abrechnungen und Mahnungen als JSON, dazu seine Dokumente und die PDFs der versendeten Abrechnungen. Dient der Herausgabe nach Art. 28 DSG; Entwürfe ohne PDF.» fr «exporter les données», it «esportare i dati», en «export data».

Szenario mit den Korrekturen aus F-1, F-2 und F-9 (Vorschlag):
```
Szenario: Daten eines Mieters exportieren
  Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
  Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
  Und "Hans Müller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken
  Und "Hans Müller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
  Und "Hans Müller" hat das hochgeladene Dokument "Übergabeprotokoll"
  Und "Anna Keller" hat eine Abrechnung für eine andere Wohnung im Gebäude "Seeblick"
  Wenn der Liegenschaftsverwalter die Daten von "Hans Müller" exportiert
  Dann enthält der Export Name und Kontaktdaten, den Mietvertrag, die Abrechnung und die Zahlungserinnerung von "Hans Müller"
  Und enthält der Export das Dokument "Übergabeprotokoll" und das PDF der Abrechnung
  Und enthält der Export keine Daten von "Anna Keller"
```
(Die Schritte für die Zahlungserinnerung und den zweiten Mieter an die vorhandenen Schritte anpassen.)

## Bestätigt

- Rechtsgrundlage und Format: Art. 28 Abs. 1 DSG: «… die Herausgabe ihrer Personendaten, die sie ihm bekanntgegeben hat, in einem gängigen elektronischen Format verlangen, wenn: a. der Verantwortliche die Daten automatisiert bearbeitet; und b. die Daten … in unmittelbarem Zusammenhang mit dem Abschluss oder der Abwicklung eines Vertrags … bearbeitet werden.» Beim Mietvertrag in Dwello trifft beides zu. JSON und PDF erfüllen Art. 21 Abs. 1 DSV.
- Kostenlos: Art. 28 Abs. 3 DSG («muss die Personendaten kostenlos herausgeben»). Der Export braucht keine Gebühr.
- Der Export geht über Art. 28 hinaus: Art. 20 Abs. 2 DSV: «Personendaten, die vom Verantwortlichen durch eigene Auswertung … erzeugt werden, gelten nicht als Personendaten, die die betroffene Person … bekannt gegeben hat.» Abrechnungen sind solche Auswertungen. Mehr herauszugeben ist zulässig und deckt zugleich Art. 25 Abs. 2 Bst. b DSG. Das widerspricht dem Entscheid nicht.
- Ersetzte Abrechnungen mit PDF beilegen: Glossar «Berichtigte Abrechnung» («Die alte bleibt unverändert erhalten»). Bestätigt.
- Mitmieter: Ein Mietvertrag hat genau einen Mieter (`rental_contracts.tenant_id`). Es gibt keine Mitmieter-Daten, die getrennt werden müssten. Erfasst der Vermieter ein Paar als einen Mieter, gehören beide zum Vertrag. Die Hilfe aus F-3 deckt Dritte in Dokumenten und Notizen ab.
- Begriffe des Szenarios: «Liegenschaftsverwalter», «Mieter», «Abrechnung», «hochgeladenes Dokument», «Übergabeprotokoll» (Glossar «Protokoll»: «… Übergabeprotokoll») und «Mietvertrag» entsprechen dem Glossar. «Und enthält …» folgt dem Stil der vorhandenen Features. Schweizer «ss» ist eingehalten.

## Nicht bestätigt

- Ob `category.service.ts:213` und `invoice.service.ts:357` im Protokoll Mieterdaten festhalten: nur die Aufrufe von `recordAudit` gesehen, die Details nicht gelesen. Nach den Aktionsnamen betreffen sie Kategorien und Rechnungen, keine Mieter.
- Ob die PDF für jede Position die Rechnungsbeschreibungen zeigt: gesehen nur `statement-pdf.service.ts:95` (Teile über verschiedene Tage). Für die Empfehlung «Positionen wie auf der PDF» muss die Umsetzung das prüfen.
- Ob ein Betreibungsauszug als besonders schützenswerte Personendaten gilt (Art. 5 Bst. c Ziff. 5 DSG nennt «verwaltungs- und strafrechtliche Verfolgungen»; die Betreibung ist zivilrechtliche Vollstreckung). Für diesen Export ändert es nichts, weil er die Daten nur der betroffenen Person selbst gibt. **unsicher**, nicht weiter verfolgt.
- `mmx search` lieferte zu Art. 28 DSG nur Treffer zur DSGVO. Die Zitate stammen deshalb direkt aus dem Fedlex-Filestore (SPARQL-Abfrage `eli/cc/2022/491` und `2022/568`, Fassungen 20250707 und 20251201). Die Absatznummern stehen dort in `<sup>` und sind aus der Reihenfolge erschlossen.
