# Code-Review #458, Abschlussrunde (Runde 2)

Gegenstand: `git diff ab6bcc58 b6006970 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive' ':!docs/design/personas'` (8807e6ae, b6006970), dazu der Merge 8f608889. Worktree `review-458-code2`, detached auf 8f608889. Vorbericht: `docs/reviews/458-review-1.md` (c09ec4fd..ab6bcc58). Er wird hier nicht neu bewertet. Diese Runde prüft nur den Code, der seither dazugekommen ist.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde (kein Blocker, kein Major, kein Minor). |

ponytail-review: Lean already. Ship. (`after?` in `src/routes/terms/+page.svelte:25,39,74` ist genauso lang wie eine Bedingung `section.id === 'responsibility'`. Es gibt keinen ungenutzten Code und keine Kopie eines bestehenden Helpers.)

## Abgleich mit der Anforderung

- **Anker auf /privacy (Teil A):** `src/routes/privacy/+page.svelte:165` gibt `id={section.id}` an `Panel` weiter. `Panel` nimmt `id` schon auf dem Basis-Commit an (`src/lib/ui/Panel.svelte:10,16`, mit `scroll-mt-24`). Die IDs `controller`, `stored`, `retention`, `third` stehen in den Abschnitten (`+page.svelte:75,86,98,120`). Test: `privacy-page.dom.test.ts:436-451`. Ohne 8807e6ae liefert `getElementById` `null`, der Test wäre also rot.
- **Links auf /terms:** `src/routes/terms/+page.svelte:17-23,74-85`. Die Linktexte kommen aus `privacy_*_title` und stimmen darum in allen vier Sprachen mit den Namen in `terms_responsibility_3` überein. `href="/privacy#…"` passt zur Paraglide-Strategie `cookie` (`vite.config.ts:32`), ein Sprachpräfix braucht es nicht. Die Klassen sind Tokens (`text-accent`, `hover:text-accent-strong`, `min-h-12`), wie bei bestehenden Links (`src/routes/invoices/MissedWarning.svelte:24`). Die Ziele sind 48 px hoch. Test: `terms-page.dom.test.ts:96-110`.
- **`terms_responsibility_4` (Teil B mit R-14, R-15, R-16, R-19):** Der Text stimmt in de, fr, it und en wörtlich mit `458-fachreview-2.md` überein. In fr steht U+00A0 an « » (geprüft). Tests: DOM `terms-page.dom.test.ts:112-122` und `terms.feature:33`.
- **`terms_responsibility_5` (Teil C):** Der Text stimmt wörtlich mit dem Bericht überein. Der Knopfname passt in allen vier Sprachen zu `tenants_export` (`messages/*.json:626`). Tests: DOM `:124-131` und `terms.feature:34`.
- **`terms_processor` (Teil D):** Der Text stimmt wörtlich mit dem Bericht überein und steht direkt nach `terms_no_contract`. R-21 ist entschieden ohne Änderung, darum fehlt der Zusatzsatz zu Recht. Tests: DOM `:133-140` und `terms.feature:27`.
- **Helga P-1 und Dr. Weber P-2, P-3, P-5:** Abgedeckt durch die Links, `_4` (wie, wann, Sätze weglassen), `_5` und `terms_processor`.
- **E2E:** Das neue Szenario `terms.feature:36-39` hat kein `@wip`. Der Schritt ruft nur die Task `openPrivacySectionFromTerms` auf (`tests/e2e/steps/app-frame.steps.ts:53-58`), die Task nur `Click.on` auf ein Target (`tasks/app-frame.ts:24`), das Target `getByTestId('terms-privacy-section-link')` (`targets/app-frame.ts:37-40`). Die Testid ist kebab-case mit Kontext. Die Frage nach dem Titel wartet (`common.steps.ts:20-23`). Das Feature beschreibt das Ziel und nicht die Bedienung. Ohne b6006970 gibt es den Link nicht, das Szenario wäre also rot.
- **Rote Tests:** Alle neuen DOM-Tests und Schritte prüfen Text, IDs oder Links, die es auf ab6bcc58 nicht gibt. Sie wären ohne die Änderung rot.
- **i18n:** Alle drei neuen Schlüssel stehen in allen vier `messages/*.json`.
- **a11y:** Es gibt keinen neuen Bildschirm und keinen neuen Zustand. /terms und /terms-public stehen schon in `tests/a11y/screens.json:744,782`.
- **Sicherheit:** Es gibt keine neuen Daten zum Client und keine neue Route. Die Links sind statisch.
- **Merge 8f608889:** `git show --remerge-diff 8f608889` zeigt keinen Inhalt.

## Nicht bestätigt

- **Änderung an `UBIQUITOUS_LANGUAGE.md`** (8807e6ae, Zeilen 238-240, Vermerk «geplant, #411» entfernt): `CLAUDE.md` sagt «never edit it». Laut Aufrufer geschah es im Auftrag des PO. Den Auftrag habe ich nicht gesehen, weder im Issue #458 noch in der Fachprüfung. Inhaltlich ist die Änderung richtig, denn die Datenschutzerklärung sagt das jetzt.
- **Landung am Abschnitt im Browser:** Das E2E-Szenario prüft nur den Seitentitel «Datenschutz», nicht den Hash und nicht, ob der Abschnitt unter dem Header sichtbar ist. Belegt ist die Kette nur durch die zwei DOM-Tests (`href` und `id`). Das Scrollen und `scroll-mt-24` habe ich nicht im Browser gesehen (Vorgabe: kein E2E).
- **`bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/terms-page.dom.test.ts`** auf 8f608889: von mir erneut ausgeführt, 59 bestanden.
- `bun run lint` und `bun run check` auf b6006970: vom Aufrufer gemeldet.
- Die Tests zu login, privacy-i18n und open-work auf 8f608889 (laut Aufrufer zusammen mit privacy und terms 80): vom Aufrufer gemeldet.
- E2E auf ab6bcc58 (75 bestanden): vom Aufrufer gemeldet. Der Lauf auf dem gemergten Stand steht laut Aufrufer noch aus. axe hell und dunkel sowie die Sprachzeilen für /terms mit den neuen Links: nicht von mir geprüft.
- R-12 (Datum `legal_as_of` 19.10.2026): Es stimmt, solange am 19.10.2026 gemergt wird. Später muss das Datum nachgeführt werden.
