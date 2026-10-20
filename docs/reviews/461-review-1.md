# Code-Review #461, Runde 1

Gegenstand: `git diff c09ec4fd a4a7ebcf` (84c3d81c, a4a7ebcf), Worktree `scratchpad/review-461-code` (detached auf a4a7ebcf). Anforderung: «Done means» und «Decided» von #461 (Entscheide in #405, Namen aus #345) und die zwei @wip-Szenarien.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/tasks/distribution-keys.ts:796-797, tests/e2e/features/distribution-keys.feature:26-27 | `createDistributionKeyInFrench` endet mit dem Klick auf «Speichern» und wartet nicht auf die Weiterleitung zur Liste. Der nächste Schritt klickt gleich die Sprachwahl an und lädt die Seite neu. Das sind zwei Klicks hintereinander auf einen asynchronen Schritt, das Szenario wird wackelig. |
| C-2 | Minor | backend/src/routes/distribution-keys.ts:139-141, 184-186; backend/src/routes/heating-profiles.ts:109-111, 176-178 | `t.Nullable` für `nameFR/IT/EN` ist nötig, weil das BFF jetzt `null` schickt (vorher 422). Kein `*.pg.test.ts` zeigt, dass POST/PUT mit `null` angenommen wird und NULL speichert. Die BFF-Tests ersetzen das Backend, nur E2E sieht es. |
| C-3 | Minor | messages/{de,fr,it,en}.json `contracts_notice_period_short` | Der Text sagt weiter «Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag» (it eben neu «un inquilino sostitutivo riprende …»). `glossary_notice_period_text` sagt nach M-1 jetzt «wenn er Ihnen einen zumutbaren Ersatzmieter vorschlägt» (Art. 264 Abs. 1 OR). Der Fehler war schon auf der Basis da, steht jetzt aber im Widerspruch zum Glossar. |
| C-4 | Minor | messages/fr.json:1575 `gallery_per_unit` | Die Galerie zeigt den Schlüssel «Pro Einheit» auf Französisch noch mit dem alten Seed-Namen «Par unité». Die Migration 0026 macht daraus «Par logement». |
| C-5 | Minor | docs/PRD-Dwello.md:409, 1074; tests/ui-screenshots/statement-pdf.ts:30-39 | Hier stehen noch die alten Namen: «Heizung (Fläche 70% / Einheit 30%)» ohne geschütztes Leerzeichen, «(Heating Split)», fr «Par unité» und «Chauffage (surface 70% / unité 30%)». Nach 0026 stimmt das nicht mehr. `docs/data-model.md` ist nachgeführt, diese zwei Stellen nicht. |

## Blocker/Major im Einzelnen

### C-1: Neuer Verteilschlüssel, dann sofort die Sprachwahl

- **Warum falsch:** `createDistributionKey` klickt `submitButton`. `SaveForm.svelte` schickt das Formular über `use:enhance` per fetch, und die Weiterleitung nach `/config/distribution-keys` kommt erst nach der Antwort. `chooseLanguage` (`tests/e2e/tasks/language.ts:6-7`) klickt sofort den Sprachknopf in der Kopfzeile. Danach lädt `Click.toReload` die *aktuelle* Seite neu. Ist die Weiterleitung noch nicht durch, wird `/config/distribution-keys/new` auf Französisch neu geladen. Der Request ist dann abgebrochen oder nur auf dem Server fertig. `listedKeysNamed` zählt danach auf dem leeren Formular 0 Zeilen statt 1. Laut `tests/e2e/CLAUDE.md` und den Review-Regeln wartet eine Task auf den Zustand, zu dem sie führt. Das bestehende Szenario «Verteilschlüssel erfassen» deckt das mit dem Folgeschritt «Dann ist … auf der Seite "Verteilschlüssel"» ab. Das neue Szenario hat keinen solchen Schritt.
- **Wie man es fehlschlagen sieht:** Den Backend-Request um 1 bis 2 s verzögern (Playwright `page.route` auf den POST oder ein langsamer Rechner unter Last, wie bei den Persona- und E2E-Läufen parallel). Dann steht das Szenario auf `/config/distribution-keys/new`, und der Dann-Schritt meldet 0 statt 1.
- **Fix:** In `createDistributionKeyInFrench` (oder im Szenario mit «Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"» vor der Sprachwahl) auf die Liste warten, bevor die Sprache gewechselt wird.

## Bestätigt (Anforderung gegen Code und Test)

- **1a, 1b, 1c, 1d, 1e, 2b, Ersatzmieter it:** die Wörter in fr/it (89 fr-, 40 it-Schlüssel geändert, keine Platzhalter geändert, keine Schlüssel entfernt, per Skript gegen c09ec4fd verglichen). Dazu `pdf.service.ts` (managementFee fr/it). Tests: `i18n.test.ts` (Ausschlussmuster je Wort, `inquilino sostitutivo`, M-1) und `statement-pdf-render.test.ts` (PDF fr/it). `reminder-letter.ts` und `statement-pdf.service.ts` enthalten keines der alten Wörter (grep), dort war nichts zu ändern.
- **i18n-begriffe.md:** 0 ❓, und die gewählten Wörter stehen drin, auch die Nebenkostenpauschale (Entscheid vom 2026-10-19).
- **3a:** Migration 0026 übernimmt alle Vorschläge aus #345 (fr, it mit IT-M3 «Assicurazione dell’immobile», en). Jedes UPDATE greift nur, wenn noch der Seed-Wert steht. `name` und `name_de` der Kategorien bleiben (V-9). `PREDEFINED_DISTRIBUTION_KEYS`, `initializePredefinedKeys` und `POST /initialize` sind entfernt (V-1), ebenso die Zeile in `api-specification.md`. Kein Aufrufer bleibt übrig (grep `src`, `backend`, `tests`). Tests: `migrations.pg.test.ts` (genaue Liste der geänderten Zeilen, die vom Vermieter geänderte Zeile bleibt) und `distribution-key-admin.pg.test.ts` (404). Ich habe sie selbst laufen lassen: grün.
- **3b:** `NameTranslations.svelte` steht jetzt in allen drei Formularen. `nameTranslations()` in `save-form.ts` macht aus einem leeren Feld `null`, und die Mapper `toDistributionKey`/`toHeatingProfile` liefern die Namen ans Bearbeiten-Formular. Tests: BFF (`distribution-keys.test.ts`, `heating-profiles.test.ts`), DOM (beide `*-pages.dom.test.ts`, auch V-8) und das E2E-Szenario. Die Hilfetexte stehen in allen vier Sprachen mit dem Wortlaut aus 461-fachreview-1 (V-5).
- **4:** `withoutApartmentWord` in `word-search.ts`, Unit-Test `word-search.test.ts` (selbst laufen lassen: grün), Szenario «appartement 2.01» im Gebäude Ahornhof (Grundlage: 2.01 leer).
- **Fach-Review:** V-2 (en «Lift»), V-4, V-10 (U+00A0 in de/fr/it), V-11, V-14 und M-1 (glossary) sind umgesetzt. V-6 und V-12 sind wie vom Aufrufer begründet zurückgestellt. `405-fachreview-1.md` ist beigefügt.
- **Rot ohne Änderung (gelesen):** Jeder neue Test schlägt auf c09ec4fd fehl: neue Datei oder Funktion, alte Wörter in den JSON-Dateien, Route antwortete 200, Eingabefelder fehlten, Request-Body ohne Namen. Die zwei Szenarien schlagen auf c09ec4fd beim fehlenden Verhalten fehl: Suche ohne Treffer, fehlendes Eingabefeld für fr.
- **Konventionen:** `data-testid` in kebab-case mit Kontext (`distribution-key-name-fr-input`). Keine neuen Bildschirme oder Zustände (nur Felder auf bestehenden Formularseiten), also keine Einträge in `screens.json` nötig. Tokens: nur `text-ink`, `text-ink-muted`, `gap-*` und `md:grid-cols-3` wie bisher in `CategoryForm`. Die Steps rufen nur Tasks und Questions auf. Die Features beschreiben, was der Verwalter will, nicht wie.
- **Ponytail:** keine unbenutzten Reste. Die Kopie der Felder aus `CategoryForm` ist in die gemeinsame Komponente gewandert, statt verdoppelt zu werden. Der Rest ist knapp genug.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle) und backend `bun run test`: vom Aufrufer gemeldet. `bunx vitest run` konnte ich im Worktree nicht wiederholen: Der Zugriff auf `node_modules` (Link ins Haupt-Repo) ist gesperrt. Backend-Tests habe ich wiederholt, alle grün: `word-search.test.ts`, `migrations.pg.test.ts`, `distribution-key-admin.pg.test.ts`, `statement-pdf-render.test.ts`, `statement-pdf.pg.test.ts` (Datenbank `dwello_test_w10_review`).
- E2E: Der grüne Lauf der zwei Szenarien und von `sprachen-bildschirme.feature` steht aus (vom Aufrufer gemeldet). Die Szenarien sind noch `@wip`, und «Done means» verlangt sie ohne `@wip`.
- #461 «Decided» Punkt 5 (je eine KI-Lesung fr/it/en von `messages/{fr,it,en}.json` mit Berichten in `docs/reviews/`) ist nicht in diesem Diff. Gesucht habe ich in `docs/reviews/`: nur `w4d-native-*` von früher. Gehört diese Lesung nicht in einen späteren Slice, ist #461 ohne sie nicht fertig.
- `implementation_plan.md` enthält keine Session für #461 (grep «461»). Das betrifft den Ablauf beim Aufrufer, nicht diesen Diff.
