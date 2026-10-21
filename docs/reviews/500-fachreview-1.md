# Fachreview #500, Runde 1: Stockwerk im PDF bei einer Wohnung, die nach ihrem Stockwerk heisst

Gegenstand: `backend/src/__tests__/statement-pdf-render.test.ts:80-100` (Commit 677a584, Worktree `review-500-fach`), Regel laut Auftrag. Noch kein Produktivcode.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Ein exakter Vergleich verfehlt die Wohnungsnummern, die Dwello selbst vorschlägt: Der Gebäuderegister-Import (#479) bildet sie als «Stockwerk + Lage», z.B. «EG Links» oder «2. OG Links». Diese Nummern kommen also aus der App selbst und erscheinen trotzdem doppelt. |
| V-2 | Verwalter | Minor | Gross-/Kleinschreibung und Leerzeichen sollen beim Vergleich nicht zählen («eg», «1.OG»). Behebung: beide Seiten normalisieren (klein, ohne Leerzeichen). Synonyme wie «Erdgeschoss», «Parterre», «OG1» bleiben draussen: Diese Liste wäre nie vollständig, und «Wohnung Erdgeschoss, EG» sieht nicht nach einem Tippfehler aus. |
| V-3 | Verwalter | Minor | Die Tests prüfen den Vergleich «in der PDF-Sprache» nur mit «EG». Der Import schlägt Nummern in der Sprache der Oberfläche vor (`floorLabel`, `building-register.ts:81`). Ein Vermieter mit französischer Oberfläche bekommt also «rez-de-chaussée …». Behebung: eine fr-Zeile «rez-de-chaussée», Stockwerk 0 → «Appartement rez-de-chaussée, 82.00». |
| V-4 | Verwalter | Minor | Kein Test zeigt, dass das Stockwerk bei einem Widerspruch bleibt, z.B. Nummer «EG», Stockwerk 1 → «Wohnung EG, 1. OG, 82.00 m²». Sonst würde eine Umsetzung bestehen, die schon dann weglässt, wenn die Nummer nur wie ein Stockwerk aussieht. Dann gingen Erfassungsfehler verloren, die der Mieter sonst bemerken würde. |
| V-5 | Verwalter | Minor | Bei Stockwerk −1 ist das Ergebnis uneinheitlich: Glossar und Oberfläche sagen «UG» (`UBIQUITOUS_LANGUAGE.md:20`, `messages/de.json:203`), das PDF schreibt «1. UG» (`pdf.service.ts:649`). Die vom Import vorgeschlagene Nummer «UG» ergibt deshalb «Wohnung UG, 1. UG». Das ist kein Tippfehler-Bild, und das Problem bestand schon vor dieser Änderung. Behebung: im Vergleich auch die Bezeichnung aus der Oberfläche (`floorLabel`) zulassen oder den Fall als Restpunkt im PR nennen. |

## V-1 (Major): Präfix statt Gleichheit

- **Beleg:** `src/lib/server/building-register.ts:78-84`, `proposedNumber`: `[floorLabel(floor), side].filter(Boolean).join(' ')` gibt «2. OG Links». Der Test `src/__tests__/building-register.test.ts:162-173` erwartet `'2. OG Links'`. Das PDF druckt dann `pdf.service.ts:712`: «Wohnung 2. OG Links, 2. OG, 82.00 m²» bzw. «Wohnung EG Links, EG, …».
- **Warum falsch:** Das Issue verlangt unter «Done means», dass das Stockwerk «nur, wenn es zur Nummer etwas sagt» erscheint. Bei «EG Links» sagt «EG» nichts mehr. Solche Nummern sind keine Ausnahme: Für jede Wohnung ohne Registernummer mit Lagebezeichnung erzeugt die App diese Form selbst. Die Regel liesse also genau die Fälle bestehen, die Dwello selbst herstellt.
- **Behebung:** Das Stockwerk weglassen, wenn die normalisierte Nummer dem Stockwerknamen der PDF-Sprache gleicht oder mit ihm beginnt, gefolgt von Wortende (Leerzeichen, Komma, Bindestrich oder Ende). Die Wortgrenze verhindert Treffer wie «EGG» oder «1. OG2». Das Weglassen ist ungefährlich: Es greift nur, wenn Nummer und Stockwerkfeld übereinstimmen. Ein Widerspruch bleibt sichtbar (V-4).

## Zu den Fragen des Auftrags

- **Regel fachlich richtig?** Ja, mit V-1. In der Praxis bezeichnet eine Abrechnung das Mietobjekt so, dass der Mieter es eindeutig erkennt. `docs/nebenkostenabrechnung-anforderungen.md:41` verlangt «Wohnung (Bezeichnung, Stockwerk)». Bei «Wohnung EG» ist das Stockwerk in der Bezeichnung enthalten, die Anforderung bleibt also erfüllt. Für die Form der Objektbezeichnung gibt es keine Norm (dort als unsicher-C vermerkt), Mietrecht ist nicht berührt.
- **Stockwerkname in fr/it/en behalten?** Ja. «EG» ist die Bezeichnung des Vermieters (Türschild, Briefkasten) und bleibt deshalb stehen. «rez-de-chaussée» / «pianterreno» / «ground floor» erklärt sie einem Mieter, der kein Deutsch liest. Die Testzeilen 84-86 bilden das richtig ab.
- **Exakt oder Varianten?** Gross-/Kleinschreibung und Leerzeichen sollen keine Rolle spielen (V-2). Ein Präfix mit Wortgrenze soll reichen (V-1). Synonyme gehören nicht dazu (V-2).
- **Teständerungen:** Diese Zeilen ergänzen:
  - de «EG Links», 0 → «Wohnung EG Links, 82.00 m²»
  - de «2. OG Links», 2 → «Wohnung 2. OG Links, 82.00 m²»
  - de «eg», 0 → «Wohnung eg, 82.00 m²»
  - de «1.OG», 1 → «Wohnung 1.OG, 82.00 m²»
  - fr «rez-de-chaussée», 0 → «Appartement rez-de-chaussée, 82.00»
  - de «EG», 1 → «Wohnung EG, 1. OG, 82.00 m²» (Widerspruch bleibt sichtbar)
  - de «EGG», 0 → «Wohnung EGG, EG, 82.00 m²» (Wortgrenze)

  Zeilen 82-86 und 94-99 bleiben. In den fr/it/en-Zeilen das Wort für Wohnung mitprüfen («Appartement EG, rez-de-chaussée, 82.00»), damit die Zeile nicht auf eine andere Stelle des PDFs passt.

Geprüft: «Wohnung 2.01, 2. OG» bleibt (`FLOORS` de, Test 94-99); die Stockwerknamen in `FLOORS` stimmen mit `messages/{fr,it,en}.json:204-206` überein; das PDF wird in der Sprache des Mieters erstellt (`UBIQUITOUS_LANGUAGE.md:268`).

## Fehlende Begriffe

- `docs/design/i18n-begriffe.md` führt nur «Stockwerk» (Zeile 17), aber keine Stockwerknamen. Vorschlag für neue Zeilen:
  - EG | rez-de-chaussée | pianterreno | ground floor
  - n. OG | ne étage (1er étage) | n° piano | 1st/2nd … floor
  - UG | sous-sol | piano interrato | basement

  Dazu muss entschieden werden, ob −1 im deutschen PDF «UG» oder «1. UG» heisst (V-5).

## Nicht bestätigt

- Ob «EG links» o.ä. in der Praxis häufiger von Hand erfasst wird als «OG1»-Formen: Ich habe nur die Demodaten (`backend/demo/demo-data.sql:36-39`: «EG», «OG1», «OG2») und den Import-Vorschlag gesehen. «Wohnung OG1, 1. OG» bleibt nach jeder vorgeschlagenen Regel doppelt. Es wirkt aber nicht wie ein Tippfehler und ist kein Befund.
- Rechtliche Vorgabe zur Objektbezeichnung in der Nebenkostenabrechnung: keine gefunden. Ich habe nur `docs/nebenkostenabrechnung-anforderungen.md:41` geprüft (dort unsicher-C), keine Fedlex-Suche gemacht, weil die Änderung keinen Rechtsinhalt berührt. **unsicher**
- Den Issue-Text habe ich über die REST-API gelesen. Kommentare oder ein Entscheid zu #500 lagen nicht vor.
