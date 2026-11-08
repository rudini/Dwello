# Code-Review 690, Runde 6 (Abschluss, a17714b)

Bereich: `git diff a17714b^ a17714b -- . ':!docs'` (8 Dateien, alle gelesen).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Link `#account-holder` nur bei `ACCOUNT_HOLDER_MISSING`, sonst `#sender` (DOM-Test für beide Fälle, statement-pages.dom.test.ts:1873 und :1884); das Fieldset mit `id="account-holder"` wird bei diesem Code immer gezeigt, weil der Code nur bei teilweise gespeichertem Kontoinhaber entsteht (qr-bill.service.ts:341, `noHolderStored`); `focusFirstError(form, first)` fokussiert das erste der `missing`-Felder in Seitenreihenfolge. Die Namen stammen aus der `FIELDS`-Abbildung (settings.ts:78–83), es gibt also keine Selektor-Injektion. Die übrigen Aufrufer bleiben dank des Standardwerts `[]` unverändert. Rot ohne die Änderung: Link-Test (href war `#sender`), Fokus-Test (Fokus lag auf dem `aria-invalid`-Feld `accountHolderName`), Sprungziel-Test (id fehlte), E2E-Schritt (Fokus auf `setting-accountHolderName`). Das Szenario ist nicht auf `main`, eine Ergänzung ist also frei. Die Schritte rufen nur Tasks und Questions auf; die Question `FocusedElement` gibt die testid zurück, das ist der Wert selbst. Es gibt keinen neuen Text, keinen neuen Bildschirm und keinen neuen UI-Zustand (nur ein Sprungziel), keine Vertragsänderung und keinen fremden Diff.

## Nicht bestätigt

- vom Aufrufer gemeldet: lint, check, type-check, vitest (4402), fitness, fallow, Prettier, E2E `settings` und `statement-detail` (166). Nicht selbst ausgeführt.
- Ob der Browser nach der Navigation zu `#account-holder` scrollt, bevor der Fokus gesetzt wird: nicht geprüft, für den Befund ohne Belang, weil der Fokus das Feld ohnehin in den sichtbaren Bereich bringt (`+page.svelte:47–50`, `focus-error.ts`).
