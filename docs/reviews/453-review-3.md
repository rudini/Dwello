# Code-Review 3 (Abschlussrunde) zu #453 «Abgerechnet bis» (mit #325, #480)

Gegenstand: das Delta seit 6ab79f7b im Worktree `review-453-code3` (detached, c2378283). 30d41e49 enthält nur Berichte und Workflow-Notizen. Für den Merge c2378283 habe ich die Auflösung der Konflikte mit `git show --remerge-diff c2378283 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` geprüft (12 Dateien). Vorherige Berichte: `453-review-1.md`, `453-review-2.md`.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-7 (Minor) | offen, so belassen | `backend/src/services/pdf.service.ts`, `moveDown(0.4)` vor der Zeile zum Mietverhältnis: Der Merge ändert daran nichts, ein Test fehlt weiterhin. |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-8 | Minor | `backend/src/__tests__/billed-until.pg.test.ts:125-143`, `backend/src/__tests__/statement-pdf-render.test.ts:570-635` | Kein Test deckt ab, wie «Abgerechnet bis» und die Akonto-Zeilen aus #464 mit Gültigkeitsdatum zusammenspielen. Die Tests zu «Abgerechnet bis» arbeiten mit genau einem Akontobetrag, die Tests zu #464 ohne «Abgerechnet bis». Im PDF hat die Fixture `billed` keine `advanceLines`. Es gibt also keinen Test für die Überschrift «Akontobeiträge ab {date}» mit den Zeilen «n Monate × CHF …» darunter. Der Code rechnet richtig (siehe unten), aber eine spätere Änderung an `advanceLines` oder am Start der Überlappung würde unbemerkt bleiben. Vorschlag: in `billed-until.pg.test.ts` ein zweiter Akontobetrag ab 01.09.2024, Erwartung 4 × 100 + 4 × 150. Zusätzlich ein Render-Test mit `billed` und `advanceLines`. |

Keine Blocker, keine Majors.

## Prüfung der Konfliktauflösung

- `pdf.service.ts`: In allen vier Sprachen kommt `advancePayments` von main (#464: «Akontobeiträge», «Acomptes», «Acconti», «Advance payments»), `advancePaymentsFrom` bleibt aus diesem Branch erhalten. Die Texte für Akonto-Zeilen und Hinweis aus #464 sind vollständig da. `billedTexts` (Z. 1182-1189) überschreibt nur das Label der Summe. `advanceRows` (Z. 813) und `totalRows` (Z. 696) zählen die #464-Zeilen weiterhin. Mit «Abgerechnet bis» bekommt die Tabelle also keine zusätzliche Zeile und passt auf die Seite.
- `messages/*.json` und `UBIQUITOUS_LANGUAGE.md`: Behalten ist die Version des Branches mit «oder in denen der Mietvertrag bis dahin endet» (#480). Die Version von main unterscheidet sich nur dadurch, dass dieser Teilsatz fehlt. «Geleistete» kommt in keiner der beiden Versionen vor. `contracts_start_in_past_billed` ist in allen vier Dateien erhalten. Alle JSON-Dateien lassen sich parsen, Konfliktmarker gibt es keine mehr. Die 9 i18n-Testdateien sind grün (selbst laufen lassen).
- `ContractForm.svelte:158-176`: Die Auflösung übernimmt `saveError` von main, also `backendMessage({ code, params }, m.contracts_save_failed())`. Weil `error` und `message` nicht weitergereicht werden, kommt bei einer Ablehnung ohne Code immer `contracts_save_failed` (`src/lib/backend-error.ts:37-48`). C-2 bleibt damit behoben. `code` und `params` stehen beim Aufruf `saveError(response.error)` (Z. 203) auf oberster Ebene, so wie in `tests/contracts/contract-billed-until-refused.json`. Die frühere Branch-Version las `details?.code`, die neue liest richtig oben. Die DOM-Tests in `contract-edit.dom.test.ts` (billedRefused, tenantRefused, advanceRefused) und `contract-wizard.dom.test.ts` habe ich selbst laufen lassen: 101 grün.
- `api-contracts.pg.test.ts`: Der Import vereinigt jetzt beide Seiten (`rentalContracts` und `contractAdvancePayments`).
- `statement-pdf-render.test.ts`: Beide `describe`-Blöcke sind vollständig und richtig geschlossen.
- `contract-edit.dom.test.ts`: Alle drei Vertrags-Imports sind erhalten.
- `contract-form.steps.ts`: Die Imports beider Seiten sind erhalten, der Schritt aus #480 ist geschlossen und der Schritt aus #464 folgt danach. Die Steps rufen nur Tasks und Questions auf.
- `advance-payments.test.ts:31`: Der Fall 61.94 läuft jetzt über `totalOf`, also über `advanceLines` von #464 (Z. 6). `calculateTotalAdvancePayments` gibt es nicht mehr. Der Test ist grün.

## Akonto-Summe mit «Abgerechnet bis» und #464-Zeilen (Prüfauftrag)

Laut Code stimmt das Verhalten. `calculation.service.ts:425-429` ruft `advanceLines` mit `contractOverlap.overlapStart` auf. Dieser Wert kommt aus `prorating.service.ts:160` mit `billingStart(contract)`, das ist der Tag nach «Abgerechnet bis». `amountOn` wählt den Betrag, der am ersten Tag gilt. Ich habe das mit `bun -e` ausprobiert (Abrechnungsbeginn 01.05.2024, Ende 31.12.2024):

- 100 ab Vertragsbeginn, 150 ab 01.09.2024: 1000 (4 × 100 + 4 × 150).
- 100 ab Vertragsbeginn, 150 ab 01.03.2024, also vor «Abgerechnet bis»: 1200 (8 × 150). Die Monate bis «Abgerechnet bis» zählen nicht.
- «Abgerechnet bis» 15.05., 150 ab 20.05.: Der angebrochene Mai zählt mit dem Betrag vom 16.05. (16/31 × 100), wie #464 es für jeden angebrochenen Monat regelt. Diese Regel kommt aus #464 und nicht aus diesem Merge.

Auch `refuseChangedStatements` (`advance-payment.service.ts:142`) rechnet mit dem gespeicherten `rentalStart`, also ab dem Tag nach «Abgerechnet bis». Ein Test fehlt (C-8).

## Weitere Punkte

- Design, Sicherheit, Auth: Die Konfliktauflösung ändert keine Klassen, Endpunkte oder Prüfungen.
- Ponytail: In der Auflösung bleibt nichts Unbenutztes zurück. `rentalContracts` wird im API-Vertragstest weiter verwendet, Lint ist laut Aufrufer sauber.
- Nichts Fremdes: Die übrigen Änderungen des Merges (Migration 0026, Features und Bildschirme von #464) kommen unverändert von main.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, Backend-Type-Check, Backend `bun run test` (1041 pass, 1 Timeout in `migrations.pg.test.ts`), `bun run test:coverage` (4 Timeouts in nicht berührten Dateien). Dass die Timeouts von der Last kommen und nicht vom Merge, habe ich nicht geprüft.
- Selbst wiederholt auf c2378283: `bunx vitest run` für contract-edit.dom und contract-wizard.dom (101 grün) und die 9 `*i18n*`-Testdateien (85 grün). Ausserdem `bun test` für advance-payments, statement-pdf-render und billed-until.pg gegen `dwello_test_r453` (108 grün).
- E2E der vier Features und die neuen Zeilen für axe und Sprachen laufen laut Aufrufer noch. Ich habe sie nicht gestartet (Vorgabe).
- Ob die automatisch zusammengeführten Dateien ohne Konflikt (z. B. `calculation.service.ts`, `prorating.service.ts`, `screens.json`) richtig zusammenspielen, habe ich nur für den Akonto-Pfad oben geprüft. `screens.json` lässt sich parsen. Doppelte Bildschirm-IDs habe ich nicht gesucht.
