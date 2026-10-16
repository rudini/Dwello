# Helga – Runde w4: Heizprofil erfassen und ändern

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Hinweistext zusätzlich bei 200 %), Maus. App: Persona-Stack auf http://localhost:3300, Deutsch. Gespeichert habe ich nur das eigene Heizprofil «Mein Haus»; Gebäude, Mieter, Mietverträge und Abrechnungen habe ich nur angeschaut, nichts geändert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/helga-w4/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Heizprofil bearbeiten | Der Hinweis spricht von «den betroffenen Wohnungen», sagt aber nicht, welche das sind, und die Seite zeigt nirgends, in welchen Abrechnungen dieses Heizprofil steckt. Ich müsste jeden Entwurf einzeln öffnen, um es herauszufinden. |
| P-2 | Minor | Heizprofil bearbeiten | «löschen Sie die Entwürfe **aller** Mietverträge der betroffenen Wohnungen»: warum alle, auch die, bei denen nichts falsch ist? Das steht nicht da. Ich habe Angst, zu viel zu löschen. |
| P-3 | Minor | Heizprofil bearbeiten | Der Hinweis sagt nicht, dass das Heizprofil nur bei Ein- oder Auszug während der Periode zählt. Im Entwurf von Anna Schmidt steht «nicht angewendet: Mietvertrag über die ganze Periode» – dort würde Neuberechnen nichts ändern. Ohne diesen Satz lösche ich vielleicht Entwürfe für nichts. |
| P-4 | Nit | Heizprofil bearbeiten | Kein Link zu den Entwürfen oder zu «Abrechnungen erstellen» im Hinweis; ich muss den Weg über das Menü selbst finden. |

## Beobachtungen

- Die Summenanzeige unter den Monaten ist sehr gut: «Summe: 98 % – es fehlen noch 2 %» in Rot mit Warnzeichen, danach «Summe: 100 % – stimmt» in Grün mit Haken. Das hat mich sicher gemacht.
- Das Balkenbild unter den Feldern zieht beim Tippen mit; ich sehe sofort, dass der Winter höher ist.
- Die Brotkrümel auf «Mein Haus bearbeiten» beginnen bei «Heizprofile», auf «Neues Heizprofil» und auf der Detailseite bei «Einstellungen». Uneinheitlich, hat mich aber nicht gestört.
- «Mein Haus bearbeiten» hat keinen Einleitungssatz wie «Neues Heizprofil» («Legen Sie fest, wie sich die Heizkosten …»).
- Die Erfolgsmeldung «Heizprofil «Mein Haus» gespeichert» liegt rechts über dem Balkenbild und verdeckt April/Mai, bis ich sie schliesse.
- Den Weg zu den Einstellungen habe ich erst im zweiten Anlauf gefunden: im Hauptmenü (☰) gibt es keine «Einstellungen», sie sind unter meinem Namen oben rechts versteckt.
- Auf der Seite «Neues Heizprofil» steht der Hinweis zu bestehenden Abrechnungen nicht – richtig so, ein neues Profil hat noch keine.
- Der Hinweis steht auch bei «Mein Haus», obwohl dieses Profil noch nie in einer Abrechnung benutzt wurde. Das hat mich kurz erschreckt («Habe ich schon Abrechnungen damit?»).
- Die Zahl der Entwürfe war beim Hinschauen 6 statt 7 wie zu Beginn auf der Übersicht; das waren wohl andere Personen in derselben Datenbank, nicht ich.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 13 Schritte: Übersicht → Menü (nichts gefunden) → Benutzermenü → Einstellungen → Heizprofile → Heizprofil erfassen → Name und 12 Monate eingeben → speichern → Mein Haus → Bearbeiten → Januar und Februar ändern, Hinweis lesen → speichern → Entwürfe und ein Entwurf angeschaut, um den Hinweis zu verstehen.

## Ablauf

1. **Einstellungen suchen.** Erwartet: «Einstellungen» im Menü links. Gesehen: Menü hat Verwalten und Nebenkosten, keine Einstellungen. Unter «Vera Verwalter» oben rechts gab es dann «Einstellungen».
2. **Heizprofile.** Erwartet: eine Liste. Gesehen: unter «Stammdaten» der Link «Heizprofile» mit «Wie die Heizkosten auf die Monate verteilt werden», dann vier vordefinierte Profile mit Balken und der Knopf «Heizprofil erfassen». Klar.
3. **Neues Heizprofil.** Erwartet: Felder für die Monate. Gesehen: Name (Beispiel: Heizung Altbau), Beschreibung (optional), 12 Monatsfelder auf 0, «Summe: 0 % – es fehlen noch 100 %». Ich habe 15, 14, 12, 8, 4, 1, 1, 1, 4, 10, 14, 16 eingetippt; nach Juni stand «Summe: 54 % – es fehlen noch 46 %», am Schluss «Summe: 100 % – stimmt».
4. **Speichern.** Erwartet: Bestätigung. Gesehen: Detailseite «Mein Haus», Abzeichen «Eigenes Heizprofil», Balken, «Summe 100 %», Meldung «Heizprofil «Mein Haus» gespeichert».
5. **Bearbeiten.** Erwartet: dasselbe Formular mit meinen Zahlen. Gesehen: «Mein Haus bearbeiten», meine Zahlen, und unter «Anteil der Heizkosten pro Monat in %» zwei Absätze:
   - «Die Monatsanteile verteilen die Heizkosten eines Jahres und ergeben zusammen 100 %. Im Winter wird mehr geheizt als im Sommer.»
   - «Bestehende Abrechnungen behalten die Monatsanteile, mit denen sie erstellt wurden. Um Entwürfe neu zu berechnen, löschen Sie die Entwürfe aller Mietverträge der betroffenen Wohnungen in dieser Abrechnungsperiode und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.»
   Auch bei 200 % gut lesbar, normale Schriftgrösse, kein Kleingedrucktes.
6. **Januar 15 → 13.** Gesehen: rot «Summe: 98 % – es fehlen noch 2 %». **Februar 14 → 16:** grün «Summe: 100 % – stimmt».
7. **Änderungen speichern.** Gesehen: Detailseite mit Januar 13 %, Februar 16 %, Meldung «gespeichert». Keine Rückfrage, kein Hinweis mehr zu bestehenden Abrechnungen.
8. **Verstehen, wo ich hin müsste.** Ich ging über die Übersicht auf «Entwürfe ansehen» (Nebenkostenabrechnungen, Filter Entwurf). In der Liste steht kein Heizprofil. Erst im einzelnen Entwurf (Anna Schmidt) stand «Heizprofil: Heizung Mittelland (nicht angewendet: Mietvertrag über die ganze Periode)» und unten unter «Weitere Aktionen» der Knopf «Abrechnung löschen». Unter «Abrechnungen erstellen» gibt es Schritt 3 «Heizprofil und Verwaltungspauschale» – dort würde ich wohl wieder «Mein Haus» wählen. Gelöscht oder neu erstellt habe ich nichts (nicht meine Aufgabe).

## Was ich verstanden habe (Aufgabe 3, in meinen Worten)

Abrechnungen, die ich schon mit «Mein Haus» gemacht habe, ändern sich nicht von selbst: sie rechnen weiter mit den alten Zahlen (Januar 15 %, Februar 14 %). Bereits verschickte Abrechnungen bleiben sowieso, wie sie sind. Wenn ein Entwurf die neuen Zahlen bekommen soll, muss ich unter «Nebenkostenabrechnungen» die Entwürfe dieser Wohnungen für dieses Jahr löschen («Abrechnung löschen» im Entwurf) und dann mit «Abrechnungen erstellen» neu machen.

Ist der Text verständlich? Ja, die Sätze sind kurz und klar, und «behalten die Monatsanteile, mit denen sie erstellt wurden» habe ich beim ersten Lesen verstanden. Wüsste ich, wohin? Ungefähr: zu den Nebenkostenabrechnungen. Aber nicht, **welche** Entwürfe betroffen sind (P-1), warum ich **alle** Mietverträge der Wohnung löschen soll (P-2) und dass es bei Mietern ohne Ein- oder Auszug gar nichts ändert (P-3).

## Verwirrung

- «betroffene Wohnungen»: betroffen wovon? Von welchem Gebäude? Ich habe das Profil keinem Gebäude zugeordnet.
- «Entwürfe aller Mietverträge»: ich dachte, ein Entwurf gehört zu einem Mieter. Warum muss ich die anderen auch löschen?
- «Abrechnungsperiode» in «in dieser Abrechnungsperiode»: welche? Auf der Seite steht keine Periode.
- Dass ein Heizprofil nur bei Ein- und Auszug wirkt, steht auf der Liste der Heizprofile («Zieht ein Mieter … ein oder aus …»), aber nicht im Hinweis beim Bearbeiten. Ich habe es erst im Entwurf verstanden.

## Fehlerrisiken

- Ich lösche Entwürfe, die das Profil gar nicht verwenden oder bei denen es «nicht angewendet» ist, und muss dann neu erstellen – Mehrarbeit und Angst, etwas kaputt zu machen.
- Ich lösche nur den Entwurf eines Mieters statt aller Mietverträge der Wohnung und weiss nicht, was dann passiert.
- Ich denke nach dem Speichern, meine Entwürfe seien automatisch angepasst, weil nach dem Speichern nichts mehr dazu gesagt wird. (Der Hinweis steht nur vor dem Speichern.)
- Beim Neu-Erstellen wähle ich in Schritt 3 nicht wieder «Mein Haus» und habe dann ein anderes Profil.

## Vorschläge

- **P-1:** Einstellungen → Heizprofile → Mein Haus → Bearbeiten, Hinweis lesen. Hilfreich: im Hinweis oder auf der Detailseite nennen, in welchen Entwürfen (Mieter, Wohnung, Periode) dieses Heizprofil verwendet wurde, oder «Dieses Heizprofil wurde noch in keiner Abrechnung verwendet», wenn es so ist.
- **P-2:** Gleicher Weg. Hilfreich: ein halber Satz mit dem Grund, z. B. «… weil die Heizkosten einer Wohnung auf alle ihre Mietverträge der Periode verteilt werden.»
- **P-3:** Gleicher Weg, dann einen Entwurf öffnen (z. B. Anna Schmidt, Musterhaus Zentrum 1.02): «nicht angewendet: Mietvertrag über die ganze Periode». Hilfreich: im Hinweis sagen, dass nur Entwürfe mit Ein- oder Auszug in der Periode andere Beträge bekommen.
- **P-4:** Gleicher Weg. Hilfreich: ein Link «Entwürfe ansehen» im Hinweis.

## Nicht geprüft

- Einen Entwurf wirklich löschen und mit «Mein Haus» neu erstellen: Abrechnungen durfte ich nicht ändern, und «Mein Haus» steckte in keiner Abrechnung.
- Ob eine schon erstellte Abrechnung nach meiner Änderung wirklich die alten Monatsanteile behält: dazu hätte ich zuerst eine Abrechnung mit «Mein Haus» erstellen müssen.
- Eine falsche Summe speichern (z. B. 98 %): ich habe es nicht versucht, weil die Anzeige mich vorher gewarnt hat.
- Das PDF einer Abrechnung.
