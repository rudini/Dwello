# Anna, 29: Einfamilienhaus aus dem Gebäuderegister erfassen (#479)

Persona: Anna, 29, vermietet zum ersten Mal, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, Maus; Suchfeld mit Warnung zusätzlich auf dem Handy 390 × 844.
Aufgabe: Ab der Übersicht herausfinden, wie ich mein Einfamilienhaus «Rautistrasse 150, 8047 Zürich» erfasse, es mit dem übernehmen, was das Register weiss, und speichern. Dazu eine Suche ohne Treffer (Tippfehler) ausprobieren.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/anna-479/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Neues Gebäude, «Adresse suchen» | Jede Suche endet mit «Das Gebäuderegister ist gerade nicht erreichbar.» Die App antwortet auf `GET /api/addresses?q=…` mit 502 `{"error":"unreachable"}`, auch beim Beispiel aus dem Hilfetext («Seebahnstrasse 155 Zürich»). Dieselbe Maschine erreicht geo.admin.ch über den Proxy (curl: 200). Der Kern der Änderung, das Gebäude samt Wohnungen aus dem Register übernehmen, liess sich darum nicht ausprobieren. Die Ursache liegt wahrscheinlich im Persona-Stack (der App-Server geht nicht über den Proxy) und nicht in der App. Das muss der Aufrufer prüfen. |
| P-2 | Minor | Neues Gebäude | Der Pflichtname «Gebäudename» steht über der Suche. Die Seite sagt «Suchen Sie die Adresse», also habe ich direkt dort angefangen und den Namen vergessen. Den Fehler «Gebäudename ist erforderlich.» sehe ich erst nach dem Klick auf «Gebäude erfassen» (immerhin landet der Fokus dann im Feld). |
| P-3 | Minor | Neues Gebäude, Kanton | Der Hilfetext zum Kanton lautet nur «Wird mit der Adresssuche ausgefüllt.» Nach der gescheiterten Suche musste ich ihn selbst wählen, und der Text sagt mir nicht, dass ich das darf oder muss. |
| P-4 | Nit | Neues Gebäude | Die Einleitung sagt «Suchen Sie die Adresse», das Feld heisst aber «Adresse suchen (optional)». Das ist nicht falsch, aber ich war kurz unsicher, ob die Suche nun der Weg ist oder nur eine Möglichkeit. |

## Beobachtungen

- Auf der Übersicht steht bei «Häufige Arbeiten» kein «Gebäude erfassen» (nur Mieter, Mietvertrag, Rechnung, Rechnungen hochladen, Abrechnungen). Den Weg fand ich über «Gebäude» in der Navigation oder über den Link «3 Gebäude». Für eine Erstvermieterin mit ihrem ersten Haus wäre das der erste Schritt.
- In der Gebäudeliste steht der Button «Gebäude erfassen» gut sichtbar oben, die Seite dahinter heisst «Neues Gebäude». Das hat gepasst.
- Die Warnung bei nicht erreichbarem Register ist gut: gelber Kasten mit Symbol, direkt unter dem Suchfeld, mit Handlungsanweisung («Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.»). Auf dem Handy bricht sie sauber um, es gibt kein seitliches Scrollen (scrollWidth 390).
- Enter im Suchfeld schickt das Formular nicht ab. Das ist gut, ich hätte sonst ein halbes Gebäude gespeichert.
- Nach dem Speichern komme ich auf die Gebäudeseite mit der Meldung «Gebäude «Einfamilienhaus Rautistrasse» gespeichert», Adresse «Rautistrasse 150, 8047 Zürich (ZH)», Typ Einfamilienhaus, «Noch keine Wohnungen» und einem klaren «Wohnung erfassen». Den nächsten Schritt wusste ich sofort.
- Der lange Block «Tankbestand» erscheint auf der Gebäudeseite direkt unter den Wohnungen, auch bei meinem Haus, bei dem ich noch gar nicht weiss, wie es heizt. Das wirkt für den Anfang viel.

## Aufgabe geschafft: teilweise

Das Haus ist erfasst und gespeichert (`/buildings/e1110dac-6a28-48a0-9295-2ec2590875dd`), aber von Hand und ohne Wohnung. «Mit dem übernehmen, was das Register weiss» ging nicht: Nach drei Versuchen an der Registersuche kam jedes Mal «nicht erreichbar» (P-1). Den Fall «Suche ohne Treffer» konnte ich deshalb auch nicht sehen.

## Aufwand

Etwa 6 bis 8 Minuten. Rund 12 Schritte: Übersicht, Navigation «Gebäude», «Gebäude erfassen», drei Registersuchen, eine Suche mit Tippfehler, Adresse, PLZ, Ort, Kanton und Typ von Hand, Speichern ohne Namen (Fehler), Name nachtragen, Speichern.

## Ablauf

1. **Übersicht.** Erwartet: ein Knopf «Gebäude erfassen» oder ein Hinweis für ein neues Haus. Gesehen: «Als Nächstes zu tun» dreht sich um Abrechnungen, bei «Häufige Arbeiten» fehlt das Gebäude. Ich nahm «Gebäude» in der linken Navigation.
2. **Gebäude.** Erwartet: Liste und ein Knopf zum Hinzufügen. Gesehen: drei Demo-Gebäude und oben «Gebäude erfassen». Klar.
3. **Neues Gebäude.** Erwartet: ein Formular. Gesehen: Die Einleitung erklärt, dass Dwello Gebäude und Wohnungen aus dem Gebäuderegister übernimmt, und ohne Treffer von Hand. Das hat mir gefallen, so wusste ich, was mich erwartet. Ganz oben steht der Gebäudename, darunter «Adresse suchen (optional)» mit dem Beispiel «Seebahnstrasse 155 Zürich» (Screenshot `03-neu.png`).
4. **Suche «Rautistrasse 150 Zürich».** Erwartet: eine Trefferliste unter dem Feld. Gesehen: die Warnung «Das Gebäuderegister ist gerade nicht erreichbar. …». Netzwerk: `GET /api/addresses?q=Rautistrasse+150+Z%C3%BCrich` gibt 502 zurück.
5. **Nochmals mit «Rautistrasse 150», dem Beispiel «Seebahnstrasse 155 Zürich» und «Rautistrasse 150 8047 Zürich».** Erwartet: wenigstens beim Beispiel ein Treffer. Gesehen: immer 502 und dieselbe Warnung. Damit war die dritte Wiederholung an diesem Schritt erreicht.
6. **Tippfehler «Rautisrasse 150 Zürich».** Erwartet: «Keine Adresse gefunden» mit einem Hinweis, was ich tun soll. Gesehen: wieder «nicht erreichbar» (Screenshot `05-tippfehler.png`; Handy: `08-mobil.png`). Was ich bei der Warnung tun soll, wusste ich: von Hand weiter. Wie der echte Fall ohne Treffer aussieht, weiss ich nicht.
7. **Von Hand.** Strasse und Hausnummer, PLZ 8047, Ort Zürich, Kanton Zürich (ZH), Gebäudetyp Einfamilienhaus, dann «Gebäude erfassen». Erwartet: gespeichert. Gesehen: Ich blieb auf der Seite, der Gebäudename war rot markiert mit «Gebäudename ist erforderlich.», und der Fokus stand im Feld (`06-ohne-name.png`). Die übrigen Eingaben waren noch da.
8. **Name «Einfamilienhaus Rautistrasse» nachgetragen und gespeichert.** Erwartet: Bestätigung und ein nächster Schritt. Gesehen: die Gebäudeseite mit der Meldung «gespeichert», den richtigen Angaben, 0 Wohnungen und «Wohnung erfassen» (`07-nach-speichern.png`).

## Verwirrung

- «GWR» bzw. «eidgenössisches Gebäude- und Wohnungsregister»: Durch den Satz daneben verstehe ich es ungefähr («da steht mein Haus drin»). Woher die Daten stammen und ob sie stimmen, weiss ich nicht.
- «optional» bei der Suche gegenüber «Suchen Sie die Adresse» in der Einleitung (P-4).
- Kanton «Wird mit der Adresssuche ausgefüllt»: Darf ich ihn selbst wählen? (P-3)
- «Kein Tank oder Tank stillgelegt» auf der Seite «Neues Gebäude»: Bei einem frisch gekauften Haus weiss ich das noch nicht. Der Text ist lang, aber verständlich.

## Fehlerrisiken

- Ohne Register lege ich ein Einfamilienhaus ohne Wohnung an. Die Seite danach sagt zwar «Wohnung erfassen», aber bei einem Einfamilienhaus denke ich nicht unbedingt an eine «Wohnung». Ich hätte vermutlich direkt einen Mieter erfasst und wäre dann beim Mietvertrag hängen geblieben.
- Den Pflichtnamen vergisst man leicht, wenn man mit der Suche beginnt (P-2). Es geht nichts verloren, aber es kostet einen Umweg.
- Wenn das Register nur manchmal nicht erreichbar ist, erfasse ich von Hand und verpasse die Übernahme der Wohnungen, ohne es zu merken.

## Vorschläge

- **P-1:** Reproduktion: `/buildings/new`, «Rautistrasse 150 Zürich» oder «Seebahnstrasse 155 Zürich» in «Adresse suchen» tippen, dann erscheint die Warnung, und im Netzwerk gibt `/api/addresses` 502 `{"error":"unreachable"}` zurück. Zur Gegenprobe gibt `curl` auf `api3.geo.admin.ch/rest/services/api/SearchServer` von derselben Maschine 200 zurück. Hilfreich: prüfen, ob der Persona-Server den HTTPS-Proxy nutzt (Umgebung), und den Lauf mit erreichbarem Register wiederholen. Erst dann lassen sich Übernahme, Wohnungen und der Fall ohne Treffer beurteilen.
- **P-2:** Reproduktion: Adresse von Hand ausfüllen, Gebäudename leer lassen, «Gebäude erfassen» klicken. Hilfreich: Name unter die Adresse setzen oder bei einem Registertreffer einen Vorschlag einfüllen (z. B. die Strasse), damit die Suche wirklich der erste Schritt ist.
- **P-3:** Reproduktion: Suche scheitert, und der Kanton steht auf «Kanton wählen» mit dem Text «Wird mit der Adresssuche ausgefüllt.» Hilfreich: «Wird mit der Adresssuche ausgefüllt. Ohne Treffer wählen Sie ihn selbst.»
- **P-4:** Hilfreich: «optional» weglassen oder die Einleitung angleichen, etwa «Suchen Sie zuerst die Adresse».

## Nicht geprüft

- Trefferliste, Auswahl eines Treffers und die Übernahme von Gebäude und Wohnungen aus dem Register: Das Register war für die App nicht erreichbar (P-1).
- Die echte Meldung «keine Treffer» bei einem Tippfehler: Auch dort kam nur «nicht erreichbar».
- Wie ein übernommenes Einfamilienhaus mit seiner einen Wohnung danach aussieht und ob der Gebäudename dabei vorgeschlagen wird.
- Den ganzen Ablauf auf dem Handy: Dort habe ich nur das Suchfeld mit der Warnung angesehen.

## Runde 2

Frische Datenbank, die App erreicht das echte Gebäuderegister (geo.admin.ch). Wie in Runde 1: Desktop 1440 × 900 mit Maus, die Suche ohne Treffer zusätzlich auf dem Handy 390 × 844.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/anna-479/r2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | erledigt | Neues Gebäude, «Adresse suchen» | Das Register antwortet jetzt (`GET /api/addresses` 200). Ich sehe Treffer, die Übernahme klappt, und auch «keine Treffer» erscheint. |
| P-2 | erledigt (mit Register) / Minor (von Hand) | Neues Gebäude | Wähle ich einen Treffer, setzt Dwello den Gebäudenamen auf «Rautistrasse 150». So vergesse ich ihn nicht mehr. Ohne Treffer steht das Pflichtfeld weiterhin leer über der Suche, wie in Runde 1. |
| P-3 | Minor (offen) | Neues Gebäude, Kanton | Auch nach «Keine Adresse gefunden» steht beim Kanton nur «Wird mit der Adresssuche ausgefüllt.» Dass ich ihn dann selbst wähle, sagt der Text nicht. |
| P-4 | Nit (offen) | Neues Gebäude | «Suchen Sie die Adresse» in der Einleitung, aber «Adresse suchen (optional)» am Feld. Unverändert. |
| P-5 | Minor | Neues Gebäude, Hinweis «schon erfasst» | Suche ich dieselbe Adresse noch einmal, warnt mich ein gelber Kasten: «Diese Adresse ist schon als Gebäude «Rautistrasse 150» erfasst.» Dazu kommt ein Link zum Öffnen. Gut! Darunter steht aber unverändert der blaue Hauptknopf «Gebäude und Wohnungen erstellen», und das ganze Formular samt Wohnung ist wieder ausgefüllt. Ein Klick aus Gewohnheit, und ich hätte das Haus doppelt (Speichern habe ich nicht ausprobiert). |
| P-6 | Nit | Neues Gebäude, nach der Übernahme | Der blaue Hinweis «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros und andere vermietete Räume …» erscheint auch bei meinem Einfamilienhaus. Er stört nicht, betrifft mich aber nicht. Er sieht genau gleich aus wie die Meldung «Keine Adresse gefunden», deshalb habe ich kurz gedacht, etwas sei schiefgelaufen. |
| P-7 | Nit | Neues Gebäude, «Wohnungen aus dem Gebäuderegister» | Das Feld «Fläche» zeigt «123» ohne Einheit. Erst auf der Gebäudeseite steht «123 m²». |
| P-8 | Nit | Gebäudeseite nach dem Speichern | Die Meldung lautet nur «Gebäude «Rautistrasse 150» gespeichert». Dass die Wohnung auch angelegt wurde, sehe ich erst in der Liste darunter. |

### Beobachtungen (Runde 2)

- Auf der Übersicht fehlt «Gebäude erfassen» bei «Häufige Arbeiten» weiterhin. Ich ging über «3 Gebäude» bzw. «Gebäude» in der Navigation und dann «Gebäude erfassen».
- Die Trefferliste erscheint direkt beim Tippen unter dem Feld: «Rautistrasse 150 8048 Zürich (ZH)» und «Rautistrasse 150a 8048 Zürich (ZH)». Ich hatte «8047» im Kopf. Das Register sagt 8048, und Dwello übernimmt 8048. Ob meine Erinnerung oder das Register stimmt, prüfe ich im Kaufvertrag nach. Einen Hinweis, dass die PLZ von meiner Eingabe abweicht, gibt es nicht, aber ich habe die PLZ ja auch nirgends eingegeben, nur gesucht.
- Nach der Auswahl war alles ausgefüllt: Name, Strasse, PLZ 8048, Ort, Kanton Zürich (ZH), Gebäudetyp Einfamilienhaus, Baujahr 1839 und darunter der neue Block «Wohnungen aus dem Gebäuderegister» mit Wohnung 1 (Häkchen «Wohnung übernehmen», Nummer 1, EG, Fläche 123, 5 Zimmer). Der Knopf heisst dann «Gebäude und Wohnungen erstellen». So wusste ich, dass beides gespeichert wird.
- Die beiden Sätze über den Wohnungen helfen: «Prüfen Sie die Angaben: Gemeinde oder Kanton tragen sie ins Register ein, sie können veraltet sein.» und «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt. Wohnungen, die Sie selbst nutzen oder die leer stehen, gehören dazu: ihren Anteil tragen Sie.» Damit verstehe ich auch, warum mein Haus eine «Wohnung» braucht. Das war in Runde 1 mein Fehlerrisiko.
- «Im Register ohne halbe Zimmer: bitte prüfen» bei der Zimmeranzahl: kurz und verständlich.
- Gebäudeseite nach dem Speichern: Adresse «Rautistrasse 150, 8048 Zürich (ZH)», Einfamilienhaus, Baujahr 1839, «Wohnungen: 1, davon 0 vermietet und 1 leer», Liste mit «EG» und dem Eintrag «Wohnung 1, 5 Zimmer, 123 m², Leer». Als nächsten Schritt sehe ich einen Mieter bzw. Mietvertrag. Der Block «Tankbestand» ist weiterhin lang (wie in Runde 1).
- Suche ohne Treffer «Rautisrasse 999 Zürich»: Ein blauer Kasten unter dem Feld sagt «Keine Adresse gefunden. Prüfen Sie Strasse, Hausnummer und Ort oder erfassen Sie das Gebäude von Hand.» Ich weiss, was zu tun ist: zuerst den Tippfehler suchen, sonst unten von Hand ausfüllen. Auf dem Handy bricht der Text sauber um, ohne seitliches Scrollen (scrollWidth 390).
- Die Suche läuft beim Tippen. Ich musste weder Enter drücken noch einen Knopf suchen.

### Aufgabe geschafft (Runde 2): ja

Das Haus ist mit allem gespeichert, was das Register weiss: Gebäude und eine Wohnung (`/buildings/8cb04271-d57a-4ebe-b557-d6ac5db0f889`, «Rautistrasse 150»). Die Suche ohne Treffer habe ich gesehen und verstanden.

### Aufwand (Runde 2)

Etwa 3 Minuten für die eigentliche Aufgabe, 6 Schritte: Übersicht, «Gebäude», «Gebäude erfassen», Adresse tippen, Treffer wählen, angezeigte Angaben prüfen und «Gebäude und Wohnungen erstellen». Danach noch die Suche ohne Treffer (Desktop und Handy) und die Suche nach der bereits erfassten Adresse.

### Ablauf (Runde 2)

1. **Übersicht.** Erwartet: «Gebäude erfassen». Gesehen: wie in Runde 1 nicht bei «Häufige Arbeiten». Weg über «Gebäude» in der Navigation (`01-uebersicht.png`).
2. **Neues Gebäude.** Erwartet: dasselbe Formular wie in Runde 1. Gesehen: dasselbe Formular, Knopf «Gebäude erfassen» (`02-neu.png`).
3. **«Rautistrasse 150 Zürich» tippen.** Erwartet: Treffer. Gesehen: Liste «Gefundene Adressen» mit 150 und 150a, beide 8048 Zürich (ZH) (`03-treffer.png`).
4. **Treffer «Rautistrasse 150» wählen.** Erwartet: Adresse ausgefüllt, vielleicht die Wohnung. Gesehen: alles ausgefüllt, inklusive Name, Typ, Baujahr und Wohnung 1. Der Knopf heisst jetzt «Gebäude und Wohnungen erstellen» (`04-uebernommen.png`).
5. **Speichern.** Erwartet: Bestätigung, Haus mit Wohnung. Gesehen: Gebäudeseite, Meldung «Gebäude «Rautistrasse 150» gespeichert», 1 Wohnung leer (`05-gespeichert.png`).
6. **Suche «Rautisrasse 999 Zürich».** Erwartet: «nichts gefunden» mit Rat. Gesehen: «Keine Adresse gefunden. Prüfen Sie … oder erfassen Sie das Gebäude von Hand.» (`06-keintreffer-desktop.png`, `06-keintreffer-mobile.png`).
7. **Gleiche Adresse noch einmal suchen und wählen.** Erwartet: eine Warnung. Gesehen: gelber Kasten «schon erfasst» mit Link. Der Hauptknopf zum Erstellen bleibt aber aktiv (`07-doppelt.png`, P-5).

### Verwirrung (Runde 2)

- PLZ 8048 statt meiner 8047: Ich vertraue dem Register mehr als mir. Das Register warnt aber selbst, dass es veraltet sein kann.
- Der blaue Hinweis zu Läden und Büros bei einem Einfamilienhaus (P-6).
- «Fläche» ohne m² (P-7).
- «GWR» verstehe ich dank des Satzes daneben jetzt besser, weil ich sehe, was übernommen wird.

### Fehlerrisiken (Runde 2)

- Doppelt erfasstes Gebäude trotz Warnung (P-5).
- Ein Baujahr wie 1839 oder ein Stockwerk übernehme ich ungeprüft, weil alles schon ausgefüllt ist. Der Satz «Prüfen Sie die Angaben» steht nur bei den Wohnungen, nicht bei Gebäudetyp und Baujahr.
- Ohne Treffer bleibt der Weg von Runde 1 mit P-2 und P-3.

### Vorschläge (Runde 2)

- **P-2 (von Hand):** Reproduktion: Suche ohne Treffer, dann unten von Hand ausfüllen und speichern, ohne Namen. Hilfreich: wie beim Treffer den Namen aus «Strasse und Hausnummer» vorschlagen, wenn das Feld leer ist.
- **P-3:** Reproduktion: «Rautisrasse 999 Zürich» suchen, dann den Kanton ansehen. Hilfreich: «Wird mit der Adresssuche ausgefüllt. Ohne Treffer wählen Sie ihn selbst.»
- **P-4:** wie in Runde 1.
- **P-5:** Reproduktion: Gebäude «Rautistrasse 150» aus dem Register speichern, dann auf `/buildings/new` erneut «Rautistrasse 150 Zürich» suchen und den Treffer wählen. Hilfreich: Bei dieser Warnung ist «… öffnen» die Hauptaktion und das Erstellen nur zweitrangig (oder mit Rückfrage «Trotzdem ein zweites Gebäude erstellen?»).
- **P-6:** Reproduktion: Treffer eines Einfamilienhauses wählen. Hilfreich: Den Hinweis nur bei Mehrfamilien-, Geschäfts- oder Mischbauten zeigen oder ihn als normalen Hilfetext statt als Kasten setzen.
- **P-7:** Hilfreich: Feld «Fläche (m²)» oder ein Hilfetext «in m²».
- **P-8:** Hilfreich: «Gebäude «Rautistrasse 150» mit 1 Wohnung gespeichert».

### Nicht geprüft (Runde 2)

- Ein doppeltes Gebäude tatsächlich speichern (P-5): Ich wollte keinen zweiten Datensatz anlegen. Ob Dwello das ablehnt, weiss ich darum nicht.
- Eine Wohnung abwählen («Wohnung übernehmen» ausschalten) oder Werte vor dem Speichern ändern: Bei meinem Haus mit einer Wohnung hatte ich keinen Anlass dazu.
- Ein Mehrfamilienhaus mit vielen Wohnungen aus dem Register.
- Den ganzen Ablauf mit Treffer auf dem Handy: Dort habe ich nur die Suche ohne Treffer angesehen.
- Ein nicht erreichbares Register in dieser Runde (das war Runde 1).
