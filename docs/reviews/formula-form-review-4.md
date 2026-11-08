# Review 4: Merge origin/main in #1200 (d7ba697)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Konfliktauflösung (`git show --remerge-diff d7ba697`): Doc-Kommentar von `saveRecord` (src/lib/server/save-form.ts:7-12) beschreibt beide Pfade richtig; distribution-keys.feature behält beide neuen Szenarien unverändert (#1201 nach dem Lösch-Szenario, danach die drei #1200-Szenarien). Zusammenspiel der Pfade: Die Formelfehler eines `DISTRIBUTION_KEY_NAME_TAKEN` tragen nur `part`, `variable`, `characters` oder keine Parameter, nie `field` (backend/src/services/formula.service.ts:110-137, 197). Ein Namenskonflikt läuft deshalb nie in den `refusedFields`-Pfad, und ein Konflikt ohne Formelfehler hat `causes` undefined (distribution-key.service.ts:138, coded-error.ts:40), also gibt es keinen Fall `[].every()`. Der `refusedFields`-Pfad kehrt vor `options.also` zurück; `also` greift nur bei `DISTRIBUTION_KEY_NAME_TAKEN` und hängt also nie an einer TEXT_TOO_LONG-Abweisung. Backend: main ändert distribution-key.service.ts nicht (Diff 36608d1..d7ba697 leer), sondern nur die Route (`beforeHandle: refuseTooLong(distributionKeys)`, routes/distribution-keys.ts). Diese Prüfung läuft vor dem Handler und damit vor der Reihenfolge von #1200 (zuerst Formel, dann Name). `formula` ist `text` (schema.ts:258) und hat keine Längengrenze. Ein zu langer Name mit ungültiger Formel zeigt deshalb zuerst nur den Namensfehler, wie bei allen Formularen von #1201; das ist so auf main und kein Fehler des Merges. Formular: `{errors}` an `NameTranslations` (main) und Einfügen-Knöpfe/Fokus (#1200) berühren sich nicht.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, Backend-`type-check`; vitest distribution-keys, distribution-keys-pages.dom, formula-errors-i18n, backend-error, backend-codes, open-work; Backend distribution-key-admin.pg, formula-codes, api-contracts.pg. Selbst nichts ausgeführt (kein `node_modules`).
- E2E von distribution-keys.feature: lief laut Aufrufer noch, Ergebnis unbekannt. Durch Lesen geprüft: Das #1201-Szenario nutzt die Formular-Targets per Label «Name», und #1200 ändert das Namensfeld nicht (Diff b3918a5..d7ba697 von DistributionKeyForm.svelte).
