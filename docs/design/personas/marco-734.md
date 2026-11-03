# Marco – PDF einer gelöschten Abrechnung (#734)

Mobile 390 × 844, Touch, Persona-Stack auf :3300 (Demodaten). Gearbeitet nur im Gebäude «Seepark Residenz». Gelöscht habe ich selbst: den Entwurf 2025 von Nina Brunner (NK-22222222-2025-0003) und den Entwurf 2025 von Sarah Meier (NK-22222222-2025-0002).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Seite «Abrechnung nicht gefunden» (vom Detail aus) | «Zu den Nebenkostenabrechnungen» führt auf die ungefilterte Liste (alle Status, «Alle Gebäude»). Ich kam aus der Liste mit «Entwurf» und «Seepark Residenz» und musste beide Filter neu setzen. Der Weg von der Listenzeile behält den Filter, der vom Detail nicht. |
| P-2 | Minor | Seite «Abrechnung nicht gefunden» (beide Wege) | Die Seite sagt nicht, welche Abrechnung fehlt (kein Mieter, keine Nummer). Mit zwei offenen Tabs auf dem Handy war ich kurz unsicher, ob ich die richtige gelöscht habe. |

## Beobachtungen

- Die Seite sieht aus wie Dwello: gleicher Kopf mit Menü, Logo, Sprache und Benutzermenü, Illustration Haus mit Warndreieck, Fusszeile. Im Dunkelmodus sauber, Warndreieck gelb, Text gut lesbar.
- Tab-Titel «Abrechnung nicht gefunden - Dwello» nennt das Problem.
- Text «Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.» ist kurz und verständlich. Was zu tun ist, sagt er nicht ausdrücklich; der grosse Knopf darunter reicht mir aber.
- Kein seitliches Scrollen: scrollWidth = clientWidth = 390 auf beiden Varianten.
- Der Knopf ist gross genug zum Tippen (gemessen 326 × 68 px). «Zu den Nebenkostenabrechnungen» bricht auf zwei Zeilen um, liest sich aber gut.
- Die beiden Varianten heissen verschieden: von der Liste «Zurück», vom Detail «Zu den Nebenkostenabrechnungen». Beide passen zum Ziel; «Zu den Nebenkostenabrechnungen» sagt mir mehr.
- Die Browser-Zurück-Geste führt in beiden Fällen auf die gefilterte Liste (Entwurf, Seepark Residenz), nicht auf die gelöschte Detailseite. Das ist gut.
- Das PDF öffnet im selben Tab (kein neuer Tab, kein Download). So stand die Fehlerseite direkt an Stelle der Liste.
- Der Löschdialog nennt Nummer und Mieter («Die Abrechnung NK-22222222-2025-0003 von Nina Brunner wird gelöscht. Das lässt sich nicht rückgängig machen.»). Nach dem Löschen landet Tab 2 auf /statements.
- Die Zahlen in den Status-Kacheln änderten sich während meines Laufs auch ausserhalb von Seepark (andere Personas speichern gleichzeitig); nicht als Befund gezählt.
- In der gefilterten Adresse steht ein leeres «search=»; stört nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 14 Schritte (Menü, Filter Entwurf, Gebäude wählen, Suchen, zweiter Tab, Detail, Löschen, Bestätigen, PDF in Tab 1, Zurück; dann Detail Sarah, zweiter Tab löschen, PDF im Detail, Weg zurück).

## Ablauf

- Schritt 4, «Zu den Nebenkostenabrechnungen» auf der Fehlerseite vom Detail aus. Erwartet: zurück in meine gefilterte Liste (Entwurf, Seepark Residenz) wie bei Nina. Gesehen: Liste mit «Alle Gebäude», ohne Status-Filter, 13 Abrechnungen; ganz oben eine ältere Abrechnung von Sarah Meier (2024), die ich kurz für die gelöschte hielt.
- Schritt 3 und 4, Fehlerseite. Erwartet: Name oder Nummer der Abrechnung, die fehlt. Gesehen: nur «Diese Abrechnung gibt es nicht mehr.»

## Vorschläge

- **P-1:** Nebenkostenabrechnungen > Kachel «Entwurf» > Gebäude «Seepark Residenz» > Suchen > Zeile «Sarah Meier» öffnen. In einem zweiten Tab dieselbe Abrechnung löschen. Im ersten Tab «PDF herunterladen» tippen > «Zu den Nebenkostenabrechnungen». Hilfreich wäre, wenn der Knopf zur Liste mit dem Filter führt, aus dem ich das Detail geöffnet habe (wie es der Weg aus der Listenzeile schon tut).
- **P-2:** Gleiche Schritte, oder aus der Listenzeile von Nina Brunner. Hilfreich wäre ein Satz mit der Nummer, sofern bekannt, z. B. «Die Abrechnung NK-22222222-2025-0003 gibt es nicht mehr.»

## Nicht geprüft

- Ob ein echtes Handy-Browser-PDF (Download-Leiste) anders reagiert: headless Chromium öffnet den Link im selben Tab, ein Download kam nicht.
- Andere Sprachen (fr/it/en): die Sprache hängt am Konto und andere Personas laufen gleichzeitig.
- Den Fall «Detail mit Filter» über die Brotkrume der Detailseite habe ich nicht verglichen, weil Sarahs Entwurf danach gelöscht war und ich keine weiteren Abrechnungen löschen sollte.
