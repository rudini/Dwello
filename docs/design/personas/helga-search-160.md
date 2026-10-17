# Helga – Suche auf «Wohnungen» und «Gebäude» (Runde 160)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (kurz auch 200 %), Maus. Persona-App auf http://localhost:3300 mit Demodaten, nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/a7113b23-14e0-517f-acb3-ca1a5c362bff/scratchpad/helga-search-160/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Wohnungen, Hilfetext an der Suche | Das Beispiel im Hilfetext, «Seepark 3.02», findet nichts: Die Seepark Residenz hat die Wohnungen A1, A2, B1 und B2, die 3.02 gehört zum Musterhaus Zentrum. Wer das Beispiel abtippt, bekommt «Keine Wohnungen gefunden». |
| P-2 | Minor | Gebäude, Suchfeld | Kein Hilfetext am Suchfeld, nur der graue Platzhalter «Name oder Adresse», der beim Tippen verschwindet. Dass auch der Ort und mehrere Wörter («Musterhaus Zürich») gehen, steht nirgends. |
| P-3 | Minor | Gebäude, «Keine Gebäude gefunden» | Die Meldung sagt nur «Kein Gebäude passt zu Ihrer Suche.» Sie wiederholt nicht, was ich gesucht habe, und sagt nicht, worin gesucht wird (anders als auf «Wohnungen»). |
| P-4 | Minor | Gebäude, Feld «Ort» | Der Platzhalter «Zürich» im Ort-Feld sieht aus wie ein schon eingetragener Ort (graue Schrift im leeren Feld). Ich dachte zuerst, es werde nur in Zürich gesucht. |
| P-5 | Minor | Wohnungen und Gebäude | Die Postleitzahl findet nichts: «8001» ergibt auf beiden Seiten «nichts gefunden», obwohl auf der Gebäudekarte «8001 Zürich» steht. |
| P-6 | Nit | Wohnungen, «Keine Wohnungen gefunden» | Der Text sagt «… oder zeigen Sie alle Wohnungen», die Schaltfläche darunter heisst aber «Filter zurücksetzen». Ich musste raten, dass das dieselbe Sache ist. Dasselbe auf «Gebäude» («zeigen Sie alle Gebäude»). |
| P-7 | Nit | Wohnungen | Die Abkürzung «Bahnhofstr. 42» findet nichts, nur «Bahnhofstrasse 42» wird gefunden. |

## Beobachtungen

- Die Suche startet erst mit «Suchen» oder der Eingabetaste, nicht schon beim Tippen. Das war für mich in Ordnung: Die Liste springt nicht herum, während ich tippe.
- Auf «Wohnungen» steht der Hilfetext über dem Feld und bleibt beim Tippen stehen (auch bei 200 % gut lesbar, ohne seitliches Scrollen). Das gefällt mir.
- Nach einer Suche bleibt der Begriff im Feld stehen, die Adresse enthält ihn (`?search=…`). Gut.
- Bei Treffern sagt die Überschrift nur «6 Wohnungen». Weil die Wohnungskarte keine Strasse zeigt, sehe ich bei «Bahnhofstrasse 42» nicht, warum genau diese sechs kamen. Ich musste wissen, dass das Musterhaus an der Bahnhofstrasse liegt.
- Gross- und Kleinschreibung spielt keine Rolle («seepark a1» findet A1). Gut.
- Auf der Übersicht führt die Zahl «4 Leer» auf `/apartments` ohne Filter, also auf alle 13 Wohnungen, nicht auf die leeren (nicht Teil dieser Aufgabe).
- «Filter zurücksetzen» steht auf beiden Seiten schon da, bevor ich überhaupt gesucht habe.

## Aufgabe geschafft: ja

Ich konnte jede gesuchte Wohnung finden, sobald ich die richtige Schreibweise hatte. Das Beispiel im Hilfetext hat mich aber zuerst in die Irre geführt.

## Aufwand

Etwa 15 Minuten, rund 25 Suchen (11 auf «Wohnungen», 10 auf «Gebäude», dazu Zurücksetzen und 200 % Zoom).

## Ablauf

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Übersicht, Klick auf «13 Wohnungen» | Liste aller Wohnungen | «Wohnungen» mit 13 Wohnungen, Seite 1 von 2. Über dem Suchfeld: «Suchen Sie nach Wohnungsnummer, Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel «Seepark 3.02».» |
| «Bahnhofstrasse 42» tippen, warten | Vielleicht filtert es gleich | Nichts passiert, immer noch 13 Wohnungen |
| «Suchen» klicken | Die Wohnungen vom Musterhaus | «6 Wohnungen», 1.01 bis 3.02, alle «Musterhaus Zentrum». Richtig. «Bahnhofstrasse» allein: dasselbe |
| «Bahnhofstr. 42» | Dasselbe wie oben | «Keine Wohnungen gefunden» (P-7) |
| «Musterhaus 1.01» | Genau eine Wohnung | «1 Wohnung», Wohnung 1.01. Auch «Musterhaus Zentrum 1.01» geht |
| «Seepark A1» / «seepark a1» | Genau eine Wohnung | «1 Wohnung», Wohnung A1 |
| «Seepark 3.02» (das Beispiel aus dem Hilfetext) | Eine Wohnung, es ist ja das Beispiel | «Keine Wohnungen gefunden. Keine Wohnung passt zu «Seepark 3.02». Gesucht wird in Wohnungsnummer, Gebäudename, Strasse und Ort. Prüfen Sie die Schreibweise, wählen Sie andere Filter oder zeigen Sie alle Wohnungen.» Ich habe an mir gezweifelt (P-1) |
| «Wohnung 1.01» (so steht es auf der Karte) | Die Wohnung 1.01 | «1 Wohnung», Wohnung 1.01. Gut, dass das Wort «Wohnung» nicht stört |
| «Zürich», «Luzern», «Interlaken» | Die Wohnungen am jeweiligen Ort | 6, 4 und 3 Wohnungen, jeweils richtig |
| «8001» | Die Wohnungen in Zürich | «Keine Wohnungen gefunden» (P-5) |
| «Zuerich» | Vielleicht gefunden | Nicht gefunden; die Meldung rät zur Schreibweise, das passt |
| «Gartenweg 5» (gibt es nicht) | Eine klare Meldung | Dieselbe Meldung mit «Gartenweg 5» in Anführungszeichen und der Schaltfläche «Filter zurücksetzen». Die Meldung sagt, was ich gesucht habe und worin gesucht wurde. Gut, nur «zeigen Sie alle Wohnungen» vs. «Filter zurücksetzen» passt nicht ganz zusammen (P-6) |
| «Filter zurücksetzen» klicken | Wieder alle Wohnungen | Adresse wieder `/apartments`, alle Wohnungen |
| «Gebäude» öffnen | Auch hier ein Hinweis, was ich suchen kann | Nur die Felder «Suche (optional)» mit grauem «Name oder Adresse» und «Ort (optional)» mit grauem «Zürich». Kein Hilfetext (P-2, P-4) |
| «Musterhaus Zürich» im Suchfeld | Das Musterhaus | «1 Gebäude», Musterhaus Zentrum. Beim Tippen war kein Hinweis mehr zu sehen, ich habe es einfach probiert |
| «Musterhaus» und Ort «Zürich» | Das Musterhaus | «1 Gebäude», Musterhaus Zentrum |
| «Seepark Luzern», «Seepark Residenz Luzern», «Bahnhofstrasse 42», «Zürich» | Je ein Gebäude | Je ein Gebäude, richtig |
| «Musterhaus» mit Ort «Luzern» | Nichts | «Keine Gebäude gefunden. Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude.» Was ich gesucht habe, steht nicht da (P-3) |
| «Gartenweg», «8001» | Gartenweg nichts, 8001 das Musterhaus | Beide «Keine Gebäude gefunden» (P-5) |

## Verwirrung

- «Seepark 3.02» im Hilfetext: Ich habe gedacht, ich hätte mich vertippt oder eine Wohnung gelöscht.
- Das graue «Zürich» im Ort-Feld: Für mich sah das aus wie ein schon gesetzter Ort.
- «Filter zurücksetzen»: «Filter» ist für mich kein Alltagswort. Der Text darüber sagt «zeigen Sie alle Wohnungen», das hätte ich als Knopfbeschriftung verstanden.
- «(optional)» bei der Suche: Bei einem Suchfeld ist mir klar, dass ich nichts eingeben muss, das Wort verwirrt eher.

## Fehlerrisiken

- Wer dem Beispiel aus dem Hilfetext folgt und nichts findet, kann glauben, die Wohnung fehle, und legt sie ein zweites Mal an (Doppelerfassung).
- Wer nach der Postleitzahl oder abgekürzt («Bahnhofstr.») sucht, bekommt «nichts gefunden» und schliesst daraus, das Gebäude sei noch nicht erfasst.
- Wer das graue «Zürich» für einen gesetzten Ort hält, wundert sich, warum Gebäude in Luzern erscheinen, oder sucht gar nicht erst.

## Vorschläge

- **P-1:** «Wohnungen» öffnen, das Beispiel «Seepark 3.02» abtippen, «Suchen». Ergebnis: «Keine Wohnungen gefunden». Hilft: ein Beispiel, das in den Demodaten und sprachlich stimmt, etwa «Seepark A1» oder «Musterhaus 3.02».
- **P-2:** «Gebäude» öffnen, ins Suchfeld klicken und tippen: der Platzhalter verschwindet, es bleibt kein Hinweis. Hilft: ein sichtbarer Hilfetext über dem Feld wie auf «Wohnungen», z. B. «Suchen Sie nach Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel «Musterhaus Zürich».»
- **P-3:** «Gebäude», «Gartenweg» suchen. Meldung ohne Suchbegriff. Hilft: dieselbe Art Meldung wie auf «Wohnungen»: «Kein Gebäude passt zu «Gartenweg». Gesucht wird in Name, Strasse und Ort …», und beim Ort-Feld den Ort mitnennen.
- **P-4:** «Gebäude» öffnen und das Ort-Feld ansehen: grau «Zürich». Hilft: kein Ortsname als Platzhalter, sondern ein Hilfetext wie «zum Beispiel Zürich» über dem Feld, oder gar kein Platzhalter.
- **P-5:** Auf «Wohnungen» oder «Gebäude» «8001» suchen: nichts gefunden. Hilft: die Postleitzahl mit durchsuchen, oder im Hilfetext sagen, dass sie nicht durchsucht wird.
- **P-6:** «Gartenweg 5» auf «Wohnungen» suchen. Text «zeigen Sie alle Wohnungen», Knopf «Filter zurücksetzen». Hilft: Knopf «Alle Wohnungen zeigen» (bzw. «Alle Gebäude zeigen») oder den Text an den Knopf angleichen.
- **P-7:** «Bahnhofstr. 42» suchen: nichts gefunden. Hilft: «str.» wie «strasse» behandeln; sonst wenigstens in der Meldung auf ausgeschriebene Strassennamen hinweisen.

## Nicht geprüft

- Andere Sprachen (fr/it/en): die Sprache hängt am Konto, das teilen sich gleichzeitig laufende Personas.
- Mobile Ansicht und Tastaturbedienung: nicht Helgas Gerät.
- Kombination der Suche mit den Auswahlfeldern «Gebäude» und «Mietstatus» habe ich nur indirekt angeschaut (ein Durchgang mit Ort auf «Gebäude»); auf «Wohnungen» keine Kombination ausprobiert.
- Suche mit sehr vielen Treffern über mehrere Seiten: die Demodaten haben nur 13 Wohnungen.

## Runde 2

Nur P-1 erneut geprüft. Persona-App auf http://localhost:3300 (neu gebaut, Demodaten), Desktop 1440 × 900 bei 150 % Zoom, Maus, nichts gespeichert. Skript `r2.mjs` und Screenshots `r2-*.png` in `/tmp/claude-0/-home-user-Dwello/a7113b23-14e0-517f-acb3-ca1a5c362bff/scratchpad/helga-search-160/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | geschlossen | Wohnungen, Hilfetext an der Suche | Der Hilfetext nennt kein Beispiel mehr, das nichts findet. Er lautet jetzt: «Suchen Sie nach Wohnungsnummer, Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel Gebäudename und Wohnungsnummer.» Ich habe genau so gesucht (Gebäudename und Wohnungsnummer von den Karten abgeschrieben), und jede dieser Suchen hat genau die eine Wohnung gefunden. |

Kein neuer Befund.

### Ablauf

| Schritt | Erwartet | Gesehen |
|---|---|---|
| «Wohnungen» öffnen, Hilfetext lesen | Ein Hinweis, wie ich suchen soll | Hilfetext über dem Suchfeld, bei 150 % gut lesbar, ohne Beispiel aus erfundenen Wörtern: «… zum Beispiel Gebäudename und Wohnungsnummer.» Auf den Karten stehen beide Angaben («Wohnung 3.02», darunter «Musterhaus Zentrum»), ich muss sie nur abschreiben (Screenshot `r2-00-start-1.5.png`). |
| «Seepark A1», «Suchen» | Wohnung A1 | «1 Wohnung», Wohnung A1, Seepark Residenz |
| «Musterhaus 3.02» | Wohnung 3.02 | «1 Wohnung», Wohnung 3.02, Musterhaus Zentrum (Screenshot `r2-02-1.5.png`: Suchbegriff bleibt im Feld, darunter eine einzige Karte) |
| «Seepark Residenz B2» (voller Gebäudename) | Wohnung B2 | «1 Wohnung», Wohnung B2 |
| «Musterhaus Zentrum 2.01» | Wohnung 2.01 | «1 Wohnung», Wohnung 2.01 |
| «Alpenblick 1» (nur ein Teil der Nummer OG1) | Vielleicht OG1 | «1 Wohnung», Wohnung OG1. Auch ein Teil der Nummer genügt. |
| «Luzern A2» (Ort und Wohnungsnummer) | Wohnung A2 | «1 Wohnung», Wohnung A2, Seepark Residenz |
| Gegenprobe «Seepark 3.02» (das alte Beispiel) | Nichts, weil die 3.02 nicht im Seepark liegt | «Keine Wohnungen gefunden. Keine Wohnung passt zu «Seepark 3.02». …» Richtig so, und der Hilfetext schickt mich nicht mehr dorthin. |

### Beobachtungen

- Ohne ein konkretes Beispiel muss ich selbst merken, dass «Gebäudename» das Wort unter dem Wohnungstitel auf der Karte ist (mit dem Häuschen-Symbol davor). Für mich ging das, weil Karten und Hilfetext auf derselben Seite stehen. Ein Beispiel mit echtem Namen wäre noch etwas greifbarer, hat aber eben die Gefahr von P-1. Keine Schwere, nur ein Eindruck.
- Wenn ich das Wort «Wohnung» mit abtippe, stört es nicht (schon in Runde 1 gesehen).

### Aufgabe geschafft: ja

### Aufwand

Etwa 3 Minuten, 7 Suchen.

### Nicht geprüft

- 200 % Zoom habe ich in dieser Runde nicht wiederholt (in Runde 1 gelesen, der Hilfetext ist jetzt etwa gleich lang).
- Die übrigen Befunde P-2 bis P-7 nicht erneut geprüft, nicht Teil dieser Runde.
