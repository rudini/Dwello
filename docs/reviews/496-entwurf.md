# #496 Alle Daten exportieren: Entwurf für die Fachprüfung

Stand: 1. November 2026, vor der Fachprüfung (CLAUDE.md, Workflow 1). Noch keine Texte in `messages/*.json`, kein
Produktionscode. Szenarien (`@wip`): `tests/e2e/features/datenexport.feature` und in `tests/e2e/features/privacy.feature`
«Die Datenschutzerklärung nennt den Export aller Daten».

Entscheid des Product Owners (31.10.2026, im Issue): eine ZIP-Datei unter den Einstellungen mit JSON (vollständig, mit
Beziehungen) und einer CSV-Datei je Tabelle (UTF-8, `;`), den Belegen als Dateien und einer `README.txt`; kein Import;
das Protokoll gehört dazu, Gelöschtes nicht; der Export kommt ins Protokoll; Dateinamen in der Sprache der Oberfläche.

## 1. Ort und Texte unter den Einstellungen

Neuer Abschnitt auf `/config` (`src/routes/config/+page.svelte`), nach «Protokoll», eine Karte wie die übrigen
(`ConfigLinks`), aber mit einem Download statt eines Links: die Seite bleibt offen, daher kein Navigationsszenario.

| | de | fr | it | en |
|---|---|---|---|---|
| Titel des Abschnitts | Alle Daten exportieren | Exporter toutes les données | Esportare tutti i dati | Export all data |
| Aktion (Download) | Alle Daten exportieren | Exporter toutes les données | Esportare tutti i dati | Export all data |
| Hilfe an der Aktion (sichtbar, `aria-describedby`) | Eine ZIP-Datei mit allen Daten, die Sie in Dwello erfasst haben, mit Belegen, Dokumenten, Abrechnungen und dem Protokoll. Die Tabellen öffnen Sie mit Excel; die Datei «daten.json» kann ein anderes Programm einlesen. Was Sie gelöscht haben, ist nicht dabei. | Un fichier ZIP avec toutes les données que vous avez saisies dans Dwello, avec les pièces justificatives, les documents, les décomptes et le journal. Vous ouvrez les tableaux avec Excel ; le fichier «données.json» peut être lu par un autre programme. Ce que vous avez supprimé n’y figure pas. | Un file ZIP con tutti i dati che ha registrato in Dwello, con giustificativi, documenti, conteggi e il registro. Le tabelle si aprono con Excel; il file «dati.json» può essere letto da un altro programma. Ciò che ha eliminato non è incluso. | A ZIP file with all the data you have entered in Dwello, with supporting documents, documents, statements and the log. You open the tables with Excel; another program can read the file «data.json». What you have deleted is not included. |
| Eintrag im Protokoll | Alle Daten exportiert | Toutes les données exportées | Tutti i dati esportati | All data exported |

Der Name der Datendatei in der Hilfe folgt der Sprache (wie die Datei selbst).

Misslingt der Export (das Backend antwortet nicht): eine Seite ohne App wie `pdfRefusal`
(`src/lib/server/statement.ts`) mit «Der Export ist nicht gelungen. Versuchen Sie es in einigen Minuten erneut. Gelingt
er wieder nicht, wenden Sie sich an die Person, die Dwello betreut.» Kein Szenario: ein Fehler zwischen BFF und Backend
(«No scenario», `tests/e2e/CLAUDE.md`); ein Test der Route prüft es.

## 2. Inhalt der ZIP-Datei

Name der ZIP-Datei: `Dwello-<Daten>-<JJJJ-MM-TT>.zip` (Datum von heute, Schweizer Tag).

| | de | fr | it | en |
|---|---|---|---|---|
| ZIP | Dwello-Daten-2026-11-01.zip | Dwello-Données-2026-11-01.zip | Dwello-Dati-2026-11-01.zip | Dwello-Data-2026-11-01.zip |
| Anleitung | README.txt | README.txt | README.txt | README.txt |
| Datendatei | daten.json | données.json | dati.json | data.json |
| Ordner der Tabellen | tabellen/ | tableaux/ | tabelle/ | tables/ |
| Ordner der Belege | belege/ | pièces-justificatives/ | giustificativi/ | supporting-documents/ |
| Ordner der Dokumente zu Mietern | dokumente/ | documents/ | documenti/ | documents/ |
| Ordner der PDF der Abrechnungen | abrechnungen/ | décomptes/ | conteggi/ | statements/ |

Die Namen von Datendatei, Dokumenten und Abrechnungen folgen dem Export eines Mieters
(`backend/src/services/tenant-export.service.ts`). `README.txt` bleibt in allen Sprachen so (der Entscheid nennt den Namen;
so finden auch Programme und Helfer die Anleitung); ihr Inhalt ist in der Sprache der Oberfläche.

Dateien:
- Beleg: `belege/<Rechnungsdatum> <Rechnungssteller> <Dateiname beim Hochladen>`, z.B.
  `belege/2026-03-31 Hauswart Meier meier-q1.pdf`; gleiche Namen bekommen « (2)», « (3)» vor der Endung.
- Dokument zu einem Mieter (hochgeladen, Zahlungserinnerung, Mahnung, versendete Abrechnung):
  `dokumente/<Nachname> <Vorname>/<Datum> <Titel>.<Endung>`.
- PDF einer Abrechnung: `abrechnungen/<Abrechnungsnummer>.pdf`.
- Unerlaubte Zeichen in Namen (`\ / : * ? " < > |`) werden zu `_` wie beim Export eines Mieters.

### Tabellen (CSV) und ihre Spalten

UTF-8 mit BOM (sonst liest Excel in der Schweiz die Umlaute falsch), `;` als Trenner, Zeilenende CRLF, Werte mit `;`, `"`
oder Zeilenumbruch in `"…"`. Die erste Zeile nennt die Spalten in der Sprache der Oberfläche (unten Deutsch), mit den
Wörtern der Oberfläche. Beträge mit Punkt als Dezimalzeichen und ohne Tausendertrenner (`1234.50`), Datum `JJJJ-MM-TT`,
Ja/Nein als `ja`/`nein` (fr `oui`/`non`, it `sì`/`no`, en `yes`/`no`). Jede Zeile hat eine Spalte «ID» (UUID); Beziehungen
stehen als ID **und** als lesbarer Name daneben (z.B. «Gebäude-ID» und «Gebäude»), damit Excel ohne Nachschlagen lesbar
ist.

| Datei (de) | fr | it | en | Tabelle der Datenbank | Spalten (Entwurf, de) |
|---|---|---|---|---|---|
| gebäude.csv | immeubles.csv | immobili.csv | buildings.csv | buildings | ID, Name, Adresse, PLZ, Ort, Kanton, Land, Breitengrad, Längengrad, Gebäudetyp, Baujahr, Kein Tank, Erfasst am, Geändert am |
| wohnungen.csv | appartements.csv | appartamenti.csv | apartments.csv | apartments | ID, Gebäude-ID, Gebäude, Nummer, Stockwerk, Fläche (m²), Zimmer, Status, Erfasst am, Geändert am |
| mieter.csv | locataires.csv | inquilini.csv | tenants.csv | tenants | ID, Vorname, Nachname, E-Mail, Telefon, Sprache, Adresse, PLZ, Ort, Land, Zustellung, Anonymisiert am, Erfasst am, Geändert am |
| mietverträge.csv | contrats-de-bail.csv | contratti-di-locazione.csv | rental-contracts.csv | rental_contracts | ID, Wohnung-ID, Gebäude, Wohnung, Mieter-ID, Mieter, Mietbeginn, Vertragsende, Gekündigt, Kündigung erhalten am, Abgerechnet bis, Ausgezogen, Dokumente geprüft am, Nettomiete, Zusatzmiete, Akonto, Nebenkostenpauschale, Verwaltungspauschale vereinbart, Verwaltungspauschale (%), Referenzzinssatz/Index, Bemerkungen, Erfasst am, Geändert am |
| akonto.csv | acomptes.csv | acconti.csv | advance-payments.csv | contract_advance_payments | Mietvertrag-ID, Mieter, Wohnung, Gültig ab, Betrag |
| vereinbarte-nebenkosten.csv | charges-convenues.csv | spese-accessorie-pattuite.csv | agreed-costs.csv | contract_categories | Mietvertrag-ID, Mieter, Wohnung, Kategorie-ID, Kategorie, Vereinbart, Vereinbart ab |
| rechnungen.csv | factures.csv | fatture.csv | invoices.csv | invoices | ID, Gebäude-ID, Gebäude, Rechnungsnummer, Rechnungssteller, Adresse Rechnungssteller, Beschreibung, Kategorie-ID, Kategorie, Verteilschlüssel-ID, Verteilschlüssel, Betrag, Umlagefähig, Rechnungsdatum, Leistung von, Leistung bis, Fällig am, Bezahlt am, KI-Kategorie, KI-Sicherheit, Von Hand geändert, Grund der Änderung, Bemerkungen, Erfasst am, Geändert am |
| belege.csv | pièces-justificatives.csv | giustificativi.csv | supporting-documents.csv | invoice_documents | Rechnung-ID, Rechnungssteller, Dateiname, Datei im Export, Abgezogener Betrag, Nicht umlagefähige Positionen, Hochgeladen am |
| tankbestände.csv | stocks-de-combustible.csv | scorte-di-combustibile.csv | fuel-stocks.csv | fuel_stocks | ID, Gebäude-ID, Gebäude, Ablesedatum, Betrag, Kategorie-ID, Kategorie, Erfasst am |
| abrechnungen.csv | décomptes.csv | conteggi.csv | statements.csv | utility_statements | ID, Abrechnungsnummer, Mieter-ID, Mieter, Wohnung-ID, Wohnung, Mietvertrag-ID, Abrechnungsperiode von, bis, Abrechnungsdatum, Miettage, Mietbeginn, Mietende, Kosten total, Akontobeiträge, Verwaltungspauschale (%), Verwaltungspauschale, Heizprofil, Saldo, Status, Zahlungsfrist, Bezahlt am, Bezahlter Betrag, Erinnert am, Ersetzt Abrechnung, Übertrag aus Abrechnung, Übertrag erledigt am, QR-Referenz, PDF im Export, Bemerkungen, Erfasst am, Geändert am |
| abrechnungspositionen.csv | postes-des-décomptes.csv | voci-dei-conteggi.csv | statement-lines.csv | utility_statement_line_items | ID, Abrechnung-ID, Abrechnungsnummer, Beschreibung, Kategorie, Verteilschlüssel, Kosten des Gebäudes, Anteil Wohnung, Anteil (%), Anteil Mietdauer, Miettage, Abgerechnete Tage, Anteil Mieter |
| dokumente.csv | documents.csv | documenti.csv | documents.csv | documents | ID, Mieter-ID, Mieter, Abrechnung, Art, Mahnstufe, Titel, Datei im Export, Kanal, Status, Versendet am, Empfänger, Zahlungsfrist, Zustellfehler, Erfasst am |
| kategorien.csv | catégories.csv | categorie.csv | categories.csv | categories | ID, Name, Name de, Name fr, Name it, Name en, Umlagefähig, Heizkosten, Brennstoff, Art (Von Dwello/Eigene), Beschreibung, Reihenfolge |
| verteilschlüssel.csv | clés-de-répartition.csv | chiavi-di-riparto.csv | distribution-keys.csv | distribution_keys | ID, Name, Name de, Name fr, Name it, Name en, Art, Formel, Beschreibung |
| heizprofile.csv | profils-de-chauffage.csv | profili-di-riscaldamento.csv | heating-profiles.csv | heating_profiles | ID, Name, Name de/fr/it/en, Art, Januar … Dezember (%), Beschreibung, Quelle de/fr/it/en |
| protokoll.csv | journal.csv | registro.csv | log.csv | audit_log | ID, Datum und Uhrzeit, Eintrag (der Text wie auf der Seite «Protokoll», in der Sprache der Oberfläche), Art, Angaben (JSON) |
| einstellungen.csv | paramètres.csv | impostazioni.csv | settings.csv | configuration | Einstellung, Wert (Firmenname, Adresse, PLZ, Ort, Telefon, E-Mail, IBAN, Zahlungsfrist, Mahnfrist, Verwaltungspauschale, Standard-Verteilschlüssel und -Heizprofil) |

Bei einem anonymisierten Mieter enthalten Tabellen und Datendatei, was Dwello noch hat (ohne Name, Kontaktdaten,
Dokumente), wie die App ihn zeigt.

**Nicht im Export** (keine Daten des Liegenschaftsverwalters über Liegenschaften und Mieter, oder ein Geheimnis):
`access_keys` (Zugangsschlüssel für KI-Programme, nur Hash), `local_accounts` (Konto mit Passwort, Hash),
`ki_settings` (gewählte KI mit verschlüsseltem API-Schlüssel), `backup_codes` und `backup_runs` (Sicherung),
`statement_numbers` (Zähler der Abrechnungsnummern) und die Felder `invoice_documents.content`, `documents.content`,
`utility_statements.pdf_blob` (als Dateien im ZIP statt in den Tabellen). Rechnungs-JSON der Abrechnungspositionen
(`invoice_parts`, `invoices`) nur in der Datendatei.

### Datendatei (JSON)

Schlüssel englisch und stabil (wie beim Export eines Mieters), damit ein späterer Import sie lesen kann; Werte wie in der
Datenbank (Beträge als Zeichenkette `"450.00"`, Datum `JJJJ-MM-TT`, Zeitpunkte ISO 8601 mit Zeitzone).

```json
{
  "format": "dwello-export", "version": 1, "exportedAt": "2026-11-01T10:15:00+01:00", "language": "de",
  "settings": { "companyName": "…", "iban": "…", "paymentDeadlineDays": 30, "…": "…" },
  "categories": [ { "id": "…", "name": "…", "isAllowedUtilityCost": true, "…": "…" } ],
  "distributionKeys": [ … ], "heatingProfiles": [ … ],
  "tenants": [ { "id": "…", "firstName": "…", "lastName": "…", "documents": [ { "title": "…", "fileName": "…", "file": "dokumente/…", "…": "…" } ] } ],
  "buildings": [ {
    "id": "…", "name": "Seeblick", "…": "…",
    "apartments": [ { "id": "…", "number": "1.01", "contracts": [ { "id": "…", "tenantId": "…", "advancePayments": [ … ], "agreedCategories": [ { "categoryId": "…", "agreed": true, "agreedFrom": null } ] } ] } ],
    "invoices": [ { "id": "…", "billingEntityName": "Hauswart Meier", "categoryId": "…", "distributionKeyId": "…", "documents": [ { "fileName": "meier-q1.pdf", "file": "belege/2026-03-31 Hauswart Meier meier-q1.pdf", "deductedAmount": null, "nonAllocableItems": false } ] } ],
    "fuelStocks": [ … ]
  } ],
  "statements": [ { "id": "…", "number": "NK-…", "tenantId": "…", "apartmentId": "…", "contractId": "…", "file": "abrechnungen/NK-….pdf", "lineItems": [ … ], "…": "…" } ],
  "auditLog": [ { "id": "…", "occurredAt": "…", "action": "category_allowance", "text": "Kategorie «…»: …", "details": { … } } ]
}
```

Beziehungen: was einem Datensatz gehört, steht in ihm (Gebäude → Wohnungen → Mietverträge → Akonto und vereinbarte
Nebenkosten; Gebäude → Rechnungen → Belege, Tankbestände; Mieter → Dokumente; Abrechnung → Positionen); was mehrere teilen
(Mieter, Kategorien, Verteilschlüssel, Heizprofile, ersetzte Abrechnung, Übertrag), steht mit seiner ID.

### README.txt (de; fr/it/en übersetzt)

```
Dwello – Export aller Daten
Erstellt am 01.11.2026 um 10:15 Uhr

Diese ZIP-Datei enthält alle Daten, die Sie in Dwello erfasst haben, so wie sie zu diesem Zeitpunkt gespeichert waren.
Was Sie vorher gelöscht haben, ist nicht dabei.

Inhalt
- tabellen/: eine Tabelle je Art von Daten (Gebäude, Wohnungen, Mieter, Mietverträge, Rechnungen, Abrechnungen,
  Kategorien, Verteilschlüssel, Heizprofile, Protokoll und weitere). Öffnen Sie sie mit Excel oder einem anderen
  Tabellenprogramm. Die Spalten sind durch Strichpunkte getrennt; Beträge in Franken mit Punkt (1234.50), Datum als
  Jahr-Monat-Tag (2026-03-31).
- daten.json: dieselben Daten mit allen Beziehungen, für ein anderes Programm. Jeder Datensatz hat eine ID; eine
  Tabelle nennt einen anderen Datensatz mit dessen ID und Namen.
- belege/: die Belege Ihrer Rechnungen, wie Sie sie hochgeladen haben.
- dokumente/: die Dokumente zu Ihren Mietern, auch versendete Zahlungserinnerungen und Mahnungen.
- abrechnungen/: die PDF Ihrer Nebenkostenabrechnungen.

Die Datei enthält Personendaten Ihrer Mieter und Rechnungssteller. Bewahren Sie sie wie Ihre Mietverträge auf und
löschen Sie sie, wenn Sie sie nicht mehr brauchen.

Dwello kann diese Datei heute nicht wieder einlesen. Eine Sicherung zum Wiederherstellen legt Dwello jeden Tag selbst an
(«Sicherung» unter den Einstellungen).
```

## 3. Was als gelöscht gilt

Dwello löscht Datensätze endgültig (keine Spalte «gelöscht»): was der Liegenschaftsverwalter gelöscht hat (Gebäude,
Wohnung, Mieter, Mietvertrag, Rechnung, Beleg, ersetzter Beleg, Dokument, Abrechnung im Entwurf, eigene Kategorie,
Verteilschlüssel, Heizprofil, Protokolleintrag), gibt es nicht mehr und ist daher nicht im Export. Beim anonymisierten
Mieter fehlen die entfernten Angaben. Offen (Frage F-3): Einträge im Protokoll, die eine gelöschte Rechnung nennen
(«Die Einträge bleiben, auch wenn Sie die Rechnung löschen»), bleiben als Teil des Protokolls im Export.

## 4. Datenschutzerklärung und andere Texte

Datenschutzerklärung (`src/routes/privacy/+page.svelte`, `messages/*.json`), Abschnitt «Welche Daten Dwello speichert»,
ein neuer Absatz `privacy_stored_export` nach `privacy_stored_2`:

> Unter «Einstellungen» › «Alle Daten exportieren» laden Sie alle Daten, die Dwello speichert, als ZIP-Datei auf Ihren
> Computer herunter, mit Belegen, Dokumenten, Abrechnungen und dem Protokoll. Jeder Export kommt mit Datum ins
> Protokoll. Die Datei enthält auch die Daten Ihrer Mieter und Rechnungssteller. Dwello gibt sie niemandem weiter; wem
> Sie die Datei geben und wie lange Sie sie aufbewahren, entscheiden Sie. Bewahren Sie sie wie Ihre Mietverträge auf und
> löschen Sie sie, wenn Sie sie nicht mehr brauchen.

Weitere Stellen, die sich ändern würden (nicht in den `@wip`-Szenarien, weil bestehende Szenarien ohne `@wip` sie
festhalten oder weil sie erst nach der Fachprüfung feststehen):
- `audit_privacy` (Datenschutzerklärung, Protokoll unter den Einstellungen): «…, ausserdem jeden Export aller Daten …»
  ergänzen.
- `audit_purpose`, `audit_link`, `audit_empty_text` (Seite «Protokoll» und Karte unter den Einstellungen): «und jeder
  Export aller Daten» ergänzen. `settings.feature` «Das Protokoll nennt die Zugangsschlüssel und die Abrufe von
  KI-Programmen» hält die heutigen Texte fest: eine Änderung braucht `Spec change approved: #496`, wenn der Product Owner
  sie im Issue entscheidet.
- `privacy_controller_4` (Art. 28 DSG): unverändert; der Export eines Mieters bleibt der Weg für dessen Herausgabe.
- Stand der Datenschutzerklärung (`privacy.feature` «Stand der Datenschutzerklärung», heute «29. Oktober 2026»): neues
  Datum nötig; der Entscheid in #496 nennt keinen Rechtstext, also braucht es dafür einen Entscheid im Issue.
- `settings_purpose` (Kopf der Einstellungen): «… und die Stammdaten.» → «…, die Stammdaten und der Export aller Daten.»
- Hilfe (`src/routes/help`): ein Satz in «Einstellungen» oder ein eigener Punkt «Daten mitnehmen» (falls es einen
  Abschnitt zu den Einstellungen gibt).
- `marketing/index.html`: Badge «Geplant» bei «Alle Daten exportieren» entfernen.
- Demo: der Export lädt die erfundenen Daten und das Protokoll der Demo (Anmeldungen anderer Besucher ohne Namen und
  E-Mail-Adresse, wie die Seite «Protokoll» sie zeigt).

## 5. Fragen an den fach-reviewer

- F-1: Umfang: gehören die PDF der Abrechnungen und die Dokumente zu Mietern als Dateien dazu (Entwurf: ja), oder nur
  die Belege, wie der Entscheid wörtlich sagt?
- F-2: Gehören die Einstellungen (Firmenadresse, IBAN, Fristen) dazu, und bleiben Zugangsschlüssel, Konto, gewählte KI
  und Sicherung zu Recht draussen?
- F-3: Protokolleinträge, die gelöschte Datensätze nennen: im Export (Entwurf) oder herausfiltern? Der Entscheid sagt
  «das Protokoll gehört dazu; Gelöschtes nicht».
- F-4: Der eigene Eintrag «Alle Daten exportiert»: kommt er nach dem Export ins Protokoll (Entwurf, also nicht in der
  Datei selbst), und mit welchen Angaben (nur Datum und Uhrzeit)?
- F-5: Spaltennamen der Tabellen in der Sprache der Oberfläche (Entwurf)? Beträge mit Punkt und ohne Tausendertrenner
  (`1234.50`, Excel in de-CH, fr-CH und it-CH rechnet damit; nicht `1'234.50`, das Excel als Text liest)? Ja/Nein als
  Wort? Das Datum als `JJJJ-MM-TT` statt `31.03.2026`?
- F-6: Ordnernamen fr «pièces-justificatives», en «supporting-documents»: lang, aber die Begriffe aus
  `docs/design/i18n-begriffe.md`; kürzer erlaubt?
- F-7: Wortlaut von Hilfe, README.txt und Absatz der Datenschutzerklärung; braucht die Datenschutzerklärung den Hinweis
  auf die Verantwortung für die Datei (Art. 8 DSG, Datensicherheit) so, und ändert sich damit ihr Stand?
- F-8: Der Export ist nicht verschlüsselt (anders als die Sicherung): genügt der Hinweis zur Aufbewahrung?
