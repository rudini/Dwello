# Slice-Review #1316, Runde 2 (Abschlussrunde, 831b41a..04d4be8^1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/db/connection.ts:28 (Tests: heating-profile-admin.pg.test.ts:65, category-admin.pg.test.ts:112, tenant-search.pg.test.ts:31) | Für `%` und `_` geschlossen. Offen bleibt der Teil `\` aus Runde 1: Kein Test zeigt, dass ein `\` in Name oder Suche ein Zeichen und kein Escape ist. Mit `/[%_]/` statt `/[\\%_]/` bestünden alle Tests, obwohl dann die Suche `a\b` auch «ab» findet und der Name `A\_B` mit «A_B» kollidiert. Die Anforderung nennt `\` ausdrücklich. |

Keine Blocker, keine Major.

Geprüft: die drei geänderten pg-Tests (be39f6e) und der Persona-Bericht `docs/design/personas/helga-1316.md` (c866edf, keine Befunde, nur Beobachtungen zu Leertexten ausserhalb von #1316). Die neuen positiven Prüfungen schlagen bei zu starkem Escaping fehl (z. B. `'\\\\$&'`: `70\\% lift` trifft «70% Lift» nicht mehr, ergibt 201 statt 409; die Mietersuche verlangt dann ein echtes `\`). Für Gebäude, Wohnungen und Rechnungen genügt der eine positive Suchtest, weil alle denselben Helper `containing` nutzen. Die Commit-Nachricht begründet, warum es keinen Rot-Lauf gibt (Verhalten der Basis bleibt erhalten, kein Bugfix), und das trifft zu: Die Basis-`ILIKE` findet exakte Namen ebenfalls. Der Merge 04d4be8 betrifft nur `CLAUDE.md` und `.claude/skills/slice-review/SKILL.md` (gemäss Aufrufer, nicht gegengeprüft, siehe unten). Nichts im Delta hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- vom Aufrufer gemeldet: die drei geänderten pg-Testdateien bestehen (28 pass); Prettier auf ihnen sauber; lint, check, fitness, type-check und die betroffenen Tests nach dem Merge (noch ausstehend).
- Den Inhalt des Merges 04d4be8 habe ich nicht gelesen (laut Auftrag nicht Teil des Deltas, ein konfliktfreier Merge von `main`).
