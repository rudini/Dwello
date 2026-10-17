# Slice-Review W4c, Runde 1 (`git diff 30f160e f471e42`, Worktree review-w4c-code)

Anforderungen: #64 Option B (Mahnfrist, Fachreview V-1 Rückerstattung), #87 Option 3 (Zahlungsfrist/Mahnfrist in den Einstellungen, Fenster der Fristen), #55 Option C (Belegung ohne Prozent).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/settings.feature:39-40, tests/e2e/steps/settings.steps.ts:59 | Neuer Schritt «erklärt das Feld …» nennt ein UI-Element («Feld»); Features sagen, was der Verwalter will (tests/e2e/CLAUDE.md). Vorschlag: «erklärt die Einstellung "Zahlungsfrist (Tage)" …». |
| C-2 | Minor | tests/e2e/features/settings.feature:31-36 | «Zahlungsfrist und Mahnfrist hinterlegen» speichert die Werte, die schon angezeigt sind (Vorgaben 30/14); das erneute Öffnen zeigt sie auch, wenn das Speichern die beiden Felder übergeht. Die Persistenz belegt nur der Unit-Test (PUT-Body in settings.test.ts:86-92). Wegen der globalen Einstellungen begründet; der Kommentar könnte das sagen. |
| C-3 | Minor | src/lib/overview.ts:524-532, messages/*.json `dashboard_task_overdue_text_*` | Fachreview V-5 offen: Die Aufgabe zählt nur Abrechnungen nach der Mahnfrist, der Link `/statements?status=overdue` zeigt alle überfälligen; #64 macht die Abweichung häufiger sichtbar. Weder behoben noch als offener Punkt vermerkt. |
| C-4 | Minor | src/lib/server/settings.ts:619-638 | ponytail `shrink`: Die drei bestehenden Prüfungen wurden in eine Regeltabelle umgebaut; zwei weitere `if`-Blöcke wären kürzer (ca. 6 statt 20 Zeilen) und hätten keinen unberührten Code umgebaut. Verhalten gleich (die Werte werden vorher getrimmt). |
| C-5 | Minor | tests/e2e/features/dashboard.feature:93-95, implementation_plan.md:53 | Für V-1 (überfällige Rückerstattung gleich nach der Zahlungsfrist eine Aufgabe) gibt es weder ein Szenario noch eine Begründung «No scenario»; genannt ist nur die Grenze der Mahnfrist. Abgedeckt nur durch overview.test.ts:169-180 und dashboard.test.ts:162-177. Begründung (Aufgabe zählt global) im Plan/PR ergänzen. |
| C-6 | Nit | src/routes/dashboard/+page.server.ts:711-714, 736-749 | Das Versprechen `config` steht ohne `.catch` in `Promise.all`; ein Body, der kein JSON ist, lässt jetzt die ganze Übersicht scheitern (vorher fing `lastPeriod(...).catch` das ab). |
| C-7 | Nit | src/routes/dashboard/+page.server.ts:710, 761-762 | Der Kommentar sagt «leaves the defaults of the backend», die Vorgaben 30/14 werden aber im BFF wiederholt (config.service.ts:74-83). |
| C-8 | Nit | backend/src/routes/dashboard.ts:53, docs/api-specification.md:253 | `buildingOccupancy[].occupancyRate` liest das Frontend nicht mehr (ponytail `delete`); entfernen oder bewusst als API-Feld lassen. |
| C-9 | Nit | tests/e2e/steps/settings.steps.ts:15-18 | `FIELDS` führt jedes Feld doppelt (mit und ohne «(Tage)»), nur weil zwei Schritte zwei Schreibweisen nutzen. |
| C-10 | Nit | src/lib/server/settings.ts:595-596 | `days` nimmt führende Nullen an («007»); gespeichert wird «007», nicht 7. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **#64:** `waiting` in src/lib/overview.ts:524-527: ohne Mahnung erscheint die Aufgabe, wenn heute > Zahlungsfrist + Mahnfrist (Grenze 14/15 wie in Fachreview, «Bestätigt», Frage 2); mit Mahnung gilt weiter `nextReminderFrom` (#107, Test overview.test.ts:132-151 unverändert grün gemeldet); eine Rückerstattung (`balance < 0`, +page.server.ts:759) wartet nicht (V-1). Der Status «Überfällig» kommt weiter aus dem Backend (statement.service.ts:80-91, 186-191), unverändert. Die Marker `TODO(fachlich prüfen, #64)` sind ersetzt (overview.ts:146, 206). Tests: overview.test.ts:153-180 (Grenze, Mahnfrist 7, Rückerstattung), dashboard.test.ts (Mahnfrist 10 aus dem Vertrag config.json, Nachzahlung gegen Rückerstattung). Ohne die Änderung schlagen sie fehl (alte Logik zeigte die Aufgabe ab Tag 1, kannte `refund` nicht und las die Einstellungen nicht).
- **#87:** Felder «Zahlungsfrist (Tage)»/«Mahnfrist (Tage)» mit sichtbarem Hilfetext über `TextInput`/`Field` (`help`, aria-describedby), `inputmode=numeric`, Fehler am Feld mit denselben Grenzen wie das Backend (config.service.ts:74-83; settings.test.ts:155-176 inkl. Grenzwerte 7/60/90 und «30,5», «1e1»). Ein leeres Feld setzt per DELETE auf die Vorgabe zurück (bestehender Ablauf). Das Fenster der Fristen folgt `paymentDeadlineDays` (overview.ts:246; Test overview.test.ts:243-255 mit 60 Tagen, dashboard.test.ts mit 45). Der Vertrag `tests/contracts/config.json` ist neu, im README eingetragen und in api-contracts.pg.test.ts:338-342 geprüft. Die Anforderungsdoku ist an beiden Stellen angepasst (Fach V-6).
- **#55:** Prozent und Marker sind aus BuildingFigures.svelte entfernt, der Typ ist bereinigt, Target und Question `occupancyRate` sind gelöscht; dashboard-page.test.ts:128-133 und das Szenario «Belegung pro Gebäude» prüfen «kein %». Beide sind vorher rot (zeigten «50.0 %»/«75.0 %»).
- **Texte:** Alle neuen bzw. geänderten Schlüssel stehen in allen vier `messages/*.json`; die Begriffe passen zu i18n-begriffe.md:67-69 (délai de paiement / délai de rappel, termine di pagamento / termine di sollecito, payment deadline / reminder period); der zitierte Knopf «Frist und Bemerkungen bearbeiten» stimmt in allen Sprachen mit `statements_edit_button` überein.
- **Screens:** Kein neuer Screen und kein neuer Zustand (neues Panel im Zustand `default` von `config`, Fehler am Feld gab es schon für PLZ/IBAN); `config default` steht in accessibility.feature:150 und sprachen-bildschirme.feature:151.
- **Screenplay:** Die Schritte rufen nur Tasks/Questions auf (`openSettings`, `saveSettings`, `storedSetting`, `settingHelp`, `occupancyShown`, `occupancyText`); der nicht mehr genutzte Schritt «… nicht» wurde entfernt.
- **Design/Sicherheit:** Nur `Panel`/`SettingField`/`TextInput` aus dem Bestand, keine Klassen neu; kein neuer Endpunkt, die Formular-Action ist dieselbe wie bisher.
- **Diff-Umfang:** Nichts gefunden, das nicht zur Anforderung gehört (Umbau in C-4 grenzwertig).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2730 Tests), `bun test src/__tests__/api-contracts.pg.test.ts`, E2E dashboard.feature und settings.feature (41 passed), accessibility + sprachen-bildschirme für config/dashboard (16 passed), `bunx fallow audit`. Ein Wiederholen der betroffenen Vitest-Dateien war nicht möglich: Der Zugriff auf `node_modules` (Symlink nach /home/user/Dwello/node_modules) ist durch eine Deny-Regel gesperrt.
- E2E und Vertragstest liefen laut Aufrufer vor dem Umbau von `settingsErrors` (C-4). Nach dem Lesen ändert er kein Verhalten; die E2E-Fehlerszenarien für PLZ und Fristen nach dem Umbau habe ich nicht gesehen.
- Ob `Accessible.descriptionOf` den Hilfetext ohne Beispiel- oder Fehlertext liefert (settings.steps.ts:59, `toContain`): nicht im Screenplay-Code nachgelesen; laut Aufrufer grün.
- Die Gründe gegen ein Szenario für «keine Aufgabe während der Mahnfrist» (die Aufgabe zählt global) sind plausibel (dashboard.ts:120 zählt alle überfälligen); ob es eine isolierbare Alternative gibt, habe ich nicht geprüft.
