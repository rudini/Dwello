# Code-Review Runde 2: Mahnfristen und Postversand (#107, #193, #194), Delta der Korrekturen

Worktree `review-reminders-code2` (detached auf `1a0cd60`), Bereich `5fd7b55..1a0cd60` (2 Commits, 27 Dateien, alle gelesen; der Persona-Bericht und `reminders-review-1.md` nur als Dokumente).

## Stand der Befunde aus Runde 1

| ID | Stand | Beleg |
|----|-------|-------|
| C-1 | behoben | `backend/src/services/statement.service.ts:47`: `count(*) < 3 and status = 'sent'` (gespeicherter Status; «overdue» wird nur berechnet, `schema.ts:387`). Test `reminders.pg.test.ts:328-333` wäre ohne die Bedingung rot (Frist der Mahnung ist heute, also `heute + 1` statt `null`). |
| C-2 | behoben | `reminders.pg.test.ts:256-261`: Die Frist wird nach der 3. Mahnung in die Zukunft gesetzt, die Abrechnung bleibt «sent». So prüft der Test allein `count(*) < 3`. Ohne diese Bedingung wäre er rot. |
| C-3 | behoben | `docs/api-specification.md:34,205,232,239,241` beschreiben jetzt `REMINDER_TOO_EARLY` mit Parametern, `nextReminderFrom`, die neue 400, das Neuerstellen samt Kanal `letter` sowie `paymentDeadline`. Alles stimmt mit `reminder.service.ts:145-153` überein. |
| C-4 | behoben | `reminders.pg.test.ts:381-390`: Die Uhr läuft einen Tag vor. Ohne den Schutz `status !== 'to_send'` ergäbe der Test `created + 18` statt `created + 17`, er wäre also rot. |
| C-5 | abgelehnt (Begründung: lokale DB in UTC) | Die Begründung trifft nur die lokale Datenbank. Sie bleibt Minor aus Runde 1 und wird hier nicht weiter verfolgt. |
| C-6 | behoben | `src/lib/overview.ts:113` filtert jetzt `paymentDeadline < today`, dieselbe Grenze wie `statusCondition('overdue')` (`statement.service.ts:86`). Der Test `overview.test.ts:151-173` wäre vorher rot gewesen (1 − 1 = 0). |
| C-7 | abgelehnt (Import-Zyklus) | Die Begründung hält: `reminder.service.ts` importiert `statement.service.ts`. |
| C-8 | behoben | `tests/e2e/fixtures/dates.ts:9`; beide Steps importieren es. Der pg-Test nutzt `formatSwissDate`. |
| C-9, C-10 | offen gelassen (Nit) | Keine Änderung. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-11 | Major | `tests/e2e/features/documents.feature:24-27` | Neues sichtbares Verhalten ohne fachliches Szenario. Nach «Als versendet markieren» erscheint ein Hinweis, der den Brief nennt und «PDF herunterladen» anbietet (V-14, P-4). Kein Szenario prüft das. Die neuen Zeilen in `accessibility.feature` und `sprachen-bildschirme.feature` prüfen nur axe und die Sprache. |
| C-12 | Minor | `src/routes/documents/MarkedSentNotice.svelte:10-23` | Der Hinweis wird weder angesagt noch fokussiert. Nach dem Absenden mit `use:enhance` verschwindet der gedrückte Knopf (unter «Zu versenden» die ganze Zeile, unter «Alle» der Knopf), der Fokus fällt auf `body`. Ein Positiv-`Alert` hat keine Live-Region (`Alert.svelte:25`). Das Muster im Projekt ist `ReminderFeedback.svelte:24` (`<div role="status">`). Wer mit Screenreader oder Tastatur arbeitet, erfährt nicht, dass das neue PDF zum Drucken bereitliegt. |
| C-13 | Minor | `src/routes/documents/+page.svelte:18-39,61-62` | Die Filter-Links sind umgebaut (Klassen und `aria-current` in ein `.map` verlegt), obwohl ihr Verhalten gleich bleibt. Falls das Gate von fallow/deepcheck (Template-Komplexität) diesen Umbau erzwungen hat, gehört das in den Commit oder den Plan. Sonst zurücknehmen. |
| C-14 | Minor | `src/__tests__/documents.test.ts:47-48` | Die Antwort von `PUT /documents/:id/sent` stammt aus dem Listen-Contract `documents.json`. `api-contracts.pg.test.ts:236` prüft aber nur `GET /documents` gegen diesen Contract, nicht die PUT-Antwort, die die Action jetzt liest (`tenantName`, `type`, `reminderLevel`). Heute ist die Form gleich (beide nutzen `getDocument`), ungeprüft ist sie trotzdem. Gotcha «API contracts»: einen eigenen Contract anlegen oder den PUT im Contract-Test gegen `documents.json` prüfen. |
| C-15 | Minor | `src/routes/documents/+page.server.ts:341-342`, `messages/de.json:891` | Ist der Brief schon versendet (alter Tab), lässt das Backend ihn unverändert (`reminder.service.ts:147`). Der Hinweis sagt trotzdem «Der Brief trägt jetzt das heutige Datum und eine neue Zahlungsfrist. Drucken Sie ihn jetzt aus …». Das ist eine Randlage und braucht eigentlich nur einen Vergleich `sent.status`/`sentAt`. |
| C-16 | Nit | `tests/e2e/fixtures/screens.ts:38` | ponytail `delete:` `'marked-sent'` in der Ausnahmeliste ist überflüssig. Der Pfad enthält über `queries` schon `{remindedLetter}` (`screens.ts:21-22`, `screens.json:443`), `path.includes('{')` greift also. Den Eintrag streichen. |
| C-17 | Nit | `src/routes/documents/MarkedSentNotice.svelte:16-22` | ponytail `reuse:` Der Knopf steht als `<p>` im Inhalt. `Alert` hat für einen Knopf einen eigenen `action`-Snippet (`Alert.svelte:32`, so verwendet in `gallery/+page.svelte:221`). `{#snippet action()}<Button …/>{/snippet}` spart den Wrapper. |

ponytail-review: Neben C-16 und C-17 lässt sich nur der Filter-Umbau zurücknehmen (C-13), falls kein Gate ihn verlangt. net: -12 lines possible.

## C-11 (Major): Hinweis nach «Als versendet markieren» ohne Szenario

**Warum falsch:** CLAUDE.md, Workflow Schritt 1 und «Done means»: Jede sichtbare Verhaltensänderung braucht ein Szenario in `tests/e2e/features` ohne `@wip`. Neu ist ein Zustand, den der Liegenschaftsverwalter sieht: der Hinweis, der den Brief und den Mieter nennt, und das PDF zum Ausdrucken, auch unter «Zu versenden». Unit- und DOM-Test (`documents.test.ts:47-54`, `documents.dom.test.ts:103-113`) prüfen die Action und das Rendern. Sie zeigen aber nicht, dass im echten Ablauf (enhance, `update()`, Neuladen der Liste) der Hinweis bleibt, während der Brief aus der Liste verschwindet, und dass der Link das neu erstellte PDF liefert. Gerade das war der Befund P-4. Die axe- und Sprachzeilen erreichen den Zustand per `PostFormAction` ohne `enhance` und prüfen keinen Inhalt. Ein Grund für «No scenario» fehlt. Der Zustand lässt sich im E2E-Stack herstellen: Das Szenario «Brief als versendet markieren» kommt schon genau dorthin.

**So zeigt man es:** `grep -rn "document-marked-sent" tests/e2e/questions tests/e2e/steps tests/e2e/features` findet nur die a11y-Task. Nimmt man `{#if form?.sent}…{/if}` aus `+page.svelte:76`, bleibt jedes fachliche Szenario grün. Nur die axe-Zeile würde beim Warten auf `document-marked-sent` scheitern, und das Beispiel ist im Grunde ein Zugänglichkeitstest.

**Behebung:** `documents.feature`, Szenario «Brief als versendet markieren», um einen Schritt wie «Und bietet Dwello die "Zahlungserinnerung" an "Anna Keller" zum Ausdrucken an» ergänzen. Dafür eine Question, die den Text des Hinweises liefert, und eine, die das PDF über den Hinweis lädt und dessen Datum bzw. Magic Bytes zurückgibt (Bausteine dazu gibt es in `questions/download`).

## Nicht bestätigt

- Alle Prüfungen sind **vom Aufrufer gemeldet**, keine habe ich wiederholt: `bun run lint`, `bun run check`, fallow audit, `bunx vitest run` für documents, documents.dom, overview und backend-error, `cd backend && bun test src/__tests__/reminders.pg.test.ts` (24 grün). Auf `5fd7b55`: die volle vitest- und Backend-Suite und type-check. Die volle E2E-Suite lief laut Aufrufer noch. Meinen Versuch, `bunx vitest run src/__tests__/documents.test.ts src/__tests__/documents.dom.test.ts src/__tests__/overview.test.ts` laufen zu lassen, hat die Sandbox gesperrt: `node_modules` des Worktrees zeigt auf `/home/user/Dwello/node_modules`, und eine Deny-Regel verbietet den Zugriff.
- Ob die Rot-Nachweise stimmen, habe ich nur durch Lesen beurteilt (siehe Tabelle oben). Die neuen Tests in `documents.test.ts` und `documents.dom.test.ts` wären ohne die Änderung rot: Die Action lieferte `undefined`, und der Hinweis fehlte.
- Ob der Umbau der Filter (C-13) vom Gate erzwungen war: Die Commit-Nachricht und `implementation_plan.md` sagen dazu nichts. `.fallowrc.json` setzt keine eigenen Schwellen.
- Dass der a11y-Zustand `marked-sent` in allen Viewports grün läuft: Nach dem ersten Markieren ist der Brief «sent», und jede weitere Ansicht markiert ihn erneut ohne Änderung (`reminder.service.ts:147`). Laut Code geht das. Ob es in E2E grün lief, weiss ich nicht, denn der Lauf war noch nicht fertig.
- Die neuen Texte in fr/it/en habe ich auf Vollständigkeit und auf die Begriffe «délai de paiement», «termine di pagamento» und «payment deadline» (`i18n-begriffe.md:66`) geprüft, die Wortwahl sonst nicht.
- `docs/reviews/reminders-fachreview-2.md` (V-14) liegt nicht im Worktree. Die Anforderung habe ich aus dem Auftrag und aus P-4 im Persona-Bericht entnommen.
