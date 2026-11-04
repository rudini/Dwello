# Marco: Beleg einer gelöschten Rechnung öffnen (#1093)

Persona: Marco, 38, auf dem Handy (390 × 844, Touch). Gebäude «Alpenblick», Persona-App auf :3300 mit Demo-Daten.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-1093/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Tab «Rechnung nicht gefunden» (`/documents/refused?code=INVOICE_NOT_FOUND`) | «Laden Sie die Seite neu.» hilft nicht: Neu laden zeigt im selben Tab wieder genau dieselbe Meldung. Lade ich stattdessen den alten Rechnungs-Tab neu, kommt «Diese Seite gibt es nicht. Prüfen Sie die Adresse …», also kein Wort davon, dass die Rechnung gelöscht ist. Woran es liegt, steht nirgends: Ich muss selbst darauf kommen, dass ich sie im anderen Tab gelöscht habe. |
| P-2 | Minor | Dieselbe Seite, Schaltfläche «Zu den Rechnungen» | Der Ausweg führt zu allen 82 Rechnungen, der Gebäudefilter «Alpenblick», von dem ich kam, ist weg. Auf dem Handy muss ich das Gebäude neu wählen und auf «Suchen» tippen, bevor ich sehe, ob die Rechnung wirklich fehlt. |

## Beobachtungen

- Die Fehlerseite selbst ist auf dem Handy aufgeräumt: Illustration, Titel «Rechnung nicht gefunden» in zwei Zeilen, ein kurzer Satz, eine klare Hauptschaltfläche «← Zu den Rechnungen», kein seitliches Scrollen. Der Tab-Titel lautet «Rechnung nicht gefunden - Dwello». Ich verstehe sofort: Den Beleg gibt es hier nicht mehr. Sicher bin ich mir nur, weil ich die Rechnung gerade selbst gelöscht habe.
- Beleg hinzufügen ging problemlos: Datei wählen, «Beleg hinzufügen». Danach stand «Beleg beleg-marco.pdf gespeichert.» und die Schaltflächen hiessen «Beleg anzeigen (öffnet in neuem Tab)» und «Beleg ersetzen». Gut, dass der Link ansagt, dass er einen neuen Tab öffnet.
- Der Löschdialog nennt die Folgen: «Die Rechnung von Winterdienst Oberland über CHF 380.00 wird gelöscht. … Das lässt sich nicht rückgängig machen. Der Beleg wird ebenfalls gelöscht.» Das ist klar. Danach landete Tab 1 bei der Rechnungsliste mit «Rechnung von Winterdienst Oberland gelöscht». Auch hier fehlte der Filter «Alpenblick» (82 Rechnungen).
- Der zweite Tab zeigt nach dem Löschen weiter die volle Rechnung mit «Beleg anzeigen» an, ohne Hinweis. Das hatte ich so erwartet, so funktioniert ein Browser eben.
- Nach dem Öffnen des Belegs bleibt der veraltete Rechnungs-Tab stehen. Auf dem Handy habe ich dann drei Tabs, zwei davon zeigen nichts Brauchbares mehr.
- Der neu geladene alte Rechnungs-Tab zeigt die allgemeine 404-Seite («Diese Seite gibt es nicht.», «Zurück», «Zur Übersicht»). Diese Seite gehört nicht zur Änderung, ist aber genau die Seite, auf die mich «Laden Sie die Seite neu» schickt (siehe P-1).
- In der Rechnungsliste sieht man nicht, welche Rechnung einen Beleg hat. Um eine andere «Alpenblick»-Rechnung mit Beleg zu finden, musste ich alle 13 einzeln öffnen.

## Aufgabe geschafft: ja

(Der Teil «was wäre ohne Löschen» nur als Erwartung, siehe Nicht geprüft.)

## Aufwand

Etwa 12 Minuten, rund 10 Schritte für den Hauptablauf (Liste filtern, Rechnung öffnen, Datei wählen, hinzufügen, zweiter Tab, löschen, bestätigen, Tab wechseln, «Beleg anzeigen», Ausweg). Dazu 13 Seitenaufrufe, um bei den anderen Rechnungen nach einem Beleg zu suchen.

## Ablauf

- «Beleg anzeigen» im veralteten Tab: Ich erwartete einen neuen Tab mit einer Meldung, dass der Beleg bzw. die Rechnung nicht mehr da ist, idealerweise mit «gelöscht». Ich sah «Rechnung nicht gefunden. Die Rechnung wurde nicht gefunden. Laden Sie die Seite neu.» Die Meldung verstehe ich, aber das Wort «gelöscht» fehlt, und die Aufforderung passt nicht (P-1).
- Seite neu laden, wie verlangt: Ich erwartete eine Erklärung oder die Rechnung. Ich sah dieselbe Meldung noch einmal, die Adresse ist ja `/documents/refused?…`. Im alten Rechnungs-Tab kam stattdessen «Diese Seite gibt es nicht. Prüfen Sie die Adresse …» (P-1).
- «Zu den Rechnungen»: Ich erwartete die Rechnungen von «Alpenblick», also die Liste, aus der ich kam. Ich sah alle 82 Rechnungen, Gebäudefilter leer (P-2).

## Vorschläge

- **P-1:** Rechnung von «Alpenblick» öffnen, Beleg hinzufügen, die Seite in einem zweiten Tab öffnen, im ersten Tab löschen, im zweiten «Beleg anzeigen» tippen. Im neuen Tab neu laden: Es kommt dieselbe Meldung. Hilfreich wäre ein Satz, der sagt, was vermutlich passiert ist und was zu tun ist, z. B. «Die Rechnung wurde gelöscht oder ist nicht mehr vorhanden. Schliessen Sie diesen Tab und prüfen Sie die Rechnungsliste.» Statt «Laden Sie die Seite neu» also eine Handlung, die tatsächlich weiterhilft.
- **P-2:** Gleicher Ablauf, dann «Zu den Rechnungen» tippen: Es kommt die ungefilterte Liste. Hilfreich wäre, dass der Ausweg auf die Rechnungen des Gebäudes führt, zu dem die Rechnung gehörte (falls bekannt). Sonst wenigstens ein Hinweis in der Liste, dass man nach Gebäude filtern kann.

## Nicht geprüft

- **Beleg ohne Löschen ansehen:** Keine der 13 übrigen Rechnungen von «Alpenblick» hat einen Beleg (alle einzeln geöffnet, keine zeigt «Beleg anzeigen»). Meinen eigenen Beleg habe ich vor dem Löschen nicht geöffnet, also habe ich den Normalfall nicht gesehen. Erwartung als Marco: Im neuen Tab öffnet sich das PDF im Handy-Viewer, und ich komme mit dem Zurück- oder Tab-Wechsel zur Rechnung zurück.
- Andere Gebäude habe ich nicht angefasst, und andere Fehlercodes der Ablehnungsseite (z. B. Beleg fehlt, Rechnung aber da) habe ich nicht hervorgerufen.
