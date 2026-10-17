# Code-Review W2e3 (#358 / #120), Schlussreview, Runde 2

Bereich: `git diff c543f94 c9f620c` (ein Commit c9f620c), gelesen im Worktree `review-w2e4-code`. Alle 16 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | `tests/e2e/features/statement-detail.feature:599,640-650`, `implementation_plan.md:19` | Neue Schritte: «gilt nicht mehr», keine Zahlungsfrist, kein Hinweis auf später erfasste Rechnungen (mit Rechnung im Given), Erfolgsmeldung und ein Szenario zum Mietvertrag. Das Dashboard hat `No scenario:` mit Grund und Verweis auf den pg-Test. Jeder neue Schritt wird ohne die Änderung rot (siehe unten) |
| C-2 | erledigt | `src/__tests__/statement-pages.dom.test.ts:549-560` | Ein DOM-Test prüft Meldung und Fokus auf `h1`. Ohne `success=` wird er rot |
| C-12 | Minor | `src/routes/statements/[id]/Correction.svelte:31` | `statements_correct_paid_chain` steht bei jedem `priorPayments ≠ 0`, auch wenn es negativ ist (eine zurückerstattete Abrechnung in der Kette). Der Satz sagt dann «… die auf diese und die ersetzten Abrechnungen bezahlt wurden», obwohl der Verwalter Geld zurückerstattet hat. Ist `offset < 0`, nennt er einen Betrag ohne Richtung. Kein Test für diesen Fall |
| C-13 | Nit | `src/routes/statements/[id]/PaymentPanel.svelte:25-49` | ponytail `shrink:` Den ursprünglichen `<div>` der Frist in `{#if !replaced}` einzuschliessen wäre kürzer gewesen als `deadline` in `rows` zu verschieben und `'testid' in row ? row.testid : undefined` einzuführen (rund 2 statt 15 Zeilen) |
| C-14 | Nit | `tests/e2e/questions/statement-detail.ts:91`, `tests/e2e/steps/statement-detail.steps.ts:423` | ponytail `reuse:` `replacedDone = Text.of(successToast)` wiederholt `confirmation` aus `questions/contract-form.ts:29`. Der allgemeine Schritt «bestätigt Dwello {string}» steht in der Schrittdatei eines Bereichs |
| C-15 | Nit | `src/__tests__/statement-pages.dom.test.ts:634` | Zu C-7 (`busy`): Der Test prüft nur `disabled`. Geht der Code auf `disabled={creating}` zurück, bleibt er grün. «Bitte warten» und `aria-busy` prüft kein Test |

Nicht behoben und laut Aufrufer bewusst offen: C-4, C-5, C-8, C-10 (alle Minor/Nit aus Runde 1). Sie gehören nicht in diese Runde.

## Bestätigt (Code und Test gelesen)

- **C-1, Zusammenfassung:** «Und sagt die Abrechnung "Diese Abrechnung ist ersetzt und gilt nicht mehr."» fragt den Text von `statement-payment-summary` ab. Mit dem Text vor dem Commit wird der Schritt rot.
- **C-1, Hinweis auf Rechnungen:** Im Given steht jetzt eine Rechnung, die nach der Abrechnung erfasst wird, wie im Szenario «Abrechnung weist auf eine danach erfasste Rechnung hin» (`:568-573`). Ohne die Bedingung `replaced` in `+page.svelte:66` erscheint der Hinweis, und «weist … auf keine geänderten Rechnungen hin» wird rot. Der Negativcheck folgt nach dem Status «Ersetzt», die Seite ist also geladen.
- **C-1, Mietvertrag:** Das neue Szenario verwendet den bestehenden Schritt `contracts.steps.ts:136`. Die Task ist ein Klick auf den Link und wartet nicht. Die Navigation prüft der folgende Then-Schritt. Das Szenario ist UI-only (nicht `@api`), das ist für Navigation richtig.
- **C-1, Erfolgsmeldung:** «Dann bestätigt Dwello "Die Abrechnung ist ersetzt."» fragt den Text des Toasts ab (`targets/form.ts:8`), also den Wert selbst.
- **C-1, Dashboard:** `No scenario:` steht in `implementation_plan.md:19`. Der Grund (die Summe läuft über die ganze Datenbank, parallele Szenarien ändern sie) hält. Ob der Satz auch in die PR-Beschreibung kommt, ist hier nicht prüfbar.
- **C-3:** Der neue Text steht in allen vier `messages/*.json`. Der DOM-Test prüft den ganzen Satz und wird mit dem alten Satz («die am … bezahlt wurden») rot. Zu Rückerstattungen in der Kette siehe C-12.
- **C-6:** Bei `replaced` ist `date` undefined, die Zeile fällt also aus dem Filter. Der DOM-Test (`:613`) wird ohne die Änderung rot. Der Gegenfall (Frist erscheint) wird weiter geprüft (`:929`), und das E2E «nennt die Abrechnung keine Zahlungsfrist» ebenso (Count 0). Das Label der Frist (Rückerstattung oder nicht) ist unverändert.
- **C-7:** `busy={creating}`. `Button.svelte:94-95` sperrt den Knopf und setzt `aria-busy`. Siehe C-15.
- **C-9:** Der verschachtelte Ternary ist jetzt nach Prettier eingerückt.
- **C-11:** Die drei Links haben `inline-flex min-h-12 items-center`, nur Token-Klassen.
- **Seed `screens.ts`:** Carlas Vertrag läuft ab 2015 (`:50`), eine Abrechnung 2022 ist also gültig. Die überlappende Abrechnung zählt in `statement-generation.ts:48-62` als abgerechnet. Das ist die bestehende Regel mit Marker #199, kein Fehler, den der Seed versteckt. `replacedStatement` wird nur über `screens.json:484` verwendet.
- **Texte, Bildschirme:** Kein neuer Bildschirm und kein neuer Zustand. Der neue Text ist eine Variante im Dialog `correct-dialog`, der schon in `screens.json` steht.
- **Nicht zugehörige Änderungen:** keine. `docs/reviews/workflow-notes-issue-358.md` ist eine Workflow-Notiz nach Schritt 8, `docs/reviews/w2e3-review-1.md` ist der Bericht aus Runde 1.
- **Screenplay-Schichten:** Die Steps rufen nur Tasks und Questions auf. Die Targets haben Testids in kebab-case mit Kontext.

## Nicht bestätigt

- Neu ausgeführt: `bunx vitest run src/__tests__/statement-pages.dom.test.ts`, 116 grün.
- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bun run check`, `bun run lint`, die E2E-Szenarien und Bildschirmzeilen zur Berichtigung in chromium und api, der Rot-Nachweis des Navigationsszenarios und des DOM-Tests zur Erfolgsmeldung, der volle E2E-Lauf auf c543f94 (948 grün, 8 rot, davon `statement-generate invoice-hints` durch den Seed, 5 grün im zweiten Lauf). Wegen der Seed-Änderung nicht bestätigt: die übrigen a11y- und i18n-Zeilen, die Carla-Daten zeigen (Abrechnungsliste, Dashboard).
- Ob der Toast «Die Abrechnung ist ersetzt.» lange genug sichtbar ist, damit der Schritt nicht wackelt: nur gelesen, nicht ausgeführt.
- `No scenario:` für das Dashboard in der PR-Beschreibung: Die PR gibt es noch nicht.
