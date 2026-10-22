# Persona-Review Dr. Weber – Issue #580 «Einstellungen › KI»

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Persona-Stack http://localhost:3300 mit Demodaten, KI-Stellvertreter auf 127.0.0.1:2528. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/dr-weber-580/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Einstellungen › KI | Ist schon ein Anbieter gespeichert, setzt «Verbindung prüfen» meine ungespeicherten Eingaben in den Textfeldern still auf die gespeicherten Werte zurück. «KI speichern» speichert danach die alten Angaben; Protokoll und Datenschutzerklärung nennen das falsche Land. |
| P-2 | Minor | Einstellungen › KI, Datenschutzerklärung | Die Checkliste sagt «Andere Anbieter unterstützt Dwello nicht». Trotzdem nimmt Dwello das Land «China» an, und die Datenschutzerklärung nennt dann «Muster KI AG (China)» ohne jede Garantie. |
| P-3 | Minor | Einstellungen › KI | Bei gewählter, noch nicht gespeicherter «KI eines Anbieters» steht unten weiter die Warnung «Die lokale KI antwortet nicht …» mit der Schaltfläche «KI-Modell herunterladen». |
| P-4 | Minor | Einstellungen › KI | Unter «Name des Anbieters» und unter «Land, in dem der Anbieter die Daten bearbeitet» steht wörtlich derselbe Hilfetext. |
| P-5 | Minor | Einstellungen › KI | Ein leeres, als «(optional)» bezeichnetes Feld «API-Schlüssel» führt zu «Der Anbieter lehnt den API-Schlüssel ab. … geben Sie ihn erneut ein.» Ich habe aber gar keinen eingegeben. |
| P-6 | Nit | Einstellungen › KI | Punkt 3 der Checkliste (Aufbewahrung) nennt als einziger keinen Artikel. Art. 19 DSG (Informationspflicht) nennt die Seite gar nicht. |

## Beobachtungen

- Der Weg ist leicht zu finden: Seitenleiste «Einstellungen», dort die Kachel «KI» mit dem Untertitel «Lokale KI, KI eines Anbieters oder keine KI». Die Adresse ist /config/ki.
- Die drei Auswahlen haben klare Folgen-Texte. «Rechnungen, Rechnungsdateien und Kategorien gehen an den Anbieter, auch Namen und Adressen darin» ist ehrlich und deutlich, so wünsche ich mir das.
- Die Meldungen von «Verbindung prüfen» sind gut. Falscher Schlüssel: «Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.» Falsche Adresse (Port 2599 und «api.anbieter.ch» ohne https): «Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.» Modell «text-modell»: «Das Modell liest keine Bilder. Wählen Sie ein Modell, das Bilder liest; sonst kann Dwello hochgeladene Rechnungen nicht auslesen.» Erfolg: «Die Verbindung steht, und das Modell liest Rechnungsbilder.»
- Speichern geht auch ohne vorherige Verbindungsprüfung.
- Speichern mit leeren Feldern zeigt bei jedem Feld eine eigene, verständliche Fehlermeldung. Beim Land steht zum Beispiel «… Die Datenschutzerklärung nennt es.» Gut: Ich sehe, warum Dwello das Land braucht.
- Die Bestätigung «Ich habe diese drei Punkte für diesen Anbieter geprüft.» ist nach dem Neuladen wieder leer. Bei jeder Änderung, auch nur am Modell, muss ich neu bestätigen. Das finde ich vertretbar.
- Der API-Schlüssel erscheint nach dem Speichern nirgends. Das Feld ist leer, der HTML-Quelltext enthält «gueltig» nicht, und darunter steht «Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten.» «Verbindung prüfen» mit leerem Feld nutzt den gespeicherten Schlüssel (Erfolg). Wie ich einen gespeicherten Schlüssel löschen kann, ohne die Art der KI zu wechseln, sagt die Seite nicht.
- Nach dem Wechsel auf «Lokale KI» sind alle Anbieterfelder leer, und der Hinweis auf den gespeicherten Schlüssel ist weg. Für den Datenschutz ist das gut. Wer zurückwechselt, muss aber alles neu eingeben.
- Das Protokoll hat für jedes Speichern einen Eintrag «KI gewählt: Muster KI AG (Deutschland)» bzw. «KI gewählt: Lokale KI», mit Datum und Uhrzeit. Die Datenschutzerklärung beschreibt das unter dem Protokoll («ausserdem jeden Wechsel der KI mit Anbieter und Land»).
- Unter «Weitergabe an Dritte» steht bei gespeichertem Anbieter «Rechnungen werden von Muster KI AG (Deutschland) mit einer KI kategorisiert …». Bei lokaler KI steht dort: «Die KI läuft auf dem Server des Betreibers; die Rechnungen und Kategorien verlassen dafür den Server nicht.» Das stimmt mit meiner Wahl überein.
- Die Datenschutzerklärung sagt beim Anbieter nichts darüber, wie lange er die Daten aufbewahrt. Beim Google-Absatz steht dagegen ausdrücklich der DPF-Hinweis.

## Aufgabe geschafft: ja

(Mit Umweg: Wegen P-1 hat der erste Versuch, «Deutschland» zu speichern, «China» gespeichert. Erst der zweite Versuch ohne Verbindungsprüfung hat «Deutschland» gespeichert.)

## Aufwand

Rund 20 Minuten, 10 Skriptläufe. Etwa 25 Bedienschritte: Navigation, 6 Verbindungsprüfungen, 5 Speichervorgänge, Datenschutzerklärung und Protokoll je zweimal.

## Ablauf

1. **Einstellungen öffnen.** Erwartet: einen Eintrag «KI». Gesehen: Kachel «KI» zwischen «Heizprofile» und «Protokoll». (Screenshot 02: Einstellungsseite mit Kacheln oben.)
2. **KI-Seite lesen.** Erwartet: die drei Möglichkeiten mit ihren Folgen. Gesehen: «Lokale KI auf diesem Server» ist gewählt, darunter die gelbe Warnung «Die lokale KI antwortet nicht. Läuft Dwello mit Docker, startet der Betreiber sie mit der Installationsanleitung; sonst wählen Sie einen Anbieter oder keine KI.» mit «KI-Modell herunterladen». (Screenshot 03)
3. **«KI eines Anbieters» wählen.** Erwartet: Felder und Checkliste. Gesehen: fünf Felder, der Kasten «Bevor Sie einen Anbieter wählen» mit drei nummerierten Punkten, «Das ist eine Checkliste, keine Rechtsberatung.», die Bestätigung und «Verbindung prüfen». Die Warnung zur lokalen KI steht weiter darunter (P-3). (Screenshot 04)
   - Rechtliche Würdigung: Art. 9 DSG (Bearbeitung durch Auftragsbearbeiter, Vertrag, Beizug Dritter nur mit vorgängiger Genehmigung) ist richtig wiedergegeben. «Nicht für das Training» folgt aus «nur so, wie Sie es selbst dürften» und ist als Klartext hilfreich. Art. 16 Abs. 1 DSG (Angemessenheit, die der Bundesrat feststellt) ist richtig. Die USA nur mit Swiss-U.S. DPF-Zertifizierung: Das ist plausibel, der Bundesrat hat dies 2024 anerkannt. Dass Dwello Garantien nach Art. 16 Abs. 2 (Standardvertragsklauseln) nicht abbildet, ist als Einschränkung ehrlich gesagt. Die Formulierung «unterstützt Dwello nicht» klingt aber nach einer technischen Sperre, die es nicht gibt (P-2). Punkt 3 (Aufbewahrung) entspricht Art. 6 Abs. 4 DSG, nennt ihn aber nicht (P-6).
   - Die Bestätigung ist verständlich: «diese drei Punkte», «für diesen Anbieter». Ich weiss, wofür ich unterschreibe.
4. **Leer speichern.** Erwartet: Fehler pro Feld. Gesehen: wie erwartet, dazu «Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.» (Screenshot 05)
5. **Falscher Schlüssel «falsch».** Erwartet: Ablehnung. Gesehen: «Der Anbieter lehnt den API-Schlüssel ab …» (Screenshot 06)
6. **Falsche Adresse (Port 2599).** Erwartet: «nicht erreichbar». Gesehen: «Unter dieser Adresse antwortet keine KI …» (Screenshot 07)
7. **Richtige Angaben, prüfen.** Erwartet: Erfolg. Gesehen: «Die Verbindung steht, und das Modell liest Rechnungsbilder.» (Screenshot 08)
8. **Speichern ohne Häkchen.** Erwartet: Ablehnung. Gesehen: «Bestätigen Sie, dass Sie die drei Punkte …» Die Felder blieben gefüllt. (Screenshot 09)
9. **Modell «text-modell».** Gesehen: «Das Modell liest keine Bilder …» (Screenshot 10). Ohne Schlüssel: dieselbe Meldung wie beim falschen Schlüssel (P-5).
10. **Land «China», Häkchen, speichern** (Gegenprobe zur Checkliste). Erwartet: Ablehnung oder wenigstens ein Hinweis. Gesehen: «Einstellungen gespeichert. Die KI-Einstellung ist gespeichert. Die nächste Rechnung verwendet sie.» (Screenshot 11) Die Datenschutzerklärung nennt danach «Muster KI AG (China)» (P-2, Screenshot 13-privacy-china).
11. **Auf Deutschland korrigieren:** Schlüssel «gueltig» und Land «Deutschland» eingeben, «Verbindung prüfen» (Erfolg), Häkchen, «KI speichern». Erwartet: Deutschland gespeichert. Gesehen: «Einstellungen gespeichert». Nach dem Neuladen steht aber «China» im Feld, und das Protokoll hat einen zweiten Eintrag «KI gewählt: Muster KI AG (China)» (P-1, Screenshot 15). Nachgestellt: Land «Österreich» eintippen, «Verbindung prüfen». Danach steht im Feld wieder «Deutschland», ohne jeden Hinweis (Screenshot 16). Gesendet hatte die Prüfung «Österreich».
12. **Neu speichern ohne Verbindungsprüfung.** Gesehen: Deutschland gespeichert, auch nach dem Neuladen.
13. **Datenschutzerklärung.** Erwartet: Anbieter und Land. Gesehen: «Rechnungen werden von Muster KI AG (Deutschland) mit einer KI kategorisiert, und hochgeladene Rechnungsdateien liest sie aus. …» Es folgen genaue Angaben dazu, was übermittelt wird. Passt.
14. **Protokoll** (Einstellungen › Protokoll). Gesehen: «22.10.2026, 11:54 KI gewählt: Muster KI AG (Deutschland)», dazu die beiden China-Einträge. Passt.
15. **KI erneut öffnen.** Erwartet: kein Schlüssel sichtbar. Gesehen: Das Feld ist leer, darunter «Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten.» Im Quelltext steht kein Schlüssel. (Screenshot 12)
16. **«Lokale KI auf diesem Server» speichern.** Gesehen: «Einstellungen gespeichert … Die nächste Rechnung verwendet sie.», darunter wieder «Die lokale KI antwortet nicht. Läuft Dwello mit Docker, startet der Betreiber sie mit der Installationsanleitung; sonst wählen Sie einen Anbieter oder keine KI.» und «KI-Modell herunterladen» (Screenshot 18). Dwello speichert also ohne Rückfrage eine KI, die nicht antwortet. Die Warnung stand aber schon vorher auf der Seite. Die Datenschutzerklärung nennt danach die lokale KI, und das Protokoll hat «KI gewählt: Lokale KI». Der Stack steht wieder wie zu Beginn.

## Verwirrung

- «KI-Modell herunterladen» direkt neben «startet der Betreiber sie mit der Installationsanleitung»: Muss ich herunterladen, oder muss der Betreiber starten? Was nützt das Herunterladen, wenn die KI nicht antwortet?
- «Andere Anbieter unterstützt Dwello nicht»: Ich habe eine Sperre erwartet und keine erlebt.
- «Adresse der KI» und «OpenAI-kompatible Schnittstelle» sind für einen Laien Fachjargon. Das Beispiel https://api.anbieter.ch/v1 erscheint erst in der Fehlermeldung, nicht im Hilfetext.
- «API-Schlüssel (optional)»: Wann brauche ich keinen? Es fehlt ein Hilfetext.

## Fehlerrisiken

- P-1: Wer das Land oder den Anbieter ändert, «Verbindung prüfen» drückt (so wie die Seite es nahelegt) und dann speichert, speichert die alten Angaben. Die Datenschutzerklärung nennt dann einen falschen Anbieter oder ein falsches Land, also eine falsche Rechtsangabe. Die Erfolgsmeldung täuscht über den Fehler hinweg.
- P-2: Ein Vermieter, der die Checkliste nur überfliegt und trotzdem abhakt, erhält eine Datenschutzerklärung mit einem unsicheren Drittstaat und ohne Garantien.
- P-5: Wer den Schlüssel vergessen hat, sucht wegen der Meldung «lehnt ab» einen Fehler beim Anbieter.

## Vorschläge

- **P-1:** Reproduktion: Anbieter mit Land «Deutschland» gespeichert. KI öffnen, Land auf «Österreich» ändern, «Verbindung prüfen» drücken: Das Feld zeigt wieder «Deutschland». Häkchen setzen, «KI speichern» und neu laden: «Deutschland» bleibt gespeichert, das Protokoll meldet «KI gewählt: Muster KI AG (Deutschland)». Hilfreich: Die Prüfung darf die eingegebenen Werte nicht ersetzen. Die Felder müssen nach der Prüfung genau das zeigen, was ich eingegeben habe.
- **P-2:** Reproduktion: Anbieter wählen, Land «China», Häkchen, «KI speichern». Das wird angenommen, und /privacy zeigt «Muster KI AG (China)». Hilfreich: entweder die Formulierung ehrlich machen («Wählen Sie keinen anderen Anbieter: …») oder bei einem Land, das nicht auf der Liste des Bundesrats steht, einen Hinweis zeigen, bevor gespeichert wird. Ob Dwello das sperren soll, entscheidet der Product Owner.
- **P-3:** Reproduktion: KI öffnen (lokal gespeichert, Modell antwortet nicht), «KI eines Anbieters» anklicken: Die gelbe Warnung zur lokalen KI bleibt stehen. Hilfreich: die Warnung nur zeigen, solange «Lokale KI» gewählt ist. Ausserdem sagen, wann «KI-Modell herunterladen» hilft und wann der Betreiber nötig ist.
- **P-4:** Reproduktion: «KI eines Anbieters» wählen und die Hilfetexte von Name und Land vergleichen. Hilfreich: beim Namen «Bezieht der Anbieter weitere Firmen bei, nennen Sie alle, mit Komma getrennt.» und beim Land «Bearbeiten Firmen die Daten in mehreren Ländern, nennen Sie alle, mit Komma getrennt.»
- **P-5:** Reproduktion: Adresse http://127.0.0.1:2528/v1, Schlüssel leer, Modell «bild-modell», «Verbindung prüfen». Hilfreich: Bei leerem Feld eine eigene Meldung zeigen, etwa «Der Anbieter verlangt einen API-Schlüssel. Geben Sie den Schlüssel aus Ihrem Konto beim Anbieter ein.», und beim Feld erklären, wann es leer bleiben darf.
- **P-6:** Reproduktion: Checkliste lesen. Hilfreich: bei Punkt 3 «(Art. 6 Abs. 4 DSG)». Art. 19 DSG braucht keine eigene Zeile, wenn die Datenschutzerklärung die Information leistet. Ein Satz wie «Dwello nennt Anbieter und Land in der Datenschutzerklärung (Art. 19 DSG)» würde aber zeigen, warum Name und Land Pflichtfelder sind.

## Nicht geprüft

- «KI-Modell herunterladen» habe ich nicht angeklickt. Der Stack hat keinen lokalen Modelldienst, und ein Download hätte die geteilte Umgebung verändert.
- Hochladen einer Rechnung mit dem gespeicherten Anbieter: nicht Teil der Aufgabe, und der Stack ist wieder auf lokaler KI.
- «Keine KI» habe ich nicht gespeichert, um die gemeinsame Einstellung nicht unnötig zu wechseln.
- Ob der gespeicherte Schlüssel im Server verschlüsselt liegt, kann ich als Benutzer nicht sehen. Geprüft habe ich nur, dass der Browser ihn nicht erhält.
- Andere Sprachen und das Mobiltelefon: nicht meine Persona.
