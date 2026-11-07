# Review #1175, Runde 1 (426530f gegen origin/main)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 10 Dateien des Diffs. Beispiele an Name/Strasse/PLZ/Ort wie beim Absender (gleiche Keys, «8001»); neuer Key `settings_account_holder_name_example` in allen vier `messages/*.json`, Werte wie `tenants_example_*`; `optional` von `SettingField` an `TextInput`/`Field` durchgereicht (Label «(optional)», `aria-required={required ?? !optional}` → false, passt zu «Strasse bleibt freiwillig» in `settings.steps.ts:144`); Szenario ohne `@wip`, Schritte nur über Tasks/Questions, `settingName` fragt den Wert (Accessible Name) selbst ab, nichts gespeichert (Isolation gewahrt, `Uncheck` idempotent bei parallel gespeichertem Kontoinhaber); jeder neue Schritt fällt ohne die Änderung rot (leere Beschreibung bzw. Name ohne «(optional)»); kein neuer Zustand, die Beispiele erscheinen in den bestehenden Looks `account-holder`/`account-holder-missing`; nur Token-Klassen, kein neues Markup; keine fremden Änderungen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (539 Tests), Tests, die messages/ oder die Einstellungsseite als Text lesen (611 Tests), E2E chromium `-g Kontoinhaber` (7) und `-g account-holder` (a11y- und Sprach-Looks, 4): vom Aufrufer gemeldet.
- Rot-Läufe des neuen Szenarios (Name-Beispiel, dann «(optional)»): vom Aufrufer gemeldet; per Lesen plausibel.
- Der Wechsel von `aria-required` der Kontoinhaber-Strasse auf false ist auf Seitenebene von keinem Test festgehalten; geprüft nur per Lesen von `src/lib/ui/TextInput.svelte:66`.
