# Sven – Slice 947 (Sicherung einrichten, Neuer Wiederherstellungscode)

Persona: Sven, 45, blind, nur Tastatur und Screenreader (beurteilt am Accessibility-Tree). Desktop 1440 × 900.
App: frische Installation auf http://localhost:3310, abgemeldet gestartet, ohne Persona-Cookie, Einrichtungscode PERS-FRSH.
Skripte und Screenshots: `/tmp/sven-947/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht nach «Sicherung starten» | Nach dem erfolgreichen Start der Sicherung landet der Fokus auf dem Seitenanfang (body), angesagt wird nur «Übersicht - Dwello». Die Bestätigung «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» ist ein gewöhnlicher Absatz ohne Live-Region und ohne Fokus. Ich höre nicht, dass es geklappt hat, bis ich die Seite selbst durchlese. Bei «Neuer Wiederherstellungscode» springt der Fokus dagegen auf die Bestätigung – die beiden Abläufe verhalten sich verschieden. |
| P-2 | Minor | Sicherung einrichten und Neuer Wiederherstellungscode, Fehlerzustand | Die Fehlermeldung wird angesagt (Fokus springt auf das `alert`), aber das Feld «Wiederherstellungscode erneut eingeben» bekommt kein `aria-invalid` und ist nicht mit der Meldung verknüpft (`aria-describedby` zeigt nur auf den Hilfetext). Tabbe ich von der Meldung ins Feld, höre ich nur Name und Hilfetext, nicht mehr, was falsch war. |

## Beobachtungen

- Die Fehlermeldungen selbst sind gut: leer «Geben Sie den Wiederherstellungscode ein, der oben und auf dem Notfallblatt steht.»; teilweise «Der Code ist unvollständig: Sie haben 8 von 24 Zeichen eingegeben. Geben Sie alle 6 Gruppen ein, wie sie oben und auf dem Notfallblatt stehen.» Beide sagen, was fehlt und was zu tun ist. Die Zählung der Zeichen hilft mir, weil ich nicht nachsehen kann, wo ich mich vertippt habe.
- Nach jedem Fehler springt der Fokus auf die Meldung, das nächste Tab führt direkt ins Feld, mein Teilcode bleibt drin. Das ist für mich der richtige Weg.
- Die Meldung steht über dem Feldlabel. Gut, weil Tab von der Meldung direkt ins Feld führt.
- Kleinschreibung und fehlende Bindestriche wurden akzeptiert, wie im Hilfetext versprochen.
- Der Wiederherstellungscode steht als Absatz «X4E8-SRD2-…»; ein Screenreader liest ihn je nach Einstellung als Wort-Brei. Buchstabenweise lesen geht, aber eine Gruppierung mit Pausen (z. B. eigene Listenpunkte pro Gruppe) wäre für mich angenehmer.
- Nach «Neuen Code erstellen» springt der Fokus auf den Code selbst (Absatz mit dem Code). Gut, ich höre ihn sofort; die Überschrift «Ihr Wiederherstellungscode» steht direkt davor als Absatz, nicht als Überschrift.
- Auf «Neuer Wiederherstellungscode» ist der Hinweis «Geben Sie Ihr Passwort erneut ein. …» nicht mit dem Passwortfeld verknüpft; beim Tab ins Feld höre ich nur «Passwort». Wer direkt per Tab ins Feld geht, erfährt nicht, wessen Passwort gemeint ist (man errät es).
- Nach dem Bestätigen des neuen Codes: Fokus auf «Der neue Wiederherstellungscode gilt ab jetzt. Dwello erstellt gleich eine erste Sicherung mit ihm …», danach bietet die Seite nur noch den Link «Zurück zu den Einstellungen» (ein Tab). Klar fertig, klarer Rückweg. Der lange Einleitungstext zum alten Code bleibt oben stehen, stört aber nicht, weil der Fokus darunter landet.
- In der Navigation ist «Einstellungen» mit `aria-current="page"` markiert, auch auf «Neuer Wiederherstellungscode». Gut.
- Weg zu «Neuer Wiederherstellungscode»: 13 Tabs bis «Einstellungen», dann 22 Tabs bis zum Link (Navigation wird wieder durchlaufen; «Zum Inhalt springen» kürzt es). Mit Überschriftennavigation («Sicherung», Ebene 2) geht es schneller.
- Auf «Sicherung einrichten» ist die ganze Hauptnavigation erreichbar; ich hätte die Seite auch verlassen können, ohne die Sicherung zu starten. Was dann passiert, habe ich nicht geprüft.
- Nach dem Einrichten lädt `/backup` direkt auf die Übersicht um, und die Bestätigung erscheint dort nur einmal (beim erneuten Laden ist sie weg). Erwartet.
- Einrichtung «Dwello einrichten»: Labels, Hilfetexte (`aria-describedby`) und die Radiogruppe «Welche KI soll Rechnungen lesen?» waren per Tastatur gut bedienbar; Pfeil runter wählte «Später entscheiden».

## Aufgabe geschafft: ja

## Aufwand

Rund 15 Minuten. Einrichtung: 4 Tabs bis zum ersten Feld, 4 Felder, 1 Pfeiltaste, Absenden. Sicherung: 3 Versuche (leer, Teilcode, voller Code), je Skip-Link + 2 Tabs ins Feld. Neuer Code: 13 + 22 Tabs bis zum Link, Passwort, Code eintippen, bestätigen, 1 Tab zum Rückweg.

## Ablauf

- Sicherung mit vollem Code gestartet. Erwartet: eine Ansage, dass die Sicherung läuft, oder Fokus auf eine Bestätigung. Gesehen: Wechsel auf «Übersicht», angesagt nur «Übersicht - Dwello», Fokus auf body; die Bestätigung fand ich erst beim Durchlesen als dritten Absatz (P-1).
- Nach dem Fehler zurück ins Feld getabbt. Erwartet: «ungültig» und die Fehlermeldung beim Feld. Gesehen: nur Feldname und Hilfetext (P-2).
- Neuer Code bestätigt. Erwartet: Ansage des Erfolgs wie bei der Einrichtung (nämlich keine). Gesehen: Fokus springt auf die Erfolgsmeldung – besser als erwartet, aber anders als bei der Einrichtung.

## Vorschläge

- **P-1:** Frische Installation einrichten (KI «Später entscheiden»), auf «Sicherung einrichten» den vollen Code eingeben, «Sicherung starten». Auf der Übersicht ist der Fokus auf body, angesagt wird nur der Seitentitel. Hilfe: wie bei «Neuer Wiederherstellungscode» den Fokus auf die Bestätigung setzen (Element mit `tabindex="-1"`) oder sie in eine `role="status"`-Region legen.
- **P-2:** Auf «Sicherung einrichten» (oder nach «Neuen Code erstellen») das Feld leer lassen oder «X4E8-SRD2» eingeben, Enter. Fokus springt auf die Meldung; Tab ins Feld: kein `aria-invalid`, `aria-describedby` nur `backup-code-help`. Hilfe: im Fehlerfall `aria-invalid="true"` setzen und die Meldung zusätzlich in `aria-describedby` des Feldes aufnehmen.

## Nicht geprüft

- Teilcode beim Bestätigen des neuen Codes in «Neuer Wiederherstellungscode» (nur leer geprüft; die Meldung war dieselbe wie bei der Einrichtung).
- Falsches Passwort bei «Neuen Code erstellen» und Ablauf nach 30 Minuten: nicht Teil der Aufgabe.
- Verhalten ohne JavaScript bzw. vor dem vollständigen Laden: In einem Lauf drückte mein Skript Enter, bevor die Seite fertig geladen war; danach stand der Fokus auf `main`, das Feld war leer und keine Meldung zu sehen. Mit Warten auf das vollständige Laden liess es sich nicht wiederholen; die Sicherung war danach eingerichtet, `/backup` nicht mehr erreichbar. Ob ein sehr schneller Nutzer eine Eingabe stumm verliert, bleibt offen.
- Echter Screenreader (NVDA/VoiceOver): beurteilt nur am Accessibility-Tree und an Fokus und Live-Regionen.
- Notfallblatt-PDF: nicht geöffnet.
