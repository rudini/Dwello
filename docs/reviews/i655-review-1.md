# Review #655, Runde 1 (138d2082..1da11ad6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `saveRecord` (`src/lib/server/save-form.ts:32`) legt eine 409-Ablehnung auf `options.conflict`. Beide Optionen setzen jetzt `conflict: 'name'`, und die Distribution-Key-Optionen gelten für Erfassen und Bearbeiten. Die Services werfen `Conflict` nur bei `*_NAME_TAKEN` (`distribution-key.service.ts:135`, `heating-profile.service.ts:157`), andere 409-Ablehnungen (Standard löschen) laufen über `deleteRecord`, nicht über `saveRecord`. Beide Formulare zeigen `errors.name` am Feld Name (`HeatingProfileForm.svelte:59`, `DistributionKeyForm.svelte:46`). Die Meldungen `backend_*_name_taken` stehen in allen vier `messages/*.json`; neue UI-Texte gibt es keine. Der neue Vertrag `distribution-key-name-taken.json` und sein pg-Test sind vorhanden, der Commit-Text nennt ihn als Festhalten von bestehendem Verhalten. Die Unit-Tests sind ohne die Änderung rot (`errors.form` statt `errors.name`). Auch die Szenarien sind ohne die Änderung rot: Die Meldung fehlt dann in der Beschreibung des Felds Name. Die Namen kommen aus dem Grundlage-Schritt (`names.get`), die Monatsanteile ergeben zusammen 100 %. Die Steps rufen nur Tasks und Questions auf, die Question liefert den Text. Die Features enthalten keine UI-Wörter, die bestehenden Steps sind unverändert. Zu a11y: Der 409-Zustand bestand schon vorher und hatte keine Zeile in `screens.json`. Die Fehleranzeige am Feld Name derselben Formular-Komponente ist durch `distribution-key-new/submit-empty` und `heating-profile-edit/submit-cleared` abgedeckt. Es entsteht keine Variante mit eigenen Bedienelementen, die Begründung des Aufrufers hält also.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die Vitest-Läufe (`distribution-keys`, `heating-profiles`, `open-work`), `api-contracts.pg.test.ts` sowie die E2E-Läufe von `heating-profiles.feature` und `distribution-keys.feature` auf chromium: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Die Rot-Läufe der beiden `@wip`-Szenarien und der Unit-Tests: vom Aufrufer gemeldet. Ich habe sie nur durch Lesen beurteilt (siehe oben).
- Die Bearbeitungsseiten (PUT mit vergebenem Namen) haben keinen eigenen Test. Sie verwenden dieselben `options` beziehungsweise dieselbe `saveHeatingProfile`-Funktion, deshalb habe ich das nur durch Lesen bestätigt.
