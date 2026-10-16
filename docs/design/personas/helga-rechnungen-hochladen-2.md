# Helga – Rechnungen hochladen, Runde 2

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, die Prüfung der Angaben auch bei 200 %, Maus.
Aufgabe: «Elektro Blitz AG.pdf» und «Gartenbau Gruen Foto.png» für «Musterhaus Zentrum» hochladen. Sehe ich in jeder Zeile, was ich prüfen muss? Die Angaben bei 200 % prüfen, wo nötig eine Kategorie wählen, die Rechnungen erstellen. Dann eine neue Rechnung öffnen: Rechnungsnummer, «Beleg anzeigen», Bereich «Beleg».
Bewertet werden nur die Punkte, auf die die Änderung antwortet (meine Befunde P-2, P-4, P-5, P-7, P-8, P-9, P-10 aus Runde 1). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-rechnungen-hochladen-2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog, Zeile «Gartenbau Gruen Foto.png» (zu Runde 1 P-2) | In der Zeile steht «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.». Die Kategorie war aber leer, und ohne Kategorie lässt sich die Rechnung nicht erstellen. Das sehe ich erst, wenn ich die Angaben aufklappe und bis zum Feld «Kategorie» scrolle. Gerade das Feld, das ich ausfüllen *muss*, nennt die Zeile nicht. |
| P-2 | Minor | Rechnung bearbeiten (zu Runde 1 P-4) | Die Rechnungsnummer steht jetzt auf der Rechnungsseite («Rechnungsnummer R-1001»). Unter «Rechnung bearbeiten» gibt es aber noch kein Feld dafür. Eine falsch gelesene Nummer kann ich weiterhin nicht korrigieren. |
| P-3 | Minor | Dialog bei 200 % Zoom (zu Runde 1 P-7) | Bei 200 % steht die Vorschau weiterhin über den Feldern, nicht daneben. Sie ist jetzt viel kleiner (etwa 640 × 384 Punkte statt einer ganzen Bildschirmhöhe). Auf dem Bildschirm ist aber trotzdem fast nur die Vorschau zu sehen. Sobald ich zur Rechnungsnummer scrolle, ist sie weg. Bei 150 % steht sie links neben den Feldern, das passt gut. Weiter unten (Betrag, Rechnungssteller) ist sie aber auch dort schon weggescrollt. |
| P-4 | Nit | Dialog, Zeilen (zu Runde 1 P-2) | «Prüfen Sie: … Fälligkeitsdatum» nennt ein Feld, das freiwillig ist und das die KI nur nicht gefunden hat. Das wirkt gleich dringend wie das unsichere Rechnungsdatum. Der Kastentitel «Zu dieser Datei» sagt mir nicht, worum es geht. |
| P-5 | Nit | Rechnungsseite, «Beleg anzeigen» (zu Runde 1 P-5) | Der Beleg öffnet sich jetzt in einem neuen Tab, das ist gut. Auf dem Knopf selbst sehe ich aber nicht, dass ein neuer Tab aufgeht (das steht nur im Namen für den Bildschirmleser). Ich könnte meinen, Dwello sei verschwunden. |
| P-6 | Nit | Rechnungsseite, Bereich «Beleg» (zu Runde 1 P-10) | Der doppelte Titel «Beleg» ist weg. «Datei des Belegs» mit Dateiauswahl und darunter «Beleg ersetzen» stehen aber weiter ohne Satz, der sagt: zuerst Datei wählen, dann auf «Beleg ersetzen» klicken. Ausprobiert: Das Auswählen allein ersetzt nichts. |

Erledigt aus Runde 1 (kein Befund mehr):

- **P-2 (Datum):** Jede Zeile zeigt jetzt einen Kasten mit den Feldern, die ich prüfen soll («Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.»). Beim Feld steht der Hinweis direkt darunter («Die KI ist unsicher. Bitte prüfen Sie den Wert.» bzw. «Die KI hat diesen Wert nicht gefunden. Füllen Sie ihn aus, wenn er auf der Rechnung steht.»). Gilt nur fürs Datum, siehe P-1 und P-4.
- **P-4 (Anzeige):** Die Rechnungsnummer steht auf der Rechnungsseite unter «Rechnung».
- **P-5:** «Beleg anzeigen» öffnet die Datei in einem neuen Tab. Das PNG wurde dort angezeigt. Der Browser bekommt die Datei mit Namen und Endung («Gartenbau Gruen Foto.png», «Elektro Blitz AG.pdf») und öffnet sie, statt sie herunterzuladen.
- **P-8:** Bei «Hauswart Q1 ohne KI.pdf» heisst der gelbe Kasten jetzt «Zu dieser Datei – Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.», kein doppeltes «Bitte prüfen» mehr.
- **P-9:** Unter «Gebäude» steht nach dem Hochladen: «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.» Jetzt weiss ich, was ich tun muss.
- **P-10 (Titel):** Der Bereich «Beleg» hat nur noch eine Überschrift.

## Beobachtungen

- Bei 200 % ragt der Inhalt des Dialogs unten ein paar Punkte über seinen Rand. Die Zeile «Dienstag, 31. März 2026» liegt dort über der Beschriftung «Gebäude (optional)» der Seite dahinter (Bildschirmfoto `05-pruefen-0-2-b.png`).
- In einem von fünf Durchgängen zeigte die Auswahl «Kategorie» drei Sekunden nach dem Aufklappen nur «Kategorie auswählen», ohne weitere Einträge. In den anderen Durchgängen war die Liste nach weniger als einer halben Sekunde voll. Ich konnte es nicht wiederholen.
- Was die KI liest, kommt vom Stand-in: Die Gartenbau-Rechnung bekam wieder «R-1001», CHF 1250.00, «Allgemeinstrom Q1» und als Rechnungssteller «Gartenbau Gruen Foto» (aus dem Dateinamen). Ich habe nur die Kategorie gewählt (Gartenpflege) und sonst nichts korrigiert. So steht sie jetzt in «Musterhaus Zentrum».
- Die Gartenbau-Rechnung zeigt auf der Rechnungsseite «Manuell kategorisiert», obwohl die übrigen Angaben von der KI stammen.
- Bei der Suche nach «Elektro Blitz» erschien zusätzlich eine Rechnung in «Alpenblick». Die habe ich nicht erstellt, also habe ich sie nicht angerührt.
- Die Dateiauswahl zeigt «Choose Files / No file chosen» auf Englisch. Das kommt vermutlich vom Testbrowser.
- Der Satz «Mieter dürfen sie einsehen» erschreckt mich weiterhin ein wenig (wie in Runde 1).
- Die Hilfe zum Leistungszeitraum ist noch immer sehr lang.

## Aufgabe geschafft: ja

Beide Rechnungen stehen in «Musterhaus Zentrum», mit Beleg und Rechnungsnummer. Bei Gartenbau musste ich die Kategorie selbst wählen.

## Aufwand

Etwa 12 Minuten, rund 15 Schritte: Dialog öffnen, Gebäude, 2 Dateien, 2× «Angaben prüfen» (bei 150 % und 200 %), Kategorie wählen, «2 Rechnungen erstellen», 2 Rechnungsseiten, 2× «Beleg anzeigen», 2× «Rechnung bearbeiten» angesehen.

## Ablauf

1. **Rechnungsliste → «Rechnungen hochladen».** Erwartet: derselbe Dialog wie letztes Mal. Gesehen: ja, dazu der Satz «Dwello speichert jede Datei als Beleg zu ihrer Rechnung.» Damit ist «Beleg» gleich am Anfang erklärt. Gut.
2. **Gebäude «Musterhaus Zentrum» wählen, zwei Dateien wählen.** Erwartet: zwei Zeilen. Gesehen: «2 von 2 Dateien gelesen», das Gebäude ist jetzt grau mit Erklärung darüber (P-9 erledigt). Der Knopf heisst «2 Rechnungen erstellen».
3. **Zeilen ansehen.** Erwartet: dass ich erkenne, was zu prüfen ist. Gesehen: in jeder Zeile rechts das Schild «Bitte prüfen» und darunter ein gelber Kasten «Zu dieser Datei – Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» Das ist viel besser als in Runde 1. Bei Gartenbau steht aber nicht, dass die Kategorie fehlt (P-1).
4. **«Angaben prüfen» bei Elektro Blitz, 150 %.** Gesehen: links die Vorschau (etwa 412 × 384 Punkte), rechts die Felder. Unter dem Rechnungsdatum steht «Die KI ist unsicher. Bitte prüfen Sie den Wert.», beim Fälligkeitsdatum «Die KI hat diesen Wert nicht gefunden …». Die Kategorie Allgemeinstrom ist schon gewählt. Bei Betrag und Rechnungssteller ist die Vorschau weiter oben schon weggescrollt (P-3).
5. **Dasselbe bei 200 %.** Erwartet: Vorschau neben den Feldern. Gesehen: Die Vorschau steht über den Feldern, in voller Breite und etwa 384 Punkte hoch. Auf dem Bildschirm sehe ich die Vorschau und gerade noch den Anfang des ersten Felds nicht (P-3). Kein seitliches Scrollen.
6. **«Angaben prüfen» bei Gartenbau.** Gesehen: dieselben Werte wie bei Elektro, ganz unten «Kategorie – Kategorie auswählen», also leer. Ich habe «Gartenpflege» gewählt.
7. **«2 Rechnungen erstellen».** Erwartet: beide werden erstellt. Gesehen: Der Dialog schliesst, oben auf der Liste steht grün «2 Rechnungen erstellt» mit den Links «Elektro Blitz AG» und «Gartenbau Gruen Foto».
8. **Rechnungsseite öffnen.** Erwartet: die Rechnungsnummer. Gesehen: «Rechnungsnummer R-1001» zwischen Leistungszeitraum und Betrag (P-4 teilweise erledigt).
9. **«Beleg anzeigen» (Gartenbau, PNG).** Erwartet: dass ich die Rechnung sehe. Gesehen: Es öffnet sich ein neuer Tab mit dem Bild (weiss, so ist die Testdatei), Titel «document (400×600)». Dwello bleibt im ersten Tab offen. Bei der PDF ging ebenfalls ein neuer Tab auf. Ob der Testbrowser die PDF anzeigt, konnte ich nicht sehen, die Datei kommt aber als PDF zum Anzeigen an.
10. **Bereich «Beleg».** Gesehen: Überschrift «Beleg», der Dateiname, «Beleg anzeigen», der Satz «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.», dann «Datei des Belegs – PDF, JPG oder PNG, höchstens 10 MB.», die Dateiauswahl und «Beleg ersetzen». Ich habe eine Datei ausgewählt, ohne auf «Beleg ersetzen» zu klicken. Es passierte nichts, der Beleg blieb gleich. Jetzt verstehe ich es, gesagt wird es mir aber nicht (P-6).
11. **«Rechnung bearbeiten».** Erwartet: die Rechnungsnummer zum Korrigieren. Gesehen: Rechnungsdatum, Leistungszeitraum, Betrag, Rechnungssteller und Beschreibung, aber keine Rechnungsnummer (P-2).
12. **Gegenprobe «Hauswart Q1 ohne KI.pdf» (nicht gespeichert, verworfen).** Gesehen: «Zu dieser Datei – Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.» Kein doppeltes «Bitte prüfen» mehr (P-8 erledigt).

## Verwirrung

- «Zu dieser Datei»: Was heisst das? Ich hätte lieber eine Überschrift wie «Bitte diese Felder prüfen».
- «Fälligkeitsdatum» in der Prüfliste: Muss ich das ausfüllen? Das Feld sagt «(optional)», der Kasten sagt «Prüfen Sie».
- «Manuell kategorisiert» bei der Gartenbau-Rechnung, obwohl ich nur die Kategorie gewählt habe.
- «Datei des Belegs» und «Beleg ersetzen»: Ich musste ausprobieren, ob schon das Auswählen den Beleg ersetzt.

## Fehlerrisiken

- Wer nur den gelben Kasten der Zeile liest, merkt nicht, dass die Kategorie fehlt. Er klickt auf «Erstellen» und bekommt erst dann einen Fehler (P-1).
- Eine falsch gelesene Rechnungsnummer bleibt falsch (P-2).
- Bei 200 % vergleicht man Felder und Vorschau nur durch Hin- und Herscrollen. So können Lesefehler der KI durchrutschen (P-3).

## Vorschläge

- **P-1:** Schritte: «Musterhaus Zentrum», «Gartenbau Gruen Foto.png» hochladen und den gelben Kasten der Zeile lesen. Hilfreich wäre, die fehlende Pflichtangabe im Kasten zu nennen, z. B. «Wählen Sie eine Kategorie. Prüfen Sie: Rechnungsdatum.»
- **P-2:** Schritte: eine neue Rechnung öffnen, «Rechnung bearbeiten». Hilfreich wäre das Feld «Rechnungsnummer (optional)» im Bearbeiten-Formular.
- **P-3:** Schritte: Zoom 200 %, hochladen, «Angaben prüfen». Hilfreich wäre, dass die Vorschau beim Scrollen mitläuft oder sich auf Knopfdruck vergrössern lässt («Vorschau gross zeigen»). Oder sie steht bei 200 % neben den Feldern, wenn auch schmaler.
- **P-4:** Hilfreich wäre, unsichere und fehlende Werte getrennt zu nennen («Unsicher: Rechnungsdatum. Nicht gefunden: Fälligkeitsdatum (freiwillig).») und dem Kasten einen sprechenden Titel zu geben.
- **P-5:** Hilfreich wäre ein sichtbarer Hinweis am Knopf, z. B. ein kleines Symbol für «öffnet neues Fenster» oder der Text «Beleg anzeigen (neuer Tab)».
- **P-6:** Hilfreich wäre ein Satz unter «Datei des Belegs»: «Wählen Sie die neue Datei und klicken Sie dann auf ‹Beleg ersetzen›.»

## Nicht geprüft

- Ob die PDF im neuen Tab angezeigt wird: Der Testbrowser zeigt keine PDFs an (der Tab blieb leer, Bildschirmfoto nicht möglich). Die Datei kommt als PDF zum Anzeigen im Browser an, nicht als Download.
- «Beleg ersetzen» bis zum Ende: Ich wollte meinen Beleg nicht austauschen.
- Hineinziehen von Dateien: Mit dem Testwerkzeug kann ich nicht wirklich mit der Maus ziehen.
- Wie Dwello reagiert, wenn ich bei Gartenbau ohne Kategorie auf «Erstellen» klicke: Ich habe vorher eine gewählt, um nicht zweimal zu speichern.
