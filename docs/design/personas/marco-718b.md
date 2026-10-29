# Marco – Slice 718b: Einrichten und Sicherung auf dem Handy

Frische Installation unter http://localhost:3300, abgemeldet, ohne persona-kit-Cookie. Handy 390 × 844, Touch. Einrichtungscode PERS-FRSH, Konto `marco@dwello.test`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Sicherung einrichten | Auf dem Handy lässt sich der Code nur durch Markieren kopieren, einen Knopf «Code kopieren» gibt es nicht. Halte ich den Finger lange auf den Code, markiert das Handy nur das erste Stück («FXY7»), weil die Bindestriche das Wort trennen. Diese 4 Zeichen habe ich eingefügt, und Dwello hat gemeldet: «Der Code stimmt nicht mit dem angezeigten überein.» Dass schlicht 20 von 24 Zeichen fehlten, sagt die Meldung nicht. |
| P-2 | Minor | Sicherung einrichten | Der Text sagt «Drucken Sie das Notfallblatt aus und bewahren Sie es getrennt von diesem Computer auf». Ich bin am Handy, und das PDF landet im Download-Ordner von genau diesem Handy. Wer wenig Zeit hat, lädt es herunter, hält das für erledigt und hat das Blatt dann nur auf dem Gerät, das verloren gehen kann. Wie ich es vom Handy aus drucke oder weitergebe, sagt die Seite nicht. |

## Beobachtungen

- Nach «Dwello einrichten» kam ich ohne Umweg auf «Sicherung einrichten» (/backup), nach rund 1,2 s. So soll es sein.
- Nach ungefähr 20 Sekunden Lesen war mir klar, was der Wiederherstellungscode ist: «Lesen kann eine Sicherung nur, wer diesen Wiederherstellungscode kennt. Ohne ihn lässt sich … nichts wiederherstellen, auch nicht von der Person, die Dwello betreut.» Auch die Aufgabe ist klar: Blatt herunterladen, Code noch einmal eingeben, «Sicherung starten». Den langen Absatz über den Ordner «backups» unten habe ich übersprungen. Er richtet sich an die Person, die Dwello betreut, nicht an mich.
- Bei 390 px bricht der Code nach dem dritten Block um: «FXY7-QFH3-H4KP-» / «DASE-H2MZ-BPFL», also am Bindestrich. Das ist gut lesbar (30 px, fett). Der Code hat aber `word-break: break-all`. Bei einer anderen Breite könnte er also mitten in einem Block umbrechen. Das habe ich nicht geprüft, siehe unten.
- Der Code steht in einer normalen Schrift (Inter), nicht in einer Schrift mit gleich breiten Zeichen. In meinem Code kam keine 0/O oder 1/I/l vor. Ob Dwello solche verwechselbaren Zeichen grundsätzlich weglässt, kann ich nicht sagen.
- Sowohl auf /backup als auch in der Übersicht scrollt nichts seitwärts (scrollWidth 390).
- Das Notfallblatt ist ein PDF mit einer A4-Seite, der Dateiname lautet «Notfallblatt-Dwello.pdf». Darin stehen der Titel «Notfallblatt Dwello», der Code (derselbe wie am Bildschirm, gross und gesperrt gedruckt), «Code erstellt am 29.10.2026. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.», die Adresse der Installation (http://localhost:3300), wo die Sicherungen liegen, «Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut …; was Sie danach erfasst haben, fehlt.», der Link zur Installationsanleitung und «Bewahren Sie dieses Blatt getrennt von Ihrem Computer … auf.» Das Blatt ist kurz und verständlich. Das Datum der Bestätigung steht nicht darauf, nur das Datum, an dem der Code erstellt wurde. Das ist für mich kein Problem.
- Nach dem Herunterladen blieb ich auf /backup, und der Code stand weiterhin da.
- Kopiert man den Code durch Markieren des ganzen Absatzes, kommen zwei Zeilenumbrüche mit («FXY7-…-BPFL\n\n»). Das Eingabefeld hat sie entfernt, und Dwello hat den Code angenommen.
- Nach dem falschen Code stand die Fehlermeldung im sichtbaren Teil des Bildschirms, direkt über dem Feld und mit dem Fokus darauf. Das Feld behielt meine Eingabe «FXY7», und der Code oben blieb sichtbar.
- Die Bestätigung in der Übersicht ist ein grüner Kasten mit Häkchen ganz oben, gleich unter dem Titel: «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» Sie ist gut sichtbar und klar formuliert, und sie hängt nicht nur an der Farbe, weil Häkchen und Text dabei sind. Lädt man die Seite neu, ist der Kasten weg. Im Baum steht die Meldung als gewöhnlicher Absatz und nicht in der Statusmeldung (das «status»-Element blieb leer).
- Nach der Bestätigung führt /backup ohne jeden Hinweis zur Übersicht, und /backup/sheet liefert kein PDF mehr, sondern eine HTML-Seite. Wo ich später nachsehe, ob die Sicherung läuft, habe ich im Menü auf die Schnelle nicht gefunden.
- In der Übersicht steht unter der Bestätigung «Das KI-Modell wird geladen: 40 %.», danach «Erstes Gebäude erfassen». Wie es weitergeht, ist klar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten. Rund 12 Schritte: 4 Felder auf der Einrichtungsseite, «Dwello einrichten», die Seite lesen, das PDF herunterladen und öffnen, den Code markieren und kopieren, ein Fehlversuch mit «FXY7», den ganzen Code einfügen, «Sicherung starten», die Übersicht.

## Ablauf

- Code kopieren. Erwartet: Langes Drücken auf den Code markiert den ganzen Code, oder es gibt einen Knopf zum Kopieren. Gesehen: Markiert wurde nur «FXY7», einen Kopierknopf gibt es nicht. Erst als ich den ganzen Absatz markiert hatte (dreimal tippen), war der Code vollständig in der Zwischenablage.
- Erster Versuch mit «FXY7». Erwartet: ein Hinweis wie «Der Code ist unvollständig». Gesehen: «Der Code stimmt nicht mit dem angezeigten überein. Geben Sie ihn so ein, wie er oben und auf dem Notfallblatt steht …». Das stimmt zwar, aber ich wusste nicht sofort, was ich falsch gemacht hatte.
- Notfallblatt. Erwartet: Die Seite sagt mir, was ich am Handy mit dem PDF tun soll. Gesehen: Der Text spricht von «Ausdrucken» und von «diesem Computer», das PDF liegt danach nur auf dem Handy.

## Vorschläge

- **P-1:** So stellt man es nach: Konto einrichten, auf /backup lange auf den Code drücken (es wird nur der erste Block markiert), einfügen, «Sicherung starten», Meldung «stimmt nicht überein». Helfen würde ein Knopf «Code kopieren» neben dem Code (mit Rückmeldung «Kopiert»), oder ein Code, der sich mit einem Tippen ganz markieren lässt. Ausserdem wäre ein eigener Hinweis gut, wenn zu wenige Zeichen eingegeben sind: «Der Code ist unvollständig: Er hat 24 Zeichen.»
- **P-2:** So stellt man es nach: Auf dem Handy /backup öffnen und den Text unter dem Code lesen. Helfen würde eine Formulierung, die auch für das Handy passt, etwa «getrennt von diesem Gerät». Dazu ein kurzer Satz: «Sind Sie am Handy, schicken Sie das PDF an einen Drucker oder schreiben Sie den Code auf Papier ab. Eine Kopie nur auf dem Handy genügt nicht.»

## Nicht geprüft

- Was passiert, wenn ich die Sicherung überspringe und direkt zur Übersicht gehe (ob Dwello dann erinnert oder zurückleitet). Ich habe zuerst bestätigt, und danach führt /backup nur noch zur Übersicht. Die Einrichtung geht pro Instanz nur einmal, also konnte ich das nicht wiederholen.
- Wie der Code bei anderen Breiten als 390 px umbricht (wegen `break-all`). Die Seite mit dem Code ist nach der Bestätigung nicht mehr erreichbar.
- Ein echter Druck oder das Teilen des PDFs vom Handy aus. Das kann der Testbrowser nicht. Ich habe die PDF-Datei gespeichert und ihren Text gelesen.
- Ein echtes langes Drücken auf dem Handy. Ich habe es als Wortmarkierung nachgestellt (Doppeltippen), das ganze Markieren als dreifaches Tippen.

## Triage (caller)

- P-1, P-2 (Minor): stay. A copy button and a phone hint for the sheet are new features, not a fix of this slice.
