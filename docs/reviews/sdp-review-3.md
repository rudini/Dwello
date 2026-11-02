# Code-Review sdp, Runde 3 (Abschlussrunde, Delta c6c2cf414)

Delta: `git diff HEAD~1 HEAD` (tools/arch-baseline/structure.ts, tools/arch-baseline/structure.test.ts).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde im Delta. |

Geschlossen: alle IDs aus sdp-review-1.md und sdp-review-2.md (laut Aufrufer; das Delta öffnet keine wieder). Die Meldung des «Fallback review» (gerundeter Abstand vor dem Vergleich) ist mit c6c2cf414 behoben.

Geprüft: `structure.ts:158-162`: der Filter vergleicht jetzt den ungerundeten Abstand mit `LIMITS.unstable.gap + 1e-9`, und `round` wird erst danach auf den gemeldeten Wert angewendet; genau 0.2 (auch 0.2 plus Float-Rauschen aus z. B. 0.3 − 0.1) geht durch, 0.2024 nicht. Die Testdaten stimmen nachgerechnet (Ca/Ce zählen eindeutige Modulkanten, `structure.ts:110-112`): s hat Ca 20 und Ce 1, also I = 1/21 ≈ 0.0476; t hat Ca 3 (s, x, y) und Ce 1 (d), also I = 1/4; Abstand 0.2024 → gemeldet 0.2. Alle anderen Kanten haben einen negativen Abstand (u→s: 1/21 − 1; x/y→t: 0.25 − 1; t→d: 0 − 0.25). Ohne die Änderung ergäbe `round(0.2024) = 0.2`, und `0.2 > 0.2` ist falsch; damit wäre die Liste leer, der Test also rot (passt zur gemeldeten roten Ausführung). Die Nutzer in der Fitness-Prüfung (`structureItems`, `unstableFindings`, `fitness.ts:132-135, 305, 407`) übernehmen `unstable` aus `analyze` unverändert, filtern nicht noch einmal nach dem gerundeten Wert und vergleichen Ausnahmen nur über from/to; ihr Verhalten bleibt gleich. Das Delta enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline tools/fitness` (89 bestanden), `bun run lint`, `bun run fitness` (grün, keine neue Kante in (0.2, 0.205]), leerer Prettier-Diff, Commit-Hooks: vom Aufrufer gemeldet, hier nicht ausgeführt.
- Ob es im echten Code eine Kante mit einem Abstand in (0.2, 0.205] gibt, habe ich nicht nachgerechnet (dafür braucht es die CSV-Dateien aus dem Lauf); das beruht nur auf der Meldung des Aufrufers zu `bun run fitness`.
