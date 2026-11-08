# Review #1183, Runde 1 (2168a86 gegen origin/main 5af16a0)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 7 geänderten Dateien. `saveOnEnter` (`src/lib/ui/save-on-enter.ts:6-17`) ist das aus `SaveForm.svelte` verschobene #678-Verhalten mit `saving` als Getter, SaveForm verhält sich gleich (`SaveForm.svelte:88`). Auf der KI-Seite (`src/routes/config/ki/+page.svelte:77`) schickt Enter in einem Feld das Formular ohne Submitter ab, also an `?/save`, nicht an das zuerst stehende `formaction="?/check"` (`ProviderChecklist.svelte:32`); während des Speicherns sperrt `busy === '?/save'`. Enter während einer laufenden Prüfung speichert, wie ein Klick auf «KI speichern» es schon tut (die Basis verhält sich gleich). Beide DOM-Tests wären ohne die Änderung rot: das synthetische keydown löst in jsdom kein implizites Abschicken aus (`browserDefault` true, `sent` leer), und ohne die Sperre stünde `[null]` in `sent`. Das Szenario wäre auf der Basis rot (Enter löst «Verbindung prüfen» aus, `Wait.until(kiSaveAnswer)` läuft ab) und zeigt das Speichern über die Datenschutzerklärung. Der Step ruft nur einen Task auf, der Task wartet auf die Antwort; kein Szenario ohne `@wip` geändert; keine neuen Texte, Bildschirme oder Zustände; ponytail-review: der gemeinsame Helfer ersetzt die Kopie, nichts bleibt ungenutzt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: Szenario als @wip rot, danach grün; E2E chromium ki-einstellungen, categories, distribution-keys, heating-profiles (103 bestanden); DOM-Test «speichert mit Enter in einem Feld, ohne die Verbindung zu prüfen» rot vor der Änderung; «speichert mit Enter nicht ein zweites Mal, solange das Speichern läuft» rot ohne die Sperre; `bunx vitest run --changed origin/main` (170 bestanden), design-guard und open-work; `bun run lint`, `bun run check`, `bun run fitness`, Backend-Type-Check; Commit-Hooks.
- Ob Chromium bei Enter auf Radio und Checkbox (Modus-Wahl, `ki-privacy-confirm`) nativ abschicken würde: nicht geprüft; der Helfer speichert dort wie in SaveForm seit #678.
