# Marco – Rechnungen hochladen, Gutschrift und Teilrechnung, Löschen einer abgerechneten Rechnung (Runde 245)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Gebäude: «Alpenblick» (gespeichert nur dort). App: Persona-Stack auf http://localhost:3300, Demo-Daten, KI-Stand-in.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/marco-245/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Rechnungen hochladen», Ergebnis nach «2 Rechnungen erstellen» | Das Ergebnis sagt nur «2 Rechnungen erstellt» und listet zwei Links. Dass ich zum Lift noch den nicht umlagefähigen Rest als zweite Rechnung (Kategorie Reparaturen, mit «Beleg hinzufügen») erfassen muss, steht nirgends mehr: Der Hinweis dazu stand in der Zeile, und die Zeile ist nach dem Erstellen weg. Das «danach» aus dem Hinweis kommt genau dann, wenn der Hinweis schon verschwunden ist. |
| P-2 | Minor | Bestätigung «Hochladen abbrechen?» | Sie sagt nur «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» Dass die übrige Datei eine Gutschrift ist, die ich noch von einer Rechnung abziehen muss, und dass beim Lift noch ein Rest fehlt, steht nicht da. Der rote Knopf «Übrige Dateien verwerfen» steht oben, also dort, wo mein Daumen zuerst hinkommt. |
| P-3 | Minor | Bestätigung «Rechnung löschen» (abgerechnete Rechnung), Handy | Der Dialog geht so auf, dass er ganz nach unten gescrollt ist (der Fokus liegt auf «Abbrechen», der Inhalt ist ca. 1230 px hoch, sichtbar sind 812 px). Ich sehe zuerst das Ende eines langen Absatzes und den roten Knopf. Titel, Betrag, «Das lässt sich nicht rückgängig machen» und «Rechnung schon abgerechnet» sind oberhalb und erst nach dem Hochwischen zu sehen. |
| P-4 | Minor | Bestätigung «Rechnung löschen» | Der Teil zu den Abrechnungen ist ein Absatz mit rund 90 Wörtern, der für alle Fälle passt: Er spricht von Akontorechnungen, Schlussrechnungen und von «Die Entwürfe enthalten diese Rechnung weiter … «Neu berechnen»». Beide Abrechnungen dieser Rechnung sind aber «Bezahlt», es gibt keinen Entwurf. Für mich gilt nur ein Satz («Versendete oder bezahlte Abrechnungen berichtigen Sie mit «Abrechnung berichtigen»»), und den muss ich mitten im Absatz suchen. Die Abrechnungen stehen nur als Nummer da (NK-33333333-2024-0002, Bezahlt), ohne Mieter und nicht als Link, obwohl sie auf der Rechnungsseite Links sind. |
| P-5 | Nit | Zeile «Lift Service und Reparatur.pdf» | Nachdem ich den Betrag geändert und «Lift» gewählt habe, steht immer noch «Das Häkchen … fehlt, weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.» Ob ich jetzt fertig «aufgeteilt» habe, sagt mir die Zeile nicht. Ich setze das Häkchen auf gut Glück. |

## Beobachtungen

- Statuszeile «Fertig: 3 von 3. Bitte prüfen: 3.» ist kurz und klar. «Fertig» und «Bitte prüfen» zusammen lesen sich zuerst aber widersprüchlich: Fertig womit? Gemeint ist «fertig gelesen».
- Auf dem Handy sehe ich nach der Dateiauswahl nur die Statuszeile ganz unten am Bildschirmrand (Screenshot 03-read: oben die zwei Einleitungsabsätze, das Gebäude, das Ablagefeld, unten knapp die Statuszeile). Die Zeilen mit den Hinweisen liegen alle darunter, ich muss wischen. Weil die Statuszeile «Bitte prüfen: 3» sagt, habe ich weitergewischt.
- Die Hinweisboxen (beige mit Warnsymbol und Titel «Hinweise zu …») sind gut lesbar und der Text bricht sauber um, kein seitliches Scrollen (scrollWidth 390).
- Der Satz bei der Gutschrift ist verständlich: keine Rechnung daraus machen, die zugehörige Rechnung kürzen. Zu welcher Rechnung «Werke Gutschrift» gehört, weiss ich aber nicht: Elektro Blitz ist ein anderer Rechnungssteller. Deshalb habe ich sie nicht verrechnet. (Der Stand-in liefert für alle Dateien die gleichen Werte: CHF 1'250.00, «Allgemeinstrom Q1», R-1001.)
- Lift: Der Hinweis sagt, ich soll nur den umlagefähigen Betrag eintragen. Wie viel das ist, sehe ich nur auf dem Original. Meine Test-PDF ist leer, darum habe ich CHF 800.00 angenommen. Das liegt am Stand-in, nicht an Dwello.
- Die Zeile zur Gutschrift bleibt nach dem Erstellen stehen, und der Hinweis spricht weiter von «in der Zeile dieser Rechnung, wenn ihre Datei hier ausgewählt ist»: Diese Zeilen sind jetzt weg, für mich gilt nur noch «auf ihrer Seite mit «Rechnung bearbeiten»».
- Auf der Seite der erstellten Lift-Rechnung steht unter «Beleg» ein Hinweis: «Der Beleg enthält auch Kosten, die nicht umlagefähig sind … der Rest als eigene Rechnung in einer nicht umlagefähigen Kategorie erfasst ist.» Gut. Den finde ich aber nur, wenn ich den Link im Ergebnis antippe (siehe P-1).
- Beim Lift blieb der Verteilschlüssel leer, die Seite sagt dann «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt». Bei Elektro Blitz hat die KI «Pro Fläche (m²)» gesetzt. Das wurde nicht geändert, es ist mir nur aufgefallen.
- «Abbrechen» des Löschdialogs schliesst ihn sauber, die Rechnung bleibt.
- In der Rechnungsliste sehe ich nicht, welche Rechnung schon in Abrechnungen steckt. Ich musste eine öffnen (BKW Energie AG, Allgemeinstrom H2 2024) und unter «In Abrechnungen enthalten» nachsehen.

## Aufgabe geschafft: ja

Zwei Rechnungen in «Alpenblick» erstellt: «Elektro Blitz, 31.03.2026» (CHF 1'250.00, Allgemeinstrom) und «Lift Service und Reparatur, 31.03.2026» (CHF 800.00, Lift, Beschreibung «Lift-Wartung Q1»). Die Gutschrift habe ich nicht erstellt. Dialog abgebrochen und die Bestätigung gelesen. Den Löschdialog der abgerechneten Rechnung BKW Energie AG (CHF 191.20) gelesen und mit «Abbrechen» geschlossen, nichts gelöscht.

## Aufwand

Geschätzt 7–8 Minuten als Marco, rund 22 Taps und Wischbewegungen: Übersicht → «Rechnungen hochladen» → Gebäude → «Dateien auswählen» → 3 Dateien → etwa 6 Mal wischen zum Lesen → Lift «Angaben prüfen» → Betrag, Kategorie, Beschreibung → Häkchen → «2 Rechnungen erstellen» → Ergebnis lesen → «Abbrechen» → Bestätigung lesen. Dann Rechnungen filtern (Alpenblick, 2024) → «Suchen» → Rechnung öffnen → ganz nach unten → «Rechnung löschen» → hochwischen zum Lesen → «Abbrechen».

## Ablauf

1. **Übersicht, «Rechnungen hochladen».** Erwartet: ein Knopf zum Hochladen. Gesehen: unter «Häufige Arbeiten» als Link, ich musste etwas scrollen. Er öffnet die Rechnungsseite mit dem Dialog.
2. **Gebäude wählen.** Erwartet: Auswahl vor den Dateien. Gesehen: «Wählen Sie zuerst das Gebäude.», das Ablagefeld ist bis dahin gesperrt. Nach der Wahl steht da: «PDF, JPG oder PNG … Ausgewählte Dateien liest die KI sofort aus.» Klar.
3. **Drei Dateien auswählen.** Erwartet: Fortschritt. Gesehen: nach kurzer Zeit die Statuszeile «Fertig: 3 von 3. Bitte prüfen: 3.» Das Gebäude ist danach gesperrt, mit dem Satz «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.» Gut.
4. **Zeilen lesen.**
   - Elektro Blitz: «Prüfen Sie: Rechnungsdatum.», «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.», Häkchen gesetzt. Unter «Angaben prüfen»: Datum 31.03.2026 mit «Die KI ist unsicher», Kategorie Allgemeinstrom. Ich habe es so gelassen.
   - Werke Gutschrift: «Das ist eine Gutschrift über CHF 1’250.00. Erstellen Sie daraus keine Rechnung …», ohne Häkchen. Darunter: «Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil aus einer Gutschrift keine Rechnung entsteht. Ist die Datei doch eine Rechnung, setzen Sie es.» Verstanden, ich habe es so gelassen.
   - Lift Service und Reparatur: Hinweis zu den nicht umlagefähigen Kosten, «Wählen Sie eine Kategorie.», ohne Häkchen. Darunter: «Das Häkchen … fehlt, weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.»
5. **Lift bearbeiten.** Erwartet: Betrag und Kategorie eintragen, dann Häkchen. Gesehen: Betrag 1250.00 auf 800.00 geändert, Kategorie «Lift» gewählt, «Wählen Sie eine Kategorie.» verschwindet. Der Satz zum fehlenden Häkchen bleibt (P-5). Häkchen gesetzt, der Knopf heisst jetzt «2 Rechnungen erstellen».
6. **Erstellen.** Erwartet: Bestätigung und was noch offen ist. Gesehen: grüne Box «2 Rechnungen erstellt» mit zwei Links. Darunter bleibt nur die Gutschrift-Zeile, die Statuszeile heisst «Fertig: 1 von 1. Bitte prüfen: 1.», dazu «Wählen Sie mindestens eine Rechnung zum Erstellen.» und «0 Rechnungen erstellen» gesperrt. Zum Rest der Lift-Rechnung steht nichts (P-1).
7. **Abbrechen.** Erwartet: Rückfrage, weil noch eine Datei da ist. Gesehen: «Hochladen abbrechen?», «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.», Knöpfe «Übrige Dateien verwerfen» (rot, oben) und «Weiter prüfen». Beruhigend, dass die zwei Rechnungen bleiben. Kein Wort zur Gutschrift (P-2).
8. **Rechnung in Abrechnungen suchen.** Gefiltert nach Alpenblick und 2024, «BKW Energie AG Allgemeinstrom H2 2024» geöffnet. Unter «In Abrechnungen enthalten» zwei Links: NK-33333333-2024-0002 und -0001, beide «Bezahlt».
9. **Löschen starten.** Erwartet: Warnung, dass die Rechnung schon abgerechnet ist. Gesehen: Der Dialog geht unten auf, ich sehe zuerst den Schluss des Absatzes und den roten Knopf (P-3). Nach dem Hochwischen: «Die Rechnung von BKW Energie AG über CHF 191.20 wird gelöscht. Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein. Das lässt sich nicht rückgängig machen.» Dann die Box «Rechnung schon abgerechnet»: «Für die Abrechnungsperiode 01.01.2024 – 31.12.2024 gibt es schon Abrechnungen mit dieser Rechnung.» mit beiden Nummern, dann der lange Absatz (P-4). «Abbrechen» getippt, die Rechnung bleibt.

## Verwirrung

- «Betrag aufteilen»: Gemeint ist, nur den umlagefähigen Teil einzutragen und den Rest später separat zu erfassen. Das Wort «aufteilen» klingt, als ob Dwello das für mich macht.
- «umlagefähig» verstehe ich ungefähr: was die Mieter zahlen.
- «Akontorechnungen» und «Schlussrechnung» im Löschdialog: Was hat das mit meiner Stromrechnung zu tun?
- «Entwürfe … Neu berechnen»: Habe ich Entwürfe? Hier nicht, der Text sagt es trotzdem.
- «NK-33333333-2024-0002»: Welche Mieter sind das?

## Fehlerrisiken

- Ich vergesse den nicht umlagefähigen Rest der Lift-Rechnung, weil das Ergebnis ihn nicht nennt (P-1).
- Ich tippe beim Abbrechen auf den roten Knopf oben und die Gutschrift ist weg, ohne dass ich die zugehörige Rechnung gekürzt habe (P-2).
- Im Löschdialog sehe ich auf dem Handy zuerst den roten Knopf, aber nicht, dass die Rechnung schon in bezahlten Abrechnungen steckt (P-3).
- Den einen Satz, der für bezahlte Abrechnungen gilt («Abrechnung berichtigen»), überlese ich im langen Absatz (P-4).

## Vorschläge

- **P-1:** Übersicht → «Rechnungen hochladen» → Alpenblick → drei Dateien → beim Lift Betrag ändern, Kategorie «Lift», Häkchen → «2 Rechnungen erstellen». Hilfreich: In der Ergebnisbox beim Lift-Eintrag einen Satz «Noch offen: den nicht umlagefähigen Rest als zweite Rechnung in der Kategorie Reparaturen erfassen und diese Datei anfügen», am besten mit dem Link «Rechnung erfassen».
- **P-2:** Wie P-1, dann «Abbrechen». Hilfreich: In der Rückfrage die übrigen Dateien mit Namen nennen und bei einer Gutschrift sagen, dass ihr Betrag noch von der zugehörigen Rechnung abzuziehen ist. Den sicheren Knopf «Weiter prüfen» oben oder gleich gross wie den roten.
- **P-3:** Rechnung «BKW Energie AG, Allgemeinstrom H2 2024» (Alpenblick) öffnen → «Rechnung löschen» auf 390 px. Hilfreich: den Dialog oben geöffnet lassen (Titel und Folge sichtbar), auch wenn der Fokus auf «Abbrechen» liegt, oder die Knöpfe unten fest anzeigen und den Inhalt oben beginnen lassen.
- **P-4:** Wie P-3. Hilfreich: nur die Sätze zeigen, die zum Status der betroffenen Abrechnungen passen (hier nur bezahlt: «berichtigen»), und Akonto und Schlussrechnung nur bei so einer Rechnung. Die Abrechnungen mit Mieter nennen und als Link wie auf der Rechnungsseite.
- **P-5:** Wie P-1, beim Lift Betrag und Kategorie setzen, das Häkchen noch nicht. Hilfreich: Den Satz so fassen, dass er sagt, was zu tun ist: «Tragen Sie den umlagefähigen Betrag ein und setzen Sie dann das Häkchen.»

## Nicht geprüft

- Die Gutschrift habe ich nicht verrechnet: Ich wusste nicht, zu welcher Rechnung sie gehört.
- Den Rest der Lift-Rechnung habe ich nicht als zweite Rechnung erfasst: nicht Teil der Aufgabe.
- Löschen bestätigt habe ich nicht, wie verlangt. Was danach mit den bezahlten Abrechnungen passiert, habe ich daher nicht gesehen.
- Mit «Weiter prüfen» bin ich nicht zum Dialog zurück. Ziehen und Ablegen der Dateien gibt es auf dem Handy nicht. Dunkelmodus und andere Sprachen habe ich nicht angesehen.
- Echte PDF-Inhalte: Der Stand-in liest nur den Dateinamen, die Werte sind fest.
