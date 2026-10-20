# Code-Review #461, Runde 2

Gegenstand: Delta `git diff a4a7ebcf e2346626` (eb57b671, Merge 08211800, e2346626), Worktree `scratchpad/review-461-code2` (detached auf e2346626). Vorheriger Bericht: `docs/reviews/461-review-1.md`. Die Texte in `messages/` habe ich nur auf der Code-Seite geprüft: Platzhalter, Schlüssel, Konfliktmarken und die Ordinalzahlen.

## Status der IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | behoben | `distribution-keys.feature:27`: Vor der Sprachwahl steht jetzt «Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"». Der Schritt (`common.steps.ts:20`) wartet über `sees(pageTitle).toMatch` auf den Titel `^Verteilschlüssel - Dwello$`. Der Ausdruck ist verankert, «Neuer Verteilschlüssel - Dwello» passt also nicht. Erst danach wird die Sprache gewechselt. |
| C-2 | behoben | Neue Tests in `distribution-key-admin.pg.test.ts:100-109` und `heating-profile-admin.pg.test.ts:100-109`: POST und PUT mit `null`, die Antwort ist 200 bzw. 201 und enthält `null`. Ohne `t.Nullable` käme 422, die Tests schlagen dann fehl. Ich habe sie selbst laufen lassen: grün. Das Aufräumen in `afterAll` deckt «Hochtal» mit ab. |
| C-3 | Ablehnung trägt, Punkt offen in #501 | `contracts_notice_period_short` ist in allen vier Sprachen unverändert. #501 hält den Entscheid fest (Option A) und sagt: «Implemented in the pull request of #461 (`Fixes #501`)». Bis das umgesetzt ist, hält der Hinweis den PR von #461 auf. Am Rande: Der neue it-Wortlaut im Glossar lautet «che Lei non possa ragionevolmente rifiutare» (`i18n.test.ts:104`), #501 nennt für it «non può». Das prüft der fach-reviewer. |
| C-4 | behoben | `messages/fr.json:1600` `gallery_per_unit` heisst jetzt «Par logement». |
| C-5 | behoben | `docs/PRD-Dwello.md:406-409, 1074` und `tests/ui-screenshots/statement-pdf.ts:30-40` haben jetzt die Namen aus 0027, mit U+00A0 in de/fr. Die fr-Kategorien stimmen mit `0027_master_data_names.sql:12-18` überein. |

## Neue Befunde im Delta

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-6 | Minor | messages/en.json:474, 483 (`backend_formula_unknown_variable`, `backend_formula_not_computable`) | Die native Lesung (eb57b671) hat den Escape für die geschweiften Klammern verdoppelt: `\\\\{area\\\\}` statt `\\{area\\}` wie in de/fr/it und auf a4a7ebcf. Im String steht so `\\{area\\}`. Für das Message-Format ist das ein Backslash und dann ein Platzhalter `{area\\}`, nicht ein wörtliches `{area}`. Die englische Fehlermeldung zu einer ungültigen Formel zeigt also einen Backslash oder einen leeren Platzhalter statt «{area}» bzw. «{persons}». Keinen Test rendert diese zwei Meldungen auf Englisch (grep in `src/__tests__`, `tests/e2e`). Mein Platzhaltervergleich de↔en über alle Schlüssel zeigt nur diese zwei Abweichungen. Zeigen lässt es sich so: `overwriteGetLocale(() => 'en'); m.backend_formula_unknown_variable({ variable: 'persons' })` muss «Unknown variable {persons}.» enthalten. Fix: einfachen Escape wie in den anderen Sprachen. |

Keine Blocker oder Majors neu im Delta.

## Bestätigt im Delta

- **Merge 08211800 (`--remerge-diff`):** Keine Konfliktmarken mehr in den vier `messages/*.json` (per Skript geprüft). Alle vier Dateien haben dieselben Schlüssel. Auflösung pro Schlüssel:
  - #464-Inhalt von main bleibt, mit den #461-Wörtern: `contracts_running_text*`, `contracts_advance_help`, die neuen `contracts_advance_*` aus main, und `statements_advance_paid` «Acomptes»/«Acconti» nach #477.
  - #461-Wörter gegen main: «frais d’administration», «spese amministrative», «répercutables», «ramonage», «statements_fee_not_agreed_*».
  - In fr/it gibt es kein «frais de gestion», «spese di gestione», «imputable», «ramoneur», «versés» oder «versati» mehr, weder in `messages/` noch in `backend/src` ausserhalb der Tests (grep).
  - `migrations.pg.test.ts` hat beide Tests: #464 vor `0026_contract_advance_payments.sql` und den Namensblock mit `0027_master_data_names.sql`.
  - In `statement-pdf-render.test.ts` stehen beide `describe` vollständig. `data-model.md:467` und `i18n.test.ts:83` nennen jetzt 0027.
- **Migration 0026 → 0027:** Der Inhalt ist gleich (similarity 100 %). Ausser in älteren Berichten (`docs/reviews/461-native-*.md`) verweist nichts mehr auf `0026_master_data_names.sql`. Der Testlauf hat 27 Migrationen angewendet.
- **EN-32 Ordinalzahlen:**
  - `src/lib/apartment.ts:11-24`: `Intl.PluralRules('en', { type: 'ordinal' })` mit one/two/few/other, nur bei `getLocale() === 'en'`. Die Meldungen sind `apartments_floor_first` «1st floor» und `apartments_floor_upper` «{floor} floor». Der Platzhalter ist in allen vier Sprachen gleich.
  - Test `buildings-i18n.test.ts:28-37` mit 1, 2, 3, 4, 11 und 22. Er schlägt auf a4a7ebcf fehl, weil dort «floor 2» steht.
  - `pdf.service.ts:535-543` macht dasselbe für das englische PDF. Test `statement-pdf-render.test.ts:78-91`, ebenfalls rot auf der Basis («floor 1»), selbst laufen lassen: grün.
  - de/fr/it sind unverändert. Weder in `src` noch in `tests` noch in `backend/src` steht noch «floor N» (grep).
- **Pin-Anpassungen** in `categories.test.ts`, `i18n.test.ts`, `invoice-pages.dom.test.ts` und `privacy-i18n.dom.test.ts`: Sie folgen nur dem neuen Wortlaut, das Verhalten bleibt gleich.
- **e2346626:** `@wip` ist bei beiden Szenarien entfernt (`apartments.feature:58`, `distribution-keys.feature:23`).

## Nicht bestätigt

- Ob die verdoppelten Backslashes in C-6 genau als Backslash oder als leerer Platzhalter erscheinen: Den Parser von `@inlang/plugin-message-format` konnte ich nicht lesen, weil der Zugriff auf `/home/user/Dwello/node_modules` gesperrt ist. Aus demselben Grund konnte ich `bunx vitest run` im Worktree nicht laufen lassen. Dass der Text falsch ist, folgt schon daraus, dass er von der Escape-Form in de/fr/it und auf der Basis abweicht.
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, backend `type-check`, `bunx vitest run src/__tests__` (2729/2729), backend `api-contracts.pg` und `demo-data.pg`, sowie der grüne E2E-Lauf beider Szenarien (chromium). Selbst laufen lassen, alle grün (110 Tests): `distribution-key-admin.pg`, `heating-profile-admin.pg`, `statement-pdf-render`, `migrations.pg` (Datenbank `dwello_test_w10_review`).
- Die Läufe der übrigen betroffenen Features stehen aus: Sie liefen beim Aufrufer noch.
- Die Umsetzung von #501 (Option A) ist noch nicht im Diff.
- Der Wortlaut der Texte aus den Lesungen `461-native-*.md` ist nicht geprüft (Auftrag: fach-reviewer).
