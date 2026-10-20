# Code-Review #458, Abschlussrunde (Runde 3)

Gegenstand: `git diff 8f608889 e7674389 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive' ':!docs/design/personas'` und der Merge 00fb67e3 (`git show --remerge-diff 00fb67e3`). Worktree `review-458-code3`, detached auf 00fb67e3. Vorbericht: `docs/reviews/458-review-2.md` (bis 8f608889). Er hatte keine offenen IDs.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde (kein Blocker, kein Major, kein Minor). |

ponytail-review: Lean already. Ship. Das Delta besteht aus sechs einzeiligen Datumswechseln. Es gibt keinen neuen Code.

## Status der offenen IDs aus Runde 2

Runde 2 hatte keine Befunde, es ist also nichts offen. Der Hinweis dort zu R-12 («Datum nachführen, falls nach dem 19.10. gemergt wird») ist mit e7674389 erledigt.

## Abgleich mit der Anforderung

- **R-12 («Stand» ist der Tag, ab dem die Texte gelten, Merge am 2026-10-20):** Beide Seiten zeigen jetzt `formatDateLong('2026-10-20', …)`: `src/routes/privacy/+page.svelte:154` und `src/routes/terms/+page.svelte:57`. Die DOM-Tests erwarten «Stand: 20. Oktober 2026» (`src/__tests__/privacy-page.dom.test.ts:458`, `src/__tests__/terms-page.dom.test.ts:154`), ebenso die Szenarien `tests/e2e/features/privacy.feature:110` und `tests/e2e/features/terms.feature:42`, beide ohne `@wip`. Ohne e7674389 rendern die Seiten «19. Oktober 2026», damit wären alle vier Prüfungen rot. Die Kommentare über den Zeilen («The day these texts last changed») stimmen weiterhin. Ein altes Datum steht nirgends mehr in `src/routes`, `src/lib`, `messages` oder `tests/e2e/features` (grep nach `2026-10-1`, «Oktober 2026» und den Formen in fr, it und en).
- **Merge 00fb67e3:** Die remerge-diff zeigt nur `privacy.feature`. Der Konflikt ist richtig gelöst: Die Szenarien «Stand der Datenschutzerklärung» (mit 20.10.) und #479 «Die Adresssuche fragt das Gebäuderegister des Bundes» bleiben beide unverändert erhalten und sind durch eine Leerzeile getrennt. Es bleiben keine Konfliktmarker zurück. `+page.svelte` und die DOM-Tests wurden ohne Konflikt zusammengeführt.
- **Text von #479 auf der gemergten Seite:** `src/routes/privacy/+page.svelte:126` verweist bei `privacy_third_3` auf `swisstopo` mit `https://www.swisstopo.admin.ch/en/legal-framework`. Der Eintrag für OpenPLZ ist weg. «swisstopo» steht in allen vier `messages/*.json`. Die DOM-Tests von #479 (`privacy-page.dom.test.ts:192-198, 387-399`) stehen im gemergten Stand und bestehen.
- **Datum und #479 passen zusammen:** Der Text von #479 kam am 2026-10-19 auf main (f86e1879, Merge 49f24740/0e0804b0). Der «Stand» 20.10.2026 liegt nicht davor und deckt diese Änderung also mit ab. Die Seiten haben kein zweites Datum, das widersprechen könnte.
- **i18n, a11y, Sicherheit:** Es gibt keinen neuen Text und keinen neuen Bildschirm oder Zustand. `legal_as_of` ist unverändert, nur der Parameter ist anders. Datenfluss und Routen bleiben gleich.
- **Kein fremdes Material:** Alle sechs geänderten Zeilen gehören zu R-12.

## Nicht bestätigt

- `bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/terms-page.dom.test.ts` auf 00fb67e3: von mir erneut ausgeführt, 59 bestanden.
- `bun run lint` und `bun run check` auf 00fb67e3: vom Aufrufer gemeldet.
- Die Tests zu login, privacy-i18n und open-work (laut Aufrufer zusammen 80): vom Aufrufer gemeldet.
- E2E (privacy, terms, authentication, demo; die Zeilen für axe und Sprachen von privacy, terms und login): laut Aufrufer läuft der Lauf noch. Vorgabe: kein E2E, darum nicht von mir geprüft.
- R-12 gilt nur, wenn wirklich am 2026-10-20 gemergt wird. Geschieht der Merge später, muss das Datum an den sechs Stellen oben nachgeführt werden.
