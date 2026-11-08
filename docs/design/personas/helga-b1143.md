# Helga – Slice b1143: Entwurf löschen, wenn die anderen Mietverträge der Wohnung nicht laden

Desktop 1440 × 900, Zoom 150 %, Maus. Gebäude «Musterhaus Zentrum», Mietvertrag Anna Schmidt, Wohnung 1.02.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/4c33757f-8a46-54e2-9607-7957815c6383/scratchpad/helga-b1143/`.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, nach «Erneut versuchen» | Die rote Meldung «Der Mietvertrag wurde nicht gespeichert – Dwello hat den Entwurf nicht gelöscht … Laden Sie die Mietverträge oben auf der Seite mit «Erneut versuchen» …» bleibt stehen, nachdem das Laden geklappt hat. Oben gibt es dann keinen Hinweis und keine Schaltfläche «Erneut versuchen» mehr; nur ein kleines Kärtchen rechts sagt «Die anderen Mietverträge dieser Wohnung sind geladen». Die Meldung schickt mich zu einer Schaltfläche, die es nicht mehr gibt. Ich weiss nicht sicher, ob ich jetzt löschen darf. (Beleg: `12-b-after-retry.png`) |
| P-2 | Minor | Mietvertrag bearbeiten, Meldung und Hinweis oben | Der Hinweis oben hat als Überschrift «Dwello prüft beim Speichern, ob die Wohnung frei ist». Das klingt wie: «Keine Sorge, Dwello prüft das». Die Meldung unten sagt aber: «… darum lässt sich nicht prüfen, ob die Wohnung frei ist». Die Wörter passen zusammen, der Sinn nicht ganz. Erst die Meldung macht mir klar, dass die Prüfung gerade nicht geht. Dazu: Die Wohnung ist doch an Anna Schmidt vermietet, also «nicht frei». Dass «frei» heisst «frei von anderen Mietverträgen für die neue Zeit», steht nirgends. (Beleg: `12-a-refused.png`) |
| P-3 | Minor | Mietvertrag bearbeiten, Meldung | «oben auf der Seite» ist bei 150 % sehr weit weg. Die Meldung steht ganz unten bei den Schaltflächen, der Hinweis mit «Erneut versuchen» steht unter der Überschrift. Dazwischen liegen etwa vier Bildschirmhöhen voller Hilfetexte. Beim Vertragsbeginn steht zwar ««Erneut versuchen» steht oben auf der Seite», aber unten bei der Meldung gibt es keine Schaltfläche und keinen Sprung dorthin. Ich musste lange scrollen. (Beleg: `12-b-after-retry.png`, ganze Seite) |

## Beobachtungen

- Die Meldung selbst verstehe ich: Was ist passiert (Entwurf **nicht** gelöscht, Mietvertrag **nicht** gespeichert), warum (die anderen Mietverträge der Wohnung liessen sich nicht laden) und was ich tun soll («Erneut versuchen» oben, dann noch einmal löschen). Gut ist: Das Wort «nicht» steht in der Überschrift und im ersten Satz. Ich hatte keine Angst, dass etwas halb passiert ist.
- Die Wörter in der Meldung und im Hinweis oben sind gleich: «Die anderen Mietverträge dieser Wohnung liessen sich nicht laden», «ob die Wohnung frei ist», «Erneut versuchen». Das hilft. «Laden Sie die Mietverträge» ist für mich ein Computerwort. Weil aber die Schaltfläche genannt wird, wusste ich trotzdem, was zu tun ist.
- Nachdem ich «Erneut versuchen» gedrückt hatte, kam ein Kärtchen: «Der Zeitraum überschneidet sich mit keinem davon.» Welcher Zeitraum? Gemeint ist wohl Annas neue Vertragsdauer ab 01.05.2025.
- Solange das Laden fehlschlug, liess sich «Änderungen speichern» trotzdem drücken. Dwello antwortete dann ganz normal mit der Entwurf-Meldung. Erst beim Löschen sagte Dwello, dass es nicht prüfen kann. Für mich ist das etwas unlogisch: Warum geht das eine und das andere nicht?
- «Entwurf löschen und Mietvertrag speichern» löscht ohne Rückfrage. Über der Schaltfläche steht aber «Der Entwurf für Anna Schmidt, 2025 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.», dazu ein Link, der den Entwurf in einem neuen Tab öffnet. Das hat mir gereicht.
- Nach dem Löschen bringt mich Dwello direkt in den Assistenten «Abrechnungen erstellen» für 2025 im Musterhaus Zentrum. Oben steht «Mietvertrag von Anna Schmidt gespeichert». Ich hatte die Mietvertragsseite erwartet. Es ist aber verständlich, denn ich soll die Abrechnung ja neu erstellen.
- **Die Aufgabe ging so nicht direkt:** Beim ersten Speichern von 01.05.2025 sagte Dwello nicht, dass ein Entwurf gelöscht werden muss. Dwello sagte: «Die Nebenkostenabrechnung NK-11111111-2024-0002 (bezahlt) wurde mit den bisherigen Vertragsdaten berechnet … berichtigen Sie zuerst jede dieser Abrechnungen … Betroffen ist auch der Entwurf NK-11111111-2025-0002.» Ich habe getan, was dort steht: die Abrechnung 2024 geöffnet und «Abrechnung berichtigen» bestätigt (sie ist jetzt «Ersetzt»). Erst danach kam die Meldung mit dem Entwurf und die Schaltfläche «Entwurf löschen und Mietvertrag speichern». In den Demodaten hat Anna also eine bezahlte Abrechnung 2024, die vor dem Entwurf im Weg steht. Ein späterer Lauf mit derselben Aufgabe braucht diesen Schritt auch oder einen anderen Datensatz.
- Mein erstes Skript tippte das Datum, bevor die Seite fertig geladen war. Danach stand wieder 01.06.2022 im Feld, und das unveränderte Datum wurde gespeichert («Mietvertrag von Anna Schmidt gespeichert»). Das lag wohl am Tempo des Skripts, nicht an einer Person. Ich erwähne es nur.

## Aufgabe geschafft: ja

Mit dem Umweg über «Abrechnung berichtigen» der Abrechnung 2024 (siehe Beobachtungen). Am Ende gilt Annas Mietvertrag ab 01.05.2025. Der Entwurf NK-11111111-2025-0002 ist gelöscht. Ihre Abrechnungsliste zeigt nur noch NK-11111111-2024-0002 «Ersetzt» und «Vertragsbeginn 01.05.2025».

## Aufwand

Etwa 25 Minuten. Rund 14 Schritte: Mietverträge, Bearbeiten, Datum, Speichern (bezahlte Abrechnung im Weg), Abrechnung 2024 öffnen, berichtigen, bestätigen, zurück, Speichern (Entwurf-Meldung), Fehler einschalten und neu laden, Speichern, Entwurf löschen (abgelehnt), Erneut versuchen, Entwurf löschen (gelingt).

## Ablauf

- **Speichern 01.05.2025 (erstes Mal):** erwartet war die Meldung, dass ein Entwurf gelöscht werden muss. Gesehen: Ablehnung wegen der bezahlten Abrechnung NK-11111111-2024-0002, keine Löschschaltfläche (`06-ok-save.png`).
- **Speichern bei fehlschlagendem Laden:** erwartet war, dass Dwello schon hier wegen der fehlenden Prüfung bremst. Gesehen: Oben erscheint der Hinweis «Dwello prüft beim Speichern, ob die Wohnung frei ist / Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten.» mit «Erneut versuchen». Das Speichern lief trotzdem normal und zeigte die Entwurf-Meldung (`11-b-fail-save.png`).
- **Nach «Erneut versuchen»:** erwartet war, dass die alte rote Meldung verschwindet oder sich ändert. Gesehen: Sie blieb unverändert stehen, der Hinweis oben war weg (P-1).

## Vorschläge

- **P-1:** Bei Anna Schmidt Vertragsbeginn 01.05.2025 speichern, wenn nur noch der Entwurf im Weg ist. GET `/api/contracts?apartmentId=…` mit 500 fehlschlagen lassen, Seite neu laden und speichern. Dann «Entwurf löschen und Mietvertrag speichern» wählen und die Anfrage wieder gelingen lassen. Danach «Erneut versuchen» drücken. Hilfreich wäre: Die Meldung «Dwello hat den Entwurf nicht gelöscht …» verschwindet, sobald die Mietverträge geladen sind. Oder sie ändert sich in z. B. «Die Mietverträge sind jetzt geladen. Löschen Sie den Entwurf noch einmal.»
- **P-2:** Gleicher Weg bis zur Ablehnung. Hilfreich wäre eine Überschrift des Hinweises oben, die sagt, dass die Prüfung gerade **nicht** möglich ist, etwa «Dwello kann gerade nicht prüfen, ob die Wohnung frei ist». Und einmal erklären, was «frei» meint, etwa «ob in der neuen Vertragsdauer kein anderer Mietvertrag für diese Wohnung gilt».
- **P-3:** Gleicher Weg, bei 150 % Zoom. Hilfreich wäre eine Schaltfläche «Erneut versuchen» direkt in der roten Meldung oder ein Link, der zum Hinweis oben springt.

## Nicht geprüft

- Zoom 200 %: nicht angesehen, weil die Aufgabe schon bei 150 % fertig war. Bei 200 % wäre der Weg «oben auf der Seite» (P-3) noch länger.
- Ob die berichtigte Abrechnung 2024 nach der Vertragsänderung richtig neu erstellt wird: nicht Teil der Aufgabe. Die Abrechnung steht noch auf «Ersetzt», eine berichtigte Abrechnung habe ich nicht erstellt. Den Assistenten für 2025 habe ich nur geöffnet und nicht durchlaufen.
