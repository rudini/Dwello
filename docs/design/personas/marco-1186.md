# Marco – Statusfilter der Nebenkostenabrechnungen (#1186)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: http://localhost:3300, Demodaten. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f74f81e3-57d9-5b1b-a766-72e5166bb160/scratchpad/marco-1186/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nebenkostenabrechnungen, Gebäude gewählt ohne «Suchen» | Ich wähle im Suchformular «Musterhaus Zentrum» und tippe dann gleich auf «Entwurf» statt auf «Suchen». Das Feld zeigt weiter «Musterhaus Zentrum», der Satz sagt «Die Liste unten zeigt 7 Abrechnungen mit dem Status «Entwurf»», die Liste zeigt aber alle Gebäude (die erste Zeile ist Seepark Residenz, B2). Ich hätte gedacht, Musterhaus Zentrum hat 7 Entwürfe; es sind 3. |
| P-2 | Minor | Nebenkostenabrechnungen mit Gebäude und Status | Mit «Musterhaus Zentrum» und «Überfällig» steht oben nur «Die Liste unten zeigt 1 Abrechnung mit dem Status «Überfällig»». Das Gebäude steht nicht im Satz und nicht in der Überschrift der Liste. Die Zahlen auf den Kacheln springen von 7/9/1 auf 3/4/1, ohne dass oben auf dem Bildschirm steht, warum. Das Gebäudefeld sehe ich erst nach dem Scrollen. |
| P-3 | Minor | Nebenkostenabrechnungen, Filter wieder aufgehoben | Wenn ich zum zweiten Mal auf «Entwurf» tippe, verschwinden die Markierung und der Satz «Die Liste unten zeigt …». Ohne Scrollen steht nirgends, dass jetzt wieder alle 17 Abrechnungen angezeigt werden. Ich sehe nur, dass etwas weg ist. Die Überschrift «Abrechnungen 1–10 von 17» steht weit unten. |

## Beobachtungen

- Der Filter selbst ist klar. Die Kachel, auf die ich getippt habe, bekommt einen farbigen Rahmen, einen hellen Hintergrund und ein Häkchen mit «Filter aufheben». Darunter steht ein Satz, z. B. «Die Liste unten zeigt 7 Abrechnungen mit dem Status «Entwurf»». So weiss ich ohne Scrollen, was gefiltert ist und dass ich die Kachel noch einmal antippen kann.
- Die Seite bleibt beim Antippen oben stehen. Gut, ich verliere die Kacheln nicht. Die Liste selbst sehe ich aber auf dem Handy erst nach etwa 1,5 Bildschirmhöhen: Die Überschrift der Liste liegt bei etwa 1230 px, darüber kommen 5 Kacheln und das Suchformular. Dass sich die Liste geändert hat, merke ich also nur am Satz, nicht an der Liste.
- Beim Scrollen bleibt die Überschrift der Liste («7 Abrechnungen mit dem Status «Entwurf»») nicht oben stehen. Weiter unten sagt mir nur noch das Abzeichen «Entwurf» in jeder Zeile, welchen Status ich sehe. Das hat gereicht, weil alle Zeilen gleich aussehen.
- «Überfällig»: genau 1 Abrechnung, Hans Müller, Musterhaus Zentrum 1.01, Nachzahlung CHF 215.80, mit der Schaltfläche «Als bezahlt markieren». Das passt zur Frist auf der Übersicht («seit 10 Tagen abgelaufen»).
- Das Gebäude wirkt erst nach «Suchen». Danach springt die Seite zum Suchformular (scrollY 832), die Liste beginnt gleich darunter, und der Status «Entwurf» bleibt erhalten (3 Entwürfe). Wenn ich danach auf einer Kachel den Status wechsle oder aufhebe, bleibt das Gebäude erhalten («8 Abrechnungen» für Musterhaus Zentrum).
- «Filter zurücksetzen» im Suchformular setzt auch den Status zurück. Das finde ich richtig, steht aber nirgends.
- Die Zahl «0» bei «Versendet» und «Erledigt» lässt sich trotzdem antippen. Nicht ausprobiert, weil das nicht zur Aufgabe gehörte.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 9 Schritte: Menü, Nebenkostenabrechnungen, Entwurf, Entwurf noch einmal, Überfällig, nach unten scrollen, Gebäude wählen + Suchen, Überfällig mit Gebäude, Überfällig aufheben. Dazu ein Versuch, das Gebäude ohne «Suchen» zu wählen.

## Ablauf

- Nebenkostenabrechnungen geöffnet. Erwartet: die Liste oder wenigstens ihren Anfang. Gesehen: Titel, «Abrechnungen erstellen», 5 Status-Kacheln und den Anfang des Suchformulars; keine einzige Abrechnung im ersten Bildschirm.
- «Entwurf» zum zweiten Mal angetippt. Erwartet: ein Hinweis wie «alle Abrechnungen». Gesehen: Die Markierung und der Satz sind weg, sonst sieht der Bildschirm aus wie vorher (P-3).
- Gebäude «Musterhaus Zentrum» gewählt, dann auf «Entwurf» getippt. Erwartet: Entwürfe von Musterhaus Zentrum. Gesehen: 7 Entwürfe aus allen Gebäuden, das Feld zeigt aber weiter Musterhaus Zentrum (P-1).
- «Überfällig» mit Musterhaus Zentrum. Erwartet: ein Satz, der auch das Gebäude nennt. Gesehen: nur der Status, dazu andere Zahlen auf den Kacheln (P-2).

## Vorschläge

- **P-1:** /statements öffnen, im Feld «Gebäude» «Musterhaus Zentrum» wählen, ohne «Suchen» nach oben scrollen und «Entwurf» antippen. Das Feld zeigt Musterhaus Zentrum, die Liste 7 Entwürfe aus allen Gebäuden. Es würde helfen, wenn die Gebäudewahl sofort gilt oder das Feld nach dem Antippen der Kachel wieder das Gebäude zeigt, das die Liste wirklich filtert.
- **P-2:** /statements, «Musterhaus Zentrum» wählen, «Suchen», nach oben scrollen, «Überfällig» antippen. Es würde helfen, das Gebäude im Satz zu nennen («… mit dem Status «Überfällig» in Musterhaus Zentrum») und in der Überschrift der Liste ebenso.
- **P-3:** /statements, «Entwurf» antippen, dann noch einmal. Ein Satz an derselben Stelle wie «Die Liste unten zeigt alle 17 Abrechnungen» würde zeigen, dass der Filter aufgehoben ist.

## Nicht geprüft

- Antippen der Kacheln mit 0 Einträgen («Versendet», «Erledigt»): nicht Teil der Aufgabe.
- Seite 2 der ungefilterten Liste: nicht Teil der Aufgabe.
- «Als bezahlt markieren»: Das würde speichern, und ich sollte nur schauen.
- Dunkelmodus und andere Sprachen: nicht Teil der Aufgabe.
