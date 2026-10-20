# Review PR #494, Abschlussrunde 3 (f41158f8)

Bereiche: `git diff dfffc702 a72fab67` (Fix), `git show --remerge-diff f41158f8` (Merge von origin/main).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/tasks/statement-generate.ts:153 | `openContractWithNotAgreedCosts` hat dieselbe Lücke wie der behobene Task: Klick auf einen Link nach `/contracts/{id}` (`AgreedCosts.svelte:103`), keine Wartezeit, und der nächste Schritt ist derselbe `ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von …` (`statement-agreed-costs.feature:78-79`). Der Fix ist derselbe Einzeiler (`Wait.forUrl((url) => url.pathname === \`/contracts/${contractId}\`)`). Im selben Wizard gehört er dazu; sonst kann das Szenario in Firefox auf CI genauso flackern. |

Keine Blocker oder Major.

## Prüfung des Fixes

- `openContractWithoutFee` (statement-generate.ts:133-137) klickt jetzt auf den Link und wartet mit `Wait.forUrl` auf `/contracts/{contractId}`. `Wait.forUrl` ist `page.waitForURL(matches)` (screenplay/interactions.ts:111) und läuft ohne eigenes Timeout, also bis zum Test-Timeout (30 s, playwright.config.ts:64). Ein Timeout wird nicht erhöht, so wie verlangt. SvelteKit übernimmt die Adresse bei einer clientseitigen Navigation erst, wenn `load` fertig ist. Danach braucht der Titel-Check (`pageTitle`, contracts.steps.ts:137-140) nur noch die eigenen 5 s für das Rendern.
- Das Prädikat vergleicht den ganzen Pfad (`===`), nicht nur das Ende. Die Seite des Wizards (`/statements/generate`) passt also nie fälschlich. Der Rückgabetyp `Activity` stimmt mit den Nachbar-Tasks überein (`recordInvoiceFromWarning`, Zeile 148).
- Screenplay-Schichten: Der Step (statement-generate.steps.ts:467) ruft nur den Task auf, und der Task nutzt nur Interaktionen. Feature und Strenge bleiben gleich. Am Feature ändert sich nichts.
- Rot ohne Fix: Mit einer Lesung allein lässt sich das nicht zeigen, weil es um ein Timing-Flackern geht. Die Commit-Nachricht nennt das Experiment (Daten 6 s verspätet: rot vor dem Fix, grün danach). Plausibel: Ohne Wartezeit muss der Titel-Check innerhalb von 5 s die ganze Navigation abdecken.
- Der Kommentar (Zeile 132) stimmt. Die Commit-Nachricht hält die Konvention ein (`fix(tests)`, ≤ 50 Zeichen, `Refs #455`).
- Keine Änderung ausserhalb der Anforderung. Keine UI-Texte, kein a11y-Bildschirm und kein Vertrag sind betroffen. Kein neues Szenario nötig, denn es ist ein Fix nur im Test ohne Verhaltensänderung der App.

## Merge f41158f8

`git show --remerge-diff f41158f8` liefert nur den Kopf (6 Zeilen), es gab also keine Konfliktauflösung. Der Merge bringt 240 Dateien aus main, die dort schon geprüft wurden. Das Ergebnis des automatischen Merges entspricht den beiden Eltern. Keine Befunde.

## Andere Tasks, die ohne Wartezeit auf einen navigierenden Link klicken (keine Befunde für diesen PR, ausser C-1)

Gleiches Muster `Click.on(link)` ohne `Wait.forUrl`. Ob der Folgeschritt die Navigation abdeckt, habe ich nicht einzeln geprüft:
- contracts: `viewContract` (contracts.ts:40), `openContractFromHistory` (apartment-detail.ts:10), `openContractOfApartment` (tenant-detail.ts:25), `openReplacedContract` (statement-detail.ts:89), `openRunningContract`, `newContractAfterEnd` (contract-form.ts:175-176), `openExistingBuilding` (building-register.ts:36)
- contract-detail.ts:67-81: `openContractTenant`, `openContractApartment`, `showContractStatements`, `showBuildingInvoices`, `openRefusedStatement`, `createMissingStatement`, `showMissingStatementInvoices`, `openStatementFromDeleteDialog`
- statement-detail.ts:62-63, 71, 87-88: `openStatementTenant`, `openStatementApartment`, `openInvoiceOfPosition`, `openReplacedStatement`, `openCorrection`
- Listen/Karten: `openBuilding`, `openApartment` (buildings.ts:15, apartments.ts:51, building-detail.ts:32), `openTenant` (tenants.ts:31), `openStatement` (statements.ts:54), `viewInvoice` (invoices.ts:34), `openHeatingProfile`, `openBuildingOfInvoice`, `openMissedStatements` (invoice-detail.ts:16,18), `openTenantApartment` (tenant-detail.ts:23)
- Navigation: dashboard.ts:17-22, app-frame.ts:16-26, `chooseBreadcrumb` (form.ts:6), `openMasterData` (settings.ts:13), `openAuditLog` (audit-log.ts:4), `returnToStatementList` (statement-generate.ts:119)

Nur C-1 liegt im selben Wizard, hat denselben Folgeschritt und braucht denselben Einzeiler.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx fallow audit`, design-guard- und Seiten-Tests auf f41158f8: vom Aufrufer gemeldet.
- eslint/prettier auf der Task-Datei: vom Aufrufer gemeldet.
- Das Rot/Grün-Experiment (Daten 6 s verspätet, Chromium): vom Aufrufer gemeldet. Wie verlangt kein E2E gestartet. In Firefox nicht nachgeprüft.
- Den Inhalt der 240 aus main übernommenen Dateien habe ich nicht gelesen. Geprüft habe ich nur, dass der Merge keine Konfliktauflösung enthält.
