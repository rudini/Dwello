# Review i815b1, Runde 1 (39443574..5c543d4a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/contracts/new/ContractWizard.svelte:119 | Geänderte Zeile ohne eigenen Test: Der Assistent gibt jetzt `taken.status` an `contractPeriod` weiter, aber kein Test im Assistenten zeigt einen übernommenen unbefristeten Mietvertrag. Nur in diesem Fall ändert der Status den Text («ab …» oder «seit …»). Die DOM-Tests in `contract-wizard.dom.test.ts` (ab Z. 712) nutzen nur Verträge mit `endDate`. Ein festes `'active'` an dieser Stelle bliebe deshalb grün. `lastRent` gibt `status` zwar weiter (`contract-wizard.test.ts`), aber die Anzeige ist nicht abgedeckt. |

Keine Blocker, keine Major.

Geprüft: Der Status kommt jetzt an allen Stellen vom Backend:
- Liste: Mapper in `contracts/+page.server.ts`, `ContractRow`.
- Seite: `toContract`, `ContractTerms`.
- Bearbeiten: Die Load-Funktion reicht den Vertrag des Backends roh durch, und `tests/contracts/contract.json` enthält `status`.
- Assistent: Der BFF-Proxy `api/contracts` leitet die Antwort roh weiter, und `contracts.json` enthält `status`.

Weitere geprüfte Punkte:
- Das Backend liefert `status` für Liste und Detail immer (`contract.service.ts:56`). `RentalContract.status` ist ein Pflichtfeld. Ein Absturz durch `statusBadges[undefined]` ist ohne Änderung der Antwort nicht möglich, und `api-contracts.pg.test.ts` würde eine solche Änderung melden.
- Der neue Anzeige-Eintrag `contract.status === 'active'` hängt nur vom Status ab. `running` wird nur für den Hinweis und den Hilfetext gelesen.
- Ratchet: 5 Einträge entfernt, 3 neu, also 39 Ausnahmen. Mit 42 Anzeige-Einträgen ergibt das 81. Das passt zur Zeile in `fitness-functions.md`, und die Begründung der drei Einträge für B2 stimmt.
- `today` ist aus der Liste entfernt, in Detail, Formular und Assistent wird es weiter gebraucht.
- Fixtures: `status` ist jetzt Pflicht im Typ. Der Edit-Test «künftig» braucht `status: 'future'`, weil der Status nicht mehr aus `startDate` folgt.
- Rot ohne die Änderung: Liste und Seite (Beginn 2099, `status` 'active'), Edit (`status` 'ended' ohne `endDate`), Loader, `lastRent` und der `decides`-Fall mit `data.today` scheitern alle ohne die Änderung.
- Texte, `messages`, Tokens und `data-testid` bleiben unverändert.
- ponytail-review: nichts zu kürzen.

## Nicht bestätigt

- lint, check, `bunx vitest run` (3642), `bun run fitness` (81/39, Warnung zum einen neuen Anzeige-Eintrag) und E2E contract-detail, contract-edit, contract-new, contracts (148): vom Aufrufer gemeldet. Ein erneuter Lauf der geänderten Testdateien war nicht möglich, weil der Zugriff auf `node_modules` (Symlink ins Haupt-Repository) durch eine Deny-Regel gesperrt ist.
- Den Text von Issue #815 («Decided (product owner)») habe ich nicht gelesen, mir stand kein GitHub-Werkzeug zur Verfügung. Die Anforderung habe ich so geprüft, wie der Aufrufer sie zusammenfasst.
- Ob der Pull Request `No scenario: <reason>` nennt: noch kein Pull Request vorhanden. Möglich ist nur eine Abweichung an Mitternacht, falls die Zeitzone des BFF-Servers oder des Browsers vom Schweizer Tag abweicht.
- Am Rand, ausserhalb von B1: `src/routes/contracts/[id]/+page.svelte:98` (`endDate === data.today`, Wahl des Toast-Texts) ist ebenfalls ein Vergleich mit dem heutigen Tag. `decides` erkennt `===` mit today weder vor noch nach der Änderung.
