# Anna – Runde a6: abgelaufener befristeter Mietvertrag (Lea Huber, Musterhaus Zentrum)

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück. Desktop 1440 × 900, Maus; dieselben Bildschirme auf dem Handy 390 × 844.
App: Persona-Stack http://localhost:3300. Gespeichert habe ich nur am Mietvertrag von Lea Huber (Wohnung 2.02, Musterhaus Zentrum).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/anna-a6/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag, Hinweis «Befristeter Mietvertrag abgelaufen» | Ein Klick auf «Mieter ist ausgezogen» speichert sofort: keine Rückfrage, keine Folgen genannt, und auf dem Screenshot danach keine Bestätigung zu sehen. Danach ist die Frage weg, und «Unbefristet weiterführen» gibt es nicht mehr. Ich wollte nur nachsehen, was der Knopf macht, und hatte damit die falsche Antwort gespeichert. Zurück kam ich nur über «Bearbeiten» und zwei Speichervorgänge. |
| P-2 | Minor | Mietvertrag, Hinweis und Schaltflächen | Beide Antworten sehen gleich aus (zwei gleich gestaltete Knöpfe nebeneinander). Am Knopf selbst steht nicht, was die Antwort für mich bedeutet. Bei «Unbefristet weiterführen» steht die Folge im Text darüber, bei «Mieter ist ausgezogen» steht nirgends, was danach passiert (die Wohnung gilt ab 01.01.2026 als leer, die Nebenkosten trage ich). Das steht nur im Bearbeiten-Formular. |
| P-3 | Minor | Übersicht, Karte «Befristeten Mietvertrag prüfen» | Die Karte nennt die Mieterin, aber weder Wohnung noch Gebäude. Mit mehreren Gebäuden muss ich den Mietvertrag erst öffnen, um zu wissen, um welche Wohnung es geht. Ausserdem heissen alle Links «Mietvertrag öffnen», auch wenn mehrere solche Karten da sind (am Anfang gab es zwei). |
| P-4 | Minor | Mietvertrag, Kasten «Vertragsdauer» | Solange die Frage offen ist, steht beim Mietvertrag das Abzeichen «Beendet», und die Wohnung 2.02 steht auf «Leer», obwohl Lea Huber dort wohnt und Dwello mich ja gerade fragt, ob sie noch da ist. Das widerspricht der Frage und hat mich verunsichert («ist der Vertrag jetzt schon weg?»). |

## Beobachtungen

- Die Übersicht ist gut: «Als Nächstes zu tun» zeigt mir sofort, was zu tun ist, und die Frage zum Mietvertrag ist verständlich, mit Beispiel («weil Sie den Mietzins weiter annehmen»).
- Der Satz «Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und lassen Sie sich beraten.» ist hilfreich und ehrlich.
- Nach «Unbefristet weiterführen» kommt die Meldung «Der Mietvertrag von Lea Huber läuft unbefristet weiter». Das Abzeichen wechselt auf «Laufend», beim Vertragsende steht «Unbefristet», und neu gibt es den Knopf «Beenden». Die Karte in der Übersicht ist weg, Musterhaus Zentrum zeigt 5/6 statt 4/6 vermietet, und die Wohnung 2.02 steht auf «Vermietet» mit Lea Huber als aktueller Mieterin. Das war für mich nachvollziehbar.
- «Unbefristet weiterführen» speichert ebenfalls ohne Rückfrage. Das ist hier harmlos, weil die Meldung kommt und der Zustand klar ist.
- Das Bearbeiten-Formular behandelt dieselbe Sache viel sorgfältiger als der Knopf: Bei einem Vertragsende in der Vergangenheit muss ich ein Kästchen ankreuzen («Der Mietvertrag endete am 31.12.2025.»), und die Folgen stehen dabei.
- Nachdem ich im Formular «endete am 31.12.2025» angekreuzt und gespeichert hatte, stellte Dwello die Frage trotzdem wieder. Das war für mich gut (so konnte ich richtig antworten), ist aber widersprüchlich: Ich hatte ja gerade bestätigt, dass er endete.
- Im Kasten «2 Abrechnungen fehlen» steht «Mietstage». Ich vermute, gemeint ist «Miettage».
- Die Karte «Jonas Graf» (anderes Gebäude) war schon beim zweiten Öffnen der Übersicht weg, vermutlich hat eine andere Persona sie beantwortet. Kein Befund von mir.
- Auf dem Handy (390 px) gibt es kein seitliches Scrollen, die Knöpfe sind 48 px hoch und stehen untereinander. Die Frage ist auch dort gut lesbar.

## Aufgabe geschafft: ja

Mit Umweg: Zuerst habe ich aus Versehen die falsche Antwort gespeichert (P-1) und musste sie über «Bearbeiten» zurücknehmen.

## Aufwand

Etwa 15 Minuten, 13 Durchgänge. Ohne den Fehlklick wären es 3 Schritte gewesen (Übersicht, «Mietvertrag öffnen», «Unbefristet weiterführen»).

## Ablauf

1. **Übersicht öffnen.** Erwartet: eine Liste, was ich tun muss. Gesehen: «Als Nächstes zu tun» mit «Nebenkostenabrechnungen erstellen», «Abrechnungen prüfen und versenden» und zwei Karten «Befristeten Mietvertrag prüfen» (Jonas Graf, Lea Huber). Gut. Welche Karte zu Musterhaus Zentrum gehört, steht nicht dabei (P-3).
2. **«Mietvertrag öffnen» bei Lea Huber.** Erwartet: die Frage mit Antwortmöglichkeiten. Gesehen: Kasten «Befristeter Mietvertrag abgelaufen» mit derselben Frage, dem Hinweis zur Rückgabe und den Knöpfen «Unbefristet weiterführen» und «Mieter ist ausgezogen». Darunter steht «Vertragsdauer: Beendet» (P-4).
3. **Herausfinden, was «Mieter ist ausgezogen» bedeutet.** Erwartet: eine Erklärung oder Rückfrage, bevor etwas passiert, so wie ich es von «Löschen» kenne. Gesehen: Der Hinweis verschwand sofort, und beim Neuladen blieb er weg. Kein Dialog. Auf dem Screenshot ist keine Meldung zu sehen, und «Unbefristet weiterführen» gibt es nicht mehr (P-1). Ich war erschrocken: Lea wohnt ja noch dort.
4. **Rückgängig machen.** Erwartet: einen Knopf «Rückgängig» oder die Frage noch einmal. Gesehen: nichts davon. Unter «Bearbeiten» habe ich «Unbefristet» gewählt und gespeichert. Meldung «Mietvertrag von Lea Huber gespeichert», Abzeichen «Laufend». Damit war Lea richtig erfasst.
5. **Den vorgesehenen Weg prüfen.** Unter «Bearbeiten» habe ich wieder «Befristet» mit dem Vertragsende 31.12.2025 eingetragen. Das Formular verlangte das Kästchen «Der Mietvertrag endete am 31.12.2025.» und nannte die Folgen. Nach dem Speichern war die Frage auf dem Mietvertrag und in der Übersicht wieder da.
6. **Handy: Übersicht und Mietvertrag ansehen.** Gesehen: alles untereinander, gut lesbar, die Knöpfe mit voller Höhe, kein seitliches Scrollen.
7. **«Unbefristet weiterführen» (Desktop).** Erwartet: dass der Vertrag weiterläuft und ich das sehe. Gesehen: Meldung «Der Mietvertrag von Lea Huber läuft unbefristet weiter», «Laufend», Vertragsende «Unbefristet», neuer Knopf «Beenden».
8. **Übersicht, Liste und Wohnung danach (Desktop und Handy).** Die Karte zu Lea ist weg. Musterhaus Zentrum zeigt 5/6 vermietet. In der Liste der Mietverträge steht bei Lea «Laufend, seit 01.01.2024, unbefristet», bei der Wohnung 2.02 «Vermietet». Ich habe verstanden: Der Mietvertrag läuft jetzt einfach weiter, bis jemand kündigt.

## Verwirrung

- «Beendet» beim Vertrag, während Dwello fragt, ob die Mieterin noch dort wohnt (P-4).
- «Mieter ist ausgezogen»: Ich dachte, der Knopf erklärt mir zuerst etwas. Was er genau speichert, habe ich erst im Bearbeiten-Formular verstanden.
- Nach «Unbefristet weiterführen» frage ich mich: Gelten jetzt die normalen Kündigungsfristen? Der Text im Formular («Er läuft, bis er gekündigt wird.») hilft, steht aber nicht auf der Vertragsseite selbst.
- «Mietstage» (siehe Beobachtungen).

## Fehlerrisiken

- Wer wie ich nur nachsehen will, was «Mieter ist ausgezogen» bedeutet, erfasst einen Auszug, der nicht stimmt. Danach gilt die Wohnung als leer, und das Akonto zählt nur bis zum Vertragsende. In der Nebenkostenabrechnung würde ich dann die Kosten von 2026 selbst tragen, ohne es zu merken (P-1).
- Weil beide Karten in der Übersicht gleich heissen und kein Gebäude nennen, kann man den falschen Mietvertrag beantworten (P-3).
- Wer den Fehler bemerkt, findet den Rückweg nur über «Bearbeiten» und muss dort selbst wissen, dass «Unbefristet» die richtige Wahl ist.

## Vorschläge

- **P-1:** Mietvertrag Lea Huber öffnen und auf «Mieter ist ausgezogen» klicken: Es wird ohne Rückfrage gespeichert. Hilfreich wäre ein Bestätigungsdialog mit der echten Folge, zum Beispiel: «Der Mietvertrag endete am 31.12.2025. Seit dem 01.01.2026 gilt die Wohnung 2.02 als nicht vermietet; die Nebenkosten dieser Zeit tragen Sie.» Dazu die Schaltflächen «Auszug bestätigen» und «Abbrechen». Danach eine Meldung wie bei «Unbefristet weiterführen».
- **P-2:** Mietvertrag Lea Huber im offenen Zustand ansehen. Hilfreich wäre unter jedem Knopf ein kurzer sichtbarer Satz zur Folge, zum Beispiel unter «Mieter ist ausgezogen»: «Der Mietvertrag endete am 31.12.2025; die Wohnung ist seither leer.»
- **P-3:** Übersicht mit zwei abgelaufenen befristeten Mietverträgen öffnen. Hilfreich wäre, in der Karte Wohnung und Gebäude zu nennen («Wohnung 2.02 · Musterhaus Zentrum») und den Link eindeutig zu benennen («Mietvertrag von Lea Huber öffnen»).
- **P-4:** Mietvertrag Lea Huber öffnen, bevor die Frage beantwortet ist: Das Abzeichen zeigt «Beendet», die Wohnung 2.02 «Leer». Hilfreich wäre ein Abzeichen wie «Abgelaufen – bitte prüfen» statt «Beendet», solange die Frage offen ist.

## Nicht geprüft

- Ob nach «Mieter ist ausgezogen» doch kurz eine Meldung erschien: Mein Screenshot ist von etwa 0,8 s nach dem Klick und zeigt keine. Wiederholen wollte ich den Fehlklick nicht noch einmal.
- Der Knopf «Beenden» nach dem Weiterführen: Ich habe ihn nicht angeklickt, weil Lea nicht gekündigt hat.
- Was eine Nebenkostenabrechnung 2025/2026 jetzt für Lea rechnet: Das gehörte nicht zur Aufgabe, und ich wollte keine Abrechnung erstellen.
- Der Fall Jonas Graf: anderes Gebäude, dort durfte ich nichts ändern. Seine Karte war schon weg.
