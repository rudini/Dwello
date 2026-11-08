# Marco – Wohnung löschen auf dem Handy (#1257)

Persona: Marco, 38, Handy 390 × 844, Touch. Gebäude: «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/af7b8d5a-bf30-59c8-8e16-91d2a20ee4e8/scratchpad/marco-1257/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnung B1, Dialog «Wohnung B1 löschen?» | Der Dialog sagt «Löschen Sie die Wohnung nur, wenn sie irrtümlich erfasst wurde.» Meine B1 wurde nicht irrtümlich erfasst, sondern bei der Renovation mit einer anderen zusammengelegt. Ich habe kurz gezögert, ob ich überhaupt löschen darf. Erst der nächste Satz («Gibt es die Wohnung, bleibt sie im Gebäude …») hat mir gezeigt: B1 gibt es nicht mehr, also darf sie weg. Der Fall «gibt es nicht mehr» (zusammengelegt, abgebrochen) wird nicht genannt. |

## Beobachtungen

- Der Weg war kurz: Übersicht → «3 Gebäude» → «Seepark Residenz» → «Wohnung B1» → «Löschen» → «Wohnung löschen». Die Löschen-Schaltfläche ist rot, klein und unter den anderen Aktionen, also schwer aus Versehen zu treffen.
- Der Bestätigungsdialog nennt die Wohnung im Titel («Wohnung B1 löschen?»), sagt «endgültig» und «nicht rückgängig», und die rote Schaltfläche heisst «Wohnung löschen», nicht nur «OK». Gut.
- Der zweite Absatz ist auf dem Handy lang (7 Zeilen). Der Hinweis, dass Dwello die Nebenkosten danach nur noch auf die übrigen Wohnungen verteilt, «auch wenn Sie eine Abrechnung neu berechnen oder berichtigen», ist wichtig, aber ich musste ihn zweimal lesen. Bei Seepark sind 2021–2023 noch nicht abgerechnet; ob das für diese Jahre richtig ist, hängt davon ab, wann zusammengelegt wurde. Das sagt mir der Dialog nicht, und ich weiss nicht, was ich in dem Fall tun soll.
- Nach dem Löschen lande ich auf der Gebäudeseite mit der Meldung «Wohnung B1 gelöscht» unten. B1 ist aus der Liste weg, «Wohnungen: 3, davon 3 vermietet und 0 leer» stimmt. Direkt unter dem Titel steht dort die rote Schaltfläche «Löschen» für das ganze Gebäude; im ersten Moment dachte ich, das sei noch das Löschen der Wohnung.
- Die alte Adresse von B1 zeigt danach «Diese Seite gibt es nicht.» mit «Zurück» und «Zur Übersicht». In Ordnung.
- Wohnung A2: Bei «Löschen» kommt kein Bestätigungsdialog, sondern gleich «Wohnung kann nicht gelöscht werden» mit Begründung (hat Mietverträge, auch beendete bleiben als Historie) und was ich tun könnte. Es wurde dabei nichts an den Server geschickt (keine Anfrage im Netzwerk gesehen). «Schliessen» schliesst den Dialog, A2 ist unverändert da.
- Auf A2 ist die Schaltfläche «Löschen» genauso aktiv wie bei B1; ich erfahre erst nach dem Tippen, dass es nicht geht. Hat mich nicht gestört, die Erklärung ist klar. Der Dialogtitel nennt die Wohnung nicht («Wohnung kann nicht gelöscht werden»), anders als beim Löschdialog von B1.
- Der Satz «Wurde ein Mietvertrag irrtümlich erfasst, löschen Sie ihn auf seiner Seite» hat keinen Link; die Mietverträge stehen aber direkt darunter auf der Seite.

## Aufgabe geschafft: ja

B1 gelöscht, A2 geprüft und nicht gelöscht, sonst nichts gelöscht (Gebäude zeigt A1, A2, B2).

## Aufwand

Etwa 3 Minuten, 6 Tipps bis B1 gelöscht war, 3 weitere für A2 (Wohnung öffnen, «Löschen», «Schliessen»).

## Ablauf

- B1, Dialog lesen. Erwartet: eine kurze Rückfrage «Wirklich löschen?». Gesehen: ein langer Text, der mich auf «irrtümlich erfasst» festlegt, was für eine zusammengelegte Wohnung nicht passt (P-1). Nach dem zweiten Absatz entschieden, trotzdem zu löschen.
- Nach dem Löschen. Erwartet: zurück auf der Wohnungsliste. Gesehen: Gebäudeseite «Seepark Residenz» mit Erfolgsmeldung; passt sogar besser, aber das rote «Löschen» oben gehört hier zum Gebäude.
- A2, «Löschen». Erwartet: derselbe Bestätigungsdialog wie bei B1, vielleicht mit Warnung. Gesehen: sofort die Absage «Wohnung kann nicht gelöscht werden» mit Grund. Gut so.

## Vorschläge

- P-1: Gebäude «Seepark Residenz» → «Wohnung B1» → «Löschen». Im Dialog den ersten Hinweis erweitern, etwa: «Löschen Sie die Wohnung nur, wenn sie irrtümlich erfasst wurde oder es sie nicht mehr gibt, zum Beispiel weil sie mit einer anderen zusammengelegt wurde.» Dann passt der Text auch auf meinen Fall, und der Satz danach («Gibt es die Wohnung, bleibt sie …») bleibt die Abgrenzung zur leeren Wohnung.

## Nicht geprüft

- Wie sich das Löschen von B1 auf eine Nebenkostenabrechnung von Seepark auswirkt (2021–2023 offen): ich habe keine Abrechnung erstellt, das war nicht Teil der Aufgabe.
- Fehlschlagen des Löschens (Serverfehler): vom Aufrufer nicht verlangt, nicht simuliert.
- A2 wirklich zu löschen: laut Aufgabe nicht erlaubt; nur die Absage angesehen.
