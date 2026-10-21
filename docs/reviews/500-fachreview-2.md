# Fachreview #500, Runde 2: Stockwerk im PDF nur einmal

Gegenstand: `git diff 677a584 e214aa7 -- backend/src` (Worktree `review-500-fach`, detached bei e214aa7): neue Testzeilen in `backend/src/__tests__/statement-pdf-render.test.ts:84-96` und `namedByFloor` in `backend/src/services/pdf.service.ts:660-663, 717-720`. Vorbericht: `docs/reviews/500-fachreview-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Rolle | Schwere | Status |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | **Erledigt.** Das Stockwerk entfällt jetzt auch bei einem Präfix mit Wortgrenze: `^<Stockwerk>(?=$\|[\s,-])` (`pdf.service.ts:662-663`). Test-Zeilen «EG Links»/0 und «2. OG Links»/2 (`statement-pdf-render.test.ts:85-86`). Nachgerechnet: «EG Links», «EG, links» und «EG-1» lassen das Stockwerk weg, «EGG», «EG.1» und «EG/1» drucken es. |
| V-2 | Verwalter | Minor | **Erledigt.** Gross-/Kleinschreibung zählt nicht (Flag `i`), Leerzeichen im Stockwerknamen werden zu `\s*`, die Nummer wird mit `trim()` verglichen. «eg» → weg, «1.OG» bei 1 → weg, « EG » → weg. Synonyme bleiben wie vorgeschlagen draussen: «1 OG» und «OG1» drucken das Stockwerk weiterhin. |
| V-3 | Verwalter | Minor | **Erledigt.** fr-Zeile «rez-de-chaussée»/0 → «Appartement rez-de-chaussée, 82.00» (`:89`). Nachgerechnet: auch «REZ-DE-CHAUSSÉE» trifft. Der Bindestrich im Stockwerknamen wird richtig maskiert. |
| V-4 | Verwalter | Minor | **Erledigt.** «EG»/1 → «Wohnung EG, 1. OG, 82.00 m²» (`:91`) und «EGG»/0 → «Wohnung EGG, EG, 82.00 m²» (`:92`). Nachgerechnet: «11. OG»/1 und «1. OG»/11 drucken das Stockwerk ebenfalls, ein Widerspruch bleibt also sichtbar. Die fr/it/en-Zeilen prüfen jetzt das Wort für Wohnung mit (`:94-96`). Es stimmt mit `t.apartment` überein (`pdf.service.ts:38, 157, 275, 393`). |
| V-5 | Verwalter | Minor | Nicht Gegenstand dieser Runde, offen in #597 (fachlich, entscheiden). Der Stand ist unverändert: «UG»/−1 druckt «Wohnung UG, 1. UG», «1. UG»/−1 druckt «Wohnung 1. UG». |

## Neue Befunde im Delta

Keine.

## Wirkung auf den Mieter über die Wohnungszeile hinaus

Keine. `namedByFloor` und `formatFloor` werden nur in `addresses()` aufgerufen (`pdf.service.ts:717-718`, grep über `backend/src/services`). Die anderen Teile der Zeile bleiben unverändert: Gebäude, Adresse, Ort, Fläche mit `t.sqm`, Empfängeradresse. QR-Rechnung, Dateiname und Mieter-Export (`tenant-export.service.ts:51-52, 74`) verwenden das Stockwerk nicht über diese Funktion. Mietrecht ist nicht berührt: Das Mietobjekt bleibt eindeutig bezeichnet (`docs/nebenkostenabrechnung-anforderungen.md:41`: «Wohnung (Bezeichnung, Stockwerk)»), denn das Stockwerk entfällt nur, wenn es in der Bezeichnung schon steht.

Geprüft: Regex-Maskierung (`.`, `-`, `°` und `é` in de/fr/it/en) mit 24 Musterwerten nachgerechnet, darunter Grenzfälle (Präfix, Widerspruch, zweistellige Stockwerke, Untergeschoss, en «Ground floor left», fr «1er étage gauche», it «1° piano»).

## Nicht bestätigt

- Die Testdatei habe ich nicht im Worktree laufen lassen: Der Zugriff auf `node_modules` (Symlink ins Hauptrepo) ist gesperrt. Stattdessen habe ich `namedByFloor` wörtlich in ein eigenes Skript im Scratchpad kopiert und dort mit Bun gerechnet. Die erwarteten Texte der Testzeilen folgen aus diesen Ergebnissen und `formatFloor`. Das echte PDF auf http://localhost:3300 habe ich nicht angesehen, weil das Login über den BFF nötig wäre.
- Eine in NFD eingegebene Nummer («rez-de-chaussée» mit kombinierendem Akzent) druckt das Stockwerk weiterhin doppelt. Browser senden normalerweise NFC. Ob solche Nummern in der Datenbank vorkommen, habe ich nicht geprüft. Folgen hätte das nur für die Optik, deshalb kein Befund.
