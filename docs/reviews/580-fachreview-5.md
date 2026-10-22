# Fachreview 580, Runde 2 (Commit 403afe0, Delta zu a408918)

Re-Review von F-23 bis F-26 aus `docs/reviews/580-fachreview-4.md` und der seither geänderten Texte.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| F-23 (Major) | **erledigt** | `index.ts:15`: Ohne Betreiber-Variablen prüft `checkLocalKi(llmConfig.baseUrl)`. `baseUrl` ist dann `localUrl`, weil `LLM_BASE_URL` selbst eine Betreiber-Variable ist (`llm.ts:27`). Ein fremder Host bricht den Start ab (`llm.ts:56–60`). Damit bekommt eine gespeicherte «Lokale KI» (`fromOperator('local')`) nur noch eine Adresse auf dem Server, und `privacy_llm_local` stimmt. Mit Betreiber-Variablen greift weiter `llmRecipient()`, und `currentKi` leitet den Modus mit derselben Hostregel ab (`ki-settings.service.ts:87–88`). Das README (Zeile 303) sagt es auch. Den Test in `llm-recipient.test.ts` gibt es. Nachgerechnet: `ollama`, `127.0.0.1` und `[::1]` (WHATWG-`hostname` behält die Klammern) werden angenommen, `192.168.1.20` und `host.docker.internal` abgelehnt. |
| F-24 (Minor) | **teilweise** | `ki-settings.service.ts:213–215`: Nur noch 400 meldet «no-images», das ist behoben. 402, 429 und 5xx zeigen jetzt aber `ki_settings_check_unreachable` (de.json:2019): «Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse …». Bei 429 (zu viele Anfragen) und 402 (kein Guthaben) hat die KI geantwortet, der Text stimmt dort also nicht und schickt zur falschen Prüfung. Bei 404 nennt er das Modell nicht. Fix wie in Runde 1: eine allgemeine Meldung für alles ausser 400, 401/403 und 404, z. B. «Der Anbieter lehnt die Anfrage ab (Status {status}). Prüfen Sie Ihr Konto beim Anbieter.» Bei 404: «… Prüfen Sie Adresse und Modell.» |
| F-25 (Minor) | **erledigt** | `.env.example:75–76` und `docs/installation.md:94`. Mit Docker legt `init-secrets.sh` den Schlüssel an, die Meldung tritt dort nicht auf. Ohne Docker beschreibt `.env.example` ihn. |
| F-26 (Minor) | **erledigt** | `+page.svelte:55–59`: Im gesperrten Modus «none» zeigt die Seite keine Felder. |

## Neue Befunde (nur Delta)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-27 | Rechtstexte | Major | Hilfetext zum Land (`ki_settings_country_help`) engt auf die «Rechenzentren des Anbieters» ein. Dann fehlen in der Datenschutzerklärung Länder, aus denen der Anbieter oder seine Unterauftragnehmer auf die Daten zugreifen. Begründung unten |
| F-28 | Verwalter | Minor | Die Startmeldung von `checkLocalKi` (`llm.ts:58–59`) sagt «choose a provider under «Einstellungen» › «KI»». Das Backend startet aber nicht, also ist diese Seite nicht erreichbar. Der nötige erste Schritt fehlt: `LLM_LOCAL_URL` auf diesen Server setzen oder die Zeile entfernen. Fix: «LLM_LOCAL_URL is not on this server: point it to localhost or ollama, or remove it and then choose a provider under …, or set LLM_BASE_URL, LLM_PROVIDER and LLM_PROVIDER_COUNTRY». Den Test in `llm-recipient.test.ts:107` mitziehen. |
| F-29 | Verwalter | Minor | `ki_settings_model_offline` verweist auf die Installationsanleitung: «starten Sie die lokale KI, wie die Installationsanleitung beschreibt». `docs/installation.md` beschreibt nirgends, wie man die lokale KI startet. Abschnitt 5 nennt nur `up -d` für alles und `restart backend` für einen erneuten Download. Fix: In Abschnitt 5 einen Punkt ergänzen: «Antwortet die lokale KI nicht: `docker compose -f docker-compose.prod.yml up -d ollama`». |
| F-30 | Rechtstexte | Minor | Der Hilfetext zum Namen (`ki_settings_provider_name_help`: «Der Name der Firma, wie er im Vertrag mit ihr steht») passt nicht, wenn das Modell auf dem eigenen Server läuft. Das README (Zeile 303) und `ki_settings_checklist_1` sehen diesen Fall vor, dort gibt es weder Firma noch Vertrag. Fix: einen Satz anhängen: «Läuft die KI auf einem Server, den Sie selbst betreiben, schreiben Sie «eigener Server».» |

### F-27 Hilfetext zum Land: «Rechenzentren des Anbieters»

Beleg: `messages/de.json` (neu, `ki_settings_country_help`): «Das Land, in dem die Rechenzentren des Anbieters stehen. Die Datenschutzerklärung nennt es. Bearbeiten Rechenzentren in mehreren Ländern die Daten, nennen Sie alle, mit Komma getrennt.» Das Feldlabel `ki_settings_provider_country` lautet dagegen «Land, in dem der Anbieter die Daten bearbeitet», und `ki_settings_checklist_2` spricht von «Der Anbieter und alle Firmen, die er beizieht». Die Datenschutzerklärung übernimmt den Wert unverändert.

Warum falsch: Bekanntgabe ins Ausland heisst nicht nur Speichern in einem Rechenzentrum. Fedlex, SR 235.1 Art. 5 Bst. d: «Bearbeiten: jeder Umgang mit Personendaten, unabhängig von den angewandten Mitteln und Verfahren, insbesondere das Beschaffen, Speichern, Aufbewahren, […]». Dazu Art. 19 Abs. 4 (zitiert in Runde 1): «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ […] mit.»

Ein Beispiel: Ein US-Anbieter wirbt mit «EU-Datenresidenz» und hat Rechenzentren in Irland, sein Support und seine Unterauftragnehmer greifen aber aus den USA zu. Nach dem Hilfetext trägt der Liegenschaftsverwalter nur «Irland» ein, und die Datenschutzerklärung verschweigt die USA. Dasselbe gilt für einen Anbieter, der fremde Cloud-Rechenzentren nutzt: Das sind nicht «die Rechenzentren des Anbieters». Der Text widerspricht damit dem Label und der Checkliste, die er erklären soll.

Fix: «Die Länder, in denen der Anbieter und die Firmen, die er beizieht, die Daten bearbeiten, auch wenn sie nur darauf zugreifen. Sie stehen meist im Vertrag oder in der Liste der Unterauftragnehmer. Die Datenschutzerklärung nennt sie. Mehrere Länder trennen Sie mit Komma.» In fr/it/en sinngemäss nachziehen.

Geprüft: Der Text für die nicht antwortende lokale KI ohne Download-Knopf. «Bis sie antwortet, erfassen Sie Rechnungen von Hand» passt zu `docs/installation.md` Abschnitt 5. `saveKiSettings` beendet einen laufenden Download auch beim Wechsel auf einen Anbieter. Das ändert keine Aussage der Datenschutzerklärung.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Ob `localhost` in `LLM_LOCAL_URL` auf einen SSH-Tunnel oder Port-Forward zu einem anderen Rechner zeigt, kann `checkLocalKi` nicht erkennen. Das wäre eine bewusste Umgehung durch den Betreiber. Geschaut habe ich in `llm.ts:50–60`. Ein Satz im README würde reichen, ich führe es nicht als Befund.
- Die fr/it/en-Fassungen der drei neuen Texte habe ich nicht gegen den deutschen Text geprüft (nicht Teil des Auftrags).
- Fedlex-Wortlaut von Art. 5 Bst. d DSG: Das Suchergebnis von `mmx search` auf fedlex.admin.ch/eli/cc/2022/491/de zeigt den Anfang wörtlich. Den Rest der Aufzählung habe ich nicht abgerufen, er trägt den Befund aber nicht.
