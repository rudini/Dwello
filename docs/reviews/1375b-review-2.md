# Code-Review 1375b, Runde 2 (Delta de779f57..3a35a5a7)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1

## Nicht bestätigt

- Vom Aufrufer gemeldet und nicht selbst ausgeführt: `bun run lint`, `statement-pages.dom.test.ts` (279 grün), der Rot-Lauf des neuen DOM-Tests vor dem Fix und die unveränderte fallow-Wartbarkeit der Seite (82.7).

Geprüft: `src/routes/statements/+page.svelte:147` schickt `paidAmount` jetzt für jeden Wert ausser `undefined` mit. `signedPaid` (src/lib/statement.ts:75-76) gibt `undefined` nur bei `unpaid` zurück. Ein geleertes Feld schickt also `''` und wird wie auf der Basis und auf der Detailseite abgelehnt. Der Kommentar «no amount: all of it» bleibt richtig. Der neue Test erwartet `paidAmount: ''` im Body. Ohne den Fix fehlt der Schlüssel, der Test wäre also rot. Der Fall ohne Geldfluss (#94) bleibt durch den bestehenden Test in Zeile 458 abgedeckt. Das Delta enthält nichts, was nicht zum Befund gehört. Neue Texte, Bildschirme oder Verträge gibt es nicht. Ein Szenario braucht es nicht, weil der Fehler erst in diesem Slice entstanden ist und auf `main` nie sichtbar war.
