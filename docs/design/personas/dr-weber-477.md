# Dr. Weber – Issue #477: Akonto in Hilfe und Mietvertrag

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300, frische Demodaten. Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/dr-weber-477/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hilfe › Begriffe kurz erklärt › Akonto | Der Begriff «Akonto» sagt nichts dazu, ab wann ein neues Akonto gilt. Das steht nur in der Feldhilfe des Mietvertrags («Gültig ab»). Die beiden Texte widersprechen sich nicht, aber wer nur das Glossar liest, kann Frage (c) nicht beantworten. |
| P-2 | Minor | Glossar «Akonto» und Feldhilfe «Akonto pro Monat» (gleicher Satz, auch fr) | «Fehlende Zahlungen regeln Sie ausserhalb von Dwello» sagt mir nur, *wo* ich etwas tue, aber nicht *was*. Es fehlt: Das nicht bezahlte Akonto bleibt geschuldet, die Abrechnung schreibt es dem Mieter trotzdem gut, und ich fordere es separat ein (Zahlungserinnerung, Betreibung, allenfalls Art. 257d OR). Wie das geht, steht im Abschnitt «Zahlungen und Mahnungen», aber die Akonto-Texte verweisen nicht darauf. |
| P-3 | Minor | Mietvertrag bearbeiten › «Gültig ab» | Die Feldhilfe schickt mich zu «Akonto nach Zeitraum» («tragen Sie seinen Tag aus «Akonto nach Zeitraum» ein»). Diese Liste finde ich bei keinem der 11 Demo-Mietverträge, weder auf der Seite des Mietvertrags noch im Formular. Ich vermute, dass sie erst ab einem zweiten Betrag erscheint. Für den häufigsten Fall (der erste Betrag war falsch) hilft der Nachsatz «der erste Betrag gilt ab dem Vertragsbeginn». Den Verweis verstehe ich trotzdem nicht. |
| P-4 | Nit | Mietvertrag bearbeiten › «Akonto pro Monat» | Die Feldhilfe ist ein einziger Absatz mit neun Sätzen und drei Themen: was das Akonto ist, vereinbart oder bezahlt, und Erhöhung/Senkung. Die Regel zur Mietzinserhöhung steht fast gleich auch im gelben Hinweis oben. Ich lese alles, aber für meine Fragen musste ich den Absatz zweimal lesen. |

## Beobachtungen

- «Gültig ab» ist im Formular schon mit 01.11.2026 («Sonntag, 1. November 2026») ausgefüllt, obwohl ich das Akonto nicht geändert habe. Ob beim Speichern einer anderen Änderung ein neuer Akonto-Zeitraum ab 01.11.2026 mit gleichem Betrag entsteht, sagt die Hilfe nicht. Geprüft habe ich das nicht, weil ich nicht speichern durfte.
- Der gelbe Hinweis «Laufender Mietvertrag» sagt dasselbe wie die Feldhilfe: «Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen.» Das passt.
- Die Abrechnung zeigt die Zeile neutral als «Akontobeiträge», nicht als «bezahlte Akontozahlungen». Das passt zur Aussage «vereinbart, nicht bezahlt».
- «Gültig ab: der Erste eines Monats» und bei einer Erhöhung «den Tag nach dem Kündigungstermin» passen zusammen, solange der Kündigungstermin auf ein Monatsende fällt. Was bei einem Kündigungstermin mitten im Monat gilt, steht nicht da. Bei Wohnungen kommt das kaum vor.
- Französisch: Das Glossar («Les termes en bref» › «Acompte») und die Feldhilfe («Acompte par mois», «Valable dès le») sagen inhaltlich dasselbe wie die deutschen Texte («déduit l’acompte convenu, pas l’acompte payé», «Réglez les paiements manquants en dehors de Dwello»). Ich habe keinen deutschen Rest gefunden. P-1 und P-2 gelten im Französischen genauso. Stilistisch beginnen zwei Sätze nacheinander mit «Le décompte des charges …».
- Den Sprachwechsel auf Français habe ich gleich danach auf Deutsch zurückgestellt.

## Aufgabe geschafft: ja

- (a) Ja, das ist eindeutig. Die Abrechnung zieht das vereinbarte Akonto ab, nicht das bezahlte. Glossar und Feldhilfe sagen das mit genau demselben Satz.
- (b) Teilweise. Ich weiss, dass Dwello fehlende Zahlungen nicht berücksichtigt und ich sie selbst einfordern muss. Wie ich das tue, muss ich mir aus dem Abschnitt «Zahlungen und Mahnungen» zusammensuchen (P-2).
- (c) Ja, aber nur aus der Feldhilfe. Ein neues Akonto gilt ab dem Datum bei «Gültig ab», immer ab dem Ersten eines Monats, und das bisherige gilt für die Zeit davor. Eine Erhöhung gilt erst ab dem Tag nach dem Kündigungstermin und nur mit dem amtlichen Formular. Das Glossar sagt dazu nichts (P-1).
- Glossar und Feldhilfe widersprechen sich nicht. Die Feldhilfe sagt mehr.

## Aufwand

Etwa 10 Minuten und 9 Schritte: Übersicht › Hilfe › «Begriffe kurz erklärt» › Mietverträge › «Bearbeiten» bei Nina Brunner › Feldhilfen lesen › Suche nach «Akonto nach Zeitraum» in allen 11 Mietverträgen › Sprache Français › Glossar und Formular auf Französisch › zurück auf Deutsch.

## Ablauf

1. **Hilfe öffnen.** Erwartet: «Hilfe» im Menü. Gesehen: Der Link ist links unten unter «Einstellungen und Hilfe». Die Seite /help hat ein Inhaltsverzeichnis mit sechs Einträgen, der letzte ist «Begriffe kurz erklärt».
2. **«Begriffe kurz erklärt».** Erwartet: Sprung zum Glossar. Gesehen: Die Seite springt zu /help#glossary. Akonto ist der zweite Begriff: «Der monatliche Vorschuss des Mieters für die Nebenkosten. Die Nebenkostenabrechnung verrechnet ihn mit den tatsächlichen Kosten. Die Nebenkostenabrechnung zieht das vereinbarte Akonto ab, nicht das bezahlte. Fehlende Zahlungen regeln Sie ausserhalb von Dwello.» Damit ist (a) klar, (b) nur halb beantwortet und zu (c) steht nichts da.
3. **Mietverträge › «Bearbeiten» (Nina Brunner, Wohnung A2, Seepark Residenz).** Erwartet: ein Formular mit Akonto und Datum. Gesehen: oben ein gelber Hinweis «Laufender Mietvertrag», darunter der Bereich «Miete» mit Akonto CHF 240.00 und «Gültig ab» 01.11.2026, vorausgefüllt.
4. **Feldhilfe «Akonto pro Monat» lesen.** Erwartet: dieselbe Aussage wie im Glossar. Gesehen: Die Sätze zu «vereinbart, nicht bezahlt» und zu fehlenden Zahlungen sind wörtlich gleich. Dazu kommen «gilt ab dem Tag bei «Gültig ab»; das bisherige bleibt für die Zeit davor», die Regeln zur Erhöhung (amtliches Formular, Kündigungstermin, nichtig ohne Formular) und «Für eine Senkung genügt eine schriftliche Mitteilung». Das ist inhaltlich korrekt, aber lang (P-4).
5. **Feldhilfe «Gültig ab» lesen.** Erwartet: ab wann der Betrag gilt. Gesehen: «Tag, ab dem das neue Akonto gilt: der Erste eines Monats. Um einen falsch eingetragenen Betrag zu korrigieren, tragen Sie seinen Tag aus «Akonto nach Zeitraum» ein; der erste Betrag gilt ab dem Vertragsbeginn.» Damit ist (c) beantwortet.
6. **«Akonto nach Zeitraum» suchen.** Erwartet: eine Liste der bisherigen Beträge auf der Seite des Mietvertrags. Gesehen: Auf der Seite stehen nur «Akonto CHF 240.00». Bei allen 11 Mietverträgen kommt «nach Zeitraum» auf der Seite gar nicht vor und im Formular nur in der Feldhilfe selbst (P-3).
7. **Sprache auf Français, Hilfe › «Les termes en bref» › «Acompte».** Erwartet: dieselbe Aussage. Gesehen: inhaltlich gleich, kein Deutsch.
8. **Formular auf Französisch.** Gesehen: «Acompte par mois» und «Valable dès le» sagen dasselbe wie die deutschen Texte. Der Verweis heisst dort «Acompte par période».
9. **Sprache zurück auf Deutsch.** Gesehen: Die Hilfe ist wieder deutsch.

## Verwirrung

- «Akonto nach Zeitraum»: Ich weiss nicht, wo das ist (P-3).
- «ausserhalb von Dwello»: Gemeint ist vermutlich eine eigene Zahlungserinnerung oder eine Betreibung. Gesagt wird das nicht (P-2).
- Das vorausgefüllte «Gültig ab» bei unverändertem Akonto: Muss ich das Feld leeren, wenn ich nur die Nettomiete korrigiere? (siehe Beobachtungen)

## Fehlerrisiken

- Ein Vermieter liest nur das Glossar und trägt ein erhöhtes Akonto ohne passendes «Gültig ab» oder ohne amtliches Formular ein. Die Feldhilfe warnt ihn zwar, das Glossar aber nicht (P-1).
- Ein Mieter hat das Akonto nicht bezahlt. Der Vermieter verlässt sich auf die Abrechnung und vergisst, den Rückstand separat einzufordern, weil ihm niemand sagt, dass die Abrechnung den Rückstand nicht zeigt (P-2).
- Ein falscher erster Betrag wird mit dem vorausgefüllten 01.11.2026 «korrigiert». Damit entsteht ein neuer Zeitraum, statt dass der alte Betrag ersetzt wird. Wer «Akonto nach Zeitraum» nicht findet, merkt das nicht (P-3).

## Vorschläge

- **P-1:** Hilfe › «Begriffe kurz erklärt» › «Akonto» lesen. Es fehlt jeder Satz dazu, ab wann ein neues Akonto gilt. Hilfreich wäre ein Satz wie «Ein neues Akonto gilt ab dem Tag, den Sie beim Mietvertrag bei «Gültig ab» eintragen; eine Erhöhung nur mit dem amtlichen Formular auf den nächsten Kündigungstermin.» (auch fr, it, en)
- **P-2:** Glossar «Akonto» oder Mietvertrag bearbeiten › Feldhilfe «Akonto pro Monat» lesen. Es steht nur «Fehlende Zahlungen regeln Sie ausserhalb von Dwello». Hilfreich wäre: «Hat der Mieter Akonto nicht bezahlt, schuldet er es weiterhin. Die Abrechnung zieht es trotzdem ab: Fordern Sie es separat ein, zum Beispiel mit einer eigenen Zahlungserinnerung oder einer Betreibung.» Dazu ein Verweis auf «Zahlungen und Mahnungen».
- **P-3:** Mietverträge › «Bearbeiten» bei einem beliebigen Demo-Mietvertrag › Feldhilfe «Gültig ab». Die Hilfe nennt «Akonto nach Zeitraum». Auf der Seite des Mietvertrags gibt es das nicht. Hilfreich wäre, die Liste immer anzuzeigen, auch mit nur einem Betrag («CHF 240.00 ab 01.07.2025»), oder in der Hilfe zu sagen, wo sie steht.
- **P-4:** Mietvertrag bearbeiten › Feldhilfe «Akonto pro Monat». Hilfreich wäre, sie in zwei Absätze zu teilen («Was abgezogen wird» und «Akonto ändern») und die Regel zur Erhöhung nur einmal zu nennen.

## Nicht geprüft

- Speichern eines neuen Akontos und wie dann «Akonto nach Zeitraum» aussieht: Ich durfte nichts speichern.
- Was beim Speichern mit vorausgefülltem «Gültig ab» und unverändertem Akonto passiert: aus demselben Grund.
- Italienisch und Englisch: Der Auftrag nannte nur Französisch.
- PDF der Abrechnung: nicht Teil des Auftrags. Ich habe nur die Bezeichnung «Akontobeiträge» auf der Seite der Abrechnung gesehen.
