# Helga – Issue #479: «Neues Gebäude» mit Gebäuderegister

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 (Demodaten).
Aufgabe: Das Gebäude «Seebahnstrasse 155, 8003 Zürich» mit seinen Wohnungen über «Neues Gebäude» erfassen, den Vorschlag prüfen, korrigieren und speichern.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Neues Gebäude, Adresssuche | Die Suche nach «Seebahnstrasse 155 Zürich» meldet dreimal «Das Gebäuderegister ist gerade nicht erreichbar». Ich komme nie zu einem Treffer, also auch nicht zu den Wohnungen. Die Antwort von `GET /api/addresses?q=…` war jedes Mal `502 {"error":"unreachable"}`. Von derselben Maschine aus antwortet `api3.geo.admin.ch` aber mit 200 (per curl über den Proxy). Vermutlich liegt es an der Umgebung des Persona-Stacks und nicht an der App: Bitte prüfen, bevor das als Produktfehler zählt. |
| P-2 | Minor | Neues Gebäude, Kanton | Nachdem die Suche fehlgeschlagen ist, steht beim Kanton immer noch «Wird mit der Adresssuche ausgefüllt.». Ich weiss dann nicht, ob ich den Kanton selbst wählen muss oder darf. |
| P-3 | Minor | Gebäudeliste und Neues Gebäude | Der Knopf auf der Liste heisst «Gebäude erfassen», die Seite dahinter «Neues Gebäude», und der Speicherknopf heisst wieder «Gebäude erfassen». Ich habe zuerst nach «Neues Gebäude» gesucht. Das ist nicht schlimm, aber ich war kurz unsicher. |
| P-4 | Nit | Neues Gebäude | Die Einleitung sagt «Suchen Sie die Adresse», das erste Feld ist aber der «Gebäudename». Ich fülle von oben nach unten aus und weiss nicht, ob ich den Namen vor der Suche eingeben soll und ob die Suche ihn dann überschreibt. |

## Beobachtungen

- Die Schrift ist bei 150 % gross und gut lesbar. Die Hilfetexte stehen über den Feldern, nicht in versteckten Tooltips. Das gefällt mir.
- Die Hilfe zur Suche erklärt die Abkürzung «GWR» als «eidgenössisches Gebäude- und Wohnungsregister», und das Beispiel ist genau meine Adresse. Das hat mich beruhigt.
- Während ich tippe, schickt die Seite nur eine einzige Anfrage an `/api/addresses` (an den eigenen Server, nicht direkt an geo.admin.ch).
- Die Fehlermeldung ist gelb, hat ein Warnsymbol und sagt in klaren Worten, was passiert ist und was ich tun kann («von Hand oder später»). Das finde ich gut.
- Der Text zu «Kein Tank oder Tank stillgelegt» ist für mich sehr lang und schwer («Endbestand am letzten Tag der Abrechnungsperiode»). Dieser Text ist nicht Teil dieser Änderung.

## Aufgabe geschafft: nein

Gescheitert beim Schritt «Adresse suchen und einen Treffer wählen»: drei Versuche, jedes Mal «nicht erreichbar». Ich habe nichts gespeichert. Ein Gebäude von Hand ohne Wohnungen wäre nicht die Aufgabe gewesen, und es hätte nur einen unnötigen Datensatz gegeben.

## Aufwand

Etwa 10 Minuten, 6 Schritte: Übersicht, «3 Gebäude», «Gebäude erfassen», Suche (Versuch 1), Suche mit PLZ (Versuch 2), Anfrage direkt wiederholt (Versuch 3).

## Ablauf

1. **Übersicht**: Ich erwartete einen Weg zu den Gebäuden. Gesehen habe ich «Gebäude auf einen Blick» mit dem Link «3 Gebäude». Das passt.
2. **Gebäudeliste**: Ich erwartete einen Knopf «Neues Gebäude». Gesehen habe ich «Gebäude erfassen» oben rechts neben dem Titel. Gefunden habe ich ihn, aber erst beim zweiten Hinschauen (P-3).
3. **Neues Gebäude**: Ich erwartete ein Formular. Gesehen habe ich eine Einleitung, die die Übernahme aus dem Register erklärt, dann Gebäudename, «Adresse suchen (optional)» mit Lupe, Strasse, PLZ, Ort, Kanton und weitere Angaben. Screenshot 03: alles gut lesbar, die Felder sind gross.
4. **Suche «Seebahnstrasse 155 Zürich» Buchstabe für Buchstabe**: Ich erwartete eine Trefferliste. Gesehen habe ich nach etwa 3 Sekunden die gelbe Meldung «Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.» Screenshot 04.
5. **Zweiter Versuch mit «Seebahnstrasse 155, 8003 Zürich»**: dieselbe Meldung (Screenshot 05). Die Felder Strasse, PLZ, Ort und Kanton bleiben leer, der Kanton zeigt weiter «Wird mit der Adresssuche ausgefüllt.» (P-2).
6. **Dritter Versuch, die Anfrage direkt wiederholt**: wieder `502 unreachable`. Hier habe ich abgebrochen.

## Verwirrung

- «Gebäude erfassen» und «Neues Gebäude» sind zwei Namen für dieselbe Sache (P-3).
- «optional» bei «Adresse suchen»: Die Einleitung sagt mir aber, ich soll zuerst suchen. Ist die Suche nun freiwillig oder der empfohlene Weg?
- Es ist nicht klar, ob der Gebäudename vor oder nach der Suche kommt (P-4).
- «Kanton … wird mit der Adresssuche ausgefüllt», obwohl die Suche nicht ging (P-2).
- Die Begriffe «Gebäuderegister» und «GWR» sind dank des Hilfetexts verständlich.

## Fehlerrisiken

- Wenn das Register nicht erreichbar ist, erfasse ich das Gebäude von Hand und vergesse danach vielleicht, die Wohnungen anzulegen. Der Hinweis dazu steht nur in der Einleitung oben, nicht bei der Fehlermeldung.
- Ich könnte den Kanton leer lassen, weil ich glaube, dass er automatisch kommt.

## Vorschläge

- **P-1**: So stellen Sie es nach: Persona-Stack, `/buildings/new`, «Seebahnstrasse 155 Zürich» ins Suchfeld eingeben, dann erscheint die Meldung, und `/api/addresses` gibt 502 zurück. Bitte prüfen, ob der Server-Prozess im Persona-Stack geo.admin.ch über den Proxy erreicht (curl von derselben Maschine bekommt 200), dann diese Aufgabe nochmals mit Helga durchführen. Falls es an der App liegt, ist es ein Blocker für die ganze Änderung.
- **P-2**: Bei fehlgeschlagener oder fehlender Suche den Hinweis beim Kanton ändern, z. B. «Wählen Sie den Kanton, in dem das Gebäude steht.», oder ihn allgemein formulieren: «Wird mit der Adresssuche ausgefüllt, sonst wählen Sie ihn hier.»
- **P-3**: Den Knopf auf der Liste und den Seitentitel gleich nennen, oder den Knopf «Neues Gebäude erfassen» nennen.
- **P-4**: Die Adresssuche vor den Gebäudenamen setzen, oder beim Namen sagen, ob die Suche ihn ausfüllt.

## Nicht geprüft

Weil die Adresssuche nie einen Treffer lieferte (P-1), konnte ich nicht prüfen:

- die Trefferliste und die Wahl eines Treffers;
- was Dwello für das Gebäude vorschlägt (Name, Typ, Baujahr, Kanton);
- die vorgeschlagenen Wohnungen, ihre Bezeichnungen und Begriffe, die Zimmerzahl und deren Korrektur;
- was passiert, wenn ich eine Wohnung weglasse;
- das Speichern und das Ergebnis auf der Gebäudeseite;
- die Ansicht bei 200 % Zoom.

Ich habe nichts gespeichert und keine Demodaten verändert.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/helga-479/` (01-dashboard, 02-buildings, 03-new, 04-search, 05-search-retry).

## Runde 2

Persona-App neu aufgesetzt, frische Datenbank, echtes Gebäuderegister von geo.admin.ch. Desktop 1440 × 900 bei 150 % Zoom, einmal 200 %, Maus. Gespeichert habe ich ein neues Gebäude «Seebahnstrasse 155». Die Demogebäude habe ich nicht angefasst.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-5 | Minor | Neues Gebäude, Wohnungen aus dem Gebäuderegister | Wenn ich bei einer Wohnung «Wohnung übernehmen» abwähle, werden ihre Felder nur grau. Der Knopf heisst weiter «Gebäude und Wohnungen erstellen». Nirgends steht, wie viele Wohnungen jetzt erstellt werden (bei mir 7 von 8), und es kommt keine Rückfrage. Bei acht Kästchen auf einer langen Seite übersehe ich leicht, dass ich eine Wohnung weggelassen habe. Erst auf der Gebäudeseite steht «7, davon 0 vermietet und 7 leer». |
| P-6 | Minor | Neues Gebäude, Wohnung | Beim Feld «Fläche» steht keine Einheit. Ich nehme an, dass «72» Quadratmeter sind, aber erst auf der Gebäudeseite steht «72 m²». |
| P-7 | Minor | Neues Gebäude, Zimmeranzahl | «Im Register ohne halbe Zimmer: bitte prüfen» habe ich erst beim zweiten Lesen verstanden. Gemeint ist wohl: Das Register kennt keine halben Zimmer, meine 3½ Zimmer stehen dort als 3. Wie ich «dreieinhalb» eingebe (3,5 oder 3.5), steht nicht da. Der Hinweis bleibt auch stehen, wenn ich die Zahl schon korrigiert habe. |
| P-8 | Minor | Neues Gebäude, Hinweis über den Wohnungen | «Wohnungen, die Sie selbst nutzen oder die leer stehen, gehören dazu: ihren Anteil tragen Sie.» Den Anteil woran? Ich vermute, an den Nebenkosten, aber das Wort steht nicht da. |
| P-9 | Minor | Neues Gebäude, schon erfasste Adresse | Als ich die Adresse ein zweites Mal suche, warnt Dwello deutlich: «Diese Adresse ist schon als Gebäude «Seebahnstrasse 155» erfasst.», mit einem Knopf zum Öffnen. Die Wohnungsliste und der Knopf «Gebäude und Wohnungen erstellen» bleiben aber da. Ich könnte das Gebäude also ein zweites Mal anlegen. Ob Dwello das beim Speichern ablehnt, habe ich nicht ausprobiert, um kein doppeltes Gebäude zu erzeugen. |
| P-10 | Nit | Gebäudeseite | Ich habe «3,5» eingetippt, angezeigt wird «3.5 Zimmer». Das ist verständlich, aber nicht das, was ich eingegeben habe. |

Stand der Befunde aus Runde 1: **P-1 ist behoben.** Die Suche findet die Adresse sofort, `GET /api/addresses?q=…` antwortet mit 200. **P-2 ist für den Fall mit Treffer erledigt**: Der Kanton steht danach auf «Zürich (ZH)». Der Hinweis «Wird mit der Adresssuche ausgefüllt.» bleibt aber auch danach stehen. Den Fall ohne Treffer habe ich nicht mehr geprüft. **P-3 ist teilweise erledigt**: Nach dem Treffer heisst der Speicherknopf «Gebäude und Wohnungen erstellen», das ist klar. Der Knopf auf der Liste heisst weiterhin «Gebäude erfassen». **P-4 ist unverändert**, hat sich aber entschärft: Die Suche füllt den Gebäudenamen mit «Seebahnstrasse 155» aus, ich muss vorher nichts eintragen.

### Beobachtungen

- Die Trefferliste zeigt genau eine Zeile: «Seebahnstrasse 155 8003 Zürich (ZH)». Ein Klick genügt.
- Nach dem Klick füllt Dwello Folgendes aus: Gebäudename «Seebahnstrasse 155», Strasse, PLZ 8003, Ort Zürich, Kanton Zürich (ZH), Gebäudetyp Mehrfamilienhaus, Baujahr 1932. Dazu kommen 8 Wohnungen (101, 102 im 1. OG, 201, 202 im 2. OG, 301, 302 im 3. OG, 401, 402 im 4. OG), alle mit 72 Fläche und 3 Zimmern. Jede Wohnung steht in einem eigenen Kasten mit grossen Feldern. Das ist gut lesbar.
- Der blaue Hinweis «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros und andere vermietete Räume nach dem Speichern als eigene Wohnung.» ist klar und kommt im richtigen Moment.
- Gut finde ich auch «Prüfen Sie die Angaben: Gemeinde oder Kanton tragen sie ins Register ein, sie können veraltet sein.» Ich weiss so, dass ich nicht alles glauben muss.
- Die Regel «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt» steht vor der Liste. Ohne diesen Satz hätte ich leere Wohnungen weggelassen.
- Beim Feld Zimmeranzahl werden «3,5» und «3.5» beide angenommen und beide als 3.5 gespeichert.
- Nach dem Speichern komme ich direkt auf die Gebäudeseite. Dort erscheint die grüne Meldung «Gebäude «Seebahnstrasse 155» gespeichert», und die Wohnungen sind nach Stockwerk gruppiert. Die weggelassene Wohnung 402 fehlt dort, wie gewollt.
- Bei 200 % Zoom passt alles in die Breite, ich muss nicht seitwärts scrollen (scrollWidth 720 = Fensterbreite). Die Warnung zur doppelten Adresse ist gelb, hat ein Warnsymbol und ist gross genug.
- Gibt man im Feld «Zimmeranzahl» «drei» ein oder leert man die Fläche, zeigt das Feld beim Verlassen keinen Hinweis. Was beim Speichern passiert, habe ich nicht geprüft (siehe «Nicht geprüft»).
- Das Netzwerk zeigt nur Anfragen an den eigenen Server: `/api/addresses?q=…`, `/api/addresses/147881` und `/api/buildings?search=…`. Der Browser fragt geo.admin.ch nicht direkt an.

### Aufgabe geschafft: ja

### Aufwand

Etwa 8 Minuten, 7 Schritte: Seite öffnen, Adresse tippen, Treffer wählen, Vorschlag lesen, zwei Zimmerzahlen korrigieren, eine Wohnung abwählen, speichern. Danach habe ich noch zwei Prüfschritte ohne Speichern gemacht (doppelte Adresse, ungültige Werte).

### Ablauf

1. **Neues Gebäude öffnen**: Ich erwartete dasselbe Formular wie in Runde 1, und so war es auch.
2. **«Seebahnstrasse 155 Zürich» tippen**: Ich erwartete eine Trefferliste. Gesehen habe ich nach kurzer Zeit die Liste «Gefundene Adressen» mit einem Treffer (Screenshot 03).
3. **Treffer wählen**: Ich erwartete, dass die Adresse ausgefüllt wird. Gesehen habe ich mehr: Adresse, Kanton, Gebäudetyp, Baujahr 1932, Gebäudename und darunter den neuen Abschnitt «Wohnungen aus dem Gebäuderegister» mit 8 Wohnungen (Screenshot 04). Der Speicherknopf heisst jetzt «Gebäude und Wohnungen erstellen».
4. **Vorschlag prüfen**: Alle Wohnungen haben 3 Zimmer und 72 Fläche. Bei jeder steht «Im Register ohne halbe Zimmer: bitte prüfen». Ich nehme an, dass in Zürich viele 3½-Zimmer-Wohnungen sind, also korrigiere ich.
5. **Zimmer korrigieren**: Bei Wohnung 101 tippe ich «3,5», bei 102 «3.5». Ich erwartete eine Fehlermeldung beim Komma, es kam keine. Das Feld behält «3,5».
6. **Wohnung 402 weglassen**: Ich wähle «Wohnung übernehmen» ab. Ich erwartete einen Hinweis, was das bedeutet. Gesehen habe ich nur, dass die vier Felder grau werden (Screenshot 05). Der Knopf heisst unverändert «Gebäude und Wohnungen erstellen» (Screenshot 06, P-5).
7. **Speichern**: Ich erwartete die Gebäudeseite, und genau die kam (Screenshot 07). Die grüne Meldung lautet «Gebäude «Seebahnstrasse 155» gespeichert». Bei «Wohnungen» steht «7, davon 0 vermietet und 7 leer». 101 und 102 zeigen «3.5 Zimmer 72 m²», die übrigen «3 Zimmer 72 m²». 402 fehlt.
8. **Prüfung bei 200 %**: Ich suche dieselbe Adresse nochmals. Ich erwartete eine Warnung, und sie kam: «Diese Adresse ist schon als Gebäude … erfasst.» mit dem Knopf ««Seebahnstrasse 155» öffnen» (Screenshot 09). Die Wohnungen und der Erstellen-Knopf bleiben aber sichtbar (P-9). Hier habe ich nicht gespeichert.
9. **Ungültige Werte**: «drei» bei Zimmeranzahl, Fläche leer. Ich erwartete einen Hinweis beim Feld, es kam keiner. Hier habe ich nicht gespeichert.

### Verwirrung

- «Im Register ohne halbe Zimmer» (P-7).
- «ihren Anteil tragen Sie»: Anteil woran (P-8)?
- «Fläche» ohne Einheit (P-6).
- «Wohnung übernehmen» verstehe ich: übernehmen heisst, in Dwello anlegen.
- «Gebäuderegister» und «GWR» sind dank der Hilfe verständlich, ebenso «OG» und «UG».
- «Stockwerk wählen» ist als Auswahl gut. Es gibt aber nur UG, EG und 1. bis 6. OG. Für ein höheres Haus würde mir ein Stockwerk fehlen. Das hat mich hier nicht betroffen.

### Fehlerrisiken

- Ich wähle beim Durchscrollen eine Wohnung versehentlich ab und merke es erst später (P-5).
- Ich übernehme «3 Zimmer» ungeprüft für alle Wohnungen, weil die Zahl so sicher aussieht. Der Hinweis steht zwar da, aber achtmal derselbe Satz wird mit der Zeit überlesen.
- Ich lege ein Gebäude ein zweites Mal an, obwohl Dwello warnt (P-9, nicht geprüft).
- Alle Flächen sind 72. Ob das stimmt, kann ich am Bildschirm nicht erkennen. Bei Nebenkosten nach Fläche würde ein falscher Wert alles verschieben.

### Vorschläge

- **P-5**: So stellen Sie es nach: Seebahnstrasse 155 Zürich suchen, Treffer wählen, bei Wohnung 402 «Wohnung übernehmen» abwählen. Hilfreich wäre eine Zählung am Knopf oder darüber, z. B. «7 von 8 Wohnungen werden erstellt». In der abgewählten Wohnung könnte stehen: «Wird nicht erstellt.»
- **P-6**: So stellen Sie es nach: Treffer wählen und eine Wohnung ansehen. Hilfreich wäre die Beschriftung «Fläche in m²» oder «m²» im Feld.
- **P-7**: So stellen Sie es nach: Treffer wählen und den Text bei «Zimmeranzahl» lesen. Vorschlag: «Das Register kennt keine halben Zimmer. Hat die Wohnung 3½ Zimmer, geben Sie 3,5 ein.» Den Text einmal über der Liste zu zeigen statt achtmal wäre auch gut.
- **P-8**: So stellen Sie es nach: Treffer wählen und den zweiten Hinweis über den Wohnungen lesen. Vorschlag: «… gehören dazu: ihren Anteil an den Nebenkosten tragen Sie.»
- **P-9**: So stellen Sie es nach: Ein Gebäude «Seebahnstrasse 155» existiert, dieselbe Adresse nochmals suchen und den Treffer wählen. Hilfreich wäre, die Wohnungsliste und den Erstellen-Knopf in diesem Fall auszublenden oder vor dem Speichern noch einmal nachzufragen. Bitte auch prüfen, was das Speichern hier macht.
- **P-10**: So stellen Sie es nach: «3,5» eingeben, speichern und die Gebäudeseite ansehen. Die Zahl so anzeigen, wie man sie in der Schweiz schreibt, oder einheitlich «3½».

### Nicht geprüft

- Speichern mit ungültigen Werten («drei», leere Fläche) und das zweite Speichern einer schon erfassten Adresse: Beides hätte ein zweites Gebäude erzeugen können, wenn Dwello es annimmt. Ich wollte keinen doppelten Datensatz.
- Den Fall ohne Treffer (P-2 aus Runde 1) habe ich nicht erneut geprüft.
- Ob die Registerdaten (72 Fläche, 3 Zimmer, Baujahr 1932) stimmen: Das kann ich als Helga nicht beurteilen.
- Andere Sprachen als Deutsch.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/helga-479-r2/` (01-list, 02-new, 03-search, 04-picked, 05-402-off, 06-before-save, 07-after-save, 08-z200-hits, 09-z200-dup).
