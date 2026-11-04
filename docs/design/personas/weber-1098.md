# Dr. Weber – Tankbestand bei abweichender Abrechnungsperiode (#1098)

Desktop 1440 × 900, Maus. Persona-App auf :3300, Demo-Daten. Datum im Browser: 04.11.2026.
Gespeichert habe ich nur im neu erfassten Gebäude «Föhrenhof» (Föhrenweg 7, 8400 Winterthur, ZH, Mehrfamilienhaus, Abrechnungsperiode «November – Oktober»). Die Demo-Gebäude habe ich nur angesehen.

| ID  | Schwere | Bildschirm                    | Befund |
| --- | ------- | ----------------------------- | ------ |
| P-1 | Minor   | Gebäudeseite Föhrenhof, Feld «Stichtag» | Das Beispiel «31.10.2027» liegt fast ein Jahr in der Zukunft, während der Hilfetext sagt, ich solle Anfang November für den eben vergangenen 31.10. erfassen. Heute (04.11.2026) wäre das 31.10.2026. Wer das Beispiel als Hinweis auf «das richtige Jahr» liest, erfasst den Bestand ein Jahr zu spät, und Dwello nimmt 31.10.2027 ohne Rückfrage an. |
| P-2 | Minor   | Gebäudeseite Musterhaus Zentrum / Seepark Residenz / Alpenblick (Kalenderjahr), Abschnitt «Tankbestand» | Der Text sagt «am letzten Tag jeder Abrechnungsperiode, zum Beispiel am 31.12.». Bei einem Gebäude, das das Kalenderjahr abrechnet, ist der 31.12. kein Beispiel, sondern der einzige richtige Tag. Beim Föhrenhof steht korrekt «bei diesem Gebäude am 31.10.». «zum Beispiel» lässt mich fragen, ob ein anderer Tag auch ginge. |

## Beobachtungen

- Der Hilfetext beim Föhrenhof ist in sich stimmig: «Der Wert vom 31.10.2025 ist der Endbestand der Abrechnungsperiode 01.11.2024 – 31.10.2025 und der Anfangsbestand der Abrechnungsperiode 01.11.2025 – 31.10.2026.» Nachgerechnet: Der Endbestand am letzten Tag der einen Periode ist der Anfangsbestand am folgenden Tag (01.11.). Die Formel «Anfangsbestand + Einkauf − Endbestand» ergibt damit für 01.11.2025 – 31.10.2026: Bestand 31.10.2025 + Einkäufe in der Periode − Bestand 31.10.2026. Das passt lückenlos und ohne Überlappung.
- «Lesen Sie erst Anfang November ab, erfassen Sie den Wert trotzdem per 31.10.» passt zur Periode. Beim Kalenderjahr steht entsprechend «Anfang Januar … per 31.12.».
- Der Vergleich mit dem Kalenderjahr ist sauber: dort «Endbestand 2024 und Anfangsbestand 2025», beim Föhrenhof die ausgeschriebenen Perioden. Für eine Periode über den Jahreswechsel ist das ausgeschriebene Datum die bessere Wahl; eine Jahreszahl allein wäre dort mehrdeutig.
- Die Beispieljahre sind auf den beiden Seiten unterschiedlich gewählt: Kalenderjahr Text 2024/2025 und Feld 31.12.2026, Föhrenhof Text 2025/2026 und Feld 31.10.2027. Beide Felder zeigen das Ende der laufenden Periode, und beide Texte nennen den vorletzten Stichtag. Das ist folgerichtig, aber das Nebeneinander von drei Jahreszahlen musste ich zweimal lesen.
- Dwello prüft den Stichtag nicht gegen die Abrechnungsperiode. Beim Föhrenhof hat es 31.12.2025, 30.10.2026 (einen Tag zu früh) und 31.10.2027 (in der Zukunft) jeweils mit «Bestand gespeichert.» angenommen, ohne Hinweis. Ich weiss nicht, ob das zur Änderung gehört. Der Löschdialog sagt aber, dass nur Abrechnungen den Bestand nutzen, die «am Tag danach beginnen oder an diesem Tag enden». Ein Bestand vom 30.10. würde also stillschweigend nicht als Endbestand zählen, und abgerechnet würde der Einkauf statt des Verbrauchs. Die drei Testbestände habe ich danach wieder gelöscht.
- Der Löschdialog ist unabhängig von der Periode formuliert («am Tag danach beginnen oder an diesem Tag enden») und stimmt deshalb auch für November – Oktober.
- Im Formular «Neues Gebäude» gibt es kein Feld für den Brennstoff (Pellets). Der Abschnitt «Tankbestand» erscheint bei jedem Gebäude. Dass der Föhrenhof mit Pellets heizt, konnte ich nirgends erfassen. Das hat mich nicht behindert, weil der Text «Liter, kg oder Ster» nennt und Pellets damit abgedeckt sind.
- Der Text sagt nicht, welches Datum einer Rechnung über den «Einkauf» der Periode entscheidet (Lieferdatum oder Rechnungsdatum). Bei einer Lieferung um den 31.10. wäre mir das wichtig.
- Der Hilfetext des Häkchens «Kein Tank oder Tank stillgelegt» im Erfassungsformular spricht allgemein vom «letzten Tag der Abrechnungsperiode». Das passt zu jeder Periode.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 7 Skriptläufe: Liste, Formular, Erfassen, drei Demo-Gebäude lesen, fünf Bestände speichern, drei davon löschen.

## Ablauf

- Formular «Neues Gebäude»: Ich habe ein Feld für die Heizart oder den Brennstoff erwartet. Es gibt nur «Kein Tank oder Tank stillgelegt».
- Feld «Stichtag» beim Föhrenhof: Ich habe als Beispiel 31.10.2026 erwartet, den Stichtag, den ich Anfang November 2026 erfasse. Gesehen habe ich «Beispiel: 31.10.2027».
- Speichern mit 30.10.2026 und 31.10.2027: Ich habe einen Hinweis erwartet, dass der Stichtag der 31.10. der abgelaufenen Periode sein soll. Gesehen habe ich jedes Mal «Bestand gespeichert.».
- Demo-Gebäude mit Kalenderjahr: Ich habe «bei diesem Gebäude am 31.12.» erwartet, gleich wie beim Föhrenhof. Dort steht «zum Beispiel am 31.12.».

## Vorschläge

- **P-1:** Gebäude mit Abrechnungsperiode «November – Oktober» erfassen, Gebäudeseite öffnen, Abschnitt «Tankbestand», Hilfe am Feld «Stichtag» lesen (Datum 04.11.2026). Als Beispiel sollte der zuletzt vergangene Stichtag stehen (hier 31.10.2026), also der Wert, den man nach dem Text «Lesen Sie erst Anfang November ab …» gerade erfasst. Einen Stichtag in der Zukunft sollte Dwello mindestens nachfragen.
- **P-2:** Ein Demo-Gebäude mit Kalenderjahr öffnen (z. B. Musterhaus Zentrum), Abschnitt «Tankbestand». Den Text gleich bauen wie bei der abweichenden Periode: «bei diesem Gebäude am 31.12.» statt «zum Beispiel am 31.12.».

## Nicht geprüft

- Eine Nebenkostenabrechnung für den Föhrenhof (01.11.2025 – 31.10.2026) mit den Beständen 31.10.2025 / 31.10.2026 und einer Pellet-Rechnung. Das Gebäude hat keine Wohnungen und keine Mietverträge, und die Aufgabe beschränkte sich auf die Hilfe der Gebäudeseite. Ob die Abrechnung den Verbrauch wirklich mit diesen Beständen rechnet, habe ich daher nicht nachgerechnet.
- Abrechnungsperiode «Juli – Juni»: nicht angesehen, nicht Teil der Aufgabe.
- Andere Sprachen als Deutsch und die Mobilansicht: nicht Teil meiner Persona.
