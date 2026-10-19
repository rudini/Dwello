# Slice-Review #456, Runde 1: Link vom Gebäude zu seinen Rechnungen

Bereich: `origin/main..HEAD` (8c0ebca2 auf 4ce177ac), ohne `implementation_plan.md`. Worktree: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/review-456-1`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `messages/{de,fr,it,en}.json:351`, `src/routes/buildings/[id]/+page.svelte:38` | ponytail `reuse:` Der neue Schlüssel `buildings_invoices` hat in allen vier Sprachen genau den Wortlaut von `dashboard_invoices` (Zeile 262). Für denselben Link (`/invoices?building=<id>`) nutzt `invoicesOf` in `src/lib/overview.ts:115` bereits `m.dashboard_invoices()`, und andere Seiten nutzen `dashboard_*`-Schlüssel ebenfalls ausserhalb des Dashboards (`dashboard_add_contract` in `apartments/[id]`, `tenants/[id]`, `dashboard_add_invoice` in `invoices`). Ersatz: `m.dashboard_invoices()`, die vier Zeilen in `messages/*.json` streichen. Damit gibt es eine Übersetzung weniger, die synchron gehalten werden muss. net: -4 Zeilen. |
| C-2 | Nit | `tests/e2e/tasks/building-detail.ts:11` | `invoicesButton` steht im Import zwischen `firstApartmentButton` und `fuelStockAmount` und bricht damit die alphabetische Reihenfolge der Liste. |
| C-3 | Nit | `tests/e2e/steps/building-detail.steps.ts:25` | Der Import aus `../questions/invoices` steht nach den Task-Imports, die übrigen Question-Imports stehen oben (Zeilen 3–12). |

Kein Blocker, kein Major.

## Geprüft und bestätigt

- **Done means 1 (ein Schritt zur gefilterten Rechnungsliste):** `href="/invoices?building={building.id}"`. `src/routes/invoices/+page.server.ts:15` setzt daraus `buildingId` für das Backend; das deckt die bestehende Unit-Test-Zeile `src/__tests__/invoices.test.ts:71` ab. Das Szenario prüft den gewählten Gebäudefilter auf der Rechnungsliste über `chosenInvoiceBuilding` (gibt den Text zurück, keine Ja/Nein-Antwort). Das ist dieselbe Strenge wie beim bestehenden Vorbild `contract-detail.steps.ts:274-280`.
- **Done means 2 (Szenario):** «Rechnungen eines Gebäudes öffnen» steht in `building-detail.feature:40-43`, ohne `@wip`. Die Feature-Sprache ist fachlich und nennt keine Bedienelemente. Isolation über `Grundlage` und `names.get`. Red beim Lesen: Ohne die Änderung fehlt `building-invoices-button`, also scheitert `Click.on(invoicesButton)`.
- **Done means 3 (DOM-Test):** `buildings-pages.dom.test.ts:210-215` prüft `href` und Beschriftung. Die `data-testid` ist kebab-case und trägt den Kontext. Red beim Lesen: Ohne den Button liefert `byTestId` `null` und `getAttribute` wirft einen Fehler.
- **Done means 4 (vier Sprachen):** Alle vier Dateien sind gefüllt, fr/it/en ohne Deutsch. Die Wortwahl entspricht dem bestehenden `dashboard_invoices` (dazu C-1).
- **Stop and ask (zweite Primäraktion?):** Nicht ausgelöst. Der Button nutzt die Standardvariante `secondary` (`Button.svelte:11`). Die einzige `primary`-Aktion der Seite bleibt «Wohnung erfassen» (`+page.svelte:58`). Der Header hatte schon vorher zwei Nebenaktionen (Bearbeiten, Löschen als `danger-ghost`).
- **Design-Regeln:** Komponente aus `src/lib/ui` (`Button` mit `min-h-12`, also 48 px) und Icon `invoice`. Keine eigenen Klassen, keine Rohwerte. Der Aktionsbereich im `PageHeader` ist `flex flex-wrap gap-4` (`PageHeader.svelte:49`), drei Buttons brechen also bei 390 px um, statt seitlich zu scrollen.
- **Screenplay:** Der Step ruft nur Task (`openBuildingInvoices`) und Question (`chosenInvoiceBuilding`) auf. Das Target liegt in `targets/`, der Task ist eine fachliche Aktivität. Der nächste Schritt wartet über `chosenIn` auf den Zielzustand (Filterwert auf der neuen Seite). `@api` ist zu Recht nicht gesetzt (Navigation).
- **a11y/Sprachen-Bildschirme:** Kein neuer Bildschirm und kein neuer Zustand, nur ein weiteres Element im bestehenden Zustand `building-detail`/`default` (`tests/a11y/screens.json:157`). Neue Zeilen sind nicht nötig.
- **Sicherheit:** Reiner Link auf eine bestehende, authentifizierte Seite. Die `building.id` stammt aus den Serverdaten. Keine neuen Daten gehen an den Client.
- **Nichts Fremdes im Diff:** alle Änderungen gehören zu #456.

## Nicht bestätigt

- `bun run lint` (0), `bun run check` (0 Fehler): vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/buildings-pages.dom.test.ts` (31 bestanden): vom Aufrufer gemeldet. Mein erneuter Lauf im Review-Worktree brach mit `ERR_MODULE_NOT_FOUND` ab, weil dort kein `node_modules` vorhanden ist.
- E2E Chromium mit den Szenarien von building-detail sowie dessen axe- und Sprachzeilen (17 bestanden): vom Aufrufer gemeldet. Ebenso die Aussage, dass kein seitliches Scrollen bei 390 px mit drei Header-Buttons auftritt. Ich habe das nur am Code bestätigt (`flex-wrap`), nicht im Browser.
- Rot-Läufe von Szenario und DOM-Test: vom Aufrufer gemeldet. Ich habe sie nur beim Lesen geprüft (siehe oben).
- Prettier-Konformität der neuen Zeilen in `tests/e2e/`: Die Zeilen sind länger als `printWidth: 100`, die Nachbarzeilen ebenso. `bunx prettier` lief im Worktree ohne Abhängigkeiten nicht. Lint ist laut Aufrufer grün.
