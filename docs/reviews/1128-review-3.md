# Code-Review 1128, Runde 3 (Delta d36608bd3..5a80c428a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | src/routes/config/SaveForm.svelte:55-56 | Die Übersetzungen werden nicht getrimmt, der Server (`field()` in `category.ts:68`, `distribution-key.ts:51`, `heating-profile.ts:37`, dann `nameTranslations`) trimmt sie aber und speichert eine leere als `null`. Ein nur aus Leerzeichen bestehender nameFR ist im Client truthy: `localName` gibt `"  "` zurück, getrimmt `""`, und keine Zeile passt. Die Liste zeigt dann den deutschen Namen, der Fokus landet aber auf keiner Zeile. Kurz `.trim()` ergänzen, wie schon bei `name` in Zeile 53. |

Geschlossen: C-2

Geprüft: `focusSavedRow` vergleicht jetzt `localName(record)`. Der Fallback geht auf `name`, wenn die Übersetzung leer ist, weil `germanName` ohne `nameDE` den Wert `name` nimmt. Die Formularfelder heissen `nameFR`/`nameIT`/`nameEN` (NameTranslations.svelte:39), passend zu den Schlüsseln in SaveForm. Das gilt für alle drei Formulare (Kategorie, Verteilschlüssel, Heizprofil). Der neue DOM-Test (fr) scheitert ohne den Fix, denn er sucht «Beleuchtung DE» und findet keine Zeile. Er stellt die Sprache in `finally` zurück. Das Delta enthält nichts Fremdes, nur die Zeilenumbrüche, die Prettier im bestehenden C-1-Test gesetzt hat.

## Nicht bestätigt

- Die Prüfungen auf 5a80c428a meldet der Aufrufer, sie sind hier nicht erneut ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (196 bestanden), E2E chromium categories.feature + distribution-keys.feature + heating-profiles.feature (57 bestanden), Prettier auf den geänderten Zeilen und der rote Lauf des neuen DOM-Tests vor dem Fix (alle «vom Aufrufer gemeldet»).
- Kein Test zeigt, dass SaveForm.svelte die Felder nameFR/IT/EN an `focusSavedRow` weitergibt. Der DOM-Test prüft nur den Helfer, und die E2E-Szenarien in categories.feature ab Zeile 245 laufen auf Deutsch. Gelesen habe ich das nur im Code (SaveForm.svelte:54-64). Ein Szenario braucht es nicht, denn der Fehler stammt aus derselben, noch nicht gemergten Änderung (d36608bd3 liegt nicht auf origin/main).
