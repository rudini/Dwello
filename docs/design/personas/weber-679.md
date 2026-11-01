# Dr. Weber – #679: Entwurf löschen aus gefilterter Liste

Desktop 1440 × 900, Maus, Zoom 100 %. Gespeichert (gelöscht) nur in «Seepark Residenz». Skripte und Screenshots: `/tmp/weber-679/`.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Abrechnung (Detail) nach Löschen, per Zurück-Taste erreicht | Die Zurück-Taste führt nach dem Löschen auf die gelöschte Abrechnung; dort steht nur «Diese Seite gibt es nicht. Prüfen Sie die Adresse oder gehen Sie zur Übersicht.» Dass die Abrechnung gelöscht wurde, sagt die Seite selbst nicht; «Prüfen Sie die Adresse» unterstellt mir einen Tippfehler. Nur die noch sichtbare Meldung «Abrechnung NK-22222222-2025-0001 gelöscht» unten rechts erklärt es. Ohne diese Meldung (später, aus dem Verlauf) bleibt offen, ob ich mich vertan habe oder ob etwas schiefging. Der Entwurf erscheint aber nirgends als noch vorhanden. |

## Beobachtungen

- Der Bestätigungsdialog ist vorbildlich: «Die Abrechnung NK-22222222-2025-0001 von Thomas Weber wird gelöscht. Das lässt sich nicht rückgängig machen.» Nummer, Mieter und Folge sind genannt, die Knöpfe heissen «Abbrechen» und «Abrechnung löschen».
- Nach dem Löschen lande ich wieder auf der Liste mit derselben Adresse wie vorher (`?status=draft&search=&building=…2222`). «Entwurf» ist weiter hervorgehoben, im Feld Gebäude steht weiter «Seepark Residenz», und «Filter zurücksetzen» wird angezeigt. Die Zähler stimmen: «3 Entwurf», Überschrift «3 Abrechnungen», 3 Zeilen; die Zahlen der übrigen Status für Seepark sind unverändert (0 / 3 / 0 / 0). Vorher waren es 4. Ich habe nachgerechnet, es passt.
- Die Meldung «Abrechnung NK-22222222-2025-0001 gelöscht» (mit Schliessen-Knopf) war auf dem Bildschirmfoto direkt nach dem Laden der Liste noch nicht zu sehen, 6 Sekunden später schon. Sie blieb auch über den Seitenwechsel per Zurück-Taste stehen; wann sie von selbst verschwindet, habe ich nicht abgewartet. Sie liegt unten rechts über der dritten Zeile und verdeckt dort den Link «PDF» von Sarah Meier, bis ich sie schliesse.
- Nach dem Löschen lag der Fokus auf dem Seitenkörper, nicht auf der Meldung oder der Überschrift. Mit der Maus hat mich das nicht gestört.
- Zweimal zurück führt wieder zur gefilterten Liste mit 3 Entwürfen; der gelöschte Entwurf erscheint dort nicht wieder (kein veralteter Stand aus dem Zwischenspeicher).
- Der Brotkrümel «Nebenkostenabrechnungen» auf der Detailseite führt auf `/statements` ohne Filter. Wer eine Abrechnung nur ansieht und über den Brotkrümel zurückgeht, verliert also Status und Gebäude; nur der Weg über das Löschen behält sie.
- Der Seitentitel der Fehlerseite lautet «Fehler - Dwello», die Seite antwortet mit 404.
- Paging: Nur die ungefilterte Liste hat eine zweite Seite (15 Abrechnungen, «Seite 1 von 2», 10 + 5 Zeilen, «Nächste Seite» / «Vorherige Seite», Adresse `?page=2`). Die Zahlen sind plausibel. Kein gefilterter Stand hat eine zweite Seite (Entwurf 5, Bezahlt 9, Musterhaus Zentrum 7, Seepark Residenz 6, Alpenblick 2).
- In «Musterhaus Zentrum» und in der Gesamtzahl änderten sich die Zahlen zwischen meinen Durchgängen (7 → 5 Entwürfe gesamt, 17 → 15). Das passt zur gleichzeitig löschenden Persona und ist kein Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 7 Durchgänge. Vom Filtern bis zur Liste nach dem Löschen waren es etwa 7 Klicks (Status «Entwurf», Gebäude wählen, «Suchen», Zeile öffnen, «Abrechnung löschen», im Dialog bestätigen, zweimal Zurück).

## Ablauf

- Nach dem Löschen erwartet: sofort eine Bestätigung. Gesehen: Die Liste war sofort richtig gefiltert, die Meldung «… gelöscht» erschien aber erst kurz danach (auf dem ersten Bildschirmfoto fehlte sie, 6 s später war sie da).
- Zurück-Taste erwartet: Rückkehr zur Detailseite mit einem Hinweis «Diese Abrechnung wurde gelöscht», oder gleich die Liste. Gesehen: allgemeine Fehlerseite «Diese Seite gibt es nicht. Prüfen Sie die Adresse …», mit Knöpfen «Zurück» und «Zur Übersicht».
- Zweite Seite einer gefilterten Liste erwartet, falls es eine gibt. Gesehen: Es gibt keine, ich habe es übersprungen.

## Vorschläge

- **P-1:** Nebenkostenabrechnungen → Status «Entwurf» → Gebäude «Seepark Residenz» → «Suchen» → einen Entwurf öffnen → «Abrechnung löschen» → bestätigen → Zurück-Taste im Browser. Es hülfe, wenn die Weiterleitung nach dem Löschen den Verlaufseintrag der Detailseite ersetzte, sodass die Zurück-Taste nicht auf die gelöschte Abrechnung führt. Oder die Fehlerseite einer nicht mehr vorhandenen Abrechnung sagt «Diese Abrechnung gibt es nicht mehr. Sie wurde vielleicht gelöscht.» und verlinkt «Zu den Nebenkostenabrechnungen» statt «Prüfen Sie die Adresse».

## Nicht geprüft

- Paging nach dem Löschen in einer gefilterten Liste: Keine gefilterte Liste hat eine zweite Seite (höchstens 9 Einträge). Die zweite Seite der ungefilterten Liste enthält nur bezahlte Abrechnungen von 2024, also keine Entwürfe, die ich löschen dürfte.
- Wie lange die Meldung «… gelöscht» stehen bleibt und wie verzögert sie genau erscheint: Ich habe nur einen Entwurf gelöscht, wie verlangt, und keinen weiteren für eine Zeitmessung geopfert.
- Ein Fehlschlag beim Löschen: nicht verlangt, also nicht simuliert.
