# Code-Review #837 Zyklus 1 (Abrechnungen), Runde 1

Bereich: `git diff origin/main a8008843` (508c311a, cf7664d4, 329c9f09, a8008843), Worktree `review-i837-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/statements/[id]/edit/+page.svelte:27 | `paymentDeadline ?? undefined` bindet `undefined` an `DateInput.value`, das einen Fallback (`$bindable('')`) hat: Svelte wirft dann `props_invalid_value`. Vorher ergab `null` ein leeres Feld. Das ist eine Laufzeitänderung in einem «nur Typen»-Zyklus. |
| C-2 | Major | src/lib/types.ts:290-420; docs/architecture/adr/0005-api-typen-im-eigenen-modul.md:28-34 | Der Plan von #837 nennt für Zyklus 1 auch `StatementLineItem`, `StatementLineInvoice` und `StatementDocument`. Alle drei bleiben von Hand deklariert. Trotzdem schliesst das ADR den Zyklus mit «Messung nachher» ab und nennt die Lücke nicht. |
| C-3 | Minor | src/lib/types.ts:358-363 | `replaces` gibt der Mapper unverändert weiter (`data.replaces ?? null`, statement.ts:65). Es steht aber weiter von Hand im Typ, mit abweichendem `totalAdvancePayments?: number \| string` (Backend: `string`). Das widerspricht ADR 0005, Regel 3 («unverändert weitergegeben → `Pick`»). |
| C-4 | Minor | backend/src/services/statement.service.ts:243 (und :134) | Laut Entscheid prüft der Service seine Rückgabe «mit `satisfies`». Der Diff fügt kein `satisfies` hinzu: Es bleibt die bestehende Rückgabe-Annotation. Der Plan meldet trotzdem «checks it with `satisfies`» als erledigt, und das ADR (Z. 18) nennt die Abweichung vom Entscheid nicht. In der Wirkung ist die Annotation gleichwertig; Code oder ADR sollten das aber sagen. |
| C-5 | Minor | backend/src/api/statement.ts:3; src/lib/types.ts:323 | Die Kommentare verweisen auf «ADR 0004». Das ist das Rate-Limiting-ADR, gemeint ist ADR 0005. |

## C-1 (Major): Bearbeitungsseite wirft bei fehlender Zahlungsfrist

`DateInput.svelte` deklariert `value = $bindable('')`. In Svelte 5.57 (`internal/client/reactivity/props.js:325-331`) wirft `e.props_invalid_value(key)` im Runes-Modus, wenn der Anfangswert `undefined` ist, ein Fallback existiert und es einen Setter gibt (`bind:`). Genau das passiert jetzt bei `bind:value={deadline}` mit `deadline = statement.paymentDeadline ?? undefined`, sobald `paymentDeadline` `null` ist und `!statement.unpaid` gilt.

Vorher kam `null` an. `null !== undefined`, also griff kein Fallback. `toText(null)` ergab `''`, und das Feld war leer. Jetzt bricht die Seite ab.

Der neue Kommentar («a draft can have none yet») und ADR 0005, Z. 39, beschreiben genau diesen Zustand als vorgesehen. Über die App entsteht er heute zwar nicht (`generateStatement` setzt immer eine Frist), wohl aber bei Altdaten: Die Spalte ist nullable. Der Entscheid verlangt «no behaviour, … never by changing a value the app shows».

- **Nachweis:** DOM-Test, der `src/routes/statements/[id]/edit/+page.svelte` mit `statement: { …detail, paymentDeadline: null, unpaid: false }` montiert. Auf origin/main zeigt er ein leeres `payment-deadline-input`, auf a8008843 wirft er `props_invalid_value`.
- **Korrektur:** `statement.paymentDeadline ?? ''`. Das zeigt dasselbe wie vorher und passt zum Typ `string`. Danach die Zeile in ADR 0005, Z. 39, angleichen.

## C-2 (Major): Zyklus 1 ohne drei der fünf Typen aus dem Plan

#837, «Plan», Punkt 1: «**Statements:** `Statement`, `StatementWithDetails`, `StatementLineItem`, `StatementLineInvoice`, `StatementDocument`». Umgestellt sind nur `Statement` und `StatementWithDetails`.

`StatementDocument` (types.ts:394-415) deklariert weiterhin von Hand Felder der Tabelle `documents`: `id`, `tenantId`, `statementId`, `type`, `reminderLevel`, `title`, `fileName`, `mimeType`, `channel`, `status`, `sentAt`, `paymentDeadline`, `createdAt` …. Die Zeilen von `StatementLineItem` laufen im Mapper weiter untypisiert (`BackendStatement = Record<string, any>`, statement.ts:12-24).

Trotzdem markieren ADR 0005 (Tabelle «Zyklus 1», Schritt 4) und `fitness-functions.md:127` den Zyklus als gemessen und abgeschlossen. Damit ist «Done means» («No entity in `src/lib/types.ts` declares a field the backend's response type already has») für diesen Zyklus nicht erfüllt.

- **Nachweis:** `grep -n "interface StatementDocument" -A22 src/lib/types.ts`.
- **Korrektur:** Die drei Typen in diesem Zyklus umstellen. Oder die Verschiebung in einen eigenen Zyklus im ADR und in #837 festhalten; die Reihenfolge des Plans entscheidet der Product Owner.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bun run check` (0 Fehler, 4290 Dateien, 36 s; vorher 4289, 42 s), `bunx vitest run --changed origin/main` (439 pass), `bun run lint`, fallow audit, `bun tools/fitness/fitness.ts --update`, Backend-Tests (654 pass).
- Selbst ausgeführt: `cd backend && bunx tsc --noEmit` auf a8008843 (rc 0).
- ADR 0005, «Felder, die `src/lib/types.ts` deklariert 63 → 53»: nicht nachgemessen (`tools/arch-baseline/05-knowledge.ts` nicht gestartet). Max 37 → 36 und Entity-Spiegel 54 → 52 passen zum Diff von `ratchet.json`. Ob `contractCategories` korrekt aus den Spiegeln von `types.ts` fällt, ist nur über die Werkzeugausgabe belegt.
- Die Spike-Aussage im ADR (Importkette bis `ki-model.service.ts`): nur zum Teil geprüft. `ki-model.service.ts` nutzt `Bun.sleep` und `timeout: false`; die Kette von `statement.service.ts` dorthin habe ich nicht verfolgt.
- C-1 ist aus dem Svelte-Quelltext (Cache `svelte@5.57.2`) abgeleitet, nicht mit einem Test ausgeführt: Ein Testfile darf ich nicht anlegen.

Geprüft: Die Laufzeitwerte von `tenantOf`/`placeOf` sind dieselben wie vorher, auch `floor || ''` bei Stockwerk 0 und der `tenantName`-Fallback. `updateStatementStatus` ohne `overdue` ändert nichts, weil die Übergänge es nie erreichten. Unverändert zur Laufzeit sind auch der Cast in `statusCondition` und `'settled' as const`. Der Cast in `statement-generation.ts` ist nötig (`Record<string, any>` ist ohne ihn nicht zuweisbar). Das Typmodul ist vollständig gegenüber `getStatement`/`listStatements`: `status`-Override, `StatementPayment`, `correspondenceChannel`/`country`. Die Importe sind reine `import type`, das Modul importiert nur Typen aus `schema.ts`, und die Frontend-tsconfig bleibt unverändert. `Json<T>` mit `Date | null` ist korrekt; `StatementStatus` hat dieselbe Werteliste; der Test-Helfer ist plausibel. Ponytail: nichts zu kürzen.
