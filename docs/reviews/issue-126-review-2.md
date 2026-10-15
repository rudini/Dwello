# Code-Review issue-126, Runde 2 (Delta)

Geprüft: `c94cb61..21828c2` (Commits a880f76, 9698846, 21828c2) im Worktree `review-126-code-2`. Alle 15 geänderten Dateien gelesen, dazu `backend/src/services/reminder.service.ts` (ganz), `docs/reviews/issue-126-review-1.md`, `implementation_plan.md`.

Selbst erneut ausgeführt: `bunx vitest run src/__tests__/backend-error.test.ts src/__tests__/statement-pages.dom.test.ts src/__tests__/statements-i18n.test.ts` (92 passed). `bunx prettier <file> | diff <file> -` für die beiden Frontend-Tests, `reminders.pg.test.ts` und `reminder.service.ts`: Die Zeilen des Deltas sind Prettier-sauber. Die übrigen Abweichungen in `backend-error.test.ts` (Zeilen 18 und 77) stammen aus der Zeit vor dieser Änderung.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-8 | Minor | `backend/src/services/reminder.service.ts:58-61` | Der Zweig `TENANT_NO_EMAIL` wurde umgebaut (C-7), ist aber auf keiner Ebene getestet (`grep TENANT_NO_EMAIL` in `backend/src/__tests__`, `src/__tests__` und `tests/e2e` findet nichts). Erreichbar ist er, denn `routes/tenants.ts:35` erlaubt `correspondenceChannel: 'email'` ohne E-Mail-Adresse. Ohne den Zweig liefe `send({ to: null })` in den `catch` und würde `MAIL_DELIVERY_FAILED` statt `TENANT_NO_EMAIL` speichern. Kein Test würde rot. Die Lücke bestand schon vorher, der Umbau berührt aber genau diese Zeilen. |
| C-9 | Minor | `backend/src/__tests__/reminders.pg.test.ts:130,137,154` | C-4 ist nur zum Teil behoben. Der zweite Fall hängt weiter vom ersten ab (`refused` wird dort gesetzt). Allein ausgeführt (`-t "früher gespeicherte"`) ist `refused` `undefined`, und der Fall scheitert ohne klare Aussage. Der Vorschlag aus Runde 1 war ein eigenes Dokument je Fall (`remind(...)` im zweiten Fall). |
| C-10 | Nit | `backend/src/__tests__/reminders.pg.test.ts:138-139` | `logged.mockRestore()` steht nach dem `expect`. Scheitert das `expect`, bleibt `console.error` für den Rest der Datei stumm. Besser zuerst wiederherstellen und danach prüfen, oder `afterEach` verwenden. |
| C-11 | Nit | `messages/it.json:444,913` | In derselben Meldung steht der Ort zweimal verschieden: «pronto per l’invio tra i documenti» und «lo segni come inviato in «Documenti»». de, fr und en nennen den Ort beide Male gleich. |
| C-12 | Nit | `implementation_plan.md:25` | Die Zeile «Files» nennt die neuen Dateien des Deltas nicht (`docs/design/offene-punkte.md`, die Persona-, Fach- und Workflow-Reports). |

Kein Blocker, kein Major.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | behoben | `messages/de.json:444`: «Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach unter «Dokumente» als versendet. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.» Es gibt keinen Rat mehr, die Mahnung erneut zu senden; fr, it und en sagen dasselbe. Den Text prüfen `backend-error.test.ts:121-129` und `statement-pages.dom.test.ts:836-850`; beide Tests sind grün (selbst ausgeführt). |
| C-2 (Minor) | behoben | `messages/en.json:444` verwendet «email» (`i18n-begriffe.md`). |
| C-3 (Minor) | behoben | Der pg-Test prüft mit einem Spy auf `console.error`, dass «550 5.1.1 User unknown» ins Log geht (`reminders.pg.test.ts:134-139`). Zur Reihenfolge von Prüfung und Wiederherstellung siehe C-10. |
| C-4 (Minor) | teilweise | Der Fall hängt nicht mehr von Dokumenten anderer `describe`-Blöcke ab, wohl aber vom vorherigen Fall, siehe C-9. |
| C-5 (Minor) | offen bis zur PR | Laut Plan wird die Abweichung in der PR genannt. Prüfen lässt sich das erst an der PR, siehe «Nicht bestätigt». |
| C-6 (Nit) | behoben | Die Zeilen sind Prettier-formatiert. |
| C-7 (Nit) | behoben | `reminder.service.ts:58-61` speichert `TENANT_NO_EMAIL` vor dem `try`. Die Suche `known` ist weg, und jeder andere Fehler wird geloggt. Das Verhalten ist gleich geblieben, siehe C-8. |

## Bestätigt im Delta

- V-1: `statements_reminder_undelivered` lautet in allen vier Sprachen «{title} … bereit. {reason}». Der Satz zum Ort bezieht sich wieder auf den Titel, und der DOM-Test erwartet diese Reihenfolge.
- V-2: In allen vier Sprachen steht der Ort «Dokumente» / «Documents» / «Documenti» (`nav_documents`) in der Meldung.
- Die Fehlerbehandlung ist gleich geblieben: `MailConfigError` → `MAIL_NOT_CONFIGURED` ohne Log; jeder andere Fehler wird geloggt → `MAIL_DELIVERY_FAILED`. Der Text des Transports wird nur geloggt und nie gespeichert.
- Es gibt keine weiteren Stellen, die den alten Text erwarten (`grep` nach «Mahnung erneut», «Sie liegt in den Dokumenten» und «send the reminder again» in `src`, `tests`, `backend/src` und `messages`).
- O-22 in `offene-punkte.md` ist eine nicht-funktionale Zeile (Bedienbarkeit) mit Ort und Vorschlag. #193 und #194 sind im Plan genannt.
- Der Workflow-Review (a880f76) ändert nur den Report selbst und keine Regel.
- Neue Bildschirmzustände: keine, nur geänderte Texte. Ein neues Szenario ist nicht nötig, weil «No scenario: server-side failure» weiter gilt.
- Das Delta enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `backend/src/__tests__/reminders.pg.test.ts` (13 pass) und `cd backend && bun run type-check`: vom Aufrufer gemeldet, nicht selbst ausgeführt. Ein pg-Lauf schreibt in die Datenbank, ausserdem läuft der Persona-Stack.
- «Test red» der geänderten Texttests (C-1, V-1, V-2: rot mit dem alten Text): vom Aufrufer gemeldet. Plausibel, weil die Tests den vollständigen Text vergleichen.
- Dass `String(logged.mock.calls[0])` die Fehlermeldung von nodemailer mit «550 5.1.1 User unknown» enthält: nur aus dem Code abgeleitet. Laut Aufrufer ist der Test grün.
- C-5 (Abweichung in der PR-Beschreibung) und `No scenario: server-side failure` im PR-Text für `check-issues.mjs`: erst an der PR prüfbar.
- Sprachliche Qualität von fr/it/en: nur gegen `docs/design/i18n-begriffe.md` und `nav_documents` geprüft.
- Inhalt der Persona- und Fach-Reports: nur auf die IDs im Plan abgeglichen, nicht inhaltlich nachgeprüft.
- `test:coverage`, `lint`, `check`, `deepcheck:audit` und E2E für das Delta: vom Aufrufer nicht gemeldet (laut Aufrufer laufen sie vor der PR erneut).
