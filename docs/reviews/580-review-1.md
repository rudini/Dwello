# Code-Review 580, Runde 1 (8e8b832..8419e6c)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/ki-settings.service.ts:88-90, backend/src/index.ts:27 | Ohne gespeicherte Einstellung wirft `currentKi()`, wenn `LLM_LOCAL_URL` auf einen Host ausserhalb von `OPERATOR_HOSTS` zeigt (z. B. `host.docker.internal`, eine IP im LAN). Dann antworten alle KI-Aufrufe, `GET /ki-settings` und das öffentliche `/invoices/llm-recipient` mit 500, und der Backend-Prozess beendet sich beim Start. |
| C-2 | Major | backend/src/services/ki-settings.service.ts:141-152 | Ein Wechsel von der lokalen KI zu «KI eines Anbieters» oder «Keine KI» lässt den Zustand des KI-Modells (`loading`/`failed`) stehen, und der Download läuft weiter. Die Übersicht sagt danach weiter «… erfassen Sie Rechnungen von Hand», obwohl ein Anbieter die Rechnungen liest. |
| C-3 | Major | tests/e2e/tasks/ki-settings.ts:52-65 | `saveProvider`, `saveMode` und `checkConnection` enden mit dem Klick und warten nicht auf das Ergebnis. In «Keine KI wählen» und «Der Wechsel der KI steht im Protokoll» navigiert der nächste Schritt sofort weiter, deshalb sind die beiden Szenarien flaky. |
| C-4 | Major | UBIQUITOUS_LANGUAGE.md (nicht im Diff) | Die in #580 entschiedenen Glossarzeilen fehlen (KI-Einstellung, Lokale KI, Anbieter der KI, Adresse der KI, API-Schlüssel, Verbindung prüfen). Die Zeile «Protokoll» nennt den Wechsel der KI nicht, und «KI-Modell» nennt den Download von der Seite «KI» nicht. Der Plan führt das auch nicht als offenen Punkt. |
| C-5 | Major | tests/a11y/screens.json:731-741 | Neue UI-Zustände der Seite «KI» fehlen in screens.json, accessibility.feature und sprachen-bildschirme.feature: «Die lokale KI antwortet nicht» mit der Schaltfläche (`ki-model-offline`), das Ergebnis von «Verbindung prüfen» (`ki-check-result`) und die Meldung nach dem Speichern (`ki-saved`). |
| C-6 | Minor | backend/src/services/ki-model.service.ts:21-33, 75 | `known` ist modulweit. Startet ein zweiter `loadModel`, während ein Download läuft, löst der `finally` des abgebrochenen Laufs das `started` des neuen sofort auf. `modelStarted()` kehrt dann bei `unknown` zurück, und die Seite «KI» zeigt nach dem Speichern «Die lokale KI antwortet nicht», obwohl der Download läuft. Ein schon gepufferter Chunk des alten Streams kann zudem `current` überschreiben. Abhilfe: den Resolver lokal an `load`/`follow` übergeben. |
| C-7 | Minor | backend/src/services/ki-settings.service.ts:210-211 | «Verbindung prüfen» meldet jede andere Ablehnung als 401/403 (404 bei falschem Pfad oder unbekanntem Modell, 429, 5xx) als «Das Modell liest keine Bilder». Der Hinweis «Wählen Sie ein Modell, das Bilder liest» führt dann in die falsche Richtung. |
| C-8 | Minor | backend/src/index.ts:27-29 | `void currentKi().then(...)` hat kein `.catch`. Ist die Datenbank beim Start nicht erreichbar, beendet die unbehandelte Ablehnung Bun (exit 1, geprüft mit Bun 1.4.2). Vorher lief der Prozess weiter; `announceSetupCode` daneben fängt den Fehler ab. |
| C-9 | Minor | backend/src/config/llm.ts:25; src/lib/server/ki-settings.ts:17-21 | `llmConfig.localUrl` wird nirgends gelesen (nur die Konstante). `ModelState` kopiert `KiModel` aus `src/routes/dashboard/+page.server.ts:44`. |
| C-10 | Minor | backend/src/services/llm.service.ts:120, 150, 244 | Für die geänderten Prüfungen in `isLlmAvailable`, `categorizeInvoice` und `extractInvoice` (Einstellung aus dem Browser statt `llmConfig.enabled`) gibt es keinen Test. Getestet ist nur `proposeAllocability`. Done means verlangt «the next categorization and upload use the new setting». |

## C-1: `LLM_LOCAL_URL` ausserhalb von `OPERATOR_HOSTS` macht die KI ohne Einstellung unbrauchbar

Ohne Zeile in `ki_settings` und ohne Variable des Betreibers ruft `currentKi()` `llmRecipient()` mit `llmConfig.baseUrl` auf, und das ist hier `localUrl`. Liegt der Host nicht in `['localhost','127.0.0.1','[::1]','ollama']`, sind `provider` und `country` leer, und `llmRecipient` wirft «LLM_BASE_URL is an external provider …». Der Entscheid in #580 lautet aber: «`LLM_LOCAL_URL` only says where the local KI runs». Die lokale KI darf deshalb nie zum Anbieter werden.

Folgen bis zum ersten Speichern:
- `GET /api/v1/ki-settings`, `/invoices/llm-recipient` (Datenschutzerklärung), jede Kategorisierung und jeder Upload antworten mit 500.
- `index.ts:27` lässt die Ablehnung unbehandelt, und Bun beendet sich. Der Container startet in einer Schleife neu.

Einen Fehlschlag zeigen: Ein pg-Test mit `Object.assign(llmConfig, { baseUrl: 'http://192.168.1.10:11434/v1', byOperator: false })` ohne Zeile, dann `GET /api/v1/ki-settings`. Erwartet ist `mode: 'local'`, die Antwort ist 500.

Abhilfe: Ohne Zeile und ohne Betreiber gilt `fromOperator('local')`; nur `byOperator` braucht `llmRecipient()`.

## C-2: Der Wechsel weg von der lokalen KI lässt den Zustand des KI-Modells stehen

`saveKiSettings` ruft `loadModel` nur bei `mode === 'local'` auf. Nach dem Wechsel zu einem Anbieter oder zu «Keine KI» bleibt `current` deshalb `loading`/`failed`, und der Pull läuft weiter. Die Übersicht (`dashboard/+page.server.ts:162` → `KiModelNotice`) zeigt weiter «Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand.» oder «… konnte nicht geladen werden. Erfassen Sie Rechnungen von Hand.».

Gerade wer auf der frischen Installation ohne 16 GB Arbeitsspeicher zu einem Anbieter wechselt, erhält damit eine falsche Anleitung. Die Rechnungen gehen schon an den Anbieter.

Einen Fehlschlag zeigen: Im pg-Test einen Pull-Stub auf `loading` bringen, dann `save(muster)` und `GET /api/v1/ki/model`. Erwartet ist `unknown`, die Antwort ist `loading`.

Abhilfe: Bei `provider`/`none` `loadModel({ …, local: false })` aufrufen. Das bricht den Download ab und setzt den Zustand auf `unknown`.

## C-3: Die Speichern-Tasks warten nicht auf ihr Ergebnis

`tests/e2e/CLAUDE.md` verlangt, dass ein Task auf den Zustand wartet, zu dem er führt. Die Formulare senden mit `enhance`, also per `fetch`.

- «Keine KI wählen» (Feature:38-39): Auf `saveMode('none')` folgt sofort `readFreshPrivacy` (`Navigate.to`). Die Datenschutzerklärung kann `/llm-recipient` lesen, bevor der PUT fertig ist, oder die Navigation bricht den Request ab. Die folgende Prüfung «… nicht von einer KI bearbeitet» fragt dieselbe, nicht neu geladene Seite erneut und scheitert.
- «Der Wechsel der KI steht im Protokoll» (Feature:24-25): Auf `saveProvider` folgt sofort `openFreshAuditLog`. Der PUT verschlüsselt und schreibt in einer Transaktion, das Protokoll kann ihn deshalb überholen.

Abhilfe: Jeder Speichern-Task wartet auf `ki-saved` oder `form-error`, `checkConnection` auf `ki-check-result`.

## C-4: Die entschiedenen Glossarzeilen fehlen

#580 «Decided» nennt die Zeilen KI-Einstellung, Lokale KI, Anbieter der KI, Adresse der KI, API-Schlüssel und Verbindung prüfen. Ausserdem sollen «`audit_privacy` and the glossary row «Protokoll» name it» und «KI-Modell names the download from the page «KI»». `UBIQUITOUS_LANGUAGE.md` ist im Bereich unverändert:
- Zeile 265 «Protokoll» nennt den Wechsel der KI nicht.
- Zeile 252 «KI-Modell» nennt nur den Download beim Start.

Der Aufrufer zählt als nachfolgende Doku nur installation, README, .env.example und compose auf, und auch der Plan führt das Glossar nicht. Prüfen: `grep -n "KI-Einstellung\|Adresse der KI" UBIQUITOUS_LANGUAGE.md` liefert nichts.

## C-5: UI-Zustände der Seite «KI» fehlen in den a11y- und Sprachprüfungen

`KiModelState.svelte:22-46` hat einen eigenen Zustand mit Text und einem Formular samt Schaltfläche in einem `Alert` («Die lokale KI antwortet nicht»). `ProviderChecklist.svelte:38-40` zeigt das Ergebnis der Prüfung, `+page.svelte:96-102` die Erfolgsmeldung. Keiner dieser Zustände steht in `screens.json`. axe und die Prüfung auf deutsche Reste in fr/it/en laufen deshalb nicht darüber; die Szenarien prüfen nur Deutsch.

Vorhandene Mittel für die Ergänzung: `stub/ollama offline` und `UNREACHABLE` für die Prüfung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run`, die genannten Backend-`bun test` (ki-settings.pg, ki-model, api-contracts.pg, invoice-*, category-allocability.pg, llm-recipient, setup.pg, local-account.pg), `bunx fallow audit` und alle E2E-Läufe: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob jeder neue Test ohne die Änderung rot ist: nur gelesen, nicht ausgeführt. Die pg-Tests und Szenarien stehen in den Commits vor 09610ae (f4d233f, 88c665c), die Tests beziehen sich auf das neue Verhalten.
- Das Setup beim ersten Besuch «bietet nur Lokale KI oder später entscheiden» (#580 «Decided»): im Bereich nicht umgesetzt; `messages/de.json` kennt «später entscheiden» nicht. Ob das zu #577 gehört oder noch folgt, ist offen.
- `ENCRYPTION_KEY` vom Setup erzeugt und im Backup: `docker-compose.prod.yml:87` liest `/run/dwello/encryption_key`. Ob `init-secrets.sh` und das Backup ihn enthalten, ist nicht geprüft (Doku-Slice folgt).
- `bun run llm:eval` vorher und nachher: nicht im Bereich. Der Plan nennt nur den Lauf vorher (47 von 48).
- Sperre der frischen Installation: `withLock` übernimmt eine Sperre nach 60 s (`settings-lock.ts:11`). Ob eine a11y-Prüfung (6 Varianten) unter Last länger hält, ist nicht gemessen.
- Übersetzungen fr/it/en: Schlüsselgleichheit geprüft (2033 je Sprache), Wortlaut nicht.

Geprüft: Verschlüsselung (AES-256-GCM, zufälliger IV, Klartext nicht in der Zeile; Drizzle übernimmt nur Tabellenspalten), Schlüssel nie in Antworten, BFF-Mapper oder Seite, kein Schlüssel an eine geänderte Adresse (Speichern und Prüfung), `byOperator` sperrt Speichern und zeigt die Werte ohne Schlüssel, Protokolleintrag in der Transaktion, BFF-Feldabbildung, `refusedWith`, Verträge, Texte in vier Sprachen, Screenplay-Schichten.
