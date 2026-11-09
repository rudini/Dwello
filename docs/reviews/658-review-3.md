# Review #658, Runde 3 (Delta 3c671a3e..1d80f3f8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-7

Geprüft: Das Szenario «Eine Kategorie mit langem Namen ist in der Wahl ganz zu sehen» (`tests/e2e/features/invoices.feature:359-366`) verwendet jetzt den bestehenden Schritt aus `tests/e2e/steps/list.steps.ts:24` (`chooseInListFilter`, Ziel `listFilter("Kategorie")` per Label im Such-Landmark). Der Task wartet, bis die Adresse die Wahl trägt. `filterInvoicesByCategory`, `invoiceCategoryFilter` und die Schrittdefinition sind entfernt; in `tests/` und `src/` gibt es keinen Verweis mehr darauf. Das Szenario fehlt auf `origin/main`, also ist die Änderung frei (keine Spec-Freigabe nötig). Die «Dann»-Prüfung ist unverändert, damit gilt das Urteil zur Rot-Phase aus den Runden 1 und 2 weiter. Der Delta enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Diese Prüfungen nach dem Merge f33e9444 habe ich nicht selbst ausgeführt (vom Aufrufer gemeldet): lint, check, fitness (0 Fehler), Backend-type-check, Prettier auf den hinzugefügten Dateien, vitest der berührten und textlesenden Suiten (1496), E2E chromium contracts/invoices/statements/statement-detail/statement-edit (271 bestanden), das geänderte Szenario auf 1d80f3f8 (2 bestanden).
- Nicht gelesen: der Merge von origin/main und das Session-Archiv nach 1d80f3f8. Sie liegen ausserhalb des Deltas. Laut Aufrufer betrafen die Konflikte nur angehängte Szenarien und eine angehängte Zeile.
