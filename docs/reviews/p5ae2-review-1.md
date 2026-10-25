# Review #788 Teil 5a, Runde 1 (c64da85c..8b6a9ffd)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/contracts/[id]/DeleteContract.svelte:35-40 | Die neue Zuordnung ist nur für `paid` und `replaced` abgesichert (`contract-detail-page.dom.test.ts:900-902`: «(bezahlt)», «(ersetzt)»). Für `draft` → «Entwurf» und den Rückfall `?? m.contracts_billed_sent` («versendet») gibt es weder einen DOM-Test noch einen E2E-Schritt. Zeile 901 prüft für s2 (Entwurf) nur das `href`. Die Texte «(Entwurf)» und «(versendet)» in `contract-status.test.ts` und `contract-edit.dom.test.ts` stammen aus einem anderen Modul. Wenn der Rückfall verloren geht oder Labels vertauscht werden, bleibt jeder Test grün. Die Commit-Nachricht sagt aber, dass die Zuordnung durch `contract-detail-page.dom` festgehalten ist. Es fehlt eine Erwartung für s2, z. B. `'NK-2025-0002 (Entwurf)'`, und eine Abrechnung mit `sent` oder `overdue` → «(versendet)». |

Keine Blocker und keine Major.

Geprüft: Ich habe alle 14 geänderten Dateien gelesen.
- Correction.svelte liest jetzt `superseded`. Der Wert kommt nur über `toStatement` (`src/lib/server/statement.ts:178`). Der neue DOM-Test (status `sent`, `superseded: true`) schlägt auf der Basis fehl.
- Das Backend setzt `superseded: !current`, also genau `status === 'replaced'`. Das ist im pg-Test für Entwurf, versandt und ersetzt abgedeckt.
- Mapping-Test mit Rückfall `false` und Contract `tests/contracts/statement.json` sind nachgeführt, ebenso die API-Spezifikation.
- `document-status.ts` referenziert `m.*` auf Modulebene, ruft es dort aber nicht auf. `notToSend` hat den Typ `'paid' | 'replaced' | null`, und das Backend-SQL liefert nur diese Werte. Beide Labels sind durch `documents.dom.test.ts:35-47` festgehalten.
- In StatusFilter sind die Schlüssel von `statusCounts` gleich den bisherigen fünf Status, nur als Typ.
- Kein Produktionsfile in `src` außer `src/lib/types.ts` enthält noch `'replaced'` in Anführungszeichen (grep). Die Zahlen in `fitness-functions.md` (13 → 9; FE 4 → 0, Shared 1, Backend 8) stimmen mit `git grep` auf Basis und Kopf überein.
- Kein anderer Ort im Frontend entscheidet noch nach `replaced` (`PaymentPanel` liest `asksPayment`).
- Ponytail: nichts zu kürzen. Neue Texte gibt es nicht, und an UI-Zuständen ändert sich nichts.

## Nicht bestätigt

- Diese Läufe sind vom Aufrufer gemeldet, ich habe keinen davon wiederholt: lint, check, Backend type-check, `bunx vitest run` (3636), Backend `statement-capabilities` und `api-contracts` (84), E2E statement-detail, contract-detail, documents, statement-reminder (188), fitness.
- Die gemeldeten Rot-Läufe (Capabilities-Test, Mapping-Test, neuer DOM-Test) sind vom Aufrufer gemeldet. Ich habe nur durch Lesen beurteilt, dass sie ohne die Änderung fehlschlagen.
- Den Metrik-Lauf `tools/arch-baseline/05-knowledge.ts` habe ich nicht gestartet, weil er Dateien schreibt. Ich habe ihn mit derselben Regex per `git grep` nachgezählt.
