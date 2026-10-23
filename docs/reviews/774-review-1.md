# Code-Review #774, Runde 1 (auch Abschlussrunde vor dem Push)

Bereich: `git diff ae8faf86 09e86f78` (Worktree `review-774-code`, 09e86f78)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/design/personas/README.md:29, docs/design/tools/persona-stack.sh:28 | Text sagt «reports a model download at 40 %», das Skript setzt aber nie `POST :2528/stub/pull {percent: 40}`. Der Stub startet mit `let pulled = 0` (backend/scripts/llm-stub.ts:19), `ki-model.service.ts:88` meldet daraus 0 %. Die früheren eigenen Skripte (anna-577.md:69, helga-620.md:41) zeigten 40 %, weil sie den Wert setzten. Entweder nach dem Start des Stubs `curl -s -X POST -d '{"percent":40}' http://127.0.0.1:2528/stub/pull` aufrufen (mit Warten auf den Port) oder den Text auf 0 % ändern. |
| C-2 | Minor | docs/design/tools/persona-stack.sh:29-32 | `--fresh --second` startet keinen Stub und prüft nicht, ob auf 2528 einer mit `LLM_STUB_PULL=on` läuft. Läuft daneben die Standard-Instanz (Stub ohne Ollama-Routen) oder gar keine, bekommt die zweite frische Instanz keine Modell-Download-Meldung (`/api/tags` gibt 404 bzw. keine Verbindung), still und ohne Hinweis. Das README (Zeile 29) nennt nur den Fall «beside the first» fresh; ein Abbruch oder eine Meldung, wenn 2528 nicht antwortet oder `/api/tags` fehlt, würde den Fall sichtbar machen. |

Keine Blocker, keine Major.

Geprüft: Standardmodus unverändert (Ports 3300/3301, DB `dwello_persona`, Demo-Daten, gleiche OAuth-Variablen inkl. Redirect-URI auf :3300, Stub ohne `LLM_STUB_PULL`, gleiche Log-Dateien, da `$SECOND` leer); `set -e` mit den `||`-Listen (Zeilen 9, 16, 18, 40) bricht nicht ungewollt ab; `$OAUTH` absichtlich ungequotet, Werte ohne Leer- und Glob-Zeichen; `--second` beendet nur 3310/3311, baut nicht neu (Zeile 21), lässt Stub 2528 und Mail-Catcher stehen; `cp package.json`/`ln -sfn` unter laufender erster Instanz schreibt denselben Inhalt; `SETUP_CODE` wird von `setup.service.ts:27` gelesen, `LLM_STUB_PULL=on` von `llm-stub.ts:18`; README nennt Anlass, Code, Adresse und abgemeldeten Start (Anforderung Zeile 3); ponytail-review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers.

## Nicht bestätigt

- Alle Läufe des Aufrufers (`bash -n`; `--no-build` mit 3 Gebäuden und /login 200; `--fresh --no-build` mit /login 303 nach /setup, `GET /api/v1/setup` `{needed:true}`, `/api/tags` `{"models":[]}`; `--fresh --second` auf :3310 neben :3300/:3301, `POST /api/v1/setup` mit PERS-FRSH 201): vom Aufrufer gemeldet, nicht wiederholt (Starten des Stacks schreibt Dateien und Datenbanken).
- Was die Übersicht nach der Einrichtung bei 0 % zeigt (C-1): nur aus `llm-stub.ts:240` und `ki-model.service.ts:88` gelesen, nicht im Browser gesehen.
