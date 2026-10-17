# Anna – Runde a6-2: abgelaufener befristeter Mietvertrag, Nachprüfung von P-1 und P-2

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück. Desktop 1440 × 900, Maus; den Dialog auch auf dem Handy 390 × 844.
App: Persona-Stack http://localhost:3300, frische Daten. Gespeichert habe ich nur am Mietvertrag von Lea Huber (Wohnung 2.02, Musterhaus Zentrum), und zwar nur «Unbefristet weiterführen».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/anna-a6-2/`

Geprüft habe ich nur, was sich seit a6 geändert hat: den neuen Satz zu den Folgen auf der Vertragsseite (P-2) und den Bestätigungsdialog bei «Mieter ist ausgezogen» (P-1).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. P-1 ist behoben: «Mieter ist ausgezogen» speichert nicht mehr sofort, sondern öffnet einen Dialog mit der echten Folge. Abbrechen speichert nichts. P-2 ist behoben: Auf der Vertragsseite steht jetzt bei beiden Antworten, was sie für mich bedeuten. |

## Beobachtungen

- Der neue Absatz auf der Vertragsseite: «Läuft der Mietvertrag weiter, rechnet Dwello die Nebenkosten nach dem 31.12.2025 mit Lea Huber ab. Ist Lea Huber ausgezogen, gilt die Wohnung seither als leer, und die Nebenkosten dieser Zeit tragen Sie.» Damit verstehe ich beide Antworten, bevor ich klicke. Er steht über den Knöpfen und nicht unter jedem Knopf einzeln, wie ich es in a6 vorgeschlagen hatte. Für mich reicht das, weil die beiden Sätze in derselben Reihenfolge stehen wie die Knöpfe.
- Die beiden Knöpfe sehen weiterhin gleich aus (beide umrandet). Weil jetzt der Dialog dazwischen kommt, stört mich das nicht mehr.
- Der Dialog «Auszug von Lea Huber bestätigen»: «Der Mietvertrag endete am 31.12.2025. Seither gilt die Wohnung als leer, und die Nebenkosten dieser Zeit tragen Sie. Dwello fragt danach nicht mehr, ob der Mietvertrag weiterläuft.» Knöpfe «Abbrechen» und «Auszug bestätigen». Das ist klar und nennt genau das, was mir in a6 passiert ist. Der letzte Satz warnt mich zu Recht, dass ich die Frage danach nicht mehr bekomme.
- Beim Öffnen des Dialogs liegt der Fokus auf «Abbrechen». Wer aus Versehen Enter drückt, speichert also nichts. Gut.
- Abbrechen und Escape schliessen den Dialog. Nach dem Neuladen waren die Frage und beide Knöpfe noch da: Es wurde nichts gespeichert.
- Der Dialog nennt nicht die Wohnung (2.02) und nicht, dass das Akonto nur bis Ende 2025 zählt. Auf der Seite steht die Wohnung direkt unter dem Titel, darum habe ich das nicht vermisst.
- Handy 390 × 844: Der Dialog sitzt unten im Bildschirm (16 px Rand links und rechts), der Text ist gut lesbar. Die Knöpfe gehen über die ganze Breite und sind 48 px hoch: oben «Auszug bestätigen» (dunkel gefüllt), darunter «Abbrechen» (umrandet). Kein seitliches Scrollen (Seitenbreite 390 px). Hinter dem abgedunkelten Hintergrund sieht man noch die beiden Knöpfe der Frage. Auf dem Handy steht der gefüllte Knopf oben, auf dem Desktop rechts. Das ist üblich und hat mich nicht verwirrt.
- «Unbefristet weiterführen» speichert ohne Dialog. Danach stand im Statusbereich «Der Mietvertrag von Lea Huber läuft unbefristet weiter. Er endet erst mit einer Kündigung.» Der zweite Satz ist neu und beantwortet meine Frage aus a6 («Gelten jetzt die normalen Kündigungsfristen?»). Der Hinweis auf der Seite ist weg, beim Vertrag steht «Laufend», Vertragsende «Unbefristet», neu gibt es den Knopf «Beenden». In der Übersicht ist die Karte zu Lea Huber weg, Musterhaus Zentrum zeigt 5/6 statt 4/6 vermietet.
- Noch wie in a6, nicht neu: Solange die Frage offen ist, steht bei der Vertragsdauer das Abzeichen «Beendet» (P-4 aus a6). Die Karten in der Übersicht nennen weder Wohnung noch Gebäude, und beide Links heissen «Mietvertrag öffnen» (P-3 aus a6). Im Kasten «2 Abrechnungen fehlen» steht weiterhin «Mietstage».
- Die Karte zu Jonas Graf (anderes Gebäude) war in der Übersicht noch da. Ich habe sie nicht angefasst.
- Auf dem bildschirmfüllenden Screenshot mit offenem Dialog dunkelt der Hintergrund nur die ersten 900 px ab. Das liegt am Screenshot über die ganze Seitenlänge, nicht an dem, was ich im Fenster sehe.

## Aufgabe geschafft: ja

Diesmal ohne Umweg: Ich konnte nachsehen, was «Mieter ist ausgezogen» bewirkt, ohne dass etwas gespeichert wurde, und habe danach richtig geantwortet.

## Aufwand

Etwa 5 Minuten, 4 Durchgänge. Für die eigentliche Antwort waren es 3 Schritte (Übersicht, «Mietvertrag öffnen», «Unbefristet weiterführen»). Dazu kamen zum Nachsehen der Dialog mit «Abbrechen» und auf dem Handy der Dialog mit Escape.

## Ablauf

1. **Übersicht öffnen.** Erwartet: die Aufgabe zum Mietvertrag. Gesehen: Unter «Als Nächstes zu tun» stehen zwei Karten «Befristeten Mietvertrag prüfen» (Jonas Graf, Lea Huber). Die zu Lea Huber habe ich am Namen erkannt.
2. **«Mietvertrag öffnen» bei Lea Huber.** Erwartet: die Frage und diesmal eine Erklärung der Folgen. Gesehen: Kasten «Befristeter Mietvertrag abgelaufen» mit der Frage, dem neuen Absatz zu den Folgen beider Antworten, dem Hinweis zur Rückgabe und den Knöpfen «Unbefristet weiterführen» und «Mieter ist ausgezogen». Jetzt wusste ich vor dem Klick, dass «ausgezogen» heisst: Wohnung leer seit 01.01.2026, Nebenkosten trage ich.
3. **«Mieter ist ausgezogen» anklicken, nur zum Nachsehen.** Erwartet: diesmal eine Rückfrage. Gesehen: Dialog «Auszug von Lea Huber bestätigen» mit der Folge in drei Sätzen, Fokus auf «Abbrechen». Ich habe die Folge verstanden, bevor etwas gespeichert war.
4. **«Abbrechen».** Erwartet: nichts geändert. Gesehen: Der Dialog ist zu. Auch nach dem Neuladen sind die Frage und beide Knöpfe noch da.
5. **Handy: Mietvertrag öffnen, «Mieter ist ausgezogen».** Erwartet: ein Dialog, der auf den Bildschirm passt. Gesehen: ein Dialog unten im Bildschirm, Knöpfe untereinander, 48 px hoch, kein seitliches Scrollen. Mit Escape geschlossen, nach dem Neuladen ist die Frage noch da.
6. **Desktop: «Unbefristet weiterführen».** Erwartet: Speichern und eine Meldung, dass Lea Huber bleibt. Gesehen: kein Dialog. Die Meldung «Der Mietvertrag von Lea Huber läuft unbefristet weiter. Er endet erst mit einer Kündigung.» kam im Statusbereich (beim ersten Blick nach 0,4 s war er noch leer, später stand sie da). Dazu «Laufend», Vertragsende «Unbefristet» und der Knopf «Beenden».
7. **Übersicht danach.** Die Karte zu Lea Huber ist weg, Musterhaus Zentrum hat 5/6 vermietet.

## Verwirrung

- Zu den geänderten Stellen keine. Die Begriffe im Dialog und im neuen Absatz («leer», «Nebenkosten dieser Zeit tragen Sie», «Kündigung») habe ich verstanden.
- Unverändert verwirrend (aus a6): das Abzeichen «Beendet», solange die Frage offen ist, und «Mietstage».

## Fehlerrisiken

- Das Risiko aus a6 (falscher Auszug durch einen Klick zum Nachsehen) ist durch den Dialog weg.
- Bleibt: Wer im Dialog trotzdem «Auszug bestätigen» drückt, kommt nur über «Bearbeiten» zurück. Der Dialog sagt aber deutlich, was passiert. Das halte ich für ausreichend.

## Vorschläge

Keine zu den geänderten Stellen. P-3 und P-4 aus a6 sind noch offen (siehe `anna-a6.md`).

## Nicht geprüft

- «Auszug bestätigen»: Nicht gedrückt, laut Aufgabe sollte ich abbrechen. Ob danach eine Meldung kommt, weiss ich daher nicht.
- Wie die Meldung nach «Unbefristet weiterführen» aussieht: Meinen Screenshot habe ich 0,4 s nach dem Klick gemacht, da war sie noch nicht da. Den Text habe ich danach aus dem Statusbereich gelesen. Wiederholen ging nicht, weil die Frage nach dem Speichern weg ist.
- Der Knopf «Beenden» und alles in den anderen Gebäuden (Jonas Graf): gehört nicht zur Aufgabe, dort durfte ich nichts ändern.
