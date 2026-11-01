# Review 496e, Runde 1 (60d211c~1..60d211c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `backend/src/routes/data-export.ts` nimmt `LANGUAGES` (`backend/src/db/schema.ts:91`, dieselben vier Werte) mit `t.UnionEnum` wie `backend/src/routes/backup.ts:66`; die Werte, die angenommen werden, bleiben gleich, also ändert sich nichts am Verhalten. Die Regex `number` in `src/routes/config/export/+server.ts:23` prüft nur, wie eine Zahl geschrieben ist, damit der CSV-Formelschutz (Zeile 26) einen Saldo wie `-120.50` nicht mit einem Apostroph versieht. Das ist CSV-Escaping, keine Fachregel. Der Eintrag in `tools/fitness/ratchet.json` passt in die Liste `technical`: Pfad und Zeile stimmen genau mit dem Code überein, und die Begründung ist gleich aufgebaut wie die der anderen Einträge («… (technical)»). Der Diff enthält nichts, was nicht zur Anforderung gehört, und keine neuen Texte oder Tests.

## Nicht bestätigt

- `bun run fitness` sauber (vorher rot mit Ä1 und Ä4), Backend type-check sauber, `data-export.pg.test.ts` mit 17 bestandenen Tests, eslint und prettier auf beiden Dateien sauber: vom Aufrufer gemeldet, nicht selbst ausgeführt.
