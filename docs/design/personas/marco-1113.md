# Marco, Runde 1113: Kategorie löschen, Bestätigung und Fokus (Mobile 390 × 844, Touch)

Ich bin Marco, 38, mache das auf dem Handy zwischendurch. Aufgabe: zwei eigene umlagefähige Kategorien «Marco Test A» und «Marco Test B» anlegen, A löschen, während die Zeile am unteren Bildschirmrand steht, und gleich danach auf der Zeile, die nachrückt, «Löschen» oder den Namen (Bearbeiten) antippen. Dann dasselbe mit einer Zeile in der Mitte der Liste, zum Schluss B löschen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Kategorie bearbeiten (nach Löschen und Tipp auf die nächste Zeile) | Die Bestätigung «Kategorie «Marco Test B» gelöscht» wandert auf die Bearbeiten-Seite einer anderen Kategorie (Gartenpflege) mit und liegt dort unten über dem Formular (Feld «Name» halb verdeckt). Auf einer Seite über Gartenpflege steht «Marco Test B gelöscht»: Kurz habe ich gestutzt, was jetzt gelöscht ist. |

Zur Hauptfrage: **Nein, die Bestätigung lag in beiden Fällen über keinem Knopf der nachgerückten Zeile, und der Tipp hat beide Male funktioniert.**

- Zeile am unteren Rand (A): Die Bestätigung erschien **oben** (unter dem Rand, y 16–96), die nachgerückte Zeile «Marco Test B» stand unten (y 676–844). «Löschen» von B angetippt: Es öffnete sich sofort «Kategorie «Marco Test B» löschen?»; ich habe «Abbrechen» gewählt.
- Zeile in der Mitte (B, mit Reihenfolge 7 zwischen Hauswart und Gartenpflege): Die Bestätigung erschien **unten** (y 748–828), die nachgerückte Zeile «Gartenpflege» stand bei y 338–654. Den Namen «Gartenpflege» angetippt: Die Seite «Gartenpflege bearbeiten» öffnete sich. «Löschen» ist bei Gartenpflege ausgegraut (Von Dwello), der Tipp dort war also nicht sinnvoll.
- An der Mitte jedes Knopfs der nachgerückten Zeile lag laut Browser der Knopf selbst zuoberst, nicht die Bestätigung.

## Beobachtungen

- Die Bestätigung weicht der Zeile aus: Oben, wenn die Zeile unten ist, unten, wenn sie weiter oben ist. Hat mich nicht gestört, ich habe es erst beim Vergleichen der Bildschirmfotos gemerkt.
- Liegt die Bestätigung oben, verdeckt sie die Kopfzeile (Menü, «Dwello», Sprache, Benutzermenü) fast ganz. Ob das Menü dann noch antippbar ist, habe ich nicht versucht (siehe Nicht geprüft).
- Öffne ich direkt danach den Löschen-Dialog für B, bleibt die Bestätigung von A hell und ungedimmt über der abgedunkelten Seite stehen, oberhalb des Dialogs. Sie verdeckt nichts vom Dialog, wirkt aber wie ein Teil davon.
- Nach dem Löschen bleibt die Seite an der gleichen Stelle stehen (scrollY unverändert), die nachgerückte Zeile steht genau dort, wo die gelöschte war. Gut so: Ich verliere die Stelle nicht.
- Der Fokus springt auf den Namen der nachgerückten Zeile; bei Touch sieht man davon nichts (kein Rahmen), was für mich in Ordnung ist.
- Beim Antippen von «Löschen» in einer Zeile springt der Hintergrund hinter dem Dialog nach oben an den Seitenanfang (Bildschirmfoto zeigt dort die Einleitung statt der Zeile). Nach «Abbrechen»/Löschen stand die Seite wieder an der alten Stelle.
- Der Text im Dialog «Die Kategorie verschwindet aus der Auswahl beim Erfassen von Rechnungen.» ist klar.
- Neue Kategorien ohne Reihenfolge stehen ganz oben in der Liste, vor Heizung. Das hatte ich nicht erwartet, ist aber praktisch.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 25 Schritte (Menü, Kategorien, zweimal anlegen, B auf Reihenfolge 7 stellen, zwei Löschrunden mit Tipp auf die Nachbarzeile, Löschen von B, Kontrolle «Alle (21)»).

## Ablauf

- Nach dem Löschen von B in der Mitte und Tipp auf «Gartenpflege»: erwartet die Bearbeiten-Seite ohne alte Meldung; gesehen: die Meldung «Kategorie «Marco Test B» gelöscht» stand unten auf «Gartenpflege bearbeiten» über dem Formular (P-1).
- Beim Tipp auf «Löschen» von A: erwartet, dass die Seite hinter dem Dialog stehen bleibt; gesehen: der Hintergrund zeigte den Seitenanfang.
- Nach dem Löschen von A: erwartet die Bestätigung unten (wie oft auf dem Handy); gesehen: oben über der Kopfzeile. Beim zweiten Mal stand sie unten.

## Vorschläge

- P-1: Kategorie anlegen, mit Reihenfolge 7 in die Mitte stellen, löschen, sofort den Namen der nachgerückten Zeile antippen. Die Meldung erscheint auf der Bearbeiten-Seite der anderen Kategorie. Hilfreich: die Meldung beim Wechsel auf eine andere Seite schliessen, oder sie dort wenigstens nicht über das Formular legen.

## Nicht geprüft

- Ob das Menü oder das Benutzermenü antippbar ist, während die Bestätigung oben über der Kopfzeile liegt: Dafür hätte ich eine dritte Kategorie anlegen und löschen müssen, die Aufgabe nannte nur zwei.
- Ob und wann die Bestätigung von selbst verschwindet: Ich habe jeweils innerhalb von etwa 2 Sekunden weitergetippt; auf der Bearbeiten-Seite stand sie nach rund 1 Sekunde noch.
- «Löschen» auf der nachgerückten Zeile in der Mitte: Gartenpflege ist eine Kategorie «Von Dwello», der Knopf ist ausgegraut; getestet habe ich dort stattdessen den Namen (Bearbeiten).
