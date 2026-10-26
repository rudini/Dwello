# Code-Review #852, Runde 1 (cdd47d7d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/tenant-documents.feature:59-65, src/lib/server/documents.ts:62-64 | Das neue Szenario legt für ein Dokument, das es nicht mehr gibt, die Meldung «Das Dokument wurde nicht gelöscht. Versuchen Sie es erneut.» als Spezifikation fest. Die Meldung sagt das Gegenteil dessen, was geschehen ist, und der Rat führt in eine Schleife. |
| C-2 | Minor | src/lib/server/distribution-key.ts:114 | `backendMessage({ ...errorCodes[i], error }, error)` gibt den eigenen Text des Backends als Ersatz mit. Kennt die UI für einen Code der Formelprüfung keine Meldung, zeigt «Formel testen» weiterhin den deutschen Text des Backends, auch in fr/it/en. Das widerspricht der Entscheidung «nie der eigene Text des Backends». |
| C-3 | Minor | src/__tests__/distribution-keys.test.ts:108-111 | Der Test erwartet `formulaRefused.error`, also den eigenen Text des Backends. Er besteht genauso, wenn `backendMessage` wie vor #852 `body.error` zeigt, und kann deshalb nicht zeigen, dass die Meldung aus dem Code stammt. Die übrigen umgestellten Tests erwarten einen festen Satz. |
| C-4 | Minor | src/lib/backend-error.ts:7-10 | `BackendError.error` und `BackendError.message` liest nach der Änderung kein Code mehr (geprüft in allen Dateien, die `BackendError` importieren). Der Kommentar beschreibt weiterhin `message` «as apiCall passes it on», als würde das Feld ausgewertet. |

## C-1 (Major)

**Warum falsch:** Das Backend antwortet auf `DELETE /documents/:id` für ein schon gelöschtes Dokument ohne Code mit 404 «Document not found» (`backend/src/routes/documents.ts:70-71`). Nach der Änderung zeigt der Dialog den Ersatz `tenants_document_delete_failed`. Diese Meldung behauptet, das Dokument sei noch da, und rät zu einem neuen Versuch. Jeder neue Versuch endet wieder mit 404 und derselben Meldung. Nach `fail()` bleibt die Zeile in der Liste stehen, weil nichts die Seite neu lädt. Erst ein Neuladen zeigt, dass das Dokument weg ist.

Das verletzt die Copy-Regel in `CLAUDE.md`, «errors say what happened and what to do», für die Zielgruppe mit wenig Erfahrung. Es widerspricht auch der Prüfung, die dieselbe Änderung in `slice-review` aufnimmt: «each refusal the UI shows carries a code with a message `backend_<code>`». Vorher war die Meldung wenigstens inhaltlich richtig, wenn auch englisch. Weil das Szenario ohne `@wip` auf `main` landet, braucht eine spätere Korrektur des Satzes eine Freigabe nach `Spec change approved`.

**So zeigt man es:** Das Szenario selbst laufen lassen. Danach im offenen Dialog ein zweites Mal «Löschen» bestätigen: dieselbe Meldung erscheint, und das Dokument steht weiterhin in der Liste.

**Behebung:** Die 404-Antwort bekommt einen Code, z. B. `DOCUMENT_NOT_FOUND`, mit `backend_document_not_found` in allen vier Sprachen. Ein möglicher Satz: «Das Dokument gibt es nicht mehr. Laden Sie die Seite neu.» Dazu einen Vertrag in `tests/contracts` und die passende Zeile im Szenario anpassen. Das Szenario ist neu, also ist die Anpassung frei.

Hat der Product Owner genau diesen Satz für dieses Szenario entschieden, gehört der Befund unter «Blocked on me». Aus der Anforderung geht nur hervor, dass das Szenario existieren soll.

Geschlossen: –

Geprüft: alle Aufrufer von `backendMessage` (src/lib/server, src/routes). Wo der Ersatz `''` ist, gibt es auch vorher keinen Text: Codes sind Konstanten, Ursachen und `{ code, params }` haben kein `error`. Der einzige Aufrufer, den vorher der Text füllte (Tankbestand), ist umgestellt und getestet. Die Codes und deutschen Meldungen der sechs neuen Verträge stimmen mit `backend/src/services/*` und `messages/de.json` überein. Die Aufräumreihenfolge in `api-contracts.pg.test.ts` stimmt. Szenario und Steps halten die Screenplay-Schichten ein (`seed` für die Vorbedingung, vorhandene Steps). Die Zeile in `slice-review` deckt die drei verlangten Prüfungen ab. Die Commit-Nachricht nennt die Verträge als festgehaltenes Verhalten.

## Nicht bestätigt

- `bunx vitest run` (3701 Tests), `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun test src/__tests__/api-contracts.pg.test.ts -t "Ablehnungen mit Code"` (6) und E2E `tenant-documents.feature` (9, das neue Szenario vorher rot): vom Aufrufer gemeldet. Mein erneuter Lauf der geänderten Testdateien wurde abgelehnt, weil der Zugriff auf `node_modules` des Haupt-Checkouts gesperrt ist.
- Rot vor der Änderung: Für die drei Tests in `backend-error.test.ts`, die vier umbenannten Tests in `building-actions.test.ts` und die neue Tankbestand-Zeile habe ich es nur durch Lesen bestätigt. Der alte Code gab `body.error` zurück, bzw. beim Tankbestand mit unbekanntem Code `backendMessage(refused, '')`, also den Text aus `fuel-stock-date-taken.json`.
- `drift()` in `api-contracts.pg.test.ts` vergleicht nur die Form, nicht die Werte. Dass das Backend genau die Codes der sechs neuen Verträge sendet, prüft also kein Test. Ich habe es nur in `backend/src/services/{category,heating-profile,distribution-key,formula}.service.ts` nachgelesen. Bei den bestehenden Verträgen ist es genauso.
- Der Dialog «Dokument löschen» mit Fehlermeldung hat keine eigene Zeile in `tests/a11y/screens.json` (dort steht nur `document-delete-dialog`, offen). Der Zustand war schon vor der Änderung erreichbar, daher habe ich ihn nicht als Befund gezählt. Ohne Zeile prüft aber keine Sprachen-Prüfung fr/it/en in genau diesem Zustand.
- Issue #852 nennt in «Done means» einen Lint- oder Guard-Test gegen BFF- oder Frontend-Code, der `error` ohne `backendMessage()` zeigt. Er ist nicht im Diff. Die Anforderung des Aufrufers für diesen Slice verlangt ihn nicht, darum habe ich ihn nicht geprüft.
