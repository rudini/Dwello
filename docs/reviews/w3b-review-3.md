# Code-Review W3b (Runde 3, abschliessend), Delta `git diff a41ab7c c423a45`

Worktree: `review-w3b-code3`, HEAD `c423a45` (fix(tests): name heating profile when generating). Der Merge `a41ab7c` bringt nur main und löst nur `docs/archive/implementation-plan-verlauf.md` auf. Das Delta umfasst damit 4 Dateien, und ich habe alle gelesen: `statement-generate.feature`, `statement-generate.steps.ts`, `offene-punkte.md` und das Archiv.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | `tests/e2e/steps/statement-generate.steps.ts:76` | Der Kommentar «the wizard preselects a heating profile …» steht nur über dem Given. Er gilt aber genauso für das When `:68`, das denselben Grund hat. |

Kein Blocker und kein Major.

## Bestätigt

- **Anforderung** (`tests/e2e/CLAUDE.md:73`, «A result that depends on a choice the app preselects names that choice»): Jedes Szenario in `statement-generate.feature`, das Abrechnungen erstellt, nennt jetzt «Heizung Mittelland». Das sind die Zeilen 37, 44, 84, 188, 197 und 208. Es gibt in `tests/e2e/features` kein Szenario mehr, das ohne Heizprofil erstellt (per grep geprüft). `generateStatements` rufen nur noch die beiden Schritte `:72` und `:81` auf, und beide übergeben `heatingProfileId`.
- **Seed:** `seed.heatingProfileId` (`tests/e2e/fixtures/backend.ts:247`) nimmt zuerst das Profil des Szenarios und sonst ein vordefiniertes Profil über `nameDE`. «Heizung Mittelland» ist vordefiniert, das zeigen auch `backend/src/__tests__/statement-pdf.pg.test.ts:105` und das schon vorhandene Szenario `feature:98`.
- **UI und API antworten gleich:** Der UI-Pfad (`tasks/statement-generate.ts:61`) wählt das Profil im Select. Der API-Pfad (`statement-generate-api.ts`) gibt es über `run(...)` an den Systemcode des BFF weiter (`src/lib/server/statement-generation.ts`). Keine Regel ist in den Test kopiert.
- **Gleiche Strenge:** Die Then-Schritte sind unverändert. Das Given prüft weiterhin `generationOutcomeShown`. Dass der Feature-Text jetzt das Heizprofil nennt, ist eine fachliche Wahl und sagt nichts über die Bedienung.
- **Entfernte Schritte:** Die beiden Varianten ohne Profil nutzt keine andere Feature-Datei mehr (per grep geprüft). Es bleibt nichts Unbenutztes zurück.
- **Vorschau-Szenarien ohne Profil** (`feature:29, 117, 121, 143, 162`): Auf sie trifft der FK-Fehler nicht zu. `heatingOfRun` (`backend/src/services/calculation.service.ts:425-426`) rechnet bei einem fehlenden Profil nach Tagen und schreibt nichts. Dass sie das Profil nicht nennen, ist korrekt, denn ihr Ergebnis hängt nicht von der Vorwahl ab.
- **O-34:** Die Zeile ist entfernt. `offene-punkte.md` ist jetzt identisch mit `origin/main` (`754542d`). Die ID O-34 hatte main schon einmal für eine andere, inzwischen entfernte Zeile vergeben (`docs/reviews/o34-review-1.md`). Durch das Entfernen fällt dieser Doppelgebrauch ebenfalls weg. Der Archivpunkt (`implementation-plan-verlauf.md:636`) beschreibt den neuen Stand.
- **Pflichtpunkte:** Die App ändert sich nicht, daher braucht es kein neues Szenario, keine neuen Bildschirme und keine neuen Texte in `messages/*.json`. Die Screenplay-Schichten bleiben eingehalten: Die Schritte rufen nur Tasks, Questions und das Seed auf. Im Delta ist nichts, was nicht zur Anforderung gehört.
- **Rote Tests:** Die Änderung behebt eine Flakiness, die nur bei parallelen Läufen auftritt. Ein deterministisches Rot lässt sich nicht zeigen. Beim Lesen sieht man aber, dass vorher ein Schritt ohne Profil die Vorwahl übernahm, und genau der Fall ist jetzt ausgeschlossen.

## Nicht bestätigt

- `bun run lint` sauber: vom Aufrufer gemeldet.
- E2E chromium+api auf statement-generate, statement-detail und statements mit 80 passed: vom Aufrufer gemeldet. Ich habe keine E2E gestartet.
- vitest 2656 und backend 705 passed auf `a41ab7c`: vom Aufrufer gemeldet. Das Delta enthält keine Unit-Tests oder App-Code, deshalb habe ich nichts neu laufen lassen.
- Dass der FK-Fehler bei parallelen Läufen nicht mehr auftritt: Das habe ich nur aus dem Code gefolgert, nicht in einem Lauf beobachtet.
