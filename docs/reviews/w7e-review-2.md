# Code-Review 2: Protokoll unter «Einstellungen» (#357), Nachprüfung C-1 und Schlussrunde

Worktree `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-code2` (4295ea6). Geprüftes Delta: `git diff 27203ee 450a417` (32 Dateien). Alle Code-, Test-, Feature- und Message-Dateien darin habe ich gelesen, ebenso die Persona- und Review-Dokumente auf ihre Befunde hin. Den Merge 450a417..4295ea6 habe ich nur auf Berührungen hin geprüft: im Bereich Protokoll ändert er nur `privacy-page.dom.test.ts`, mit einem neuen describe-Block zu #86, unabhängig vom Protokoll.

**C-1 (Major) ist geschlossen.** `src/routes/config/audit-log/+page.server.ts:15-22` beantwortet ein 404 mit `redirect(303, '/config/audit-log')`, so wie einen Erfolg. Der englische Backend-Text kann den Dialog damit nicht mehr erreichen. Jede andere Ablehnung (422, 500) zeigt `audit_delete_failed`, nie `body.error`. Das Szenario «Eintrag löschen, der inzwischen schon gelöscht ist» (`tests/e2e/features/settings.feature:94-104`) wäre ohne den Fix rot. Beim alten `deleteRecord` kam ein `failure` zurück, und `update()` im `enhance` von `DeleteDialog.svelte:60-68` lädt nach einem `failure` die Daten nicht neu. Der Eintrag bliebe also in der Liste, und `auditEntryCount(...)` wäre 1 statt 0. Weil nichts Neues angezeigt wird (Liste ohne den Eintrag, Toast «Der Eintrag ist gelöscht.»), entsteht kein neuer Zustand für `screens.json`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-18 | Minor | `src/routes/config/audit-log/+page.server.ts:15-22` | Für die neue Verzweigung (404 → redirect, sonst `fail` mit `audit_delete_failed`) gibt es keinen Unit-Test. Review 1 schlug für diese Variante ausdrücklich einen vor. Gezeigt wird das Verhalten nur über E2E, obwohl ein Action-Test wie `tenant-detail.test.ts:122-129` (`runAction(actions.delete, …, 404)`, dazu 500 mit `audit_delete_failed`) es tiefer zeigen könnte. |
| C-19 | Nit | `src/routes/config/audit-log/+page.server.ts:16-17` | Die `id` aus dem Formular geht ohne `encodeURIComponent` in den Pfad. `documents.ts:57` kodiert sie und testet das (`tenant-documents.test.ts:87`), `category.ts:122` tut es nicht. Wegen der XSRF-Prüfung und nur eines Benutzers ohne praktische Folge. Vorschlag: `encodeURIComponent(String(id))`. |
| C-20 | Nit | `tests/e2e/features/settings.feature:100` | «Und der Liegenschaftsverwalter den Eintrag … löschen will» steht im Angenommen-Block und hat Nebensatzstellung, weil der Wenn-Schritt wiederverwendet wird. Grammatisch wäre «Und der Liegenschaftsverwalter will den Eintrag … löschen» richtig (eigener Schritt, gleiche Task). |
| C-21 | Nit | `messages/de.json` `audit_payment_reset` / `audit_payment_reset_undated` | Mit Datum heisst es jetzt «Zahlung vom {date} zur Abrechnung {number} zurückgesetzt», ohne Datum weiterhin «Zahlung der Abrechnung {number} zurückgesetzt». Vorschlag: «Zahlung zur Abrechnung {number} zurückgesetzt». |
| C-22 | Nit | `messages/en.json` `audit_category_included`; `messages/it.json` `audit_privacy_demo` | en «its invoices that are not allocable stay so» liest sich holprig, z. B. besser «its invoices that are not allocable stay that way». it «possono eliminarne voci» kombiniert «ne» mit dem Objekt; besser «possono eliminare voci» oder «possono eliminarne». |
| C-23 | Nit | `src/lib/server/login-flow.ts:62-76` | ponytail: `signal: AbortSignal.timeout(5000)` ersetzt Controller, Timer und `finally` (-4 Zeilen). Ob die Fake-Timer in `auth-routes.test.ts` `AbortSignal.timeout` vorspulen, habe ich nicht geprüft; falls nicht, ist die jetzige Form richtig. |
| C-24 | Nit | `tests/unit/auth-routes.test.ts:288-305` | Der Test zeigt nur, dass die Anmeldung nach 5 s weitergeht («höchstens»). Auch ein Timeout von 0 ms bestünde ihn. Als Schutz gegen das Hängen genügt das. Ohne `signal` bleibt `await redirect` hängen, rot gesehen ist er also. |

Ponytail für das Delta: Nach C-13/C-14 ist es schlank (`testid` und Fallback entfernt). Die Action ist inline statt `deleteRecord` und braucht dafür etwa 4 Zeilen mehr; das ist für die 404-Verzweigung gerechtfertigt. Nur C-23 bleibt (`net: -4 lines possible.`).

Weitere Punkte habe ich geprüft und ohne Befund gefunden:
- C-4: `recordLogin` bricht nach 5 s ab, ein Fehler wird geloggt, und die Anmeldung läuft weiter. Den neuen Test habe ich laufen lassen, er ist grün; dass er ohne die Änderung rot wäre, habe ich nur aus dem Code geschlossen.
- C-8: Der Titel lautet `audit_not_deleted` und kommt in allen vier Sprachen vor. Der DOM-Test prüft Titel und Text.
- C-13: Das Target sucht den Link in `quick-link-audit-log` (`ConfigLinks.svelte:52`), ein Testid pro Link gibt es nicht mehr.
- C-14: Der Fallback ist weg. Das Backend nimmt nur `google`/`microsoft` an (`backend/src/routes/audit-log.ts:19`).
- C-16: Die README-Zeile ist an das Ende verschoben.
- V-15 / C-17: `normalizeDecimal` («3.50» → «3.5», «4.0» → «4»), mit Test.
- Anna P-1: Der Link steht vor dem Formular. `config-pages.test.ts` prüft die Reihenfolge.
- Anna P-2: `audit_category_included` ist inhaltlich richtig. `category.service.ts:187-191` setzt Rechnungen nur beim Ausschliessen zurück, beim Wiedereinschliessen bleiben sie, wie sie sind.
- Sven P-1: Der Zeitpunkt steht im Namen des Löschknopfs, mit DOM-Test. Der sichtbare Text «Löschen» bleibt im zugänglichen Namen enthalten.
- Weber/Helga, V-12, V-16, R-5: Die neuen Texte stehen in allen vier `messages/*.json`, und `privacy.feature:35` ist nachgezogen.

Blocker oder Major gibt es in diesem Review keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, backend `bun run type-check` und `bunx vitest run` (159 Dateien, 2842 Tests) auf 4295ea6. Auf 450a417 außerdem `bun test src/__tests__/audit-log.pg.test.ts` (15 pass) und E2E Chromium `-g "Protokoll|audit-log |config |Datenschutz|Breadcrumb"` (54 passed).
- Neu ausgeführt und grün: `bunx vitest run src/__tests__/audit-log-mapping.test.ts src/__tests__/audit-log-page.dom.test.ts src/__tests__/config-pages.test.ts src/__tests__/privacy-page.dom.test.ts tests/unit/auth-routes.test.ts` (74 Tests).
- Dass das neue Szenario und der Timeout-Test ohne die Änderung rot wären, habe ich nur durch Lesen geschlossen und nicht ausgeführt.
- Der neue fachliche Text zu Anna P-2 («ihre nicht umlagefähigen Rechnungen bleiben es») und die neue Wortstellung bei V-12 sind nach der Fachprüfung 2 entstanden. Ob der fach-reviewer sie gesehen hat, geht aus `docs/reviews/w7e-fachreview-2.md` nicht hervor, für P-2 steht dort nichts.
- Ob im Schritt «warnt das Protokoll, der Eintrag von heute …» Zeitzone und Datum um Mitternacht stabil sind: Dasselbe Risiko trägt schon «mit heutigem Datum», geprüft habe ich es nicht.
- Die vollständige Backend-Suite und der volle E2E-Lauf stehen laut Aufrufer noch aus.
