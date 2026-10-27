# Code-Review #770, Runde 2 (Delta 5082bd2f..537cda82, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine neuen Befunde |

Geschlossen: C-1

C-1 ist geschlossen. Das PDF-Szenario (`statement-detail.feature:1108`) prüft den Schlüssel der Tankbestand-Zeile über den Betrag: «Pro Einheit» bekommt 1'000.00 (Rechnung 500 + Verbrauch 500). Ohne Fix geht der Verbrauch an «Pro Fläche», und die Zeile zeigt nur 500.00. Das passt zum gemeldeten Rotlauf. Das Szenario zur Reihenfolge (`statement-generate.feature:307`) war auf der Basis grün. Nach `CLAUDE.md`, Workflow 2, braucht ein Szenario zu einem Fix keinen eigenen Rotlauf, wenn sein Test auf der tieferen Ebene rot gesehen wurde. Das ist der pg-Test aus 5082bd2f, der die abweichende gespeicherte Reihenfolge mit einem UPDATE erzwingt. Die Commit-Nachricht nennt das. Beide Szenarien laufen ohne `@wip`. Der Hinweis «Rechnungen nach der Abrechnungsperiode» kommt aus `withoutServicePeriod` (`invoice-completeness.service.ts:352`), also aus der Abfrage, die das Issue meint. Der Schritt «kostet danach» ändert den Betrag mit einem UPDATE über das Backend und hält damit die Bedingung aus Runde 1 ein.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `bun run check`, die E2E-Läufe der beiden Feature-Dateien (213 bestanden), der Rotlauf des PDF-Szenarios auf den Service-Dateien von 0ab8f915 und der grüne Lauf des Reihenfolge-Szenarios auf der Basis. Beim Lesen ist das PDF-Szenario ohne Fix rot und das Reihenfolge-Szenario ohne Fix nicht zuverlässig rot. Das stimmt mit den gemeldeten Läufen überein.
- Nicht geprüft: ob `GET distribution-keys?limit=100` das Feld `nameDE` mit dem Wert «Pro Einheit» liefert. Angenommen, weil der gemeldete grüne Lauf davon abhängt.

Geprüft: Steps rufen nur Seed, Tasks und Questions auf. Die Frage `lateInvoicesInOrder` gibt die Beträge bzw. den ganzen Zeilentext zurück, keinen Ja/Nein-Wert. Die Features nennen keine UI-Mechanik. Kein neuer Bildschirm, kein UI-Text, kein Vertrag, kein fremder Diff. ponytail-review findet nichts.
