# Fachreview #580, Runde 4: Umsetzung «KI in den Einstellungen»

Gegenstand: `git diff 12fe190 a408918` im Worktree `review-580-fach4` (Commit a408918), dazu `backend/src/config/llm.ts`, `backend/src/routes/ki-settings.ts`, `src/lib/server/ki-settings.ts`, `backend/src/services/ki-model.service.ts`, gegen #580 «Decided». Vorherige Berichte: `docs/reviews/580-fachreview-1.md` bis `-3.md`.

## Status der offenen IDs aus Runde 3

| ID | Status | Begründung |
|----|--------|------------|
| F-21 | geschlossen | `ki-model.test.ts:126–130` («meldet nichts, wenn die lokale KI nicht antwortet») nimmt einen geschlossenen Port (`127.0.0.1:9`) und erwartet den Zustand `unknown`. Diesen Zustand zeigt `KiModelState.svelte:141–144` als «Die lokale KI antwortet nicht», mit der Schaltfläche zum Herunterladen. |
| F-22 | geschlossen | Szenario «Eine neue Adresse prüfen braucht den API-Schlüssel erneut» (Feature:107–112). Die BFF zeigt die Meldung als Ergebnis der Prüfung (`src/lib/server/ki-settings.ts:99–102`). |

Die geplanten Wortlaute aus F-1, F-7 bis F-10, F-17, F-19 und F-20 stehen so in `messages/de.json`. Dasselbe gilt für die sechs Glossarzeilen und die Ergänzung der Zeile «Protokoll» aus Runde 1. Auch fr/it/en sagen in den Checklistenpunkten, bei der Bestätigung, in `privacy_third_ollama` und im Protokolleintrag rechtlich dasselbe wie die deutsche Fassung.

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-23 | Rechtstexte | Major | Mit «Lokale KI» kann die Datenschutzerklärung falsch werden: `LLM_LOCAL_URL` darf auf einen fremden Rechner zeigen, und trotzdem steht dort «verlassen den Server nicht». Begründung unten |
| F-24 | Verwalter | Minor | «Verbindung prüfen» meldet jede andere Ablehnung als 401/403 als «Das Modell liest keine Bilder» (`ki-settings.service.ts:210–211`). Das betrifft 404 (Adresse ohne `/v1`, Modellname falsch), 402/429 (kein Guthaben, zu viele Anfragen) und 5xx. Der Liegenschaftsverwalter sucht dann ein anderes Modell, obwohl die Adresse falsch ist. Fix: «no-images» nur bei 400. Bei 404 die Meldung `unreachable` oder eine eigene: «Unter dieser Adresse gibt es dieses Modell nicht. Prüfen Sie Adresse und Modell.» Alles andere bekommt eine allgemeine Meldung, die den Status nennt. |
| F-25 | Verwalter | Minor | `backend_ki_encryption_key_missing` schickt den Betreiber zur Installationsanleitung («wie die Installationsanleitung beschreibt»). `docs/installation.md` nennt `ENCRYPTION_KEY` aber nirgends, ebenso wenig `.env.example`. Nur `README.md:299` und `docker-compose.prod.yml:87` erwähnen ihn. Fix: `ENCRYPTION_KEY` in `docs/installation.md` Abschnitt 4 (Betrieb ohne Docker) oder in `.env.example` beschreiben, sonst den Verweis im Text streichen. |
| F-26 | Verwalter | Minor | Hat der Betreiber `LLM_ENABLED=false` gesetzt, zeigt die gesperrte Seite oben «Keine KI». Darunter stehen aber «Adresse der KI» und «Modell» mit der Adresse der lokalen KI und `qwen3-vl:8b-instruct` (`ProviderFields.svelte:222`: `shown = … \|\| locked`). Das liest sich, als laufe doch eine KI. Fix: Im gesperrten Modus «none» die Felder weglassen (`+page.svelte:50–52` nur bei `ki.mode !== 'none'`). |

## F-23 `LLM_LOCAL_URL` ausserhalb des Servers

Belege:
- `backend/src/config/llm.ts:20`: `localUrl` kommt ungeprüft aus `LLM_LOCAL_URL`. Diese Variable sperrt nichts (`:10–17`, README:303 «`LLM_LOCAL_URL` only says where the local KI runs … and locks nothing»).
- `ki-settings.service.ts:91`: Eine gespeicherte «Lokale KI» liefert `fromOperator('local')`, und `kiRecipient` (`:104–107`) gibt dafür `null` zurück. Die Datenschutzerklärung zeigt dann `privacy_llm_local` (de.json:150): «Die KI läuft auf dem Server des Betreibers; die Rechnungen und Kategorien verlassen dafür den Server nicht.» Die Rechnungen gehen aber an `LLM_LOCAL_URL`, wohin diese auch zeigt.
- Ohne gespeicherte Zeile ruft `currentKi` (`:90`) `llmRecipient()` mit `baseUrl = localUrl` auf. Liegt die Adresse nicht in `OPERATOR_HOSTS`, wirft das (`llm.ts:59–62`). Dann scheitern `GET /api/v1/invoices/llm-recipient` (`app.ts:82–85`) und damit die Datenschutzerklärung. Der Startcheck in `index.ts:14` läuft nur bei `byOperator`. Derselbe Fehlgriff führt also je nach gespeicherter Zeile zu einem Fehler oder zu einer falschen Aussage.
- README:303 sagt weiter: «any other host counts as external, including `host.docker.internal`, LAN addresses and a self-hosted model on another server». Für `LLM_LOCAL_URL` gilt diese Regel nicht mehr.

Warum: Bisher fing der Hostcheck aus #184 jeden fremden Host ab. `LLM_LOCAL_URL` ist neu (Commit 09610ae). Wer Ollama auf einem zweiten Rechner im LAN oder einem gemieteten GPU-Server betreibt, setzt jetzt naheliegend `LLM_LOCAL_URL`. Laut README sperrt diese Variable die Seite nicht. Dann gehen Rechnungen mit Namen und Adressen von Mietern an einen anderen Rechner, und die Datenschutzerklärung verneint das ausdrücklich. Fedlex, Art. 19 Abs. 2 Bst. c DSG (SR 235.1, Stand 1.9.2023): «er teilt ihr mindestens mit: […] c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.» Abs. 4: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ […] mit.»

Fix (kleinster): Beim Start mit derselben Regel wie für `LLM_BASE_URL` prüfen. Liegt der Host von `LLM_LOCAL_URL` nicht in `OPERATOR_HOSTS`, startet das Backend nicht und meldet: «LLM_LOCAL_URL must point to this server (localhost, ollama); for a model on another machine choose «KI eines Anbieters» or set LLM_BASE_URL with LLM_PROVIDER and LLM_PROVIDER_COUNTRY». Dazu ein Test in `llm-recipient.test.ts` und ein Satz in README:303. Andere Lösung: die lokale KI nur dann melden, wenn `localUrl` auf dem Server liegt, und sonst wie einen Anbieter ohne Namen ablehnen.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Ob jeder OpenAI-kompatible Anbieter ein Bild bei einem Modell ohne Bildeingabe mit 400 ablehnt oder es still übergeht und 200 liefert. Im zweiten Fall meldete «Verbindung prüfen» fälschlich «liest Rechnungsbilder». Ebenso offen ist, ob Anbieter das 1×1-PNG (`ki-settings.service.ts:176–177`) wegen Mindestgrösse ablehnen. Dann käme «liest keine Bilder» bei einem Modell, das Bilder liest. Geprüft habe ich nur die Attrappen (`llm-stub.ts:192`, `ki-settings.pg.test.ts:46`), keinen echten Anbieter.
- DSV Anhang 1 (USA/DPF in Checklistenpunkt 2): wie in Runde 2 nur in der Fassung vom 15.9.2024 bestätigt.

Geprüft: `kiRecipient` nennt im Modus «KI eines Anbieters» Anbieter und Land unabhängig von der Adresse, wie in #580 entschieden. Ist die KI vom Betreiber festgelegt, gilt weiter der Hostcheck. Den Protokolleintrag `ki_setting_changed` (Modus, Anbieter, Land, Datum über `occurred_at`) schreibt dieselbe Transaktion wie die Einstellung; er erfüllt F-4 und Art. 25 Abs. 2 Bst. g DSG. Ein Schlüssel, der sich nicht entschlüsseln lässt, gilt als kein Schlüssel. Er geht nirgends hin, der Anbieter bleibt in der Datenschutzerklärung, und die Seite zeigt keinen «gespeicherten» Schlüssel an. Speichern oder Prüfen ohne Eingabe führt zu «lehnt den API-Schlüssel ab … erneut ein». `docs/installation.md:68` nennt die Folge beim Restore. Wechselt der Liegenschaftsverwalter zu «Lokale KI» oder «Keine KI», wird der verschlüsselte Schlüssel gelöscht. Mietrechtlich (OR, VMWG) ist nichts betroffen.
