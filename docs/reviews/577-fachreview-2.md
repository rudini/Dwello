# Fach-Review #577, Runde 2 (Implementierung, Re-Review von Runde 1)

Gegenstand: Worktree `review-577-fach2` auf 80a0e4f, Delta `b325da0..80a0e4f` (messages/{de,fr,it,en}.json, Szenarien, Glossar, i18n-begriffe, /setup, /privacy, KiModelNotice, installation.md, README, marketing, setup.service.ts, ki-model.service.ts); dazu gelesen: `src/lib/server/password-login.ts`, `backend/src/index.ts:26`, `docker-compose.prod.yml`, `docker/init-secrets.sh`, `.env.example`.

## Status der IDs aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| R-1 | erledigt | `privacy/+page.server.ts:34` (Konto besteht oder Einrichtung offen), `privacy_login_local_1` in allen vier Sprachen, Szenario `einrichtung.feature:58-63`. Folgebefund R-6 |
| R-2 | erledigt | `privacy_third_ollama` nur mit lokaler KI (`privacy/+page.svelte:138`, gleiche Bedingung wie `backend/src/index.ts:26`: `enabled && !llmRecipient()`), vor `privacy_third_5`; Pull nur mit `{ model, stream }` (`ki-model.service.ts:27`); `privacy_llm_local` eingeschränkt (de/fr/it/en) |
| R-3 | erledigt | `privacy_controller_none` (4 Sprachen); `docs/installation.md` Abschnitt 4 beschreibt `OPERATOR_*` in `.env`, der Verweis stimmt |
| R-4 | erledigt | `setUpDwello` ruft `startSession` auf, und das schreibt `login_complete` (`password-login.ts:61`) |
| R-5 | erledigt | 32 Zeichen, `byte % 32` ohne Verzerrung (256/32 = 8). 32^8 = 2^40 ≈ 1,1·10^12. Bei 5 Versuchen je 15 Min. (480 pro Tag) dauert es im Mittel 2^39/480 ≈ 3·10^9 Tage. Der Code steht nur in `console.log` (`setup.service.ts:39`) und in keiner Antwort |
| V-1 | erledigt | `backend_setup_code_invalid`, `setup_code_help` (4 Sprachen), Szenario Zeile 27 |
| V-2 | erledigt | Glossar: 3 neue Zeilen und 2 geänderte, wie entschieden |
| V-3 | erledigt | `i18n-begriffe.md:120-121`; fr/it/en verwenden die Begriffe durchgehend (code de configuration, journal du serveur, registro del server, setup code, server log, compte avec mot de passe, password account) |
| V-4 | erledigt | Szenarien `einrichtung.feature:29-40`, `backend_password_too_short` und `setup_password_help`, `ki_model_failed_*`. Folgebefund V-7 |
| V-5 | erledigt | `/login` leitet zu `/setup` weiter (`login/+page.server.ts:10`). `login_unavailable_*` erscheint nur noch, wenn kein Konto und kein Anbieter besteht und `setupNeeded` false ergibt. Das trifft nur zu, wenn das Backend nicht antwortet. Der Text stimmt |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| R-6 | Rechtstexte | Minor | `privacy_login_local_1` sagt immer «das Konto legen Sie bei der Einrichtung von Dwello an». Das ist falsch, wo der Betreiber das Konto mit `bun run account` angelegt hat: bei Installationen von vor #577, durch einen Anbieter (README:289 nennt beide Wege). Der Wortlaut stammt aus meinem Vorschlag in Runde 1. Lösung: «… an; das Konto legen Sie bei der Einrichtung von Dwello an, oder der Betreiber legt es für Sie an.» (fr/it/en entsprechend) |
| V-6 | Verwalter | Minor | Landingpage: Nur der PC-Block hat den Schritt `docker logs dwello-backend`. Den Blöcken «Homeserver» und «Linux-Server» (`marketing/index.html:550-557`, `:573-578`, ebenso fr/it/en) fehlt er. Wer ihnen folgt, steht vor «Dwello einrichten» ohne Einrichtungscode. Lösung: in beiden Blöcken nach `up -d` dieselbe Kommentar- und Befehlszeile wie im PC-Block |
| V-7 | Verwalter | Minor | `ki_model_failed_text` «Dwello versucht es beim nächsten Start erneut»: Der Liegenschaftsverwalter weiss nicht, welcher Start gemeint ist (Browser, PC?). Ein neuer Versuch kommt erst, wenn der Betreiber das Backend neu startet (`ki-model.service.ts:16`, `installation.md` Abschnitt 5). Auf einem Server, der durchläuft, kommt er also nie. Der Wortlaut stammt aus meinem Vorschlag in Runde 1. Lösung: «Erfassen Sie Rechnungen von Hand. Dwello versucht es erneut, wenn der Betreiber Dwello neu startet; betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung.» (fr/it/en entsprechend) |
| V-8 | Verwalter | Minor | Prozentangabe im Hinweis «Das KI-Modell wird geladen: N %»: `progress()` (`ki-model.service.ts:47-50`) rechnet je Schicht (`completed/total` der gerade geladenen Datei), nicht für das ganze Modell. Nachgerechnet mit Schicht A = 6,0 GB und B = 0,1 GB: Bei A halb geladen zeigt der Hinweis 50 % (richtig wären 3,0/6,1 = 49 %). Bei A fertig und B bei 0 zeigt er **0 %** statt 98 %. Randfall `total` = 0 oder fehlend: Der letzte Wert bleibt stehen, das ist richtig. Lösung: `completed` und `total` je `digest` merken und die Summen teilen. Wie viele Schichten das Standardmodell hat, ist nicht bestätigt (siehe unten) |

## Fehlende Begriffe
Keine. Alle neuen Texte verwenden die Glossarzeilen aus Runde 1.

## Nicht bestätigt
- Ob Ollama Inc. nach dem Swiss-U.S. Data Privacy Framework zertifiziert ist (Stand Runde 1, nicht neu gesucht). Der Text enthält zu Recht keinen Satz über Garantien.
- Aus wie vielen Schichten `qwen3-vl:8b-instruct` in der Ollama-Registry besteht, also wie stark V-8 in der Praxis sichtbar wird. Die Grösse «rund 6 GB» übernehme ich aus `installation.md` und Runde 1, sie ist nicht neu geprüft.
- Ob der Ollama-Client beim Download ausser IP-Adresse und Modellname weitere Angaben an die Registry schickt, etwa einen User-Agent mit Version und Betriebssystem. Das wären keine Personendaten. Der Satz «die IP-Adresse des Servers und den Namen des Modells» bleibt für Daten, die eine Person betreffen, richtig. Nicht im Quelltext von Ollama nachgesehen.
- Fedlex nicht neu abgerufen: Es gibt keine neue Rechtsbehauptung. R-6 stützt sich auf Art. 19 Abs. 1 DSG, Wortlaut zitiert in Runde 1.

Geprüft: Übersetzungen aller neuen und geänderten Schlüssel in fr/it/en gegen `i18n-begriffe.md` und den deutschen Inhalt (Sperre «bis {time}», 8 Zeichen, 15 Minuten, USA). Die Szenarien entsprechen den Texten. Sicherung und Wiederherstellung der Schlüssel (`/run/dwello` ist in `dwello-postgres` eingehängt, `init-secrets.sh` überschreibt vorhandene Dateien nicht). `.env.example` setzt kein `JWT_SECRET`. Die Nutzungsbedingungen sind nicht betroffen.
