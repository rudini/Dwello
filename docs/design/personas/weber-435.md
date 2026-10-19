# Dr. Weber, Review #435: «Daten exportieren» (Art. 28 DSG)

Persona: Dr. Weber, 52, vorsichtig in rechtlichen Fragen, liest alles und rechnet nach. Desktop 1440 × 900, Maus, Zoom 100 %.
App: http://localhost:3300 (Persona-Stack, Demo-Daten). Gespeichert habe ich nichts. Die Sprache habe ich für etwa 10 Sekunden auf Französisch gestellt und danach sofort wieder auf Deutsch zurückgestellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-435/` (Skripte in `scripts/`, ZIPs in `download*/`, entpackt in `unz*/`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | ZIP `daten.json` | Der Entwurf NK-22222222-2025-0001 ist im Export enthalten. Er hat ein Abrechnungsdatum (= Exportdatum 2026-10-19), eine Zahlungsfrist 2026-11-18 und einen Saldo von -34.60. Erkennbar ist er nur am englischen `"status": "draft"`. Der Hilfetext warnt nicht davor. Damit bekäme der Mieter einen Betrag mit Frist, den ich nie erhoben habe. |
| P-2 | Minor | Panel «Daten des Mieters» | «Lädt alles, was Dwello über diesen Mieter speichert» stimmt nicht ganz. Es fehlen das Versanddatum der Abrechnung (in der App «Versendet 14.04.2025»), der Verteilschlüssel je Position (in App und PDF «Pro Fläche 68.00 / 320.00 m²»), die Rundung, das Heizprofil und der Verlauf. |
| P-3 | Minor | Panel «Daten des Mieters» | Der Text nennt nur Art. 28 DSG. Verlangt ein Mieter «Auskunft» (Art. 25 DSG), reicht die Datei nicht: Dann sind auch Zweck, Aufbewahrungsdauer, Empfänger und Herkunft der Daten mitzuteilen. Der Text sagt nicht, dass man das ergänzen muss. Dass die Herausgabe in der Regel kostenlos ist, steht auch nicht da. |
| P-4 | Minor | ZIP `daten.json` | Der Mieter kann die Datei kaum lesen: Die Schlüssel sind englisch (`tenantShare`, `priorPayments`). Auch die Kategorien sind englisch («Caretaker», «Cold Water»), während das PDF «Hauswart» und «Kaltwasser» zeigt. Das gilt auch beim italienischsprachigen Mieter. Weitere Werte sind englisch (`paid`, `email`). Das Vorzeichen des Saldos (-70.25 = Rückerstattung) wird nirgends erklärt. Rechnungsbeträge sind Zahlen (`912`, `240.5`), alle anderen Beträge Text (`"912.00"`). |
| P-5 | Nit | ZIP | Im ZIP liegt keine Erklärung der Felder (z. B. ein kurzes «liesmich» in der Sprache des Mieters). |
| P-6 | Nit | ZIP-Dateiname | `Daten-Weber-Thomas.zip` hat kein Datum. Bei einer zweiten Anfrage weiss ich nicht mehr, welchen Stand ich herausgegeben habe (`exportedOn` steht nur im JSON). |

## Beobachtungen

- Das Panel «Daten des Mieters» steht links unter «Aktuelle Miete». Darin stehen der Hilfetext und ein Knopf «Daten exportieren» mit Download-Symbol, nicht als Primäraktion. Es ist gut auffindbar und klar vom roten «Löschen» getrennt.
- Der Download kommt sofort (rund 0,3 s), die Seite bleibt stehen. Name: `Daten-Weber-Thomas.zip`, 5,7 KB, mit `daten.json` und `abrechnungen/NK-22222222-2024-0001.pdf`.
- Datei- und Ordnernamen richten sich nach der Sprache des Mieters, nicht nach meiner Oberfläche. Beim italienischsprachigen Marco Bernasconi heisst es `Dati-Bernasconi-Marco.zip` mit `dati.json`, `conteggi/` und `documenti/2023-06-30 Übergabeprotokoll Wohnung B2.pdf`. Das ist sinnvoll: Der Mieter versteht die Namen. Der Dokumentname mit Datum vorne ist gut.
- Vollständig sind:
  - Name, E-Mail, Telefon, Adresse, Land, Sprache und Korrespondenzkanal;
  - der Mietvertrag mit Wohnung (Fläche, Zimmer, Geschoss), Gebäude, Beginn, Nettomiete 1200.00, Akonto 200.00, vereinbarten Kategorien und Verwaltungspauschale;
  - beide Abrechnungen mit Positionen (Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Anteil), den zugrunde liegenden Rechnungen, Zwischensummen, Akonto, Saldo, Bezahlt-Datum und QR-Referenz;
  - das PDF der bezahlten Abrechnung.
- Nachgerechnet für 2024: 228.00 + 637.50 + 862.75 + 428.19 + 105.46 = 2'261.90, plus 3 % Pauschale 67.86 = 2'329.76, minus Akonto 2'400.00 = -70.24, gerundet -70.25. Das stimmt mit PDF und App überein.
- Was nicht hineingehört, fehlt: Es gibt keine Namen oder Beträge anderer Mieter (gesucht nach Meier, Brunner, Bernasconi, Müller), keine UUIDs und keine Lieferanten oder Belegdateien. Nur die Abrechnungsnummer enthält «22222222» (Teil der Gebäudekennung), die steht aber auch auf dem PDF. Von meinen Rechnungen erscheinen nur Bezeichnung, Betrag und Zeitraum je Position («Kabelanschluss 2024 (4 Wohnungen)»). Das darf der Mieter über die Belegeinsicht (Art. 257b Abs. 2 OR) ohnehin sehen. Ich halte das für vertretbar.
- Bei den Rechnungen heissen die Felder `start`/`end` ohne Erklärung. «Hauswartung Q1 2024» hat dort 2024-01-01 bis 2024-12-31, «Fernwärme Q4 2024» dagegen 2024-10-01 bis 2024-12-31. Für einen Mieter ist das verwirrend (wohl Demo-Daten).
- Der Entwurf hat kein PDF (`"file": null`). Das ist konsequent.
- `reminders` und `documents` sind bei Thomas Weber leer. Das stimmt mit der Mieterseite überein («Noch keine Dokumente.»).
- Französisch: Titel «Données du locataire», Knopf «Exporter les données», Text «Télécharge sous forme de fichier ZIP tout ce que Dwello enregistre sur ce locataire : coordonnées, contrats de bail, décomptes, rappels et documents. Si un locataire demande ses données (art. 28 LPD), remettez-lui ce fichier dans les 30 jours. …». Die Übersetzung ist sauber und inhaltsgleich, «LPD» ist die richtige Abkürzung, kein Deutsch auf der Seite. Der ZIP-Name blieb `Daten-Weber-Thomas.zip`, weil sich der Name nach der Sprache des Mieters (Deutsch) richtet. Der Inhalt war byte-gleich mit dem deutschen Export.
- Netzwerk: Beim Export und beim Sprachwechsel sah ich nur Aufrufe an localhost:3300.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 10 Schritte (Mieterliste, Mieterseite, Hilfetext lesen, Export, Entpacken, JSON und PDF prüfen, Abgleich mit Abrechnungsseite und Entwurf, Gegenprobe beim Mieter mit Dokument, Französisch, zurück auf Deutsch).

## Ablauf

1. **Mieter öffnen.** Erwartet: Thomas Weber unter «Mieter». Gesehen: Er war über die Liste mit einem Klick erreichbar. Die Seite zeigt Kontaktdaten, «Aktuelle Miete» (Wohnung A1, Seepark Residenz, CHF 1'400.00), Mietverträge, Dokumente und das neue Panel «Daten des Mieters».
2. **Hilfetext lesen.** Erwartet: was die Datei enthält, Frist, worauf achten. Gesehen: der Inhalt der Datei, Art. 28 DSG, die 30 Tage, «Prüfen Sie vorher, ob Dokumente oder Notizen Daten anderer Personen enthalten» und «Geben Sie die Datei nur dem Mieter selbst». Das ist gut und knapp. Mir fehlt der Hinweis auf Entwürfe (P-1) und auf das Auskunftsrecht (P-3). «alles» ist zu stark (P-2).
3. **Daten exportieren.** Erwartet: eine ZIP-Datei ohne Zwischenschritt. Gesehen: wie erwartet, `Daten-Weber-Thomas.zip`.
4. **Entpacken.** Erwartet: JSON plus PDFs. Gesehen: `daten.json` und `abrechnungen/NK-22222222-2024-0001.pdf`. Die Namen sind klar.
5. **JSON lesen.** Erwartet: eine für den Mieter verständliche Struktur. Gesehen: lesbar eingerückt, aber englische Schlüssel und Kategorien, ein Saldo-Vorzeichen ohne Erklärung und kein Verteilschlüssel (P-4, P-2).
6. **PDF prüfen.** Erwartet: die versandte Abrechnung. Gesehen: 2 Seiten, Rückerstattung CHF 70.25, Kostenübersicht mit Verteilschlüssel, Hinweise zu Art. 257b OR und Art. 8 VMWG. Das passt zum JSON.
7. **Abgleich mit der App.** Erwartet: Alles, was die App zum Mieter zeigt, steht auch im Export. Gesehen: Die Abrechnungsseite 2024 zeigt «Versendet 14.04.2025», Heizprofil und Rundung, der Export nicht (P-2). Der Entwurf 2025 ist in der App klar als «Status: Entwurf» markiert, im Export nur als `draft` mit Abrechnungsdatum und Zahlungsfrist (P-1).
8. **Gegenprobe Dokumente** (Marco Bernasconi, nur Download). Erwartet: Dokumente im ZIP. Gesehen: `documenti/2023-06-30 Übergabeprotokoll Wohnung B2.pdf`. Es ist gut benannt, und die Ordnernamen folgen der Sprache des Mieters.
9. **Französisch.** Erwartet: gleicher Inhalt, korrekte Begriffe. Gesehen: wie erwartet (siehe Beobachtungen).
10. **Zurück auf Deutsch.** Erwartet: Knopf «Sprache: Deutsch». Gesehen: wie erwartet.

## Verwirrung

- «Daten des Mieters» oder «Daten exportieren»: Ist das schon die Antwort an den Mieter oder nur ein Rohmaterial, das ich ergänzen muss? Der Text legt das Erste nahe.
- `balance: "-70.25"` neben `paidAmount: "-70.25"`: Hat der Mieter bezahlt oder ich? Erst der Abgleich mit dem PDF zeigt: Ich habe zurückerstattet.
- `status: "draft"` mit `statementDate` und `paymentDeadline`: Ist diese Abrechnung schon gestellt?
- `managementFeePercent: null` im Vertrag, aber `"3.00"` in der Abrechnung: Woher kommen die 3 %? (vermutlich vom Gebäude; das steht nicht da).
- `start`/`end` bei den Rechnungen: Leistungszeitraum? Zählperiode?

## Fehlerrisiken

- Ich gebe den Entwurf mit Betrag und Frist heraus. Der Mieter beruft sich später auf diesen Betrag oder diese Frist, oder er zahlt auf eine Abrechnung, die ich noch ändern will (P-1).
- Ein Mieter verlangt «Auskunft» statt «Herausgabe». Ich schicke nur das ZIP und verletze damit die Auskunftspflicht (Zweck, Aufbewahrungsdauer, Empfänger fehlen) (P-3).
- Ich verlasse mich auf «alles» und bestätige dem Mieter Vollständigkeit, obwohl Versanddatum und Verlauf fehlen (P-2).
- Ich lese die Datei vor dem Versand nicht ganz durch, weil ich sie wegen der englischen Feldnamen nicht verstehe. So übersehe ich Daten Dritter in Notizen (P-4).
- Ich schicke die Datei unverschlüsselt per E-Mail an eine Adresse, die ich nicht geprüft habe. «Nur dem Mieter selbst» sagt nicht, wie ich das sicherstelle.

## Vorschläge

- **P-1:** Mieter Thomas Weber öffnen → «Daten exportieren» → `daten.json` öffnen → zweite Abrechnung `NK-22222222-2025-0001`: `"status": "draft"`, `"statementDate": "2026-10-19"`, `"paymentDeadline": "2026-11-18"`.
  Hilfreich wäre eines davon:
  - Entwürfe weglassen.
  - Sie getrennt und eindeutig als «Entwurf, nicht versandt» kennzeichnen, ohne Abrechnungsdatum und Zahlungsfrist.
  - Mindestens im Hilfetext sagen: «Die Datei enthält auch Abrechnungsentwürfe, die Sie noch nicht versandt haben.»
- **P-2:** Mieter Thomas Weber exportieren, dann Abrechnung NK-22222222-2024-0001 in der App öffnen: «Versendet 14.04.2025», Verteilschlüssel, Rundung und Heizprofil fehlen im JSON.
  Hilfreich wäre:
  - Diese Werte in den Export aufnehmen.
  - Oder «alles» durch «die gespeicherten Daten zu …» ersetzen.
- **P-3:** Panel «Daten des Mieters» lesen. Hilfreich wäre ein Satz wie: «Verlangt der Mieter Auskunft (Art. 25 DSG), nennen Sie ihm zusätzlich Zweck, Aufbewahrungsdauer und Empfänger der Daten; siehe Datenschutzerklärung.» Dazu: «Die Herausgabe ist in der Regel kostenlos.» Fachlich prüfen lassen.
- **P-4:** `daten.json` öffnen. Hilfreich wäre:
  - Kategorien so benennen wie im PDF und in der Sprache des Mieters («Hauswart»).
  - Den Status in Worten angeben.
  - Den Saldo als «Nachzahlung»/«Rückerstattung» mit positivem Betrag angeben.
  - Alle Beträge im gleichen Format liefern.
  - Optional zusätzlich eine lesbare Zusammenfassung (PDF oder CSV) beilegen.
- **P-5:** ZIP entpacken: Es fehlt eine Erklärung. Hilfreich: eine kurze Textdatei in der Sprache des Mieters mit Exportdatum, Verantwortlichem und Bedeutung der Felder.
- **P-6:** ZIP herunterladen. Hilfreich: Datum im Namen, z. B. `Daten-Weber-Thomas-2026-10-19.zip`.

## Nicht geprüft

- **Mahnungen im Export:** Die Demo-Daten haben keine Mahnungen (0 überfällig, `reminders` leer), und erzeugen durfte ich keine.
- **Notizen am Mietvertrag oder an Abrechnungen mit Daten Dritter:** Alle `notes` sind `null`, und speichern durfte ich nichts.
- **Mieter mit mehreren oder beendeten Verträgen, Korrekturabrechnungen (`replaces`) und Zahlungsrückstellungen:** Thomas Weber hat das nicht.
- **Ob die App weitere Daten zum Mieter speichert, die weder sichtbar noch im Export sind** (z. B. Mail-Zustellprotokolle): Ohne Quellcode kann ich das nicht beurteilen.
- **Verhalten bei einem Fehler des Exports** (z. B. Server-Fehler 500): Der Auftrag nannte keinen Fehlerfall.
- **Italienisch und Englisch im Panel:** Nur Französisch war verlangt.
- **Rechtliche Würdigung:** Sie ist eine Einschätzung der Persona. Die Frist von 30 Tagen (Art. 22 i. V. m. Art. 18 DSV) halte ich für richtig. Art. 28 DSG deckt streng genommen nur Daten, die der Mieter selbst angegeben hat; mehr herauszugeben schadet nicht. Ein fach-reviewer sollte P-1 und P-3 bestätigen.
