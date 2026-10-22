# Persona-Review Marco – #580 «Einstellungen» › «KI» (/config/ki)

Marco, 38, Smartphone 390 × 844, Touch. Persona-Stack http://localhost:3300 mit Demodaten. Nichts gespeichert (der einzige «KI speichern»-Tipp wurde wie geplant abgelehnt). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-580/`.

Hinweis: Eine andere Persona hat während meines Laufs auf dieser Seite einen Anbieter gespeichert (zuerst Land «China», später «Deutschland»). Die Seite war deshalb schon vorausgefüllt; diese Werte sind nicht von mir und zählen nicht als Befund.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | /config/ki, nach «Verbindung prüfen» | Nach der Prüfung stehen in «Name des Anbieters» und «Land, in dem der Anbieter die Daten bearbeitet» wieder die gespeicherten Werte statt der eben eingetippten. «Schweiz» wurde ohne Hinweis zu «Deutschland», «Andere AG» zu «Muster KI AG». Modell, API-Schlüssel und Häkchen bleiben dagegen erhalten. Wer danach speichert, speichert den falschen Anbieter bzw. das falsche Land, also auch eine falsche Angabe in der Datenschutzerklärung. |
| P-2 | Minor | /config/ki, «KI eines Anbieters» gewählt | Unter «KI speichern» steht weiterhin der gelbe Hinweis «Die lokale KI antwortet nicht. … sonst wählen Sie einen Anbieter oder keine KI.» mit «KI-Modell herunterladen», obwohl ich gerade «KI eines Anbieters» gewählt habe (sichtbar, solange die gespeicherte Wahl «Lokale KI» ist). Ich frage mich: Muss ich doch etwas herunterladen? |
| P-3 | Minor | /config/ki, Feldhilfen | «Name des Anbieters» und «Land, in dem …» haben genau denselben Hilfetext: «Bearbeiten mehrere Firmen oder Länder die Daten, nennen Sie alle, mit Komma getrennt.» Beim Namen ist von «Ländern» die Rede, beim Land von «Firmen». Was gehört wohin? |
| P-4 | Minor | /config/ki, nach «Verbindung prüfen» | Die Erfolgsmeldung «Die Verbindung steht, und das Modell liest Rechnungsbilder.» ist schlichter grauer Text ohne Symbol und ohne Hinweis, dass noch nichts gespeichert ist. Auf dem Handy denke ich: «Steht, fertig» und gehe weg. Beim Verlassen kam auch keine Warnung, die Eingaben waren weg. |
| P-5 | Minor | /config (Einstellungen), Karte «KI» | Nur das Wort «KI» (234 × 24 px) ist ein Link. Ein Tipp auf die übrige Karte (308 × 110 px, z. B. auf «Lokale KI, KI eines Anbieters oder keine KI») bewirkt nichts. Bei den anderen Karten (Kategorien usw.) ist es gleich. |
| P-6 | Nit | /config/ki, Speichern abgelehnt | Bei zwei Fehlern sehe ich nach dem Tipp nur den ersten (Land); der Fehler beim Häkchen liegt rund eine Bildschirmhöhe weiter unten. Ein kurzer Satz oben oder beim Knopf («2 Angaben fehlen») würde helfen. |

## Beobachtungen

- Weg zur Seite: In der Übersicht (Dashboard) und im Menü (☰) gibt es keine «Einstellungen». Ich habe sie erst im Personen-Symbol oben rechts («Benutzermenü») gefunden, dort heisst der Link «Einstellungen». Danach liegt die Karte «KI» gut sichtbar zwischen «Stammdaten» und «Protokoll».
- Auf /config/ki gibt es keinen Zurück-Link zu «Einstellungen». Ich musste wieder über das Benutzermenü zurück.
- Kein seitliches Scrollen: `scrollWidth` 390 bei 390 px, sowohl vor als auch nach der Wahl des Anbieters.
- Grössen: alle Textfelder 308 × 48 px, die Knöpfe «Verbindung prüfen» 226 × 48, «KI speichern» 177 × 48, «KI-Modell herunterladen» 269 × 48. Die Radio-Karten sind ganz antippbar (308 × 112 bis 232 px), das Label des Häkchens 308 × 48 px. Gut für den Daumen.
- Die Checkliste «Bevor Sie einen Anbieter wählen» ist eine nummerierte Liste mit 3 Punkten in normaler Schriftgrösse und gut lesbar. Auf dem Handy ist sie aber lang (etwa eine Bildschirmhöhe). Erst darunter kommen das Häkchen und «Verbindung prüfen».
- Die Seite ist insgesamt etwa 3300 px hoch (rund 4 Bildschirme). «KI speichern» steht ausserhalb der Karte ganz unten.
- Der Tipp auf «KI speichern» bei fehlendem Land und fehlendem Häkchen lehnt ab (POST `?/save`, Antwort 200, keine Änderung). Der Cursor springt ins leere Feld «Land, in dem …» (rot umrandet), darunter steht «Geben Sie das Land an, in dem der Anbieter die Daten bearbeitet. Die Datenschutzerklärung nennt es.». Beim Häkchen steht «Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.». Beide Felder sind als ungültig markiert. Alle anderen Eingaben, auch der API-Schlüssel, bleiben stehen. Das ist klar.
- Nach dem Speichern eines Schlüssels (durch die andere Persona) ist das Feld leer, darunter steht «Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten.» Das verstehe ich.
- «API-Schlüssel (optional)» passt nicht ganz zur Radio-Beschreibung «Sie brauchen dort ein Konto und einen API-Schlüssel.» (Nit, aber das gehört zur bestehenden Wording-Entscheidung).
- Ein anderes Modell («text-modell») ergibt bei der Prüfung «Das Modell liest keine Bilder. Wählen Sie ein Modell, das Bilder liest; sonst kann Dwello hochgeladene Rechnungen nicht auslesen.» Das ist verständlich. Die Antwort kommt vom Stand-in, nicht von einer echten KI.

## Aufgabe geschafft: ja

(Alle drei Schritte durchgeführt, Seite ohne Speichern verlassen.)

## Aufwand

Etwa 6 Minuten als Marco. Vom Dashboard zur Seite: 3 Tipps (Benutzermenü, Einstellungen, KI). Formular: 1 Tipp auf die Radio-Karte, 4 Felder, 1 Tipp auf «KI speichern», 1 Tipp auf «Verbindung prüfen». Dazu kamen zwei zusätzliche Prüfläufe, um P-1 zu bestätigen.

## Ablauf

1. **Dashboard.** Erwartet: irgendwo «Einstellungen». Gesehen: nicht im ☰-Menü (Übersicht, Gebäude … Dokumente), sondern erst im Personen-Symbol. Kurzes Suchen.
2. **Einstellungen (/config).** Erwartet: einen Punkt «KI». Gesehen: Abschnitt «KI» mit der Karte «KI – Lokale KI, KI eines Anbieters oder keine KI». Ein Tipp auf die Karte neben dem Text bewirkt nichts (P-5), erst der Tipp auf «KI» öffnet die Seite.
3. **/config/ki (Ausgangslage).** Erwartet: eine einfache Auswahl. Gesehen: «Welche KI soll Dwello verwenden?» mit drei grossen Radio-Karten, darunter «KI speichern» und der gelbe Hinweis zur lokalen KI. Passt in 390 px, nichts ist abgeschnitten (Screenshot 05-ki.png).
4. **«KI eines Anbieters» gewählt.** Erwartet: Felder für den Anbieter. Gesehen: Karte «KI eines Anbieters» mit 5 Feldern, alle mit Label oben und Hilfetext. Danach kommt die Karte «Bevor Sie einen Anbieter wählen» mit 3 Punkten, dem Satz «Das ist eine Checkliste, keine Rechtsberatung.», dem Häkchen und «Verbindung prüfen». Der gelbe Hinweis zur lokalen KI bleibt unten stehen (P-2). Name und Land haben denselben Hilfetext (P-3).
5. **Ausgefüllt, ohne Land und Häkchen, «KI speichern».** Erwartet: Ablehnung mit Hinweis. Gesehen: Die Seite springt zum Land-Feld, der Fehler steht direkt darunter (Screenshot 08-after-save-viewport.png). Der zweite Fehler beim Häkchen liegt weiter unten, ausserhalb der Sicht (P-6). Gespeichert wurde nichts.
6. **«Verbindung prüfen».** Erwartet: ein Ergebnis in der Nähe des Knopfs. Gesehen: nach etwa 2 s steht direkt unter dem Knopf «Die Verbindung steht, und das Modell liest Rechnungsbilder.», auf demselben Bildschirm (Screenshot 10-check-viewport.png). Leicht zu finden, aber unauffällig (P-4). **Dann:** Das leere Land-Feld enthält plötzlich «Deutschland» (Wert der anderen Persona). Gegenprobe: Mit «Schweiz» und «Andere AG» eingetippt und erneut geprüft, danach stehen wieder «Deutschland» und «Muster KI AG» da. Ein geändertes Modell («text-modell») und das Häkchen blieben erhalten (P-1).
7. **Verlassen.** Über Benutzermenü › Einstellungen ohne Warnung verlassen. Zurück auf /config/ki zeigt die Seite den gespeicherten Stand, meine Eingaben sind weg (nichts gespeichert, wie gewollt).

## Verwirrung

- «Adresse der KI»: Mit «OpenAI-kompatible Schnittstelle» kann ich als Laie wenig anfangen, aber der Satz «Die Adresse, die Ihnen der Anbieter … nennt» hilft.
- Der Hinweis zur lokalen KI mit dem Knopf «KI-Modell herunterladen» bei gewähltem Anbieter (P-2).
- Gleicher Hilfetext bei Name und Land (P-3).
- «Die Verbindung steht»: Heisst das, es ist eingerichtet? (P-4)
- Wo sind die Einstellungen? Hinter dem Personen-Symbol habe ich sie nicht vermutet.

## Fehlerrisiken

- P-1: Ich tippe einen neuen Anbieter ein, prüfe, sehe «Verbindung steht», hake an und speichere. Gespeichert werden dann Name und Land des alten Anbieters. Die Datenschutzerklärung nennt dann ein falsches Land oder eine falsche Firma, ohne dass ich es merke, weil die Felder weit oben stehen und ich auf dem Handy unten beim Knopf bin.
- P-4: Nach der erfolgreichen Prüfung die Seite verlassen und glauben, die KI sei umgestellt.

## Vorschläge

- **P-1:** Reproduktion auf /config/ki (390 px): «KI eines Anbieters» wählen, Adresse `http://127.0.0.1:2528/v1`, Schlüssel «gueltig», Modell «bild-modell», Name «Andere AG», Land «Schweiz» eingeben und «Verbindung prüfen» tippen. Danach stehen in Name und Land wieder die gespeicherten Werte. Ist nichts gespeichert, ist das Land vermutlich leer; nicht geprüft. Hilfe: Die Prüfung soll alle eingetippten Felder so lassen, wie sie sind, genau wie bei Modell und Häkchen.
- **P-2:** «KI eines Anbieters» antippen, während «Lokale KI» gespeichert ist und die lokale KI nicht antwortet: Der gelbe Hinweis bleibt. Hilfe: den Hinweis nur zeigen, wenn «Lokale KI» gewählt ist.
- **P-3:** Unter «Name des Anbieters» z. B. «Zieht der Anbieter weitere Firmen bei, nennen Sie alle, mit Komma getrennt.», unter «Land» «Bearbeiten Firmen die Daten in mehreren Ländern, nennen Sie alle, mit Komma getrennt.»
- **P-4:** Prüfung erfolgreich: Die Meldung als Erfolgshinweis mit Symbol zeigen und ergänzen: «Noch nicht gespeichert: Tippen Sie auf «KI speichern».»
- **P-5:** Auf /config die Karte «KI» neben dem Text antippen: nichts passiert. Hilfe: Die ganze Karte als einen Link gestalten, benannt nach «KI» (gilt auch für die anderen Karten).
- **P-6:** Speichern mit fehlendem Land und Häkchen: Nur der erste Fehler ist sichtbar. Hilfe: Neben «KI speichern» eine kurze Zusammenfassung («Es fehlen 2 Angaben: Land, Bestätigung»).

## Nicht geprüft

- Erfolgreiches Speichern eines Anbieters (auftragsgemäss nicht, eine andere Persona speichert auf dieser Seite).
- Die Wahl von «Lokale KI» oder «Keine KI» speichern, «KI-Modell herunterladen» (würde den gemeinsamen Zustand ändern).
- Wie P-1 aussieht, wenn noch nie ein Anbieter gespeichert wurde (der Zustand war durch die andere Persona schon belegt).
- Dunkelmodus und andere Sprachen.
