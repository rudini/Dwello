# Helga – Verwaltungspauschale im Mietvertrag (Issue #89)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (eine Stelle zusätzlich bei 200 %), Maus.
Gespeichert nur im Gebäude «Musterhaus Zentrum»: Mieterin Erika Graf und ihr Mietvertrag für Wohnung 2.02. Beim Mietvertrag von Hans Müller habe ich nichts gespeichert, weil er schon stimmte.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/helga-issue-89/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 4 «Miete» | Die rote Meldung «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.» bleibt stehen, auch wenn ich danach «Ja, mit eigenem Satz» angeklickt habe. Die Gruppe gilt weiter als fehlerhaft. |
| P-2 | Minor | Neuer Mietvertrag, Schritt 4, Feld «Eigener Satz in %» | Ich habe «4 %» eingetippt, so wie es im Papiervertrag steht. Dwello lehnt das ab. Nur «4» geht durch. Das Feld hat keinen Hilfetext, der das vorher sagt. |
| P-3 | Minor | Mietvertrag von Hans Müller (Detailseite und Bearbeiten) | «Satz des Abrechnungslaufs» verstehe ich nicht. Auf der Detailseite steht nur «Vereinbart, Satz des Abrechnungslaufs», ohne Erklärung und ohne Prozentzahl. Ich weiss nicht, wie viel Herr Müller am Ende zahlt und wo ich den Satz festlege. |
| P-4 | Nit | Schritt 4 und Bearbeiten, Hilfetext «Verwaltungspauschale» | Der Hilfetext ist richtig, aber sehr lang: sechs Zeilen bei 150 %. Der Satz zu Art. 269d OR am Schluss hat mich bei Herrn Müller verunsichert: Muss ich ihm jetzt ein amtliches Formular schicken, nur weil ich etwas nachschaue? |
| P-5 | Nit | Schritt 5 «Prüfen» und Detailseite von Erika Graf | Dort steht «Vereinbart, 4 %». Im Papiervertrag steht «4 % der Nebenkosten». Ein Augenblick lang dachte ich, es seien vielleicht 4 % der Miete. |

## Beobachtungen

- Bei der Verwaltungspauschale ist keine Antwort vorausgewählt. Das finde ich gut: Ich muss selber hinschauen, was im Vertrag steht.
- Wenn ich nichts wähle und auf «Weiter» klicke, hält Dwello mich auf und setzt den Cursor auf die erste Antwort. Das ist gut so.
- Wenn ich «Ja, mit eigenem Satz» wähle, erscheint darunter das Feld «Eigener Satz in %». Lasse ich es leer, kommt eine klare Meldung: «Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.»
- Nach dem Speichern sehe ich unten rechts die grüne Meldung «Mietvertrag von Erika Graf gespeichert». Den neuen Vertrag finde ich zuoberst in der Liste mit «Künftig, ab 01.01.2027, unbefristet».
- Bei 200 % Zoom passt der Teil mit der Verwaltungspauschale in die Breite. Ich muss nicht seitwärts scrollen. Die Antworten sind gross und gut anklickbar.
- Beim Erfassen der Mieterin musste ich eine Adresse eingeben, weil «Per Brief» vorausgewählt ist. Ich habe die Adresse des Hauses genommen (Bahnhofstrasse 42, 8001 Zürich). Ein Hinweis «bei einem neuen Mieter meist die Adresse der Wohnung» hätte mir das Nachschauen beim Gebäude erspart.
- Auf der Seite von Hans Müller steht oben «3 Abrechnungen fehlen». Damit hatte ich nicht gerechnet, und es hat mich vom eigentlichen Thema abgelenkt. Mit der Verwaltungspauschale hat es nichts zu tun.
- Den Bildschirm «Abrechnungen erstellen» habe ich nur kurz angeschaut. Dort gibt es einen Schritt «Heizprofil und Verwaltungspauschale». Hineingegangen bin ich nicht.

## Aufgabe geschafft: ja

- Erika Graf ist mit Wohnung 2.02 erfasst: ab 01.01.2027, CHF 1'300 Nettomiete, CHF 200 Akonto, Verwaltungspauschale «Vereinbart, 4 %».
- Beim Mietvertrag von Hans Müller steht schon «Ja, zum Satz des Abrechnungslaufs». Laut Hilfetext passt das zu seinem Papiervertrag («Steht dort nur, dass Verwaltungskosten verrechnet werden …»). Ich musste nichts ändern und habe mit «Abbrechen» verlassen.

## Aufwand

Etwa 15 Minuten. Ungefähr 25 Schritte: Mieterin erfassen (8), Assistent mit 5 Schritten und zwei Fehlversuchen (12), Hans Müller ansehen und bearbeiten (5).

## Ablauf

1. **Übersicht → «Mieter erfassen».** Erwartet: ein Formular für die Mieterin. Gesehen: Vorname, Nachname, Korrespondenzkanal (vorausgewählt «Per Brief»), Sprache und Adresse. Gezögert habe ich bei der Adresse und sie beim Gebäude nachgeschaut.
2. **«Mieter erfassen» geklickt.** Erwartet: Bestätigung. Gesehen: die Seite von Erika Graf mit einem Knopf «Mietvertrag erfassen».
3. **Assistent Schritt 1 (Mieter).** Erika Graf war schon ausgewählt. Gut.
4. **Schritt 2 (Wohnung).** Gesehen: Liste mit freien Wohnungen zuoberst und «Wohnung 2.02 - Musterhaus Zentrum». Gewählt.
5. **Schritt 3 (Vertragsdauer).** «01.01.2027» eingetippt. Darunter erschien «Freitag, 1. Januar 2027», und «Unbefristet» war vorausgewählt. Gut.
6. **Schritt 4 (Miete).** 1300 und 200 eingetippt. Dann kam die neue Frage «Verwaltungspauschale» mit drei Antworten und einem langen Hilfetext. Erwartet: dass ich einfach «4 %» eintragen kann. Den Hilfetext musste ich zweimal lesen. Danach war klar: Im Vertrag steht ein Prozentsatz, also «Ja, mit eigenem Satz».
7. **Zuerst ohne Wahl auf «Weiter» geklickt (absichtlich, so wie ich es aus Versehen tun würde).** Gesehen: die rote Meldung «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.» Gut.
8. **«Ja, mit eigenem Satz» angeklickt.** Erwartet: Die rote Meldung verschwindet. Gesehen: Sie bleibt stehen (P-1). Darunter erschien das Feld «Eigener Satz in %».
9. **«4 %» eingetippt und auf «Weiter» geklickt.** Erwartet: Es geht weiter. Gesehen: «Bitte geben Sie einen Prozentsatz von 0 bis 10 … ein, zum Beispiel 3 oder 2,5.» (P-2). Danach «4» eingetippt, und es ging weiter.
10. **Schritt 5 (Prüfen).** Gesehen: «Verwaltungspauschale: Vereinbart, 4 %», «Monatlich total CHF 1'500.00». Das stimmt mit dem Papier überein, abgesehen vom fehlenden «der Nebenkosten» (P-5).
11. **«Mietvertrag speichern» geklickt.** Gesehen: die Liste der Mietverträge mit der Meldung «Mietvertrag von Erika Graf gespeichert». Auf der Detailseite steht «Vereinbart, 4 %».
12. **Mietverträge → «Hans Müller».** Erwartet: irgendwo das Wort Verwaltungspauschale. Gesehen: «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs». Was das bedeutet, wusste ich nicht (P-3).
13. **«Bearbeiten».** Gesehen: «Ja, zum Satz des Abrechnungslaufs» ist gewählt, dazu derselbe Hilfetext. Nach dem Hilfetext passt diese Antwort zu «Die Verwaltungskosten … werden dem Mieter belastet». Ich musste also nichts ändern. Der letzte Satz zum amtlichen Formular hat mich kurz erschreckt (P-4). Mit «Abbrechen» verlassen, nichts gespeichert.

## Verwirrung

- **«Satz des Abrechnungslaufs» / «Abrechnungslauf»:** Das Wort kenne ich nicht. Der Hilfetext sagt nur «Den Satz wählen Sie dann beim Erstellen der Abrechnungen». Wie hoch der Satz ist und ob er jedes Jahr anders sein kann, steht nirgends. Auf der Detailseite fehlt jede Erklärung.
- **«Verwaltungspauschale» und «Verwaltungskosten»:** Der Papiervertrag von Herrn Müller sagt «Verwaltungskosten». Dass das dasselbe ist wie die Verwaltungspauschale, habe ich nur dank dem Hilfetext verstanden.
- **«amtliches Formular (Art. 269d OR)»:** Ich wusste nicht, ob das für mich gilt. Ich ändere ja nichts, ich trage nur ein, was schon unterschrieben ist.
- **«Eigener Satz in %»:** «eigener» Satz von wem? Gemeint ist der Satz aus dem Vertrag. «Satz laut Mietvertrag in %» hätte ich sofort verstanden.
- **Hat mir der Hilfetext gesagt, was ich wählen soll?** Ja, in beiden Fällen. Er beschreibt genau meine zwei Vertragstexte. Er ist aber lang, und die wichtige Regel steckt in der Mitte.

## Fehlerrisiken

- Wer wie ich «4 %» tippt, bekommt eine Fehlermeldung. Wer daraufhin aufgibt und «Ja, zum Satz des Abrechnungslaufs» wählt, um weiterzukommen, verrechnet später vielleicht einen anderen Satz als die vereinbarten 4 %.
- Weil die rote Meldung nach der richtigen Wahl stehen bleibt (P-1), meint man, man habe falsch gewählt, und klickt eine andere Antwort an.
- Bei Herrn Müller sieht man nicht, welcher Prozentsatz am Ende verrechnet wird. Den Fehler im Laufassistenten merkt man erst bei der Abrechnung.
- Der Satz zum amtlichen Formular könnte jemanden dazu bringen, eine korrekte Einstellung auf «Nein» zu ändern, aus Angst vor Formalitäten.

## Vorschläge

- **P-1:** Mietvertrag erfassen → Schritt 4 → Nettomiete ausfüllen → ohne Wahl der Verwaltungspauschale «Weiter» → dann eine Antwort anklicken. Die Meldung bleibt stehen. Hilfreich: Die Meldung verschwindet, sobald eine Antwort gewählt ist.
- **P-2:** Schritt 4 → «Ja, mit eigenem Satz» → «4 %» eintragen → «Weiter». Dwello lehnt ab. Hilfreich: «4 %» und «4,0» annehmen (das Prozentzeichen ignorieren) oder unter dem Feld vorher sagen «Nur die Zahl, zum Beispiel 4 oder 2,5».
- **P-3:** Mietvertrag von Hans Müller öffnen. Dort steht «Vereinbart, Satz des Abrechnungslaufs». Hilfreich: auf der Detailseite ein Satz wie «Der Prozentsatz wird beim Erstellen der Nebenkostenabrechnungen gewählt.» und im Hilfetext ein Beispiel, etwa dass oft 3 bis 5 % üblich sind.
- **P-4:** Mietvertrag bearbeiten → Hilfetext lesen. Hilfreich: die drei Fälle als kurze Liste unter den Antworten und den Satz zu Art. 269d OR so formulieren, dass er nur für eine Änderung gilt, etwa «Nur wenn Sie die Pauschale neu einführen oder erhöhen: …».
- **P-5:** Schritt 5 «Prüfen» oder Detailseite von Erika Graf. Hilfreich: «Vereinbart, 4 % der Nebenkosten».

## Nicht geprüft

- Wie ein eigener Satz und der Satz des Abrechnungslaufs in einer Nebenkostenabrechnung wirken: Ich habe keine Abrechnung erstellt. Das war nicht meine Aufgabe, und der Mietvertrag von Erika Graf beginnt erst 2027.
- Die Antwort «Nein» und das Umstellen eines bestehenden Vertrags mit Speichern: Herr Müller stimmte schon, und andere Verträge durfte ich nicht ändern.
- Andere Sprachen als Deutsch, das Handy und die Bedienung nur mit der Tastatur: Das gehört nicht zu meinem Profil.
