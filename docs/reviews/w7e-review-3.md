# Code-Review Runde 3 (abschliessend): #357 Protokoll, Delta 4295ea6..4bafd4a

Worktree: `review-audit-code3` bei 4bafd4a. Gelesen: alle 12 geänderten Dateien des Deltas, dazu `src/lib/server/audit-log.ts`, `src/__tests__/helpers/action.ts`, `backend/src/routes/audit-log.ts`, `tests/contracts/audit-log.json` und `docs/reviews/w7e-review-2.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-24 | Major | `src/routes/config/audit-log/+page.server.ts:10` | Nicht angekündigte Änderung in `load`: `if (!response.ok && response.status !== 404) throw error(...)`. Kein Review-Befund verlangt sie, und kein Test deckt sie ab. Bei einem 404 auf GET stürzt die Seite jetzt mit einem TypeError ab statt die lokalisierte Meldung `record_not_loaded` zu zeigen. Ausserdem nicht Prettier-formatiert. |
| C-25 | Nit | `src/__tests__/audit-log-actions.test.ts:19-25` | Die 404-Antwort `{ error: 'Audit log entry not found' }` kopiert den Backend-Text von Hand, nicht aus `tests/contracts`. Die Action liest den Body nicht, also ist das Argument überflüssig (ponytail: weglassen, `runAction(actions.delete, '', 404, { id: 'a1' })`). |

## C-24 (Major)

**Warum falsch.** Die 404-Ausnahme gehört nur in die `delete`-Action (C-1: Eintrag schon in einem anderen Tab gelöscht). Im Delta wurde sie zusätzlich in `load` übernommen. Weder der Commit (`fix(config): word audit entries after re-reviews`) noch die Beschreibung des Aufrufers erwähnen das. GET `/api/v1/audit-log` (`backend/src/routes/audit-log.ts:9`) antwortet nie mit 404. Kommt trotzdem eins (z. B. ein Backend ohne die Route oder ein falscher `BACKEND_URL`-Pfad), ist der Body `{ error: … }`. Dann ruft `toAuditEntries(undefined)` (`src/lib/server/audit-log.ts:52-53`) `undefined.map` auf. Statt der Fehlerseite «Protokoll konnte nicht geladen werden» in der Sprache der Oberfläche gibt es einen allgemeinen 500er. Das ist eine Verhaltensänderung, die mit der Anforderung nichts zu tun hat («Nothing in the diff is unrelated»), ohne Test und ohne Szenario. Zeile 10 ist ausserdem nicht Prettier-formatiert (`bunx prettier … | diff` zeigt den Umbruch, den Prettier vor `throw` setzen würde). `lint` lief laut Aufrufer nur auf 4295ea6, nicht auf 4bafd4a. ESLint prüft das wegen `eslint-config-prettier` ohnehin nicht.

**Wie zeigen.** Ein Unit-Test für `load` mit einer Fake-`fetch`, die `new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 })` liefert, erwartet `rejects.toMatchObject({ status: 404, body: { message: <record_not_loaded> } })`. Auf 4bafd4a scheitert er mit `TypeError: Cannot read properties of undefined (reading 'map')`. Auf 4295ea6 wäre er grün.

**Fix.** Zeile 10 auf den Stand von 4295ea6 zurücksetzen (`if (!response.ok) throw error(...)`).

## Bestätigt

- C-18: `audit-log-actions.test.ts` deckt Erfolg (204 → 303), 404 → 303, 500 → `fail` mit `audit_delete_failed` (deutscher Text gleich `messages/de.json:1623`) und die kodierte Kennung ab. Beim Lesen bestätigt: Der 404-Test wäre ohne die 404-Verzweigung rot (`fail` wird aufgelöst statt verworfen), der C-19-Test ohne `encodeURIComponent` ebenfalls (`a/1` statt `a%2F1`). Erneut ausgeführt: 12/12 grün (zusammen mit `audit-log-mapping.test.ts`).
- C-19: `+page.server.ts:17` kodiert die Kennung mit `encodeURIComponent(String(id))`.
- C-21: `messages/de.json:1617` lautet «Zahlung zur Abrechnung {number} zurückgesetzt». Der Mapping-Test (`audit-log-mapping.test.ts:74`) ist angepasst. en/fr/it waren schon parallel formuliert («on statement», «du décompte», «del conteggio»).
- C-22: it `audit_privacy_demo` «possono eliminare voci». en `audit_category_included` ist neu formuliert.
- Anna P-2 (Runde 2): `audit_category_included` ist in allen vier Sprachen geändert, der Mapping-Test (`:37`) auf den neuen deutschen Text angepasst. Keine alte Formulierung mehr in `src`, `tests` oder `messages` (grep nach «bleiben es», «stay so», «le restent», «restano tali», «eliminarne»).
- Zurückweisung Anna P-1: Sie hält. Weder `backend/src` noch `backend/scripts` legen Protokolleinträge als Demodaten an. Nur `audit-log.service.ts` schreibt welche, also müssen die Einträge im Persona-Lauf von Hand gesetzt worden sein.
- Zurückweisung C-20: vertretbar (Wiederverwendung eines Schritts). C-23: auf den genannten Grund hin angenommen, nicht nachgeprüft.
- Keine neuen Bildschirme oder Zustände (keine Pflicht für `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`). Keine API-Antwort ist geändert, also auch kein Vertrag. Die Workflow-Notizen und `implementation_plan.md` sind reine Dokumentation, am Text geprüft.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die volle Vitest-Suite (2842) und die volle Backend-Suite (845): vom Aufrufer gemeldet, und zwar auf 4295ea6, nicht auf 4bafd4a. Nicht erneut ausgeführt.
- Voller E2E-Lauf (chromium + api) auf dem Build von 4295ea6: vom Aufrufer gemeldet, läuft noch, Ergebnis unbekannt. Er deckt 4bafd4a nicht ab (C-24 und die Textänderungen kommen erst dort).
- `audit-log-actions`-, `audit-log-mapping`- und i18n-Tests auf 4bafd4a: vom Aufrufer gemeldet. Die ersten beiden habe ich erneut ausgeführt (grün), den i18n-Test nicht.
- Offen und nicht Teil dieses Deltas: Sven P-1 aus Runde 2 (Minor, Fokus nach dem Löschen, `docs/design/personas/sven-w7e-2.md:11`). Im Delta finde ich weder eine Antwort noch eine Zurückweisung.
