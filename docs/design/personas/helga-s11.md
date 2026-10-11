<!-- Persona run session 11 (steps A–D) on 7890141; screenshots stayed in the session's scratchpad, not in the repository -->

# Persona-Bericht: Helga, 68 (Desktop, Zoom 200 %)

**Aufgabe:** Neuen Mieter «Rosa Brunner» erfassen (Postadresse, Korrespondenz per Brief) und Mietvertrag für eine freie Wohnung ab 1. des übernächsten Monats erstellen.

**Ergebnis:** geschafft (ja). Mieter Rosa Brunner, Lindenweg 5, 3600 Thun, per Brief; Mietvertrag Wohnung B1, Seepark Residenz, ab 01.12.2026, unbefristet, Nettomiete CHF 1'450.00, Akonto CHF 180.50 (total CHF 1'630.50).

**Aufwand:** ca. 8–10 Minuten für Helga, rund 25 Klicks und Eingaben, 2 Fehlermeldungen (beide selbst verursacht, beide behebbar).

## Laut gedacht, Schritt für Schritt

1. **Übersicht** (`01-start.png`): Ganz oben steht gross «Nebenkostenabrechnungen erstellen» mit einem dunklen Knopf. Ich erschrecke kurz: muss ich das zuerst machen? Weiter unten finde ich unter «Häufige Arbeiten» den Knopf «Mieter erfassen». Gut, den nehme ich.
2. **Neuer Mieter** (`02-mieter-formular.png`): Die Schrift ist bei 200 % schön gross, die Beispiele über den Feldern helfen mir. «Korrespondenzkanal» ist ein komisches Wort, aber der Satz darunter («Wie der Mieter Post erhält …») erklärt es. «Per Brief» ist schon gewählt, gut. Bei «Sprache» frage ich mich, warum Rätoromanisch dort steht, wenn es doch auf Deutsch kommt – verwirrt mich, stört aber nicht.
3. Ich habe den Ort vergessen und auf «Mieter erfassen» gedrückt (`03-ohne-ort.png`). Meldung «Für Briefe ist ein Ort erforderlich» direkt beim Feld, rot umrandet, alles Getippte blieb stehen. Sehr gut. Aber: «PLZ (optional)»? Ein Brief ohne Postleitzahl kommt doch nicht an. Da war ich unsicher, ob ich die PLZ überhaupt eintragen soll.
4. **Gespeichert** (`04-mieter-gespeichert.png`): «Rosa Brunner gespeichert» und gleich der grosse Knopf «Mietvertrag erfassen». Genau das wollte ich als Nächstes – sehr hilfreich. Die grüne Meldung liegt allerdings über den Kontaktdaten und verdeckt kurz einen Teil der Karte.
5. **Mietvertrag Schritt 1 – Mieter** (`05-vertrag-schritt1.png`): Rosa Brunner ist schon gewählt. Beruhigend. «Schritt 1 von 5» sagt mir, wie lange es dauert. Die Meldung «Rosa Brunner gespeichert» ist hier immer noch zu sehen – ich habe kurz gedacht, ich hätte schon etwas gespeichert.
   In der Liste gibt es auch «Nina Brunner». Hätte ich selbst wählen müssen, hätte ich leicht die falsche Brunner erwischt (keine Adresse oder Wohnung zur Unterscheidung in der Liste).
6. **Schritt 2 – Wohnung** (`06-vertrag-schritt2.png`): Freie Wohnungen oben, vergebene sind grau mit «nicht verfügbar». Verständlich. Was «OG2», «B1», «3.5 Zimmer» bedeutet, weiss ich als Erbin ungefähr. Ich wähle B1 in der Seepark Residenz.
7. **Schritt 3 – Vertragsdauer / Datum** (`07-vertrag-schritt3.png`):
   - Ich tippe «1.12.26», wie ich es auf Formularen gewohnt bin. Während ich tippe, passiert nichts (`08-datum-getippt.png`). Erst wenn ich das Feld verlasse, wird daraus «01.12.2026» und darunter erscheint fett **«Dienstag, 1. Dezember 2026»** (`09-datum-nach-tab.png`). Das gefällt mir sehr: so sehe ich sicher, dass es der richtige Monat ist.
   - Auch «01122026» und «1.12.2026» werden richtig verstanden.
   - Ich habe aus Gewohnheit zuerst nur «1.12» getippt (ohne Jahr). Das Feld macht daraus «1.12.» und sagt in Rot **«Dieses Datum gibt es nicht»** (`10b-datum-ohne-jahr.png`). Da bin ich erschrocken: den 1. Dezember gibt es doch! Es fehlt nur das Jahr. Gleiche Meldung bei «1. Dezember 2026» und «1/12/2026».
   - «31.11.2026» → «Dieses Datum gibt es nicht» – hier stimmt die Meldung (`10-datum-ungueltig.png`).
   - Das Beispiel im Hilfetext ist «31.12.2025» – für einen *Vertragsbeginn* ein seltsames Beispiel (Silvester, Vergangenheit). Ein Mietbeginn ist meist der 1. eines Monats.
   - Der Kalender-Knopf öffnet die Datumsauswahl des Browsers; die konnte ich in meiner Umgebung nicht als Bild festhalten (technische Einschränkung des Testbrowsers, kein App-Fehler belegt).
   - «Unbefristet / Befristet» ist mit je einem Satz erklärt – gut verständlich, und Unbefristet ist schon gewählt.
8. **Schritt 4 – Miete** (`13-miete-getippt.png`): «Nettomiete» kenne ich nicht genau; der Text «Grundmiete ohne Nebenkosten» hilft. «Akonto» kannte ich nicht, aber «Monatlicher Vorschuss für Nebenkosten (Heizung, Wasser usw.)» erklärt es gut. «Zusatzmiete» mit Garage/Parkplatz ist klar.
   - Ich tippe die Miete so, wie ich Beträge schreibe: **«1'450.-»** und Akonto «180,50». Unten steht sofort «Monatlich total CHF 1'630.50» – also hat das Programm meine Zahlen offenbar verstanden. Dann drücke ich «Weiter» und bekomme trotzdem einen roten Fehler bei der Nettomiete: «Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450.» (`14-betrag-abgelehnt.png`). Das ist widersprüchlich: das Total hat es ja gerechnet. Im Feld steht jetzt «1450.-» – das Apostroph wurde entfernt, der Strich nicht. Ich musste raten, dass der Strich «.-» stört.
   - Das Komma bei «180,50» wurde dagegen richtig in «180.50» umgewandelt.
9. **Schritt 5 – Prüfen** (`15-vertrag-zusammenfassung.png`): Übersichtliche Tabelle mit «Ändern» je Zeile, Datum in Worten. Hier fühle ich mich sicher. «Entwurf gespeichert, 00:47» beruhigt mich, dass nichts verloren geht. Ich frage mich, wo das Mietzinsdepot (Kaution) hinkommt – wird nirgends erwähnt.
10. **Gespeichert** (`16-vertrag-gespeichert.png`): Ich lande in der Liste aller Mietverträge, Rosa Brunner steht zuoberst mit «Künftig ab 01.12.2026, unbefristet» und Meldung «Mietvertrag von Rosa Brunner gespeichert». Gut. Ich hätte aber eher erwartet, den fertigen Vertrag selbst zu sehen, und weiss nicht, was jetzt als Nächstes zu tun ist (z. B. Vertrag ausdrucken? Mieterin informieren?).

## Was half
- Beispiele und Erklärsätze direkt über jedem Feld (kein Mouse-over nötig).
- «Mietvertrag erfassen» direkt auf der neuen Mieterseite, Mieterin im Assistenten vorgewählt.
- Fortschritt «Schritt X von 5», «Zurück»-Knopf, «Entwurf gespeichert».
- Datum in Worten («Dienstag, 1. Dezember 2026») nach dem Tippen und in der Zusammenfassung.
- Kurzformen «1.12.26» und «01122026» werden verstanden.
- Fehlermeldung beim fehlenden Ort: klar, direkt beim Feld, nichts geht verloren.
- Laufendes Total bei der Miete.

## Unverständliche oder unsichere Begriffe
- **Korrespondenzkanal** (durch Hilfetext gerettet, Wort selbst sperrig – «Wie erhält der Mieter Post?» wäre einfacher als Beschriftung; Begriff aber laut Vorgabe nicht umbenennen, nur Hilfetext).
- **Akonto**, **Nettomiete** (Hilfetexte gut).
- **«Künftig»** in der Vertragsliste – verstanden, aber ungewohnt.
- **Rätoromanisch-Hinweis** bei Sprache – verwirrt mehr als er hilft.
- Abkürzungen **OG2, EG, B1** in der Wohnungsliste (für Helga meist verständlich).

## Fehlerrisiken
- Gleichnamige Mieter (Nina/Rosa Brunner) in der Mieter-Auswahl ohne Unterscheidungsmerkmal.
- Brief-Adresse ohne PLZ möglich – Abrechnung per Post käme womöglich nicht an.
- Irreführende Datumsmeldung kann dazu führen, dass Helga ein anderes (falsches) Datum versucht.

## Findings

| # | Schwere | Finding | Bild |
|---|---|---|---|
| 1 | **hoch** | Betrag «1'450.-» (übliche Schweizer Schreibweise) wird abgelehnt, obwohl das «Monatlich total» ihn bereits korrekt mitrechnet. Widersprüchliches Verhalten; Meldung sagt nicht, *was* falsch ist (der «.-»-Strich). | `14-betrag-abgelehnt.png` |
| 2 | **mittel** | Datum ohne Jahr («1.12») bzw. in Worten («1. Dezember 2026») ergibt «Dieses Datum gibt es nicht» – sachlich falsch und verunsichernd. Feld hängt bei «1.12» zudem selbstständig einen Punkt an. | `10b-datum-ohne-jahr.png` |
| 3 | **mittel** | PLZ ist bei Korrespondenz «Per Brief» optional, Ort aber Pflicht – für eine Postadresse ist die PLZ unverzichtbar. | `02-mieter-formular.png`, `03-ohne-ort.png` |
| 4 | **mittel** | Mieter-Auswahl im Vertragsassistenten zeigt nur Namen; ähnliche Namen (Nina/Rosa Brunner) verwechselbar. | `05-vertrag-schritt1.png` |
| 5 | **niedrig** | Hilfetext-Beispiel beim Vertragsbeginn «31.12.2025» passt nicht (Vergangenheit, Monatsende); besser «01.12.2026» bzw. 1. eines künftigen Monats. | `07-vertrag-schritt3.png` |
| 6 | **niedrig** | Datum in Worten erscheint erst nach Verlassen des Feldes, nicht beim Tippen. | `08-datum-getippt.png` |
| 7 | **niedrig** | Erfolgsmeldung «Rosa Brunner gespeichert» erscheint noch auf der nächsten Seite (Vertragsassistent) und überdeckt auf der Mieterseite Kontaktdaten. | `04-mieter-gespeichert.png`, `05-vertrag-schritt1.png` |
| 8 | **niedrig** | Nach dem Speichern landet man in der Vertragsliste statt beim neuen Vertrag; kein Hinweis auf nächsten Schritt. | `16-vertrag-gespeichert.png` |
| 9 | **niedrig** | Übersicht stellt «Nebenkostenabrechnungen erstellen» gross an den Anfang; für eine Neue wirkt das wie eine Pflicht vor allem anderen. | `01-start.png` |
| 10 | **niedrig** | Hinweis zu Rätoromanisch im Sprache-Feld irritiert. | `02-mieter-formular.png` |
| – | Hinweis | Mietzinsdepot/Kaution wird im Vertrag nicht erfragt – Helga sucht danach (fachlich prüfen, ob vorgesehen). | `15-vertrag-zusammenfassung.png` |

## Verbesserungsvorschläge
1. Beträge tolerant einlesen: «1'450.-», «1'450.–», «Fr. 1450», «1450,00» akzeptieren; Validierung und Total-Berechnung mit demselben Parser. Falls doch abgelehnt: konkret sagen «Bitte ohne ‹.-› eingeben».
2. Datumsfehler unterscheiden: fehlt das Jahr → «Bitte ergänzen Sie das Jahr, zum Beispiel 01.12.2026»; nicht erkanntes Format → «Bitte als TT.MM.JJJJ eingeben»; nur unmögliche Daten → «Dieses Datum gibt es nicht». Optional: fehlendes Jahr mit dem nächsten passenden Jahr vorschlagen. Keinen Punkt automatisch anhängen.
3. Datum in Worten bereits während des Tippens anzeigen, sobald das Datum eindeutig ist.
4. Beispiel beim Vertragsbeginn auf den 1. eines Monats ändern (z. B. «01.12.2026»).
5. PLZ bei «Per Brief» zur Pflicht machen (wie den Ort).
6. In der Mieter-Auswahl Adresse oder Ort ergänzen («Rosa Brunner, Thun»).
7. Erfolgsmeldung nicht auf die Folgeseite mitnehmen bzw. nicht über Inhalt legen.
8. Nach «Mietvertrag speichern» auf die Vertragsseite führen, mit Hinweis «Was jetzt?» (z. B. Akonto-Zahlungen, nächste Abrechnung).
