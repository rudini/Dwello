# Fachreview 1: Szenarien «Dokumente eines Mieters hochladen» (#174)

Geprüft: Commit `55bfcbf` (Worktree `review-scenarios-fach`), `tests/e2e/features/tenant-documents.feature` (neu), die zwei neuen Szenarien am Ende von `tests/e2e/features/documents.feature` sowie die darin festgelegten UI-Texte. Grundlage: Issue #174 (Entscheide des Product Owners vom 14.10.2026), `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md`, `messages/de.json` (Stand des Commits), DSG (SR 235.1) und OR (SR 220) von Fedlex.

Rollen: Verwalter (V), Mietrecht (M), Rechtstexte (R; hier nur Datenschutzerklärung, weil die Änderung beeinflusst, was Dwello speichert).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Verwalter | Major | «hochgeladene Dokumente» und Dokument als hochgeladene Datei stehen in UI-Text und Schritten, das Glossar kennt sie noch nicht; die Annahme im Plan («kein neuer Begriff sichtbar») stimmt nicht |
| F-2 | Rechtstexte | Major | Datenschutzerklärung «Welche Daten Dwello speichert» nennt hochgeladene Dateien nicht; kein Plan-Punkt dafür |
| F-3 | Verwalter | Minor | Szenario «löscht ein hochgeladenes Dokument» prüft die Bestätigung mit ihrer Folge nicht |
| F-4 | Verwalter | Minor | Fehlermeldung beim gestörten Hochladen schickt zur Internetverbindung, obwohl das Szenario eine Serverantwort mit Fehler simuliert |
| F-5 | Verwalter | Minor | Kein Szenario (und kein Plan-Test) für JPG/PNG; Link «PDF herunterladen» wäre für ein Bild falsch |
| F-6 | Verwalter | Minor | Erlaubte Dateitypen und 10 MB stehen nur in den Fehlermeldungen, nicht als Hilfetext am Feld |
| F-7 | Mietrecht/Datenschutz | Minor | Kein Hinweis für den Vermieter, Ausweiskopie und Betreibungsauszug nur so lange wie nötig aufzubewahren (Art. 6 Abs. 4 DSG); Mieter mit Mietvertrag lassen sich nie löschen |
| F-8 | Rechtstexte | Minor | Öffentliche Demo: Upload echter Ausweiskopien für alle Besucher sichtbar; Demo-Hinweis fehlt am Upload |
| F-9 | Verwalter | Minor | 10 MB nicht definiert (MB oder MiB) und Base64-Aufschlag: Fehlermeldung kann Windows-Anzeige widersprechen oder gar nicht erscheinen |
| F-10 | Verwalter | Minor | Texte auf `/documents` («Mahnungen, die Sie … senden, erscheinen hier», «An {name}, erstellt am …») passen nicht zu hochgeladenen Dokumenten; nur `documents_purpose` ist im Issue genannt |
| F-11 | Verwalter | Nit | «Hochgeladen am <Datum>» muss in Schweizer Zeit (Europe/Zurich) formatiert werden |
| F-12 | Verwalter | Nit | Erzählung der Funktionalität nennt «den unterschriebenen Mietvertrag»; Upload am Mietvertrag ist laut Issue ausser Umfang |

## Befunde

### F-1 (Verwalter, Major): Begriff «hochgeladenes Dokument» noch nicht im Glossar

Belege:
- `UBIQUITOUS_LANGUAGE.md:159`: «**Dokument** | Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF.» Eine hochgeladene Datei ist kein Brief und keine E-Mail an den Mieter.
- `tests/e2e/steps/tenant-documents.steps.ts` (Schritt «sagt die Bestätigung …»): erwarteter UI-Text «<Name> wird endgültig gelöscht, zusammen mit den **hochgeladenen Dokumenten**. …».
- Schritte `"{string}" hat das hochgeladene Dokument {string}`, Szenariotitel «Hochgeladenes Dokument ist nie zu versenden» (`documents.feature`), «Mieter mit hochgeladenen Dokumenten löschen».
- `implementation_plan.md` (Session 35, Annahmen): «the UI texts say «Dokument» and «Hochgeladen am …», so no term outside the glossary is shown until the product owner extends **Dokument**». Das trifft für die Löschbestätigung nicht zu, und schon «Dokument» für eine Datei widerspricht der heutigen Definition.

Warum falsch: CLAUDE.md, Design-Regeln: «Domain terms only from `UBIQUITOUS_LANGUAGE.md` (never edit it); missing terms get `TODO(fachlich prüfen, #<issue>)` and an issue». Der Begriff ist im Issue #174 entschieden («New term for the kind: **Hochgeladenes Dokument** (`type = upload`)»), steht aber nicht im Glossar. Ein Marker `TODO(fachlich prüfen, #174)` geht nicht, weil CI keinen PR zulässt, der ein Issue schliesst, das ein Marker noch nennt.

Korrektur: Vor dem Merge muss der Product Owner das Glossar ergänzen (gehört unter «Blocked on me»), oder es braucht ein eigenes Issue (Labels `fachlich`, `entscheiden`) für den Glossareintrag, auf das die Marker zeigen. Vorgeschlagene Einträge (vom Product Owner zu übernehmen, nicht von uns):
- **Dokument**: «Brief oder E-Mail an einen Mieter (z.B. Mahnung) oder vom Liegenschaftsverwalter hochgeladene Datei zu einem Mieter.» (wie im Issue)
- **Hochgeladenes Dokument**: «Datei (PDF, JPG oder PNG), die der Liegenschaftsverwalter zu einem Mieter ablegt, z.B. Übergabeprotokoll oder Betreibungsauszug. Hat keinen Korrespondenzkanal und keinen Versandstatus; lässt sich löschen.» | `documents.type = 'upload'`
- Die Plan-Annahme berichtigen.

### F-2 (Rechtstexte, Major): Datenschutzerklärung nennt hochgeladene Dateien nicht

Beleg: `messages/de.json:133` `privacy_stored_1`: «Dwello speichert die Daten, die für die Verwaltung der Liegenschaften und die Nebenkostenabrechnung nötig sind: Gebäude und Wohnungen, Mieter mit Kontaktdaten und Korrespondenzadresse, Mietverträge, Rechnungen sowie die erstellten Abrechnungen, Zahlungen und Mahnungen.» Weder Issue #174 («Done means», «Where») noch der Plan nennen die Datenschutzerklärung.

Warum falsch: Nach der Änderung speichert Dwello beliebige Dateien zu Mietern, typischerweise Ausweiskopien und Betreibungsauszüge (die Szenarien verwenden genau diese Beispiele). Die Aufzählung wirkt abschliessend und stimmt dann nicht mehr mit dem überein, was die App tut. Der Vermieter stützt seine Information der Mieter darauf (`terms_responsibility_2`: «Die Verwaltung ist dafür verantwortlich, die Mieter über die Bearbeitung ihrer Daten zu informieren.»). Art. 19 Abs. 1 DSG (Fedlex, SR 235.1): «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten; diese Informationspflicht gilt auch, wenn die Daten nicht bei der betroffenen Person beschafft werden.» Art. 19 Abs. 3 DSG: «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr zudem die Kategorien der bearbeiteten Personendaten mit.» Das DSG gilt für den Vermieter: Art. 2 Abs. 2 lit. a nimmt nur «Personendaten, die von einer natürlichen Person ausschliesslich zum persönlichen Gebrauch bearbeitet werden» aus, Vermieten ist kein persönlicher Gebrauch.

Korrektur: `privacy_stored_1` in allen vier Sprachen ergänzen, z.B. «… sowie die erstellten Abrechnungen, Zahlungen und Mahnungen und die Dateien, die Sie zu einem Mieter hochladen (z.B. Übergabeprotokolle oder Betreibungsauszüge).» Dazu ein Plan-Punkt und ein Fachreview der Datenschutzerklärung im Feature-Review (Workflow Schritt 5, «legal texts changed»). Da es ein Rechtstext ist, vorher Szenario oder Test für den geänderten Text (CLAUDE.md Workflow 1).

### F-3 (Verwalter, Minor): Bestätigung beim Löschen eines Dokuments wird nicht geprüft

Beleg: `tenant-documents.feature`, Szenario «Liegenschaftsverwalter löscht ein hochgeladenes Dokument»: nur «Wenn … das Dokument "Ausweiskopie" löscht / Dann liegen beim Mieter noch keine Dokumente». Issue #174: «„Löschen“ with a confirmation that names the consequence («Das Dokument wird endgültig gelöscht.»)». CLAUDE.md: «Irreversible actions confirm with their real consequence.»

Warum falsch: Das Szenario für den Mieter prüft den Bestätigungstext, das für das Dokument nicht. Ohne Prüfung kann die Folge fehlen oder falsch sein, und der Text ist der einzige Schutz vor einem versehentlichen Löschen.

Korrektur: Schritt ergänzen, z.B. «Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will / Dann sagt die Bestätigung, dass "Ausweiskopie" endgültig gelöscht wird / Wenn … löscht». Text im Stil der bestehenden Bestätigungen (`tenants_delete_text`): ««Ausweiskopie» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.»

### F-4 (Verwalter, Minor): Fehlermeldung beim gestörten Hochladen

Beleg: Szenario «Das Hochladen scheitert»: «Das Dokument wurde nicht gespeichert. Prüfen Sie die Internetverbindung und laden Sie die Datei erneut hoch.» Simuliert wird eine Fehlerantwort der Form-Action (`tasks/tenant-documents.ts`, `uploadsFail`: `FailRequests.to('/tenants/<id>', { '/upload': '' })`), also eine Antwort des Servers. Für eine fehlende Verbindung gibt es schon `backend_network_error` (`messages/de.json:1024`: «Keine Verbindung zum Server. Prüfen Sie Ihre Internetverbindung …»); andere Speicherfehler sagen «Versuchen Sie es erneut» (`invoices_save_failed`, `buildings_fuel_not_saved`).

Warum falsch: Hat der Server geantwortet, ist die Verbindung in Ordnung; der Rat schickt den Vermieter auf eine falsche Fährte. Die Regel «errors say what happened and what to do» verlangt einen Rat, der passt.

Korrektur: «Das Dokument wurde nicht gespeichert. Laden Sie die Datei erneut hoch.» (passt zu beiden Ursachen), oder zwei Meldungen: Netzwerkfehler mit Internetverbindung, Serverfehler ohne.

### F-5 (Verwalter, Minor): JPG und PNG ohne Szenario, Linktext «PDF herunterladen»

Beleg: Issue #174: «File types: PDF, JPG and PNG; checked by content (magic bytes)». Alle Upload-Szenarien verwenden PDF; abgelehnt wird nur Word. `messages/de.json:796–797`: «PDF herunterladen», «PDF herunterladen: {title}» für den Link in den Dokumentzeilen.

Warum falsch: Eine Ausweiskopie ist in der Praxis meist ein Handyfoto (JPG). Nichts zeigt, dass ein Bild angenommen wird und sich öffnet; ein Bild hinter «PDF herunterladen» ist irreführend.

Korrektur: Ein Szenario (oder Szenariogrundriss) «Liegenschaftsverwalter lädt ein Foto zu einem Mieter hoch» mit JPG und PNG, das auch das Öffnen prüft; Linktext unabhängig vom Typ, z.B. «Öffnen» / «Öffnen: {title}». Mindestens Unit-Tests für die Magic Bytes von JPG (`FF D8 FF`) und PNG (`89 50 4E 47 0D 0A 1A 0A`).

### F-6 (Verwalter, Minor): Hilfetext am Feld fehlt

Beleg: Die Szenarien prüfen Typ und Grösse nur über Fehlermeldungen. CLAUDE.md, Design-Regeln: Zielgruppe «little experience … Prefer guidance … over speed»; «Explain terms with visible help text at the field».

Warum falsch: Der Vermieter erfährt die Grenzen erst nach dem Fehler. Bei grossen Scans (häufig) muss er dann die Datei erneut wählen.

Korrektur: Sichtbarer Hilfetext unter dem Dateifeld, z.B. «PDF, JPG oder PNG, höchstens 10 MB.» Optional in einem Schritt des ersten Szenarios prüfen. Mit F-7 kombinierbar.

### F-7 (Mietrecht/Datenschutz, Minor): Aufbewahrung von Ausweiskopie und Betreibungsauszug

Belege:
- Art. 6 Abs. 2 DSG: «Die Bearbeitung muss nach Treu und Glauben erfolgen und verhältnismässig sein.» Art. 6 Abs. 3 DSG: «Personendaten dürfen nur zu einem bestimmten und für die betroffene Person erkennbaren Zweck beschafft werden; sie dürfen nur so bearbeitet werden, dass es mit diesem Zweck vereinbar ist.» Art. 6 Abs. 4 DSG: «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.»
- Art. 31 Abs. 2 lit. a DSG rechtfertigt die Bearbeitung «in unmittelbarem Zusammenhang mit dem Abschluss oder der Abwicklung eines Vertrags», lit. c die Prüfung der Kreditwürdigkeit unter anderem nur, wenn «Die Daten … nicht älter als zehn Jahre» sind (Ziff. 3).
- Betreibungsdaten sind keine besonders schützenswerten Personendaten nach Art. 5 lit. c DSG (die Liste nennt in Ziff. 5 nur «Daten über verwaltungs- und strafrechtliche Verfolgungen oder Sanktionen»; Betreibungen sind Zwangsvollstreckung, nicht Verwaltungs- oder Strafrecht). Eine ausdrückliche Einwilligung (Art. 6 Abs. 7 lit. a) ist darum nicht nötig. Bestätigt durch den Wortlaut; die Einordnung der Betreibung ist meine Auslegung (**unsicher**, keine Fedlex-Stelle dazu).
- Ein Mieter mit Mietvertrag lässt sich nicht löschen (`messages/de.json:532`: «Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen.»). Seine hochgeladenen Dokumente bleiben damit unbegrenzt, bis der Vermieter jedes einzeln löscht.
- Praxis (EDÖB, Merkblatt zu Anmeldeformularen für Mietwohnungen, 15.07.2025, nur über Suchtreffer gelesen, **unsicher**): «Eine Ausweiskopie (z. B. eine Kopie der Identitätskarte oder der Aufenthaltsbewilligung) darf erst verlangt werden, wenn die Bewerberin oder der Bewerber endgültig …» bestimmt ist.

Warum relevant: Dwello rechtswidrig macht das nicht; der Vermieter ist Verantwortlicher und kann einzeln löschen (Szenario vorhanden). Aber die Zielgruppe kennt Art. 6 Abs. 4 DSG kaum, und die Szenarien zeigen Ausweiskopie und Betreibungsauszug als typische Uploads. Ein Betreibungsauszug dient der Auswahl vor Vertragsabschluss; nach Abschluss braucht ihn der Vermieter meist nicht mehr.

Korrektur: Kurzer Hilfetext beim Upload oder im Hilfebereich, z.B. «Laden Sie nur Unterlagen hoch, die Sie für das Mietverhältnis brauchen. Löschen Sie Unterlagen wie Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.» Keine Änderung an den Szenarien nötig. Eine automatische Frist oder Löschung nach Mietende ist Produktentscheid: als offene Arbeit (Issue, Labels `fachlich`, `entscheiden`) erfassen, falls nicht in #174 umgesetzt.

### F-8 (Rechtstexte, Minor): Öffentliche Demo

Beleg: `messages/de.json:150` `demo_notice_text`: «Alle Besucher sehen und ändern dieselben Daten. … Geben Sie deshalb nur erfundene Daten ein …». Issue #174: Uploads sind in der Demo möglich, die Demo setzt nachts zurück.

Warum relevant: Ein Upload ist schneller mit einer echten Datei gemacht als ein Formular mit echten Daten. Eine echte Ausweiskopie wäre bis zum nächsten Zurücksetzen für alle Besucher sichtbar (Bekanntgeben nach Art. 5 lit. e DSG: «das Übermitteln oder Zugänglichmachen von Personendaten»). Der allgemeine Demo-Hinweis deckt das grundsätzlich ab, steht aber nicht beim Upload.

Korrektur: In der Demo-Installation beim Upload-Feld den Hinweis wiederholen, z.B. «Demo: Alle Besucher sehen diese Datei. Laden Sie nur erfundene Unterlagen hoch.» Alternativ als offene Arbeit festhalten.

### F-9 (Verwalter, Minor): Grenze «10 MB» nicht definiert

Beleg: Szenario «Eine zu grosse Datei wird abgelehnt» mit 11 × 1024 × 1024 Byte (`steps/tenant-documents.steps.ts`, `megabytes * 1024 * 1024`); Meldung «Die Datei ist grösser als 10 MB.»; Fixture `backend.ts` sendet die Datei als Base64 in JSON.

Nachrechnung:
1. 11 MiB + 9 Byte Kopf = 11'534'345 Byte: über 10'000'000 und über 10'485'760, abgelehnt in beiden Lesarten. Das Szenario ist eindeutig.
2. 10'200'000 Byte: Windows-Explorer zeigt rund «9,7 MB», macOS-Finder «10,2 MB». Bei einer Grenze von 10'000'000 Byte lehnt Dwello eine Datei ab, die unter Windows unter 10 MB liegt, und die Meldung «grösser als 10 MB» widerspricht der Anzeige. Bei 10'485'760 Byte (10 MiB) wird sie angenommen, es entsteht kein Widerspruch.
3. Grenzfall 10'485'760 Byte (genau 10 MiB): muss angenommen werden («höchstens 10 MB»). Als Base64 sind das 4 × ⌈10'485'760 / 3⌉ = 13'981'016 Zeichen. Ein Body-Limit von 10 MB zwischen BFF und Backend würde die Datei mit einer allgemeinen Fehlermeldung abweisen statt mit der geprüften. Auch der multipart-Body an die BFF ist um Formularfelder und Grenzen grösser als die Datei.

Korrektur: Grenze als 10 × 1024 × 1024 Byte festlegen und «grösser als» streng prüfen; Body-Limits mit Reserve (multipart ≥ 10 MiB + Overhead, Backend-JSON ≥ 14 MB). Unit-Tests für 10'485'760 (angenommen) und 10'485'761 (abgelehnt).

### F-10 (Verwalter, Minor): Texte auf `/documents`

Belege: `messages/de.json:792` `documents_empty_text`: «Mahnungen, die Sie bei einer Nebenkostenabrechnung senden, erscheinen hier.»; `:794` `documents_created_to`: «An {name}, erstellt am {date}, {channel}»; `:787` `documents_purpose` (im Issue genannt). Szenario «Hochgeladenes Dokument ist nie zu versenden» erwartet in der Zeile auf `/documents` nur «Hochgeladen am».

Warum falsch: Ein hochgeladenes Dokument geht nicht «an» den Mieter, und der Leertext der Liste nennt nur Mahnungen. Ein Vermieter, der ein Dokument hochgeladen hat, liest sonst Widersprüche.

Korrektur: Für Uploads eine eigene Zeile, z.B. «Zu {name}, hochgeladen am {date}» (Kleinschreibung nach Komma; auf der Mieterseite ohne Namen «Hochgeladen am {date}»); `documents_empty_text` ergänzen («Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.»). Im Szenario `zu "Anna Keller"` und «hochgeladen am» prüfen.

### F-11 (Verwalter, Nit): Datum in Schweizer Zeit

Beleg: Schritt «heute hochgeladen» vergleicht mit `inDays(0)`. Nachrechnung: Upload am 14.10.2026 um 00:30 Uhr MESZ = 13.10.2026 22:30 UTC. Wird der Zeitstempel in UTC formatiert, zeigt die Zeile «Hochgeladen am 13.10.2026». Um 12:00 MESZ (10:00 UTC) stimmen beide Lesarten.

Korrektur: Datum in `Europe/Zurich` formatieren (wie die übrigen Datumsangaben); ein Unit-Test mit einem Zeitstempel kurz nach Mitternacht.

### F-12 (Verwalter, Nit): Erzählung nennt den Mietvertrag

Beleg: `tenant-documents.feature:4–6`: «möchte ich Unterlagen eines Mieters, etwa den unterschriebenen Mietvertrag, in Dwello ablegen». Issue #174, «Out of scope»: «uploads on contracts and invoices (`contract_pdf`, `invoice_pdf`)».

Warum: Beim Mieter abgelegt ist der unterschriebene Vertrag nicht dem Mietvertrag zugeordnet; kommt später der Upload am Mietvertrag, gibt es zwei Orte. Das ist zulässig, aber ein Beispiel aus dem Kern des Features ist klarer.

Korrektur: Beispiel ändern, z.B. «etwa das Übergabeprotokoll oder einen Betreibungsauszug».

## Bestätigt

- **Mahnung nicht löschbar** (`documents.feature`, «Eine Mahnung lässt sich nicht löschen»): richtig. Die Mahnung belegt den Verzug, Art. 102 Abs. 1 OR (Fedlex, SR 220): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Die Zahlungserinnerung ist laut Glossar Mahnstufe 1 einer Mahnung (`UBIQUITOUS_LANGUAGE.md:157`), Titel und Schritt passen zusammen.
- **Kein Versandstatus, nicht unter «Zu versenden»**: entspricht Issue #174 und dem Glossar (`Versandstatus`: «Zu versenden … oder Versendet», nur für Briefe/E-Mails an Mieter).
- **Titel ohne Eingabe = Dateiname ohne Endung** («Uebergabeprotokoll.pdf» → «Uebergabeprotokoll»): wie entschieden.
- **Titel bleibt nach Fehler stehen** (drei Szenarien): wie «Done means».
- **Meldung zu grosser Datei** und **Meldung falscher Typ**: sagen, was passiert ist und was zu tun ist; Wortlaut der Grössenmeldung wie im Issue; Schweizer «ss» («grösser»), «Sie»-Form. Grenze siehe F-9.
- **Mieter ohne Mietvertrag mit Uploads löschen**, Text «<Name> wird endgültig gelöscht, zusammen mit den hochgeladenen Dokumenten. Das lässt sich nicht rückgängig machen.»: Folge vollständig genannt (Mahnungen kann ein Mieter ohne Mietvertrag nicht haben, weil sie eine Abrechnung und damit einen Mietvertrag voraussetzen), Stil wie `tenants_delete_text`. Begriff siehe F-1.
- **«Noch keine Dokumente.»**: bestehender Text (`messages/de.json:543` `tenants_no_documents`).
- **«Hochgeladen am <Datum>»**: Format TT.MM.JJJJ wie im Issue («Hochgeladen am 14.10.2026»); Zeitzone siehe F-11.
- **Mietrechtliche Regeln (OR 253 ff., VMWG)**: die Szenarien berühren weder Nebenkosten, Mietzins noch Vertragsende; `docs/nebenkostenabrechnung-anforderungen.md` und `docs/anforderungen-vertragsende.md` enthalten keine Anforderung zu hochgeladenen Unterlagen. Kein Widerspruch gefunden.

## Nicht bestätigt

- **EDÖB-Merkblatt zu Anmeldeformularen für Mietwohnungen (15.07.2025)**: `www.edoeb.admin.ch` war weder per curl (Proxy 403) noch per WebFetch (DNS) erreichbar; das Zitat in F-7 stammt aus dem Snippet von `mmx search` und ist **unsicher**. Ebenfalls nicht geprüft: ob das Merkblatt eine Frist für das Vernichten von Bewerbungsunterlagen nennt.
- **Betreibungsdaten keine besonders schützenswerten Personendaten**: Wortlaut von Art. 5 lit. c DSG geprüft, die Einordnung ist Auslegung (**unsicher**).
- **Absatznummern DSG**: Text aus der Fedlex-Fassung vom 01.09.2023 (Filestore-HTML `eli/cc/2022/491/20230901`). Die Absatznummern zeigt das HTML nicht als Text, sie sind aus der Reihenfolge der Absätze abgeleitet.
- **Aufbewahrungspflicht für private Vermieter** (z.B. Art. 958f OR) wurde nicht geprüft: Sie würde das Löschen eines Uploads nicht verbieten, weil Dwello keine Buchhaltung führt.
- **Französisch, Italienisch, Englisch**: Die Szenarien legen nur Deutsch fest; die Übersetzungen gibt es noch nicht und wurden nicht geprüft.
