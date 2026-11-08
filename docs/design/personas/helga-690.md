# Helga – #690: fehlende Adresse bei IBAN (Einstellungen, Abrechnung)

Desktop 1440 × 900, Zoom 150 %, Maus. Persona-App auf :3300 (Branch w-690). Gespeichert habe ich nur in den Einstellungen (globale Einstellung, laut Auftrag erlaubt); am Ende steht wieder die Adresse der Demo-Daten mit IBAN darin.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Minor | Einstellungen, abgelehntes Speichern | Der rote Kasten «Die Einstellungen wurden nicht gespeichert» / «Keine Änderung wurde gespeichert, auch nicht in den anderen Feldern.» sagt, was passiert ist, aber nicht warum und nicht, was ich tun soll. Er steht ganz unten beim Knopf; die Ursache steht weit oben unter der IBAN. |
| H-2 | Minor | Einstellungen, Feld «Ort» nach dem Speichern | Nach dem Speichern springt die Seite zum Feld «Ort», es ist rot umrandet, aber dort steht kein Text dazu. Die Erklärung steht erst ein Stück weiter unten unter «IBAN» («Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.»). Auf dem Bildschirm sehe ich ein leeres, rotes Feld und weiss nicht, was falsch ist. Dazu nennt der Satz «Name, PLZ und Ort», obwohl nur der Ort fehlt, und das Feld heisst «Firmenname», nicht «Name». |
| H-3 | Major | Abrechnung, Warnung zur fehlenden Adresse | Den Zustand «IBAN da, Ort fehlt» kann ich gar nicht herstellen: Die Einstellungen lehnen jedes Speichern ab, das ihn erzeugen würde (3 Versuche, siehe Ablauf). Darum habe ich die neue Warnung auf der Abrechnung mit «Zu den Einstellungen» und die Markierung beim Öffnen der Einstellungen nie gesehen. Schritt 2 der Aufgabe war nicht möglich. (Für den Aufrufer: Vermutlich braucht dieser Zustand eine SQL-Vorbereitung vor dem Start. Das ist dann eher eine Lücke im Testaufbau als ein Fehler der App.) |

## Beobachtungen

- Der rote Kasten hat einen Ausruf-Kreis, eine fette rote Überschrift und einen roten Balken links. Das ist auch bei 150 % gut lesbar. Der Kasten ist als Warnung («alert») ausgezeichnet.
- Der zweite Satz «Keine Änderung wurde gespeichert, auch nicht in den anderen Feldern.» hat mich beruhigt: So weiss ich, dass ich meine anderen Eingaben nicht noch einmal prüfen muss. Nach dem Neuladen stand wirklich wieder «Zürich» drin.
- Die Hilfe beim Feld IBAN sagt schon vorher: «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Gut so, nur ist der Text so lang, dass ich diesen Satz am Schluss leicht überlese.
- Wenn ich das Häkchen «Kontoinhaber ist der Absender» entferne und die Adresse des Kontoinhabers vollständig eintrage, verlangt Dwello trotzdem den Ort des Absenders. Mit derselben Meldung «… Firmenadresse …» hat mich das kurz verwirrt, weil das Konto ja jetzt eine eigene, vollständige Adresse hatte.
- Nach dem Speichern meldet Dwello «Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» Die IBAN («Konto») wird in der Aufzählung nicht genannt, obwohl ich gerade sie geändert hatte.
- Ohne IBAN zeigt die Abrechnung keine Warnung. Das passt, denn dann gibt es keinen Zahlteil.
- Das PDF von Hans Müller (NK-11111111-2025-0001) hat Absender, Ort und den Satz «Bitte bezahlen Sie den Betrag bis 28.10.2026 mit dem Zahlteil.»
- In der Fusszeile steht «Version unbekannt».

## Aufgabe geschafft: teilweise

Schritt 1 (Ort leeren und speichern) und Schritt 3 (PDF erzeugen) haben geklappt. Schritt 2 (die Warnung auf der Abrechnung lesen und dem Link folgen) war nicht möglich, weil ich den nötigen Zustand nicht speichern konnte (H-3).

## Aufwand

Etwa 20 Minuten, rund 10 Durchgänge: Einstellungen öffnen, 4 Speicherversuche, Abrechnungsliste, Abrechnung Hans Müller (zweimal), Adresse wieder eintragen, PDF herunterladen.

## Ablauf

1. **Ort leeren und speichern.** Erwartet: Dwello sagt mir beim Ort, dass er fehlt, und was ich tun soll. Gesehen: Die Seite springt zum Feld «Ort». Es ist rot umrandet und hat den Fokus, aber dort steht kein Text dazu (H-2). Erst beim Herunterscrollen finde ich unter IBAN die rote Zeile und ganz unten beim Knopf den roten Kasten ohne Hinweis darauf, was zu tun ist (H-1).
2. **Abrechnung mit offenem Betrag öffnen (Hans Müller, überfällig).** Erwartet: eine Warnung, dass die Adresse fehlt, mit «Zu den Einstellungen». Gesehen: keine Warnung, weil die Einstellungen den leeren Ort nie gespeichert hatten.
3. **Versuch 2:** Häkchen «Kontoinhaber ist der Absender» entfernt, die Adresse des Kontoinhabers vollständig eingetragen, Ort des Absenders leer. Erwartet: Das wird gespeichert. Gesehen: abgelehnt, mit derselben Meldung.
4. **Versuch 3:** IBAN und Ort geleert und gespeichert (das ging). Danach die IBAN wieder eingetragen. Erwartet: Ich komme so zu «IBAN da, Ort fehlt». Gesehen: wieder abgelehnt. Auf der Abrechnung ohne IBAN gibt es keine Warnung.
5. **Adresse in Ordnung bringen:** Ort «Zürich» und IBAN wieder eingetragen, gespeichert. Danach habe ich das PDF heruntergeladen. Das ging wie erwartet.

## Vorschläge

- **H-1:** Einstellungen öffnen (es ist eine IBAN da), «Ort» leeren, «Einstellungen speichern» klicken. Hilfreich wäre ein Satz im roten Kasten, der die Ursache und das Feld nennt, z. B. «Der Ort fehlt. Mit einer IBAN braucht es Firmenname, PLZ und Ort. Ergänzen Sie den Ort und speichern Sie erneut.», am besten mit einem Link, der zum Feld springt.
- **H-2:** Gleiche Schritte wie bei H-1. Die Fehlermeldung sollte direkt unter dem Feld stehen, das fehlt («Ort fehlt. Mit einer IBAN braucht es den Ort.»), und nicht nur unter IBAN. Sie sollte nur das fehlende Feld nennen und das Wort «Firmenname» wie die Beschriftung des Feldes verwenden.
- **H-3:** Den Zustand vor dem Start einer Persona herstellen (in `dwello_persona` den Ort des Absenders bei gesetzter IBAN leeren), damit man die Warnung auf der Abrechnung und die Markierung beim Öffnen der Einstellungen prüfen kann. Wenn der Zustand für echte Nutzer nur mit älteren Daten entsteht, sollte die Aufgabe das sagen.

## Nicht geprüft

- **Die Warnung auf der Abrechnung, ihr Text und der Link «Zu den Einstellungen».** Ich konnte den Zustand nicht erreichen (3 Versuche: Ort leer mit IBAN; abweichender Kontoinhaber mit vollständiger Adresse; erst ohne IBAN speichern und dann die IBAN wieder eintragen). Alle wurden abgelehnt.
- **Die Markierung des fehlenden Feldes direkt beim Öffnen der Einstellungen.** Aus demselben Grund nicht geprüft: Beim Neuladen nach einem abgelehnten Speichern steht wieder der gespeicherte Ort da.
- **Zoom 200 %:** nicht ausprobiert.

Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-690/` (05b-viewport.png: rotes Feld «Ort» ohne Text; 06-iban-fehler.png: Meldung unter IBAN; 07-banner.png: roter Kasten beim Knopf).

## Runde 2

Desktop 1440 × 900, Zoom 150 %, Maus. Vor dem Start hat der Koordinator den Ort des Absenders in der Datenbank geleert; die IBAN blieb gesetzt (der Zustand aus H-3). Geändert habe ich nur den Ort («Zürich»). Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-690/` (Dateien `r2-*`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-4 | Major | Einstellungen, geöffnet über «Zu den Einstellungen» (und über das Benutzermenü) | Die Seite öffnet ganz oben bei «Stammdaten», «KI», «Zugangsschlüssel», «Protokoll» und «Alle Daten exportieren». Im ersten Bildschirm steht nichts davon, dass etwas fehlt. Der Abschnitt «Absender» mit dem roten Feld «Ort» kommt erst nach gut zwei Bildschirmhöhen Scrollen. Ich komme von einer Warnung, klicke «Zu den Einstellungen» und lande bei Kacheln, die nichts mit der Adresse zu tun haben; ich dachte zuerst, ich sei falsch. Der Link springt nicht zum Absender und setzt den Fokus nicht auf das Feld. |
| H-5 | Minor | Einstellungen, Feld «Ort» beim Öffnen | Das Feld «Ort» ist schon beim Öffnen rot umrandet und leer, aber darunter steht kein Text (wie H-2 nach dem Speichern). Die Erklärung steht eine Bildschirmhöhe weiter unten unter «IBAN»: «Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.» Auch das Feld «IBAN» ist rot umrandet, obwohl an der IBAN nichts falsch ist. Ich hätte fast an der IBAN etwas geändert. |
| H-6 | Minor | Abrechnung NK-11111111-2025-0001, Warnung | Die Warnung «Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».» sagt nicht, was genau fehlt (nur der Ort; Firmenname und PLZ sind da), und nicht, was ohne Adresse mit dem PDF passiert. Das Wort «Zahlteil» kenne ich nicht sicher; ein Halbsatz wie «der Einzahlungsschein unten im PDF» würde mir helfen. «Name» heisst in den Einstellungen «Firmenname». |

### Beobachtungen

- Die Warnung auf der Abrechnung ist gut zu sehen: ein heller, gelblicher Kasten mit Warndreieck, fetter Schrift und dem unterstrichenen Link «Zu den Einstellungen», direkt unter dem Status «Überfällig» und über der Kostenaufstellung. Bei 150 % ist alles im ersten Bildschirm.
- Nach dem Speichern meldet Dwello «Einstellungen gespeichert» / «Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» Nach dem Neuladen stehen «Zürich» und die IBAN da.
- Zurück auf der Abrechnung ist die Warnung weg; zwischen «Status: Überfällig» und «Kostenaufstellung» steht nichts mehr.
- Das PDF (NK-11111111-2025-0001, 3 Seiten) nennt «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich» im Kopf, in der Fusszeile, beim Satz zur Einsicht in die Belege und auf Seite 3 im Zahlteil unter «Konto / Zahlbar an» mit der IBAN CH44 3199 9123 0008 8901 2.
- Die Warnung ist im Bildschirmleser ein gewöhnlicher Absatz, kein «alert»/«status». Für mich als Maus-Nutzerin hat das nicht gestört.
- Den Zustand vor dem Speichern habe ich nicht als PDF geprüft (die Aufgabe nannte das PDF erst nach dem Speichern).

### Aufgabe geschafft: ja

Alle vier Schritte gingen. Schritt 1 nur mit viel Scrollen (H-4).

### Aufwand

Etwa 10 Minuten, 4 Durchgänge: Einstellungen öffnen und durchscrollen, Abrechnung lesen, Link folgen, Ort eintragen und speichern, Abrechnung und PDF prüfen.

### Ablauf

1. **Einstellungen öffnen (Benutzermenü).** Erwartet: oben ein Hinweis, dass für den Zahlteil der Ort fehlt. Gesehen: oben nur «Stammdaten» mit drei Kacheln und «KI»; erst nach gut zwei Bildschirmhöhen der Absender mit leerem, rot umrandetem «Ort» ohne Text (H-4, H-5).
2. **Abrechnung Hans Müller 2025 lesen.** Erwartet: eine Warnung, die sagt, dass der Ort fehlt. Gesehen: «… fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort …», obwohl Name und PLZ da sind (H-6).
3. **«Zu den Einstellungen».** Erwartet: Die Seite öffnet beim Absender oder beim Feld «Ort». Gesehen: ganz oben, Fokus nirgends, wie beim normalen Öffnen (H-4).

### Vorschläge

- **H-4:** Ort leer, IBAN gesetzt; Abrechnung NK-11111111-2025-0001 öffnen, «Zu den Einstellungen» klicken. Hilfreich: Der Link springt direkt zum Abschnitt «Absender» (oder setzt den Fokus auf «Ort»), und beim Öffnen der Einstellungen steht oben ein Hinweis «Für die QR-Rechnung fehlt der Ort des Absenders» mit einem Link zum Feld.
- **H-5:** Gleiche Ausgangslage, Einstellungen öffnen. Hilfreich: der Text direkt unter «Ort» («Der Ort fehlt. Mit einer IBAN braucht es ihn für die QR-Rechnung.»), und die IBAN nicht rot umranden, wenn an ihr nichts falsch ist.
- **H-6:** Gleiche Ausgangslage, Abrechnung öffnen. Hilfreich: die Warnung nennt das fehlende Feld («Für den Zahlteil fehlt der Ort des Absenders.») und sagt, was der Zahlteil ist und was ohne ihn im PDF passiert.

### Nicht geprüft

- **Zoom 200 %:** nicht ausprobiert.
- **Das PDF im Zustand ohne Ort:** nicht heruntergeladen, weil die Aufgabe nur das PDF nach dem Speichern nennt.
- **Mahnung senden im Zustand ohne Ort:** nicht ausprobiert, weil es eine Mahnung verschicken würde und die Aufgabe nichts anderes zu ändern erlaubt.
