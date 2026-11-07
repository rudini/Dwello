# Code-Review #687, Runde 1

Bereich: `git diff 8b39f96 4fb8092 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (a5ff25b, 5a307a0, 4fb8092), Worktree `review-687-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/invoices/[id]/+page.svelte:116`, `src/routes/invoices/InvoiceCategoryFields.svelte:134` (geprüft von `tests/e2e/steps/invoice-detail.steps.ts:98`, `tests/e2e/steps/invoice-form.steps.ts:128`) | Bei den zwei Hinweisen ist `data-tone="neutral"` ein fest geschriebenes Literal und kommt nicht aus dem Ton, der gerendert wird (anders als bei `Badge`, wo `data-tone={tone}` steht). Die neuen Schritte «… ein Hinweis ohne Warnung …» prüfen deshalb nur die Markierung. Kommt im Wrapper wieder ein `Alert tone="caution"` dazu, bleiben sie grün. Die Regression fangen nur die DOM-Tests ab (`cautionIn`, `invoice-pages.dom.test.ts:383`, `:865`). Wegen dieser Abdeckung auf der unteren Ebene ist das kein Major. |

Ponytail-review: keine Funde zum Kürzen. Das Diff ist schon schlank.

Geprüft:
- Die vier Stellen sind neutral: Liste und Detail-Badge mit `neutral`, Formularhinweis und Detailbox als Notiz in `text-ink`/`text-ink-muted` (die Detailbox auf `bg-sunken`, `rounded-panel`). Testid, id und Texte bleiben erhalten, `aria-describedby` der Checkbox stimmt weiter.
- Die `Alert`-Importe stimmen: Aus `InvoiceCategoryFields` ist der Import entfernt, in `[id]/+page.svelte` wird `Alert` weiter verwendet (`:147`).
- Es werden nur Token-Klassen verwendet.
- Die Texte in `messages/{de,fr,it,en}.json` stimmen zeichengenau mit der freigegebenen Tabelle in `docs/reviews/687-1-fach-review.md` überein. Das habe ich per Skript für alle 21 Zellen verglichen. Elevator fr/it/en ist dort wie freigegeben unverändert, «Vollservicevertrag» steht in Klammern.
- Spec-Änderung: Von den bestehenden Szenarien ohne `@wip` ist nur die Zeile `invoice-detail.feature:27` geändert. Die übrigen Feature-Änderungen sind drei neue Szenarien. Keine bestehende Step-Definition, Question oder Target ist verändert. Commit 4fb8092 nennt `Spec change approved: #687`.
- Rot ohne die Änderung: Ohne die Änderung schlagen fehl:
  - die DOM-Tests (Klasse `caution` beim alten Ton);
  - der Sprachen-Test in `categories-page.dom.test.ts:722` (alle alten Texte treffen die Regexe);
  - die E2E-Ton-Checks (vorher fehlte `data-tone` bzw. hatte den Wert `caution`).
- Screenplay-Schichten: Die Schritte rufen nur Questions auf, die Targets arbeiten mit testids.
- Weder ein neuer Bildschirm noch ein neuer Zustand kommt hinzu, `screens.json` bleibt unverändert.
- Die Änderung enthält keine Änderungen ausserhalb der Anforderung.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt:
  - vitest (1366 im geänderten Satz);
  - Chromium-E2E (categories, invoice-detail, invoices mit Sprachzeilen: 125, dazu 93 + 48);
  - lint, check, backend type-check, fitness, fallow, Prettier.
- Ob axe den neutralen Detailhinweis (`text-ink-muted` auf `bg-sunken`) in einem Zustand von `tests/a11y/screens.json` tatsächlich rendert: In `screens.json` habe ich die Einträge `invoice-detail`/`invoice-billed-detail` angesehen. Ob deren Rechnung nicht umlagefähig ist und eine eigene Kategorie hat, kann ich ohne Lauf nicht sehen.
- Die Kategorie-Beschreibung «Heating» im Backend (`backend/src/__tests__/migrations.pg.test.ts:127`, `heating-profiles.pg.test.ts:81`) enthält weiterhin «Verzinsung und Abschreibung». Das Issue entscheidet nur über die «category help» (die Begründungen), die Triage nennt nur `messages`-Schlüssel. Ich werte es deshalb nicht als Befund.
