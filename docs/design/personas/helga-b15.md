# Persona-Lauf Helga – Slice b15 (Mietvertrag bearbeiten: Mieter und Wohnung fest, #152)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: http://localhost:3300 mit Demodaten (`dwello_persona`), Datum des Laufs 13.10.2026.

Aufgabe: «Frau Keller zieht in eine andere Wohnung im gleichen Haus. Bilden Sie das in Dwello ab.»

## Aufgabe geschafft: teilweise

Das alte Mietverhältnis habe ich beendet (Wohnung EG, Alpenblick, Vertragsende 31.12.2026). Den neuen Mietvertrag für Wohnung OG2 habe ich im Assistenten bis Schritt 3 erfasst. Dann war die App nicht mehr erreichbar (`ERR_CONNECTION_REFUSED` auf :3300, über 5 Minuten lang; das Backend auf :3301 antwortete noch). Den Assistenten neu starten durfte ich nicht. Gespeichert ist der neue Mietvertrag deshalb **nicht**. Bis dorthin hat mich Dwello aber auf den richtigen Weg geführt.

Hinweis an den Auftraggeber: Der vorgeschlagene Mietvertrag `b0000001-…-0002` (Wohnung 1.02) gehört Anna Schmidt, nicht Frau Keller. Ich habe den Mietvertrag von Laura Keller genommen (`b0000003-0003-0003-0003-000000000001`, Wohnung EG, Alpenblick). Im gleichen Gebäude ist Wohnung OG2 leer.

Zustand der Datenbank nach meinem Lauf: Der Mietvertrag von Laura Keller ist auf den 31.12.2026 gekündigt. Ein neuer Mietvertrag wurde nicht angelegt.

## Aufwand

- Etwa 15 Minuten, ohne die Wartezeit auf die App.
- 14 Schritte: Liste, Mietvertrag, Bearbeiten, Klick auf die Wohnung, «Befristet», Link «Kündigung mit «Beenden» eintragen», Beenden, Datum, Bestätigen, Gebäude angesehen, Mietvertrag erfassen, Mieter, Wohnung, Vertragsbeginn (abgebrochen).

## Ablauf: erwartet und gesehen

1. **Mietverträge-Liste.** Ich erwartete, Frau Keller zu finden. Das klappte: Der Eintrag «Laura Keller – Wohnung EG · Alpenblick, Laufend seit 01.11.2022» ist gut lesbar.
2. **Mietvertrag von Laura Keller → «Bearbeiten».** Ich erwartete eine Auswahl für die Wohnung. Ich sah die Seite «Mietvertrag bearbeiten». Gleich unter dem Titel steht: «Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags.» Da dachte ich: gut, hier geht es.
3. **Wohnung ändern versucht.** Im Kasten «Mieter und Wohnung» stehen «Mieter: Laura Keller» und «Wohnung: Wohnung EG - Alpenblick» als normaler Text. Ich klickte auf den Wohnungsnamen, und es passierte nichts. Darunter steht: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung geben Sie diesem Mietvertrag ein Vertragsende und erfassen einen neuen. Haben Sie Mieter oder Wohnung falsch erfasst und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn und erfassen ihn neu.» Diesen Text verstehe ich. Er widerspricht aber dem Satz oben, der mir gerade gesagt hat, ich könne Mieter und Wohnung ändern. Und er sagt mir nicht, **wo** ich das Vertragsende eintrage. Es gibt keinen Link und keinen Knopf.
4. **«Ein Vertragsende geben»: hier auf der Seite gesucht.** Weiter unten steht «Vertragsdauer» mit «Unbefristet» und «Befristet». Bei «Befristet» steht «Der Mietvertrag endet an einem festen Tag». Das klang für mich nach Vertragsende, also wählte ich «Befristet». Es erschien ein Feld «Vertragsende» und darunter: «Hat der Mieter gekündigt? Dann tragen Sie das Vertragsende auf der Seite des Mietvertrags mit «Beenden» ein. So bleibt er unbefristet, und Dwello nennt die nächsten Schritte.» Dazu kam der Link «Kündigung mit «Beenden» eintragen». Dieser Hinweis hat mich gerettet. Frau Keller hat aber nicht im eigentlichen Sinn «gekündigt», sie zieht ja nur um. Ich habe kurz gezögert, ob das für mich gilt.
5. **Link «Kündigung mit «Beenden» eintragen».** Ich kam auf die Seite des Mietvertrags zurück. Oben sind die Knöpfe «Bearbeiten», «Beenden» und «Löschen». Den Knopf «Beenden» hatte ich beim ersten Besuch übersehen, weil ich nur «Bearbeiten» gesucht hatte.
6. **«Beenden».** Ein Dialog öffnete sich: «Mietvertrag von Laura Keller, Wohnung EG, beenden?» Darin ist das Feld «Vertragsende» mit gutem Hilfetext («Der letzte Tag des Mietverhältnisses, also der Kündigungstermin …»). Darunter steht: «… Ein neuer Mietvertrag kann am Tag danach beginnen.» Dieser letzte Satz hat mir sehr geholfen. Ich tippte 31.12.2026 ein und sah darunter «Donnerstag, 31. Dezember 2026». Das ist beruhigend.
7. **«Mietvertrag beenden».** Ich erwartete eine Bestätigung. Neu erschien der Kasten «Nächste Schritte»: «Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters, sobald er unterschrieben ist. Für die Schlussabrechnung braucht es die neue Adresse des Mieters.» Dazu die Links «Nachmieter erfassen» und «Neue Adresse eintragen». Bei Vertragsende steht jetzt «Unbefristet, gekündigt auf den 31.12.2026». Diese Schritte passen zu einem Mieterwechsel, nicht zu meinem Fall. Ich brauche keinen Nachmieter für die EG, sondern einen neuen Mietvertrag für Frau Keller in OG2. Und eine «neue Adresse» hat sie nicht wirklich, es ist dasselbe Haus. Ich wusste nicht, ob ich da etwas eintragen muss.
8. **Auffällig nach dem Beenden:** Die Nettomiete auf der Seite stand vorher bei CHF 1’350.00 und jetzt bei CHF 1’380.00, «Monatlich total» bei CHF 1’620.00 statt 1’590.00. Ich habe an der Miete nichts geändert, und das Bearbeiten-Formular hatte ich nicht gespeichert. Das hat mich erschreckt. Die Ursache kann ich nicht beurteilen. Vielleicht zeigt die Seite jetzt eine spätere Mietanpassung an, gesagt wird das aber nirgends.
9. **Freie Wohnung gesucht.** Unter Gebäude → Alpenblick steht: EG vermietet, OG1 vermietet, OG2 «Leer». Das ist klar.
10. **Mietverträge → «Mietvertrag erfassen».** Es öffnete sich der Assistent «Neuer Mietvertrag» mit 5 Schritten. In Schritt 1 wählte ich «Laura Keller, Interlaken».
11. **Schritt 2, Wohnung.** Die Liste zeigt «Wohnung EG - Alpenblick … (verfügbar ab 01.01.2027)» und «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²». Vermietete Wohnungen stehen als «(nicht verfügbar)» darin. Ich wählte OG2. Das war gut verständlich.
12. **Schritt 3, Vertragsdauer.** Ich sah das Feld «Vertragsbeginn» und «Unbefristet» (schon gewählt). Unten stand «Entwurf gespeichert, 23:24». Ich wollte 01.01.2027 eintragen.
13. **Abbruch:** Beim nächsten Versuch war die App nicht mehr erreichbar (siehe oben). Schritt 4 (Miete), Schritt 5 (Prüfen) und das Speichern konnte ich nicht ausführen.

## Verwirrung, auch unklare Begriffe

- **Einleitung widerspricht dem Hilfetext.** Oben steht «Ändern Sie Mieter, Wohnung, …», im Kasten darunter «Mieter und Wohnung lassen sich nicht ändern».
- **«geben Sie diesem Mietvertrag ein Vertragsende»:** Ich wusste nicht, wo ich das mache. Auf derselben Seite gibt es «Befristet» mit einem Feld «Vertragsende», und das schien die Antwort zu sein. Dass «Beenden» auf einer anderen Seite gemeint ist, erfährt man erst, wenn man den falschen Weg («Befristet») schon eingeschlagen hat.
- **«Hat der Mieter gekündigt?»:** Bei einem Umzug im Haus fühlt sich das nicht nach «Kündigung» an. Ich war unsicher, ob ich etwas Falsches mache.
- **«Nachmieter»** und **«Neue Adresse eintragen»** nach dem Beenden passen nicht zu einem Wohnungswechsel derselben Mieterin.
- **Miete nach dem Beenden geändert** (1’350 → 1’380), ohne dass erklärt wird, warum.
- **«Entwurf gespeichert»:** Wo ist dieser Entwurf? Finde ich ihn wieder, wenn ich später zurückkomme? (In einem neuen Browserfenster begann der Assistent wieder leer bei Schritt 1.)

## Fehlerrisiken

- **«Befristet» als Weg zum Vertragsende.** Wer den Hinweis unter «Befristet» überliest und speichert, macht aus einem unbefristeten Mietvertrag einen befristeten. Das ist rechtlich etwas anderes als eine Kündigung. Den Hinweis sieht man erst, nachdem man «Befristet» schon gewählt hat.
- **Einleitung «Ändern Sie Mieter, Wohnung …»** kann dazu führen, dass jemand lange nach einem Auswahlfeld sucht oder glaubt, Dwello sei kaputt.
- **«Löschen» statt Beenden.** Der Hilfetext erwähnt Löschen für falsch erfasste Mietverträge. Wer nur halb liest, löscht vielleicht einen laufenden Mietvertrag. Ob «Löschen» bei einem laufenden Mietvertrag gesperrt ist oder warnt, habe ich nicht ausprobiert.
- **Nachmieter-Link nach dem Beenden.** «Nachmieter erfassen» füllt die alte Wohnung EG vor. Wer dem Link folgt, legt Frau Keller womöglich wieder in der EG an statt in OG2.

## Vorschläge

| ID | Schwere | Bildschirm | Vorschlag | Reproduktion / Beleg |
|---|---|---|---|---|
| H15-1 | **Major** | Mietvertrag bearbeiten (`/contracts/{id}/edit`) | Einleitung anpassen, etwa «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.». Sie widerspricht dem neuen Hilfetext. | Mietvertrag Laura Keller → «Bearbeiten». Oben steht «Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags.», im Kasten «Mieter und Wohnung» dagegen «Mieter und Wohnung lassen sich nicht ändern.» |
| H15-2 | **Major** | Mietvertrag bearbeiten, Kasten «Mieter und Wohnung» | Den Hilfetext mit dem nächsten Schritt verbinden: ein Link «Vertragsende mit «Beenden» eintragen» zur Seite des Mietvertrags (wie unter «Befristet»), und danach «Mietvertrag erfassen». Ohne Link sucht man das Vertragsende auf derselben Seite und landet bei «Befristet». | «Bearbeiten» → Text «… geben Sie diesem Mietvertrag ein Vertragsende und erfassen einen neuen.» Es gibt keinen Link. Das einzige Feld «Vertragsende» auf der Seite erscheint erst bei «Befristet». |
| H15-3 | Minor | Mietvertrag bearbeiten, Hinweis unter «Befristet» | Den Hinweis auch für den Wohnungswechsel formulieren, etwa «Endet der Mietvertrag, weil der Mieter auszieht oder in eine andere Wohnung wechselt?». | «Befristet» wählen → «Hat der Mieter gekündigt? Dann tragen Sie das Vertragsende … mit «Beenden» ein.» Bei einem Umzug im Haus fühlt man sich davon nicht sicher angesprochen. |
| H15-4 | Minor | Mietvertrag-Detail nach «Beenden», Kasten «Nächste Schritte» | Auch den Wechsel derselben Mieterin vorsehen, etwa mit einem Link «Neuen Mietvertrag für Laura Keller erfassen» (Mieter vorausgefüllt, Wohnung offen). Die Adresse als «falls sie auszieht» kennzeichnen. | Beenden mit 31.12.2026 → «Erfassen Sie den Mietvertrag des Nachmieters …», «Nachmieter erfassen» (füllt Wohnung EG vor) und «Neue Adresse eintragen». Das passt nicht zum Umzug im Haus. |
| H15-5 | Minor | Mietvertrag-Detail | Klar zeigen, auf welchen Tag die angezeigte Miete gilt, oder die heutige Miete zeigen. Unerklärte Betragswechsel verunsichern. | Detail Laura Keller vor dem Beenden: Nettomiete CHF 1’350.00, Monatlich total CHF 1’590.00. Nach «Mietvertrag beenden» (31.12.2026): CHF 1’380.00 / CHF 1’620.00, ohne dass ich die Miete bearbeitet habe. Die Ursache habe ich nicht geprüft; Fall für `daten-pruefer` / `code-reviewer`. |
| H15-6 | Nit | Mietvertrag bearbeiten | Den Wohnungsnamen gleich schreiben wie anderswo. Hier steht «Wohnung EG - Alpenblick» mit Bindestrich, auf der Detailseite «Wohnung EG · Alpenblick». | Bearbeiten-Seite gegen Detailseite vergleichen. |

## Nicht geprüft

- **Speichern des neuen Mietvertrags (OG2, ab 01.01.2027), Schritte 4 und 5 des Assistenten:** Die App auf :3300 war ab etwa 23:25 nicht mehr erreichbar (`net::ERR_CONNECTION_REFUSED`, über 5 Minuten gewartet). Neu starten durfte ich sie nicht. Deshalb ist offen, ob Dwello die Überschneidung prüft und ob Frau Keller danach mit zwei Mietverträgen (EG bis 31.12.2026, OG2 ab 01.01.2027) richtig angezeigt wird.
- Der Fall «falsch erfasst und noch nicht begonnen → löschen»: Ich habe keinen künftigen Mietvertrag gelöscht.
- Ob «Löschen» bei einem laufenden Mietvertrag gesperrt ist oder warnt.
- Die Ansicht bei 200 % Zoom.
- Ob der «Entwurf gespeichert» später im selben Browser wieder angeboten wird.
