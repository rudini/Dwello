# Code-Review 668-s3, Runde 2 (Delta 012dc33..3b1476c, nur «Monatlich total»)

Geschlossen: C-1, C-2

Diese Runde bringt keine neuen Befunde. Die Tabelle bleibt leer.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

## Nicht bestätigt

- Vom Aufrufer gemeldet: Vor dem Fix sah der C-1-DOM-Test 4 Texte, danach 1. Die Tests zu C-2 und P-2 waren rot. Die DOM-Tests liefen mit 152 bzw. 126 bestanden, E2E und axe mit 7 bestanden, lint war sauber.
- Durch Lesen bestätigt, dass die Tests ohne den Fix fehlschlagen:
  - C-1 (`contract-edit.dom.test.ts:974`): Auf dem Basis-Commit steht das sichtbare Total in `role="status"`. Der Test hält deshalb 151, 164, 295 und 1600 fest, also vier Texte statt einem.
  - P-2 (`:998`): Ohne die Prüfung `typo` steht nach 1 s «CHF 1’452.00» in der Region, sie ist also nicht leer.
  - C-2 (`contract-wizard.dom.test.ts:234`): Die Region `contract-monthly-total-announced` gibt es auf der Basis nicht. Der Test bricht dann mit einem TypeError ab.
- Nicht gelaufen: E2E-Schritt `sagt das Formular das Monatlich total … an`. Er verlässt sich darauf, dass `Text.of` beim Vergleich wiederholt prüft (die Ansage kommt erst nach 1 s) und die Leerzeichen um den Inhalt von `<p role="status">` normalisiert. Ich habe nur gelesen, `Text.of` selbst nicht geöffnet.
- Nicht geprüft: das tatsächliche Ansageverhalten mit NVDA oder VoiceOver.

Geprüft:
- Der Timer wird bei jedem neuen Lauf des `$effect` und beim Unmount über die Teardown-Funktion gelöscht. Nach dem Wechsel des Assistentenschritts oder nach `goto` feuert also keine veraltete Ansage.
- `<p role="status">` steht immer im DOM. Beim Laden ist es leer, weil `heard` mit `untrack(() => total)` startet.
- Die Berechnung des Totals ist unverändert (`parseFloat || 0`).
- Mit `typo` (`Number` auf dem bereinigten Betrag) wird ein laufender Timer auch dann gelöscht, wenn sich nur ein Tippfehler ändert und das Total gleich bleibt. Kehrt das Total zum zuletzt angesagten Wert zurück, gibt es keine Ansage.
- Die Texte nutzen `common_monthly_total`, das schon in allen vier Sprachen vorhanden ist.
- Es gibt keinen neuen sichtbaren Bildschirmzustand.
- `LiveRegion` lässt sich nicht wiederverwenden: Wenn sie etwas zeigt, ist sie sichtbar, die Ansage muss aber `sr-only` bleiben.
- Das Target `getByRole('status').and(getByTestId(…))` ist korrekt. Der Schritt prüft jetzt strenger, und das Szenario ist auf diesem Branch neu.
- Ponytail: Lean already. Ship.
