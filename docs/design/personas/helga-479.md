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
