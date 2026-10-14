# Code-Review #121 (B-2), Slice 1, Runde 1: Abrechnungsliste nach Mietvertrag filtern

Geprüft: `fe34de6..bd2e94f` im Worktree `review-b2-s1` (c539568 `@wip`-Szenarien, bd2e94f Slice 1). Slice 2 (Periodenfilter, «Entwürfe ansehen») ist nicht Gegenstand; sein Szenario in `statement-generate.feature` bleibt `@wip`, sein Then-Step (`statements.steps.ts:155-160`) ist für den Rotnachweis schon da.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `tests/a11y/screens.json:312-323`, `tests/e2e/features/accessibility.feature:96-99`, `tests/e2e/features/sprachen-bildschirme.feature:97-100` | Neuer UI-Zustand (Liste mit Vertragsfilter: Satz `statements-scope` mit Link «Alle Abrechnungen anzeigen») ist in keinem der drei Register; weder axe noch die Prüfung «kein Deutsch / 390 px» besuchen ihn |
| C-2 | Major | `src/routes/statements/+page.server.ts:83` | Reine Umformatierung einer nicht betroffenen Zeile (`tenantName` von drei auf eine Zeile), hat mit dem Vertragsfilter nichts zu tun |
| C-3 | Minor | `src/__tests__/statement-pages.dom.test.ts:85-90` | Der Test heisst «bietet … «Filter zurücksetzen» an», prüft aber nur den Titel «Keine Abrechnungen gefunden»; dass «Filter zurücksetzen» da ist und auf `/statements` führt (also den Vertragsfilter entfernt), prüft er nicht |
| C-4 | Minor | `src/routes/statements/+page.server.ts:10` | Die `contract`-ID aus der URL geht ohne `encodeURIComponent` in den Backend-Pfad; `?contract=../buildings` ruft `GET /api/v1/buildings` ab, und das Destrukturieren wirft dann einen TypeError, sodass die ganze Liste über den `catch` leer angezeigt wird. Kein Datenleck (gleiches Backend, gleiche Session), aber unnötig |
| C-5 | Minor | `docs/api-specification.md:206` | Der neue Query-Parameter `contractId` von `GET /api/v1/statements` fehlt in der API-Spezifikation |
| C-6 | Minor | `src/__tests__/statement-list-load.test.ts:119,137,150` | Die neuen Load-Tests bauen die Antwort von `GET /statements` inline (`{ data: [], total: 0 }`), statt sie aus `tests/contracts/` zu nehmen (Gotcha «API contracts»; `period-statements.json` gibt es). Die älteren Tests der Datei machen es auch so |
| C-7 | Nit | `src/routes/statements/+page.svelte:107` | Der Link hat nicht die Klassen der übrigen Text-Links (`font-semibold … hover:text-accent-strong`, z.B. `RefusedStatements.svelte:15`, `ContractParties.svelte:15`). Weil der Link im Satz steht, gilt die Inline-Ausnahme von 48 px / target-size; das bestätigt aber erst C-1 |
| C-8 | Nit | `src/__tests__/statement-list-load.test.ts:125`, `src/lib/types.ts:322` | Der Cast `StatementsListData & { scope: string \| null }` ist überflüssig (`scope` steht schon im Typ); der Typkommentar nennt den Periodenfilter, den es erst mit Slice 2 gibt |
| C-9 | Nit | `src/routes/statements/+page.server.ts:21-39` | Die Umstellung auf `FILTERS`/`backendQuery` ist länger als die eine Zeile `if (contractId) params.set('contractId', contractId)`. Das ist in Ordnung, wenn ein Komplexitäts-Gate (fallow/deepcheck) sie verlangt hat; das sollte im Plan stehen |

## C-1 (Major): neuer Zustand fehlt in den Registern für Barrierefreiheit und Sprachen

**Warum falsch:** Laut CLAUDE.md (Design-Regeln, Process) kommen neue Bildschirme und Zustände in `tests/a11y/screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`, und zwar einmal für jede Stelle, an der ein Zustand erscheint. Die Liste unter `?contract=<id>` zeigt neuen Text mit einem Link, den es bisher nicht gab: Kontrast und Ziel des Links im Dunkelmodus, Umbruch des langen Satzes auf 390 px (in fr/en ist er deutlich länger) und das Fehlen deutscher Wörter in fr/it/en prüft so niemand. `screens.json` für `statements` hat nur `default`, `empty`, `filtered-empty` und `mark-paid-dialog` (`:312-323`). Keiner dieser Zustände setzt `contract`, also erscheint der Satz in keinem.

**Wie man es zeigt:** `grep -n contract tests/a11y/screens.json` findet beim Bildschirm `statements` keine Query. Keines der Beispiele in den beiden Features rendert `data-testid="statements-scope"`.

**Fix:** Einen Zustand ergänzen, z.B. `contract-scope` mit der Bedeutung in `stateMeanings` und `"queries": { "contract-scope": "?contract={contract}" }` (`{contract}` wird für `/contracts/{contract}` schon geseedet). Dazu die Beispielzeile `statements | contract-scope` in beiden Features.

## C-2 (Major): Änderung ohne Bezug zum Auftrag

**Warum falsch:** Die Checkliste für Reviews verlangt, dass der Diff nichts enthält, was nicht zur Anforderung gehört (Formatierung, Refactoring von nicht berührtem Code). Die Zeile `tenantName: tenant ? … : m.common_unknown()` hat sich inhaltlich nicht geändert; sie wurde nur von Prettier umbrochen. Im Review p9b wurde dieselbe Art von Befund (C-3) zurückgenommen.

**Wie man es zeigt:** `git diff fe34de6..bd2e94f -- src/routes/statements/+page.server.ts`. Der Hunk bei `@@ -54,9 +80,7 @@` ändert nur Zeilenumbrüche.

**Fix:** Die drei Zeilen wie auf `fe34de6` wiederherstellen.

## Bestätigt durch Code und Test

- Backend: `contractId` in der Query (`routes/statements.ts:38,59`) und als Bedingung (`statement.service.ts:98`). Weil dieselben Bedingungen auch für das Zählen gelten, zählt `total` nur die Treffer. `statement-list-contract.pg.test.ts` legt zwei Mietverträge im selben Gebäude an und prüft `data` und `total === 1`.
- Load: `contract` wird als `contractId` übergeben (`statement-list-load.test.ts:114-129`). Der Satz enthält Mieter, Wohnung, Gebäude und Vertragsbeginn aus `tests/contracts/contract.json`. Ist der Mietvertrag nicht ladbar, gibt es keinen Satz, die Liste bleibt aber (`:131-145`). Ohne Filter gibt es keinen Satz (`:147-156`). Die Texte werden nur zur Laufzeit erzeugt, nicht auf Modulebene.
- Seite: Der Satz mit dem Link auf `/statements` erscheint über der Liste (DOM `:71-80`). Status-Links und Suchformular behalten `contract` (DOM `:82-94`). Die Pagination behält ihn über `listPageUrl($page.url)` (generisch, nicht neu getestet). `contract` zählt als aktiver Filter (`+page.svelte:30`, `StatementSearch.svelte:24`).
- Texte: `statements_scope_contract` und `statements_scope_all` stehen in allen vier Sprachen. Die Begriffe entsprechen `i18n-begriffe.md:25-26` (contrat de bail / début du contrat, contratto di locazione / inizio del contratto, rental contract / contract start), die Anrede ist formell. V-2 und V-3 aus dem Fachreview sind umgesetzt.
- Szenario `contract-detail.feature:184-194` ohne `@wip`: Anna Keller und Ben Meier im Ahornhof, je eine Abrechnung 2025. Der positive Anker «sieht … von Anna Keller» steht vor «nicht … von Ben Meier». Die Steps rufen nur Questions und Tasks auf. Die Question gibt den Text des Satzes zurück; Ja/Nein nur für «angezeigt». Der Plan vermerkt «Scenario red» und für jeden neuen Test eine Zeile «Test red» sowie «Skills: tdd, ponytail, ponytail-review».
- Sicherheit: Die Session-JWT geht nur an das Backend (`hooks.server.ts` `handleFetch`, Vergleich des Origins). Zum Client gelangt nur der fertige Satz.
- Neu ausgeführt: `bunx vitest run src/__tests__/statement-list-load.test.ts src/__tests__/statement-pages.dom.test.ts`, 75 bestanden.

## Nicht bestätigt

- Lint, `bun run check`, `deepcheck:audit`, `fallow audit`, `bun run test:coverage` (2299), Backend `bun run test` (552) und `type-check` sowie das E2E-Szenario «Abrechnungen eines Mietvertrags anzeigen» (grün; rot mit herausgenommenem Code): vom Aufrufer gemeldet, von mir nicht wiederholt (Backend und E2E schreiben in Datenbanken oder in den Build).
- Ob das E2E-Szenario vor dem Fix auch am Schritt «nicht die Abrechnung 2025 von Ben Meier» rot gewesen wäre: Laut Plan scheiterte es am fehlenden Satz, der früher kommt. Aus dem Code folgt, dass das Backend ohne den Filter beide Abrechnungen liefert.
- Statuszähler unter Vertragsfilter: `GET /statements/counts` (`+page.server.ts:50`) wird ohne Filter abgefragt. Die Status-Tabs zeigen also die Zahlen aller Abrechnungen, während die Liste nur die des Mietvertrags zeigt. Das gilt schon vor dieser Änderung für die Filter Gebäude und Suche, und die Anforderung von Slice 1 nennt es nicht. Ich habe es nicht als Befund geführt; bei Bedarf als offener Punkt erfassen (auch im Fachreview unter «Nicht bestätigt» genannt).
- Ein ungültiges `contractId` (keine UUID) führt im Backend vermutlich zu einem 500 (`t.String()` ohne Format, Spalte `uuid`), genauso wie bei den bestehenden Filtern `buildingId`, `apartmentId` und `tenantId`. Nicht ausgeführt; die Seite zeigt dann wegen `data || []` den leeren gefilterten Zustand.
