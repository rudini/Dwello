# Helga – Hinweise zu Rechnungen in der Vorschau, Runde 2

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 mit frischen Demodaten. Ich habe nur geschaut: nichts gespeichert, keine Abrechnung erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/527f7d77-0112-5cce-90a1-4063e5ce2c7e/scratchpad/helga-invoice-hints-2/`.
Runde 1: `helga-invoice-hints.md` (P-1 Heizöl im Hinweis, P-4 Beschreibung fehlt, P-5 Datum ohne Beschriftung).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde zu den geänderten Zeilen. P-1, P-4 und P-5 aus Runde 1 sind behoben (siehe Ablauf). |

## Beobachtungen

- Für die Periode 01.01.–30.06.2025 erscheint der Hinweis «Rechnungen kurz nach der Abrechnungsperiode» gar nicht mehr. Seine einzige Rechnung war die Heizöl-Lieferung. Das finde ich richtig: Ein Hinweis weniger, und der gelbe Hinweis zum Tankbestand sagt mir allein, was beim Heizöl zu tun ist.
- Jede Zeile ist jetzt ein langer Link («Winterdienst Oberland: Schneeräumung Januar bis März 2025. Rechnungsdatum 31.03.2025, CHF 920.00»). Bei 150 % bricht er auf zwei Zeilen um. Ich konnte ihn trotzdem gut lesen; die Abstände zwischen den Zeilen zeigen, wo eine Rechnung aufhört.
- Die Punkte aus Runde 1, die nicht zu dieser Änderung gehören, sind weiterhin da: «Die Abrechnungen trotzdem erstellen» (trotz welcher Hinweise?), «Möglicherweise fehlen Rechnungen» über einem Hinweis, der nur den Tankbestand betrifft, und «Fehlen Rechnungen?» bei Laura Keller (60 %) und Kevin Fischer (58 %).
- Der Entwurf des Assistenten liegt offenbar nur in meinem Browser: In einem neuen Browserfenster begann der Assistent wieder bei Schritt 1 mit dem Vorschlag 01.01.–31.12.2025.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, rund 12 Schritte für den Auftrag (Nebenkostenabrechnungen → Abrechnungen erstellen → Ende 30.06.2025 → Alpenblick → Weiter → Weiter → Hinweise lesen). Dazu drei Vergleiche mit anderen Enddaten (31.05., 31.07., 31.08.2025), um den Hinweis «kurz nach» überhaupt zu sehen und zu prüfen, ob das Heizöl anderswo auftaucht.

## Ablauf

1. **Nebenkostenabrechnungen → «Abrechnungen erstellen».** Erwartet: Schritt 1 mit Vorschlag. Gesehen: Beginn 01.01.2025, Ende 31.12.2025, darunter der Wochentag ausgeschrieben («Mittwoch, 1. Januar 2025»). Hilft mir (`02-step1.png`).
2. **Ende auf 30.06.2025, Weiter.** Erwartet: Gebäude. Gesehen: Alpenblick «3 Rechnungen in der Abrechnungsperiode, 3 Wohnungen» (`03-step2.png`). Alpenblick angekreuzt.
3. **Schritt 3 unverändert, Weiter.** Vorschau (`05-step4.png`): Periode 01.01.2025 – 30.06.2025, 2 Abrechnungen, CHF 1’079.86; «Alpenblick 3 Rechnungen vom 31.03.2025 bis 30.06.2025».
4. **Hinweis «Rechnungen ohne Leistungszeitraum».** Erwartet (nach Runde 1): wieder nur Rechnungssteller, Datum, Betrag. Gesehen: drei Zeilen, jetzt mit Beschreibung und beschriftetem Datum:
   - «Winterdienst Oberland: Schneeräumung Januar bis März 2025. Rechnungsdatum 31.03.2025, CHF 920.00»
   - «BKW Energie AG: Allgemeinstrom H1 2025. Rechnungsdatum 30.06.2025, CHF 182.60»
   - «Gemeinde Interlaken: Wasser und Abwasser H1 2025. Rechnungsdatum 30.06.2025, CHF 470.00»

   Kann ich ohne Öffnen sagen, ob eine für mehr als mein halbes Jahr gilt? Ja: Januar bis März liegt drin, «H1 2025» ist genau mein erstes Halbjahr. Also muss ich bei keiner etwas tun. Welches Datum genannt ist? Steht jetzt dabei: «Rechnungsdatum». P-4 und P-5 behoben.
5. **Hinweis «Rechnungen kurz nach der Abrechnungsperiode».** Erwartet: die Heizöl-Rechnung (Heizöl Oberland AG, 25.08.2025) wie in Runde 1. Gesehen: Der Hinweis fehlt ganz. Unter den Hinweisen stehen nur noch der gelbe (Tankbestand am 30.06.2025 fehlt, Link «Tankbestand erfassen») und der blaue ohne Leistungszeitraum. Das Heizöl steht in keinem der beiden Rechnungs-Hinweise. P-1 behoben.
6. **Vergleich Ende 31.05.2025** (`08-step4-bis-mai.png`), damit ich den Hinweis «kurz nach» überhaupt sehe. Gesehen: «ohne Leistungszeitraum» mit Winterdienst; «kurz nach» mit «BKW Energie AG: Allgemeinstrom H1 2025. Rechnungsdatum 30.06.2025, CHF 182.60» und «Gemeinde Interlaken: Wasser und Abwasser H1 2025. Rechnungsdatum 30.06.2025, CHF 470.00». Gleiche Form wie oben: Beschreibung und «Rechnungsdatum». An «H1 2025» sehe ich sofort, dass diese Rechnungen auch in meinen Mai hineinreichen und ich ihren Leistungszeitraum erfassen sollte. Das ist genau, was der Hinweis verlangt.
7. **Vergleich Ende 31.07.2025 und 31.08.2025** (`08-step4-bis-juli.png`, `08-step4-bis-aug.png`). Bis Juli liegt die Heizöl-Lieferung (25.08.) kurz nach der Periode: kein Hinweis «kurz nach». Bis August liegt sie in der Periode («4 Rechnungen vom 31.03.2025 bis 25.08.2025»): Sie steht nicht unter «ohne Leistungszeitraum», nur der Tankbestand-Hinweis erscheint. Das Heizöl taucht also nirgends mehr in den Leistungszeitraum-Hinweisen auf.

## Verwirrung

- «H1 2025» in der Beschreibung: Ich weiss, dass das «erstes Halbjahr» heisst, aber nur, weil ich es aus der Bank kenne. Das ist der Text des Rechnungsstellers, nicht von Dwello; darum kein Befund.
- «Leistungszeitraum» und «zählen» im Hinweistext: unverändert wie in Runde 1 (nicht Teil dieser Änderung).

## Fehlerrisiken

- Keine neuen. Das Risiko aus Runde 1 (beim Heizöl einen Leistungszeitraum eintragen, weil der Hinweis es verlangt) ist weg, weil der Hinweis das Heizöl nicht mehr nennt.
- Bleibt: Die Beschreibung hilft nur, wenn der Rechnungssteller oder ich sie sinnvoll geschrieben haben. Steht dort nur «Rechnung» oder nichts, muss ich wieder öffnen. Wie eine Zeile ohne Beschreibung aussieht, konnte ich nicht sehen (siehe Nicht geprüft).

## Vorschläge

Keine zu den geänderten Zeilen. Runde-1-Befunde:
- **P-1 (Runde 1):** behoben. Assistent → 01.01.–30.06.2025 → Alpenblick → Vorschau: Heizöl Oberland AG steht in keinem Rechnungs-Hinweis.
- **P-4 (Runde 1):** behoben. Gleicher Weg: Die Zeilen zeigen die Beschreibung.
- **P-5 (Runde 1):** behoben. Gleicher Weg: «Rechnungsdatum» steht vor dem Datum, in beiden blauen Hinweisen (geprüft mit Ende 31.05.2025).

## Nicht geprüft

- Eine Rechnung ohne Beschreibung in der Liste: In den Demodaten von Alpenblick hat jede genannte Rechnung eine, und ich durfte keine anlegen.
- 200 % Zoom, andere Sprachen, dunkle Darstellung.
- Was nach dem Erfassen eines Leistungszeitraums in der Vorschau steht (nichts gespeichert, Auftrag: nur schauen).
- P-2 und P-3 aus Runde 1 gehörten nicht zum Auftrag dieser Runde.
