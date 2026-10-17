# Dr. Weber: «Abgerechnet bis», Vorschau und PDF der Abrechnung 2025 (Seepark Residenz, Wohnung B1)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 mit Demo-Daten.
Gespeichert habe ich nur im Gebäude «Seepark Residenz»: Mieter Reto Gisler, sein Mietvertrag für Wohnung B1 und die Abrechnung NK-22222222-2025-0005.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dca54b3-8fb5-564d-9204-e9a5d0d94e11/scratchpad/weber-w5d/` (Screenshots in `shots/`, PDFs in `pdf/`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau» | Für Reto Gisler zeigt die Vorschau nur «Kosten CHF 1’769.73, Rückerstattung CHF 30.25». Sie zeigt nicht, welche Tage (01.04.–31.12.2025, 275 Mietstage) und welches Akonto (CHF 1’800.00) abgerechnet werden, und erwähnt «Abgerechnet bis 31.03.2025» nicht. Ich kann vor dem Erstellen nicht prüfen, ob Dwello meine Angabe berücksichtigt hat. |
| P-2 | Major | PDF, Seite 1, Saldo und Kostenübersicht | «Geleistete Akontobeiträge – 1’800.00» steht ohne Herleitung da. Das PDF druckt weder das monatliche Akonto (CHF 200.00) noch die Monate (April bis Dezember). Es sagt auch nicht, dass die Akontobeiträge Januar bis März (CHF 600.00) schon mit der früheren Abrechnung verrechnet sind. Ein Mieter, der 2025 zwölfmal CHF 200.00 bezahlt hat, sieht CHF 600.00 «verschwinden». Aus dem PDF allein kann ich das Akonto nicht nachrechnen. |
| P-3 | Minor | PDF, Zeile zum Mietverhältnis | «Abgerechnet bis 31.03.2025; diese Abrechnung umfasst 01.04.2025 – 31.12.2025» ist knapp und passiv. Wer abgerechnet hat und was (Nebenkosten und Akonto bis 31.03.2025, mit einer früheren Abrechnung), muss der Mieter erraten. |
| P-4 | Minor | PDF, Fussnote Seite 1 und «Heiz- und Warmwasserkosten» Seite 2 | Die Erklärungen widersprechen der Zeile zum Mietverhältnis. Diese nennt «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025». Die Fussnote erklärt den Zeitanteil als «Ihre Mietstage in der Abrechnungsperiode», das wären 365, gedruckt sind 275/365. Seite 2 nennt April bis Dezember die «Monate Ihres Mietverhältnisses». Richtig wäre: die abgerechneten Tage bzw. Monate. |
| P-5 | Minor | Abrechnung NK-22222222-2025-0005 (Detailseite) | Die Kopfzeile nennt die Abrechnungsperiode 01.01.2025 – 31.12.2025, unten steht «Mietstage in der Abrechnungsperiode: 275 Mietstage». Gisler hatte in dieser Periode aber 365 Mietstage. «Abgerechnet bis» und der abgerechnete Zeitraum 01.04.–31.12.2025 fehlen. Nur die Liste der Abrechnungen nennt «01.04.2025 – 31.12.2025, 275 Mietstage». |
| P-6 | Minor | Mietvertrag bearbeiten, Feld «Abgerechnet bis» | Das Feld nimmt Daten ohne Warnung an, die nicht stimmen können: 31.12.2027 (in der Zukunft) und 31.12.2023 (vor dem Vertragsbeginn 01.01.2024). Ein Tippfehler 2027 statt 2025 lässt den Hinweis «Abrechnung 2025 fehlt» still verschwinden. Dwello erstellt dann für 2025 und 2026 keine Abrechnung. Beim Vertragsbeginn in der Vergangenheit warnt Dwello, hier nicht. |
| P-7 | Nit | Mietvertrag (Detailseite), Hinweis «Abrechnung 2025 fehlt» | Der Hinweis fragt auch dann noch «Haben Sie diese Periode ausserhalb von Dwello abgerechnet? Tragen Sie … «Abgerechnet bis» ein», wenn «Abgerechnet bis 31.03.2025» schon eingetragen ist. Besser wäre: «Abgerechnet bis 31.03.2025: Die Abrechnung 2025 umfasst den 01.04.–31.12.2025.» |

## Beobachtungen

- Der Hilfetext zu «Abgerechnet bis» ist inhaltlich korrekt, und Dwello hält sich an ihn. Für 2024 (endet vor dem 31.03.2025) verlangt Dwello keine Abrechnung mehr. Aus «2 Abrechnungen fehlen» (2024, 2025) wurde «Abrechnung 2025 fehlt». Die Abrechnung 2025 zählt 275 Mietstage ab dem 01.04.2025 und 9 Akontobeiträge (9 × 200 = 1’800.00). Vollständig ist er fast: Er sagt, was einzutragen ist, mit einem Beispiel, und was mit Perioden davor und mit angebrochenen Perioden geschieht. Es fehlt nur, dass Daten in der Zukunft oder vor dem Vertragsbeginn keinen Sinn ergeben (siehe P-6). «den letzten Tag der letzten solchen Abrechnung» liest sich holprig. Das Beispiel nennt nur eine Periode Juli bis Juni; ein Kalenderjahr-Beispiel wäre für die meisten näher.
- «Abgerechnet bis» gibt es nur beim Bearbeiten, nicht im Assistenten «Neuer Mietvertrag». Den Weg dorthin habe ich nur gefunden, weil die Mietvertragsseite nach dem Speichern «2 Abrechnungen fehlen» zeigte und auf das Feld verwies. Die Warnung «Vertragsbeginn liegt in der Vergangenheit» im Assistenten (Schritt 3) erwähnt es nicht. Im Assistenten steht diese Warnung zudem dreimal (am Feld, darunter und im Kasten «Vertragsbeginn prüfen»).
- Nach «Mietvertrag speichern» landete ich auf der Liste der Mietverträge ohne Bestätigungsmeldung. Nach «Änderungen speichern» landete ich auf der Mietvertragsseite, ebenfalls ohne Meldung.
- Die Anteile im PDF lassen sich aus den gedruckten Werten nachrechnen: TV 912.00 / 4 = 228.00, × 275/365 = 171.78. Heizung 4’115.00 × 75/320 = 964.45, × 62.80 % = 605.67. Hauswart 717.19 × 275/365 = 540.35. Kaltwasser 482.81 × 275/365 = 363.76. Allgemeinstrom 117.02 × 275/365 = 88.17. Summe 1’769.73. Die 62.80 % entsprechen der Summe der Monate April bis Dezember auf Seite 2. Die 275 Tage vom 01.04. bis 31.12.2025 stimmen. Mit ungerundetem Wohnungsanteil (964.453…) ergäbe die Heizung 605.68. Dwello rechnet also mit dem gerundeten Wohnungsanteil, und das PDF ist darin in sich stimmig.
- Auf der Detailseite der Abrechnung steht als Anteil nur ein Mischwert («17.66 %», «14.72 %»), der Wohnungs- und Zeitanteil zusammenfasst. Das PDF trennt beides, das ist besser.
- Abrechnungsdatum und «Erstellt» zeigen den 17.10.2026, 01:55. Im Browser war es der 16.10., 23:55 («Entwurf gespeichert, 23:55»). Offenbar unterscheiden sich die Zeitzonen von Server und Browser.
- In der Vorschau musste ich «Die Abrechnungen trotzdem erstellen» ankreuzen, weil es für Seepark Residenz schon 4 Abrechnungen 2025 gibt (Demo-Daten). Der Hinweis erklärt, dass bestehende Mietverträge keine neue bekommen; das war verständlich.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Bedienschritte: Mieter erfassen (1 Formular), Mietvertrag im Assistenten (5 Schritte plus eine Bestätigung der Warnung zum Vertragsbeginn), Mietvertrag bearbeiten für «Abgerechnet bis», Abrechnungs-Assistent (Schritte 3 bis 5 plus Häkchen), Detailseite, PDF erstellen und herunterladen. Als Benutzer schätze ich etwa 15 Minuten, mit dem Nachrechnen gut 30 Minuten. Zusätzlich habe ich zwei falsche Daten im Feld «Abgerechnet bis» ausprobiert (P-6).

## Ablauf

1. **Gebäude Seepark Residenz.** Erwartet: B1 leer. Gesehen: «Wohnung B1, 3.5 Zimmer, 75 m², Leer». (shots/02-seepark.png)
2. **Mieter erfassen** (/tenants/new). Erwartet: Name, Adresse. Gesehen: klares Formular. Reto Gisler, Seeweg 15, 6003 Luzern, Per Brief gespeichert. Danach zeigte die Mieterseite den Link «Mietvertrag erfassen». (shots/04-tenant-saved.png)
3. **Mietvertrag, Schritte 1 und 2.** Erwartet: Mieter vorgewählt. Gesehen: Reto Gisler war vorgewählt, B1 stand bei den freien Wohnungen.
4. **Schritt 3, Vertragsbeginn 01.01.2024.** Erwartet: ein Hinweis, weil das Datum in der Vergangenheit liegt, und vielleicht hier schon ein Feld «Abgerechnet bis». Gesehen: die Warnung «liegt in der Vergangenheit. Stimmt das Datum?» (dreifach); ein zweites «Weiter» ging weiter. Ein Feld für bereits abgerechnete Zeit gab es nicht.
5. **Schritt 4, Miete.** 1500.00 netto, 200.00 Akonto, Verwaltungspauschale «Nein». Schritt 5 zeigte «Monatlich total CHF 1’700.00». Gespeichert. (shots/09-contract-step5.png)
6. **Mietvertragsseite.** Erwartet: ein Hinweis auf fehlende Abrechnungen. Gesehen: «2 Abrechnungen fehlen» mit «2025 abrechnen» und «2024 abrechnen». Dazu der Satz: «Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.» Das hat mich zum Feld geführt. (shots/11-contract-detail.png)
7. **Bearbeiten, Feld «Abgerechnet bis (optional)».** Den Hilfetext habe ich ganz gelesen (Wortlaut im Screenshot shots/12-contract-edit.png) und als richtig beurteilt (siehe Beobachtungen). Zuerst habe ich falsche Daten probiert: 31.12.2023 wurde gespeichert, ebenso 31.12.2027, jeweils ohne Warnung. Bei 2027 verschwand der Hinweis auf fehlende Abrechnungen ganz (P-6). Dann habe ich 31.03.2025 gespeichert. Die Mietvertragsseite zeigte danach «Abgerechnet bis 31.03.2025» und nur noch «Abrechnung 2025 fehlt». Das hatte ich erwartet. (shots/14-contract-after.png)
8. **Abrechnungen erstellen** über «Abrechnungen erstellen» auf der Mietvertragsseite. Erwartet: Periode und Gebäude vorgewählt. Gesehen: Start direkt in Schritt 3 mit «Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025». Der Hinweis «Ohne vereinbarte Verwaltungspauschale» nannte Reto Gisler; das stimmt.
9. **Schritt 4, Vorschau.** Erwartet: für Gisler die abgerechneten Tage 01.04.–31.12.2025, das Akonto und einen Hinweis auf «Abgerechnet bis». Gesehen: Periode 01.01.–31.12.2025, 1 Abrechnung, Kosten CHF 1’769.73, und für Gisler «Kosten CHF 1’769.73, Rückerstattung CHF 30.25». Kein Zeitraum, keine Mietstage, kein Akonto (P-1). Ein «Weiter» ohne Häkchen meldete «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Mit Häkchen ging es weiter. (shots/16-wizard-preview.png)
10. **Schritt 5.** «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt. Es wird nichts verschickt.» Nach «Entwürfe erstellen» kam die Meldung «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
11. **Liste der Entwürfe.** Gesehen: «Reto Gisler NK-22222222-2025-0005, Wohnung B1, 01.04.2025 – 31.12.2025, 275 Mietstage, Rückerstattung CHF 30.25». Hier ist der Zeitraum richtig sichtbar.
12. **Detailseite.** Die Positionen zeigen nur Mischanteile. Darunter: Gesamtkosten 1’769.73, Geleistete Akontobeiträge − 1’800.00, Rückerstattung vor Rundung 30.27, Rundung − 0.02, Saldo 30.25, «275 Mietstage». Kein «Abgerechnet bis», keine Herleitung des Akontos (P-5). (shots/20-statement-detail.png)
13. **PDF erstellen und öffnen.** Erwartet: eine Zeile, die dem Mieter den Zeitraum und den Grund erklärt, und die Herleitung des Akontos. Gesehen: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025. Abgerechnet bis 31.03.2025; diese Abrechnung umfasst 01.04.2025 – 31.12.2025 (275 Mietstage von 365 Tagen)». Die Kostenübersicht trennt Wohnungsanteil und Zeitanteil (275/365 Tage, Heizung 62.80 %), Seite 2 listet die Heizprofil-Monate April bis Dezember. Das Akonto steht nur als Summe 1’800.00 da (P-2), die Fussnote spricht von «Ihre Mietstage» (P-4). (shots/22-pdf-1.png, shots/22-pdf-2.png; pdf/gisler-2025.pdf)
14. **Vergleich** mit dem PDF von Nina Brunner (A2, ohne «Abgerechnet bis»): «Ihr Mietverhältnis in dieser Periode: 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)». Auch dort ist das Akonto nicht hergeleitet. Bei Gisler wiegt das schwerer, weil Monate seines laufenden Mietverhältnisses fehlen.

## Verwirrung

- «Abgerechnet bis» im PDF: Für den Mieter ist unklar, wer abgerechnet hat und ob sein Akonto Januar bis März darin steckt.
- «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025», danach aber «Zeitanteil: Ihre Mietstage» = 275 und «Monate Ihres Mietverhältnisses» = April bis Dezember. Derselbe Begriff steht für zwei verschiedene Zeiträume.
- «Mietstage in der Abrechnungsperiode: 275» auf der Detailseite. Als Vermieter weiss ich, dass er 365 Tage gemietet hat. Erst die Liste und das PDF sagen, warum es 275 sind.
- Im Assistenten heisst der Schritt «Vorschau», er zeigt aber nur Endbeträge, nichts, was ich vorab prüfen könnte.

## Fehlerrisiken

- Ein falsches Jahr bei «Abgerechnet bis» (2027 statt 2025) unterdrückt Abrechnungen still. Der Hinweis «Abrechnung fehlt» verschwindet, und der Vermieter verliert Nachzahlungen (P-6).
- Wer «Abgerechnet bis» vergisst (es steht nicht im Assistenten «Neuer Mietvertrag»), erhält eine Abrechnung über das ganze Jahr mit 12 Akontobeiträgen. Die Vorschau würde das nicht auffallen lassen, weil sie keine Tage zeigt (P-1).
- Mieter, die die CHF 600.00 Akonto Januar bis März vermissen, beanstanden die Abrechnung. Das PDF gibt ihnen keine Antwort (P-2, P-3).

## Vorschläge

- **P-1:** Mietvertrag mit «Abgerechnet bis 31.03.2025» anlegen, «Abrechnungen erstellen», Schritt 4. Hilfreich wäre pro Mietvertrag eine Zeile «Abgerechnet: 01.04.2025 – 31.12.2025, 275 Mietstage, Akonto CHF 1’800.00» und, wo zutreffend, «Abgerechnet bis 31.03.2025 (Angabe beim Mietvertrag)» mit Link zum Mietvertrag.
- **P-2:** PDF NK-22222222-2025-0005 öffnen, Zeile «Geleistete Akontobeiträge». Hilfreich wäre eine Herleitung wie «Akonto 01.04.2025 – 31.12.2025: 9 × CHF 200.00» und der Satz «Die Akontobeiträge bis 31.03.2025 sind mit der früheren Abrechnung verrechnet.»
- **P-3:** Gleiches PDF, Zeile zum Mietverhältnis. Vorschlag: «Ihre Nebenkosten bis 31.03.2025 sind bereits abgerechnet. Diese Abrechnung umfasst den 01.04.2025 – 31.12.2025 (275 von 365 Tagen).»
- **P-4:** Gleiches PDF, Fussnote und Seite 2. Bei «Abgerechnet bis» sollte «Zeitanteil: die abgerechneten Tage Ihres Mietverhältnisses» stehen und auf Seite 2 «Anteile der abgerechneten Monate».
- **P-5:** Detailseite der Abrechnung öffnen. Hilfreich wären «Abgerechneter Zeitraum 01.04.2025 – 31.12.2025 (Abgerechnet bis 31.03.2025)» und «Abgerechnete Mietstage» statt «Mietstage in der Abrechnungsperiode».
- **P-6:** Mietvertrag bearbeiten, «Abgerechnet bis» = 31.12.2027 bzw. 31.12.2023, speichern. Hilfreich wäre eine Warnung wie beim Vertragsbeginn («liegt in der Zukunft: Dwello erstellt bis dahin keine Abrechnung. Stimmt das Datum?»), und ein Datum vor dem Vertragsbeginn sollte abgelehnt oder erklärt werden.
- **P-7:** Mietvertrag mit gesetztem «Abgerechnet bis» öffnen. Der Hinweis sollte den gesetzten Wert nennen, statt zum Eintragen aufzufordern.

## Nicht geprüft

- Einen Mietvertrag, bei dem «Abgerechnet bis» mitten in einen Monat fällt (wie Dwello das Akonto dann anteilig zählt), weil ich nur den einen Mietvertrag in Seepark Residenz anlegen sollte.
- Den Versand («Als versendet markieren») und andere PDF-Sprachen, weil sie nicht zur Aufgabe gehörten.
- Ob die Gebäudekosten (Rechnungen) stimmen: Das ist Sache von daten-pruefer. Ich habe nur die Rechenschritte im PDF nachvollzogen.
- Mobile Ansicht und Tastaturbedienung, weil sie nicht zu meinem Profil gehören.
