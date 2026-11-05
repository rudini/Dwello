# Sven – #664: Ergebnis von «Entwürfe erstellen» und Ablehnung beim Beenden eines Mietvertrags

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur (Tab, Shift+Tab, Enter, Leertaste, Tippen), beurteilt am Accessibility-Baum (`readOut`), Fokus über `document.activeElement`, Ansagen über die Live-Regionen (`role=status`, `role=alert`, `aria-live`), die ich während der Aktion mitgeschrieben habe.

Gespeichert: zwei Entwürfe in «Alpenblick», Abrechnungsperiode 01.01.2025 – 31.12.2025 (Laura Keller, Kevin Fischer). In «Musterhaus Zentrum» nichts gespeichert und nichts gelöscht.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Abrechnungen erstellen, Schritt 5 nach «Entwürfe erstellen» | Das Ergebnis «2 Nebenkostenabrechnungen sind als Entwurf erstellt.» wird mir nicht sicher angesagt. Der Fokus springt auf die Überschrift «Schritt 5 von 5: Erstellen», die genau gleich heisst wie vorher. Das Ergebnis steht in einer Statusmeldung, die erst mit dem Text erscheint; in einer schon vorhandenen Live-Region ändert sich kein Text. Angesagt wurde nur «Entwürfe werden erstellt …», danach wurde diese Meldung leer. Das Ergebnis finde ich erst, wenn ich nach der Überschrift weiterlese (eine Zeile). |
| P-2 | Minor | Mietvertrag von Anna Schmidt, Dialog «… beenden?», Ablehnung | Die Ablehnung nennt den Entwurf nur mit seiner Nummer: «Die Nebenkostenabrechnung NK-11111111-2025-0002 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet.» Auch der Link heisst nur «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen (öffnet in neuem Tab)». Mieter und Abrechnungsperiode fehlen. Das Jahr 2025 steckt in der Nummer, aber der Screenreader liest mir eine lange Ziffernfolge vor. Beim Knopf «Entwurf löschen und Mietvertrag beenden» weiss ich deshalb nicht sicher, welcher Entwurf gelöscht wird, ausser ich öffne einen neuen Tab. |

## Beobachtungen

- Die Ablehnung selbst ist gut zugänglich: Sie steht in einer `role=alert` und wurde angesagt («Das hat nicht geklappt …»), und der Fokus liegt auf dieser Meldung. Kurz danach kam aber noch eine Ansage «Mietvertrag - Anna Schmidt - Dwello» (Seitentitel). Je nach Screenreader kann sie die Fehlermeldung unterbrechen.
- Nach der Ablehnung bleibt im Dialog neben «Entwurf löschen und Mietvertrag beenden» auch «Mietvertrag beenden» stehen. Dann gibt es zwei Knöpfe, die beenden heissen; der zweite kann nach meinem Verständnis nur wieder abgelehnt werden.
- Warnung zum Vertragsende in der Vergangenheit: Es wird nichts live angesagt, aber der Fokus springt auf das Kästchen «Der Mietvertrag endete am 31.08.2025.». Sein Hinweis («Bitte bestätigen Sie …» und die Folgen ab 01.09.2025) wird als Beschreibung vorgelesen. Das ging gut.
- «Abbrechen» schliesst den Dialog, und der Fokus kommt auf «Beenden» zurück. Das ist gut.
- Bei «Entwürfe erstellen» springt der Fokus bei jedem Schritt auf die Überschrift «Schritt n von 5: …», und die Fortschrittsliste nennt die erledigten Schritte mit ihrem Wert («Gebäude Alpenblick (erledigt)»). So behalte ich gut die Übersicht.
- In Schritt 4 ist der Hinweis zu fehlenden Rechnungen (Kaminfeger, Kaltwasser 2. Halbjahr) eine Liste mit dem Namen «Alpenblick». Das Kästchen «Die Abrechnungen trotzdem erstellen» war mit Tab schnell erreichbar.
- Nach einem Seitenwechsel (Klick auf einen Link) liegt der Fokus auf `body`. Angesagt wird der Seitentitel; das ist üblich.
- Der Hinweis in Schritt 3 zum Heizprofil ist ein einziger sehr langer Absatz. Zum Vorlesen ist er schwer, hat mich aber nicht aufgehalten.

## Aufgabe geschafft: ja

Beide Teile sind erledigt: In «Alpenblick» sind die Entwürfe für 2025 erstellt. In «Musterhaus Zentrum» kam die Ablehnung, und ich habe abgebrochen, ohne etwas zu löschen.

## Aufwand

Etwa 15 Minuten. Teil 1: 5 Schritte im Assistenten, etwa 55 Tab-Drücke, 1 Kästchen für die Warnung. Teil 2: Gebäude → Wohnung 1.02 → Mietvertrag → Beenden, Datum tippen, zweimal absenden, einmal bestätigen, Abbrechen; etwa 25 Tab-Drücke.

## Ablauf

- Schritt 5, «Entwürfe erstellen» mit Enter. Erwartet: Eine Ansage «2 Nebenkostenabrechnungen … erstellt» oder ein Fokus auf dem Ergebnis. Gesehen: Angesagt wurde nur «Entwürfe werden erstellt …». Danach lag der Fokus auf der unveränderten Überschrift «Schritt 5 von 5: Erstellen». Die Meldung «2 Nebenkostenabrechnungen sind als Entwurf erstellt.» stand als neue Statusmeldung direkt darunter, die Links «Entwürfe ansehen», «Alle als ZIP herunterladen» und «Weitere Abrechnungen erstellen» danach (Screenshot `06-after.png`: Schritt 5 mit Erfolgsmeldung statt der Knöpfe).
- Mietvertrag beenden, zweites Absenden mit bestätigtem Datum. Erwartet: Eine Ablehnung, die den Entwurf mit Mieterin und Abrechnungsperiode nennt. Gesehen: Die Ablehnung wird angesagt, nennt aber nur «NK-11111111-2025-0002 (Entwurf)». Darunter stehen der Link mit derselben Nummer und «Der Entwurf NK-11111111-2025-0002 wird gelöscht.» (Screenshot `12-refusal.png`: Dialog mit roter Meldung, Link und dem Knopf zum Löschen).

## Vorschläge

- **P-1:** So stellt man es nach: «Abrechnungen erstellen» → 01.01.2025 – 31.12.2025 → «Alpenblick» → Weiter → «Die Abrechnungen trotzdem erstellen» → Weiter → «Entwürfe erstellen». Was hilft: Den Fokus auf die Erfolgsmeldung selbst setzen, zum Beispiel als Überschrift «2 Nebenkostenabrechnungen sind als Entwurf erstellt» mit `tabindex=-1`. Oder den Ergebnistext in dieselbe Live-Region schreiben, die vorher «Entwürfe werden erstellt …» angesagt hat, und den Fokus dabei nicht auf eine gleichlautende Überschrift setzen.
- **P-2:** So stellt man es nach: Musterhaus Zentrum → Wohnung 1.02 → «Mietvertrag von Anna Schmidt» → Beenden → 31.08.2025 → «Mietvertrag beenden» → Kästchen bestätigen → «Mietvertrag beenden». Was hilft: Den Entwurf in Meldung, Link und Löschhinweis mit Mieterin und Abrechnungsperiode nennen, zum Beispiel «Die Nebenkostenabrechnung von Anna Schmidt für 01.01.2025 – 31.12.2025 (Entwurf, NK-11111111-2025-0002) …». Den Link nach Mieterin und Periode benennen, die Nummer nur ergänzend.

## Nicht geprüft

- Ob ein echter Screenreader (NVDA, JAWS, VoiceOver) eine Statusmeldung ansagt, die schon mit Text eingefügt wird: Ich habe nur den Accessibility-Baum und die Änderungen in den Live-Regionen gesehen. Ein echter Screenreader steht mir hier nicht zur Verfügung.
- «Entwürfe erstellen» habe ich nicht ein zweites Mal ausgeführt, damit keine weiteren Entwürfe in Alpenblick entstehen. Darum habe ich nicht nachgeprüft, ob die Erfolgsmeldung als neues Element eingefügt wird. Ich schliesse es daraus, dass sich in keiner vorhandenen Live-Region ein Text änderte.
- «Entwurf löschen und Mietvertrag beenden» habe ich laut Auftrag nicht gedrückt.
