# Code-Review 577, Runde 2 (80a0e4f..1c5936c)

## Status der Befunde aus Runde 1

| ID | Status |
|---|---|
| C-1 | Erledigt: `ProgressBar` im Hinweis (KiModelNotice.svelte:18-22), Test prüft `role="progressbar"` mit `aria-valuenow`/`aria-valuemax` |
| C-2 | Erledigt: Kurzschluss bei SETUP_DONE vor dem Lock, Prüfung und Insert über `tx` (setup.service.ts:45-64, local-account.service.ts:29-58); Test mit 25 gleichzeitigen Einrichtungen und Zeitgrenze 5 s, der auf der Basis (Pool 20) am 10-s-Timeout scheitert |
| C-3 | Erledigt: Stand-in auf 2532 mit `LLM_STUB_PULL=fail`, Szenario, `ki-model-failed` in screens.json und beiden Features |
| C-4 | Erledigt: Unit-Tests für 423 (Uhrzeit 14:45 aus `until` 12:45Z), 409 und 502; Verträge `setup-locked`/`setup-done` gegen die API geprüft; `No scenario` in der Commit-Nachricht begründet (im PR noch zu nennen) |
| C-5 | Erledigt: `EMAIL_UNUSABLE` (400) mit `backend_email_unusable` in vier Sprachen, `backend-codes.test.ts` deckt den Code ab; leere Felder fängt das BFF ab (`setup_error_empty`), ein leerer Code zählt nicht mehr zur Sperre |
| C-6 | Offen (Minor, unverändert) |
| C-7 | Offen (Minor, unverändert) |
| C-8 | Teilweise: die Action führt mit Anbieter zu `/login`; das Backend loggt mit Google ohne Konto mit Passwort weiterhin bei jedem Start einen Einrichtungscode (Minor) |
| C-9 | Offen (Minor, unverändert) |
| C-10 | Erledigt: in der Nachricht von 1c5936c genannt |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Minor | playwright.config.ts:164-165; tests/e2e/tasks/accessibility.ts:643-644 | Die leere Instanz zeigt jetzt bei jedem Aufruf der Übersicht den Hinweis «Das KI-Modell konnte nicht geladen werden». Damit sieht der bestehende Zustand `dashboard`/`first-use` (axe und Sprachen) nicht mehr die erste Benutzung ohne KI-Hinweis, sondern denselben Bildschirm wie `ki-model-failed`. Die Bedeutung von `first-use` in `stateMeanings` erwähnt das nicht |

Keine Blocker, keine Majors.

## Nicht bestätigt

- Unit-Tests nicht wiederholt: `bunx vitest run` im Review-Worktree scheitert mit `ERR_MODULE_NOT_FOUND` (kein `node_modules`). Vom Aufrufer gemeldet: lint, check, backend type-check, `bunx vitest run` (3592), Backend-Dateien setup/ki-model/local-account/api-contracts/init-secrets/compose-prod (116), E2E chromium einrichtung.feature (12) und die axe-/Sprachzeilen von setup, dashboard (ki-model-loading, ki-model-failed), empty, first-use, privacy (90), prettier.
- Rot der neuen Tests nur durch Lesen beurteilt: 25-fach-Test (Basis: Halter wartet auf 21. Verbindung, 10 s Timeout), letzte Zeile ohne Umbruch (Basis: Zustand bleibt `loading`), Fortschritt über Schichten (Basis: 0 statt 98), Schritt «stehen … die Passwörter noch da» (Basis leert die Felder), Unit-Tests C-4/C-8/Anna (Basis: Zweige fehlen bzw. 422/Backend-Aufruf).
- Ob Ollama die Schichten eines Modells nacheinander oder gleichzeitig meldet: bei nacheinander gemeldeten Schichten kann der Prozentwert beim Beginn einer grossen Schicht zurückspringen. Nicht prüfbar ohne echtes Ollama.

Geprüft: Executor-Typ und Aufrufe von `setLocalAccount`/`hasLocalAccount`; Reihenfolge SETUP_DONE vor SETUP_LOCKED; Vertrag `setup-locked` erreicht die Sperre mit 1 + 4 falschen Codes; Texte (V-7, R-6, `setup_error_empty`, `backend_email_unusable`, `privacy_login_local_1`) in allen vier Sprachen; Marketing-Seiten und `marketing/i18n/*.json` (Containername `dwello-backend` stimmt mit docker-compose.prod.yml); Screenplay-Schichten der neuen Schritte, Task und Fragen (Wert statt ja/nein); Port 2532 sonst unbenutzt; Tokens der ProgressBar.
