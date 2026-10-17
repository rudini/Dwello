# Helga – Runde w3d: Tankbestand auf der Gebäudeseite, «Monatlich total»

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Tankbereich auch bei 200 %), Maus. Nur angeschaut, nichts gespeichert.
Gebäude: Musterhaus Zentrum. Wohnung: 1.01. Mieter: Hans Müller.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/8e2b3e82-f2c6-5117-a0e7-5a96d7b17ae7/scratchpad/helga-w3d/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäude, Abschnitt «Tankbestand» | Der Titel «Tankbestand» klingt nach Litern im Tank. Dass ein Frankenbetrag verlangt ist, steht erst im dritten Satz des Hilfetexts und dann wieder beim Feld «Wert in Franken». Ich hätte zuerst die Liter eingetragen. |
| P-2 | Minor | Gebäude, Abschnitt «Tankbestand» | Der Hilfetext ist ein einziger Block aus sieben Sätzen mit Formel, Rechenweg, Sonderfall und Ablesetermin. Bei 200 % füllt er den ganzen Bildschirm. Was ich tun muss («am 31.12. den Wert in Franken eintragen»), geht zwischen der Formel und dem Sonderfall «mehr im Tank als die letzte Lieferung» unter. |
| P-3 | Nit | Gebäude, Feld «Stichtag» | Das Beispiel heisst «31.12.2026». Es ist Oktober 2026, und gleich kommt die Abrechnung 2025. Ich habe kurz gedacht, ich müsse etwas für 2026 eintragen. |
| P-4 | Minor | Mieter Hans Müller, «Aktuelle Miete» | «Monatlich total CHF 1’790.00» steht hier ohne Aufschlüsselung. Ich kann nicht sehen, ob die Nebenkosten (Akonto) schon drin sind. Auf der Wohnungsseite ist es klar, hier nicht. |
| P-5 | Nit | Wohnung 1.01, «Monatliche Miete» | «Monatlich total» ist als Summe unter Nettomiete, Akonto und Zusatzmiete gut verständlich. «Akonto» und «Zusatzmiete» werden aber nirgends erklärt, also weiss ich nicht genau, was ich da zusammenzähle. |

## Beobachtungen

- Der Abschnitt «Tankbestand» kommt ganz unten auf der Gebäudeseite, nach der Erklärung zum Mietstatus. Ich musste lange scrollen und habe ihn erst gefunden, als ich alles abgesucht hatte. Oben gibt es keinen Hinweis darauf.
- Gut: Der erste Satz sagt gleich, für wen der Abschnitt gilt («Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen»). Der Satz «Lesen Sie erst Anfang Januar ab, erfassen Sie den Wert trotzdem per 31.12.» beantwortet genau die Frage, die ich gehabt hätte.
- Die bisherigen Werte (31.12.2023, 2024, 2025, je «Heizung», mit Betrag) stehen als Liste über dem Formular. So sehe ich, wie ein Eintrag aussieht. Das hilft.
- «Ster» kenne ich nicht. «Abrechnungsperiode», «Anfangsbestand» und «Endbestand» verstehe ich ungefähr, aber nur, weil der Satz mit 2024/2025 ein Beispiel gibt.
- Neben jedem Eintrag steht rot «Löschen». Ich hätte Angst, da aus Versehen draufzuklicken (nicht ausprobiert).
- Bei 200 % muss ich nicht seitwärts scrollen (gemessen: 0 px Überlauf).
- In der Vertragsliste steht «CHF 1’790.00 monatlich total» klein geschrieben. Das ist in Ordnung.

## Aufgabe geschafft: ja

Ich habe die Stelle gefunden und verstanden, dass ich am 31.12. den Wert des Öls in Franken eintrage, berechnet als Menge mal Preis der letzten Lieferung. Den Hilfetext musste ich aber zweimal lesen.

## Aufwand

Etwa 6 Minuten, rund 8 Schritte: Übersicht, Gebäude öffnen, bis ganz nach unten scrollen, Hilfetext zweimal lesen, auf 200 % prüfen, Wohnung 1.01 öffnen, über das Menü zu «Mieter» und Hans Müller öffnen.

## Ablauf

1. **Übersicht** (`/dashboard`). Erwartet: ein Weg zu meinen Gebäuden. Gesehen: unter «Vermietete Wohnungen pro Gebäude» stehen die Gebäudenamen als Links. Ich habe «Musterhaus Zentrum» angeklickt.
2. **Gebäudeseite, oben.** Erwartet: irgendwo «Heizung» oder «Öl». Gesehen: «Angaben zum Gebäude», «Wohnungen», «Was bedeutet der Mietstatus?». Vom Tank ist oben nichts zu sehen.
3. **Ganz unten gescrollt.** Gesehen: Karte «Tankbestand» mit langem Hilfetext, drei bisherigen Werten und einem Formular (Stichtag, Wert in Franken, Kategorie «Heizung», Knopf «Bestand speichern»). Erwartet hätte ich einen Titel wie «Heizöl im Tank». «Tankbestand» passt, aber ich dachte zuerst an Liter.
4. **Hilfetext gelesen.** Erwartet: kurz, was ich eintragen soll. Gesehen: Formel «Anfangsbestand + Einkauf − Endbestand», danach erst «den Wert im Tank oder Lager in Franken». Den Rechenweg verstehe ich. Den Satz über die «Lieferung davor» erst beim zweiten Lesen.
5. **Formular angeschaut.** Die Beschriftungen stehen über den Feldern, die Felder sind gross. «Wert in Franken» mit «Beispiel: 2650.00» ist eindeutig. Beim Stichtag hat mich das Beispiel «31.12.2026» kurz irritiert.
6. **200 % Zoom.** Der Text ist gut lesbar. Der Hilfetext füllt den ganzen Bildschirm, und ich muss scrollen, um zum Formular zu kommen.
7. **Wohnung 1.01.** Erwartet: was der Mieter im Monat zahlt. Gesehen: Karte «Monatliche Miete» mit Nettomiete 1’450, Akonto 240, Zusatzmiete 100, darunter fett «Monatlich total CHF 1’790.00». Klar: das ist die Summe.
8. **Mieter Hans Müller** (über das Menü und «Mieter»). Gesehen: «Aktuelle Miete» mit Wohnung 1.01, «Monatlich total CHF 1’790.00» und Vertragsbeginn. Erwartet hätte ich hier dieselbe Aufschlüsselung oder wenigstens «inkl. Nebenkosten». Ohne die Wohnungsseite wüsste ich nicht, was im Total steckt.

## Verwirrung

- «Tankbestand»: Liter oder Franken? (P-1)
- «Ster»: unbekannt.
- «Abrechnungsperiode», «Anfangsbestand», «Endbestand»: nur über das Beispiel verständlich.
- «Akonto», «Zusatzmiete»: nicht erklärt. (P-5)
- «Monatlich total» auf der Mieterseite: total von was? (P-4)
- «Stichtag» mit Beispiel 31.12.2026: welches Jahr ist gemeint? (P-3)

## Fehlerrisiken

- Ich trage die Liter statt des Frankenbetrags ein, zum Beispiel «1800» für 1800 Liter. Das sieht genauso aus wie ein Frankenbetrag und würde vermutlich angenommen (nicht gespeichert, also nicht geprüft).
- Ich erfasse den Wert mit dem Ablesedatum im Januar statt per 31.12. Der Hilfetext warnt davor, aber erst im letzten Satz.
- Ich lese «Monatlich total» auf der Mieterseite als Nettomiete und rechne die Nebenkosten ein zweites Mal dazu.

## Vorschläge

- **P-1:** Gebäude Musterhaus Zentrum öffnen und ganz nach unten scrollen. Titel lesen. Hilfreich wäre, den Franken gleich im ersten Satz unter dem Titel zu nennen, etwa «Tragen Sie am 31.12. ein, wie viel das Heizmaterial im Tank oder Lager in Franken wert ist, nicht die Menge.» Der Titel selbst kann bleiben.
- **P-2:** Gleicher Ort. Hilfreich wäre, den Text in kurze Absätze zu teilen: (1) für wen, (2) was eintragen und wann, (3) wie berechnen, (4) Sonderfall mehrere Lieferungen. Die Formel könnte ans Ende.
- **P-3:** Gleicher Ort, Feld «Stichtag». Hilfreich wäre ein Beispiel mit dem Ende der Periode, die gerade abzurechnen ist (hier 31.12.2025), oder ohne Jahr: «zum Beispiel der 31.12. des abgerechneten Jahres».
- **P-4:** Menü, «Mieter», Hans Müller öffnen, Karte «Aktuelle Miete» ansehen. Hilfreich wäre dieselbe Aufschlüsselung wie auf der Wohnungsseite (Nettomiete, Akonto, Zusatzmiete) oder ein kurzer Hilfetext «Nettomiete, Akonto und Zusatzmiete zusammen».
- **P-5:** Wohnung 1.01 öffnen, Karte «Monatliche Miete» ansehen. Hilfreich wäre ein kurzer sichtbarer Satz zu «Akonto» (Vorauszahlung für Nebenkosten, wird mit der Abrechnung verrechnet) und zu «Zusatzmiete».

## Nicht geprüft

- Speichern eines Tankbestands, Fehlermeldungen des Formulars und «Löschen»: Die Aufgabe war nur anschauen, und das Gebäude gehört nicht mir.
- Der Datumswähler hinter dem Kalendersymbol: nicht geöffnet.
- Ein Gebäude ohne bisherige Tankwerte (leere Liste): Ich habe nur Musterhaus Zentrum angesehen.
- Andere Sprachen und das Handy.
