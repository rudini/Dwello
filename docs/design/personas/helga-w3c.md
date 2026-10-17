# Helga, Runde w3c: neue Auslandsadresse, Brief, IBAN aus Liechtenstein, PDF prüfen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten).
Gespeichert habe ich nur bei Anna Schmidt (Musterhaus Zentrum), in den Einstellungen und einmal im Formular «Abrechnung bearbeiten» von Anna Schmidts Abrechnung, ohne dort etwas zu ändern.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/helga-w3c/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0002 (Detail) / PDF | Nachdem ich die neue Adresse gespeichert hatte, zeigte das PDF von Anna Schmidt immer noch «Bahnhofstrasse 42, 8001 Zürich». Die Seite warnt nicht, dass das PDF veraltet ist, und bietet keinen Knopf «PDF neu erstellen». |
| P-2 | Major | Einstellungen → PDF der Abrechnungen | Die neue IBAN (LI21 …) wurde mit «Einstellungen gespeichert» angenommen. Das PDF von Maria Rossi (Musterhaus Zentrum, Nachzahlung) zeigt auf dem Einzahlungsschein aber weiter die alte IBAN CH44 3199 9123 0008 8901 2. Weder beim Speichern noch bei der Abrechnung steht ein Hinweis, dass Entwürfe die alte IBAN behalten. |
| P-3 | Minor | Abrechnung (Detail), Bereich «Mieter und Wohnung» | Dort stehen nur die E-Mail-Adresse und die Adresse der Wohnung, nicht der Korrespondenzkanal («Per Brief») und nicht die Korrespondenzadresse. Ob die Abrechnung nach Konstanz geht, sehe ich erst im PDF. |
| P-4 | Minor | Mieter bearbeiten, Feld «Land (optional)» | Bei «Per Brief» werden Strasse, PLZ und Ort Pflichtfelder, «Land» bleibt «(optional)» und ist auf «Schweiz» voreingestellt. Hätte ich das Land vergessen, stünde «Konstanz, Schweiz» im Datensatz, und niemand hätte mich gewarnt. |
| P-5 | Nit | Einstellungen, Feld «IBAN» | Im Hilfetext steht nur ein Schweizer Beispiel («CH93 …»). Dass eine IBAN aus Liechtenstein geht, wusste ich erst nach dem Speichern. |
| P-6 | Nit | Mieter bearbeiten, Gruppe «Korrespondenzadresse» | Am Hilfetext «Hierhin gehen Abrechnungen und Mahnungen; nach dem Auszug die neue Adresse eintragen» fehlt der Punkt, und er spricht mich nicht mit «Sie» an. Anna zieht aus der Wohnung nicht aus, ihr Mietvertrag läuft weiter. Ich war unsicher, ob das Feld für meinen Fall gedacht ist. |

## Beobachtungen

- Auf der Übersicht sah ich unter «Als Nächstes zu tun» nur den Hinweis «Neue Adresse eintragen» für Sarah Meier. Für Anna musste ich selbst über das Menü zu «Mieter» gehen. Das war für meinen Fall in Ordnung.
- Sobald ich «Per Brief» wählte, verschwand bei Strasse, PLZ und Ort das «(optional)», und bei der E-Mail-Adresse kam es dazu. So sah ich sofort, was jetzt nötig ist (Screenshot `06-brief-gewaehlt.png`).
- Nach dem Speichern erschien die Meldung «Anna Schmidt gespeichert», und auf der Detailseite stand «Per Brief» sowie «Marktstätte 3 / 78462 Konstanz / Deutschland», in drei Zeilen (`08-gespeichert.png`). Umlaut und Land wurden richtig übernommen.
- Die Einstellungen meldeten «Einstellungen gespeichert – Absender, Verwaltungspauschale und Vorschläge gespeichert.». Nach dem Neuladen stand die IBAN noch genau so da, wie ich sie mit Leerzeichen eingetippt hatte.
- Anna Schmidt bekommt für 2025 eine Rückerstattung von CHF 6.50. Auf ihrem PDF ist deshalb kein Einzahlungsschein, und der Text sagt «Teilen Sie uns dafür Ihre IBAN mit». Für sie konnte ich den Einzahlungsschein also gar nicht prüfen. Das ist richtig so, aber in der Aufgabe hatte ich einen erwartet.
- In der Liste und auf der Detailseite heisst der Knopf «PDF herunterladen», nicht «PDF erstellen». Unter «Verlauf» steht «PDF erstellt 17.10.2026, 00:58». Dieser Zeitpunkt liegt vor meiner Änderung. Das hätte mich warnen können, aber ich habe es erst im Nachhinein verstanden.
- Im Formular «Abrechnung bearbeiten» steht: «Für eine Korrektur löschen Sie den Entwurf und erstellen die Abrechnungen des Gebäudes neu.» Das bezieht sich aber auf Kosten, nicht auf die Adresse.
- Im Assistenten «Abrechnungen erstellen» zeigte Schritt 3 «Entwurf gespeichert, 23:04». Das Wort «Entwurf» meint hier den Assistenten selbst, sonst in der App eine Abrechnung. Ich dachte kurz, ich hätte schon eine Abrechnung angelegt.
- Unter dem Feld «Datei» stand «Choose File / No file chosen» auf Englisch. Das kommt vermutlich vom Browser.

## Aufgabe geschafft: teilweise

- Adresse und «Per Brief» habe ich eingetragen: ja.
- Die IBAN in den Einstellungen habe ich hinterlegt: ja.
- Ein PDF mit der neuen Adresse habe ich nicht bekommen: nein. Bei drei Versuchen am selben Schritt zeigte das PDF jedes Mal die alte Adresse oder es gab keinen Weg zu einem neuen PDF (siehe Ablauf 8–10). Den einzigen Weg, den die App nennt (Entwurf löschen und neu erstellen), durfte ich in diesem Lauf nicht ausführen.

## Aufwand

Etwa 12 Minuten und rund 16 Schritte: Menü → Mieter → Anna Schmidt → Bearbeiten → speichern; Menü → Einstellungen → speichern; Menü → Nebenkostenabrechnungen → Anna Schmidt → PDF; dazu zwei weitere PDF-Versuche und ein Blick in den Assistenten.

## Ablauf

1. **Übersicht.** Erwartet: ein Weg zu den Mietern. Gesehen: Über das Menü (☰) erreicht man «Mieter» unter «Verwalten». Gut gegliedert.
2. **Mieterliste.** Erwartet: Anna Schmidt ist leicht zu finden. Gesehen: Die Liste ist alphabetisch nach Nachnamen. Bei «Anna Schmidt» stehen «Wohnung 1.02 - Musterhaus Zentrum» und «Aktiv». Ein Klick auf den Namen öffnet die Detailseite.
3. **Detail Anna Schmidt.** Erwartet: Adresse und Postweg zu sehen. Gesehen: «Korrespondenzkanal: Per E-Mail» und «Korrespondenzadresse: Bahnhofstrasse 42 8001 Zürich». Über den Knopf «Bearbeiten» kam ich weiter.
4. **Mieter bearbeiten.** Erwartet: ein Feld für den Postweg. Gesehen: «Korrespondenzkanal» mit dem Hilfetext «Wie der Mieter Post erhält … per Brief eine Adresse.». Ich wählte «Per Brief». Danach wurden Strasse, PLZ und Ort Pflicht. «Land» blieb optional und auf «Schweiz» eingestellt; ich stellte es auf «Deutschland» um. Die fünfstellige PLZ 78462 wurde angenommen.
5. **Speichern.** Erwartet: eine Bestätigung. Gesehen: die Meldung «Anna Schmidt gespeichert», «Per Brief» und die neue Adresse mit «Deutschland».
6. **Einstellungen.** Erwartet: ein Feld für das Konto. Gesehen: In der Gruppe «Absender» steht das Feld «IBAN» mit dem Hinweis «es steht auf der QR-Rechnung» und einem Schweizer Beispiel. Ich löschte die alte IBAN und tippte «LI21 0881 0000 2324 013A A» ein. Nach «Einstellungen speichern» erschien eine Bestätigung, und nach dem Neuladen war die IBAN noch da.
7. **Abrechnungen.** Erwartet: «Anna Schmidt 2025» zu finden. Gesehen: Auf Seite 1 steht «Anna Schmidt NK-11111111-2025-0002, Rückerstattung CHF 6.50, Entwurf», mit einem PDF-Link.
8. **PDF, Versuch 1.** Erwartet: Das PDF wird mit der neuen Adresse erstellt. Gesehen: Auf der Detailseite lud «PDF herunterladen» die Datei NK-11111111-2025-0002.pdf. Oben rechts im Adressfeld steht aber «Anna Schmidt, Bahnhofstrasse 42, 8001 Zürich». Es gibt keinen Einzahlungsschein, weil es eine Rückerstattung ist. Laut Datei-Eigenschaften wurde das PDF um 22:58 UTC erstellt, also beim Anlegen der Demodaten und vor meiner Änderung.
9. **PDF, Versuch 2.** Erwartet: Speichern im Formular «Frist und Bemerkungen bearbeiten» erstellt das PDF neu. Gesehen: Ich speicherte ohne Änderung und lud das PDF erneut. Es zeigte wieder die alte Adresse, und «PDF erstellt» blieb auf 00:58.
10. **PDF, Versuch 3.** Erwartet: «Abrechnungen erstellen» bietet für Musterhaus Zentrum an, die Abrechnung neu zu erstellen. Gesehen: In Schritt 4 «Vorschau» stand «Anzahl Abrechnungen 0» und «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …». Löschen durfte ich in diesem Lauf nicht. Den Assistenten habe ich nicht abgeschlossen.
11. **Gegenprobe IBAN.** Erwartet: Das PDF von Maria Rossi (Musterhaus Zentrum, Nachzahlung CHF 238.10) zeigt die neue IBAN. Gesehen: Auf dem Einzahlungsschein steht noch «CH44 3199 9123 0008 8901 2».

## Verwirrung

- **«PDF herunterladen» statt «PDF erstellen».** In der Aufgabe hiess es «erstellen». In der App gibt es nur «herunterladen». Dass das PDF ein fester Stand von früher ist, steht nirgends.
- **«Korrespondenzkanal»** ist ein schwieriges Wort. Der Hilfetext darunter erklärt es aber gut.
- **«Korrespondenzadresse … nach dem Auszug»:** Anna zieht nach Deutschland, ihr Mietvertrag läuft aber weiter. Ist das ein «Auszug»? Ich war unsicher, ob ich hier richtig bin.
- **«Entwurf gespeichert»** im Assistenten: Ich dachte, ich hätte eine Abrechnung angelegt.
- **IBAN aus dem Ausland:** Bis ich gespeichert hatte, wusste ich nicht, ob Dwello eine IBAN mit «LI» annimmt.

## Fehlerrisiken

- Ich hätte den Entwurf mit der alten Zürcher Adresse versendet, im Glauben, die Adresse sei richtig. Der Brief wäre an eine Wohnung gegangen, in der Anna nicht mehr wohnt (P-1).
- Mieter mit Nachzahlung hätten auf das alte Konto überwiesen, obwohl die neue IBAN «gespeichert» war (P-2).
- Mit dem voreingestellten Land «Schweiz» wäre eine Adresse in Konstanz als Schweizer Adresse gespeichert worden (P-4).
- Der einzige Weg zu einem neuen PDF, den die App nennt, ist das Löschen der Abrechnung. Das macht Anfängern Angst, und die Bestätigung sagt «lässt sich nicht rückgängig machen».

## Vorschläge

- **P-1:** Reproduktion: Mieter → Anna Schmidt → Bearbeiten → Korrespondenzkanal «Per Brief», Adresse «Marktstätte 3, 78462 Konstanz, Deutschland» → speichern → Nebenkostenabrechnungen → Anna Schmidt NK-11111111-2025-0002 → «PDF herunterladen». Das PDF zeigt «Bahnhofstrasse 42, 8001 Zürich». Hilfreich wäre: Ein Entwurf übernimmt geänderte Mieter- und Absenderdaten beim nächsten Herunterladen. Oder die Detailseite zeigt «Die Adresse des Mieters hat sich geändert, seit das PDF erstellt wurde» mit einem Knopf «PDF neu erstellen».
- **P-2:** Reproduktion: Einstellungen → IBAN «LI21 0881 0000 2324 013A A» → speichern → Abrechnung Maria Rossi NK-11111111-2025-0004 → «PDF herunterladen». Der Einzahlungsschein zeigt CH44 …. Hilfreich wäre: Entwürfe übernehmen die neue IBAN. Oder die Bestätigung beim Speichern sagt, welche Abrechnungen noch die alte IBAN tragen und wie man sie neu erstellt.
- **P-3:** Reproduktion: Abrechnung von Anna Schmidt öffnen, Bereich «Mieter und Wohnung» ansehen. Hilfreich wäre: dort «Versand: Per Brief» und die Korrespondenzadresse anzeigen, so wie sie auf dem PDF steht.
- **P-4:** Reproduktion: Mieter bearbeiten → «Per Brief» wählen und Strasse, PLZ und Ort einer ausländischen Adresse eintragen, «Land» auf «Schweiz» lassen → speichern geht. Hilfreich wäre: Bei «Per Brief» ist «Land» Pflicht, oder ein Hinweis wie «Prüfen Sie das Land: bei Adressen im Ausland ändern».
- **P-5:** Einstellungen → Hilfetext der IBAN. Hilfreich wäre der Zusatz «Schweizer oder liechtensteinische IBAN» und ein zweites Beispiel.
- **P-6:** Mieter bearbeiten → Hilfetext der Gruppe «Korrespondenzadresse». Hilfreich wäre ein ganzer Satz in der Sie-Form, zum Beispiel «Hierhin schicken Sie Abrechnungen und Mahnungen. Wohnt der Mieter an einer anderen Adresse als in der Wohnung, tragen Sie diese hier ein.»

## Nicht geprüft

- **Ein PDF mit der neuen Adresse und der neuen IBAN.** Dazu hätte ich den Entwurf NK-11111111-2025-0002 löschen und die Abrechnungen von Musterhaus Zentrum neu erstellen müssen. Das Löschen wurde in diesem Lauf nicht erlaubt. Ob die neu erstellte Abrechnung die Adresse in Konstanz und die IBAN LI21 trägt, bleibt deshalb offen.
- **Einen Einzahlungsschein für Anna Schmidt.** Ihre Abrechnung 2025 ist eine Rückerstattung, darum hat sie keinen QR-Teil. Die Auslandsadresse im Feld «Zahlbar durch» konnte ich deshalb nicht prüfen.
- **Die Darstellung bei 200 % Zoom.** Ich habe nur 150 % benutzt.
- **Den Versand per Brief** («Als versendet markieren»). Das wollte ich bei einem veralteten PDF nicht tun.
