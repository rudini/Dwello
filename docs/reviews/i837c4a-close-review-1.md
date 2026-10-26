# Review i837c4a, Schlussrunde 1 (Fixes 8f47f7da..dc59a6fb, ADR-Text aus 8f47f7da)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2

Keine Blocker, keine Major, keine Minor.

Geprüft:
- C-1: `src/lib/types.ts` exportiert `MasterDataType` nicht mehr. Der Import aus dem Backend-Modul (Zeile 18) bleibt, denn Zeilen 222 und 283 brauchen ihn. Nichts in `src` importiert den Typ aus `$lib/types`.
- C-2: `isActive` steht in keinem Heizprofil- oder Verteilschlüssel-Fixture mehr (`form-selects.dom.test.ts:29`, `heating-profiles-pages.dom.test.ts:48`, `statement-wizard.dom.test.ts:51`). Die übrigen Treffer für `isActive` in `src` und `tests` betreffen nur Mieter.
- ADR 0005, «Zyklus 4a». Alle Aussagen stimmen mit Basis 4dcd0d89 und HEAD überein:
  - `isActive` stand in `DistributionKey` und `HeatingProfile` (Basis `types.ts:210/272`). `toHeatingProfile` setzte es mit `?? true`. Die Testerwartung in `heating-profile.test.ts` ist entfernt.
  - `invoiceCount` war in beiden Services `sql<number>` und ist jetzt `string`, in `backend/src/api/{category,distribution-key}.ts:10/12`.
  - `'predefined' | 'custom'` steht in `src` und `backend/src` ausserhalb der Tests nur noch in `backend/src/api/distribution-key.ts:9`.
  - `DistributionKey` ist abgeleitet (`types.ts:218`). `DistributionKeyRow` ist jetzt die Eingangsform des Mappers in `src/lib/server/distribution-key.ts:14`, `CategoryRow` die in `src/lib/server/category.ts:16`.
  - Die Feldstreuung im ADR, 4 / 12 / 36, entspricht `tools/fitness/ratchet.json`.

## Nicht bestätigt

- Prüfungen des Aufrufers, «vom Aufrufer gemeldet»: `bun run check` (0 Fehler), `bun run lint` und `bunx vitest run` auf den drei geänderten Testdateien (113 bestanden). Einen eigenen Lauf konnte ich nicht machen: `node_modules` im Worktree verweist auf `/home/user/Dwello/node_modules`, und eine Deny-Regel sperrt den Zugriff darauf.
- Im ADR die Werte «Entity-Spiegel 47 → 46» und «Wertelisten 11 → 10»: Sie gehen auf einen `fitness`-Lauf zurück, den ich nicht wiederholt habe. In der ADR-Tabelle selbst stimmen sie mit den Werten von «Nach 3» überein.
