# Code-Review 1375b, Runde 1 (b5b09639..de779f57)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | src/routes/statements/+page.svelte:147 | `...(amount && { paidAmount: amount })` lässt auch einen leeren Betrag weg: ein geleertes Feld «Betrag» (Saldo > 0) wird als ganze Zahlung gespeichert statt abgelehnt, und die Meldung sagt «Teilzahlung erfasst» |

## C-1 (Major): leerer Betrag wird still zur ganzen Zahlung

`signedPaid` (src/lib/statement.ts:75-76) gibt bei einem Saldo > 0 `amount.trim()` zurück, also `''`, wenn der Liegenschaftsverwalter das vorbefüllte Feld «Betrag» leert. Ein `''` ist falsy, also fehlt `paidAmount` im Formular, nicht nur bei `undefined` (kein Geld fliesst, #94), wie der Kommentar in Zeile 143 und die Commit-Nachricht sagen.

- Basis (b5b09639, auch f75f26ff): JSON mit `"paidAmount":""`, dann `markStatementPaid` (src/lib/server/statement-actions.ts:30): `'' !== undefined` und `FRANCS.test('')` schlägt fehl, also 400 mit `backend_statement_paid_amount_invalid`. Der Dialog zeigt den Fehler, nichts wird gespeichert.
- Jetzt: kein `paidAmount`, also «none: all of it» (statement-actions.ts:26). Die Abrechnung wird als voll bezahlt gespeichert, obwohl kein Betrag eingegeben wurde. Danach meldet der Toast wegen `isPartPayment(paying, '')` (`Number('') = 0 < offener Betrag`, statement.ts:79-80) `statements_part_payment_recorded`, also «Teilzahlung erfasst», während die Abrechnung den Status «Bezahlt» hat. Bei Saldo < 0 tritt das nicht auf (`'-'` ist truthy und wird abgelehnt). So weichen Liste und Detailseite voneinander ab, denn die Detailseite schickt `''` weiter (src/routes/statements/[id]/+page.svelte:118-119, `signed === undefined ? {} : …`).

Nachweis: Ein DOM-Test in `statement-pages.dom.test.ts` mit `list([statement({ status: 'sent' })])` öffnet den Dialog, leert `paid-amount-input` und bestätigt. Erwartet wird der Body `{ paidDate, periodEnd: '2024-12-31', paidAmount: '' }`. Heute kommt ein Body ohne `paidAmount` an, der Test schlägt also fehl. Fix: `...(amount !== undefined && { paidAmount: amount })`. Das ändert die Struktur nicht und wird mit dem Test rot und danach grün gesehen.

## Nicht bestätigt

- Vom Aufrufer gemeldet und nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (4882), `fitness --base origin/main --structure` (0 Fehler), E2E chromium «Zahlungseingang direkt aus der Liste» gegen einen frischen Production-Build, Rot-Läufe des 415-Tests, des Tests «als Formular» und des Tests «kein Geld fliesst».
- SvelteKits `csrf.checkOrigin` (Standard `true`, svelte.config.js setzt nichts anderes) wertet `multipart/form-data`, `application/x-www-form-urlencoded` und `text/plain` ohne Rücksicht auf Gross- und Kleinschreibung als Formular. Das ist aus meiner Kenntnis von `@sveltejs/kit` (`is_form_content_type`) übernommen. Im Worktree gibt es kein `node_modules`, die Quelle konnte ich nicht lesen.
- Geprüft mit Node v22.23.4 (undici `Request.formData()`): Abgelehnt werden JSON, ein String-Body (text/plain;charset=UTF-8), explizites `text/plain`, kein Body, ein Blob ohne Typ und `multipart/form-data` ohne Boundary. Angenommen werden nur URL-encoded (auch in Grossschreibung mit charset) und multipart. Beide sind Formular-Typen, die der Origin-Check abdeckt. Der 415-Schutz hat in dieser Laufzeit also keine Lücke. Ob adapter-node im Production-Build denselben undici-`Request` nutzt, habe ich nicht im Quelltext gesehen. Der gemeldete E2E-Lauf spricht dafür.

Geprüft: alle sieben Dateien des Deltas; Route mit 415 (`error(415)` im `catch` wirft einen HttpError, Test erwartet `rejects`, ohne die Änderung rot, weil b5b09639 403 als Response gibt); Helper `fakeBff` in `dom.ts` (URLSearchParams wird zu einem Objekt, FormData und JSON unverändert); der Test «kein Geld fliesst» hält Verhalten fest, das b5b09639 schon zeigt (JSON.stringify lässt `undefined` weg), und die Commit-Nachricht nennt das; send-reminder bleibt gelöscht, ohne Aufrufer; keine neuen Texte, Bildschirme oder Verträge.
