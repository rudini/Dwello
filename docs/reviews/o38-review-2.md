# Code-Review O-38, Runde 2 (Re-Review und Schlussrunde vor dem Push)

Geprüft: `git diff 81bc1d71 79268cc1` im Worktree `review-o38-code2` (Commit `79268cc1 fix(tests): clean up every seeded E2E name`). Gelesen habe ich alle vier geänderten Dateien: `tests/e2e/fixtures/backend.ts`, `tests/e2e/tasks/accessibility.ts`, `implementation_plan.md` und `docs/reviews/o38-review-1.md`. Dazu kamen `backend/scripts/e2e-purge-statements.ts`, `tests/e2e/fixtures/screens.ts`, `tests/e2e/targets/statement-generate.ts` und `tests/e2e/tasks/statement-generate.ts` als Umfeld.

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|---|---|---|
| C-1 | Major | **Behoben.** `purgeStatements` (`backend.ts:8-14`) übergibt `DATABASE_URL` immer, nämlich `E2E_DATABASE_URL` oder die Voreinstellung `…/dwello_e2e`. Eine `backend/.env` kann den Wert nicht mehr überdecken, denn Bun überschreibt keine gesetzte Prozessvariable mit `.env`. |
| C-2 | Minor | Nicht übernommen. Die Begründung (das Worker-cwd ist immer die Repo-Wurzel) trägt. Der Befund bleibt Minor und steht in diesem Bericht. |
| C-3 | Nit | Nicht übernommen. Die Begründung (Fallow-CRAP-Grenze) ist nachvollziehbar. Nach dem Delta ist der Fall «keine Token» noch seltener. |
| C-4 | Nit | Der Archiveintrag bleibt. Als Nit akzeptiert, ob `main` grün wird, zeigt erst CI. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Nit | `tests/e2e/fixtures/backend.ts:9`, `playwright.config.ts:9`, `backend/scripts/e2e-purge-statements.ts:9` | Die Voreinstellung `postgresql://dwello:dwello@localhost:5432/dwello_e2e` steht jetzt an drei Stellen. Die im Skript erreicht das Fixture nie mehr. Eine gemeinsame Konstante aus `playwright.config.ts` würde eine Stelle sparen. Ändert sich die Konfiguration, laufen die Werte sonst auseinander, und die Schutzprüfung im Skript fängt das nur zum Teil ab. |

Blocker oder Major gibt es keine.

## Geprüft und in Ordnung

- **Token-Sammlung (`backend.ts:26-35`):** `unique()` hängt jedes Token an `tokens` an. Damit decken die Token alle Namen ab, die über `unique` entstehen: Gebäude, Adresse, Mieter, Kategorie, Heizprofil (auch beim Umbenennen, Zeile 387), Lieferant, Verteilschlüssel und das exportierte `unique` für Namen aus der UI (Zeile 130). «Talblick» wird in `screens.ts:99` und `:133` zweimal angelegt. Bisher blieb davon nur das letzte Token übrig (`names` ist eine Map nach Titel), deshalb blieb das erste Gebäude stehen. Diesen Fehler behebt das Delta. `names.set` steht ausserhalb von `unique` nur noch für die E-Mail-Einträge (Zeilen 248 und 269), ihr Wert ist `<tenantId>@…`. Diese Mieter haben über `tenant()` (Zeile 166) ihr Token als `lastName`, `removeTenants(token)` löscht sie also weiterhin. Dass die E-Mail-Werte im Delta nicht mehr an `removeTenants` und an das Lösch-Skript gehen, verliert deshalb nichts. Vorher trafen sie im Skript (`LIKE` auf den Namen) ohnehin nichts. `names` bleibt für die Textersetzung (Zeilen 134-136) unverändert, und die Ersetzung nimmt wie bisher den letzten Namen.
- **Kosten:** Pro Aufruf von `unique` entsteht jetzt ein Token, auch bei Titeln, die mehrfach vorkommen. Das ergibt ein paar zusätzliche Suchanfragen beim Aufräumen, ohne Einfluss auf die Richtigkeit.
- **`previewOf` (`accessibility.ts:118-120`):** Vor dem Ankreuzen wartet der Schritt auf `buildingInvoiceCount(building)`, genau wie `chooseBuilding` (`tasks/statement-generate.ts:48-53`). `example.building` und `tankBuilding` sind IDs (`screens.ts:163`, `:200`). Das passt zu `generate-building-invoices-{id}`. Laut `statement-wizard.dom.test.ts:1320-1374` erscheint das Element für jedes Gebäude, auch ohne Rechnungen («Keine Rechnungen …») und wenn `/statements/billed` mit 500 antwortet. Deshalb hängt kein Beispiel (auch nicht `preview-empty`, 2000) beim Warten. Die Screenplay-Schichten bleiben eingehalten: Ein Task nutzt ein Target und wartet auf den Zustand, bevor er klickt. Die Änderung gehört zum Ziel «CI grün». Es ist dasselbe Rennen wie in #424 im selben Wizard, also nichts Fremdes.
- **Prettier:** `bunx prettier <file> | diff` zeigt für `backend.ts` und `accessibility.ts` keinen Unterschied.
- **Rot ohne die Änderung:** Es handelt sich um reine Testinfrastruktur, die Commit-Nachricht nennt «No scenario: test infrastructure only». Die Reste vorher und nachher (256 Talblick, danach 0) belegen den Fix. Diese Zahlen sind vom Aufrufer gemeldet.
- **Konventionen:** Die Commit-Zeile hat 46 Zeichen und `fix(tests)`. Es gibt keine UI-Texte, keine API-Verträge und keine Design-Fragen. `docs/reviews/o38-review-1.md` entspricht der Ablage der übrigen Berichte in `docs/reviews/`. Der Plan ist nachgeführt, der Punkt «Re-review round 2, PR» ist noch offen, wie erwartet.
- **Ponytail:** Das Delta ist kurz. `purgeStatements` als eigene Funktion hält `cleanUp` unter der Komplexitätsgrenze. Es bleibt nichts Ungenutztes zurück, ausser C-5.

## Nicht bestätigt

- Lint, `check` und Backend-`type-check` auf `79268cc1`: vom Aufrufer gemeldet.
- Der volle Chromium- und API-Lauf auf `81bc1d71` (1153 bestanden, 1 Fehler O-34, danach 256 Talblick-Gebäude): vom Aufrufer gemeldet.
- Teil-Lauf nach dem Token-Fix (189 bestanden, 1 Fehler durch das Checkbox-Rennen, danach 0 Reste): vom Aufrufer gemeldet.
- Teil-Lauf nach der Wartestelle in `previewOf` (38 bestanden, 0 Reste): vom Aufrufer gemeldet. Ob das Checkbox-Rennen damit ganz verschwindet, lässt sich nur über wiederholte Läufe zeigen. Gesehen habe ich das nicht.
- Kein E2E-Lauf nach dem Umbau von `purgeStatements` (der Aufrufer nennt nur Lint und Prettier danach). Aus dem Code gelesen ist das Verhalten gleich wie vorher, mit gesetzter URL.
- Firefox und WebKit, also ob `main` wieder grün wird: lokal nicht prüfbar, das zeigt erst der nächste `main`-Lauf.
- Selbst habe ich keine Checks erneut ausgeführt, nur `prettier` als Diff ohne Schreiben.
