# Helga – Slice `update` (#1453)

Desktop 1440 × 900, Zoom 150 %, Maus. Frische Installation Dwello 1.4.0 auf http://localhost:3300, abgemeldet gestartet, angemeldet mit landlord@dwello.test. Ein Platzhalter meldet Dwello 1.5.0 und spielt das Update nur vor.

Ich bin Helga. Mit dem Computer bin ich unsicher, und bei «Update» denke ich zuerst: Hoffentlich ist danach nicht alles weg.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fortschrittsanzeige «Dwello wird auf Version 1.5.0 aktualisiert» | Ich sehe nicht, welche Schritte schon erledigt sind. «Herunterladen» (erledigt) und «Neu starten» (folgt) sehen gleich aus: beide grau, ohne Häkchen. Nur der laufende Schritt ist fett. «Schritt 2 von 3» und «(erledigt)/(läuft)/(folgt)» stehen zwar im Text der Seite, waren auf meinem Bildschirm aber nicht zu sehen. |
| P-2 | Minor | Nach dem Update (Übersicht) | Nach «Neu starten» lädt die Seite einfach neu. Es kommt keine Meldung wie «Dwello ist jetzt auf Version 1.5.0, Ihre Daten sind da». Ich wüsste nicht, ob es geklappt hat. (Mit dem Platzhalter blieb die Version auf 1.4.0 und der Hinweis kam wieder. Das war angekündigt, aber eine Bestätigung habe ich auch nicht gesehen.) |
| P-3 | Minor | Hinweis und Bestätigung «Dwello jetzt aktualisieren?» | Nirgends steht, was ich tun soll, wenn etwas schiefgeht oder Dwello nach «einigen Minuten» nicht zurückkommt: wen ich anrufe, ob die Sicherung von vorher hilft, ob ich das Notfallblatt brauche. Auch die Hilfe-Seite sagt nichts zu Updates. |
| P-4 | Minor | Hinweis «Neue Version verfügbar» | «Was ist neu?» öffnet in einem neuen Fenster eine Seite bei GitHub (github.com/…/releases/tag/v1.5.0). Das ist eine fremde, technische Seite und wohl auf Englisch. Dass ich Dwello verlasse, sagt mir vorher nichts. |
| P-5 | Minor | Hinweis vor eingerichteter Sicherung | Nach der Anmeldung landete ich auf «Sicherung einrichten», und oben stand im Hinweis trotzdem der Link «Richten Sie zuerst die Sicherung ein». Der Link führt auf die Seite, auf der ich schon bin. Ich habe kurz gesucht, ob ich woanders hin muss. |
| P-6 | Minor | Einstellungen, Abschnitt «Updates» | «Updates spielt dann die Person, die Dwello betreut, selbst ein»: «einspielen» verstehe ich nicht, und bei mir betreut niemand Dwello. Der Abschnitt nennt auch nicht, welche Version ich habe, und bietet keinen Weg zum Aktualisieren. Er steht ganz unten auf einer sehr langen Seite. |

## Beobachtungen

- Der Text im Hinweis beruhigt mich: «Das Update dauert einige Minuten; Ihre Daten bleiben erhalten.» Und vor eingerichteter Sicherung: «Vor dem Update sichert Dwello Ihre Daten. Dafür muss die Sicherung eingerichtet sein.» Das hat mir die meiste Angst genommen.
- Die Bestätigung ist klar und ehrlich: «Dwello lädt Version 1.5.0 herunter, sichert Ihre Daten und startet neu. Das dauert einige Minuten; so lange können Sie Dwello nicht nutzen. Eingaben auf dieser Seite, die Sie noch nicht gespeichert haben, gehen verloren.» Die Knöpfe «Abbrechen» und «Jetzt aktualisieren» sind gross und gut lesbar.
- «Update» und «aktualisieren» stehen nebeneinander: «Das Update dauert …», Knopf «Aktualisieren». Ich verstehe beides, ein Wort würde aber genügen. «Version 1.5.0 (Sie haben 1.4.0)» ist verständlich. «Sicherung» kenne ich. «Wiederherstellungscode» und «Notfallblatt» sind auf der Seite «Sicherung einrichten» gut erklärt.
- Der Knopf «Aktualisieren» im Hinweis ist nur umrandet, nicht gefüllt. «Später» sieht aus wie ein Link. Das passt, ich bin nicht gedrängt worden.
- «Später» blendet den Hinweis aus, auch nach dem Neuladen. Wann er wiederkommt, sagt mir niemand. Ich habe «Später» am Schluss angeklickt. Weil alle dasselbe Konto nutzen, sehen andere Personas den Hinweis vielleicht nicht mehr.
- Die Fortschrittsanzeige sagt: «Danach sehen Sie wieder die Seite, auf der Sie waren.» Das stimmte (Übersicht).
- Der Abschnitt «Updates» erklärt den Datenschutz gut: GitHub, USA, nur die IP-Adresse des Servers, keine Daten aus Dwello.
- Gleich nach der Anmeldung zeigt die Übersicht «Das KI-Modell wird geladen: 40 %». Das ist ein zweiter technischer Hinweis neben dem Update-Hinweis. «KI-Modell» verstehe ich nicht ganz, es hat mich aber nicht gestört.

## Aufgabe geschafft: ja

Würde ich auf «Aktualisieren» klicken? Ja, aber erst, nachdem die Sicherung eingerichtet war. Ich erwarte, dass meine Daten bleiben, weil Dwello vorher sichert. Es dauert «einige Minuten», und ich muss nur vorher speichern, was ich gerade eingebe. Was ich tun soll, wenn es schiefgeht, weiss ich nicht.

## Aufwand

Etwa 10 Minuten, rund 12 Schritte: anmelden, Sicherung einrichten (Notfallblatt herunterladen, Code abtippen, «Sicherung starten»), Hinweis lesen, «Was ist neu?» ansehen (nur das Ziel geprüft), «Aktualisieren», Bestätigung lesen, «Jetzt aktualisieren», etwa 5 s Fortschritt, Einstellungen öffnen, bis «Updates» scrollen, Hilfe durchsuchen.

## Ablauf

- Nach der Anmeldung: Ich erwartete die Übersicht mit dem Hinweis. Ich landete auf «Sicherung einrichten», und der Hinweis sagte «Richten Sie zuerst die Sicherung ein» als Link auf dieselbe Seite (P-5).
- Fortschrittsanzeige: Ich erwartete Häkchen bei den fertigen Schritten. Ich sah nur den laufenden Schritt fett, die anderen grau (P-1).
- Ende des Updates: Ich erwartete eine Erfolgsmeldung. Die Übersicht erschien ohne Meldung, mit dem alten Hinweis und «Version 1.4.0» unten (Platzhalter, P-2).
- «Was ist neu?»: Ich erwartete eine kurze Liste in Dwello. Der Link führt in einem neuen Fenster zu GitHub (P-4).
- Einstellungen, «Updates»: Ich erwartete die aktuelle Version und einen Knopf zum Aktualisieren. Dort ist nur ein Häkchen «Täglich nach neuen Versionen suchen» mit Erklärung (P-6).
- Hilfe: Ich erwartete einen Abschnitt zu Updates oder zu «wenn etwas schiefgeht». Ich fand nichts zu «Update», «aktualisieren» oder «Version» (P-3).

## Vorschläge

- **P-1:** Anmelden, Sicherung eingerichtet, «Aktualisieren» → «Jetzt aktualisieren», während Schritt 2 hinsehen. Hilfe: vor erledigten Schritten ein Häkchen und das sichtbare Wort «erledigt», beim laufenden «läuft …». Der Text «Schritt 2 von 3» soll auch sichtbar sein.
- **P-2:** Update bis zum Ende laufen lassen. Hilfe: nach dem Neustart eine grüne Meldung, z. B. «Dwello ist jetzt auf Version 1.5.0. Ihre Daten sind erhalten.» Wenn die Version danach gleich bleibt: eine Meldung, dass das Update nicht geklappt hat und was nun zu tun ist.
- **P-3:** Hinweis oder Bestätigung lesen. Hilfe: ein Satz in der Bestätigung wie «Ist Dwello nach 15 Minuten nicht zurück, wenden Sie sich an die Person, die Dwello betreut; Ihre Daten sind in der Sicherung von heute.» Dazu ein Abschnitt «Updates» in der Hilfe.
- **P-4:** Auf «Was ist neu?» zeigen. Hilfe: im Linktext sagen, dass er zu GitHub führt und sich ein neues Fenster öffnet (z. B. «Was ist neu? (GitHub, neues Fenster)»), oder die wichtigsten Neuerungen kurz in Dwello nennen.
- **P-5:** Frische Installation, anmelden, ohne Sicherung. Hilfe: auf der Seite «Sicherung einrichten» statt des Links der Satz «Richten Sie unten zuerst die Sicherung ein.»
- **P-6:** Einstellungen öffnen und bis «Updates» scrollen. Hilfe: «einspielen» durch «installieren» ersetzen, die eigene Version nennen («Sie haben Version 1.4.0») und, wenn eine neue Version da ist, den Knopf «Aktualisieren» auch hier zeigen.

## Nicht geprüft

- Ein echtes Update auf eine andere Version: Der Platzhalter lässt die Version auf 1.4.0. Ob danach eine Erfolgsmeldung käme, konnte ich nicht sehen.
- Ein fehlgeschlagenes Update: Der Auftrag nannte keine Anfrage, die ich scheitern lassen sollte.
- Die Seite hinter «Was ist neu?»: Ich habe nur das Ziel des Links gelesen (GitHub, neues Fenster), sie aber nicht geöffnet, weil sie ausserhalb von Dwello liegt.
- Die Einstellung «Updates» ausschalten und speichern: Der Auftrag sagt, nicht zu speichern.
- 200 % Zoom habe ich nicht geprüft.
