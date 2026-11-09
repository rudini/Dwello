# Code-Review #1372, Runde 4 (Abschlussrunde vor dem Push)

Bereich: `git diff 994e9758 54d1a9f9 -- . ':!docs/reviews' ':!docs/design/personas'` (ein Commit, 6 Dateien).
Vorheriger Bericht: `docs/reviews/1372-review-3.md`.

| ID | Schwere | Datei:Zeile | Befund |
| -- | ------- | ----------- | ------ |
| – | – | – | keine neuen Befunde |

Geschlossen: C-1, C-2, C-3

- C-1: `backend_ki_address_invalid` sagt in allen vier Sprachen nicht mehr, das Schema fehle, sondern «kann diese Adresse nicht lesen … Tippfehler». Das passt zu `ki-settings.service.ts:147` (`URL.parse` scheitert oder das Protokoll ist nicht http/https).
- C-2: `backend_ki_address_credentials` nennt jetzt den Teil zwischen «://» und «@». Das gilt für http und für https, in allen vier Sprachen.
- C-3: it `backend_ki_address_credentials` sagt jetzt «Suo account» (i18n-begriffe Zeilen 124/146).

Geprüft: Sinn in de/fr/it/en; «ss»; Sie-Form (de) und Lei-Form (it); in fr.json U+00A0 innerhalb von « » und vor « : » und « ; », wie sonst in der Datei. Unit-Test `src/__tests__/ki-settings.test.ts:120-131` und Beispielzeile `tests/e2e/features/ki-einstellungen.feature:162` stimmen Wort für Wort mit `messages/de.json` überein. Zeile 162 ist der Text einer Beispielzeile aus einem Szenario, das #1372 selbst einführt; dafür ist keine Spec-Freigabe nötig, sofern das Szenario auf `main` noch nicht ohne `@wip` steht. Keine fremden Änderungen.

## Nicht bestätigt

- lint, check, `vitest --changed origin/main` (663), vitest ki-settings + backend-codes (17), E2E `-g "Eine Adresse mit"` chromium (4 bestanden): vom Aufrufer gemeldet.
- Rotlauf der beiden Frontend-Tests mit den neuen Texten: vom Aufrufer gemeldet. Beim Lesen zeigt sich, dass beide Texte geändert sind und die Tests gegen die alten Nachrichten scheitern würden.
- Ausserhalb des Diffs, nur zum Hinweis: `messages/it.json:2328` (`ki_settings_check_wrong_key`) sagt weiterhin «Suo conto». Die Zeile ist laut `git blame` seit 49f4edf9 auf main unverändert und gehört nicht zu diesem Commit.
