# Code-Review #455, Runde 3 (Abschlussrunde vor dem Push)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w9-review-455-code-3` (detached, 01539765). Geprüft wurden zwei Bereiche:
- der Merge `git show --remerge-diff b78169a0`;
- das Delta `git diff b78169a0 01539765 -- . ':!docs/reviews' ':!docs/design/personas' ':!docs/archive'`.

Vorheriger Bericht: `docs/reviews/455-review-2.md`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | src/lib/ui/Dialog.svelte:86 | Aus Runde 1. Weiter offen, die Datei ist seit 5ffce594 unverändert. |
| C-8 | Major | tests/e2e/features/invoice-detail.feature:119-127 | Der Löschtext `invoices_delete_billed_text` hat sich für den Benutzer sichtbar geändert (Entscheide vom 2026-10-19 und 2026-10-20). Kein Szenario prüft diesen Text, und es gibt auch kein `No scenario: <reason>`. |
| C-9 | Minor | messages/de.json:954, messages/en.json:954 | Der neue zweite Satz endet mit «die Schlussrechnung» / «the final invoice». Das folgende «Die Entwürfe enthalten sie weiter» / «The drafts still contain it» bezieht sich deshalb grammatisch auf die Schlussrechnung und nicht auf die gelöschte Rechnung. fr und it sagen «cette facture» / «questa fattura» und sind deshalb weniger betroffen. |

## Status der offenen IDs aus Runde 2
- **C-3 (Minor): offen.** `git diff --stat 5ffce594 01539765 -- src/lib/ui/Dialog.svelte` ist leer. Die Triage liegt weiter beim Aufrufer.

## Merge b78169a0
`git show --remerge-diff b78169a0` zeigt keinen Inhalt (6 Zeilen, nur der Kopf). Der Merge hat also keine Konflikte von Hand gelöst. Er bringt nur PR #494 (main). Dessen ResultList-Commit 2ec1daac hatte dieser Branch schon. Ich finde dazu keinen Befund.

## Delta b78169a0..01539765
- **De-Text Wort für Wort gegen #455:** Ich habe den Body von `gh api repos/rudini/Dwello/issues/455` genommen. Der Eintrag vom 2026-10-20 lautet: «Löschen Sie nur falsch erfasste Rechnungen oder Akontorechnungen, an deren Stelle eine Schlussrechnung tritt. Ersetzt eine Schlussrechnung diese Akontorechnung, erfassen Sie zuerst die Schlussrechnung.» Das ist genau der Anfang von messages/de.json:954. Der Rest des Werts ist gleich wie auf b78169a0. Der alte erste Satz («die eine Schlussrechnung ersetzt») kommt in `src`, `tests`, `backend` und `messages` nicht mehr vor, nur noch in Berichten.
- **fr/it/en:** Alle vier Dateien sind in derselben Änderung angepasst. Die Begriffe facture finale / fattura finale / final invoice und facture d’acompte / fattura d’acconto / advance invoice entsprechen `docs/design/i18n-begriffe.md`. Die fr-Guillemets haben innen ein U+00A0.
- **Test:** `src/__tests__/invoice-pages.dom.test.ts:367-369` prüft mit `toContain` den ganzen neuen de-Text im Dialog. Ohne die Änderung schlägt der Test fehl, weil der alte Text «die eine Schlussrechnung ersetzt» enthält. Es gibt keinen API-Vertrag und keinen neuen Bildschirm oder Zustand. Ein neuer Eintrag in `screens.json` ist deshalb nicht nötig.
- **ponytail-review:** Es gibt nur geänderte Texte und eine geänderte Erwartung. Unbenutzter Code oder eine Kopie eines Helfers sind nicht dazugekommen.

### C-8 (Major): kein Szenario für den geänderten Löschtext
- **Warum falsch:** Die Bestätigung beim Löschen einer abgerechneten Rechnung sagt jetzt etwas anderes, und sie gibt eine neue Handlungsanweisung: zuerst die Schlussrechnung erfassen. Das ist die Antwort auf die Persona-Befunde P-6 und P-7 (weber-455-2). Es ist also eine Änderung, die der Benutzer sieht.
  - CLAUDE.md, Workflow 1 und «Always check» verlangen dafür ein Szenario ohne `@wip` oder `No scenario: <reason>`.
  - Das Szenario «Abgerechnete Rechnung mit Beleg löschen» (invoice-detail.feature:119-127) prüft nur `invoices_delete_beleg_billed`. Dafür nutzt es `billedAdviceOnDelete` (tests/e2e/questions/invoice-upload.ts:49).
  - Der Absatz `<p>{m.invoices_delete_billed_text()}</p>` (src/routes/invoices/[id]/DeleteConsequences.svelte:17) hat keine Target und keine Question.
  - `grep -rn "Löschen Sie nur" tests/e2e` findet nichts.
  - Das ist auch kein Fall von «No scenario»: Der E2E-Stack erreicht den Zustand, denn das Szenario oben öffnet genau diesen Dialog.
- **Wie man es fehlschlagen sieht:** Man setzt in messages/de.json:954 den alten Satz wieder ein und lässt `bun run test:e2e` laufen. Kein Szenario wird rot, nur der DOM-Test.
- **Fix:** Eine Target und eine Question auf den Absatz, zum Beispiel `data-testid="invoice-delete-billed-text"`. Dazu ein `Dann`/`Und`-Schritt im bestehenden Szenario, der die neuen ersten zwei Sätze nennt. Wenn der Aufrufer bewusst darauf verzichtet, muss der Pull Request `No scenario: <reason>` sagen.

## Konflikte mit origin/main und #514
- **`git merge-tree --write-tree 01539765 origin/main`** (origin/main = 7261d21a, mit #520 und #504): Ergebnis-Tree `c0d8eeb0…`, keine Konflikte. Beide Seiten haben folgende Dateien geändert: `UBIQUITOUS_LANGUAGE.md`, `backend/src/__tests__/api-contracts.pg.test.ts`, `docs/api-specification.md`, `docs/archive/implementation-plan-verlauf.md` und `messages/*.json` (main mit je einem neuen Schlüssel). Git führt alle automatisch zusammen. facddbb6 (#517) ist schon in b78169a0 enthalten.
- **Vorausblick auf #514** (offen, Head 280c1391, Basis 3db8976a). `git merge-tree --write-tree 01539765 280c1391` ergibt **drei Dateien mit Konflikten**:
  - **messages/en.json:**
    - `invoices_service_period_years`: Beide Seiten haben den Wert umformuliert.
    - `invoices_delete_billed_text`: #514 baut auf dem Text vor #455 auf («Delete only invoices recorded by mistake. The drafts still include this invoice: recalculate them afterwards … To correct sent or paid statements, use … takes into account …», 461-native-en EN-20).
    - `invoices_upload_files_choose`/`_files_help`: Der Branch fügt den Schlüssel neu ein, #514 formuliert «immediately» um.
    - Der Block `invoices_upload_several` … `invoices_upload_mixed`: Der Branch hat neue Schlüssel und die Regel nach Option C, #514 hat die «»-Korrektur EN-4 und eine umformulierte, ältere `invoices_upload_deducted`.
  - **messages/fr.json:**
    - `invoices_service_period_years`/`_boiler`: #514 ersetzt «imputable» durch «répercutable». Der Branch hat nur `_years` geändert, also für `_boiler` die Fassung von #514 nehmen.
    - `invoices_delete_billed_text`.
    - Der Block `invoices_upload_deducted` … `invoices_upload_mixed`: «imputables» wird zu «répercutables» in `_mixed`, und `_deducted` hat die ältere Regel.
    - Der Block `invoices_beleg_deducted`/`_deducted_rule`/`invoices_beleg_mixed`: in `_mixed` «répercutables».
  - **docs/design/i18n-begriffe.md:56-64:**
    - #514 ändert «Umlagefähig» zu «répercutable» und fügt «Umlagefähigkeit» und «Akonto verrechnen» hinzu.
    - Bei der Zeile «abgerechnet» setzt #514 en auf «billed», der Branch auf «in a statement».
    - Beides behalten: die neuen Zeilen von #514 und «in a statement» vom Branch.
  - `messages/it.json` und `messages/de.json` lassen sich automatisch zusammenführen. In it ist dann die Fassung des Branches von `invoices_delete_billed_text` drin.
- **Welche fr/it/en-Texte des Branches gegen die Regeln von #514 verstossen.** Geprüft habe ich die Schlüssel, die der Branch gegenüber 86f13870 ändert: 14 in fr, 14 in it, 16 in en. Ich habe sie per Skript gegen die Regeln aus #514 geprüft.
  - **fr, normaler Leerschlag statt U+00A0 vor «:» und «;»:** #514 hat alle Fälle in fr.json umgestellt (danach 0 mit Leerschlag, 329 mit U+00A0). Der Branch hat 136, davon in seinen eigenen Schlüsseln:
    - `invoices_service_period_years` («Un exemple : », «facture : »);
    - `invoices_delete_billed_text` («facture : recalculez», «décompte ; le», «originale : le»);
    - `invoices_upload_deducted` («déduction : {total}»);
    - `invoices_upload_deducted_rule` und `invoices_beleg_deducted_rule` («contiennent : le»);
    - `invoices_upload_advance_invoice` («d’acompte : un», «d’acompte ; su»).

    Schlüssel, die nur der Branch geändert hat, übernimmt Git beim Merge ohne Konflikt mit dem normalen Leerschlag. Nach dem Merge gibt es also wieder Fälle, die gegen die Regel verstossen. Vor «?», «!» und «%» habe ich in diesen Schlüsseln keinen Fall gefunden.
  - **fr «imputable», «frais de gestion»:** kein Treffer in den Schlüsseln des Branches. Der Treffer `invoices_service_period_boiler` stammt nicht vom Branch.
  - **it «spese di gestione», «revoca», gross geschriebene Höflichkeitsform mitten im Satz, «lei» klein:** kein Treffer in den 14 Schlüsseln. In `invoices_delete_billed_text` steht «Le bozze» am Satzanfang, also ein Artikel.
  - **en, typografische Anführungszeichen statt «»:** #514 hat danach 0 davon in en.json. Treffer in den Schlüsseln des Branches:
    - `invoices_upload_deducted_rule` («Delete invoice», «Remove the file», «Recalculate», «Correct statement»);
    - `invoices_upload_advance_invoice` («Create this invoice»);
    - `invoices_beleg_deducted_rule` («Delete invoice», «Recalculate», «Correct statement»).

    `invoices_delete_billed_text` verwendet in en schon «».
  - **en, «offsets» und Bezug von «it»:** #514 ersetzt in `invoices_delete_billed_text` «offsets what has already been paid» durch «takes into account …» und «still contain it» durch «still include this invoice» (EN-20). Die Fassung des Branches hat beides noch. Beim Lösen des Konflikts gehören beide Änderungen in den neuen Text, damit ist auch C-9 für en erledigt. Dasselbe «offsets» steht auch in `invoices_edit_billed_text`, aber das ist kein Schlüssel dieses Branches.
  - Ein Test in #514, der den Leerschlag vor «:» oder die en-Anführungszeichen automatisch prüft, ist im Patch von `src/__tests__/i18n.test.ts` nicht zu sehen. Diese Verstösse fallen nach dem Merge also nicht durch einen roten Test auf. Man muss sie von Hand angleichen.

## Nicht bestätigt
- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - auf b78169a0: `bun run lint`, `bun run check`, backend `type-check`, fallow, vitest (3241) und die Backend-Tests der geänderten Dateien (78);
  - auf 01539765: vitest `invoice-pages` und `i18n` (der Test zum Löschtext erst rot), lint, open-work.
- E2E und Persona-Stack habe ich laut Auftrag nicht gestartet.
- Die Regeln aus #514 habe ich aus dem PR-Patch abgeleitet (`gh api repos/rudini/Dwello/pulls/514/files`) und aus den Dateien `messages/*.json` auf `w10-issue-461`. #514 ist noch offen und kann sich ändern. Die Konfliktliste gilt für Head 280c1391.
- Ob fr/it den Bezug im dritten Satz (C-9) so klar fassen, wie es ein Muttersprachler erwartet, habe ich nur am Text gelesen und nicht von einem Muttersprachler prüfen lassen.
