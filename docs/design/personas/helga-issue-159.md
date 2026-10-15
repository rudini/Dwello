# Persona-Lauf: Helga, Issue 159 (Suchformular passt zur Liste)

Persona: Helga, 68. Desktop 1440 × 900 bei 150 % Zoom, Maus. Nur angeschaut, nichts gespeichert.
Aufgabe: Auf «Wohnungen», «Gebäude» und «Rechnungen» eine Suche ohne Treffer, zurück zu allen, filtern, mit dem Zurück- und Vorwärts-Knopf des Browsers blättern; prüfen, ob die Such- und Filterfelder immer zeigen, was die Liste zeigt.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/helga-issue-159/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnungen, Gebäude | Wenn ich ein Feld ändere, nicht auf «Suchen» klicke, die Seite ganz verlasse (andere Adresse im selben Tab) und mit «Zurück» wiederkomme, zeigt das Formular meine nicht abgeschickte Eingabe, die Liste aber den alten Filter (z. B. Ort «Interlaken», Liste «1 Gebäude: Seepark Residenz, Luzern»). Auf «Rechnungen» passiert das nicht. Innerhalb von Dwello (Zurück von einer Wohnung, Zurück/Vorwärts zwischen Filtern, Neu laden) stimmt es immer. |

Sonst habe ich in allen drei Listen keinen Fall gefunden, in dem Formular und Liste nicht zusammenpassen.

## Beobachtungen

- Wenn ich auf «Wohnungen» ein Gebäude in der Auswahl wähle, ändert sich die Liste nicht, bis ich auf «Suchen» klicke. Einen Moment lang steht oben «Seepark Residenz» und unten «13 Wohnungen» mit Wohnungen aus Alpenblick (Bild `apt-04a-seepark-selected-before-click.png`). Ich habe zuerst gedacht, es funktioniert nicht. Das gilt für alle drei Listen und ist wohl so gewollt, aber für mich verwirrend.
- Bei keinen Treffern auf «Wohnungen» und «Gebäude» gibt es zweimal «Filter zurücksetzen»: einmal klein im Formular und einmal als grosser Knopf unter «Keine … gefunden». Beide machen dasselbe. Das ist nicht schlimm, beim zweiten Mal habe ich aber überlegt, ob es einen Unterschied gibt.
- Auf «Rechnungen» gibt es bei keinen Treffern keinen grossen Knopf, nur den Satz «Versuchen Sie es mit anderen Filtern.» und das kleine «Filter zurücksetzen» weiter oben (Bild `i-02-nomatch.png`). Auf den anderen beiden Listen steht dort «… oder zeigen Sie alle …» mit einem Knopf. Das ist nicht einheitlich.
- Auf «Rechnungen» steht das Suchformular nicht in einem weissen Kasten wie auf «Wohnungen» und «Gebäude». Im Vorlesebaum ist es auch nicht als Suchbereich bezeichnet wie bei den anderen beiden Listen.
- Die Adresse zeigt nach jeder Suche «&page=1», auch wenn ich nicht geblättert habe. Mich stört das nicht.
- Die Seite «Wohnungen» hat zwei Seiten (12 von 13 Wohnungen auf Seite 1). Filtere ich auf Seite 2, lande ich richtig auf Seite 1 der gefilterten Liste.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten. Pro Liste etwa 12 bis 16 Schritte (Suche ohne Treffer, zurücksetzen, zwei oder drei Filter, vier- bis fünfmal Zurück, vier- bis fünfmal Vorwärts), dazu Gegenproben (Neu laden, Zurück von einer Wohnung, Zurück nach Verlassen der Seite).

## Ablauf

### Wohnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. «Wohnungen» öffnen | alle Wohnungen, Felder leer | «13 Wohnungen», Suche leer, Gebäude «Alle Gebäude», Mietstatus «Alle». Passt. |
| 2. «Gibt es nicht» eintippen, «Suchen» | Meldung, dass nichts gefunden wurde | «Keine Wohnungen gefunden», «Keine Wohnung passt zu Ihrer Suche. Wählen Sie andere Filter oder zeigen Sie alle Wohnungen.», grosser Knopf «Filter zurücksetzen». Im Suchfeld steht noch «Gibt es nicht». Passt. |
| 3. Grosser Knopf «Filter zurücksetzen» | wieder alle Wohnungen, Suchfeld leer | «13 Wohnungen», Suchfeld leer. Passt. (Gegenprobe mit dem kleinen «Filter zurücksetzen» im Formular und mit Enter statt Klick: gleich.) |
| 4. Gebäude «Seepark Residenz», «Suchen» | nur Seepark | «4 Wohnungen», alle Seepark Residenz, Auswahl zeigt «Seepark Residenz». Passt. |
| 5. Gebäude «Alpenblick», «Suchen» | nur Alpenblick | «3 Wohnungen», Auswahl «Alpenblick». Passt. |
| 6. Zurück | Seepark | «4 Wohnungen» Seepark, Auswahl «Seepark Residenz». Passt (Bild `apt-06-back1.png`). |
| 7. Zurück | alle | «13 Wohnungen», «Alle Gebäude». Passt. |
| 8. Zurück | keine Treffer, «Gibt es nicht» im Feld | genau so. Passt. |
| 9. Zurück | alle, Feld leer | genau so. Passt. |
| 10.–13. Viermal Vorwärts | dieselben Zustände in umgekehrter Reihenfolge | jedes Mal passten Feld, Auswahl und Liste zusammen. |
| 14. Auf «Alpenblick»-Liste «Musterhaus Zentrum» wählen, nicht suchen, dann Zurück und Vorwärts | Formular zeigt beim Wiederkommen «Alpenblick» | zeigt «Alpenblick», passt. |
| 15. Kombination Suche «A1» + Seepark + Mietstatus «Leer», dann Neu laden | alle drei Felder bleiben gefüllt | bleiben gefüllt, Liste «Keine Wohnungen gefunden». Passt. |
| 16. Nicht abgeschickte Änderung, dann Wohnung öffnen und Zurück | Formular wie Liste | passt. |
| 17. Nicht abgeschickte Änderung (Seepark statt Alpenblick), Seite ganz verlassen, Zurück | Formular wie Liste | Formular «Seepark Residenz», Liste «3 Wohnungen» Alpenblick. Passt nicht (P-1). |

### Gebäude

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. Öffnen | 3 Gebäude, Felder leer | so. |
| 2. Suche «Gibt es nicht» | keine Treffer | «Keine Gebäude gefunden», «Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude.», Knopf «Filter zurücksetzen» (Bild `b-02-nomatch.png`). |
| 3. «Filter zurücksetzen» | alle, Feld leer | so. |
| 4. Ort «Luzern», Suchen | Seepark Residenz | «1 Gebäude» Seepark Residenz, Ort «Luzern». |
| 5. Ort «Interlaken», Suchen | Alpenblick | «1 Gebäude» Alpenblick, Ort «Interlaken». |
| 6.–9. Viermal Zurück | Luzern, alle, keine Treffer, alle | jedes Mal Felder und Liste gleich. |
| 10.–13. Viermal Vorwärts | umgekehrt | jedes Mal gleich. |
| 14. Ort «Interlaken» eintippen ohne Suchen, Seite ganz verlassen, Zurück | Ort «Luzern» | Ort «Interlaken», Liste Seepark Residenz Luzern (Bild `xdoc-bui.png`). P-1. |

### Rechnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. Öffnen | 83 Rechnungen, alle Felder auf «Alle» | so. |
| 2. Suche «Gibt es nicht» | keine Treffer | «Keine Rechnungen gefunden», «Versuchen Sie es mit anderen Filtern.»; nur das kleine «Filter zurücksetzen» im Formular. |
| 3. «Filter zurücksetzen» | alle | «83 Rechnungen», Suchfeld leer. |
| 4. Gebäude «Seepark Residenz» | nur Seepark | «30 Rechnungen», alle Seepark. |
| 5. Gebäude «Alpenblick» | nur Alpenblick | «14 Rechnungen». |
| 6. Zusätzlich Jahr «2024» | nur 2024 | «8 Rechnungen», Jahr «2024». |
| 7.–11. Fünfmal Zurück | Alpenblick ohne Jahr, Seepark, alle, keine Treffer, alle | jedes Mal passten Suchfeld, Gebäude, Kategorie, Umlagefähigkeit und Jahr zur Liste; das Jahr ging beim Zurück richtig auf «Alle Jahre». |
| 12.–16. Fünfmal Vorwärts | umgekehrt | jedes Mal gleich, am Ende wieder «Alpenblick» + «2024», 8 Rechnungen. |
| 17. Gebäude ändern ohne Suchen, Seite ganz verlassen, Zurück | Formular wie Liste | passt («Seepark Residenz», 30 Rechnungen). |

## Verwirrung

- Dass die Auswahl allein die Liste nicht ändert (siehe Beobachtungen). Ich musste erst merken, dass ich auf «Suchen» klicken muss.
- Zwei Knöpfe mit gleichem Namen «Filter zurücksetzen» bei keinen Treffern.
- «Umlagefähigkeit» auf «Rechnungen» kenne ich nicht; die Liste erklärt es oben in einem Satz, das Feld selbst nicht. Für diese Aufgabe habe ich es nicht gebraucht.

## Fehlerrisiken

- P-1: Ich könnte glauben, die Liste zeige Gebäude in Interlaken, sehe aber die aus Luzern, und dann eine Rechnung oder Wohnung beim falschen Gebäude suchen. Das passiert nur, wenn ich vorher etwas geändert und nicht gesucht habe und die Seite ganz verlassen habe, also selten.

## Vorschläge

- **P-1**: Reproduktion Gebäude: `/buildings?city=Luzern&page=1` öffnen, im Feld «Ort» «Interlaken» eintippen, nicht auf «Suchen» klicken, im selben Tab eine Adresse ausserhalb der Liste aufrufen (ich habe `/privacy` direkt in die Adresszeile eingegeben), dann den Zurück-Knopf des Browsers drücken. Das Feld zeigt «Interlaken», die Liste «1 Gebäude: Seepark Residenz». Wohnungen genauso: `/apartments?building=<Alpenblick>&page=1`, Gebäude «Seepark Residenz» wählen, Seite verlassen, Zurück: Auswahl «Seepark Residenz», Liste Alpenblick. Auf «Rechnungen» tritt es nicht auf. Hilfreich wäre, wenn die Felder beim Wiederkommen immer die Filter der angezeigten Liste zeigen, wie es auf «Rechnungen» schon der Fall ist.

## Nicht geprüft

- 200 % Zoom: nur bei 150 % durchgespielt, da die Aufgabe den Inhalt der Felder betrifft, nicht das Layout.
- Andere Filter als die genannten nicht alle einzeln (auf «Rechnungen» Kategorie und Umlagefähigkeit nur beim Zurücksetzen und Blättern mitgeprüft, nicht selbst gesetzt).
- Ob P-1 auch bei einem echten Verlassen über einen Link in Dwello auftritt: die Links in Dwello (Wohnung öffnen) bleiben in der App und zeigen den Fehler nicht; ich habe die Seite nur über die Adresszeile verlassen.
- Telefon und Tastatur: nicht Helgas Gerät.
