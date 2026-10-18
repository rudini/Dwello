# Review #424, Slice 3 (7c6eda2d..5a53dc38)

Gegenstand: `src/routes/statements/[id]/CostTable.svelte` (einzige geänderte Datei ausser `implementation_plan.md`), Commit `fix(statements): wrap correction rows at 390 px`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Keine Blocker/Major, keine Minor/Nit.

## Geprüft

**Korrektheit der Diagnose und des Fixes.**
- `calculation.service.ts:507` bildet die Nummer als `NK-${buildingId.substring(0, 8).toUpperCase()}-<Jahr>-`; die acht Zeichen stammen aus einer zufälligen UUID. Nach UAX 14 (HY × NU) darf nach einem Bindestrich vor einer Ziffer nicht umbrochen werden; beginnt die UUID mit einer Ziffer, ist für Firefox die ganze Nummer ein Wort. Das erklärt, warum die Prüfung nur in einem Teil der Läufe (6 von 10) scheiterte: Es hängt von den Daten ab, nicht vom Timing. Die Diagnose ist stimmig.
- `min-w-0` lässt das `dt` als Flex-Item unter seine min-content-Breite schrumpfen, `break-words` (`overflow-wrap: break-word`) bricht das Wort dann notfalls. Beide Klassen sind nötig: `overflow-wrap: break-word` verkleinert die min-content-Breite nicht. `wrap-anywhere` gäbe es erst in Tailwind 4 (Repo: `tailwindcss ^3.4.17`), und `break-all` würde auch normale Wörter mitten im Wort brechen. Die Kombination ist also die kürzeste, die funktioniert, und entspricht dem Muster im Repo (`ApartmentCard.svelte:41`, `BuildingCard.svelte:36`, `InvoiceRow.svelte:30`, `StatementRow.svelte:28`).
- Der `{#each adjustments}`-Block gilt auch für die Rundungszeilen («… vor Rundung», «Rundung auf 5 Rappen»). Dort ändert sich nichts: Kurze Wörter brechen weiterhin an Leerzeichen.

**Andere Zeilen desselben `<dl>` (Zeilen 148–194).** Keine dieser Zeilen kann so überlaufen, denn dafür müsste ein einzelnes Wort im `dt` breiter sein als etwa 358 px − 16 px Abstand − Betrag (rund 130 px). Die längsten Wörter in den vier Sprachen:
- Akonto: «Geleistete Akontobeiträge», «Acomptes versés», «Acconti versati», «Advance payments made»;
- Verwaltungspauschale: «Verwaltungspauschale» (20 Zeichen), im `dt` mit `flex flex-col`;
- Gesamt: «Ihre Nebenkosten» und Entsprechungen;
- Saldo: «Saldo: …»; das `dd` hat dort kein `whitespace-nowrap` und kann am Leerzeichen nach «CHF» umbrechen;
- Rundung: «dell’arrotondamento» (19 Zeichen).

Alle bleiben deutlich unter der Grenze. Keine dieser Zeilen enthält eine Abrechnungsnummer.

**Andere Stellen, die eine Abrechnungsnummer zeigen.** An keiner steht die Nummer in einer Zeile ohne Umbruch neben einem `nowrap`-Betrag:
- Abrechnungsliste (`StatementRow.svelte:28`): `min-w-0 break-words` auf dem Container; der Betrag steht bis xl darunter.
- Kopf der Detailseite (`PageHeader.svelte`): h1 mit `hyphens-auto break-words`, Container mit `min-w-0` und unter md `flex-col`.
- Hinweise in `Correction.svelte` (`statements_replaced_by`, `statements_replaces`): Fliesstext beziehungsweise `inline-flex`-Link im Block, ohne Betrag daneben.
- Dokumente (`DocumentItem.svelte`): unter md `flex-col`.
- Mieter-Dokumente (`TenantDocumentRow.svelte`): `flex-wrap`, die Aktionen rutschen in die nächste Zeile.
- `DeleteContract.svelte:91`, `ChangedStatements.svelte:15` und `RefusedStatements.svelte`: Links ohne Betrag daneben.

Die Nummer allein ist etwa 21 Zeichen lang (rund 190 px) und passt in 358 px.

**Design-Guard.** `design-guard.test.ts` verbietet weder `break-words` noch `min-w-0`: Die Regeln betreffen Farben, beliebige Werte, `text-xs`, Raster, Radien, Schatten, Verläufe und Emoji. `token-referenz.md` sagt zu Umbruchklassen nichts, und beide Klassen sind im Repo vielfach im Einsatz. Der Kommentar steht in `<!-- -->` und wird vom Guard ausgeblendet.

**Tests.**
- jsdom hat kein Layout. Kein Unit- oder DOM-Test kann die Breite zeigen, die niedrigste geeignete Ebene ist der E2E-Bildschirmcheck `cutOffText` (`tests/e2e/screenplay/questions.ts:175`).
- `statement-correction-detail default` steht bereits in `tests/a11y/screens.json:528`, `accessibility.feature:165` und `sprachen-bildschirme.feature:166`. Damit ist die Zeile auch in fr/it/en bei 390 px abgedeckt. Ein neues Szenario oder ein Eintrag für einen neuen Zustand ist nicht nötig.
- Der rote Test ist der bestehende, in Firefox scheiternde Check. Ein Test auf niedrigerer Ebene ist nicht nötig und auch nicht möglich (CLAUDE.md, Workflow 2: «lowest layer that can show it»).
- Texte: keine neuen oder geänderten, `messages/*.json` ist nicht betroffen.

**Ponytail-Review.** `CostTable.svelte:L181-183`: zwei Klassen und ein Kommentar, beides nötig (siehe oben). Lean already. Ship.

**Nichts Fremdes im Diff.** Nur die eine Zeile mit ihrem Kommentar, keine Formatierung von fremdem Code.

## Nicht bestätigt

- `bun run lint` (bestanden) – vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/design-guard.test.ts src/__tests__/tokens.test.ts` (588 bestanden) – vom Aufrufer gemeldet. Nicht erneut ausgeführt, weil das Diff weder Text noch Logik ändert und der Guard per Lesen geprüft ist.
- E2E: Rot (Firefox 2/3 Shard-Läufe, 6/10 mit `--repeat-each=10`) und Grün (30/30 in Chromium, Firefox und WebKit) – vom Aufrufer gemeldet. Laut Auftrag nicht gestartet.
- Prettier-Format der geänderten Zeilen: nicht geprüft. Der Zugriff auf `node_modules` aus dem Worktree wurde verweigert (Deny-Regel auf `/home/user/Dwello/node_modules`). Lint ist laut Aufrufer grün.
- Ausserhalb des Deltas, nur zur Kenntnis: In der Heizprofil-Zeile (`CostTable.svelte:150-153`) steht der vom Benutzer vergebene Profilname im `dd` ohne `min-w-0 break-words`. Ein extrem langes Wort ohne Leerzeichen könnte dort ebenfalls überlaufen. Das war schon auf der Basis so und hat mit der Abrechnungsnummer nichts zu tun; deshalb ist es hier kein Befund.
