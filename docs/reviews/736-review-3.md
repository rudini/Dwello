# Code-Review 736, Runde 3 (Abschlussrunde vor dem Push)

Bereich: `git diff feaa9a47b 4894745cc` ohne Reviews, Plan, Archiv und Personas (Worktree `review-736-code3`)

Geschlossen: C-2, C-5

Keine offenen und keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `tests/unit/a11y-screens.test.ts` und `tests/unit/i18n-screens.test.ts` (5 bestanden), lint 0, svelte-check 0, E2E chromium mit den axe- und Sprachzeilen `undelivered|statement-sent-detail` und den Szenarien von statement-reminder zu Mahnung, Zahlungserinnerung und Mahnbrief (45 bestanden), axe- und Sprachzeilen von dashboard, statements, tenants, documents, contracts und statement-generate (114 bestanden). Ich habe keine Tests ausgeführt.
- Ob Hugos Vertrag ab 2014 (gilt jetzt in jedem Beispiel, `tests/e2e/fixtures/screens.ts:197`) andere Zeilen ausser den gemeldeten verändert, etwa über fehlende Abrechnungen 2014–2022 von Felsweg: Ich habe nur `generation-result` gelesen (`tests/e2e/tasks/accessibility.ts:696-710`). Es rechnet nur `example.building` ab und ist in den gemeldeten Läufen von statement-generate enthalten. Die übrigen Bildschirme habe ich nicht abgesucht.
- Ob die Rückmeldung nach dem nativen POST `?/remind` (ohne `use:enhance`) dieselbe Variante mit DeliveryFailure zeigt wie nach dem Dialog: nur durch Lesen geprüft (`ReminderFeedback.svelte:22-31`, `+page.server.ts:112-115`). Der Aufrufer meldet, dass der Zustand in allen Blicken grün ist.

Geprüft: Das Seed für `reminder-undelivered` gilt nur im Beispiel dieses Zustands. Der Zähler gibt pro Seed höchstens neun verschiedene Abrechnungen. Ein Retry startet einen neuen Worker mit eigenem Seed. Die Bedeutung des Zustands und die Zeilen in screens.json und in beiden Features stimmen überein. Das neue Szenario zu C-5 nutzt nur bestehende Steps. `sendReminder` wartet auf die Rückmeldung, danach zählt `reminderOffers` die Mahnknöpfe. Auf dem Basis-Commit schlägt das Szenario fehl. Dass es keinen eigenen Rot-Lauf hat, deckt CLAUDE.md, Workflow 2 (der DOM-Test wurde rot gesehen). Nichts im Delta gehört nicht zur Anforderung.
