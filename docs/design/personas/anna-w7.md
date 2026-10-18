# Anna – w7: Irrtümlich erfassten Mietvertrag löschen

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900 (ein Dialog zusätzlich auf Mobile 390 × 844), Maus. App: http://localhost:3300, Deutsch. Gespeichert nur im Gebäude «Alpenblick».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/4dd036ee-af53-5e9d-88e6-ceddb5c6cfea/scratchpad/anna-w7/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Mietvertrag löschen?» (EG, gesperrt) | Die Absage sagt «Löschen Sie zuerst die Entwürfe davon», obwohl die genannte Abrechnung NK-33333333-2024-0001 bezahlt ist und es gar keine Entwürfe gibt. Erst der letzte Satz sagt, dass der Vertrag dann bleibt. Ich musste unter «Nebenkostenabrechnungen» nachsehen, um zu verstehen, dass ich hier nichts tun kann. |
| P-2 | Minor | Dialog «Mietvertrag löschen?» (EG, gesperrt) | Die Absage nennt nur eine Nummer, ohne Status und ohne Link. Einen Hinweis wie «Hat Laura Keller die Wohnung wirklich gemietet, wählen Sie ‹Beenden›» gibt es in dieser Variante nicht mehr, obwohl er im ersten Dialog (OG2) so hilfreich war. |
| P-3 | Nit | beide Löschdialoge | «Mietstage» ist für mich ein unbekanntes Wort (ich hätte «Miettage» erwartet). Ich habe es aus dem Zusammenhang verstanden: die Tage, für die der Vertrag gilt. |
| P-4 | Nit | Dialog «Mietvertrag löschen?» (OG2) | Der Dialog nennt die Folge (die Tage zählen als Leerstand), sagt aber nicht ausdrücklich, dass das Löschen endgültig ist und nicht rückgängig gemacht werden kann. Rot und das Häkchen machen es klar genug, aber ein Satz dazu hätte mich sicherer gemacht. |

## Beobachtungen

- Beim Erfassen hat Dwello nicht gewarnt, dass Laura Keller schon einen laufenden Mietvertrag (EG) hat. So konnte ich den Fehler überhaupt machen: zwei laufende Verträge für dieselbe Person, ohne Rückfrage.
- Schritt 3 (Vertragsdatum in der Vergangenheit): Die Warnung «Der Vertragsbeginn Sonntag, 1. März 2026 liegt in der Vergangenheit …» steht dreimal untereinander (zweimal als Absatz, einmal in der Statusbox). Gut, dass gefragt wird, aber es wirkt wie ein Fehler.
- Die Erfolgsmeldungen «Mietvertrag von Laura Keller gespeichert» bzw. «… gelöscht» erscheinen rechts mitten in der Liste und decken die Zeile von Laura Keller (EG) teilweise zu: genau die Zeile, die ich danach prüfen wollte.
- Auf Mobile steht im gesperrten Dialog der (blasse) Knopf «Mietvertrag löschen» oben und «Abbrechen» darunter. Kein seitliches Scrollen (Breite 390).
- In der Liste ist «Thomas Weber» während meines Laufs auf «Beendet» gewechselt; das war eine andere Persona, kein Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 20 Schritte: Übersicht → «Mietvertrag erfassen» → 5 Assistentenschritte (mit zweitem Klick auf «Weiter» wegen der Vergangenheitswarnung) → speichern → Liste → Vertrag OG2 → «Löschen» → Klick ohne Häkchen → Häkchen → löschen → Vertrag EG → «Löschen» → Absage lesen → Abrechnungen des Vertrags nachsehen.

## Ablauf

1. **Übersicht.** Erwartet: irgendwo «Mietvertrag erfassen». Gesehen: unter «Häufige Arbeiten» genau dieser Link. Leicht.
2. **Schritt 1 Mieter.** Erwartet: Auswahl. Gesehen: Liste «Laura Keller, Interlaken». Gewählt.
3. **Schritt 2 Wohnung.** Erwartet: OG2 wählbar. Gesehen: «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²» oben, EG als «nicht verfügbar» ausgegraut. Verständlich.
4. **Schritt 3 Vertragsdauer.** 01.03.2026 eingegeben, «Weiter». Gesehen: Rückfrage, Datum liege in der Vergangenheit; nochmals «Weiter». Verstanden, aber die dreifache Meldung irritiert (Beobachtung).
5. **Schritt 4 Miete.** Nettomiete 1200, Akonto 150. Hilfetexte unter den Feldern erklären «Akonto» gut.
6. **Schritt 5 Prüfen.** Zusammenfassung stimmt (Monatlich total CHF 1’350.00). «Mietvertrag speichern». Erwartet: Bestätigung. Gesehen: Liste mit 12 Mietverträgen, OG2-Vertrag oben, Meldung «gespeichert». Keine Warnung wegen des zweiten laufenden Vertrags.
7. **OG2-Vertrag öffnen.** Erwartet: irgendwo «Löschen». Gesehen: Oben «Bearbeiten», «Beenden», «Löschen» (rot). Ich zögerte kurz zwischen «Beenden» und «Löschen».
8. **Dialog «Mietvertrag löschen?».** Gesehen: «Der Mietvertrag von Laura Keller hat am 01.03.2026 begonnen. Löschen Sie ihn nur, wenn er irrtümlich erfasst wurde, zum Beispiel für die falsche Wohnung …» und «Hatte Laura Keller die Wohnung wirklich gemietet, löschen Sie den Mietvertrag nicht: … wählen Sie «Beenden».» Das hat mein Zögern sofort aufgelöst: falsche Wohnung = löschen. Dazu ein Häkchen «Dieser Mietvertrag wurde irrtümlich erfasst.» mit «Seine Mietstage zählen danach als Leerstand, wenn kein anderer Mietvertrag die Zeit abdeckt.»
9. **Ohne Häkchen auf «Mietvertrag löschen».** Erwartet: Hinweis. Gesehen: «Bitte bestätigen Sie, dass dieser Mietvertrag irrtümlich erfasst wurde, oder brechen Sie ab.» Klar.
10. **Häkchen gesetzt, gelöscht.** Bestätigte Folge: Der Vertrag war irrtümlich; seine Tage in OG2 zählen als Leerstand. Gesehen: Liste mit 11 Verträgen, «Mietvertrag von Laura Keller gelöscht», EG-Vertrag noch da. Genau so gewollt.
11. **EG-Vertrag öffnen, «Löschen».** Erwartet: eine Warnung, dass das ihr echter Vertrag ist. Gesehen: «Dieser Mietvertrag kann nicht gelöscht werden, weil Nebenkostenabrechnungen seine Mietstage abrechnen: NK-33333333-2024-0001. Löschen Sie zuerst die Entwürfe davon. Ist eine Abrechnung versendet oder bezahlt, bleibt der Mietvertrag erhalten.» Der Knopf «Mietvertrag löschen» ist ausgegraut, kein Häkchen. Gut, dass es nicht geht. Aber ich dachte zuerst, ich müsse Entwürfe suchen und löschen (P-1).
12. **Nachgesehen** unter «Nebenkostenabrechnungen» (Link «Dazu gehört»): 1 Abrechnung, Status «Bezahlt», 0 Entwürfe. Erst jetzt verstanden: Dieser Vertrag bleibt in jedem Fall. Gut so, nur hätte der Dialog das gleich sagen können.

## Verwirrung

- «Beenden» oder «Löschen»: vor dem Dialog unklar, im Dialog sehr gut erklärt.
- «Mietstage»: unbekanntes Wort (P-3).
- «Löschen Sie zuerst die Entwürfe davon» bei einer bezahlten Abrechnung (P-1).
- «Leerstand»: verstanden als «die Wohnung gilt in dieser Zeit als leer». Ob das irgendwo Geld betrifft (z. B. wer die Nebenkosten für OG2 trägt), sagt der Dialog nicht; für meinen Fall war das aber richtig so.

## Fehlerrisiken

- Ohne Warnung beim Erfassen kann man denselben Mieter zweimal laufend eintragen (Beobachtung); das ist der Fehler, den ich hier korrigieren musste.
- Der Satz «Löschen Sie zuerst die Entwürfe davon» könnte jemanden bei einem echten Vertrag mit Entwurf dazu bringen, einen Entwurf zu löschen, nur um den Vertrag loszuwerden. Ein Hinweis auf «Beenden» fehlt in der gesperrten Variante (P-2).
- Löschen des irrtümlichen Vertrags ist gut abgesichert (Erklärung, Häkchen, Fehlermeldung ohne Häkchen).

## Vorschläge

- **P-1:** Vertrag EG von Laura Keller (Alpenblick) öffnen → «Löschen». Hilfreich: Die Absage nach dem Status der genannten Abrechnung formulieren. Ist sie versendet oder bezahlt, nur sagen: «Dieser Mietvertrag bleibt erhalten, weil die Abrechnung NK-… bezahlt ist.» Den Satz über Entwürfe nur zeigen, wenn wirklich ein Entwurf da ist.
- **P-2:** Gleicher Weg. Hilfreich: die Abrechnungsnummer als Link und derselbe Satz wie im ersten Dialog: «Hatte Laura Keller die Wohnung wirklich gemietet, … wählen Sie ‹Beenden›.»
- **P-3:** Beide Löschdialoge. Hilfreich: «Miettage» oder umschreiben: «Die Tage, für die dieser Mietvertrag galt, zählen danach als Leerstand …»
- **P-4:** Vertrag OG2 erfassen → «Löschen». Hilfreich: ein kurzer Satz «Das Löschen kann nicht rückgängig gemacht werden.»

## Nicht geprüft

- Löschen eines Vertrags, dessen Abrechnung nur ein Entwurf ist (kein solcher Fall in Alpenblick; ich hätte dafür Abrechnungen anlegen oder fremde Daten ändern müssen).
- Was «Leerstand» danach in einer Nebenkostenabrechnung für OG2 bewirkt (keine Abrechnung erstellt, nicht Teil der Aufgabe).
- Den ganzen Ablauf auf Mobile: nur den gesperrten Dialog auf 390 × 844 angesehen.
