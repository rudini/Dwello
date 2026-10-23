# Code-Review H-28 (#717) Schritt 2: Einstellungen im Backend geprüft, Runde 1

Bereich: `git diff 2ebcd9ac2 917d453c2` (1 Commit, 14 Dateien), Worktree `review-h28g-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/config.service.ts:263 | `creditorMissing` läuft nur, wenn kein anderes Feld abgelehnt ist. Das alte BFF meldete die fehlende Firmenadresse (#450) zusammen mit den anderen Fehlern (`if (s.iban && !errors.iban && creditorMissing(s).length)`). Beispiel: E-Mail ungültig, Name geleert, IBAN gültig. Bisher waren E-Mail, IBAN und Name markiert, jetzt nur die E-Mail. Die Firmenadresse erscheint erst beim zweiten Speichern. Das widerspricht «dieselben Felder markiert». Kein Test zeigt diesen Fall. Lösung: die Bedingung auf «IBAN selbst gültig» beschränken statt auf `errors.length === 0`. |
| C-2 | Minor | src/__tests__/settings.test.ts (gelöschte Tests), backend/src/__tests__/config.pg.test.ts:157 | Mit den BFF-Tests sind Prüfungen weggefallen, die keine Schicht ersetzt. Grenzen der Tage: 7/90 und 7/60 angenommen, 6/91 und 6/61 abgelehnt. Das Backend testet nur «30,5» und «1e1», E2E nur 5 und 61. Ausserdem fehlt der Test für eine IBAN aus Liechtenstein mit falscher Prüfziffer. Ein `<= 90` → `< 90` bliebe so unbemerkt. |
| C-3 | Minor | backend/src/routes/config.ts:58-64 | Toter Code: `setMultipleConfig` wirft keinen `CodedError` mehr (die IBAN-Prüfung gibt jetzt einen Fehler zurück, statt zu werfen). `try/catch` mit `errorBody` sowie der Import von `CodedError`/`errorBody` für diese Route sind unbenutzt. |
| C-4 | Minor | backend/src/services/config.service.ts (`setMultipleConfig` → `removeConfig`) | Neuer Weg ins Protokoll: eine Verwaltungspauschale, die im PUT geleert wird, schreibt `management_fee_changed {from, to: '3'}` jetzt in der PUT-Transaktion. Der Code ist richtig (gleiche Funktion wie `DELETE`). Kein Test prüft aber den Eintrag auf diesem Weg. Der Reset-Test (config.pg.test.ts:201) setzt die Pauschale 4 → leer, prüft das Protokoll aber nicht; `audit-log.pg.test.ts:74` deckt nur `DELETE /config/:key` ab. |
| C-5 | Minor | backend/src/services/config.service.ts:85-90 (`validateIBAN`) | Die IBAN-Prüfung ist lockerer als vorher. Das alte BFF verlangte `^(CH\|LI)\d{7}[A-Z0-9]{12}$`, also eine 5-stellige numerische Instituts-Identifikation. `validateIBAN` nimmt `[A-Z0-9]{17}` an, also auch Buchstaben an den Stellen 5–9, wenn die Prüfziffer stimmt. Selten, aber eine Prüfung ist verloren. |

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer ausgeführt (vom Aufrufer gemeldet, nicht wiederholt):
  - Rot-Läufe der neuen Tests in `config.pg.test.ts` und `settings.test.ts`
  - `bunx vitest run --changed origin/main`
  - `bun run lint`, `bun run check`, `bun run type-check`, `bunx fallow audit`
  - E2E `settings.feature` (19 bestanden)
  - volles `bun run test` im Backend (1530)
- `bunx vitest run src/__tests__/settings.test.ts src/__tests__/config-i18n.test.ts` konnte ich nicht ausführen: Der Zugriff auf `node_modules` im Worktree ist per Regel gesperrt.
- Durch Lesen beurteilt, dass die neuen Tests ohne die Änderung rot wären:
  - Mit `parseFloat` wäre «2,555» als 2 angenommen worden.
  - Die alte Antwort hatte keine `causes`.
  - `checkCreditor` warf ohne `causes`.
  - Das alte BFF lieferte bei einer 400 des Backends `settings_save_failed`.
- Ob Elysia unbekannte Schlüssel im PUT-Body durchlässt (Zweig `!configDef` in `configError`), habe ich nicht geprüft.

Geprüft:
- Texte: Die sechs neuen `backend_*`-Meldungen entsprechen in de/fr/it/en wörtlich den alten Texten (`backend_postal_code_digits` = alt `buildings_error_postal_code_digits`, Pauschale = `statements_error_fee`, `backend_config_value_invalid` = `settings_save_failed`). Die entfernten Schlüssel werden nirgends mehr verwendet.
- Verträge: `config-fields-refused.json` und `config-iban-address-missing.json` entsprechen der Antwort, haben einen API-Vertragstest und werden in den BFF-Tests verwendet.
- Zuordnung Schlüssel → Feld im BFF: `FIELDS`, `missing`, `form` als Rückfall.
- Andere Aufrufer von `setConfig`, `PUT /config/:key` und `PUT /config` (Backend-Tests, `audit-log` mit «4.250»): keine Regression gefunden.
- Das BFF entscheidet nichts Fachliches mehr; Trimmen und IBAN-Gruppierung sind Darstellung.
