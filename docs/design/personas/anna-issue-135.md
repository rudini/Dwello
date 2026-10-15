# Persona-Review: Anna, Issue #135 (Hinweis «Entwurf wiederhergestellt» bei gelöschtem Gebäude)

Persona: Anna, 29, erste Vermietung, kommt nach Monaten zurück und erinnert sich an nichts. Desktop 1440 × 900, Maus; der Hinweis zusätzlich kurz auf 390 px Breite angeschaut.
App: Persona-App auf http://localhost:3300 (Demo-Daten). Gespeichert habe ich nur mein eigenes Gebäude «Anna Testhaus», das ich danach wieder gelöscht habe; die Demo-Gebäude habe ich nicht verändert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/anna-issue-135/`. Ich habe die ganze Zeit dasselbe Browserfenster benutzt, damit der Entwurf im Browser erhalten bleibt.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Hinweis «Entwurf wiederhergestellt» | Der Satz nennt nicht, **welches** Gebäude fehlt, und sagt auch nicht, dass Dwello es aus der Auswahl entfernt hat. In Schritt 2 steht es nicht mehr in der Liste. Ich kann also gar nicht vergleichen, was weg ist. «Prüfen Sie die gewählten Gebäude» lässt mich raten, worauf ich achten soll. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 1 | Der Hinweis erscheint in Schritt 1 (Abrechnungsperiode), die Gebäude sind aber in Schritt 2. Er sagt nicht, wo ich die gewählten Gebäude finde, und es gibt keinen Link dorthin. Wenn ich mich an nichts erinnere, weiss ich nicht, dass die Gebäude erst nach «Weiter» kommen. |
| P-3 | Nit | Abrechnungen erstellen, alle Schritte | Der Hinweis mit dem Satz zum fehlenden Gebäude bleibt unverändert, auch nachdem ich in Schritt 2 war, in Schritt 3 weitergegangen bin und die Seite neu geladen habe. Ich kann ihn nicht als «gesehen» schliessen. Der einzige Knopf darin ist «Entwurf verwerfen», und der löscht alles. Dadurch wirkt es, als hätte ich noch etwas nicht erledigt. |

## Beobachtungen

- Der Assistent öffnet nach dem Wiederherstellen in Schritt 1, obwohl ich zuletzt in Schritt 2 war. Die Angaben sind da, aber ich lande nicht dort, wo ich aufgehört habe.
- «Entwurf verwerfen» löscht sofort, ohne Rückfrage und ohne Rückmeldung (Screenshot 16: der Hinweis ist einfach weg, und im Statusbereich steht nichts). Ein Fehlklick kostet alle Angaben.
- Das Wort «Entwurf» bedeutet hier zweierlei: «Entwurf wiederhergestellt» (meine Eingaben im Assistenten) und direkt darüber «Es entstehen Entwürfe, die Sie danach prüfen und versenden» (Abrechnungen im Status Entwurf). Als Anfängerin habe ich kurz gedacht, es seien schon Abrechnungen entstanden.
- Musterhaus Zentrum ist weiter gewählt, aber auf seiner Karte steht «Alle 4 Mietverträge haben schon eine Abrechnung … Für dieses Gebäude entsteht keine neue». Trotzdem lässt mich «Weiter» in Schritt 3 gehen. Mit der verbliebenen Auswahl entsteht also nichts, und das sagt mir dort niemand. Das liegt an den Demo-Daten und war schon so, bevor ich das Gebäude gelöscht habe.
- Die Schrittbeschriftungen im Fortschritt brechen mitten im Wort um: «Abrechnun / gsperiode», «Verwaltung / spauschale» (Screenshots 11 und 12, Desktop 1440 px).
- Nach dem Löschen des Gebäudes stand die Meldung «Gebäude Anna Testhaus gelöscht» noch unten rechts, als ich den Assistenten wieder geöffnet hatte (Screenshot 11). Zusammen mit dem Hinweis hat mir das zufällig verraten, welches Gebäude gemeint ist. Wer später zurückkommt, hat diese Hilfe nicht.
- Auf 390 px ist der Hinweis gut lesbar und es gibt kein seitliches Scrollen (`scrollWidth` 390, Screenshot 15).
- Das Speichern des Entwurfs ist sichtbar: Nach dem Ankreuzen steht «Entwurf gespeichert, 14:19» unter der Liste. Das finde ich beruhigend.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 14 Schritte (Gebäude erfassen 3, Assistent bis Schritt 2 und auswählen 4, Gebäude löschen 3, Assistent wieder öffnen und prüfen 4).

## Ablauf

1. **Gebäude › Gebäude erfassen.** Erwartet: ein Formular für Name und Adresse. Gesehen: «Neues Gebäude» mit Hilfetexten an jedem Feld. Name «Anna Testhaus», Adresse Testweg 1, 3000 Bern, Kanton Bern. «Gebäude erfassen» führt auf die Seite des Gebäudes mit «Noch keine Wohnungen» (Screenshot 04). Wie erwartet.
2. **Nebenkostenabrechnungen › Abrechnungen erstellen.** Erwartet: ein Assistent. Gesehen: 5 Schritte, Schritt 1 mit der vorgeschlagenen Abrechnungsperiode 01.01.2025 – 31.12.2025 (Screenshot 06). «Weiter».
3. **Schritt 2, Gebäude.** Gesehen: 4 Gebäude, «Anna Testhaus» mit «Keine Rechnungen in der Abrechnungsperiode erfasst, 0 Wohnungen» (Screenshot 07). «Anna Testhaus» und «Musterhaus Zentrum» angekreuzt, dann stand dort «2 von 4 gewählt» und «Entwurf gespeichert, 14:19» (Screenshot 08). Wie erwartet.
4. **Assistent verlassen, Gebäude löschen.** Über das Menü zu Gebäude › Anna Testhaus › «Löschen». Der Dialog «Gebäude löschen?» nennt das Gebäude und die Folge («und alle seine Rechnungen werden endgültig gelöscht») (Screenshot 09). «Gebäude löschen» führt zur Gebäudeliste mit der Meldung «Gebäude Anna Testhaus gelöscht» (Screenshot 10). Wie erwartet.
5. **Assistent wieder öffnen** (Nebenkostenabrechnungen › Abrechnungen erstellen). Erwartet: Meine Auswahl ist wieder da, und ein Hinweis sagt, dass ein Gebäude fehlt. Gesehen (Screenshot 11): ein blauer Infokasten «Entwurf wiederhergestellt». Darin: «Ihre Angaben, zuletzt am 15.10.2026 um 14:19 bearbeitet, sind wieder da.» und «Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Prüfen Sie die gewählten Gebäude.», darunter der Knopf «Entwurf verwerfen». Der Assistent steht in Schritt 1, nicht in Schritt 2.
   - Verstehe ich, was passiert ist? Grösstenteils. «Gibt es nicht mehr» ist klar: Es wurde gelöscht. Welches Gebäude, steht nicht da (P-1).
   - Sagt er mir, was ich tun soll? Halb. «Prüfen Sie die gewählten Gebäude» ist eine Aufforderung, aber ich bin in Schritt 1 und muss selbst darauf kommen, dass die Gebäude hinter «Weiter» liegen (P-2). Was genau ich prüfen soll, bleibt offen (P-1).
6. **«Weiter» zu Schritt 2.** Erwartet: «Musterhaus Zentrum» angekreuzt, «Anna Testhaus» weg. Gesehen (Screenshot 12): drei Gebäude, nur «Musterhaus Zentrum» angekreuzt, «1 von 3 gewählt». Die übrige Auswahl stimmt also. Der Hinweis steht weiterhin oben.
7. **«Weiter» zu Schritt 3.** Heizprofil und Verwaltungspauschale sind normal ausgefüllt (Screenshot 13). Der Hinweis steht immer noch da (P-3).
8. **Seite neu geladen.** Der Hinweis erscheint unverändert mit demselben Satz und derselben Zeit 14:19, und der Assistent steht wieder in Schritt 1 (Screenshot 14).
9. **Auf 390 px Breite angeschaut** (dasselbe Fenster schmal gemacht): Der Hinweis bricht sauber um, der Knopf ist gut erreichbar (Screenshot 15).
10. **«Entwurf verwerfen» ausprobiert** (nur mein eigener Entwurf): Er ist sofort weg, ohne Rückfrage und ohne Meldung (Screenshot 16; siehe Beobachtungen).

## Verwirrung

- **Welches Gebäude?** Nach Monaten weiss ich nicht mehr, was ich damals gewählt habe. Ohne Namen kann ich mit «Prüfen Sie die gewählten Gebäude» wenig anfangen.
- **Wo prüfen?** Auf der Seite, auf der der Hinweis steht, gibt es keine Gebäude zu sehen.
- **«Entwurf»** im Hinweis und **«Entwürfe»** im Einleitungssatz darüber meinen verschiedene Dinge.
- **Muss ich noch etwas tun?** Der Hinweis bleibt stehen, auch nachdem ich geprüft habe. Ich war unsicher, ob ich etwas übersehen habe.

## Fehlerrisiken

- Wer den Hinweis loswerden will, klickt vielleicht auf den einzigen Knopf darin, «Entwurf verwerfen», und verliert ohne Rückfrage alle Angaben.
- Wer «Prüfen Sie die gewählten Gebäude» nicht auf Schritt 2 bezieht, klickt in Schritt 1 einfach «Weiter» und merkt nicht, dass ein Gebäude fehlt, das er eigentlich abrechnen wollte (zum Beispiel wenn er es aus Versehen gelöscht hat).

## Vorschläge

- **P-1.** Reproduktion: Gebäude «Anna Testhaus» erfassen, im Assistenten in Schritt 2 «Anna Testhaus» und «Musterhaus Zentrum» wählen, Assistent verlassen, «Anna Testhaus» löschen, Assistent wieder öffnen. Der Hinweis nennt kein Gebäude. Hilfreich wäre, den Namen zu nennen und zu sagen, was Dwello gemacht hat, z. B. «Das Gebäude Anna Testhaus gibt es nicht mehr. Dwello hat es aus Ihrer Auswahl entfernt. Prüfen Sie in Schritt 2, ob die übrigen Gebäude stimmen.» Ob Dwello den Namen noch kennt, kann ich als Anwenderin nicht beurteilen. Falls nicht, würde schon «hat es aus Ihrer Auswahl entfernt» helfen.
- **P-2.** Reproduktion wie bei P-1; der Hinweis erscheint in «Schritt 1 von 5: Abrechnungsperiode». Hilfreich wäre, den Schritt im Satz zu nennen («Prüfen Sie in Schritt 2 «Gebäude» …»), einen Link oder Knopf «Zu den Gebäuden» anzubieten, oder den Assistenten in diesem Fall gleich in Schritt 2 zu öffnen.
- **P-3.** Reproduktion wie bei P-1, dann «Weiter» bis Schritt 3 und die Seite neu laden: Der Satz zum fehlenden Gebäude bleibt stehen. Hilfreich wäre, ihn auszublenden, sobald ich Schritt 2 gesehen habe, oder einen Knopf «Verstanden» bzw. «Hinweis schliessen» anzubieten, damit «Entwurf verwerfen» nicht der einzige Knopf ist.

## Nicht geprüft

- **Gelöschtes Heizprofil** (der zweite neue Satz): Ich hätte dafür ein Heizprofil anlegen und löschen müssen. Die Aufgabe nennt nur das Gebäude, und die Heizprofile der Demo-Daten wollte ich nicht ändern.
- **Andere Sprachen** (fr, it, en): nicht angeschaut.
- **Mobile im echten Ablauf:** Den Hinweis habe ich nur angeschaut, indem ich dasselbe Fenster auf 390 px verkleinert habe. Auf einem echten Handy wäre es ein anderer Browser, und dort gäbe es den Entwurf gar nicht.
- **Bildschirmleser-Ansage des Hinweises:** nicht Annas Bereich. Im Accessibility-Baum steht der Hinweis als einfache Absätze, nicht als Statusmeldung. Ob das angesagt werden sollte, sollte Sven beurteilen.
