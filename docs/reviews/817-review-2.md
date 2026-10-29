# Code-Review 817, Runde 2 (ea476e3..8a3e898)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-2 | Major | src/routes/config/access-keys/+page.server.ts:36, 44; +page.svelte:93, 117; tests/a11y/screens.json:796-805 | Teilweise offen. Der leere Name hat jetzt ein Szenario und die Zeile `key-create-refused`, und beide Aktionen haben Unit-Tests. Für die beiden Zustände, die nur eine fehlschlagende Anfrage erreicht («nicht erstellt», «nicht widerrufen»), gibt es aber weiterhin kein Szenario. Der Widerrufen-Dialog mit Ablehnung hat ausserdem keine Zeile in a11y und Sprachen |
| C-11 | Minor | src/routes/config/access-keys/CopyButton.svelte:17-19 | Der Zweig `catch` (Meldung `ai_keys_copy_failed`, «von Hand kopieren») hat keinen Test. Der DOM-Test prüft nur den Fall, in dem `writeText` gelingt; die Meldung `ai_keys_copied` prüft er ebenfalls nicht |
| C-12 | Minor | messages/de.json:1952 (`audit_privacy_demo`); src/__tests__/privacy-page.dom.test.ts:146-152 | Der neue Satz der Datenschutzerklärung für die Demo (alle Besucher sehen die Zugangsschlüssel der anderen und können sie widerrufen, kein Personenname) hat keinen Test. Der bestehende DOM-Test prüft mit `toContain` nur den alten ersten Satz und bleibt grün, auch wenn der neue Satz fehlt |

Geschlossen: C-1, C-3, C-4, C-5, C-6, C-7, C-8, C-9, C-10.

## C-2 (Major): Ablehnungen «nicht erstellt» und «nicht widerrufen» ohne Szenario

**Warum falsch:** `CLAUDE.md`, Workflow 1, und `tests/e2e/CLAUDE.md:85` (Failure states) verlangen ein Szenario auch für einen Zustand, den nur eine fehlschlagende Anfrage erreicht. Beide Zustände lassen sich im E2E erreichen: `FailRequests.to('/config/access-keys', { '/create': '' })` und `{ '/revoke': '' }`. Die neuen Tests in `access-keys-actions.test.ts` zeigen nur, was die Aktion zurückgibt. Dass der Dialog `revokeError` anzeigt (`+page.svelte:117`) und offen bleibt, statt die Erfolgsmeldung zu zeigen, prüft kein Test. Der Widerrufen-Dialog mit Ablehnung ist ein eigener Zustand an einer eigenen Stelle (der gefährliche Dialog, nicht der Dialog zum Erstellen). Er gehört deshalb nach `CLAUDE.md`, «Design-Regeln», Process, in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`, wie `advance-delete-refused` (screens.json:19). Den Fall «nicht erstellt» deckt die Zeile `key-create-refused` dem Aussehen nach ab, ein Szenario fehlt trotzdem. Weder die Commit-Nachricht noch `implementation_plan.md:72` nennen einen Grund «No scenario».

**Zeigen:** `grep -rn "not_revoked\|nicht widerrufen\|/revoke" tests/e2e tests/a11y` findet keinen Schritt und keinen Zustand. Ersetzt man `+page.svelte:117` durch `error={undefined}`, bleiben alle Tests grün.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun test src/__tests__/access-key.pg.test.ts` (22 pass), `bunx vitest run --changed origin/main` (634 pass), open-work-, backend-codes- und i18n-Tests, E2E chromium+api für zugangsschluessel, privacy, terms und settings (66 passed), axe- und Sprachzeilen von access-keys, config, privacy und terms (24 passed).
- Die Rotläufe belegt nur die Commit-Nachricht von 8a3e898. Beim Lesen fällt jeder neue Test ohne die Änderung durch: Blättern (`additionalProperties: false` sperrte `limit`), Vertrags-PDF, `documents` statt `reminders`, `ACCESS_KEY_NAME_TOO_LONG`, Link in den Nutzungsbedingungen, «galt bis», Erfolgsmeldung im Szenario, i18n-Regel `revoc`. Die Aktionstests waren laut Nachricht rot, als die Behandlung von 404 und Ablehnung herausgenommen war.
- Der Test der Abrechnung mit `id` legt nur einen Entwurf ohne Dokumente an, `documents.data` ist also leer. Dass Mahnungen mit Mahnstufe durchkommen, zeigt nur der Vergleich mit der API. In `listDocuments` (document.service.ts:27-79) habe ich nachgelesen, dass die Liste kein `content` enthält.
- Ob die Aussage über die Demo stimmt (alle Besucher sehen die Schlüssel der anderen und können sie widerrufen): In `src/routes/config/access-keys` und in `access-key.service.ts` gibt es keine Sonderregel für die Demo. Den Wortlaut hat `fach-reviewer` zu beurteilen, ebenso die geänderten Texte V-7 bis V-11, R-8 und R-10 in fr/it/en.

Geprüft: Blättern mit `limit`/`offset` an allen sechs Listenrouten, `total` in allen Listen-Verträgen; `omit` über einen JSON-Reviver; Name über 100 Zeichen nach dem `trim` mit eigenem Code und Meldung in allen vier Sprachen; Namen für die Erfolgsmeldung vor dem Schliessen gemerkt; CopyButton aus `Button`, Variante nicht primär; Anker `/privacy#ai-keys` vorhanden; `CallTheMcp` über die Web-App (3100); Screenplay-Schichten und neue Ziele, Fragen und Schritte; Glossarzeile und ADR-Pfad.
