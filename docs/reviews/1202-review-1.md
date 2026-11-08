# Code-Review 1202, Runde 1 (e3a0a5b..5b5404b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/settings.feature:123-132 | Das neue Szenario läuft ohne `@einstellungen-global` parallel zu «Eigenen Kontoinhaber hinterlegen», das genau dieselben Werte (Erika Muster, Seeweg 5, 6003, Luzern) speichert. Ohne die Korrektur besteht es dann trotzdem: es hängt von den Daten eines anderen Szenarios ab (Regel Isolation) |
| C-2 | Minor | src/routes/config/+page.svelte:42-45 | `holder` wird nur beim Öffnen gefüllt und folgt `data.settings` nach dem Speichern nicht mehr. Wer mit Häkchen speichert (der Kontoinhaber wird gelöscht) und das Häkchen danach entfernt, sieht wieder die gelöschten Angaben, obwohl nichts davon gespeichert ist; vorher waren die Felder leer. Auch ein Wert, den das Speichern kürzt (`trim()` in `src/lib/server/settings.ts:66`), bleibt so stehen, wie er eingegeben wurde. Keine Prüfung deckt das ab |

## C-1 (Major): Szenario kann ohne die Korrektur bestehen

`tests/e2e/fixtures/test.ts:102-106`: Nur Szenarien mit `@einstellungen-global` erhalten die Einstellungen exklusiv (über die Sperre). Das neue Szenario hat dieses Tag nicht. «Eigenen Kontoinhaber hinterlegen» (settings.feature:77-89) speichert den Kontoinhaber «Erika Muster», «Seeweg 5», «6003», «Luzern», und erst danach setzt das Fixture ihn auf den Absender zurück. Öffnet das neue Szenario die Seite in dieser Zeit, ist das Häkchen entfernt und `data.settings` enthält genau diese Werte. Ohne die Korrektur montiert der erneute Wechsel die Felder neu, mit `value={settings.accountHolderName}` usw. Die Felder zeigen dann die gespeicherten Werte, und die sind gleich wie die eingegebenen. Der `Dann`-Schritt besteht.

So lässt sich das zeigen: Den Fix in `+page.svelte`/`SettingField.svelte` zurücknehmen. In der Grundlage einen Kontoinhaber «Erika Muster», «Seeweg 5», «6003 Luzern» hinterlegen, so wie es parallel geschieht (z. B. mit dem Schritt `das Konto der IBAN … gehört …`). Das Szenario wird dann grün. Das in der Runde des Aufrufers gesehene Rot (Received "") hängt also vom zeitlichen Ablauf ab. `tests/e2e/CLAUDE.md`, «Rules», Isolation: «Never rely on data from another scenario». Nach `CLAUDE.md` «Done means» gilt ein Verstoss gegen diese Regel als Major.

Behebung: In der Tabelle und im `Dann`-Schritt Werte verwenden, die kein anderes Szenario speichert (z. B. «Hans Beispiel», «Seeweg 7», «6004», «Luzern»). Dann zeigt eine Seite ohne Korrektur entweder "" oder die gespeicherten Werte und schlägt in beiden Fällen fehl. Der DOM-Test (`src/__tests__/config-page.dom.test.ts:75-107`) ist davon nicht betroffen, er wird ohne die Korrektur zuverlässig rot.

## Nicht bestätigt

- `bun run check`, `bun run lint`, `bunx vitest run src/__tests__/config-page.dom.test.ts src/__tests__/ui-fields.dom.test.ts` (20 passed), `bun run test:e2e -- --project=chromium tests/e2e/features/settings.feature` (30 passed) und die Commit-Hooks: vom Aufrufer gemeldet.
- Das Rot des DOM-Tests und des Szenarios vor der Korrektur: vom Aufrufer gemeldet. Beim Lesen wird der DOM-Test ohne die Korrektur rot (`noHolder` gespeichert, neu montiert mit `''`). Für das Szenario gilt das nur, solange kein paralleles Szenario dieselben Werte speichert (C-1).
- Ob `bind:value` in `TextInput` (`src/lib/ui`) die Eingabe bis in `holder` weitergibt: aus dem DOM-Test geschlossen, `TextInput.svelte` nicht gelesen.

Geprüft: Speichern mit Häkchen löscht weiterhin (`src/lib/server/settings.ts:60-69` unverändert, Szenario «Den Absender wieder als Kontoinhaber angeben» unverändert); die anderen Aufrufer von `SettingField` übergeben `value` weiterhin nur in eine Richtung; kein neuer UI-Text, kein neuer Bildschirmzustand; die Schritte rufen nur Tasks und Questions auf; die Feature-Sprache beschreibt das Ziel, nicht die Bedienung; keine Änderung, die mit der Anforderung nichts zu tun hat.
