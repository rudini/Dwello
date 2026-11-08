# Helga – Slice 1290: Dokument hochladen bei langsamem Server

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % und 200 % Zoom, Maus.
Aufgabe: Auf der Seite von Laura Keller ein PDF mit Titel hochladen; die Anfrage `POST /tenants/<id>?/upload` wird zurückgehalten (langsamer Server), danach mit Status 500 beantwortet. Gespeichert wurde nichts.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Mieter Laura Keller, «Dokument hochladen», während des Hochladens, 200 % | Der neue Satz «Das Dokument wird hochgeladen. Bis das Hochladen fertig ist, lassen sich Datei und Titel nicht ändern.» steht unter dem Knopf «Bitte warten …». Nach meinem Klick auf «Dokument hochladen» ist der Knopf ganz unten am Bildschirmrand, der Satz liegt darunter ausserhalb des sichtbaren Bereichs. Ich sehe nur graue Felder und «Bitte warten …», aber nicht, warum ich Datei und Titel nicht mehr ändern kann. Erst wenn ich nach unten scrolle, finde ich die Erklärung. |

## Beobachtungen

- Bei 150 % ist alles gut: Nach dem Klick sehe ich «Bitte warten …» mit einem sich drehenden Kreis, darunter den Satz in normaler Schrift (16 px, dunkle Farbe, gleich gross wie die Hilfetexte, etwas dunkler als diese). Ich habe ihn ohne Mühe gelesen und verstanden: Es wird hochgeladen, und bis das fertig ist, kann ich nichts ändern. Das «bis wann» ist klar: bis das Hochladen fertig ist.
- Bei 200 % ist der Satz, wenn ich ihn gefunden habe, gross und gut lesbar (Bildschirmfoto der ganzen Seite: direkt unter dem Knopf, zwei Zeilen).
- Datei und Titel sind wirklich gesperrt: Ins Titelfeld konnte ich nichts tippen (mein Titel «Mietvertrag unterschrieben» blieb), und «Datei auswählen» öffnete kein Fenster. Die gesperrten Felder sind grau hinterlegt; der Unterschied zum normalen Zustand (weiss bzw. hellblau) ist erkennbar, aber nicht sehr stark. Mit dem Satz dazu ist es für mich verständlich.
- Auch nach 18 Sekunden Warten änderte sich nichts: weiterhin «Bitte warten …» und derselbe Satz. Ein Hinweis, was ich tun soll, wenn es sehr lange dauert, fehlt; ich hätte aber auch nicht damit gerechnet.
- Der Satz sagt «Datei und Titel», auf dem Bildschirm heissen die Felder «Datei» und «Titel (optional)» – das passt zusammen.
- Nach dem Fehler (Status 500) erschien ein rot hinterlegter Kasten mit Ausrufezeichen: «Das hat nicht geklappt – Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».» Das ist klar und sagt mir, was ich tun soll. Der Satz zum Hochladen verschwand, die Felder waren wieder bedienbar, Datei («Mietvertrag-Scan.pdf») und Titel blieben erhalten, der Knopf heisst wieder «Dokument hochladen» und hat einen Rahmen (Fokus). Ich muss die Datei also nicht neu suchen – sehr angenehm.
- Bei 200 % scrollte die Seite nach dem Fehler so, dass Fehlerkasten und Knopf zu sehen sind; Dateiname und Titel liegen dann oben ausserhalb. Weil der Kasten «noch einmal Dokument hochladen» sagt, wusste ich trotzdem, was zu tun ist.
- Kleinigkeit: Der Fehlertext sagt «weil Dwello nicht geantwortet hat», obwohl eigentlich eine Fehlermeldung kam. Für mich spielt das keine Rolle.
- Im Bedienungsbaum (nicht für mich, aber mir aufgefallen) steht «Bitte warten …» zweimal: als Knopf und zusätzlich als Statusmeldung. Sichtbar ist es nur einmal.
- Unverändert: In der Liste «Dokumente» steht weiterhin «Noch keine Dokumente.» – richtig, weil nichts gespeichert wurde.

## Aufgabe geschafft: ja

(Hochladen bewusst nicht abgeschlossen, da die Anfrage zurückgehalten und dann als Fehler beantwortet wurde.)

## Aufwand

Etwa 10 Minuten; je Zoomstufe rund 8 Schritte (Seite öffnen, zum Abschnitt scrollen, Datei auswählen, Titel tippen, hochladen, warten und Felder ausprobieren, Fehler abwarten, Fehler lesen).

## Ablauf

- 200 %, nach Klick auf «Dokument hochladen»: Erwartet, dass ich sehe, warum die Felder grau sind. Gesehen: nur graue Felder und «Bitte warten …» am unteren Rand; der erklärende Satz war erst nach Scrollen sichtbar (P-1).

## Vorschläge

- P-1: Zoom 200 % (Fenster 720 × 450 CSS-Pixel), Mieter → Laura Keller, nach unten bis «Dokument hochladen», PDF wählen, Titel eingeben, auf «Dokument hochladen» klicken, während die Anfrage hängt. Der Knopf steht am unteren Rand, der Satz darunter ist nicht zu sehen. Hilfreich wäre, den Satz über dem Knopf oder direkt neben «Bitte warten …» zu zeigen, oder die Seite so zu scrollen, dass er sichtbar wird.

## Nicht geprüft

- Ein echtes erfolgreiches Hochladen: laut Auftrag nichts speichern.
- Andere Fehlerarten (z. B. zu grosse Datei, Netzwerkabbruch statt Status 500): nicht Teil des Auftrags.
- Dunkelmodus: nicht Teil des Auftrags.

Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/cc5a2438-8ae1-53f9-bcb1-f769abb40fea/scratchpad/helga-1290/` (u. a. `150-04-wartet-viewport.png`, `200-04-wartet-viewport.png`, `200-04-wartet.png`, `150-06-fehler-viewport.png`, `200-06-fehler-viewport.png`).
