# Marco – Gebäudesuche nach Adresse und Postleitzahl (#1193)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: http://localhost:3300 (Persona-Stack, Demodaten). Nichts gespeichert, nur gesucht.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäude, Feld «Ort» | Das Feld «Ort» hat keinen Hilfetext. Dass dort auch die Postleitzahl («3800», «6003 Luzern») geht, sehe ich nirgends, das habe ich nur gemerkt, weil die Aufgabe es verlangt hat. Füge ich dort die ganze Adresse vom Brief ein («Seeweg 15, 6003 Luzern»), kommt «Keine Gebäude gefunden», obwohl das Gebäude existiert. Das Feld sagt mir nicht, was hineingehört. |

## Beobachtungen

- Die Suche läuft erst nach «Suchen» (oder Enter auf der Tastatur), nicht beim Tippen. Solange ich nicht tippe, steht im Feld schon der neue Begriff, aber die Liste zeigt noch das alte Ergebnis: mit «8001» im Feld stand darunter «1 Gebäude – Seepark Residenz, Seeweg 15, 6003 Luzern» (Screenshot 12a). Auf dem Handy, wo ich schnell schaue, könnte ich das falsche Gebäude antippen. Hat mich hier nicht aufgehalten, weil die Adresse in der Karte steht.
- Die Hilfe bei «Suche» («Suchen Sie nach Name oder Adresse des Gebäudes.») passt zu dem, was die Suche tut: Strasse, Postleitzahl, Ort, Gross-/Kleinschreibung und eine Adresse aus zwei Zeilen (beim Einfügen wird daraus «Seeweg 15 6003 Luzern») finden alle die Seepark Residenz. Dass die Postleitzahl allein reicht, sagt der Text nicht ausdrücklich, ich habe es aber erwartet, weil sie zur Adresse gehört.
- «Seeweg 15, CH-6003 Luzern» (so steht es auf manchen Briefen) findet nichts. Das kommt selten vor, ich nenne es nur.
- Leerer Zustand (Screenshot 15b): «Keine Gebäude gefunden – Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude.» mit der Schaltfläche «Filter zurücksetzen». Ich weiss, was zu tun ist. Ein Tipp auf die Schaltfläche leert die Felder und zeigt wieder alle 3 Gebäude. Das Wort «Filter» passt nicht ganz, ich habe ja nur gesucht, verstanden habe ich es trotzdem.
- Nach einer Suche erscheint im Suchkasten ein zweites «Filter zurücksetzen» (mit ×) unter «Suchen»; damit gibt es im leeren Zustand zwei gleich benannte Links.
- Der Weg zur Gebäudeliste über das Menü (☰ → «Gebäude») geht gut. Im Barrierefreiheitsbaum taucht die offene Menüleiste aber nicht auf (nur «Menü öffnen [expanded]»), und ein zweiter, unsichtbarer «Gebäude»-Link (Desktop-Navigation) liegt im Dokument. Gehört eher zu Sven.
- Die Statusbereiche unter «Suchen» bleiben nach der Suche leer (`status: ""`). Ein Screenreader sagt dort also vermutlich nicht, wie viele Gebäude gefunden wurden. Auch das ist eher etwas für Sven.
- Auf dem 390-px-Bildschirm scrollt nichts seitwärts. Die Felder und «Suchen» sind gut zu treffen.

## Aufgabe geschafft: ja

Jeder Schritt hat das erwartete Gebäude gezeigt:

| Schritt | Eingabe | Feld | Ergebnis | Erwartet? | Hilfe passt? |
|---|---|---|---|---|---|
| 1 | «Seeweg 15, 6003 Luzern» | Suche | 1 Gebäude: Seepark Residenz | ja | ja |
| 2a | «6003» | Suche | 1 Gebäude: Seepark Residenz | ja | ja (PLZ als Teil der Adresse) |
| 2b | «8001» | Suche | 1 Gebäude: Musterhaus Zentrum | ja | ja |
| 3a | «6003 Luzern» | Ort | 1 Gebäude: Seepark Residenz | ja | keine Hilfe am Feld (P-1) |
| 3b | «3800» | Ort | 1 Gebäude: Alpenblick | ja | keine Hilfe am Feld (P-1) |
| 4 | «9999» | Suche und Ort | «Keine Gebäude gefunden» mit Hinweis und «Filter zurücksetzen» | ja | Seite sagt, was zu tun ist |

## Aufwand

Etwa 3 Minuten, etwa 20 Tipps. Pro Suche: Feld antippen, einfügen oder tippen, «Suchen».

## Ablauf

- Schritt 2b, nach dem Eintippen von «8001», aber vor «Suchen»: Ich habe erwartet, dass sich die Liste mit der Eingabe ändert. Stattdessen stand weiter «Seepark Residenz (6003 Luzern)» darunter. Erst nach «Suchen» kam das Musterhaus Zentrum (siehe Beobachtungen).
- Zusatzversuch: die ganze Briefadresse in «Ort» eingefügt. Erwartet hatte ich die Seepark Residenz, bekommen habe ich «Keine Gebäude gefunden» (P-1).
- Zusatzversuch: «Seeweg 15, CH-6003 Luzern» in «Suche». Erwartet hatte ich die Seepark Residenz, bekommen habe ich «Keine Gebäude gefunden».

## Vorschläge

- **P-1:** Gebäude öffnen, Suche leer lassen, in «Ort» «Seeweg 15, 6003 Luzern» eingeben, «Suchen» antippen: «Keine Gebäude gefunden». Mit «3800» im gleichen Feld kommt Alpenblick, aber nichts am Feld sagt, dass die Postleitzahl geht. Hilfe: ein sichtbarer Hilfetext über dem Feld «Ort», z. B. «Postleitzahl oder Ort, z. B. 6003 oder Luzern.», wie bei «Suche». Eine ganze Adresse gehört dann in «Suche».

## Nicht geprüft

- Echtes Einfügen aus der Zwischenablage des Handys: Ich habe den Text eingefügt, wie ihn der Browser beim Einfügen einsetzt (`insertText`), auch mit Zeilenumbruch. Ein echtes Kopieren aus einer Mail- oder Scan-App konnte ich nicht nachstellen.
- Andere Sprachen und Darstellung im dunklen Modus: nicht Teil der Aufgabe.
- Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/bb4a61ae-ab42-58c4-bb4e-cf8c502fc248/scratchpad/marco-1193/`.
