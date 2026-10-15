# Helga – Issue #125, Runde 2: PDF einer gelöschten Abrechnung

Persona: Helga, 68, Anfängerin, liest langsam, braucht grosse Schrift. Desktop 1280 × 900 bei 150 % Zoom (zusätzlich ein Blick bei 200 %), Maus, Deutsch, helles und dunkles Farbschema.
Aufgabe: Entwurf 2025 von Thomas Weber (Seepark Residenz, Wohnung A1, NK-22222222-2025-0001) in einem Tab und die Liste «Entwurf» in einem anderen öffnen, den Entwurf in einem dritten Tab löschen, dann im Detail-Tab «PDF herunterladen» und im Listen-Tab «PDF» drücken. Beurteilen: Verstehe ich, was passiert ist, was ich tun soll, und finde ich zurück?
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-125-2/` (`s2.mjs` Hauptablauf hell und dunkel, `s3.mjs` 200 % und Zurück-Pfeil).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Seite «Abrechnung nicht gefunden.» (nach «PDF» / «PDF herunterladen») | Der Satz sagt immer noch nicht, warum die Abrechnung fehlt (dass sie gelöscht wurde) und was ich jetzt tun soll. Ich weiss nicht, ob etwas kaputt ist. Der Link hilft beim Zurückfinden, erklärt aber nichts. (Runde 1: P-2, unverändert.) |
| P-2 | Minor | dieselbe Seite | Die Seite hat weiterhin keinen Dwello-Kopf, keine Überschrift und keine Fusszeile: zwei Zeilen oben links auf leerer Fläche. Sie sieht anders aus als die übrige App und anders als die normale Fehlerseite «Diese Seite gibt es nicht.», die Kopf, Überschrift, Erklärsatz und zwei Knöpfe hat. Ich fühle mich weniger «rausgeflogen» als in Runde 1, aber noch nicht sicher in Dwello. |
| P-3 | Nit | dieselbe Seite, Tab-Leiste | Der Tab heisst «Nebenkostenabrechnungen - Dwello», wie die Liste. Wenn ich zwischen Tabs wechsle, denke ich, dort sei meine Liste, finde aber die Fehlermeldung. Ein Titel, der den Fehler nennt, wäre klarer. |
| P-4 | Nit | Weg zurück über «Zu den Nebenkostenabrechnungen» | Ich kam aus der Liste mit Filter «Entwurf» (5 Abrechnungen). Der Link führt zur ungefilterten Liste (15 Abrechnungen, alle Status). Meinen Filter muss ich neu wählen; dass ich vorher woanders war, merke ich erst beim Zählen. |

Was jetzt gut ist (Runde 1 P-1 und P-3): Es gibt einen Link «Zu den Nebenkostenabrechnungen», ich komme also ohne Zurück-Pfeil weiter. Die Schrift ist die normale, gut lesbare Schrift der App, 16 px, bei 150 % gross genug; keine Schreibmaschinenschrift mehr. Der Link ist unterstrichen, 48 px hoch und mit der Tabulatortaste als Erstes erreichbar. Im dunklen Farbschema ist die Seite dunkelgrau mit weisser Schrift, gut lesbar; im hellen weiss mit schwarzer Schrift. Der Tab hat jetzt einen Titel statt nur der Adresse.

## Beobachtungen

- Zurück-Pfeil im alten Detail-Tab: Er zeigt wieder die Detailseite von Thomas Weber mit allen Beträgen, Status «Entwurf» und Knopf «PDF herunterladen», als gäbe es die Abrechnung noch (Screenshot `08-back-browser-dark.png`). Erst ein Neuladen zeigt «Diese Seite gibt es nicht.». Ich würde denken, das Löschen habe nicht geklappt. Im Listen-Tab dagegen lädt der Zurück-Pfeil die Liste neu, Thomas Weber fehlt dort richtig.
- Die alte Detailadresse direkt aufgerufen zeigt die allgemeine Seite «Diese Seite gibt es nicht. Prüfen Sie die Adresse oder gehen Sie zur Übersicht.» mit «Zurück» und «Zur Übersicht». Dieselbe Lage (Abrechnung gelöscht) bekommt also je nach Weg zwei verschiedene Seiten und Texte.
- Der Knopf «PDF» in der Liste öffnet im selben Tab; meine Liste wird ersetzt (wie in Runde 1).
- Die Zahl «Entwurf» war schon vor meinem Löschen bei 7 und danach bei 5: Ein anderer Entwurf (nicht in Seepark Residenz) wurde in der Zwischenzeit von jemand anderem gelöscht. Nicht von mir, nicht gewertet.
- Die Löschen-Rückfrage ist gut: «Die Abrechnung NK-22222222-2025-0001 von Thomas Weber wird gelöscht. Das lässt sich nicht rückgängig machen.»
- Fusszeile: «Version unbekannt».

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 3 Durchläufe. Schritte als Nutzerin: Liste «Entwurf» öffnen (1), Detail Thomas Weber in zweitem Tab (2), dritter Tab, «Abrechnung löschen» und bestätigen (3–4), im Detail-Tab «PDF herunterladen» (5), im Listen-Tab «PDF» (6), dasselbe im dunklen Farbschema (7–8), Link «Zu den Nebenkostenabrechnungen» (9), Zurück-Pfeil (10).

## Ablauf

1. **Liste «Entwurf» öffnen.** Erwartet: Thomas Weber mit Knopf «PDF». Gesehen: Zeile «Thomas Weber NK-22222222-2025-0001, Seepark Residenz, Wohnung A1, Rückerstattung CHF 34.55, Entwurf» mit Knopf «PDF» (`01-list.png`).
2. **Detail Thomas Weber im zweiten Tab.** Erwartet: Knopf zum Herunterladen. Gesehen: «PDF herunterladen» oben; das PDF musste ich nicht zuerst erstellen (`02-detail-light.png`).
3. **Löschen im dritten Tab.** Erwartet: Rückfrage mit Folgen. Gesehen: Dialog mit Nummer, Mieter und «Das lässt sich nicht rückgängig machen.»; nach «Abrechnung löschen» die Liste.
4. **Alter Detail-Tab, «PDF herunterladen», hell.** Erwartet: eine Meldung in Dwello, warum es nicht geht, und ein Weg zurück. Gesehen (`03-detail-gone-light.png`): weisse Fläche, oben links «Abrechnung nicht gefunden.» und darunter unterstrichen «Zu den Nebenkostenabrechnungen». Normale Schrift, gut lesbar. Kein Dwello-Kopf, keine Überschrift, kein Grund.
5. **Alter Listen-Tab, «PDF» bei Thomas Weber, hell.** Erwartet wie oben. Gesehen (`04-list-gone-light.png`): dieselbe Seite, im selben Tab; die Liste ist weg.
6. **Dasselbe dunkel.** Gesehen (`05-detail-gone-dark.png`, `06-list-gone-dark.png`): dunkelgraue Fläche, weisse Schrift, gleicher Inhalt. Gut lesbar, nichts blendet.
7. **200 % Zoom.** Gesehen (`10-list-gone-200.png`): Satz und Link gross, nichts abgeschnitten.
8. **Link «Zu den Nebenkostenabrechnungen».** Erwartet: zurück zu meiner Liste. Gesehen (`07-back-via-link-light.png`): die Liste mit Dwello-Kopf, aber ohne Filter: «15 Abrechnungen» statt meiner 5 Entwürfe. Thomas Weber ist nicht mehr dabei, aber kein Hinweis sagt mir das.
9. **Zurück-Pfeil im Detail-Tab.** Erwartet: irgendetwas Sinnvolles. Gesehen (`08-back-browser-dark.png`): die alte Detailseite von Thomas Weber, als wäre nichts gelöscht (siehe Beobachtungen).
10. **Tab-Leiste.** Gesehen: «Nebenkostenabrechnungen - Dwello» auf der Fehlerseite, gleich wie die Liste.

## Verwirrung

- «Abrechnung nicht gefunden.»: Ich verstehe jetzt, dass ich zur Liste zurück kann, aber nicht, warum sie fehlt. Dass ich sie in einem anderen Tab gelöscht habe, verbinde ich nicht von selbst damit; ich frage mich, ob ich etwas kaputt gemacht habe.
- Der Tab-Titel sagt «Nebenkostenabrechnungen», die Seite zeigt eine Fehlermeldung.
- Nach dem Link ist die Liste länger als vorher; wo ist mein Filter «Entwurf» hin?

## Fehlerrisiken

- Wer den Satz als Systemfehler liest, drückt mehrmals oder ruft jemanden an, obwohl die Abrechnung absichtlich gelöscht wurde.
- Wer mit dem Zurück-Pfeil zur alten Detailseite geht, sieht die gelöschte Abrechnung wieder und glaubt, das Löschen sei misslungen (Beobachtung, nicht diese Seite).

## Vorschläge

- **P-1:** Reproduktion: Liste «Entwurf» und Detail einer Abrechnung offen lassen, die Abrechnung in einem dritten Tab löschen, dann im alten Tab «PDF» oder «PDF herunterladen» drücken. Hilfreich: ein zweiter Satz mit Grund und nächstem Schritt, z. B. «Sie wurde vielleicht gelöscht. Öffnen Sie die Liste und wählen Sie die Abrechnung neu.»
- **P-2:** Reproduktion wie P-1. Hilfreich: die Seite im Dwello-Rahmen zeigen (Kopf, Überschrift, Fusszeile), so wie «Diese Seite gibt es nicht.»; dann weiss ich, dass ich noch in Dwello bin.
- **P-3:** Reproduktion wie P-1, Tab-Leiste ansehen. Hilfreich: Titel wie «Abrechnung nicht gefunden – Dwello».
- **P-4:** Reproduktion: wie P-1 aus der Liste mit Filter «Entwurf», dann «Zu den Nebenkostenabrechnungen». Hilfreich: zur Liste mit dem vorherigen Filter zurückführen, oder es so lassen, wenn das zu aufwendig ist; mich stört es nur wenig.

## Nicht geprüft

- Andere Sprachen (fr, it, en): Die Aufgabe war Deutsch.
- Wie ein normaler Browser ein vorhandenes PDF im Tab anzeigt: Der Testbrowser lädt PDFs als Datei herunter; hier kam ohnehin kein PDF, weil die Abrechnung gelöscht war.
- Andere Fehlerursachen (z. B. Server nicht erreichbar): nicht in der Aufgabe.
- Mobil: nicht in meinem Profil.
