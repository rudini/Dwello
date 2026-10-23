# Code-Review H-28 (#717) Schritt 2, Runde 3 (Abschlussrunde vor dem Push)

Bereich: `git diff ac3027f4c 57921034c` (ohne docs/reviews, implementation_plan.md, docs/archive). Delta seit Runde 2: Commit 57921034c (Kommentar in `backend/src/services/tenant-fields.ts`, eine Zeile in `docs/api-specification.md`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| K-4 | Minor | backend/src/services/tenant-fields.ts:18 | offen, bleibt im Bericht (Entscheid des Aufrufers); vom Delta nicht berührt |
| K-5 | Minor | backend/src/services/tenant-fields.ts:43-49, docs/api-specification.md:88 | erledigt: Kommentar und Spezifikation nennen jetzt den POST ohne `correspondenceChannel` (gespeichert mit DB-Standard `letter`, schema.ts:100, ohne Prüfung). Die Aussage «the form always sends one» stimmt: src/lib/server/tenant-form.ts:19 setzt immer `email` oder `letter`. |

Keine neuen Befunde (keine K-6). Das Delta ändert kein Verhalten, nur Kommentar und Dokumentation; ein Test ist dafür nicht nötig.

Geprüft: Kommentar und Spezifikationszeile gegen `tenantFieldErrors` (Zeile 28: Kanal nur bei gesendetem Wert geprüft), `newTenantFieldErrors` (Zeile 48 f.: kein Standard für den Kanal), Route backend/src/routes/tenants.ts:43, 116 und den DB-Standard.

## Nicht bestätigt

- Backend type-check auf 57921034c: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Prettier auf den geänderten Zeilen: vom Aufrufer gemeldet, nicht erneut ausgeführt.
