# Review H-28 (#717) Schritt 4: `043950a1f..3e9c228f4`

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | backend/src/services/statement-invoices.service.ts:112-118 | Die neuen Funktionen stehen zwischen dem JSDoc von `outdatedStatements` («#454 (#408 point 7): for the Übersicht, the drafts with a change since …») und der Funktion. Der Block hängt jetzt an `draftOutdated`, und `outdatedStatements` hat keinen Kommentar mehr. Beide neuen Funktionen gehören über diesen Block. |
| C-2 | Minor | src/__tests__/buildings-i18n.test.ts:137 | `draftIds: ['s2']` ist geblieben, obwohl das Feld aus `OverviewInput` entfernt wurde. TypeScript meldet das nicht, weil die Eingabe als untypisierte Variable übergeben wird. Die Zeile ist toter Testinput. |
| C-3 | Minor | tests/contracts/dashboard.json:13-14 | Im neuen Vertrag sind `recentActivity` und `buildingOccupancy` leer. `drift()` prüft leere Arrays nicht (`api-contracts.pg.test.ts:40`). Deshalb prüft der Vertragstest die Felder nicht, die der BFF aus `buildingOccupancy` liest (`buildingId`, `buildingName`, `occupiedApartments`, `+page.server.ts:196`). `dashboard.test.ts:28-34` schreibt diese Zeilen weiterhin von Hand. Der Vertrag braucht je Array einen Eintrag. Die Rental im Vertragstest liefert ihn bereits. |

Keine Blocker, keine Major.

Geprüft: Die Regel `draftOutdated` ist für Liste, `run-differences` und Zählung dieselbe. `null` (Entwurf ohne Gebäude) zählt wie bisher als zu versenden. Damit gilt `draft = toSend + nicht aktuelle Entwürfe der Liste`, wenn beide zum selben Zeitpunkt gelesen werden. Die Zählung selbst kommt aus einer einzigen Lesung. Liste und Zahl stammen weiterhin aus zwei Endpunkten (`/dashboard`, `/statements/outdated`), sind aber je für sich stimmig. Fällt die Liste aus, stimmt die Zahl trotzdem (`dashboard.test.ts:283-288`). Weitere Aufrufer: `/api/dashboard` (Proxy, reicht nur durch). `OverviewInput` nutzen nur `+page.server.ts`, `overview.test.ts` und `buildings-i18n.test.ts`. Texte, `messages/*.json` und Szenarien sind unverändert. Beide neuen Tests sind ohne die Änderung rot: Backend `toSend` undefined ergibt NaN, die Übersicht ohne `draftIds` scheitert bzw. zählt 1 statt 2. Kosten: je Entwurf und Dashboard-Aufruf ein `statementChanges` (getStatement, Rechnungen der Periode, agreedStock; für Entwürfe kein `recalculation`). Das ist dieselbe Arbeit, die `/statements/outdated` für dieselben Entwürfe beim gleichen Laden schon macht. Bei unter 50 Wohnungen ist das vertretbar, kein Befund. `limit: 1000` begrenzt `toSend` bei mehr als 1000 Entwürfen, für das MVP irrelevant.

Ausserhalb des Diffs, auf Nachfrage (keine Befunde dieses Schritts). In `src/lib/overview.ts` stehen weiterhin fachliche Entscheidungen im BFF:
- `waiting`/`overdue` (Z. 220-228): Mahnfrist, Zahlungsfrist der letzten Mahnung, Rückerstattung. Dazu kommt eine Zählung `statementCounts.overdue − gefilterte dueStatements` aus zwei Lesungen, also dasselbe Muster wie #602 (`/dashboard` gegen `statements?status=open`).
- `FIVE_YEARS_AGO` (Z. 157-162, 5-Jahres-Hinweis bei Berichtigung).
- In `+page.server.ts`: `expired`, `noticed`, `formerTenants`, `oldAddresses`, `missingStatements`.

## Nicht bestätigt

- Ob alle Tests grün sind, war nicht nachprüfbar: `bunx vitest run` liess sich nicht starten (`node_modules` im Worktree verweigert). Vom Aufrufer gemeldet: `dashboard.pg.test.ts` war zuerst rot, der neue Übersichtstest war rot, Backend 1560 grün mit Coverage, `vitest --changed`, lint, check, Backend-Type-Check, fallow, `api-contracts.pg.test.ts`, E2E `dashboard.feature` (50 grün). Backend und E2E wurden auf Wunsch nicht ausgeführt.
- Ob die Pull-Request-Beschreibung `No scenario: <reason>` nennt, war nicht prüfbar. Ein Szenario fehlt nicht, weil sich nichts Sichtbares ändert: Der #602-Wettlauf ist im E2E-Stack nicht herstellbar.
- `docs/architecture/baseline.md:266` beschreibt #13 weiterhin als offene Zählung im BFF. Ob der Nachtrag erst am Ende von H-28 kommen soll, war nicht prüfbar.
