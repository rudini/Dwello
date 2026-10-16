# Code-Review Runde 3 (letzte): Mahnfristen und Postversand (#107, #193, #194), Delta

Worktree `review-reminders-code3` (detached auf `0ebf1aa`), Bereich `1a0cd60..0ebf1aa` (2 Commits, 13 Dateien). Alle Dateien gelesen. Die vier Berichte unter `docs/` habe ich nur als Dokumente gelesen.

## Stand der Befunde aus Runde 2

| ID | Stand | Beleg |
|----|-------|-------|
| C-11 (Major) | behoben | `documents.feature:27`, Schritt `documents.steps.ts:143-150`. Er prüft den Text des Hinweises (`questions/documents.ts:18`, Text des Hinweises `document-marked-sent`) und die Anzahl der Druckangebote (`printOffers`, = 1). Die Questions liefern den Wert, also Text und Anzahl. Der Schritt ruft nur Questions auf, die Screenplay-Schichten sind eingehalten. Ohne `MarkedSentNotice` wäre der Schritt rot: Die Question liefert `null`, `toContain` scheitert. Die Task `markLetterSent` wartet nicht, aber `sees` fragt per `expect.poll` so lange nach, bis der Hinweis da ist. Rest: C-19 (Nit). |
| C-12 | behoben | `MarkedSentNotice.svelte:10-27`: Ein `<div role="status">` wird immer gerendert, der Alert erscheint darin. Das ist dasselbe Muster wie `ReminderFeedback.svelte:24`. Nach `use:enhance` steht die Live-Region schon, der Inhalt wird also angesagt. |
| C-13 | erklärt | `implementation_plan.md:21` hält fest, dass das fallow-Gate den Umbau erzwungen hat. Das Delta ändert an den Filtern nichts mehr. |
| C-14, C-15 | offen (Minor) | Keine Änderung. Sie bleiben Minor aus Runde 2. |
| C-16 | behoben | `screens.ts:38`: `'marked-sent'` ist aus der Liste gestrichen. Der Pfad enthält `{remindedLetter}` (`screens.json:443`), `path.includes('{')` greift also weiter. |
| C-17 | behoben | `MarkedSentNotice.svelte:17-23`: Der Knopf steht jetzt im `action`-Snippet von `Alert` (`Alert.svelte:33`). |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-18 | Minor | `src/routes/documents/+page.svelte:86-87`, `tests/e2e/steps/documents.steps.ts:143-150` | Helga P-1 (leerer Zustand unter «Zu versenden» neben dem Hinweis ausgeblendet) prüft nur der DOM-Test `documents.dom.test.ts:115-122`. Rot gesehen: Vorher zeigte der `{:else}`-Zweig `documents-empty` bei einer leeren Liste immer. Kein Szenario prüft die Abwesenheit. Ich werte es nicht als Major, weil Hinweis und leerer Zustand nebeneinander nie auf `main` waren. Beides entsteht erst in diesem Slice, und P-1 schärft nur den Zustand, den C-11 jetzt abdeckt. Mit einer Zeile im neuen Schritt liesse sich das zeigen, etwa eine Prüfung, dass `documents-empty` 0-mal vorkommt (über eine Question, nicht über den Locator). Das gilt aber nur, wenn die Liste im Szenario danach wirklich leer ist. Ob noch der Brief der Abrechnung selbst unter «Zu versenden» steht, habe ich nicht geprüft. |
| C-19 | Nit | `tests/e2e/steps/documents.steps.ts:148` | «zum Ausdrucken an» prüft nur, dass genau ein Druckangebot da ist, nicht, welches PDF es liefert (das neu erstellte des Briefs). Den `href` prüft der DOM-Test (`documents.dom.test.ts:111`). Die Bausteine für einen stärkeren Check gibt es in `questions/download.ts` (`downloadedPdfText`). Für den Major genügt der Schritt. |
| C-20 | Nit | `tests/e2e/features/documents.feature:27` | «bietet die Seite … an» spricht über die Oberfläche. Es kommt so schon vor (`settings.feature:18`), ist aber schwächer als «bietet Dwello … an» (`invoices.feature:151`). |

ponytail-review: Das Delta ist knapp. Die Prop `sent?` und die immer gerenderte Live-Region braucht es für C-12. Die Bedingung `{:else if !form?.sent}` ist die kürzeste Lösung für P-1. Kürzen lässt sich nichts. net: 0.

## Blocker/Major

Keine.

## Nicht bestätigt

- **Vom Aufrufer gemeldet**, nicht wiederholt, alle auf `9d49d61`: `bun run lint` (grün), fallow audit (grün), `bunx vitest run src/__tests__/documents.dom.test.ts src/__tests__/documents.test.ts` (grün). Im Worktree fehlt `node_modules`. In Runde 2 hat die Sandbox den Zugriff auf `/home/user/Dwello/node_modules` gesperrt, deshalb habe ich es nicht noch einmal versucht.
- Laut Aufrufer ist das E2E für den neuen Schritt noch nicht gelaufen, auch nicht `accessibility`/`sprachen-bildschirme` für `marked-sent` mit der neuen Live-Region und dem `action`-Snippet. Laut Code sollte der Schritt halten. Er vergleicht den Text mit `messages/de.json:890` («…» an {name} ist als versendet markiert.»), und `Text.of` normalisiert Leerraum. Gesehen habe ich das nicht.
- `bun run check` und `cd backend && bun run type-check` auf `9d49d61` meldet der Aufrufer nicht. Die Prop `sent` ist jetzt optional (`MarkedSentNotice.svelte:7`), das passt zu `form?.sent`. Geprüft habe ich das nur durch Lesen.
- Helga P-2 (Hinweis nach dem Neuladen weg, leerer Zustand ohne Verweis auf «Alle») ist nicht behoben und steht weder im Plan noch als Issue oder Zeile in `offene-punkte.md`. Im Persona-Bericht ist es ein Minor, nach «Done means» bleibt es dort. Hier nur zur Kenntnis.
- Ob unter «Zu versenden» im Szenario nach dem Markieren noch ein anderer Brief steht (siehe C-18): Den Seed-Schritt «die Abrechnung 2024 von … ist versendet» habe ich nicht nachgelesen.
