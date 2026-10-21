# Dr. Weber – Slice 503: PDF einer Abrechnung, wenn der Ort der Firmenadresse fehlt

Desktop 1440 × 900, Maus. Ausgangslage (vom Aufrufer vorbereitet): In den Einstellungen fehlt der Ort der Firmenadresse; die Entwürfe der Demo hatten schon vorher ein PDF. Geprüft: Abrechnung NK-11111111-2025-0003, Pierre Dubois, Musterhaus Zentrum, Wohnung 2.01, Periode 2025, Entwurf, Nachzahlung CHF 142.35. Ich habe nichts gespeichert und die Einstellungen nicht geändert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/dr-weber-503/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungsdetail, Verlauf | Vor dem Öffnen behauptet die Seite, es gebe ein PDF («PDF herunterladen», im Verlauf «PDF erstellt 21.10.2026, 23:21»), obwohl die Einstellungen es nicht mehr zulassen. Nach dem verweigerten Öffnen fehlt der Verlaufseintrag «PDF erstellt» kommentarlos, und der Verlauf nennt auch den verweigerten Versuch nicht. Ein Verlauf, aus dem Einträge verschwinden, ist für mich als Nachweis nicht brauchbar. |
| P-2 | Minor | Abrechnungsdetail nach dem Neuladen | Nach dem Neuladen steht dort nur «PDF erstellen» (darunter «PDF auf Französisch»). Dass und warum das PDF fehlt und dass zuerst die Einstellungen zu ergänzen sind, steht nirgends. Ich erfahre es erst, wenn ich nochmals klicke. |
| P-3 | Minor | Fehlerseite `/statements/<id>/pdf` | «PDF herunterladen» führt auf eine nackte Seite: schwarzer Text auf Weiss, keine Navigation, kein Titel, kein Weg zurück zu *dieser* Abrechnung (nur «Zu den Nebenkostenabrechnungen» und «Zu den Einstellungen»). Der Text selbst ist verständlich. |
| P-4 | Minor | Fehlermeldung (Seite und Hinweis) und Einstellungen | Die Meldung sagt «Ergänzen Sie Name, PLZ und Ort», obwohl Firmenname und PLZ ausgefüllt sind und nur der Ort fehlt. In den Einstellungen ist das leere Feld «Ort» nicht markiert. Ich muss alle drei Felder selbst prüfen. |
| P-5 | Minor | Abrechnungsdetail, Fehlerhinweis nach «PDF erstellen» | Der Hinweis unten rechts nennt «Einstellungen», hat aber keinen Link dorthin. Die Fehlerseite aus P-3 hat einen. |

## Beobachtungen

- Die Übersicht (Dashboard) sagt nichts über die unvollständige Firmenadresse. Sie schlägt «Abrechnungen prüfen und versenden» vor (7 Entwürfe), obwohl mindestens die Nachzahlungen gar kein PDF bekommen können.
- In der Liste der Entwürfe hat Pierre Dubois nach dem Versuch statt «PDF» den Text «PDF noch nicht erstellt», und der führt auf die Detailseite. Das ist richtig. «Noch nicht» klingt aber, als hätte ich etwas versäumt, nicht als würde Dwello es verweigern. Die anderen Nachzahlungen (Marco Bernasconi, Sarah Meier, Maria Rossi) zeigen weiterhin einen «PDF»-Link. Vermutlich laufen sie in dieselbe Verweigerung, das habe ich aber nicht geöffnet.
- Neben «PDF herunterladen» steht kein Sprachhinweis. Neben «PDF erstellen» steht «PDF auf Französisch». Das ist eine nützliche Angabe, die aber nur im zweiten Zustand erscheint.
- «Per E-Mail senden» bleibt die Hauptaktion und ist aktiv, obwohl kein PDF erstellt werden kann.
- Der Fehlerhinweis nach «PDF erstellen» bleibt stehen (nach 12 Sekunden noch sichtbar) und kann geschlossen werden. Das ist gut für jemanden, der alles liest.
- Die Hilfe beim Feld IBAN in den Einstellungen sagt bereits «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Das ist richtig, aber erst dort zu finden.
- Netzwerk: Das Öffnen über «PDF herunterladen» ergibt `400 GET /statements/<id>/pdf` (HTML-Seite), und «PDF erstellen» ergibt `400 POST /api/statements/<id>/generate-pdf`.

## Aufgabe geschafft: teilweise

Ich weiss nach dem ersten Versuch, was zu tun ist: den Ort in den Einstellungen ergänzen. Das PDF selbst konnte ich nicht prüfen, weil es verweigert wurde, und das ist so gewollt. Die Detailseite hat mir aber zuerst etwas Falsches gesagt (P-1) und sagt nach dem Neuladen nichts mehr (P-2).

## Aufwand

Etwa 10 Minuten, 9 Schritte: Übersicht, Entwürfe, Detailseite, PDF herunterladen, zurück, Neuladen, PDF erstellen, Neuladen, Einstellungen ansehen.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, dass die Absenderangaben unvollständig sind. Gesehen: kein solcher Hinweis, nur «7 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.» und «Entwürfe ansehen».
2. **Entwürfe (`/statements?status=draft`).** 7 Zeilen, jede mit «PDF». Pierre Dubois: NK-11111111-2025-0003, Nachzahlung CHF 142.35, Entwurf, «PDF». Erwartet: ein Hinweis, dass das PDF nicht mehr stimmt oder nicht erstellbar ist. Gesehen: keiner.
3. **Detailseite (Screenshot `03-detail.png`).** Oben die Knöpfe «PDF herunterladen» und «Per E-Mail senden». Verlauf: «Erstellt 21.10.2026, 23:21», «PDF erstellt 21.10.2026, 23:21». Die Kostenaufstellung ist nachvollziehbar: Zwischensumme 3’283.86, 3 % Pauschale 98.52, Nebenkosten 3’382.38, Akonto −3’240.00, vor Rundung 142.38, Rundung −0.03, Saldo 142.35. Ich habe es nachgerechnet, es stimmt. Erwartet: ein Hinweis, dass ein PDF mit Zahlteil derzeit nicht möglich ist. Gesehen: Die Seite tut, als sei alles bereit.
4. **«PDF herunterladen» angeklickt (Screenshot `04-after-click.png`).** Erwartet: das PDF oder eine Fehlermeldung auf der Detailseite. Gesehen: Die Adresse wechselt auf `/statements/<id>/pdf`, und es erscheint eine leere weisse Seite ohne App-Rahmen mit dem Text «Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».» sowie den Links «Zu den Nebenkostenabrechnungen» und «Zu den Einstellungen». Einen Link zurück zur Abrechnung gibt es nicht.
5. **Zurück zur Detailseite und neu laden (Screenshot `06-top.png`).** Erwartet: die gleichen Angaben wie vorher oder ein Hinweis auf den verweigerten Versuch. Gesehen: Statt «PDF herunterladen» steht jetzt «PDF erstellen» mit «PDF auf Französisch» darunter. Im Verlauf steht nur noch «Erstellt 21.10.2026, 23:21»; «PDF erstellt» ist weg. Eine Erklärung gibt es nicht.
6. **«PDF erstellen» angeklickt (Screenshot `07-after-create.png`).** Erwartet: eine Fehlermeldung mit Weg zur Lösung. Gesehen: unten rechts ein roter Hinweis «PDF konnte nicht erstellt werden: Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».» mit Schliessen-Kreuz und ohne Link. Er bleibt stehen.
7. **Neu laden.** Gleich wie in Schritt 5: kein Hinweis, Verlauf nur «Erstellt».
8. **Liste der Entwürfe (Screenshot `09-list-after.png`).** Bei Pierre Dubois steht jetzt «PDF noch nicht erstellt» (Link auf die Detailseite). Die anderen Zeilen zeigen weiter «PDF».
9. **Einstellungen nur angesehen (Screenshot `10-config.png`).** Firmenname «Muster Immobilien AG», Strasse «Bahnhofstrasse 1», PLZ «8001», Ort leer, IBAN gesetzt. Das leere Feld «Ort» ist nicht hervorgehoben. Ich habe nichts gespeichert.

## Verwirrung

- «Firmenadresse» in der Meldung, aber «Absender» als Abschnittstitel in den Einstellungen und «Firmenname» als Feld. Ich als Privatvermieter habe keine Firma. Nach etwas Suchen ist klar, dass der Abschnitt «Absender» gemeint ist.
- «Zahlteil»: Ich verstehe es als den QR-Zahlteil der Nachzahlung, auf der Detailseite heisst der Abschnitt aber «Zahlung». Ein Satz wie «Für die QR-Rechnung der Nachzahlung …» wäre eindeutiger.
- Weshalb verschwindet ein Verlaufseintrag? Ich weiss jetzt nicht, ob das frühere PDF gelöscht wurde, und ob es irgendwo noch eine Fassung gibt, die ein Mieter hätte erhalten können.
- «PDF noch nicht erstellt» in der Liste, obwohl es vorher erstellt war.

## Fehlerrisiken

- Wer die Detailseite in Schritt 3 liest, glaubt, das PDF sei bereit, und versendet vielleicht per E-Mail. Was dann passiert, habe ich nicht geprüft.
- Weil der Verlauf Einträge verliert, kann ich später nicht belegen, wann ein PDF existierte.
- Weil die Meldung drei Felder nennt, ändert jemand womöglich einen korrekten Firmennamen oder eine korrekte PLZ.
- Die übrigen Nachzahlungen zeigen weiterhin «PDF». Wer die Liste durchgeht, merkt das Problem nur Zeile für Zeile.

## Vorschläge

- **P-1:** Einstellungen ohne Ort, Entwurf mit früherem PDF öffnen: Die Detailseite zeigt «PDF herunterladen» und den Verlaufseintrag «PDF erstellt». Anklicken, zurück, neu laden: Der Eintrag ist weg. Hilfreich wäre, wenn die Detailseite schon beim Laden sagt, dass das PDF wegen der unvollständigen Absenderangaben nicht erstellt werden kann. Der Verlauf sollte Einträge behalten und den verweigerten Versuch mit Grund ergänzen (zum Beispiel «PDF nicht erstellt: Ort des Absenders fehlt»).
- **P-2:** Nach Schritt 5 neu laden. Hilfreich wäre ein bleibender Hinweis oberhalb der Knöpfe: «Für diese Nachzahlung kann Dwello kein PDF erstellen: In den Einstellungen fehlt der Ort des Absenders.» mit dem Link «Einstellungen öffnen».
- **P-3:** Auf der Detailseite «PDF herunterladen» anklicken. Hilfreich wäre die Meldung im gewohnten App-Rahmen mit Titel und einem Link «Zurück zur Abrechnung NK-11111111-2025-0003», oder gleich die Meldung auf der Detailseite statt eines Seitenwechsels.
- **P-4:** Meldung lesen und Einstellungen öffnen. Hilfreich wäre, nur das fehlende Feld zu nennen («Es fehlt der Ort.») und es in den Einstellungen zu markieren.
- **P-5:** Auf der Detailseite «PDF erstellen» anklicken. Hilfreich wäre der Link «Zu den Einstellungen» auch im Hinweis.

## Nicht geprüft

- «Per E-Mail senden»: Das hätte bei Erfolg eine Mail ausgelöst und den Status geändert, und die Aufgabe sagt «nichts speichern».
- Das PDF selbst: Es wurde verweigert. Ob eine Rückerstattung (ohne Zahlteil) weiterhin ein PDF bekommt, habe ich nicht geöffnet. Es gehört nicht zur Aufgabe und hätte dort einen Verlaufseintrag erzeugen können.
- Das Verhalten nach dem Ergänzen des Orts, weil ich die Einstellungen nicht ändern sollte.
- Die anderen Nachzahlungen der Liste, um ihre Verlaufseinträge nicht zu verändern.
