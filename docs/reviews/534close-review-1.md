# Code-Review 534 Abschluss, Runde 1 (0db2cfb..701cd17)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/statements/[id]/MetadataCard.svelte:67-71 | Wenn ein neues PDF zu versenden ist und der Liegenschaftsverwalter danach das PDF der Abrechnung erstellt oder herunterlädt, zeigt «PDF erstellt» vor dem ersten Versand die Zeit dieses späteren PDF. Das ist genau der Fall, den P-1 beheben soll. |
| C-2 | Major | tests/e2e/features/statement-detail.feature (fehlt) | Die sichtbare Änderung von 701cd17 hat kein Szenario ohne `@wip`. Gemeint ist: «PDF erstellt» bleibt nach einer Änderung stehen, und «Neues PDF erstellt» kommt mit Uhrzeit dazu. Der Commit nennt auch kein `No scenario:`. |
| C-3 | Minor | src/__tests__/statement-pages.dom.test.ts:1911 | `indexOf('PDF erstellt …15:01') < indexOf('Versendet per Brief')` ist auch dann erfüllt, wenn die Zeile fehlt (-1). Die geänderte Prüfung zeigt also nicht, dass das erste PDF im Zweig `resent.length && pdfGeneratedAt` stehen bleibt. |
| C-4 | Minor | backend/src/services/delivery.ts:26-31, backend/src/services/statement.service.ts:359-360 | `resent[].createdAt` und `newPdfMadeAt` (`createdAt` des Dokuments; `null`, wenn die Abrechnung nicht «Versendet» ist) haben keinen Backend-Test. Kein `*.pg.test.ts` liest `resent` oder `newPdfMadeAt`. Der Contract zeigt nur `null`. |

## C-1

`newPdf` ist falsch, sobald `newPdfMadeAt` gesetzt ist (Z. 67). `firstPdfAt` nimmt `delivery.sentAt` aber nur, wenn `resent.length || !pdfGeneratedAt || newPdf` gilt (Z. 69). `keepNewPdf` leert `pdfGeneratedAt` (backend/src/services/statement-send.service.ts:168). Danach erstellt `getStatementPdf` das PDF beim nächsten «PDF erstellen» oder Herunterladen neu und setzt `pdfGeneratedAt` auf jetzt (statement-pdf.service.ts:376-379, 346). Ohne erneuten Versand ist dann jeder Teil der Bedingung falsch, und `firstPdfAt = pdfGeneratedAt`. Der Verlauf lautet dann:

Erstellt · PDF erstellt <Zeit des neu erstellten PDF> · Versendet per Brief <früherer Tag> · Neues PDF erstellt <newPdfMadeAt>

Die Zeile des ersten PDF trägt also die Zeit eines späteren PDF und steht vor dem Versand, mit dem dieses PDF nichts zu tun hat. Vor der Änderung erschien dieses PDF als «Neues PDF erstellt» nach dem Versand (`newPdf` wahr). 701cd17 macht daraus also einen Rückschritt.

Erreichbar ist der Zustand im Szenario «Nach einer neuen Bemerkung bleibt das versendete PDF …» (statement-detail.feature:1219-1231): versenden, Bemerkung festhalten, «das PDF der Abrechnung erstellt». Der Schritt prüft dort nur `/Versendet.*Neues PDF erstellt/` (statement-detail.steps.ts:746). Dieses Muster trifft die Zeile von `newPdfMadeAt` und übersieht so den Fehler.

So zeigt man ihn: einen DOM-Test wie den neuen Test bei Z. 1916, aber mit `pdfGeneratedAt: '2026-10-31T15:20:00Z'`, `resent: []`, `newPdfMadeAt: '2026-10-31T15:10:00Z'` und `delivery.sentAt` 15:01Z. Erwartet wird «PDF erstellt 31.10.2026, 16:01». Gezeigt wird «PDF erstellt 31.10.2026, 16:20».

## C-2

Die Änderung zeigt neue Zeilen im Verlauf der Detailseite: das erste PDF bleibt nach einer Änderung stehen, und «Neues PDF erstellt» mit Uhrzeit kommt dazu, vor und nach dem Markieren. Das ist eine Verhaltensänderung, die der Liegenschaftsverwalter sieht (Antwort auf Persona P-1). Nach `CLAUDE.md`, Workflow 1, braucht sie ein Szenario. Der E2E-Stack erreicht den Zustand: die Szenarien bei statement-detail.feature:1235 und 1249 kommen bis dorthin. Kein Szenario prüft aber, dass «PDF erstellt» nach dem Festhalten der Bemerkung bleibt oder dass «Neues PDF erstellt» vor «Neues PDF versendet per Brief» steht. So zeigt man es: «Neues PDF erstellt» oder «PDF erstellt» in tests/e2e/features suchen. Es gibt keinen Treffer nach einer Änderung. Ein neues Szenario oder eine neue Zeile in den Examples ist frei. Mit einem Szenario für den Fall von C-1 wäre auch C-1 aufgefallen.

## Nicht bestätigt

- Lint, check, Backend-Type-Check, fitness, `bunx vitest run --changed origin/main` (3852), die pg-Tests statement-mail und api-contracts (118), E2E chromium statement-redeliver, statement-detail, statement-reminder, documents und statement-send (146), die axe- und Sprach-Zeilen von statement-sent-detail und documents (26), und dass der neue DOM-Test vorher rot war: vom Aufrufer gemeldet.
- Ob der neue DOM-Test (statement-pages.dom.test.ts:1916) ohne 701cd17 rot ist, habe ich nur durch Lesen geprüft. Mit `pdfGeneratedAt: null` und `resent` gab es vorher keine Zeile «PDF erstellt», der Test schlägt also fehl.
- Der Merge von origin/main (#947) liegt nicht im Bereich und ist nicht geprüft.

Geprüft: Wortlaut von `documents_print_now_new_pdf` in den vier `messages/*.json` und der zugehörige DOM-Test; der Action-Test `newPdf: true` (documents.test.ts:60, im Commit als Pinning genannt, Verhalten liegt auf der Basis vor); Mapper `toStatement`, Typen, Contract und API-Doku zu `newPdfMadeAt`; `sendingsOf` und `laterSendings`.
