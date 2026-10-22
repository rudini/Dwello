# Helga, Issue #580: KI im Browser wählen («Einstellungen» › «KI»)

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift, Fachwörter machen sie unsicher. Desktop 1440 × 900 bei 150 % Zoom (auch 200 %), Maus. Persona-App auf http://localhost:3300, Demodaten. Ich habe nur geschaut und «Verbindung prüfen» gedrückt, «KI speichern» nie.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-580/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | KI, «Verbindung prüfen» | Erfolg und Fehler sehen genau gleich aus: graue Normalschrift unter dem Knopf, ohne Symbol, ohne Farbe, ohne Rahmen. Ob es geklappt hat, merke ich erst, wenn ich den ganzen Satz lese. |
| P-2 | Minor | KI, «Verbindung prüfen» | Wenn ich nach einer erfolgreichen Prüfung den API-Schlüssel ändere (auf «falsch»), steht weiter «Die Verbindung steht, und das Modell liest Rechnungsbilder.» So glaube ich, der neue Schlüssel sei geprüft. |
| P-3 | Minor | KI, Fehler beim API-Schlüssel | «Der Anbieter lehnt den API-Schlüssel ab. … geben Sie ihn erneut ein.» steht unten beim Knopf, das Feld «API-Schlüssel» liegt bei 200 % fast zwei Bildschirme weiter oben und ist nicht markiert (kein roter Rahmen, kein Hinweis am Feld). |
| P-4 | Minor | KI, Feld «Adresse der KI» | Die Hilfe «Die Adresse, die Ihnen der Anbieter für eine OpenAI-kompatible Schnittstelle nennt.» sagt mir nichts: «OpenAI-kompatible Schnittstelle» ist ein Fachwort, und es gibt kein Beispiel, wie so eine Adresse aussieht (andere Felder in Dwello haben «Beispiel: …»). |
| P-5 | Minor | KI, Feld «API-Schlüssel (optional)» | Oben steht «Sie brauchen dort ein Konto und einen API-Schlüssel.», am Feld aber «(optional)». Was ein API-Schlüssel ist und wo ich ihn beim Anbieter finde, steht nirgends. |
| P-6 | Minor | KI, Feld «Name des Anbieters» | Die Hilfe ist dieselbe wie beim Land: «Bearbeiten mehrere Firmen oder Länder die Daten, nennen Sie alle, mit Komma getrennt.» Wozu der Name gebraucht wird (Datenschutzerklärung?) und welcher Name gemeint ist (Firma? Produkt?), erfahre ich nicht. |
| P-7 | Nit | KI, Feld «Modell» | Kein Beispiel für einen Modellnamen; ich weiss nicht, was ich abschreiben soll. Die Erklärung «Ein Modell, das Bilder liest» ist aber gut. |

## Beobachtungen

- Der Weg ist kurz: Menü (☰) › «Einstellungen» › Kachel «KI» mit dem Satz «Lokale KI, KI eines Anbieters oder keine KI». Im Menü selbst steht «KI» nicht, nur auf der Seite «Einstellungen» (dort unter einer eigenen Überschrift «KI»). Gefunden habe ich es trotzdem.
- Die drei Wahlmöglichkeiten sind grosse Kästen mit einem Satz darunter; das gefällt mir. «Keine KI – Sie erfassen Rechnungen von Hand.» verstehe ich sofort. «KI eines Anbieters» sagt ehrlich, dass Namen und Adressen an den Anbieter gehen: gut.
- «Lokale KI auf diesem Server … braucht rund 16 GB Arbeitsspeicher»: Ob mein Server das hat, weiss ich nicht, und bei dieser Wahl gibt es keinen Knopf zum Prüfen. Ich würde «Keine KI» oder, falls mein Neffe den Server betreut, «Lokale KI» nehmen; einen Anbieter würde ich mir wegen der Checkliste nicht zutrauen.
- Bei «Lokale KI» und «Keine KI» verschwinden die Felder und nur «KI speichern» bleibt; was mit schon gewählten Anbieter-Angaben passiert, sagt die Seite nicht (nicht gespeichert, also nicht geprüft).
- Die Checkliste «Bevor Sie einen Anbieter wählen» ist lang und juristisch (Art. 9 DSG, Art. 16 Abs. 1 DSG, «Swiss-U.S. Data Privacy Framework»). Der Satz «Das ist eine Checkliste, keine Rechtsberatung.» ist ehrlich, aber ich könnte die drei Punkte allein nicht prüfen. «Läuft die KI auf einem Server, den Sie selbst betreiben, entfällt dieser Punkt» verwirrt mich: Ist das dann nicht «Lokale KI»?
- «Verbindung prüfen» funktioniert auch ohne Häkchen bei «Ich habe diese drei Punkte … geprüft.»; das Häkchen lässt sich auch über den Text anklicken (gut, das Kästchen selbst ist nur 24 px gross).
- Die Fehlertexte sind gut formuliert und sagen, was zu tun ist:
  - Schlüssel «falsch»: «Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.»
  - Schlüssel «gueltig»: «Die Verbindung steht, und das Modell liest Rechnungsbilder.»
  - Adresse http://127.0.0.1:9/v1 (zusätzlich probiert): «Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.»
  - Modell «text-modell» (zusätzlich probiert): «Das Modell liest keine Bilder. Wählen Sie ein Modell, das Bilder liest; sonst kann Dwello hochgeladene Rechnungen nicht auslesen.»
- Ohne neuen Schlüssel (Feld leer, «Ein API-Schlüssel ist gespeichert.») prüft Dwello mit dem gespeicherten und meldet Erfolg; das ist sinnvoll.
- Der API-Schlüssel wird als Punkte angezeigt (Passwortfeld): gut.
- Die Prüfung läuft über die eigene Seite (`POST /config/ki?/check`), nicht direkt vom Browser zum Anbieter.
- Die Felder waren beim Öffnen schon ausgefüllt («Muster KI AG», Land «China», später «Deutschland»); das kommt von der anderen Persona, die auf dieser Seite speichert, und zählt nicht als Befund.
- Bei 150 % und 200 % kein seitliches Scrollen (Breite 960 bzw. 720 CSS-Pixel, Inhalt gleich breit), Knöpfe 48 px hoch, Text gut lesbar, alles untereinander. Bei 200 % ist die Seite allerdings sehr lang (rund fünf Bildschirme).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 20 Schritte (Menü öffnen, Einstellungen, KI, drei Wahlmöglichkeiten anschauen, Felder ausfüllen, vier Prüfungen, Zoom 200 %).

## Ablauf

1. Übersicht bei 150 %. Erwartet: ein Menüpunkt «Einstellungen». Gesehen: kein Menü sichtbar, nur ☰ oben links. Nach Klick ein Seitenmenü; «Einstellungen» steht unten (scrollen nötig).
2. «Einstellungen». Erwartet: etwas zur KI. Gesehen: Kacheln «Stammdaten» (Kategorien, Verteilschlüssel, Heizprofile), darunter Überschrift «KI» mit Kachel «KI – Lokale KI, KI eines Anbieters oder keine KI». Klar.
3. Seite «KI» (/config/ki). Erwartet: Erklärung, was KI in Dwello tut. Gesehen: «Wählen Sie, welche KI Rechnungen liest und kategorisiert.» und drei grosse Wahlkästen. Verstanden: die KI liest Rechnungen. «Kategorisiert» ist mir etwas fremd, aber die Kategorien kenne ich von den Einstellungen.
4. «Lokale KI» angeklickt. Erwartet: Hinweis, ob mein Server reicht. Gesehen: nur «KI speichern». 
5. «Keine KI» angeklickt. Gesehen: nur «KI speichern». In Ordnung.
6. «KI eines Anbieters». Gesehen: Abschnitt mit fünf Feldern, jedes mit Hilfetext über dem Feld, darunter die Checkliste mit Häkchen und «Verbindung prüfen». Bei «Adresse der KI» und «Name des Anbieters» war ich unsicher (P-4, P-6).
7. Adresse http://127.0.0.1:2528/v1, Modell «bild-modell», Schlüssel «falsch», «Verbindung prüfen». Erwartet: rote Fehlermeldung beim Schlüssel. Gesehen: Satz in normaler Schrift unter dem Knopf (P-1, P-3). Inhalt verständlich.
8. Schlüssel «gueltig», prüfen. Erwartet: grünes Häkchen. Gesehen: gleich aussehender Satz «Die Verbindung steht, und das Modell liest Rechnungsbilder.» (P-1).
9. Danach Schlüssel wieder auf «falsch» geändert, ohne zu prüfen. Erwartet: die Erfolgsmeldung verschwindet. Gesehen: sie bleibt stehen (P-2).
10. 200 %: alles untereinander, kein seitliches Scrollen; die Meldung unten und das Schlüsselfeld oben liegen weit auseinander (P-3).

## Verwirrung

- «KI»: als Wort bekannt, was sie bei mir tut, erklärt der Untertitel knapp.
- «Anbieter»: verständlich als Firma, die die KI betreibt; welche Firmen in Frage kommen, steht nicht da.
- «API-Schlüssel»: nicht erklärt; «(optional)» widerspricht dem Satz oben (P-5).
- «Adresse der KI»: ich hätte eine Internetadresse wie www… erwartet; «OpenAI-kompatible Schnittstelle» verstehe ich nicht (P-4).
- «Modell»: die Hilfe sagt, was es können muss, aber nicht, wie ein Name aussieht (P-7).
- «Server», «16 GB Arbeitsspeicher»: für mich Technik, die ich nicht beurteilen kann.
- Checkliste: DSG-Artikel, «Bundesrat als angemessen anerkennt», «Data Privacy Framework» – ohne Hilfe nicht prüfbar.

## Fehlerrisiken

- Nach einer erfolgreichen Prüfung einen anderen Schlüssel eintippen und speichern im Glauben, er sei geprüft (P-2).
- Eine Fehlermeldung überlesen, weil sie wie die Erfolgsmeldung aussieht (P-1).
- Das Häkchen bei der Checkliste setzen, ohne die Punkte wirklich prüfen zu können.

## Vorschläge

- **P-1:** /config/ki, «KI eines Anbieters», Schlüssel «falsch», «Verbindung prüfen»; dann «gueltig». Beide Meldungen sehen gleich aus. Hilfe: Fehler als Fehlerhinweis (Symbol und Rahmen der App, Wort «Fehler»), Erfolg mit Häkchen-Symbol.
- **P-2:** Schlüssel «gueltig», prüfen, dann Feld auf «falsch» ändern. Die Erfolgsmeldung bleibt. Hilfe: Meldung entfernen, sobald Adresse, Schlüssel oder Modell geändert werden.
- **P-3:** 200 %, Schlüssel «falsch», prüfen. Meldung unten, Feld weit oben, unmarkiert. Hilfe: das betroffene Feld markieren und die Meldung (auch) am Feld zeigen, oder den Fokus dorthin setzen.
- **P-4:** Feld «Adresse der KI». Hilfe: «Steht im Konto des Anbieters, oft unter «API». Beispiel: https://api.anbieter.ch/v1» statt «OpenAI-kompatible Schnittstelle».
- **P-5:** Feld «API-Schlüssel (optional)». Hilfe: «Eine lange Zeichenfolge, die Sie im Konto beim Anbieter erstellen. Ohne Schlüssel nur, wenn die KI auf Ihrem eigenen Server läuft.»
- **P-6:** Feld «Name des Anbieters». Hilfe: eigener Text, z. B. «Die Firma, mit der Sie den Vertrag haben. Dwello nennt sie Ihren Mietern in der Datenschutzerklärung.» (falls das so ist).
- **P-7:** Feld «Modell». Hilfe: ein Beispiel ergänzen («Beispiel: …, steht in der Liste der Modelle beim Anbieter»).

## Nicht geprüft

- «KI speichern»: laut Auftrag nicht gedrückt (andere Persona speichert hier). Damit offen: ob Speichern ohne Häkchen abgelehnt wird, was mit einem ungeprüften Schlüssel passiert, und wie die Seite nach dem Speichern aussieht.
- «Lokale KI»: ob die Wahl auf diesem Server funktioniert oder warnt, lässt sich ohne Speichern nicht sehen.
- Ob eine gewählte KI danach wirklich beim Hochladen von Rechnungen verwendet wird: ausserhalb des Auftrags.
- Dunkler Modus und andere Sprachen: nicht Teil des Auftrags.
