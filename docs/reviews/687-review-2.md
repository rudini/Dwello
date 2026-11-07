# Code-Review #687, Runde 2 (Abschlussrunde)

Bereich: `git diff 4fb8092 23348e0 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (23348e0), Worktree `review-687-cr2`. Vorbericht: `docs/reviews/687-review-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1.

Geprüft: Beide Hinweise tragen kein `data-tone`-Literal mehr. `Tones.in` (`tests/e2e/screenplay/questions.ts:128`) sammelt `data-tone` vom Element und allen Nachfahren. `Alert` und `Badge` setzen `data-tone={tone}` (`src/lib/ui/Alert.svelte:33`, `Badge.svelte:19`), deshalb liefert ein eingesetzter `Alert tone="caution"` `["caution"]`, und `toEqual([])` wird rot. Fehlt das Element, antwortet die Question `null`, auch dann schlägt der Schritt fehl. Die Question gibt den Wert selbst zurück (die Liste der Töne). Die Schritte rufen nur Questions auf. Die geänderten Schritte gehören zu den neuen Szenarien dieses PR (`invoice-detail.feature:53`, `invoice-new.feature:37`), eine Spec-Änderung an einem bestehenden Szenario gibt es nicht. Ungenutzte Importe: keine (`Attribute` wird in `invoice-detail.ts:29` weiter gebraucht, in `invoice-form.ts` ist der Import entfernt). Es gibt keine Änderungen ausserhalb der Anforderung. Ponytail-review: ohne Fund.

## Nicht bestätigt

- Vom Aufrufer gemeldet: die E2E-Features invoice-detail, invoice-new und invoices (81), lint, check, die betroffenen vitest-Dateien (666), fitness, fallow und Prettier.
- Vom Aufrufer gemeldet: der Rot-Lauf mit wieder eingesetztem caution-Alert (`Expected [] / Received ["caution"]`). Durch Lesen bestätigt, dass die Schritte dann fehlschlagen. Den Lauf selbst habe ich nicht gesehen.
