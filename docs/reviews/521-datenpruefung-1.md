# Datenprüfung 521-1: Brief «Zustimmung zu einer neuen Abrechnungsperiode»

Stand: Worktree `/tmp/scratchpad/review-521-daten-pruefer` (efb682e), Persona-Stack (Datenbank `dwello_persona`, Backend :3301, Frontend :3300), heute 2026-11-01. Konfiguration in der Datenbank: `accounting_period=july-june`, `accounting_period_changed=2026-11-01:calendar`, Firma «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich». Ich habe nur gelesen (SELECT, GET), nichts gespeichert, nichts gestartet.

## Ergebnis

Keine Befunde (kein Blocker, kein Major, kein Minor). Alle 11 Mietverträge stimmen mit meiner unabhängigen Rechnung überein, die 9 Briefe zum Tag genau, in Deutsch, Französisch und Italienisch. Englisch und der Fall «Vertragsende in der kurzen Periode» konnte ich mit diesen Daten nicht prüfen (siehe «Nicht bestätigt»).

| ID | Schwere | Datensatz | erwartet | tatsächlich |
|---|---|---|---|---|
| (keine) | | | | |

## Wie ich gerechnet habe

Skript: `/tmp/scratchpad/w521/recompute.py` (Python, liest die Datenbank mit `psql`, liest die PDFs mit `pdftotext`, importiert keinen Dwello-Code). Ausgabe: `/tmp/scratchpad/w521/run1.txt` (83 Prüfungen OK, `FAILS 0`). Aufruf: `python3 -I /tmp/scratchpad/w521/recompute.py /tmp/scratchpad/w521/pdf-api2`. Die PDFs holte ich mit einem selbst gebauten JWT (Persona-Secret) von `GET :3301/api/v1/contracts/<id>/consent-letter` (Kopfzeilen in `pdf-api2/<id>.hdr`) und von der BFF-Route `GET :3300/contracts/<id>/consent-letter` (`pdf-bff/`).

Regeln, die ich aus den Dokumenten abgeleitet habe (`docs/api-specification.md:104`, `UBIQUITOUS_LANGUAGE.md` «Hinweis auf fehlende Abrechnungen» und «Kurze Abrechnungsperiode», `docs/reviews/521-fachreview-1.md` Abschnitte 1, 2 und 4, `docs/reviews/512-fachreview-1.md`):

- Bisheriger Typ: `calendar`. Neuer Typ: `july-june`. Wechseltag gespeichert: 2026-11-01.
- Vor dem Wechsel gilt der frühere Typ, geschnitten bis zum Ende seiner letzten Periode, die vor 2026-11-01 endete: Kalenderjahr 2025, also 31.12.2025. Danach gilt die Einstellung. Die Periode Juli–Juni, die den 01.01.2026 enthält, ist 01.07.2025–30.06.2026. Davon fehlt 01.01.2026–30.06.2026: kurze Abrechnungsperiode, beendet vor heute.
- Erste neue Periode: die Einstellung ab dem Tag nach der kurzen Periode: 01.07.2026–30.06.2027.
- Brief nur, wenn der Mietvertrag Mietstage in der kurzen Periode hat (Vertragsbeginn, Vertragsende, «Abgerechnet bis») und keine nicht ersetzte Abrechnung diese Tage deckt; sonst 409 `CONSENT_LETTER_NONE`.
- Antwortfrist: Briefdatum 01.11.2026 plus 30 Tage = 01.12.2026.
- Wortlaut: je Sprache wortgleich mit der Tabelle in 521-fachreview-1 Abschnitt 2 (Anrede und Schluss: «Guten Tag/Freundliche Grüsse», «Bonjour/Meilleures salutations», «Gentile/Cordiali saluti», wie in `reminder-letter.ts:47-117`).

## Je Mietvertrag

| Mietvertrag (Wohnung, Mieter) | Sprache | Mietstage in 01.01.–30.06.2026 | Brief erwartet / geliefert | Dateiname (UTF-8-Name) |
|---|---|---|---|---|
| b…0003-…0001 EG Laura Keller | de | 181 | ja / ja | `Zustimmung zu einer neuen Abrechnungsperiode EG Keller.pdf` |
| b…0003-…0002 OG1 Kevin Fischer | de | 181 | ja / ja | `… OG1 Fischer.pdf` |
| b…0001-…0099 1.01 Kevin Fischer (Ende 28.02.2021) | de | 0 | nein / 409 | – |
| b…0001-…0001 1.01 Hans Müller | de | 181 | ja / ja | `… 1.01 Müller.pdf` |
| b…0001-…0002 1.02 Anna Schmidt | de | 181 | ja / ja | `… 1.02 Schmidt.pdf` |
| b…0001-…0003 2.01 Pierre Dubois | fr | 181 | ja / ja | `Accord sur une nouvelle période de décompte 2.01 Dubois.pdf` |
| b…0001-…0005 3.01 Maria Rossi | it | 181 | ja / ja | `Consenso a un nuovo periodo di conteggio 3.01 Rossi.pdf` |
| b…0002-…0001 A1 Thomas Weber | de | 181 | ja / ja | `… A1 Weber.pdf` |
| b…0002-…0002 A2 Sarah Meier (Ende 30.06.2025) | de | 0 | nein / 409 | – |
| b…0002-…0003 A2 Nina Brunner | de | 181 | ja / ja | `… A2 Brunner.pdf` |
| b…0002-…0004 B2 Marco Bernasconi | it | 181 | ja / ja | `Consenso a un nuovo periodo di conteggio B2 Bernasconi.pdf` |

Für alle 9 Briefe gilt, und mein Skript hat es je Brief bestätigt:

- Absender-Block: die Firmenkonfiguration (Name, Adresse, PLZ, Ort).
- Empfänger: Vor- und Nachname des Mieters mit Adresse, PLZ und Ort. Bei allen 9 Mietverträgen ist die Mieteradresse gleich der Adresse des Gebäudes der Wohnung (Hinweis unten).
- Kopf «Zürich, 01.11.2026» (Ort der Firma, heutiger Tag).
- Bisher «1. Januar bis 31. Dezember» (fr «1er janvier au 31 décembre», it «1° gennaio al 31 dicembre»), neu «1. Juli bis 30. Juni» (fr «1er juillet au 30 juin», it «1° luglio al 30 giugno»).
- Kurze Abrechnungsperiode `01.01.2026 – 30.06.2026`, erste neue Periode `01.07.2026 – 30.06.2027`, Antwortfrist `01.12.2026`. Die Menge aller Daten im Brief ist genau {01.01.2026, 30.06.2026, 01.07.2026, 30.06.2027, 01.11.2026, 01.12.2026}.
- Kein Mietvertrag endet in der kurzen Periode, deshalb steht bei allen 9 der Satz «erstmals … / erste neue Abrechnungsperiode» (nicht der Satz `clauseEnding`).
- Alle Textblöcke (Titel, Mietvertrag-Zeile, Anrede, Änderung, kurze Periode, erste Periode, Freiwilligkeit, Antwortfrist, Gruss, Firmenname, Überschrift, Klausel, «Ort, Datum», «Unterschrift {Mieter}», «Unterschrift weiterer Mieter») stehen in dieser Reihenfolge, mit den richtigen Werten (Wohnung, Adresse «Strasse, PLZ Ort» des Gebäudes, Mietername).
- Sprache des Briefs = Sprache des Mieters (Dubois fr, Rossi und Bernasconi it, alle anderen de).
- Dateiname = Titel in der Sprache des Mieters + Wohnung + Nachname, `.pdf`; der ASCII-Name ersetzt Umlaute und Akzente durch `_` (`M_ller`, `p_riode de d_compte`), der UTF-8-Name ist richtig.
- Zustimmungsblock: Die Überschrift, die Klausel und alle drei Unterschriftslinien mit ihren Beschriftungen stehen zusammen auf Seite 2 (`pdftotext`: Linien je Seite `[0, 3]`, Überschrift nur auf Seite 2). Seite 1 endet mit dem Firmennamen unter dem Gruss, mit Platz für die Unterschrift des Vermieters. Ich habe Seiten 1 und 2 von Dubois als PNG angesehen (`/tmp/scratchpad/w521/png/`).
- BFF-Text und API-Text sind je Brief gleich (`pdftotext`-Vergleich, 9 von 9). Die Webseite jedes Mietvertrags zeigt den Link `contract-missing-statement-consent-letter` (Text «Brief zur Zustimmung herunterladen», Ziel `/contracts/<id>/consent-letter`) genau bei den 9 Mietverträgen mit Brief und bei keinem der 2 ohne; die Hilfe `contract-missing-statement-short-help` steht in denselben 9. `GET /api/v1/contracts/<id>/missing-statements`: `consent: true` nur in der Zeile `short` 2026-01-01 bis 2026-06-30 dieser 9, sonst überall `false`.
- Die beiden 409 (`…0099`, `…0002` Seepark): Das Backend antwortet `CONSENT_LETTER_NONE`; die BFF-Route zeigt eine Seite mit `pdf-refusal-message` («Für diesen Mietvertrag gibt es keinen Brief zur Zustimmung mehr: …», wortgleich mit `backend_consent_letter_none` in 521-fachreview-2), keine Datei.

QR-Rechnung: Der Brief hat keinen Einzahlungsteil. Alle geprüften PDFs haben 0 Bilder (`pdfimages -list`) und keinen Text «IBAN», «QR» oder «CH44…». Es gibt also keinen QR-Code zu dekodieren (kein QR-Decoder installiert). Die IBAN der Konfiguration (`CH4431999123000889012`) steht nirgends im Brief, was richtig ist.

## Nicht bestätigt

- **Englischer Brief:** Kein Mieter eines Mietvertrags hat die Sprache `en` (nur de, fr, it). Der englische Wortlaut ist nur in der Tabelle von 521-fachreview-1 gegengelesen, nicht im PDF. Ich darf die Daten nicht ändern. Gesucht in `tenants.language` aller 11 Mietverträge.
- **Vertragsende in der kurzen Periode (`clauseEnding`, ohne erste neue Periode):** Kein Mietvertrag endet zwischen 01.01. und 30.06.2026 (Meier endete 30.06.2025, Fischer 1.01 am 28.02.2021, beide ohne Brief). Der Fall «Brief ohne erste neue Periode» ist an diesen Daten nicht prüfbar. Das Skript enthält den deutschen Satz, es gab aber keinen Datensatz dafür.
- **Vertragsbeginn oder «Abgerechnet bis» in der kurzen Periode:** Kein Mietvertrag beginnt zwischen 01.01. und 30.06.2026, und keiner hat «Abgerechnet bis». Ob dort die kurze Periode des Gebäudes (nicht gekürzt) im Brief steht, wie 521-fachreview-1 «Randfall Vertragsbeginn» sagt, ist hier nicht prüfbar (Brunner beginnt am 01.07.2025, also davor).
- **Empfängeradresse ≠ Adresse der Wohnung:** Bei allen 9 Mietverträgen mit Brief ist die Adresse des Mieters gleich der des Gebäudes. Ob der Brief die Mieteradresse (Korrespondenzadresse) oder die Wohnungsadresse im Fenster druckt, lässt sich hier nicht unterscheiden. Abweichende Adressen haben nur die beiden Mietverträge ohne Brief (Fischer 1.01 in Interlaken, Meier an der Hirschmattstrasse 21).
- **Umbruch, wenn der Zustimmungsblock noch auf Seite 1 passt:** In allen 9 Briefen ist Seite 1 zu voll (Block braucht rund 295 pt, es bleiben rund 160 pt), der Block steht deshalb immer auf Seite 2. Der Zweig «passt auf Seite 1» (`reminder-pdf.ts`, `else doc.moveDown(2)`) ist nicht mit Daten belegt. Ich habe die Höhenrechnung nur im Code gelesen (sie zählt Leerzeilen, Überschrift und Absätze wie die Ausgabe), nicht mit einem PDF geprüft.
- **Abrechnungsassistent (`OverlapWays`):** Die Links im Assistenten habe ich nicht geprüft (nur die Seite des Mietvertrags, wie vom Auftrag verlangt).
- **Andere UI-Sprachen der Webseite:** Die Seite und die Ablehnungsseite habe ich nur in Deutsch (Standard der Persona-Sitzung) gelesen; fr/it/en der Oberfläche sind nicht geprüft.
- **QR-Code:** nicht anwendbar, siehe oben.

Geprüft: alle 11 Mietverträge der Datenbank `dwello_persona`; Briefe (API und BFF) für EG Keller, OG1 Fischer, 1.01 Müller, 1.02 Schmidt, 2.01 Dubois, 3.01 Rossi, A1 Weber, A2 Brunner und B2 Bernasconi bestanden in allen Punkten (Brief angeboten, alte und neue Abrechnungsperiode, kurze Periode, erste neue Periode, Antwortfrist, Absender, Empfänger, Sprache, Dateiname, Wortlaut, Zustimmungsblock auf einer Seite mit allen Unterschriftslinien); die Ablehnung für 1.01 Fischer (Ende 2021) und A2 Meier (Ende 30.06.2025) bestand (409, Ablehnungsseite).
