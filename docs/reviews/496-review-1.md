# Code-Review #496 «Alle Daten jederzeit exportieren», Runde 1

Worktree `/tmp/scratchpad/review-496-code-reviewer` @ a00c03f; Diff `2352a1a..a00c03f` (ohne docs/reviews, Plan, Archiv) und `51d06ce..39ac1ca -- tests`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/config/export/+server.ts:54 | Die Antwort von `POST /audit-log/exports` wird nicht geprüft: lehnt das Backend ab (z.B. 401 nach abgelaufener Sitzung zwischen den Aufrufen, 500), geht der Download ohne Eintrag im Protokoll hinaus, ohne Meldung. Das widerspricht F-4 («der Export kommt ins Protokoll»), und kein Test zeigt den Fall |
| C-2 | Minor | src/routes/config/export/+server.ts:34 | Ein GET, der etwas schreibt (Protokolleintrag), ohne XSRF-Prüfung; das Session-Cookie ist `SameSite=lax` (`src/lib/server/jwt-config.ts:76`), also löst jede fremde Seite mit einem Link oder einer Top-Level-Navigation einen Export samt Eintrag «Alle Daten exportiert» aus, und der Browser legt die ZIP-Datei mit allen Mieterdaten in den Download-Ordner. Der Angreifer liest nichts, aber das Protokoll hält Exporte fest, die der Verwalter nicht gemacht hat |
| C-3 | Minor | docs/api-specification.md:136 | «read in one snapshot: settings, … and the Protokoll» stimmt nicht: Protokoll und Einstellungen liest der Dienst nach der Transaktion (`backend/src/services/data-export.service.ts:289`) |
| C-4 | Minor | backend/src/services/data-export.service.ts:572, 594, 616 (Spalte :144) | Das README nennt die Spalte anders, als sie heisst: it «Importo ancora dovuto» und en «Amount still outstanding», die Spalte heisst «Importo dovuto» / «Amount outstanding»; fr weicht mit «Montant dû» vom geprüften Wortlaut `readme_balance` («Reste dû») ab. In `i18n-begriffe.md:101-102` sind das zwei Begriffe für zwei Orte; README und Spalte müssen denselben nennen |
| C-5 | Minor | backend/src/services/data-export.service.ts:545 (und fr :567, it :589, en :611) | README: «eine Tabelle nennt einen anderen Datensatz mit dessen ID und Namen» stimmt nicht: `dokumente.csv` «Abrechnung», `abrechnungen.csv` «Übertrag aus Abrechnung», «Ersetzt Abrechnung», «Heizprofil» nennen nur die Nummer bzw. den Namen ohne ID, `einstellungen.csv` nennt Standard-Verteilschlüssel und Standard-Heizprofil nur mit der UUID |
| C-6 | Minor | backend/src/services/data-export.service.ts:248-249, 261, 437 | Ohne Test: Ja/Nein als Wort (F-5), die Art «Von Dwello»/«Eigene» bei Kategorien, Verteilschlüsseln und Heizprofilen, die Konfidenz in % (V-4) und Zeitstempel in Schweizer Zeit; keiner der neuen Tests würde rot, wenn diese Zeilen fehlten |
| C-7 | Minor | src/__tests__/data-export.test.ts:9-15 | Parameter `status` von `exported()` und der Zweig `status === 200 ? … : {}` werden nie benutzt (jeder Aufruf ohne Argument; der Fehlerfall baut sein eigenes `fetch`) |

Keine Blocker, keine Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`; `bun run check`; `cd backend && bun run type-check`; Backend data-export, audit-log, api-contracts, tenant-export (137); `bunx vitest run --changed origin/main` (533); i18n, backend-codes, tokens, design-guard, open-work, no-german-in-code, e2e-screenplay-lint, config-i18n, settings, tenant-export (1105); E2E chromium datenexport, settings, tenants, privacy (74), zugangsschluessel, ki-einstellungen, breadcrumb, einrichtung (67); axe/Sprachen config default/backup-links (4), audit-log (6); Prettier auf neuen Dateien.
- Ob `pg` 8.23 (node-postgres, `backend/src/db/connection.ts`) gleichzeitige Abfragen auf dem einen Client der Transaktion (`Promise.all` in `data-export.service.ts:265-288`) ohne Deprecation-Warnung einreiht; neuere 8.x-Versionen warnen bei `client.query()` während einer laufenden Abfrage. Ohne `node_modules` im Worktree nicht nachgelesen; die Schnappschuss-Eigenschaft selbst hat keinen Test (Entscheid des Implementierers).
- In welcher Zeitzone `timestamp` ohne Zeitzone aus `pg` als `Date` ankommt und ob `swissTime` (:236) damit die Schweizer Zeit zeigt (offen auch in der Fachprüfung, «Nicht bestätigt»).
- Dass fflate beim ZIP das UTF-8-Flag für Namen mit é/ä setzt (F-6): nur aus dem E2E-Lauf des Aufrufers (fr-Beispiel) geschlossen.
- Ob #1039 offen ist (TODO-Marker): nicht auf GitHub nachgesehen; `open-work` meldet der Aufrufer grün.

Geprüft: alle Dateien des Diffs; F-1..F-8, V-1..V-10, M-1, R-1 (privacy.feature netto unverändert gegen 51d06ce), Wortlaut-Tabelle (bis auf C-4, fr-Guillemets mit U+00A0), Status-Wörter gegen `statements_status_*`, Überfällig wie `statement.service.ts:215`, Übertrag wie `:432`, keine Geheimnisse in der Datendatei (Hash-/verschlüsselte Spalten nicht gelesen), Pfade über `safe()`, Formelschutz, Screenplay-Schichten, positive Anker, Texte in allen vier Sprachen, keine neue Bildschirmzeile nötig; Implementierer-Entscheide (Texte im Backend wie `NAMES`, Codes für einige Werte, `error(500)` ohne Seite, BFF schreibt CSV und Protokoll) tragen.
