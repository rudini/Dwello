# Persona-Review W5b, Runde 2: Dr. Weber, Hinweis «Kategorie «Von Dwello»»

Persona: Dr. Weber, 52, vorsichtig in Rechtsfragen, liest alles. Desktop 1440 × 900, Maus. App: http://localhost:3300 (Demodaten). Nachprüfung eines einzigen geänderten Texts: der Infokasten auf den Bearbeitungsseiten von «Liegenschaftssteuer» (nicht umlagefähig) und «Hauswart» (umlagefähig), auf Deutsch, Französisch, Italienisch und Englisch. Frühere Runde: `weber-w5b.md` (P-1, P-3 bis P-6, P-9).

Ich habe nichts gespeichert. Jede Nicht-GET-Anfrage ausser dem Sprachwechsel war zur Sicherheit auf eine Antwort 500 umgeleitet, abgefangen wurde aber keine. Die Auswahl habe ich nur umgeklickt, um zu sehen, ob der Kasten sich ändert. Am Schluss habe ich die Sprache wieder auf Deutsch gestellt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f274fd7a-1d44-5308-94cb-2310f5a5f24e/scratchpad/weber-w5b-2/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Kategorie bearbeiten (Liegenschaftssteuer) | Teilweise behoben. Die rechtliche Aussage ist jetzt eindeutig: «Wählen Sie «Umlagefähig», schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht.» Was Dwello in diesem Fall tut, sagt der Kasten aber nicht. Das erfahre ich nur aus dem Satz an der Auswahl: «Die Kosten fliessen in die Nebenkostenabrechnung.» Erst wenn ich beides zusammen lese, verstehe ich: Dwello rechnet die Steuer ab, der Mieter schuldet sie aber nicht. Ausdrücklich steht das nirgends, und es steht auch nicht, dass die Liegenschaftssteuer zu diesen Kosten gehört. Der passende Satz «Steuern auf die Liegenschaft trägt der Vermieter (Art. 256b OR)» verschwindet weiterhin, sobald ich «Umlagefähig» wähle. |
| P-3 | behoben | Kategorie bearbeiten (Hauswart) | «… fliessen ihre schon erfassten Rechnungen nicht mehr in neue Nebenkostenabrechnungen; schon erstellte bleiben, wie sie sind.» Jetzt ist klar, welche Abrechnungen betroffen sind. Offen bleibt nur, ob ein Entwurf als «erstellt» gilt (siehe Nit P-11). |
| P-4 | behoben | Kategorie bearbeiten (beide) | Der Kasten hängt jetzt vom gespeicherten Zustand ab. Bei der Liegenschaftssteuer beschreibt er den Wechsel zu «Umlagefähig», beim Hauswart den Wechsel zu «nicht umlagefähig». Das «zurück» bezieht sich beim Hauswart eindeutig auf «Umlagefähig». Klicke ich die Auswahl um, ohne zu speichern, bleibt der Kasten gleich. Das passt, denn er beschreibt genau diesen Wechsel. |
| P-5 | Nit | Kategorie bearbeiten (Hauswart) | Weitgehend behoben. «… müssen Sie diese Rechnungen einzeln wieder auf «Umlagefähig» stellen» sagt, was zu tun ist. Wo das geht (bei der einzelnen Rechnung unter «Rechnungen») und wie viele Rechnungen betroffen sind, steht nicht da. |
| P-6 | behoben | Kategorie bearbeiten (beide) | «… hat ihre Umlagefähigkeit nach dem Mietrecht voreingestellt» klingt nicht mehr wie eine Rechtsauskunft. Dass der Mieter nur zahlt, was der Mietvertrag nennt, steht direkt darunter im Hilfetext zur Auswahl (Art. 257a Absatz 2 OR). Das genügt mir. |
| P-9 | behoben | Kategorie bearbeiten (FR) | Neu: «Si vous choisissez « Imputable », le locataire ne doit toujours pas les frais que la loi met à la charge du bailleur.» Das entspricht dem deutschen «trotzdem nicht», die frühere Unschärfe ist weg. |
| P-11 | Nit | Kategorie bearbeiten (Hauswart, alle Sprachen) | «schon erstellte bleiben, wie sie sind»: Unklar ist, ob das auch für einen Entwurf gilt, der noch nicht versendet ist und vielleicht neu berechnet wird. Ich kann es nicht sicher beurteilen. |
| P-12 | Nit | Kategorie bearbeiten (EN) | «Dwello supplies this category and preset its allocability …»: Hier passen die Zeiten nicht zusammen. Richtig wäre «has preset». |

## Beobachtungen

- Der KI-Satz sagt auf Deutsch jetzt «Ändern Sie den Namen …» statt «deutschen Namen» (früher P-8, erledigt). FR/IT/EN sagen «nom allemand» / «nome tedesco» / «German name», das passt zu den dortigen Feldnamen. «womöglich» bzw. «peut-être» / «potrebbe» / «may» ist weiterhin vage, aber ehrlich.
- Das Englische setzt weiterhin Schweizer Guillemets («From Dwello», «Allocable»), wie früher P-10. Das gehörte nicht zu meinem Auftrag.
- FR, IT und EN geben den deutschen Inhalt in beiden Fassungen des Kastens sinngemäss wieder: «ceux déjà établis restent tels quels», «quelli già allestiti restano invariati», «statements already created stay as they are»; «une à une», «una per una», «one by one». Auf diesen Seiten habe ich kein deutsches Wort gesehen. Ausnahmen sind bewusst: das Beispiel «Treppenhausreinigung» beim deutschen Namen und der Wert des Feldes Name.
- Beim Hauswart verschwindet der Erklärtext zur Kategorie, sobald ich «Nicht umlagefähig» wähle (wie in Runde 1). Bei der Liegenschaftssteuer verschwindet so der Satz zu Art. 256b OR (siehe P-1).
- Der Satz bei der Liegenschaftssteuer gilt in beide Richtungen nur für neue Rechnungen: Schon erfasste Rechnungen bleiben nicht umlagefähig. Beim Hauswart dagegen betrifft der Wechsel auch die erfassten Rechnungen. Diese Asymmetrie ist jetzt in beiden Texten erklärt, und sie ist in sich stimmig.
- Die fehlende Rückfrage beim Speichern (früher P-2) wird in Issue #309 entschieden. Ich habe sie hier nicht beurteilt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 8 Minuten, 1 Skriptlauf: zwei Bearbeitungsseiten je in 4 Sprachen, jeweils vor und nach dem Umklicken der Auswahl (nicht gespeichert), danach zurück auf Deutsch.

## Ablauf

1. **Liegenschaftssteuer bearbeiten (DE).** Erwartet: ein Hinweis, der zur nicht umlagefähigen Steuer passt und sagt, was «Umlagefähig» rechtlich und in Dwello bewirkt. Gesehen: der blaue Infokasten «Kategorie «Von Dwello»» mit drei Absätzen. Erstens: mitgeliefert, nach dem Mietrecht voreingestellt, nicht löschbar. Zweitens: Bei «Umlagefähig» schuldet der Mieter die Kosten trotzdem nicht, die Wahl gilt nur für neue Rechnungen, schon erfasste bleiben nicht umlagefähig. Drittens: der Satz zur KI (`edit-liegenschaftssteuer-de.png`). Die Rechtslage ist klar. Was Dwello tut, steht nur an der Auswahl.
2. **Liegenschaftssteuer auf «Umlagefähig» geklickt (nicht gespeichert).** Erwartet: eine Warnung oder wenigstens, dass der Gesetzeshinweis stehen bleibt. Gesehen: Der Kasten bleibt unverändert, der Satz zu Art. 256b OR verschwindet, an der Auswahl steht «Die Kosten fliessen in die Nebenkostenabrechnung» (`edit-liegenschaftssteuer-de-umgestellt.png`).
3. **Hauswart bearbeiten (DE).** Erwartet: ein eigener Text für den Wechsel zu «nicht umlagefähig». Gesehen: Erfasste Rechnungen fliessen nicht mehr in neue Abrechnungen, schon erstellte bleiben, wie sie sind. Wer zurückstellt, muss die Rechnungen einzeln wieder auf «Umlagefähig» stellen (`edit-hauswart-de.png`). Klar und vollständig, bis auf die Frage nach Entwürfen und den Ort der Rechnungen.
4. **Hauswart auf «Nicht umlagefähig» geklickt (nicht gespeichert).** Der Kasten bleibt gleich, der Erklärtext der Kategorie verschwindet (`edit-hauswart-de-umgestellt.png`).
5. **FR, IT, EN** über das Sprachmenü oben rechts, jeweils dieselben zwei Seiten und dieselben Klicks (`edit-*-fr.png`, `edit-*-it.png`, `edit-*-en.png`, Texte in `text-*.txt`). Die Fassungen sagen inhaltlich dasselbe wie das Deutsche. Aufgefallen ist mir nur der Zeitfehler im Englischen (P-12). Danach habe ich auf Deutsch zurückgestellt («Sprache: Deutsch» bestätigt).

## Verwirrung

- Bei der Liegenschaftssteuer muss ich zwei Stellen zusammenlesen, damit ich verstehe, was Dwello tut (P-1).
- «schon erstellte» Abrechnungen: auch Entwürfe? (P-11)
- «einzeln wieder auf «Umlagefähig» stellen»: wo? (P-5)

## Fehlerrisiken

- Wer nur den Kasten liest und dabei «schuldet der Mieter … trotzdem nicht» als Schutz durch Dwello versteht, stellt die Liegenschaftssteuer vielleicht auf umlagefähig. Dann stellt er sie dem Mieter in Rechnung, obwohl dieser sie nach Art. 256b OR nicht schuldet. Das Risiko ist kleiner als in Runde 1, aber nicht weg.

## Vorschläge

- **P-1:** Liegenschaftssteuer bearbeiten → «Umlagefähig» wählen. Hilfreich wäre ein Halbsatz zu dem, was Dwello tut, etwa: «Wählen Sie «Umlagefähig», nimmt Dwello neue Rechnungen in die Nebenkostenabrechnung auf; der Mieter schuldet Kosten, die das Gesetz dem Vermieter zuweist, aber trotzdem nicht.» Ausserdem den Satz zu Art. 256b OR auch bei gewähltem «Umlagefähig» stehen lassen.
- **P-5:** Im Satz den Ort nennen: «… diese Rechnungen unter «Rechnungen» einzeln wieder auf «Umlagefähig» stellen.»
- **P-11:** Sagen, ob Entwürfe zu den «schon erstellten» Abrechnungen zählen, etwa «schon erstellte, auch Entwürfe, bleiben, wie sie sind», wenn das zutrifft.
- **P-12:** «Dwello supplies this category and has preset its allocability according to tenancy law.»

## Nicht geprüft

- Was Dwello nach dem Speichern tatsächlich mit Rechnungen, Entwürfen und versendeten Abrechnungen macht: Speichern war nicht Teil des Auftrags. Ob die Aussagen in P-3 und P-11 stimmen, habe ich daher nur am Text beurteilt, nicht am Verhalten.
- Die Rückfrage beim Speichern (früher P-2): Sie liegt als Produktentscheid in Issue #309.
- Andere vordefinierte Kategorien als die beiden genannten.
