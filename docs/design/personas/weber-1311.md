# Dr. Weber – Aufgehobene Wohnung 2.01 in «Alpenblick» (Runde 1311)

Desktop 1440 × 900, Maus. Persona-App auf http://localhost:3300, Demo-Daten. Gespeichert habe ich nur in «Alpenblick»: «Aufgehoben ab» 01.07.2025 bei Wohnung 2.01 und die Entwürfe 2025 (Laura Keller, 0.01, NK-33333333-2025-0001; Kevin Fischer, 1.01, NK-33333333-2025-0002, entsteht beim Erstellen für das ganze Gebäude mit). Beide Entwürfe sind nicht versendet und bleiben so. Für Laura Keller ist das PDF erstellt. Einen Mietvertrag für 2.01 ab 01.01.2027 wollte ich speichern. Dwello hat ihn abgelehnt, also ist nichts entstanden.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Wohnung bearbeiten, Hilfe bei «Aufgehoben ab»; PDF-Satz zu 2.01 | Die Hilfe sagt, ab dem Tag verteile Dwello die Nebenkosten «nur noch auf die übrigen Wohnungen». Sie sagt aber nicht, dass damit der Anteil jedes Mieters steigt (Laura Keller: Fläche 72/255 = 28,2 % → 72/170 = 42,4 %, also rund +50 %). Sie sagt auch nicht, dass eine solche einseitige Änderung zulasten der Mieter rechtlich heikel ist. Rechtlich ist das eine Änderung der Verteilgrundlage, die nicht im Mietvertrag steht: Je nach Vertrag braucht sie das amtliche Formular nach Art. 269d Abs. 3 OR und gilt frühestens auf den nächsten Kündigungstermin. Dwello weist bei der Verwaltungspauschale im Mietvertrag-Assistenten genau auf diese Regel hin, hier fehlt der Hinweis. Ein Laie speichert den Tag und verschickt Abrechnungen, die die Mieter anfechten können. |
| P-2 | Major | Abrechnung (Web und PDF), Hilfe bei «Aufgehoben ab» | Die Kosten vor und ab dem 01.07.2025 teilt Dwello nach Kalendertagen, nicht danach, wann sie angefallen sind. Ausnahme ist die Heizung, die nach Heizprofil geteilt wird. Beispiel Schneeräumung: Die Rechnung «Januar bis März 2025» über CHF 920 und die Rechnung «Dezember 2025» über CHF 380 ergeben im PDF CHF 644.66 vor und CHF 655.34 ab dem Tag. Beim Kaltwasser wird die einzige Rechnung «H1 2025» (CHF 470) zur Hälfte in den Zeitraum ab 01.07. verschoben, in dem die Mieter den grösseren Anteil tragen. Mein Nachrechnen für Laura Keller: nach der wirklichen Zuordnung Schneeräumung CHF 420.70 statt 459.58, Kaltwasser CHF 132.71 statt 166.16, Allgemeinstrom CHF 134.70 statt 133.95. Das sind rund CHF 72 zu viel, vor der Verwaltungspauschale. Weder die Hilfe noch der Abrechnungsschritt sagen, dass man dafür bei den Rechnungen den «Leistungszeitraum» erfassen muss (falls Dwello diesen bei der Teilung überhaupt nutzt, siehe «Nicht geprüft»). |
| P-3 | Minor | Mietvertrag-Assistent, Schritt 2 «Wohnung» | Die aufgehobene Wohnung 2.01 steht ohne Kennzeichnung zuoberst unter den freien Wohnungen («Wohnung 2.01 · Alpenblick, 3.5 Zimmer, 85 m²»). Kommt man über `/contracts/new?apartment=…` hinein, ist sie sogar vorgewählt. Man kann vier Schritte ausfüllen. Erst «Mietvertrag speichern» lehnt ab, mit klarem Text («… muss spätestens am 30.06.2025 enden»). Vermieten kann man sie also nicht, aber Dwello führt einen bis zum letzten Klick in diese Richtung. |
| P-4 | Minor | Gebäude «Alpenblick», «Angaben zum Gebäude» | «Wohnungen: 2, davon 2 vermietet, 0 leer und 1 aufgehoben». 2 + 0 + 1 = 3, nicht 2. Als Jurist lese ich das als Widerspruch: Hat das Gebäude 2 oder 3 Wohnungen? |
| P-5 | Minor | Übersicht «Gebäude auf einen Blick» / Wohnungsliste | Die Übersicht nennt «11 Wohnungen». Der Link führt zur Liste «Wohnungen 1–12 von 13», in der die aufgehobenen Wohnungen mitgezählt sind. In der Belegung gibt es keine Zahl «Aufgehoben», und die Erklärung darunter kennt den Begriff nicht. Die Zahlen passen nicht zusammen, und man sieht nicht, warum. |
| P-6 | Minor | PDF, Satz über der Kostenübersicht | «… solange sie leer steht, trägt der Vermieter ihren Anteil» bleibt hypothetisch: Die Mieterin erfährt nicht, ob 2.01 bis 30.06. leer stand und wer den Anteil wirklich getragen hat. «Unter den betroffenen Abrechnungspositionen steht die Rechnung je Zeitraum»: Mit «Rechnung» ist hier die Berechnung gemeint, eine Mieterin liest aber «Rechnung» als Beleg oder Faktura. Der Satz nennt weder den Grund (Gemeinschaftsraum für alle Mieter) noch die Folge für sie (ihr Anteil steigt ab 01.07.). |
| P-7 | Minor | Abrechnung im Web | Dort steht «Heizprofil: Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)», obwohl die Heizung nach dem Heizprofil geteilt ist: im PDF «55.80 % / 44.20 % der Heizkosten nach Heizprofil», im Web 34.48 % statt 35.35 % wie bei den anderen Positionen. Die Spalte «Zeitanteil 365/365 Tage» zeigt die Teilung nicht. Die Zeilen je Zeitraum gibt es nur im PDF. Wer im Web prüft, sieht nicht, was gerechnet wurde. |

## Beobachtungen

- Hilfe «Aufgehoben ab», was stimmt: Bis zum Tag davor zählt die Wohnung mit, und für eine leer stehende Wohnung trägt der Vermieter den Anteil. Das ist richtig, Leerstand ist Vermieterrisiko. Gut finde ich auch, dass versendete Abrechnungen unverändert bleiben und eine berichtigte Abrechnung mit dem Tag rechnet. Dass Dwello eine vergrösserte andere Wohnung noch nicht ab dem Tag berücksichtigt, steht ehrlich da.
- Das Beispiel im Feld «Aufgehoben ab» lautet «31.12.2026». Für ein «ab»-Datum wäre ein Monatserster naheliegender. Wer das Beispiel abschreibt, hebt die Wohnung für einen einzigen Tag im Jahr zu spät auf.
- «Nach einem Umbau» passt auf meinen Fall nur halb: Hier wird ein Raum umgenutzt, nicht umgebaut.
- Die Legende «Was bedeutet der Mietstatus?» (Gebäude und Wohnungsliste) erklärt «Aufgehoben», der Schlusssatz nennt aber nur «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung». Dass man «Aufgehoben» ebenfalls dort setzt (Feld «Aufgehoben ab»), fehlt.
- Die Seite von Wohnung 2.01 nach dem Speichern: «Aufgehoben seit 01.07.2025», der Link «Mietvertrag erfassen» ist weg. Gut. Unter «Aktueller Mieter» steht aber weiter «Diese Wohnung ist derzeit nicht vermietet». Das klingt nach «vermietbar». Der Knopf «Löschen» ist weiterhin da, ohne Hinweis, ob man eine aufgehobene Wohnung löschen soll oder lieber nicht, wegen der Abrechnungen 2025.
- Im Bearbeiten-Formular ist der Mietstatus nach dem Speichern als Text gesperrt («ergibt sich aus dem Feld «Aufgehoben ab»»). Das ist klar.
- Die Wohnungsliste mit dem Filter «Leer» zeigt 2.01 nicht mehr, und unter «Mietstatus» gibt es den Filter «Aufgehoben». Die Übersicht zeigt bei «Vermietete Wohnungen pro Gebäude» für Alpenblick «2/2 vermietet». Das ist sachlich richtig, 2.01 ist dort ohne Hinweis verschwunden.
- Die Kostenabstimmung im Schritt «Vorschau» passt zu meinem Nachrechnen: Schneeräumung, Vermieteranteil CHF 214.89 = 85/255 × 181/365 × 1300. Ein Hinweis, dass 2.01 ab 01.07. aufgehoben ist und die Kosten deshalb geteilt werden, fehlt dort aber. Der Erklärtext nennt nur «Leerstand».
- Beim Erstellen entstehen zwangsläufig die Entwürfe für alle Mietverträge des Gebäudes. Ich wollte nur den für 0.01, es gab aber auch den für Kevin Fischer.
- «Nachzahlung CHF 341.15» bei «Kosten CHF 2'621.16» und «Akonto CHF 2'280.00» in der Vorschau: Die Rundung auf 5 Rappen sieht man erst auf der Abrechnung. Das ist nicht falsch, aber erst dort nachvollziehbar.
- Im PDF ist «× Anteil nach Heizprofil 100.00 %» bei einem ganzjährigen Mietvertrag eine leere Rechenstufe, die eher verwirrt.
- Bei der Verwaltungspauschale nennt Dwello im Assistenten Art. 269d OR ausdrücklich. Gerade deshalb fällt auf, dass der Hinweis bei «Aufgehoben ab» fehlt (P-1).

## Aufgabe geschafft: ja

Hilfe gelesen und beurteilt, «Aufgehoben ab» 01.07.2025 gespeichert, die Darstellung von 2.01 an allen vier Stellen geprüft, Entwurf 2025 für Laura Keller erstellt (Heizprofil und Verwaltungspauschale 3 % wie vorgeschlagen), PDF erstellt und gelesen.

## Aufwand

Rund 25 Minuten, 22 Skriptläufe, etwa 45 Klicks und Eingaben. Dazu kam das Nachrechnen der Verteilung von Hand.

## Ablauf

- Wohnung 2.01 nach dem Speichern: Ich erwartete, dass Dwello klar sagt, dass die Wohnung nicht mehr vermietbar ist. Gesehen habe ich «Aufgehoben seit 01.07.2025» und die Erklärung dazu, unter «Aktueller Mieter» aber «Diese Wohnung ist derzeit nicht vermietet».
- Gebäude: Ich erwartete eine stimmige Zählung. Gesehen habe ich «2, davon 2 vermietet, 0 leer und 1 aufgehoben» (P-4).
- Übersicht: Ich erwartete, dass die Zahl der Wohnungen mit der Liste übereinstimmt oder dass die aufgehobenen getrennt gezählt werden. Gesehen habe ich 11 in der Übersicht und 13 in der Liste, ohne eine Zahl «Aufgehoben» (P-5).
- Mietvertrag-Assistent: Ich erwartete, dass 2.01 nicht wählbar oder als «aufgehoben» markiert ist. Gesehen habe ich sie zuoberst bei den freien Wohnungen und mit Link sogar vorgewählt. Erst beim Speichern kam die Ablehnung (P-3).
- Abrechnung im Web: Ich erwartete, die Teilung vor und ab dem 01.07. dort prüfen zu können. Gesehen habe ich «365/365 Tage», «Heizprofil nicht angewendet» und den Verweis «die Zeilen dazu stehen im PDF» (P-7).
- PDF: Ich erwartete, dass die Kosten je Zeitraum nach den Rechnungen zugeordnet werden (Schneeräumung Januar bis März). Gesehen habe ich eine Teilung nach Kalendertagen (P-2).

## Vorschläge

- **P-1:** Wohnung 2.01 öffnen, «Bearbeiten», Hilfe bei «Aufgehoben ab» lesen. Vorschlag: einen Satz ergänzen wie «Ab diesem Tag steigt der Anteil der übrigen Mieter. Sieht der Mietvertrag diese Änderung nicht vor, teilen Sie sie den Mietern vorher mit dem amtlichen Formular mit; sie gilt frühestens auf den nächsten Kündigungstermin (Art. 269d OR).» Das PDF sollte die Folge für die Mieterin nennen (ihr Anteil vor und ab dem Tag). Fachlich von `fach-reviewer` bestätigen lassen.
- **P-2:** In «Alpenblick» 2.01 per 01.07.2025 aufheben, Abrechnung 2025 für 0.01 erstellen, PDF öffnen: Schneeräumung CHF 644.66 / 655.34 statt CHF 920 / 380 nach den Rechnungen. Vorschlag: Bei Rechnungen ohne Leistungszeitraum das Rechnungsdatum dem Zeitraum zuordnen, oder im Abrechnungsschritt warnen: «Wohnung 2.01 ist ab 01.07.2025 aufgehoben. Erfassen Sie bei den Rechnungen den Leistungszeitraum, sonst teilt Dwello die Kosten nach Tagen.» In der Hilfe bei «Aufgehoben ab» denselben Hinweis geben. Die Beträge sollte `daten-pruefer` nachrechnen.
- **P-3:** «Neuer Mietvertrag», Mieter wählen, «Weiter»: 2.01 steht zuoberst. Vorschlag: aufgehobene Wohnungen wie belegte mit «(aufgehoben seit 01.07.2025)» markieren und nicht wählbar machen, oder sie ganz weglassen. Die Ablehnung beim Speichern bleibt als Sicherung.
- **P-4:** Gebäude «Alpenblick» öffnen. Vorschlag: «3, davon 2 vermietet, 0 leer und 1 aufgehoben», oder «2 Wohnungen (dazu 1 aufgehoben)».
- **P-5:** Übersicht, «Gebäude auf einen Blick»: Vorschlag: eine Zahl «Aufgehoben» mit Link auf `/apartments?status=…` ergänzen und «Aufgehoben» in die Erklärung aufnehmen. Oder die Wohnungsliste ohne Filter so zählen wie die Übersicht.
- **P-6:** PDF der Abrechnung 0.01 öffnen, Satz über der Kostenübersicht. Vorschlag: «Wohnung 2.01 gibt es ab 01.07.2025 nicht mehr. Bis 30.06.2025 stand sie leer; ihren Anteil trägt der Vermieter. Ab 01.07.2025 werden die Nebenkosten auf die übrigen Wohnungen verteilt; Ihr Anteil steigt dadurch von 72/255 m² auf 72/170 m². Die Berechnung je Zeitraum steht unter den betroffenen Positionen.» Dazu die Zeile «Rechnung je Zeitraum» durch «Berechnung je Zeitraum» ersetzen.
- **P-7:** Abrechnung NK-33333333-2025-0001 im Web öffnen. Vorschlag: Die Zeilen je Zeitraum wie im PDF auch im Web zeigen und beim Heizprofil schreiben «angewendet für die Teilung vor und ab 01.07.2025 (Wohnung 2.01 aufgehoben)».

## Nicht geprüft

- Ob Dwello einen bei der Rechnung erfassten «Leistungszeitraum» bei der Teilung vor und ab dem Tag berücksichtigt (P-2). Dafür hätte ich Rechnungen in «Alpenblick» ändern und den Entwurf neu berechnen müssen. Der Entwurf soll aber für die anschliessende Datenprüfung unverändert bleiben, deshalb habe ich es nur im Formular nachgesehen: Das Feld «Leistungszeitraum (optional)» gibt es, bei den Demo-Rechnungen ist es leer.
- Den Entwurf von Kevin Fischer (1.01) habe ich nicht im Einzelnen gelesen.
- Ein Versand und eine berichtigte Abrechnung mit dem Tag («eine berichtigte Abrechnung rechnet mit diesem Tag») waren nicht Teil der Aufgabe, und die Entwürfe sollen unversendet bleiben.
- Was beim Löschen einer aufgehobenen Wohnung passiert, habe ich nicht versucht: Das wäre destruktiv für die Datenprüfung.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/9491f89b-e3dd-58ae-af29-e047f9ed5a53/scratchpad/weber-1311/` (u. a. `04-apt-edit.png` Hilfe, `07-building-after.png` Zählung, `09-dashboard.png` Belegung, `12-wizard-step2.png` und `25-wizard-save.png` Assistent, `19-statement-keller.png` Web-Abrechnung, `pdfpage-1.png` PDF-Seite 1, `keller.pdf`).
