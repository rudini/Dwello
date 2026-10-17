# Abschliessendes Code-Review W10c (#363 / #91), Runde 2

Geprüft im Worktree `review-w10c-close2` (b30e6f3), Delta `git diff 675e5c5 b30e6f3`. Gelesen habe ich jede geänderte Datei. Die beiden neuen Berichte (`w10c-close-review-1.md`, `w10c-fachreview-3.md`) habe ich nur so weit gelesen, wie es für V-11, V-12 und V-14 nötig war. Ausserdem gelesen: `AgreedCategories.svelte`, `ContractForm.svelte` (`put`, `save`), `tasks/contract-form.ts` (`changeBaseRent`, `openContractEdit`, `fillContract`), `tasks/statement-generate.ts` (`openSettingsFor`, `openStatementWizardFor`), `targets/accessibility.ts:71-73`, `screenplay/interactions.ts` (`Wait.until`), `fixtures/backend.ts` (`invoice`, `statement`), `schema.ts` (`contractCategories`, FK mit `onDelete: 'cascade'`) und den Kontext des pg-Tests. `ponytail-review` ist angewendet.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-11 | Major | tests/e2e/features/statement-agreed-costs.feature:94-95; tasks/contract-form.ts:117-118 | Das Szenario zu C-1 wartet nicht, bis der Mietvertrag gespeichert ist. `changeBaseRent` klickt nur «Speichern», danach navigiert `openSettingsFor` sofort weg. Auf dem alten Code kann es deshalb grün sein, und C-1 ist damit nicht belegt |
| C-12 | Minor | docs/nebenkostenabrechnung-anforderungen.md:101, :120 | V-11 ist nur teilweise behoben: In Z. 101 steht noch «fragt der Assistent vor der Vorschau je Mietvertrag nach», ohne die Einschränkung «Kosten in seinen Mietstagen». Punkt 7 im PDF-Aufbau (vereinbarte Nebenkosten, nur wenn jede Position eine Kategorie hat) fehlt. Der Plan meldet V-11 als behoben |
| C-13 | Minor | tests/e2e/targets/contract-form.ts:68-70; tests/e2e/targets/accessibility.ts:71-73; tasks/contract-form.ts:156-159; tasks/accessibility.ts:262-263 | ponytail `dup:` `agreedCategoryBoxes`/`agreedCategoryBoxAt` gibt es zweimal mit gleichem Locator, ebenso die Schleife «alle abwählen». Kürzer: den Zustand `agreed-costs-none` mit `untickAllCategories` bauen und die Targets in `targets/accessibility.ts` streichen |
| C-14 | Minor | backend/src/services/agreed-category.service.ts:52 | `FOR KEY SHARE` behebt einen Fehler aus dem E2E-Lauf (Fremdschlüsselfehler, wenn parallel eine Kategorie gelöscht wird) und hat keinen Test. Der Aufrufer nennt den Grund: ein Wettlauf zwischen zwei Verbindungen. Gelesen: Unter READ COMMITTED überspringt die Sperre eine Zeile, die gleichzeitig gelöscht wird. Ein Löschen, das danach kommt, wartet und kaskadiert (`onDelete: 'cascade'`). Die Korrektur ist also schlüssig. Ein pg-Test mit zwei Verbindungen wäre möglich (die Löschung offen halten, dann `setAgreedCategories` starten), ist aber aufwendig |
| C-15 | Nit | tests/e2e/features/contract-edit.feature:132-133 | «alle Nebenkosten abwählt» und «warnt das Formular» beschreiben die Bedienung, nicht das Anliegen. Näher an der Fachsprache wäre «einträgt, dass im Mietvertrag keine Nebenkosten vereinbart sind» / «warnt Dwello» |
| C-16 | Nit | tests/e2e/tasks/accessibility.ts:254 | Welchen Bildschirm der Zustand vor sich hat, erkennt er an `Count === 0`, einer Momentaufnahme. Die Nachbarzustände prüfen `pageAddress` (`/contracts/new`, z. B. Z. 351). Wäre das Bearbeiten-Formular noch nicht gezeichnet, liefe der Zustand in eine Zeitüberschreitung. Das gäbe kein falsches Grün, aber eine irreführende Meldung |
| C-17 | Nit | backend/src/__tests__/agreed-categories.pg.test.ts:285-298 | Der Test zu C-5 steht im `describe('Neuer Mietvertrag')`, prüft aber das Speichern im Bearbeiten. Den Status der beiden PUTs prüft er nicht. Das Zurücksetzen von `isAllowedUtilityCost` in der letzten Zeile läuft nur, wenn `expect` grün ist. Die Kommentarzeile hat zwei Tabs Einzug (wie der Nachbar in Z. 276) |
| C-6 bis C-10 | wie Runde 1 | – | bleiben laut Aufrufer offen, unverändert gemeldet |

ponytail-review: Die Seed-Funktion `invoiceWithoutCategory` (POST, dann PUT mit `categoryId: null`) ist kurz, weil `invoice` eine Kategorie vorgibt. Sonst gibt es nur die Doppelung aus C-13. net: etwa -6 Zeilen möglich.

## Blocker / Major

### C-11: Das Szenario zu C-1 kann auch ohne die Korrektur grün sein

**Warum falsch.** Laut Szenario «Eine offene Frage bleibt nach dem Bearbeiten des Mietvertrags offen» speichert der Liegenschaftsverwalter den Mietvertrag, und danach fragt der Assistent noch. `changeBaseRent` ist aber nur `Enter.theValue(...)` plus `Click.on(contractSubmitButton)` (tasks/contract-form.ts:117-118). Auf den Abschluss des Speicherns wartet es nicht. `ContractForm.put` schickt den PUT über `apiCall` und erst danach `goto(next)`. Der nächste Step `openSettingsFor` macht sofort `Navigate.to(...)` auf den Assistenten (tasks/statement-generate.ts:38-39, 59-64). Damit gibt es zwei Möglichkeiten:
- Die Navigation bricht den PUT ab, oder er kommt erst nach dem Laden der Fragen an. Dann fragt der Assistent auch auf dem Code vor 675e5c5, und das Szenario ist dort grün.
- Der PUT kommt vorher an. Dann ist es rot, wie gewollt.

Das Szenario zeigt die Korrektur also nur zufällig. Es verstösst auch gegen die Regel, dass eine Task auf den Zustand wartet, zu dem sie führt, bevor der nächste Schritt kommt. In contract-edit.feature folgt auf denselben Step immer ein «Dann ist … auf der Detailseite», und das wartet. Hier fehlt so ein Step. Der grüne Lauf auf b30e6f3 sagt nichts darüber, ob das Szenario auf dem alten Code rot wäre.

**So zeigt man den Fehler.** Lesen: Zwischen statement-agreed-costs.feature:94 und :95 steht kein Step, der auf «gespeichert» wartet. Ausführen, wenn erlaubt: das Szenario auf 42a38f8 (vor S3-C-1) laufen lassen. Ist es dort grün oder mal grün, mal rot, ist der Befund belegt. Behebung: zwischen die beiden Zeilen den vorhandenen Step «Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist» setzen (contract-edit.feature:18). Dann ist das Szenario auf dem alten Code sicher rot.

## Nachprüfung Runde 1

- **C-1:** Das Szenario ist da. Ob es ohne die Korrektur rot ist, ist nicht sicher (C-11). Sonst stimmt es: Die Kategorie entsteht nach dem Mietvertrag der Grundlage, das Bearbeiten-Formular zeigt sie also nicht angekreuzt (`isAgreed`: `agreed` ist eine Liste), und der alte Code hätte sie beim Speichern auf `false` gesetzt.
- **C-2: behoben.** contract-edit.feature:130-133 prüft den deutschen Text über `Text.of(noAgreedCostsNote)` (testid `contract-agreed-costs-none`). Die Kategorien kommen aus dem Server-Load (Props), die Kästchen sind beim Zählen also schon da. Ohne den Hinweis wäre das Szenario rot, weil der Target fehlt. Die Step-Datei ruft nur Tasks und Questions auf.
- **C-3: behoben.** Die Seed-Abrechnung entsteht über `statements/generate` und hält damit `agreedCategoryIds` fest. Vor M-1 hätte das PDF «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: …» gedruckt, das Szenario wäre also rot gewesen. Die Gegenprobe «Nicht kategorisiert» belegt, dass die Rechnung in der Abrechnung ist, deshalb ist die negative Prüfung aussagekräftig. Die Rechnung wird über `extras` aufgeräumt.
- **C-4: behoben.** `agreed-costs-none` steht unter `contract-new` in screens.json (Zustand und Query), in accessibility.feature:78 und in sprachen-bildschirme.feature:79. Die Bedeutung stand schon in `stateMeanings`. Der Weg zum Schritt «Miete» folgt dem Muster von `contracts-unknown-review`, `Wait.until` nimmt `.first()`, und gespeichert wird nichts.
- **C-5: behoben.** `answered` verlangt jetzt `isAllowedUtilityCost`. Der pg-Test wäre vorher rot gewesen: Die Zeile (ownId, true) war in `answered`, nicht in der Liste, und wäre `false` geworden.
- **C-8: behoben** durch Regel 12 («ausser neben einer Position ohne Kategorie»).
- **V-14:** Der Wortlaut in fr, it und en entspricht dem Vorschlag, de bleibt unverändert, und die Schlüssel stehen in allen vier Dateien.
- **Workflow-Notiz und Plan:** Die Notiz steht in `docs/reviews/workflow-notes-issue-363.md`, der Plan ist abgehakt. Zu V-11 siehe C-12.
- **Sicherheit:** kein neuer Endpunkt. Das SQL bindet weiter alles als Parameter.
- **Nichts Fremdes im Diff.**

## Nicht bestätigt

- Diese Prüfungen meldet der Aufrufer, wiederholt habe ich sie nicht: E2E chromium und api, voll (970 grün, gestartet vor den Text- und Doc-Änderungen), Backend `bun test agreed-categories.pg.test.ts contract.routes.pg.test.ts`, `bun run lint` und `bun run check` (laufen noch), Backend `type-check` (nicht gemeldet). Backend-Tests und E2E waren mir untersagt.
- Selbst ausgeführt: `bunx vitest run` mit i18n, contracts-i18n, open-work und agreed-categories.dom ergibt 31 Tests grün, Exit-Code 0. Ausgabe: /tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/w10c-close2-vitest.txt
- Dass die neuen Szenarien und die beiden pg-Tests vor der jeweiligen Änderung rot waren, habe ich nur durch Lesen beurteilt. Für C-1 bezweifle ich es (C-11).
- Ob `INSERT … SELECT … FOR KEY SHARE ON CONFLICT …` den Wettlauf wirklich schliesst, habe ich nur am Code und an der Semantik von PostgreSQL beurteilt, nicht ausgeführt. Die Gültigkeit des SQL belegt der vom Aufrufer gemeldete grüne pg-Lauf.
- Ob der Pull Request für den Fix aus C-14 `No scenario`/Testgrund nennt, kann ich nicht sehen.
