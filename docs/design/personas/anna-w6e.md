# Persona-Review: Anna, Runde w6e – vergessene Rechnung nach erstellten Abrechnungen

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, eine Seite zusätzlich auf dem Handy (390 × 844). App: http://localhost:3300 (Persona-Stack, Demodaten). Gespeichert nur im Gebäude «Musterhaus Zentrum».

Aufgabe: Eine vergessene Rechnung vom letzten Jahr erfassen («Hauswart Muster AG», CHF 400.00, Kategorie Hauswart, Rechnungsdatum 15.11.2025, Musterhaus Zentrum). Danach herausfinden, ob sie schon in meinen Nebenkostenabrechnungen 2025 ist, und wenn nicht: was ich jetzt tun muss und wo. Keine Abrechnung löschen oder berichtigen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/persona-anna/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Übersicht (`/dashboard`) | Nach dem Speichern zeigt die Übersicht keinen Hinweis, dass Abrechnungen nicht mehr stimmen. Sie fordert mich sogar weiter auf: «7 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.» Wer die Warnung auf der Rechnung wegklickt oder später zurückkommt, versendet veraltete Entwürfe. |
| P-2 | Major | Rechnung, Hinweis «Abrechnungen nicht aktuell» | Der Hinweis sagt, was zu tun ist («Löschen Sie die Entwürfe dieser Periode …»), aber nicht, welche Abrechnungen betroffen sind (Gebäude, wie viele Entwürfe, ob eine schon versendet ist), und er hat keinen Link dorthin. Ich musste selbst über die Navigation «Nebenkostenabrechnungen» suchen und jede Zeile öffnen. |
| P-3 | Minor | Liste Nebenkostenabrechnungen (`/statements`, auch gefiltert nach Musterhaus Zentrum) | In der Liste ist keine Abrechnung als «nicht aktuell» markiert. Die drei Entwürfe und die versendete Abrechnung von Musterhaus Zentrum sehen genau gleich aus wie die unveränderten von Seepark Residenz. Erst in der Detailansicht steht die Warnung. |
| P-4 | Minor | Hinweis auf der Rechnung | Der Text beginnt mit «Löschen Sie die Entwürfe dieser Periode». «Dieser Periode» klingt nach allen Entwürfen 2025, auch denen von Seepark Residenz, die mit meiner Rechnung nichts zu tun haben. Ich hätte fast die falschen gelöscht. Gemeint sind wohl nur die Entwürfe von Musterhaus Zentrum. |
| P-5 | Minor | Abrechnung, Entwurf (Maria Rossi) | Die Warnung «Rechnungen seit der Abrechnung geändert … 1 Rechnung … erfasst, geändert oder gelöscht» sagt nicht, welche Rechnung, und verlinkt sie nicht. Der Knopf «Als versendet markieren» bleibt gleich prominent wie vorher. Ich kann also eine Abrechnung, von der Dwello weiss, dass sie veraltet ist, ohne Rückfrage als versendet markieren. |
| P-6 | Minor | Abrechnung, versendet (Hans Müller) | Die Anleitung für versendete Abrechnungen ist gut. Sie hilft mir aber nicht beim Rechnen: Wie viel von den CHF 400.00 trifft Herrn Müller? Ich soll eine «berichtigte Abrechnung» schicken, aber Dwello sagt mir weder den Betrag noch wie ich ihn bekomme. |

## Beobachtungen

- Das Formular «Neue Rechnung» war verständlich. Hilfreich war der Hinweis beim Rechnungsdatum («Übernehmen Sie das Datum von der Rechnung, nicht das heutige. … bestimmt es, in welche Abrechnungsperiode die Rechnung fällt»). Vorausgefüllt war das heutige Datum (17.10.2026). Das musste ich überschreiben, sonst wäre die Rechnung im falschen Jahr gelandet.
- Verteilschlüssel: Ich habe keinen gewählt («Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt»). In den bestehenden Abrechnungen ist Hauswart aber «Pro Fläche (m²)» verteilt. Ob meine Rechnung beim Neuerstellen pro Wohnung oder pro m² verteilt wird, weiss ich nicht. Auf der Rechnung steht danach: «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt».
- Nach dem Speichern verdeckt die Meldung «Rechnung von Hauswart Muster AG gespeichert» rechts einen Teil des Kastens «Beleg» (Desktop).
- In der Detailansicht der Abrechnung ist zwischen der Warnung und «Kostenaufstellung» eine grosse leere Fläche.
- Hans Müller (versendet): «Erstellt 17.10.2026, 05:34» im Verlauf, aber «Versendet 28.09.2026». Versendet vor dem Erstellen? Das wirkt widersprüchlich (wohl Demodaten).
- Uhrzeiten: Die Rechnung zeigt «Erfasst 17.10.2026, 05:35», der Assistent «Abrechnungen erstellen» kurz danach «Entwurf gespeichert, 03:37». Die zwei Uhrzeiten passen nicht zusammen (Zeitzone?).
- Assistent «Abrechnungen erstellen» (bis Schritt 4, nichts erstellt): Schritt 2 sagt bei Musterhaus Zentrum nur «20 Rechnungen in der Abrechnungsperiode», nichts über bestehende oder veraltete Abrechnungen. Erst die Vorschau sagt: «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.» Dazu kommt ein Link «Abrechnungen von Musterhaus Zentrum ansehen». Das ist der einzige Link in Dwello, der mich gezielt zu den betroffenen Abrechnungen führt.
- Der Assistent hat beim Durchklicken einen eigenen Entwurf gespeichert («Entwurf gespeichert»). Das ist ein Assistenten-Entwurf, keine Abrechnung. Das Wort «Entwurf» bedeutet hier also etwas anderes als bei den Abrechnungen, das verwirrt.
- Auf dem Handy (390 px) ist der Hinweis auf der Rechnung vollständig und gleich weit oben wie auf dem Desktop.

## Aufgabe geschafft: teilweise

Rechnung erfasst: ja. Verstanden, dass die Abrechnungen 2025 von Musterhaus Zentrum sie nicht enthalten: ja, sofort nach dem Speichern. Gewusst, was zu tun ist: ja (Entwürfe löschen und neu erstellen, die versendete Abrechnung von Hans Müller ausserhalb von Dwello berichtigen). Den Ort zum Beheben gefunden: nur über Umwege. Der Hinweis führt mich nirgends hin, und die Übersicht sowie die Liste zeigen das Problem nicht.

## Aufwand

Etwa 15 Minuten, 14 Schritte (Übersicht, Formular, Speichern, Rechnung, Liste Abrechnungen, zwei Abrechnungen geöffnet, Übersicht erneut, Assistent bis Schritt 4, Liste nach Gebäude, Handyansicht).

## Ablauf

1. **Übersicht.** Erwartet: einen Weg zum Erfassen einer Rechnung. Gesehen: «Häufige Arbeiten» mit «Rechnung erfassen». Gut. Oben steht «Noch nicht abgerechnet: Alpenblick». Musterhaus Zentrum ist also schon abgerechnet, das fällt mir aber erst später auf.
2. **Neue Rechnung.** Erwartet: ein einfaches Formular. Gesehen: Gebäude, Rechnungsdatum (vorausgefüllt mit heute), Leistungszeitraum (optional, langer Text), Betrag, Rechnungssteller, Beschreibung, Kategorie, Verteilschlüssel, «Umlagefähig» angehakt. Die Kategorieliste füllt sich erst, wenn ich das Gebäude gewählt habe. «Hauswart» war da. Datum auf 15.11.2025 geändert, darunter erscheint «Samstag, 15. November 2025». Das beruhigt.
3. **Speichern.** Erwartet: «gespeichert» und vielleicht ein Hinweis, dass die Abrechnung 2025 schon gemacht ist. Gesehen: Die Rechnungsseite mit einem gelben Kasten «Abrechnungen nicht aktuell»: «Für die Abrechnungsperiode 01.01.2025 – 31.12.2025 gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon.» Danach kommt die Anleitung für Entwürfe und versendete Abrechnungen. Das habe ich sofort verstanden: Meine Abrechnungen stimmen nicht mehr. Aber: kein Link, kein Gebäude, keine Anzahl (P-2), und «Entwürfe dieser Periode» ist mir zu breit (P-4).
4. **Liste Nebenkostenabrechnungen.** Erwartet: Die betroffenen Abrechnungen sind markiert. Gesehen: 17 Abrechnungen, nirgends ein Hinweis (P-3). Ich finde über Gebäude und Periode selbst heraus: Musterhaus Zentrum 2025 hat 3 Entwürfe (Maria Rossi, Pierre Dubois, Anna Schmidt) und 1 versendete (Hans Müller).
5. **Entwurf Maria Rossi.** Erwartet: Bestätigung, dass meine Rechnung fehlt. Gesehen: Warnung «Rechnungen seit der Abrechnung geändert … Löschen Sie ihn und erstellen Sie die Abrechnung erneut.» In der Kostenaufstellung bei Hauswart stehen nur «Hauswartung Q1 bis Q4 2025» zu je CHF 920.00 (total CHF 3’680.00), meine CHF 400.00 fehlen. Damit ist es klar. Welche Rechnung gemeint ist, sagt die Warnung nicht (P-5).
6. **Versendet, Hans Müller.** Erwartet: Was mache ich mit einer schon verschickten Abrechnung? Gesehen: Eine klare Anleitung, die Abrechnung ausserhalb von Dwello zu berichtigen, mit Beleg, und die Differenz zu verrechnen. Ob ich nachverlangen darf, ist «nicht in jedem Fall sicher». Ehrlich, aber für mich als Anfängerin heisst das: beraten lassen. Den Betrag für eine Berichtigung liefert Dwello nicht (P-6).
7. **Zurück zur Übersicht.** Erwartet: Ein Punkt «Abrechnungen 2025 von Musterhaus Zentrum sind nicht aktuell». Gesehen: Unverändert «7 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.» (P-1)
8. **Abrechnungen erstellen (nur bis Vorschau).** Erwartet: Der Assistent erkennt die veralteten Entwürfe. Gesehen: In Schritt 2 nichts dazu. In Schritt 4 «Anzahl Abrechnungen 0» und der Satz, dass ich einen Entwurf zuerst löschen muss, mit Link zu den Abrechnungen von Musterhaus Zentrum. Hier habe ich aufgehört (Auftrag: nichts löschen, nichts neu erstellen).
9. **Handy.** Die Rechnungsseite zeigt denselben Hinweis gut lesbar und ohne seitliches Scrollen.

## Verwirrung

- «Entwürfe dieser Periode»: Alle Entwürfe 2025 oder nur die von meinem Gebäude?
- «mit einem früheren Stand davon»: Was ist ein «Stand» einer Rechnung? Ich habe sie gerade neu erfasst, einen früheren Stand gibt es nicht.
- «Entwurf» heisst zweimal etwas anderes: der Entwurf einer Abrechnung und der vom Assistenten gespeicherte «Entwurf».
- «Als versendet markieren»: Versendet Dwello dann etwas, oder halte ich nur fest, dass ich es verschickt habe? Gerade bei einer veralteten Abrechnung ist das wichtig.
- «berichtigte Abrechnung»: Wie erstelle ich die ausserhalb von Dwello, wenn ich die Zahlen nicht kenne?

## Fehlerrisiken

- Veraltete Entwürfe versenden, weil die Übersicht dazu auffordert (P-1) und der Knopf «Als versendet markieren» ohne Rückfrage bereitsteht (P-5).
- Die falschen Entwürfe löschen (Seepark Residenz), weil der Hinweis von «Entwürfen dieser Periode» spricht (P-4).
- Die Zahlungsfrist von Hans Müller (28.10.2026, «in 11 Tagen») läuft in der Übersicht weiter, ohne Hinweis, dass seine Abrechnung zu tief ist. Ich könnte die Berichtigung vergessen.
- Kein Verteilschlüssel gewählt: Die Hauswart-Kosten könnten beim Neuerstellen anders verteilt werden als die übrigen Hauswart-Rechnungen (pro m²).

## Vorschläge

- **P-1:** Rechnung mit Datum 15.11.2025 in Musterhaus Zentrum erfassen, dann `/dashboard` öffnen. Hilfreich: unter «Als Nächstes zu tun» ein eigener Punkt «Abrechnungen 2025 von Musterhaus Zentrum sind nicht mehr aktuell» mit Link auf die betroffenen Abrechnungen, vor «Abrechnungen prüfen und versenden».
- **P-2:** Gleiche Rechnung speichern, Hinweis auf der Rechnungsseite lesen. Hilfreich: Gebäude und Anzahl nennen («Musterhaus Zentrum: 3 Entwürfe, 1 versendete Abrechnung») und ein Link «Betroffene Abrechnungen ansehen» auf `/statements?building=…`, idealerweise nur die der Periode.
- **P-3:** Nach dem Speichern `/statements` öffnen. Hilfreich: In der Zeile jeder betroffenen Abrechnung ein Zusatz in Worten, zum Beispiel «Nicht aktuell», nicht nur farbig.
- **P-4:** Hinweistext auf der Rechnung. Hilfreich: «Löschen Sie die Entwürfe von Musterhaus Zentrum für diese Periode …».
- **P-5:** Entwurf Maria Rossi öffnen. Hilfreich: Die geänderte Rechnung mit Link nennen («Hauswart Muster AG, CHF 400.00, neu erfasst»). Bei «Als versendet markieren» eines veralteten Entwurfs nachfragen, oder «Abrechnung löschen» als nächsten Schritt hervorheben.
- **P-6:** Abrechnung Hans Müller öffnen. Hilfreich: Den ungefähren Mehrbetrag für diesen Mieter zeigen, oder eine Vorschau der neu berechneten Abrechnung als Grundlage für die Berichtigung.

## Nicht geprüft

- Entwürfe löschen und Abrechnungen neu erstellen: Der Auftrag verbietet es. Ob die neu erstellten Abrechnungen die Rechnung dann enthalten und wie sie Hauswart verteilen, habe ich nicht gesehen.
- Die PDFs der veralteten Abrechnungen: nicht geöffnet. Ob dort ein Hinweis steht, weiss ich nicht.
- Die Rechnungsliste (`/invoices?year=2025`): nicht angesehen, ob die neue Rechnung dort einen Hinweis trägt.
- Ändern oder Löschen einer bestehenden Rechnung (der zweite Fall «früherer Stand»): nicht Teil der Aufgabe.
- Dunkelmodus, andere Sprachen: nicht Teil der Aufgabe.
