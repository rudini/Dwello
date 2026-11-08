# Slice-Review #1316, Runde 1 (b0e788b..831b41a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/heating-profile-admin.pg.test.ts:58, category-admin.pg.test.ts:105, tenant-search.pg.test.ts:29 (und die übrigen neuen Suchtests) | Die neuen Tests prüfen nur die negative Hälfte («findet nicht», «nimmt an»). Dass ein Name mit `%`/`_` den Datensatz mit genau diesem Namen weiterhin trifft (doppelter Name «70% Winter» wird weiter mit `HEATING_PROFILE_NAME_TAKEN`/`CATEGORY_NAME_TAKEN` abgelehnt; eine Suche nach `%` findet einen Datensatz, der `%` enthält), zeigt kein Test. Ein falsches Escaping, das zu viel maskiert (z. B. `'\\\\$&'`), bestünde alle Tests, obwohl die Anforderung «matches only a record with exactly that name» und «finds only records containing %» dann bricht. Der Code selbst ist richtig (Parameter, Standard-Escape `\` von PostgreSQL `ILIKE`); ebenso ungetestet bleibt `\` im Namen. |

Keine Blocker, keine Major.

Geprüft: alle 20 geänderten Dateien; jede `ilike`-Stelle in `backend/src/services` nutzt jetzt `literal`/`containing` (übrig nur `calculation.service.ts:492`, ein interner Präfix aus der Abrechnungsnummer, keine Eingabe); `getCategoryByName` deckt auch den KI-Lookup in `llm.service.ts:165,195`; jeder neue pg-Test schlägt auf der Basis fehl (die Fixture-Namen «Hans Müller <token>», «Anna Keller <token>», «Hauswart <token>», «2.01», «Lindenhof <token>», «… A <token>» passen auf das unmaskierte `_`/`%`); das Szenario ist auf der Basis rot (eigener Mieter «Hans Müller <12 Hex>» passt auf `%Hans_Müller%`), hat den positiven Anker `tenants-empty` vor dem Zählen, nutzt nur Tasks/Questions, keine UI-Texte oder neuen Bildschirme; Designentscheid `literal`/`containing` in `db/connection.ts` ist wegen der Ratchet-Grenzen nachvollziehbar und fügt keinem Service eine Abhängigkeit hinzu; ponytail-review: der Inline-Escape aus #1305 ist durch den Helper ersetzt, nichts Ungenutztes übrig (Lean already).

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `cd backend && bun run test` (2169 pass, 97.3 % Zeilen), `tenants.feature` auf chromium (10 passed), die Rot-Läufe des Szenarios und der pg-Tests (inkl. Gebäude-/Wohnungssuche durch Herausnehmen des Escapes).
- Nicht ausgeführt (keine `node_modules` im Worktree): ob `fitness` mit den Helpern in `word-search.ts` tatsächlich an `contract.service.ts` (534 > 533) und `be:services/statement` (22 > 21) scheiterte; nur aus der Begründung übernommen, nicht nachgerechnet.
