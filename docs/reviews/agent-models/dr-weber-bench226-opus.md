# Persona-Lauf Dr. Weber – bench226-opus (Leistungszeitraum bei Rechnungen)

Desktop 1440 × 900, Maus. Gespeichert habe ich nur im Gebäude «Seepark Residenz».
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dr-weber-bench226-opus/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Kostenübersicht, Unterzeilen Hauswart | Die Unterzeilen «01.01.2025 – 31.03.2025: 765.00, 0/90 Tage» haben keine Beschriftung. Dass «0/90» bedeutet «Ihre Mietstage im Leistungszeitraum / Tage des Leistungszeitraums», muss Frau Brunner selbst erraten. Kleine graue Schrift, keine Spaltenköpfe. |
| P-2 | Minor | PDF, Fussnote | Die Fussnote erklärt den Zeitanteil nur als «Ihre Mietstage in der Abrechnungsperiode; bei Heizkosten der Anteil nach dem Heizprofil». Beim Hauswart steht aber «50.00 %», und zwar nicht «184/365 Tage» wie in den anderen Zeilen. Dass der Prozentsatz aus den Leistungszeiträumen kommt, steht nirgends in Worten. Man versteht es nur über die Formelzeile. |
| P-3 | Minor | PDF, Unterzeilen Hauswart | Die einzelnen Rechnungen erscheinen nur mit Zeitraum und Betrag, ohne Rechnungssteller («Facility Service AG»), Beschreibung oder Rechnungsdatum. Bei der Belegeinsicht (Art. 257b Abs. 2 OR, im PDF erwähnt) kann die Mieterin die Zeilen den Belegen nur über den Betrag zuordnen. Hier sind das viermal 765.00. |
| P-4 | Minor | PDF, Zeile Hauswart (Betrag) | «Ihr Anteil» 392.07 entsteht aus dem *gerundeten* Wohnungsanteil: 784.13 × 50 % = 392.065, aufgerundet 392.07. Genau gerechnet ergibt sich 3’060.00 × 82/320 × 50 % = 392.0625, also 392.06. Frau Brunner (Q3+Q4) und Frau Meier (Q1+Q2) zahlen je 392.07, zusammen 784.14 für einen Wohnungsanteil von 784.13. Das ist 1 Rappen zu viel. Mit dem PDF allein lässt sich die Zahl nachrechnen (784.13 × 0.5), aber nur mit kaufmännischer Rundung von x.xx5. |
| P-5 | Minor | Dwello, Abrechnung Nina Brunner (Kostenaufstellung) | In der App zeigt die Zeile Hauswart «Anteil 12.81 %». Diese Zahl steht so nirgends im PDF (dort: 82/320 m², Zeitanteil 50.00 %). Die Aufschlüsselung nach Leistungszeiträumen fehlt in der App. Als Vermieter kann ich am Bildschirm nicht nachvollziehen, was die Mieterin im PDF sieht. |
| P-6 | Nit | Rechnung bearbeiten, Feldgruppe Leistungszeitraum | Unter «Beginn» steht «Beispiel: 31.12.2026». Für einen Beginn ist ein 31.12. ein ungünstiges Beispiel. Der Hilfetext nennt als Beispiel das 4. Quartal 2024, während ich gerade eine Rechnung von 2025 bearbeite. Beides ist richtig, lässt mich aber stocken. |

## Beobachtungen

- **Uhrzeiten widersprechen sich:** Der Assistent meldet «Entwurf gespeichert, 15:33», die Rechnung zeigt «Zuletzt geändert 16.10.2026, 17:33». Das sind zwei Stunden Unterschied, vermutlich verschiedene Zeitzonen.
- **Abrechnungsnummern wechseln beim Neuerstellen:** Nina Brunner hatte NK-22222222-2025-0003 und hat jetzt -0001. Sarah Meier hatte -0002 und hat jetzt -0004. Hätte ich eine alte Nummer schon mitgeteilt, passt sie nicht mehr.
- **Neu erstellte Entwürfe haben noch kein PDF:** Statt «PDF herunterladen» steht zuerst «PDF erstellen». Die gelöschten Demo-Entwürfe hatten schon ein PDF. Mein erster Download-Versuch lief deshalb ins Leere.
- **Neu berechnen ist umständlich:** Nach dem Speichern der Rechnungen erinnert die Rechnungsseite nicht mehr daran, die Entwürfe neu zu erstellen. Der Hinweis «Rechnung schon abgerechnet» stand vorher im Formular. Der Assistent sagte mir dann «Alle Mietverträge haben schon eine Abrechnung … löschen Sie ihn». Ich musste vier Entwürfe einzeln löschen, jeden mit eigener Bestätigung.
- **Zwei Wörter für dasselbe:** Das PDF sagt «Liegenschaft» und «Kosten Liegenschaft», die App «Gebäude» und «Kosten des Gebäudes». Das war schon im alten PDF so.
- **Rechenweg nur über die Fussnote:** Das PDF sagt nirgends ausdrücklich «Ihr Anteil = Wohnungsanteil × Zeitanteil». Man erschliesst es aus der Fussnote. Das war schon vorher so.
- **Fehlermeldung zum Zeitraum:** «Ende vor Beginn» wird gut abgefangen («Das Ende darf nicht vor dem Beginn liegen.»). Sichtbar steht sie einmal, im Accessibility-Baum zweimal.

## Aufgabe geschafft: ja

Ich habe alle vier Leistungszeiträume eingetragen und gespeichert, die vier Abrechnungen von Seepark Residenz 2025 neu erstellt und das PDF von Nina Brunner nachgerechnet. Alle Zahlen ausser dem einen Rappen (P-4) gehen auf.

## Aufwand

Etwa 20 Minuten und rund 35 Bedienschritte: 4 × Formular, 4 × Entwurf löschen mit Bestätigung, Assistent zweimal mit 5 Schritten, PDF erstellen und herunterladen.

## Ablauf

1. **Übersicht.**
   - Erwartet: einen Hinweis auf Seepark 2025.
   - Gesehen: «Noch nicht abgerechnet: Alpenblick». Seepark hat schon 4 Entwürfe 2025 (Brunner, Meier, Weber, Bernasconi).
2. **Rechnungen 2025, Filter Seepark Residenz + Hauswart.**
   - Erwartet: 4 Rechnungen der Facility Service AG.
   - Gesehen: genau diese, je CHF 765.00, datiert 31.03., 30.06., 30.09. und 31.12.2025. Der Filter funktioniert gut.
3. **Rechnung Q4 bearbeiten.**
   - Erwartet: ein Feld für den Leistungszeitraum.
   - Gesehen: Gruppe «Leistungszeitraum (optional)» mit Beginn und Ende sowie ein ausführlicher Hilfetext, auch dazu, wann man das Feld nicht nutzt (Heizöl usw.). Oben die gelbe Warnung «Rechnung schon abgerechnet … Löschen Sie danach die Entwürfe und erstellen Sie die Abrechnungen erneut.» Das ist klar und gut. Der Rechnungsdatum-Hilfetext erklärt jetzt auch «Ohne Leistungszeitraum bestimmt es, in welche Abrechnungsperiode die Rechnung fällt». Das ist hilfreich.
4. **Beginn und Ende für Q4 bis Q1 eingetippt und gespeichert.**
   - Erwartet: Speichern klappt und der Zeitraum ist sichtbar.
   - Gesehen: Die Detailseite zeigt «Leistungszeitraum 01.10.2025 – 31.12.2025» und darunter «Nur die Tage in der Abrechnungsperiode zählen.» Bei allen vier ok.
5. **Gegenprobe: Ende vor Beginn eingegeben, nicht gespeichert.**
   - Erwartet: eine Fehlermeldung.
   - Gesehen: «Das Ende darf nicht vor dem Beginn liegen.», das Feld ist rot markiert, nichts wurde gespeichert.
6. **Abrechnungen erstellen, Schritte 1 bis 4.**
   - Erwartet: Ich kann neu berechnen.
   - Gesehen: Die Vorschau zeigt 0 Abrechnungen und «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …». Verständlich, aber ein Umweg.
7. **Vier Seepark-Entwürfe einzeln gelöscht.**
   - Gesehen: Der Dialog «Die Abrechnung NK-22222222-2025-0004 von Marco Bernasconi wird gelöscht. Das lässt sich nicht rückgängig machen.» Klar. Das alte PDF von Frau Brunner hatte ich vorher gesichert.
8. **Assistent erneut.**
   - Gesehen: Vorschau mit 4 Abrechnungen. Nina Brunner hat jetzt eine Rückerstattung von CHF 97.20 (vorher 93.85), Sarah Meier eine Nachzahlung von 141.30 (vorher 138.00). Das ist plausibel: Der Hauswart verschiebt sich zur Vormieterin, die das 1. Halbjahr bewohnte (181 Tage, aber 50 % der Hauswartkosten).
   - «Entwürfe erstellen» ergibt «4 Nebenkostenabrechnungen sind als Entwurf erstellt.»
9. **Abrechnung Nina Brunner in Dwello.**
   - Gesehen: Hauswart mit Anteil 12.81 % und CHF 392.07 (vorher 12.92 % und 395.29). Die 12.81 % kann ich nur als 392.07/3’060 deuten (P-5).
   - Um das PDF zu bekommen, musste ich erst auf «PDF erstellen» klicken.
10. **PDF Nina Brunner nachgerechnet** (Bildschirmfoto `19-pdf-brunner-1.png`, Seite 1).
    - Kopf: «Ihr Mietverhältnis: 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)».
    - Zeile Hauswart: Pro Fläche (m²), 82.00 / 320.00 m², Kosten Liegenschaft 3’060.00, Wohnungsanteil 784.13, Zeitanteil 50.00 %, Ihr Anteil 392.07.
    - Darunter in kleiner grauer Schrift vier Zeilen «Zeitraum: 765.00, x/y Tage» und die Formel «(765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 92/92 + 765.00 × 92/92) / 3’060.00 = 50.00 %».
    - Meine Nachrechnung:
      - Die Quartale haben 90, 91, 92 und 92 Tage. Stimmt für 2025.
      - Frau Brunner wohnt ab 1.7., also hat sie 0 + 0 + 92 + 92 Tage. Stimmt.
      - 1’530 / 3’060 = 50 %. Stimmt.
      - 3’060 × 82/320 = 784.125, im PDF 784.13. Stimmt.
      - 784.13 × 50 % = 392.065, im PDF 392.07. Geht auf, aber exakt wären es 392.06 (P-4).
    - Gegenprobe mit dem PDF von Sarah Meier: dort Q1+Q2 mit 90/90 und 91/91, ebenfalls 50.00 % und 392.07. Zusammen also 784.14.
    - Die übrigen Zeilen rechnen weiter mit 184/365 Tagen. Der Rest der Abrechnung (Zwischensumme 1’303.70, 3 % = 39.11, 1’342.81 − 1’440.00 = −97.19, gerundet 97.20) stimmt.
11. **Wie Frau Brunner es lesen würde.**
    - Mit der Formelzeile kommt eine sorgfältige Leserin auf 50 %. Der Gedanke dahinter («Sie zahlen nur die Quartale, in denen Sie gewohnt haben») steht aber nirgends in Worten.
    - «0/90 Tage» ohne Beschriftung wirkt technisch (P-1, P-2).
    - Ob die vier 765er-Zeilen wirklich die Hauswart-Rechnungen der Facility Service AG sind, sieht sie nicht (P-3).

## Verwirrung

- **«0/90 Tage»:** wessen Tage? Gemeint sind wohl Mietstage im Leistungszeitraum / Tage des Leistungszeitraums. Es steht nicht da.
- **Spalte «Zeitanteil»:** einmal «184/365 Tage», einmal «50.00 %» (Hauswart), einmal «44.20 %» (Heizung, Heizprofil). Für die Heizung erklärt die Fussnote den Prozentsatz, für den Hauswart nicht.
- **«Anteil 12.81 %»** in der App gegenüber «50.00 %» im PDF.
- **«Liegenschaft» (PDF) und «Gebäude» (App).**
- Der **Hilfetext mit dem Beispiel 2024** beim Bearbeiten einer Rechnung von 2025.

## Fehlerrisiken

- **Vergessene Neuberechnung:** Wer den Leistungszeitraum nachträgt und die Entwürfe nicht löscht und neu erstellt, versendet die alten Beträge. Die Warnung steht nur im Formular, nach dem Speichern nicht mehr.
- **Nicht zuordenbare Belege:** Ohne Rechnungssteller in den Unterzeilen können Mieterin und Vermieter bei vier gleichen Beträgen die Belege nicht eindeutig zuordnen.
- **1 Rappen zu viel bei Mieterwechsel:** Rundung über den gerundeten Wohnungsanteil. Eine kritische Mieterin könnte das als Mehrforderung beanstanden.
- **Falsch erfasste Daten:** Tippe ich ein Quartal falsch (z. B. 01.07. bis 30.06.), fängt Dwello das ab. Einen Zeitraum ausserhalb der Abrechnungsperiode habe ich nicht geprüft.

## Vorschläge

- **P-1:**
  - Nachstellen: PDF der Abrechnung Nina Brunner (Seepark 2025, Hauswart-Rechnungen mit Leistungszeitraum Q1 bis Q4) öffnen, Zeile Hauswart.
  - Hilfreich: «01.07.2025 – 30.09.2025: CHF 765.00, Sie wohnten 92 von 92 Tagen» oder kleine Spaltenköpfe («Leistungszeitraum · Betrag · Ihre Tage / Tage»).
- **P-2:**
  - Nachstellen: wie P-1, Fussnote unten auf Seite 1.
  - Hilfreich: die Fussnote ergänzen, etwa «bei Rechnungen mit Leistungszeitraum: Ihre Mietstage in jedem Leistungszeitraum, gewichtet mit dem Betrag der Rechnung (siehe Zeilen darunter)».
- **P-3:**
  - Nachstellen: wie P-1.
  - Hilfreich: den Rechnungssteller und ggf. die Beschreibung in jede Unterzeile aufnehmen («Facility Service AG, Hauswartung Q3 2025»).
- **P-4:**
  - Nachstellen: PDFs Nina Brunner und Sarah Meier (beide Wohnung A2) vergleichen. Beide haben Hauswart 392.07, Wohnungsanteil 784.13.
  - Hilfreich: «Ihr Anteil» aus dem ungerundeten Wohnungsanteil rechnen. Falls das gewollt ist, den Rechenweg so zeigen, dass die Summe der Mieter den Wohnungsanteil nicht übersteigt. Prüfen sollte das `daten-pruefer`.
- **P-5:**
  - Nachstellen: Nebenkostenabrechnungen → Nina Brunner (Seepark 2025) → Kostenaufstellung, Zeile Hauswart.
  - Hilfreich: in der App dieselbe Aufteilung wie im PDF (Wohnungsanteil und Zeitanteil getrennt, Leistungszeiträume aufklappbar) oder wenigstens ein Hinweis «nach Leistungszeitraum verteilt».
- **P-6:**
  - Nachstellen: Rechnung «Hauswartung Q4 2025» bearbeiten → Gruppe Leistungszeitraum.
  - Hilfreich: beim Beginn ein Beispiel wie «01.10.2025», im Hilfetext das Beispieljahr passend zur Rechnung oder neutral.

## Nicht geprüft

- **Leistungszeitraum über die Periodengrenze**, z. B. 01.12.2024 bis 28.02.2025: Dafür hätte ich eine Rechnung anlegen oder verfälschen müssen, das war nicht Teil der Aufgabe.
- **Leistungszeitraum bei Heizöl:** Der Hilfetext rät davon ab, Dwello verhindert es vielleicht nicht. Nicht ausprobiert.
- **Abrechnungen von Thomas Weber und Marco Bernasconi:** nur in der Vorschau gesehen, PDFs nicht nachgerechnet.
- **PDF Seite 2 und Zahlteil:** nur der Text von Seite 2 gelesen. Einen Zahlteil hat Frau Brunner nicht (Rückerstattung).
- **Andere Sprachen und Mobilansicht:** nicht Teil meiner Rolle.
