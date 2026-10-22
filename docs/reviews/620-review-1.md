# Code-Review #620, Runde 1 (00d95ad..1e0f8b8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/setup.service.ts:50, backend/src/__tests__/setup.pg.test.ts:161-168 | Kein Test zeigt die Bedingung `&& !llmConfig.byOperator`. Der Test «bietet keine Wahl, wenn der Betreiber die KI festgelegt hat …» prüft nur, dass `ki_settings` leer bleibt, nicht die Antwort von `setUp`. Ohne die Bedingung wirft `saveKiSettings` `KI_SET_BY_OPERATOR` (ki-settings.service.ts:141). Das geschieht erst, nachdem das Konto angelegt ist, also ist `ki_settings` trotzdem leer und der Test bleibt grün. Die Einrichtung antwortet dann mit einem Fehler statt 201, obwohl das Konto schon besteht. Fehlt: `expect(status).toBe(201)`. |
| C-2 | Minor | src/routes/dashboard/+page.server.ts:167-168, src/routes/dashboard/KiModelNotice.svelte:24-34 | Die Übersicht leitet «noch keine KI gewählt» allein aus `mode === 'none'` ab. Wählt der Liegenschaftsverwalter unter «Einstellungen» › «KI» bewusst «Keine KI» (bestehendes Verhalten aus #580), sagt die Übersicht danach dauerhaft «Sie haben noch keine KI gewählt. … Wählen Sie die KI unter …». Das ist ein falscher Text. Die Daten unterscheiden «Später entscheiden» nicht von «Keine KI»: Das folgt aus dem Entscheid im Issue («später entscheiden» speichert «Keine KI»). Eine Korrektur braucht darum eventuell eine Produktentscheidung (z. B. nur bis zur ersten Wahl auf der Seite «KI»). |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, backend `bun run type-check`;
  - `bunx vitest run` (3661 grün);
  - backend `setup.pg`, `api-contracts.pg`, ki-settings (107 grün);
  - E2E `einrichtung.feature` und `ki-einstellungen.feature` (37);
  - a11y- und Sprach-Zeilen für dashboard, setup und ki-settings (42);
  - fallow.
- Dass «Später entscheiden» den laufenden Download des Modells beendet, zeigt nur der Code: `setUpFirstAccount` ruft `saveKiSettings`, und dessen Abbruch ist in den Tests von #580 geprüft. Die neuen Tests prüfen nur `mode: none`. Kein E2E-Schritt fragt den KI-Stub nach einem abgebrochenen Download.

Geprüft:
- Backend-Route und Service, BFF (`setupState`, `setUpDwello`), Setup-Seite mit RadioGroup (vorgewählt `local`, ohne Wahl bei `kiChoice: false`) und Übersicht samt Link auf `/config/ki`;
- Texte in allen vier `messages/*.json`, Contract `setup-needed.json`, `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` (`ki-none`);
- Screenplay-Schichten und Aufräumen der frischen Installation (`cleanUp` setzt die lokale KI zurück);
- Rot jedes neuen Tests und Szenarios durch Lesen (die Wächter für den Betreiber werden rot, wenn man ihre Bedingung entfernt, ausser C-1);
- Doku in `docs/api-specification.md`, README und `docs/installation.md`;
- ponytail-review: keine ungenutzten Reste, `setupNeeded` wird weiter von login und privacy benutzt.
