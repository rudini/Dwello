# Code-Review 580, Runde 3 (Abschlussrunde: 403afe0..2b03de4 ohne docs/reviews, Plan, Archiv, Personas; Merge 84683df)

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-11 | geschlossen | Die Startmeldung (`backend/src/config/llm.ts:59`) nennt jetzt zuerst, was vor dem Start zu tun ist: `LLM_LOCAL_URL` auf localhost oder den Compose-Dienst ollama setzen oder die Zeile entfernen. Erst danach verweist sie auf die Seite «KI». Der Test `llm-recipient.test.ts:107` wurde nachgezogen. |
| C-12 | geschlossen | `ki-settings.pg.test.ts:125-129` speichert «lokal» und danach einen Anbieter und erwartet `unknown`. Ohne `loadModel(local: false)` in `saveKiSettings` bliebe `current` bei `loading 40`, weil `loadModel` den Zustand erst beim nächsten Aufruf zurücksetzt. Der Test fällt also rot aus, wie die Commit-Nachricht 2b03de4 sagt. |
| C-13 | offen (Minor, unverändert) | `ki-model.service.ts` und `ki-model.test.ts` kommen im Delta nicht vor. Der Minor bleibt im Bericht von Runde 2 stehen. |
| C-14 | geschlossen | `docs/api-specification.md:239` stimmt jetzt mit `checkKiConnection` überein: `no-images` nur bei 400, alles andere ergibt `unreachable`. |
| C-15 | geschlossen | `tests/e2e/tasks/accessibility.ts:676-683` setzt die KI-Attrappe im `finally` zurück. |
| C-16 | geschlossen | Test (`ki-settings.pg.test.ts:89-99`) und Kommentar (`ki-settings.service.ts:89-90`) nennen keine LAN-Adresse mehr als lokale KI. Sie stimmen jetzt mit F-23 überein. |

## Neue Befunde

Keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `bun run check`, Backend `bun run type-check` und der volle `bunx vitest run` (3635) auf 84683df. Ebenso die Backend-`bun test` von `ki-settings.pg` (30) und `llm-recipient` auf 2b03de4, der rote Lauf des C-12-Tests ohne den Abbruch und `bunx fallow audit`.
- Erneut ausgeführt: `bunx vitest run src/__tests__/ki-settings-page.svelte.dom.test.ts`, 9 von 9 grün.
- Den C-15-Pfad (ein `look`, das scheitert) habe ich nur gelesen. Kein E2E-Lauf, gemäss Auftrag.
- Der umgestellte C-1-Test nutzt jetzt `http://ollama:11434/v1`. Er hält damit gehaltenes Verhalten fest: Mit diesem Host gäbe `llmRecipient` ohnehin `null` zurück. Den ursprünglichen C-1-Fehler zeigt er also nicht mehr. Dieser Fehler ist wegen der Startprüfung (`index.ts:15`) im Betrieb aber nicht mehr erreichbar.
- Die inhaltliche Richtigkeit der Hilfetexte und der Startmeldung (F-27 bis F-31) habe ich nicht beurteilt. Das ist Sache des fach-reviewer. F-28 schlug zusätzlich «or set LLM_BASE_URL, LLM_PROVIDER and LLM_PROVIDER_COUNTRY» vor, die Meldung lässt das weg.

Geprüft: Die geänderten Hilfetexte stehen in allen vier Sprachen. Im Französischen stehen schmale Leerzeichen innerhalb von « ». Der DOM-Test prüft den neuen deutschen Text. Kein Test und kein Schritt prüft noch den alten Text. Nach dem Merge hat jede Sprachdatei 2036 Schlüssel ohne Doppelte, und `screens.json` ist gültig. Laut `--remerge-diff` hat 84683df nur in `implementation_plan.md` und `docs/archive/implementation-plan-verlauf.md` aufgelöst, der App-Code ist ohne Konflikt zusammengeführt. Der Neustart-Befehl in `docs/installation.md` passt zu Dienst und Container `dwello-ollama` in `docker-compose.prod.yml`. Nichts im Delta hat mit der Anforderung nichts zu tun.
