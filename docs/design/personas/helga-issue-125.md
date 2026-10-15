# Helga – Issue #125: PDF einer gelöschten Abrechnung

Persona: Helga, 68, Anfängerin, liest langsam, braucht grosse Schrift. Desktop 1280 × 900 bei 150 % Zoom, Maus, Deutsch.
Aufgabe: Liste der Nebenkostenabrechnungen und Entwurf 2025 von Thomas Weber (Seepark Residenz, A1) in zwei Tabs öffnen, den Entwurf in einem Tab löschen, dann im anderen Tab «PDF herunterladen» (Detail) und «PDF» (Liste) drücken und den Satz beurteilen; danach prüfen, ob das echte PDF von Nina Brunner (Entwurf 2025) noch kommt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-125/` (`s4.mjs` Hauptablauf, `s5.mjs` Nina Brunner und Zurück-Knopf).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Fehlerseite nach «PDF» / «PDF herunterladen» einer gelöschten Abrechnung | Der Satz ersetzt die ganze Dwello-Seite: weisse Seite, nur «Abrechnung nicht gefunden.» oben links, kein Dwello-Kopf, kein Link zurück zur Liste, kein Hinweis, was ich jetzt tun soll. Aus der Liste heraus ist meine Liste damit weg; ich komme nur mit dem Zurück-Pfeil des Browsers zurück, und darauf komme ich nicht von selbst. |
| P-2 | Minor | dieselbe Fehlerseite | «Abrechnung nicht gefunden.» sagt nicht, warum (z. B. gelöscht) und nicht, was zu tun ist. Ich bekomme Angst, dass etwas kaputt oder verloren ist. Es fehlt ein zweiter Satz wie «Sie wurde vielleicht gelöscht. Öffnen Sie die Liste der Abrechnungen neu.» |
| P-3 | Nit | dieselbe Fehlerseite | Die Schrift ist eine Schreibmaschinenschrift und klein im Verhältnis zur übrigen App; der Tab hat keinen Titel, oben steht nur die Adresse `localhost:3300/api/statements/…/pdf`. |

## Beobachtungen

- Die heruntergeladene Datei heisst je nach Knopf anders: aus der Liste `statement-01422a95-….pdf` (englisch), aus der Detailseite `abrechnung-01422a95-….pdf`. Beide Namen enthalten eine lange Zeichenkette statt Mieter oder Abrechnungsnummer; im Download-Ordner finde ich die Datei so nicht wieder.
- Im PDF von Nina Brunner steht bei der Adresse des Hauses «Liegenschaft», in der App heisst es überall «Gebäude».
- Das Löschen selbst war gut: Die Rückfrage nennt Nummer und Mieter und sagt «Das lässt sich nicht rückgängig machen.»; danach erscheint oben rechts «Abrechnung NK-22222222-2025-0001 gelöscht» und die Zahl «Entwurf» sinkt von 7 auf 6.
- In der Liste steht die Meldung «… gelöscht» rechts über der ersten Zeile und verdeckt einen Teil der Liste, bis man sie schliesst (Screenshot `05-after-delete.png`).
- Detailseite: Der Knopf heisst «PDF herunterladen», nicht «Herunterladen»; in der Liste heisst er nur «PDF».
- Die Fusszeile zeigt «Version unbekannt».

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 5 Durchläufe. Schritte als Nutzerin: Liste öffnen (1), Abrechnung Thomas Weber öffnen (2), zweiten Tab mit derselben Abrechnung (3), «Abrechnung löschen» und bestätigen (4–5), im Detail-Tab «PDF herunterladen» (6), im Listen-Tab «PDF» (7), Zurück-Pfeil (8), «PDF» und «PDF herunterladen» bei Nina Brunner (9–11).

## Ablauf

1. **Liste öffnen** (Übersicht → «7 Entwurf»). Erwartet: Abrechnungen mit PDF-Knopf. Gesehen: Jede Zeile hat einen Knopf «PDF», auch Thomas Weber (NK-22222222-2025-0001, Rückerstattung CHF 34.55, Entwurf).
2. **Detail Thomas Weber öffnen.** Erwartet: Knopf zum Herunterladen. Gesehen: «PDF herunterladen» oben, im Verlauf «PDF erstellt 15.10.2026, 08:24». Das PDF war schon da, ich musste nichts erstellen.
3. **In einem dritten Tab löschen** (Liste und Detail standen vorher schon offen). Erwartet: Rückfrage. Gesehen: Dialog «Abrechnung löschen» mit «Die Abrechnung NK-22222222-2025-0001 von Thomas Weber wird gelöscht. Das lässt sich nicht rückgängig machen.», Knöpfe «Abbrechen» und «Abrechnung löschen». Nach dem Bestätigen: Liste, Meldung «… gelöscht», 16 statt 17 Abrechnungen.
4. **Im alten Detail-Tab «PDF herunterladen».** Erwartet: eine Meldung in der App, z. B. «Diese Abrechnung gibt es nicht mehr», und ein Weg zurück. Gesehen (`06-detail-pdf-gone.png`): Die ganze Seite wird weiss, oben links steht nur in Schreibmaschinenschrift «Abrechnung nicht gefunden.». Kein Dwello-Kopf, kein Knopf, kein Link. Immerhin auf Deutsch und kein technischer Text mehr.
5. **Im alten Listen-Tab «PDF» bei Thomas Weber.** Erwartet wie oben. Gesehen (`07-list-pdf-gone.png`): Genau dieselbe weisse Seite mit «Abrechnung nicht gefunden.», im selben Tab; meine Liste ist weg. Es öffnet sich kein neuer Tab und es kommt kein Download.
6. **Zurück-Pfeil des Browsers.** Erwartet: Ich hoffe, die Liste kommt wieder. Gesehen: Ja, «Nebenkostenabrechnungen» mit Filter «Entwurf» ist wieder da. Ohne Zurück-Pfeil wäre ich nicht weitergekommen.
7. **Nina Brunner, «PDF» in der Liste.** Erwartet: das PDF. Gesehen: Download `statement-01422a95-….pdf` (4777 Bytes, echtes PDF: «Nina Brunner, Seeweg 15, 6003 Luzern … Nebenkostenabrechnung 01.01.2025 – 31.12.2025»); die Liste bleibt stehen.
8. **Nina Brunner, «PDF herunterladen» auf der Detailseite.** Erwartet: dasselbe PDF. Gesehen: Download `abrechnung-01422a95-….pdf`, gleicher Inhalt; die Detailseite bleibt stehen.

## Verwirrung

- «Abrechnung nicht gefunden.»: Welche Abrechnung? Habe ich etwas falsch gemacht? Ist sie weg, oder liegt es am Computer? Dass ich sie in einem anderen Fenster gelöscht habe, verbinde ich nicht von selbst damit.
- Die weisse Seite sieht nicht mehr nach Dwello aus. Ich würde denken, ich sei aus dem Programm geflogen, und es neu starten oder jemanden anrufen.
- Zwei verschiedene Dateinamen für dasselbe PDF, einer davon englisch («statement»).

## Fehlerrisiken

- Wer auf der weissen Seite landet und den Zurück-Pfeil nicht kennt, schliesst den Tab oder tippt die Adresse neu ein und verliert den Filter in der Liste.
- Wer den Satz als Systemfehler liest, versucht es mehrmals oder meldet einen Fehler, obwohl die Abrechnung absichtlich gelöscht wurde.

## Vorschläge

- **P-1:** Reproduktion: Liste «Entwurf» und eine Abrechnung offen lassen, die Abrechnung in einem anderen Tab löschen, dann im alten Tab «PDF» (Liste) oder «PDF herunterladen» (Detail) drücken → weisse Seite nur mit «Abrechnung nicht gefunden.». Hilfreich: Die Meldung in der App zeigen (Dwello-Kopf, Hinweisbox oder Toast auf der Seite, auf der ich war) oder auf der Seite mindestens einen Link «Zur Liste der Abrechnungen».
- **P-2:** Reproduktion wie P-1. Hilfreich: zweiter Satz, der Grund und nächsten Schritt nennt, z. B. «Die Abrechnung wurde vielleicht gelöscht. Laden Sie die Liste neu und wählen Sie die Abrechnung erneut.»
- **P-3:** Reproduktion wie P-1, Tab-Leiste und Schrift ansehen. Hilfreich: Seitentitel (z. B. «Abrechnung nicht gefunden – Dwello») und die normale Schrift der App, gross genug.

## Nicht geprüft

- Andere Sprachen (fr, it, en): Die Aufgabe war Deutsch; ob der Satz in der gewählten Sprache kommt, habe ich nicht ausprobiert.
- Wie ein normales Browserfenster das PDF anzeigt (eingebaute PDF-Ansicht im Tab): Der Testbrowser lädt PDFs immer als Datei herunter. Ich sehe also nur, dass der Download kommt und der Tab stehen bleibt, nicht, ob ein echter Browser das PDF im Tab öffnet.
- Andere Fehlerursachen als «gelöscht» (z. B. Server nicht erreichbar): nicht in der Aufgabe.
